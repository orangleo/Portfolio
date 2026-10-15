import type { HTMLAttributes } from 'react'

export default function Tag({ className = '', ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={`inline-flex items-center rounded-tag border border-line bg-panel px-2.5 py-1 text-xs text-muted ${className}`}
      {...props}
    />
  )
}
