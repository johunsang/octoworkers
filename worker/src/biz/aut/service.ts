import type { Context } from 'hono'
import { deleteCookie, getCookie, setCookie } from 'hono/cookie'
import { sign, verify } from 'hono/jwt'
import type { AppBindings } from '../../com/bindings'

const COOKIE_NAME = '__Host-octoworkers_admin'

type SessionPayload = {
  email: string
  exp: number
}

export function loginConfigured(env: AppBindings) {
  return Boolean(env.ADMIN_LOGIN_EMAIL && env.ADMIN_LOGIN_PASSWORD && env.ADMIN_JWT_SECRET)
}

export async function issueAdminSession(c: Context<{ Bindings: AppBindings }>, email: string) {
  if (!c.env.ADMIN_JWT_SECRET) {
    throw new Error('ADMIN_JWT_SECRET is not configured')
  }

  const expiresAt = Math.floor(Date.now() / 1000) + 60 * 60 * 12
  const token = await sign({ email, exp: expiresAt }, c.env.ADMIN_JWT_SECRET)
  const isSecure = new URL(c.req.url).protocol === 'https:'

  setCookie(c, COOKIE_NAME, token, {
    httpOnly: true,
    secure: isSecure,
    sameSite: 'Strict',
    path: '/',
    maxAge: 60 * 60 * 12,
  })
}

export function clearAdminSession(c: Context) {
  deleteCookie(c, COOKIE_NAME, {
    path: '/',
  })
}

export async function readAdminSession(c: Context<{ Bindings: AppBindings }>) {
  const token = getCookie(c, COOKIE_NAME)

  if (!token || !c.env.ADMIN_JWT_SECRET) {
    return null
  }

  try {
    const payload = (await verify(token, c.env.ADMIN_JWT_SECRET, 'HS256')) as SessionPayload
    return { email: payload.email }
  } catch {
    return null
  }
}

export function validateCredentials(env: AppBindings, email: string, password: string) {
  return env.ADMIN_LOGIN_EMAIL === email && env.ADMIN_LOGIN_PASSWORD === password
}
