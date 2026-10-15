import { create } from 'zustand'

const SESSION_KEY = 'pf:authed'

function readAuthed(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1'
  } catch {
    return false
  }
}

// MVP 为前端轻量门禁（非安全鉴权），接入真实后端后替换为服务端鉴权。
const EXPECTED = import.meta.env.VITE_ADMIN_PASSPHRASE ?? 'admin123'

interface AuthState {
  authed: boolean
  login: (passphrase: string) => boolean
  logout: () => void
}

export const useAuth = create<AuthState>((set) => ({
  authed: readAuthed(),
  login: (passphrase) => {
    if (passphrase === EXPECTED) {
      try {
        sessionStorage.setItem(SESSION_KEY, '1')
      } catch {
        // 忽略 sessionStorage 不可用
      }
      set({ authed: true })
      return true
    }
    return false
  },
  logout: () => {
    try {
      sessionStorage.removeItem(SESSION_KEY)
    } catch {
      // 忽略
    }
    set({ authed: false })
  },
}))
