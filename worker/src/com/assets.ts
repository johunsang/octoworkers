import type { Context } from 'hono'
import type { AppBindings } from './bindings'
import { normalizeHost } from './env'

function appPrefix(c: Context<{ Bindings: AppBindings }>) {
  const url = new URL(c.req.url)
  return normalizeHost(url.hostname) === normalizeHost(c.env.ADMIN_DOMAIN) ? '/admin' : '/landing'
}

export async function serveBoundAsset(c: Context<{ Bindings: AppBindings }>) {
  const url = new URL(c.req.url)
  const prefix = appPrefix(c)
  const requestedPath = url.pathname === '/' ? '/index.html' : url.pathname

  const assetRequest = new Request(new URL(`${prefix}${requestedPath}`, url), c.req.raw)
  const assetResponse = await c.env.ASSETS.fetch(assetRequest)

  if (assetResponse.status !== 404) {
    return assetResponse
  }

  const fallbackRequest = new Request(new URL(`${prefix}/index.html`, url), c.req.raw)
  return c.env.ASSETS.fetch(fallbackRequest)
}
