import { create } from 'zustand'
import { api } from '@/api'
import type { Profile, Skill, Project, Post } from '@/types'

interface ContentState {
  profile: Profile | null
  skills: Skill[]
  projects: Project[]
  posts: Post[]
  loading: boolean
  load: () => Promise<void>
  saveProfile: (p: Profile) => Promise<void>
  saveSkill: (s: Skill) => Promise<void>
  deleteSkill: (id: string) => Promise<void>
  saveProject: (p: Project) => Promise<void>
  deleteProject: (id: string) => Promise<void>
  savePost: (p: Post) => Promise<void>
  deletePost: (id: string) => Promise<void>
  reset: () => Promise<void>
}

export const useContent = create<ContentState>((set) => ({
  profile: null,
  skills: [],
  projects: [],
  posts: [],
  loading: true,
  load: async () => {
    const [profile, skills, projects, posts] = await Promise.all([
      api.getProfile(),
      api.getSkills(),
      api.getProjects(),
      api.getPosts(),
    ])
    set({ profile, skills, projects, posts, loading: false })
  },
  saveProfile: async (p) => {
    await api.saveProfile(p)
    set({ profile: p })
  },
  saveSkill: async (s) => {
    await api.saveSkill(s)
    set({ skills: await api.getSkills() })
  },
  deleteSkill: async (id) => {
    await api.deleteSkill(id)
    set({ skills: await api.getSkills() })
  },
  saveProject: async (p) => {
    await api.saveProject(p)
    set({ projects: await api.getProjects() })
  },
  deleteProject: async (id) => {
    await api.deleteProject(id)
    set({ projects: await api.getProjects() })
  },
  savePost: async (p) => {
    await api.savePost(p)
    set({ posts: await api.getPosts() })
  },
  deletePost: async (id) => {
    await api.deletePost(id)
    set({ posts: await api.getPosts() })
  },
  reset: async () => {
    await api.reset()
    set({
      profile: await api.getProfile(),
      skills: await api.getSkills(),
      projects: await api.getProjects(),
      posts: await api.getPosts(),
    })
  },
}))
