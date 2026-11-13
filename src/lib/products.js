import { links, PRODUCTS_ROOT } from '../links';

const lastSegment = (path) => path.slice(path.lastIndexOf('/') + 1);

/** Category entry from links.js by its URL slug, or undefined. */
export function findCategory(categorySlug) {
  return links.find((link) => lastSegment(link.path) === categorySlug);
}

/** Subcategory entry under a category by slug, or undefined. */
export function findSubcategory(categorySlug, subcategorySlug) {
  return findCategory(categorySlug)?.routes.find((route) => lastSegment(route.path) === subcategorySlug);
}

/** Hebrew display names for a category / subcategory pair (null when unknown). */
export function resolveCategoryNames(categorySlug, subcategorySlug) {
  return {
    categoryName: findCategory(categorySlug)?.name ?? null,
    subcategoryName: findSubcategory(categorySlug, subcategorySlug)?.name ?? null,
  };
}

/** Category options for admin <select>s: [{ value, label }]. */
export function categoryOptions() {
  return links.map((link) => ({ value: lastSegment(link.path), label: link.name }));
}

/** Subcategory options for a category: [{ value, label }] (empty when it has none). */
export function subcategoryOptions(categorySlug) {
  return (findCategory(categorySlug)?.routes ?? []).map((route) => ({
    value: lastSegment(route.path),
    label: route.name,
  }));
}

/**
 * Visible products for a listing, sorted by priority (high first).
 * Same matching as the original SPA: a subcategory filter matches on subcategory alone.
 * @returns {Array<[string, object]>} [id, product] pairs
 */
export function filterAndSortProducts(products, { category, subcategory } = {}) {
  return Object.entries(products ?? {})
    .filter(
      ([, p]) =>
        (!category || (category === p.category && !subcategory) || subcategory === p.subcategory) &&
        p.hide !== true,
    )
    .sort(([, a], [, b]) => (parseInt(b.priority) || 0) - (parseInt(a.priority) || 0));
}

/** Canonical URL path of a product page. */
export function productPath(id, product) {
  return `${PRODUCTS_ROOT}${product.category}/${product.subcategory || 'sc'}/${id}`;
}

/** Number from a price-like value ("150", 150, "₪150", "150 ש\"ח"), or NaN for anything else ("10% הנחה"). */
export function toNumber(value) {
  if (typeof value === 'number') return value;
  const cleaned = String(value ?? '').replace(/₪|ש"ח|ש״ח|,|\s/g, '');
  return /^\d+(\.\d+)?$/.test(cleaned) ? parseFloat(cleaned) : NaN;
}

/**
 * Sale price as a number, or null when there's no valid sale.
 * Valid only with a regular price and a lower, positive sale price.
 * Older products may hold free text (e.g. "₪150" or "מבצע!"); a number inside it is used, otherwise no sale.
 */
export function salePrice({ price = 0, discount = '' } = {}) {
  const base = toNumber(price);
  const sale = toNumber(discount);
  return base > 0 && sale > 0 && sale < base ? sale : null;
}

/**
 * Price display for the product page and product cards.
 * @returns {{kind:'discount', sale:number, price:string|number, percentOff:number} | {kind:'price', price:string|number} | {kind:'contact'}}
 */
export function pagePrice(product = {}) {
  const { price = 0 } = product;
  const sale = salePrice(product);
  if (sale !== null) return { kind: 'discount', sale, price, percentOff: Math.round((1 - sale / toNumber(price)) * 100) };
  if (price > 0) return { kind: 'price', price };
  return { kind: 'contact' };
}

/** Price display for a product card in listings (same rules as the product page). */
export const previewPrice = pagePrice;

/** Numeric price for structured data (the sale price when on sale), or null. */
export function effectivePrice(product = {}) {
  const base = toNumber(product.price);
  return salePrice(product) ?? (base > 0 ? base : null);
}

export function isInStock(product) {
  return parseInt(product?.stock) > 0;
}

/** Every listing slug the site exposes: [], [category], [category, subcategory]. */
export function listingSlugs() {
  const slugs = [[]];
  for (const link of links) {
    const category = lastSegment(link.path);
    slugs.push([category]);
    for (const route of link.routes) slugs.push([category, lastSegment(route.path)]);
  }
  return slugs;
}

/**
 * Products for the homepage "featured" strip: visible products with an image,
 * discounted ones first, then by priority (high first).
 * @returns {Array<[string, object]>} [id, product] pairs
 */
export function featuredProducts(products, limit = 8) {
  const visible = filterAndSortProducts(products).filter(([, p]) => p.image);
  const onSale = visible.filter(([, p]) => previewPrice(p).kind === 'discount');
  const rest = visible.filter(([, p]) => previewPrice(p).kind !== 'discount');
  return [...onSale, ...rest].slice(0, limit);
}

/**
 * Cover image and product count per category, for the homepage category tiles.
 * The cover is the image of the category's highest-priority visible product.
 * @returns {Record<string, {image: string|null, count: number}>} keyed by category slug
 */
export function categoryCovers(products) {
  const covers = {};
  for (const link of links) {
    const slug = lastSegment(link.path);
    const items = filterAndSortProducts(products, { category: slug });
    covers[slug] = {
      image: items.find(([, p]) => p.image)?.[1].image ?? null,
      count: items.length,
    };
  }
  return covers;
}
