#!/usr/bin/env node
/*
 * check.js — load every portfolio link from the running localhost:8000 server and
 * detect pages that would render BLANK: empty SPA shells (root div + module script
 * with no static build) and pages whose JS/CSS assets 404. Read-only diagnosis.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const BASE = 'http://127.0.0.1:8000';
const sites = JSON.parse(fs.readFileSync(path.join(HERE, 'sites.json'), 'utf8'));

const links = [];
for (const s of sites) {
  links.push({ name: s.n, url: s.href, kind: 'primary' });
  for (const [lab, href] of (s.extras || [])) {
    if (href.startsWith('http')) continue;            // external (e.g. :8787) — skip
    links.push({ name: `${s.n} › ${lab}`, url: href, kind: 'extra' });
  }
}

async function status(url) {
  try { const r = await fetch(BASE + url, { redirect: 'manual' }); return r.status; }
  catch { return 0; }
}

function assetUrls(html, pageUrl) {
  const dir = pageUrl.replace(/[^/]*$/, '');           // page's directory
  const abs = (u) => {
    if (/^https?:|^data:|^\/\//.test(u)) return null;  // external
    if (u.startsWith('/')) return u;                   // root-absolute
    return path.posix.normalize(dir + u);              // relative to page
  };
  const out = new Set();
  const push = (u) => { const a = abs(u); if (a) out.add(a); };
  for (const m of html.matchAll(/<script[^>]+src=["']([^"']+)["']/gi)) push(m[1]);
  for (const m of html.matchAll(/<link[^>]+href=["']([^"']+)["'][^>]*>/gi)) {
    if (/rel=["']?stylesheet/i.test(m[0]) || /\.css(\?|$)/i.test(m[1])) push(m[1]);
  }
  return [...out];
}

function isShell(html) {
  const body = (html.match(/<body[\s\S]*<\/body>/i) || [''])[0];
  const text = body
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ').trim();
  const rootDiv = /<div[^>]+id=["'](root|app)["'][^>]*>\s*<\/div>/i.test(html);
  const moduleScript = /<script[^>]+type=["']module["']/i.test(html) || /<script[^>]+src=["'][^"']*\/(src|@vite)\//i.test(html);
  return { textLen: text.length, rootDiv, moduleScript };
}

const results = [];
for (const link of links) {
  const code = await status(link.url);
  let verdict = 'OK', detail = '';
  if (code !== 200) { verdict = 'HTTP_' + code; }
  else {
    const html = await (await fetch(BASE + link.url)).text();
    const sh = isShell(html);
    const assets = assetUrls(html, link.url);
    const broken = [];
    for (const a of assets) { if ((await status(a)) !== 200) broken.push(a); }
    if (sh.textLen < 30 && (sh.rootDiv || sh.moduleScript) && broken.length) {
      verdict = 'BLANK_SHELL'; detail = `no static build · ${broken.length} asset(s) 404`;
    } else if (broken.length) {
      verdict = 'BROKEN_ASSETS'; detail = broken.slice(0, 4).join(', ');
    } else if (sh.textLen < 30 && (sh.rootDiv || sh.moduleScript)) {
      verdict = 'EMPTY_BODY'; detail = `body text ${sh.textLen} chars (likely JS-rendered)`;
    }
  }
  results.push({ ...link, code, verdict, detail });
}

// EMPTY_BODY = JS-rendered (React/canvas); assets load fine, just no static text. Not broken — verify live.
const info = results.filter(r => r.verdict === 'EMPTY_BODY');
const bad = results.filter(r => r.verdict !== 'OK' && r.verdict !== 'EMPTY_BODY');
console.log(`Checked ${results.length} links — ${bad.length} BROKEN, ${info.length} JS-rendered (verify live):\n`);
for (const r of bad) console.log(`  [${r.verdict}] ${r.name}\n      ${BASE}${r.url}\n      ${r.detail}`);
if (info.length) {
  console.log('\nJS-rendered (static checker can\'t see content — confirm in a browser):');
  for (const r of info) console.log(`  • ${r.name} — ${BASE}${r.url}`);
}
console.log(`\nStatic-OK: ${results.filter(r => r.verdict === 'OK').length}/${results.length} · broken: ${bad.length}`);
