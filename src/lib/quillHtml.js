// Quill 2's getSemanticHTML() writes every normal space as "&nbsp;" (quill/core/editor.js), which stops
// text from wrapping on the site. Real non-breaking spaces stay raw U+00A0 characters in its output,
// so turning the entities back into spaces is safe. Runs of spaces keep their width.
export function normalizeQuillSpaces(html) {
  if (typeof html !== 'string') return html;
  return html.replace(/(?:&nbsp;)+/g, (run) => {
    const count = run.length / '&nbsp;'.length;
    return ' ' + '&nbsp;'.repeat(count - 1);
  });
}
