import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'

// 允许 code/span 携带 className，以保留 rehype-highlight 的语法高亮类名（其余仍白名单过滤）
const schema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    code: [...(defaultSchema.attributes?.code ?? []), 'className'],
    span: [...(defaultSchema.attributes?.span ?? []), 'className'],
  },
}

interface MarkdownRendererProps {
  content: string
  /** 按文档顺序对应的标题 id 列表（由 extractHeadings 生成），用于 TOC 锚点 */
  headingIds?: string[]
}

export default function MarkdownRenderer({ content, headingIds }: MarkdownRendererProps) {
  let headingIndex = 0
  const nextHeadingId = () => headingIds?.[headingIndex++]

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight, [rehypeSanitize, { schema }]]}
      components={{
        h1(props) {
          return <h1 className="mt-8 mb-4 text-3xl font-bold">{props.children}</h1>
        },
        h2(props) {
          return (
            <h2 id={nextHeadingId()} className="mt-10 mb-4 text-2xl font-bold">
              {props.children}
            </h2>
          )
        },
        h3(props) {
          return (
            <h3 id={nextHeadingId()} className="mt-8 mb-3 text-xl font-semibold">
              {props.children}
            </h3>
          )
        },
        a(props) {
          const { href, children } = props
          return (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline underline-offset-4"
            >
              {children}
            </a>
          )
        },
        p(props) {
          return <p className="my-4 leading-relaxed text-foreground/90">{props.children}</p>
        },
        ul(props) {
          return <ul className="my-4 list-disc space-y-1 pl-6">{props.children}</ul>
        },
        ol(props) {
          return <ol className="my-4 list-decimal space-y-1 pl-6">{props.children}</ol>
        },
        li(props) {
          return <li className="leading-relaxed">{props.children}</li>
        },
        blockquote(props) {
          return (
            <blockquote className="my-4 border-l-4 border-accent/40 pl-4 italic text-muted">
              {props.children}
            </blockquote>
          )
        },
        pre(props) {
          return (
            <pre className="my-4 overflow-x-auto rounded-card bg-panel-deep p-4 text-sm leading-relaxed">
              {props.children}
            </pre>
          )
        },
        code(props) {
          const { className, children } = props
          if (className) {
            return <code className={className}>{children}</code>
          }
          return (
            <code className="rounded bg-panel px-1.5 py-0.5 font-mono text-sm text-accent">
              {children}
            </code>
          )
        },
        table(props) {
          return (
            <div className="my-4 overflow-x-auto">
              <table className="w-full border-collapse text-sm">{props.children}</table>
            </div>
          )
        },
        th(props) {
          return (
            <th className="border border-line bg-panel px-3 py-2 text-left font-semibold">
              {props.children}
            </th>
          )
        },
        td(props) {
          return <td className="border border-line px-3 py-2">{props.children}</td>
        },
        img(props) {
          return (
            <img
              src={props.src}
              alt={props.alt}
              loading="lazy"
              className="my-4 max-w-full rounded-card"
            />
          )
        },
      }}
    >
      {content}
    </ReactMarkdown>
  )
}
