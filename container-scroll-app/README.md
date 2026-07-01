# Container Scroll Animation — Hero Showcase

A scroll-driven **3D card that rotates and scales into view** (Aceternity UI "Container
Scroll"), built on Next.js 16 (App Router), React 19, Tailwind v4, shadcn (`base-nova`),
TypeScript and Framer Motion.

## What it does

- **Scroll-linked 3D tilt** — the card starts at `rotateX(20deg)` and flattens to `0` as you scroll (`useScroll` + `useTransform`).
- **Scale on scroll** — desktop `1.05 → 1`, mobile `0.7 → 0.9` (responsive via a `window.innerWidth <= 768` check).
- **Lifting title** — the heading translates up (`0 → -100px`) as the card settles.
- **Layered depth** — multi-stop `boxShadow` + dark `#222222` frame for a device-mockup look.

## Run it

```bash
npm install      # deps already vendored if cloned from this folder
npm run dev      # http://localhost:3000  (this clone was verified on :3017)
```

## Structure

| File | Role |
|------|------|
| `components/ui/container-scroll-animation.tsx` | The reusable `ContainerScroll` component + `Header`/`Card` (`"use client"`). |
| `components/ui/demo.tsx` | The showcase: title + `next/image` (Unsplash) inside the card. |
| `app/page.tsx` | Renders the demo. |
| `app/layout.tsx` | Sets `dark` mode + metadata. |
| `next.config.ts` | Allows `images.unsplash.com` for `next/image`. |

## Using the component elsewhere

```tsx
import { ContainerScroll } from "@/components/ui/container-scroll-animation";

<ContainerScroll
  titleComponent={<h1 className="text-4xl font-semibold">Your headline</h1>}
>
  {/* any content — image, video, screenshot, iframe… */}
  <img src="..." alt="" className="mx-auto rounded-2xl object-cover h-full" />
</ContainerScroll>
```

> Using `next/image` with a remote host? Add that host to `images.remotePatterns`
> in `next.config.ts` (Unsplash is already configured here).
