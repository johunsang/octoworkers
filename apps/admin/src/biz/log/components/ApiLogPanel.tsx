import { Panel } from '../../../com/ui/Panel'
import { useApiLogs } from '../hooks/useLogs'

function statusColor(code: number) {
  if (code < 300) return '#4ade80'
  if (code < 400) return '#facc15'
  if (code < 500) return '#fb923c'
  return '#f87171'
}

export function ApiLogPanel() {
  const { logs } = useApiLogs()

  return (
    <Panel title="API Request Logs" eyebrow="Monitoring">
      <div className="table-shell">
        {logs.length === 0 && <p style={{ opacity: 0.5, textAlign: 'center' }}>No API logs yet</p>}
        {logs.map((log) => (
          <article key={log.id} className="list-row">
            <div>
              <strong style={{ fontFamily: 'monospace' }}>{log.method}</strong>
              <p style={{ fontFamily: 'monospace', fontSize: 13 }}>{log.path}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ color: statusColor(log.statusCode), fontWeight: 700 }}>{log.statusCode}</span>
              {log.durationMs != null && <small style={{ opacity: 0.6 }}> · {log.durationMs}ms</small>}
              <br />
              <small style={{ opacity: 0.5 }}>{new Date(log.createdAt).toLocaleString('ko-KR')}</small>
            </div>
          </article>
        ))}
      </div>
    </Panel>
  )
}
