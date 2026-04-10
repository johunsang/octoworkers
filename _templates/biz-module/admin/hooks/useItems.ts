// ━━━ 새 비즈니스 모듈 React 훅 템플릿 ━━━
// 복사 후 __ITEM__ / __item__ / __items__ 를 실제 이름으로 치환하세요.
// import 경로도 실제 모듈 위치에 맞게 수정하세요.

import { useEffect, useState, useCallback } from 'react'
import { apiFetch } from '../../../com/api/client'

// import type { __ITEM__Record } from '@octoworkers/com'

type __ITEM__Record = {
  id: number
  title: string
  status: string
  createdAt: string
}

export function use__ITEM__s() {
  const [items, setItems] = useState<__ITEM__Record[]>([])
  const [loading, setLoading] = useState(true)

  const reload = useCallback(async () => {
    setLoading(true)
    try {
      const data = await apiFetch<__ITEM__Record[]>('/api/admin/__items__')
      setItems(data)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  const create = async (input: { title: string }) => {
    await apiFetch('/api/admin/__items__', {
      method: 'POST',
      body: JSON.stringify(input),
    })
    await reload()
  }

  const update = async (id: number, input: { title?: string }) => {
    await apiFetch(`/api/admin/__items__/${id}`, {
      method: 'PUT',
      body: JSON.stringify(input),
    })
    await reload()
  }

  const remove = async (id: number) => {
    await apiFetch(`/api/admin/__items__/${id}`, {
      method: 'DELETE',
    })
    await reload()
  }

  return { items, loading, create, update, remove, reload }
}
