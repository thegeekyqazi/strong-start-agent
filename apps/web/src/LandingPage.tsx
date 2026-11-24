import { WorkspaceIcon } from './shell/WorkspaceIcon'

const TRAIL = [
  {
    icon: 'applications',
    title: 'Draft a response',
    detail: 'See the funder’s original question alongside the proposed answer.',
  },
  {
    icon: 'knowledge',
    title: 'Trace a claim',
    detail: 'Open the linked evidence to see the source, scope and reporting period.',
  },
  {
    icon: 'review',
    title: 'Review the saved version',
    detail: 'See what needs attention before staff approve the exact answer.',
  },
]

export function LandingPage({ sampleAvailable }: { sampleAvailable: boolean }) {
  return (
    <div className="workspace-overview">
      <header className="overview-heading">
        <h1>Grant workspace</h1>
        <p>Draft grant answers, trace the evidence, and review the version you’ll use.</p>
      </header>

      <div className="overview-layout">
        <section className="sample-feature" aria-labelledby="sample-title">
          <div className="sample-emblem" aria-hidden="true">
            <WorkspaceIcon name="applications" />
          </div>
          <h2 id="sample-title">
            {sampleAvailable ? 'GOS-style grant application' : 'Work on a grant application'}
          </h2>
          <p>
            {sampleAvailable
              ? 'Follow one answer from the funder’s question to a review decision.'
              : 'Open Applications to choose a saved question set and draft your answers.'}
          </p>
          <div className="sample-actions">
            <a className="sample-entry" href={sampleAvailable ? '#/sample' : '#/applications'}>
              {sampleAvailable ? 'Open sample application' : 'Open Applications'}
              <WorkspaceIcon name="arrow" />
            </a>
            {sampleAvailable && <span className="sample-data-label">Sample data</span>}
          </div>
        </section>

        <section className="overview-trail" aria-labelledby="trail-title">
          <h2 id="trail-title">From draft to decision</h2>
          <ol>
            {TRAIL.map((step) => (
              <li key={step.icon}>
                <span className="trail-icon">
                  <WorkspaceIcon name={step.icon} />
                </span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  )
}
