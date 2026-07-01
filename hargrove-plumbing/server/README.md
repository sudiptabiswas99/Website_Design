# Hargrove & Sons — booking server

Tiny Express backend that takes the website's "Book a visit" form and emails the lead
to the business. Layered so logic lives in one predictable place:

```
src/
├── index.js                      entry — bootstrap only
├── app.js                        express wiring (middleware, static, routes, errors)
├── config/env.js                 load + validate env, fail fast
├── routes/
│   ├── index.js                  aggregator (mounts everything under /api)
│   └── booking.routes.js         POST /api/book → middleware → controller
├── controllers/booking.controller.js   thin HTTP adapter
├── services/
│   ├── booking.service.js        business logic: build the lead email
│   └── mailer.service.js         transport: real SMTP or Ethereal dev inbox
├── middleware/                   validate · rateLimit · errorHandler
├── validators/booking.schema.js  zod schema (boundary validation + honeypot)
└── utils/logger.js
```

No database/repository layer — the app sends mail, it doesn't persist. Add `repositories/`
+ `models/` if you later store leads.

## Run it

```bash
cd server
cp .env.example .env        # dev: you can leave SMTP_* blank
npm install
npm start                   # serves the SITE + API on http://localhost:8787
```

Open **http://localhost:8787/** — the whole site is served by this server, so the form
posts same-origin to `/api/book`.

### Dev mode (no SMTP needed)
Leave `SMTP_*` blank and the server creates a free **Ethereal** test inbox at boot. Real
email isn't delivered, but every submission returns a `previewUrl` so you can open the
exact message that would have been sent.

```bash
npm start                   # in one terminal
npm run smoketest           # in another — prints the preview URL
```

### Production (real email)
Fill `SMTP_HOST/PORT/USER/PASS` and `BOOKING_TO` in `.env`, set `NODE_ENV=production`
(missing vars then crash at boot instead of failing silently). Gmail: use an
[App Password](https://myaccount.google.com/apppasswords), `SMTP_PORT=465`, `SMTP_SECURE=true`.

## Endpoints
| Method | Path          | Body                                   | Returns |
|--------|---------------|----------------------------------------|---------|
| GET    | `/api/health` | —                                      | `{ ok, service, time }` |
| POST   | `/api/book`   | `{ name, phone, zip?, service?, notes? }` | `{ ok, message, previewUrl? }` |
| GET    | `/` `/index.html` | —                                  | homepage with its A/B variant applied |
| GET    | `/ab-results` | `?format=json` optional                | results dashboard (HTML) or report (JSON) |

Rate-limited to 5 requests / 10 min per IP (configurable via env).

## A/B test (hero CTA)

The homepage is served through a 50/50 split test of the hero's primary call-to-action:

- **A (control)** — "Book a Visit"  ·  **B** — "Get My Free Quote"

Each visitor is assigned a sticky variant via the `ab_vid` + `ab_hero_cta` cookies (30 days),
and a **conversion** is counted once when that visitor's `POST /api/book` returns 2xx. Results,
with a two-proportion z-test verdict, live at **http://localhost:8787/ab-results**.

```
config/abtest.config.js     ← define WHAT is tested (change copy / variants / weights here only)
repositories/abtest.repository.js  ← the swappable store (today: JSON file in server/data/)
services/abtest.service.js  ← assignment + the report/stats
views/ab-dashboard.js       ← the results page
```

To change the experiment, edit `config/abtest.config.js` and bump `id` to reset the data.
The event store (`server/data/`) is gitignored.
