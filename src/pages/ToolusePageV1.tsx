import DeliveryFlowV1 from '@/components/DeliveryFlowV1'
import TooluseCandidates from '@/components/TooluseCandidates'
import TooluseLibrary from '@/components/TooluseLibrary'
import { flowNodes } from '@/data/deliveryFlow.zh'
import { flowVersions } from '@/data/deliveryFlowV2.zh'
import {
  lastChecked,
  toolKindLabels,
  toolShares,
  type ToolKind,
} from '@/data/toolShares.zh'

const groupOrder: ToolKind[] = ['tool', 'skill', 'method']
const workflowStepsByToolId = new Map<string, typeof flowNodes>()
const v1Meta = flowVersions.find((version) => version.id === 'v1')

flowNodes.forEach((node) => {
  node.toolIds.forEach((toolId) => {
    const current = workflowStepsByToolId.get(toolId) ?? []
    workflowStepsByToolId.set(toolId, [...current, node])
  })
})

export default function ToolusePageV1() {
  return (
    <div className="tooluse-page-version tooluse-page-version-v1 space-y-10">
      <p className="tooluse-version-retired" role="note">
        <strong>历史版本</strong>
        <span>起用 {v1Meta?.since} · 停用 {v1Meta?.until}</span>
        <em>
          这是 {lastChecked} 的快照，按当时的口径原样保留，不回填后来的改动。里面的工具状态、安装说明和流程口径都不代表现在的事实——现状请看 v2。
        </em>
      </p>

      <TooluseLibrary
        version="v1"
        tools={toolShares}
        lastChecked={lastChecked}
        groupOrder={groupOrder}
        groupLabels={toolKindLabels}
        workflowStepsByToolId={workflowStepsByToolId}
        showWorkflowSteps
      />

      <TooluseCandidates version="v1" />

      <section className="section-shell delivery-flow" aria-labelledby="delivery-flow-title">
        <div className="section-title">Delivery workflow / 交付工作流</div>
        <DeliveryFlowV1 />
      </section>
    </div>
  )
}
