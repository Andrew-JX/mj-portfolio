import type { PointerEvent as ReactPointerEvent } from 'react'

type LabItem = {
  title: string
  stage: string
  summary: string
  tags: string[]
  bullets?: string[]
  repo?: string
  links?: Array<{ label: string; url: string }>
}

const labItems: LabItem[] = [
  {
    title: 'ai-pm-dev',
    stage: 'Building',
    summary: '当前正在推进的 AI 产品经理与 AI 应用开发实验区，用来沉淀从问题定义、用户任务、PRD/原型到工具调用、工作流验证和解决方案表达的完整方法。',
    tags: ['AI PM', 'PRD', 'Prototype', 'Solution'],
    bullets: [
      '定位为本地 Idea-to-Build workflow CLI，不是通用聊天 Agent。',
      '通过 AGENTS.md + docs 给 Codex、Claude Code、v0、Figma 安装可读取的协作操作层。',
      '用交互式 PM 访谈、scope、acceptance tests 和 prd check --strict 逼出优先级、非目标和验收标准。',
    ],
    repo: 'https://github.com/Andrew-JX/ai-pm-dev',
  },
  {
    title: 'cat-note-illustrations',
    stage: 'Shipping',
    summary: '面向中文文章、笔记和知识型内容的猫猫风格插图生成 Skill，用更轻的视觉资产帮助内容表达变得更亲和、更容易被记住。',
    tags: ['Skill', 'Image Prompt', 'Content UX'],
    bullets: [
      '把文章中的关键判断、流程、结构或隐喻转成适合正文使用的 16:9 配图。',
      '固定猫猫 IP Specimen 0，保持白底、粗黑轮廓、手账贴纸风的一致视觉识别。',
      '包含 Skill、角色设定、prompt 模板、QA 清单、示例 prompt、示例图片和贡献说明。',
    ],
    repo: 'https://github.com/Andrew-JX/cat-note-illustrations',
  },
  {
    title: 'quickDate',
    stage: 'Shipping',
    summary: '一个偏轻松、好玩的快速约会 / 日期小工具，重点展示从小想法到可访问产品的完整闭环：轻交互、明确入口、双端部署和适合分享的产品节奏。',
    tags: ['Fun App', 'Interaction', 'Deployment'],
    bullets: [
      '发送者配置专属邀请链接，对方完成 No 躲闪、时间、吃什么、活动和地点选择。',
      '纯静态 H5，无后端；身份和结果通过 URL 参数传递，完成邀请、回传、结果页和日历卡片闭环。',
      '国内 Cloudflare 与海外 Vercel 双部署，更适合真实分享场景。',
    ],
    repo: 'https://github.com/Andrew-JX/quickDate',
    links: [
      { label: '国内访问', url: 'https://quickdate-77o.pages.dev/' },
      { label: 'Global', url: 'https://app-nine-chi-68.vercel.app/' },
    ],
  },
  {
    title: 'FitMind Agent',
    stage: 'Exploring',
    summary: '有可能把 FitMind 继续往 agent 方向推进，重点看任务边界、工具编排和上下文组织。',
    tags: ['Agent', 'Tool Calling', 'Product'],
  },
]

function handleLabCardMove(event: ReactPointerEvent<HTMLElement>) {
  const card = event.currentTarget
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const rect = card.getBoundingClientRect()
  const x = (event.clientX - rect.left) / rect.width
  const y = (event.clientY - rect.top) / rect.height
  card.style.setProperty('--tilt-x', `${((0.5 - y) * 11).toFixed(2)}deg`)
  card.style.setProperty('--tilt-y', `${((x - 0.5) * 13).toFixed(2)}deg`)
  card.style.setProperty('--glow-x', `${(x * 100).toFixed(1)}%`)
  card.style.setProperty('--glow-y', `${(y * 100).toFixed(1)}%`)
}

function resetLabCardTilt(event: ReactPointerEvent<HTMLElement>) {
  const card = event.currentTarget
  card.style.setProperty('--tilt-x', '0deg')
  card.style.setProperty('--tilt-y', '0deg')
  card.style.setProperty('--glow-x', '50%')
  card.style.setProperty('--glow-y', '0%')
}

export default function SkillsPage() {
  return (
    <div className="space-y-8">
      <section className="hero-panel space-y-4">
        <div className="section-title">Lab</div>
        <h1 className="text-3xl font-semibold tracking-tight text-white">AI 产品 / 小 Agent / 快速实验</h1>
        <p className="max-w-3xl text-sm leading-7 text-stone-300/84">
          这里会放我围绕 AI 应用开发、AI 产品经理、AI 全栈和解决方案做的实验。它们不一定是大项目，但能比较直接地反映我最近在研究什么。
        </p>
      </section>

      <section className="lab-card-grid">
        {labItems.map((item) => (
          <article key={item.title} className="lab-tilt-card" onPointerMove={handleLabCardMove} onPointerLeave={resetLabCardTilt}>
            <span aria-hidden="true" className="lab-tilt-glow" />

            <div className="lab-card-top">
              <div className="space-y-2">
                <h2 className="lab-card-title">{item.title}</h2>
                <p className="lab-card-summary">{item.summary}</p>
              </div>
              <span className="lab-stage-pill">{item.stage}</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag) => <span key={tag} className="chip">{tag}</span>)}
            </div>

            {item.bullets?.length ? (
              <ul className="space-y-2 text-sm leading-7 text-stone-300/84">
                {item.bullets.map((bullet) => <li key={bullet} className="detail-list-item">{bullet}</li>)}
              </ul>
            ) : null}

            {(item.repo || item.links?.length) && (
              <div className="flex flex-wrap gap-2 pt-1">
                {item.repo && <a className="button-secondary" href={item.repo} target="_blank" rel="noreferrer">GitHub</a>}
                {item.links?.map((link) => (
                  <a key={`${item.title}-${link.label}`} className="button-secondary" href={link.url} target="_blank" rel="noreferrer">
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </article>
        ))}
      </section>

      <section className="panel-card space-y-4">
        <div className="section-title">这个页面之后会放什么</div>
        <ul className="space-y-3 text-sm leading-7 text-stone-300/84">
          <li className="detail-list-item">已经做出来或正在推进的 AI 产品原型、agent demo 和解决方案草稿。</li>
          <li className="detail-list-item">它们现在分别处在 idea、building 还是 shipping 的哪个阶段。</li>
          <li className="detail-list-item">以后也可以慢慢补 live 链接、截图和简短说明，做成一个持续更新的小实验区。</li>
        </ul>
      </section>
    </div>
  )
}
