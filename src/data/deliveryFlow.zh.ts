export type FlowNode = {
  id: string
  order: number
  title: string
  oneLiner: string
  skipWhen: string
  pitfall: string
  toolIds: string[]
  methodNote?: string
}

export type FlowEdge = {
  from: string
  to: string
  kind: 'quick-path' | 'rework'
  label: string
}

export const flowScales = [
  {
    id: 'small',
    label: '小活',
    description: '只走 ①，写一句判据；做完自己看 diff。',
  },
  {
    id: 'medium',
    label: '跨几个晚上',
    description: '走完整流程，监察不开。',
  },
  {
    id: 'large',
    label: '跨周 / 跨项目',
    description: '走完整流程；涉及数据、权限、发布，或有争议、退回两轮、范围溢出时才开瘦身监察。',
  },
] as const

export const flowNodes: FlowNode[] = [
  {
    id: 'self-brief',
    order: 1,
    title: '先自己写三分钟',
    oneLiner: '不开任何 AI 窗口，先自己写下：用我的话复述任务、一句可证伪的完成判据、带后果的假设、以及我不懂的地方（分成技术和领域两类）。',
    skipWhen: '一晚上内能做完、只动单个模块、随时可回滚的小活，只写一句判据就够。',
    toolIds: [],
    methodNote: '方法入口：workSkill A',
    pitfall: '一旦先跟 AI 聊，我写下来的「我理解的任务」就已经是它的措辞了。这一步要的是被污染之前的那一版。另一个反复出现的坑是把领域不懂当成技术不懂——那种东西查不到，因为它根本不在任何文档里，只能问人。',
  },
  {
    id: 'recon',
    order: 2,
    title: '摸底四个数',
    oneLiner: '开一个只读窗口，拿到四个数：有没有 CI、全量测试跑多久、有没有仓库规则文件、现有代码怎么组织。',
    skipWhen: '全新项目，还没有代码的时候。',
    toolIds: ['codebase-memory'],
    pitfall: '我以为自己知道项目的状态，其实不知道。FitMind 有 698 条单测、26 条 E2E，我一直觉得它测试很全——直到专门去查才发现它没有任何 CI，也就是说那些测试从来没有在我不主动跑的时候拦下过任何东西。',
  },
  {
    id: 'planning',
    order: 3,
    title: '规划互补，定架构与边界',
    oneLiner: '让两个 AI 各出一版方案、互相挑毛病，最后由我确定架构、规范、边界和大纲。',
    skipWhen: '不跳过。这一步省下的时间会在执行期加倍还回来。',
    toolIds: [],
    pitfall: '两个 AI 互相印证，会让方案越来越完整，但不保证越来越对。它们可能一起偏，而且偏得很有条理——听上去处处成立，反而让我产生「这下想对了」的错觉。反方向也会发生：有时它们过分保守，给出的结构封闭、不留扩展余地。所以这一步的产出必须由我拍板，不能由「哪一边说服了另一边」来决定。',
  },
  {
    id: 'repo-rules',
    order: 4,
    title: '把规则落进仓库',
    oneLiner: '把事实边界和交付规则写成仓库里的 AGENTS.md，不靠聊天传递。',
    skipWhen: '仓库里已经有一份还准确的规则文件。',
    toolIds: ['git'],
    pitfall: '聊天记录不是项目状态。窗口一换，目标、非目标、我批过的例外和还没验证的东西就可能被摘要压掉，新窗口看起来在接着干，实际是从另一个版本的任务开始的。',
  },
  {
    id: 'contract',
    order: 5,
    title: '建任务与验收判据',
    oneLiner: '任务进任务库，验收判据由我在开工之前写死。',
    skipWhen: '小活跳过，判据写在第一步那一句里就行。',
    toolIds: ['beads'],
    pitfall: '验收判据只是个字段，工具不会校验它。谁写它，它就是谁的标准——让执行方收工时补填，那就不是判据，是对已完成工作的追认。',
  },
  {
    id: 'execute',
    order: 6,
    title: '执行：出计划、审、补全、做、交接',
    oneLiner: '执行方先出计划交审查方过，带着意见补全后再动手；交接时每条判据只用「达成 / 未达成 / 未验证」，并给出证据。',
    skipWhen: '不跳过。',
    toolIds: ['git'],
    pitfall: '执行方最了解自己写了什么，也最容易用自己的叙述替代核验。真实见过的几种：报告「测试全绿」但不说跑的是哪条命令；用测试名推断安全性质，没构造过真实的破坏；把「部分关闭」写成「已关闭」；新一轮报告里，上一轮的遗留悄悄不见了。',
  },
  {
    id: 'verify',
    order: 7,
    title: '独立核验',
    oneLiner: '审查方钉住一个固定 SHA，自己读真实 diff 和未跟踪文件，不拿执行方的摘要当事实；测试文件的增删行数单独列出来看。',
    skipWhen: '不跳过。',
    toolIds: ['git', 'playwright', 'vitest'],
    pitfall: '换一个角色名不等于换了一个参与者。同一个窗口把自己从执行者改成审查者，不构成独立审查。还有一个很隐蔽的：普通的 git diff 看不见未跟踪的新文件，所以「我看过 diff 了」可能漏掉了一整个新增的测试目录。',
  },
  {
    id: 'ci-gate',
    order: 8,
    title: 'CI 门',
    oneLiner: '在固定环境里跑固定命令，绿灯由它给，不由任何一个窗口给。这是整条流程里唯一的非参与者。',
    skipWhen: '不跳过。仓库还没有 CI 的时候，这一格是空的——而这件事本身就该先解决。',
    toolIds: ['playwright', 'vitest', 'stryker'],
    pitfall: '在这之前，我所有的验证都是参与者自己跑的：执行方跑一遍，审查方再跑一遍，但环境和命令始终在被审的那一方手里。加上这道门之后，我才第一次有了一个不会被说服的东西。',
  },
  {
    id: 'verdict',
    order: 9,
    title: '我裁决',
    oneLiner: '看声明与证据是否对得上，通过就收，不通过就打回并开下一轮。',
    skipWhen: '不跳过。这是我唯一不能外包的一步。',
    toolIds: [],
    pitfall: '验证越强，等待越贵。如果裁决锁定的是整个仓库的全量测试，一次要等十几分钟——真到那个时候，人会开始跳过裁决，整条流程就退化成橡皮图章。所以锁哪条命令是设计问题，不是测试越多越好。',
  },
  {
    id: 'settle',
    order: 10,
    title: '结账与欠账入库',
    oneLiner: '上一轮的每条未决和每条假设逐条点名，只用三种结果，一条都不许消失；跨天的欠账进任务库，跨项目的更新到索引。',
    skipWhen: '不跳过。',
    toolIds: ['beads', 'git'],
    pitfall: '结账要放在收尾流程的最前面，不能放最后。放最后一定会被跳过，而被跳过的那条，恰好总是最不想面对的那条。',
  },
]

export const flowEdges: FlowEdge[] = [
  {
    from: 'self-brief',
    to: 'end',
    kind: 'quick-path',
    label: '小活直通',
  },
  {
    from: 'verdict',
    to: 'execute',
    kind: 'rework',
    label: '打回 · round + 1',
  },
]
