import { sanitizeRichText } from '@/lib/richText';

/**
 * Server-rendered read-only Quill content. Mirrors the DOM that <ReactQuill theme="bubble" readOnly />
 * produced on the old site so existing CSS (.quill, .ql-bubble .ql-editor) still applies.
 */
export default function RichText({ html }) {
  return (
    <div className="quill">
      <div className="ql-container ql-bubble ql-disabled">
        <div className="ql-editor" dangerouslySetInnerHTML={{ __html: sanitizeRichText(html) }} />
        {/* Quill's (unstyled) clipboard element added one empty line under the content; kept for visual parity. */}
        <div className="ql-clipboard" aria-hidden="true"><br /></div>
      </div>
    </div>
  );
}
