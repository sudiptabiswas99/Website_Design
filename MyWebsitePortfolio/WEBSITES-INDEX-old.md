# All_Site — Websites Index & Localhost Links

Complete inventory of every web page in `/Users/sudiptabiswash/Documents/All_Site`, with a working localhost link for each.

> **Honesty note:** my saved memory only documents **one** of these (the `hargrove-plumbing` design system). The rest of this list was built by scanning the `All_Site` folder live — not from memory. Counts below exclude `node_modules/`, `.playwright-mcp/`, and `.git/`.

---

## The count

| What | Number |
|---|---|
| Distinct websites | **12** |
| Project folders | **9** (one folder, `beautiful-websites-kit`, holds 3 sites) |
| Hand-authored HTML pages | **23** |
| Next.js app (no `.html` source) | **1** (`background-paths-app`) |
| Total `.html` files on disk | 32 *(incl. 5 Next build artifacts, 2 `dist/` rebuilds, 2 backups — not counted above)* |

---

## How to view them all

One static server is already running, rooted at this folder:

```bash
# already running — serves everything in All_Site:
python3 -m http.server 8000 --bind 127.0.0.1
#   → http://localhost:8000/<project>/index.html
# stop it with:  lsof -ti:8000 | xargs kill
```

Two projects also have their **own** server:
- **hargrove-plumbing** — full backend (booking API + A/B test) on **http://localhost:8787** *(currently running)*. Use this one if you want the booking form to actually work.
- **background-paths-app** — Next.js, run it separately: `cd background-paths-app && npm run dev` → **http://localhost:3000**

All `:8000` links below were verified returning **HTTP 200**.

---

## 🔧 Plumbing websites (the main work)

### 1. Hargrove & Sons Plumbing — Sacramento *(the flagship, 13 pages)*
Vanilla static site + Express backend. Best viewed on its own server at **http://localhost:8787**.

**Production pages (9):**
- Home — http://localhost:8000/hargrove-plumbing/index.html
- Services — http://localhost:8000/hargrove-plumbing/services.html
- Service areas (hub) — http://localhost:8000/hargrove-plumbing/areas/index.html
- Sacramento — http://localhost:8000/hargrove-plumbing/areas/sacramento.html
- Folsom — http://localhost:8000/hargrove-plumbing/areas/folsom.html
- Roseville — http://localhost:8000/hargrove-plumbing/areas/roseville.html
- Elk Grove — http://localhost:8000/hargrove-plumbing/areas/elk-grove.html
- Davis — http://localhost:8000/hargrove-plumbing/areas/davis.html
- Citrus Heights — http://localhost:8000/hargrove-plumbing/areas/citrus-heights.html

**Dark-hero experiments (4, work-in-progress):**
- Dark 1 — http://localhost:8000/hargrove-plumbing/dark-1.html
- Dark 2 — http://localhost:8000/hargrove-plumbing/dark-2.html
- Dark 3 — http://localhost:8000/hargrove-plumbing/dark-3.html
- Dark themes compare — http://localhost:8000/hargrove-plumbing/dark-themes.html

### 2. BlueLine Plumbing Co. — Austin, TX
- http://localhost:8000/blueline-plumbing/index.html

### 3. IRONHAND Plumbing Co. — Denver
- http://localhost:8000/ironhand-plumbing/index.html

### 4. Interactive 3D House — Plumbing System
- http://localhost:8000/house-plumbing-3d/index.html

---

## 🎨 Background / hero / interactive experiments

### 5. Woven by Light — Interactive 3D House
- Source — http://localhost:8000/woven-house-hero/index.html
- Built (`dist/`) — http://localhost:8000/woven-house-hero/dist/index.html

### 6. Woven Light — Interactive Background
- Source — http://localhost:8000/woven-light-bg/index.html
- Built (`dist/`) — http://localhost:8000/woven-light-bg/dist/index.html

### 7. Dotted Surface — Background Preview
- http://localhost:8000/dotted-surface-bg/index.html

### 8. Background Paths — Next.js app
- Run it: `cd background-paths-app && npm run dev` → http://localhost:3000
- *(The `.next/server/*.html` files are framework build artifacts, not pages you authored.)*

---

## 🌸 Brand / product

### 9. Bloom — "Innovating the spirit of bloom AI"
- Live — http://localhost:8000/bloom/index.html
- Backup (glass v1) — http://localhost:8000/bloom/bloom_glass_backup.html
- Backup (glass v2) — http://localhost:8000/bloom/bloom_glass_v2_backup.html

---

## 📚 beautiful-websites-kit — recreations / redesigns (3 sites)

### 10. Benjamin Franklin Plumbing — "The Punctual Plumber"
- http://localhost:8000/beautiful-websites-kit/sites/benjamin-franklin-plumbing/index.html

### 11. Michael & Son — Complete Home Care (VA · MD · NC · DC)
- http://localhost:8000/beautiful-websites-kit/sites/michael-and-son/index.html

### 12. Plumbline Services — Denver, since 1998
- http://localhost:8000/beautiful-websites-kit/sites/plumbline-services/index.html

---

## Not counted as "pages you made"

These exist on disk but are auto-generated or duplicates:
- `background-paths-app/.next/server/` — 5 Next.js build artifacts (`index.html`, `404.html`, `500.html`, `_not-found.html`, `_global-error.html`)
- `woven-house-hero/dist/index.html`, `woven-light-bg/dist/index.html` — built copies of the source pages (listed above under their projects)
- `bloom/bloom_glass_backup.html`, `bloom/bloom_glass_v2_backup.html` — backups (listed under Bloom)
