<template>
  <div class="space-y-10">
    <section class="space-y-4">
      <div class="inline-flex items-center gap-2 text-sm text-slate-300">
        <span class="inline-block h-2 w-2 rounded-full bg-sky-400"></span>
        <span>求职：大前端工程师（Web / 三维可视化 / 多端）</span>
      </div>

      <h1 class="text-3xl font-semibold tracking-tight">
        大前端方向 · 工程化与三维可视化实践
      </h1>

      <p class="text-slate-300 leading-relaxed max-w-3xl">
        我专注 Web 大前端开发，方向偏工程化与可视化交付：Vue3 + TypeScript 业务开发、Cesium/EarthSDK 三维交互组件封装，
        具备基础的联调与部署能力。2024.08-2025.01 在江苏省基础地理信息中心前端实习，参与实景三维数据管理平台开发。
      </p>

      <div class="flex flex-wrap gap-2 pt-2">
        <span class="px-2.5 py-1 rounded-full text-xs bg-slate-900 border border-slate-800">Vue3</span>
        <span class="px-2.5 py-1 rounded-full text-xs bg-slate-900 border border-slate-800">TypeScript</span>
        <span class="px-2.5 py-1 rounded-full text-xs bg-slate-900 border border-slate-800">Vue Router</span>
        <span class="px-2.5 py-1 rounded-full text-xs bg-slate-900 border border-slate-800">Pinia</span>
        <span class="px-2.5 py-1 rounded-full text-xs bg-slate-900 border border-slate-800">Cesium</span>
        <span class="px-2.5 py-1 rounded-full text-xs bg-slate-900 border border-slate-800">EarthSDK</span>
        <span class="px-2.5 py-1 rounded-full text-xs bg-slate-900 border border-slate-800">Three.js</span>
        <span class="px-2.5 py-1 rounded-full text-xs bg-slate-900 border border-slate-800">Docker / Nginx</span>
      </div>
    </section>



    <section class="grid md:grid-cols-3 gap-4">
      <div class="rounded-2xl bg-slate-900/40 border border-slate-800 p-5">
        <div class="font-semibold">三维可视化交付</div>
        <p class="text-sm text-slate-300 mt-2">
          Cesium/EarthSDK 三维场景与空间分析；把测量/体积/角度分析做成组件，降低业务耦合，提升复用与维护效率。
        </p>
      </div>

      <div class="rounded-2xl bg-slate-900/40 border border-slate-800 p-5">
        <div class="font-semibold">工程化与质量意识</div>
        <p class="text-sm text-slate-300 mt-2">
          TypeScript 数据模型约束、模块化组织、路由与状态管理；遇到线上/构建问题能定位原因并稳定交付。
        </p>
      </div>

      <div class="rounded-2xl bg-slate-900/40 border border-slate-800 p-5">
        <div class="font-semibold">多端与部署补强</div>
        <p class="text-sm text-slate-300 mt-2">
          Android（Jetpack Compose + MVVM）项目实践；了解 Docker / Nginx 基础部署与前后端联调。
        </p>
      </div>
    </section>

    <section class="rounded-2xl bg-slate-900/40 border border-slate-800 p-6 space-y-3">
      <div class="font-semibold">基本信息</div>
      <div class="text-sm text-slate-300 leading-relaxed space-y-2">
        <div>教育：Monash University · Master of Information Technology（2025.03-2026.09）</div>
        <div>本科：南京信息工程大学 · 软件工程（GPA 3.1 / Top 10%）</div>
        <div>语言：CET-6，PTE 58（≈ IELTS 6.5）</div>

        <div class="pt-2 space-y-2">
          <div>邮箱：<span class="text-slate-200">JX15996596656@163.com</span></div>
          <div>
            GitHub：<a class="text-slate-300 hover:text-white" href="https://github.com/Andrew-JX/" target="_blank"
              rel="noreferrer">Andrew-JX</a>
          </div>
          <div>
            Gitee：<a class="text-slate-300 hover:text-white" href="https://gitee.com/ji-minyu" target="_blank"
              rel="noreferrer">ji-minyu</a>
          </div>

        </div>
      </div>
    </section>
  </div>
</template>
