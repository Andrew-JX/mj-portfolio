import { useEffect, useRef, useState } from 'react'
import { toolPrinciples, toolShares } from '@/data/toolShares'

function useCenteredTool() {
  const listRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const list = listRef.current
    if (!list) return undefined

    let animationFrame = 0

    const updateActiveItem = () => {
      window.cancelAnimationFrame(animationFrame)
      animationFrame = window.requestAnimationFrame(() => {
        const listRect = list.getBoundingClientRect()
        const listCenter = listRect.top + listRect.height / 2
        const items = list.querySelectorAll<HTMLElement>('[data-tool-index]')
        let closestIndex = 0
        let closestDistance = Number.POSITIVE_INFINITY

        items.forEach((item) => {
          const itemRect = item.getBoundingClientRect()
          const itemCenter = itemRect.top + itemRect.height / 2
          const distance = Math.abs(itemCenter - listCenter)

          if (distance < closestDistance) {
            closestDistance = distance
            closestIndex = Number(item.dataset.toolIndex)
          }
        })

        setActiveIndex((current) => (current === closestIndex ? current : closestIndex))
      })
    }

    updateActiveItem()
    list.addEventListener('scroll', updateActiveItem, { passive: true })
    window.addEventListener('resize', updateActiveItem)

    return () => {
      window.cancelAnimationFrame(animationFrame)
      list.removeEventListener('scroll', updateActiveItem)
      window.removeEventListener('resize', updateActiveItem)
    }
  }, [])

  return { activeIndex, listRef }
}

export default function ToolusePage() {
  const { activeIndex, listRef } = useCenteredTool()

  return (
    <div className="tooluse-page space-y-8">
      <section className="tooluse-library" aria-labelledby="used-tools-title">
        <div className="tooluse-section-heading tooluse-library-heading">
          <div>
            <div className="section-title">Used in real work</div>
            <h1 id="used-tools-title">实际使用与判断</h1>
          </div>
        </div>

        <div className="tooluse-scroll-frame">
          <div className="tooluse-center-line" aria-hidden="true" />
          <div className="tooluse-scroll-viewport" ref={listRef}>
            <div className="tooluse-scroll-spacer" aria-hidden="true" />
            <div className="tooluse-scroll-list">
              {toolShares.map((tool, index) => (
                <article
                  key={tool.name}
                  className="tooluse-list-item"
                  data-active={activeIndex === index ? '' : undefined}
                  data-tool-index={index}
                  tabIndex={0}
                >
                  <div className="tooluse-list-reflection" aria-hidden="true" />

                  <header className="tooluse-list-header">
                    <div className="tooluse-list-identity">
                      <span className="tooluse-list-number">{String(index + 1).padStart(2, '0')}</span>
                      <div>
                        <div className="tooluse-card-category">{tool.category}</div>
                        <h2>{tool.name}</h2>
                      </div>
                    </div>
                    <span className={`tooluse-status ${tool.status === '试用中' ? 'tooluse-status-trial' : 'tooluse-status-used'}`}>
                      {tool.status}
                    </span>
                  </header>

                  <p className="tooluse-list-summary">{tool.summary}</p>

                  <dl className="tooluse-list-facts">
                    <div><dt>判断来源</dt><dd>{tool.source}</dd></div>
                    <div><dt>替代的劳动</dt><dd>{tool.replaces}</dd></div>
                    <div><dt>我的感受</dt><dd>{tool.impression}</dd></div>
                    <div><dt>边界</dt><dd>{tool.boundary}</dd></div>
                  </dl>

                  <footer className="tooluse-list-footer">
                    <div className="flex flex-wrap gap-2">
                      {tool.tags.map((tag) => <span key={tag} className="chip">{tag}</span>)}
                    </div>
                    <span className="tooluse-intrusion">侵入性 · {tool.intrusion}</span>
                    {tool.url ? <a className="magnetic-link" href={tool.url} target="_blank" rel="noreferrer">Official</a> : null}
                  </footer>
                </article>
              ))}
            </div>
            <div className="tooluse-scroll-spacer" aria-hidden="true" />
          </div>
        </div>
      </section>

      <section className="section-shell tooluse-principles">
        <div className="section-title">How I choose</div>
        <div className="tooluse-section-heading">
          <h2>先看信号，再找工具</h2>
          <p>开工时手上通常没有工具名，只有正在反复出现的问题。</p>
        </div>
        <div className="tooluse-principle-grid">
          {toolPrinciples.map((principle, index) => (
            <article key={principle} className="tooluse-principle-card">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <p>{principle}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
