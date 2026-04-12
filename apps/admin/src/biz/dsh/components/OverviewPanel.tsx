import { Panel } from '../../../com/ui/Panel'
import { useDashboard } from '../hooks/useDashboard'

export function OverviewPanel() {
  const { dashboard } = useDashboard()

  return (
    <Panel title="Overview" eyebrow="Dashboard">
      <div className="stats-grid">
        <article>
          <span>Total leads</span>
          <strong>{dashboard?.stats.totalLeads ?? 0}</strong>
        </article>
        <article>
          <span>Total media</span>
          <strong>{dashboard?.stats.totalMedia ?? 0}</strong>
        </article>
        <article>
          <span>AI Gateway</span>
          <strong>{dashboard?.aiConfigured ? 'Ready' : 'Configure token'}</strong>
        </article>
      </div>
    </Panel>
  )
}
