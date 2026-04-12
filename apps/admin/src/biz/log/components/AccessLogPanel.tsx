import { Panel } from '../../../com/ui/Panel'
import { useAccessLogs } from '../hooks/useLogs'

export function AccessLogPanel() {
  const { logs } = useAccessLogs()

  return (
    <Panel title="Access Logs" eyebrow="Security">
      <div className="table-shell">
        {logs.length === 0 && <p style={{ opacity: 0.5, textAlign: 'center' }}>No access logs yet</p>}
        {logs.map((log) => (
          <article key={log.id} className="list-row">
            <div>
              <strong>{log.userEmail}</strong>
              <p>{log.action} · {log.method} {log.path}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span>{log.statusCode ?? '-'}</span>
              <br />
              <small style={{ opacity: 0.5 }}>{new Date(log.createdAt).toLocaleString('ko-KR')}</small>
            </div>
          </article>
        ))}
      </div>
    </Panel>
  )
}
