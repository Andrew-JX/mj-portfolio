import type { PointerEvent as ReactPointerEvent } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lanyard from '@/components/Lanyard'
import ProjectPreviewFrame from '@/components/ProjectPreviewFrame'
import { projects } from '@/data/projects'
import { getProjectMedia } from '@/data/projectMedia'

gsap.registerPlugin(ScrollTrigger)

type CapabilityCard = {
  id: string
  label: string
  title: string
  kicker: string
  summary: string
  bullets: string[]
}

const ABOUT_INTRO_SESSION_KEY = 'about-hero-intro-played'
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
    title: 'AI 产品经理视角',
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
const featuredSlugs = ['fitmind-ai', 'easemove', 'ai-pm-dev']
const signalMetrics = [
  { value: '1+', label: '年 AI 结对开发实践' },
  { value: '8+', label: '完整项目交付' },
  { value: '4', label: 'AI 主线能力方向' },
]
const pressureLines = [
  { text: 'MINYU', accent: false, cn: false },
  { text: 'JI', accent: true, cn: false },
  { text: '吉敏宇', accent: false, cn: true },
]

function hasPlayedAboutIntro() {
  try {
    return window.sessionStorage.getItem(ABOUT_INTRO_SESSION_KEY) === '1'
  } catch {
    return true
  }
}

function markAboutIntroPlayed() {
  try {
    window.sessionStorage.setItem(ABOUT_INTRO_SESSION_KEY, '1')
  } catch {
    // Storage can fail in private browsing; the page should still render.
  }
}

function isReloadNavigation() {
  const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
  return navigationEntry?.type === 'reload'
}

function syncIntroLineToHeroCard(root: HTMLElement) {
  const heroCard = root.querySelector<HTMLElement>('[data-hero-card-shell]')
  const introLineWrap = root.querySelector<HTMLElement>('[data-intro-line-wrap]')

  if (!heroCard || !introLineWrap) return

  const rect = heroCard.getBoundingClientRect()
  gsap.set(introLineWrap, {
    left: rect.left + rect.width / 2,
    top: rect.top + rect.height / 2,
    xPercent: -50,
    yPercent: -50,
  })
}

function getHeroIntroScale(root: HTMLElement) {
  const heroCard = root.querySelector<HTMLElement>('[data-hero-card-shell]')
  const introLineWrap = root.querySelector<HTMLElement>('[data-intro-line-wrap]')

  if (!heroCard || !introLineWrap) return 0.72

  const heroWidth = heroCard.getBoundingClientRect().width
  const lineWidth = introLineWrap.getBoundingClientRect().width

  if (heroWidth <= 0 || lineWidth <= 0) return 0.72

  return Math.min(Math.max(lineWidth / heroWidth, 0.12), 1)
}

export default function AboutPage() {
  const pageRef = useRef<HTMLDivElement | null>(null)
  const [displayText, setDisplayText] = useState('')
  const [introVisible, setIntroVisible] = useState(false)
  const typingStateRef = useRef({ roleIdx: 0, displayText: '', isDeleting: false })
  const pressurePointerRef = useRef({ active: false, x: 0, y: 0 })

  const featuredProjects = useMemo(
    () =>
      featuredSlugs
        .map((slug) => projects.find((project) => project.slug === slug))
        .filter((project): project is NonNullable<typeof project> => Boolean(project)),
    [],
  )

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
    const shouldPlayIntro = !reducedMotion && (isReloadNavigation() || !hasPlayedAboutIntro())
    const motionCleanups: Array<() => void> = []
    setIntroVisible(shouldPlayIntro)

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
      syncIntroLineToHeroCard(root)

      const playHeroIntro = () => {
        gsap
          .timeline({ defaults: { ease: 'power3.out' } })
          .from('[data-hero-kicker]', { y: 18, opacity: 0, duration: 0.55 })
          .from('[data-hero-copy]', { y: 28, opacity: 0, duration: 0.7 }, '-=0.18')
          .from('[data-hero-metric]', { y: 18, opacity: 0, duration: 0.45, stagger: 0.08 }, '-=0.36')
          .from('[data-hero-tag]', { scale: 0.9, opacity: 0, duration: 0.5, stagger: 0.08 }, '-=0.42')
      }

      if (reducedMotion) {
        gsap.set('[data-hero-card-shell]', { clearProps: 'all' })
        gsap.set('[data-hero-card-content]', { clearProps: 'all' })
        gsap.set('[data-hero-title-shell]', { clearProps: 'all' })
        gsap.set('[data-intro-overlay]', { autoAlpha: 0 })
      } else if (shouldPlayIntro) {
        markAboutIntroPlayed()
        const introScale = getHeroIntroScale(root)

        gsap.set('[data-hero-card-shell]', {
          opacity: 1,
          y: 22,
          rotateX: -89,
          scaleX: introScale,
          scaleY: introScale,
          transformOrigin: '50% 50%',
          transformPerspective: 2200,
        })
        gsap.set('[data-hero-card-content]', { opacity: 0 })
        gsap.set('[data-intro-overlay]', { autoAlpha: 1 })
        gsap.set('[data-intro-dot]', { autoAlpha: 0, scale: 0.18 })
        gsap.set('[data-intro-line]', { scaleX: 0.02, transformOrigin: '50% 50%' })
        gsap.set('[data-intro-line-wrap]', {
          autoAlpha: 1,
          rotateX: 0,
          transformOrigin: '50% 50%',
          transformPerspective: 2200,
        })

        gsap
          .timeline({
            defaults: { ease: 'power3.out' },
            onComplete: () => {
              setIntroVisible(false)
              playHeroIntro()
            },
          })
          .to('[data-intro-dot]', { autoAlpha: 1, scale: 1, duration: 0.24 })
          .to('[data-intro-line]', { scaleX: 1, duration: 0.68, ease: 'power4.inOut' }, '-=0.02')
          .to('[data-intro-overlay]', { autoAlpha: 0.62, duration: 0.34, ease: 'power1.out' }, '-=0.28')
          .to('[data-intro-dot]', { autoAlpha: 0, duration: 0.14 }, '-=0.2')
          .to('[data-intro-overlay]', { autoAlpha: 0, duration: 0.24, ease: 'power2.out' }, '+=0.02')
          .to('[data-intro-line-wrap]', { rotateX: -89, autoAlpha: 0, duration: 0.42, ease: 'power2.in' }, '<')
          .to('[data-hero-card-shell]', { y: 0, rotateX: 0, scaleX: 1, scaleY: 1, duration: 1, ease: 'power4.out' }, '-=0.18')
          .to('[data-hero-card-content]', { opacity: 1, duration: 0.34, ease: 'power2.out' }, '-=0.56')
      } else {
        gsap.set('[data-hero-card-shell]', { clearProps: 'all' })
        gsap.set('[data-hero-card-content]', { clearProps: 'all' })
        gsap.set('[data-hero-title-shell]', { clearProps: 'all' })
        gsap.set('[data-intro-overlay]', { autoAlpha: 0 })
        playHeroIntro()
      }

      if (!reducedMotion) {
        gsap.to('[data-hero-line]', {
          yPercent: -14,
          scale: 1.03,
          ease: 'none',
          stagger: 0.04,
          scrollTrigger: { trigger: '.hero-mast', start: 'top top', end: 'bottom top', scrub: 1.1 },
        })
        gsap.to('[data-hero-side]', {
          yPercent: -10,
          rotation: 1.6,
          ease: 'none',
          scrollTrigger: { trigger: '.hero-mast', start: 'top top', end: 'bottom top', scrub: 1.2 },
        })
        gsap.from('[data-showcase-card]', {
          opacity: 0,
          y: 42,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: '[data-showcase-grid]', start: 'top 78%' },
        })
        gsap.from('[data-focus-card]', {
          opacity: 0,
          y: 40,
          duration: 0.8,
          stagger: 0.14,
          ease: 'power3.out',
          scrollTrigger: { trigger: '[data-focus-grid]', start: 'top 76%' },
        })
      }

      const handleResize = () => syncIntroLineToHeroCard(root)
      window.addEventListener('resize', handleResize)
      motionCleanups.push(() => window.removeEventListener('resize', handleResize))

      setupPressureTitle()
      setupCapabilityCarousel()

      gsap.utils.toArray<HTMLElement>('[data-showcase-card]').forEach((card) => {
        const xTo = gsap.quickTo(card, 'x', { duration: 0.28, ease: 'power3.out' })
        const yTo = gsap.quickTo(card, 'y', { duration: 0.28, ease: 'power3.out' })
        const rotateTo = gsap.quickTo(card, 'rotation', { duration: 0.28, ease: 'power3.out' })
        const handleMove = (event: PointerEvent) => {
          const rect = card.getBoundingClientRect()
          const px = (event.clientX - rect.left) / rect.width - 0.5
          const py = (event.clientY - rect.top) / rect.height - 0.5
          xTo(px * 10)
          yTo(py * 10 - 6)
          rotateTo(px * 2.2)
        }
        const handleLeave = () => {
          xTo(0)
          yTo(0)
          rotateTo(0)
        }
        card.addEventListener('pointermove', handleMove)
        card.addEventListener('pointerleave', handleLeave)
        motionCleanups.push(() => {
          card.removeEventListener('pointermove', handleMove)
          card.removeEventListener('pointerleave', handleLeave)
        })
      })
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

  return (
    <div ref={pageRef} className="space-y-10 lg:space-y-14">
      <div aria-hidden="true" data-intro-overlay className={`hero-intro-overlay ${!introVisible ? 'hero-intro-overlay-hidden' : ''}`}>
        <div className="hero-intro-stage">
          <div data-intro-line-wrap className="hero-intro-line-wrap">
            <span data-intro-line className="hero-intro-line" />
            <span data-intro-dot className="hero-intro-dot" />
          </div>
        </div>
      </div>

      <section data-hero-card-shell className="hero-mast">
        <div className="hero-lanyard-layer">
          <Lanyard
            position={[0, 0, 24]}
            gravity={[0, -40, 0]}
            frontImage={publicAsset('lanyard-card-front.svg')}
            backImage={publicAsset('lanyard-card-back.svg')}
            imageFit="cover"
          />
        </div>

        <div data-hero-card-content className="hero-card-content">
          <div className="hero-grid">
            <div className="space-y-7">
              <div data-hero-kicker className="eyebrow-pill">
                <span className="dot-live" />
                <span>求职方向：AI 应用开发 / AI 全栈 / AI 产品经理 / AI 解决方案</span>
              </div>

              <div className="space-y-4">
                <div data-hero-title-shell className="hero-title-shell" onPointerMove={handlePressureMove} onPointerLeave={resetPressure}>
                  <div className="impact-stack pressure-title">
                    {pressureLines.map((line) => (
                      <div
                        key={line.text}
                        data-hero-line
                        className={`impact-line pressure-word ${line.accent ? 'impact-line-accent' : ''} ${line.cn ? 'impact-line-cn' : ''}`}
                      >
                        {Array.from(line.text).map((char, index) => (
                          <span key={`${line.text}-${index}`} data-pressure-char className="pressure-char">
                            {char}
                          </span>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                <div data-hero-copy className="hero-body space-y-4">
                  <div className="text-2xl font-semibold sm:text-3xl">
                    <span className="text-gradient-sky typing-cursor">{displayText}</span>
                  </div>
                  <p className="max-w-2xl">
                    我目前的主线方向是 AI 应用开发、AI 全栈、AI 产品经理与 AI 解决方案。相比“把模型接上去”，
                    我更关心如何把 AI 能力做成真实可用、可解释、可验证的产品体验，并把状态流、接口边界、数据建模和部署落地一起处理好。
                  </p>
                  <p className="max-w-xl text-[0.95rem] text-stone-300/78">
                    我希望下一份工作能更靠近 AI 原生应用、智能工作台、agent 工具编排、AI 产品规划和需要强工程落地能力的解决方案团队。
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link className="button-primary" to="/projects">View Selected Works</Link>
                <Link className="button-secondary" to="/resume">Resume / 简历</Link>
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

            <div data-hero-side className="hero-side">
              <div className="hero-side-panel border-glow-card">
                <div className="section-title text-stone-500">Core Stack</div>
                <div className="space-y-4">
                  <div data-hero-tag className="orbital-tag">React / Vue / TypeScript</div>
                  <div data-hero-tag className="orbital-tag orbital-tag-shift">Node.js / Express / PostgreSQL</div>
                  <div data-hero-tag className="orbital-tag">Tool Calling / SSE Streaming</div>
                  <div data-hero-tag className="orbital-tag orbital-tag-shift">AI Product / Agent / Solution Design</div>
                </div>
              </div>
              <div className="hero-side-caption border-glow-card">
                <span className="index-badge">Monash University</span>
                <div className="hero-info-list">
                  <div><span className="hero-info-label">教育</span>Master of IT（2025.03 - 2026.10）</div>
                  <div><span className="hero-info-label">GPA</span>3.2 / 4.0</div>
                  <div><span className="hero-info-label">本科</span>南京信息工程大学 · 软件工程（专业前 10%）</div>
                  <div><span className="hero-info-label">英语</span>CET-6 · 雅思 6.5</div>
                  <div><span className="hero-info-label">方向</span>AI 应用开发 / AI 全栈 / AI 产品经理 / AI 解决方案</div>
                  <div><span className="hero-info-label">邮箱</span><span className="text-white">JX15996596656@163.com</span></div>
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

      <section className="section-shell space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <div className="section-title">重点项目</div>
            <h2 className="display-subhead max-w-3xl">A few recent projects.</h2>
          </div>
          <Link className="magnetic-link" to="/projects">查看完整项目列表</Link>
        </div>

        <div data-showcase-grid className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
          {featuredProjects.map((project) => (
            <Link key={project.slug} to={`/projects/${project.slug}`} data-showcase-card className="project-frame project-frame-featured border-glow-card">
              <ProjectPreviewFrame media={getProjectMedia(project.slug)} compact />
              <div className="project-frame-meta">
                <span className="index-badge">{project.positionTag}</span>
                <span className="project-period">{project.period}</span>
              </div>
              <div className="space-y-3">
                <h3 className="project-frame-title">{project.title}</h3>
                <p className="project-frame-copy">{project.oneLiner}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.stack.slice(0, 4).map((tech) => <span key={`${project.slug}-${tech}`} className="chip">{tech}</span>)}
              </div>
              <div className="project-frame-footer"><span>Case study</span><span className="project-arrow">→</span></div>
            </Link>
          ))}
        </div>
      </section>

      <section data-focus-grid className="grid gap-4">
        <article data-focus-card className="panel-card panel-citrus space-y-4">
          <div className="section-title">我现在在做什么</div>
          <div className="space-y-3 text-sm leading-7 text-stone-300/84">
            <p>现在我最想持续推进的方向，是把 AI 应用开发、全栈交付和产品判断放到一起做成长线。这也是为什么最近的项目里，我会同时关注 UI、状态流、后端边界、工具调用、数据来源和可解释性。</p>
            <p>FitMind 代表了我在 AI 应用工程和 AI 产品化上的主线尝试，ai-pm-dev 代表了我对 AI 产品经理 workflow 的抽象，EaseMove 则继续补强我在复杂交互、数据产品、全栈交付和工程化排障方面的经验。</p>
            <p>我希望下一份工作能更靠近 AI 应用、智能工作台、agent 工具编排、AI 产品经理协作、数据产品界面或需要较强工程化能力的解决方案团队。</p>
          </div>
        </article>

      </section>

      <section className="section-shell">
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="panel-card panel-citrus space-y-4">
            <div className="section-title">下一步想做的小东西</div>
            <div className="space-y-3 text-sm leading-7 text-stone-300/84">
              <p>除了主项目，我还想持续做一些更轻、更快、更验证想法的小工具和 AI 产品原型，放进自己的 Lab 里。它们不一定很大，但会更直接地体现我对 agent、工作流、自动化流程和产品手感的理解。</p>
              <p>目前重点会围绕 <span className="text-white">ai-pm-dev</span> 这条线推进：用 AI 产品经理视角拆需求、做原型、接工具、验证工作流，同时把 FitMind 继续往 agent 形态推进。</p>
            </div>
          </article>

          <article className="panel-card panel-contrast space-y-5">
            <div className="section-title">现在的 Lab 方向</div>
            <div className="space-y-3 text-sm leading-7 text-stone-300/84">
              <div className="detail-list-item">ai-pm-dev：偏 AI 产品经理、需求拆解、原型验证与解决方案沉淀。</div>
              <div className="detail-list-item">cat-note-illustrations：偏内容配图、Skill 封装和统一视觉表达。</div>
              <div className="detail-list-item">quickDate：偏轻交互、分享闭环和双端部署。</div>
              <div className="detail-list-item">FitMind Agent 化：偏工具编排、上下文和任务边界。</div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link className="button-primary" to="/lab">进入 Lab</Link>
              <a className="button-secondary" href="https://github.com/Andrew-JX/" target="_blank" rel="noreferrer">GitHub</a>
            </div>
          </article>
        </div>
      </section>
    </div>
  )
}
