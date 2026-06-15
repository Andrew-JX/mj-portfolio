<script setup lang="ts">
type LabItem = {
  title: string
  stage: string
  summary: string
  tags: string[]
}

const labItems: LabItem[] = [
  {
    title: 'ai-pm-dev',
    stage: 'Building',
    summary: '当前正在推进的 AI 产品经理与 AI 应用开发实验区，重点沉淀需求拆解、原型验证、工具调用和解决方案表达。',
    tags: ['AI PM', 'AI App', 'Solution'],
  },
  {
    title: 'AI 工作流工具',
    stage: 'Idea',
    summary: '围绕真实工作流做轻量工具，把输入、处理、解释和输出串起来，验证 AI 能否稳定进入日常任务。',
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
