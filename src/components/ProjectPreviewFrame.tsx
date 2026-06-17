import type { CSSProperties } from 'react'
import type { ProjectMedia } from '@/types'

type ProjectPreviewFrameProps = {
  media: ProjectMedia
  compact?: boolean
}

function ProjectVisual({ slug }: { slug: string }) {
  if (slug === 'fitmind-ai') {
    return (
      <>
        <div className="project-visual-row">
          <span className="project-visual-status">Tool call</span>
          <span className="project-visual-pulse" />
        </div>
        <div className="project-visual-bars">
          <span style={{ '--bar-height': '72%' } as CSSProperties} />
          <span style={{ '--bar-height': '44%' } as CSSProperties} />
          <span style={{ '--bar-height': '86%' } as CSSProperties} />
          <span style={{ '--bar-height': '58%' } as CSSProperties} />
          <span style={{ '--bar-height': '68%' } as CSSProperties} />
        </div>
        <div className="project-visual-chat"><span /><span /><span /></div>
      </>
    )
  }

  if (slug === 'ai-pm-dev') {
    return (
      <>
        <div className="project-visual-workflow"><span>Idea</span><span>PRD</span><span>Build</span></div>
        <div className="project-visual-checklist"><span /><span /><span /></div>
        <div className="project-visual-gate">strict gate</div>
      </>
    )
  }

  if (slug === 'easemove') {
    return (
      <>
        <div className="project-visual-map">
          <span className="project-visual-route" />
          <span className="project-visual-pin project-visual-pin-a" />
          <span className="project-visual-pin project-visual-pin-b" />
        </div>
        <div className="project-visual-score"><span>Comfort</span><strong>82</strong></div>
      </>
    )
  }

  if (slug === 'real-scene-3d') {
    return (
      <>
        <div className="project-visual-terrain">
          <span className="project-visual-measure-line" />
          <span className="project-visual-measure-dot project-visual-measure-a" />
          <span className="project-visual-measure-dot project-visual-measure-b" />
        </div>
        <div className="project-visual-coords"><span>lon 118.8</span><span>lat 32.0</span></div>
      </>
    )
  }

  if (slug === 'ruilian') {
    return (
      <>
        <div className="project-visual-sync"><span /><span /><span /></div>
        <div className="project-visual-records"><span /><span /><span /></div>
      </>
    )
  }

  if (slug === 'sunsafe') {
    return (
      <>
        <div className="project-visual-uv"><span>UV</span><strong>7.8</strong></div>
        <div className="project-visual-diary"><span /><span /><span /></div>
      </>
    )
  }

  if (slug === 'agri-identification') {
    return (
      <>
        <div className="project-visual-scan"><span /></div>
        <div className="project-visual-confidence"><span>ResNet</span><strong>94%</strong></div>
      </>
    )
  }

  if (slug === 'studysmart') {
    return (
      <>
        <div className="project-visual-phone"><span /><span /><span /></div>
        <div className="project-visual-reminder">09:30</div>
      </>
    )
  }

  return (
    <>
      <div className="project-preview-panel project-preview-panel-primary" />
      <div className="project-preview-panel-row">
        <div className="project-preview-panel project-preview-panel-secondary" />
        <div className="project-preview-panel project-preview-panel-tertiary" />
      </div>
    </>
  )
}

export default function ProjectPreviewFrame({ media, compact = false }: ProjectPreviewFrameProps) {
  const toneClass = `project-preview-tone-${media.tone}`
  const visualClass = `project-preview-visual-${media.slug}`

  return (
    <div className={`project-preview-shell ${toneClass} ${compact ? 'project-preview-compact' : ''}`}>
      {media.imageSrc ? (
        <img className="project-preview-image" src={media.imageSrc} alt={media.imageAlt ?? media.title} />
      ) : (
        <>
          <div className="project-preview-noise" />
          <div className="project-preview-grid" />
          <div className="project-preview-orb project-preview-orb-a" />
          <div className="project-preview-orb project-preview-orb-b" />

          <div className={`project-preview-window ${visualClass}`}>
            <div className="project-preview-window-top">
              <span className="project-preview-dot" />
              <span className="project-preview-dot" />
              <span className="project-preview-dot" />
            </div>
            <div className="project-preview-window-body project-preview-visual">
              <ProjectVisual slug={media.slug} />
            </div>
          </div>
        </>
      )}

      <div className="project-preview-content">
        <div className="project-preview-kicker">{media.eyebrow}</div>
        <div className="project-preview-title">{media.title}</div>
        <p className="project-preview-caption">{media.caption}</p>
        <div className="project-preview-metrics">
          {media.metrics.map((metric) => (
            <span key={metric} className="project-preview-metric">{metric}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
