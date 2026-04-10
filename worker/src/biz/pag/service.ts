/**
 * Lightweight markdown to HTML converter for Workers environment.
 * Handles headings, paragraphs, bold, italic, inline code, code blocks, links, lists, and horizontal rules.
 * All user content is HTML-escaped before embedding to prevent XSS.
 */
export function markdownToHtml(md: string): string {
  // First, escape the entire input to prevent XSS
  let html = escapeHtml(md)

  // Code blocks (``` ... ```) — content is already escaped
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_match, _lang, code) => {
    return `<pre><code>${code.trim()}</code></pre>`
  })

  // Inline code — content is already escaped
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>')

  // Headings — content is already escaped
  html = html.replace(/^######\s+(.+)$/gm, '<h6>$1</h6>')
  html = html.replace(/^#####\s+(.+)$/gm, '<h5>$1</h5>')
  html = html.replace(/^####\s+(.+)$/gm, '<h4>$1</h4>')
  html = html.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>')
  html = html.replace(/^##\s+(.+)$/gm, '<h2>$1</h2>')
  html = html.replace(/^#\s+(.+)$/gm, '<h1>$1</h1>')

  // Horizontal rule
  html = html.replace(/^---$/gm, '<hr />')

  // Bold and italic — content is already escaped
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')

  // Links — href is escaped, block dangerous protocols
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, text, href) => {
    const safeHref = sanitizeHref(href)
    return `<a href="${safeHref}">${text}</a>`
  })

  // Unordered lists — content is already escaped
  html = html.replace(/^[\t ]*[-*]\s+(.+)$/gm, '<li>$1</li>')
  html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>')

  // Paragraphs: wrap remaining bare lines
  const lines = html.split('\n')
  const result: string[] = []
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) {
      result.push('')
    } else if (trimmed.startsWith('<')) {
      result.push(line)
    } else {
      result.push(`<p>${trimmed}</p>`)
    }
  }

  return result.join('\n').trim()
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

const ALLOWED_PROTOCOLS = ['http:', 'https:', 'mailto:']

function sanitizeHref(href: string): string {
  const trimmed = href.trim()
  try {
    const url = new URL(trimmed)
    if (!ALLOWED_PROTOCOLS.includes(url.protocol)) return ''
    return trimmed
  } catch {
    // Relative URLs are allowed
    if (trimmed.startsWith('/') || trimmed.startsWith('#') || trimmed.startsWith('.')) return trimmed
    // Block anything that looks like a dangerous protocol (javascript:, data:, vbscript:)
    if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) return ''
    return trimmed
  }
}
