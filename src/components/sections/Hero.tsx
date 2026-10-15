import { Link } from 'react-router-dom'
import { useContent } from '@/store/contentStore'
import Tag from '@/components/ui/Tag'
import { SocialIcon } from '@/components/ui/Icon'
import { buttonStyles } from '@/utils/styles'
import { stripMarkdown } from '@/utils/markdown'

export default function Hero() {
  const profile = useContent((s) => s.profile)
  if (!profile) return null

  return (
    <section className="flex min-h-[85vh] items-center justify-center px-6 pb-16 pt-28 text-center">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex justify-center gap-2">
          {profile.highlights.map((h) => (
            <Tag key={h}>{h}</Tag>
          ))}
        </div>
        <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl">{profile.name}</h1>
        <p className="mt-4 text-xl text-accent">{profile.title}</p>
        <p className="mx-auto mt-6 max-w-xl text-muted line-clamp-3">{stripMarkdown(profile.bio)}</p>
        {profile.socials.length > 0 && (
          <div className="mt-8 flex justify-center gap-3">
            {profile.socials.map((s) => (
              <a
                key={s.platform}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label ?? s.platform}
                className="flex h-10 w-10 items-center justify-center rounded-btn border border-line text-muted transition-colors hover:border-accent hover:text-accent"
              >
                <SocialIcon platform={s.platform} className="h-5 w-5" />
              </a>
            ))}
          </div>
        )}
        <div className="mt-10 flex justify-center gap-4">
          <Link to="/projects" className={buttonStyles('primary')}>
            查看项目
          </Link>
          <a href={`mailto:${profile.email}`} className={buttonStyles('ghost')}>
            联系我
          </a>
        </div>
      </div>
    </section>
  )
}
