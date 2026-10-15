import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const links = [
  { to: '/', label: '首页', end: true },
  { to: '/about', label: '关于' },
  { to: '/projects', label: '项目' },
  { to: '/blog', label: '博客' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm transition-colors ${isActive ? 'text-accent' : 'text-muted hover:text-foreground'}`

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors ${
        scrolled ? 'bg-background/70 backdrop-blur' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-lg font-bold">
          Portfolio
        </Link>
        <div className="hidden gap-6 md:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={navLinkClass}>
              {l.label}
            </NavLink>
          ))}
          <Link to="/#contact" className="text-sm text-muted hover:text-foreground">
            联系
          </Link>
        </div>
        <button className="md:hidden" aria-label="切换菜单" onClick={() => setOpen(!open)}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>
      {open && (
        <div className="border-t border-line bg-background/95 px-6 py-4 md:hidden">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              onClick={() => setOpen(false)}
              className="block py-2 text-sm text-muted hover:text-foreground"
            >
              {l.label}
            </NavLink>
          ))}
          <Link
            to="/#contact"
            onClick={() => setOpen(false)}
            className="block py-2 text-sm text-muted hover:text-foreground"
          >
            联系
          </Link>
        </div>
      )}
    </header>
  )
}
