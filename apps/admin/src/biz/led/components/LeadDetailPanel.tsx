import { useState } from 'react'
import type { LeadDetail, LeadStatus } from '@octoworkers/com'
import { Panel } from '../../../com/ui/Panel'

const STATUS_OPTIONS: LeadStatus[] = ['new', 'contacted', 'qualified', 'converted', 'lost']

const STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  converted: 'Converted',
  lost: 'Lost',
}

type Props = {
  lead: LeadDetail
  loading: boolean
  onClose: () => void
  onStatusChange: (id: number, status: LeadStatus) => Promise<void>
  onAddTag: (id: number, tag: string) => Promise<void>
  onRemoveTag: (id: number, tag: string) => Promise<void>
  onAddNote: (id: number, content: string) => Promise<void>
}

export function LeadDetailPanel({ lead, loading, onClose, onStatusChange, onAddTag, onRemoveTag, onAddNote }: Props) {
  const [tagInput, setTagInput] = useState('')
  const [noteInput, setNoteInput] = useState('')

  async function handleAddTag() {
    const tag = tagInput.trim()
    if (!tag) return
    await onAddTag(lead.id, tag)
    setTagInput('')
  }

  async function handleAddNote() {
    const content = noteInput.trim()
    if (!content) return
    await onAddNote(lead.id, content)
    setNoteInput('')
  }

  if (loading) {
    return (
      <Panel title="Lead Detail" eyebrow="CRM">
        <p>Loading...</p>
      </Panel>
    )
  }

  return (
    <Panel title={lead.name} eyebrow="Lead Detail">
      <div className="button-row" style={{ justifyContent: 'flex-end' }}>
        <button className="secondary-button" onClick={onClose}>
          Close
        </button>
      </div>

      <div className="form-grid">
        <div>
          <strong>Email:</strong> {lead.email}
        </div>
        <div>
          <strong>Company:</strong> {lead.company ?? 'N/A'}
        </div>
        <div>
          <strong>Source:</strong> {lead.source ?? 'website'}
        </div>
        <div>
          <strong>Created:</strong> {new Date(lead.createdAt).toLocaleString()}
        </div>
        {lead.message && (
          <div>
            <strong>Message:</strong> {lead.message}
          </div>
        )}
      </div>

      <div style={{ marginTop: '1rem' }}>
        <strong>Status:</strong>
        <select
          value={lead.status}
          onChange={(e) => onStatusChange(lead.id, e.target.value as LeadStatus)}
          style={{ marginLeft: '0.5rem' }}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <strong>Tags:</strong>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginTop: '0.25rem' }}>
          {lead.tags.map((t) => (
            <span key={t.id} className="tag-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '2px 8px', background: 'var(--surface, #333)', borderRadius: '4px', fontSize: '0.85rem' }}>
              {t.tag}
              <button onClick={() => onRemoveTag(lead.id, t.tag)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'inherit', fontSize: '1rem' }}>
                x
              </button>
            </span>
          ))}
        </div>
        <div className="button-row" style={{ marginTop: '0.5rem' }}>
          <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="Add tag..." onKeyDown={(e) => e.key === 'Enter' && handleAddTag()} />
          <button onClick={handleAddTag}>Add</button>
        </div>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <strong>Notes ({lead.notes.length}):</strong>
        <div style={{ marginTop: '0.5rem' }}>
          <textarea rows={3} value={noteInput} onChange={(e) => setNoteInput(e.target.value)} placeholder="Write a note..." style={{ width: '100%' }} />
          <button onClick={handleAddNote} style={{ marginTop: '0.25rem' }}>
            Add Note
          </button>
        </div>
        <div className="table-shell" style={{ marginTop: '0.5rem' }}>
          {lead.notes.map((note) => (
            <article key={note.id} className="list-row">
              <div>
                <p>{note.content}</p>
                <small>
                  {note.createdBy} - {new Date(note.createdAt).toLocaleString()}
                </small>
              </div>
            </article>
          ))}
        </div>
      </div>
    </Panel>
  )
}
