import type { Project } from '@/types'

// cover 留空时，项目卡片会自动按名称生成渐变封面
export const projects: Project[] = [
  {
    id: 'project-1',
    name: '个人展示网站',
    description: '深色主题的个人展示网站，包含技能、项目与博客，星空粒子背景。',
    tags: ['React', 'TypeScript', 'TailwindCSS'],
    repoUrl: 'https://github.com/yourname/portfolio',
    demoUrl: 'https://example.com',
    featured: true,
    createdAt: '2025-01-01',
  },
  {
    id: 'project-2',
    name: '任务看板',
    description: '基于拖拽的团队协作看板，支持实时同步与权限管理。',
    tags: ['React', 'Node.js', 'PostgreSQL'],
    repoUrl: 'https://github.com/yourname/kanban',
    featured: true,
    createdAt: '2024-08-15',
  },
  {
    id: 'project-3',
    name: 'CLI 工具',
    description: '一个提升开发效率的命令行工具，支持脚手架与代码生成。',
    tags: ['TypeScript', 'Node.js'],
    repoUrl: 'https://github.com/yourname/cli',
    createdAt: '2024-03-20',
  },
]
