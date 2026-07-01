import type { NextConfig } from "next";

// Static export so this demo is servable from the Documents-root portfolio
// server (http://localhost:8000). basePath/assetPrefix point at the exact
// subpath the gallery links to, so the absolute /_next/ asset URLs resolve.
// images.unoptimized lets the remote Unsplash <Image> render without the
// Next image-optimization server (unavailable in a static export).
const BASE = "/All_Site/scroll-expansion-hero-app/out";

const nextConfig: NextConfig = {
  output: "export",
  basePath: BASE,
  assetPrefix: BASE,
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
};

export default nextConfig;
