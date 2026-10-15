export interface FrontmatterData {
  [key: string]: string
}

/**
 * 解析简单的 Markdown 前置元数据（frontmatter）：
 * ---
 * title: xxx
 * tags: a, b, c
 * ---
 * 正文
 */
export function parseFrontmatter(raw: string): { data: FrontmatterData; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) return { data: {}, content: raw }
  const data: FrontmatterData = {}
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(':')
    if (idx > 0) {
      const key = line.slice(0, idx).trim()
      const value = line.slice(idx + 1).trim()
      data[key] = value
    }
  }
  return { data, content: match[2] }
}

/** 去除内联 Markdown 格式（加粗/斜体/链接/行内代码等），用于纯文本展示 */
export function stripMarkdown(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`~]/g, '')
    .replace(/\n+/g, ' ')
    .trim()
}

function stripInlineMarkdown(text: string): string {
  return text
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .trim()
}

/** 生成锚点 id（保留中英文与数字，其余转短横线） */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export interface Heading {
  id: string
  text: string
  level: number
}

/** 提取 Markdown 中的二级/三级标题，用于目录（TOC）；id 与渲染端按顺序一一对应 */
export function extractHeadings(markdown: string): Heading[] {
  const withoutCode = markdown.replace(/```[\s\S]*?```/g, '')
  const headings: Heading[] = []
  const used = new Map<string, number>()

  for (const line of withoutCode.split(/\r?\n/)) {
    const m = line.match(/^(#{2,3})\s+(.+)$/)
    if (!m) continue
    const level = m[1].length
    const text = stripInlineMarkdown(m[2].trim())
    const base = slugify(text)
    const count = used.get(base) ?? 0
    used.set(base, count + 1)
    const id = count === 0 ? base : `${base}-${count + 1}`
    headings.push({ id, text, level })
  }

  return headings
}
