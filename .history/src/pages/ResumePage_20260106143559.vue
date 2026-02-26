<template>
  <div class="space-y-6">
    <div class="flex items-end justify-between flex-wrap gap-4">
      <div>
        <h1 class="text-2xl font-semibold">Resume</h1>
        <p class="text-sm text-slate-600 mt-1">建议公开版不放手机号，只留邮箱/LinkedIn/GitHub。</p>
      </div>

      <a class="px-3 py-2 rounded-xl text-sm border border-slate-200 hover:border-slate-300" href="/resume.pdf"
        download>
        Download PDF
      </a>
    </div>

    <div class="rounded-2xl border border-slate-200 overflow-hidden">
      <object data="/resume.pdf" type="application/pdf" class="w-full h-[78vh]">
        <div class="p-6 text-sm text-slate-700">
          浏览器不支持预览 PDF。请点击右上角 Download。
        </div>
      </object>
    </div>
  </div>
</template>
