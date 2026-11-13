#!/usr/bin/env node
// Generates Firebase security rules from firebase/*.template with the admin allowlist filled in:
//   firebase/database.rules.json, firebase/storage.rules   (git-ignored — they contain admin emails)
//
//   node scripts/build-rules.mjs              # production: ADMIN_EMAILS from env or .env.local (required)
//   node scripts/build-rules.mjs --emulator   # local emulators/tests: adds admin@rallytrip.test
//
// Rules: everyone can read; only the listed admin emails can write.
// Accounts can only be created from the Firebase console (sign-up is disabled there),
// so the email in the auth token is trustworthy.

import { readFile, writeFile } from 'node:fs/promises';

export const TEST_ADMIN = 'admin@rallytrip.test';
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
  return `auth != null && (${emails.map((e) => `auth.token.email === '${e}'`).join(' || ')})`;
}

export function storageCondition(emails) {
  return `request.auth != null && request.auth.token.email in [${emails.map((e) => `'${e}'`).join(', ')}]`;
}

export async function buildRules({ emulator = false } = {}) {
  const emails = parseEmails(await adminEmailsFromEnv());
  if (emulator && !emails.includes(TEST_ADMIN)) emails.push(TEST_ADMIN);
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
