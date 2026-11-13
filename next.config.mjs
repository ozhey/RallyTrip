import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));

// STATIC_EXPORT=true → plain HTML files in out/ for GitHub Pages (rebuilt on a schedule when data changes).
// Otherwise → regular Next.js server build with ISR (for a server host such as Cloudflare Workers).
const isStatic = process.env.STATIC_EXPORT === 'true';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Same URLs in both modes (GitHub Pages serves folders as /path/).
  trailingSlash: true,
  // Route files that differ per mode: page.server.js vs page.static.js (plain page.js is used by both).
  pageExtensions: isStatic ? ['static.js', 'js'] : ['server.js', 'js'],
  ...(isStatic ? { output: 'export' } : {}),
  // e2e tests build into a separate folder so they never clobber a real build.
  distDir: process.env.NEXT_DIST_DIR || '.next',
  env: { NEXT_PUBLIC_STATIC_EXPORT: isStatic ? 'true' : '' },
  turbopack: {
    root,
    ...(isStatic ? { resolveAlias: { '@/lib/actions': './src/lib/actions.static.js' } } : {}),
  },
  ...(isStatic
    ? {}
    : {
        async headers() {
          return [
            {
              // Kill switch for the old CRA service worker: browsers must always re-fetch it.
              source: '/service-worker.js',
              headers: [{ key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' }],
            },
          ];
        },
      }),
};

export default nextConfig;
