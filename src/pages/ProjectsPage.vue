<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ProjectPreviewFrame from '@/components/ProjectPreviewFrame.vue'
import { projects } from '@/data/projects'
import { getProjectMedia } from '@/data/projectMedia'
import type { ProjectLinkEntry, ProjectLinkKey } from '@/types'

gsap.registerPlugin(ScrollTrigger)

type ProjectItem = (typeof projects)[number]
type ProjectCategory = {
  label: string
  matches: (project: ProjectItem) => boolean
}

const pageRef = ref<HTMLElement | null>(null)
const q = ref('')
const selectedCategory = ref('All')

const categories: ProjectCategory[] = [
  {
    label: 'All',
    matches: (_project) => true,
  },
  {
    label: 'AI / Agent',
    matches: (project) =>
      project.stack.some((tech) => ['Tool Calling', 'PyTorch', 'ResNet-18'].includes(tech)) ||
      project.positionTag.includes('AI'),
  },
  {
    label: 'AI Product',
    matches: (project) =>
      project.slug === 'fitmind-ai' || project.positionTag.includes('Data Product'),
  },
  {
    label: 'Full-stack',
    matches: (project) =>
      project.positionTag.includes('Full-stack') ||
      project.stack.some((tech) => ['Node.js', 'Express', 'PostgreSQL', 'Spring Boot'].includes(tech)),
  },
  {
    label: 'Data / GIS',
    matches: (project) =>
      project.stack.some((tech) => ['Leaflet', 'Mapbox GL', 'Cesium', 'EarthSDK', 'SuperMap3D', 'Open Data'].includes(tech)),
  },
  {
    label: 'Mobile / Course',
    matches: (project) =>
      project.stack.some((tech) => ['Kotlin', 'Jetpack Compose', 'Firebase Hosting'].includes(tech)) ||
      project.visibility === 'course',
  },
]

function getActiveCategory() {
  return categories.find((category) => category.label === selectedCategory.value) ?? categories[0]!
}

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

    const matchesCategory = getActiveCategory().matches(project)

    return matchesKeyword && matchesCategory
  })
})

const linkLabels: Record<ProjectLinkKey, string> = {
  live: 'Live',
  repo: 'Repo',
  doc: 'Doc',
  video: 'Video',
}

function getProjectLinks(project: (typeof projects)[number]): ProjectLinkEntry[] {
  const primaryLinks = Object.entries(project.links).map(([key, url]) => ({
    label: linkLabels[key as ProjectLinkKey],
    url,
  }))

  return [...primaryLinks, ...(project.extraLinks ?? [])]
}

let cleanup: (() => void) | undefined
const motionCleanups: Array<() => void> = []

onMounted(async () => {
  await nextTick()

  if (!pageRef.value) {
    return
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const context = gsap.context(() => {
    if (reducedMotion) {
      return
    }

    gsap.from('[data-project-card]', {
      opacity: 0,
      y: 28,
      duration: 0.7,
      stagger: 0.05,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '[data-project-grid]',
        start: 'top 82%',
      },
    })

    const cards = gsap.utils.toArray<HTMLElement>('[data-project-card]')
    cards.forEach((card, index) => {
      const xTo = gsap.quickTo(card, 'x', { duration: 0.25, ease: 'power3.out' })
      const yTo = gsap.quickTo(card, 'y', { duration: 0.25, ease: 'power3.out' })
      const rotateTo = gsap.quickTo(card, 'rotation', { duration: 0.25, ease: 'power3.out' })

      gsap.to(card, {
        yPercent: index % 2 === 0 ? -1.5 : 1.5,
        duration: 3.6 + index * 0.12,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })

      const handleMove = (event: PointerEvent) => {
        const rect = card.getBoundingClientRect()
        const px = (event.clientX - rect.left) / rect.width - 0.5
        const py = (event.clientY - rect.top) / rect.height - 0.5
        xTo(px * 8)
        yTo(py * 8 - 6)
        rotateTo(px * 1.8)
      }

      const handleLeave = () => {
        xTo(0)
        yTo(0)
        rotateTo(0)
      }

      card.addEventListener('pointermove', handleMove)
      card.addEventListener('pointerleave', handleLeave)
      motionCleanups.push(() => {
        card.removeEventListener('pointermove', handleMove)
        card.removeEventListener('pointerleave', handleLeave)
      })
    })
  }, pageRef)

  cleanup = () => context.revert()
})

onUnmounted(() => {
  cleanup?.()
  motionCleanups.splice(0).forEach((fn) => fn())
})
</script>

<template>
  <div ref="pageRef" class="space-y-8 lg:space-y-10">
    <section class="section-shell space-y-4">
      <div class="section-title">Projects</div>
      <div class="grid gap-6 xl:grid-cols-[1.05fr_0.95fr] xl:items-end">
        <div class="space-y-4">
          <h1 class="display-headline text-[clamp(2.8rem,8vw,5.8rem)]">PROJECTS</h1>
          <p class="max-w-3xl text-sm leading-7 text-stone-300/82 sm:text-base">
            这里放的是我做过的一些项目，主要还是以前端、AI 应用、全栈交付和地图可视化相关为主。
          </p>
        </div>
        <div class="panel-card panel-citrus space-y-4">
          <div class="section-title">说明</div>
          <p class="text-sm leading-7 text-stone-300/82">
            有些项目偏 AI 应用，有些偏复杂前端、地图可视化或者全栈交付，可以按项目类型和关键词筛选着看。
          </p>
        </div>
      </div>
    </section>

    <section class="panel-card panel-contrast space-y-5">
      <div class="flex flex-col gap-5 xl:grid xl:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] xl:items-start">
        <label class="block min-w-0 space-y-2">
          <span class="text-xs font-medium uppercase tracking-[0.24em] text-stone-500">Search</span>
          <input
            v-model="q"
            aria-label="Search projects"
            placeholder="Search title, category, keyword..."
            class="showcase-input"
          />
        </label>

        <div class="min-w-0 space-y-2 xl:pl-2">
          <div class="text-xs font-medium uppercase tracking-[0.24em] text-stone-500">Category Filter</div>
          <div class="flex flex-wrap items-start gap-2">
            <button
              v-for="category in categories"
              :key="category.label"
              type="button"
              class="chip-button"
              :class="category.label === selectedCategory ? 'chip-button-active' : ''"
              @click="selectedCategory = category.label"
            >
              {{ category.label }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <section data-project-grid class="grid gap-4 md:grid-cols-2">
      <article
        v-for="project in filtered"
        :key="project.slug"
        data-project-card
        class="project-card-shell"
      >
        <ProjectPreviewFrame :media="getProjectMedia(project.slug)" compact />

        <div class="space-y-4">
          <div class="project-frame-meta">
            <span class="index-badge">{{ project.positionTag }}</span>
            <span class="project-period">{{ project.period }}</span>
          </div>

          <div class="space-y-3">
            <h2 class="text-2xl font-semibold tracking-tight text-white">{{ project.title }}</h2>
            <p class="text-sm leading-7 text-stone-300/82">{{ project.oneLiner }}</p>
          </div>
        </div>

        <div class="flex flex-wrap gap-2">
          <span v-for="tech in project.stack" :key="`${project.slug}-${tech}`" class="chip">
            {{ tech }}
          </span>
        </div>

        <div class="mt-auto flex flex-wrap gap-2 pt-3">
          <a
            v-for="item in getProjectLinks(project)"
            :key="`${project.slug}-${item.label}-${item.url}`"
            class="button-secondary"
            :href="item.url"
            target="_blank"
            rel="noreferrer"
          >
            {{ item.label }}
          </a>
          <RouterLink class="button-primary" :to="`/projects/${project.slug}`">Details</RouterLink>
        </div>
      </article>
    </section>
  </div>
</template>
