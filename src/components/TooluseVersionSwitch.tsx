import type { KeyboardEvent } from 'react'
import { flowVersions, type FlowVersionId } from '@/data/deliveryFlowV2.zh'

const versionIds: FlowVersionId[] = flowVersions.map((version) => version.id)

function describeTooluseVersion(id: FlowVersionId) {
  const meta = flowVersions.find((version) => version.id === id)
  if (!meta) return id

  return meta.until
    ? `${meta.label} · ${meta.tag} · ${meta.since} 起用，${meta.until} 停用`
    : `${meta.label} · ${meta.tag} · ${meta.since} 起用`
}

type TooluseVersionSwitchProps = {
  version: FlowVersionId
  onSelect: (version: FlowVersionId) => void
}

export default function TooluseVersionSwitch({ version, onSelect }: TooluseVersionSwitchProps) {
  const activeIndex = versionIds.indexOf(version)

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return

    event.preventDefault()
    const direction = event.key === 'ArrowRight' ? 1 : -1
    const nextIndex = (index + direction + versionIds.length) % versionIds.length
    const nextId = versionIds[nextIndex]
    if (!nextId) return

    onSelect(nextId)
    const tabs = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
    tabs?.[nextIndex]?.focus()
  }

  return (
    <div className="tooluse-version-switch">
      <div className="tooluse-glass-switch" role="tablist" aria-label="工具页版本">
        <span
          aria-hidden="true"
          className={`tooluse-glass-indicator${activeIndex === 1 ? ' tooluse-glass-indicator-right' : ''}`}
        />

        {flowVersions.map((meta, index) => (
          <button
            key={meta.id}
            id={`tooluse-version-tab-${meta.id}`}
            type="button"
            role="tab"
            aria-selected={meta.id === version}
            aria-controls="tooluse-version-body"
            tabIndex={meta.id === version ? 0 : -1}
            className={`tooluse-glass-option${meta.id === version ? ' tooluse-glass-option-active' : ''}`}
            onClick={() => onSelect(meta.id)}
            onKeyDown={(event) => handleTabKeyDown(event, index)}
          >
            <span className="tooluse-glass-id">{meta.id.toUpperCase()}</span>
            <span className="tooluse-glass-label">{meta.label}</span>
          </button>
        ))}
      </div>

      <p className="tooluse-version-meta" aria-live="polite">
        {describeTooluseVersion(version)}
      </p>
    </div>
  )
}
