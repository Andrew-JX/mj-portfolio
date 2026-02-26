<script setup lang="ts">
import { computed, ref } from 'vue'
import { projects } from '../data/projects'

const q = ref('')

const filtered = computed(() => {
  const keyword = q.value.trim().toLowerCase()
  if (!keyword) return projects
  return projects.filter(p =>
    (p.title + p.subtitle + p.stack.join(' ')).toLowerCase().includes(keyword)
  )
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-end justify-between gap-4 flex-wrap">
      <div>
        <h1 class="text-2xl font-semibold">Projects</h1>
        <p class="text-sm text-slate-600 mt-1">Live / Repo / Video / Case Study —— 以可验证证据为主。</p>
      </div>

      <div class="w-full sm:w-72">
        <input v-model="q" placeholder="Search by title / stack..."
          class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400" />
      </div>
    </div>

    <div class="grid md:grid-cols-2 gap-4">
      <article v-for="p in filtered" :key="p.slug"
        class="rounded-2xl border border-slate-200 p-5 hover:border-slate-300 transition">
        <div class="flex items-start justify-between gap-3">
          <div>
            <div class="text-xs text-slate-500">{{ p.type }} · {{ p.status ?? '—' }}</div>
            <h2 class="text-lg font-semibold mt-1">{{ p.title }}</h2>
            <p class="text-sm text-slate-700 mt-1">{{ p.subtitle }}</p>
          </div>
        </div>

        <div class="flex flex-wrap gap-2 mt-4">
          <span v-for="s in p.stack.slice(0, 6)" :key="s"
            class="px-2.5 py-1 rounded-full text-xs border border-slate-200">
            {{ s }}
          </span>
        </div>

        <div class="text-sm text-slate-700 mt-4">
          <span class="text-slate-500">Role:</span> {{ p.role }}
        </div>

        <div class="flex flex-wrap gap-2 mt-4">
          <RouterLink class="px-3 py-2 rounded-xl text-sm border border-slate-200 hover:border-slate-300"
            :to="`/projects/${p.slug}`">
            Details
          </RouterLink>

          <a v-if="p.links.live" class="px-3 py-2 rounded-xl text-sm border border-slate-200 hover:border-slate-300"
            :href="p.links.live" target="_blank" rel="noreferrer">
            Live
          </a>
          <a v-if="p.links.repo" class="px-3 py-2 rounded-xl text-sm border border-slate-200 hover:border-slate-300"
            :href="p.links.repo" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a v-if="p.links.video" class="px-3 py-2 rounded-xl text-sm border border-slate-200 hover:border-slate-300"
            :href="p.links.video" target="_blank" rel="noreferrer">
            Video
          </a>
        </div>
      </article>
    </div>
  </div>
</template>
