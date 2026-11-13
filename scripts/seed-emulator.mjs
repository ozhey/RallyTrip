#!/usr/bin/env node
// Seeds the local Firebase emulators (npm run emulators) with data and an admin user.
//
// Usage:
//   node scripts/seed-emulator.mjs                      # tests/fixtures/seed.json
//   node scripts/seed-emulator.mjs backup/db-*.json     # a real DB export (e.g. from npm run backup)
//
// Admin login for the emulator: admin@rallytrip.test / admin-password

import { readFile } from 'node:fs/promises';

export const EMULATOR_PROJECT = 'demo-rallytrip';
export const ADMIN = { email: 'admin@rallytrip.test', password: 'admin-password' };
// A signed-in user who is NOT an admin — used to prove the rules block writes from other accounts.
export const NON_ADMIN = { email: 'user@rallytrip.test', password: 'user-password' };
const DB = `http://127.0.0.1:9000/.json?ns=${EMULATOR_PROJECT}-default-rtdb`;
const AUTH = 'http://127.0.0.1:9099';

export async function seedEmulator(file = 'tests/fixtures/seed.json') {
  const data = JSON.parse(await readFile(file, 'utf8'));
  const put = await fetch(DB, {
    method: 'PUT',
    headers: { Authorization: 'Bearer owner', 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!put.ok) throw new Error(`Seeding database failed: ${put.status} ${await put.text()}`);

  await fetch(`${AUTH}/emulator/v1/projects/${EMULATOR_PROJECT}/accounts`, { method: 'DELETE' });
  for (const user of [ADMIN, NON_ADMIN]) {
    const signUp = await fetch(`${AUTH}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=demo-api-key`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...user, returnSecureToken: true }),
    });
    if (!signUp.ok) throw new Error(`Creating ${user.email} failed: ${signUp.status} ${await signUp.text()}`);
  }
  return data;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const file = process.argv[2];
  seedEmulator(file)
    .then(() => console.log(`Seeded emulators from ${file || 'tests/fixtures/seed.json'}; admin: ${ADMIN.email} / ${ADMIN.password}`))
    .catch((err) => {
      console.error(err.message);
      process.exit(1);
    });
}
