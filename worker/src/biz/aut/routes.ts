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
  generateOAuthState,
  verifyOAuthState,
} from './service'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export const authRoutes = new Hono<{ Bindings: AppBindings }>()

authRoutes.get('/me', async (c) => {
  const session = await readAdminSession(c)
  if (!session) return jsonError(c, 401, 'Not authenticated')
  return c.json(session)
})

authRoutes.post('/login', zValidator('json', loginSchema), async (c) => {
  if (!loginConfigured(c.env)) {
    return jsonError(c, 503, 'Admin login is not configured')
  }

  const payload = c.req.valid('json')
  const valid = await validateCredentials(c.env, payload.email, payload.password)
  if (!valid) {
    return jsonError(c, 401, 'Invalid email or password')
  }

  await issueAdminSession(c, payload.email)
  return c.json({ ok: true, email: payload.email })
})

authRoutes.post('/logout', async (c) => {
  clearAdminSession(c)
  return c.json({ ok: true })
})

// C-1: state 파라미터로 CSRF 방어
authRoutes.get('/github', async (c) => {
  if (!githubConfigured(c.env)) {
    return jsonError(c, 503, 'GitHub OAuth is not configured')
  }
  const url = new URL(c.req.url)
  const redirectUri = `${url.origin}/api/auth/github/callback`
  const state = generateOAuthState(c)
  return c.redirect(buildGithubAuthUrl(c.env, redirectUri, state))
})

authRoutes.get('/github/callback', async (c) => {
  if (!githubConfigured(c.env)) {
    return jsonError(c, 503, 'GitHub OAuth is not configured')
  }

  const code = c.req.query('code')
  if (!code) return jsonError(c, 400, 'Missing code parameter')

  // C-1: state 검증
  const queryState = c.req.query('state')
  if (!verifyOAuthState(c, queryState)) {
    return jsonError(c, 403, 'Invalid OAuth state. Please try again.')
  }

  try {
    const url = new URL(c.req.url)
    const redirectUri = `${url.origin}/api/auth/github/callback`
    const accessToken = await exchangeGithubCode(c.env, code, redirectUri)
    const ghUser = await fetchGithubUser(accessToken)

    if (!isAllowedGithubUser(c.env, ghUser.login)) {
      // C-3: XSS 방지 — JSON 응답으로 변경
      return jsonError(c, 403, 'Access denied. This GitHub account is not authorized.')
    }

    const email = ghUser.email ?? `${ghUser.login}@github.com`
    await issueAdminSession(c, email)
    return c.redirect('/')
  } catch {
    // L-1: 내부 에러 상세를 클라이언트에 노출하지 않음
    return jsonError(c, 500, 'GitHub authentication failed. Please try again.')
  }
})
