// ━━━ 새 비즈니스 모듈 라우트 템플릿 ━━━
// 복사 후 __ITEM__ / __item__ / __items__ 를 실제 이름으로 치환하세요.
// 예: __ITEM__ → Notification, __item__ → notification, __items__ → notifications

import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import type { AppBindings } from '../../com/bindings'
import { jsonError } from '../../com/http'
import { list__ITEM__s, create__ITEM__, get__ITEM__, update__ITEM__, delete__ITEM__ } from './repository'

const create__ITEM__Schema = z.object({
  title: z.string().min(1),
  // 필요한 필드 추가
})

const update__ITEM__Schema = z.object({
  title: z.string().min(1).optional(),
  // 필요한 필드 추가
})

export const __item__Routes = new Hono<{ Bindings: AppBindings }>()

// 목록 조회
__item__Routes.get('/', async (c) => {
  const items = await list__ITEM__s(c.env.DB)
  return c.json(items)
})

// 단건 조회
__item__Routes.get('/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const item = await get__ITEM__(c.env.DB, id)
  if (!item) return jsonError(c, 404, '__ITEM__ not found')
  return c.json(item)
})

// 생성
__item__Routes.post('/', zValidator('json', create__ITEM__Schema), async (c) => {
  const input = c.req.valid('json')
  await create__ITEM__(c.env.DB, input)
  return c.json({ ok: true }, 201)
})

// 수정
__item__Routes.put('/:id', zValidator('json', update__ITEM__Schema), async (c) => {
  const id = Number(c.req.param('id'))
  const input = c.req.valid('json')
  const updated = await update__ITEM__(c.env.DB, id, input)
  if (!updated) return jsonError(c, 404, '__ITEM__ not found')
  return c.json(updated)
})

// 삭제
__item__Routes.delete('/:id', async (c) => {
  const id = Number(c.req.param('id'))
  await delete__ITEM__(c.env.DB, id)
  return c.json({ ok: true })
})
