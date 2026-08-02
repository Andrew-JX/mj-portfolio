import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ProjectPreviewFrame from '@/components/ProjectPreviewFrame'
import TargetCursor from '@/components/TargetCursor'
import { projects } from '@/data/projects'
import { getProjectMedia } from '@/data/projectMedia'
import type { ProjectLinkEntry, ProjectLinkKey } from '@/types'

gsap.registerPlugin(ScrollTrigger)

type ProjectItem = (typeof projects)[number]
type ProjectCategory = {
  label: string
  matches: (project: ProjectItem) => boolean
}

const categories: ProjectCategory[] = [
  { label: 'All', matches: () => true },
  {
    label: 'AI / Agent',
    matches: (project) =>
      project.stack.some((tech) => ['Tool Calling', 'PyTorch', 'ResNet-18'].includes(tech)) ||
      project.positionTag.includes('AI'),
  },
  {
    label: 'AI Product',
    matches: (project) => ['fitmind-ai', 'ai-pm-dev'].includes(project.slug) || project.positionTag.includes('Data Product'),
  },
  {
    label: 'Full-stack',
    matches: (project) =>
      project.positionTag.includes('Full-stack') ||
      project.stack.some((tech) => ['Node.js', 'Express', 'PostgreSQL', 'Spring Boot'].includes(tech)),
  },
  {
    label: 'Data / GIS',
    matches: (project) =>
      project.stack.some((tech) => ['Leaflet', 'Mapbox GL', 'Cesium', 'EarthSDK', 'SuperMap3D', 'Open Data'].includes(tech)),
  },
  {
    label: 'Mobile / Course',
    matches: (project) =>
      project.stack.some((tech) => ['Kotlin', 'Jetpack Compose', 'Firebase Hosting'].includes(tech)) ||
      project.visibility === 'course',
  },
]

const linkLabels: Record<ProjectLinkKey, string> = {
  live: 'Live',
  repo: 'Repo',
  doc: 'Doc',
  video: 'Video',
}

const lifeScienceConcept = {
  capabilities: [
    {
      title: '文献检索与证据抽取',
      description: '基于公开论文与临床试验注册数据，抽取研究对象、终点、结果和关键限制。',
    },
    {
      title: '靶点—适应症证据表',
      description: '把分散证据组织成可比较的结构化表格，保留证据等级、冲突项与待确认信息。',
    },
    {
      title: '结论可追溯',
      description: '每条 AI 结论反向引用原文片段或试验字段，让使用者能快速核验依据。',
    },
  ],
  workflow: [
    ['01', 'Scientist Agent', '检索证据并起草审查结论'],
    ['02', 'Reviewer Agent', '复核科学依据与引用一致性'],
    ['03', 'Supervisor', '检查流程、覆盖范围与遗漏项'],
    ['04', 'Expert approval', '由领域专家完成最终判断与批准'],
  ],
  stack: ['Next.js', 'FastAPI', 'PostgreSQL', 'RAG', 'Multi-Agent', 'Public literature', 'ClinicalTrials.gov'],
} as const

function getProjectLinks(project: ProjectItem): ProjectLinkEntry[] {
  const primaryLinks = Object.entries(project.links).map(([key, url]) => ({
    label: linkLabels[key as ProjectLinkKey],
    url,
  }))

  return [...primaryLinks, ...(project.extraLinks ?? [])]
}

export default function ProjectsPage() {
  const pageRef = useRef<HTMLDivElement | null>(null)
  const [q, setQ] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filtered = useMemo(() => {
    const keyword = q.trim().toLowerCase()
    const activeCategory = categories.find((category) => category.label === selectedCategory) ?? categories[0]!

    return projects.filter((project) => {
      const matchesKeyword =
        !keyword ||
        [project.title, project.period, project.positionTag, project.oneLiner, project.stack.join(' '), project.contributions.join(' ')]
          .join(' ')
          .toLowerCase()
          .includes(keyword)

      return matchesKeyword && activeCategory.matches(project)
    })
  }, [q, selectedCategory])

  useEffect(() => {
    const root = pageRef.current
    if (!root) return undefined

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const motionCleanups: Array<() => void> = []

    const context = gsap.context(() => {
      if (reducedMotion) return

      gsap.from('[data-project-card]', {
        opacity: 0,
        y: 28,
        duration: 0.7,
        stagger: 0.05,
        ease: 'power3.out',
        scrollTrigger: { trigger: '[data-project-grid]', start: 'top 82%' },
      })

      gsap.utils.toArray<HTMLElement>('[data-project-card]').forEach((card, index) => {
        const xTo = gsap.quickTo(card, 'x', { duration: 0.25, ease: 'power3.out' })
        const yTo = gsap.quickTo(card, 'y', { duration: 0.25, ease: 'power3.out' })
        const rotateTo = gsap.quickTo(card, 'rotation', { duration: 0.25, ease: 'power3.out' })

        gsap.to(card, {
          yPercent: index % 2 === 0 ? -1.5 : 1.5,
          duration: 3.6 + index * 0.12,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        })

        const handleMove = (event: PointerEvent) => {
          const rect = card.getBoundingClientRect()
          const px = (event.clientX - rect.left) / rect.width - 0.5
          const py = (event.clientY - rect.top) / rect.height - 0.5
          xTo(px * 8)
          yTo(py * 8 - 6)
          rotateTo(px * 1.8)
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
  }, [filtered.length])

  return (
    <div ref={pageRef} className="space-y-8 lg:space-y-10">
      <TargetCursor />

      <section className="section-shell space-y-4">
        <div className="section-title">Projects</div>
        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr] xl:items-end">
          <div className="space-y-4">
            <h1 className="display-headline text-[clamp(2.8rem,8vw,5.8rem)]">PROJECTS</h1>
            <p className="max-w-3xl text-sm leading-7 text-stone-300/82 sm:text-base">
              这里放的是我做过的一些项目，主要以前端、AI 应用、全栈交付和地图可视化相关为主。
            </p>
          </div>
          <div className="panel-card panel-citrus space-y-4">
            <div className="section-title">说明</div>
            <p className="text-sm leading-7 text-stone-300/82">
              有些项目做 AI 应用，有些偏复杂前端、地图可视化或者全栈交付，可以按项目类型和关键词筛选着看。
            </p>
          </div>
        </div>
      </section>

      <section className="panel-card concept-panel" aria-labelledby="life-science-concept-title">
        <div className="concept-panel-header">
          <span className="index-badge">Concept · 规划中</span>
          <span className="project-period">Next Direction · Life Sciences AI</span>
        </div>

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.18fr)_minmax(20rem,0.82fr)] xl:gap-12">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="section-title">Future Project</div>
              <h2 id="life-science-concept-title" className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                生命科学证据审查工作台
              </h2>
              <p className="max-w-3xl text-sm leading-7 text-stone-300/82 sm:text-base sm:leading-8">
                我计划探索一个面向药物研发与转化研究的垂直 AI 应用：使用公开论文或临床试验数据，
                把检索、证据抽取、结构化对照和多角色复核组织成一条可追溯的审查流程。
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {lifeScienceConcept.capabilities.map((capability) => (
                <article key={capability.title} className="concept-capability">
                  <h3>{capability.title}</h3>
                  <p>{capability.description}</p>
                </article>
              ))}
            </div>

            <p className="concept-principle">
              产品原则：AI 负责提升证据处理效率，但不替代科学判断；最终结论必须可核验，并由专家批准。
            </p>
          </div>

          <aside className="concept-workflow" aria-label="Planned evidence review workflow">
            <div className="section-title">Review Workflow</div>
            <ol className="mt-5 space-y-3">
              {lifeScienceConcept.workflow.map(([index, role, description]) => (
                <li key={role} className="concept-step">
                  <span className="concept-step-number" aria-hidden="true">{index}</span>
                  <div>
                    <h3>{role}</h3>
                    <p>{description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </aside>
        </div>

        <div className="concept-stack" aria-label="Planned technology stack">
          <span className="section-title">Planned Stack</span>
          <div className="flex flex-wrap gap-2">
            {lifeScienceConcept.stack.map((tech) => <span key={tech} className="chip">{tech}</span>)}
          </div>
        </div>
      </section>

      <section className="panel-card panel-contrast space-y-5">
        <div className="flex flex-col gap-5 xl:grid xl:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] xl:items-start">
          <label className="block min-w-0 space-y-2">
            <span className="text-xs font-medium uppercase tracking-[0.24em] text-stone-500">Search</span>
            <input
              value={q}
              onChange={(event) => setQ(event.target.value)}
              aria-label="Search projects"
              placeholder="Search title, category, keyword..."
              className="showcase-input"
            />
          </label>

          <div className="min-w-0 space-y-2 xl:pl-2">
            <div className="text-xs font-medium uppercase tracking-[0.24em] text-stone-500">Category Filter</div>
            <div className="flex flex-wrap items-start gap-2">
              {categories.map((category) => (
                <button
                  key={category.label}
                  type="button"
                  data-target-cursor
                  className={`chip-button ${category.label === selectedCategory ? 'chip-button-active' : ''}`}
                  onClick={() => setSelectedCategory(category.label)}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section data-project-grid className="grid gap-4 md:grid-cols-2">
        {filtered.map((project) => (
          <article key={project.slug} data-project-card className="project-card-shell border-glow-card">
            <ProjectPreviewFrame media={getProjectMedia(project.slug)} compact />

            <div className="space-y-4">
              <div className="project-frame-meta">
                <span className="index-badge">{project.positionTag}</span>
                <span className="project-period">{project.period}</span>
              </div>

              <div className="space-y-3">
                <h2 className="text-2xl font-semibold tracking-tight text-white">{project.title}</h2>
                <p className="text-sm leading-7 text-stone-300/82">{project.oneLiner}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {project.stack.map((tech) => <span key={`${project.slug}-${tech}`} className="chip">{tech}</span>)}
            </div>

            <div className="mt-auto flex flex-wrap gap-2 pt-3">
              {getProjectLinks(project).map((item) => (
                <a
                  key={`${project.slug}-${item.label}-${item.url}`}
                  data-target-cursor
                  className="button-secondary"
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {item.label}
                </a>
              ))}
              <Link data-target-cursor className="button-primary" to={`/projects/${project.slug}`}>Details</Link>
            </div>
          </article>
        ))}
      </section>
    </div>
  )
}
