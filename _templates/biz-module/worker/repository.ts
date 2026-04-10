// ━━━ 새 비즈니스 모듈 리포지토리 템플릿 ━━━
// 복사 후 __ITEM__ / __item__ / __items__ 를 실제 이름으로 치환하세요.
// contracts.ts 에 __ITEM__Record 타입도 함께 정의하세요.

import type { D1DatabaseLike } from '../../com/bindings'
import { allRows, isoNow } from '../../com/db'

// ── D1 row 타입 (DB 컬럼 매핑) ──

type __ITEM__Row = {
  id: number
  title: string
  status: string
  created_at: string
  updated_at: string
}

// ── contracts 타입으로 변환 ──

// import type { __ITEM__Record } from '@octoworkers/com'
// function map__ITEM__(row: __ITEM__Row): __ITEM__Record {
//   return {
//     id: row.id,
//     title: row.title,
//     status: row.status,
//     createdAt: row.created_at,
//     updatedAt: row.updated_at,
//   }
// }

// ── 쿼리 함수 ──

export async function list__ITEM__s(db: D1DatabaseLike, limit = 20) {
  return allRows<__ITEM__Row>(
    db.prepare(
      `SELECT id, title, status, created_at, updated_at
       FROM __items__
       ORDER BY id DESC
       LIMIT ?`,
    ).bind(limit),
  )
}

export async function get__ITEM__(db: D1DatabaseLike, id: number) {
  return db
    .prepare(
      `SELECT id, title, status, created_at, updated_at
       FROM __items__
       WHERE id = ?`,
    )
    .bind(id)
    .first<__ITEM__Row>()
}

export async function create__ITEM__(
  db: D1DatabaseLike,
  input: { title: string },
) {
  const now = isoNow()
  await db
    .prepare(
      `INSERT INTO __items__ (title, status, created_at, updated_at)
       VALUES (?, 'active', ?, ?)`,
    )
    .bind(input.title, now, now)
    .run()
}

export async function update__ITEM__(
  db: D1DatabaseLike,
  id: number,
  input: { title?: string },
) {
  const existing = await get__ITEM__(db, id)
  if (!existing) return null

  const now = isoNow()
  await db
    .prepare(
      `UPDATE __items__
       SET title = ?, updated_at = ?
       WHERE id = ?`,
    )
    .bind(input.title ?? existing.title, now, id)
    .run()

  return get__ITEM__(db, id)
}

export async function delete__ITEM__(db: D1DatabaseLike, id: number) {
  await db.prepare('DELETE FROM __items__ WHERE id = ?').bind(id).run()
}

export async function __item__Count(db: D1DatabaseLike) {
  const row = await db
    .prepare('SELECT COUNT(*) AS count FROM __items__')
    .first<{ count: number }>()
  return row?.count ?? 0
}
