export type LabPlan = {
  title: string
  stage: string
  summary: string
  tags: string[]
  bullets: string[]
  detail?: {
    label: string
    title: string
    content: string
  }
}

export const labPlans: LabPlan[] = [
  {
    title: 'family-finance',
    stage: 'In Progress',
    summary:
      '面向家庭记账与债务管理的全栈应用，用 Taro 让同一套客户端代码同时产出 H5 与微信小程序两端。范围仍在推进中，还没有收敛到最终形态。',
    tags: ['Taro', 'H5', 'WeChat Mini Program', 'MySQL'],
    bullets: [
      '围绕记账与债务两类真实使用场景搭建功能，同时维护 H5 与微信小程序双端产物。',
      '代码按 contracts、domain、miniapp 三层组织，用 Vitest 覆盖单元与组件测试，用 Docker Compose 拉起真实 MySQL 做集成测试。',
      '记账、债务操作等关键路径已用 Playwright 做真实浏览器验证；目前已完成多个开发批次，仍在迭代中。',
    ],
  },
]
