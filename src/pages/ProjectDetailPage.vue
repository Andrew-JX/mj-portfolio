<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { projects } from '@/data/projects'
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
</script>

<template>
  <div v-if="project" class="space-y-8">
    <section class="hero-panel space-y-6">
      <div class="space-y-3">
        <div class="flex flex-wrap items-center gap-3">
          <span class="rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs font-medium text-sky-100">
            {{ project.positionTag }}
          </span>
          <span class="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">{{ project.period }}</span>
        </div>

        <h1 class="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{{ project.title }}</h1>
        <p class="max-w-3xl text-base leading-8 text-slate-300">{{ project.oneLiner }}</p>
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
    </section>

    <section
      v-if="project.visibility === 'nda'"
      class="rounded-3xl border border-amber-400/20 bg-amber-400/8 px-5 py-4 text-sm leading-7 text-amber-100"
    >
      NDA 说明：不展示客户名称、业务数据与代码细节，本页仅描述职责边界、技术方案和可公开讨论的工程经验。
    </section>

    <section class="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
      <article class="panel-card space-y-4">
        <div class="section-title">项目概览</div>
        <p class="text-sm leading-7 text-slate-300">{{ project.oneLiner }}</p>
        <div class="space-y-2 text-sm text-slate-300">
          <div v-for="item in projectLinks" :key="`${item.label}-summary-${item.url}`" class="flex flex-wrap items-center gap-2">
            <span class="min-w-14 text-slate-500">{{ item.label }}</span>
            <a :href="item.url" target="_blank" rel="noreferrer">{{ item.url }}</a>
          </div>
        </div>
      </article>

      <article v-if="project.note" class="panel-card space-y-4">
        <div class="section-title">补充说明</div>
        <p class="text-sm leading-7 text-slate-300">{{ project.note }}</p>
      </article>
    </section>

    <section class="panel-card space-y-4">
      <div class="section-title">我做了什么</div>
      <ul class="space-y-3 text-sm leading-7 text-slate-300">
        <li v-for="item in project.contributions" :key="item" class="detail-list-item">
          {{ item }}
        </li>
      </ul>
    </section>

    <section class="panel-card space-y-4">
      <div class="section-title">工程亮点</div>
      <ul class="space-y-3 text-sm leading-7 text-slate-300">
        <li v-for="item in project.highlights" :key="item" class="detail-list-item">
          {{ item }}
        </li>
      </ul>
    </section>

    <section v-if="project.aiNote" class="panel-card space-y-4">
      <div class="section-title">AI 协作方式</div>
      <div class="grid gap-4 lg:grid-cols-2">
        <div class="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
          <div class="text-sm font-semibold text-sky-200">我负责</div>
          <p class="mt-3 text-sm leading-7 text-slate-300">
            产品定位、需求拆解、架构边界、交互流程、提示约束、代码评审、联调与验收，确保 AI 参与后的结果仍然可解释、可维护、可交付。
          </p>
        </div>
        <div class="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
          <div class="text-sm font-semibold text-sky-200">AI 负责</div>
          <p class="mt-3 text-sm leading-7 text-slate-300">
            代码草稿生成、重复性模块实现、局部方案探索和文档整理辅助；最终结构、边界和上线质量由我选择、修改和收口。
          </p>
        </div>
      </div>
      <p class="text-sm leading-7 text-slate-300">{{ project.aiNote }}</p>
    </section>

    <div>
      <RouterLink class="text-sm text-slate-300 hover:text-white" to="/projects">返回项目列表</RouterLink>
    </div>
  </div>

  <div v-else class="text-slate-300">Project not found.</div>
</template>
