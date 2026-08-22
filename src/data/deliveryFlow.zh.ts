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
  kind: 'quick-path' | 'work-route' | 'rework' | 'exit'
  label: string
  detail: string
}

export const flowScales = [
  {
    id: 'small',
    label: '小活',
    description: '项目已有规则照常执行；额外只走 ①，写一句判据并检查真实 diff。溢出到第二个晚上或第二个模块，就停下回到 ②。',
  },
  {
    id: 'medium',
    label: '跨几个晚上',
    description: '沿用项目的 branch / commit / PR / CI 基线；冻结判据、证据化交接。团队走普通 review，个人项目用独立窗口做 ADVISORY；默认不开三 SHA 正式审计。',
  },
  {
    id: 'large',
    label: '跨周 / 跨项目',
    description: '走完整流程并追加三 SHA、干净 worktree、正式独立核验与负向验证；涉及数据、权限、发布、有争议、退回两轮或范围溢出时开瘦身监察。',
  },
] as const

export const flowNodes: FlowNode[] = [
  {
    id: 'self-brief',
    order: 1,
    title: '先自己写三分钟',
    oneLiner: '先不开 AI，用自己的话写下任务、可证伪判据、带后果的假设和两类不懂。',
    skipWhen: '一晚上内能做完、只动单个模块、随时可回滚的小活，只写一句判据就够。',
    toolIds: [],
    pitfall: '一旦先跟 AI 聊，我写下来的「我理解的任务」就已经是它的措辞了。这一步要的是被污染之前的那一版。另一个反复出现的坑是把领域不懂当成技术不懂——那种东西查不到，因为它根本不在任何文档里，只能问人。',
  },
  {
    id: 'recon',
    order: 2,
    title: '摸底工程与协作协议',
    oneLiner: '开只读窗口分两类摸底：自动读取 CI、测试、代码结构、规则文件、ruleset / 分支保护、合并方式、部署触发器和最近提交风格；只向人确认 review 与批准归谁、哪层历史永久保留、什么才算可以发布。②的发布控制关系决定⑪走自持发布还是团队发布。',
    skipWhen: '全新项目可以跳过「继承已有协议」，但仍要确认仓库归属、提交权限和发布控制人，再选择最小默认。',
    toolIds: ['codebase-memory', 'git'],
    methodNote: '自动读机器事实，问人只问权限与裁决；读不到的远端规则明确记未知。',
    pitfall: '我以为自己知道项目的状态，其实不知道。FitMind 有 698 条单测、26 条 E2E，我一直觉得它测试很全——直到专门去查才发现它没有任何 CI。另一个相反的坑，是把 ruleset、PR 模板和 git log 能回答的问题逐条问人，让摸底本身变成最贵的一格。',
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
    title: '继承规则，只记获批差异',
    oneLiner: '现成项目先服从维护者指令、仓库文档和远端强制规则；发现空缺或冲突只提出差异，未经维护者批准不新建制度。全新项目才把最小事实边界和交付规则写进 AGENTS.md，并给绝对要求配机器门禁。',
    skipWhen: '现成项目不能跳过规则继承；全新项目没有旧规则可读，但仍要建立与当前风险相称的最小规则。',
    toolIds: ['git'],
    pitfall: '聊天记录不是项目状态，但把自己的流程整套写进别人的仓库同样错误。规则文件、实际门禁和团队口径冲突时不能擅自选一个顺眼的；先记录冲突、暂停并请有权限的人裁决。规则烂掉又是静默的，照着过期规则干活会全链路绿灯。',
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
    title: '执行：按项目规范提交与交接',
    oneLiner: '执行方沿用②发现的 branch / commit / PR 规范，按项目真正保留的历史单位组织可审查改动，再按冻结契约实施；交接时用 Evidence-Bound Executor 逐条报告「达成 / 未达成 / 未验证」和脱敏证据，没有 candidate SHA 只能写未收口。',
    skipWhen: '不跳过。',
    toolIds: ['evidence-bound-executor', 'git'],
    methodNote: '工作任务连续没有新证据或范围变化时：B · 卡住。',
    pitfall: '执行方最了解自己写了什么，也最容易用自己的叙述替代核验。真实见过的几种：报告「测试全绿」但不说跑的是哪条命令；把浏览器断言通过、根命令退出 0、资源清理完成合并成一条结论；用测试名推断安全性质，没构造过真实破坏；把「部分关闭」写成「已关闭」；上一轮遗留在新报告里消失。另一个坑是把自己的 Conventional Commits、分支前缀或合并偏好强塞进已有仓库；规范哪一层历史，取决于项目最终保留 commit、squash 后的 PR 标题还是 merge commit。',
  },
  {
    id: 'verify',
    order: 7,
    title: '分级核验',
    oneLiner: '中档团队项目沿用普通 code review；个人项目由独立窗口读取真实 diff，浮动工作区只给 ADVISORY。高风险批次才在干净 worktree 钉住 contract、baseline、candidate 三个 SHA，正式独立重跑并裁定。',
    skipWhen: '小活只执行项目已有 review 基线；中档不能把普通 review 或 ADVISORY 冒充正式放行，高风险不能跳过三锚点核验。',
    toolIds: ['evidence-led-reviewer', 'git'],
    pitfall: '换角色名不等于独立，浮动工作区也不能产出正式 PASS；普通 diff 还看不见未跟踪文件。family-finance 2B 的首个 candidate 浏览器断言全部通过，但 Reviewer 独立复现出 Windows 根进程清理超时、命令退出 1，因此在合同不变的情况下退回⑥重做 candidate。每轮都要编号，⑨最终必须看到打回 N 轮和每轮 finding。真正要守的不是「换个人」，是审查方拿到仓库事实而不是执行方摘要。',
  },
  {
    id: 'ci-gate',
    order: 8,
    title: 'CI 门',
    oneLiner: '自动化在独立于执行窗口的固定环境运行时，是非参与者见证；只有 required check、分支保护、受控状态来源和不可绕过规则同时成立时，它才是合并门。',
    skipWhen: '仓库没有 CI 时可以明确记为空门，但不能把本地命令写成 CI 证据。是否先补门，按任务风险决定。',
    toolIds: ['playwright', 'vitest', 'stryker'],
    pitfall: '见证和门是两个性质：远端跑过不代表阻塞合并，required check 也可能被跳过或由错误来源置绿。FitMind、family-finance 和本站当前都没有这两层；family-finance 甚至在开工合同里把「CI 文件数 0」作为摸底事实固定下来，所以这里只能如实显示空门，不能借“CI”两个字加码证据。',
  },
  {
    id: 'verdict',
    order: 9,
    title: '我裁决',
    oneLiner: '先看本批被审查打回 N 轮及每轮 finding，再核对声明与证据。用户可见改动必须由我用真实数据走真实路径；放行时预登记上线后观测项、期限和失败形态，确实不可外部观测才记⑪不适用。实现错回⑥，判据错回⑤重新冻结。',
    skipWhen: '不跳过。这是我唯一不能外包的一步。',
    toolIds: [],
    pitfall: '证据只覆盖判据写到的部分。判据本身错时必须回⑤，不能继续修实现把错误标准做得更牢。上线观测如果等看到结果后再定义，就会按现象重写成功；如果说不出任何观测量，要在此处区分「确实不可观测」和「其实不知道为什么放行」。超过 14 天没裁决要转 stale 并重新核验；⑪的观测窗口过期不同，证据已经消失，只能记未验证，不能无限顺延。',
  },
  {
    id: 'settle',
    order: 10,
    title: '结账与欠账入库',
    oneLiner: '上一轮的每条未决和每条假设逐条点名，只用三种结果，一条都不许消失；跨天的欠账进任务库，跨项目的更新到索引。',
    skipWhen: '不跳过。',
    toolIds: ['beads', 'git'],
    methodNote: '工作任务使用 C1 逐条结账；C2 按真实日终或周终节奏独立使用。',
    pitfall: '结账要放在收尾流程的最前面，不能放最后。放最后一定会被跳过，而被跳过的那条，恰好总是最不想面对的那条。',
  },
  {
    id: 'observe',
    order: 11,
    title: '发布反馈回流',
    oneLiner: '触发形态由②决定：自持发布在⑨预登记观测项，push 后按期限核对；团队发布等真实发布事件到达，再核对 release、观测结果和是否混批上线。结论仍只用达成 / 未达成 / 未验证，并把判据偏差与有效门禁写回下一批。',
    skipWhen: '没有真实 merge / 发布，或⑨已经证明这类改动从外部不可观测时记不适用；观测窗口过期只能记未验证。',
    toolIds: ['git', 'playwright'],
    methodNote: '⑨预登记 → ⑩把跨天观测项入任务库 → ⑪到期核对；团队混批上线时先解决归因。',
    pitfall: '自持发布在部署尚未完成、用户尚未访问时立刻填写「成功、无异常」，会制造比空白更危险的假绿灯。family-finance 这轮没有 push、部署或发布回滚入口，所以⑪只能记不适用，不能拿本地 candidate 冒充上线反馈。团队发布的另一种坑是混批归因：同一 release 带了别人的改动，却把线上现象全部记到自己这批；没有版本边界或可区分观测时只能写未验证。',
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
  {
    from: 'repo-rules',
    to: 'pause',
    kind: 'exit',
    label: '规则冲突 · 暂停请裁决',
    detail: '记录冲突事实、影响和裁决人；未获决定前不擅自改仓库制度。',
  },
  {
    from: 'contract',
    to: 'blocked',
    kind: 'exit',
    label: '证据或权限不足 · 阻塞',
    detail: '缺真实数据、必要权限或可验证条件时保持未验证，交给有权限的人处理。',
  },
  {
    from: 'execute',
    to: 'split',
    kind: 'exit',
    label: '范围溢出 · 退回拆批',
    detail: '停止当前批次，把新增范围另建任务；原契约不与新范围混做。',
  },
  {
    from: 'verdict',
    to: 'cancelled',
    kind: 'exit',
    label: '任务失效 · 取消',
    detail: '记录取消依据和已产生资产，不把未交付写成完成，也不强行继续。',
  },
]
