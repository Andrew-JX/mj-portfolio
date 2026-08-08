import { useSearchParams } from 'react-router-dom'
import {
  flowEdges,
  flowNodes,
  flowScales,
  type FlowNode,
} from '@/data/deliveryFlow.zh'
import { toolShares } from '@/data/toolShares.zh'

const toolById = new Map(toolShares.map((tool) => [tool.id, tool]))
const quickPath = flowEdges.find((edge) => edge.kind === 'quick-path')
const reworkPath = flowEdges.find((edge) => edge.kind === 'rework')

type FlowDetailProps = {
  node: FlowNode
  onToolSelect: (toolId: string) => void
  variant: 'desktop' | 'mobile'
}

function FlowDetail({ node, onToolSelect, variant }: FlowDetailProps) {
  return (
    <article className={`delivery-flow-detail delivery-flow-detail-${variant}`} aria-label={`第 ${node.order} 步详情`}>
      <header className="delivery-flow-detail-heading">
        <span>{String(node.order).padStart(2, '0')}</span>
        <div>
          <small>Selected step</small>
          <h3>{node.title}</h3>
        </div>
      </header>

      <dl className="delivery-flow-facts">
        <div>
          <dt>这一步做什么</dt>
          <dd>{node.oneLiner}</dd>
        </div>
        <div>
          <dt>什么时候能跳过</dt>
          <dd>{node.skipWhen}</dd>
        </div>
        <div>
          <dt>用到哪些工具</dt>
          <dd>
            {node.toolIds.length > 0 ? (
              <span className="delivery-flow-tools">
                {node.toolIds.map((toolId) => {
                  const tool = toolById.get(toolId)
                  if (!tool) return null

                  return (
                    <button
                      key={toolId}
                      type="button"
                      className="delivery-flow-tool"
                      onClick={() => onToolSelect(toolId)}
                      aria-label={`查看工具清单中的 ${tool.name}`}
                    >
                      {tool.name}
                    </button>
                  )
                })}
              </span>
            ) : (
              <span className="delivery-flow-empty">无专用工具</span>
            )}
            {node.methodNote ? <span className="delivery-flow-method">{node.methodNote}</span> : null}
          </dd>
        </div>
        <div>
          <dt>我踩过的坑</dt>
          <dd>{node.pitfall}</dd>
        </div>
      </dl>
    </article>
  )
}

export default function DeliveryFlow() {
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedStep = searchParams.get('step')
  const selectedNode = flowNodes.find((node) => node.id === requestedStep) ?? flowNodes[0]

  const selectStep = (stepId: string) => {
    setSearchParams({ step: stepId }, { replace: true })
  }

  const selectTool = (toolId: string) => {
    const row = document.getElementById(toolId)
    if (!(row instanceof HTMLDetailsElement)) return

    row.open = true
    row.querySelector<HTMLElement>('summary')?.focus({ preventScroll: true })
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    row.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
  }

  return (
    <section className="section-shell delivery-flow" aria-labelledby="delivery-flow-title">
      <div className="section-title">Delivery workflow / 交付工作流</div>
      <div className="tooluse-section-heading delivery-flow-heading">
        <h2 id="delivery-flow-title">从接到活，到裁决与结账</h2>
        <p>十个节点，两条特殊边；任务越大，证据链走得越完整。</p>
      </div>

      <ol className="delivery-flow-scales" aria-label="任务规模分档">
        {flowScales.map((scale, index) => (
          <li key={scale.id}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <div>
              <strong>{scale.label}</strong>
              <p>{scale.description}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="delivery-flow-layout">
        <div className="delivery-flow-track">
          <ol className="delivery-flow-nodes" aria-label="交付流程节点">
            {flowNodes.map((node) => {
              const isSelected = node.id === selectedNode.id

              return (
                <li key={node.id} className={`delivery-flow-node${isSelected ? ' is-selected' : ''}`}>
                  <button
                    type="button"
                    className="delivery-flow-node-button"
                    aria-pressed={isSelected}
                    aria-label={`第 ${node.order} 步：${node.title}`}
                    onClick={() => selectStep(node.id)}
                  >
                    <span className="delivery-flow-node-index">{String(node.order).padStart(2, '0')}</span>
                    <span className="delivery-flow-node-copy">
                      <strong>{node.title}</strong>
                      <small>{node.oneLiner}</small>
                    </span>
                    <span className="delivery-flow-node-arrow" aria-hidden="true">→</span>
                  </button>

                  {node.id === quickPath?.from ? (
                    <div className="delivery-flow-branch" aria-label={`${quickPath.label}：做完自己看 diff 后结束`}>
                      <span>{quickPath.label}</span>
                      <strong>做完自己看 diff · 结束</strong>
                    </div>
                  ) : null}

                  {isSelected ? (
                    <FlowDetail node={node} onToolSelect={selectTool} variant="mobile" />
                  ) : null}
                </li>
              )
            })}
          </ol>

          {reworkPath ? (
            <div className="delivery-flow-loop" aria-label={`${reworkPath.label}，从第九步返回第六步`}>
              <span aria-hidden="true">↶</span>
              <strong>{reworkPath.label}</strong>
              <small>09 我裁决 → 06 执行</small>
            </div>
          ) : null}
        </div>

        <FlowDetail node={selectedNode} onToolSelect={selectTool} variant="desktop" />
      </div>
    </section>
  )
}
