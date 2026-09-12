import DeliveryFlowV2 from '@/components/DeliveryFlowV2'
import TooluseLibrary from '@/components/TooluseLibrary'
import {
  lastCheckedV2,
  toolKindLabelsV2,
  toolKindOrderV2,
  toolSharesV2,
} from '@/data/toolSharesV2.zh'

export default function ToolusePageV2() {
  return (
    <div className="tooluse-page-version tooluse-page-version-v2 space-y-10">
      <TooluseLibrary
        version="v2"
        tools={toolSharesV2}
        lastChecked={lastCheckedV2}
        groupOrder={toolKindOrderV2}
        groupLabels={toolKindLabelsV2}
      />

      <section className="section-shell delivery-flow" aria-labelledby="delivery-flow-title">
        <div className="section-title">Delivery workflow / 交付工作流</div>
        <DeliveryFlowV2 />
      </section>
    </div>
  )
}
