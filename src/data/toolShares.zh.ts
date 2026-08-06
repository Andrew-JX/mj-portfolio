// 维护规则：「尚未实测」的条目数不得超过实测过的条目数（正在使用 + 试用后保留 + 试用中 + 已卸载）。
// 超过就说明这一页在退化成 awesome list。

export type ToolStatus =
  | '正在使用'
  | '试用后保留'
  | '试用中'
  | '已卸载'
  | '尚未实测'

export type ToolShare = {
  id: string
  name: string
  category: string
  status: ToolStatus
  usedIn: string
  source: string
  intrusion: string
  lastChecked: string
  summary: string
  replaces: string
  goodAt: string
  badAt: string
  boundary: string
  tags: string[]
  url?: string
}

export const toolShares: ToolShare[] = [
  {
    id: 'codex',
    name: 'Codex',
    category: 'Coding Agent',
    status: '正在使用',
    usedIn: 'ai-pm-dev、FitMind',
    source: 'ai-pm-dev、FitMind 与个人项目实际使用',
    intrusion: '随任务授权而变化',
    lastChecked: '2026-08-04',
    summary: '承担计划、实现、审查和本地验证；我会把执行与审查放在不同任务中，让结论回到真实 diff 和运行证据。',
    replaces: '大量重复的代码定位、批量修改、验证命令执行与交接整理。',
    goodAt: '适合把边界写清楚后持续推进复杂任务；最有价值的不是一次生成，而是能沿着证据反复核对。',
    badAt: '暂无实测中发现的明显短板。',
    boundary: '换一个角色名不等于真正独立；同一个任务既写实现又给自己放行，证据仍然不够独立。',
    tags: ['Plan', 'Implementation', 'Review', 'Local tools'],
    url: 'https://github.com/openai/codex',
  },
  {
    id: 'claude-code',
    name: 'Claude Code',
    category: 'Coding Agent',
    status: '正在使用',
    usedIn: 'FitMind',
    source: 'FitMind 长周期开发与多轮返工实测',
    intrusion: '随项目权限与 Hooks 配置而变化',
    lastChecked: '2026-08-04',
    summary: '更常用于长上下文实现、连续批次推进，以及接收 Reviewer finding 后逐条复现和修正。',
    replaces: '跨文件实现、长任务续接、批量文档同步与修复闭环。',
    goodAt: '长链路执行能力强，适合拿着清楚的计划持续做；当任务变长时，交接记录比“记得上下文”更可靠。',
    badAt: '暂无实测中发现的明显短板。',
    boundary: '它也会把界面、摘要或旧结论当成事实，所以关键状态仍要用 Git、数据库或真实运行结果复核。',
    tags: ['Long context', 'Execution', 'Handoff', 'Refinement'],
    url: 'https://github.com/anthropics/claude-code',
  },
  {
    id: 'playwright',
    name: 'Playwright',
    category: 'Browser Verification',
    status: '正在使用',
    usedIn: 'FitMind、本站',
    source: 'FitMind E2E 与个人网站浏览器验证',
    intrusion: 'L2 · 项目测试依赖与浏览器运行时',
    lastChecked: '2026-08-04',
    summary: '从真实浏览器路径检查页面、交互、网络请求和最终呈现，不再只凭代码判断 UI 是否正确。',
    replaces: '手工重复点击，以及“单测全绿所以用户路径应该没问题”的推断。',
    goodAt: '最有价值的是把界面事实、请求和失败 Trace 留下来；很多代码审查看不见的问题只能在真实页面出现。',
    badAt: '暂无实测中发现的明显短板。',
    boundary: '脚本本身也可能写错；关键路径需要反向验证测试确实会在功能被破坏时失败。',
    tags: ['E2E', 'Browser', 'Trace', 'Black-box'],
    url: 'https://github.com/microsoft/playwright',
  },
  {
    id: 'agentsview',
    name: 'AgentsView',
    category: 'Session Evidence',
    status: '试用后保留',
    usedIn: '本机会话归档取证',
    source: '本机会话归档取证',
    intrusion: 'L1 · 单一只读本地工具',
    lastChecked: '2026-08-04',
    summary: '搜索 Codex、Claude Code 等本地会话，区分“对话里提到过”与“Agent 真的调用过”。',
    replaces: '靠印象翻聊天、猜某个工具到底有没有实际使用。',
    goodAt: '比预期更适合做使用取证；工具调用位置、项目和会话可以一起回查，能纠正很多记忆偏差。',
    badAt: '暂无实测中发现的明显短板。',
    boundary: '只能看见 Agent 侧记录，不是系统级计数器；维护查询也会进入归档，长期统计要排除自污染。',
    tags: ['Session search', 'Evidence', 'Local', 'Read-only'],
  },
  {
    id: 'codebase-memory',
    name: 'codebase-memory',
    category: 'Code Intelligence',
    status: '试用后保留',
    usedIn: 'ai-pm-dev、FitMind',
    source: '项目内真实结构查询与归档证据',
    intrusion: 'L4 · 跨客户端配置与派生索引',
    lastChecked: '2026-08-04',
    summary: '把函数、类、路由和调用关系组织成代码图谱，适合中大型代码库的结构定位和影响分析。',
    replaces: '反复 grep 后再手工拼接调用关系与跨文件依赖。',
    goodAt: '在找入口、调用链和影响面时很省时间，尤其适合先缩小阅读范围。',
    badAt: '暂无实测中发现的明显短板。',
    boundary: '图谱是派生索引，不是事实源；模糊匹配和分类只能当提示，最终仍要回到源码确认。',
    tags: ['Knowledge graph', 'Call chain', 'Impact analysis', 'MCP'],
  },
  {
    id: 'beads',
    name: 'Beads',
    category: 'Task Graph',
    status: '试用中',
    usedIn: 'FitMind（进行中）',
    source: '正在 FitMind 真实任务中试用',
    intrusion: 'L3 · 仓库数据、规则与 Hooks',
    lastChecked: '2026-08-04',
    summary: '用依赖图和可认领任务记录跨窗口状态，目标是减少手工转述任务、阻塞关系和下一棒。',
    replaces: '散落在多个窗口里的 TODO、状态摘要和任务依赖说明。',
    goodAt: '方向和我的跨窗口痛点对得上。',
    badAt: '初始化就会增加仓库内容和协作协议，是否值得必须看真实任务能不能减少转述。',
    boundary: '它管理任务事实，不替代代码审查和独立验收；当前试验尚未收口，不能提前写成“已经好用”。',
    tags: ['Dolt', 'Dependencies', 'Task state', 'Trial'],
    url: 'https://github.com/gastownhall/beads',
  },
  {
    id: 'agent-reach',
    name: 'Agent-Reach',
    category: 'External Connector',
    status: '已卸载',
    usedIn: '装过，已移除',
    source: '本机会话归档取证',
    intrusion: 'L5 · 读取 Cookie、密钥与完整会话',
    lastChecked: '2026-08-04',
    summary: '把外部平台的检索与访问能力接进 Agent。我装了、体检了、最后卸了。',
    replaces: '设想中它替代手工去各个平台找资料；实际上这件事没有发生过一次。',
    goodAt: '安装和自检流程本身是顺的，文档也清楚。',
    badAt: '归档取证显示：84 处工具调用记录里，真正执行过的只有 doctor、home、install 和查版本这几个子命令，内容检索零次。也就是说装完之后，我从来没用它干过活。',
    boundary: '这条判断只覆盖 Agent 侧的调用记录，我自己在终端手敲的命令不在统计内。结论是「我没用起来」，不是「它不好用」。',
    tags: ['Connector', 'Uninstalled', 'Usage evidence'],
  },
  {
    id: 'multica',
    name: 'Multica',
    category: 'Multi-Agent Orchestration',
    status: '尚未实测',
    usedIn: '未实测',
    source: '官方资料',
    intrusion: 'L4 · 平台、daemon 与服务端',
    lastChecked: '2026-08-04',
    summary: '把多个 Coding Agent 作为可派工、可追踪状态的团队成员统一管理。',
    replaces: '尚未实测',
    goodAt: '尚未实测',
    badAt: '尚未实测',
    boundary: '它与我现有的多窗口协作方式接近，但平台、daemon、服务端和许可条件都比当前需求更重。',
    tags: ['Multi-agent', 'Orchestration', 'Unverified'],
    url: 'https://github.com/multica-ai/multica',
  },
  {
    id: 'deerflow',
    name: 'DeerFlow',
    category: 'Agent Runtime',
    status: '尚未实测',
    usedIn: '未实测',
    source: '官方资料',
    intrusion: 'L4 · Skills、Memory 与 Sandbox 运行时',
    lastChecked: '2026-08-04',
    summary: '带子 Agent、Skills、Memory 与 Sandbox 的长任务 SuperAgent harness。',
    replaces: '尚未实测',
    goodAt: '尚未实测',
    badAt: '尚未实测',
    boundary: '更适合作为未来科研证据工作台的 Agent runtime 参考，不准备用它替代日常开发流程。',
    tags: ['Agent runtime', 'Sandbox', 'Unverified'],
    url: 'https://github.com/bytedance/deer-flow',
  },
  {
    id: 'spec-kit',
    name: 'GitHub Spec Kit',
    category: 'Specification Workflow',
    status: '尚未实测',
    usedIn: '未实测',
    source: '官方资料',
    intrusion: 'L2 · 仓库规格与任务文件',
    lastChecked: '2026-08-04',
    summary: '把规格、计划、任务、实现固定成四份文件，让写下来的规格而不是聊天记录做事实源。尚未实测。',
    replaces: '尚未实测',
    goodAt: '尚未实测',
    badAt: '尚未实测',
    boundary: '我现在已经有任务契约和仓库规则两层，接它可能变成第三套重叠的东西。',
    tags: ['Specification', 'Workflow', 'Unverified'],
    url: 'https://github.com/github/spec-kit',
  },
  {
    id: 'stryker',
    name: 'StrykerJS',
    category: 'Mutation Testing',
    status: '尚未实测',
    usedIn: '未实测',
    source: '官方资料',
    intrusion: 'L3 · 测试运行时与源码变异',
    lastChecked: '2026-08-04',
    summary: '变异测试——故意改坏源码，看测试会不会变红，用来判断测试是不是真的在断言。尚未实测。',
    replaces: '尚未实测',
    goodAt: '尚未实测',
    badAt: '尚未实测',
    boundary: '打算等 FitMind 的 CI 立起来之后再试。',
    tags: ['Mutation testing', 'Test quality', 'Unverified'],
    url: 'https://github.com/stryker-mutator/stryker-js',
  },
]

export const toolPrinciples = [
  'Star 衡量传播力，不衡量留存率。',
  '装之前先问：它会修改哪些配置、读取哪些数据。',
  '区分工具和自动路由器：留下能力，谨慎对待强制触发。',
  '三十分钟真实任务，通常比一小时 README 更能说明问题。',
  '派生索引不能成为事实的权威来源，关键结论要回到原始证据。',
  '结论必须带适用范围，否则转述几次后就会变成错误规则。',
] as const
