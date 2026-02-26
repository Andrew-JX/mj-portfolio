<script setup lang="ts">
import { computed, ref } from 'vue'
import { projects } from '../data/projects'

const q = ref('')

const filtered = computed(() => {
  const keyword = q.value.trim().toLowerCase()
  if (!keyword) return projects
  return projects.filter(p =>
    (p.title + p.subtitle + p.tech.join(' ') + (p.summary ?? '')).toLowerCase().includes(keyword)
  )
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-end justify-between gap-4 flex-wrap">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight">Projects</h1>
        <p class="text-sm text-slate-400 mt-1">
          能公开的给链接；不能公开的给脱敏说明与技术要点。每个项目尽量做到“可演示/可复现/可讲清楚”。
        </p>
      </div>

      <div class="w-full sm:w-72">
        <input v-model="q" aria-label="Search projects" placeholder="Search title / tech..." class="w-full rounded-xl border border-slate-800 bg-slate-900/40 px-3 py-2 text-sm text-slate-200
                 outline-none focus:border-sky-500/60" />
      </div>
    </div>

    <div class="grid md:grid-cols-2 gap-4">
      <article v-for="p in filtered" :key="p.slug"
        class="rounded-2xl bg-slate-900/40 border border-slate-800 p-5 hover:border-slate-700 transition">
        <div class="flex items-start justify-between gap-3">
          <div>
            <div class="text-xs text-slate-500">{{ p.period ?? '—' }}</div>
            <h2 class="text-lg font-semibold mt-1">{{ p.title }}</h2>
            <p class="text-sm text-slate-300 mt-1">{{ p.subtitle }}</p>
          </div>
        </div>

        <p class="text-sm text-slate-300 mt-3 leading-relaxed">
          {{ p.summary }}
        </p>

        <div class="flex flex-wrap gap-2 mt-4">
          <span v-for="t in p.tech.slice(0, 8)" :key="t"
            class="px-2.5 py-1 rounded-full text-xs bg-slate-900 border border-slate-800 text-slate-200">
            {{ t }}
          </span>
        </div>

        <div class="text-sm text-slate-300 mt-4">
          <span class="text-slate-500">Role:</span> {{ p.role }}
        </div>

        <div class="flex flex-wrap gap-2 mt-4">
          <RouterLink class="px-3 py-2 rounded-xl text-sm border border-slate-800 bg-slate-900 hover:border-slate-700"
            :to="`/projects/${p.slug}`">
            Details
          </RouterLink>

          <a v-if="p.links.live"
            class="px-3 py-2 rounded-xl text-sm border border-slate-800 bg-slate-900 hover:border-slate-700"
            :href="p.links.live" target="_blank" rel="noreferrer">
            Live
          </a>

          <a v-if="p.links.repo"
            class="px-3 py-2 rounded-xl text-sm border border-slate-800 bg-slate-900 hover:border-slate-700"
            :href="p.links.repo" target="_blank" rel="noreferrer">
            GitHub
          </a>

          <a v-if="p.links.video && !String(p.links.video).includes('把你云端视频')"
            class="px-3 py-2 rounded-xl text-sm border border-slate-800 bg-slate-900 hover:border-slate-700"
            :href="p.links.video" target="_blank" rel="noreferrer">
            Video
          </a>
        </div>
      </article>
    </div>
  </div>
</template>
