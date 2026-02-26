<template>
  <div class="space-y-6">
    <div class="flex items-end justify-between flex-wrap gap-4">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight">Resume</h1>
        <p class="text-sm text-slate-400 mt-1">这是公开版简历（建议公开页面优先只留邮箱）。</p>
      </div>

      <a class="px-3 py-2 rounded-xl text-sm border border-slate-800 bg-slate-900 hover:border-slate-700" href="/resume.pdf"
        download>
        下载 PDF
      </a>
    </div>

    <div class="rounded-2xl border border-slate-800 bg-slate-900/30 overflow-hidden">
      <object data="/resume.pdf" type="application/pdf" class="w-full h-[78vh]">
        <div class="p-6 text-sm text-slate-300">
          浏览器不支持预览 PDF。请点击右上角“下载 PDF”。
        </div>
      </object>
    </div>
  </div>
</template>
