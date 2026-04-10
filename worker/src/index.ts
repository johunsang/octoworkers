import { agentsMiddleware } from 'hono-agents'
import { cors } from 'hono/cors'
import { etag } from 'hono/etag'
import { Hono } from 'hono'
import { serveBoundAsset } from './com/assets'
import type { AppBindings } from './com/bindings'
import { OpsAgent } from './biz/agt/ops-agent'
import { agentRoutes } from './biz/agt/routes'
import { applySecurityHeaders, enforceAdminAccess } from './com/security'
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

export function createApp() {
  const app = new Hono<{ Bindings: AppBindings }>()

  app.use('*', applySecurityHeaders)
  app.use('*', enforceAdminAccess)
  app.use('/agents/*', agentsMiddleware())
  app.use('/api/*', cors())
  app.use('/api/*', etag())

  app.route('/api/health', healthRoutes)
  app.route('/api/auth', authRoutes)
  app.route('/api/public', publicRoutes)
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

  app.all('*', async (c) => serveBoundAsset(c))

  return app
}

const app = createApp()

export { OpsAgent }
export default app
