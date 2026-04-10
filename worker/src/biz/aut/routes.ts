import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import type { AppBindings } from '../../com/bindings'
import { jsonError } from '../../com/http'
import {
  clearAdminSession,
  issueAdminSession,
  loginConfigured,
  readAdminSession,
  validateCredentials,
  githubConfigured,
  buildGithubAuthUrl,
  exchangeGithubCode,
  fetchGithubUser,
  isAllowedGithubUser,
} from './service'

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

authRoutes.get('/github', async (c) => {
  if (!githubConfigured(c.env)) {
    return jsonError(c, 503, 'GitHub OAuth is not configured')
  }
  const url = new URL(c.req.url)
  const redirectUri = `${url.origin}/api/auth/github/callback`
  return c.redirect(buildGithubAuthUrl(c.env, redirectUri))
})

authRoutes.get('/github/callback', async (c) => {
  if (!githubConfigured(c.env)) {
    return jsonError(c, 503, 'GitHub OAuth is not configured')
  }

  const code = c.req.query('code')
  if (!code) return jsonError(c, 400, 'Missing code parameter')

  try {
    const url = new URL(c.req.url)
    const redirectUri = `${url.origin}/api/auth/github/callback`
    const accessToken = await exchangeGithubCode(c.env, code, redirectUri)
    const ghUser = await fetchGithubUser(accessToken)

    if (!isAllowedGithubUser(c.env, ghUser.login)) {
      return c.html(`<html><body><h2>Access Denied</h2><p>${ghUser.login} is not allowed.</p><a href="/">Back</a></body></html>`, 403)
    }

    const email = ghUser.email ?? `${ghUser.login}@github.com`
    await issueAdminSession(c, email)
    return c.redirect('/')
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return jsonError(c, 500, `GitHub auth failed: ${msg}`)
  }
})
