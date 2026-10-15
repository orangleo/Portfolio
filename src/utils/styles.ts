/** 按钮/链接统一样式，供 Button 组件与 Link/a 复用 */
export function buttonStyles(variant: 'primary' | 'ghost' = 'primary'): string {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-btn px-5 py-2.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent'
  if (variant === 'primary') return `${base} bg-accent text-white hover:bg-accent/85`
  return `${base} border border-line text-foreground hover:bg-panel`
}

const gradients = [
  'linear-gradient(135deg, #6366f1, #8b5cf6)',
  'linear-gradient(135deg, #0ea5e9, #6366f1)',
  'linear-gradient(135deg, #14b8a6, #0ea5e9)',
  'linear-gradient(135deg, #f59e0b, #ef4444)',
  'linear-gradient(135deg, #ec4899, #8b5cf6)',
]

/** 根据种子字符串生成确定性的渐变背景（用于无封面项目） */
export function coverGradient(seed: string): string {
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  return gradients[hash % gradients.length]
}
