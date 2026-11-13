import { describe, expect, it } from 'vitest';
import {
  categoryCovers,
  effectivePrice,
  featuredProducts,
  filterAndSortProducts,
  findCategory,
  isInStock,
  listingSlugs,
  pagePrice,
  previewPrice,
  productPath,
  parseSort,
  priorityOf,
  salePrice,
  resolveCategoryNames,
  sortProducts,
  subcategoryOptions,
} from './products';

const products = {
  a: { category: 'garmin', subcategory: 'watches', title: 'A', priority: '1' },
  b: { category: 'garmin', subcategory: 'devices', title: 'B', priority: '5' },
  c: { category: 'roadbooks', subcategory: 'sc', title: 'C' },
  d: { category: 'garmin', subcategory: 'watches', title: 'D', priority: '9', hide: true },
  e: { category: 'garmin', subcategory: 'watches', title: 'E', priority: 'x' },
};

describe('filterAndSortProducts', () => {
  const ids = (opts) => filterAndSortProducts(products, opts).map(([id]) => id);

  it('lists every visible product sorted by priority (high first)', () => {
    expect(ids({})).toEqual(['b', 'a', 'c', 'e']);
  });
  it('filters by category', () => {
    expect(ids({ category: 'garmin' })).toEqual(['b', 'a', 'e']);
  });
  it('filters by subcategory', () => {
    expect(ids({ category: 'garmin', subcategory: 'watches' })).toEqual(['a', 'e']);
  });
  it('never includes hidden products', () => {
    expect(ids({ category: 'garmin', subcategory: 'watches' })).not.toContain('d');
  });
  it('breaks priority ties by stock, then name (not database key order)', () => {
    const shop = {
      z: { title: 'Z', stock: '1' },
      y: { title: 'Y', stock: '0' },
      x: { title: 'X', stock: '2' },
    };
    expect(filterAndSortProducts(shop).map(([id]) => id)).toEqual(['x', 'z', 'y']);
  });
  it('handles empty/null data', () => {
    expect(filterAndSortProducts(null)).toEqual([]);
  });
});

describe('sortProducts', () => {
  const items = [
    ['p1', { title: 'בננה', price: '200', discount: '150', stock: '0', priority: '5' }], // effective 150
    ['p2', { title: 'אגס', price: '0', stock: '3', priority: '5' }], // contact for price
    ['p3', { title: 'גזר', price: '90', stock: '1', priority: '0' }],
    ['p4', { title: 'דובדבן', price: '150', stock: '2', priority: '0' }],
    ['p5', { title: ' Zebra', stock: '1' }], // contact for price; leading space is ignored
    ['p6', { title: 'גזר', price: '90', stock: '0', priority: '0' }],
  ];
  const ids = (sort) => sortProducts(items, sort).map(([id]) => id);

  it('default: priority, then in stock first, then name', () => {
    expect(ids('recommended')).toEqual(['p2', 'p1', 'p3', 'p4', 'p5', 'p6']);
    expect(ids(undefined)).toEqual(['p2', 'p1', 'p3', 'p4', 'p5', 'p6']);
    expect(ids('bogus')).toEqual(['p2', 'p1', 'p3', 'p4', 'p5', 'p6']);
  });
  it('price: effective (sale) price, unpriced last, then in stock first, then name', () => {
    expect(ids('price-asc')).toEqual(['p3', 'p6', 'p4', 'p1', 'p2', 'p5']);
    expect(ids('price-desc')).toEqual(['p4', 'p1', 'p3', 'p6', 'p2', 'p5']);
  });
  it('name (Hebrew collation: Hebrew before Latin), then in stock first', () => {
    expect(ids('name')).toEqual(['p2', 'p1', 'p3', 'p6', 'p4', 'p5']);
  });
  it('does not modify the input', () => {
    sortProducts(items, 'name');
    expect(items.map(([id]) => id)).toEqual(['p1', 'p2', 'p3', 'p4', 'p5', 'p6']);
  });
  it('priorityOf treats empty / invalid values as 0', () => {
    expect(priorityOf({ priority: '90' })).toBe(90);
    expect(priorityOf({ priority: '' })).toBe(0);
    expect(priorityOf({ priority: 'x' })).toBe(0);
    expect(priorityOf({})).toBe(0);
    expect(priorityOf(undefined)).toBe(0);
  });
  it('parseSort falls back to the default', () => {
    expect(parseSort('price-asc')).toBe('price-asc');
    expect(parseSort('nope')).toBe('recommended');
    expect(parseSort(null)).toBe('recommended');
  });
});

describe('prices', () => {
  it('sale price: a positive number below the regular price', () => {
    expect(salePrice({ price: '200', discount: '150' })).toBe(150);
    expect(salePrice({ price: '200', discount: 150 })).toBe(150);
    expect(salePrice({ price: '200', discount: '₪150' })).toBe(150); // older free-text value
    expect(salePrice({ price: '200', discount: '150 ש"ח' })).toBe(150);
    expect(salePrice({ price: '200', discount: 'מבצע!' })).toBeNull();
    expect(salePrice({ price: '200', discount: '10% הנחה' })).toBeNull();
    expect(salePrice({ price: '200', discount: '₪150 במקום ₪200' })).toBeNull();
    expect(salePrice({ price: '200', discount: '  ' })).toBeNull();
    expect(salePrice({ price: '200', discount: '200' })).toBeNull();
    expect(salePrice({ price: '200', discount: '0' })).toBeNull();
    expect(salePrice({ price: '0', discount: '150' })).toBeNull();
  });
  it('product page / card price', () => {
    expect(pagePrice({ price: '200', discount: '150' })).toEqual({ kind: 'discount', sale: 150, price: '200', percentOff: 25 });
    expect(pagePrice({ price: '0', discount: '150' })).toEqual({ kind: 'contact' });
    expect(pagePrice({ price: '120', discount: '' })).toEqual({ kind: 'price', price: '120' });
    expect(pagePrice({ price: '120', discount: 'מבצע' })).toEqual({ kind: 'price', price: '120' });
    expect(pagePrice({})).toEqual({ kind: 'contact' });
    expect(previewPrice({ price: '99' })).toEqual({ kind: 'price', price: '99' });
    expect(previewPrice({ price: 0 })).toEqual({ kind: 'contact' });
  });
  it('structured-data price prefers the sale price', () => {
    expect(effectivePrice({ price: '200', discount: '150' })).toBe(150);
    expect(effectivePrice({ price: '200', discount: 'מבצע' })).toBe(200);
    expect(effectivePrice({ price: '0' })).toBeNull();
  });
  it('stock', () => {
    expect(isInStock({ stock: '3' })).toBe(true);
    expect(isInStock({ stock: '0' })).toBe(false);
    expect(isInStock({})).toBe(false);
  });
});

describe('categories', () => {
  it('matches category slugs exactly (not by substring)', () => {
    expect(findCategory('garmin').name).toBe('גרמין');
    expect(findCategory('garmin-mounts')).toBeUndefined();
    expect(findCategory('roadbook')).toBeUndefined();
  });
  it('resolves Hebrew names', () => {
    expect(resolveCategoryNames('garmin', 'watches')).toEqual({ categoryName: 'גרמין', subcategoryName: 'שעונים' });
    expect(resolveCategoryNames('roadbooks', 'sc')).toEqual({ categoryName: 'סיפורי דרך', subcategoryName: null });
    expect(resolveCategoryNames('towers', 'sc')).toEqual({ categoryName: null, subcategoryName: null });
  });
  it('lists subcategory options', () => {
    expect(subcategoryOptions('garmin').map((o) => o.value)).toEqual(['watches', 'devices', 'garmin-mounts']);
    expect(subcategoryOptions('roadbooks')).toEqual([]);
  });
  it('enumerates listing slugs', () => {
    const slugs = listingSlugs();
    expect(slugs).toContainEqual([]);
    expect(slugs).toContainEqual(['garmin']);
    expect(slugs).toContainEqual(['garmin', 'watches']);
  });
  it('builds product paths, defaulting the subcategory to "sc"', () => {
    expect(productPath('x', { category: 'garmin', subcategory: 'watches' })).toBe('/products/garmin/watches/x');
    expect(productPath('y', { category: 'roadbooks' })).toBe('/products/roadbooks/sc/y');
  });
});

describe('featuredProducts', () => {
  const shop = {
    a: { category: 'garmin', title: 'A', priority: '1', image: 'a.png' },
    b: { category: 'garmin', title: 'B', priority: '5', image: 'b.png' },
    c: { category: 'roadbooks', title: 'C', priority: '0', price: '20', discount: '10', image: 'c.png' },
    d: { category: 'garmin', title: 'D', priority: '9', image: 'd.png', hide: true },
    e: { category: 'garmin', title: 'E', priority: '7' },
  };
  const ids = (n) => featuredProducts(shop, n).map(([id]) => id);

  it('puts discounted products first, then by priority, skipping hidden and image-less ones', () => {
    expect(ids()).toEqual(['c', 'b', 'a']);
  });
  it('respects the limit', () => {
    expect(ids(2)).toEqual(['c', 'b']);
  });
  it('handles missing data', () => {
    expect(featuredProducts(undefined)).toEqual([]);
  });
});

describe('categoryCovers', () => {
  it('uses the top-priority visible product image and counts products per category', () => {
    const covers = categoryCovers({
      a: { category: 'garmin', subcategory: 'watches', priority: '1', image: 'a.png' },
      b: { category: 'garmin', subcategory: 'watches', priority: '5' },
      c: { category: 'garmin', subcategory: 'watches', priority: '3', image: 'c.png' },
      d: { category: 'garmin', subcategory: 'watches', priority: '9', image: 'd.png', hide: true },
    });
    expect(covers.garmin).toEqual({ image: 'c.png', count: 3 });
    expect(covers.roadbooks).toEqual({ image: null, count: 0 });
  });
});
