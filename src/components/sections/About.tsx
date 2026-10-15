import { useContent } from '@/store/contentStore'
import Section from '@/components/ui/Section'
import LazyMarkdown from '@/components/blog/LazyMarkdown'

interface TimelineEntry {
  period: string
  title: string
  subtitle?: string
  description?: string
}

function TimelineItem({ entry }: { entry: TimelineEntry }) {
  return (
    <li className="relative">
      <span className="absolute -left-[27px] top-1 h-3 w-3 rounded-full bg-accent" />
      <p className="text-sm text-muted">{entry.period}</p>
      <p className="font-semibold">{entry.title}</p>
      {entry.subtitle && <p className="text-sm text-foreground/80">{entry.subtitle}</p>}
      {entry.description && <p className="mt-1 text-sm text-muted">{entry.description}</p>}
    </li>
  )
}

function Timeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <ol className="space-y-4 border-l border-line pl-6">
      {entries.map((e, i) => (
        <TimelineItem key={i} entry={e} />
      ))}
    </ol>
  )
}

export default function About() {
  const profile = useContent((s) => s.profile)
  if (!profile) return null

  const education: TimelineEntry[] = (profile.education ?? []).map((e) => ({
    period: e.period,
    title: e.school,
    subtitle: e.degree,
    description: e.description,
  }))
  const experiences: TimelineEntry[] = (profile.experiences ?? []).map((e) => ({
    period: e.period,
    title: e.title,
    subtitle: e.org,
    description: e.description,
  }))

  return (
    <Section id="about" title="关于我">
      <div className="space-y-10">
        <LazyMarkdown content={profile.bio} />
        {education.length > 0 && (
          <div>
            <h3 className="mb-4 text-lg font-semibold text-accent">教育背景</h3>
            <Timeline entries={education} />
          </div>
        )}
        {experiences.length > 0 && (
          <div>
            <h3 className="mb-4 text-lg font-semibold text-accent">工作经历</h3>
            <Timeline entries={experiences} />
          </div>
        )}
      </div>
    </Section>
  )
}
