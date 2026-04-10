import { useEffect, useState } from 'react'
import { apiFetch } from '../../../com/api/client'

type SessionUser = {
  email: string
}

export function useAuth() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<SessionUser | null>(null)

  async function refresh() {
    try {
      const me = await apiFetch<SessionUser>('/api/auth/me')
      setUser(me)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  async function login(email: string, password: string) {
    await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    await refresh()
  }

  async function logout() {
    await apiFetch('/api/auth/logout', {
      method: 'POST',
    })
    setUser(null)
  }

  return { loading, user, login, logout }
}
