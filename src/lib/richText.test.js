import { describe, expect, it } from 'vitest';
import { hasRichText, sanitizeRichText } from './richText';

describe('sanitizeRichText', () => {
  it('keeps Quill formatting', () => {
    const html = '<p class="ql-align-right ql-direction-rtl"><strong>שלום</strong> <span style="color: rgb(230, 0, 0);">עולם</span></p><ul><li>א</li></ul>';
    const out = sanitizeRichText(html);
    expect(out).toContain('class="ql-align-right ql-direction-rtl"');
    expect(out).toContain('<strong>שלום</strong>');
    expect(out).toContain('color:rgb(230, 0, 0)');
    expect(out).toContain('<ul><li>א</li></ul>');
  });
  it('removes scripts, event handlers and javascript: links', () => {
    const out = sanitizeRichText('<p onclick="x()">a</p><script>alert(1)</script><img src=x onerror=alert(1)><a href="javascript:alert(1)">b</a>');
    expect(out).not.toMatch(/script|onerror|onclick|javascript:/);
  });
  it('allows YouTube embeds only', () => {
    expect(sanitizeRichText('<iframe src="https://www.youtube.com/embed/abc"></iframe>')).toContain('youtube.com');
    expect(sanitizeRichText('<iframe src="https://evil.example/x"></iframe>')).not.toContain('evil');
  });
  it('handles non-strings', () => {
    expect(sanitizeRichText(null)).toBe('');
  });
});

describe('hasRichText', () => {
  it('treats the blank Quill document as empty', () => {
    expect(hasRichText('<p class="ql-align-right ql-direction-rtl"><br></p>')).toBe(false);
    expect(hasRichText('')).toBe(false);
    expect(hasRichText('<p class="ql-align-right ql-direction-rtl">some real content here</p>')).toBe(true);
  });
});
