import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import type { AppBindings } from '../../com/bindings'
import { listPages, getPageById, createPage, updatePage, publishPage, unpublishPage, deletePage } from './repository'
import { markdownToHtml } from './service'

const pageSchema = z.object({
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/),
  title: z.string().min(1).max(200),
  contentMd: z.string(),
})

function parseId(raw: string): number | null {
  const id = Number(raw)
  return Number.isInteger(id) && id > 0 ? id : null
}

export const pageRoutes = new Hono<{ Bindings: AppBindings }>()

pageRoutes.get('/', async (c) => {
  return c.json(await listPages(c.env.DB))
})

pageRoutes.get('/:id', async (c) => {
  const id = parseId(c.req.param('id'))
  if (!id) return c.json({ error: 'Invalid page ID' }, 400)
  const page = await getPageById(c.env.DB, id)
  if (!page) return c.json({ error: 'Page not found' }, 404)
  return c.json(page)
})

pageRoutes.post('/', zValidator('json', pageSchema), async (c) => {
  const input = c.req.valid('json')
  const html = markdownToHtml(input.contentMd)
  await createPage(c.env.DB, input, html)
  return c.json({ ok: true }, 201)
})

pageRoutes.put('/:id', zValidator('json', pageSchema), async (c) => {
  const id = parseId(c.req.param('id'))
  if (!id) return c.json({ error: 'Invalid page ID' }, 400)
  const input = c.req.valid('json')
  const html = markdownToHtml(input.contentMd)
  await updatePage(c.env.DB, id, input, html)
  return c.json({ ok: true })
})

pageRoutes.post('/:id/publish', async (c) => {
  const id = parseId(c.req.param('id'))
  if (!id) return c.json({ error: 'Invalid page ID' }, 400)
  await publishPage(c.env.DB, id)
  return c.json({ ok: true })
})

pageRoutes.post('/:id/unpublish', async (c) => {
  const id = parseId(c.req.param('id'))
  if (!id) return c.json({ error: 'Invalid page ID' }, 400)
  await unpublishPage(c.env.DB, id)
  return c.json({ ok: true })
})

pageRoutes.delete('/:id', async (c) => {
  const id = parseId(c.req.param('id'))
  if (!id) return c.json({ error: 'Invalid page ID' }, 400)
  await deletePage(c.env.DB, id)
  return c.json({ ok: true })
})
