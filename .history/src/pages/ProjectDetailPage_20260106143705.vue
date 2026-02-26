<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { projects } from '@/data/projects'

const route = useRoute()
const project = computed(() => projects.find(p => p.slug === route.params.slug))
</script>

<template>
  <div v-if="project" class="space-y-8">
    <div class="space-y-2">
      <div class="text-xs text-slate-500">{{ project.type }} · {{ project.status ?? '—' }}</div>
      <h1 class="text-2xl font-semibold">{{ project.title }}</h1>
      <p class="text-slate-700">{{ project.subtitle }}</p>

      <div class="flex flex-wrap gap-2 pt-2">
        <span v-for="s in project.stack" :key="s" class="px-2.5 py-1 rounded-full text-xs border border-slate-200">
          {{ s }}
        </span>
      </div>

      <div class="flex flex-wrap gap-2 pt-3">
        <a v-if="project.links.live" class="px-3 py-2 rounded-xl text-sm border border-slate-200 hover:border-slate-300"
          :href="project.links.live" target="_blank" rel="noreferrer">Live</a>
        <a v-if="project.links.repo" class="px-3 py-2 rounded-xl text-sm border border-slate-200 hover:border-slate-300"
          :href="project.links.repo" target="_blank" rel="noreferrer">GitHub</a>
        <a v-if="project.links.video"
          class="px-3 py-2 rounded-xl text-sm border border-slate-200 hover:border-slate-300"
          :href="project.links.video" target="_blank" rel="noreferrer">Video</a>
      </div>
    </div>

    <section class="rounded-2xl border border-slate-200 p-5 space-y-3">
      <div class="font-semibold">Overview</div>
      <ul class="list-disc pl-5 text-sm text-slate-700 space-y-1">
        <li v-for="x in project.overview" :key="x">{{ x }}</li>
      </ul>
    </section>

    <section class="rounded-2xl border border-slate-200 p-5 space-y-3">
      <div class="font-semibold">Highlights</div>
      <ul class="list-disc pl-5 text-sm text-slate-700 space-y-1">
        <li v-for="x in project.highlights" :key="x">{{ x }}</li>
      </ul>
    </section>

    <section class="rounded-2xl border border-slate-200 p-5 space-y-3">
      <div class="font-semibold">What I Learned</div>
      <ul class="list-disc pl-5 text-sm text-slate-700 space-y-1">
        <li v-for="x in project.whatILearned" :key="x">{{ x }}</li>
      </ul>
    </section>

    <div>
      <RouterLink class="text-sm text-slate-700 hover:text-slate-950" to="/projects">← Back to Projects</RouterLink>
    </div>
  </div>

  <div v-else class="text-slate-700">
    Project not found.
  </div>
</template>
