<script setup lang="ts">
type LabItem = {
  title: string
  stage: string
  summary: string
  tags: string[]
}

const labItems: LabItem[] = [
  {
    title: '语音转文字',
    stage: 'Idea',
    summary: '想做一个更轻量的语音转文字工具，重点看输入链路、结果整理和后续可复用性。',
    tags: ['Speech', 'Utility', 'Workflow'],
  },
  {
    title: '字幕播放悬浮窗',
    stage: 'Idea',
    summary: '偏桌面使用场景的小工具，想试试看更贴近真实使用习惯的悬浮层交互和控制方式。',
    tags: ['Desktop UX', 'Overlay', 'Media'],
  },
  {
    title: '自助播放歌单',
    stage: 'Idea',
    summary: '更偏自动化体验和状态管理，希望做一个能自己维护播放流程的小系统。',
    tags: ['Automation', 'State', 'Media'],
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
      <h1 class="text-3xl font-semibold tracking-tight text-white">小工具 / 小 Agent / 快速实验</h1>
      <p class="max-w-3xl text-sm leading-7 text-stone-300/84">
        这里以后会放我做的一些更轻、更快、也更偏实验性的东西。它们不一定是大项目，但能比较直接地反映我最近在研究什么。
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
        <li class="detail-list-item">已经做出来的轻量工具、agent demo 和一些桌面小实验。</li>
        <li class="detail-list-item">它们现在分别处在 idea、building 还是 shipping 的哪个阶段。</li>
        <li class="detail-list-item">以后也可以慢慢补 live 链接、截图和简短说明，做成一个持续更新的小实验区。</li>
      </ul>
    </section>
  </div>
</template>
