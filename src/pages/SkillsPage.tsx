import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from 'react'
import { useEffect, useRef, useState } from 'react'
import { labPlans } from '@/data/labPlans'

function handleLabCardMove(event: ReactPointerEvent<HTMLElement>) {
  const card = event.currentTarget
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const rect = card.getBoundingClientRect()
  const x = (event.clientX - rect.left) / rect.width
  const y = (event.clientY - rect.top) / rect.height
  card.style.setProperty('--tilt-x', `${((0.5 - y) * 11).toFixed(2)}deg`)
  card.style.setProperty('--tilt-y', `${((x - 0.5) * 13).toFixed(2)}deg`)
  card.style.setProperty('--glow-x', `${(x * 100).toFixed(1)}%`)
  card.style.setProperty('--glow-y', `${(y * 100).toFixed(1)}%`)
}

function resetLabCardTilt(event: ReactPointerEvent<HTMLElement>) {
  const card = event.currentTarget
  card.style.setProperty('--tilt-x', '0deg')
  card.style.setProperty('--tilt-y', '0deg')
  card.style.setProperty('--glow-x', '50%')
  card.style.setProperty('--glow-y', '0%')
}

export default function SkillsPage() {
  const [showIntro, setShowIntro] = useState(true)
  const [activeDetailTitle, setActiveDetailTitle] = useState<string | null>(null)
  const detailDialogRef = useRef<HTMLElement | null>(null)
  const detailCloseRef = useRef<HTMLButtonElement | null>(null)
  const activeDetail = labPlans.find((item) => item.title === activeDetailTitle)?.detail

  useEffect(() => {
    const doneTimer = window.setTimeout(() => setShowIntro(false), 1000)
    return () => window.clearTimeout(doneTimer)
  }, [])

  useEffect(() => {
    if (!activeDetail) return undefined

    const previousActiveElement = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    const focusTimer = window.requestAnimationFrame(() => detailCloseRef.current?.focus())
    document.body.style.overflow = 'hidden'

    const handleDialogKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setActiveDetailTitle(null)
        return
      }

      if (event.key !== 'Tab' || !detailDialogRef.current) return

      const focusableElements = Array.from(
        detailDialogRef.current.querySelectorAll<HTMLElement>('button, [href], [tabindex]:not([tabindex="-1"])'),
      ).filter((element) => !element.hasAttribute('disabled'))
      const firstElement = focusableElements[0]
      const lastElement = focusableElements.at(-1)

      if (!firstElement || !lastElement) {
        event.preventDefault()
      } else if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    window.addEventListener('keydown', handleDialogKeyDown)

    return () => {
      window.cancelAnimationFrame(focusTimer)
      window.removeEventListener('keydown', handleDialogKeyDown)
      document.body.style.overflow = previousOverflow
      previousActiveElement?.focus()
    }
  }, [activeDetail])

  const handlePlanKeyDown = (event: ReactKeyboardEvent<HTMLElement>, title: string, hasDetail: boolean) => {
    if (!hasDetail || (event.key !== 'Enter' && event.key !== ' ')) return
    event.preventDefault()
    setActiveDetailTitle(title)
  }

  return (
    <div className="space-y-8">
      <div aria-hidden={!showIntro} className={`lab-entry-overlay ${showIntro ? '' : 'lab-entry-overlay-hidden'}`}>
        <div className="lab-entry-noise" />
        <div className="lab-entry-text-wrap">
          <div className="fuzzy-text" data-text="404 Not found">404 Not found</div>
        </div>
      </div>

      <section className="hero-panel space-y-4">
        <div className="section-title">Lab</div>
        <h1 className="text-3xl font-semibold tracking-tight text-white">待做项目 / 规划中的实验</h1>
        <p className="max-w-3xl text-sm leading-7 text-stone-300/82">
          这里记录尚未正式开工的方向、已完成设计但仍待落地的方案，以及值得继续验证的产品假设。
        </p>
      </section>

      <section className="lab-card-grid">
        {labPlans.map((item) => (
          <article
            key={item.title}
            className="lab-tilt-card"
            role={item.detail ? 'button' : undefined}
            tabIndex={item.detail ? 0 : undefined}
            aria-haspopup={item.detail ? 'dialog' : undefined}
            aria-label={item.detail ? `${item.title}：${item.detail.label}` : undefined}
            onClick={item.detail ? () => setActiveDetailTitle(item.title) : undefined}
            onKeyDown={(event) => handlePlanKeyDown(event, item.title, Boolean(item.detail))}
            onPointerMove={handleLabCardMove}
            onPointerLeave={resetLabCardTilt}
          >
            <span aria-hidden="true" className="lab-tilt-glow" />

            <div className="lab-card-top">
              <div className="space-y-2">
                <h2 className="lab-card-title">{item.title}</h2>
                <p className="lab-card-summary">{item.summary}</p>
              </div>
              <span className="lab-stage-pill">{item.stage}</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag) => <span key={tag} className="chip">{tag}</span>)}
            </div>

            <ul className="space-y-2 text-sm leading-7 text-stone-300/84">
              {item.bullets.map((bullet) => <li key={bullet} className="detail-list-item">{bullet}</li>)}
            </ul>

            {item.detail && <span aria-hidden="true" className="button-secondary lab-detail-action">{item.detail.label}</span>}
          </article>
        ))}
      </section>

      <section className="panel-card space-y-4">
        <div className="section-title">Lab 的使用方式</div>
        <ul className="space-y-3 text-sm leading-7 text-stone-300/84">
          <li className="detail-list-item">Lab 只保留 Concept、Planning 等尚待落地的方向，不再混放已经完成或正在交付的项目。</li>
          <li className="detail-list-item">方案进入实际开发或形成可验证交付后，会移动到 Projects 继续记录。</li>
          <li className="detail-list-item">卡片保留项目动机、范围、工作流与关键约束；内容较长的设计记录可从卡片进入全文弹窗。</li>
        </ul>
      </section>

      {activeDetail && (
        <div
          className="lab-detail-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setActiveDetailTitle(null)
          }}
        >
          <section
            ref={detailDialogRef}
            id="lab-detail-dialog"
            className="lab-detail-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="lab-detail-title"
            aria-describedby="lab-detail-description"
          >
            <header className="lab-detail-header">
              <div className="space-y-2">
                <div className="section-title">Full Design Notes</div>
                <h2 id="lab-detail-title" className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  {activeDetail.title}
                </h2>
                <p id="lab-detail-description" className="text-sm leading-6 text-stone-300/82">
                  2026-08-03 讨论记录 · 包含动机、被推翻的方案、实测结果、结构设计与未来分期
                </p>
              </div>
              <button ref={detailCloseRef} className="button-secondary" type="button" onClick={() => setActiveDetailTitle(null)}>
                关闭
              </button>
            </header>
            <div className="lab-detail-scroll">
              <pre className="lab-detail-document">{activeDetail.content}</pre>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
