import { useState } from 'react'
import type { FormEvent } from 'react'
import { useContent } from '@/store/contentStore'
import { useAuth } from '@/store/authStore'
import Button from '@/components/ui/Button'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import ProfileManager from '@/components/admin/ProfileManager'
import SkillManager from '@/components/admin/SkillManager'

const inputClass =
  'w-full rounded-btn border border-line bg-panel-deep px-3 py-2 text-sm text-foreground outline-none focus:border-accent'

interface ProjectForm {
  id: string
  name: string
  description: string
  tags: string
}

interface PostForm {
  id: string
  title: string
  slug: string
  summary: string
  tags: string
  content: string
}

type Confirm = { type: 'project' | 'post' | 'reset'; id?: string }

const emptyProject: ProjectForm = { id: '', name: '', description: '', tags: '' }
const emptyPost: PostForm = { id: '', title: '', slug: '', summary: '', tags: '', content: '' }

export default function Admin() {
  const { projects, posts, deleteProject, deletePost, saveProject, savePost, reset } = useContent()
  const profile = useContent((s) => s.profile)
  const logout = useAuth((s) => s.logout)

  const [confirm, setConfirm] = useState<Confirm | null>(null)
  const [pForm, setPForm] = useState<ProjectForm>(emptyProject)
  const [postForm, setPostForm] = useState<PostForm>(emptyPost)
  const [resetVersion, setResetVersion] = useState(0)

  async function handleConfirm() {
    if (!confirm) return
    if (confirm.type === 'project' && confirm.id) void deleteProject(confirm.id)
    if (confirm.type === 'post' && confirm.id) void deletePost(confirm.id)
    if (confirm.type === 'reset') {
      await reset()
      // 重置后强制个人信息表单重新初始化，避免残留旧草稿
      setResetVersion((v) => v + 1)
    }
    setConfirm(null)
  }

  function submitProject(e: FormEvent) {
    e.preventDefault()
    const id = pForm.id || `project-${Date.now()}`
    void saveProject({
      id,
      name: pForm.name,
      description: pForm.description,
      tags: pForm.tags.split(',').map((t) => t.trim()).filter(Boolean),
      createdAt: new Date().toISOString().slice(0, 10),
    })
    setPForm(emptyProject)
  }

  function submitPost(e: FormEvent) {
    e.preventDefault()
    const id = postForm.id || `post-${Date.now()}`
    void savePost({
      id,
      slug: postForm.slug || id,
      title: postForm.title,
      summary: postForm.summary,
      content: postForm.content,
      tags: postForm.tags.split(',').map((t) => t.trim()).filter(Boolean),
      createdAt: new Date().toISOString().slice(0, 10),
    })
    setPostForm(emptyPost)
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-28">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">内容管理</h1>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => setConfirm({ type: 'reset' })}>
            恢复预置数据
          </Button>
          <Button variant="ghost" onClick={logout}>
            退出
          </Button>
        </div>
      </div>

      {profile && <ProfileManager key={`profile-${resetVersion}`} />}
      <SkillManager />

      <section className="mt-10">
        <h2 className="text-lg font-semibold">项目</h2>
        <ul className="mt-4 space-y-2">
          {projects.map((p) => (
            <li
              key={p.id}
              className="flex items-center justify-between rounded-card border border-line bg-panel p-3"
            >
              <div>
                <p className="font-medium">{p.name}</p>
                <p className="text-xs text-muted">{p.tags.join(' · ')}</p>
              </div>
              <div className="flex gap-2">
                <button
                  className="text-sm text-accent"
                  onClick={() =>
                    setPForm({
                      id: p.id,
                      name: p.name,
                      description: p.description,
                      tags: p.tags.join(', '),
                    })
                  }
                >
                  编辑
                </button>
                <button
                  className="text-sm text-red-400"
                  onClick={() => setConfirm({ type: 'project', id: p.id })}
                >
                  删除
                </button>
              </div>
            </li>
          ))}
        </ul>
        <form
          onSubmit={submitProject}
          className="mt-4 space-y-3 rounded-card border border-line bg-panel p-4"
        >
          <p className="text-sm font-medium">{pForm.id ? '编辑项目' : '新增项目'}</p>
          <input
            className={inputClass}
            placeholder="名称"
            value={pForm.name}
            onChange={(e) => setPForm({ ...pForm, name: e.target.value })}
            required
          />
          <input
            className={inputClass}
            placeholder="描述"
            value={pForm.description}
            onChange={(e) => setPForm({ ...pForm, description: e.target.value })}
          />
          <input
            className={inputClass}
            placeholder="技术标签（逗号分隔）"
            value={pForm.tags}
            onChange={(e) => setPForm({ ...pForm, tags: e.target.value })}
          />
          <Button type="submit">{pForm.id ? '保存' : '添加'}</Button>
        </form>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">博客</h2>
        <ul className="mt-4 space-y-2">
          {posts.map((p) => (
            <li
              key={p.id}
              className="flex items-center justify-between rounded-card border border-line bg-panel p-3"
            >
              <div>
                <p className="font-medium">{p.title}</p>
                <p className="text-xs text-muted">{p.slug}</p>
              </div>
              <div className="flex gap-2">
                <button
                  className="text-sm text-accent"
                  onClick={() =>
                    setPostForm({
                      id: p.id,
                      title: p.title,
                      slug: p.slug,
                      summary: p.summary,
                      tags: p.tags.join(', '),
                      content: p.content,
                    })
                  }
                >
                  编辑
                </button>
                <button
                  className="text-sm text-red-400"
                  onClick={() => setConfirm({ type: 'post', id: p.id })}
                >
                  删除
                </button>
              </div>
            </li>
          ))}
        </ul>
        <form
          onSubmit={submitPost}
          className="mt-4 space-y-3 rounded-card border border-line bg-panel p-4"
        >
          <p className="text-sm font-medium">{postForm.id ? '编辑文章' : '新增文章'}</p>
          <input
            className={inputClass}
            placeholder="标题"
            value={postForm.title}
            onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
            required
          />
          <input
            className={inputClass}
            placeholder="Slug"
            value={postForm.slug}
            onChange={(e) => setPostForm({ ...postForm, slug: e.target.value })}
          />
          <input
            className={inputClass}
            placeholder="摘要"
            value={postForm.summary}
            onChange={(e) => setPostForm({ ...postForm, summary: e.target.value })}
          />
          <input
            className={inputClass}
            placeholder="标签（逗号分隔）"
            value={postForm.tags}
            onChange={(e) => setPostForm({ ...postForm, tags: e.target.value })}
          />
          <textarea
            className={inputClass}
            placeholder="正文（Markdown）"
            rows={8}
            value={postForm.content}
            onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
            required
          />
          <Button type="submit">{postForm.id ? '保存' : '添加'}</Button>
        </form>
      </section>

      <ConfirmDialog
        open={confirm !== null}
        title={confirm?.type === 'reset' ? '恢复预置数据？' : '确认删除？'}
        description={
          confirm?.type === 'reset'
            ? '将清除所有本地修改并恢复初始内容。'
            : '此操作不可撤销。'
        }
        confirmText={confirm?.type === 'reset' ? '恢复' : '删除'}
        onConfirm={handleConfirm}
        onCancel={() => setConfirm(null)}
      />
    </div>
  )
}
