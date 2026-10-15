import type { ReactNode } from 'react'
import { useRevealOnScroll } from '@/hooks/useRevealOnScroll'

interface SectionProps {
  id?: string
  title?: string
  subtitle?: string
  children: ReactNode
}

export default function Section({ id, title, subtitle, children }: SectionProps) {
  const { ref, visible } = useRevealOnScroll<HTMLElement>()

  return (
    <section
      id={id}
      ref={ref}
      className={`mx-auto max-w-5xl px-6 py-16 transition-all duration-700 sm:py-20 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
      }`}
    >
      {title && <h2 className="text-3xl font-bold">{title}</h2>}
      {subtitle && <p className="mt-2 text-muted">{subtitle}</p>}
      <div className="mt-10">{children}</div>
    </section>
  )
}
