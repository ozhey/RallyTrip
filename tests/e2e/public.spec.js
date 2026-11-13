import { expect, test } from '@playwright/test';

const STATIC = process.env.E2E_STATIC === 'true';

const isMobile = (testInfo) => testInfo.project.name === 'mobile';

test('home page', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: 'ראלי טריפ' })).toBeVisible();
  await expect(page).toHaveTitle('Rally Trip ראלי טריפ');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  // Category tiles link to listings; featured strip shows discounted products first, hidden ones never.
  await expect(page.locator('.category-tile')).toHaveCount(9);
  await expect(page.locator('.category-tile').filter({ hasText: 'גרמין' })).toHaveAttribute('href', '/products/garmin/');
  const featured = page.locator('.featured-grid .preview-title');
  await expect(featured.first()).toHaveText('סיפור דרך במבצע');
  await expect(page.locator('.featured-grid').getByText('מוצר מוסתר')).toHaveCount(0);
});

// Ties keep database key order (same as the old site).
test('all products: visible ones sorted by priority, hidden excluded', async ({ page }) => {
  await page.goto('/products');
  const titles = page.locator('.products-container .preview-container .preview-bot > div:first-child');
  await expect(titles).toHaveText(['סיפור דרך במבצע', 'סיפור דרך לבדיקה', 'מכשיר גרמין לבדיקה', 'שעון גרמין לבדיקה']);
  await expect(page.getByText('מוצר מוסתר')).toHaveCount(0);
});

test('category and subcategory listings', async ({ page }) => {
  await page.goto('/products/garmin');
  await expect(page.locator('.preview-container')).toHaveCount(2);
  await expect(page).toHaveTitle('גרמין | Rally Trip');
  await page.goto('/products/garmin/watches');
  await expect(page.locator('.preview-container')).toHaveCount(1);
  await expect(page.getByText('שעון גרמין לבדיקה')).toBeVisible();
  await expect(page.getByText('צור קשר לקבלת מחיר')).toBeVisible();
});

test('empty category shows the "no products" message', async ({ page }) => {
  await page.goto('/products/wheels');
  await expect(page.getByText('לא נמצאו מוצרים.')).toBeVisible();
});

test('product page renders details server-side and sanitized', async ({ page }) => {
  const dialogs = [];
  page.on('dialog', (d) => { dialogs.push(d.message()); d.dismiss(); });
  await page.goto('/products/roadbooks/sc/-TestRoadbook1');
  await expect(page.getByRole('heading', { level: 1, name: 'סיפור דרך לבדיקה' })).toBeVisible();
  await expect(page.locator('.price')).toHaveText('₪120');
  await expect(page.getByText('המוצר במלאי')).toBeVisible();
  await expect(page.getByText('פרטים נוספים')).toBeVisible();
  await expect(page.locator('.ql-editor li')).toHaveText(['פריט ראשון', 'פריט שני']);
  await expect(page.locator('.ql-editor script, .ql-editor [onerror]')).toHaveCount(0);
  const crumbs = page.locator('.breadcrumbs a');
  await expect(crumbs).toHaveText(['בית', 'כל המוצרים', 'סיפורי דרך']);
  await crumbs.nth(2).click();
  await expect(page).toHaveURL(/\/products\/roadbooks\/$/);
  expect(dialogs).toEqual([]);
});

test('discounted, out-of-stock product', async ({ page }) => {
  await page.goto('/products/roadbooks/sc/-TestRoadbook2');
  await expect(page.locator('.price')).toHaveText('₪150');
  await expect(page.getByText('₪200')).toHaveCSS('text-decoration-line', 'line-through');
  await expect(page.locator('.percent-off')).toHaveText('25% הנחה'); // seed holds an older free-text "₪150"
  await expect(page.getByText('המוצר לא קיים במלאי')).toBeVisible();
  await expect(page.getByText('פרטים נוספים')).toHaveCount(0);
});

test('missing, hidden and unknown pages return 404', async ({ page }) => {
  for (const path of ['/products/gopro/sc/-TestHidden', '/products/roadbooks/sc/nope', '/products/nope', '/nope']) {
    const res = await page.goto(path);
    expect(res.status(), path).toBe(404);
    await expect(page.getByText('הדף לא נמצא')).toBeVisible();
  }
});

test('product under the wrong category redirects to its canonical URL', async ({ page }) => {
  test.skip(STATIC, 'static build has no server redirects (the URL is a 404 there)');
  await page.goto('/products/garmin/watches/-TestRoadbook1');
  await expect(page).toHaveURL(/\/products\/roadbooks\/sc\/-TestRoadbook1\/$/);
});

test('legacy hash URLs redirect to real paths', async ({ page }) => {
  await page.goto('/#/products/garmin/watches');
  await expect(page).toHaveURL(/\/products\/garmin\/watches\/$/);
  await expect(page.getByText('שעון גרמין לבדיקה')).toBeVisible();
  await page.goto('/#/rally-abroad');
  await expect(page).toHaveURL(/\/rally-abroad\/$/);
});

test('rally abroad and nav guide pages', async ({ page }) => {
  await page.goto('/rally-abroad');
  await expect(page.getByText('הראלי הבא: מרוקו 2027')).toBeVisible();
  await page.goto('/nav-guide');
  await expect(page.getByRole('heading', { level: 1, name: 'ניווט באמצעות ספר דרך' })).toBeVisible();
});

test('desktop navigation: dropdown and side menu', async ({ page }, testInfo) => {
  test.skip(isMobile(testInfo), 'desktop only');
  await page.goto('/');
  await page.locator('#navbar').getByRole('link', { name: 'מוצרים' }).hover();
  await page.locator('.dropdown').getByRole('link', { name: 'גרמין' }).click();
  await expect(page).toHaveURL(/\/products\/garmin\/$/);
  const side = page.locator('.sidemenu-container');
  await side.getByRole('link', { name: '- שעונים' }).click();
  await expect(page).toHaveURL(/\/products\/garmin\/watches\/$/);
  await expect(side.getByRole('link', { name: '- שעונים' })).toHaveClass(/active/);
});

test('mobile navigation: drawer and category select', async ({ page }, testInfo) => {
  test.skip(!isMobile(testInfo), 'mobile only');
  await page.goto('/');
  await page.getByRole('button', { name: 'תפריט' }).click();
  await expect(page.locator('.sidedrawer')).toHaveClass(/open/);
  await page.locator('.sidedrawer').getByRole('link', { name: 'הדרכות ניווט' }).click();
  await expect(page).toHaveURL(/\/nav-guide\/$/);
  await expect(page.locator('.sidedrawer')).not.toHaveClass(/open/);

  await page.goto('/products');
  await page.getByRole('combobox', { name: 'בחר קטגוריה' }).selectOption('/products/garmin');
  await expect(page).toHaveURL(/\/products\/garmin\/$/);
  await page.getByRole('combobox', { name: 'בחר תת קטגוריה' }).selectOption('/products/garmin/devices');
  await expect(page).toHaveURL(/\/products\/garmin\/devices\/$/);
  await expect(page.getByText('מכשיר גרמין לבדיקה')).toBeVisible();
});
