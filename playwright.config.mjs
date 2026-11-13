import { defineConfig, devices } from '@playwright/test';

// Runs against a production build pointed at the Firebase emulators (seeded from tests/fixtures/seed.json).
// Use `npm run test:e2e` (server build) or `npm run test:e2e:static` (GitHub Pages build);
// both start the emulators first.
export const STATIC = process.env.E2E_STATIC === 'true';
const PORT = STATIC ? 3201 : 3200;
const baseURL = `http://localhost:${PORT}`;
const distDir = STATIC ? '.next-e2e-static' : '.next-e2e';

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: { baseURL, trace: 'retain-on-failure', serviceWorkers: 'block' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1366, height: 900 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'] }, testIgnore: /(admin|security)\.spec/ },
  ],
  webServer: {
    command: STATIC
      ? `node scripts/seed-emulator.mjs && next build && node scripts/serve-static.mjs ${distDir} ${PORT}`
      : `node scripts/seed-emulator.mjs && next build && next start -p ${PORT}`,
    url: baseURL,
    timeout: 240_000,
    reuseExistingServer: !process.env.CI,
    env: {
      NEXT_PUBLIC_USE_FIREBASE_EMULATOR: 'true',
      NEXT_PUBLIC_SITE_URL: baseURL,
      NEXT_DIST_DIR: distDir,
      ADMIN_EMAILS: 'admin@rallytrip.test',
      NEXT_TELEMETRY_DISABLED: '1',
      ...(STATIC ? { STATIC_EXPORT: 'true' } : {}),
    },
  },
});
