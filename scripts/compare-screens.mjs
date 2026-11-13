#!/usr/bin/env node
// Captures the same pages from the live (old, hash-routed) site and a local build for visual comparison.
// Usage: node scripts/compare-screens.mjs [localBaseUrl]   → screenshots in test-results/compare/
import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const LIVE = 'https://www.rallytrip.com/#';
const LOCAL = process.argv[2] || 'http://localhost:3123';
const PRODUCT = process.env.PRODUCT_PATH || '/products/communicators/sc/-MN5tOl8-b4PuCeGXjlo';
const pages = {
  home: '/',
  products: '/products',
  garmin: '/products/garmin',
  'garmin-watches': '/products/garmin/watches',
  product: PRODUCT,
  abroad: '/rally-abroad',
  navguide: '/nav-guide',
  admin: '/admin',
};
const viewports = { desktop: { width: 1366, height: 900 }, mobile: { width: 390, height: 844 } };

await mkdir('test-results/compare', { recursive: true });
const browser = await chromium.launch();
for (const [vpName, viewport] of Object.entries(viewports)) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 1, serviceWorkers: 'block' });
  const page = await ctx.newPage();
  for (const [name, path] of Object.entries(pages)) {
    for (const [site, base] of [['live', LIVE], ['local', LOCAL]]) {
      await page.goto(base + path, { waitUntil: 'networkidle' });
      // Force lazy images to load so full-page screenshots are comparable.
      await page.evaluate(() => document.querySelectorAll('img[loading=lazy]').forEach((img) => { img.loading = 'eager'; }));
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(800);
      await page.screenshot({ path: `test-results/compare/${name}-${vpName}-${site}.png`, fullPage: true });
    }
  }
  await ctx.close();
}
await browser.close();
console.log('done');
