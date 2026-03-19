<script setup lang="ts">
type SkillGroup = {
  title: string
  points: string[]
  evidence: { label: string; to: string }[]
}

const groups: SkillGroup[] = [
  {
    title: '核心前端',
    points: [
      '用 TypeScript 管数据模型和组件边界，减少页面扩展时的隐式耦合。',
      '能在 React 和 Vue 中处理组件化、状态管理、路由、权限和复杂表单交互，不只停留在静态页面层。',
      '做项目时优先考虑长期维护成本，强调可读性、边界清晰和持续迭代能力。',
    ],
    evidence: [
      { label: 'Ruilian', to: '/projects/ruilian' },
      { label: 'SunSafe', to: '/projects/sunsafe' },
    ],
  },
  {
    title: '工程化',
    points: [
      '基于 Vite 做开发与构建，关注代码组织、构建速度和部署路径的稳定性。',
      '性能优化路径可以落到路由懒加载、接口缓存、静态资源拆分与代理配置。',
      '当前仓库未配置 CI/CD 流程，后续可补 GitHub Actions；现阶段以构建通过和部署可访问作为交付基线。',
    ],
    evidence: [
      { label: 'SunSafe', to: '/projects/sunsafe' },
      { label: 'FIT5032 Fitness', to: '/projects/fit5032-fitness' },
    ],
  },
  {
    title: '全栈链路',
    points: [
      '能承担 Express、Postgres、JWT、WebSocket、API 设计与前后端联调的完整链路。',
      '关注登录态、权限边界、Space 设计、代理转发和多设备同步这些更接近真实业务的问题。',
      '会把前端体验和后端约束一起考虑，例如同域反代、分页策略、索引设计和部署环境差异。',
    ],
    evidence: [
      { label: 'Ruilian', to: '/projects/ruilian' },
      { label: '农产品识别', to: '/projects/agri-identification' },
    ],
  },
  {
    title: '安全与性能',
    points: [
      '做过双层限流、XSS 清洗、参数化查询、CORS 与 secure cookie，知道这些能力如何落到具体接口。',
      '会结合缓存 TTL、分页、page size 限制和数据库索引来做接口级性能优化。',
      '关注 why 而不只是 how，包括 sameSite、trust proxy、缓存陈旧策略和查询计划影响。',
    ],
    evidence: [
      { label: 'SunSafe', to: '/projects/sunsafe' },
      { label: 'Ruilian', to: '/projects/ruilian' },
    ],
  },
  {
    title: '三维可视化',
    points: [
      '使用过 Cesium、EarthSDK、SuperMap3D、Three.js 和 WebGL，能解释各自适用边界。',
      '重点能力是三维工具组件化，以及多引擎并存场景下的兼容性排障，而不是单纯搭场景。',
      '能够把 measure、volume、analysis 这类能力抽成可复用模块，并说明接入业务页的方式。',
    ],
    evidence: [{ label: '政企 WebGIS', to: '/projects/real-scene-3d' }],
  },
  {
    title: 'AI 协作开发',
    points: [
      '把 AI 工具当成研发协作放大器，而不是替代判断的黑盒，重点用在需求拆解、提示词、评审和验收。',
      '在腾讯 AI Coding 课程中用 CodeBuddy 结对完成 Ruilian，负责产品设想、评审、部署联调与交付质量收口。',
      '也会使用 Cursor、Copilot 等工具辅助阅读代码、生成初稿和验证方案，但最终以工程可维护性为准。',
    ],
    evidence: [{ label: 'Ruilian', to: '/projects/ruilian' }],
  },
]
</script>

<template>
  <div class="space-y-8">
    <section class="space-y-3">
      <h1 class="text-3xl font-semibold tracking-tight text-white">Skills</h1>
      <p class="max-w-3xl text-sm leading-7 text-slate-400">
        技能页不写“会什么名词”，只写“我能扛什么问题”。每组都附上证据链接，尽量落在做过、能解释、能被追问的层面。
      </p>
    </section>

    <section class="grid gap-4 lg:grid-cols-2">
      <article v-for="group in groups" :key="group.title" class="panel-card space-y-4">
        <div class="section-title">{{ group.title }}</div>

        <ul class="space-y-3 text-sm leading-7 text-slate-300">
          <li v-for="point in group.points" :key="point" class="detail-list-item">
            {{ point }}
          </li>
        </ul>

        <div class="flex flex-wrap items-center gap-2 text-sm">
          <span class="text-slate-500">Evidence:</span>
          <RouterLink
            v-for="item in group.evidence"
            :key="item.to"
            class="rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-sky-100 hover:border-sky-300/30 hover:text-white"
            :to="item.to"
          >
            {{ item.label }}
          </RouterLink>
        </div>
      </article>
    </section>
  </div>
</template>
