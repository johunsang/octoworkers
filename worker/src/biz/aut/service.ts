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

export function githubConfigured(env: AppBindings) {
  return Boolean(env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET && env.ADMIN_JWT_SECRET)
}

export function buildGithubAuthUrl(env: AppBindings, redirectUri: string) {
  const params = new URLSearchParams({
    client_id: env.GITHUB_CLIENT_ID!,
    redirect_uri: redirectUri,
    scope: 'read:user user:email',
  })
  return `https://github.com/login/oauth/authorize?${params}`
}

export async function exchangeGithubCode(env: AppBindings, code: string, redirectUri: string) {
  const res = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: redirectUri,
    }),
  })
  const data = (await res.json()) as { access_token?: string; error?: string }
  if (!data.access_token) throw new Error(data.error ?? 'GitHub token exchange failed')
  return data.access_token
}

export async function fetchGithubUser(accessToken: string) {
  const res = await fetch('https://api.github.com/user', {
    headers: { Authorization: `Bearer ${accessToken}`, 'User-Agent': 'OctoTerminal', Accept: 'application/json' },
  })
  if (!res.ok) throw new Error('Failed to fetch GitHub user')
  const user = (await res.json()) as { login: string; email: string | null; avatar_url: string; name: string | null }

  if (!user.email) {
    const emailRes = await fetch('https://api.github.com/user/emails', {
      headers: { Authorization: `Bearer ${accessToken}`, 'User-Agent': 'OctoTerminal', Accept: 'application/json' },
    })
    const emails = (await emailRes.json()) as Array<{ email: string; primary: boolean }>
    const primary = emails.find((e) => e.primary)
    if (primary) user.email = primary.email
  }

  return user
}

export function isAllowedGithubUser(env: AppBindings, login: string) {
  const allowed = (env.GITHUB_ALLOWED_USERS ?? '')
    .split(',')
    .map((u) => u.trim().toLowerCase())
    .filter(Boolean)
  if (allowed.length === 0) return true
  return allowed.includes(login.toLowerCase())
}
