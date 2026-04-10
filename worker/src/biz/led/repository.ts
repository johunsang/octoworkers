import type { LeadRecord, LeadSubmissionInput, LeadDetail, LeadTag, LeadNote, LeadStatus } from '@octoworkers/com'
import type { D1DatabaseLike } from '../../com/bindings'
import { allRows, isoNow } from '../../com/db'

type LeadRow = {
  id: number
  name: string
  email: string
  company: string | null
  message: string | null
  status: string
  assigned_to: string | null
  source: string | null
  created_at: string
}

type TagRow = { id: number; lead_id: number; tag: string; created_at: string }
type NoteRow = { id: number; lead_id: number; content: string; created_by: string; created_at: string }

function mapLead(row: LeadRow): LeadRecord {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    company: row.company,
    message: row.message,
    status: row.status,
    assignedTo: row.assigned_to,
    source: row.source,
    createdAt: row.created_at,
  }
}

function mapTag(row: TagRow): LeadTag {
  return { id: row.id, leadId: row.lead_id, tag: row.tag, createdAt: row.created_at }
}

function mapNote(row: NoteRow): LeadNote {
  return { id: row.id, leadId: row.lead_id, content: row.content, createdBy: row.created_by, createdAt: row.created_at }
}

export async function createLead(db: D1DatabaseLike, input: LeadSubmissionInput) {
  await db
    .prepare(
      `
        INSERT INTO leads (name, email, company, message, status, created_at)
        VALUES (?, ?, ?, ?, 'new', ?)
      `,
    )
    .bind(input.name, input.email, input.company ?? null, input.message ?? null, isoNow())
    .run()
}

export async function listLeads(db: D1DatabaseLike, limit = 20) {
  const rows = await allRows<LeadRow>(
    db.prepare(
      `
        SELECT id, name, email, company, message, status, assigned_to, source, created_at
        FROM leads
        ORDER BY id DESC
        LIMIT ?
      `,
    ).bind(limit),
  )

  return rows.map(mapLead)
}

export async function getLeadById(db: D1DatabaseLike, id: number): Promise<LeadDetail | null> {
  const row = await db
    .prepare('SELECT id, name, email, company, message, status, assigned_to, source, created_at FROM leads WHERE id = ?')
    .bind(id)
    .first<LeadRow>()

  if (!row) return null

  const tags = await allRows<TagRow>(db.prepare('SELECT id, lead_id, tag, created_at FROM lead_tags WHERE lead_id = ? ORDER BY id').bind(id))
  const notes = await allRows<NoteRow>(
    db.prepare('SELECT id, lead_id, content, created_by, created_at FROM lead_notes WHERE lead_id = ? ORDER BY id DESC').bind(id),
  )

  return {
    ...mapLead(row),
    tags: tags.map(mapTag),
    notes: notes.map(mapNote),
  }
}

export async function updateLeadStatus(db: D1DatabaseLike, id: number, status: LeadStatus) {
  await db.prepare('UPDATE leads SET status = ? WHERE id = ?').bind(status, id).run()
}

export async function addLeadTag(db: D1DatabaseLike, leadId: number, tag: string) {
  await db.prepare('INSERT OR IGNORE INTO lead_tags (lead_id, tag, created_at) VALUES (?, ?, ?)').bind(leadId, tag, isoNow()).run()
}

export async function removeLeadTag(db: D1DatabaseLike, leadId: number, tag: string) {
  await db.prepare('DELETE FROM lead_tags WHERE lead_id = ? AND tag = ?').bind(leadId, tag).run()
}

export async function addLeadNote(db: D1DatabaseLike, leadId: number, content: string, createdBy: string) {
  await db.prepare('INSERT INTO lead_notes (lead_id, content, created_by, created_at) VALUES (?, ?, ?, ?)').bind(leadId, content, createdBy, isoNow()).run()
}

export async function listLeadNotes(db: D1DatabaseLike, leadId: number): Promise<LeadNote[]> {
  const rows = await allRows<NoteRow>(
    db.prepare('SELECT id, lead_id, content, created_by, created_at FROM lead_notes WHERE lead_id = ? ORDER BY id DESC').bind(leadId),
  )
  return rows.map(mapNote)
}

export async function leadCount(db: D1DatabaseLike) {
  const row = await db.prepare('SELECT COUNT(*) AS count FROM leads').first<{ count: number }>()
  return row?.count ?? 0
}

export async function latestLeadAt(db: D1DatabaseLike) {
  const row = await db.prepare('SELECT created_at FROM leads ORDER BY id DESC LIMIT 1').first<{ created_at: string }>()
  return row?.created_at ?? null
}
