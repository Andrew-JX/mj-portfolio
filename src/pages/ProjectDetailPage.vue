<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { projects } from '@/data/projects'
import type { ProjectLinkKey } from '@/types'

const route = useRoute()
const project = computed(() => projects.find((item) => item.slug === route.params.slug))

const linkLabels: Record<ProjectLinkKey, string> = {
  live: 'Live',
  repo: 'Repo',
  doc: 'Doc',
  video: 'Video',
}
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
          v-for="(url, key) in project.links"
          :key="key"
          class="button-secondary"
          :href="url"
          target="_blank"
          rel="noreferrer"
        >
          {{ linkLabels[key as ProjectLinkKey] }}
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
        <div class="section-title">Summary</div>
        <p class="text-sm leading-7 text-slate-300">{{ project.oneLiner }}</p>
        <div class="space-y-2 text-sm text-slate-300">
          <div v-for="(url, key) in project.links" :key="`${key}-summary`" class="flex flex-wrap items-center gap-2">
            <span class="w-12 text-slate-500">{{ linkLabels[key as ProjectLinkKey] }}</span>
            <a :href="url" target="_blank" rel="noreferrer">{{ url }}</a>
          </div>
        </div>
      </article>

      <article v-if="project.note" class="panel-card space-y-4">
        <div class="section-title">Project Note</div>
        <p class="text-sm leading-7 text-slate-300">{{ project.note }}</p>
      </article>
    </section>

    <section class="panel-card space-y-4">
      <div class="section-title">What I did</div>
      <ul class="space-y-3 text-sm leading-7 text-slate-300">
        <li v-for="item in project.contributions" :key="item" class="detail-list-item">
          {{ item }}
        </li>
      </ul>
    </section>

    <section class="panel-card space-y-4">
      <div class="section-title">Engineering highlights</div>
      <ul class="space-y-3 text-sm leading-7 text-slate-300">
        <li v-for="item in project.highlights" :key="item" class="detail-list-item">
          {{ item }}
        </li>
      </ul>
    </section>

    <section class="panel-card space-y-4">
      <div class="section-title">Interview grill</div>
      <ol class="space-y-3 text-sm leading-7 text-slate-300">
        <li v-for="(item, index) in project.interviewGrill" :key="item" class="flex gap-3">
          <span class="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-sky-400/20 bg-sky-400/10 text-xs text-sky-100">
            Q{{ index + 1 }}
          </span>
          <span>{{ item }}</span>
        </li>
      </ol>
    </section>

    <section v-if="project.aiNote" class="panel-card space-y-4">
      <div class="section-title">AI collaboration</div>
      <div class="grid gap-4 lg:grid-cols-2">
        <div class="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
          <div class="text-sm font-semibold text-sky-200">我负责</div>
          <p class="mt-3 text-sm leading-7 text-slate-300">
            产品设想、需求拆解、交互方案、提示词设计、验收标准、代码评审、部署与联调，以及将 AI 生成结果收敛为可上线的实现。
          </p>
        </div>
        <div class="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
          <div class="text-sm font-semibold text-sky-200">AI 负责</div>
          <p class="mt-3 text-sm leading-7 text-slate-300">
            代码脚手架生成、重复性模块实现和部分方案草稿输出；最终结构、边界和交付质量由我做选择、修订和验收。
          </p>
        </div>
      </div>
      <p class="text-sm leading-7 text-slate-300">{{ project.aiNote }}</p>
    </section>

    <div>
      <RouterLink class="text-sm text-slate-300 hover:text-white" to="/projects">← 返回项目列表</RouterLink>
    </div>
  </div>

  <div v-else class="text-slate-300">Project not found.</div>
</template>
