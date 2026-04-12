import type { Context } from 'hono'
import type { AppBindings } from './bindings'
import { normalizeHost } from './env'

function appPrefix(c: Context<{ Bindings: AppBindings }>) {
  const url = new URL(c.req.url)
  if (normalizeHost(url.hostname) === normalizeHost(c.env.ADMIN_DOMAIN)) return '/admin'
  if (url.pathname.startsWith('/admin')) return '/admin'
  return '/landing'
}

export async function serveBoundAsset(c: Context<{ Bindings: AppBindings }>) {
  const url = new URL(c.req.url)
  const prefix = appPrefix(c)

  // 루트 또는 SPA 경로 → index.html 직접 서빙
  if (url.pathname === '/' || url.pathname === '') {
    return serveIndex(c, url, prefix)
  }

  // /admin/ 또는 /landing/ prefix가 있는 에셋 요청은 그대로 전달
  if (url.pathname.startsWith('/admin/') || url.pathname.startsWith('/landing/')) {
    const res = await c.env.ASSETS.fetch(new Request(new URL(url.pathname, url), c.req.raw))
    if (res.status !== 404 && res.status !== 307) return res
    return serveIndex(c, url, prefix)
  }

  // /assets/..., /favicon.svg 등 → prefix 붙여서 찾기
  const prefixedPath = `${prefix}${url.pathname}`
  const res = await c.env.ASSETS.fetch(new Request(new URL(prefixedPath, url), c.req.raw))
  if (res.status !== 404 && res.status !== 307) return res

  // SPA fallback
  return serveIndex(c, url, prefix)
}

async function serveIndex(c: Context<{ Bindings: AppBindings }>, url: URL, prefix: string) {
  const indexPath = `${prefix}/index.html`
  const res = await c.env.ASSETS.fetch(new Request(new URL(indexPath, url), c.req.raw))
  // 307 리다이렉트를 받으면 body를 직접 반환
  if (res.status === 307 || res.status === 308) {
    const redirectUrl = res.headers.get('location')
    if (redirectUrl) {
      const finalRes = await c.env.ASSETS.fetch(new Request(redirectUrl, c.req.raw))
      return new Response(finalRes.body, {
        status: 200,
        headers: { 'content-type': 'text/html; charset=utf-8' },
      })
    }
  }
  return new Response(res.body, {
    status: 200,
    headers: { 'content-type': 'text/html; charset=utf-8' },
  })
}
