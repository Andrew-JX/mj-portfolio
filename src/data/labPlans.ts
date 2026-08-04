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

const tooluseDesignDocument = String.raw`E:\tooluse 设计说明
本文档汇总 2026-08-03 讨论的全部有效结论。包含动机、被推翻的方案、实测结果、结构设计和未来分期。尚未落盘任何文件。

一、一句话
一份决策表：任何新项目或新任务开工时，我或那个窗口据此判断该不该加工具，以及不该加什么。

不是工具评价列表，不是 Awesome List，不是安装脚本。

二、动机（三条，第三条是主干）
#	动机	真实来源
1	想装新东西时，先查「我评过没有」	星标点了很多，很多自己都没用过；有些装了不知道有没有在用
2	自己复盘 / 分享给别人时的判断力参考	明确不是求职用途
3	开任何项目或接任何活时，能自己判断、或丢给那个窗口判断该配什么	讨论后期才浮出，是真正的主干
第 1、2 条是查询，第 3 条是决策。主干是第 3 条——这决定了整份文档的主键。

三、一次关键修正：主键搞错过一次
第一版设计按「保留 / 卸载 / 未评估」组织，主键是工具名。

这是错的。 那个形态只能回答「X 好不好」，回答不了「我现在该加什么」。开工的人手上没有工具名，手上只有现象。

正确主键是「你观察到什么信号」。 工具评价降级成附录证据。

这次修正是整个讨论最重要的产出，比任何一条工具结论都重要。

四、它不是什么（明确排除，附理由）
不做	理由
可执行安装脚本	你明确说不要；判断成本 ≫ 安装成本
目录树（toolbox/tested/retired/…）	条目 <50 时目录结构是纯负担，Ctrl+F 才是真实访问方式
数据库 / Notion / 网站	同上，条目量不够
收录项目依赖库的用法和版本	权威记录在各项目 package.json，再抄一份就是 frontend-current-state.md 的病
自动触发的 skill 路由	Agent-Reach 的 MUST USE when 调研/搜索/查/找 是你已付过学费的反面教材
复述已有笔记内容	dify/langgraph/hermes 在 1.6.5/1.6.6/1.6.8 已有专篇
五、结构
E:\tooluse\
├─ TOOLS.md         # 主体
└─ NEW-PROJECT.md   # 开新项目的固定动作，引用 TOOLS.md
TOOLS.md 四段
① 给新窗口的使用规则（放最前，因为要被丢给别的窗口读）

1. 默认盘之外，不主动加任何东西
2. 只有观察到「信号」列的现象，才考虑加
3. 加之前查附录；查不到 = 真没评过，按末尾流程评一次再决定
4. 「别用」列是有实测代价的，不要重新发明
② 主表：信号 → 能力 → 候选

信号	能力	现在就有	未评候选	别用
反复 grep 找调用关系	代码结构查询	codebase-memory ✅	—	自建索引
门禁只能本地手跑，忘了就漏	自动门禁	GitHub Actions	lefthook	—
改完 UI 靠读代码判断对错	渲染事实	Browser pane / computed style 断言	—	只靠 code review
单测全绿但真人一用就有 bug	真人验收	真机跑完整任务	—	加更多单测
golden answer 可能本身写错了	提示词回归	—	promptfoo	自写脚本当基线
跨窗口任务状态丢了	任务图	短 contract + git branch	beads	多角色 runtime / ledger
想不起某决定当初为什么那么定	决定记忆	DECISIONS.md（还没有）	—	靠 commit message
要查小红书/Twitter/Reddit	外部平台连接	WebSearch / WebFetch	—	Agent-Reach
装了含 .py/.js/.sh 的第三方 skill	供应链检查	人读 SKILL.md	SkillSpector（仅此场景）	常驻扫描 / 分数当门禁
不确定某工具到底用没用过	使用取证	agentsview session search	—	凭印象
忘了三个月前某结论	会话检索	AgentsView	—	翻聊天
③ 按项目类型的额外候选（前端库在这里归位，不是被排除）

前端：GSAP(重) / anime.js(轻) / react-bits / mapbox-gl-js —— 均未评
AI 应用：dify / n8n / langgraph —— 见笔记 1.6.5、1.6.6，此处不重述
参考实现：GenAI_Agents / 500-AI-Agents-Projects / hermes-agent
④ 附录：已评工具的实测详情

字段（其中两个是这次讨论逼出来的）：

判定：
判断来源：       ← 新增。本机实测 / 归档证据 / 我的推荐 / README声称
侵入性：         L0~L5
它替代了什么劳动：
实测发现（README 没说的）：
失效的是：       ← 新增
仍然成立的是：   ← 新增
失效条件：
新增两个字段的原因写在第八节。

收录标准（一句话）
会改变我和 Agent 协作方式的东西才收。

GSAP 不会（它改变的是产物），beads 会。项目类型分节是例外，那里只记「选型时想起有这些」。

六、技术结果：AgentsView 验证（已完成）
目的：验证「我装了但不知道有没有真在用」能不能变成一次查询。

结论：能，且比预期准。

agentsview session search <pattern> --in tool_input 的 LOCATION 列带匹配位置的工具名，所以「提到过」和「真调用过」可分。

Agent-Reach 取证结果——归档中 84 处 tool_input 命中，实际执行的子命令穷举：

3  agent-reach doctor
2  agent-reach home
1  agent-reach install
1  agent-reach i
1  agent-reach --version
零次内容检索。 装了、体检了、卸了，中间没有一次拿它干过活。

对照组 codebase-memory 能正常查到原生调用（tool_input:mcp__codebase-memory-mcp__search_graph 等），机制方向正确。

归档规模：278 会话；28 天窗口内 122 个会话、12,684 条消息；覆盖 claude + codex。

三条限制（必须写进附录）：

只看得见 Agent 跑的命令，你自己终端手敲的不在内 → 「零调用」严格说是「Agent 侧零调用」
不是计数器，每个工具要自己构造查询词，且 --limit 上限 500，所有数字都是下界
自污染，查询行为本身会进归档，/toolbox 用久了要排除自己的维护会话
其他可用能力（未验证）：agentsview mcp（只读 MCP，暴露 search_sessions / search_content / get_usage_summary / query_recall）、recall、embeddings 语义索引、secrets scan。

七、实测：本机安装面比预想小一个数量级
用户级 skill：2 个（codebase-memory、find-skills）
marketplace： 1 个（anthropics 官方）
hook：        2 个（cbm-session-reminder、cbm-subagent-reminder）
第三方 MCP：  1 个（codebase-memory）
settings.json：env 空、theme dark，无其他自定义
「装了一堆 skill 不知道在不在用」在本机层面基本不成立。 上下文里那一长串 skill（docx/pptx/simplify/security-review/dataviz…）全部来自官方 marketplace 和内置。

真正的未评估池是 GitHub 星标——是没装的那堆，不是装了的那堆。

八、两次表述精度事故（值得留档，因为它们改了字段设计）
事故 1：把「不适合常驻」压缩成「被推翻」。

我上一轮说 2.3 §11:375-376 两行「已被实测推翻」。核对后：

引文本身准确（原文一致）
Agent-Reach 那格：产品名失效，但右列有「或成熟 connector/MCP」兜底，左列能力项没失效 → 只失效一半
SkillSpector 那格：没被推翻。实测结论是「不该常驻」，而 §11 从没规定用法
更关键：§11:381 原文写着「这里的产品名只是可选实现，不是新的依赖清单」——文档自己已经免疫
→ 逼出字段 「失效的是」/「仍然成立的是」，防止下次把「某用法不行」读成「这类能力不需要」。

事故 2：把带我一票的判断写成纯客观实测。

Agent-Reach 在 2026-08-01 记录里是「❌ 卸载」，读起来像纯实测结论。实际链条是：你装了用了 → 我说没用 → 你删了。

→ 逼出字段 「判断来源」。

（后续归档取证证明我的推荐和使用数据一致，但证据是数据，不是我的判断——这个区分本身就是该记的东西。）

九、18 个星标仓库的分类结果
只有 5 个属于 agent 工具账本：

类	仓库	去向
A 未评候选	beads、superpowers、taste-skill、ui-ux-pro-max-skill、multica	主表未评列
B 已判定	codebase-memory-mcp（保留）、deer-flow / langgraph（不因汇总而装）	附录
C 平台	n8n、dify	笔记 1.6.6，不进账本
D 资料	GenAI_Agents、500-AI-Agents-Projects、hermes-agent	项目类型分节
E 前端库	react-bits、anime、GSAP、mapbox-gl-js	项目类型分节
F 其他	Deep-Live-Cam	不收
18 个里只有 5 个合格——这个比例本身就说明星标池不能全量倒进来。

十、未来分期
阶段 1（现在做）：纯文本 TOOLS.md + NEW-PROJECT.md。手动维护。

阶段 2（条件：手查开始烦）：/toolbox skill，两个动作——

/toolbox <名字> → 查附录，答评过没有、结论是什么、失效条件到了没
/toolbox add → 把本次会话实测结论追加进去
三条硬约束（全部来自你自己的教训）：

description 只能写「用户显式调用时」，绝不能写「当用户提到工具/安装时」
不许替你判断值不值得装，只回答记录里怎么写的；查不到就明说未收录，不许顺手搜网补一个看起来合理的答案
写入必须带证据字段，没有本机实测的只能进未评列
阶段 3（条件：阶段 2 稳定）：接 AgentsView 取证，/toolbox 能回答「过去 N 天这东西被调用过几次」（带三条限制声明）。

明确不做：数据库、Notion、网站——直到条目 >50 且确实需要复杂筛选。

十一、可复用的判断原则（放 TOOLS.md 开头，也是「对外分享」那个用途的主体）
Star 衡量传播力，不衡量留存率
装之前先问「它会改我哪些配置」
区分工具和路由器——留工具，删自动触发
「把链接给你的 Agent 让它照做」式安装 = 把远程文档当指令执行
Cookie 型能力的价值和风险是同一样东西，没法只要一半
别信自评基准；30 分钟实测胜过一小时 README
派生索引（代码图谱、会话库）不能成为事实的权威来源
卸载记录和「它动过我什么」与安装记录同等重要
分数不当门禁；人读原文才是主控制
结论必须带适用范围，否则会在转述中被压缩成错的
侵入性分级（比「有用/没用」更能预测长期维护成本）：

L0 方法/资料，不安装
L1 单二进制、只读、本地被动          ← AgentsView
L2 改一个客户端配置
L3 装 skill / hook / 自动路由
L4 跨多客户端改配置                  ← codebase-memory
L5 读 Cookie / 密钥 / 完整会话，或外传  ← Agent-Reach
十二、还需要你定的四件
前端库那节的形态对吗？ 我的方案是「归位不排除」——只记名字和一句选型场景，不记版本用法。
「决定记忆 → DECISIONS.md（还没有）」这行留不留？ 它的答案不是工具，是一个习惯。主表要不要收这种行？
taste-skill / ui-ux-pro-max-skill / multica 这三个我不认识——要我先查一下再写，还是先记「名字 + 待你补一句当初为什么点星」？
NEW-PROJECT.md 的内容从哪来？ 你冻结文档 §7.1 已有开项目五步、§7.2/7.3 有 executor/reviewer 开场模板。直接引用，还是重写一份精简版？
（另：FitMind 活跃 → GitHub Actions 是当前最明确的结构性缺口，pnpm verify 已经是现成聚合门禁。这件事独立于本文档，别混在一起做。）`

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
  {
    title: 'tooluse',
    stage: 'Planning',
    summary: '一份面向新项目与新任务开工的工具决策表：从观察到的信号出发，判断是否应该增加某种能力或工具，同时明确不该加什么。',
    tags: ['Decision System', 'Agent Workflow', 'Evidence', 'Plain Text'],
    bullets: [
      '主键不是工具名，而是“观察到什么信号”；先从信号映射到能力、现有方案、候选与明确不采用的做法。',
      '第一阶段只落地 TOOLS.md + NEW-PROJECT.md，不做数据库、网站、安装脚本或自动触发的 Skill 路由。',
      '每条结论保留判断来源、侵入性、失效部分与仍然成立的范围，并为后续 AgentsView 使用取证预留分期。',
    ],
    detail: {
      label: '查看完整设计说明',
      title: 'tooluse 设计说明',
      content: tooluseDesignDocument,
    },
  },
]
