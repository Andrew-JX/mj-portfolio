import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { roadsideWorks } from '@/components/roadsideWorks'

gsap.registerPlugin(ScrollTrigger)

// 首页作品横条：与公路广告牌同一批海报，拖动或用箭头浏览，卡片交替倾斜
const TILTS = [-2.4, 1.8, -1.6, 2.6, -2.1, 1.5]
const LIFTS = [6, -8, 4, -5, 9, -3]

export default function WorksStrip() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const xRef = useRef(0)
  const draggedRef = useRef(false)
  const [edges, setEdges] = useState({ start: true, end: false })

  const bounds = () => {
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track) return { min: 0, max: 0 }
    return { min: Math.min(viewport.clientWidth - track.scrollWidth, 0), max: 0 }
  }

  const moveTo = (x: number, duration = 0.9) => {
    const track = trackRef.current
    if (!track) return
    const { min, max } = bounds()
    const next = gsap.utils.clamp(min, max, x)
    xRef.current = next
    const start = next >= max - 2
    const end = next <= min + 2
    setEdges((prev) => (prev.start === start && prev.end === end ? prev : { start, end }))
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    gsap.to(track, { x: next, duration: reduced ? 0 : duration, ease: 'expo.out', overwrite: true })
  }

  const step = (direction: 1 | -1) => {
    const card = trackRef.current?.querySelector<HTMLElement>('[data-work-card]')
    const width = card ? card.offsetWidth + 28 : 320
    moveTo(xRef.current - direction * width)
  }

  useEffect(() => {
    const section = sectionRef.current
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!section || !viewport || !track) return undefined
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let pointerId: number | null = null
    let startX = 0
    let startTrackX = 0
    let lastX = 0
    let lastT = 0
    let velocity = 0

    const onDown = (event: PointerEvent) => {
      if (event.button !== 0) return
      pointerId = event.pointerId
      startX = lastX = event.clientX
      startTrackX = xRef.current
      lastT = performance.now()
      velocity = 0
      draggedRef.current = false
      gsap.killTweensOf(track)
    }
    const onMove = (event: PointerEvent) => {
      if (event.pointerId !== pointerId) return
      const dx = event.clientX - startX
      if (!draggedRef.current && Math.abs(dx) > 6) {
        draggedRef.current = true
        viewport.setPointerCapture(event.pointerId)
        viewport.classList.add('works-dragging')
      }
      if (!draggedRef.current) return
      const now = performance.now()
      velocity = (event.clientX - lastX) / Math.max(now - lastT, 1)
      lastX = event.clientX
      lastT = now
      const { min, max } = bounds()
      let next = startTrackX + dx
      if (next > max) next = max + (next - max) * 0.35
      if (next < min) next = min + (next - min) * 0.35
      xRef.current = next
      gsap.set(track, { x: next })
      if (!reduced) track.style.setProperty('--works-lean', `${gsap.utils.clamp(-6, 6, velocity * 4)}deg`)
    }
    const onUp = (event: PointerEvent) => {
      if (event.pointerId !== pointerId) return
      pointerId = null
      viewport.classList.remove('works-dragging')
      if (viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId)
      track.style.setProperty('--works-lean', '0deg')
      if (draggedRef.current) moveTo(xRef.current + velocity * 320)
    }
    // 拖动结束时吞掉随后的点击，避免误进详情页
    const onClickCapture = (event: MouseEvent) => {
      if (draggedRef.current) {
        event.preventDefault()
        event.stopPropagation()
        draggedRef.current = false
      }
    }
    // 键盘 Tab 到视野外的卡片时，把它移进视野
    const onFocusIn = (event: FocusEvent) => {
      const card = (event.target as HTMLElement).closest<HTMLElement>('[data-work-card]')
      if (!card) return
      viewport.scrollLeft = 0
      const left = card.offsetLeft + xRef.current
      const right = left + card.offsetWidth
      if (left < 0) moveTo(xRef.current - left + 24)
      else if (right > viewport.clientWidth) moveTo(xRef.current - (right - viewport.clientWidth) - 24)
    }
    // 触控板左右轻扫、或按住 Shift 滚鼠标滚轮时横向滑动；纯上下滚动仍交给页面
    let leanTimer: ReturnType<typeof setTimeout> | undefined
    const onWheel = (event: WheelEvent) => {
      const horizontal = Math.abs(event.deltaX) > Math.abs(event.deltaY)
      const delta = horizontal ? event.deltaX : event.shiftKey ? event.deltaY : 0
      if (!delta) return
      event.preventDefault()
      const scale = event.deltaMode === 1 ? 32 : event.deltaMode === 2 ? viewport.clientWidth : 1
      moveTo(xRef.current - delta * scale, 0.6)
      if (reduced) return
      track.style.setProperty('--works-lean', `${gsap.utils.clamp(-5, 5, -delta * 0.08)}deg`)
      clearTimeout(leanTimer)
      leanTimer = setTimeout(() => track.style.setProperty('--works-lean', '0deg'), 140)
    }
    const onResize = () => moveTo(xRef.current, 0)

    viewport.addEventListener('pointerdown', onDown)
    viewport.addEventListener('pointermove', onMove)
    viewport.addEventListener('pointerup', onUp)
    viewport.addEventListener('pointercancel', onUp)
    viewport.addEventListener('click', onClickCapture, true)
    viewport.addEventListener('focusin', onFocusIn)
    viewport.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('resize', onResize)

    const context = gsap.context(() => {
      if (reduced) return
      const tl = gsap.timeline({ scrollTrigger: { trigger: section, start: 'top 72%', once: true } })
      tl.fromTo(
        section.querySelectorAll('[data-works-word]'),
        { transformOrigin: 'top left', yPercent: -10, xPercent: 40, scaleY: 0.1, scaleX: 0.85, rotate: 8, opacity: 0 },
        { yPercent: 0, xPercent: 0, scaleY: 1, scaleX: 1, rotate: 0, opacity: 1, duration: 1.1, ease: 'elastic.out(1, 0.72)', stagger: 0.07 },
      ).fromTo(
        section.querySelectorAll('[data-work-card]'),
        { x: 160, y: 60, rotate: 14, opacity: 0 },
        { x: 0, y: 0, rotate: 0, opacity: 1, duration: 1.1, ease: 'expo.out', stagger: 0.08 },
        0.1,
      )
    }, section)

    return () => {
      context.revert()
      viewport.removeEventListener('pointerdown', onDown)
      viewport.removeEventListener('pointermove', onMove)
      viewport.removeEventListener('pointerup', onUp)
      viewport.removeEventListener('pointercancel', onUp)
      viewport.removeEventListener('click', onClickCapture, true)
      viewport.removeEventListener('focusin', onFocusIn)
      viewport.removeEventListener('wheel', onWheel)
      clearTimeout(leanTimer)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <section ref={sectionRef} className="works-strip" aria-label="Selected works">
      <div className="works-head">
        <div className="space-y-3">
          <div className="section-title">Selected works / 精选作品</div>
          <h2 className="display-subhead works-title" aria-label="Things I've shipped.">
            {"Things I've shipped.".split(' ').map((word, index) => (
              <span key={`${word}-${index}`} data-works-word aria-hidden="true">{word}</span>
            ))}
          </h2>
        </div>
        <div className="works-controls">
          <span className="works-hint" aria-hidden="true">左右滑动浏览 →</span>
          <button type="button" className="works-arrow" aria-label="上一个作品" disabled={edges.start} onClick={() => step(-1)}>←</button>
          <button type="button" className="works-arrow" aria-label="下一个作品" disabled={edges.end} onClick={() => step(1)}>→</button>
        </div>
      </div>

      <div ref={viewportRef} className="works-viewport">
        <div ref={trackRef} className="works-track">
          {roadsideWorks.map((work, index) => (
            <div key={work.slug} className="work-card-slot" data-work-card>
              <Link
                to={`/projects/${work.slug}`}
                data-tone={work.tone}
                className="work-card"
                style={{ '--work-tilt': `${TILTS[index % TILTS.length]}deg`, '--work-lift': `${LIFTS[index % LIFTS.length]}px` } as CSSProperties}
                draggable={false}
              >
                <span className="work-card-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <span className="work-card-meta">No.{String(index + 1).padStart(2, '0')} · {work.period}</span>
                <span className="work-card-eyebrow">{work.eyebrow}</span>
                <strong className="work-card-name">{work.name}</strong>
                <span className="work-card-caption">{work.caption}</span>
                <span className="work-card-foot">
                  <span className="work-card-chips">
                    {work.metrics.slice(0, 3).map((metric) => <span key={metric}>{metric}</span>)}
                  </span>
                  <span className="work-card-cta">查看详情 →</span>
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
