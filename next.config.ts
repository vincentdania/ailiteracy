import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
  // Learners are often on patchy mobile data: a reload on every "online" event throws away
  // half-typed answers and re-downloads the page. Pages pick up fresh data on their next navigation.
  reloadOnOnline: false,
  // Precache only the tiny app shell. Everything else is cached at runtime as the learner visits it,
  // so a first visit no longer pulls megabytes of images, certificate fonts and unvisited routes.
  globPublicPatterns: ["manifest.json", "favicon.ico", "icons/icon-192.png", "icons/icon-source.svg", "brand/*.svg"],
  exclude: [
    /\.map$/,
    /^manifest.*\.js$/,
    // Pages Router runtime and legacy polyfills: never loaded by this App Router site on modern browsers.
    /^static\/chunks\/(framework|main|polyfills)-[0-9a-f]+\.js$/,
    /^static\/chunks\/pages\//,
    // Fonts are already in the HTTP cache (immutable) after the first page, and precaching them
    // downloads them a second time; the runtime font cache picks them up on the next page instead.
    /^static\/media\/.+\.woff2$/,
    // Routes a learner never needs offline.
    /^static\/chunks\/app\/(admin|api|hermes-agent|join|verify|_not-found|robots\.txt|sitemap\.xml)\//,
  ],
});

// Public files are not content-hashed, so cache them for a week (and serve stale while revalidating)
// rather than revalidating on every view.
const publicAssetCache = { key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" };

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    // Optimised images come from static files in /public; keep them for 30 days instead of 60 seconds.
    minimumCacheTTL: 2592000,
    remotePatterns: [],
  },
  async headers() {
    return [{
      source: "/:path*",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
        { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
      ],
    },
    ...["/icons/:path*", "/brand/:path*", "/images/:path*", "/lessons/:path*", "/fonts/:path*", "/og.png", "/favicon.ico"].map((source) => ({ source, headers: [publicAssetCache] })),
    {
      source: "/manifest.json",
      headers: [{ key: "Content-Type", value: "application/manifest+json" }, { key: "Cache-Control", value: "public, max-age=3600" }],
    }, {
      source: "/sw.js",
      headers: [{ key: "Cache-Control", value: "no-cache, no-store, must-revalidate" }, { key: "Service-Worker-Allowed", value: "/" }],
    }];
  },
};

export default withSerwist(nextConfig);
