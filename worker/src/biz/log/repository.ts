import type { D1DatabaseLike as D1Database } from '../../com/bindings'
import { isoNow, allRows } from '../../com/db'

export type AccessLogRow = {
  id: number
  user_email: string
  action: string
  path: string
  method: string
  status_code: number | null
  ip_address: string | null
  user_agent: string | null
  created_at: string
}

export type ApiLogRow = {
  id: number
  method: string
  path: string
  status_code: number
  duration_ms: number | null
  request_body: string | null
  response_size: number | null
  ip_address: string | null
  created_at: string
}

export async function logAccess(db: D1Database, userEmail: string, action: string, path: string, method: string, statusCode?: number, ipAddress?: string, userAgent?: string) {
  await db.prepare('INSERT INTO access_logs (user_email, action, path, method, status_code, ip_address, user_agent, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(userEmail, action, path, method, statusCode ?? null, ipAddress ?? null, userAgent ?? null, isoNow()).run()
}

export async function logApiRequest(db: D1Database, method: string, path: string, statusCode: number, durationMs?: number, requestBody?: string, responseSize?: number, ipAddress?: string) {
  await db.prepare('INSERT INTO api_logs (method, path, status_code, duration_ms, request_body, response_size, ip_address, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(method, path, statusCode, durationMs ?? null, requestBody ?? null, responseSize ?? null, ipAddress ?? null, isoNow()).run()
}

export async function listAccessLogs(db: D1Database, limit = 50) {
  return allRows<AccessLogRow>(db.prepare('SELECT * FROM access_logs ORDER BY created_at DESC LIMIT ?').bind(limit))
}

export async function listApiLogs(db: D1Database, limit = 50) {
  return allRows<ApiLogRow>(db.prepare('SELECT * FROM api_logs ORDER BY created_at DESC LIMIT ?').bind(limit))
}

export async function apiLogCount(db: D1Database) {
  const row = await db.prepare('SELECT COUNT(*) as count FROM api_logs').first<{ count: number }>()
  return row?.count ?? 0
}

export async function accessLogsByUser(db: D1Database, email: string, limit = 20) {
  return allRows<AccessLogRow>(db.prepare('SELECT * FROM access_logs WHERE user_email = ? ORDER BY created_at DESC LIMIT ?').bind(email, limit))
}
