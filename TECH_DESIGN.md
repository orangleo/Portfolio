# 技术设计文档（TECH_DESIGN）：个人展示网站

| 项目 | 内容 |
|---|---|
| 文档版本 | v1.0 |
| 更新日期 | 2026-10-15 |
| 关联文档 | `PRD.md`、`AGENTS.md` |

---

## 1. 技术栈选择

| 层 | 选型 | 说明 |
|---|---|---|
| 框架 | React 19 | 函数组件 + Hooks，`strict` 模式 |
| 语言 | TypeScript 5（`strict: true`） | 全量类型安全 |
| 构建 | Vite 6 | 快速启动与 HMR，生产代码分割 |
| 样式 | TailwindCSS v4 | 原子化 CSS，`@theme` 定义设计令牌 |
| 状态管理 | Zustand v5 | 轻量全局状态（内容、主题状态、管理态） |
| 路由 | React Router v7 | SPA 路由，`/admin` 懒加载 |
| Markdown | `react-markdown` + `remark-gfm` + `rehype-highlight` + `rehype-sanitize` | 渲染与高亮，防 XSS |
| 图标 | `lucide-react`（轻量，按需引入） | 不引入重型 UI 库 |
| 持久化 | localStorage | 预置数据 + 覆盖合并 |
| 校验 | Zod（可选，管理页表单） | 编辑数据的前置校验 |

> 原则：**不引入重型 UI 组件库**（Ant Design、MUI、Element 等），样式全部基于 Tailwind 自建。

## 2. 项目结构

```
D:\Portfolio
├── public/
│   └── favicon.svg
├── src/
│   ├── main.tsx                 # 入口，挂载 Router
│   ├── App.tsx                  # 布局：星空背景 + 路由出口
│   ├── index.css                # Tailwind 入口 + 全局样式
│   ├── components/              # 复用组件
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Layout.tsx
│   │   ├── starfield/
│   │   │   ├── Starfield.tsx    # Canvas 挂载
│   │   │   └── useStarfield.ts  # 粒子系统 Hook（逻辑与渲染分离）
│   │   ├── ui/                  # 基础 UI（自建）
│   │   │   ├── Card.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Tag.tsx
│   │   │   ├── Section.tsx      # 区块容器（标题 + 间距）
│   │   │   └── ConfirmDialog.tsx # 删除二次确认
│   │   ├── skill/
│   │   │   └── SkillCard.tsx
│   │   ├── project/
│   │   │   └── ProjectCard.tsx
│   │   ├── blog/
│   │   │   ├── PostCard.tsx
│   │   │   └── MarkdownRenderer.tsx
│   │   └── sections/
│   │       ├── Hero.tsx
│   │       ├── About.tsx
│   │       ├── Skills.tsx
│   │       ├── Projects.tsx
│   │       ├── Blog.tsx
│   │       └── Contact.tsx
│   ├── pages/
│   │   ├── Home.tsx             # 单页各区块组合
│   │   ├── BlogList.tsx
│   │   ├── BlogPost.tsx
│   │   ├── Admin.tsx            # /admin 管理页
│   │   └── NotFound.tsx
│   ├── api/
│   │   ├── index.ts             # 对外暴露的 API 方法
│   │   ├── localStore.ts        # localStorage 读写封装
│   │   └── seed.ts              # 预置数据 + 合并逻辑
│   ├── data/
│   │   ├── profile.json
│   │   ├── skills.json
│   │   ├── projects.json
│   │   └── posts/               # 预置 Markdown 文章
│   │       ├── 2024-01-01-hello-world.md
│   │       └── ...
│   ├── store/
│   │   ├── contentStore.ts      # Profile/Skill/Project/Post 状态
│   │   └── authStore.ts         # 管理页会话态
│   ├── hooks/
│   │   ├── useRevealOnScroll.ts # 滚动淡入
│   │   └── usePrefersReducedMotion.ts
│   ├── utils/
│   │   ├── format.ts            # 日期/阅读时长
│   │   ├── markdown.ts          # Markdown 解析辅助
│   │   └── storage.ts           # storage key 常量与安全解析
│   └── types/
│       └── index.ts             # 数据模型类型定义
├── index.html
├── vite.config.ts
├── tailwind.config.ts / (v4: css @theme)
├── tsconfig.json
├── package.json
└── .gitignore
```

## 3. 数据模型（TypeScript 类型定义）

见 `src/types/index.ts`：

```ts
/** 个人资料 */
export interface Profile {
  name: string;              // 姓名/昵称
  title: string;             // 一句话定位
  bio: string;               // 简介（支持 Markdown）
  avatar?: string;           // 头像 URL
  location?: string;         // 所在城市
  status?: string;           // 职业状态
  email: string;             // 联系邮箱
  socials: SocialLink[];     // 社交链接
  highlights: string[];      // Hero 关键词标签
  experiences?: Experience[];// 经历时间线
}

export interface SocialLink {
  platform: string;          // github / twitter / linkedin / ...
  url: string;
  label?: string;
}

export interface Experience {
  period: string;            // 时间段，如 "2020 - 2024"
  title: string;             // 职位/学位
  org: string;               // 公司/学校
  description?: string;
}

/** 技能 */
export interface Skill {
  id: string;
  name: string;
  level: number;             // 熟练度 0–100
  category: string;          // 分组：frontend / backend / tools / ...
  description?: string;
}

/** 项目 */
export interface Project {
  id: string;
  name: string;
  description: string;
  cover?: string;            // 封面图 URL
  tags: string[];            // 技术栈标签
  repoUrl?: string;          // 源码链接
  demoUrl?: string;          // 演示链接
  featured?: boolean;        // 是否置顶
  createdAt: string;         // ISO 日期
}

/** 博客文章 */
export interface Post {
  id: string;
  slug: string;              // URL 标识
  title: string;
  summary: string;           // 摘要
  content: string;           // Markdown 正文
  tags: string[];
  createdAt: string;         // ISO 日期
  updatedAt?: string;
  draft?: boolean;           // 草稿（列表不展示）
}
```

## 4. 关键技术点

### 4.1 星空 Canvas 实现（`useStarfield.ts` + `Starfield.tsx`）

- 单 `<canvas>` 全屏铺底，`position: fixed`，`z-index: -1`，`pointer-events: none`，`aria-hidden="true"`。
- 粒子字段：`{ x, y, radius, baseAlpha, twinkleSpeed, vx, vy }`。
- 渲染循环：`requestAnimationFrame`，每帧清屏、更新位置、绘制星点（带亮度闪烁）。
- **鼠标视差**：监听 `mousemove`，将目标偏移量平滑插值（`lerp`）到相机偏移，粒子按深度分层产生不同位移（近层位移大、远层小）。
- **自适应**：
  - `devicePixelRatio` 缩放画布，避免模糊。
  - 按视口面积计算粒子数量上限（如 `min(maxParticles, area / factor)`），移动端减少。
  - `ResizeObserver` 响应尺寸变化重建。
- **性能与降级**：
  - 页面 `visibilitychange` 隐藏时 `cancelAnimationFrame`，恢复时重启。
  - `prefers-reduced-motion` 为真时：渲染静态星点（或减少动画），禁用视差。
  - 逻辑（Hook）与 Canvas 绘制分离，便于测试粒子算法。

### 4.2 Markdown 渲染（`MarkdownRenderer.tsx`）

- 使用 `react-markdown` + `remark-gfm`（表格、任务列表、删除线、自动链接）。
- 语法高亮：`rehype-highlight`，配合自定义 CSS 主题（暗色）。
- 安全：关闭 `remark-rehype` 的 `allowDangerousHtml`，并接入 `rehype-sanitize` 白名单过滤，防止 XSS。
- 自定义组件映射（`components` prop）：为 `a` 添加 `target="_blank" rel="noopener noreferrer"`，为标题生成锚点 id，样式化 `pre/code/table/blockquote`。
- 正文由 `Post.content` 提供；预置文章的正文在构建时从 `src/data/posts/*.md` 读取（`import.meta.glob`）。

### 4.3 路由守卫（`/admin`）

- `/admin` 使用路由懒加载（`React.lazy`）拆包。
- 守卫组件 `RequireAuth`：读取 `authStore` 会话标记，未通过时渲染口令输入表单。
- 口令校验：输入值与站点配置口令（环境变量 `VITE_ADMIN_PASSPHRASE`，MVP 可含默认值）比对；通过后写入 `sessionStorage`（会话级，避免持久暴露）。
- 明确边界：这是无后端下的轻量门禁，不保证强安全；接入真实后端后替换为服务端鉴权。

### 4.4 localStorage 模拟 API 层（`api/`）

- 抽象异步接口，形如：

```ts
export interface ContentApi {
  getProfile(): Promise<Profile>;
  getSkills(): Promise<Skill[]>;
  getProjects(): Promise<Project[]>;
  getPosts(): Promise<Post[]>;
  getPostBySlug(slug: string): Promise<Post | null>;
  // 管理操作（写入 localStorage）
  saveProject(p: Project): Promise<void>;
  deleteProject(id: string): Promise<void>;
  savePost(p: Post): Promise<void>;
  deletePost(id: string): Promise<void>;
  reset(): Promise<void>;          // 恢复预置数据
}
```

- `localStore.ts`：统一 storage key 前缀（如 `pf:`），提供安全读写（`try/catch` + JSON 解析校验，防止脏数据导致崩溃）。
- `seed.ts`：预置数据（`profile.json` / `skills.json` / `projects.json` / `posts/*.md`）作为默认值；读取时「预置数据 + localStorage 覆盖」合并：localStorage 存在则覆盖同名 `id`，删除记录以墓碑标记。
- 模拟延迟（如 `setTimeout 150–300ms`）以贴近真实异步，便于后续无缝替换为真实 HTTP API。
- `contentStore`（Zustand）持有合并后的数据，页面只消费 store，不直接碰 storage。

## 5. 目录/状态管理约定

- 页面组件（`pages/`）负责取数与编排，区块/卡片组件（`components/`）保持纯展示（受控 props），业务数据统一走 `contentStore`。
- 主题为唯一深色主题，无需主题切换状态；后续如引入双语再扩展 `settingsStore`。

## 6. 构建与部署

- `npm run dev` / `npm run build` / `npm run preview`。
- 生产构建输出 `dist/`，可部署至静态托管（Vercel / Netlify / GitHub Pages / Cloudflare Pages）。
- 预置 Markdown 通过 Vite `import.meta.glob` 内联打包，无需运行时网络请求。
