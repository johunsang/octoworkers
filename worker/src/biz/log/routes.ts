import { Hono } from 'hono'
import type { AppBindings } from '../../com/bindings'
import * as repo from './repository'
import type { AccessLogRow, ApiLogRow } from './repository'
import * as usrRepo from '../usr/repository'
import { leadCount } from '../led/repository'

const app = new Hono<{ Bindings: AppBindings }>()

// 접속 로그 목록
app.get('/access', async (c) => {
  const limit = Number(c.req.query('limit') ?? '50')
  const logs = await repo.listAccessLogs(c.env.DB, limit)
  return c.json(logs.map((l) => ({
    id: l.id, userEmail: l.user_email, action: l.action, path: l.path,
    method: l.method, statusCode: l.status_code, ipAddress: l.ip_address,
    userAgent: l.user_agent, createdAt: l.created_at,
  })))
})

// API 로그 목록
app.get('/api', async (c) => {
  const limit = Number(c.req.query('limit') ?? '50')
  const logs = await repo.listApiLogs(c.env.DB, limit)
  return c.json(logs.map((l) => ({
    id: l.id, method: l.method, path: l.path, statusCode: l.status_code,
    durationMs: l.duration_ms, requestBody: l.request_body,
    responseSize: l.response_size, ipAddress: l.ip_address, createdAt: l.created_at,
  })))
})

// 시스템 통계
app.get('/stats', async (c) => {
  const [totalUsers, activeUsers, totalLeads, totalApiRequests, accessLogs, apiLogs] = await Promise.all([
    usrRepo.userCount(c.env.DB),
    usrRepo.activeUserCount(c.env.DB),
    leadCount(c.env.DB),
    repo.apiLogCount(c.env.DB),
    repo.listAccessLogs(c.env.DB, 10),
    repo.listApiLogs(c.env.DB, 10),
  ])

  const totalMedia = (await c.env.DB.prepare('SELECT COUNT(*) as count FROM media_assets').first<{ count: number }>())?.count ?? 0
  const totalPages = (await c.env.DB.prepare('SELECT COUNT(*) as count FROM pages').first<{ count: number }>())?.count ?? 0
  const totalEmails = (await c.env.DB.prepare('SELECT COUNT(*) as count FROM email_logs').first<{ count: number }>())?.count ?? 0

  return c.json({
    totalUsers,
    activeUsers,
    totalLeads,
    totalMedia,
    totalPages,
    totalEmails,
    totalApiRequests,
    recentAccessLogs: accessLogs.map((l: AccessLogRow) => ({
      id: l.id, userEmail: l.user_email, action: l.action, path: l.path,
      method: l.method, statusCode: l.status_code, ipAddress: l.ip_address,
      userAgent: l.user_agent, createdAt: l.created_at,
    })),
    recentApiLogs: apiLogs.map((l: ApiLogRow) => ({
      id: l.id, method: l.method, path: l.path, statusCode: l.status_code,
      durationMs: l.duration_ms, ipAddress: l.ip_address, createdAt: l.created_at,
    })),
  })
})

export { app as logRoutes }
