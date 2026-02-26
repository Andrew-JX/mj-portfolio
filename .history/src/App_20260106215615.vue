<template>
  <div class="min-h-screen">
    <header class="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur">
      <div class="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div
            class="h-10 w-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center font-semibold">
            MJ
          </div>
          <div class="leading-tight">
            <div class="font-semibold tracking-tight">Minyu Ji · 吉敏宇</div>
            <div class="text-sm text-slate-300">大前端工程师（Web · 3D 可视化 · Android）</div>
          </div>
        </div>

        <nav class="flex items-center gap-5 text-sm">
          <RouterLink class="text-slate-300 hover:text-white" to="/">About</RouterLink>
          <RouterLink class="text-slate-300 hover:text-white" to="/projects">Projects</RouterLink>
          <RouterLink class="text-slate-300 hover:text-white" to="/skills">Skills</RouterLink>
          <RouterLink class="text-slate-300 hover:text-white" to="/resume">Resume</RouterLink>

          <a class="text-slate-300 hover:text-white" href="https://github.com/Andrew-JX/" target="_blank"
            rel="noreferrer">
            GitHub
          </a>
        </nav>
      </div>
    </header>

    <main class="mx-auto max-w-5xl px-6 py-10">
      <RouterView />
    </main>

    <footer class="border-t border-slate-800">
      <div class="mx-auto max-w-5xl px-6 py-8 text-sm text-slate-400 flex flex-col gap-2">
        <div class="flex items-center gap-2">
          <span class="inline-block h-1.5 w-1.5 rounded-full bg-sky-400"></span>
          <span>Portfolio · Projects / Skills / Resume</span>
        </div>
        <div>© {{ new Date().getFullYear() }} Minyu Ji</div>
      </div>
    </footer>
  </div>
</template>
