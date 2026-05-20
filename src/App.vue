<script setup lang="ts">
import { computed } from 'vue'
import TorchToggle from '@/components/TorchToggle.vue'
import { useTheme } from '@/composables/useTheme'

const { isDark } = useTheme()

const pageStyle = computed(() => ({
  background: isDark.value
    ? 'radial-gradient(circle at 16% 12%, rgba(249, 115, 22, 0.14), transparent 26%), radial-gradient(circle at 84% 20%, rgba(245, 158, 11, 0.1), transparent 24%), radial-gradient(circle at 50% 82%, rgba(217, 119, 6, 0.14), transparent 34%), linear-gradient(180deg, #110d0b 0%, #18110d 36%, #0d0a09 100%)'
    : 'radial-gradient(circle at 18% 10%, rgba(251, 146, 60, 0.2), transparent 26%), radial-gradient(circle at 85% 18%, rgba(245, 158, 11, 0.14), transparent 24%), radial-gradient(circle at 48% 82%, rgba(249, 115, 22, 0.12), transparent 28%), linear-gradient(180deg, #fff8ef 0%, #fff1df 52%, #f7ead8 100%)',
}))
</script>

<template>
  <div class="min-h-screen transition-colors duration-500" :style="pageStyle">
    <div aria-hidden="true" class="atmosphere-layer">
      <div class="atmosphere-orb atmosphere-orb-a"></div>
      <div class="atmosphere-orb atmosphere-orb-b"></div>
      <div class="atmosphere-orb atmosphere-orb-c"></div>
    </div>

    <div aria-hidden="true" class="grain-overlay"></div>

    <header
      class="sticky top-0 z-50 border-b backdrop-blur-xl transition-colors duration-500"
      :class="isDark ? 'border-white/8 bg-stone-950/60' : 'border-stone-900/8 bg-white/68'"
    >
      <div class="mx-auto flex max-w-[1240px] flex-col gap-4 px-5 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div class="flex items-center gap-3">
          <div class="brand-monogram">MJ</div>
          <div class="leading-tight">
            <div class="font-semibold tracking-[0.08em]" :class="isDark ? 'text-white' : 'text-stone-950'">Minyu Ji / 吉敏宇</div>
            <div class="text-xs tracking-[0.14em]" :class="isDark ? 'text-stone-400' : 'text-stone-500'">
              前端开发 / AI 应用开发 / 全栈交付
            </div>
          </div>
        </div>

        <nav class="flex flex-wrap items-center gap-2 text-sm">
          <RouterLink class="nav-link" to="/">About</RouterLink>
          <RouterLink class="nav-link" to="/projects">Projects</RouterLink>
          <RouterLink class="nav-link" to="/lab">Lab</RouterLink>
          <RouterLink class="nav-link" to="/resume">Resume</RouterLink>
          <a class="nav-link" href="https://github.com/Andrew-JX/" target="_blank" rel="noreferrer">GitHub</a>
        </nav>
      </div>
    </header>

    <main class="mx-auto max-w-[1240px] px-5 py-7 sm:px-6 sm:py-10">
      <RouterView />
    </main>

    <footer class="border-t transition-colors duration-500" :class="isDark ? 'border-white/8' : 'border-stone-900/10'">
      <div
        class="mx-auto flex max-w-[1240px] flex-col gap-2 px-5 py-8 text-sm sm:px-6"
        :class="isDark ? 'text-stone-400' : 'text-stone-600'"
      >
        <div class="flex items-center gap-2">
          <span class="dot-live"></span>
          <span>Portfolio / Frontend / AI / Full-stack</span>
        </div>
        <div>© {{ new Date().getFullYear() }} Minyu Ji</div>
      </div>
    </footer>

    <TorchToggle />
  </div>
</template>
