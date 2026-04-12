import { useState } from 'react'
import type { FormEvent } from 'react'
import { Panel } from '../../../com/ui/Panel'
import { MediaManager } from './MediaManager'
import { useMedia } from '../hooks/useMedia'

export function MediaPanel() {
  const { media, createDirectUpload, refreshAsset, updateAsset, deleteAsset } = useMedia()
  const [uploadTitle, setUploadTitle] = useState('')
  const [uploadAlt, setUploadAlt] = useState('')

  async function handleUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const payload = await createDirectUpload(uploadTitle, uploadAlt)
    window.open(payload.uploadURL, '_blank', 'noopener,noreferrer')
    setUploadTitle('')
    setUploadAlt('')
  }

  return (
    <Panel title="Cloudflare Images" eyebrow="Media">
      <form className="form-grid" onSubmit={handleUpload}>
        <input value={uploadTitle} onChange={(event) => setUploadTitle(event.target.value)} placeholder="Asset title" required />
        <input value={uploadAlt} onChange={(event) => setUploadAlt(event.target.value)} placeholder="Alt text" />
        <button type="submit">Create direct upload URL</button>
      </form>
      <MediaManager media={media} onRefresh={refreshAsset} onUpdate={updateAsset} onDelete={deleteAsset} />
    </Panel>
  )
}
