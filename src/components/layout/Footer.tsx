import { useContent } from '@/store/contentStore'
import { SocialIcon } from '@/components/ui/Icon'

export default function Footer() {
  const profile = useContent((s) => s.profile)

  return (
    <footer className="border-t border-line py-10 text-center">
      {profile && profile.socials.length > 0 && (
        <div className="mb-4 flex justify-center gap-3">
          {profile.socials.map((s) => (
            <a
              key={s.platform}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label ?? s.platform}
              className="flex h-9 w-9 items-center justify-center rounded-btn border border-line text-muted transition-colors hover:border-accent hover:text-accent"
            >
              <SocialIcon platform={s.platform} className="h-4 w-4" />
            </a>
          ))}
        </div>
      )}
      <p className="text-sm text-muted">
        © {new Date().getFullYear()} {profile?.name ?? 'Portfolio'} · 用 React 与 TypeScript 构建
      </p>
    </footer>
  )
}
