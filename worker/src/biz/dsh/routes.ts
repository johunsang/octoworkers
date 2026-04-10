import { Hono } from 'hono'
import type { AppBindings } from '../../com/bindings'
import { aiGatewayConfigured } from '../../com/env'
import { latestLeadAt, leadCount, listLeads } from '../led/repository'
import { listMedia, mediaCount } from '../med/repository'
import { getSiteSettings } from '../set/repository'

export const dashboardRoutes = new Hono<{ Bindings: AppBindings }>()

dashboardRoutes.get('/', async (c) => {
  const settings = await getSiteSettings(c.env.DB)

  return c.json({
    stats: {
      totalLeads: await leadCount(c.env.DB),
      totalMedia: await mediaCount(c.env.DB),
      latestLeadAt: await latestLeadAt(c.env.DB),
      latestSettingUpdateAt: settings.updatedAt,
    },
    recentLeads: await listLeads(c.env.DB, 5),
    media: await listMedia(c.env.DB, 5),
    aiConfigured: aiGatewayConfigured(c.env),
  })
})
