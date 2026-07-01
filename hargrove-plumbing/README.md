# Hargrove & Sons Plumbing — Website

A premium, **human-designed** (deliberately not "AI-template-looking") marketing site for a fictional 34-year family-owned Sacramento plumber. Built as **vanilla HTML/CSS/JS, fully static**, served by a layered Node/Express backend that handles booking leads and a hero-CTA A/B test.

> **Why this README exists:** it documents *how* the site was built — the research, the design decisions and the reasons behind them, the architecture, and how to run it. The brand, copy, reviews, phone number, and license number are **demo data**.

---

## The brand

| | |
|---|---|
| Name | Hargrove & Sons Plumbing, Inc. |
| Location | Sacramento, CA (+ 6 surrounding service areas) |
| Since | 1992 (34 years) |
| Phone | (562) 431-1960 *(demo)* |
| License | C-36 #784512 *(demo)* |
| Rating | 4.9 ★ · 2,184 reviews *(demo)* |

The single source of truth for all of this is [`build/data.js`](build/data.js).

---

## Tech stack

- **Frontend:** hand-written HTML + CSS + vanilla JS. **No React, no shadcn, no Tailwind, no TypeScript, no build step for the markup** beyond a small in-house generator.
- **Static-site generator:** plain Node scripts in [`build/`](build/) that stamp shared partials into pages.
- **Backend:** Node ≥18, **Express 4**, **Zod** validation, **Nodemailer** for lead email, **express-rate-limit**. ES modules. Layered architecture: `routes → controllers → services → validators`.
- **Free engines only:** the hero video was generated with **Nano Banana (Gemini CLI)** and looped with **ffmpeg** — no paid APIs, no fragile external CDNs.

---

## Quick start

```bash
cd server
npm install            # express, zod, nodemailer, cors, dotenv, express-rate-limit
cp .env.example .env   # set PORT (default 8787), SMTP creds, CORS origin
npm start              # or: npm run dev   (node --watch)
```

The Express server serves the static site **and** the API same-origin, so the booking form POSTs to `/api/book` with no CORS dance. Open **http://localhost:8787**.

Regenerate the interior pages after editing data or partials:

```bash
node build/generate.js
```

Smoke-test the backend:

```bash
cd server && npm run smoketest
```

---

## Project structure

```
hargrove-plumbing/
├── index.html              # Homepage (hero video, services, story+stats, reviews, booking, chatbot)
├── services.html           # Services overview
├── areas/                  # Dedicated page PER service area (local-SEO #1 factor)
│   ├── index.html
│   ├── sacramento.html  folsom.html  roseville.html
│   ├── elk-grove.html  davis.html  citrus-heights.html
│
├── css/
│   ├── styles.css          # Design tokens (:root), hero, sections, chatbot
│   └── pages.css           # Interior-page styles
│
├── js/                     # 14 vanilla modules, progressively enhanced
│   ├── main.js             # nav, scroll, stat count-up
│   ├── shader-bg.js        # WebGL2 fragment-shader hero backgrounds (graceful fallback)
│   ├── area-gallery.js     # service-area carousel (Embla "Gallery4" ported to vanilla)
│   ├── booking-paths.js    # animated SVG "Background Paths" behind the booking section
│   ├── chatbot.js          # rule-based assistant UI (multimodal input ported from shadcn)
│   ├── chatbot-kb.js       # auto-generated knowledge base (window.HARGROVE_KB)
│   ├── financing-tabs.js  reviews-stagger.js  services-carousel.js
│   ├── fan-carousel.js  gridbg.js  footer-reveal.js  footer-meteors.js  hours.js
│
├── build/                  # Static-site generator
│   ├── data.js             # BIZ, SERVICES, AREAS  ← single source of truth
│   ├── partials.js         # head / header / footer / bookingForm
│   └── generate.js         # node build/generate.js  → emits services.html + areas/*.html
│
├── assets/                 # hero.mp4 (Nano Banana→ffmpeg), posters, svc/ area/ fan/ avatars/ fonts/
│
├── server/                 # Layered Express backend (see server/README.md)
│   └── src/
│       ├── app.js  index.js
│       ├── routes/         # booking.routes.js, abtest.routes.js, index.js
│       ├── controllers/    # booking.controller.js, abtest.controller.js
│       ├── services/       # booking.service.js, mailer.service.js, abtest.service.js
│       ├── repositories/   # abtest.repository.js
│       ├── validators/     # booking.schema.js (Zod)
│       ├── middleware/     # validate, rateLimit, errorHandler, abtest.middleware
│       ├── config/         # env.js, paths.js, abtest.config.js
│       └── utils/          # logger, cookies, stats
│
├── dark-1/2/3.html, dark-themes.html, dark-*.css   # IN-PROGRESS dark-hero theme experiments
├── RESEARCH.md             # Verified research playbook (provenance below)
└── README.md               # this file
```

---

## Design system

Defined as CSS custom properties in [`css/styles.css`](css/styles.css) `:root`.

**Typography**
- **Display:** `Fraunces` (heritage serif, weights 400–700, with italic accents) — loaded from Google Fonts.
- **Body:** `Satoshi` — loaded from Fontshare.
- **Technical/mono:** `Spline Sans Mono` — for stamped labels.

> Fonts were chosen *against* the "AI-default" set (Inter, Poppins, Montserrat, Lato, Open Sans, Roboto). Research validated Fraunces + a Söhne-class grotesque (Satoshi) as a premium, free, deliberately-chosen pairing. *(Note: a stale HTML comment in `index.html` still references the earlier Bricolage/Public Sans pairing — the actual loaded + tokenized fonts are Fraunces + Satoshi + Spline Sans Mono.)*

**Color**

| Token | Value | Use |
|---|---|---|
| `--cta` / `--copper` | `#0e7ea8` | Ocean blue — primary brand + buttons |
| `--copper-d` | `#0a6385` | Deep blue — footer, stats band |
| `--copper-l` | `#1a8fb5` | Light blue accent |
| `--brass` | `#c99a52` | **Reserved for star ratings / rating signals only** |
| `--ink` | `#15110d` | Near-black text |
| `--paper` | `#f4eee2` | Warm off-white surfaces |

White-on-blue buttons pass WCAG AA (≈4.6:1).

> The palette was re-themed from an original copper/safety-orange "industrial heritage" look to **ocean blue**, with **brass gold deliberately kept only for star ratings** so gold always reads as "rating."

---

## How it was built (the process)

**Phase 0 — Competitive research.** Drove Playwright to capture live screenshots of the best-designed plumbing sites. Half the "best plumbing website" blog lists had rotted (dead DNS, expired SSL, acquired/redirected). Five survived teardown — Tony LaMartina (visual restraint), O'Neill (owner-photo heritage trust), Roto-Rooter (ZIP-locator conversion), Penguin (local-conversion stack), NY Plumbing (a what-not-to-do). Synthesized formula: **Penguin's conversion layout + LaMartina's restraint + O'Neill's owner-photo trust.**

**Phase 0.5 — Verified research playbook.** A multi-agent deep-research pass (6 angles, 26 sources, 127 claims) with **3-vote adversarial verification: 11 confirmed / 14 killed** → [`RESEARCH.md`](RESEARCH.md). Hard rules that came out of it:
- A **dedicated page per service area** (the #1 local-SEO ranking factor).
- Keep only **relevant** form fields; don't blindly strip them.
- **Layered trust:** license # up top, real photos (not stock), live-style reviews, warranty language.
- A list of plausible-but-false "stats" that were **forbidden** from the site because they failed verification.

**Phase 1 — Direction + hero asset.** Locked the brand and an anti-AI aesthetic. For the requested background-video hero, generated a cinematic plumbing image with **Nano Banana (Gemini CLI, free)** and looped it with **ffmpeg** into a local `assets/hero.mp4` — no fragile external CDN.

**Phase 2 — Generator + pages.** Built the `build/` generator so all pages share one source of truth; emitted the services and per-area pages.

**Phase 3 — Section work (the bulk).** WebGL2 shader hero backgrounds with graceful fallback; service-area carousel (shadcn Embla "Gallery4" **ported to vanilla**); liquid-glass booking form with an animated SVG "Background Paths" layer **behind the section** (per feedback, not inside the card); stats strip with count-up animation; real plumber-action photography; demo reviews.

**Phase 4 — Chatbot.** A **rule-based, no-AI** assistant: site info + financing steps + photo *handling* + booking. A shadcn `multimodal-ai-chat-input.tsx` design was **ported to vanilla** (auto-grow textarea, attach, send, suggestion cards) rather than installing React. Grounded in an auto-generated KB (`window.HARGROVE_KB`); intents via keyword regex; booking via a small state machine that POSTs to `/api/book`. Photo handling is honest — it previews and flags for booking, it does **not** fake analysis.

**Phase 5 — Backend.** Layered Express (`routes → controllers → services → validators`) serving the static site same-origin. See API below.

**Phase 6 — Re-theme + A/B (most recent).** Re-themed fonts (→ Fraunces/Satoshi) and color (→ ocean blue, brass-for-ratings). Currently exploring **dark-hero themes** (`dark-1/2/3.html`) and a **hero-CTA A/B test** wired into the backend.

---

## Backend API

Mounted by [`server/src/app.js`](server/src/app.js):

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/api/book` | Booking/lead submission (validated, rate-limited, emailed; A/B conversion tracked) |
| `GET`  | `/api/health` | Health check |
| `GET`  | `/ab-results` | Hero-CTA A/B test dashboard |

**Booking validation** ([`server/src/validators/booking.schema.js`](server/src/validators/booking.schema.js), Zod):
- `name` — required, 2–120 chars
- `phone` — required, 7–40 chars
- `zip` — optional, exactly 5 digits if present
- `service`, `notes` — optional, length-capped
- `company` — **honeypot**: hidden from humans, must stay empty; bots that fill it are rejected

Other protections: JSON/body size capped at 64 kb, CORS locked to a configured origin, rate limiting, central error handler.

---

## Design principles (anti-"AI slop")

- One deliberate accent color, not rainbow gradients; **brass reserved strictly for ratings**.
- Foundry-class type pairing chosen *against* the AI-default font set.
- Real photography and real heritage signals (license #, "since 1992") over stock and fake social proof.
- Editorial/asymmetric layout, not the centered three-card cliché.
- Every React/shadcn component was **ported to vanilla**, never installed — static-only is a hard rule.

---

## Notes & caveats

- **Demo data:** business name, phone, license #, reviews, and ratings are fictional. Replace via [`build/data.js`](build/data.js), then `node build/generate.js`.
- **Service-area map backgrounds** use Esri World Imagery satellite tiles (free, no API key) — verify licensing before commercial use.
- **`dark-*` files** are in-progress hero experiments, not the shipped homepage.
- **Stale font comment** in `index.html` references an older pairing; the live fonts are Fraunces + Satoshi + Spline Sans Mono.
- `server/node_modules/` (≈9.8 MB) is committed locally; run `npm install` if missing.

---

## Provenance

Build history, design rationale, and the verified research that drove the decisions are preserved in [`RESEARCH.md`](RESEARCH.md) and this README. The research run alone: 6 angles · 26 sources · 127 claims extracted · 25 verified · **11 confirmed / 14 killed**.
