import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import type { AppBindings } from '../../com/bindings'
import { jsonError } from '../../com/http'
import { generateCopySuggestion } from '../../com/ai-gateway'
import { getSiteSettings } from '../set/repository'

const requestSchema = z.object({
  objective: z.string().min(5),
  audience: z.string().min(3),
  tone: z.string().min(3),
})

export const aiRoutes = new Hono<{ Bindings: AppBindings }>()

aiRoutes.post('/copy', zValidator('json', requestSchema), async (c) => {
  try {
    const settings = await getSiteSettings(c.env.DB)
    const suggestion = await generateCopySuggestion(c.env, settings, c.req.valid('json'))
    return c.json(suggestion)
  } catch (error) {
    return jsonError(c, 503, error instanceof Error ? error.message : 'AI Gateway request failed')
  }
})
