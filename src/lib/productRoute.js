import { findCategory, findSubcategory, productPath } from './products';

/**
 * Resolves /products/[[...slug]] to what should be rendered.
 * @returns {{type:'listing', category?:string, subcategory?:string}
 *   | {type:'product', id:string, product:object, category:string, subcategory:string}
 *   | {type:'redirect', path:string}
 *   | {type:'notFound'}}
 */
export function resolveProductsRoute(slug = [], products = {}) {
  const [category, subcategory, id] = slug;
  switch (slug.length) {
    case 0:
      return { type: 'listing' };
    case 1:
      return findCategory(category) ? { type: 'listing', category } : { type: 'notFound' };
    case 2:
      return findSubcategory(category, subcategory) ? { type: 'listing', category, subcategory } : { type: 'notFound' };
    case 3: {
      const product = Object.prototype.hasOwnProperty.call(products, id) ? products[id] : undefined;
      if (!product || product.hide === true) return { type: 'notFound' };
      const canonical = productPath(id, product);
      if (canonical !== `/products/${category}/${subcategory}/${id}`) return { type: 'redirect', path: canonical };
      return { type: 'product', id, product, category, subcategory };
    }
    default:
      return { type: 'notFound' };
  }
}
