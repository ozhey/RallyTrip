import 'server-only';
import { dbRestUrl } from './config';

// Server-side reads go through the Realtime Database REST API so pages can be
// rendered and cached by Next.js (ISR). Admin saves call updateTag() to refresh.

export const REVALIDATE_SECONDS = 3600;
export const TAGS = { products: 'products', abroad: 'abroad' };

async function readPath(path, tags) {
  const res = await fetch(dbRestUrl(path), {
    next: { revalidate: REVALIDATE_SECONDS, tags },
  });
  if (!res.ok) throw new Error(`Firebase read failed for "${path}": ${res.status}`);
  return res.json();
}

/** All products keyed by id (includes hidden ones). */
export async function getProducts() {
  return (await readPath('products', [TAGS.products])) ?? {};
}

/** Rich-text (Quill HTML) details for one product, or ''. */
export async function getProductDetails(id) {
  if (!/^[\w-]+$/.test(id)) return '';
  return (await readPath(`quill/${id}`, [TAGS.products])) ?? '';
}

/** Rich-text (Quill HTML) for the rally-abroad page, or ''. */
export async function getAbroadContent() {
  return (await readPath('abroad', [TAGS.abroad])) ?? '';
}
