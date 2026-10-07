import type { PointerEvent as ReactPointerEvent, ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { replayInkRoad } from '@/components/inkRoadVisit'
import UnboxSection from '@/components/UnboxSection'
import WorksStrip from '@/components/WorksStrip'
import CapabilityInk, { type CapabilityItem } from '@/components/CapabilityInk'
import { useAboutCube } from '@/composables/useAboutCube'

function AboutFace({ children }: { children: ReactNode }) {
  return (
    <div data-about-cube-section className="about-cube-section">
      <div className="about-cube-viewport">
        <div className="about-cube-face">
          <div className="about-cube-content">{children}</div>
        </div>
      </div>
    </div>
  )
}

gsap.registerPlugin(ScrollTrigger)

const capabilityCards: CapabilityItem[] = [
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
  useAboutCube(pageRef)
  const [displayText, setDisplayText] = useState('')
  const typingStateRef = useRef({ roleIdx: 0, displayText: '', isDeleting: false })
  const pressurePointerRef = useRef({ active: false, x: 0, y: 0 })

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
    <div ref={pageRef} className="about-cube-page">
      <AboutFace>
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
                  <dl className="hero-info-list">
                    <div className="hero-info-row">
                      <dt className="hero-info-label">任职</dt>
                      <dd className="hero-info-content">
                        <div className="hero-info-position"><strong>DIP</strong><span>AI 工程师</span></div>
                      </dd>
                    </div>
                    <div className="hero-info-row">
                      <dt className="hero-info-label">教育</dt>
                      <dd className="hero-info-content hero-education-list">
                        <div className="hero-education-item">
                          <span className="hero-info-meta">硕士 · 2025.03 — 2026.10</span>
                          <span>Master of IT</span>
                        </div>
                        <div className="hero-education-item">
                          <span className="hero-info-meta">本科 · 2020.09 — 2024.07</span>
                          <span>南京信息工程大学</span>
                          <span className="hero-info-secondary">软件工程</span>
                        </div>
                      </dd>
                    </div>
                    <div className="hero-info-row">
                      <dt className="hero-info-label">方向</dt>
                      <dd className="hero-info-content">AI 应用开发 / AI 全栈 / AI 解决方案</dd>
                    </div>
                    <div className="hero-info-row">
                      <dt className="hero-info-label">邮箱</dt>
                      <dd className="hero-info-content hero-info-emails">
                        <a href="mailto:JX15996596656@163.com">JX15996596656@163.com</a>
                        <a href="mailto:minyuj207@gmail.com">minyuj207@gmail.com</a>
                      </dd>
                    </div>
                    <div className="hero-info-row">
                      <dt className="hero-info-label">主页</dt>
                      <dd className="hero-info-content hero-info-profiles">
                        <a href="https://github.com/Andrew-JX/" target="_blank" rel="noreferrer"><span className="hero-info-meta">GitHub</span>Andrew-JX ↗</a>
                        <a href="https://gitee.com/ji-minyu" target="_blank" rel="noreferrer"><span className="hero-info-meta">Gitee</span>ji-minyu ↗</a>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </section>

      </AboutFace>

      <AboutFace><WorksStrip /></AboutFace>

      <AboutFace>

        <CapabilityInk items={capabilityCards} />

      </AboutFace>

      <AboutFace><UnboxSection cards={narrativeSections} /></AboutFace>
    </div>
  )
}
