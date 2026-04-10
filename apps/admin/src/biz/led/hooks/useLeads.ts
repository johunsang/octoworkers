import { useCallback, useEffect, useState } from 'react'
import type { LeadRecord, LeadDetail, LeadStatus } from '@octoworkers/com'
import { apiFetch } from '../../../com/api/client'

export function useLeads() {
  const [leads, setLeads] = useState<LeadRecord[]>([])
  const [selectedLead, setSelectedLead] = useState<LeadDetail | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    apiFetch<LeadRecord[]>('/api/admin/leads').then(setLeads)
  }, [])

  const fetchLeadDetail = useCallback(async (id: number) => {
    setLoading(true)
    try {
      const detail = await apiFetch<LeadDetail>(`/api/admin/leads/${id}`)
      setSelectedLead(detail)
    } finally {
      setLoading(false)
    }
  }, [])

  const closeLead = useCallback(() => {
    setSelectedLead(null)
  }, [])

  const updateStatus = useCallback(
    async (id: number, status: LeadStatus) => {
      await apiFetch(`/api/admin/leads/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      })
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)))
      if (selectedLead?.id === id) {
        setSelectedLead((prev) => (prev ? { ...prev, status } : prev))
      }
    },
    [selectedLead],
  )

  const addTag = useCallback(
    async (id: number, tag: string) => {
      await apiFetch(`/api/admin/leads/${id}/tags`, {
        method: 'POST',
        body: JSON.stringify({ tag }),
      })
      await fetchLeadDetail(id)
    },
    [fetchLeadDetail],
  )

  const removeTag = useCallback(
    async (id: number, tag: string) => {
      await apiFetch(`/api/admin/leads/${id}/tags/${encodeURIComponent(tag)}`, {
        method: 'DELETE',
      })
      await fetchLeadDetail(id)
    },
    [fetchLeadDetail],
  )

  const addNote = useCallback(
    async (id: number, content: string) => {
      await apiFetch(`/api/admin/leads/${id}/notes`, {
        method: 'POST',
        body: JSON.stringify({ content, createdBy: 'admin' }),
      })
      await fetchLeadDetail(id)
    },
    [fetchLeadDetail],
  )

  return { leads, selectedLead, loading, fetchLeadDetail, closeLead, updateStatus, addTag, removeTag, addNote }
}
