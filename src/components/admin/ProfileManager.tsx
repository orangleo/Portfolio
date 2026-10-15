import { useState } from 'react'
import type { FormEvent } from 'react'
import { useContent } from '@/store/contentStore'
import type { Education, Experience, Profile, SocialLink } from '@/types'
import Button from '@/components/ui/Button'

const inputClass =
  'w-full rounded-btn border border-line bg-panel-deep px-3 py-2 text-sm text-foreground outline-none focus:border-accent'

interface Draft {
  name: string
  title: string
  bio: string
  email: string
  location: string
  status: string
  highlights: string
  socials: SocialLink[]
  education: Education[]
  experiences: Experience[]
}

/** 子项编辑态：index 为 null 表示新增，否则表示编辑对应下标 */
interface SocialEdit {
  index: number | null
  platform: string
  url: string
  label: string
}
interface EducationEdit {
  index: number | null
  period: string
  school: string
  degree: string
}
interface ExperienceEdit {
  index: number | null
  period: string
  title: string
  org: string
  description: string
}

function toDraft(p: Profile | null): Draft {
  return {
    name: p?.name ?? '',
    title: p?.title ?? '',
    bio: p?.bio ?? '',
    email: p?.email ?? '',
    location: p?.location ?? '',
    status: p?.status ?? '',
    highlights: (p?.highlights ?? []).join(', '),
    socials: p?.socials ?? [],
    education: p?.education ?? [],
    experiences: p?.experiences ?? [],
  }
}

const emptySocial: SocialEdit = { index: null, platform: '', url: '', label: '' }
const emptyEducation: EducationEdit = { index: null, period: '', school: '', degree: '' }
const emptyExperience: ExperienceEdit = { index: null, period: '', title: '', org: '', description: '' }

/** 个人信息管理：基本资料 + 社交链接/教育/工作经历（增删改），统一保存到 profile */
export default function ProfileManager() {
  const profile = useContent((s) => s.profile)
  const saveProfile = useContent((s) => s.saveProfile)

  const [draft, setDraft] = useState<Draft>(() => toDraft(profile))
  const [socialEdit, setSocialEdit] = useState<SocialEdit>(emptySocial)
  const [educationEdit, setEducationEdit] = useState<EducationEdit>(emptyEducation)
  const [experienceEdit, setExperienceEdit] = useState<ExperienceEdit>(emptyExperience)
  const [error, setError] = useState('')

  function save() {
    if (!draft.name.trim() || !draft.email.trim()) {
      setError('姓名与邮箱不能为空')
      return
    }
    setError('')
    void saveProfile({
      avatar: profile?.avatar,
      name: draft.name.trim(),
      title: draft.title.trim(),
      bio: draft.bio,
      email: draft.email.trim(),
      location: draft.location.trim() || undefined,
      status: draft.status.trim() || undefined,
      highlights: draft.highlights.split(',').map((h) => h.trim()).filter(Boolean),
      socials: draft.socials,
      education: draft.education,
      experiences: draft.experiences,
    })
  }

  function submit(e: FormEvent) {
    e.preventDefault()
    save()
  }

  // —— 社交链接 ——
  function upsertSocial() {
    const platform = socialEdit.platform.trim()
    const url = socialEdit.url.trim()
    if (!platform || !url) return
    const entry: SocialLink = { platform, url, label: socialEdit.label.trim() || undefined }
    if (socialEdit.index === null) setDraft({ ...draft, socials: [...draft.socials, entry] })
    else setDraft({ ...draft, socials: draft.socials.map((s, i) => (i === socialEdit.index ? entry : s)) })
    setSocialEdit(emptySocial)
  }

  function removeSocial(i: number) {
    setDraft({ ...draft, socials: draft.socials.filter((_, j) => j !== i) })
  }

  // —— 教育背景 ——
  function upsertEducation() {
    const period = educationEdit.period.trim()
    const school = educationEdit.school.trim()
    if (!period || !school) return
    const entry: Education = { period, school, degree: educationEdit.degree.trim() }
    if (educationEdit.index === null) setDraft({ ...draft, education: [...draft.education, entry] })
    else setDraft({ ...draft, education: draft.education.map((s, i) => (i === educationEdit.index ? entry : s)) })
    setEducationEdit(emptyEducation)
  }

  function removeEducation(i: number) {
    setDraft({ ...draft, education: draft.education.filter((_, j) => j !== i) })
  }

  // —— 工作经历 ——
  function upsertExperience() {
    const period = experienceEdit.period.trim()
    const title = experienceEdit.title.trim()
    if (!period || !title) return
    const entry: Experience = {
      period,
      title,
      org: experienceEdit.org.trim(),
      description: experienceEdit.description.trim() || undefined,
    }
    if (experienceEdit.index === null) setDraft({ ...draft, experiences: [...draft.experiences, entry] })
    else setDraft({ ...draft, experiences: draft.experiences.map((s, i) => (i === experienceEdit.index ? entry : s)) })
    setExperienceEdit(emptyExperience)
  }

  function removeExperience(i: number) {
    setDraft({ ...draft, experiences: draft.experiences.filter((_, j) => j !== i) })
  }

  return (
    <section className="mt-10">
      <h2 className="text-lg font-semibold">个人信息</h2>

      <form onSubmit={submit} className="mt-4 space-y-4 rounded-card border border-line bg-panel p-4">
        <p className="text-sm font-medium">基本资料</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            className={inputClass}
            placeholder="姓名"
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            required
          />
          <input
            className={inputClass}
            placeholder="一句话定位"
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            required
          />
          <input
            className={inputClass}
            type="email"
            placeholder="联系邮箱"
            value={draft.email}
            onChange={(e) => setDraft({ ...draft, email: e.target.value })}
            required
          />
          <input
            className={inputClass}
            placeholder="所在城市（可选）"
            value={draft.location}
            onChange={(e) => setDraft({ ...draft, location: e.target.value })}
          />
          <input
            className={inputClass}
            placeholder="职业状态（可选）"
            value={draft.status}
            onChange={(e) => setDraft({ ...draft, status: e.target.value })}
          />
          <input
            className={inputClass}
            placeholder="关键词标签（逗号分隔）"
            value={draft.highlights}
            onChange={(e) => setDraft({ ...draft, highlights: e.target.value })}
          />
        </div>
        <textarea
          className={inputClass}
          rows={4}
          placeholder="个人简介（支持 Markdown）"
          value={draft.bio}
          onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
          required
        />

        {/* 社交链接 */}
        <div>
          <p className="text-sm font-medium">社交链接</p>
          <ul className="mt-2 space-y-2">
            {draft.socials.map((s, i) => (
              <li key={i} className="flex items-center justify-between gap-2 text-sm">
                <span className="min-w-0 truncate text-muted">
                  <span className="text-accent">{s.platform}</span>
                  {s.label ? `（${s.label}）` : ''} · {s.url}
                </span>
                <span className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    className="text-accent"
                    onClick={() =>
                      setSocialEdit({ index: i, platform: s.platform, url: s.url, label: s.label ?? '' })
                    }
                  >
                    编辑
                  </button>
                  <button type="button" className="text-red-400" onClick={() => removeSocial(i)}>
                    删除
                  </button>
                </span>
              </li>
            ))}
            {draft.socials.length === 0 && <li className="text-sm text-muted">暂无社交链接</li>}
          </ul>
          <div className="mt-2 grid gap-2 sm:grid-cols-[1fr_1.6fr_1fr_auto]">
            <input
              className={inputClass}
              placeholder="平台（github / x / linkedin）"
              value={socialEdit.platform}
              onChange={(e) => setSocialEdit({ ...socialEdit, platform: e.target.value })}
            />
            <input
              className={inputClass}
              placeholder="链接 URL"
              value={socialEdit.url}
              onChange={(e) => setSocialEdit({ ...socialEdit, url: e.target.value })}
            />
            <input
              className={inputClass}
              placeholder="显示名（可选）"
              value={socialEdit.label}
              onChange={(e) => setSocialEdit({ ...socialEdit, label: e.target.value })}
            />
            <Button type="button" onClick={upsertSocial}>
              {socialEdit.index === null ? '添加' : '更新'}
            </Button>
          </div>
        </div>

        {/* 教育背景 */}
        <div>
          <p className="text-sm font-medium">教育背景</p>
          <ul className="mt-2 space-y-2">
            {draft.education.map((e, i) => (
              <li key={i} className="flex items-center justify-between gap-2 text-sm">
                <span className="min-w-0 truncate text-muted">
                  <span className="text-muted">{e.period}</span> · {e.school}
                  {e.degree ? ` · ${e.degree}` : ''}
                </span>
                <span className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    className="text-accent"
                    onClick={() =>
                      setEducationEdit({ index: i, period: e.period, school: e.school, degree: e.degree ?? '' })
                    }
                  >
                    编辑
                  </button>
                  <button type="button" className="text-red-400" onClick={() => removeEducation(i)}>
                    删除
                  </button>
                </span>
              </li>
            ))}
            {draft.education.length === 0 && <li className="text-sm text-muted">暂无教育背景</li>}
          </ul>
          <div className="mt-2 grid gap-2 sm:grid-cols-[1fr_1.6fr_1fr_auto]">
            <input
              className={inputClass}
              placeholder="时间段（如 2023.09 - 至今）"
              value={educationEdit.period}
              onChange={(e) => setEducationEdit({ ...educationEdit, period: e.target.value })}
            />
            <input
              className={inputClass}
              placeholder="学校"
              value={educationEdit.school}
              onChange={(e) => setEducationEdit({ ...educationEdit, school: e.target.value })}
            />
            <input
              className={inputClass}
              placeholder="学位/专业"
              value={educationEdit.degree}
              onChange={(e) => setEducationEdit({ ...educationEdit, degree: e.target.value })}
            />
            <Button type="button" onClick={upsertEducation}>
              {educationEdit.index === null ? '添加' : '更新'}
            </Button>
          </div>
        </div>

        {/* 工作经历 */}
        <div>
          <p className="text-sm font-medium">工作经历</p>
          <ul className="mt-2 space-y-2">
            {draft.experiences.map((e, i) => (
              <li key={i} className="flex items-start justify-between gap-2 text-sm">
                <span className="min-w-0 text-muted">
                  <span className="text-muted">{e.period}</span> · {e.title}
                  {e.org ? ` @ ${e.org}` : ''}
                  {e.description ? ` — ${e.description}` : ''}
                </span>
                <span className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    className="text-accent"
                    onClick={() =>
                      setExperienceEdit({
                        index: i,
                        period: e.period,
                        title: e.title,
                        org: e.org ?? '',
                        description: e.description ?? '',
                      })
                    }
                  >
                    编辑
                  </button>
                  <button type="button" className="text-red-400" onClick={() => removeExperience(i)}>
                    删除
                  </button>
                </span>
              </li>
            ))}
            {draft.experiences.length === 0 && <li className="text-sm text-muted">暂无工作经历</li>}
          </ul>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <input
              className={inputClass}
              placeholder="时间段（如 2025.7 - 2025.8）"
              value={experienceEdit.period}
              onChange={(e) => setExperienceEdit({ ...experienceEdit, period: e.target.value })}
            />
            <input
              className={inputClass}
              placeholder="职位"
              value={experienceEdit.title}
              onChange={(e) => setExperienceEdit({ ...experienceEdit, title: e.target.value })}
            />
            <input
              className={inputClass}
              placeholder="公司/组织"
              value={experienceEdit.org}
              onChange={(e) => setExperienceEdit({ ...experienceEdit, org: e.target.value })}
            />
            <input
              className={inputClass}
              placeholder="描述（可选）"
              value={experienceEdit.description}
              onChange={(e) => setExperienceEdit({ ...experienceEdit, description: e.target.value })}
            />
          </div>
          <div className="mt-2">
            <Button type="button" onClick={upsertExperience}>
              {experienceEdit.index === null ? '添加' : '更新'}
            </Button>
          </div>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <Button type="submit">保存个人资料</Button>
      </form>
    </section>
  )
}
