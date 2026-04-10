// ━━━ 새 비즈니스 모듈 패널 컴포넌트 템플릿 ━━━
// 복사 후 __ITEM__ / __item__ / __items__ 를 실제 이름으로 치환하세요.

import { useState } from 'react'
import { Panel } from '../../../com/ui/Panel'

type __ITEM__Record = {
  id: number
  title: string
  status: string
  createdAt: string
}

type Props = {
  items: __ITEM__Record[]
  onCreate: (input: { title: string }) => Promise<void>
  onUpdate: (id: number, input: { title: string }) => Promise<void>
  onRemove: (id: number) => Promise<void>
}

export function __ITEM__Panel({ items, onCreate, onUpdate, onRemove }: Props) {
  const [newTitle, setNewTitle] = useState('')

  const handleCreate = async () => {
    if (!newTitle.trim()) return
    await onCreate({ title: newTitle.trim() })
    setNewTitle('')
  }

  return (
    <Panel eyebrow="biz/__item__" title="__ITEM__ 관리">
      {/* 생성 폼 */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="새 __item__ 제목"
          onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
        />
        <button onClick={handleCreate}>추가</button>
      </div>

      {/* 목록 */}
      {items.length === 0 && <p>아직 __item__ 이 없습니다.</p>}

      {items.map((item) => (
        <div key={item.id} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
          <span style={{ flex: 1 }}>
            <strong>{item.title}</strong>
            <small style={{ marginLeft: 8, opacity: 0.6 }}>{item.status}</small>
          </span>
          <button onClick={() => onUpdate(item.id, { title: `${item.title} (edited)` })}>수정</button>
          <button onClick={() => onRemove(item.id)}>삭제</button>
        </div>
      ))}
    </Panel>
  )
}
