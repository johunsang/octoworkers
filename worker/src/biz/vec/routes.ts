import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import type { AppBindings } from '../../com/bindings'
import { jsonError } from '../../com/http'
import { reindexDocuments, semanticSearch } from './service'

const searchSchema = z.object({
  query: z.string().min(3),
})

export const vectorRoutes = new Hono<{ Bindings: AppBindings }>()

vectorRoutes.post('/reindex', async (c) => {
  try {
    return c.json(await reindexDocuments(c.env))
  } catch (error) {
    return jsonError(c, 503, error instanceof Error ? error.message : 'Vectorize reindex failed')
  }
})

vectorRoutes.post('/search', zValidator('json', searchSchema), async (c) => {
  try {
    return c.json(await semanticSearch(c.env, c.req.valid('json').query))
  } catch (error) {
    return jsonError(c, 503, error instanceof Error ? error.message : 'Vectorize search failed')
  }
})
