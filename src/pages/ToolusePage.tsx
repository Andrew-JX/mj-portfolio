import DeliveryFlow from '@/components/DeliveryFlow'
import { flowNodes } from '@/data/deliveryFlow.zh'
import {
  candidateActivitySnapshot,
  lastChecked,
  toolCandidates,
  toolCategories,
  toolKindLabels,
  toolShares,
  type ToolKind,
  type ToolShare,
  type ToolStatus,
} from '@/data/toolShares.zh'

const statusClassNames: Record<ToolStatus, string> = {
  在用: 'tooluse-status-active',
  放弃: 'tooluse-status-removed',
}

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
      <summary
        className="tooluse-row-summary"
        onKeyDown={(event) => {
          if (event.key !== 'Enter' || event.target !== event.currentTarget) return
          event.preventDefault()
          event.currentTarget.parentElement?.toggleAttribute('open')
        }}
      >
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
              ) : '当前未被任何交付流程节点引用'}
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
        <p>主清单只放用过的工具；没用过的单列候选，不写使用感受。</p>
      </header>

      <section className="tooluse-library" aria-labelledby="tool-list-title">
        <div className="tooluse-section-heading">
          <div>
            <div className="section-title">Tool list</div>
            <h2 id="tool-list-title">工具清单</h2>
          </div>
          <span className="tooluse-list-count">{toolShares.length} 项 · 最近核对 {lastChecked}</span>
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

      <section className="tooluse-candidates" aria-labelledby="tool-candidate-title">
        <div className="tooluse-section-heading">
          <div>
            <div className="section-title">Watch list</div>
            <h2 id="tool-candidate-title">候选</h2>
          </div>
          <p>没用过，所以不评价。</p>
        </div>

        <table className="tooluse-data-table" aria-label="工具候选清单">
          <thead>
            <tr>
              <th scope="col">名字</th>
              <th scope="col">自称干什么</th>
              <th scope="col">侵入</th>
              <th scope="col">已知顾虑</th>
              <th scope="col">链接</th>
            </tr>
          </thead>
          <tbody>
            {toolCandidates.map((candidate) => (
              <tr key={candidate.id}>
                <th scope="row" data-label="名字">{candidate.name}</th>
                <td data-label="自称干什么">{candidate.claim}</td>
                <td data-label="侵入"><span className="tooluse-intrusion">{candidate.intrusion}</span></td>
                <td data-label="已知顾虑">{candidate.concern}</td>
                <td data-label="链接">
                  <a href={candidate.url} target="_blank" rel="noreferrer" aria-label={`打开 ${candidate.name} 项目页面`}>
                    查看
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="tooluse-snapshot">
          <div className="tooluse-snapshot-heading">
            <div>
              <span>Activity snapshot</span>
              <h3>活跃度快照</h3>
            </div>
            <p>{candidateActivitySnapshot.checkedOn} · 快照，不逐条维护</p>
          </div>

          <table className="tooluse-data-table tooluse-snapshot-table" aria-label={`候选活跃度快照，核对日期 ${candidateActivitySnapshot.checkedOn}`}>
            <thead>
              <tr>
                <th scope="col">项目</th>
                <th scope="col">★</th>
                <th scope="col">近 30 天提交</th>
                <th scope="col">建仓</th>
              </tr>
            </thead>
            <tbody>
              {candidateActivitySnapshot.rows.map((row) => (
                <tr key={row.project}>
                  <th scope="row" data-label="项目">{row.project}</th>
                  <td data-label="★">{row.stars}</td>
                  <td data-label="近 30 天提交">{row.commitsLast30Days}</td>
                  <td data-label="建仓">{row.createdOn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <DeliveryFlow />
    </div>
  )
}
