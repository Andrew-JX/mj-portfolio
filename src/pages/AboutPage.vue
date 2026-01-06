<template>
  <div class="space-y-10">
    <section class="space-y-4">
      <h1 class="text-3xl font-semibold tracking-tight">工程师作品集 · 技术能力证明</h1>
      <p class="text-slate-700 leading-relaxed max-w-3xl">
        我主要做 Web 大前端方向：业务前端工程化 + 三维可视化（Cesium/EarthSDK）+ 多端能力（Android）。
        这个网站不追求花哨设计，而是用“可访问链接 / 可复现工程 / 可验证证据”来证明我的交付能力。
      </p>

      <div class="flex flex-wrap gap-2">
        <span class="px-2.5 py-1 rounded-full text-xs border border-slate-200">Vue3</span>
        <span class="px-2.5 py-1 rounded-full text-xs border border-slate-200">TypeScript</span>
        <span class="px-2.5 py-1 rounded-full text-xs border border-slate-200">Cesium</span>
        <span class="px-2.5 py-1 rounded-full text-xs border border-slate-200">Three.js</span>
        <span class="px-2.5 py-1 rounded-full text-xs border border-slate-200">Android</span>
        <span class="px-2.5 py-1 rounded-full text-xs border border-slate-200">Docker/Nginx</span>
      </div>
    </section>

    <section class="grid md:grid-cols-3 gap-4">
      <div class="rounded-2xl border border-slate-200 p-5">
        <div class="font-semibold">三维可视化工程</div>
        <p class="text-sm text-slate-700 mt-2">
          Cesium/EarthSDK 三维交互工具、组件封装、渲染与数据流程拆分、兼容性排障。
        </p>
      </div>
      <div class="rounded-2xl border border-slate-200 p-5">
        <div class="font-semibold">业务前端工程化</div>
        <p class="text-sm text-slate-700 mt-2">
          Vue3 + Router + 状态管理，模块化页面、可维护结构、部署链路（CI/CD 可逐步补齐）。
        </p>
      </div>
      <div class="rounded-2xl border border-slate-200 p-5">
        <div class="font-semibold">端侧与多端能力</div>
        <p class="text-sm text-slate-700 mt-2">
          Kotlin/Compose + MVVM，Room/Retrofit，后台任务与提醒；可用视频/Release 证明交付。
        </p>
      </div>
    </section>
  </div>
</template>
