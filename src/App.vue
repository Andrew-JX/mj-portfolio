<script setup lang="ts">
import { computed } from 'vue'
import TorchToggle from '@/components/TorchToggle.vue'
import { useTheme } from '@/composables/useTheme'

const { isDark } = useTheme()

const pageStyle = computed(() => ({
  background: isDark.value
    ? 'radial-gradient(circle at top, rgba(14,165,233,0.14), transparent 32%), linear-gradient(180deg, #020617 0%, #0f172a 55%, #020617 100%)'
    : 'radial-gradient(ellipse at top right, rgba(186,230,253,0.35), transparent 52%), radial-gradient(ellipse at bottom left, rgba(196,181,253,0.18), transparent 52%), linear-gradient(180deg, #f0f9ff 0%, #e8f4fd 60%, #f5f0ff 100%)',
}))

const orb1Style = computed(() => ({
  background: isDark.value
    ? 'radial-gradient(circle, rgba(14,165,233,0.11), transparent 70%)'
    : 'radial-gradient(circle, rgba(14,165,233,0.09), transparent 70%)',
}))

const orb2Style = computed(() => ({
  background: isDark.value
    ? 'radial-gradient(circle, rgba(99,102,241,0.09), transparent 70%)'
    : 'radial-gradient(circle, rgba(99,102,241,0.07), transparent 70%)',
}))

const orb3Style = computed(() => ({
  background: isDark.value
    ? 'radial-gradient(circle, rgba(34,211,238,0.07), transparent 70%)'
    : 'radial-gradient(circle, rgba(34,211,238,0.06), transparent 70%)',
}))

const orb4Style = computed(() => ({
  background: isDark.value
    ? 'radial-gradient(circle, rgba(244,114,182,0.06), transparent 70%)'
    : 'radial-gradient(circle, rgba(244,114,182,0.04), transparent 70%)',
}))
</script>

<template>
  <div class="min-h-screen" :style="pageStyle">

    <!-- Animated background orbs -->
    <div aria-hidden="true" class="pointer-events-none fixed inset-0 overflow-hidden">
      <div class="animate-orb-1 absolute -top-40 -left-20 h-[560px] w-[560px] rounded-full blur-[110px]" :style="orb1Style"></div>
      <div class="animate-orb-2 absolute top-[38%] -right-28 h-[440px] w-[440px] rounded-full blur-[90px]"  :style="orb2Style"></div>
      <div class="animate-orb-3 absolute -bottom-20 left-[28%] h-[380px] w-[380px] rounded-full blur-[100px]" :style="orb3Style"></div>
      <div class="animate-orb-4 absolute top-[18%] left-[52%] h-[320px] w-[320px] rounded-full blur-[120px]" :style="orb4Style"></div>
    </div>

    <!-- Grain texture overlay -->
    <div aria-hidden="true" class="grain-overlay"></div>

    <header
      class="sticky top-0 z-50 border-b backdrop-blur-xl transition-colors duration-500"
      :class="isDark ? 'border-slate-800/80 bg-slate-950/72' : 'border-sky-100/70 bg-white/80'"
    >
      <div class="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div class="flex items-center gap-3">
          <div
            class="animate-glow-pulse flex h-10 w-10 items-center justify-center rounded-2xl border border-sky-400/30 bg-slate-900/90 font-semibold text-sky-100"
            :class="!isDark && 'border-sky-300/50 bg-white/90 text-sky-700'"
          >
            MJ
          </div>
          <div class="leading-tight">
            <div class="font-semibold tracking-tight" :class="isDark ? 'text-white' : 'text-slate-900'">Minyu Ji · 吉敏宇</div>
            <div class="text-sm" :class="isDark ? 'text-slate-400' : 'text-slate-500'">大前端工程师 · 工程化 / 全栈 / 3D 可视化</div>
          </div>
        </div>

        <nav class="flex flex-wrap items-center gap-2 text-sm">
          <RouterLink class="nav-link" to="/">About</RouterLink>
          <RouterLink class="nav-link" to="/projects">Projects</RouterLink>
          <RouterLink class="nav-link" to="/skills">Skills</RouterLink>
          <RouterLink class="nav-link" to="/resume">Resume</RouterLink>
          <a class="nav-link" href="https://github.com/Andrew-JX/" target="_blank" rel="noreferrer">GitHub</a>
        </nav>
      </div>
    </header>

    <main class="mx-auto max-w-6xl px-5 py-8 sm:px-6 sm:py-10">
      <RouterView />
    </main>

    <footer class="border-t transition-colors duration-500" :class="isDark ? 'border-slate-800/80' : 'border-sky-100/70'">
      <div
        class="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-8 text-sm sm:px-6"
        :class="isDark ? 'text-slate-400' : 'text-slate-500'"
      >
        <div class="flex items-center gap-2">
          <span class="dot-live"></span>
          <span>Portfolio · Full-stack engineering / performance / security / visualization</span>
        </div>
        <div>© {{ new Date().getFullYear() }} Minyu Ji</div>
      </div>
    </footer>

    <!-- Torch theme toggle — fixed bottom-right -->
    <TorchToggle />
  </div>
</template>
