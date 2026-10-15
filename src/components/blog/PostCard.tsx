import { Link } from 'react-router-dom'
import type { Post } from '@/types'
import Card from '@/components/ui/Card'
import Tag from '@/components/ui/Tag'
import { formatDate, readingTime } from '@/utils/format'

export default function PostCard({ post }: { post: Post }) {
  return (
    <Link to={`/blog/${post.slug}`} className="block">
      <Card className="h-full">
        <h3 className="text-lg font-semibold transition-colors hover:text-accent">{post.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted">{post.summary}</p>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted">
          <span>{formatDate(post.createdAt)}</span>
          <span>·</span>
          <span>{readingTime(post.content)} 分钟</span>
          {post.tags.slice(0, 3).map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
      </Card>
    </Link>
  )
}
