import {
  candidateActivitySnapshot,
  toolCandidates,
} from '@/data/toolShares.zh'

export default function TooluseCandidates({ version }: { version: 'v1' | 'v2' }) {
  return (
    <section className="tooluse-candidates" aria-labelledby={`tool-candidate-title-${version}`}>
      <div className="tooluse-section-heading">
        <div>
          <div className="section-title">Watch list</div>
          <h2 id={`tool-candidate-title-${version}`}>候选</h2>
        </div>
        <p>没用过，所以不评价。</p>
      </div>

      <table className="tooluse-data-table" aria-label="工具候选清单">
        <thead>
          <tr>
            <th scope="col">名字</th>
            <th scope="col">自称干什么</th>
            <th scope="col">侵入</th>
            <th scope="col">已知顾虑</th>
            <th scope="col">链接</th>
          </tr>
        </thead>
        <tbody>
          {toolCandidates.map((candidate) => (
            <tr key={candidate.id}>
              <th scope="row" data-label="名字">{candidate.name}</th>
              <td data-label="自称干什么">{candidate.claim}</td>
              <td data-label="侵入"><span className="tooluse-intrusion">{candidate.intrusion}</span></td>
              <td data-label="已知顾虑">{candidate.concern}</td>
              <td data-label="链接">
                <a href={candidate.url} target="_blank" rel="noreferrer" aria-label={`打开 ${candidate.name} 项目页面`}>
                  查看
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="tooluse-snapshot">
        <div className="tooluse-snapshot-heading">
          <div>
            <span>Activity snapshot</span>
            <h3>活跃度快照</h3>
          </div>
          <p>{candidateActivitySnapshot.checkedOn} · 快照，不逐条维护</p>
        </div>

        <table className="tooluse-data-table tooluse-snapshot-table" aria-label={`候选活跃度快照，核对日期 ${candidateActivitySnapshot.checkedOn}`}>
          <thead>
            <tr>
              <th scope="col">项目</th>
              <th scope="col">★</th>
              <th scope="col">近 30 天提交</th>
              <th scope="col">建仓</th>
            </tr>
          </thead>
          <tbody>
            {candidateActivitySnapshot.rows.map((row) => (
              <tr key={row.project}>
                <th scope="row" data-label="项目">{row.project}</th>
                <td data-label="★">{row.stars}</td>
                <td data-label="近 30 天提交">{row.commitsLast30Days}</td>
                <td data-label="建仓">{row.createdOn}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
