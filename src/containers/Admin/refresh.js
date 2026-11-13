import { refreshContent } from '@/lib/actions';

/** Ask the server to refresh cached public pages after an admin change. Never throws. */
export async function refreshPublicPages(auth, tags) {
  try {
    const token = await auth.currentUser?.getIdToken();
    if (!token) return;
    const result = await refreshContent(token, tags);
    if (!result?.ok) console.warn('Cache refresh rejected:', result?.error);
  } catch (err) {
    console.warn('Cache refresh failed:', err);
  }
}

/** Extra text for the "saved" dialog: on the static (GitHub Pages) build changes go live on the next rebuild. */
export const PUBLISH_NOTE = process.env.NEXT_PUBLIC_STATIC_EXPORT === 'true' ? ' השינויים יופיעו באתר תוך כרבע שעה.' : '';
