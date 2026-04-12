import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import type { AppBindings } from '../../com/bindings'
import * as repo from './repository'

const app = new Hono<{ Bindings: AppBindings }>()

function parseId(raw: string): number | null {
  const n = Number(raw)
  return Number.isInteger(n) && n > 0 ? n : null
}

const userSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  role: z.enum(['super_admin', 'admin', 'editor', 'viewer']),
})

const updateSchema = z.object({
  name: z.string().min(1).max(100),
  role: z.enum(['super_admin', 'admin', 'editor', 'viewer']),
})

app.get('/', async (c) => {
  const users = await repo.listUsers(c.env.DB)
  return c.json(users.map((u) => ({
    id: u.id, email: u.email, name: u.name, role: u.role,
    avatarUrl: u.avatar_url, githubLogin: u.github_login,
    lastLoginAt: u.last_login_at, isActive: u.is_active === 1,
    createdAt: u.created_at, updatedAt: u.updated_at,
  })))
})

app.get('/:id', async (c) => {
  const id = parseId(c.req.param('id'))
  if (!id) return c.json({ message: 'Invalid user ID' }, 400)
  const user = await repo.getUserById(c.env.DB, id)
  if (!user) return c.json({ message: 'User not found' }, 404)
  return c.json({
    id: user.id, email: user.email, name: user.name, role: user.role,
    avatarUrl: user.avatar_url, githubLogin: user.github_login,
    lastLoginAt: user.last_login_at, isActive: user.is_active === 1,
    createdAt: user.created_at, updatedAt: user.updated_at,
  })
})

app.post('/', zValidator('json', userSchema), async (c) => {
  const { email, name, role } = c.req.valid('json')
  await repo.createUser(c.env.DB, email, name, role)
  return c.json({ ok: true }, 201)
})

app.put('/:id', zValidator('json', updateSchema), async (c) => {
  const id = parseId(c.req.param('id'))
  if (!id) return c.json({ message: 'Invalid user ID' }, 400)
  const { name, role } = c.req.valid('json')
  await repo.updateUser(c.env.DB, id, name, role)
  return c.json({ ok: true })
})

app.put('/:id/toggle', async (c) => {
  const id = parseId(c.req.param('id'))
  if (!id) return c.json({ message: 'Invalid user ID' }, 400)
  const user = await repo.getUserById(c.env.DB, id)
  if (!user) return c.json({ message: 'User not found' }, 404)
  await repo.toggleUserActive(c.env.DB, id, user.is_active === 0)
  return c.json({ ok: true })
})

app.delete('/:id', async (c) => {
  const delId = parseId(c.req.param('id'))
  if (!delId) return c.json({ message: 'Invalid user ID' }, 400)
  await repo.deleteUser(c.env.DB, delId)
  return c.json({ ok: true })
})

export { app as userRoutes }
