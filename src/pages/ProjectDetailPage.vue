<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import ProjectPreviewFrame from '@/components/ProjectPreviewFrame.vue'
import { projects } from '@/data/projects'
import { getProjectMedia } from '@/data/projectMedia'
import type { ProjectLinkEntry, ProjectLinkKey } from '@/types'

const route = useRoute()
const project = computed(() => projects.find((item) => item.slug === route.params.slug))

const linkLabels: Record<ProjectLinkKey, string> = {
  live: 'Live',
  repo: 'Repo',
  doc: 'Doc',
  video: 'Video',
}

const projectLinks = computed<ProjectLinkEntry[]>(() => {
  if (!project.value) {
    return []
  }

  const primaryLinks = Object.entries(project.value.links).map(([key, url]) => ({
    label: linkLabels[key as ProjectLinkKey],
    url,
  }))

  return [...primaryLinks, ...(project.value.extraLinks ?? [])]
})

const projectMedia = computed(() => (project.value ? getProjectMedia(project.value.slug) : null))
</script>

<template>
  <div v-if="project" class="space-y-8">
    <section class="hero-panel space-y-6">
      <div class="space-y-3">
        <div class="flex flex-wrap items-center gap-3">
          <span class="index-badge">{{ project.positionTag }}</span>
          <span class="text-xs font-medium uppercase tracking-[0.2em] text-stone-500">{{ project.period }}</span>
        </div>

        <h1 class="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{{ project.title }}</h1>
        <p class="max-w-3xl text-base leading-8 text-stone-300/82">{{ project.oneLiner }}</p>
      </div>

      <div class="flex flex-wrap gap-2">
        <span v-for="tech in project.stack" :key="tech" class="chip">
          {{ tech }}
        </span>
      </div>

      <div class="flex flex-wrap gap-2">
        <a
          v-for="item in projectLinks"
          :key="`${item.label}-${item.url}`"
          class="button-secondary"
          :href="item.url"
          target="_blank"
          rel="noreferrer"
        >
          {{ item.label }}
        </a>
      </div>

      <ProjectPreviewFrame v-if="projectMedia" :media="projectMedia" />
    </section>

    <section
      v-if="project.visibility === 'nda'"
      class="rounded-3xl border border-amber-400/20 bg-amber-400/8 px-5 py-4 text-sm leading-7 text-amber-100"
    >
      NDA note: this case study avoids client-identifying material and focuses on responsibilities, technical approach,
      and delivery experience that can be discussed publicly.
    </section>

    <section class="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
      <article class="panel-card space-y-4">
        <div class="section-title">Overview</div>
        <p class="text-sm leading-7 text-stone-300/82">{{ project.oneLiner }}</p>
        <div class="space-y-2 text-sm text-stone-300/82">
          <div
            v-for="item in projectLinks"
            :key="`${item.label}-summary-${item.url}`"
            class="flex flex-wrap items-center gap-2"
          >
            <span class="min-w-14 text-stone-500">{{ item.label }}</span>
            <a :href="item.url" target="_blank" rel="noreferrer">{{ item.url }}</a>
          </div>
        </div>
      </article>

      <article v-if="project.note" class="panel-card space-y-4">
        <div class="section-title">Context</div>
        <p class="text-sm leading-7 text-stone-300/82">{{ project.note }}</p>
      </article>
    </section>

    <section class="panel-card space-y-4">
      <div class="section-title">Contributions</div>
      <ul class="space-y-3 text-sm leading-7 text-stone-300/82">
        <li v-for="item in project.contributions" :key="item" class="detail-list-item">
          {{ item }}
        </li>
      </ul>
    </section>

    <section class="panel-card space-y-4">
      <div class="section-title">Highlights</div>
      <ul class="space-y-3 text-sm leading-7 text-stone-300/82">
        <li v-for="item in project.highlights" :key="item" class="detail-list-item">
          {{ item }}
        </li>
      </ul>
    </section>

    <section v-if="project.aiNote" class="panel-card space-y-4">
      <div class="section-title">AI Collaboration</div>
      <div class="grid gap-4 lg:grid-cols-2">
        <div class="rounded-2xl border border-white/8 bg-black/18 p-4">
          <div class="text-sm font-semibold text-orange-200">My role</div>
          <p class="mt-3 text-sm leading-7 text-stone-300/82">
            Product framing, scope control, interaction flow, system boundaries, review, integration, and quality
            sign-off remained my responsibility throughout delivery.
          </p>
        </div>
        <div class="rounded-2xl border border-white/8 bg-black/18 p-4">
          <div class="text-sm font-semibold text-orange-200">AI role</div>
          <p class="mt-3 text-sm leading-7 text-stone-300/82">
            AI support was used for draft generation, implementation assistance, local exploration, and documentation
            acceleration, with final architecture and production quality decisions made manually.
          </p>
        </div>
      </div>
      <p class="text-sm leading-7 text-stone-300/82">{{ project.aiNote }}</p>
    </section>

    <div>
      <RouterLink class="text-sm text-stone-300 transition-colors hover:text-white" to="/projects">
        Back to projects
      </RouterLink>
    </div>
  </div>

  <div v-else class="text-stone-300">Project not found.</div>
</template>
