---
name: site-redesign-premium
description: An OPT-IN "go beyond" enhancement layer that sits ON TOP of the site-redesign skill. Same content, same pipeline — just rebuilt to a top-tier, agency-grade standard with glassmorphism on every functional control and a perfect 1:1 content/button match to the original business site. Does NOT modify the base site-redesign skill or the core workflow.
trigger: "premium" or "go beyond" or "make it beautiful" or "tier-a" or "top tier"
---

# Skill: Site Redesign — Premium ("Go Beyond")

## What This Skill Is

A **separate enhancement layer**, not a replacement. It runs *on top of* `site-redesign`.

- The base **`site-redesign`** skill is unchanged and remains the design source.
- The 4-step workflow (`apify-scrape → site-qualify → site-redesign → vercel-deploy`) is unchanged.
- File conventions, Airtable tracking, and **cost rules** are unchanged. No new paid actions — auditing the original (Playwright), redesigning, and Vercel are all free.

This skill only changes **how good** and **how faithful** the redesign is. Invoke it when the user wants the best possible result ("make it beautiful", "go beyond", "tier-a").

> Act like a top-tier website builder / award-winning design studio. The goal is the single best, most beautiful version of this exact business's site — not a generic template.

---

## The 5 Premium Rules

### 1. Content fidelity — audit the ORIGINAL first (mandatory)
Before generating anything, open the business's **live** original site in a real browser (Playwright) and capture **everything**, so nothing is missed and it matches:
- Every **nav item** and every **button / CTA** (e.g. Book Now, Buy Gift Card, Membership, Packages & Offers, FAQs, Contact, Make an Appointment, Gift Certificate).
- Every **service / category** name exactly as they list it (e.g. Massage / Facials / Body Treatments).
- Real **content**: headings, taglines, hours, specials/offers, real reviews, address, phone, email.

```js
// capture nav, buttons, service categories, headings
() => ({
  nav: [...new Set([...document.querySelectorAll('nav a,header a,.menu a,ul a')].map(a=>a.innerText.trim()).filter(Boolean))],
  buttons: [...new Set([...document.querySelectorAll('a,button')].map(b=>b.innerText.trim())
            .filter(t=>/book|gift|member|package|appointment|certificate|special|contact|faq|call|buy|now/i.test(t)))],
  headings: [...document.querySelectorAll('h1,h2,h3')].map(h=>h.innerText.trim()).filter(Boolean).slice(0,25)
})
```
**The redesign must mirror the original's offerings and calls-to-action.** Missing a button (e.g. "Buy Gift Card") = failure. Content must match the original; only the design is elevated.

### 2. Glassmorphism on EVERY functional control
All interactive / functional elements use frosted glass (`backdrop-filter: blur(20px) saturate(1.5)` + translucent bg + light border + soft shadow), layered over a soft aura / mesh / gradient so the glass reads:
- Nav pill or bar, buttons, theme toggle
- Tabs, segmented controls, toggles, accordions, carousels, selectors — **the signature interaction**
- Cards (stats, services, quote), the contact form and its inputs
Provide light + dark glass tokens (`--glass`, `--glass-2`, `--glass-brd`, `--glass-sh`).

### 3. Top-tier, distinct design (follow the base skill + these)
- A **distinct structure** per site — rotate nav type (top bar / floating pill / side rail / centered wordmark), hero type (full-bleed / split / asymmetric / blob), and **one signature interaction** (configurator / compare-slider / area-selector / matcher / lookbook carousel / dual-mode toggle / accordion / vertical tabs / segmented). No two sites share a skeleton.
- Device-aware **dual theme** (light default, `[data-theme]` dark, `?theme=` override, FOUC-free head script).
- Robust motion: drive Lenis via `gsap.ticker.add(t=>lenis.raf(t*1000))`, `ScrollTrigger.refresh()` on load, a `showAll()` failsafe in try/catch, and a `prefers-reduced-motion` override — so reveals never get stuck invisible.
- **Verify every image URL returns 200** before shipping (dead Unsplash IDs render as white gaps).

### 4. Review before deploy (hard gate)
Build → screenshot **light AND dark** (Playwright, full page) → show the user + a local preview link → **deploy only on approval**. If rejected, rework until liked, then deploy. Never auto-deploy.

### 5. Honesty (Global Truth Rule)
No fabricated reviews, names, or prices. Use the **real scraped figures** (rating, review count) and real on-site content. If a number isn't known (e.g. menu pricing), show composition + "call for pricing" — never invent. Verify claims live.

---

## How to Invoke

```
/site-redesign-premium <business or slug>
```
Runs the base redesign for that lead, elevated by the 5 rules above. One site at a time, each review-gated.

## What This Skill Does NOT Do
- Does **not** edit `site-redesign`, `apify-scrape`, `site-qualify`, or `vercel-deploy`.
- Does **not** change `qualify_results.json` logic, the build-log format, or the Airtable schema.
- Does **not** add paid steps. It is purely an opt-in quality + fidelity layer.
