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
const visualClass = computed(() => `project-preview-visual-${props.media.slug}`)
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

      <div class="project-preview-window" :class="visualClass">
        <div class="project-preview-window-top">
          <span class="project-preview-dot"></span>
          <span class="project-preview-dot"></span>
          <span class="project-preview-dot"></span>
        </div>
        <div class="project-preview-window-body project-preview-visual">
          <template v-if="media.slug === 'fitmind-ai'">
            <div class="project-visual-row">
              <span class="project-visual-status">Tool call</span>
              <span class="project-visual-pulse"></span>
            </div>
            <div class="project-visual-bars">
              <span style="--bar-height: 72%"></span>
              <span style="--bar-height: 44%"></span>
              <span style="--bar-height: 86%"></span>
              <span style="--bar-height: 58%"></span>
              <span style="--bar-height: 68%"></span>
            </div>
            <div class="project-visual-chat">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </template>

          <template v-else-if="media.slug === 'ai-pm-dev'">
            <div class="project-visual-workflow">
              <span>Idea</span>
              <span>PRD</span>
              <span>Build</span>
            </div>
            <div class="project-visual-checklist">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div class="project-visual-gate">strict gate</div>
          </template>

          <template v-else-if="media.slug === 'easemove'">
            <div class="project-visual-map">
              <span class="project-visual-route"></span>
              <span class="project-visual-pin project-visual-pin-a"></span>
              <span class="project-visual-pin project-visual-pin-b"></span>
            </div>
            <div class="project-visual-score">
              <span>Comfort</span>
              <strong>82</strong>
            </div>
          </template>

          <template v-else-if="media.slug === 'real-scene-3d'">
            <div class="project-visual-terrain">
              <span class="project-visual-measure-line"></span>
              <span class="project-visual-measure-dot project-visual-measure-a"></span>
              <span class="project-visual-measure-dot project-visual-measure-b"></span>
            </div>
            <div class="project-visual-coords">
              <span>lon 118.8</span>
              <span>lat 32.0</span>
            </div>
          </template>

          <template v-else-if="media.slug === 'ruilian'">
            <div class="project-visual-sync">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div class="project-visual-records">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </template>

          <template v-else-if="media.slug === 'sunsafe'">
            <div class="project-visual-uv">
              <span>UV</span>
              <strong>7.8</strong>
            </div>
            <div class="project-visual-diary">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </template>

          <template v-else-if="media.slug === 'agri-identification'">
            <div class="project-visual-scan">
              <span></span>
            </div>
            <div class="project-visual-confidence">
              <span>ResNet</span>
              <strong>94%</strong>
            </div>
          </template>

          <template v-else-if="media.slug === 'studysmart'">
            <div class="project-visual-phone">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div class="project-visual-reminder">09:30</div>
          </template>

          <template v-else>
            <div class="project-preview-panel project-preview-panel-primary"></div>
            <div class="project-preview-panel-row">
              <div class="project-preview-panel project-preview-panel-secondary"></div>
              <div class="project-preview-panel project-preview-panel-tertiary"></div>
            </div>
          </template>
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
