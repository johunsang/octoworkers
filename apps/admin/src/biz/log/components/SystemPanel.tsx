import { Panel } from '../../../com/ui/Panel'
import { useSystemStats } from '../hooks/useLogs'

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

export function SystemPanel() {
  const { stats } = useSystemStats()

  if (!stats) return <Panel title="System" eyebrow="Monitoring"><p style={{ opacity: 0.5 }}>Loading...</p></Panel>

  const chartItems = [
    { label: 'Users', value: stats.totalUsers, color: '#ffb259' },
    { label: 'Leads', value: stats.totalLeads, color: '#66c5ff' },
    { label: 'Media', value: stats.totalMedia, color: '#4ade80' },
    { label: 'Pages', value: stats.totalPages, color: '#c084fc' },
    { label: 'Emails', value: stats.totalEmails, color: '#fb923c' },
    { label: 'API Reqs', value: stats.totalApiRequests, color: '#f87171' },
  ]

  return (
    <Panel title="System Overview" eyebrow="Monitoring">
      <div className="stats-grid">
        <article><span>Users</span><strong>{stats.totalUsers} <small style={{ fontSize: '0.5em', color: 'var(--text-muted)' }}>({stats.activeUsers} active)</small></strong></article>
        <article><span>Leads</span><strong>{stats.totalLeads}</strong></article>
        <article><span>Media</span><strong>{stats.totalMedia}</strong></article>
      </div>

      <div style={{ marginTop: 20 }}>
        <h3 style={{ fontSize: 13, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
          System Metrics
        </h3>
        <BarChart items={chartItems} />
      </div>
    </Panel>
  )
}
