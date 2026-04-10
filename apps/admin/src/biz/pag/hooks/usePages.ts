import { useCallback, useEffect, useState } from 'react'
import type { PageSummary, Page, PageInput } from '@octoworkers/com'
import { apiFetch } from '../../../com/api/client'

export function usePages() {
  const [pages, setPages] = useState<PageSummary[]>([])
  const [selectedPage, setSelectedPage] = useState<Page | null>(null)
  const [loading, setLoading] = useState(false)

  const refresh = useCallback(async () => {
    const data = await apiFetch<PageSummary[]>('/api/admin/pages')
    setPages(data)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const fetchPage = useCallback(async (id: number) => {
    setLoading(true)
    try {
      const page = await apiFetch<Page>(`/api/admin/pages/${id}`)
      setSelectedPage(page)
    } finally {
      setLoading(false)
    }
  }, [])

  const closePage = useCallback(() => {
    setSelectedPage(null)
  }, [])

  const create = useCallback(
    async (input: PageInput) => {
      await apiFetch('/api/admin/pages', {
        method: 'POST',
        body: JSON.stringify(input),
      })
      await refresh()
    },
    [refresh],
  )

  const update = useCallback(
    async (id: number, input: PageInput) => {
      await apiFetch(`/api/admin/pages/${id}`, {
        method: 'PUT',
        body: JSON.stringify(input),
      })
      await refresh()
      setSelectedPage(null)
    },
    [refresh],
  )

  const publish = useCallback(
    async (id: number) => {
      await apiFetch(`/api/admin/pages/${id}/publish`, { method: 'POST' })
      await refresh()
      if (selectedPage?.id === id) {
        setSelectedPage((prev) => (prev ? { ...prev, status: 'published' } : prev))
      }
    },
    [refresh, selectedPage],
  )

  const unpublish = useCallback(
    async (id: number) => {
      await apiFetch(`/api/admin/pages/${id}/unpublish`, { method: 'POST' })
      await refresh()
      if (selectedPage?.id === id) {
        setSelectedPage((prev) => (prev ? { ...prev, status: 'draft' } : prev))
      }
    },
    [refresh, selectedPage],
  )

  const remove = useCallback(
    async (id: number) => {
      await apiFetch(`/api/admin/pages/${id}`, { method: 'DELETE' })
      await refresh()
      if (selectedPage?.id === id) setSelectedPage(null)
    },
    [refresh, selectedPage],
  )

  return { pages, selectedPage, loading, fetchPage, closePage, create, update, publish, unpublish, remove }
}
