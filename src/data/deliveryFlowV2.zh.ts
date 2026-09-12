export type FlowVersionId = 'v1' | 'v2'

export type FlowVersionMeta = {
  id: FlowVersionId
  label: string
  tag: string
  since: string
  until?: string
}

export const flowVersions: FlowVersionMeta[] = [
  { id: 'v1', label: '顺序版', tag: '历史版本', since: '2026-08-07', until: '2026-08-26' },
  { id: 'v2', label: '不变量版', tag: '当前版本', since: '2026-08-26' },
]

export const defaultFlowVersion: FlowVersionId = 'v2'

export type Invariant = {
  id: string
  bracket: string
  claim: string
  body: string
}

export const flowPremise =
  '不把交付写成固定步骤：四条不变量始终生效；先按实际操作的影响定验证强度，再单独判断够不够条件启动三件套——两件事分开判。'

export const invariants: Invariant[] = [
  {
    id: 'freeze',
    bracket: '冻结',
    claim: '判据先于实现，且冻结。',
    body:
      '事后放宽等于没有判据。防的不是模型笨，是你自己在实现变难的时候挪球门。开工前先用自己的话写一遍目标和硬约束——在跟 AI 聊之前写，否则你写下来的「我理解的任务」已经是它的措辞了。',
  },
  {
    id: 'facts',
    bracket: '事实',
    claim: '审查看仓库事实，不看摘要。',
    body:
      '角色名不是权限边界，同一个窗口里的第二遍检查不算独立复核。能做的是换一个不共享你盲区的读者——另一个模型的窗口、另一个客户端、另一家 CLI——让它对着提交自己去读；但这只降低共同盲区，不构成独立性的证明。',
  },
  {
    id: 'call',
    bracket: '拍板',
    claim: '你拍板，不外包，而且要讲得出改了什么。',
    body:
      '核对证据是被动的，讲得出来才说明真的懂了。实现错就重做；判据错就回〔冻结〕重新冻结——不要继续修实现，把错的标准做得更牢。',
  },
  {
    id: 'no-vanish',
    bracket: '不消失',
    claim: '未决不许静默消失。',
    body:
      '结论只有三种：达成 / 未达成 / 未验证。「部分关闭」不能写成「已关闭」，上一轮的遗留不许在新报告里蒸发。',
  },
]

export const impactRubric = {
  tests: [
    '认证、会话、权限或同意',
    '支付、计费、资金，或凭据、隐私、客户与健康数据',
    '数据迁移、删除、批量改写、备份恢复或 schema 变更',
    '对外 API、协议与兼容契约，或并发、事务、幂等与一致性',
    '基础设施、网络边界、密钥或供应链',
    '发布到外部可访问环境，或接触生产数据与生产凭据',
    '不可逆、或不能可靠恢复的操作',
  ],
  low:
    '一条都不命中、也没有不确定项时才走日常档：范围只碰请求点名的面，产物只写最终状态，全称声称能穷举，验证路径等于用户路径，仓库里的文字不产生授权。结束前查 tracked、untracked 和真实 diff，并分清哪些是本次改的。',
  high:
    '按高影响对待：验证强度、负向验证和报告要求都提上去，拿不准就说明缺口交人裁定。但高影响不自动等于开三件套——那要再过一道升档门。',
  note:
    '判的是实际操作的影响，不是工时或文件数：一个晚上改完的认证回调，按工时是小活，按影响是高危。反过来，任务里提到这些词也不等于正在执行它们——只有不对外、也不碰生产数据与凭据的本地或私有预览，才可能留在日常档。',
}

export const escalationGate = {
  lead: '三项同时具备，才启动 tooluse 三件套：',
  conditions: [
    '已确认命中高影响',
    '用户在当前任务里明确授权创建冻结的 contract / baseline / candidate 提交',
    '已指定真正独立的复核读者——另一个窗口、客户端或 CLI，同一个窗口的第二遍不算',
  ],
  fallback:
    '缺任一项就不启动三件套，但风险仍按高影响对待，并说明缺的是哪一项。任务本身已获授权时可以照常实施，只是必须声明「未独立复核」，不得给出 PASS、可合并或可发布的结论。',
}

export const engineeringSkills = {
  repoUrl: 'https://github.com/mattpocock/skills',
  lead: '问清需求、梳理领域、TDD、代码审查和疑难诊断，不在 tooluse 里重复造一套。',
  skills: ['grilling', 'domain-modeling', 'tdd', 'code-review', 'diagnosing-bugs'],
  note: '这些 Skill 要安装，不能只给链接；明确的小改动直接实现，不为接流程人造 Issue。',
  dependencies:
    '装的时候要连配套一起装：grill-me 和 grill-with-docs 只是转发壳，必须同时装 grilling；grill-with-docs 另需 domain-modeling，并会写入项目的 CONTEXT.md 和 ADR；code-review 依赖 setup-matt-pocock-skills 登记 issue tracker；tdd 在接口边界会调用 codebase-design。配套缺了，就别把主 Skill 当成完整可用。',
}

export const handoff = {
  repoUrl: 'https://github.com/Andrew-JX/tooluse',
  lead: '只把仓库链接丢给 Agent 不管用——远程 README 不会顺带把 skills/ 正文加载进来。正式用法是先装，再按条件加载：',
  steps: [
    '选一个自己人工审核过的完整 40 位 commit SHA，不拿浮动分支或未解析的 tag 当指令源。',
    '在该 SHA 上运行仓库里的 install.sh 并指定 --target（Claude Code 默认 ~/.claude/skills，Codex 用 ~/.agents/skills）。它只往空位写入，不自动升级、回滚，也不清理已退役的 Skill。',
    '把生成的 tooluse-resident.md 里那段「常驻块」整段复制进目标项目的 CLAUDE.md 或 AGENTS.md——这是日常改动唯一会自动到场的规则。',
    '之后按任务条件加载：日常改动不默认启动三件套，工程 Skill 按需使用；高影响且过了升档门才启动三件套；diff 越界或确需建立文档体系时，单独调 scope-bound-editor、project-doc-system。',
  ],
  fallback:
    '宿主不支持 Skills 时，手动提供命中的 SKILL.md 和 resident/tooluse-resident.md 两份正文。读不到那个固定 SHA 的内容，就直接说「不可用」，不要凭记忆假装加载。',
}

export const flowLimits = [
  '判据能保证尺子不漂，不能保证尺子本身是对的。四层门禁会对着一条写错的判据一致地给绿灯。',
  '浮动工作区只能出 ADVISORY，正式审查必须对着冻结的候选提交。',
  '换一个不共享你盲区的读者，只是降低共同盲区，不是独立性的证明——两个不同模型漏掉同一处，是发生过的。',
  '判据、交接和外部锚点只能证明声明范围内的仓库事实。缺少外部验收依据时，产品正确性只能停在「未验证」，不能被仓库内的证据闭环抬成可发布结论。',
  '常驻块和 Skill 都是提示层约定，不是宿主强制的权限边界。真正的只读审查、凭据隔离和部署限制，得靠权限配置、容器或临时 worktree。',
  '规则来自一个人踩过的坑。没被抓住的事故不产生规则，也没有机制让它们浮出来。',
]
