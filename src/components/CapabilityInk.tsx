import { useEffect, useRef, useState, type CSSProperties } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTheme } from '@/composables/useTheme'
import type { CapabilityInk as CapabilityInkScene } from '@/components/capabilityInkScene'

gsap.registerPlugin(ScrollTrigger)

export type CapabilityItem = {
  id: string
  label: string
  title: string
  kicker: string
  summary: string
  bullets: string[]
}

// 能力画像：区块钉在屏幕上，滚动依次切换四项能力；右侧墨团在对应图形之间晕开再聚拢
export default function CapabilityInk({ items }: { items: CapabilityItem[] }) {
  const sectionRef = useRef<HTMLElement | null>(null)
  const canvasHostRef = useRef<HTMLDivElement | null>(null)
  const copyRef = useRef<HTMLDivElement | null>(null)
  const sceneRef = useRef<CapabilityInkScene | null>(null)
  const activeRef = useRef(0)
  const [active, setActive] = useState(0)
  const [reducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const { isDark } = useTheme()

  useEffect(() => {
    sceneRef.current?.setTheme(isDark)
  }, [isDark])

  useEffect(() => {
    const section = sectionRef.current
    const host = canvasHostRef.current
    if (!section || !host) return undefined
    let cancelled = false
    const cleanups: Array<() => void> = []
    const last = items.length - 1

    import('@/components/capabilityInkScene').then(({ createCapabilityInk }) => {
      if (cancelled) return
      const scene = createCapabilityInk(host, document.documentElement.getAttribute('data-theme') !== 'light')
      if (!scene) return
      sceneRef.current = scene
      cleanups.push(() => scene.dispose())

      if (reducedMotion) {
        scene.setMorph(0)
        return
      }

      // 每一项在滚动里占一段平台，平台之间才形变，停下来时图形是完整的
      const trigger = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          const raw = self.progress * last
          const step = Math.floor(raw)
          const local = raw - step
          const morph = Math.min(step + gsap.utils.clamp(0, 1, (local - 0.3) / 0.4), last)
          scene.setMorph(morph)
          const next = Math.min(Math.round(raw), last)
          if (next !== activeRef.current) {
            activeRef.current = next
            setActive(next)
          }
        },
      })
      cleanups.push(() => trigger.kill())

      const observer = new IntersectionObserver(([entry]) => scene.setActive(entry.isIntersecting && !document.hidden))
      observer.observe(section)
      cleanups.push(() => observer.disconnect())

      const onPointer = (event: PointerEvent) => {
        const rect = host.getBoundingClientRect()
        const side = Math.min(rect.width, rect.height)
        const x = (event.clientX - rect.left - rect.width / 2) / side
        const y = -(event.clientY - rect.top - rect.height / 2) / side
        const inside = Math.abs(x) < rect.width / side / 2 && Math.abs(y) < rect.height / side / 2
        scene.setPointer(x, y, inside)
      }
      window.addEventListener('pointermove', onPointer, { passive: true })
      cleanups.push(() => window.removeEventListener('pointermove', onPointer))
    })

    return () => {
      cancelled = true
      cleanups.forEach((fn) => fn())
      sceneRef.current = null
    }
  }, [items.length, reducedMotion])

  // 切换时标题逐词从压扁、倾斜的状态弹回，其余文字落下
  useEffect(() => {
    const copy = copyRef.current
    if (!copy || reducedMotion) return undefined
    const tl = gsap.timeline()
    tl.fromTo(
      copy.querySelectorAll('[data-cap-word]'),
      { transformOrigin: 'top left', yPercent: -10, xPercent: 40, scaleY: 0.1, scaleX: 0.85, rotate: 8, opacity: 0 },
      { yPercent: 0, xPercent: 0, scaleY: 1, scaleX: 1, rotate: 0, opacity: 1, duration: 1, ease: 'elastic.out(1, 0.72)', stagger: 0.06 },
    ).fromTo(
      copy.querySelectorAll('[data-cap-fade]'),
      { y: '-0.6em', opacity: 0 },
      { y: 0, opacity: 1, duration: 0.55, ease: 'expo.out', stagger: 0.06 },
      0.12,
    )
    return () => {
      tl.kill()
    }
  }, [active, reducedMotion])

  const jumpTo = (index: number) => {
    const section = sectionRef.current
    if (!section) return
    const distance = section.offsetHeight - window.innerHeight
    const top = section.getBoundingClientRect().top + window.scrollY + (distance * index) / Math.max(items.length - 1, 1)
    window.scrollTo({ top, behavior: reducedMotion ? 'auto' : 'smooth' })
  }

  const item = items[active]

  return (
    <section
      ref={sectionRef}
      className={`capability-ink ${reducedMotion ? 'capability-ink-static' : ''}`}
      style={{ '--cap-steps': items.length } as CSSProperties}
      aria-label="能力画像"
    >
      <div className="capability-ink-stage">
        <div className="capability-ink-copy">
          <div className="space-y-3">
            <div className="section-title">能力画像 / Capability portrait</div>
            <h2 className="display-subhead">What I focus on right now.</h2>
          </div>

          <ol className="capability-ink-steps" aria-label="能力列表">
            {items.map((entry, index) => (
              <li key={entry.id}>
                <button type="button" aria-current={index === active ? 'step' : undefined} onClick={() => jumpTo(index)}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  {entry.title}
                </button>
              </li>
            ))}
          </ol>

          <div ref={copyRef} key={item.id} className="capability-ink-detail" aria-live="polite">
            <span data-cap-fade className="capability-ink-kicker">{item.kicker}</span>
            <h3 aria-label={item.title}>
              {item.title.split(/(?<=AI)\s*/).map((word, index) => (
                <span key={`${word}-${index}`} data-cap-word aria-hidden="true">{word}</span>
              ))}
            </h3>
            <p data-cap-fade>{item.summary}</p>
            <div data-cap-fade className="capability-ink-chips">
              {item.bullets.map((bullet) => <span key={bullet}>{bullet}</span>)}
            </div>
          </div>
        </div>

        <div ref={canvasHostRef} className="capability-ink-canvas-host" aria-hidden="true">
          <span className="capability-ink-index">{String(active + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}</span>
        </div>
      </div>
    </section>
  )
}
