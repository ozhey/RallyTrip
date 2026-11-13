import sanitizeHtml from 'sanitize-html';

// Quill output is authored by admins, but it is still injected as raw HTML,
// so strip anything executable while keeping Quill's formatting classes/styles.
const OPTIONS = {
  allowedTags: [
    'p', 'br', 'span', 'strong', 'b', 'em', 'i', 'u', 's', 'strike', 'a',
    'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre', 'code',
    'img', 'iframe', 'sub', 'sup',
  ],
  allowedAttributes: {
    '*': ['class', 'style', 'dir'],
    a: ['href', 'target', 'rel'],
    img: ['src', 'alt', 'width', 'height'],
    iframe: ['src', 'frameborder', 'allowfullscreen', 'width', 'height'],
    li: ['data-list', 'class'],
  },
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  allowedIframeHostnames: ['www.youtube.com', 'youtube.com', 'player.vimeo.com'],
  allowedStyles: {
    '*': {
      color: [/^#[0-9a-f]{3,8}$/i, /^rgba?\([\d\s.,%]+\)$/i, /^[a-z]+$/i],
      'background-color': [/^#[0-9a-f]{3,8}$/i, /^rgba?\([\d\s.,%]+\)$/i, /^[a-z]+$/i],
      'text-align': [/^(left|right|center|justify)$/],
    },
  },
};

export function sanitizeRichText(html) {
  return typeof html === 'string' ? sanitizeHtml(html, OPTIONS) : '';
}

/**
 * True when the Quill HTML has something to show: any text, an image or an embed.
 * (A blank Quill document is just empty paragraphs/<br>s; short content such as a one-item list still counts.)
 */
export function hasRichText(html) {
  if (typeof html !== 'string' || !html) return false;
  if (/<(img|iframe)\b/i.test(html)) return true;
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;|\u00a0/g, ' ').trim().length > 0;
}
