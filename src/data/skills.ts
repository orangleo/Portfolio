import type { Skill } from '@/types'

// icon 为图标 key，映射见 src/components/ui/Icon.tsx；省略时按技能名自动匹配
export const skills: Skill[] = [
  { id: 'skill-1', name: 'TypeScript', level: 90, category: '前端', icon: 'filecode', description: '类型系统、泛型与工程化' },
  { id: 'skill-2', name: 'React', level: 92, category: '前端', icon: 'atom', description: 'Hooks、性能优化与组件设计' },
  { id: 'skill-3', name: 'TailwindCSS', level: 85, category: '前端', icon: 'wind', description: '原子化样式与设计系统' },
  { id: 'skill-4', name: 'Node.js', level: 80, category: '后端', icon: 'server', description: 'REST API 与后端服务' },
  { id: 'skill-5', name: 'PostgreSQL', level: 72, category: '后端', icon: 'database', description: '数据建模与查询优化' },
  { id: 'skill-6', name: 'Git', level: 88, category: '工具', icon: 'git', description: '版本控制与协作流程' },
]
