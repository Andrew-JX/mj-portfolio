<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { projects } from '../data/projects'

const route = useRoute()
const project = computed(() => projects.find(p => p.slug === route.params.slug))

const liveEmbedUrl = computed(() => {
  const url = project.value?.links.live
  if (!url) return null
  return url.startsWith('https://') ? url : null
})
</script>

<template>
  <div v-if="project" class="space-y-8">
    <div class="space-y-2">
      <div class="text-xs text-slate-500">{{ project.period ?? '—' }}</div>
      <h1 class="text-2xl font-semibold tracking-tight">{{ project.title }}</h1>
      <p class="text-slate-300">{{ project.subtitle }}</p>

      <div class="flex flex-wrap gap-2 pt-2">
        <span v-for="t in project.tech" :key="t"
          class="px-2.5 py-1 rounded-full text-xs bg-slate-900 border border-slate-800 text-slate-200">
          {{ t }}
        </span>
      </div>

      <div class="flex flex-wrap gap-2 pt-4">
        <a v-if="project.links.live"
          class="px-3 py-2 rounded-xl text-sm border border-slate-800 bg-slate-900 hover:border-slate-700"
          :href="project.links.live" target="_blank" rel="noreferrer">在线演示</a>

        <a v-if="project.links.repo"
          class="px-3 py-2 rounded-xl text-sm border border-slate-800 bg-slate-900 hover:border-slate-700"
          :href="project.links.repo" target="_blank" rel="noreferrer">仓库</a>

        <a v-if="project.links.video"
          class="px-3 py-2 rounded-xl text-sm border border-slate-800 bg-slate-900 hover:border-slate-700"
          :href="project.links.video" target="_blank" rel="noreferrer">演示视频</a>
      </div>

      <div class="pt-2 text-sm text-slate-300">
        <span class="text-slate-500">职责：</span> {{ project.role }}
      </div>
    </div>

    <section v-if="project.links.live" class="rounded-2xl bg-slate-900/40 border border-slate-800 p-6 space-y-3">
      <div class="flex items-center justify-between gap-3 flex-wrap">
        <div class="font-semibold">在线演示</div>
        <a class="px-3 py-2 rounded-xl text-sm border border-slate-800 bg-slate-900 hover:border-slate-700"
          :href="project.links.live" target="_blank" rel="noreferrer">
          新标签打开
        </a>
      </div>

      <div v-if="liveEmbedUrl" class="rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
        <iframe :src="liveEmbedUrl" class="w-full h-[60vh] md:h-[70vh]" title="Live Demo" loading="lazy"
          referrerpolicy="no-referrer"></iframe>
      </div>


    </section>

    <section class="rounded-2xl bg-slate-900/40 border border-slate-800 p-6 space-y-3">
      <div class="font-semibold">概述</div>
      <p class="text-sm text-slate-300 leading-relaxed">{{ project.summary }}</p>
    </section>

    <section class="rounded-2xl bg-slate-900/40 border border-slate-800 p-6 space-y-3">
      <div class="font-semibold">关键工作</div>
      <ul class="list-disc pl-5 text-sm text-slate-300 space-y-2">
        <li v-for="b in project.bullets" :key="b">{{ b }}</li>
      </ul>
    </section>

    <section v-if="project.note" class="rounded-2xl border border-sky-500/30 bg-sky-500/5 p-6">
      <div class="text-sm text-slate-200 leading-relaxed">{{ project.note }}</div>
    </section>

    <div>
      <RouterLink class="text-sm text-slate-300 hover:text-white" to="/projects">← 返回项目列表</RouterLink>
    </div>
  </div>

  <div v-else class="text-slate-300">Project not found.</div>
</template>