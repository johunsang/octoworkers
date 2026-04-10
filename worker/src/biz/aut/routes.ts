import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import type { AppBindings } from '../../com/bindings'
import { jsonError } from '../../com/http'
import { clearAdminSession, issueAdminSession, loginConfigured, readAdminSession, validateCredentials } from './service'

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
})

export const authRoutes = new Hono<{ Bindings: AppBindings }>()

authRoutes.get('/me', async (c) => {
  const session = await readAdminSession(c)

  if (!session) {
    return jsonError(c, 401, 'Not authenticated')
  }

  return c.json(session)
})

authRoutes.post('/login', zValidator('json', loginSchema), async (c) => {
  if (!loginConfigured(c.env)) {
    return jsonError(c, 503, 'Admin login is not configured')
  }

  const payload = c.req.valid('json')

  if (!validateCredentials(c.env, payload.email, payload.password)) {
    return jsonError(c, 401, 'Invalid email or password')
  }

  await issueAdminSession(c, payload.email)
  return c.json({ ok: true, email: payload.email })
})

authRoutes.post('/logout', async (c) => {
  clearAdminSession(c)
  return c.json({ ok: true })
})
