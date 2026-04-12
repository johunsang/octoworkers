import type { Context } from 'hono'
import type { AppBindings } from './bindings'
import { jsonError } from './http'

type RateLimitOptions = {
  maxRequests: number
  windowSeconds: number
}

export function rateLimit(opts: RateLimitOptions) {
  return async (c: Context<{ Bindings: AppBindings }>, next: () => Promise<void>) => {
    const ip = c.req.header('cf-connecting-ip') ?? c.req.header('x-forwarded-for') ?? 'unknown'
    const path = new URL(c.req.url).pathname
    const key = `rl:${ip}:${path}`

    if (!c.env.APP_KV) { await next(); return }

    try {
      const current = await c.env.APP_KV.get(key)
      const count = current ? Number(current) : 0

      if (count >= opts.maxRequests) {
        c.res = jsonError(c, 429, 'Too many requests. Please try again later.')
        return
      }

      await c.env.APP_KV.put(key, String(count + 1), { expirationTtl: opts.windowSeconds })
    } catch {
      // KV 오류 시 요청 통과 (가용성 우선)
    }

    await next()
  }
}
