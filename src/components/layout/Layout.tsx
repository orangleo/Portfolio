import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import Starfield from '@/components/starfield/Starfield'

export default function Layout() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Starfield />
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<div className="py-28 text-center text-muted">加载中…</div>}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
