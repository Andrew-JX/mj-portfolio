<script setup lang="ts">
import { computed } from 'vue'
import type { ProjectMedia } from '@/types'

const props = withDefaults(
  defineProps<{
    media: ProjectMedia
    compact?: boolean
  }>(),
  {
    compact: false,
  },
)

const toneClass = computed(() => `project-preview-tone-${props.media.tone}`)
</script>

<template>
  <div class="project-preview-shell" :class="[toneClass, compact ? 'project-preview-compact' : '']">
    <img
      v-if="media.imageSrc"
      class="project-preview-image"
      :src="media.imageSrc"
      :alt="media.imageAlt ?? media.title"
    />

    <template v-else>
      <div class="project-preview-noise"></div>
      <div class="project-preview-grid"></div>
      <div class="project-preview-orb project-preview-orb-a"></div>
      <div class="project-preview-orb project-preview-orb-b"></div>

      <div class="project-preview-window">
        <div class="project-preview-window-top">
          <span class="project-preview-dot"></span>
          <span class="project-preview-dot"></span>
          <span class="project-preview-dot"></span>
        </div>
        <div class="project-preview-window-body">
          <div class="project-preview-panel project-preview-panel-primary"></div>
          <div class="project-preview-panel-row">
            <div class="project-preview-panel project-preview-panel-secondary"></div>
            <div class="project-preview-panel project-preview-panel-tertiary"></div>
          </div>
        </div>
      </div>
    </template>

    <div class="project-preview-content">
      <div class="project-preview-kicker">{{ media.eyebrow }}</div>
      <div class="project-preview-title">{{ media.title }}</div>
      <p class="project-preview-caption">{{ media.caption }}</p>
      <div class="project-preview-metrics">
        <span v-for="metric in media.metrics" :key="metric" class="project-preview-metric">{{ metric }}</span>
      </div>
    </div>
  </div>
</template>
