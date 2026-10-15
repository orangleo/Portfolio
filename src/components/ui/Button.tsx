import type { ButtonHTMLAttributes } from 'react'
import { buttonStyles } from '@/utils/styles'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost'
}

export default function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  return <button className={`${buttonStyles(variant)} ${className}`} {...props} />
}
