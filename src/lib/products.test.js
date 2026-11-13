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
  resolveCategoryNames,
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
  it('handles empty/null data', () => {
    expect(filterAndSortProducts(null)).toEqual([]);
  });
});

describe('prices', () => {
  it('product page: discount shown only with a price', () => {
    expect(pagePrice({ price: '200', discount: '₪150' })).toEqual({ kind: 'discount', discount: '₪150', price: '200' });
    expect(pagePrice({ price: '0', discount: '₪150' })).toEqual({ kind: 'contact' });
    expect(pagePrice({ price: '120', discount: '' })).toEqual({ kind: 'price', price: '120' });
    expect(pagePrice({})).toEqual({ kind: 'contact' });
  });
  it('preview card: discount text wins even without a price', () => {
    expect(previewPrice({ price: '0', discount: 'מבצע!' })).toEqual({ kind: 'discount', discount: 'מבצע!' });
    expect(previewPrice({ price: '99' })).toEqual({ kind: 'price', price: '99' });
    expect(previewPrice({ price: 0 })).toEqual({ kind: 'contact' });
  });
  it('structured-data price prefers a numeric discount', () => {
    expect(effectivePrice({ price: '200', discount: '₪150' })).toBe(150);
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
    c: { category: 'roadbooks', title: 'C', priority: '0', discount: '₪10', image: 'c.png' },
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
