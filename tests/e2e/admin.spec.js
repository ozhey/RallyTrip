import { expect, test } from '@playwright/test';

const ADMIN = { email: 'admin@rallytrip.test', password: 'admin-password' };
// Static (GitHub Pages) build: saving writes to the database but the pages only change on the next
// rebuild, so there we verify the database instead of the public pages.
const STATIC = process.env.E2E_STATIC === 'true';
const DB = 'http://127.0.0.1:9000';
const NS = 'ns=demo-rallytrip-default-rtdb';

async function findProductInDb(request, title) {
  const products = (await (await request.get(`${DB}/products.json?${NS}`)).json()) ?? {};
  const entry = Object.entries(products).find(([, p]) => p.title === title);
  return entry ? { id: entry[0], ...entry[1] } : null;
}
const TITLE = `מוצר בדיקה ${Date.now()}`;

test.describe.configure({ mode: 'serial' });

async function login(page) {
  await page.goto('/admin/');
  await page.getByLabel('אימייל').fill(ADMIN.email);
  await page.getByLabel('סיסמא').fill(ADMIN.password);
  await page.getByRole('button', { name: 'התחבר' }).click();
  await expect(page.getByRole('heading', { name: 'עמוד מנהל' })).toBeVisible();
}

async function expectDialog(page, text) {
  // Generous timeout: on a cold start the Storage emulator boots its rules runtime on the first upload.
  await expect(page.locator('.dialog')).toContainText(text, { timeout: 30_000 });
  await page.locator('.dialog').getByRole('button', { name: 'אישור' }).click();
}

const productRow = (page, title) => page.locator('.product-row').filter({ hasText: title });

async function openProductForEdit(page) {
  await expect(page.getByRole('tab', { name: 'מוצרים' })).toHaveAttribute('aria-selected', 'true'); // default tab
  await page.getByLabel('חיפוש לפי שם').fill(TITLE);
  await productRow(page, TITLE).click();
  await expect(page.getByRole('heading', { name: `עדכון מוצר "${TITLE}"` })).toBeVisible();
}

test('wrong password shows an error', async ({ page }) => {
  await page.goto('/admin/');
  await page.getByLabel('אימייל').fill(ADMIN.email);
  await page.getByLabel('סיסמא').fill('wrong-password');
  await page.getByRole('button', { name: 'התחבר' }).click();
  await expect(page.getByText('אימייל או סיסמה שגויים')).toBeVisible();
});

test('add a product with an image → appears on the site', async ({ page, request }) => {
  await login(page);
  await page.getByRole('button', { name: '+ מוצר חדש' }).click();
  await expect(page.getByRole('heading', { name: 'הוספת מוצר' })).toBeVisible();
  await page.getByLabel('כותרת').fill(TITLE);
  await page.getByLabel('מחיר', { exact: true }).fill('321');
  await page.getByLabel('תיאור').fill('תיאור מוצר בדיקה');
  await page.locator('#category').selectOption('roadbook-holders');
  await page.locator('#subcategory').selectOption('mounts');
  await page.getByLabel('מלאי').fill('3');
  await page.getByLabel(/עדיפות/).fill('100');
  await page.locator('#file').setInputFiles('public/logo192.png');
  await expect(page.locator('.img-preview')).toBeVisible();
  await page.locator('.form .ql-editor').fill('פרטים נוספים על מוצר הבדיקה');
  await page.locator('.form .ql-toolbar button.ql-list[value="bullet"]').click(); // Quill 2 list → must render as a real <ul>
  await page.getByRole('button', { name: 'העלה מוצר' }).click();
  await expectDialog(page, 'ההעלאה בוצעה בהצלחה');
  await expect(page.getByRole('heading', { name: `עדכון מוצר "${TITLE}"` })).toBeVisible(); // the new product stays open
  await expect(page).toHaveURL(/\?product=-/);

  if (STATIC) {
    const saved = await findProductInDb(request, TITLE);
    expect(saved).toMatchObject({ category: 'roadbook-holders', subcategory: 'mounts', price: '321', stock: '3', priority: '100' });
    expect(saved.image).toMatch(/127\.0\.0\.1:9199/);
    const details = await (await request.get(`${DB}/quill/${saved.id}.json?${NS}`)).json();
    expect(details).toContain('<ul><li>פרטים נוספים על מוצר הבדיקה</li></ul>');
    return;
  }
  await page.goto('/products/roadbook-holders/mounts/');
  const card = page.locator('.preview-container').first();
  await expect(card).toContainText(TITLE);
  await expect(card.locator('img')).toHaveAttribute('src', /127\.0\.0\.1:9199/);
  await card.click();
  await expect(page.getByRole('heading', { level: 1, name: TITLE })).toBeVisible();
  await expect(page.locator('.price')).toHaveText('₪321');
  await expect(page.locator('.ql-editor ul > li')).toHaveText('פרטים נוספים על מוצר הבדיקה');
});

test('edit the product → change is live without a rebuild', async ({ page, request }) => {
  await login(page);
  await openProductForEdit(page);
  await expect(page.getByLabel('כותרת')).toHaveValue(TITLE);
  await expect(page.locator('#subcategory')).toHaveValue('mounts');
  await page.getByLabel('מחיר', { exact: true }).fill('500');

  // Sale price must be lower than the regular price.
  await page.getByLabel(/מחיר מבצע/).fill('600');
  await page.getByRole('button', { name: 'שמור שינויים' }).click();
  await expect(page.getByText('מחיר המבצע חייב להיות נמוך מהמחיר הרגיל')).toBeVisible();
  await page.getByLabel(/מחיר מבצע/).fill('400');
  await expect(page.locator('.price-preview')).toContainText('₪400');
  await expect(page.locator('.price-preview')).toContainText('20% הנחה');
  await expect(page.getByText('יש שינויים שלא נשמרו')).toBeVisible();
  await page.getByRole('button', { name: 'שמור שינויים' }).click();
  await expectDialog(page, 'ההעלאה בוצעה בהצלחה');
  await expect(page.getByText('יש שינויים שלא נשמרו')).toHaveCount(0); // stays open, clean

  if (STATIC) {
    expect(await findProductInDb(request, TITLE)).toMatchObject({ price: '500', discount: '400' });
    return;
  }
  await page.goto('/products/roadbook-holders/mounts/');
  await page.locator('.preview-container').first().click();
  await expect(page.locator('.price')).toHaveText('₪400');
  await expect(page.locator('.old-price')).toHaveText('₪500');
  await expect(page.locator('.percent-off')).toHaveText('20% הנחה');
});

test('product list shows status badges', async ({ page }) => {
  await login(page);
  await expect(productRow(page, 'סיפור דרך במבצע').locator('.badge')).toHaveText(['מבצע', 'אזל מהמלאי']);
  await expect(productRow(page, 'מוצר מוסתר').locator('.badge')).toHaveText(['מוסתר']);
  await expect(productRow(page, 'מוצר מוסתר')).toHaveClass(/is-hidden/);
  await page.getByLabel('קטגוריה').selectOption('garmin');
  await expect(page.locator('.product-row')).toHaveCount(2);
  await page.getByLabel('חיפוש לפי שם').fill('אין כזה מוצר');
  await expect(page.getByText('לא נמצאו מוצרים.')).toBeVisible();
  await page.getByRole('button', { name: 'נקה סינון' }).click();
  await expect(page.getByLabel('חיפוש לפי שם')).toHaveValue('');
  await expect(productRow(page, 'מוצר מוסתר')).toBeVisible(); // all categories again
});

test('back button and deep links', async ({ page }) => {
  await login(page);
  await productRow(page, 'סיפור דרך לבדיקה').click();
  await expect(page.getByRole('heading', { name: 'עדכון מוצר "סיפור דרך לבדיקה"' })).toBeVisible();
  await page.goBack();
  await expect(page.getByLabel('חיפוש לפי שם')).toBeVisible(); // back on the list, still in the admin page
  await page.goto('/admin/?product=-TestRoadbook1'); // still signed in
  await expect(page.getByRole('heading', { name: 'עדכון מוצר "סיפור דרך לבדיקה"' })).toBeVisible();
  await page.goto('/admin/?product=nope');
  await expectDialog(page, 'המוצר לא נמצא');
  await expect(page.getByLabel('חיפוש לפי שם')).toBeVisible();
});

test('unsaved changes ask before leaving the product', async ({ page }) => {
  await login(page);
  await openProductForEdit(page);
  await page.getByLabel('כותרת').fill(`${TITLE} שינוי`);
  page.once('dialog', (d) => d.dismiss()); // "stay"
  await page.getByRole('tab', { name: 'ראליים בחו"ל' }).click();
  await expect(page.getByRole('tab', { name: 'מוצרים' })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByLabel('כותרת')).toHaveValue(`${TITLE} שינוי`);
  page.once('dialog', (d) => d.accept()); // "leave without saving"
  await page.getByRole('button', { name: '→ חזרה לרשימה' }).click();
  await expect(page.getByLabel('כותרת')).toHaveCount(0);
  await expect(page.getByLabel('חיפוש לפי שם')).toBeVisible();
});

test('delete the product → page is gone', async ({ page, request }) => {
  await login(page);
  await openProductForEdit(page);
  const productUrl = await page.evaluate(() => location.origin);
  page.once('dialog', (d) => d.accept());
  await page.getByRole('button', { name: 'מחק מוצר' }).click();
  await expectDialog(page, 'המוצר נמחק בהצלחה');
  await expect(page.getByLabel('חיפוש לפי שם')).toBeVisible(); // back on the list

  if (STATIC) {
    expect(await findProductInDb(request, TITLE)).toBeNull();
    return;
  }
  await page.goto(`${productUrl}/products/roadbook-holders/mounts/`);
  await expect(page.getByText(TITLE)).toHaveCount(0);
});

test('edit rally-abroad content', async ({ page, request }) => {
  await login(page);
  await page.getByRole('tab', { name: 'ראליים בחו"ל' }).click();
  const editor = page.locator('.abroad-edit .ql-editor');
  await expect(editor).toContainText('הראלי הבא: מרוקו 2027');
  const original = await editor.innerHTML();

  await editor.fill('עדכון בדיקה לראלי בחו"ל');
  await page.getByRole('button', { name: 'עדכן' }).click();
  await expectDialog(page, 'העדכון בוצע בהצלחה');
  if (STATIC) {
    expect(await (await request.get(`${DB}/abroad.json?${NS}`)).json()).toContain('עדכון בדיקה לראלי בחו'); // Quill stores " as &quot;
  } else {
    await page.goto('/rally-abroad/');
    await expect(page.getByText('עדכון בדיקה לראלי בחו"ל')).toBeVisible();
  }

  // Restore the fixture content for the other specs.
  await page.goto('/admin/');
  await page.getByRole('tab', { name: 'ראליים בחו"ל' }).click();
  await expect(editor).toContainText('עדכון בדיקה');
  await editor.evaluate((el, html) => { el.innerHTML = html; }, original);
  await expect(editor).toContainText('הראלי הבא: מרוקו 2027');
  await page.getByRole('button', { name: 'עדכן' }).click();
  await expectDialog(page, 'העדכון בוצע בהצלחה');
});
