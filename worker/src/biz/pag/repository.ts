import type { Page, PageInput, PageSummary, PageStatus } from '@octoworkers/com'
import type { D1DatabaseLike } from '../../com/bindings'
import { allRows, isoNow } from '../../com/db'

type PageRow = {
  id: number
  slug: string
  title: string
  content_md: string
  content_html: string
  status: string
  published_at: string | null
  created_at: string
  updated_at: string
}

function mapPage(row: PageRow): Page {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    contentMd: row.content_md,
    contentHtml: row.content_html,
    status: row.status as PageStatus,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function mapSummary(row: PageRow): PageSummary {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    status: row.status as PageStatus,
    publishedAt: row.published_at,
    updatedAt: row.updated_at,
  }
}

export async function listPages(db: D1DatabaseLike): Promise<PageSummary[]> {
  const rows = await allRows<PageRow>(
    db.prepare('SELECT id, slug, title, content_md, content_html, status, published_at, created_at, updated_at FROM pages ORDER BY id DESC'),
  )
  return rows.map(mapSummary)
}

export async function listPublishedPages(db: D1DatabaseLike): Promise<PageSummary[]> {
  const rows = await allRows<PageRow>(
    db.prepare(
      "SELECT id, slug, title, content_md, content_html, status, published_at, created_at, updated_at FROM pages WHERE status = 'published' ORDER BY published_at DESC",
    ),
  )
  return rows.map(mapSummary)
}

export async function getPageBySlug(db: D1DatabaseLike, slug: string): Promise<Page | null> {
  const row = await db
    .prepare('SELECT id, slug, title, content_md, content_html, status, published_at, created_at, updated_at FROM pages WHERE slug = ?')
    .bind(slug)
    .first<PageRow>()
  return row ? mapPage(row) : null
}

export async function getPageById(db: D1DatabaseLike, id: number): Promise<Page | null> {
  const row = await db
    .prepare('SELECT id, slug, title, content_md, content_html, status, published_at, created_at, updated_at FROM pages WHERE id = ?')
    .bind(id)
    .first<PageRow>()
  return row ? mapPage(row) : null
}

export async function createPage(db: D1DatabaseLike, input: PageInput, contentHtml: string) {
  const now = isoNow()
  await db
    .prepare('INSERT INTO pages (slug, title, content_md, content_html, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .bind(input.slug, input.title, input.contentMd, contentHtml, 'draft', now, now)
    .run()
}

export async function updatePage(db: D1DatabaseLike, id: number, input: PageInput, contentHtml: string) {
  await db
    .prepare('UPDATE pages SET slug = ?, title = ?, content_md = ?, content_html = ?, updated_at = ? WHERE id = ?')
    .bind(input.slug, input.title, input.contentMd, contentHtml, isoNow(), id)
    .run()
}

export async function publishPage(db: D1DatabaseLike, id: number) {
  const now = isoNow()
  await db.prepare("UPDATE pages SET status = 'published', published_at = ?, updated_at = ? WHERE id = ?").bind(now, now, id).run()
}

export async function unpublishPage(db: D1DatabaseLike, id: number) {
  await db.prepare("UPDATE pages SET status = 'draft', updated_at = ? WHERE id = ?").bind(isoNow(), id).run()
}

export async function deletePage(db: D1DatabaseLike, id: number) {
  await db.prepare('DELETE FROM pages WHERE id = ?').bind(id).run()
}
