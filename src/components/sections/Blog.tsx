import { Link } from 'react-router-dom'
import { useContent } from '@/store/contentStore'
import Section from '@/components/ui/Section'
import PostCard from '@/components/blog/PostCard'

export default function Blog() {
  const posts = useContent((s) => s.posts)
  const recent = posts.slice(0, 3)

  return (
    <Section id="blog" title="博客" subtitle="最近的文章">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recent.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </div>
      <div className="mt-8 text-center">
        <Link to="/blog" className="text-accent hover:underline">
          查看全部文章 →
        </Link>
      </div>
    </Section>
  )
}
