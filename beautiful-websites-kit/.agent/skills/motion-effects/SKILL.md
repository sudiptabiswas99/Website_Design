---
name: motion-effects
description: Drop-in animation & interaction recipes for the single-file website builds (hero text animations, hover-preview marquees, scroll-driven "process" sequences, chat widget, number tickers, magnetic buttons, spotlight cards, gradient-mesh backgrounds). Vanilla HTML/CSS/JS + GSAP — no framework. Also indexes the 155+ React component library (itsjwill/motion-primitives) for Next.js builds.
trigger: "motion-effects" or "add animation" or "animate the hero" or "add a chatbot" or "marquee" or "process animation" or "number counter"
---

# Skill: Motion Effects

## What This Skill Does
Adds premium, production-grade motion to a site **without breaking the single-file architecture** of `site-redesign`. Every recipe is **vanilla HTML/CSS/JS + the GSAP CDN that's already loaded** — no React, no build step. Each one is copy-paste ready and has been verified live (Playwright screenshot + DOM assert) in the plumber builds.

> Pairs with `site-redesign` / `site-redesign-premium`. Use it AFTER the base site exists to layer in motion, or pull recipes while building.

---

## ⭐ Selection Protocol — RUN THIS ON EVERY BUILD (user standing order)
**When a website is built (or when `/motion-effects` is invoked), do NOT silently pick.** Present the full menu of options by category, **mark the recommended option** for this specific site, and let the user choose. Only apply what they select.

**How to ask:** use the `AskUserQuestion` tool (interactive multi-select). Group into up to 4 questions per call; put the recommended option **first** and append " (Recommended)" to its label. Always allow "None / skip". After they answer, apply each chosen recipe (Mode A vanilla by default), then verify (rule 6) and log.

**The menu (single-file / vanilla builds):**

1. **Hero text animation** (pick ONE): Typewriter loop · Word mask-rise · Word blur-pop · Gradient/animated text · None
2. **Process / "how it works" section** (pick ONE or none): Driving-vehicle road · Fluid-fill pipe · Drawing stepper · None
3. **Social proof** (pick any): Hover-preview marquee gallery · Auto-scroll review marquee · Number-ticker stats · None
4. **Engagement & polish** (pick any): Chat widget · Magnetic buttons · Spotlight cards · Scroll-reveal (default ON) · Animated background (gradient-mesh / aurora / particles) · None

> For **React/Next builds**, the menu expands to the full library (Mode B) — add 3D (`three/`), Spline worlds, dock, confetti, etc.

**Recommendation logic (what to put first / suggest):**
| Site personality | Recommend |
|---|---|
| Emergency / trust / 24-7 | Blur-pop hero · Drawing stepper · Number tickers · Chat widget · Magnetic CTAs |
| Heritage / editorial / "since 19XX" | Mask-rise hero · Fluid pipe · Hover-preview marquee · subtle scroll-reveal |
| Review-forward / family / friendly | Typewriter hero · Driving-vehicle process · Review marquee (real reviews) · Chat widget |
| High-end / minimalist | Gradient text or mask-rise · None/stepper · Spotlight cards · gradient-mesh bg |

**Hard constraints when recommending:** ONE hero animation per site; ONE process metaphor; never reuse the same mechanic across two sites in the same portfolio (check `sites/build-log.md`); keep honesty rules (chat = scripted; sample-review pill unless reviews are real).

**Skip the menu only if** the user explicitly says "no animations" or names exactly what they want.

---

## Two Modes

### Mode A — Vanilla single-file (DEFAULT, for this kit)
The sites here are one `index.html` with all CSS in `<style>`, all JS in `<script>`, GSAP + Lucide from CDN. Use the recipes in **[recipes.md](recipes.md)** — paste the CSS into `<style>`, the HTML where it belongs, and the JS into the existing `<script>`.

### Mode B — React / Next.js (the component library)
If the build is on Next.js, use the real library: **`github.com/itsjwill/motion-primitives-website`** (155+ MIT components, live demo `nextjs-animated-components.vercel.app`). Stack: Framer Motion · GSAP · Three.js (R3F + drei) · Spline · Lenis · Tailwind. Copy a component from `src/components/{category}/` and its hook from `src/hooks/`. See **[react-catalog.md](react-catalog.md)** for the full list and which file each effect lives in.

---

## Effect Index (Mode A recipes)

| Effect | Use case | Recipe |
|--------|----------|--------|
| **Typewriter (loop)** | Hero headline types out → erases → repeats; preserves styled inline spans | recipes.md § 1 |
| **Word mask-rise** | Editorial hero; words sweep up from behind the line | recipes.md § 2 |
| **Word blur-pop** | Energetic hero; words snap in from blurred/scaled | recipes.md § 3 |
| **Hover-preview marquee** | Two photo reels (← / →); hover pauses + zooms a big preview + review/caption | recipes.md § 4 |
| **Process — driving van** | Horizontal road, SVG vehicle drives between numbered steps; click-to-jump | recipes.md § 5 |
| **Process — fluid pipe** | Vertical pipe fills past valve-nodes; accordion step details | recipes.md § 5 |
| **Process — drawing stepper** | Connector line draws between popping numbered nodes (→ vertical on mobile) | recipes.md § 5 |
| **Chat widget** | Floating bubble → branded chat panel, keyword replies + phone capture + Call | recipes.md § 6 |
| **Number ticker** | Count-up stat on scroll-into-view | recipes.md § 7 |
| **Magnetic button** | Button drifts toward the cursor | recipes.md § 7 |
| **Spotlight card** | Card with a cursor-tracking radial glow | recipes.md § 7 |
| **Scroll reveal** | Fade/rise sections in on scroll (with no-stuck safety net) | recipes.md § 7 |
| **Gradient-mesh background** | Animated Stripe-style mesh behind a hero | recipes.md § 7 |

---

## RULES (never break)
1. **Single file.** CSS → `<style>`, JS → existing `<script>`. No new files, no framework, CDN only.
2. **No layout shift.** Reserve height (`minHeight`) before any text animation; use `transform`/`opacity` (never animate layout properties that reflow).
3. **Reduced-motion.** Every recipe checks `matchMedia('(prefers-reduced-motion:reduce)')` and shows the final/static state instead of animating.
4. **No-GSAP fallback.** Guard `window.gsap`; if absent, snap to the visible end state (never leave content invisible).
5. **Anti-stuck safety net.** Any scroll-triggered reveal must also force-show after a timeout so nothing can stay at `opacity:0`.
6. **Verify live.** After adding, run the local server + Playwright: 0 console errors, screenshot desktop + 390px mobile, and DOM-assert the animation actually ran (sample transform/opacity over time for loops).
7. **Honesty.** Chat widget is a scripted assistant (label it as such; never imply a live human or real AI). Any "reviews" attached to stock photos get a visible **Sample** tag unless they're real.
8. **Editing UTF-8 site files:** `grep`/Edit can silently fail because of glyphs (★ — →). Inspect with `awk`/Read; for tricky inserts use a Python line-splice (read utf-8 → replace → write).

---

## Quick start
```
/motion-effects                  → list effects, ask which to add
/motion-effects typewriter hero  → add the looping typewriter to the hero
/motion-effects chat             → add the chat widget
```
1. Read the target `sites/{slug}/index.html` to learn its palette CSS vars + fonts.
2. Pick the recipe; re-skin it with that site's `--vars` so it matches the brand.
3. Paste CSS/HTML/JS at the right anchors.
4. Start `cd sites && python3 -m http.server 8080`, open with Playwright, verify (rule 6).
5. Log the addition in `sites/build-log.md`.

---

## Pairing guidance (what looks good where)
- **Emergency/trust sites** → blur-pop hero, drawing stepper process, number tickers.
- **Heritage/editorial sites** → mask-rise hero, fluid-pipe process, marquee gallery.
- **Review-forward / family sites** → typewriter hero, driving-van process, hover-preview marquee with real reviews, chat widget.
- Keep **one** hero animation per site and **one** process metaphor — never reuse the same mechanic across two sites in the same portfolio.
