import { useEffect, useState } from 'react'
import type { AdminUser } from '@octoworkers/com'
import { apiFetch } from '../../../com/api/client'

export function useUsers() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchUsers() {
    try {
      const data = await apiFetch<AdminUser[]>('/api/admin/users')
      setUsers(data)
    } catch { /* ignore */ }
    setLoading(false)
  }

  useEffect(() => { fetchUsers() }, [])

  async function createUser(email: string, name: string, role: string) {
    await apiFetch('/api/admin/users', { method: 'POST', body: JSON.stringify({ email, name, role }) })
    await fetchUsers()
  }

  async function updateUser(id: number, name: string, role: string) {
    await apiFetch(`/api/admin/users/${id}`, { method: 'PUT', body: JSON.stringify({ name, role }) })
    await fetchUsers()
  }

  async function toggleUser(id: number) {
    await apiFetch(`/api/admin/users/${id}/toggle`, { method: 'PUT' })
    await fetchUsers()
  }

  async function deleteUser(id: number) {
    await apiFetch(`/api/admin/users/${id}`, { method: 'DELETE' })
    await fetchUsers()
  }

  return { users, loading, createUser, updateUser, toggleUser, deleteUser }
}
