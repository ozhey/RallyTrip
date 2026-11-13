import { describe, expect, it } from 'vitest';
import { resolveProductsRoute } from './productRoute';

const products = {
  w1: { category: 'garmin', subcategory: 'watches', title: 'Watch' },
  r1: { category: 'roadbooks', subcategory: 'sc', title: 'Roadbook' },
  h1: { category: 'roadbooks', subcategory: 'sc', title: 'Hidden', hide: true },
};

describe('resolveProductsRoute', () => {
  it('listing pages', () => {
    expect(resolveProductsRoute([], products)).toEqual({ type: 'listing' });
    expect(resolveProductsRoute(['garmin'], products)).toEqual({ type: 'listing', category: 'garmin' });
    expect(resolveProductsRoute(['garmin', 'watches'], products)).toEqual({ type: 'listing', category: 'garmin', subcategory: 'watches' });
  });
  it('unknown categories and subcategories are 404s', () => {
    expect(resolveProductsRoute(['nope'], products).type).toBe('notFound');
    expect(resolveProductsRoute(['roadbooks', 'sc'], products).type).toBe('notFound');
    expect(resolveProductsRoute(['garmin', 'nope'], products).type).toBe('notFound');
  });
  it('product pages', () => {
    expect(resolveProductsRoute(['garmin', 'watches', 'w1'], products)).toMatchObject({ type: 'product', id: 'w1' });
  });
  it('hidden, missing and too-deep paths are 404s', () => {
    expect(resolveProductsRoute(['roadbooks', 'sc', 'h1'], products).type).toBe('notFound');
    expect(resolveProductsRoute(['roadbooks', 'sc', 'missing'], products).type).toBe('notFound');
    expect(resolveProductsRoute(['roadbooks', 'sc', 'toString'], products).type).toBe('notFound');
    expect(resolveProductsRoute(['a', 'b', 'c', 'd'], products).type).toBe('notFound');
  });
  it('redirects a product reached through the wrong category to its canonical URL', () => {
    expect(resolveProductsRoute(['garmin', 'sc', 'r1'], products)).toEqual({ type: 'redirect', path: '/products/roadbooks/sc/r1' });
  });
});
