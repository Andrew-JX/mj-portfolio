<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projects } from '@/data/projects'

gsap.registerPlugin(ScrollTrigger)

type CapabilityCard = {
  id: string
  label: string
  title: string
  kicker: string
  summary: string
  bullets: string[]
}

const pageRef = ref<HTMLElement | null>(null)
const roleIdx = ref(0)
const displayText = ref('')
const isDeleting = ref(false)
let typingTimer: ReturnType<typeof setTimeout> | undefined
const motionCleanups: Array<() => void> = []

const heroRibbons = ['React / Vue', 'AI Application', 'Interaction-first', 'Full-stack Delivery']

const capabilityCards: CapabilityCard[] = [
  {
    id: 'motion',
    label: '01 / 前端与体验',
    title: '前端与交互',
    kicker: 'Frontend & interaction',
    summary: '我关注的不只是页面完成度，也包括交互透明度、信息层级和长期可维护性。',
    bullets: ['React 18 / Vue 3', '复杂页面组织', '地图 / AI / 多端体验'],
  },
  {
    id: 'frontend',
    label: '02 / AI 应用开发',
    title: 'AI 应用开发',
    kicker: 'AI application engineering',
    summary: '我更关心如何把 AI 能力做成真实可用、可解释、可验证的产品体验，而不是只做模型接入。',
    bullets: ['Tool Calling', 'SSE 流式状态', '边界 / 校验 / 解释性'],
  },
  {
    id: 'systems',
    label: '03 / 全栈交付',
    title: '全栈交付',
    kicker: 'End-to-end delivery',
    summary: '除了前端本身，我也能把接口设计、认证、数据库、缓存、联调和部署串成一条完整交付链路。',
    bullets: ['Express / PostgreSQL', 'JWT / CORS / 限流', '从体验反推接口'],
  },
  {
    id: 'delivery',
    label: '04 / 工程化与架构',
    title: '工程化与架构',
    kicker: 'Architecture & engineering',
    summary: '我习惯先想分层、状态机、事件契约、数据建模和扩展边界，再落到具体代码。',
    bullets: ['状态流设计', 'AI 协作质量控制', '复杂系统结构化'],
  },
]

const roles = [
  '前端开发工程师',
  'AI 应用开发工程师',
  '全栈交付实践者',
  '工程化架构设计实践者',
]

const featuredSlugs = ['fitmind-ai', 'easemove', 'real-scene-3d']

const featuredProjects = computed(() =>
  featuredSlugs
    .map((slug) => projects.find((project) => project.slug === slug))
    .filter((project): project is NonNullable<typeof project> => Boolean(project)),
)

const signalMetrics = [
  { value: '1+', label: '年 AI 结对开发实践' },
  { value: '8+', label: '完整项目交付' },
  { value: '3', label: '主线能力方向' },
]

let cleanup: (() => void) | undefined

function tick() {
  const target = roles[roleIdx.value % roles.length] ?? ''

  if (!isDeleting.value) {
    displayText.value = target.slice(0, displayText.value.length + 1)
    if (displayText.value === target) {
      typingTimer = setTimeout(() => {
        isDeleting.value = true
        tick()
      }, 1800)
      return
    }
  } else {
    displayText.value = target.slice(0, displayText.value.length - 1)
    if (displayText.value === '') {
      isDeleting.value = false
      roleIdx.value = (roleIdx.value + 1) % roles.length
    }
  }

  typingTimer = setTimeout(tick, isDeleting.value ? 48 : 92)
}

onMounted(async () => {
  await nextTick()

  if (!pageRef.value) {
    return
  }

  const root = pageRef.value
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  tick()

  const context = gsap.context(() => {
    if (reducedMotion) {
      return
    }

    const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } })
    heroTimeline
      .from('[data-hero-kicker]', { y: 18, opacity: 0, duration: 0.55 })
      .from('[data-hero-line]', { yPercent: 105, opacity: 0, duration: 0.9, stagger: 0.09 }, '-=0.15')
      .from('[data-hero-copy]', { y: 28, opacity: 0, duration: 0.7 }, '-=0.45')
      .from('[data-hero-metric]', { y: 18, opacity: 0, duration: 0.45, stagger: 0.08 }, '-=0.4')
      .from('[data-hero-tag]', { scale: 0.9, opacity: 0, duration: 0.5, stagger: 0.08 }, '-=0.45')
      .from('[data-ribbon]', { x: -24, opacity: 0, duration: 0.5, stagger: 0.06 }, '-=0.45')

    gsap.to('[data-ribbon]', {
      yPercent: -18,
      duration: 2.4,
      ease: 'sine.inOut',
      stagger: {
        each: 0.12,
        from: 'random',
        repeat: -1,
        yoyo: true,
      },
    })

    gsap.to('[data-hero-line]', {
      yPercent: -14,
      scale: 1.03,
      ease: 'none',
      stagger: 0.04,
      scrollTrigger: {
        trigger: '.hero-mast',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.1,
      },
    })

    gsap.to('[data-hero-side]', {
      yPercent: -10,
      rotation: 1.6,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero-mast',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.2,
      },
    })

    gsap.from('[data-showcase-card]', {
      opacity: 0,
      y: 42,
      duration: 0.9,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '[data-showcase-grid]',
        start: 'top 78%',
      },
    })

    gsap.from('[data-focus-card]', {
      opacity: 0,
      y: 40,
      duration: 0.8,
      stagger: 0.14,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '[data-focus-grid]',
        start: 'top 76%',
      },
    })

    const railTrack = root.querySelector<HTMLElement>('[data-rail-track]')
    const railViewport = root.querySelector<HTMLElement>('[data-rail-viewport]')
    const railCards = gsap.utils.toArray<HTMLElement>('[data-rail-card]')

    if (railTrack && railViewport && railCards.length > 0) {
      const maxShift = () => Math.max(railTrack.scrollWidth - railViewport.offsetWidth, 0)

      railCards.forEach((card) => {
        const rotateXTo = gsap.quickTo(card, 'rotationX', { duration: 0.35, ease: 'power3.out' })
        const rotateYTo = gsap.quickTo(card, 'rotationY', { duration: 0.35, ease: 'power3.out' })
        const yTo = gsap.quickTo(card, 'y', { duration: 0.35, ease: 'power3.out' })

        const handleMove = (event: PointerEvent) => {
          const rect = card.getBoundingClientRect()
          const px = (event.clientX - rect.left) / rect.width - 0.5
          const py = (event.clientY - rect.top) / rect.height - 0.5
          rotateYTo(px * 10)
          rotateXTo(py * -8)
          yTo(-6)
        }

        const handleLeave = () => {
          rotateYTo(0)
          rotateXTo(0)
          yTo(0)
        }

        card.addEventListener('pointermove', handleMove)
        card.addEventListener('pointerleave', handleLeave)
        motionCleanups.push(() => {
          card.removeEventListener('pointermove', handleMove)
          card.removeEventListener('pointerleave', handleLeave)
        })
      })

      gsap.to(railTrack, {
        x: () => -maxShift(),
        ease: 'none',
        scrollTrigger: {
          trigger: '[data-rail-section]',
          start: 'top top',
          end: () => `+=${Math.max(maxShift() + window.innerHeight * 0.55, window.innerHeight)}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: ({ progress }) => {
            railCards.forEach((card, index) => {
              const sway = Math.sin(progress * 14 + index * 0.7) * 16
              const tilt = Math.sin(progress * 9 + index * 0.6) * 5.8
              const depth = 1 + Math.sin(progress * 10 + index * 0.5) * 0.03
              gsap.set(card, { y: sway, rotation: tilt, scale: depth, transformOrigin: '50% 85%' })
            })
          },
        },
      })
    }

    const showcaseCards = gsap.utils.toArray<HTMLElement>('[data-showcase-card]')
    showcaseCards.forEach((card) => {
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

  cleanup = () => context.revert()
})

onUnmounted(() => {
  cleanup?.()
  motionCleanups.splice(0).forEach((fn) => fn())
  if (typingTimer) {
    clearTimeout(typingTimer)
  }
})
</script>

<template>
  <div ref="pageRef" class="space-y-10 lg:space-y-14">
    <section class="hero-mast">
      <div class="hero-ribbon-cloud" aria-hidden="true">
        <span v-for="item in heroRibbons" :key="item" data-ribbon class="hero-ribbon">{{ item }}</span>
      </div>
      <div class="hero-grid">
        <div class="space-y-7">
          <div data-hero-kicker class="eyebrow-pill">
            <span class="dot-live"></span>
            <span>求职方向：前端开发工程师 / AI 应用开发工程师</span>
          </div>

          <div class="space-y-4">
            <div class="impact-stack">
              <div data-hero-line class="impact-line">MINYU</div>
              <div data-hero-line class="impact-line impact-line-accent">JI</div>
              <div data-hero-line class="impact-line impact-line-cn">吉敏宇</div>
            </div>

            <div data-hero-copy class="hero-body space-y-4">
              <div class="text-2xl font-semibold sm:text-3xl">
                <span class="text-gradient-sky typing-cursor">{{ displayText }}</span>
              </div>
              <p class="max-w-2xl">
                我目前的主线方向是前端开发与 AI 应用开发。相比“把模型接上去”，我更关心如何把 AI 能力做成真实可用、
                可解释、可验证的产品体验，同时把状态流、接口边界、数据建模和部署落地这些工程问题一起处理好。
              </p>
              <p class="max-w-xl text-[0.95rem] text-stone-300/78">
                我希望下一份工作仍然以前端为主，但能更靠近 AI 应用、复杂交互系统、平台工作台和需要较强工程化能力的产品团队。
              </p>
            </div>
          </div>

          <div class="flex flex-wrap gap-3">
            <RouterLink class="button-primary" to="/projects">View Selected Works</RouterLink>
            <RouterLink class="button-secondary" to="/resume">Resume / 简历</RouterLink>
          </div>

          <div class="grid gap-3 sm:grid-cols-3">
            <article v-for="item in signalMetrics" :key="item.label" data-hero-metric class="metric-card">
              <div class="metric-value">{{ item.value }}</div>
              <div class="metric-label">{{ item.label }}</div>
            </article>
          </div>
        </div>

        <div data-hero-side class="hero-side">
          <div class="hero-side-panel">
            <div class="section-title text-stone-500">Core Stack</div>
            <div class="space-y-4">
              <div data-hero-tag class="orbital-tag">React / Vue / TypeScript</div>
              <div data-hero-tag class="orbital-tag orbital-tag-shift">Node.js / Express / PostgreSQL</div>
              <div data-hero-tag class="orbital-tag">Tool Calling / SSE Streaming</div>
              <div data-hero-tag class="orbital-tag orbital-tag-shift">Cesium / EarthSDK / Docker / Nginx</div>
            </div>
          </div>
          <div class="hero-side-caption">
            <span class="index-badge">Monash University</span>
            <p>
              Master of IT（2025.03 - 2026.10）
              <br />
              GPA 3.2 / 4.0
            </p>
          </div>
        </div>
      </div>
    </section>

    <section data-rail-section class="section-shell overflow-hidden">
      <div class="flex items-end justify-between gap-4">
        <div class="space-y-3">
          <div class="section-title">能力画像</div>
          <h2 class="display-subhead max-w-3xl">What I focus on right now.</h2>
        </div>
        <div class="hidden text-right text-sm text-stone-400 lg:block">Scroll sideways with the page.</div>
      </div>

      <div data-rail-viewport class="rail-viewport">
        <div data-rail-track class="rail-track">
          <article v-for="card in capabilityCards" :key="card.id" data-rail-card class="rail-card">
            <div class="rail-card-top">
              <span class="index-badge">{{ card.label }}</span>
              <span class="rail-kicker">{{ card.kicker }}</span>
            </div>
            <div class="space-y-4">
              <h3 class="rail-title">{{ card.title }}</h3>
              <p class="rail-summary">{{ card.summary }}</p>
            </div>
            <div class="flex flex-wrap gap-2">
              <span v-for="bullet in card.bullets" :key="bullet" class="chip chip-citrus">{{ bullet }}</span>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="section-shell space-y-6">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div class="space-y-3">
          <div class="section-title">重点项目</div>
          <h2 class="display-subhead max-w-3xl">A few recent projects.</h2>
        </div>
        <RouterLink class="magnetic-link" to="/projects">查看完整项目列表</RouterLink>
      </div>

      <div data-showcase-grid class="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <RouterLink
          v-for="project in featuredProjects"
          :key="project.slug"
          :to="`/projects/${project.slug}`"
          data-showcase-card
          class="project-frame"
        >
          <div class="project-frame-meta">
            <span class="index-badge">{{ project.positionTag }}</span>
            <span class="project-period">{{ project.period }}</span>
          </div>
          <div class="space-y-3">
            <h3 class="project-frame-title">{{ project.title }}</h3>
            <p class="project-frame-copy">{{ project.oneLiner }}</p>
          </div>
          <div class="flex flex-wrap gap-2">
            <span v-for="tech in project.stack.slice(0, 4)" :key="`${project.slug}-${tech}`" class="chip">
              {{ tech }}
            </span>
          </div>
          <div class="project-frame-footer">
            <span>Case study</span>
            <span class="project-arrow">↗</span>
          </div>
        </RouterLink>
      </div>
    </section>

    <section data-focus-grid class="grid gap-4 lg:grid-cols-[1.3fr_0.9fr]">
      <article data-focus-card class="panel-card panel-citrus space-y-4">
        <div class="section-title">我现在在做什么</div>
        <div class="space-y-3 text-sm leading-7 text-stone-300/84">
          <p>
            现在我最想持续推进的方向，是把前端开发能力和 AI 应用能力放到一起做成长线。这也是为什么最近的项目里，
            我会同时关注 UI、状态流、后端边界、数据来源和可解释性。
          </p>
          <p>
            FitMind 代表了我在 AI 应用工程上的主线尝试，EaseMove、SunSafe 和实习里的 WebGIS 项目，
            则继续补强我在复杂前端交互、空间可视化、全栈交付和工程化排障方面的经验。
          </p>
          <p>
            我希望下一份工作仍然以前端为主，但能更靠近 AI 应用、复杂交互系统、平台工作台、
            数据产品界面或需要较强工程化能力的产品团队。
          </p>
        </div>
      </article>

      <article data-focus-card class="panel-card panel-contrast space-y-4">
        <div class="section-title">基本信息</div>
        <div class="space-y-2 text-sm leading-7 text-stone-300/84">
          <div>教育：Monash University · Master of IT（2025.03 - 2026.10）</div>
          <div>GPA：3.2 / 4.0</div>
          <div>本科：南京信息工程大学 · 软件工程（专业前 10%）</div>
          <div>英语：CET-6 · 雅思 6.5</div>
          <div>方向：前端开发 / AI 应用开发 / 全栈交付 / 工程化架构</div>
          <div>邮箱：<span class="text-white">JX15996596656@163.com</span></div>
          <div>GitHub：<a href="https://github.com/Andrew-JX/" target="_blank" rel="noreferrer">Andrew-JX</a></div>
          <div>Gitee：<a href="https://gitee.com/ji-minyu" target="_blank" rel="noreferrer">ji-minyu</a></div>
        </div>
      </article>
    </section>

    <section class="section-shell">
      <div class="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <article class="panel-card panel-citrus space-y-4">
          <div class="section-title">下一步想做的小东西</div>
          <div class="space-y-3 text-sm leading-7 text-stone-300/84">
            <p>
              除了主项目，我还想持续做一些更轻、更快、更验证想法的小工具，放进自己的 Lab 里。
              这些东西不一定很大，但会更直接地体现我对 agent、桌面交互、自动化流程和产品手感的理解。
            </p>
            <p>
              目前已经在考虑的方向包括：语音转文字、字幕播放悬浮窗、自助播放歌单，以及把 FitMind 继续往 agent 形态推进。
            </p>
          </div>
        </article>

        <article class="panel-card panel-contrast space-y-5">
          <div class="section-title">现在的 Lab 方向</div>
          <div class="space-y-3 text-sm leading-7 text-stone-300/84">
            <div class="detail-list-item">语音转文字：偏效率工具和轻量工作流。</div>
            <div class="detail-list-item">字幕悬浮窗：偏桌面场景和交互细节。</div>
            <div class="detail-list-item">自助播放歌单：偏自动化体验与状态管理。</div>
            <div class="detail-list-item">FitMind Agent 化：偏工具编排、上下文和任务边界。</div>
          </div>
          <div class="flex flex-wrap gap-3">
            <RouterLink class="button-primary" to="/lab">进入 Lab</RouterLink>
            <a class="button-secondary" href="https://github.com/Andrew-JX/" target="_blank" rel="noreferrer">GitHub</a>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>
