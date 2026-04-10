import type { DirectUploadPayload, MediaAsset } from '@octoworkers/com'
import type { D1DatabaseLike } from '../../com/bindings'
import { allRows, isoNow } from '../../com/db'

type MediaRow = {
  id: number
  image_id: string
  title: string
  alt: string | null
  status: string
  delivery_url: string | null
  preview_url: string | null
  uploaded_at: string
}

function mapMedia(row: MediaRow): MediaAsset {
  return {
    id: row.id,
    imageId: row.image_id,
    title: row.title,
    alt: row.alt,
    status: row.status,
    deliveryUrl: row.delivery_url,
    previewUrl: row.preview_url,
    uploadedAt: row.uploaded_at,
  }
}

export async function listMedia(db: D1DatabaseLike, limit = 20) {
  const rows = await allRows<MediaRow>(
    db.prepare(
      `
        SELECT id, image_id, title, alt, status, delivery_url, preview_url, uploaded_at
        FROM media_assets
        ORDER BY id DESC
        LIMIT ?
      `,
    ).bind(limit),
  )

  return rows.map(mapMedia)
}

export async function createDraftMedia(db: D1DatabaseLike, payload: DirectUploadPayload & { title: string; alt?: string }) {
  await db
    .prepare(
      `
        INSERT OR IGNORE INTO media_assets (image_id, title, alt, status, uploaded_at)
        VALUES (?, ?, ?, 'draft', ?)
      `,
    )
    .bind(payload.imageId, payload.title, payload.alt ?? null, isoNow())
    .run()
}

export async function refreshMedia(db: D1DatabaseLike, input: { imageId: string; status: string; deliveryUrl: string | null; previewUrl: string | null }) {
  await db
    .prepare(
      `
        UPDATE media_assets
        SET status = ?, delivery_url = ?, preview_url = ?
        WHERE image_id = ?
      `,
    )
    .bind(input.status, input.deliveryUrl, input.previewUrl, input.imageId)
    .run()
}

export async function mediaCount(db: D1DatabaseLike) {
  const row = await db.prepare('SELECT COUNT(*) AS count FROM media_assets').first<{ count: number }>()
  return row?.count ?? 0
}

export async function updateMediaMeta(db: D1DatabaseLike, input: { imageId: string; title: string; alt?: string }) {
  await db
    .prepare(
      `
        UPDATE media_assets
        SET title = ?, alt = ?
        WHERE image_id = ?
      `,
    )
    .bind(input.title, input.alt ?? null, input.imageId)
    .run()
}

export async function deleteMedia(db: D1DatabaseLike, imageId: string) {
  await db.prepare('DELETE FROM media_assets WHERE image_id = ?').bind(imageId).run()
}
