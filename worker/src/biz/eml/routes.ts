import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import type { AppBindings } from '../../com/bindings'
import { listTemplates, getTemplateById, createTemplate, updateTemplate, deleteTemplate, createEmailLog, listEmailLogs } from './repository'
import { sendViaResend } from './service'

const templateSchema = z.object({
  name: z.string().min(1),
  subject: z.string().min(1),
  bodyHtml: z.string(),
  bodyText: z.string(),
})

const sendSchema = z.object({
  leadId: z.number().int().positive(),
  templateId: z.number().int().positive().optional(),
  subject: z.string().min(1).optional(),
  bodyHtml: z.string().optional(),
  bodyText: z.string().optional(),
})

function parseId(raw: string): number | null {
  const id = Number(raw)
  return Number.isInteger(id) && id > 0 ? id : null
}

export const emailRoutes = new Hono<{ Bindings: AppBindings }>()

// --- Templates ---

emailRoutes.get('/templates', async (c) => {
  return c.json(await listTemplates(c.env.DB))
})

emailRoutes.get('/templates/:id', async (c) => {
  const id = parseId(c.req.param('id'))
  if (!id) return c.json({ error: 'Invalid template ID' }, 400)
  const template = await getTemplateById(c.env.DB, id)
  if (!template) return c.json({ error: 'Template not found' }, 404)
  return c.json(template)
})

emailRoutes.post('/templates', zValidator('json', templateSchema), async (c) => {
  const input = c.req.valid('json')
  await createTemplate(c.env.DB, input)
  return c.json({ ok: true }, 201)
})

emailRoutes.put('/templates/:id', zValidator('json', templateSchema), async (c) => {
  const id = parseId(c.req.param('id'))
  if (!id) return c.json({ error: 'Invalid template ID' }, 400)
  const input = c.req.valid('json')
  await updateTemplate(c.env.DB, id, input)
  return c.json({ ok: true })
})

emailRoutes.delete('/templates/:id', async (c) => {
  const id = parseId(c.req.param('id'))
  if (!id) return c.json({ error: 'Invalid template ID' }, 400)
  await deleteTemplate(c.env.DB, id)
  return c.json({ ok: true })
})

// --- Send ---

emailRoutes.post('/send', zValidator('json', sendSchema), async (c) => {
  const { leadId, templateId, subject, bodyHtml, bodyText } = c.req.valid('json')

  const apiKey = c.env.RESEND_API_KEY
  if (!apiKey) return c.json({ error: 'RESEND_API_KEY not configured' }, 500)

  const fromAddress = c.env.RESEND_FROM_ADDRESS ?? 'noreply@example.com'

  // Resolve lead email
  const lead = await c.env.DB.prepare('SELECT email, name FROM leads WHERE id = ?').bind(leadId).first<{ email: string; name: string }>()
  if (!lead) return c.json({ error: 'Lead not found' }, 404)
  if (!lead.email) return c.json({ error: 'Lead has no email address' }, 400)

  let finalSubject = subject ?? ''
  let finalHtml = bodyHtml ?? ''
  let finalText = bodyText ?? ''

  if (templateId) {
    const template = await getTemplateById(c.env.DB, templateId)
    if (!template) return c.json({ error: 'Template not found' }, 404)
    finalSubject = finalSubject || template.subject
    finalHtml = finalHtml || template.bodyHtml
    finalText = finalText || template.bodyText
  }

  if (!finalSubject) return c.json({ error: 'Subject is required' }, 400)

  try {
    await sendViaResend(apiKey, {
      from: fromAddress,
      to: lead.email,
      subject: finalSubject,
      html: finalHtml,
      text: finalText,
    })
    await createEmailLog(c.env.DB, leadId, templateId ?? null, finalSubject, 'sent')
    return c.json({ ok: true })
  } catch {
    await createEmailLog(c.env.DB, leadId, templateId ?? null, finalSubject, 'failed')
    return c.json({ error: 'Email send failed' }, 500)
  }
})

// --- Logs ---

emailRoutes.get('/logs', async (c) => {
  return c.json(await listEmailLogs(c.env.DB))
})
