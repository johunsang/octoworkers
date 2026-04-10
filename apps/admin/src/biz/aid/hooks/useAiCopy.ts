import { useState } from 'react'
import type { AiCopySuggestion, AiCopySuggestionRequest } from '@octoworkers/com'
import { apiFetch } from '../../../com/api/client'

export function useAiCopy() {
  const [loading, setLoading] = useState(false)
  const [suggestion, setSuggestion] = useState<AiCopySuggestion | null>(null)

  async function generate(payload: AiCopySuggestionRequest) {
    setLoading(true)
    try {
      const result = await apiFetch<AiCopySuggestion>('/api/admin/ai/copy', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      setSuggestion(result)
    } finally {
      setLoading(false)
    }
  }

  return { loading, suggestion, generate }
}
