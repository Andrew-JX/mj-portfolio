import { useSearchParams } from 'react-router-dom'
import TooluseVersionSwitch from '@/components/TooluseVersionSwitch'
import { defaultFlowVersion, type FlowVersionId } from '@/data/deliveryFlowV2.zh'
import ToolusePageV1 from '@/pages/ToolusePageV1'
import ToolusePageV2 from '@/pages/ToolusePageV2'

export default function ToolusePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedVersion = searchParams.get('flow')
  const version: FlowVersionId = requestedVersion === 'v1' ? 'v1' : defaultFlowVersion

  const selectVersion = (next: FlowVersionId) => {
    if (next === version) return

    const nextSearchParams = new URLSearchParams(searchParams)
    if (next === defaultFlowVersion) {
      nextSearchParams.delete('flow')
      nextSearchParams.delete('step')
    } else {
      nextSearchParams.set('flow', next)
    }
    setSearchParams(nextSearchParams, { replace: true })
  }

  return (
    <div className="tooluse-page space-y-10">
      <header className="tooluse-position">
        <div className="section-title">Tooluse / 工具分享</div>
      </header>

      <TooluseVersionSwitch version={version} onSelect={selectVersion} />

      <div className="tooluse-version-body" id="tooluse-version-body" key={version}>
        {version === 'v1' ? <ToolusePageV1 /> : <ToolusePageV2 />}
      </div>
    </div>
  )
}
