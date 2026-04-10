import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import type { AppBindings } from '../../com/bindings'
import { listLeads, getLeadById, updateLeadStatus, addLeadTag, removeLeadTag, addLeadNote, listLeadNotes } from './repository'

const VALID_STATUSES = ['new', 'contacted', 'qualified', 'converted', 'lost'] as const

const statusSchema = z.object({ status: z.enum(VALID_STATUSES) })
const tagSchema = z.object({ tag: z.string().min(1).max(50) })
const noteSchema = z.object({ content: z.string().min(1), createdBy: z.string().min(1).default('admin') })

function parseId(raw: string): number | null {
  const id = Number(raw)
  return Number.isInteger(id) && id > 0 ? id : null
}

export const leadsRoutes = new Hono<{ Bindings: AppBindings }>()

leadsRoutes.get('/', async (c) => {
  return c.json(await listLeads(c.env.DB))
})

leadsRoutes.get('/:id', async (c) => {
  const id = parseId(c.req.param('id'))
  if (!id) return c.json({ error: 'Invalid lead ID' }, 400)
  const lead = await getLeadById(c.env.DB, id)
  if (!lead) return c.json({ error: 'Lead not found' }, 404)
  return c.json(lead)
})

leadsRoutes.put('/:id/status', zValidator('json', statusSchema), async (c) => {
  const id = parseId(c.req.param('id'))
  if (!id) return c.json({ error: 'Invalid lead ID' }, 400)
  const { status } = c.req.valid('json')
  const lead = await getLeadById(c.env.DB, id)
  if (!lead) return c.json({ error: 'Lead not found' }, 404)
  await updateLeadStatus(c.env.DB, id, status)
  return c.json({ ok: true })
})

leadsRoutes.post('/:id/tags', zValidator('json', tagSchema), async (c) => {
  const id = parseId(c.req.param('id'))
  if (!id) return c.json({ error: 'Invalid lead ID' }, 400)
  const lead = await getLeadById(c.env.DB, id)
  if (!lead) return c.json({ error: 'Lead not found' }, 404)
  const { tag } = c.req.valid('json')
  await addLeadTag(c.env.DB, id, tag)
  return c.json({ ok: true }, 201)
})

leadsRoutes.delete('/:id/tags/:tag', async (c) => {
  const id = parseId(c.req.param('id'))
  if (!id) return c.json({ error: 'Invalid lead ID' }, 400)
  const lead = await getLeadById(c.env.DB, id)
  if (!lead) return c.json({ error: 'Lead not found' }, 404)
  const tag = decodeURIComponent(c.req.param('tag'))
  await removeLeadTag(c.env.DB, id, tag)
  return c.json({ ok: true })
})

leadsRoutes.get('/:id/notes', async (c) => {
  const id = parseId(c.req.param('id'))
  if (!id) return c.json({ error: 'Invalid lead ID' }, 400)
  const lead = await getLeadById(c.env.DB, id)
  if (!lead) return c.json({ error: 'Lead not found' }, 404)
  return c.json(await listLeadNotes(c.env.DB, id))
})

leadsRoutes.post('/:id/notes', zValidator('json', noteSchema), async (c) => {
  const id = parseId(c.req.param('id'))
  if (!id) return c.json({ error: 'Invalid lead ID' }, 400)
  const lead = await getLeadById(c.env.DB, id)
  if (!lead) return c.json({ error: 'Lead not found' }, 404)
  const { content, createdBy } = c.req.valid('json')
  await addLeadNote(c.env.DB, id, content, createdBy)
  return c.json({ ok: true }, 201)
})
