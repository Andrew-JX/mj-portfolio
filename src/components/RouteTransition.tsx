import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { INK_SWEEP_PATH } from '@/components/inkSweep'
import { onInkNavigate } from '@/components/inkEvents'

// 站内跳转：洋红色带先沿曲线铺满屏幕，在遮挡下切换页面，再顺着同一条曲线退场
export default function RouteTransition() {
  const navigate = useNavigate()
  const location = useLocation()
  const overlayRef = useRef<HTMLDivElement | null>(null)
  const currentRef = useRef(location.pathname + location.search)
  currentRef.current = location.pathname + location.search
  const navigateRef = useRef(navigate)
  navigateRef.current = navigate

  useEffect(() => {
    const overlay = overlayRef.current
    const path = overlay?.querySelector('path')
    if (!overlay || !path) return undefined
    let timeline: gsap.core.Timeline | null = null
    const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const play = (to: string) => {
      timeline = gsap
        .timeline({ onComplete: () => gsap.set(overlay, { autoAlpha: 0 }) })
        .set(overlay, { autoAlpha: 1 })
        .set(path, { strokeDasharray: '1 2', strokeDashoffset: 1, strokeWidth: 14 })
        .to(path, { strokeDashoffset: 0, strokeWidth: 190, duration: 0.55, ease: 'power3.in' })
        .call(() => navigateRef.current(to))
        .to(path, { strokeDashoffset: -1, strokeWidth: 12, duration: 0.8, ease: 'power3.inOut' }, '+=0.12')
    }

    // 代码里发起的跳转（例如点开场里的 3D 广告牌）也走同一套转场
    const stopNavigate = onInkNavigate((to) => {
      if (to === currentRef.current) return
      if (reduced() || timeline?.isActive()) navigateRef.current(to)
      else play(to)
    })

    const onClick = (event: MouseEvent) => {
      if (timeline?.isActive()) return
      if (reduced()) return
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const anchor = (event.target as Element | null)?.closest?.('a')
      if (!anchor || (anchor.target && anchor.target !== '_self') || anchor.hasAttribute('download')) return
      if (anchor.closest('[data-dragged="true"]')) return
      const href = anchor.getAttribute('href') ?? ''
      if (!href.startsWith('#/')) return
      const to = href.slice(1)
      if (to === currentRef.current) return
      event.preventDefault()
      play(to)
    }

    document.addEventListener('click', onClick, true)
    return () => {
      document.removeEventListener('click', onClick, true)
      stopNavigate()
      timeline?.kill()
    }
  }, [])

  return (
    <div ref={overlayRef} className="route-sweep" aria-hidden="true">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d={INK_SWEEP_PATH} pathLength={1} />
      </svg>
    </div>
  )
}
