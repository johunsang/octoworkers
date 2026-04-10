import { useCallback, useEffect, useState } from 'react'
import type { EmailTemplate, EmailTemplateInput, EmailLog } from '@octoworkers/com'
import { apiFetch } from '../../../com/api/client'

export function useEmailTemplates() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([])

  const refresh = useCallback(async () => {
    const data = await apiFetch<EmailTemplate[]>('/api/admin/email/templates')
    setTemplates(data)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const create = useCallback(
    async (input: EmailTemplateInput) => {
      await apiFetch('/api/admin/email/templates', {
        method: 'POST',
        body: JSON.stringify(input),
      })
      await refresh()
    },
    [refresh],
  )

  const update = useCallback(
    async (id: number, input: EmailTemplateInput) => {
      await apiFetch(`/api/admin/email/templates/${id}`, {
        method: 'PUT',
        body: JSON.stringify(input),
      })
      await refresh()
    },
    [refresh],
  )

  const remove = useCallback(
    async (id: number) => {
      await apiFetch(`/api/admin/email/templates/${id}`, {
        method: 'DELETE',
      })
      await refresh()
    },
    [refresh],
  )

  return { templates, create, update, remove }
}

export function useEmailSender() {
  const [logs, setLogs] = useState<EmailLog[]>([])
  const [sending, setSending] = useState(false)

  const refreshLogs = useCallback(async () => {
    const data = await apiFetch<EmailLog[]>('/api/admin/email/logs')
    setLogs(data)
  }, [])

  useEffect(() => {
    refreshLogs()
  }, [refreshLogs])

  const send = useCallback(
    async (leadId: number, templateId?: number, subject?: string, bodyHtml?: string) => {
      setSending(true)
      try {
        await apiFetch('/api/admin/email/send', {
          method: 'POST',
          body: JSON.stringify({ leadId, templateId, subject, bodyHtml }),
        })
        await refreshLogs()
      } finally {
        setSending(false)
      }
    },
    [refreshLogs],
  )

  return { logs, sending, send, refreshLogs }
}
