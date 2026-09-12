import { engineeringSkills } from '@/data/deliveryFlowV2.zh'
import {
  type ToolKind,
  type ToolShare,
} from '@/data/toolShares.zh'

type ToolShareWithRoutes = ToolShare & {
  routes?: readonly string[]
}

export const toolKindOrderV2: ToolKind[] = ['tool', 'skill']

export const toolKindLabelsV2: Partial<Record<ToolKind, { title: string; description: string }>> = {
  tool: { title: '工具', description: '第三方工具、框架与基础设施。' },
  skill: { title: 'Skill', description: '可安装的执行规则；自建与第三方按作者归属区分。' },
}

export const lastCheckedV2 = '2026-09-09'

const baseToolShares: ToolShare[] = [
  {
    id: 'acceptance-author',
    name: 'Acceptance Author',
    kind: 'skill',
    origin: 'self',
    categoryId: 'specification-workflow',
    status: '在用',
    usedIn: 'family-finance 真实批次（1B、2A、2B）',
    source: 'AgentsView 历史归档中的 SKILL.md 读取、紧随动作、冻结合同与提交锚点',
    intrusion: 'L1 · 本地 Markdown 指令',
    summary: '在实现前攻击验收判据的假绿灯，并用 contract、baseline、candidate 三个 SHA 防止判据随实现漂移。',
    replaces: '靠规划者写完判据后凭感觉通读一遍。',
    goodAt: '已在三个真实批次把限定词来源、度量口径、文件范围和人工验收者写进冻结合同；2A 后续被审查退回六轮，判据仍没有跟着实现改写。',
    badAt: '合同能保持尺子不漂，不代表尺子天然正确；清单仍可能被机械填写，也不能替代最终验收者的业务判断。',
    boundary: '它只能起草和反证判据；判据是否冻结仍由用户决定，执行方不得自行改写。',
    tags: ['Self-built', 'Acceptance', 'False green', 'Contract SHA'],
    installNote: '源码在独立仓库维护：https://github.com/Andrew-JX/tooluse',
  },
  {
    id: 'evidence-bound-executor',
    name: 'Evidence-Bound Executor',
    kind: 'skill',
    origin: 'self',
    categoryId: 'specification-workflow',
    status: '在用',
    usedIn: 'family-finance 真实批次（1B、2A、2B）',
    source: 'AgentsView 历史归档中的 SKILL.md 读取、候选实现、逐轮修复与三锚点交接',
    intrusion: 'L1 · 本地 Markdown 指令',
    summary: '约束执行方不动冻结判据，用可穷举、可脱敏、可独立复核的证据交接候选实现。',
    replaces: '执行方用完成摘要解释自己做了什么。',
    goodAt: '已在三个真实批次钉住冻结合同、候选 SHA、上一轮遗留和逐项证据；2B 首候选被退回后，执行方没有改合同，而是修复并交出新的 candidate。',
    badAt: '证据化交接不会自动让实现正确：1B、2A、2B 分别经历 1、6、1 轮审查退回；它也不能靠角色名制造独立性。',
    boundary: '负向验证只在隔离、无生产凭据环境按风险执行；未获提交授权时不得自行制造 candidate SHA。',
    tags: ['Self-built', 'Execution', 'Evidence', 'Handoff'],
    installNote: '源码在独立仓库维护：https://github.com/Andrew-JX/tooluse',
  },
  {
    id: 'evidence-led-reviewer',
    name: 'Evidence-Led Reviewer',
    kind: 'skill',
    origin: 'self',
    categoryId: 'specification-workflow',
    status: '在用',
    usedIn: 'family-finance 真实批次（1B、2A、2B）',
    source: 'AgentsView 历史归档中的 SKILL.md 与必需参考读取、独立复现、findings 和最终复核',
    intrusion: 'L1 · Markdown 指令、审查参考与跨工具 prompt',
    summary: '从固定候选提交重建事实，区分正式审查与浮动工作区预审，并按影响而不是语气给 finding 定级。',
    replaces: '把执行方报告、测试名或旧命令输出直接当成审查事实。',
    goodAt: '已从固定三锚点独立重建 1B、2A、2B 的事实；2B 复现了“浏览器断言全过，但根命令退出 1 且资源未归零”，因此没有把断言绿误写成整门通过。',
    badAt: '正式审查需要冻结 candidate 和独立事实源；角色名、prompt 或同一窗口里的第二遍检查都不是权限边界，也不能冒充独立。',
    boundary: '浮动工作区只能给 ADVISORY；契约错误直接回到重新冻结，不把流程失效硬套成产品 P1。',
    tags: ['Self-built', 'Review', 'Severity', 'Advisory'],
    installNote: '源码在独立仓库维护：https://github.com/Andrew-JX/tooluse',
  },
  {
    id: 'scope-bound-editor',
    name: 'Scope-Bound Editor',
    kind: 'skill',
    origin: 'self',
    categoryId: 'specification-workflow',
    status: '在用',
    usedIn: '当前随 tooluse 一起安装；可脱离三件套单独调用',
    source: '自建；源码在 tooluse 仓库，README「怎么用」把它列为单独使用的一项',
    intrusion: 'L1 · 单个 Skill 目录，命中时才加载',
    summary: '把已经越界的 diff 收回请求点名的那个面：产物只写最终状态，一个事实一个家，行为变了就去扫抄写点。',
    replaces: '顺手重构、把被否掉的方案留在注释和提交信息里，以及改完行为忘了同步 --help、文案和文档。',
    goodAt: '它管的是"改动别溢出"和"别留过程残留"这两件事，不要求冻结提交，也不要求独立复核——所以日常改动就能用，不用为它开三件套。',
    badAt: '**没有可引用的真实调用记录。** 它在包里、能单独调用，不等于已经在真实的越界场景里被验证过。和三件套的战绩不是一回事，别混着读。',
    boundary: '只收缩范围和清理残留，不判断留下来的实现是否正确。它也不改变授权：范围收回来了，提交、push 和部署仍要单独获得批准。',
    tags: ['Self-built', 'Scope', 'Final-state', 'Cleanup'],
    installNote: '源码在独立仓库维护：https://github.com/Andrew-JX/tooluse',
  },
  {
    id: 'grill-me',
    name: 'grill-me',
    kind: 'tool',
    origin: 'third-party',
    categoryId: 'specification-workflow',
    status: '在用',
    usedIn: '需求澄清；按需主动调用',
    source: '实际需求澄清调用；mattpocock/skills 仓库与相关说明',
    intrusion: 'L1 · 单个 Skill 目录，用户主动调用才加载',
    summary: '拿一个还很松的想法，一轮轮追问，直到它变成一组真正能落地的决定。',
    replaces: '需求还模糊就开工，做到一半才发现关键决定根本没定。',
    goodAt: '一次只问一个短而具体的问题，优先问能消掉歧义、能逼出隐藏决定的那个。按「前沿」分轮——只问前置条件已经确定的问题，不会问一个依赖你还没回答的东西。设计成只在主动调用时才加载，平时不占上下文。',
    badAt: '需求本来就清楚时它是纯开销；「一次一问」在你已经想好答案时嫌慢。',
    boundary: '它只澄清需求，不产出实现，也不保证澄清出来的需求是对的。注意别和 Superpowers 记混：那套的 brainstorm 阶段也是连续追问澄清需求，本站两个批次走的都是它。grill-me 的差异在更轻、按需调用、不绑后面的 plan 与 TDD 流程。',
    tags: ['Requirements', 'Interview', 'Pre-implementation'],
    repoUrl: 'https://github.com/mattpocock/skills',
    installNote: 'skills/productivity/grill-me/；它只是转发壳，必须同时安装 grilling 才会真正工作。',
  },
  {
    id: 'project-doc-system',
    name: 'Project Doc System',
    kind: 'skill',
    origin: 'self',
    categoryId: 'specification-workflow',
    status: '在用',
    usedIn: '隔离临时项目跑通脚手架；对两个真实项目做过只读探测',
    source: '自建；源码在 tooluse 仓库',
    intrusion: 'L2 · 在目标仓库建文档骨架与索引文件',
    summary: '从零建文档骨架，按触发条件生长，用路由式索引控住上下文成本，门禁配负向控制。',
    replaces: '文档一次性写完然后烂掉；或者不写文档，全靠翻代码和记忆。',
    goodAt: '脚手架、索引门禁与负向控制已在隔离临时项目跑通。路由式索引这个思路本身是对的——同期在个人知识库上独立验证过：八章正文切成 63 片加 8 个路由页，路由页合计 1.7 万字符，比全文读进去省一个数量级。',
    badAt: '**没有任何真实项目按它建起过文档体系**。跑通脚手架和「文档体系活下来了」是两件事，后者需要几个月和多次需求变更才能验证，目前一次都没有。只读探测也只证明它不炸，不证明它有用。',
    boundary: '触发前提要先满足：用户主导的长期项目，且确实需要文档路由、索引、负向门禁或跨窗口交接——前提不成立就别建，不要为了接流程人造一套文档。它只管文档结构与索引，不管文档内容对不对；索引门禁挡的是「新增文件没登记」，挡不住「登记了但写错了」。',
    tags: ['Self-built', 'Docs', 'Index', 'Context-cost'],
    installNote: '源码在独立仓库维护：https://github.com/Andrew-JX/tooluse',
  },
]

const toolById = new Map(baseToolShares.map((tool) => [tool.id, tool]))

function takeTool(id: string, overrides: Partial<ToolShare> = {}): ToolShare {
  const tool = toolById.get(id)
  if (!tool) throw new Error(`Missing v2 tool share: ${id}`)
  return { ...tool, ...overrides }
}

const mattEngineeringSkills: ToolShareWithRoutes = {
  id: 'matt-engineering-skills',
  name: 'Matt Pocock Engineering Skills',
  kind: 'skill',
  origin: 'third-party',
  categoryId: 'specification-workflow',
  status: '在用',
  usedIn: '需求澄清、领域梳理、TDD、代码审查与疑难诊断这五格指向上游，本站不重复造',
  source: 'mattpocock/skills 上游 README，以及 tooluse README 里的依赖与前提说明',
  intrusion: 'L1 · 五个按任务命中的本地 Skill',
  summary: '把问清需求、梳理领域、测试先行、代码审查和疑难诊断拆成五个可按需加载的工程入口。',
  replaces: '为这些工程基本功在每个项目里各写一套临时提示词。',
  goodAt: '入口按问题类型拆开，明确的小改动可以直接实现，复杂任务再只加载命中的那一个，不必接管整条交付流程。',
  badAt: '**这条记的是入口和依赖关系，不是使用效果。** 「能发现、已安装」和「在正确的时刻真的被触发」是两件事，后者目前没有可引用的记录。前提也不是都满足：code-review 依赖固定基线和来源 spec，domain-modeling 会维护项目文档，前提不成立时不要硬接。',
  boundary: '它们提供工程手艺，不替代 tooluse 的冻结判据、影响判断和证据交接；这里只记录入口，不复制五个 Skill 的正文。implement 含提交步骤，但它的正文不能代替当前任务里用户对提交的明确授权。',
  tags: ['Engineering', 'Requirements', 'TDD', 'Review', 'Diagnosis'],
  repoUrl: engineeringSkills.repoUrl,
  installNote:
    '按上游 Installation 选一种安装方式，不要同时装两份；主 Skill 要连配套一起装：grill-me 与 grill-with-docs 是转发壳，必须同装 grilling，grill-with-docs 另需 domain-modeling；code-review 依赖 setup-matt-pocock-skills 登记 issue tracker；tdd 在接口边界会调用 codebase-design。',
  routes: engineeringSkills.skills,
}

export const toolSharesV2: ToolShareWithRoutes[] = [
  takeTool('acceptance-author'),
  takeTool('evidence-bound-executor'),
  takeTool('evidence-led-reviewer'),
  takeTool('scope-bound-editor'),
  takeTool('project-doc-system'),
  takeTool('grill-me', { kind: 'skill' }),
  mattEngineeringSkills,
]
