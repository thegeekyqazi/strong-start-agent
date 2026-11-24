import { useEffect, useRef, useState } from 'react'
import { loadApiState, type ApiState } from './api'
import { ApplicationsPage } from './features/applications/Page'
import { FEATURES } from './features/registry'
import { ReviewPage } from './features/review/Page'
import { LandingPage } from './LandingPage'
import { ApiStatus } from './shell/ApiStatus'
import { WorkspaceIcon } from './shell/WorkspaceIcon'

const STATUS_LABEL: Record<string, string> = {
  available: 'Available',
  fixture_only: 'Sample only',
  not_implemented: 'Coming later',
  unavailable: 'Unavailable',
}

const WORKSPACE_ORDER = [
  'applications',
  'review',
  'funding',
  'knowledge',
  'automation',
  'skills',
] as const

function currentLocation() {
  return window.location.hash.replace(/^#\/?/, '') || 'home'
}

export default function App({ load = loadApiState }: { load?: () => Promise<ApiState> }) {
  const [api, setApi] = useState<ApiState>({ kind: 'loading' })
  const [location, setLocation] = useState(currentLocation)
  const main = useRef<HTMLElement>(null)

  useEffect(() => {
    let active = true
    load().then((s) => active && setApi(s))
    const onHash = () => {
      setLocation(currentLocation())
      main.current?.focus()
    }
    window.addEventListener('hashchange', onHash)
    return () => {
      active = false
      window.removeEventListener('hashchange', onHash)
    }
  }, [load])

  const [path, query] = location.split('?', 2)
  const sample = path === 'sample' || path === 'sample/review'
  const sampleQuestion = sample ? new URLSearchParams(query).get('question') : null
  const featureId = path === 'sample' ? 'applications' : path === 'sample/review' ? 'review' : path
  const isHome = featureId === 'home'
  const feature = FEATURES.find((entry) => entry.id === featureId) ?? FEATURES[0]
  const Page = feature.Component
  const caps = api.kind === 'reachable' ? api.capabilities : null
  const navigationFeatures = WORKSPACE_ORDER.map((id) => FEATURES.find((entry) => entry.id === id))

  return (
    <div className="shell">
      <a
        className="skip-link"
        href="#main-content"
        onClick={(event) => {
          event.preventDefault()
          main.current?.focus()
        }}
      >
        Skip to workspace
      </a>
      <header className="app-header">
        <a className="wordmark" href="#/home">
          <span className="wordmark-symbol" aria-hidden="true">
            <WorkspaceIcon name="brand" />
          </span>
          Strong Start
        </a>
        {caps?.fixture_mode && (
          <p className="banner-fixture" role="alert">
            Sample workspace · Fixture identity
          </p>
        )}
      </header>
      <nav className="feature-nav" aria-label="Features">
        <ul>
          <li>
            <a href="#/home" aria-current={isHome ? 'page' : undefined}>
              <WorkspaceIcon name="home" />
              Overview
            </a>
          </li>
          {navigationFeatures.map((entry) => {
            if (!entry) return null
            const href =
              sample && entry.id === 'applications'
                ? '#/sample'
                : sample && entry.id === 'review'
                  ? '#/sample/review'
                  : `#/${entry.id}`
            return (
              <li key={entry.id}>
                <a
                  href={href}
                  aria-current={!isHome && entry.id === feature.id ? 'page' : undefined}
                >
                  <WorkspaceIcon name={entry.id} />
                  {entry.label}
                </a>
              </li>
            )
          })}
        </ul>
        <details className="workspace-services">
          <summary>
            {api.kind === 'unreachable' ? 'Workspace unavailable' : 'Workspace services'}
          </summary>
          <ApiStatus state={api} />
          <dl>
            {navigationFeatures.map((entry) => {
              if (!entry) return null
              const status = caps?.capabilities.find((cap) => cap.feature === entry.id)?.status
              return (
                <div key={entry.id}>
                  <dt>{entry.label}</dt>
                  <dd>{status ? STATUS_LABEL[status] : 'Status unknown'}</dd>
                </div>
              )
            })}
          </dl>
        </details>
      </nav>
      <main id="main-content" tabIndex={-1} ref={main}>
        {isHome ? (
          <LandingPage sampleAvailable={caps?.fixture_mode !== false} />
        ) : path === 'sample' ? (
          <ApplicationsPage key={location} sample initialQuestionId={sampleQuestion} />
        ) : path === 'sample/review' ? (
          <ReviewPage key={location} sample initialQuestionId={sampleQuestion} />
        ) : (
          <Page key={feature.id} />
        )}
      </main>
    </div>
  )
}
