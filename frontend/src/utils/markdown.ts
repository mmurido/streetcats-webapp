import MarkdownIt from 'markdown-it'
import DOMPurify from 'dompurify'

export const md = new MarkdownIt('zero', {
  breaks: true,
  linkify: true,
})

md.enable([
  'emphasis', // *italic*, **bold**
  'link', // [text](url)
  'list', // - item, 1. item
  'blockquote', // > quoted text
  'strikethrough', // ~~strike~~
  'newline',
])

md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
  const token = tokens[idx]
  token.attrSet('target', '_blank')
  token.attrSet('rel', 'noopener noreferrer')
  return self.renderToken(tokens, idx, options)
}

export const renderMarkdown = (content: string) => {
  const html = md.render(content)
  const cleanHtml = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p',
      'br',
      'strong',
      'em',
      's',
      'a',
      'ul',
      'ol',
      'li',
      'blockquote',
      'code',
      'pre',
    ],
    ALLOWED_ATTR: ['href', 'class'],
    ALLOWED_URI_REGEXP:
      /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.-]+(?:[^a-z+.-]|$))/i,
  })

  return cleanHtml
}
