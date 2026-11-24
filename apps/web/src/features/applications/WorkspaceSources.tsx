import type { ApplicationWorkspace } from '@strongstart/contracts'

export function WorkspaceSources({ workspace }: { workspace: ApplicationWorkspace }) {
  if (!workspace.is_fixture) return null
  const representative = workspace.question_set_ref?.is_fixture ?? true

  return (
    <details className="workspace-sources">
      <summary>
        {representative ? 'Representative form · Synthetic evidence' : 'Synthetic evidence'}
      </summary>
      {workspace.question_set_ref?.review_status === 'saved_not_reviewed' && (
        <p>Questions awaiting review.</p>
      )}
      <p>{workspace.data_label}</p>
    </details>
  )
}
