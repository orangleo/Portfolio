# AGENTS.md — AI 开发规范

本文件是 AI 助手（及协作者）在本仓库内开发的统一规范。任何代码改动请先阅读并遵守本文件。

---

## 1. 项目概述

一个深色主题的个人展示网站，包含：个人介绍、技能展示、项目展示、博客、联系区块，以及隐藏的 `/admin` 内容管理页。

- 技术栈：React 19 + TypeScript（strict）+ Vite + TailwindCSS v4 + Zustand + React Router + react-markdown。
- 设计基调：深色主背景 `#0B0F1A`，星空 Canvas 粒子背景（含鼠标视差），留白充足，圆角 12–16px，移动端优先响应式。
- 数据来源：预置数据文件（`src/data/`）+ localStorage 覆盖合并，通过 `src/api/` 统一访问。
- 详细需求见 `PRD.md`，架构与类型见 `TECH_DESIGN.md`。

## 2. 开发规范

### 2.1 代码风格

- 使用 TypeScript 严格模式（`strict: true`），不写 `any`，除非有明确注释说明原因。
- 使用函数组件 + Hooks；组件保持单一职责、体积克制。
- 使用 `const` / `let`，禁用 `var`；优先解构与可选链。
- 使用 ESLint + Prettier（配置统一，提交前格式化）。
- 导入顺序：第三方包 → 内部别名（`@/`）→ 相对路径 → 样式。
- 组件/函数上方用 JSDoc 简要说明用途；复杂逻辑补注释解释「为什么」，不解释「是什么」。

### 2.2 命名规范

- 文件/目录：`PascalCase`（组件）与 `camelCase`（工具/Hook），如 `ProjectCard.tsx`、`useStarfield.ts`。
- 组件：`PascalCase`（`Navbar`、`ProjectCard`）。
- 函数/变量/常量：`camelCase`（`getPosts`、`particleCount`）。
- 类型/接口：`PascalCase`（`Profile`、`SocialLink`），类型统一定义在 `src/types/index.ts`。
- 常量（配置/枚举）：`UPPER_SNAKE_CASE`（`STORAGE_PREFIX`）。
- CSS 类名遵循 Tailwind；自定义主题令牌集中在 Tailwind `@theme` 中定义，不在组件里散落硬编码色值。

### 2.3 组件与结构

- 纯展示组件放在 `src/components/`，页面放在 `src/pages/`；数据获取/业务逻辑不写进展示组件。
- 复用逻辑抽成 Hook（`src/hooks/`）；全局状态进 `src/store/`（Zustand）。
- 禁止在一个文件里堆叠多个不相关组件；每个文件默认导出一个组件。

### 2.4 数据访问

- 页面/组件**只通过 `src/api/` 暴露的方法或 `contentStore` 读写数据**，禁止直接操作 `localStorage`。
- 新增数据字段需同步更新 `src/types/` 与 `src/data/` 预置数据。

## 3. 测试要求

- 核心纯逻辑必须有单元测试：`api/`（合并/墓碑/重置逻辑）、`utils/`（日期、阅读时长、storage 安全解析）、`useStarfield` 粒子算法。
- 关键交互建议用 React Testing Library 覆盖：删除二次确认弹窗、`/admin` 口令守卫、博客 Markdown 渲染。
- 测试框架：Vitest + React Testing Library（可选用 Playwright 补充 E2E）。
- 提交代码前：`npm run build` 通过（无 TS 类型错误）、`npm run lint` 通过、相关测试通过。

## 4. 注意事项（红线）

- **禁止引入重型 UI 库**：不得引入 Ant Design、MUI、Element、Bootstrap 等；图标使用 `lucide-react` 按需引入，其余 UI 用 Tailwind 自建。
- **禁止使用 `eval`、`new Function`、`setTimeout(string)` 等动态执行**。
- **所有删除操作必须二次确认**：删除项目/技能/文章时弹确认框，确认后才调用删除 API。
- **Markdown 必须防 XSS**：不得开启 `allowDangerousHtml`，必须通过 `rehype-sanitize` 白名单过滤后渲染。
- **外链必须 `rel="noopener noreferrer"`**（及必要的 `target="_blank"`）。
- **星空背景性能**：必须用 `requestAnimationFrame`、页面隐藏时暂停、`prefers-reduced-motion` 降级、移动端限制粒子数量；禁止在 React 渲染循环里操作 Canvas（在 rAF 循环内绘制）。
- **localStorage 安全读写**：读写必须 `try/catch` 并校验解析结果，脏数据不得导致页面崩溃。
- **响应式**：改动布局时需验证 <640px / ≥768px / ≥1024px 三档，禁止出现横向滚动。
- **不要破坏数据模型**：修改 `Profile/Skill/Project/Post` 结构时必须同步更新预置数据与 `TECH_DESIGN.md` 类型定义。
- **`/admin` 鉴权边界**：MVP 为前端轻量门禁，不得在注释或文案中将其描述为「安全的后端鉴权」。

## 5. 提交与协作

- 一次改动聚焦一个目标，提交信息简洁说明「做了什么、为什么」。
- 改动涉及数据模型、设计令牌或公共 API 时，在提交信息中注明并同步更新相关文档。
