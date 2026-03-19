<template>
  <div class="min-h-screen bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.14),transparent_32%),linear-gradient(180deg,#020617_0%,#0f172a_55%,#020617_100%)]">
    <header class="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/72 backdrop-blur-xl">
      <div class="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div class="flex items-center gap-3">
          <div
            class="flex h-10 w-10 items-center justify-center rounded-2xl border border-sky-400/20 bg-slate-900/90 font-semibold text-sky-100 shadow-[0_0_30px_rgba(14,165,233,0.12)]">
            MJ
          </div>
          <div class="leading-tight">
            <div class="font-semibold tracking-tight text-white">Minyu Ji · 吉敏宇</div>
            <div class="text-sm text-slate-300">大前端工程师 · 工程化 / 全栈 / 3D 可视化</div>
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
          <span class="inline-block h-1.5 w-1.5 rounded-full bg-sky-400"></span>
          <span>Portfolio · Full-stack engineering / performance / security / visualization</span>
        </div>
        <div>© {{ new Date().getFullYear() }} Minyu Ji</div>
      </div>
    </footer>
  </div>
</template>
