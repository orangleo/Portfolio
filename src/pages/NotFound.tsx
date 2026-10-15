import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-28 text-center">
      <p className="text-6xl font-bold text-accent">404</p>
      <p className="mt-4 text-lg text-muted">页面不存在</p>
      <Link to="/" className="mt-6 inline-block text-accent hover:underline">
        ← 返回首页
      </Link>
    </div>
  )
}
