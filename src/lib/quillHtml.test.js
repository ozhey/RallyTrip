import { describe, expect, it } from 'vitest';
import { normalizeQuillSpaces } from './quillHtml';

describe('normalizeQuillSpaces', () => {
  it('turns Quill 2 space entities back into wrapping spaces', () => {
    expect(normalizeQuillSpaces('<p>שלום&nbsp;עולם&nbsp;יפה</p>')).toBe('<p>שלום עולם יפה</p>');
  });
  it('keeps the width of multiple spaces', () => {
    expect(normalizeQuillSpaces('<p>a&nbsp;&nbsp;&nbsp;b</p>')).toBe('<p>a &nbsp;&nbsp;b</p>');
  });
  it('leaves real non-breaking spaces (raw U+00A0) alone', () => {
    expect(normalizeQuillSpaces('<p>32 מ"מ&nbsp;רמקול</p>')).toBe('<p>32 מ"מ רמקול</p>');
  });
  it('ignores non-strings', () => {
    expect(normalizeQuillSpaces(undefined)).toBeUndefined();
  });
});
