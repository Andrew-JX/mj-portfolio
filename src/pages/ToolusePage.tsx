import { toolPrinciples, toolShares, type ToolStatus } from '@/data/toolShares.zh'

const statusClassNames: Record<ToolStatus, string> = {
  正在使用: 'tooluse-status-active',
  试用后保留: 'tooluse-status-kept',
  试用中: 'tooluse-status-trial',
  已卸载: 'tooluse-status-removed',
  尚未实测: 'tooluse-status-unverified',
}

export default function ToolusePage() {
  return (
    <div className="tooluse-page space-y-10">
      <header className="tooluse-position">
        <div className="section-title">Tooluse / 工具分享</div>
        <h1>这里只记我真正装过、用过或者用完卸掉的东西，附上判断来源和边界。</h1>
        <p>没实测过的会明确标出来，我不写没用过的使用感受。</p>
      </header>

      <section className="tooluse-library" aria-labelledby="tool-list-title">
        <div className="tooluse-section-heading">
          <div>
            <div className="section-title">Tool list</div>
            <h2 id="tool-list-title">工具清单</h2>
          </div>
          <span className="tooluse-list-count">{toolShares.length} 项 · 最后核对 2026-08-04</span>
        </div>

        <div className="tooluse-rows">
          {toolShares.map((tool, index) => (
            <details key={tool.id} id={tool.id} className="tooluse-row">
              <summary className="tooluse-row-summary">
                <span className="tooluse-row-number">{String(index + 1).padStart(2, '0')}</span>

                <span className="tooluse-row-identity">
                  {tool.url ? (
                    <a href={tool.url} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}>
                      {tool.name}
                    </a>
                  ) : (
                    <strong>{tool.name}</strong>
                  )}
                  <small>{tool.category}</small>
                </span>

                <span className={`tooluse-status ${statusClassNames[tool.status]}`}>{tool.status}</span>
                <span className="tooluse-row-description">{tool.summary}</span>

                <span className="tooluse-row-meta">
                  <span><b>用在</b>{tool.usedIn}</span>
                  <span><b>侵入性</b>{tool.intrusion}</span>
                  <span><b>核对</b>{tool.lastChecked}</span>
                </span>

                <span className="tooluse-row-toggle" aria-hidden="true">+</span>
              </summary>

              <div className="tooluse-row-detail">
                <dl>
                  <div><dt>判断来源</dt><dd>{tool.source}</dd></div>
                  <div><dt>替代了什么劳动</dt><dd>{tool.replaces}</dd></div>
                  <div><dt>实测好在哪</dt><dd>{tool.goodAt}</dd></div>
                  <div><dt>不好在哪</dt><dd>{tool.badAt}</dd></div>
                  <div><dt>边界</dt><dd>{tool.boundary}</dd></div>
                </dl>

                <div className="tooluse-row-tags" aria-label={`${tool.name} 标签`}>
                  {tool.tags.map((tag) => <span key={tag} className="chip">{tag}</span>)}
                </div>
              </div>
            </details>
          ))}
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
