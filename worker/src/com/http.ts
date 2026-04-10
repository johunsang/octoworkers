import type { Context } from 'hono'

export function jsonError(c: Context, status: number, message: string) {
  return new Response(JSON.stringify({ message }), {
    status,
    headers: {
      'content-type': 'application/json',
    },
  })
}
