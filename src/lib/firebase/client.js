'use client';

import { getApp, getApps, initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectDatabaseEmulator, getDatabase } from 'firebase/database';
import { connectStorageEmulator, getStorage } from 'firebase/storage';
import { EMULATOR_HOST, EMULATOR_PORTS, firebaseConfig, useEmulator } from './config';

let services;

/** Lazily initialised Firebase client services (browser only). */
export function getFirebase() {
  if (services) return services;
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  const db = getDatabase(app);
  const auth = getAuth(app);
  const storage = getStorage(app);
  if (useEmulator) {
    connectDatabaseEmulator(db, EMULATOR_HOST, EMULATOR_PORTS.database);
    connectAuthEmulator(auth, `http://${EMULATOR_HOST}:${EMULATOR_PORTS.auth}`, { disableWarnings: true });
    connectStorageEmulator(storage, EMULATOR_HOST, EMULATOR_PORTS.storage);
  }
  services = { app, db, auth, storage };
  return services;
}
