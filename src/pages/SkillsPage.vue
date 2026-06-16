<script setup lang="ts">
type LabItem = {
  title: string
  stage: string
  summary: string
  tags: string[]
  bullets?: string[]
  repo?: string
  links?: Array<{
    label: string
    url: string
  }>
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
    title: 'AI 工作流工具',
    stage: 'Idea',
    summary: '围绕真实工作流继续做轻量工具，把输入、处理、解释和输出串起来，验证 AI 能否稳定进入日常任务，而不是只停留在一次性 demo。',
    tags: ['Workflow', 'Agent', 'Automation'],
  },
  {
    title: '智能工作台原型',
    stage: 'Idea',
    summary: '偏复杂界面和状态管理，希望把 AI 操作过程、工具结果和用户决策放在同一个可追踪工作台里。',
    tags: ['Workspace', 'State', 'UX'],
  },
  {
    title: 'FitMind Agent',
    stage: 'Exploring',
    summary: '有可能把 FitMind 继续往 agent 方向推进，重点看任务边界、工具编排和上下文组织。',
    tags: ['Agent', 'Tool Calling', 'Product'],
  },
]
</script>

<template>
  <div class="space-y-8">
    <section class="hero-panel space-y-4">
      <div class="section-title">Lab</div>
      <h1 class="text-3xl font-semibold tracking-tight text-white">AI 产品 / 小 Agent / 快速实验</h1>
      <p class="max-w-3xl text-sm leading-7 text-stone-300/84">
        这里会放我围绕 AI 应用开发、AI 产品经理、AI 全栈和解决方案做的实验。它们不一定是大项目，但能比较直接地反映我最近在研究什么。
      </p>
    </section>

    <section class="grid gap-4 md:grid-cols-2">
      <article v-for="item in labItems" :key="item.title" class="panel-card space-y-4">
        <div class="flex items-start justify-between gap-3">
          <div class="space-y-2">
            <h2 class="text-xl font-semibold text-white">{{ item.title }}</h2>
            <p class="text-sm leading-7 text-stone-300/84">{{ item.summary }}</p>
          </div>
          <span class="rounded-full border border-[var(--line)] bg-[var(--accent-soft)] px-3 py-1 text-xs font-medium text-[var(--accent)]">
            {{ item.stage }}
          </span>
        </div>

        <div class="flex flex-wrap gap-2">
          <span v-for="tag in item.tags" :key="tag" class="chip">
            {{ tag }}
          </span>
        </div>

        <ul v-if="item.bullets?.length" class="space-y-2 text-sm leading-7 text-stone-300/84">
          <li v-for="bullet in item.bullets" :key="bullet" class="detail-list-item">
            {{ bullet }}
          </li>
        </ul>

        <div v-if="item.repo || item.links?.length" class="flex flex-wrap gap-2 pt-1">
          <a v-if="item.repo" class="button-secondary" :href="item.repo" target="_blank" rel="noreferrer">GitHub</a>
          <a
            v-for="link in item.links"
            :key="`${item.title}-${link.label}`"
            class="button-secondary"
            :href="link.url"
            target="_blank"
            rel="noreferrer"
          >
            {{ link.label }}
          </a>
        </div>
      </article>
    </section>

    <section class="panel-card space-y-4">
      <div class="section-title">这个页面之后会放什么</div>
      <ul class="space-y-3 text-sm leading-7 text-stone-300/84">
        <li class="detail-list-item">已经做出来或正在推进的 AI 产品原型、agent demo 和解决方案草案。</li>
        <li class="detail-list-item">它们现在分别处在 idea、building 还是 shipping 的哪个阶段。</li>
        <li class="detail-list-item">以后也可以慢慢补 live 链接、截图和简短说明，做成一个持续更新的小实验区。</li>
      </ul>
    </section>
  </div>
</template>
