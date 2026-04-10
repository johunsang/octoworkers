import { useEffect, useState } from 'react'
import type { DirectUploadPayload, MediaAsset } from '@octoworkers/com'
import { apiFetch } from '../../../com/api/client'

export function useMedia() {
  const [media, setMedia] = useState<MediaAsset[]>([])

  async function load() {
    const records = await apiFetch<MediaAsset[]>('/api/admin/images')
    setMedia(records)
  }

  useEffect(() => {
    load()
  }, [])

  async function createDirectUpload(title: string, alt: string) {
    const result = await apiFetch<DirectUploadPayload>('/api/admin/images/direct-upload', {
      method: 'POST',
      body: JSON.stringify({ title, alt }),
    })
    await load()
    return result
  }

  async function refreshAsset(imageId: string) {
    await apiFetch(`/api/admin/images/${imageId}/refresh`, {
      method: 'POST',
    })
    await load()
  }

  async function updateAsset(imageId: string, title: string, alt: string) {
    await apiFetch(`/api/admin/images/${imageId}`, {
      method: 'PUT',
      body: JSON.stringify({ title, alt }),
    })
    await load()
  }

  async function deleteAsset(imageId: string) {
    await apiFetch(`/api/admin/images/${imageId}`, {
      method: 'DELETE',
    })
    await load()
  }

  return { media, createDirectUpload, refreshAsset, updateAsset, deleteAsset }
}
