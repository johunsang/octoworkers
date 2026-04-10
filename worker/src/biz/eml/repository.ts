import type { EmailTemplate, EmailTemplateInput, EmailLog } from '@octoworkers/com'
import type { D1DatabaseLike } from '../../com/bindings'
import { allRows, isoNow } from '../../com/db'

type TemplateRow = {
  id: number
  name: string
  subject: string
  body_html: string
  body_text: string
  created_at: string
  updated_at: string
}

type LogRow = {
  id: number
  lead_id: number
  template_id: number | null
  subject: string
  status: string
  sent_at: string
  lead_name?: string
  lead_email?: string
}

function mapTemplate(row: TemplateRow): EmailTemplate {
  return {
    id: row.id,
    name: row.name,
    subject: row.subject,
    bodyHtml: row.body_html,
    bodyText: row.body_text,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function mapLog(row: LogRow): EmailLog {
  return {
    id: row.id,
    leadId: row.lead_id,
    templateId: row.template_id,
    subject: row.subject,
    status: row.status,
    sentAt: row.sent_at,
    leadName: row.lead_name,
    leadEmail: row.lead_email,
  }
}

export async function listTemplates(db: D1DatabaseLike): Promise<EmailTemplate[]> {
  const rows = await allRows<TemplateRow>(
    db.prepare('SELECT id, name, subject, body_html, body_text, created_at, updated_at FROM email_templates ORDER BY id DESC'),
  )
  return rows.map(mapTemplate)
}

export async function getTemplateById(db: D1DatabaseLike, id: number): Promise<EmailTemplate | null> {
  const row = await db
    .prepare('SELECT id, name, subject, body_html, body_text, created_at, updated_at FROM email_templates WHERE id = ?')
    .bind(id)
    .first<TemplateRow>()
  return row ? mapTemplate(row) : null
}

export async function createTemplate(db: D1DatabaseLike, input: EmailTemplateInput) {
  const now = isoNow()
  await db
    .prepare('INSERT INTO email_templates (name, subject, body_html, body_text, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)')
    .bind(input.name, input.subject, input.bodyHtml, input.bodyText, now, now)
    .run()
}

export async function updateTemplate(db: D1DatabaseLike, id: number, input: EmailTemplateInput) {
  await db
    .prepare('UPDATE email_templates SET name = ?, subject = ?, body_html = ?, body_text = ?, updated_at = ? WHERE id = ?')
    .bind(input.name, input.subject, input.bodyHtml, input.bodyText, isoNow(), id)
    .run()
}

export async function deleteTemplate(db: D1DatabaseLike, id: number) {
  await db.prepare('DELETE FROM email_templates WHERE id = ?').bind(id).run()
}

export async function createEmailLog(db: D1DatabaseLike, leadId: number, templateId: number | null, subject: string, status: string) {
  await db
    .prepare('INSERT INTO email_logs (lead_id, template_id, subject, status, sent_at) VALUES (?, ?, ?, ?, ?)')
    .bind(leadId, templateId, subject, status, isoNow())
    .run()
}

export async function listEmailLogs(db: D1DatabaseLike, limit = 50): Promise<EmailLog[]> {
  const rows = await allRows<LogRow>(
    db.prepare(
      `SELECT el.id, el.lead_id, el.template_id, el.subject, el.status, el.sent_at,
              l.name AS lead_name, l.email AS lead_email
       FROM email_logs el
       LEFT JOIN leads l ON l.id = el.lead_id
       ORDER BY el.id DESC
       LIMIT ?`,
    ).bind(limit),
  )
  return rows.map(mapLog)
}
