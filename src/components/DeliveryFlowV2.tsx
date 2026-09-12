import {
  engineeringSkills,
  escalationGate,
  flowLimits,
  flowPremise,
  handoff,
  impactRubric,
  invariants,
} from '@/data/deliveryFlowV2.zh'

export default function DeliveryFlowV2() {
  return (
    <div className="delivery-flow-version delivery-flow-version-v2">
      <div className="tooluse-section-heading delivery-flow-heading">
        <h2 id="delivery-flow-title">四条不变量，加两道判断</h2>
        <p>{flowPremise}</p>
      </div>

      <section className="flow2-block" aria-labelledby="flow2-invariants-title">
        <header className="flow2-block-heading">
          <span>Invariants</span>
          <h3 id="flow2-invariants-title">四条不变量</h3>
          <p>不编号——它们不是步骤，是任何时候都不许违反的条件。</p>
        </header>

        <ul className="flow2-invariants">
          {invariants.map((invariant) => (
            <li key={invariant.id}>
              <b>〔{invariant.bracket}〕</b>
              <strong>{invariant.claim}</strong>
              <p>{invariant.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="flow2-block" aria-labelledby="flow2-impact-title">
        <header className="flow2-block-heading">
          <span>Escalation</span>
          <h3 id="flow2-impact-title">验到多严，看影响不看改动大小</h3>
          <p>按实际要做的操作判，命中任一条就是高影响：</p>
        </header>

        <ul className="flow2-triggers">
          {impactRubric.tests.map((test) => (
            <li key={test}>{test}</li>
          ))}
        </ul>

        <dl className="flow2-levels">
          <div>
            <dt>低影响</dt>
            <dd>{impactRubric.low}</dd>
          </div>
          <div>
            <dt>高影响</dt>
            <dd>{impactRubric.high}</dd>
          </div>
        </dl>

        <p className="flow2-note">{impactRubric.note}</p>

        <div className="flow2-gate">
          <p className="flow2-gate-lead">{escalationGate.lead}</p>
          <ol className="flow2-gate-conditions">
            {escalationGate.conditions.map((condition) => (
              <li key={condition}>{condition}</li>
            ))}
          </ol>
          <p className="flow2-note">{escalationGate.fallback}</p>
        </div>
      </section>

      <section className="flow2-block" aria-labelledby="flow2-engineering-title">
        <header className="flow2-block-heading">
          <span>Engineering Skills</span>
          <h3 id="flow2-engineering-title">工程手艺用上游</h3>
          <p>{engineeringSkills.lead}</p>
        </header>

        <ul className="flow2-tests">
          {engineeringSkills.skills.map((skill) => (
            <li key={skill}>{skill}</li>
          ))}
        </ul>

        <p className="flow2-note">{engineeringSkills.note}</p>

        <p className="flow2-note">{engineeringSkills.dependencies}</p>

        <p className="flow2-note">
          上游入口：{' '}
          <a href={engineeringSkills.repoUrl} target="_blank" rel="noreferrer">
            {engineeringSkills.repoUrl.replace('https://', '')}
          </a>
        </p>
      </section>

      <section className="flow2-block" aria-labelledby="flow2-handoff-title">
        <header className="flow2-block-heading">
          <span>Handoff</span>
          <h3 id="flow2-handoff-title">怎么把 tooluse 交给 Agent</h3>
          <p>{handoff.lead}</p>
        </header>

        <ol className="flow2-steps">
          {handoff.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>

        <p className="flow2-note">{handoff.fallback}</p>

        <p className="flow2-note">
          规则与 Skill 的唯一源码在{' '}
          <a href={handoff.repoUrl} target="_blank" rel="noreferrer">
            {handoff.repoUrl.replace('https://', '')}
          </a>
          。这一页只是它的说明，不是第二份。
        </p>
      </section>

      <section className="flow2-block" aria-labelledby="flow2-limits-title">
        <header className="flow2-block-heading">
          <span>Limits</span>
          <h3 id="flow2-limits-title">tooluse 的边界</h3>
        </header>

        <ul className="flow2-limits">
          {flowLimits.map((limit) => (
            <li key={limit}>{limit}</li>
          ))}
        </ul>
      </section>
    </div>
  )
}
