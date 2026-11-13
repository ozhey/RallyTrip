// Firebase settings shared by client and server code.
// With NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true everything points at the local emulator suite
// (see firebase.json) under a "demo-" project, so nothing can touch production.

export const useEmulator = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true';

export const EMULATOR_HOST = '127.0.0.1';
export const EMULATOR_PORTS = { auth: 9099, database: 9000, storage: 9199 };
export const EMULATOR_PROJECT_ID = 'demo-rallytrip';
const EMULATOR_DB_NAMESPACE = `${EMULATOR_PROJECT_ID}-default-rtdb`;

export const firebaseConfig = useEmulator
  ? {
      apiKey: 'demo-api-key',
      authDomain: `${EMULATOR_PROJECT_ID}.firebaseapp.com`,
      databaseURL: `http://${EMULATOR_HOST}:${EMULATOR_PORTS.database}?ns=${EMULATOR_DB_NAMESPACE}`,
      projectId: EMULATOR_PROJECT_ID,
      storageBucket: `${EMULATOR_PROJECT_ID}.appspot.com`,
      appId: 'demo-app-id',
    }
  : {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };

/** REST URL for a Realtime Database path, e.g. dbRestUrl('products') */
export function dbRestUrl(path) {
  const clean = path.replace(/^\/+|\/+$/g, '');
  if (useEmulator) {
    return `http://${EMULATOR_HOST}:${EMULATOR_PORTS.database}/${clean}.json?ns=${EMULATOR_DB_NAMESPACE}`;
  }
  return `${firebaseConfig.databaseURL.replace(/\/$/, '')}/${clean}.json`;
}

/** Identity Toolkit endpoint used to verify ID tokens server-side. */
export function identityToolkitUrl(method) {
  const base = useEmulator
    ? `http://${EMULATOR_HOST}:${EMULATOR_PORTS.auth}/identitytoolkit.googleapis.com`
    : 'https://identitytoolkit.googleapis.com';
  return `${base}/v1/${method}?key=${firebaseConfig.apiKey}`;
}
