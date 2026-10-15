import type { HTMLAttributes } from 'react'

export default function Card({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-card border border-line bg-panel/60 p-6 transition-transform hover:-translate-y-1 ${className}`}
      {...props}
    />
  )
}
