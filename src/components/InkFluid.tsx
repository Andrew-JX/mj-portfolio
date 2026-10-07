import { useEffect, useRef } from 'react'
import { useTheme } from '@/composables/useTheme'
import { createInkFluid, type InkFluid as InkFluidSim } from '@/components/inkFluidSim'
import { onInkSplash } from '@/components/inkEvents'

// 全站墨水层：盖在内容上方、不接收指针，深色主题用滤色、浅色用正片叠底，
// 鼠标划过留下洋红与墨色的晕染。只在精确指针设备上启用，尊重减少动态效果。
export default function InkFluid() {
  const hostRef = useRef<HTMLDivElement | null>(null)
  const fluidRef = useRef<InkFluidSim | null>(null)
  const { isDark } = useTheme()

  useEffect(() => {
    fluidRef.current?.setTheme(isDark)
  }, [isDark])

  useEffect(() => {
    const host = hostRef.current
    if (!host) return undefined
    const enabled = window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)').matches
    if (!enabled) return undefined
    const fluid = createInkFluid(host, document.documentElement.getAttribute('data-theme') !== 'light')
    if (!fluid) return undefined
    fluidRef.current = fluid

    const root = document.documentElement
    let last: { x: number; y: number; t: number } | null = null
    let travelled = 0

    const onMove = (event: PointerEvent) => {
      // 开场公路是独立的画面，那段时间不注墨
      if (root.classList.contains('inkroad-active')) {
        last = null
        return
      }
      const now = performance.now()
      if (!last || now - last.t > 120) {
        last = { x: event.clientX, y: event.clientY, t: now }
        return
      }
      const dx = event.clientX - last.x
      const dy = event.clientY - last.y
      last = { x: event.clientX, y: event.clientY, t: now }
      const distance = Math.hypot(dx, dy)
      if (distance < 1) return
      travelled += distance
      const speed = Math.min(distance / 40, 1)
      // 洋红为主，走得越快墨色越重，每隔一段路落一笔更浓的墨
      const accent = travelled > 420 ? ((travelled = 0), 0.22) : 0
      fluid.splat(
        event.clientX / window.innerWidth,
        1 - event.clientY / window.innerHeight,
        dx * 6,
        -dy * 6,
        0.05 + speed * 0.09,
        0.015 + speed * 0.05 + accent,
      )
    }
    const onDown = (event: PointerEvent) => {
      if (root.classList.contains('inkroad-active')) return
      const x = event.clientX / window.innerWidth
      const y = 1 - event.clientY / window.innerHeight
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2
        fluid.splat(x, y, Math.cos(angle) * 140, Math.sin(angle) * 140, 0.16, 0.08, 0.0012)
      }
    }
    // 其他效果请求的溅墨（例如印章落下），按圆周向外推开一圈
    const stopSplash = onInkSplash(({ x, y, amount }) => {
      const u = x / window.innerWidth
      const v = 1 - y / window.innerHeight
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2
        fluid.splat(u, v, Math.cos(angle) * 220 * amount, Math.sin(angle) * 220 * amount, 0.2 * amount, 0.05 * amount, 0.0016)
      }
    })
    const onResize = () => fluid.resize()

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('resize', onResize)
      stopSplash()
      fluid.dispose()
      fluidRef.current = null
    }
  }, [])

  return <div ref={hostRef} className="ink-fluid-host" />
}
