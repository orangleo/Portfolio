import { useRef } from 'react'
import { useStarfield } from './useStarfield'

/** 全屏星空背景，装饰性元素，不参与交互 */
export default function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null)
  useStarfield(ref)

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
    />
  )
}
