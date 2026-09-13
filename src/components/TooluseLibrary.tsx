import {
  toolCategories,
  type ToolKind,
  type ToolStatus,
} from '@/data/toolShares.zh'
import type { ToolShareWithRoutes } from '@/data/toolSharesV2.zh'

const statusClassNames: Record<ToolStatus, string> = {
  在用: 'tooluse-status-active',
  放弃: 'tooluse-status-removed',
}

type ToolGroupLabel = {
  title: string
  description: string
}

type WorkflowStep = {
  id: string
  order: number
  title: string
}

type TooluseLibraryProps = {
  version: 'v1' | 'v2'
  tools: readonly ToolShareWithRoutes[]
  lastChecked: string
  groupOrder: readonly ToolKind[]
  groupLabels: Partial<Record<ToolKind, ToolGroupLabel>>
  workflowStepsByToolId?: ReadonlyMap<string, readonly WorkflowStep[]>
  showWorkflowSteps?: boolean
}

type ToolRowProps = {
  index: number
  tool: ToolShareWithRoutes
  workflowSteps: readonly WorkflowStep[]
  showWorkflowSteps: boolean
}

function ToolRow({ index, tool, workflowSteps, showWorkflowSteps }: ToolRowProps) {
  const publicUrl = tool.repoUrl ?? tool.url

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
          {showWorkflowSteps ? (
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
          ) : null}
          {tool.routes && tool.routes.length > 0 ? (
            <div>
              <dt>当前入口</dt>
              <dd>
                <span className="tooluse-workflow-steps">
                  {tool.routes.map((route) => <span key={route}>{route}</span>)}
                </span>
              </dd>
            </div>
          ) : null}
          {tool.installNote ? <div><dt>获取方式</dt><dd>{tool.installNote}</dd></div> : null}
        </dl>

        <div className="tooluse-row-tags" aria-label={`${tool.name} 标签`}>
          {tool.tags.map((tag) => <span key={tag} className="chip">{tag}</span>)}
        </div>
      </div>
    </details>
  )
}

export default function TooluseLibrary({
  version,
  tools,
  lastChecked,
  groupOrder,
  groupLabels,
  workflowStepsByToolId,
  showWorkflowSteps = false,
}: TooluseLibraryProps) {
  return (
    <section className="tooluse-library" aria-labelledby={`tool-list-title-${version}`}>
      <div className="tooluse-section-heading">
        <div>
          <div className="section-title">Tool list</div>
          <h2 id={`tool-list-title-${version}`}>工具清单</h2>
        </div>
        <span className="tooluse-list-count">{tools.length} 项 · 最近核对 {lastChecked}</span>
      </div>

      <div className="tooluse-groups">
        {groupOrder.map((kind) => {
          const kindTools = tools.filter((tool) => tool.kind === kind)
          const label = groupLabels[kind]
          if (kindTools.length === 0 || !label) return null

          return (
            <section key={kind} className="tooluse-group" aria-labelledby={`tooluse-kind-${version}-${kind}`}>
              <header className="tooluse-group-heading">
                <div>
                  <span>Library group</span>
                  <h3 id={`tooluse-kind-${version}-${kind}`}>{label.title}</h3>
                  <p>{label.description}</p>
                </div>
                <strong>{kindTools.length} 项</strong>
              </header>
              <div className="tooluse-rows">
                {kindTools.map((tool) => (
                  <ToolRow
                    key={tool.id}
                    index={tools.findIndex((item) => item.id === tool.id)}
                    tool={tool}
                    workflowSteps={workflowStepsByToolId?.get(tool.id) ?? []}
                    showWorkflowSteps={showWorkflowSteps}
                  />
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </section>
  )
}
