import { describe, expect, it } from 'vitest';
import { absoluteUrl, legacyHashToPath, withSlash, withoutSlash } from './site';

describe('legacyHashToPath', () => {
  it('maps old HashRouter URLs to real (trailing-slash) paths', () => {
    expect(legacyHashToPath('#/products/garmin/watches')).toBe('/products/garmin/watches/');
    expect(legacyHashToPath('#/rally-abroad/')).toBe('/rally-abroad/');
    expect(legacyHashToPath('#/')).toBe('/');
  });
  it('ignores normal anchors', () => {
    expect(legacyHashToPath('#section')).toBeNull();
    expect(legacyHashToPath('')).toBeNull();
    expect(legacyHashToPath(undefined)).toBeNull();
  });
  it('rejects hashes that would leave the site', () => {
    expect(legacyHashToPath('#//evil.com')).toBeNull();
    expect(legacyHashToPath('#/\\evil.com')).toBeNull();
  });
});

describe('trailing slashes', () => {
  it('adds and removes them', () => {
    expect(withSlash('/products/garmin')).toBe('/products/garmin/');
    expect(withSlash('/products/garmin/')).toBe('/products/garmin/');
    expect(withSlash('/')).toBe('/');
    expect(withSlash('/a?b=1')).toBe('/a?b=1');
    expect(withoutSlash('/products/garmin/')).toBe('/products/garmin');
    expect(withoutSlash('/')).toBe('/');
  });
  it('builds absolute URLs', () => {
    expect(absoluteUrl('/nav-guide')).toBe('https://www.rallytrip.com/nav-guide/');
    expect(absoluteUrl('/')).toBe('https://www.rallytrip.com/');
  });
});
