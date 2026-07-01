#!/usr/bin/env node
/*
 * scan.js — discover website pages across ~/Documents and diff them against the
 * portfolio catalog (sites.json). Prints any pages NOT already in the portfolio.
 *
 * Usage:  node scan.js            # human-readable report
 *         node scan.js --json     # machine-readable JSON for the skill
 *
 * It never writes anything. The Update_MyWebsitePortfolio skill consumes its
 * output, classifies the new sites, and (on your confirm) appends them.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
// Documents root = two levels up from All_Site/MyWebsitePortfolio
const DOCS = process.env.DOCS || path.resolve(HERE, '..', '..');

// Directories never worth scanning (deps, build output, caches, throwaway).
const SKIP_DIRS = new Set([
  'node_modules', '.git', '.next', 'dist', 'build', '.cache',
  '.playwright-mcp', 'useless', 'MyWebsitePortfolio'
]);
// File patterns that are not standalone, user-facing pages.
const SKIP_FILE = (name) =>
  /\.bak\.html$/i.test(name) ||
  /backup\.html$/i.test(name) ||     // *_backup.html
  /^_prev-/i.test(name) ||
  /\.pre-uiux\./i.test(name) ||
  name === 'icons.html' ||
  name === 'raw.html' ||
  name === 'embed.html' ||
  name === 'page.html' ||
  name === 'layout.html';            // raw template scaffolds
const SKIP_PATH = (rel) =>
  rel === '/index.html' ||           // the localhost:8000 root redirect stub
  rel.includes('any-link-runs') ||   // scraped link dumps
  rel.includes('/temp_ig/');

function walk(dir, out) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); }
  catch { return; }
  for (const e of entries) {
    if (e.name.startsWith('.') && e.name !== '.planning') {
      if (e.isDirectory() && e.name !== '.planning') continue;
    }
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (SKIP_DIRS.has(e.name)) continue;
      walk(full, out);
    } else if (e.isFile() && /\.html?$/i.test(e.name)) {
      out.push(full);
    }
  }
}

function titleOf(file) {
  try {
    const html = fs.readFileSync(file, 'utf8').replace(/\n/g, ' ');
    const m = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    return m ? m[1].trim().replace(/\s+/g, ' ') : '';
  } catch { return ''; }
}

// URL a page is reachable at on the localhost:8000 server (rooted at Documents).
function toUrl(rel) {
  return '/' + rel.split('/').map(encodeURIComponent).join('/');
}
// Normalise an href for comparison (decode, drop trailing index.html, lowercase).
function norm(href) {
  let h = href.split('#')[0].split('?')[0];
  try { h = decodeURIComponent(h); } catch {}
  h = h.replace(/\/index\.html?$/i, '/').replace(/\/+$/,'/');
  return h.toLowerCase();
}

function loadKnown() {
  const sites = JSON.parse(fs.readFileSync(path.join(HERE, 'sites.json'), 'utf8'));
  const known = new Set();
  for (const s of sites) {
    if (s.href) known.add(norm(s.href));
    for (const [, href] of (s.extras || [])) known.add(norm(href));
  }
  return { sites, known };
}

function main() {
  const asJson = process.argv.includes('--json');
  const { sites, known } = loadKnown();

  const files = [];
  walk(DOCS, files);

  const candidates = [];
  for (const f of files) {
    const rel = path.relative(DOCS, f).split(path.sep).join('/');
    if (SKIP_FILE(path.basename(f)) || SKIP_PATH('/' + rel)) continue;
    const url = toUrl(rel);
    if (known.has(norm(url))) continue;          // already in portfolio (primary or sub-page)
    candidates.push({ url, rel, title: titleOf(f) || '(no title)' });
  }

  // Group new candidates by their top-of-project folder so multi-page sites read as one.
  const groups = {};
  for (const c of candidates) {
    const parts = c.rel.split('/');
    // project root = first 1-2 segments that look like a project dir
    const key = parts.slice(0, Math.min(2, parts.length - 1)).join('/') || parts[0];
    (groups[key] ||= []).push(c);
  }

  const out = {
    docsRoot: DOCS,
    totalKnown: sites.length,
    newPageCount: candidates.length,
    newGroups: Object.entries(groups).map(([folder, pages]) => ({ folder, pages }))
  };

  if (asJson) { process.stdout.write(JSON.stringify(out, null, 2) + '\n'); return; }

  console.log(`Documents root : ${DOCS}`);
  console.log(`In portfolio   : ${sites.length} sites`);
  console.log(`New pages found: ${candidates.length}`);
  if (!candidates.length) { console.log('\n✅ Nothing new — portfolio is up to date.'); return; }
  console.log('\nNew (not yet in the portfolio), grouped by folder:\n');
  for (const { folder, pages } of out.newGroups) {
    console.log(`▸ ${folder}/`);
    for (const p of pages) console.log(`    ${p.title}\n      → http://localhost:8000${p.url}`);
  }
  console.log('\nRun the /Update_MyWebsitePortfolio skill to classify and add these (with your confirmation).');
}

main();
