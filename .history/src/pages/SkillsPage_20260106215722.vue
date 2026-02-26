<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-semibold tracking-tight">Skills</h1>
      <p class="text-sm text-slate-400 mt-1">
        技能以“能做过什么”为标准：三维可视化组件化、工程化组织、以及移动端能力补强。
      </p>
    </div>

    <div class="grid md:grid-cols-2 gap-4">
      <section class="rounded-2xl bg-slate-900/40 border border-slate-800 p-6 space-y-2">
        <div class="font-semibold">前端 / Web</div>
        <div class="text-sm text-slate-300 leading-relaxed">
          HTML / CSS / JavaScript（ES6+），Vue3 / React，TypeScript，Element Plus
        </div>
      </section>

      <section class="rounded-2xl bg-slate-900/40 border border-slate-800 p-6 space-y-2">
        <div class="font-semibold">三维可视化</div>
        <div class="text-sm text-slate-300 leading-relaxed">
          Cesium（WebGIS / 三维可视化），EarthSDK（工程集成），Three.js（原型与渲染流程实践）
        </div>
      </section>

      <section class="rounded-2xl bg-slate-900/40 border border-slate-800 p-6 space-y-2">
        <div class="font-semibold">工程化 / 部署</div>
        <div class="text-sm text-slate-300 leading-relaxed">
          Node.js（前端工程相关），Git / npm / Vite，Docker / Nginx（基础部署）
        </div>
      </section>

      <section class="rounded-2xl bg-slate-900/40 border border-slate-800 p-6 space-y-2">
        <div class="font-semibold">后端 / 其他</div>
        <div class="text-sm text-slate-300 leading-relaxed">
          Java / Spring Boot，MySQL，Android（Jetpack Compose），CET-6 / PTE 58
        </div>
      </section>
    </div>
  </div>
</template>
