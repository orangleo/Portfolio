/** 个人资料 */
export interface Profile {
  name: string
  title: string
  bio: string
  avatar?: string
  location?: string
  status?: string
  email: string
  socials: SocialLink[]
  highlights: string[]
  experiences?: Experience[]
  education?: Education[]
}

export interface SocialLink {
  platform: string
  url: string
  label?: string
}

export interface Experience {
  period: string
  title: string
  org: string
  description?: string
}

export interface Education {
  period: string
  school: string
  degree: string
  description?: string
}

/** 技能 */
export interface Skill {
  id: string
  name: string
  level: number
  category: string
  icon?: string
  description?: string
}

/** 项目 */
export interface Project {
  id: string
  name: string
  description: string
  cover?: string
  tags: string[]
  repoUrl?: string
  demoUrl?: string
  featured?: boolean
  createdAt: string
}

/** 博客文章 */
export interface Post {
  id: string
  slug: string
  title: string
  summary: string
  content: string
  tags: string[]
  createdAt: string
  updatedAt?: string
  draft?: boolean
}
