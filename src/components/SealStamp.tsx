import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { inkSplash } from '@/components/inkEvents'
import type { SealScene } from '@/components/sealScene'

// 页脚落款：每进入一个页面，滚到页脚时自动盖一次“吉敏宇印”，点一下再盖一次
export default function SealStamp() {
  const hostRef = useRef<HTMLDivElement | null>(null)
  const sceneRef = useRef<SealScene | null>(null)
  const [ready, setReady] = useState(false)
  // 换页后重新“上膛”：下次页脚进入视野时再盖一次
  const armedRef = useRef(true)
  const { pathname } = useLocation()

  useEffect(() => {
    armedRef.current = true
    const host = hostRef.current
    if (!host || !sceneRef.current) return undefined
    // 页面很短、页脚本来就在视野里时，等转场退场后直接盖
    const timer = window.setTimeout(() => {
      const rect = host.getBoundingClientRect()
      if (armedRef.current && rect.top < window.innerHeight * 0.85 && rect.bottom > 0) {
        armedRef.current = false
        sceneRef.current?.stamp()
      }
    }, 1400)
    return () => window.clearTimeout(timer)
  }, [pathname])

  useEffect(() => {
    const host = hostRef.current
    if (!host) return undefined
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let cancelled = false
    let showObserver: IntersectionObserver | null = null

    // 接近视口才加载 three 与场景，进入视口过半时盖第一次
    const loadObserver = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      loadObserver.disconnect()
      import('@/components/sealScene').then(({ createSealScene }) => {
        if (cancelled) return
        try {
          sceneRef.current = createSealScene(host, reducedMotion, (x, y) => inkSplash(x, y, 0.8))
        } catch {
          return
        }
        setReady(true)
        showObserver = new IntersectionObserver(([visible]) => {
          if (!visible.isIntersecting || !armedRef.current) return
          armedRef.current = false
          sceneRef.current?.stamp()
        }, { threshold: 0.6 })
        showObserver.observe(host)
      })
    }, { rootMargin: '400px' })
    loadObserver.observe(host)

    return () => {
      cancelled = true
      loadObserver.disconnect()
      showObserver?.disconnect()
      sceneRef.current?.dispose()
      sceneRef.current = null
    }
  }, [])

  return (
    <button type="button" className="seal-stamp" aria-label="盖一枚吉敏宇的印章" disabled={!ready} onClick={() => sceneRef.current?.stamp()}>
      <div ref={hostRef} className="seal-stamp-canvas" />
      <span className="seal-stamp-caption">落款 · 点一下再盖一次</span>
    </button>
  )
}
