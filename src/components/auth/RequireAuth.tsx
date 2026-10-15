import { useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { useAuth } from '@/store/authStore'
import Button from '@/components/ui/Button'

/** /admin 路由守卫：未通过口令校验时渲染登录表单，通过后渲染子页面 */
export default function RequireAuth({ children }: { children: ReactNode }) {
  const authed = useAuth((s) => s.authed)
  const login = useAuth((s) => s.login)
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)

  if (authed) return <>{children}</>

  function submit(e: FormEvent) {
    e.preventDefault()
    if (!login(value)) setError(true)
  }

  return (
    <section className="mx-auto max-w-md px-6 py-28">
      <h1 className="text-2xl font-bold">管理入口</h1>
      <p className="mt-2 text-sm text-muted">请输入站点口令以继续。</p>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <input
          type="password"
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            setError(false)
          }}
          placeholder="口令"
          className="w-full rounded-btn border border-line bg-panel px-4 py-2.5 text-foreground outline-none focus:border-accent"
        />
        {error && <p className="text-sm text-red-400">口令错误，请重试。</p>}
        <Button type="submit" className="w-full">
          进入
        </Button>
      </form>
    </section>
  )
}
