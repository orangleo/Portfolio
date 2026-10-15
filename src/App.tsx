import { lazy, useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import RequireAuth from '@/components/auth/RequireAuth'
import Home from '@/pages/Home'
import { useContent } from '@/store/contentStore'

// 非首页路由懒加载，减少首屏体积
const About = lazy(() => import('@/pages/About'))
const Projects = lazy(() => import('@/pages/Projects'))
const BlogList = lazy(() => import('@/pages/BlogList'))
const BlogPost = lazy(() => import('@/pages/BlogPost'))
const Admin = lazy(() => import('@/pages/Admin'))
const NotFound = lazy(() => import('@/pages/NotFound'))

export default function App() {
  const load = useContent((s) => s.load)

  useEffect(() => {
    void load()
  }, [load])

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="projects" element={<Projects />} />
          <Route path="blog" element={<BlogList />} />
          <Route path="blog/:slug" element={<BlogPost />} />
          <Route
            path="admin"
            element={
              <RequireAuth>
                <Admin />
              </RequireAuth>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
