export const STORAGE_PREFIX = 'pf:'

export const KEYS = {
  profile: `${STORAGE_PREFIX}profile`,
  skills: `${STORAGE_PREFIX}skills`,
  projects: `${STORAGE_PREFIX}projects`,
  posts: `${STORAGE_PREFIX}posts`,
  tombstone: `${STORAGE_PREFIX}tombstone`,
} as const

/** 安全读取：JSON 解析失败或不可用时返回 null，避免脏数据导致崩溃 */
export function safeGet<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

export function safeSet(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // 忽略写入失败（隐私模式 / 配额不足）
  }
}

export function safeRemove(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch {
    // 忽略
  }
}
