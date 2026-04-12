import type { D1DatabaseLike as D1Database } from '../../com/bindings'
import { isoNow, allRows } from '../../com/db'

type UserRow = {
  id: number
  email: string
  name: string
  role: string
  avatar_url: string | null
  github_login: string | null
  last_login_at: string | null
  is_active: number
  created_at: string
  updated_at: string
}

export async function listUsers(db: D1Database) {
  return allRows<UserRow>(db.prepare('SELECT * FROM admin_users ORDER BY created_at DESC'))
}

export async function getUserByEmail(db: D1Database, email: string) {
  return db.prepare('SELECT * FROM admin_users WHERE email = ?').bind(email).first<UserRow>()
}

export async function getUserById(db: D1Database, id: number) {
  return db.prepare('SELECT * FROM admin_users WHERE id = ?').bind(id).first<UserRow>()
}

export async function createUser(db: D1Database, email: string, name: string, role: string) {
  const now = isoNow()
  await db.prepare('INSERT INTO admin_users (email, name, role, is_active, created_at, updated_at) VALUES (?, ?, ?, 1, ?, ?)')
    .bind(email, name, role, now, now).run()
}

export async function updateUser(db: D1Database, id: number, name: string, role: string) {
  await db.prepare('UPDATE admin_users SET name = ?, role = ?, updated_at = ? WHERE id = ?')
    .bind(name, role, isoNow(), id).run()
}

export async function toggleUserActive(db: D1Database, id: number, isActive: boolean) {
  await db.prepare('UPDATE admin_users SET is_active = ?, updated_at = ? WHERE id = ?')
    .bind(isActive ? 1 : 0, isoNow(), id).run()
}

export async function updateLastLogin(db: D1Database, email: string, githubLogin?: string, avatarUrl?: string) {
  const now = isoNow()
  const user = await getUserByEmail(db, email)
  if (user) {
    await db.prepare('UPDATE admin_users SET last_login_at = ?, github_login = COALESCE(?, github_login), avatar_url = COALESCE(?, avatar_url), updated_at = ? WHERE email = ?')
      .bind(now, githubLogin ?? null, avatarUrl ?? null, now, email).run()
  } else {
    await db.prepare('INSERT INTO admin_users (email, name, role, github_login, avatar_url, last_login_at, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?)')
      .bind(email, githubLogin ?? email, 'viewer', githubLogin ?? null, avatarUrl ?? null, now, now, now).run()
  }
}

export async function deleteUser(db: D1Database, id: number) {
  await db.prepare('DELETE FROM admin_users WHERE id = ?').bind(id).run()
}

export async function userCount(db: D1Database) {
  const row = await db.prepare('SELECT COUNT(*) as count FROM admin_users').first<{ count: number }>()
  return row?.count ?? 0
}

export async function activeUserCount(db: D1Database) {
  const row = await db.prepare('SELECT COUNT(*) as count FROM admin_users WHERE is_active = 1').first<{ count: number }>()
  return row?.count ?? 0
}
