<template>
  <div class="min-h-screen">
    <header class="border-b border-slate-200">
      <div class="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="h-9 w-9 rounded-xl border border-slate-200 flex items-center justify-center font-semibold">
            MJ
          </div>
          <div class="leading-tight">
            <div class="font-semibold">Minyu Ji</div>
            <div class="text-sm text-slate-600">大前端 · 3D 可视化 · 工程交付</div>
          </div>
        </div>

        <nav class="flex items-center gap-5 text-sm">
          <RouterLink class="text-slate-700 hover:text-slate-950" to="/">About</RouterLink>
          <RouterLink class="text-slate-700 hover:text-slate-950" to="/projects">Projects</RouterLink>
          <RouterLink class="text-slate-700 hover:text-slate-950" to="/skills">Skills</RouterLink>
          <RouterLink class="text-slate-700 hover:text-slate-950" to="/resume">Resume</RouterLink>

          <a class="text-slate-700 hover:text-slate-950" href="https://github.com/Andrew-JX/" target="_blank"
            rel="noreferrer">
            GitHub
          </a>
        </nav>
      </div>
    </header>

    <main class="mx-auto max-w-5xl px-6 py-10">
      <RouterView />
    </main>

    <footer class="border-t border-slate-200">
      <div class="mx-auto max-w-5xl px-6 py-6 text-sm text-slate-600 flex flex-col gap-2">
        <div>© {{ new Date().getFullYear() }} Minyu Ji · Portfolio</div>
        <div class="flex gap-4">
          <a class="hover:text-slate-950" href="https://github.com/Andrew-JX/" target="_blank"
            rel="noreferrer">GitHub</a>
          <!-- 可加：Gitee / Email -->
        </div>
      </div>
    </footer>
  </div>
</template>
