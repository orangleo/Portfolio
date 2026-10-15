import { useState } from 'react'
import type { FormEvent } from 'react'
import { useContent } from '@/store/contentStore'
import Section from '@/components/ui/Section'
import { buttonStyles } from '@/utils/styles'

const inputClass =
  'w-full rounded-btn border border-line bg-panel px-4 py-2.5 text-sm text-foreground outline-none focus:border-accent'

interface FormState {
  name: string
  email: string
  message: string
}

type FormErrors = Partial<Record<keyof FormState, string>>

export default function Contact() {
  const profile = useContent((s) => s.profile)
  const [copied, setCopied] = useState(false)
  const [form, setForm] = useState<FormState>({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [sent, setSent] = useState(false)

  if (!profile) return null

  const email = profile.email

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // 忽略剪贴板不可用
    }
  }

  function validate(): FormErrors {
    const errs: FormErrors = {}
    if (!form.name.trim()) errs.name = '请输入姓名'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errs.email = '请输入有效邮箱'
    if (!form.message.trim()) errs.message = '请输入留言内容'
    return errs
  }

  function submit(e: FormEvent) {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    const subject = encodeURIComponent(`来自 ${form.name} 的留言`)
    const body = encodeURIComponent(`${form.message}\n\n—— ${form.name}（${form.email}）`)
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`
    setSent(true)
  }

  return (
    <Section id="contact" title="联系" subtitle="欢迎交流与合作">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-6">
          <div>
            <p className="text-muted">邮箱</p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <a href={`mailto:${email}`} className="text-accent">
                {email}
              </a>
              <button
                onClick={copyEmail}
                className="rounded-btn border border-line px-3 py-1.5 text-sm text-muted hover:bg-panel"
              >
                {copied ? '已复制' : '复制邮箱'}
              </button>
            </div>
          </div>

          {profile.socials.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {profile.socials.map((s) => (
                <a
                  key={s.platform}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonStyles('ghost')}
                >
                  {s.label ?? s.platform}
                </a>
              ))}
            </div>
          )}

          {profile.location && <p className="text-sm text-muted">位置：{profile.location}</p>}
          {profile.status && <p className="text-sm text-muted">状态：{profile.status}</p>}
        </div>

        <form onSubmit={submit} className="space-y-4 rounded-card border border-line bg-panel/60 p-6">
          <p className="font-semibold">留言</p>
          <div>
            <input
              className={inputClass}
              placeholder="姓名"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
          </div>
          <div>
            <input
              className={inputClass}
              type="email"
              placeholder="邮箱"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
          </div>
          <div>
            <textarea
              className={inputClass}
              rows={4}
              placeholder="留言内容"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
            {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message}</p>}
          </div>
          <button type="submit" className={buttonStyles('primary')}>
            发送
          </button>
          {sent && <p className="text-sm text-muted">已打开邮件客户端，感谢你的留言。</p>}
        </form>
      </div>
    </Section>
  )
}
