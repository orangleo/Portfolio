import type { Profile, Skill, Project, Post } from '@/types'
import { KEYS, safeGet, safeRemove, safeSet } from '@/utils/storage'
import { seedProfile, seedProjects, seedPosts, seedSkills } from './seed'

const DELAY = 200

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), DELAY))
}

function readTombstone(): string[] {
  return safeGet<string[]>(KEYS.tombstone) ?? []
}

/** 预置数据与本地覆盖按 id 合并，并剔除墓碑标记的删除项 */
function mergeById<T extends { id: string }>(seed: T[], overrides: T[], tombstone: string[]): T[] {
  const map = new Map<string, T>()
  for (const item of seed) map.set(item.id, item)
  for (const item of overrides) map.set(item.id, item)
  for (const id of tombstone) map.delete(id)
  return Array.from(map.values())
}

async function readPosts(): Promise<Post[]> {
  const overrides = safeGet<Post[]>(KEYS.posts) ?? []
  return mergeById(seedPosts, overrides, readTombstone()).filter((p) => !p.draft)
}

function addTombstone(id: string): void {
  const list = readTombstone()
  if (!list.includes(id)) {
    list.push(id)
    safeSet(KEYS.tombstone, list)
  }
}

export interface ContentApi {
  getProfile(): Promise<Profile>
  getSkills(): Promise<Skill[]>
  getProjects(): Promise<Project[]>
  getPosts(): Promise<Post[]>
  getPostBySlug(slug: string): Promise<Post | null>
  saveProfile(p: Profile): Promise<void>
  saveSkill(s: Skill): Promise<void>
  deleteSkill(id: string): Promise<void>
  saveProject(p: Project): Promise<void>
  deleteProject(id: string): Promise<void>
  savePost(p: Post): Promise<void>
  deletePost(id: string): Promise<void>
  reset(): Promise<void>
}

export const api: ContentApi = {
  async getProfile() {
    return delay(safeGet<Profile>(KEYS.profile) ?? seedProfile)
  },
  async saveProfile(p) {
    safeSet(KEYS.profile, p)
    return delay(undefined)
  },
  async getSkills() {
    const overrides = safeGet<Skill[]>(KEYS.skills) ?? []
    return delay(mergeById(seedSkills, overrides, readTombstone()))
  },
  async getProjects() {
    const overrides = safeGet<Project[]>(KEYS.projects) ?? []
    return delay(mergeById(seedProjects, overrides, readTombstone()))
  },
  async getPosts() {
    return delay(await readPosts())
  },
  async getPostBySlug(slug) {
    const posts = await readPosts()
    return posts.find((p) => p.slug === slug) ?? null
  },
  async saveProject(p) {
    const list = safeGet<Project[]>(KEYS.projects) ?? []
    const idx = list.findIndex((x) => x.id === p.id)
    if (idx >= 0) list[idx] = p
    else list.push(p)
    safeSet(KEYS.projects, list)
    return delay(undefined)
  },
  async deleteProject(id) {
    const list = (safeGet<Project[]>(KEYS.projects) ?? []).filter((x) => x.id !== id)
    safeSet(KEYS.projects, list)
    addTombstone(id)
    return delay(undefined)
  },
  async saveSkill(s) {
    const list = safeGet<Skill[]>(KEYS.skills) ?? []
    const idx = list.findIndex((x) => x.id === s.id)
    if (idx >= 0) list[idx] = s
    else list.push(s)
    safeSet(KEYS.skills, list)
    return delay(undefined)
  },
  async deleteSkill(id) {
    const list = (safeGet<Skill[]>(KEYS.skills) ?? []).filter((x) => x.id !== id)
    safeSet(KEYS.skills, list)
    addTombstone(id)
    return delay(undefined)
  },
  async savePost(p) {
    const list = safeGet<Post[]>(KEYS.posts) ?? []
    const idx = list.findIndex((x) => x.id === p.id)
    if (idx >= 0) list[idx] = p
    else list.push(p)
    safeSet(KEYS.posts, list)
    return delay(undefined)
  },
  async deletePost(id) {
    const list = (safeGet<Post[]>(KEYS.posts) ?? []).filter((x) => x.id !== id)
    safeSet(KEYS.posts, list)
    addTombstone(id)
    return delay(undefined)
  },
  async reset() {
    safeRemove(KEYS.profile)
    safeRemove(KEYS.skills)
    safeRemove(KEYS.projects)
    safeRemove(KEYS.posts)
    safeRemove(KEYS.tombstone)
    return delay(undefined)
  },
}
