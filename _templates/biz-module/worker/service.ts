// ━━━ 새 비즈니스 모듈 서비스 템플릿 ━━━
// routes 와 repository 사이에 비즈니스 로직이 필요할 때 사용합니다.
// 단순 CRUD만 있다면 이 파일은 생략해도 됩니다.
//
// 복사 후 __ITEM__ / __item__ 를 실제 이름으로 치환하세요.

import type { D1DatabaseLike } from '../../com/bindings'
import { list__ITEM__s, create__ITEM__, __item__Count } from './repository'

// 예: 생성 시 중복 검사 + 카운트 제한
export async function safeCreate__ITEM__(
  db: D1DatabaseLike,
  input: { title: string },
  maxItems = 100,
) {
  const count = await __item__Count(db)
  if (count >= maxItems) {
    throw new Error(`__ITEM__ limit reached (${maxItems})`)
  }

  await create__ITEM__(db, input)
}

// 예: 통계 집계
export async function get__ITEM__Stats(db: D1DatabaseLike) {
  const count = await __item__Count(db)
  const items = await list__ITEM__s(db, 5)

  return {
    total: count,
    recent: items,
  }
}
