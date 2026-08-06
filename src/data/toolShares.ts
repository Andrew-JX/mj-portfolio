export type ToolShare = {
  name: string
  category: string
  status: '长期使用' | '保留' | '试用中'
  source: string
  intrusion: string
  summary: string
  replaces: string
  impression: string
  boundary: string
  tags: string[]
  url?: string
}

export type ToolWatchItem = {
  name: string
  status: '研究中' | '待实测'
  summary: string
  whyWatching: string
  url: string
}

export const toolShares: ToolShare[] = [
  {
    name: 'Codex',
    category: 'Coding Agent',
    status: '长期使用',
    source: 'ai-pm-dev、FitMind 与个人项目实际使用',
    intrusion: '随任务授权而变化',
    summary: '承担计划、实现、审查和本地验证；我会把执行与审查放在不同任务中，让结论回到真实 diff 和运行证据。',
    replaces: '大量重复的代码定位、批量修改、验证命令执行与交接整理。',
    impression: '适合把边界写清楚后持续推进复杂任务；最有价值的不是一次生成，而是能沿着证据反复核对。',
    boundary: '换一个角色名不等于真正独立；同一个任务既写实现又给自己放行，证据仍然不够独立。',
    tags: ['Plan', 'Implementation', 'Review', 'Local tools'],
    url: 'https://github.com/openai/codex',
  },
  {
    name: 'Claude Code',
    category: 'Coding Agent',
    status: '长期使用',
    source: 'FitMind 长周期开发与多轮返工实测',
    intrusion: '随项目权限与 Hooks 配置而变化',
    summary: '更常用于长上下文实现、连续批次推进，以及接收 Reviewer finding 后逐条复现和修正。',
    replaces: '跨文件实现、长任务续接、批量文档同步与修复闭环。',
    impression: '长链路执行能力强，适合拿着清楚的计划持续做；当任务变长时，交接记录比“记得上下文”更可靠。',
    boundary: '它也会把界面、摘要或旧结论当成事实，所以关键状态仍要用 Git、数据库或真实运行结果复核。',
    tags: ['Long context', 'Execution', 'Handoff', 'Refinement'],
    url: 'https://github.com/anthropics/claude-code',
  },
  {
    name: 'AgentsView',
    category: 'Session Evidence',
    status: '保留',
    source: '本机会话归档取证',
    intrusion: 'L1 · 单一只读本地工具',
    summary: '搜索 Codex、Claude Code 等本地会话，区分“对话里提到过”与“Agent 真的调用过”。',
    replaces: '靠印象翻聊天、猜某个工具到底有没有实际使用。',
    impression: '比预期更适合做使用取证；工具调用位置、项目和会话可以一起回查，能纠正很多记忆偏差。',
    boundary: '只能看见 Agent 侧记录，不是系统级计数器；维护查询也会进入归档，长期统计要排除自污染。',
    tags: ['Session search', 'Evidence', 'Local', 'Read-only'],
  },
  {
    name: 'codebase-memory',
    category: 'Code Intelligence',
    status: '保留',
    source: '项目内真实结构查询与归档证据',
    intrusion: 'L4 · 跨客户端配置与派生索引',
    summary: '把函数、类、路由和调用关系组织成代码图谱，适合中大型代码库的结构定位和影响分析。',
    replaces: '反复 grep 后再手工拼接调用关系与跨文件依赖。',
    impression: '在找入口、调用链和影响面时很省时间，尤其适合先缩小阅读范围。',
    boundary: '图谱是派生索引，不是事实源；模糊匹配和分类只能当提示，最终仍要回到源码确认。',
    tags: ['Knowledge graph', 'Call chain', 'Impact analysis', 'MCP'],
  },
  {
    name: 'Playwright',
    category: 'Browser Verification',
    status: '长期使用',
    source: 'FitMind E2E 与个人网站浏览器验证',
    intrusion: 'L2 · 项目测试依赖与浏览器运行时',
    summary: '从真实浏览器路径检查页面、交互、网络请求和最终呈现，不再只凭代码判断 UI 是否正确。',
    replaces: '手工重复点击，以及“单测全绿所以用户路径应该没问题”的推断。',
    impression: '最有价值的是把界面事实、请求和失败 Trace 留下来；很多代码审查看不见的问题只能在真实页面出现。',
    boundary: '脚本本身也可能写错；关键路径需要反向验证测试确实会在功能被破坏时失败。',
    tags: ['E2E', 'Browser', 'Trace', 'Black-box'],
    url: 'https://github.com/microsoft/playwright',
  },
  {
    name: 'Beads',
    category: 'Task Graph',
    status: '试用中',
    source: '正在 FitMind 真实任务中试用',
    intrusion: 'L3 · 仓库数据、规则与 Hooks',
    summary: '用依赖图和可认领任务记录跨窗口状态，目标是减少手工转述任务、阻塞关系和下一棒。',
    replaces: '散落在多个窗口里的 TODO、状态摘要和任务依赖说明。',
    impression: '方向和我的跨窗口痛点对得上，但初始化就会增加仓库内容和协作协议，是否值得必须看真实任务能不能减少转述。',
    boundary: '它管理任务事实，不替代代码审查和独立验收；当前试验尚未收口，不能提前写成“已经好用”。',
    tags: ['Dolt', 'Dependencies', 'Task state', 'Trial'],
    url: 'https://github.com/gastownhall/beads',
  },
]

export const toolWatchlist: ToolWatchItem[] = [
  {
    name: 'Multica',
    status: '待实测',
    summary: '把多个 Coding Agent 作为可派工、可追踪状态的团队成员统一管理。',
    whyWatching: '它与我现有的多窗口协作方式接近，但平台、daemon、服务端和许可条件都比当前需求更重。',
    url: 'https://github.com/multica-ai/multica',
  },
  {
    name: 'DeerFlow',
    status: '研究中',
    summary: '带子 Agent、Skills、Memory 与 Sandbox 的长任务 SuperAgent harness。',
    whyWatching: '更适合作为未来科研证据工作台的 Agent runtime 参考，不准备用它替代日常开发流程。',
    url: 'https://github.com/bytedance/deer-flow',
  },
  {
    name: 'Promptfoo',
    status: '待实测',
    summary: '面向 Prompt、Agent 与 RAG 的自动评测、模型对比和红队测试工具。',
    whyWatching: '未来做生命科学 RAG/Agent 时可能用于回归与安全评测；当前还没有真实数据集，所以不先装。',
    url: 'https://github.com/promptfoo/promptfoo',
  },
]

export const toolSignals = [
  { signal: '反复搜索调用关系', capability: '代码结构查询', current: 'codebase-memory', avoid: '先自建另一套索引' },
  { signal: '改完 UI 只能读代码判断', capability: '浏览器事实', current: 'Playwright / Browser', avoid: '只靠 code review' },
  { signal: '不确定工具到底用没用过', capability: '使用取证', current: 'AgentsView', avoid: '凭印象判断' },
  { signal: '跨窗口任务状态反复丢失', capability: '任务图', current: '短契约 + Git；Beads 试用中', avoid: '先增加全套自动路由与强制钩子' },
  { signal: 'Golden answer 可能写错', capability: 'AI 输出回归', current: '保留真实案例；Promptfoo 待实测', avoid: '让同一份脚本自证正确' },
] as const

export const toolPrinciples = [
  'Star 衡量传播力，不衡量留存率。',
  '装之前先问：它会修改哪些配置、读取哪些数据。',
  '区分工具和自动路由器：留下能力，谨慎对待强制触发。',
  '三十分钟真实任务，通常比一小时 README 更能说明问题。',
  '派生索引不能成为事实的权威来源，关键结论要回到原始证据。',
  '结论必须带适用范围，否则转述几次后就会变成错误规则。',
] as const
