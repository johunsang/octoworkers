import { Panel } from '../../../com/ui/Panel'
import { useDashboard } from '../hooks/useDashboard'

function BarChart({ items }: { items: { label: string; value: number; color: string }[] }) {
  const max = Math.max(...items.map(i => i.value), 1)
  return (
    <div className="bar-chart">
      {items.map((item) => (
        <div key={item.label} className="bar-row">
          <span className="bar-label">{item.label}</span>
          <div className="bar-track">
            <div
              className="bar-fill"
              style={{ width: `${(item.value / max) * 100}%`, background: item.color }}
            />
          </div>
          <span className="bar-value">{item.value}</span>
        </div>
      ))}
    </div>
  )
}

export function OverviewPanel() {
  const { dashboard } = useDashboard()

  const chartItems = [
    { label: 'Leads', value: dashboard?.stats.totalLeads ?? 0, color: '#ffb259' },
    { label: 'Media', value: dashboard?.stats.totalMedia ?? 0, color: '#66c5ff' },
    { label: 'Recent', value: dashboard?.recentLeads?.length ?? 0, color: '#4ade80' },
  ]

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
          <strong>{dashboard?.aiConfigured ? 'Ready' : 'Not configured'}</strong>
        </article>
      </div>

      <div style={{ marginTop: 20 }}>
        <h3 style={{ fontSize: 13, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
          Resource Distribution
        </h3>
        <BarChart items={chartItems} />
      </div>

      {dashboard?.stats.latestLeadAt && (
        <p style={{ marginTop: 16, fontSize: 12, color: 'var(--text-muted)' }}>
          Latest lead: {new Date(dashboard.stats.latestLeadAt).toLocaleDateString('ko-KR')}
        </p>
      )}
    </Panel>
  )
}
