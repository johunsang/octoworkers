import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import type { AppBindings } from '../../com/bindings'
import { createLead, leadCount } from '../led/repository'
import { mediaCount } from '../med/repository'
import { listPublishedPages, getPageBySlug } from '../pag/repository'
import { getSiteSettings } from '../set/repository'

const leadSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  company: z.string().optional(),
  message: z.string().optional(),
})

export const publicRoutes = new Hono<{ Bindings: AppBindings }>()

publicRoutes.get('/bootstrap', async (c) => {
  const settings = await getSiteSettings(c.env.DB)
  const metrics = {
    totalLeads: await leadCount(c.env.DB),
    totalMedia: await mediaCount(c.env.DB),
    updatedAt: settings.updatedAt,
  }

  return c.json({ settings, metrics })
})

publicRoutes.post('/leads', zValidator('json', leadSchema), async (c) => {
  const payload = c.req.valid('json')
  await createLead(c.env.DB, payload)
  return c.json({ ok: true }, 201)
})

publicRoutes.get('/pages', async (c) => {
  return c.json(await listPublishedPages(c.env.DB))
})

publicRoutes.get('/pages/:slug', async (c) => {
  const slug = c.req.param('slug')
  const page = await getPageBySlug(c.env.DB, slug)
  if (!page || page.status !== 'published') return c.json({ error: 'Page not found' }, 404)
  return c.json(page)
})

publicRoutes.get('/releases', async (c) => {
  const res = await fetch('https://api.github.com/repos/johunsang/octo-terminal-releases/releases', {
    headers: { 'User-Agent': 'OctoTerminal', Accept: 'application/vnd.github+json' },
  })
  if (!res.ok) return c.json({ error: 'Failed to fetch releases' }, 502)
  const releases = (await res.json()) as Array<{
    tag_name: string
    name: string
    published_at: string
    body: string
    assets: Array<{ name: string; browser_download_url: string; size: number }>
  }>
  const mapped = releases.slice(0, 5).map((r) => ({
    tag: r.tag_name,
    name: r.name,
    publishedAt: r.published_at,
    body: r.body,
    assets: r.assets.map((a) => ({ name: a.name, url: a.browser_download_url, size: a.size })),
  }))
  return c.json(mapped)
})
