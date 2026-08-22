import DeliveryFlow from '@/components/DeliveryFlow'
import { flowNodes } from '@/data/deliveryFlow.zh'
import {
  toolCategories,
  toolKindLabels,
  toolShares,
  type ToolKind,
  type ToolShare,
  type ToolStatus,
} from '@/data/toolShares.zh'

const statusClassNames: Record<ToolStatus, string> = {
  正在使用: 'tooluse-status-active',
  试用后保留: 'tooluse-status-kept',
  试用中: 'tooluse-status-trial',
  冻结: 'tooluse-status-frozen',
  已卸载: 'tooluse-status-removed',
  尚未实测: 'tooluse-status-unverified',
}

const latestChecked = toolShares.reduce(
  (latest, tool) => (tool.lastChecked > latest ? tool.lastChecked : latest),
  toolShares[0]?.lastChecked ?? '',
)

const kindOrder: ToolKind[] = ['tool', 'skill', 'method']
const toolIndexById = new Map(toolShares.map((tool, index) => [tool.id, index]))
const workflowStepsByToolId = new Map<string, typeof flowNodes>()

flowNodes.forEach((node) => {
  node.toolIds.forEach((toolId) => {
    const current = workflowStepsByToolId.get(toolId) ?? []
    workflowStepsByToolId.set(toolId, [...current, node])
  })
})

function ToolRow({ tool }: { tool: ToolShare }) {
  const index = toolIndexById.get(tool.id) ?? 0
  const publicUrl = tool.repoUrl ?? tool.url
  const workflowSteps = workflowStepsByToolId.get(tool.id) ?? []

  return (
    <details id={tool.id} className="tooluse-row">
      <summary className="tooluse-row-summary">
        <span className="tooluse-row-number">{String(index + 1).padStart(2, '0')}</span>

        <span className="tooluse-row-identity">
          {publicUrl ? (
            <a href={publicUrl} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}>
              {tool.name}
            </a>
          ) : (
            <strong>{tool.name}</strong>
          )}
          <small>{toolCategories[tool.categoryId]} · {tool.origin === 'self' ? '自建' : '第三方'}</small>
        </span>

        <span className={`tooluse-status ${statusClassNames[tool.status]}`}>{tool.status}</span>
        <span className="tooluse-row-description">{tool.summary}</span>

        <span className="tooluse-row-meta">
          <span><b>用在</b>{tool.usedIn}</span>
          <span><b>侵入性</b>{tool.intrusion}</span>
          <span><b>核对</b>{tool.lastChecked}</span>
        </span>

        <span className="tooluse-row-toggle" aria-hidden="true">+</span>
      </summary>

      <div className="tooluse-row-detail">
        <dl>
          <div><dt>判断来源</dt><dd>{tool.source}</dd></div>
          <div><dt>作者归属</dt><dd>{tool.origin === 'self' ? '我自己写的' : '第三方项目'}</dd></div>
          <div><dt>替代了什么劳动</dt><dd>{tool.replaces}</dd></div>
          <div><dt>实测好在哪</dt><dd>{tool.goodAt}</dd></div>
          <div><dt>不好在哪</dt><dd>{tool.badAt}</dd></div>
          <div><dt>边界</dt><dd>{tool.boundary}</dd></div>
          <div>
            <dt>流程节点</dt>
            <dd>
              {workflowSteps.length > 0 ? (
                <span className="tooluse-workflow-steps">
                  {workflowSteps.map((step) => <span key={step.id}>{String(step.order).padStart(2, '0')} · {step.title}</span>)}
                </span>
              ) : '尚未接入交付工作流'}
            </dd>
          </div>
          {tool.installNote ? <div><dt>获取方式</dt><dd>{tool.installNote}</dd></div> : null}
        </dl>

        <div className="tooluse-row-tags" aria-label={`${tool.name} 标签`}>
          {tool.tags.map((tag) => <span key={tag} className="chip">{tag}</span>)}
        </div>
      </div>
    </details>
  )
}

export default function ToolusePage() {
  return (
    <div className="tooluse-page space-y-10">
      <header className="tooluse-position">
        <div className="section-title">Tooluse / 工具分享</div>
        <p>没实测过的会明确标出来，我不写没用过的使用感受。</p>
      </header>

      <section className="tooluse-library" aria-labelledby="tool-list-title">
        <div className="tooluse-section-heading">
          <div>
            <div className="section-title">Tool list</div>
            <h2 id="tool-list-title">工具清单</h2>
          </div>
          <span className="tooluse-list-count">{toolShares.length} 项 · 最近核对 {latestChecked}</span>
        </div>

        <div className="tooluse-groups">
          {kindOrder.map((kind) => {
            const kindTools = toolShares.filter((tool) => tool.kind === kind)
            if (kindTools.length === 0) return null

            return (
              <section key={kind} className="tooluse-group" aria-labelledby={`tooluse-kind-${kind}`}>
                <header className="tooluse-group-heading">
                  <div>
                    <span>Library group</span>
                    <h3 id={`tooluse-kind-${kind}`}>{toolKindLabels[kind].title}</h3>
                    <p>{toolKindLabels[kind].description}</p>
                  </div>
                  <strong>{kindTools.length} 项</strong>
                </header>
                <div className="tooluse-rows">
                  {kindTools.map((tool) => <ToolRow key={tool.id} tool={tool} />)}
                </div>
              </section>
            )
          })}
        </div>
      </section>

      <DeliveryFlow />
    </div>
  )
}
