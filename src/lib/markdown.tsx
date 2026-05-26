import type { ReactNode } from 'react'

export type MarkdownBlock =
  | { kind: 'heading'; level: number; text: string; id: string }
  | { kind: 'paragraph'; text: string }
  | { kind: 'list'; items: string[] }

const placeholderPattern = /(\{\{[^}]+}})/g

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
  return text.split(placeholderPattern).map((part, index) => {
    if (placeholderPattern.test(part)) {
      placeholderPattern.lastIndex = 0
      return (
        <span className="placeholder-token" key={`${part}-${index}`}>
          {part}
        </span>
      )
    }
    placeholderPattern.lastIndex = 0
    return part
  })
}

function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'section'
  )
}

