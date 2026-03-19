<template>
  <div class="space-y-10">
    <section class="hero-panel space-y-6">
      <div class="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-sm text-sky-100">
        <span class="inline-block h-2 w-2 rounded-full bg-sky-400"></span>
        <span>主投方向：平台 / 中后台 / 数据产品 / 可视化 / AI 应用前端</span>
      </div>

      <div class="space-y-4">
        <h1 class="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          大前端工程师
          <span class="mt-2 block text-2xl text-slate-300 sm:text-3xl">工程化前端 / 全栈 / 3D 可视化</span>
        </h1>

        <p class="max-w-3xl text-base leading-8 text-slate-300">
          作品集主线聚焦全栈工程化、性能安全与可部署交付，其次覆盖三维可视化与移动端架构实践。项目以 TypeScript、React/Vue、Node.js、
          PostgreSQL、Docker、Nginx 为核心，能解释从页面实现到接口、鉴权、缓存、部署的完整链路。
        </p>
      </div>

      <div class="flex flex-wrap gap-2">
        <span class="chip">TypeScript</span>
        <span class="chip">React / Vue</span>
        <span class="chip">Vite</span>
        <span class="chip">Node.js / Express</span>
        <span class="chip">PostgreSQL</span>
        <span class="chip">Docker / Nginx</span>
        <span class="chip">Cesium / EarthSDK</span>
        <span class="chip">Jetpack Compose</span>
      </div>
    </section>

    <section class="grid gap-4 lg:grid-cols-3">
      <article class="panel-card space-y-3">
        <div class="text-sm font-semibold text-sky-200">工程化 + 交付</div>
        <p class="text-sm leading-7 text-slate-300">
          以 Vite、TypeScript 和组件化为基础组织前端工程，能把部署、代理、缓存和构建问题一起解决；在 SunSafe 与 Ruilian 中做过
          Vercel、Render、Docker Compose、Nginx 的真实交付链路。
        </p>
      </article>

      <article class="panel-card space-y-3">
        <div class="text-sm font-semibold text-sky-200">全栈链路</div>
        <p class="text-sm leading-7 text-slate-300">
          能承担 Node.js / Express、PostgreSQL、JWT、WebSocket、API 设计与前后端联调，重点关注登录态、安全边界、分页索引、
          缓存 TTL 和多端同步这些会真正影响上线质量的问题。
        </p>
      </article>

      <article class="panel-card space-y-3">
        <div class="text-sm font-semibold text-sky-200">可视化 / 图形</div>
        <p class="text-sm leading-7 text-slate-300">
          参与过 Cesium、EarthSDK、SuperMap3D 和 Three.js 相关项目，能够将测量、体积、分析等三维能力组件化，并处理多引擎兼容与联调问题。
        </p>
      </article>
    </section>

    <section class="grid gap-4 lg:grid-cols-[1.3fr_0.9fr]">
      <article class="panel-card space-y-4">
        <div class="section-title">我做过什么</div>
        <div class="space-y-3 text-sm leading-7 text-slate-300">
          <p>2024.08 到 2025.01 在江苏省基础地理信息中心参与政企 WebGIS 实景三维平台开发，负责三维交互组件封装、兼容性排障与接口联调。</p>
          <p>在课程与个人项目中补齐了更偏国内大前端岗位的能力链路，包括全栈同步系统、防晒健康平台、安全与性能优化、移动端数据架构，以及 AI 协作开发流程。</p>
          <p>当前主投 React/Vue + TypeScript 方向的工程化前端岗位，希望做平台、中后台、数据产品、可视化或 AI 应用前端，能写 Node 会更好。</p>
        </div>
      </article>

      <article class="panel-card space-y-4">
        <div class="section-title">基本信息</div>
        <div class="space-y-2 text-sm leading-7 text-slate-300">
          <div>教育：Monash University · Master of Information Technology（2025.03 - 2026.09）</div>
          <div>本科：南京信息工程大学 · 软件工程（GPA 3.1 / Top 10%）</div>
          <div>语言：CET-6，PTE 58（约 IELTS 6.5）</div>
          <div>邮箱：<span class="text-slate-100">JX15996596656@163.com</span></div>
          <div>
            GitHub：
            <a href="https://github.com/Andrew-JX/" target="_blank" rel="noreferrer">Andrew-JX</a>
          </div>
          <div>
            Gitee：
            <a href="https://gitee.com/ji-minyu" target="_blank" rel="noreferrer">ji-minyu</a>
          </div>
        </div>
      </article>
    </section>
  </div>
</template>
