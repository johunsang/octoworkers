import { agentsMiddleware } from 'hono-agents'
import { cors } from 'hono/cors'
import { etag } from 'hono/etag'
import { Hono } from 'hono'
import { serveBoundAsset } from './com/assets'
import type { AppBindings } from './com/bindings'
import { OpsAgent } from './biz/agt/ops-agent'
import { agentRoutes } from './biz/agt/routes'
import { applySecurityHeaders, enforceAdminAccess } from './com/security'
import { requireRole } from './com/rbac'
import { aiRoutes } from './biz/aid/routes'
import { authRoutes } from './biz/aut/routes'
import { dashboardRoutes } from './biz/dsh/routes'
import { extRoutes } from './biz/ext/routes'
import { healthRoutes } from './biz/hlt/routes'
import { leadsRoutes } from './biz/led/routes'
import { mediaRoutes } from './biz/med/routes'
import { publicRoutes } from './biz/pub/routes'
import { searchRoutes } from './biz/srh/routes'
import { settingsRoutes } from './biz/set/routes'
import { emailRoutes } from './biz/eml/routes'
import { pageRoutes } from './biz/pag/routes'
import { vectorRoutes } from './biz/vec/routes'
import { userRoutes } from './biz/usr/routes'
import { logRoutes } from './biz/log/routes'
import { logApiRequest } from './biz/log/repository'
import { rateLimit } from './com/rate-limit'

export function createApp() {
  const app = new Hono<{ Bindings: AppBindings }>()

  app.use('*', applySecurityHeaders)
  app.use('*', enforceAdminAccess)
  app.use('/agents/*', agentsMiddleware())
  app.use('/api/*', cors({
    origin: (origin) => {
      const allowed = [
        'https://octoworkers.com',
        'https://admin.octoworkers.com',
        'https://app.octoworkers.com',
      ]
      if (!origin) return origin
      if (allowed.includes(origin)) return origin
      if (origin.startsWith('http://localhost:')) return origin
      return undefined
    },
    credentials: true,
  }))
  app.use('/api/*', etag())

  // H-3: Rate Limiting (로그인, 리드, 이메일, AI)
  app.use('/api/auth/login', rateLimit({ maxRequests: 10, windowSeconds: 60 }))
  app.use('/api/auth/github', rateLimit({ maxRequests: 10, windowSeconds: 60 }))
  app.use('/api/public/leads', rateLimit({ maxRequests: 5, windowSeconds: 60 }))
  app.use('/api/admin/email/send', rateLimit({ maxRequests: 10, windowSeconds: 60 }))
  app.use('/api/admin/ai/*', rateLimit({ maxRequests: 20, windowSeconds: 60 }))

  // API 요청 로깅 미들웨어
  app.use('/api/*', async (c, next) => {
    const start = Date.now()
    await next()
    const duration = Date.now() - start
    const path = new URL(c.req.url).pathname
    const ip = c.req.header('cf-connecting-ip') ?? c.req.header('x-forwarded-for') ?? ''
    try {
      await logApiRequest(c.env.DB, c.req.method, path, c.res.status, duration, undefined, undefined, ip)
    } catch {
      // 로깅 실패 무시
    }
  })

  // SEO: robots.txt
  app.get('/robots.txt', (c) => {
    const domain = c.env.APP_DOMAIN ?? 'octoworkers.com'
    return c.text(`User-agent: *\nAllow: /\nDisallow: /api/admin/\nDisallow: /admin/\n\nSitemap: https://${domain}/sitemap.xml`)
  })

  // SEO: sitemap.xml
  app.get('/sitemap.xml', async (c) => {
    const domain = c.env.APP_DOMAIN ?? 'octoworkers.com'
    const saas = c.env.SAAS_DOMAIN ?? `app.${domain}`
    let urls = `  <url><loc>https://${domain}</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>\n`
    try {
      const { results } = await c.env.DB.prepare("SELECT slug, updated_at FROM pages WHERE status = 'published' ORDER BY updated_at DESC").all<{ slug: string; updated_at: string }>()
      for (const p of results) {
        const lastmod = p.updated_at?.split(' ')[0] ?? ''
        urls += `  <url><loc>https://${saas}/${p.slug}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}<changefreq>weekly</changefreq><priority>0.8</priority></url>\n`
      }
    } catch { /* ignore */ }
    return c.body(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}</urlset>`, 200, { 'Content-Type': 'application/xml' })
  })

  // 공개 API (인증/역할 불필요)
  app.route('/api/health', healthRoutes)
  app.route('/api/auth', authRoutes)
  app.route('/api/public', publicRoutes)

  // M-4: role 기반 권한 — viewer (읽기 전용)
  app.use('/api/admin/dashboard', requireRole('viewer'))
  app.use('/api/admin/search', requireRole('viewer'))
  app.use('/api/admin/logs/*', requireRole('viewer'))

  // M-4: role 기반 권한 — editor (콘텐츠 수정)
  app.use('/api/admin/settings', requireRole('editor'))
  app.use('/api/admin/leads/*', requireRole('editor'))
  app.use('/api/admin/images/*', requireRole('editor'))
  app.use('/api/admin/email/*', requireRole('editor'))
  app.use('/api/admin/pages/*', requireRole('editor'))
  app.use('/api/admin/ai/*', requireRole('editor'))
  app.use('/api/admin/vec/*', requireRole('editor'))
  app.use('/api/admin/agt/*', requireRole('editor'))
  app.use('/api/admin/ext/*', requireRole('editor'))

  // M-4: role 기반 권한 — admin (사용자 관리)
  app.use('/api/admin/users/*', requireRole('admin'))

  app.route('/api/admin/dashboard', dashboardRoutes)
  app.route('/api/admin/settings', settingsRoutes)
  app.route('/api/admin/leads', leadsRoutes)
  app.route('/api/admin/images', mediaRoutes)
  app.route('/api/admin/ai', aiRoutes)
  app.route('/api/admin/agt', agentRoutes)
  app.route('/api/admin/search', searchRoutes)
  app.route('/api/admin/vec', vectorRoutes)
  app.route('/api/admin/email', emailRoutes)
  app.route('/api/admin/pages', pageRoutes)
  app.route('/api/admin/ext', extRoutes)
  app.route('/api/admin/users', userRoutes)
  app.route('/api/admin/logs', logRoutes)

  app.all('*', async (c) => serveBoundAsset(c))

  return app
}

const app = createApp()

export { OpsAgent }
export default app
