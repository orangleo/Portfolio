import { useEffect } from 'react'
import type { RefObject } from 'react'

interface Particle {
  x: number
  y: number
  z: number
  radius: number
  baseAlpha: number
  twinkleSpeed: number
  twinklePhase: number
  vx: number
  vy: number
}

/**
 * 星空粒子系统：负责 canvas 尺寸自适应、粒子绘制、鼠标视差、
 * 页面隐藏暂停与 prefers-reduced-motion 降级。逻辑与 React 渲染分离。
 *
 * 移动端性能优化（目标 ≥ 50fps）：
 * - 小屏降低粒子数量上限与生成密度；
 * - 小屏限制 devicePixelRatio，减少像素填充开销；
 * - 页面隐藏时停止 rAF，避免后台空转。
 */
export function useStarfield(canvasRef: RefObject<HTMLCanvasElement | null>): void {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let width = 0
    let height = 0
    let isMobile = false
    let particles: Particle[] = []
    let raf = 0
    let running = true
    let targetX = 0
    let targetY = 0
    let camX = 0
    let camY = 0

    const initParticles = () => {
      const area = width * height
      const maxParticles = isMobile ? 140 : 240
      const divisor = isMobile ? 16000 : 9000
      const count = Math.min(maxParticles, Math.floor(area / divisor))
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random(),
        radius: 0.4 + Math.random() * 1.6,
        baseAlpha: 0.3 + Math.random() * 0.7,
        twinkleSpeed: 0.5 + Math.random() * 2,
        twinklePhase: Math.random() * Math.PI * 2,
        vx: (Math.random() - 0.5) * 0.05,
        vy: (Math.random() - 0.5) * 0.05,
      }))
    }

    const resize = () => {
      isMobile = width < 768
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2)
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      initParticles()
    }

    const onMouseMove = (e: MouseEvent) => {
      targetX = (e.clientX / width - 0.5) * 2
      targetY = (e.clientY / height - 0.5) * 2
    }

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf)
        running = false
      } else if (!running) {
        running = true
        raf = requestAnimationFrame(tick)
      }
    }

    const tick = (now: number) => {
      if (!running) return
      camX += (targetX - camX) * 0.03
      camY += (targetY - camY) * 0.03

      ctx.clearRect(0, 0, width, height)
      const parallax = reduceMotion ? 0 : 20

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < -5) p.x = width + 5
        else if (p.x > width + 5) p.x = -5
        if (p.y < -5) p.y = height + 5
        else if (p.y > height + 5) p.y = -5

        const px = p.x + camX * parallax * p.z
        const py = p.y + camY * parallax * p.z

        let alpha = p.baseAlpha
        if (!reduceMotion) {
          alpha *= 0.6 + 0.4 * Math.sin(p.twinklePhase + now * 0.001 * p.twinkleSpeed)
        }

        ctx.globalAlpha = Math.max(0, Math.min(1, alpha))
        ctx.fillStyle = '#E5EAF3'
        ctx.beginPath()
        ctx.arc(px, py, p.radius, 0, Math.PI * 2)
        ctx.fill()
      }

      raf = requestAnimationFrame(tick)
    }

    resize()
    raf = requestAnimationFrame(tick)
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMouseMove)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [canvasRef])
}
