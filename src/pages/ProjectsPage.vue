<script setup lang="ts">
import { computed, ref } from 'vue'
import { projects } from '@/data/projects'
import type { ProjectLinkKey } from '@/types'

const q = ref('')
const selectedTag = ref('All')

const availableTags = computed(() => ['All', ...new Set(projects.flatMap((project) => project.stack))])

const filtered = computed(() => {
  const keyword = q.value.trim().toLowerCase()

  return projects.filter((project) => {
    const matchesKeyword =
      !keyword ||
      [
        project.title,
        project.period,
        project.positionTag,
        project.oneLiner,
        project.stack.join(' '),
        project.contributions.join(' '),
      ]
        .join(' ')
        .toLowerCase()
        .includes(keyword)

    const matchesTag = selectedTag.value === 'All' || project.stack.includes(selectedTag.value)

    return matchesKeyword && matchesTag
  })
})

const linkLabels: Record<ProjectLinkKey, string> = {
  live: 'Live',
  repo: 'Repo',
  doc: 'Doc',
  video: 'Video',
}
</script>

<template>
  <div class="space-y-8">
    <section class="space-y-3">
      <h1 class="text-3xl font-semibold tracking-tight text-white">Projects</h1>
      <p class="max-w-3xl text-sm leading-7 text-slate-400">
        按国内大前端求职叙事排序：全栈工程化与可部署交付优先，其次是性能安全、三维可视化和移动端架构。列表页负责速览和筛选，详情页用于准备面试追问。
      </p>
    </section>

    <section class="panel-card space-y-5">
      <div class="flex flex-col gap-5 xl:grid xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] xl:items-start">
        <label class="block min-w-0 space-y-2">
          <span class="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Search</span>
          <input
            v-model="q"
            aria-label="Search projects"
            placeholder="Search title, stack, keyword..."
            class="w-full rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-sky-400/60 focus:ring-2 focus:ring-sky-400/10"
          />
        </label>

        <div class="min-w-0 space-y-2 xl:pl-2">
          <div class="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Stack Filter</div>
          <div class="flex flex-wrap items-start gap-2">
            <button
              v-for="tag in availableTags"
              :key="tag"
              type="button"
              class="chip-button"
              :class="tag === selectedTag ? 'chip-button-active' : ''"
              @click="selectedTag = tag"
            >
              {{ tag }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="grid gap-4 md:grid-cols-2">
      <article
        v-for="project in filtered"
        :key="project.slug"
        class="panel-card flex h-full flex-col gap-5 transition duration-200 hover:-translate-y-0.5 hover:border-sky-400/30"
      >
        <div class="space-y-3">
          <div class="flex items-start justify-between gap-3">
            <div class="space-y-2">
              <div class="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">{{ project.period }}</div>
              <h2 class="text-xl font-semibold text-white">{{ project.title }}</h2>
            </div>
            <span class="rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs font-medium text-sky-100">
              {{ project.positionTag }}
            </span>
          </div>

          <p class="text-sm leading-7 text-slate-300">{{ project.oneLiner }}</p>
        </div>

        <div class="flex flex-wrap gap-2">
          <span v-for="tech in project.stack" :key="tech" class="chip">
            {{ tech }}
          </span>
        </div>

        <div class="mt-auto flex flex-wrap gap-2 pt-1">
          <a
            v-for="(url, key) in project.links"
            :key="key"
            class="button-secondary"
            :href="url"
            target="_blank"
            rel="noreferrer"
          >
            {{ linkLabels[key as ProjectLinkKey] }}
          </a>
          <RouterLink class="button-primary" :to="`/projects/${project.slug}`">Details</RouterLink>
        </div>
      </article>
    </section>
  </div>
</template>
