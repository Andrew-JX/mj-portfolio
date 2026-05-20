<script setup lang="ts">
const quickReads = [
  {
    title: 'FitMind AI',
    detail: '当前最能代表我 AI 应用开发方向的个人项目，重点体现确定性计算、Tool Calling、SSE 流式交互和工程化 AI 协作方式。',
    to: '/projects/fitmind-ai',
  },
  {
    title: 'EaseMove',
    detail: '毕设团队项目，展示地图交互、数据聚合、性能优化、分层降级和前后端协作交付能力。',
    to: '/projects/easemove',
  },
  {
    title: '政企 WebGIS',
    detail: '实习经历对应的项目经验，重点体现三维 GIS 前端开发、跨 SDK 兼容适配、渲染异常排查与交付协作。',
    to: '/projects/real-scene-3d',
  },
]
</script>

<template>
  <div class="space-y-8">
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div class="space-y-2">
        <h1 class="text-3xl font-semibold tracking-tight text-white">Resume</h1>
        <p class="max-w-3xl text-sm leading-7 text-stone-300/84">
          这里放的是当前最新版本的简历，也顺手整理了一层简短的项目快读。
        </p>
      </div>

      <a class="button-primary" href="/resume.pdf" download>Download PDF</a>
    </div>

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
      <object data="/resume.pdf" type="application/pdf" class="h-[78vh] w-full">
        <div class="p-6 text-sm text-stone-300/84">
          浏览器不支持预览 PDF。请点击上方按钮下载，或确认最新简历文件已经放在 <code>public/resume.pdf</code>。
        </div>
      </object>
    </div>
  </div>
</template>
