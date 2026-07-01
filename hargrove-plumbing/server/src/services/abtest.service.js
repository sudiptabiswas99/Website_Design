// Business logic for the experiment. Knows nothing about HTTP (no req/res).
// Owns variant assignment, the page transform, and turning raw events into a report.
import { randomUUID } from 'node:crypto';
import { experiment, variantKeys } from '../config/abtest.config.js';
import * as repo from '../repositories/abtest.repository.js';
import { twoProportionZTest } from '../utils/stats.js';

const isValidVariant = (v) => variantKeys.includes(v);

// Weighted-random pick across the configured variants.
function pickVariant() {
  const total = variantKeys.reduce((s, k) => s + (experiment.variants[k].weight || 1), 0);
  let r = Math.random() * total;
  for (const k of variantKeys) {
    r -= experiment.variants[k].weight || 1;
    if (r <= 0) return k;
  }
  return variantKeys[0];
}

// Resolve a visitor's sticky identity + variant, minting new ones when absent.
export function assign({ visitorId, variant } = {}) {
  const fresh = !visitorId || !isValidVariant(variant);
  return {
    visitorId: visitorId || randomUUID(),
    variant: isValidVariant(variant) ? variant : pickVariant(),
    fresh,
  };
}

export const recordExposure = (visitorId, variant) => repo.recordExposure(visitorId, variant);
export const recordConversion = (visitorId, variant) => repo.recordConversion(visitorId, variant);

// Apply the variant's content edits to the page HTML + inject a verifiable marker.
export function applyVariant(html, variant) {
  const def = experiment.variants[variant] || experiment.variants[variantKeys[0]];
  let out = html;
  for (const { find, with: repl } of def.replace) out = out.split(find).join(repl);

  const marker =
    `<script>window.__AB={exp:${JSON.stringify(experiment.id)},variant:${JSON.stringify(variant)}};` +
    `document.documentElement.setAttribute('data-ab',${JSON.stringify(variant)});</script>`;
  return out.includes('</head>') ? out.replace('</head>', `${marker}</head>`) : marker + out;
}

// Aggregate raw events into a decision-ready report (table + significance + verdict).
export function getReport() {
  const tally = {};
  for (const k of variantKeys) {
    tally[k] = { variant: k, label: experiment.variants[k].label, views: 0, conversions: 0 };
  }
  for (const rec of repo.allVisitors()) {
    const t = tally[rec.variant];
    if (!t) continue;
    t.views += 1;
    if (rec.converted) t.conversions += 1;
  }

  const rows = variantKeys.map((k) => ({ ...tally[k], rate: tally[k].views ? tally[k].conversions / tally[k].views : 0 }));

  // Significance is computed for the canonical A-vs-B pair; extra variants still tabulate.
  const A = tally.A;
  const B = tally.B;
  let z = null;
  let p = null;
  let lift = null;
  let verdict = { state: 'collecting', message: 'Collecting data — not enough traffic yet.' };

  if (A && B) {
    ({ z, p } = twoProportionZTest(A.conversions, A.views, B.conversions, B.views));
    const rA = A.views ? A.conversions / A.views : 0;
    const rB = B.views ? B.conversions / B.views : 0;
    lift = rA ? (rB - rA) / rA : null;

    const enoughData = A.views >= 30 && B.views >= 30 && A.conversions + B.conversions >= 10;
    if (!enoughData) {
      verdict = { state: 'collecting', message: 'Collecting data — keep running (need ≥30 views per variant and some conversions).' };
    } else if (p != null && p < 0.05) {
      const winner = rB >= rA ? 'B' : 'A';
      verdict = { state: 'significant', winner, message: `Variant ${winner} wins — statistically significant (p=${p.toFixed(3)}).` };
    } else {
      verdict = { state: 'inconclusive', message: `No significant difference yet (p=${p == null ? '—' : p.toFixed(3)}). Keep running.` };
    }
  }

  return {
    experimentId: experiment.id,
    goal: experiment.goal,
    rows,
    stats: { z, p, lift },
    verdict,
    totals: {
      views: rows.reduce((s, r) => s + r.views, 0),
      conversions: rows.reduce((s, r) => s + r.conversions, 0),
    },
  };
}
