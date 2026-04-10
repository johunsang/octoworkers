import { zValidator } from '@hono/zod-validator'
import { upgradeWebSocket } from 'hono/cloudflare-workers'
import { Hono } from 'hono'
import { z } from 'zod'
import type { AppBindings } from '../../com/bindings'
import { generateTextWithWorkersAi, workersAiConfigured } from '../../com/workers-ai'
import { exampleCopyRequest } from './ai/exampleCopyRequest'
import { exampleDirectUploadInput } from './media/exampleDirectUploadInput'
import { exampleSemanticQuery } from './vec/exampleSemanticQuery'

const kvSchema = z.object({
  value: z.string().min(1),
  expirationTtl: z.number().int().positive().max(60 * 60 * 24 * 30).optional(),
})

export const extRoutes = new Hono<{ Bindings: AppBindings }>()

extRoutes.get('/img/example', (c) => {
  return c.json({
    image: exampleDirectUploadInput,
    api: {
      create: '/api/admin/images/direct-upload',
      refresh: '/api/admin/images/:imageId/refresh',
      update: '/api/admin/images/:imageId',
      delete: '/api/admin/images/:imageId',
    },
  })
})

extRoutes.get('/ai/example', (c) => {
  return c.json({
    ai: exampleCopyRequest,
    api: '/api/admin/ai/copy',
  })
})

extRoutes.get('/ai/workers', (c) => {
  return c.json({
    configured: workersAiConfigured(c.env),
    textModel: c.env.AI_TEXT_MODEL ?? null,
    embedModel: c.env.AI_EMBED_MODEL ?? null,
    vectorizeBound: Boolean(c.env.DOC_INDEX),
  })
})

extRoutes.post('/ai/text', async (c) => {
  try {
    const payload = await c.req.json<{ prompt?: string }>()
    const prompt = payload.prompt?.trim() || 'Give me three concise launch ideas for a Cloudflare-native SaaS product.'
    const output = await generateTextWithWorkersAi(c.env, [
      {
        role: 'system',
        content: 'You are a product strategist. Return concise, actionable answers.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ])

    return c.json({ prompt, output })
  } catch (error) {
    return c.json({ message: error instanceof Error ? error.message : 'Workers AI text call failed' }, 503)
  }
})

extRoutes.get('/agt/example', (c) => {
  return c.json({
    agent: 'OpsAgent',
    agentPath: '/agents/OpsAgent/admin-ops',
    adminApi: {
      snapshot: '/api/admin/agt',
      createTask: '/api/admin/agt/tasks',
      completeTask: '/api/admin/agt/tasks/:id/complete',
      addNote: '/api/admin/agt/notes',
      summarize: '/api/admin/agt/summarize',
    },
    callableMethods: ['addTask', 'completeTask', 'addNote', 'listTasks', 'summarizeTasks'],
  })
})

extRoutes.get('/vec/example', (c) => {
  return c.json({
    vectorize: exampleSemanticQuery,
    apis: {
      reindex: '/api/admin/vec/reindex',
      search: '/api/admin/vec/search',
    },
  })
})

extRoutes.get('/kv', async (c) => {
  const list = await c.env.APP_KV.list({ prefix: 'example:', limit: 20 })
  return c.json({
    keys: list.keys.map((item) => item.name),
  })
})

extRoutes.get('/kv/:key', async (c) => {
  const key = `example:${c.req.param('key')}`
  const value = await c.env.APP_KV.get(key)
  return c.json({ key, value })
})

extRoutes.put('/kv/:key', zValidator('json', kvSchema), async (c) => {
  const key = `example:${c.req.param('key')}`
  const payload = c.req.valid('json')
  await c.env.APP_KV.put(key, payload.value, {
    expirationTtl: payload.expirationTtl,
  })
  return c.json({ ok: true, key })
})

extRoutes.delete('/kv/:key', async (c) => {
  const key = `example:${c.req.param('key')}`
  await c.env.APP_KV.delete(key)
  return c.json({ ok: true, key })
})

extRoutes.get('/r2/:key', async (c) => {
  if (!c.env.MEDIA_R2) {
    return c.json({ message: 'MEDIA_R2 binding is not configured' }, 503)
  }

  const key = `example/${c.req.param('key')}`
  const object = await c.env.MEDIA_R2.get(key)
  return c.json({
    key,
    value: object ? await object.text() : null,
  })
})

extRoutes.put('/r2/:key', zValidator('json', kvSchema), async (c) => {
  if (!c.env.MEDIA_R2) {
    return c.json({ message: 'MEDIA_R2 binding is not configured' }, 503)
  }

  const key = `example/${c.req.param('key')}`
  const payload = c.req.valid('json')
  await c.env.MEDIA_R2.put(key, payload.value)
  return c.json({ ok: true, key })
})

extRoutes.delete('/r2/:key', async (c) => {
  if (!c.env.MEDIA_R2) {
    return c.json({ message: 'MEDIA_R2 binding is not configured' }, 503)
  }

  const key = `example/${c.req.param('key')}`
  await c.env.MEDIA_R2.delete(key)
  return c.json({ ok: true, key })
})

extRoutes.get(
  '/rtm/ws',
  upgradeWebSocket(() => {
    return {
      onMessage(event, ws) {
        ws.send(
          JSON.stringify({
            type: 'echo',
            message: String(event.data),
            at: new Date().toISOString(),
          }),
        )
      },
    }
  }),
)
