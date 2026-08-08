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
  kind: 'quick-path' | 'work-route' | 'rework'
  label: string
  detail: string
}

export const flowScales = [
  {
    id: 'small',
    label: '小活',
    description: '只走 ①，写一句判据；做完自己看 diff。溢出到第二个晚上、或者碰到第二个模块，就停下回到 ②。',
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
    oneLiner: '先不开 AI，用自己的话写下任务、可证伪判据、带后果的假设和两类不懂；工作任务再用 work-skill A 把这份原始理解整理成可结账的事实。',
    skipWhen: '一晚上内能做完、只动单个模块、随时可回滚的小活，只写一句判据就够。',
    toolIds: ['work-skill'],
    methodNote: '工作入口：A · 接任务；先自己写，再让 Skill 整理。',
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
    oneLiner: '先用 Acceptance Author 攻击假绿灯，再由我批准并冻结 contract SHA 与 baseline SHA；个人任务进 Beads，工作任务沿用团队已有任务系统。',
    skipWhen: '小活跳过，判据写在第一步那一句里就行。',
    toolIds: ['acceptance-author', 'beads'],
    pitfall: '判据写得精确不等于写得正确。必须把机器判据、人工判据和尚不可验证分开，并让限定词追到运行时来源。contract、baseline、candidate 是三个锚点；candidate 一旦改契约文件，原批准失效，不能让执行方把判据和实现一起改成绿灯。',
  },
  {
    id: 'execute',
    order: 6,
    title: '执行：出计划、审、补全、做、交接',
    oneLiner: '执行方按冻结契约实施，交接时用 Evidence-Bound Executor 逐条报告「达成 / 未达成 / 未验证」和脱敏证据；没有 candidate SHA 只能写未收口。',
    skipWhen: '不跳过。',
    toolIds: ['evidence-bound-executor', 'git', 'work-skill'],
    methodNote: '工作任务连续没有新证据或范围变化时：B · 卡住。',
    pitfall: '执行方最了解自己写了什么，也最容易用自己的叙述替代核验。真实见过的几种：报告「测试全绿」但不说跑的是哪条命令；用测试名推断安全性质，没构造过真实的破坏；把「部分关闭」写成「已关闭」；新一轮报告里，上一轮的遗留悄悄不见了。',
  },
  {
    id: 'verify',
    order: 7,
    title: '独立核验',
    oneLiner: '审查方在干净 worktree 钉住 contract、baseline、candidate 三个 SHA，自己读真实 diff，不拿执行方摘要当事实；浮动工作区只能给 ADVISORY。',
    skipWhen: '不跳过。',
    toolIds: ['evidence-led-reviewer', 'git'],
    pitfall: '换角色名不等于独立。普通 diff 还看不见未跟踪文件；正式审查必须另查并固定 candidate。审查退回可以直接回⑥，但每轮都要编号，⑨最终必须看到打回 N 轮和每轮 finding，不能让两个窗口私下循环到看不见。',
  },
  {
    id: 'ci-gate',
    order: 8,
    title: 'CI 门',
    oneLiner: '自动化在独立于执行窗口的固定环境运行时，是非参与者见证；只有 required check、分支保护、受控状态来源和不可绕过规则同时成立时，它才是合并门。',
    skipWhen: '仓库没有 CI 时可以明确记为空门，但不能把本地命令写成 CI 证据。是否先补门，按任务风险决定。',
    toolIds: ['playwright', 'vitest', 'stryker'],
    pitfall: '见证和门是两个性质：远端跑过不代表阻塞合并，required check 也可能被跳过或由错误来源置绿。FitMind 和本站当前都没有这两层，所以这里只能如实显示缺口，不能借“CI”两个字加码证据。',
  },
  {
    id: 'verdict',
    order: 9,
    title: '我裁决',
    oneLiner: '先看本批被审查打回 N 轮及每轮 finding，再核对声明与证据。用户可见改动必须由我用真实数据走真实路径；实现错回⑥，判据错回⑤重新冻结。',
    skipWhen: '不跳过。这是我唯一不能外包的一步。',
    toolIds: [],
    pitfall: '证据只覆盖判据写到的部分。判据本身错时，继续修实现只会让下一轮更牢地通过错误标准，所以必须回⑤。另一头也要防止等待成本把裁决变成橡皮图章：锁哪条命令是设计问题，不是测试越多越好。',
  },
  {
    id: 'settle',
    order: 10,
    title: '结账与欠账入库',
    oneLiner: '上一轮的每条未决和每条假设逐条点名，只用三种结果，一条都不许消失；跨天的欠账进任务库，跨项目的更新到索引。',
    skipWhen: '不跳过。',
    toolIds: ['beads', 'git', 'work-skill'],
    methodNote: '工作任务使用 C1 逐条结账；C2 按真实日终或周终节奏独立使用。',
    pitfall: '结账要放在收尾流程的最前面，不能放最后。放最后一定会被跳过，而被跳过的那条，恰好总是最不想面对的那条。',
  },
]

export const flowEdges: FlowEdge[] = [
  {
    from: 'self-brief',
    to: 'end',
    kind: 'quick-path',
    label: '小活直通',
    detail: '做完自己看 diff · 结束',
  },
  {
    from: 'self-brief',
    to: 'contract',
    kind: 'work-route',
    label: '工作任务分支',
    detail: '①⑤⑥⑩自己守 · ⑦团队 review · ⑧团队 CI · ⑨授权合并人',
  },
  {
    from: 'self-brief',
    to: 'recon',
    kind: 'rework',
    label: '溢出 · 回②',
    detail: '小活跨到第二晚或第二模块，升级为完整流程',
  },
  {
    from: 'verify',
    to: 'execute',
    kind: 'rework',
    label: '审查退回 · review round + 1',
    detail: '记录轮次与本轮 findings，⑨汇总查看',
  },
  {
    from: 'verdict',
    to: 'contract',
    kind: 'rework',
    label: '判据错误 · contract round + 1',
    detail: '回⑤重新冻结 contract 与 baseline',
  },
  {
    from: 'verdict',
    to: 'execute',
    kind: 'rework',
    label: '实现错误 · execution round + 1',
    detail: '契约不变，回⑥修候选实现',
  },
]
