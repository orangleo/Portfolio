import type { Project } from '@/types'
import Card from '@/components/ui/Card'
import Tag from '@/components/ui/Tag'
import { coverGradient } from '@/utils/styles'

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="flex flex-col overflow-hidden p-0">
      <div
        className="h-40 w-full"
        style={project.cover ? undefined : { background: coverGradient(project.name) }}
      >
        {project.cover ? (
          <img src={project.cover} alt={project.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-5xl font-bold text-white/25">
            {project.name.charAt(0)}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-semibold">{project.name}</h3>
        <p className="mt-2 flex-1 text-sm text-muted">{project.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
        <div className="mt-4 flex gap-3 text-sm">
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent"
            >
              源码
            </a>
          )}
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent"
            >
              演示
            </a>
          )}
        </div>
      </div>
    </Card>
  )
}
