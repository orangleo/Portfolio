import { lazy, Suspense } from 'react'

const MarkdownRenderer = lazy(() => import('./MarkdownRenderer'))

interface LazyMarkdownProps {
  content: string
  headingIds?: string[]
}

/** 懒加载 Markdown 渲染器，将 react-markdown / highlight.js 拆分为独立 chunk */
export default function LazyMarkdown({ content, headingIds }: LazyMarkdownProps) {
  return (
    <Suspense fallback={<div className="text-muted">加载中…</div>}>
      <MarkdownRenderer content={content} headingIds={headingIds} />
    </Suspense>
  )
}
