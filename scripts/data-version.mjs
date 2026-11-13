#!/usr/bin/env node
// Prints a short hash of the whole Realtime Database (public read).
// The GitHub Pages deploy writes it to /data-version.txt; the scheduled workflow compares the live
// value with the current one and only rebuilds the static site when the data actually changed.
import { createHash } from 'node:crypto';

const dbUrl = (process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || 'https://rally-trip.firebaseio.com').replace(/\/$/, '');

const res = await fetch(`${dbUrl}/.json`);
if (!res.ok) {
  console.error(`Database read failed: ${res.status} ${res.statusText}`);
  process.exit(1);
}
const data = await res.json();
console.log(createHash('sha256').update(JSON.stringify(data)).digest('hex').slice(0, 16));
