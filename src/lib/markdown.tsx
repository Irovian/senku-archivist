import type { ReactNode } from 'react'

export type MarkdownBlock =
  | { kind: 'heading'; level: number; text: string; id: string }
  | { kind: 'paragraph'; text: string }
  | { kind: 'list'; items: string[] }

const placeholderPattern = /(\{\{[^}]+}})/g
const inlineTokenPattern = /(\{\{[^}]+}}|\*\*([^*]+)\*\*|\*([^*]+)\*)/g

export function placeholdersIn(markdown: string): string[] {
  return Array.from(new Set(markdown.match(placeholderPattern) ?? [])).sort()
}

export function markdownTitle(markdown: string, fallback: string): string {
  const titleLine = markdown.split('\n').find((line) => line.startsWith('# '))
  return titleLine?.replace(/^#\s+/, '').trim() || fallback
}

export function parseMarkdown(markdown: string): MarkdownBlock[] {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n')
  const blocks: MarkdownBlock[] = []
  let paragraph: string[] = []
  let listItems: string[] = []

  const flushParagraph = () => {
    const text = paragraph.join(' ').replace(/\s+/g, ' ').trim()
    if (text) blocks.push({ kind: 'paragraph', text })
    paragraph = []
  }

  const flushList = () => {
    if (listItems.length) blocks.push({ kind: 'list', items: listItems })
    listItems = []
  }

  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (!line) {
      flushParagraph()
      flushList()
      continue
    }
    if (line.startsWith('<!--')) {
      continue
    }
    const heading = /^(#{1,4})\s+(.+)$/.exec(line)
    if (heading) {
      flushParagraph()
      flushList()
      const text = heading[2].trim()
      blocks.push({ kind: 'heading', level: heading[1].length, text, id: slugify(text) })
      continue
    }
    if (line.startsWith('- ')) {
      flushParagraph()
      listItems.push(line.slice(2).trim())
      continue
    }
    flushList()
    paragraph.push(line)
  }

  flushParagraph()
  flushList()
  return blocks
}

export function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = []
  let cursor = 0
  let match: RegExpExecArray | null

  inlineTokenPattern.lastIndex = 0
  while ((match = inlineTokenPattern.exec(text))) {
    if (match.index > cursor) {
      nodes.push(text.slice(cursor, match.index))
    }
    if (match[0].startsWith('{{')) {
      nodes.push(
        <span className="placeholder-token" key={`${match[0]}-${match.index}`}>
          {match[0]}
        </span>,
      )
    } else if (match[2]) {
      nodes.push(<strong key={`strong-${match.index}`}>{match[2]}</strong>)
    } else if (match[3]) {
      nodes.push(<em key={`em-${match.index}`}>{match[3]}</em>)
    }
    cursor = match.index + match[0].length
  }
  if (cursor < text.length) {
    nodes.push(text.slice(cursor))
  }
  return nodes
}

function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'section'
  )
}

