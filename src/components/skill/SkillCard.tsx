import type { Skill } from '@/types'
import Card from '@/components/ui/Card'
import { SkillIcon } from '@/components/ui/Icon'

export default function SkillCard({ skill }: { skill: Skill }) {
  return (
    <Card>
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-tag bg-panel-deep text-accent">
          <SkillIcon name={skill.icon ?? skill.name} className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <h3 className="truncate font-semibold">{skill.name}</h3>
            <span className="text-sm text-muted">{skill.level}%</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-panel-deep">
            <div className="h-full rounded-full bg-accent" style={{ width: `${skill.level}%` }} />
          </div>
        </div>
      </div>
      {skill.description && <p className="mt-3 text-sm text-muted">{skill.description}</p>}
    </Card>
  )
}
