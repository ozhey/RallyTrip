#!/usr/bin/env node
// Backs up the Realtime Database and every Firebase Storage file it references.
//
// Usage:
//   node scripts/backup-storage.mjs                 # fetch live DB from NEXT_PUBLIC_FIREBASE_DATABASE_URL (or prod default)
//   node scripts/backup-storage.mjs path/to/db.json # use an existing DB export instead
//
// Output: backup/<date>/db.json and backup/<date>/storage/<object path>
// Only files referenced from the DB are downloaded. For a full bucket copy (including
// orphaned files) use: gcloud storage cp -r gs://<bucket> backup/<date>/bucket

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const DEFAULT_DB_URL = 'https://rally-trip.firebaseio.com';
const dbUrl = (process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || DEFAULT_DB_URL).replace(/\/$/, '');
const date = new Date().toISOString().slice(0, 10);
const outDir = path.resolve('backup', date);

async function loadDb() {
  const file = process.argv[2];
  if (file) return JSON.parse(await readFile(file, 'utf8'));
  const res = await fetch(`${dbUrl}/.json`);
  if (!res.ok) throw new Error(`DB fetch failed: ${res.status} ${res.statusText}`);
  return res.json();
}

function collectStorageUrls(db) {
  const text = JSON.stringify(db);
  const matches = text.match(/https:\/\/firebasestorage\.googleapis\.com\/[^"\\\s<>]+/g) || [];
  return [...new Set(matches.map((u) => u.replace(/&amp;/g, '&')))];
}

function objectPathFromUrl(url) {
  // https://firebasestorage.googleapis.com/v0/b/<bucket>/o/<encoded path>?alt=media&token=...
  const { pathname } = new URL(url);
  const encoded = pathname.split('/o/')[1];
  return decodeURIComponent(encoded);
}

async function main() {
  const db = await loadDb();
  await mkdir(outDir, { recursive: true });
  await writeFile(path.join(outDir, 'db.json'), JSON.stringify(db, null, 2));

  const urls = collectStorageUrls(db);
  console.log(`Found ${urls.length} storage files referenced from the DB`);
  const manifest = [];
  let failed = 0;

  for (const url of urls) {
    const objectPath = objectPathFromUrl(url);
    const dest = path.join(outDir, 'storage', objectPath);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const buf = Buffer.from(await res.arrayBuffer());
      await mkdir(path.dirname(dest), { recursive: true });
      await writeFile(dest, buf);
      manifest.push({ objectPath, url, bytes: buf.length, contentType: res.headers.get('content-type') });
      process.stdout.write('.');
    } catch (err) {
      failed++;
      manifest.push({ objectPath, url, error: String(err) });
      console.error(`\nFailed ${objectPath}: ${err}`);
    }
  }

  await writeFile(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
  console.log(`\nSaved ${urls.length - failed}/${urls.length} files to ${outDir}`);
  if (failed) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
