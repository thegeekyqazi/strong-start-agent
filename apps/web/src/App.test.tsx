import { render, screen } from '@testing-library/react'
import type { CapabilityReport } from '@strongstart/contracts'
import { afterEach, beforeEach, vi } from 'vitest'
import App from './App'
import type { ApiState } from './api'
import { FEATURES } from './features/registry'

function caps(fixture: boolean): CapabilityReport {
  return {
    schema_version: '1',
    environment: 'local',
    auth_mode: fixture ? 'fixture' : 'none',
    fixture_mode: fixture,
    capabilities: FEATURES.map((f) => ({
      feature: f.id,
      owner: f.owner,
      status: 'not_implemented',
      detail: 'planned',
    })),
  }
}

const reachable = (ready: boolean, fixture = false): ApiState => ({
  kind: 'reachable',
  live: { status: 'alive', service: 'strongstart-api' },
  ready: {
    status: ready ? 'ready' : 'not_ready',
    checks: [{ name: 'database', ok: ready, detail: ready ? 'connected' : 'OperationalError' }],
  },
  capabilities: caps(fixture),
})

describe('App shell', () => {
  beforeEach(() => {
    window.location.hash = '#/knowledge'
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        Promise.resolve(
          new Response(
            JSON.stringify({
              schema_version: '1',
              authenticated: false,
              identity_is_fixture: false,
              environment: 'test',
              storage: 'unconfigured',
              status: 'unavailable',
              detail: 'Database storage is not configured.',
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } },
          ),
        ),
      ),
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
  })

  it('registers every lane feature with its owner', async () => {
    render(<App load={async () => reachable(true)} />)
    for (const f of FEATURES) {
      expect(screen.getByRole('link', { name: f.label })).toBeInTheDocument()
    }
    expect(await screen.findByText('Database ready')).toBeInTheDocument()
    expect(screen.getAllByText('Coming later').length).toBeGreaterThanOrEqual(6)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('shows not-ready readiness truthfully', async () => {
    render(<App load={async () => reachable(false)} />)
    expect(await screen.findByText('Not ready')).toBeInTheDocument()
    expect(screen.getByText(/database: failed/)).toBeInTheDocument()
  })

  it('shows an unreachable API instead of pretending', async () => {
    render(<App load={async () => ({ kind: 'unreachable', detail: 'Failed to fetch' })} />)
    expect(await screen.findByText(/API unreachable/)).toBeInTheDocument()
    expect(screen.getAllByText('Status unknown')).toHaveLength(FEATURES.length)
  })

  it('labels fixture mode conspicuously', async () => {
    render(<App load={async () => reachable(true, true)} />)
    expect(await screen.findByRole('alert')).toHaveTextContent(/Local preview/)
  })

  it('marks the current feature and keeps the other workspace routes reachable', () => {
    window.location.hash = '#/knowledge'
    render(<App load={() => new Promise<ApiState>(() => undefined)} />)

    expect(screen.getByRole('link', { name: 'Knowledge' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Intake & Prefill' })).toHaveAttribute(
      'href',
      '#/automation',
    )
    expect(screen.getByRole('link', { name: 'Applications' })).toHaveAttribute(
      'href',
      '#/applications',
    )
  })

  it('opens at the workspace overview with a labeled sample and direct entry', () => {
    window.location.hash = ''
    render(<App load={() => new Promise<ApiState>(() => undefined)} />)

    expect(screen.getByRole('heading', { name: 'Grant workspace' })).toBeInTheDocument()
    expect(screen.getByText('Sample data')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Open sample application' })).toHaveAttribute(
      'href',
      '#/sample',
    )
    expect(screen.getByRole('navigation', { name: 'Features' })).toBeInTheDocument()
  })

  it('links to the ordinary workspace when fixture mode is off', async () => {
    window.location.hash = ''
    render(<App load={async () => reachable(true)} />)

    expect(await screen.findByRole('link', { name: 'Open Applications' })).toHaveAttribute(
      'href',
      '#/applications',
    )
    expect(screen.queryByRole('link', { name: 'Open sample application' })).not.toBeInTheDocument()
  })

  it('opens a configured presentation through ordinary Applications', async () => {
    vi.stubEnv('VITE_PRESENTATION_QUESTION_SET_ID', 'saved-questions')
    vi.stubEnv('VITE_PRESENTATION_QUESTION_ID', 'saved:summary')
    window.location.hash = ''
    render(<App load={async () => reachable(true, true)} />)

    expect(await screen.findByRole('link', { name: 'Open application' })).toHaveAttribute(
      'href',
      '#/applications?questionSet=saved-questions&question=saved%3Asummary',
    )
  })
})
