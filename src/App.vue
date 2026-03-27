<template>
  <div class="min-h-screen bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.14),transparent_32%),linear-gradient(180deg,#020617_0%,#0f172a_55%,#020617_100%)]">

    <!-- Animated background orbs -->
    <div aria-hidden="true" class="pointer-events-none fixed inset-0 overflow-hidden">
      <div
        class="animate-orb-1 absolute -top-40 -left-20 h-[560px] w-[560px] rounded-full blur-[110px]"
        style="background: radial-gradient(circle, rgba(14,165,233,0.10), transparent 70%);"
      ></div>
      <div
        class="animate-orb-2 absolute top-[38%] -right-28 h-[440px] w-[440px] rounded-full blur-[90px]"
        style="background: radial-gradient(circle, rgba(99,102,241,0.08), transparent 70%);"
      ></div>
      <div
        class="animate-orb-3 absolute -bottom-20 left-[28%] h-[380px] w-[380px] rounded-full blur-[100px]"
        style="background: radial-gradient(circle, rgba(34,211,238,0.07), transparent 70%);"
      ></div>
    </div>

    <header class="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/72 backdrop-blur-xl">
      <div class="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div class="flex items-center gap-3">
          <div
            class="animate-glow-pulse flex h-10 w-10 items-center justify-center rounded-2xl border border-sky-400/30 bg-slate-900/90 font-semibold text-sky-100">
            MJ
          </div>
          <div class="leading-tight">
            <div class="font-semibold tracking-tight text-white">Minyu Ji · 吉敏宇</div>
            <div class="text-sm text-slate-400">大前端工程师 · 工程化 / 全栈 / 3D 可视化</div>
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

    <footer class="border-t border-slate-800/80">
      <div class="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-8 text-sm text-slate-400 sm:px-6">
        <div class="flex items-center gap-2">
          <span class="dot-live"></span>
          <span>Portfolio · Full-stack engineering / performance / security / visualization</span>
        </div>
        <div>© {{ new Date().getFullYear() }} Minyu Ji</div>
      </div>
    </footer>
  </div>
</template>
