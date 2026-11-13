import 'server-only';
import { identityToolkitUrl } from './firebase/config';

/** Verifies a Firebase ID token via the Identity Toolkit REST API. Returns the user's verified email or null. */
export async function verifyIdToken(idToken) {
  if (typeof idToken !== 'string' || idToken.length < 20) return null;
  const res = await fetch(identityToolkitUrl('accounts:lookup'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
    cache: 'no-store',
  });
  if (!res.ok) return null;
  const data = await res.json();
  const user = data?.users?.[0];
  // Same rule as the Firebase security rules: an unverified email proves nothing.
  if (user?.emailVerified !== true) return null;
  return user.email?.toLowerCase() ?? null;
}

/** True when the email is in ADMIN_EMAILS (or when no allowlist is configured). */
export function isAdminEmail(email, adminEmails = process.env.ADMIN_EMAILS) {
  if (!email) return false;
  const allowed = (adminEmails || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return allowed.length === 0 || allowed.includes(email.toLowerCase());
}
