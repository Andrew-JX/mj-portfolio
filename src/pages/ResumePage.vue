<script setup lang="ts">
const quickReads = [
  {
    title: 'Ruilian',
    detail: '本地持久化 + 云端快照 + WebSocket 广播，配合 Docker Compose 与 Nginx 同域反代，能讲同步、权限和部署链路。',
    to: '/projects/ruilian',
  },
  {
    title: 'SunSafe',
    detail: '安全、性能、部署三条线都能落到具体实现：双层限流、XSS、防注入、缓存 TTL、分页索引、Vercel + Render。',
    to: '/projects/sunsafe',
  },
  {
    title: '政企 WebGIS',
    detail: '三维工具组件化 + 多引擎兼容排障，能讲三维能力如何复用到真实业务页面。',
    to: '/projects/real-scene-3d',
  },
]
</script>

<template>
  <div class="space-y-8">
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="text-3xl font-semibold tracking-tight text-white">Resume</h1>
        <p class="mt-2 text-sm leading-7 text-slate-400">默认简历文件为 <code>public/resume.pdf</code>，页面保留在线预览与下载入口，方便投递前快速回看。</p>
      </div>

      <a class="button-primary" href="/resume.pdf" download>Download PDF</a>
    </div>

    <section class="panel-card space-y-4">
      <div class="section-title">快读要点</div>
      <div class="grid gap-4 lg:grid-cols-3">
        <article v-for="item in quickReads" :key="item.title" class="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
          <div class="text-sm font-semibold text-sky-200">{{ item.title }}</div>
          <p class="mt-3 text-sm leading-7 text-slate-300">{{ item.detail }}</p>
          <RouterLink class="mt-4 inline-flex text-sm text-slate-200 hover:text-white" :to="item.to">
            查看项目详情 →
          </RouterLink>
        </article>
      </div>
    </section>

    <div class="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/30">
      <object data="/resume.pdf" type="application/pdf" class="h-[78vh] w-full">
        <div class="p-6 text-sm text-slate-300">
          浏览器不支持预览 PDF。请点击上方按钮下载，或将最新简历文件放到 <code>public/resume.pdf</code>。
        </div>
      </object>
    </div>
  </div>
</template>
