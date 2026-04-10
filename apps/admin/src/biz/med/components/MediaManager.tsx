import { useEffect, useState } from 'react'
import type { MediaAsset } from '@octoworkers/com'

type MediaManagerProps = {
  media: MediaAsset[]
  onRefresh: (imageId: string) => Promise<void>
  onUpdate: (imageId: string, title: string, alt: string) => Promise<void>
  onDelete: (imageId: string) => Promise<void>
}

export function MediaManager({ media, onRefresh, onUpdate, onDelete }: MediaManagerProps) {
  const [drafts, setDrafts] = useState<Record<string, { title: string; alt: string }>>({})

  useEffect(() => {
    const nextDrafts = Object.fromEntries(
      media.map((asset) => [
        asset.imageId,
        {
          title: asset.title,
          alt: asset.alt ?? '',
        },
      ]),
    )

    setDrafts(nextDrafts)
  }, [media])

  return (
    <div className="table-shell media-list">
      {media.map((asset) => (
        <article key={asset.imageId} className="media-card">
          <div className="media-card-copy">
            <strong>{asset.status.toUpperCase()}</strong>
            <p>{asset.imageId}</p>
          </div>
          <div className="form-grid">
            <input
              value={drafts[asset.imageId]?.title ?? ''}
              onChange={(event) =>
                setDrafts((current) => ({
                  ...current,
                  [asset.imageId]: {
                    title: event.target.value,
                    alt: current[asset.imageId]?.alt ?? '',
                  },
                }))
              }
              placeholder="Title"
            />
            <input
              value={drafts[asset.imageId]?.alt ?? ''}
              onChange={(event) =>
                setDrafts((current) => ({
                  ...current,
                  [asset.imageId]: {
                    title: current[asset.imageId]?.title ?? asset.title,
                    alt: event.target.value,
                  },
                }))
              }
              placeholder="Alt text"
            />
          </div>
          <div className="button-row">
            <button
              className="secondary-button"
              onClick={() => onRefresh(asset.imageId)}
            >
              Refresh
            </button>
            <button
              className="secondary-button"
              onClick={() =>
                onUpdate(
                  asset.imageId,
                  drafts[asset.imageId]?.title ?? asset.title,
                  drafts[asset.imageId]?.alt ?? asset.alt ?? '',
                )
              }
            >
              Update
            </button>
            <button onClick={() => onDelete(asset.imageId)}>Delete</button>
          </div>
        </article>
      ))}
    </div>
  )
}
