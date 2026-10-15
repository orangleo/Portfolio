import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '@/api'
import type { Post } from '@/types'
import LazyMarkdown from '@/components/blog/LazyMarkdown'
import Tag from '@/components/ui/Tag'
import { extractHeadings } from '@/utils/markdown'
import { formatDate, readingTime } from '@/utils/format'

interface LoadedPost {
  slug: string | undefined
  post: Post | null
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const [result, setResult] = useState<LoadedPost>({ slug: undefined, post: null })

  useEffect(() => {
    let active = true
    api.getPostBySlug(slug ?? '').then((p) => {
      if (active) setResult({ slug, post: p })
    })
    return () => {
      active = false
    }
  }, [slug])

  // 通过「已加载的 slug 是否等于当前 slug」派生加载态，避免在 effect 内同步 setState
  const loading = result.slug !== slug

  if (loading) {
    return <div className="mx-auto max-w-3xl px-6 py-28 text-muted">加载中…</div>
  }

  const post = result.post
  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-28 text-center">
        <p className="text-lg text-muted">文章不存在或已被删除。</p>
        <Link to="/blog" className="mt-4 inline-block text-accent hover:underline">
          ← 返回博客
        </Link>
      </div>
    )
  }

  const headings = extractHeadings(post.content)

  return (
    <div className="mx-auto max-w-5xl px-6 py-28">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_240px]">
        <article className="min-w-0">
          <Link to="/blog" className="text-sm text-muted hover:text-accent">
            ← 返回博客
          </Link>
          <h1 className="mt-6 text-3xl font-bold sm:text-4xl">{post.title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted">
            <span>{formatDate(post.createdAt)}</span>
            <span>·</span>
            <span>{readingTime(post.content)} 分钟阅读</span>
          </div>
          {post.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </div>
          )}
          <div className="mt-10">
            <LazyMarkdown content={post.content} headingIds={headings.map((h) => h.id)} />
          </div>
        </article>

        {headings.length > 0 && (
          <aside className="hidden lg:block">
            <nav className="sticky top-24 rounded-card border border-line bg-panel/60 p-4">
              <p className="text-sm font-semibold text-muted">目录</p>
              <ul className="mt-3 space-y-2 text-sm">
                {headings.map((h) => (
                  <li key={h.id} style={{ paddingLeft: h.level === 3 ? 14 : 0 }}>
                    <a href={`#${h.id}`} className="text-muted hover:text-accent">
                      {h.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        )}
      </div>

      {headings.length > 0 && (
        <details className="mt-8 rounded-card border border-line bg-panel/60 p-4 lg:hidden">
          <summary className="cursor-pointer text-sm font-semibold text-muted">目录</summary>
          <ul className="mt-3 space-y-2 text-sm">
            {headings.map((h) => (
              <li key={h.id} style={{ paddingLeft: h.level === 3 ? 14 : 0 }}>
                <a href={`#${h.id}`} className="text-muted hover:text-accent">
                  {h.text}
                </a>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  )
}
