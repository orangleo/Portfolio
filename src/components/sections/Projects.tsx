import { useState } from 'react'
import { useContent } from '@/store/contentStore'
import Section from '@/components/ui/Section'
import ProjectCard from '@/components/project/ProjectCard'

function filterButtonClass(active: boolean): string {
  return `rounded-tag border px-2.5 py-1 text-xs transition-colors ${
    active ? 'border-accent text-accent' : 'border-line text-muted hover:text-foreground'
  }`
}

export default function Projects() {
  const projects = useContent((s) => s.projects)
  const [filter, setFilter] = useState<string | null>(null)

  const allTags = Array.from(new Set(projects.flatMap((p) => p.tags)))
  const visible = filter ? projects.filter((p) => p.tags.includes(filter)) : projects

  return (
    <Section id="projects" title="项目" subtitle="我做过的部分作品">
      {allTags.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          <button onClick={() => setFilter(null)} className={filterButtonClass(filter === null)}>
            全部
          </button>
          {allTags.map((t) => (
            <button key={t} onClick={() => setFilter(t)} className={filterButtonClass(filter === t)}>
              {t}
            </button>
          ))}
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
    </Section>
  )
}
