import { Panel } from '../../../com/ui/Panel'
import { useSystemStats } from '../hooks/useLogs'

export function SystemPanel() {
  const { stats } = useSystemStats()

  if (!stats) return <Panel title="System" eyebrow="Monitoring"><p style={{ opacity: 0.5 }}>Loading...</p></Panel>

  return (
    <Panel title="System Overview" eyebrow="Monitoring">
      <div className="stats-grid">
        <article><span>Users</span><strong>{stats.totalUsers} ({stats.activeUsers} active)</strong></article>
        <article><span>Leads</span><strong>{stats.totalLeads}</strong></article>
        <article><span>Media</span><strong>{stats.totalMedia}</strong></article>
        <article><span>Pages</span><strong>{stats.totalPages}</strong></article>
        <article><span>Emails Sent</span><strong>{stats.totalEmails}</strong></article>
        <article><span>API Requests</span><strong>{stats.totalApiRequests}</strong></article>
      </div>
    </Panel>
  )
}
