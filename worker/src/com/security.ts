import type { Context } from 'hono'
import type { AppBindings } from './bindings'
import { readAdminSession } from '../biz/aut/service'
import { normalizeHost } from './env'
import { jsonError } from './http'

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1'])

function isProtectedAdminRequest(requestUrl: string) {
  const url = new URL(requestUrl)
  return url.pathname.startsWith('/api/admin') || url.pathname.startsWith('/agents/')
}

function allowedAdminEmails(env: AppBindings) {
  return (env.ADMIN_ALLOWED_EMAILS ?? '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

export async function enforceAdminAccess(c: Context<{ Bindings: AppBindings }>, next: () => Promise<void>) {
  const url = new URL(c.req.url)
  const host = normalizeHost(url.hostname)
  const mode = c.env.ADMIN_ACCESS_MODE ?? 'hybrid'

  if (!isProtectedAdminRequest(c.req.url) || LOCAL_HOSTS.has(host) || mode === 'off') {
    await next()
    return
  }

  const authenticatedEmail = c.req.header('cf-access-authenticated-user-email')?.toLowerCase()
  const session = await readAdminSession(c)
  const sessionEmail = session?.email?.toLowerCase()
  const allowedEmails = allowedAdminEmails(c.env)

  if (mode === 'cloudflare-access' || mode === 'hybrid') {
    if (authenticatedEmail) {
      if (allowedEmails.length === 0 || allowedEmails.includes(authenticatedEmail)) {
        await next()
        return
      }

      c.res = jsonError(c, 403, 'Authenticated user is not allowed to access the admin surface.')
      return
    }
  }

  if (mode === 'session' || mode === 'hybrid') {
    if (sessionEmail) {
      if (allowedEmails.length === 0 || allowedEmails.includes(sessionEmail)) {
        await next()
        return
      }

      c.res = jsonError(c, 403, 'Signed-in user is not allowed to access the admin surface.')
      return
    }
  }

  c.res = jsonError(c, 401, 'Authentication is required for the admin API.')
}

export async function applySecurityHeaders(c: Context, next: () => Promise<void>) {
  if (new URL(c.req.url).pathname.startsWith('/api/admin/ext/rtm/ws')) {
    await next()
    return
  }

  await next()

  c.header('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https://imagedelivery.net https://*.imagedelivery.net https://avatars.githubusercontent.com; connect-src 'self'; font-src 'self' data: https://fonts.gstatic.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self' https://github.com")
  c.header('Referrer-Policy', 'strict-origin-when-cross-origin')
  c.header('X-Content-Type-Options', 'nosniff')
  c.header('X-Frame-Options', 'DENY')
  c.header('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  c.header('Cross-Origin-Opener-Policy', 'same-origin')
  c.header('Cross-Origin-Resource-Policy', 'same-origin')

  if (new URL(c.req.url).protocol === 'https:') {
    c.header('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
  }
}
