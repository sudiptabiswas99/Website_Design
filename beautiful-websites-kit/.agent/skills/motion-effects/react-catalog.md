# Motion Primitives — React / Next.js Catalog (Mode B)

Use this when the build is **React / Next.js** (not the kit's single-file sites). Source of truth: **`github.com/itsjwill/motion-primitives-website`** (MIT, 155+ components). Live: `nextjs-animated-components.vercel.app`. Browse with live previews: `/components`.

**Stack:** Next.js 14 · React 18 · Framer Motion 11 · GSAP 3.12 · Three.js 0.164 (`@react-three/fiber` + `drei`) · Spline · Lenis · Tailwind · `clsx`/`tailwind-merge`/`cva`.

**How to use:** copy the component file from `src/components/{category}/{name}.tsx` (and any hook it imports from `src/hooks/`) into your project, install the deps it uses, then `import { X } from '@/components/...'`. Most are self-contained. `src/lib/component-registry.ts` lists every component with its props.

---

## Categories → files (under `src/components/`)

### interactive/ (16)
`dock` · `marquee` (infinite, h/v, pause-on-hover) · `lamp` · `number-ticker` · `morphing-text` (**typewriter / flip / word-rotate / scramble**) · `spotlight-card` (+ BorderCard, Grid) · `magnetic` · `animated-beam` · `ripple` · `animated-tabs` (pill/underline/background) · `liquid-glass` · `border-beam` · `confetti` · `orbit` · `scroll-reveal` · `wavy-background`

### backgrounds/ (11)
`aurora` · `gradient-blur` · `gradient-mesh` (Stripe-style) · `grid` · `infinite-grid` · `meteors` · `particles` · `spotlight` · `premium-backgrounds` · `shader-backgrounds`

### effects/ (12)
`animated-input` · `audio-reactive` · `custom-cursor` · `fluid-cursor` · `magnetic-button` · `magnetic-gallery` · `media-reveal` · `mouse-parallax` · `reveal-on-hover` · `text-distortion` · `theme-toggle` · `premium-effects`

### text/ (6)
`gradient-text` · `text-reveal` · `text-generate` · `split-screen-text` · `premium-text`

### cards/ (7)
`bento-grid` · `glow-card` · `tilt-card` · `stack-cards` · `hover-card` · `feature-showcase` · `living-system`

### scroll/ (8)
`gsap-scroll` · `scroll-orchestrator` · `parallax-scroll` · `scroll-animations` · `scroll-video` · `infinite-scroll` · `section-reveal`

### chat/ (1)
`animated-chat` — animated chat UI (the React analog of the kit's § 6 widget)

### three/ (3D, ~15)
`globe` · `neural-network` · `particle-morph` · `floating-shapes` · `scroll-progress-3d` · `robots/` (`chrome-titan`, `neon-samurai`, `bubble-bot`) · `experimental/` (`gravity-well`, `swarm-intelligence`, `sound-fabric`, `magnetic-fluid` (ferrofluid), `living-trail`, `dimensional-rift`)

### layout/ · navigation/ · transitions/ · svg/ · templates/ · ui/
`hero-sections` · `animated-masonry` · `sections` · `premium-layouts` · `morphing-nav` · `page-transition` · `preloader` · `noise-transition` · `animated-svg` · templates: `landing` / `pricing` / `about` · `ui/card`, `splite` (Spline wrapper), `spline-recolor`

### seo/ (12)
`auto-seo` · `json-ld` · `web-vitals` · `breadcrumbs` · `social-share` · `seo-analyzer` · `seo-head` · `canonical` · `rss-feed` · `analytics` · `web-vitals`

### hooks/ (7)
`use-gsap` · `use-lenis` (smooth scroll) · `use-mouse-position` · `use-reduced-motion` · `use-svg-animation` · `use-web-vitals`

### demos/ (full reference pages)
`saas` · `agency` · `portfolio` · `scroll` (10 GSAP ScrollTrigger demos) · `interactive-3d` (6 R3F scenes) · `spline-worlds` (6 Spline scenes) · `neural`

---

## Vanilla ↔ React equivalence (so you can match a kit recipe to a library component)
| Kit recipe (Mode A) | Library component (Mode B) |
|---|---|
| § 1 Typewriter | `interactive/morphing-text` (typewriter variant) |
| § 2/3 Word reveal | `text/text-reveal`, `text/text-generate` |
| § 4 Hover marquee | `interactive/marquee` + `effects/magnetic-gallery` |
| § 5 Process scroll | `scroll/scroll-orchestrator`, `scroll/gsap-scroll` |
| § 6 Chat widget | `chat/animated-chat` |
| § 7 Number ticker | `interactive/number-ticker` |
| § 7 Magnetic button | `effects/magnetic-button` |
| § 7 Spotlight card | `interactive/spotlight-card` |
| § 7 Scroll reveal | `interactive/scroll-reveal`, `scroll/section-reveal` |
| § 7 Gradient mesh | `backgrounds/gradient-mesh` |
