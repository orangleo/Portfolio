import { useContent } from '@/store/contentStore'
import Section from '@/components/ui/Section'
import SkillCard from '@/components/skill/SkillCard'

export default function Skills() {
  const skills = useContent((s) => s.skills)

  const groups = new Map<string, typeof skills>()
  for (const s of skills) {
    const list = groups.get(s.category) ?? []
    list.push(s)
    groups.set(s.category, list)
  }

  return (
    <Section id="skills" title="技能" subtitle="我熟练掌握的技术与工具">
      <div className="space-y-8">
        {[...groups.entries()].map(([category, items]) => (
          <div key={category}>
            <h3 className="mb-4 text-lg font-semibold text-accent">{category}</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((skill) => (
                <SkillCard key={skill.id} skill={skill} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}
