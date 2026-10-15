import { useState } from 'react'
import { useContent } from '@/store/contentStore'
import Section from '@/components/ui/Section'
import PostCard from '@/components/blog/PostCard'

function filterButtonClass(active: boolean): string {
  return `rounded-tag border px-2.5 py-1 text-xs transition-colors ${
    active ? 'border-accent text-accent' : 'border-line text-muted hover:text-foreground'
  }`
}

export default function BlogList() {
  const posts = useContent((s) => s.posts)
  const [filter, setFilter] = useState<string | null>(null)

  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags)))
  const visible = filter ? posts.filter((p) => p.tags.includes(filter)) : posts

  return (
    <div className="pt-16">
      <Section title="博客" subtitle="记录学习与思考">
        {allTags.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            <button onClick={() => setFilter(null)} className={filterButtonClass(filter === null)}>
              全部
            </button>
            {allTags.map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={filterButtonClass(filter === t)}
              >
                {t}
              </button>
            ))}
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      </Section>
    </div>
  )
}
