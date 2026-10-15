import { useState } from 'react'
import type { FormEvent } from 'react'
import { useContent } from '@/store/contentStore'
import type { Skill } from '@/types'
import Button from '@/components/ui/Button'
import ConfirmDialog from '@/components/ui/ConfirmDialog'

const inputClass =
  'w-full rounded-btn border border-line bg-panel-deep px-3 py-2 text-sm text-foreground outline-none focus:border-accent'

interface SkillForm {
  id: string
  name: string
  category: string
  level: number
  description: string
}

const emptySkill: SkillForm = { id: '', name: '', category: '', level: 80, description: '' }

/** 将熟练度限制在 0–100 区间，非数字按 0 处理 */
function clampLevel(value: number): number {
  if (Number.isNaN(value)) return 0
  return Math.min(100, Math.max(0, value))
}

/** 技能管理：名称/分类/熟练度/描述 的增删改，删除需二次确认 */
export default function SkillManager() {
  const skills = useContent((s) => s.skills)
  const saveSkill = useContent((s) => s.saveSkill)
  const deleteSkill = useContent((s) => s.deleteSkill)

  const [form, setForm] = useState<SkillForm>(emptySkill)
  const [confirmId, setConfirmId] = useState<string | null>(null)

  function submit(e: FormEvent) {
    e.preventDefault()
    const id = form.id || `skill-${Date.now()}`
    void saveSkill({
      id,
      name: form.name,
      category: form.category.trim() || '其他',
      level: clampLevel(form.level),
      description: form.description.trim() || undefined,
    })
    setForm(emptySkill)
  }

  function edit(s: Skill) {
    setForm({
      id: s.id,
      name: s.name,
      category: s.category,
      level: s.level,
      description: s.description ?? '',
    })
  }

  return (
    <section className="mt-10">
      <h2 className="text-lg font-semibold">技能</h2>
      <ul className="mt-4 space-y-2">
        {skills.map((s) => (
          <li
            key={s.id}
            className="flex items-center justify-between rounded-card border border-line bg-panel p-3"
          >
            <div className="min-w-0">
              <p className="font-medium">
                {s.name}
                <span className="ml-2 text-xs text-muted">{s.category}</span>
              </p>
              <p className="truncate text-xs text-muted">
                {s.level}%{s.description ? ` · ${s.description}` : ''}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button className="text-sm text-accent" onClick={() => edit(s)}>
                编辑
              </button>
              <button className="text-sm text-red-400" onClick={() => setConfirmId(s.id)}>
                删除
              </button>
            </div>
          </li>
        ))}
      </ul>

      <form
        onSubmit={submit}
        className="mt-4 space-y-3 rounded-card border border-line bg-panel p-4"
      >
        <p className="text-sm font-medium">{form.id ? '编辑技能' : '新增技能'}</p>
        <input
          className={inputClass}
          placeholder="名称"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          className={inputClass}
          placeholder="分类（如 前端 / 后端 / 工具）"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />
        <div className="flex items-center gap-3">
          <input
            className={inputClass}
            type="number"
            min={0}
            max={100}
            placeholder="熟练度 0–100"
            value={Number.isNaN(form.level) ? '' : form.level}
            onChange={(e) => setForm({ ...form, level: Number(e.target.value) })}
            required
          />
          <span className="shrink-0 text-sm text-muted">{clampLevel(form.level)}%</span>
        </div>
        <input
          className={inputClass}
          placeholder="描述（可选）"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <Button type="submit">{form.id ? '保存' : '添加'}</Button>
      </form>

      <ConfirmDialog
        open={confirmId !== null}
        title="确认删除？"
        description="此操作不可撤销。"
        onConfirm={() => {
          if (confirmId) void deleteSkill(confirmId)
          setConfirmId(null)
        }}
        onCancel={() => setConfirmId(null)}
      />
    </section>
  )
}
