import { useEffect, useState } from 'react'
import type { SiteSettings } from '@octoworkers/com'
import { apiFetch } from '../../../com/api/client'
import { fallbackSiteSettings } from '../../ext/fallbackSiteSettings'

export function useSettings() {
  const [settings, setSettings] = useState<SiteSettings>(fallbackSiteSettings)
  const [form, setForm] = useState<SiteSettings>(fallbackSiteSettings)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    apiFetch<SiteSettings>('/api/admin/settings').then((result) => {
      setSettings(result)
      setForm(result)
    })
  }, [])

  async function save() {
    setSaving(true)
    const next = await apiFetch<SiteSettings>('/api/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(form),
    })
    setSettings(next)
    setForm(next)
    setSaving(false)
  }

  return { settings, form, saving, setForm, save }
}
