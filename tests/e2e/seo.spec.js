import { expect, test } from '@playwright/test';

// These fetch raw HTML (no JavaScript), i.e. what a crawler sees on first load.
test.describe('SEO (server-rendered HTML)', () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'runs once');
  });

  test('product page HTML contains content, metadata and structured data', async ({ request, baseURL }) => {
    const res = await request.get('/products/roadbooks/sc/-TestRoadbook2/');
    expect(res.status()).toBe(200);
    const html = await res.text();
    expect(html).toContain('<title>סיפור דרך במבצע | Rally Trip</title>');
    expect(html).toContain('<meta name="description" content="מוצר עם מחיר מבצע"/>');
    expect(html).toContain(`<link rel="canonical" href="${baseURL}/products/roadbooks/sc/-TestRoadbook2/"/>`);
    expect(html).toContain('<meta property="og:image"');
    expect(html).toContain('<html lang="he" dir="rtl">');

    const blocks = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
    const items = blocks.flat();
    const product = items.find((b) => b['@type'] === 'Product');
    expect(product).toMatchObject({
      name: 'סיפור דרך במבצע',
      offers: { priceCurrency: 'ILS', price: 150, availability: 'https://schema.org/OutOfStock' },
    });
    const crumbs = items.find((b) => b['@type'] === 'BreadcrumbList');
    expect(crumbs.itemListElement.map((i) => i.name)).toEqual(['בית', 'כל המוצרים', 'סיפורי דרך', 'סיפור דרך במבצע']);
  });

  test('listing HTML contains product names', async ({ request }) => {
    const html = await (await request.get('/products/garmin/')).text();
    expect(html).toContain('שעון גרמין לבדיקה');
    expect(html).toContain('מכשיר גרמין לבדיקה');
  });

  test('sitemap lists pages and visible products only', async ({ request, baseURL }) => {
    const xml = await (await request.get('/sitemap.xml')).text();
    expect(xml).toContain(`<loc>${baseURL}/products/roadbooks/sc/-TestRoadbook1/</loc>`);
    expect(xml).toContain(`<loc>${baseURL}/products/garmin/watches/</loc>`);
    expect(xml).toContain(`<loc>${baseURL}/nav-guide/</loc>`);
    expect(xml).not.toContain('-TestHidden');
  });

  test('robots.txt blocks admin and points at the sitemap', async ({ request, baseURL }) => {
    const txt = await (await request.get('/robots.txt')).text();
    expect(txt).toContain('Disallow: /admin');
    expect(txt).toContain(`Sitemap: ${baseURL}/sitemap.xml`);
  });

  test('pages are served at trailing-slash URLs', async ({ request }) => {
    const res = await request.get('/products/garmin', { maxRedirects: 0 });
    expect([301, 308]).toContain(res.status());
    expect(res.headers().location).toMatch(/\/products\/garmin\/$/);
  });

  test('admin page is noindex', async ({ request }) => {
    const html = await (await request.get('/admin/')).text();
    expect(html).toContain('<meta name="robots" content="noindex, nofollow"/>');
  });

  test('old service worker is replaced by the kill switch', async ({ request }) => {
    const js = await (await request.get('/service-worker.js')).text();
    expect(js).toContain('unregister');
  });
});
