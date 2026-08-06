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
    title: '生命科学证据审查工作台',
    stage: 'Concept',
    summary: '计划探索一个面向药物研发与转化研究的垂直 AI 应用，基于公开论文和临床试验数据，把检索、证据抽取、结构化对照与多角色复核组织成可追溯流程。',
    tags: ['Life Sciences AI', 'RAG', 'Multi-Agent', 'Evidence Review'],
    bullets: [
      '围绕文献检索与证据抽取、靶点—适应症证据表和结论反向引用构建核心工作台。',
      '由 Scientist Agent 起草、Reviewer Agent 复核科学依据、Supervisor 检查流程完整性，最后由专家批准。',
      '规划采用 Next.js、FastAPI、PostgreSQL 与 RAG / Agent；AI 提升处理效率，但不替代科学判断。',
    ],
  },
]
