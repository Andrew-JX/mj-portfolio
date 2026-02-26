<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-semibold tracking-tight">Skills</h1>
      <p class="text-sm text-slate-400 mt-1">
        我把技能按“交付能力”整理：能做什么、做过什么、能讲清楚什么（面试更好对齐）。
      </p>
    </div>

    <div class="grid md:grid-cols-2 gap-4">
      <section class="rounded-2xl bg-slate-900/40 border border-slate-800 p-6 space-y-2">
        <div class="font-semibold">前端 / Web（主线）</div>
        <div class="text-sm text-slate-300 leading-relaxed">
          HTML / CSS / JavaScript（ES6+），Vue3 / React，TypeScript；Vue Router / Pinia；Vite 工程化与构建发布。
        </div>
      </section>

      <section class="rounded-2xl bg-slate-900/40 border border-slate-800 p-6 space-y-2">
        <div class="font-semibold">三维可视化（优势项）</div>
        <div class="text-sm text-slate-300 leading-relaxed">
          Cesium（WebGIS / 三维可视化），EarthSDK（工程集成），Three.js（原型与渲染流程实践）；三维交互工具组件化（测量/体积/分析）。
        </div>
      </section>

      <section class="rounded-2xl bg-slate-900/40 border border-slate-800 p-6 space-y-2">
        <div class="font-semibold">工程化 / 部署（补强项）</div>
        <div class="text-sm text-slate-300 leading-relaxed">
          Git / npm；Docker / docker compose；Nginx 静态托管与同域转发；能处理构建失败、依赖源、Host 校验等上线问题。
        </div>
      </section>

      <section class="rounded-2xl bg-slate-900/40 border border-slate-800 p-6 space-y-2">
        <div class="font-semibold">移动端 / 后端基础</div>
        <div class="text-sm text-slate-300 leading-relaxed">
          Android（Kotlin + Jetpack Compose，MVVM），Room / Retrofit，WorkManager / AlarmManager；Java / Spring Boot（接口联调与基础开发）。
        </div>
      </section>
    </div>
  </div>
</template>
