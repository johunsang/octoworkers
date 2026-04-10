import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import type { AppBindings } from '../../com/bindings'
import { createDirectUpload as requestDirectUpload, deleteImage, fetchImageDetails } from './images'
import { createDraftMedia, deleteMedia, listMedia, refreshMedia, updateMediaMeta } from './repository'

const directUploadSchema = z.object({
  title: z.string().min(2),
  alt: z.string().optional(),
})

const updateMediaSchema = z.object({
  title: z.string().min(2),
  alt: z.string().optional(),
})

export const mediaRoutes = new Hono<{ Bindings: AppBindings }>()

mediaRoutes.get('/', async (c) => {
  return c.json(await listMedia(c.env.DB))
})

mediaRoutes.post('/direct-upload', zValidator('json', directUploadSchema), async (c) => {
  const payload = c.req.valid('json')
  const directUpload = await requestDirectUpload(c.env, payload)
  await createDraftMedia(c.env.DB, { ...directUpload, ...payload })
  return c.json(directUpload, 201)
})

mediaRoutes.post('/:imageId/refresh', async (c) => {
  const imageId = c.req.param('imageId')
  const details = await fetchImageDetails(c.env, imageId)
  await refreshMedia(c.env.DB, details)
  return c.json(details)
})

mediaRoutes.put('/:imageId', zValidator('json', updateMediaSchema), async (c) => {
  const imageId = c.req.param('imageId')
  const payload = c.req.valid('json')
  await updateMediaMeta(c.env.DB, { imageId, ...payload })
  return c.json({ ok: true })
})

mediaRoutes.delete('/:imageId', async (c) => {
  const imageId = c.req.param('imageId')
  await deleteImage(c.env, imageId)
  await deleteMedia(c.env.DB, imageId)
  return c.json({ ok: true })
})
