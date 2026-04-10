import { useEffect, useState } from 'react'
import type { PublicBootstrap } from '@octoworkers/com'
import { apiFetch } from '../../../com/api/client'

export function usePublicBootstrap() {
  const [data, setData] = useState<PublicBootstrap>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    apiFetch<PublicBootstrap>('/api/public/bootstrap')
      .then((result) => {
        if (mounted) {
          setData(result)
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false)
        }
      })

    return () => {
      mounted = false
    }
  }, [])

  return { data, loading }
}
