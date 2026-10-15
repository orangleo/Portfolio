import type { Profile, Skill, Project, Post } from '@/types'
import { parseFrontmatter } from '@/utils/markdown'
import { profile } from '@/data/profile'
import { skills } from '@/data/skills'
import { projects } from '@/data/projects'

export const seedProfile: Profile = profile
export const seedSkills: Skill[] = skills
export const seedProjects: Project[] = projects

const postModules = import.meta.glob('../data/posts/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>

export const seedPosts: Post[] = Object.entries(postModules)
  .map(([path, raw]) => {
    const slug = path.split('/').pop()!.replace(/\.md$/, '')
    const { data, content } = parseFrontmatter(raw)
    return {
      id: data.id ?? slug,
      slug,
      title: data.title ?? slug,
      summary: data.summary ?? '',
      content,
      tags: data.tags
        ? data.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [],
      createdAt: data.createdAt ?? new Date().toISOString().slice(0, 10),
      updatedAt: data.updatedAt,
      draft: data.draft === 'true',
    } satisfies Post
  })
  .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
