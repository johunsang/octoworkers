import type { Context } from 'hono'
import type { AppBindings } from './bindings'
import { readAdminSession } from '../biz/aut/service'
import { jsonError } from './http'

export type Role = 'super_admin' | 'admin' | 'editor' | 'viewer'

const ROLE_LEVEL: Record<Role, number> = {
  super_admin: 4,
  admin: 3,
  editor: 2,
  viewer: 1,
}

async function getUserRole(c: Context<{ Bindings: AppBindings }>): Promise<Role | null> {
  const session = await readAdminSession(c)
  if (!session?.email) return null

  const row = await c.env.DB.prepare('SELECT role, is_active FROM admin_users WHERE email = ?')
    .bind(session.email.toLowerCase())
    .first<{ role: string; is_active: number }>()

  if (!row || row.is_active !== 1) return null
  return (row.role as Role) ?? 'viewer'
}

export function requireRole(minRole: Role) {
  return async (c: Context<{ Bindings: AppBindings }>, next: () => Promise<void>) => {
    const mode = c.env.ADMIN_ACCESS_MODE ?? 'hybrid'
    if (mode === 'off') { await next(); return }

    const url = new URL(c.req.url)
    const host = url.hostname
    if (host === 'localhost' || host === '127.0.0.1') { await next(); return }

    const role = await getUserRole(c)

    if (!role) {
      c.res = jsonError(c, 401, 'Authentication required')
      return
    }

    const userLevel = ROLE_LEVEL[role] ?? 0
    const requiredLevel = ROLE_LEVEL[minRole] ?? 0

    if (userLevel < requiredLevel) {
      c.res = jsonError(c, 403, `Requires ${minRole} role or higher`)
      return
    }

    await next()
  }
}
