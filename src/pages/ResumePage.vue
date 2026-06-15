<script setup lang="ts">
const resumes = [
  {
    title: 'Resume 1',
    subtitle: 'AI 应用开发 / AI 全栈方向',
    href: '/resume1.pdf',
  },
  {
    title: 'Resume 2',
    subtitle: 'AI 产品经理 / AI 解决方案方向',
    href: '/resume2.pdf',
  },
]

const quickReads = [
  {
    title: 'FitMind AI',
    detail: '当前最能代表我 AI 应用开发与 AI 产品化方向的个人项目，重点体现确定性计算、Tool Calling、SSE 流式交互和工程化 AI 协作方式。',
    to: '/projects/fitmind-ai',
  },
  {
    title: 'ai-pm-dev / Lab',
    detail: '当前正在推进的 AI 产品经理与 AI 应用开发实验线，重点沉淀需求拆解、原型验证、工具调用和解决方案表达。',
    to: '/lab',
  },
  {
    title: 'EaseMove',
    detail: '团队项目，展示数据产品判断、地图交互、数据聚合、分层降级和前后端协作交付能力。',
    to: '/projects/easemove',
  },
]
</script>

<template>
  <div class="space-y-8">
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div class="space-y-2">
        <h1 class="text-3xl font-semibold tracking-tight text-white">Resume</h1>
        <p class="max-w-3xl text-sm leading-7 text-stone-300/84">
          这里放两份简历：一份更偏 AI 应用开发 / AI 全栈，一份更偏 AI 产品经理 / AI 解决方案。下面也整理了一层简短的项目快读。
        </p>
      </div>

      <div class="flex flex-wrap gap-2">
        <a
          v-for="resume in resumes"
          :key="resume.href"
          class="button-primary"
          :href="resume.href"
          download
        >
          Download {{ resume.title }}
        </a>
      </div>
    </div>

    <section class="grid gap-4 md:grid-cols-2">
      <article v-for="resume in resumes" :key="resume.href" class="panel-card space-y-4">
        <div>
          <div class="section-title">{{ resume.title }}</div>
          <h2 class="mt-2 text-xl font-semibold tracking-tight text-white">{{ resume.subtitle }}</h2>
        </div>
        <div class="flex flex-wrap gap-2">
          <a class="button-primary" :href="resume.href" download>Download</a>
          <a class="button-secondary" :href="resume.href" target="_blank" rel="noreferrer">Open PDF</a>
        </div>
      </article>
    </section>

    <section class="panel-card space-y-4">
      <div class="section-title">简历快读</div>
      <div class="grid gap-4 lg:grid-cols-3">
        <article v-for="item in quickReads" :key="item.title" class="resume-quick-card">
          <div class="text-sm font-semibold text-white">{{ item.title }}</div>
          <p class="mt-3 text-sm leading-7 text-stone-300/84">{{ item.detail }}</p>
          <RouterLink class="mt-4 inline-flex text-sm font-medium text-[var(--accent)] hover:opacity-80" :to="item.to">
            查看项目详情
          </RouterLink>
        </article>
      </div>
    </section>

    <div class="resume-preview-shell">
      <object data="/resume1.pdf" type="application/pdf" class="h-[78vh] w-full">
        <div class="p-6 text-sm text-stone-300/84">
          浏览器不支持预览 PDF。请点击上方按钮下载，或确认简历文件已经放在 <code>public/resume1.pdf</code> 与 <code>public/resume2.pdf</code>。
        </div>
      </object>
    </div>
  </div>
</template>
