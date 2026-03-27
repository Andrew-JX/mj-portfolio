<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// Typing animation — cycles through job directions
const roles = ['大前端工程师', '全栈开发工程师', '3D 可视化开发者', 'AI 应用前端']
const roleIdx = ref(0)
const displayText = ref('')
const isDeleting = ref(false)
let typingTimer: ReturnType<typeof setTimeout>

function tick() {
  const target = roles[roleIdx.value % roles.length]!
  if (!isDeleting.value) {
    displayText.value = target.slice(0, displayText.value.length + 1)
    if (displayText.value === target) {
      typingTimer = setTimeout(() => { isDeleting.value = true; tick() }, 2200)
      return
    }
  } else {
    displayText.value = target.slice(0, displayText.value.length - 1)
    if (displayText.value === '') {
      isDeleting.value = false
      roleIdx.value = (roleIdx.value + 1) % roles.length
    }
  }
  typingTimer = setTimeout(tick, isDeleting.value ? 55 : 105)
}

onMounted(() => tick())
onUnmounted(() => clearTimeout(typingTimer))
</script>

<template>
  <div class="space-y-10">

    <!-- Hero panel -->
    <section class="hero-panel animate-fade-up space-y-6">
      <!-- Status badge -->
      <div class="inline-flex items-center gap-2 rounded-full border border-sky-400/25 bg-sky-400/10 px-3 py-1 text-sm text-sky-100">
        <span class="dot-live"></span>
        <span>求职方向：大前端工程师 / 全栈开发工程师</span>
      </div>

      <!-- Title block -->
      <div class="space-y-3">
        <h1 class="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          吉敏宇
        </h1>
        <div class="text-2xl font-medium sm:text-3xl">
          <span class="text-gradient-sky typing-cursor">{{ displayText }}</span>
        </div>
        <p class="max-w-3xl text-base leading-8 text-slate-300">
          聚焦全栈工程化、性能安全与可部署交付，兼顾三维可视化与移动端架构实践。项目以
          TypeScript、React/Vue、Node.js、PostgreSQL、Docker、Nginx 为核心，能从页面实现讲到接口、
          鉴权、缓存和部署的完整链路。
        </p>
      </div>

      <!-- Tech chips -->
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

      <!-- Stats row -->
      <div class="grid grid-cols-3 gap-3 border-t border-slate-800/60 pt-5 sm:grid-cols-3">
        <div class="space-y-1 text-center">
          <div class="text-2xl font-bold text-gradient-sky">1+</div>
          <div class="text-xs text-slate-400">年实习经历</div>
        </div>
        <div class="space-y-1 text-center">
          <div class="text-2xl font-bold text-gradient-sky">5+</div>
          <div class="text-xs text-slate-400">完整交付项目</div>
        </div>
        <div class="space-y-1 text-center">
          <div class="text-2xl font-bold text-gradient-sky">8+</div>
          <div class="text-xs text-slate-400">核心技术栈</div>
        </div>
      </div>
    </section>

    <!-- Capability cards -->
    <section class="animate-fade-up-d1 grid gap-4 lg:grid-cols-3">
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

    <!-- Detail section -->
    <section class="animate-fade-up-d2 grid gap-4 lg:grid-cols-[1.3fr_0.9fr]">
      <article class="panel-card space-y-4">
        <div class="section-title">我做过什么</div>
        <div class="space-y-3 text-sm leading-7 text-slate-300">
          <p>2024.08 到 2025.01 在江苏省基础地理信息中心参与政企 WebGIS 实景三维平台开发，负责三维交互组件封装、兼容性排障与接口联调。</p>
          <p>在课程与个人项目中补齐了更偏国内大前端岗位的能力链路，包括全栈同步系统（Ruilian）、防晒健康平台（SunSafe）、安全与性能优化、移动端数据架构，以及 AI 协作开发流程。</p>
          <p>当前主投 React/Vue + TypeScript 方向的工程化前端岗位，希望做平台、中后台、数据产品、可视化或 AI 应用前端，能写 Node 会更好。</p>
        </div>
      </article>

      <article class="panel-card space-y-4">
        <div class="section-title">基本信息</div>
        <div class="space-y-2 text-sm leading-7 text-slate-300">
          <div>教育：Monash University · Master of IT（2025.03 - 2026.10）</div>
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
