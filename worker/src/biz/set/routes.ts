import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import type { AppBindings } from '../../com/bindings'
import { getSiteSettings, updateSiteSettings } from './repository'

const settingsSchema = z.object({
  id: z.number(),
  brand: z.string().min(2),
  heroLabel: z.string().min(2),
  heroTitle: z.string().min(10),
  heroSubtitle: z.string().min(10),
  ctaPrimary: z.string().min(2),
  ctaSecondary: z.string().min(2),
  updatedAt: z.string(),
})

export const settingsRoutes = new Hono<{ Bindings: AppBindings }>()

settingsRoutes.get('/', async (c) => {
  return c.json(await getSiteSettings(c.env.DB))
})

settingsRoutes.put('/', zValidator('json', settingsSchema), async (c) => {
  const payload = c.req.valid('json')
  return c.json(await updateSiteSettings(c.env.DB, payload))
})
