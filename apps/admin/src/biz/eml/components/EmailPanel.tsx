import { useState } from 'react'
import type { LeadRecord } from '@octoworkers/com'
import { Panel } from '../../../com/ui/Panel'
import { useEmailTemplates, useEmailSender } from '../hooks/useEmail'

type Props = {
  leads: LeadRecord[]
}

export function EmailPanel({ leads }: Props) {
  const { templates, create, remove } = useEmailTemplates()
  const { logs, sending, send } = useEmailSender()

  const [showForm, setShowForm] = useState(false)
  const [tplName, setTplName] = useState('')
  const [tplSubject, setTplSubject] = useState('')
  const [tplHtml, setTplHtml] = useState('')
  const [tplText, setTplText] = useState('')

  const [sendLeadId, setSendLeadId] = useState<number | ''>('')
  const [sendTemplateId, setSendTemplateId] = useState<number | ''>('')
  const [sendSubject, setSendSubject] = useState('')

  async function handleCreateTemplate() {
    if (!tplName || !tplSubject) return
    await create({ name: tplName, subject: tplSubject, bodyHtml: tplHtml, bodyText: tplText })
    setTplName('')
    setTplSubject('')
    setTplHtml('')
    setTplText('')
    setShowForm(false)
  }

  async function handleSend() {
    if (!sendLeadId) return
    await send(Number(sendLeadId), sendTemplateId ? Number(sendTemplateId) : undefined, sendSubject || undefined)
    setSendLeadId('')
    setSendTemplateId('')
    setSendSubject('')
  }

  return (
    <>
      <Panel title="Email Templates" eyebrow="Email">
        <div className="button-row">
          <button onClick={() => setShowForm(!showForm)}>{showForm ? 'Cancel' : 'New Template'}</button>
        </div>
        {showForm && (
          <div className="form-grid" style={{ marginTop: '0.5rem' }}>
            <input value={tplName} onChange={(e) => setTplName(e.target.value)} placeholder="Template name" />
            <input value={tplSubject} onChange={(e) => setTplSubject(e.target.value)} placeholder="Subject" />
            <textarea rows={4} value={tplHtml} onChange={(e) => setTplHtml(e.target.value)} placeholder="HTML body" />
            <textarea rows={2} value={tplText} onChange={(e) => setTplText(e.target.value)} placeholder="Plain text body" />
            <button onClick={handleCreateTemplate}>Save Template</button>
          </div>
        )}
        <div className="table-shell" style={{ marginTop: '0.5rem' }}>
          {templates.map((tpl) => (
            <article key={tpl.id} className="list-row">
              <div>
                <strong>{tpl.name}</strong>
                <p>{tpl.subject}</p>
              </div>
              <button className="secondary-button" onClick={() => remove(tpl.id)}>
                Delete
              </button>
            </article>
          ))}
        </div>
      </Panel>

      <Panel title="Send Email" eyebrow="Email">
        <div className="form-grid">
          <select value={sendLeadId} onChange={(e) => setSendLeadId(e.target.value ? Number(e.target.value) : '')}>
            <option value="">Select lead...</option>
            {leads.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name} ({l.email})
              </option>
            ))}
          </select>
          <select value={sendTemplateId} onChange={(e) => setSendTemplateId(e.target.value ? Number(e.target.value) : '')}>
            <option value="">Select template (optional)...</option>
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          <input value={sendSubject} onChange={(e) => setSendSubject(e.target.value)} placeholder="Custom subject (overrides template)" />
          <button onClick={handleSend} disabled={sending || !sendLeadId}>
            {sending ? 'Sending...' : 'Send Email'}
          </button>
        </div>
      </Panel>

      <Panel title="Send History" eyebrow="Email">
        <div className="table-shell">
          {logs.map((log) => (
            <article key={log.id} className="list-row">
              <div>
                <strong>{log.subject}</strong>
                <p>
                  {log.leadName ?? 'Unknown'} ({log.leadEmail ?? ''})
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ color: log.status === 'sent' ? 'var(--accent, #4ade80)' : 'var(--error, #f87171)' }}>{log.status}</span>
                <br />
                <small>{new Date(log.sentAt).toLocaleString()}</small>
              </div>
            </article>
          ))}
        </div>
      </Panel>
    </>
  )
}
