#!/usr/bin/env node
// Generates Firebase security rules from firebase/*.template with the admin allowlist filled in:
//   firebase/database.rules.json, firebase/storage.rules   (git-ignored — they contain admin emails)
//
//   node scripts/build-rules.mjs              # production: ADMIN_EMAILS from env or .env.local (required)
//   node scripts/build-rules.mjs --emulator   # local emulators/tests: adds the test admins below
//
// Rules: everyone can read; only the listed admin emails can write (with REQUIRE_VERIFIED_EMAIL,
// only once that email is verified). Accounts are meant to be created from the Firebase console
// only (sign-up disabled there); the email_verified check keeps the rules safe even if sign-up is
// ever re-enabled.
// Deploy with `npm run rules:deploy` (it rebuilds for production first) — a plain `firebase deploy`
// after `npm run emulators` would ship the emulator rules with the test admins.

import { readFile, writeFile } from 'node:fs/promises';

// OFF for now: console-created accounts start unverified, and turning this on locked out the
// 119raz admin account. Verify every account in ADMIN_EMAILS first, then set this back to true
// and run `npm run rules:deploy`.
export const REQUIRE_VERIFIED_EMAIL = false;

export const TEST_ADMIN = 'admin@rallytrip.test';
// Allowlisted but never verified by the seed script — proves the email_verified check in tests.
export const TEST_UNVERIFIED_ADMIN = 'unverified-admin@rallytrip.test';
const EMAIL = /^[^\s@'"\\]+@[^\s@'"\\]+\.[^\s@'"\\]+$/;

async function adminEmailsFromEnv() {
  if (process.env.ADMIN_EMAILS !== undefined) return process.env.ADMIN_EMAILS;
  try {
    const env = await readFile('.env.local', 'utf8');
    return env.match(/^ADMIN_EMAILS=(.*)$/m)?.[1] ?? '';
  } catch {
    return '';
  }
}

export function parseEmails(value) {
  const emails = [...new Set(String(value).split(',').map((e) => e.trim().toLowerCase()).filter(Boolean))];
  const invalid = emails.filter((e) => !EMAIL.test(e));
  if (invalid.length) throw new Error(`Invalid admin email(s): ${invalid.join(', ')}`);
  return emails;
}

export function databaseCondition(emails) {
  const verified = REQUIRE_VERIFIED_EMAIL ? ' && auth.token.email_verified === true' : '';
  return `auth != null${verified} && (${emails.map((e) => `auth.token.email === '${e}'`).join(' || ')})`;
}

export function storageCondition(emails) {
  const verified = REQUIRE_VERIFIED_EMAIL ? ' && request.auth.token.email_verified == true' : '';
  return `request.auth != null${verified} && request.auth.token.email in [${emails.map((e) => `'${e}'`).join(', ')}]`;
}

export async function buildRules({ emulator = false } = {}) {
  const emails = parseEmails(await adminEmailsFromEnv());
  if (emulator) {
    const testAdmins = REQUIRE_VERIFIED_EMAIL ? [TEST_ADMIN, TEST_UNVERIFIED_ADMIN] : [TEST_ADMIN];
    for (const email of testAdmins) if (!emails.includes(email)) emails.push(email);
  }
  if (!emails.length) throw new Error('ADMIN_EMAILS is empty — set it in .env.local (comma-separated).');

  const db = (await readFile('firebase/database.rules.template.json', 'utf8')).replaceAll('__IS_ADMIN__', databaseCondition(emails));
  JSON.parse(db); // sanity check
  const storage = (await readFile('firebase/storage.rules.template', 'utf8')).replaceAll('__IS_ADMIN__', storageCondition(emails));
  await writeFile('firebase/database.rules.json', db);
  await writeFile('firebase/storage.rules', storage);
  return emails;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const emulator = process.argv.includes('--emulator');
  buildRules({ emulator })
    .then((emails) => console.log(`Rules written to firebase/ (${emulator ? 'emulator' : 'production'}); admins: ${emails.join(', ')}`))
    .catch((err) => {
      console.error(err.message);
      process.exit(1);
    });
}
