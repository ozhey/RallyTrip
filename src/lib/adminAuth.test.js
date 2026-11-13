import { afterEach, describe, expect, it, vi } from 'vitest';
import { isAdminEmail, verifyIdToken } from './adminAuth';

afterEach(() => vi.unstubAllGlobals());

describe('isAdminEmail', () => {
  it('allows any signed-in user when no allowlist is configured', () => {
    expect(isAdminEmail('a@b.com', '')).toBe(true);
  });
  it('enforces the allowlist case-insensitively', () => {
    expect(isAdminEmail('Raz@Example.com', 'raz@example.com, oz@example.com')).toBe(true);
    expect(isAdminEmail('intruder@example.com', 'raz@example.com')).toBe(false);
  });
  it('rejects missing emails', () => {
    expect(isAdminEmail(null, '')).toBe(false);
  });
});

describe('verifyIdToken', () => {
  it('returns the email for a valid token', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, json: async () => ({ users: [{ email: 'Raz@Example.com', emailVerified: true }] }) })));
    await expect(verifyIdToken('x'.repeat(40))).resolves.toBe('raz@example.com');
  });
  it('returns null for an unverified email', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, json: async () => ({ users: [{ email: 'raz@example.com', emailVerified: false }] }) })));
    await expect(verifyIdToken('x'.repeat(40))).resolves.toBeNull();
  });
  it('returns null when Firebase rejects the token', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: false, json: async () => ({}) })));
    await expect(verifyIdToken('x'.repeat(40))).resolves.toBeNull();
  });
  it('does not call Firebase for obviously invalid tokens', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    await expect(verifyIdToken(undefined)).resolves.toBeNull();
    await expect(verifyIdToken('short')).resolves.toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
