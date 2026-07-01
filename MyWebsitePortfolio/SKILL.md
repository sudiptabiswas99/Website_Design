---
name: Update_MyWebsitePortfolio
description: >-
  Refresh the user's website portfolio showcase. Scans ~/Documents for any website
  not yet in the portfolio (and cross-checks memory), classifies each into the right
  showcase category (creating a new category if none fits), previews the additions for
  confirmation, then regenerates the gallery (index.html) + README.md. Triggers on
  "update my website portfolio", "/Update_MyWebsitePortfolio", "add my new sites to the
  showcase", "rescan my websites", "refresh my portfolio".
---

# Update_MyWebsitePortfolio

Keeps the portfolio showcase at **http://localhost:8000/** in sync with what's actually on disk.

## Key locations
- **Portfolio folder:** `/Users/sudiptabiswash/Documents/All_Site/MyWebsitePortfolio/`
  - `sites.json` — the catalog (single source of truth). `categories.json` — category defs.
  - `scan.js` — finds sites not yet listed. `build.js` — regenerates `index.html` + `README.md`.
  - `gallery.template.html` — the gallery template (data injected by build.js).
- **Server root:** `~/Documents`, on port **8000**. It MUST stay rooted at Documents (the websites live in many top-level folders; the server can't serve above its root). The gallery uses absolute links, so it works from the subfolder.
- **Website files are never moved.** Only the portfolio files live in `MyWebsitePortfolio/`.

## Hard rules
1. **Never hand-edit `index.html` or `README.md`** — they are generated. Edit `sites.json` / `categories.json`, then run `node build.js`.
2. **Never move or rename a website** — only read them.
3. **Preview before writing.** Always show the user the proposed additions and get a yes before touching `sites.json`.

## Procedure

### 0 — Ensure the server is up
```bash
curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8000/ || true
# if not 200, start it:
cd /Users/sudiptabiswash/Documents && nohup python3 -m http.server 8000 --bind 127.0.0.1 >/tmp/docs-server.log 2>&1 &
```

### 1 — Scan for new sites
```bash
cd /Users/sudiptabiswash/Documents/All_Site/MyWebsitePortfolio && node scan.js --json
```
This prints `{ newGroups: [{ folder, pages:[{url,rel,title}] }], ... }` — pages on disk not already in `sites.json` (primary hrefs AND extras are matched, so sub-pages of listed sites don't re-appear). If `newPageCount` is 0, tell the user the portfolio is already up to date and stop.

### 2 — Cross-check memory (the "Both" source)
Also read, and use to enrich/classify or to catch sites that exist only as a note:
- `/Users/sudiptabiswash/.claude/projects/-Users-sudiptabiswash-Documents-All-Site/memory/MEMORY.md` and its linked files.
- Any project `MEMORY.md`. If memory references a site that scan didn't surface, flag it.

### 3 — Classify each new site
For each new group (a group = one folder = usually one site; its `index.html` is the primary, other pages become `extras`):
- Open/read the page(s) to understand what it is (title, headings, sections).
- **Match to an existing category** in `categories.json` by meaning (plumbing→`plumb`, med spa/aesthetics→`spa`, store→`shop`, dashboard/CRM→`crm`, shader/hero/motion demo→`bgfx`, portfolio/library/tool→`show`).
- **If nothing fits, propose a NEW category**: pick a `key` (short slug), `name`, `chip` (short label), an `emoji`, and a `color` (a hex not already used — e.g. `#e0795b`, `#6ea8e0`, `#c0a35e`, `#8fd07a`).
- Draft the entry: `n` (brand name), `t` (one-line type), a compact `flow` chart using `→` (read the page's real sections), optional `badge` (`react` if it's a Vite/React shell needing `npm run dev`, `sketch`, `wip`, `api`), and `extras` for sub-pages.
- Note: experiments/variants that are clearly already represented (e.g. theme variants of a listed page) — ask the user whether to add them separately or skip.

### 3b — React/Vite (SPA) sites — avoid blank pages
A Vite app's source `index.html` loads `/src/main.jsx` and won't render statically; its default `dist/` build uses absolute `/assets/` paths that 404 under the Documents-root server. So for any folder with `vite` in its build:
- Build with a **relative base**: `cd <folder> && node_modules/.bin/vite build --base=./`
- Point the showcase `href` at `<folder>/dist/index.html` (not the source).
- If the app uses a router (`BrowserRouter`/`createBrowserRouter` from react-router), it renders React Router's "404 Not Found" at a subpath. Switch it to the **hash** variant (`HashRouter` / `createHashRouter`) in `src/App.jsx` and rebuild — hash routing works from any static path.
- Verify with `node check.js` (catches 404 assets) AND a real browser (SPA content is JS-rendered, so `check.js` reports it as "JS-rendered (verify live)", not broken).

### 4 — Preview, then confirm
Show a compact table: **# · proposed name · proposed category (mark NEW categories) · primary link**. Ask the user to confirm or adjust. Do not write anything yet.

### 5 — Apply (only after confirmation)
- If a new category was approved, append it to `categories.json` (in the order it should appear).
- Append the new site object(s) to `sites.json` (place each within its category's run so the gallery groups them). Keep JSON valid.
- Rebuild:
```bash
cd /Users/sudiptabiswash/Documents/All_Site/MyWebsitePortfolio && node build.js
```

### 6 — Verify & report
```bash
curl -s -o /dev/null -w "gallery %{http_code}\n" http://127.0.0.1:8000/All_Site/MyWebsitePortfolio/index.html
# spot-check each newly added href returns 200
```
Report the new total, which categories changed, any new category created, and the links. Append a one-line entry to the brain learnings log.

## sites.json entry shape
```json
{
  "c": "plumb",
  "n": "Brand Name",
  "t": "short one-line type",
  "href": "/path/from/Documents/root/index.html",
  "flow": "Hero → Services → … → Footer",
  "badge": ["react"],
  "extras": [["Sub-page label", "/path/to/subpage.html"]]
}
```
`badge` and `extras` are optional. Links are absolute from the Documents server root; URL-encode spaces as `%20`.

## categories.json entry shape
```json
{ "key": "plumb", "name": "Plumbing & home-services", "chip": "Plumbing", "emoji": "🔧", "color": "#1a9fcf" }
```
