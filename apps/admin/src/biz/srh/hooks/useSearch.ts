import { useState } from 'react'
import { apiFetch } from '../../../com/api/client'

type SearchResults = {
  leads: Array<{
    id: number
    name: string
    email: string
    company: string | null
  }>
  media: Array<{
    image_id: string
    title: string
    alt: string | null
  }>
}

export function useSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResults>({ leads: [], media: [] })

  async function search() {
    const response = await apiFetch<SearchResults>(`/api/admin/search?q=${encodeURIComponent(query)}`)
    setResults(response)
  }

  return { query, setQuery, results, search }
}
