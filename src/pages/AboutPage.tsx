import type { PointerEvent as ReactPointerEvent } from 'react'
import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { replayInkRoad } from '@/components/inkRoadVisit'
import UnboxSection from '@/components/UnboxSection'
import WorksStrip from '@/components/WorksStrip'

const Lanyard = lazy(() => import('@/components/Lanyard'))

gsap.registerPlugin(ScrollTrigger)

type CapabilityCard = {
  id: string
  label: string
  title: string
  kicker: string
  summary: string
  bullets: string[]
}

const publicAsset = (path: string) => `${import.meta.env.BASE_URL}${path}`

const capabilityCards: CapabilityCard[] = [
  {
    id: 'motion',
    label: '01 / AI 应用开发',
    title: 'AI 应用开发',
    kicker: 'AI application engineering',
    summary: '我关注如何把模型能力、工具调用、业务数据和前端状态组织成真实可用的产品体验。',
    bullets: ['Tool Calling', 'SSE 流式状态', '可解释 / 可验证'],
  },
  {
    id: 'frontend',
    label: '02 / AI 全栈',
    title: 'AI 全栈交付',
    kicker: 'AI full-stack delivery',
    summary: '我能从前端工作台、后端接口、数据建模、认证部署一路串到 AI Provider 与工具执行层。',
    bullets: ['React / Vue / TypeScript', 'Node.js / PostgreSQL', 'Provider / Tool Loop'],
  },
  {
    id: 'systems',
    label: '03 / AI 产品经理',
    title: 'AI 产品视角',
    kicker: 'AI product thinking',
    summary: '我习惯先界定场景、用户任务、功能边界和验收标准，再把需求拆成可实现、可测试的系统链路。',
    bullets: ['需求拆解', '交互流程', '验收标准'],
  },
  {
    id: 'delivery',
    label: '04 / AI 解决方案',
    title: 'AI 解决方案落地',
    kicker: 'AI solution design',
    summary: '我会把业务问题拆成数据、工具、模型、界面和部署几层，优先做能被解释、复用和持续迭代的方案。',
    bullets: ['方案拆解', '工具编排', '工程化落地'],
  },
]

const roles = ['AI 应用开发工程师', 'AI 全栈开发者', 'AI 产品经理', 'AI 解决方案实践者']
const signalMetrics = [
  { value: '3年', label: 'AI 结对开发实践' },
  { value: '10+', label: '完整项目交付' },
  { value: '4', label: 'AI 主线能力方向' },
]
const narrativeSections = [
  {
    kicker: 'Current focus',
    title: '我现在在做什么',
    paragraphs: [
      '目前聚焦 AI 应用开发、AI 全栈和 AI 产品，正在把模型能力接入真实的产品与工作流。',
      '已经完成或正在交付的产品统一收进 Projects，包括 FitMind、ai-pm-dev、EaseMove，以及 cat-note-illustrations、quickDate 和 PureIP；我会继续关注 agent 工具编排、交互体验、数据边界与部署落地。',
    ],
  },
  {
    kicker: 'Lab direction',
    title: '现在的 Lab 方向',
    paragraphs: [
      'family-finance：面向家庭记账与债务管理的全栈应用，用 Taro 同时产出 H5 与微信小程序两端，范围仍在推进中，还没有收敛到最终形态。',
      'Lab 记录尚在探索和迭代中的方向；Projects 展示已有明确成果的项目。',
    ],
  },
]

const pressureLines = [
  { text: 'MINYU', accent: false, cn: false },
  { text: 'JI', accent: true, cn: false },
  { text: '吉敏宇', accent: false, cn: true },
]

export default function AboutPage() {
  const pageRef = useRef<HTMLDivElement | null>(null)
  const lanyardLayerRef = useRef<HTMLDivElement | null>(null)
  const [displayText, setDisplayText] = useState('')
  const [lanyardRevealed, setLanyardRevealed] = useState(false)
  const [showDesktopLanyard, setShowDesktopLanyard] = useState(() => window.matchMedia('(min-width: 1024px)').matches)
  const typingStateRef = useRef({ roleIdx: 0, displayText: '', isDeleting: false })
  const pressurePointerRef = useRef({ active: false, x: 0, y: 0 })

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 1024px)')
    const syncDesktopLanyard = () => setShowDesktopLanyard(desktopQuery.matches)

    syncDesktopLanyard()
    desktopQuery.addEventListener('change', syncDesktopLanyard)
    return () => desktopQuery.removeEventListener('change', syncDesktopLanyard)
  }, [])

  useEffect(() => {
    let typingTimer: ReturnType<typeof setTimeout> | undefined

    const tick = () => {
      const state = typingStateRef.current
      const target = roles[state.roleIdx % roles.length] ?? ''

      if (!state.isDeleting) {
        state.displayText = target.slice(0, state.displayText.length + 1)
        setDisplayText(state.displayText)
        if (state.displayText === target) {
          typingTimer = setTimeout(() => {
            state.isDeleting = true
            tick()
          }, 1800)
          return
        }
      } else {
        state.displayText = target.slice(0, state.displayText.length - 1)
        setDisplayText(state.displayText)
        if (state.displayText === '') {
          state.isDeleting = false
          state.roleIdx = (state.roleIdx + 1) % roles.length
        }
      }

      typingTimer = setTimeout(tick, state.isDeleting ? 48 : 92)
    }

    tick()
    return () => {
      if (typingTimer) clearTimeout(typingTimer)
    }
  }, [])

  useEffect(() => {
    const root = pageRef.current
    if (!root) return undefined

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const motionCleanups: Array<() => void> = []

    const setupPressureTitle = () => {
      if (reducedMotion) return

      const chars = Array.from(root.querySelectorAll<HTMLElement>('[data-pressure-char]'))
      if (chars.length === 0) return

      const startedAt = performance.now()
      const tickPressureTitle = () => {
        const elapsed = performance.now() - startedAt
        const pointer = pressurePointerRef.current
        const waveSpeed = pointer.active ? 0.007 : 0.0016
        const waveAmp = pointer.active ? 0.16 : 0.06

        chars.forEach((char, index) => {
          const wave = (Math.sin(elapsed * waveSpeed + index * 0.78) + 1) / 2
          let strength = wave * waveAmp

          if (pointer.active) {
            const rect = char.getBoundingClientRect()
            const centerX = rect.left + rect.width / 2
            const centerY = rect.top + rect.height / 2
            const distance = Math.hypot(pointer.x - centerX, pointer.y - centerY)
            strength += Math.max(0, 1 - distance / 260) * 0.82
          }

          char.style.setProperty('--pressure-scale-x', (1 - strength * 0.2).toFixed(3))
          char.style.setProperty('--pressure-scale-y', (1 + strength * 0.34).toFixed(3))
          char.style.setProperty('--pressure-y', `${(-strength * 14).toFixed(2)}px`)
          char.style.setProperty('--pressure-shadow', strength.toFixed(3))
        })
      }

      gsap.ticker.add(tickPressureTitle)
      motionCleanups.push(() => {
        gsap.ticker.remove(tickPressureTitle)
        chars.forEach((char) => {
          char.style.removeProperty('--pressure-scale-x')
          char.style.removeProperty('--pressure-scale-y')
          char.style.removeProperty('--pressure-y')
          char.style.removeProperty('--pressure-shadow')
        })
      })
    }

    const setupCapabilityCarousel = () => {
      const stage = root.querySelector<HTMLElement>('[data-capability-stage]')
      const cards = gsap.utils.toArray<HTMLElement>('[data-capability-card]')
      if (!stage || cards.length === 0) return

      let angle = 0
      let velocity = 0
      let startX = 0
      let startAngle = 0
      let pointerId: number | null = null
      let activeIndex = -1
      const autoSpeed = 0.0018

      const render = () => {
        const radiusX = Math.max(Math.min(stage.clientWidth * 0.34, 360), 150)
        const radiusZ = Math.max(Math.min(stage.clientWidth * 0.18, 230), 110)
        let nextActiveIndex = 0
        let frontDepth = -Infinity

        cards.forEach((card, index) => {
          const theta = angle + (index / cards.length) * Math.PI * 2
          const x = Math.sin(theta) * radiusX
          const z = Math.cos(theta) * radiusZ
          const depth = (Math.cos(theta) + 1) / 2

          if (z > frontDepth) {
            frontDepth = z
            nextActiveIndex = index
          }

          gsap.set(card, {
            xPercent: -50,
            yPercent: -50,
            x,
            z,
            rotationY: -theta * (180 / Math.PI),
            scale: 0.78 + depth * 0.28,
            opacity: 0.38 + depth * 0.62,
            zIndex: Math.round(depth * 100),
          })
        })

        if (nextActiveIndex !== activeIndex) {
          activeIndex = nextActiveIndex
          cards.forEach((card, index) => card.toggleAttribute('data-active', index === activeIndex))
        }
      }

      const onPointerDown = (event: PointerEvent) => {
        pointerId = event.pointerId
        startX = event.clientX
        startAngle = angle
        velocity = 0
        stage.setPointerCapture(pointerId)
        stage.classList.add('capability-carousel-dragging')
      }
      const onPointerMove = (event: PointerEvent) => {
        if (event.pointerId !== pointerId) return
        const nextAngle = startAngle + (event.clientX - startX) * 0.006
        velocity = nextAngle - angle
        angle = nextAngle
        render()
      }
      const onPointerUp = (event: PointerEvent) => {
        if (event.pointerId !== pointerId) return
        pointerId = null
        stage.classList.remove('capability-carousel-dragging')
        if (stage.hasPointerCapture(event.pointerId)) stage.releasePointerCapture(event.pointerId)
      }
      const tickCarousel = () => {
        if (pointerId !== null) return
        const hasMomentum = Math.abs(velocity) >= 0.0001
        angle += hasMomentum ? velocity : autoSpeed
        if (hasMomentum) velocity *= 0.92
        render()
      }
      const onResize = () => render()

      render()
      stage.addEventListener('pointerdown', onPointerDown)
      stage.addEventListener('pointermove', onPointerMove)
      stage.addEventListener('pointerup', onPointerUp)
      stage.addEventListener('pointercancel', onPointerUp)
      window.addEventListener('resize', onResize)
      gsap.ticker.add(tickCarousel)

      motionCleanups.push(() => {
        stage.removeEventListener('pointerdown', onPointerDown)
        stage.removeEventListener('pointermove', onPointerMove)
        stage.removeEventListener('pointerup', onPointerUp)
        stage.removeEventListener('pointercancel', onPointerUp)
        window.removeEventListener('resize', onResize)
        gsap.ticker.remove(tickCarousel)
      })
    }

    const context = gsap.context(() => {
      if (reducedMotion) {
        gsap.set('[data-hero-card-shell]', { clearProps: 'all' })
        gsap.set('[data-hero-card-content]', { clearProps: 'all' })
      } else {
        // 首屏入场：底色从右下角椭圆展开，名字逐行从压扁状态弹回，随后文案与数据落下
        const heroIntro = gsap
          .timeline({ paused: true, onComplete: () => gsap.set('[data-hero-card-shell]', { clearProps: 'clipPath' }) })
          .fromTo('[data-hero-card-shell]', { clipPath: 'ellipse(20% 0% at 100% 100%)' }, { clipPath: 'ellipse(150% 130% at 100% 100%)', duration: 1.1, ease: 'circ.out' }, 0)
          .fromTo(
            '[data-hero-word]',
            { transformOrigin: 'top left', yPercent: -10, xPercent: 40, scaleY: 0.1, scaleX: 0.85, rotate: 8, opacity: 0 },
            { yPercent: 0, xPercent: 0, scaleY: 1, scaleX: 1, rotate: 0, opacity: 1, duration: 1.2, ease: 'elastic.out(1, 0.72)', stagger: 0.09 },
            0.15,
          )
          .fromTo('[data-hero-copy]', { y: '-0.75em', opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'expo.out' }, 0.55)
          .fromTo('[data-hero-metric]', { y: '-0.75em', opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'expo.out', stagger: 0.07 }, 0.7)
        ScrollTrigger.create({ trigger: '[data-hero-card-shell]', start: 'top 72%', once: true, onEnter: () => heroIntro.play() })
      }

      if (!reducedMotion) {
        gsap.to('[data-hero-line]', {
          yPercent: -14,
          scale: 1.03,
          ease: 'none',
          stagger: 0.04,
          scrollTrigger: { trigger: '.hero-mast', start: 'top top', end: 'bottom top', scrub: 1.1 },
        })
      }

      setupPressureTitle()
      setupCapabilityCarousel()

    }, root)

    return () => {
      context.revert()
      motionCleanups.splice(0).forEach((fn) => fn())
    }
  }, [])

  const handlePressureMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    pressurePointerRef.current = { active: true, x: event.clientX, y: event.clientY }
  }

  const resetPressure = () => {
    pressurePointerRef.current.active = false
  }

  const handleLanyardToggle = () => {
    if (lanyardRevealed) {
      const layer = lanyardLayerRef.current
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (reducedMotion || !layer) {
        setLanyardRevealed(false)
        return
      }

      gsap.killTweensOf(layer)
      gsap.to(layer, {
        autoAlpha: 0,
        duration: 0.32,
        ease: 'power2.in',
        onComplete: () => {
          gsap.set(layer, { clearProps: 'opacity,visibility' })
          setLanyardRevealed(false)
        },
      })
      return
    }

    setLanyardRevealed(true)
  }

  return (
    <div ref={pageRef} className="space-y-10 lg:space-y-14">
      {showDesktopLanyard && (
        <button
          type="button"
          className={`hero-lanyard-trigger ${lanyardRevealed ? 'hero-lanyard-trigger-open' : ''}`}
          aria-label={lanyardRevealed ? '收起挂件' : '展开挂件'}
          aria-expanded={lanyardRevealed}
          onClick={handleLanyardToggle}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="hero-lanyard-trigger-icon">
            <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      {showDesktopLanyard && lanyardRevealed && (
        <div ref={lanyardLayerRef} className="hero-lanyard-layer">
          <Suspense fallback={null}>
            <Lanyard
              position={[0, 0, 24]}
              gravity={[0, -40, 0]}
              frontImage={publicAsset('lanyard-card-front.svg?v=2')}
              frontPortraitImage={publicAsset('profile-photo.jpg')}
              backImage={publicAsset('lanyard-card-back.svg')}
              imageFit="cover"
            />
          </Suspense>
        </div>
      )}

      <section id="about-core" data-hero-card-shell className="hero-mast">
        <div data-hero-card-content className="hero-card-content">
          <div className="hero-grid">
            <div className="space-y-7">
              <div className="space-y-4">
                <div data-hero-title-shell className="hero-title-shell" onPointerMove={handlePressureMove} onPointerLeave={resetPressure}>
                  <div className="impact-stack pressure-title">
                    {pressureLines.map((line) => (
                      <div
                        key={line.text}
                        data-hero-line
                        className={`impact-line pressure-word ${line.accent ? 'impact-line-accent' : ''} ${line.cn ? 'impact-line-cn' : ''}`}
                      >
                        <span data-hero-word className="hero-word">
                          {Array.from(line.text).map((char, index) => (
                            <span key={`${line.text}-${index}`} data-pressure-char className="pressure-char">
                              {char}
                            </span>
                          ))}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div data-hero-copy className="hero-body space-y-4">
                  <div className="text-2xl font-semibold sm:text-3xl">
                    <span className="text-gradient-sky typing-cursor">{displayText}</span>
                  </div>
                  <p className="max-w-2xl">
                    我目前的主线方向是 AI 应用开发、AI 全栈与 AI 解决方案。相比“把模型接上去”，
                    我更关心如何把 AI 能力做成真实可用、可解释、可验证的产品体验，并把状态流、接口边界、数据建模和部署落地一起处理好。
                  </p>
                  <p className="max-w-xl text-[0.95rem] text-stone-300/78">
                    我喜欢在产品、工程和 AI 之间来回穿梭，把模糊的想法整理成清晰的体验，再一步步做成可以真实使用、持续迭代的产品。
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link className="button-primary" to="/projects">View Selected Works</Link>
                <button className="button-secondary" type="button" onClick={replayInkRoad}>重看开场 ↺</button>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {signalMetrics.map((item) => (
                  <article key={item.label} data-hero-metric className="metric-card border-glow-card">
                    <div className="metric-value">{item.value}</div>
                    <div className="metric-label">{item.label}</div>
                  </article>
                ))}
              </div>
            </div>

            <div className="hero-side">
              <div className="hero-side-caption border-glow-card">
                <span className="index-badge">个人信息 / Profile</span>
                <div className="hero-info-list">
                  <div><span className="hero-info-label">教育</span>Master of IT（2025.03 - 2026.10）</div>
                  <div><span className="hero-info-label">本科</span>南京信息工程大学 · 软件工程（2020.9 - 2024.7）</div>
                  <div><span className="hero-info-label">方向</span>AI 应用开发 / AI 全栈 / AI 解决方案</div>
                  <div>
                    <span className="hero-info-label">邮箱</span>
                    <span className="text-white">JX15996596656@163.com / minyuj207@gmail.com</span>
                  </div>
                  <div>
                    <span className="hero-info-label">GitHub</span>
                    <a href="https://github.com/Andrew-JX/" target="_blank" rel="noreferrer">Andrew-JX</a>
                  </div>
                  <div>
                    <span className="hero-info-label">Gitee</span>
                    <a href="https://gitee.com/ji-minyu" target="_blank" rel="noreferrer">ji-minyu</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <WorksStrip />

      <section data-rail-section className="capability-carousel-section">
        <div className="space-y-3">
          <div className="section-title">能力画像</div>
          <h2 className="display-subhead max-w-3xl">What I focus on right now.</h2>
        </div>

        <div data-capability-stage className="capability-carousel-stage">
          <div data-capability-track className="capability-carousel-track">
            {capabilityCards.map((card) => (
              <article key={card.id} data-capability-card className="capability-card">
                <div className="rail-card-top">
                  <span className="index-badge">{card.label}</span>
                  <span className="rail-kicker">{card.kicker}</span>
                </div>
                <div className="space-y-4">
                  <h3 className="rail-title">{card.title}</h3>
                  <p className="rail-summary">{card.summary}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {card.bullets.map((bullet) => <span key={bullet} className="chip chip-citrus">{bullet}</span>)}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <UnboxSection cards={narrativeSections} />
    </div>
  )
}
