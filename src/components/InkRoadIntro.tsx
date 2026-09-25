import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { inkRoadChapters, inkRoadTimes, type InkRoadTime } from '@/data/inkRoad'
import { createInkRoadEngine, type InkRoadCameraMode, type InkRoadEngine } from '@/components/inkRoadScene'
import { roadsideWorks } from '@/components/roadsideWorks'
import { markInkRoadSeen } from '@/components/inkRoadVisit'

gsap.registerPlugin(ScrollTrigger)

type TimeChoice = InkRoadTime | 'auto'

const NAV = [
  { to: '/projects', label: 'Projects' },
  { to: '/lab', label: 'Lab' },
  { to: '/tooluse', label: '工具分享' },
  { to: '/resume', label: 'Resume' },
]

const billboardSpecs = roadsideWorks

function autoTime(): InkRoadTime {
  const hour = new Date().getHours()
  if (hour < 5 || hour >= 21) return 'night'
  if (hour < 8) return 'dawn'
  if (hour < 11) return 'morning'
  if (hour < 15) return 'noon'
  if (hour < 18) return 'golden'
  return 'dusk'
}

function chapterAt(progress: number) {
  let index = 0
  inkRoadChapters.forEach((chapter, i) => {
    if (progress >= chapter.start - 0.001) index = i
  })
  return index
}

export default function InkRoadIntro() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const stageRef = useRef<HTMLDivElement | null>(null)
  const titleRef = useRef<HTMLDivElement | null>(null)
  const speedRef = useRef<HTMLSpanElement | null>(null)
  const compassRef = useRef<HTMLSpanElement | null>(null)
  const fillRef = useRef<HTMLSpanElement | null>(null)
  const engineRef = useRef<InkRoadEngine | null>(null)
  const chapterRef = useRef(0)
  const boardRef = useRef(-1)
  const navigate = useNavigate()
  const navigateRef = useRef(navigate)
  navigateRef.current = navigate
  const [reducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [chapter, setChapter] = useState(0)
  const [timeChoice, setTimeChoice] = useState<TimeChoice>('auto')
  const [cameraMode, setCameraMode] = useState<InkRoadCameraMode>('chase')
  // 入场动画（色带扫屏 + MJ 弹出）结束前，HUD 和章节标题保持隐藏
  const [entered, setEntered] = useState(reducedMotion)
  const [loaderDone, setLoaderDone] = useState(reducedMotion)
  const loaderRef = useRef<HTMLDivElement | null>(null)
  const [tokens, setTokens] = useState({ count: 0, total: 0 })
  const [moved, setMoved] = useState(false)
  const [failed, setFailed] = useState(false)
  const [nearBoard, setNearBoard] = useState(-1)

  const resolvedTime = timeChoice === 'auto' ? autoTime() : timeChoice
  const timeMeta = inkRoadTimes.find((item) => item.id === resolvedTime) ?? inkRoadTimes[1]

  useEffect(() => {
    const section = sectionRef.current
    const stage = stageRef.current
    if (!section || !stage) return undefined

    const lowPower = window.innerWidth < 760 || (navigator.hardwareConcurrency ?? 8) <= 4
    let engine: InkRoadEngine
    try {
      engine = createInkRoadEngine(stage, {
        lowPower,
        chapterStarts: inkRoadChapters.map((item) => item.start),
        billboards: billboardSpecs,
        onBillboard: (slug) => navigateRef.current(`/projects/${slug}`),
        onFrame: ({ speed, heading, progress, billboard }) => {
          if (billboard !== boardRef.current) {
            boardRef.current = billboard
            setNearBoard(billboard)
          }
          if (speedRef.current) speedRef.current.textContent = String(Math.min(Math.round(speed), 199)).padStart(3, '0')
          if (compassRef.current) compassRef.current.style.transform = `rotate(${heading}rad)`
          if (fillRef.current) fillRef.current.style.transform = `scaleX(${Math.min(progress / 0.94, 1)})`
          const next = chapterAt(progress)
          if (next !== chapterRef.current) {
            chapterRef.current = next
            setChapter(next)
          }
        },
        onToken: (count, total) => {
          setTokens({ count, total })
        },
      })
    } catch {
      setFailed(true)
      return undefined
    }
    engineRef.current = engine
    engine.setTime(autoTime(), true)

    const root = document.documentElement
    const cleanups: Array<() => void> = []

    if (reducedMotion) {
      engine.setProgress(0.06)
      engine.snap()
    } else {
      const trigger = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          engine.setProgress(self.progress)
          section.style.setProperty('--inkroad-end', String(gsap.utils.clamp(0, 1, (self.progress - 0.95) / 0.05)))
          root.classList.toggle('inkroad-active', self.progress < 0.97)
          if (self.progress > 0.004) setMoved(true)
        },
        onLeave: () => root.classList.remove('inkroad-active'),
        onEnterBack: () => root.classList.add('inkroad-active'),
      })
      engine.setProgress(trigger.progress)
      root.classList.toggle('inkroad-active', trigger.progress < 0.97 && section.getBoundingClientRect().bottom > 0)
      cleanups.push(() => trigger.kill())

      const observer = new IntersectionObserver(([entry]) => {
        engine.setActive(entry.isIntersecting && !document.hidden)
        if (!entry.isIntersecting) root.classList.remove('inkroad-active')
        else if (trigger.progress < 0.97) root.classList.add('inkroad-active')
      })
      observer.observe(section)
      cleanups.push(() => observer.disconnect())

      const onVisibility = () => engine.setActive(!document.hidden && section.getBoundingClientRect().bottom > 0)
      document.addEventListener('visibilitychange', onVisibility)
      cleanups.push(() => document.removeEventListener('visibilitychange', onVisibility))

      const onPointer = (event: PointerEvent) => {
        engine.setPointer((event.clientX / window.innerWidth) * 2 - 1, -((event.clientY / window.innerHeight) * 2 - 1))
      }
      window.addEventListener('pointermove', onPointer)
      cleanups.push(() => window.removeEventListener('pointermove', onPointer))
    }

    const onResize = () => engine.resize()
    window.addEventListener('resize', onResize)
    cleanups.push(() => window.removeEventListener('resize', onResize))

    // 开场挂上时总是从起点开始（首次访问或“重看开场”）
    window.scrollTo({ top: section.offsetTop })
    ScrollTrigger.refresh()
    markInkRoadSeen()

    return () => {
      cleanups.forEach((fn) => fn())
      root.classList.remove('inkroad-active')
      engine.dispose()
      engineRef.current = null
    }
  }, [reducedMotion])

  useEffect(() => {
    engineRef.current?.setTime(resolvedTime)
  }, [resolvedTime])

  useEffect(() => {
    engineRef.current?.setCameraMode(cameraMode)
  }, [cameraMode])

  useEffect(() => {
    const loader = loaderRef.current
    if (!loader || reducedMotion) return undefined
    const path = loader.querySelector('path')
    const logo = loader.querySelector('[data-loader-logo]')
    const tl = gsap.timeline({ onComplete: () => setLoaderDone(true) })
    tl.set(path, { strokeDasharray: '1 2', strokeDashoffset: 0, strokeWidth: 190 })
      .set(logo, { scale: 0, rotate: -64, autoAlpha: 0 })
      .to(logo, { scale: 1, rotate: 0, autoAlpha: 1, duration: 0.65, ease: 'elastic.out(1, 0.72)' }, 0.05)
      .to(logo, { scale: 0, rotate: 64, autoAlpha: 0, duration: 0.6, ease: 'elastic.in(1, 0.72)' }, 0.8)
      .to(path, { strokeDashoffset: -1, duration: 1.25, ease: 'power3.inOut' }, 0.65)
      .to(path, { strokeWidth: 12, duration: 1.1, ease: 'circ.out' }, 0.75)
      .call(() => setEntered(true), [], 1.35)
    return () => {
      tl.kill()
    }
  }, [reducedMotion])

  // 章节标题：逐词从压扁、倾斜的状态弹回原形
  useEffect(() => {
    const title = titleRef.current
    if (!title || reducedMotion || !entered) return undefined
    const tl = gsap.timeline()
    tl.fromTo(
      title.querySelectorAll('[data-ink-word]'),
      { transformOrigin: 'top left', yPercent: -10, xPercent: 40, scaleY: 0.1, scaleX: 0.85, rotate: 8, opacity: 0 },
      { yPercent: 0, xPercent: 0, scaleY: 1, scaleX: 1, rotate: 0, opacity: 1, duration: 1.1, ease: 'elastic.out(1, 0.72)', stagger: 0.07 },
    ).fromTo(
      title.querySelectorAll('[data-ink-fade]'),
      { y: '-0.75em', opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'expo.out', stagger: 0.08 },
      0.15,
    )
    return () => {
      tl.kill()
    }
  }, [chapter, entered, reducedMotion])

  const scrollToProgress = (progress: number) => {
    const section = sectionRef.current
    if (!section) return
    const distance = section.offsetHeight - window.innerHeight
    window.scrollTo({ top: section.offsetTop + distance * progress, behavior: reducedMotion ? 'auto' : 'smooth' })
  }

  const skip = () => {
    const section = sectionRef.current
    if (!section) return
    window.scrollTo({ top: section.offsetTop + section.offsetHeight, behavior: reducedMotion ? 'auto' : 'smooth' })
  }


  const current = inkRoadChapters[chapter]
  const board = nearBoard >= 0 ? billboardSpecs[nearBoard] : null

  return (
    <section
      ref={sectionRef}
      className={`inkroad ${reducedMotion ? 'inkroad-static' : ''}`}
      data-time={resolvedTime}
      data-entered={entered}
      aria-label="Ink road intro"
    >
      {!loaderDone && (
        <div ref={loaderRef} className="inkroad-loader" aria-hidden="true">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M -30 118 C 10 70, 38 112, 56 62 S 88 4, 132 -18" pathLength={1} />
          </svg>
          <span data-loader-logo className="inkroad-loader-logo">MJ</span>
        </div>
      )}

      <div ref={stageRef} className="inkroad-stage">
        {failed && <div className="inkroad-fallback" aria-hidden="true" />}

        <p className="sr-only">
          Minyu Ji 的个人主页开场：一段水彩墨线风格的公路，滚动页面驾驶小车依次经过起点巷、提示词大道、全栈桥、产品回环与折叠天际，随后进入个人介绍。
        </p>

        <div className="inkroad-hud">
          <div className="inkroad-corner inkroad-top-left">
            <div className="inkroad-brand">
              <span className="brand-monogram" aria-hidden="true">MJ</span>
              <span>
                <strong>Minyu Ji / 吉敏宇</strong>
                <small>Ink &amp; wash road</small>
              </span>
            </div>
            <div className="inkroad-time" role="group" aria-label="时间段">
              <span className="inkroad-clock">
                <b>{timeMeta.clock}</b> {timeMeta.label}
              </span>
              {inkRoadTimes.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="inkroad-chip inkroad-time-chip"
                  aria-pressed={timeChoice === item.id}
                  onClick={() => setTimeChoice(item.id)}
                >
                  {item.label}
                </button>
              ))}
              <button type="button" className="inkroad-chip inkroad-time-chip" aria-pressed={timeChoice === 'auto'} onClick={() => setTimeChoice('auto')}>
                Auto
              </button>
            </div>
          </div>

          <nav className="inkroad-corner inkroad-top-right" aria-label="快速跳转">
            {NAV.map((item) => (
              <Link key={item.to} to={item.to} className="inkroad-chip">
                {item.label} ↗
              </Link>
            ))}
          </nav>

          <div ref={titleRef} key={current.id} className="inkroad-title" aria-live="polite">
            <span data-ink-fade className="inkroad-title-kicker">
              {String(chapter + 1).padStart(2, '0')} / {current.cn}
            </span>
            <h2 aria-label={current.title}>
              {current.title.split(' ').map((word, index) => (
                <span key={`${word}-${index}`} data-ink-word aria-hidden="true">
                  {word}
                </span>
              ))}
            </h2>
            <span data-ink-fade className="inkroad-title-tag">{current.tagline}</span>
          </div>

          {!moved && !reducedMotion && (
            <div className="inkroad-hint" aria-hidden="true">
              <span>Scroll to drive</span>
              <span>向下滚动开车</span>
              <i />
            </div>
          )}

          {board && (
            <Link key={board.slug} to={`/projects/${board.slug}`} className="inkroad-board-card inkroad-card">
              <span className="inkroad-board-index" aria-hidden="true">{String(nearBoard + 1).padStart(2, '0')}</span>
              <span className="inkroad-board-meta">
                <small>Roadside · {board.eyebrow}</small>
                <strong>{board.name}</strong>
              </span>
              <span className="inkroad-board-cta">查看详情 →</span>
            </Link>
          )}

          <div className="inkroad-route inkroad-card">
            <div className="inkroad-route-head">
              <strong>Route</strong>
              <span>{chapter + 1} / {inkRoadChapters.length}</span>
              <span>Tokens {tokens.count} / {tokens.total || '—'}</span>
            </div>
            <div className="inkroad-route-track">
              <span ref={fillRef} className="inkroad-route-fill" />
              {inkRoadChapters.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  className="inkroad-route-stop"
                  style={{ left: `${(item.start / 0.94) * 100}%` }}
                  aria-label={`跳到 ${item.title}`}
                  aria-current={index === chapter ? 'step' : undefined}
                  onClick={() => scrollToProgress(item.start + 0.01)}
                />
              ))}
            </div>
          </div>

          <div className="inkroad-corner inkroad-bottom-right inkroad-card">
            <span className="inkroad-compass" aria-hidden="true"><span ref={compassRef}>↑</span></span>
            <span className="inkroad-speed">
              <b ref={speedRef}>000</b>
              <small>tok/s</small>
            </span>
            <span className="inkroad-speed-meta">
              <strong>{current.title}</strong>
              <button type="button" className="inkroad-chip" onClick={() => setCameraMode(cameraMode === 'chase' ? 'top' : 'chase')}>
                Camera · {cameraMode === 'chase' ? 'Chase' : 'Top'}
              </button>
              <button type="button" className="inkroad-chip" onClick={skip}>Skip ↓</button>
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
