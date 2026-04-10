// ━━━ contracts.ts에 추가할 공유 타입 템플릿 ━━━
// 아래 내용을 packages/com/src/contracts.ts 하단에 추가하세요.
// __ITEM__ / __item__ 를 실제 이름으로 치환하세요.

export type __ITEM__Record = {
  id: number
  title: string
  status: string
  createdAt: string
  updatedAt: string
}

export type Create__ITEM__Input = {
  title: string
  // 필요한 필드 추가
}

export type Update__ITEM__Input = {
  title?: string
  // 필요한 필드 추가
}
