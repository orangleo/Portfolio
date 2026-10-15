import type { Profile } from '@/types'

// TODO: 请替换为真实个人信息（姓名、邮箱、社交链接、教育经历等）
export const profile: Profile = {
  name: '烷烃',
  title: '全栈开发者 / 前端工程师',
  bio: '热爱构建优雅、高性能的 Web 应用。专注于 **React、TypeScript 与 Node.js**，并用博客持续记录学习与思考。\n\n我相信简洁的代码与克制的设计，能带来更好的产品体验。',
  location: '中国 · 大连',
  status: '开放机会',
  email: '773899286@qq.com',
  highlights: ['React', 'TypeScript', 'Node.js'],
  socials: [
    { platform: 'github', url: 'https://github.com/orangleo', label: 'GitHub' },
    { platform: 'x', url: 'https://x.com/yourname', label: 'X' },
    { platform: 'linkedin', url: 'https://linkedin.com/in/yourname', label: 'LinkedIn' },
  ],
  education: [{ period: '2023.09 - 至今', school: '大连海事大学', degree: '计算机科学与技术 · 本科' }],
  experiences: [
    {
      period: '2025.7.15 - 2025.8.22',
      title: '项目实习生',
      org: '南瑞工程技术有限公司',
      description: '实习于大唐海口江东新区滨海源网荷储一体化智慧能源科创示范项目，参与能源管控平台开发工作，主要负责运行监视、协调控制模块的测试校验等工作。架构与性能优化。',
    },
    {
      period: '2026.7.13 - 2026.8.21',
      title: '项目实习生',
      org: '南瑞工程技术有限公司',
      description: '实习于华北油田冀中电网油气与新能源融合新型电力系统建设一期工程（第四采油厂）EPC总承包项目，主要参与项目软件平台的迭代开发、功能测试、问题优化、文档编写等工作。',
    },
  ],
}
