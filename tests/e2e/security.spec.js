import { expect, test } from '@playwright/test';

// Talks to the emulators directly (like an attacker with the public API key would).
const DB = 'http://127.0.0.1:9000';
const NS = 'ns=demo-rallytrip-default-rtdb';
const AUTH = 'http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1';
const STORAGE = 'http://127.0.0.1:9199/v0/b/demo-rallytrip.appspot.com/o';

async function idToken(request, email, password) {
  const res = await request.post(`${AUTH}/accounts:signInWithPassword?key=demo-api-key`, {
    data: { email, password, returnSecureToken: true },
  });
  expect(res.ok()).toBe(true);
  return (await res.json()).idToken;
}

test.describe('Firebase security rules', () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'runs once');
  });

  test('anyone can read products', async ({ request }) => {
    const res = await request.get(`${DB}/products/-TestRoadbook1/title.json?${NS}`);
    expect(res.status()).toBe(200);
    expect(await res.json()).toBe('סיפור דרך לבדיקה');
  });

  test('anonymous writes are rejected', async ({ request }) => {
    for (const path of ['products/-Evil', 'quill/-Evil', 'abroad', 'admins']) {
      const res = await request.put(`${DB}/${path}.json?${NS}`, { data: '"x"' });
      expect(res.status(), path).toBe(401);
    }
  });

  test('a signed-in user who is not an admin cannot write', async ({ request }) => {
    const token = await idToken(request, 'user@rallytrip.test', 'user-password');
    const db = await request.put(`${DB}/abroad.json?${NS}&auth=${token}`, { data: '"hacked"' });
    expect(db.status()).toBe(401);
    const upload = await request.post(`${STORAGE}?name=${encodeURIComponent('products/-Evil/image.png')}`, {
      headers: { Authorization: `Firebase ${token}`, 'Content-Type': 'image/png' },
      data: Buffer.from('not really a png'),
    });
    expect(upload.status()).toBe(403);
  });

  test('an allowlisted email that is not verified cannot write', async ({ request }) => {
    const token = await idToken(request, 'unverified-admin@rallytrip.test', 'unverified-password');
    const db = await request.put(`${DB}/abroad.json?${NS}&auth=${token}`, { data: '"hacked"' });
    expect(db.status()).toBe(401);
    const upload = await request.post(`${STORAGE}?name=${encodeURIComponent('products/-Evil/image.png')}`, {
      headers: { Authorization: `Firebase ${token}`, 'Content-Type': 'image/png' },
      data: Buffer.from('not really a png'),
    });
    expect(upload.status()).toBe(403);
  });

  test('an admin can write, but not outside the allowed paths', async ({ request }) => {
    const token = await idToken(request, 'admin@rallytrip.test', 'admin-password');
    const ok = await request.put(`${DB}/products/-TestRoadbook1/stock.json?${NS}&auth=${token}`, { data: '"4"' });
    expect(ok.status()).toBe(200);
    const elsewhere = await request.put(`${DB}/somethingElse.json?${NS}&auth=${token}`, { data: '"x"' });
    expect(elsewhere.status()).toBe(401);
    const notImage = await request.post(`${STORAGE}?name=${encodeURIComponent('products/-X/image.png')}`, {
      headers: { Authorization: `Firebase ${token}`, 'Content-Type': 'text/html' },
      data: Buffer.from('<script>alert(1)</script>'),
    });
    expect(notImage.status()).toBe(403);
  });
});
