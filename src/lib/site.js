export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.rallytrip.com').replace(/\/$/, '');
export const SITE_NAME = 'Rally Trip ראלי טריפ';
export const SITE_DESCRIPTION =
  'ראלי טריפ עוסקת במכירת מוצרים הקשורים לעולם הראלי רייד (ספרי דרך, סיפורי דרך, גרמין, גופרו, מדי מרחק), בהדרכות ניווט ובהוצאת קבוצות למרוצים בחול';
export const PRODUCTS_DESCRIPTION =
  'בראלי טריפ ניתן לרכוש מגווון מוצרים הקשורים לעולם הראלי רייד ולשטח בכלל. ספרי דרך, מכשירי גרמין, דיבוריות, מצלמות גופרו ועוד';
export const LOGO_URL = `${SITE_URL}/logo512.png`;

/**
 * The site uses trailing-slash URLs (next.config trailingSlash: true) so the same URLs work
 * on GitHub Pages (folders with index.html) and on a server host. '/products/x' → '/products/x/'.
 */
export function withSlash(path) {
  if (!path || path.endsWith('/') || /[?#]/.test(path)) return path;
  return `${path}/`;
}

/** '/products/x/' → '/products/x' (root stays '/'). */
export function withoutSlash(path) {
  if (!path || path === '/') return path;
  return path.replace(/\/+$/, '') || '/';
}

/** Absolute URL for a site path, with trailing slash. */
export function absoluteUrl(path) {
  return `${SITE_URL}${withSlash(path)}`;
}

/**
 * Old SPA used HashRouter (https://www.rallytrip.com/#/products/...).
 * Maps such a hash to the new real path, or null if it isn't a legacy route.
 */
export function legacyHashToPath(hash) {
  if (typeof hash !== 'string' || !hash.startsWith('#/')) return null;
  return withSlash(withoutSlash(hash.slice(1)));
}
