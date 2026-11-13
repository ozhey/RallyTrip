'use server';

import { updateTag } from 'next/cache';
import { isAdminEmail, verifyIdToken } from './adminAuth';

const ALLOWED_TAGS = new Set(['products', 'abroad']);

/**
 * Called by the admin UI after a successful save/delete so the public pages
 * (ISR-cached) show the change on the next request.
 */
export async function refreshContent(idToken, tags) {
  const email = await verifyIdToken(idToken);
  if (!isAdminEmail(email)) return { ok: false, error: 'unauthorized' };
  const valid = (Array.isArray(tags) ? tags : []).filter((t) => ALLOWED_TAGS.has(t));
  valid.forEach((tag) => updateTag(tag));
  return { ok: true, tags: valid };
}
