# Scroll Expansion Hero — Media Showcase

A scroll-driven hero where a **video or image expands to fill the viewport** as you
scroll, then reveals content beneath. Built on the shadcn project structure with
Tailwind CSS v4, TypeScript, and Framer Motion.

## Stack

- **Next.js 16** (App Router) — static export (`output: "export"`)
- **Tailwind CSS v4** (`@tailwindcss/postcss`)
- **TypeScript** (strict)
- **shadcn** structure — `components/ui`, `lib/utils.ts`, `components.json`
- **framer-motion** — the one required external dependency

## Component

`components/ui/scroll-expansion-hero.tsx` — the `ScrollExpandMedia` component.
It hijacks wheel/touch input to drive a `scrollProgress` value (0→1). As progress
grows, the media card grows (`300→1550px` wide desktop), the background fades out,
the title/date slide apart, and at full expansion the `children` content fades in.

### Props

| Prop | Type | Notes |
|---|---|---|
| `mediaType` | `'video' \| 'image'` | Default `'video'`. Video also supports YouTube URLs (auto-embeds). |
| `mediaSrc` | `string` | Video/image URL. |
| `posterSrc` | `string?` | Video poster. |
| `bgImageSrc` | `string` | Full-bleed background behind the card (fades out on expand). |
| `title` | `string?` | Split into first word + rest, animated apart. |
| `date` | `string?` | Small label above "scroll to expand". |
| `scrollToExpand` | `string?` | Call-to-action hint text. |
| `textBlend` | `boolean?` | `mix-blend-difference` on the title. |
| `children` | `ReactNode` | Revealed once fully expanded. |

`components/ui/demo.tsx` wires it up with a Video/Image toggle and exports the
default `Demo`, plus named variants (`VideoExpansion`, `ImageExpansion`,
`VideoExpansionTextBlend`, `ImageExpansionTextBlend`).

## Media assets

All remote assets were live-verified (HTTP `206`) before use:

- **Video** — cosmic clip (uploadthing CDN).
- **Video poster / bg** — Unsplash (Earth-from-space, starfield nebula).
- **Image mode** — Unsplash (underwater diver over an ocean/valley background).

Only `images.unsplash.com` goes through `next/image`, so it's the single entry in
`next.config.ts` `remotePatterns`. The `<video>` element is a plain tag and needs
no whitelist.

## Run

```bash
npm install          # framer-motion + Next/Tailwind toolchain
npm run dev          # http://localhost:3000
npm run build        # static export to ./out
```

The static export is served from the Documents-root portfolio server at
`http://localhost:8000/All_Site/scroll-expansion-hero-app/out/` — `basePath`/
`assetPrefix` in `next.config.ts` point at that exact subpath.

## Verification

`verification/` holds live browser screenshots proving the three states:
video collapsed → video expanded (content revealed) → image mode collapsed.
