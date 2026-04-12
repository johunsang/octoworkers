import { useEffect, useState } from 'react'
import type { AccessLog, ApiLog, SystemStats } from '@octoworkers/com'
import { apiFetch } from '../../../com/api/client'

export function useAccessLogs() {
  const [logs, setLogs] = useState<AccessLog[]>([])
  useEffect(() => { apiFetch<AccessLog[]>('/api/admin/logs/access?limit=30').then(setLogs).catch(() => {}) }, [])
  return { logs }
}

export function useApiLogs() {
  const [logs, setLogs] = useState<ApiLog[]>([])
  useEffect(() => { apiFetch<ApiLog[]>('/api/admin/logs/api?limit=30').then(setLogs).catch(() => {}) }, [])
  return { logs }
}

export function useSystemStats() {
  const [stats, setStats] = useState<SystemStats | null>(null)
  useEffect(() => { apiFetch<SystemStats>('/api/admin/logs/stats').then(setStats).catch(() => {}) }, [])
  return { stats }
}
