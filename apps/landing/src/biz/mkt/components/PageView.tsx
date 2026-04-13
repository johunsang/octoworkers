import { useEffect, useMemo, useState } from 'react'
import { apiFetch } from '../../../com/api/client'
import { adminUrl, homeUrl, pageUrl } from '../../../com/url'
import { sanitizeHtml } from '../../../com/sanitize'

type Page = { id: number; slug: string; title: string; contentHtml: string; publishedAt: string | null }
type PageSummary = { id: number; slug: string; title: string }
type TocItem = { id: string; text: string; level: number }

function extractToc(html: string): TocItem[] {
  const items: TocItem[] = []
  const regex = /<h([2-3])[^>]*>(.*?)<\/h[2-3]>/gi
  let match
  while ((match = regex.exec(html)) !== null) {
    const text = match[2].replace(/<[^>]*>/g, '').trim()
    const id = text.toLowerCase().replace(/[^a-z0-9가-힣]+/g, '-').replace(/(^-|-$)/g, '')
    items.push({ id, text, level: Number(match[1]) })
  }
  return items
}

function injectHeadingIds(html: string, toc: TocItem[]): string {
  let result = html
  for (const item of toc) {
    const pattern = new RegExp(`(<h${item.level})(>)`, 'i')
    result = result.replace(pattern, `$1 id="${item.id}"$2`)
  }
  return result
}

function TableOfContents({ items }: { items: TocItem[] }) {
  if (items.length < 2) return null
  return (
    <nav className="page-toc">
      <h4 className="page-toc-title">목차</h4>
      <ul>
        {items.map((item) => (
          <li key={item.id} className={item.level === 3 ? 'toc-indent' : ''}>
            <a href={`#${item.id}`}>{item.text}</a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

function PageNav({ pages, currentSlug }: { pages: PageSummary[]; currentSlug: string }) {
  const idx = pages.findIndex(p => p.slug === currentSlug)
  const prev = idx > 0 ? pages[idx - 1] : null
  const next = idx < pages.length - 1 ? pages[idx + 1] : null

  if (!prev && !next) return null

  return (
    <nav className="page-nav-links">
      {prev ? (
        <a href={pageUrl(prev.slug)} className="page-nav-link prev">
          <span className="page-nav-dir">&larr; Previous</span>
          <span className="page-nav-title">{prev.title}</span>
        </a>
      ) : <div />}
      {next ? (
        <a href={pageUrl(next.slug)} className="page-nav-link next">
          <span className="page-nav-dir">Next &rarr;</span>
          <span className="page-nav-title">{next.title}</span>
        </a>
      ) : <div />}
    </nav>
  )
}

export function PageView({ slug }: { slug: string }) {
  const [page, setPage] = useState<Page | null>(null)
  const [pages, setPages] = useState<PageSummary[]>([])
  const [error, setError] = useState(false)

  useEffect(() => { apiFetch<PageSummary[]>('/api/public/pages').then(setPages).catch(() => {}) }, [])
  useEffect(() => { setError(false); setPage(null); apiFetch<Page>(`/api/public/pages/${slug}`).then(setPage).catch(() => setError(true)) }, [slug])

  const toc = useMemo(() => page ? extractToc(page.contentHtml) : [], [page])
  const processedHtml = useMemo(() => {
    if (!page) return ''
    const withIds = injectHeadingIds(page.contentHtml, toc)
    return sanitizeHtml(withIds)
  }, [page, toc])

  return (
    <div className="page-view-shell">
      <nav className="page-view-nav">
        <a href={homeUrl()} className="nav-brand">옥토워커스</a>
        <div className="page-view-nav-links">
          {pages.map((p) => (
            <a key={p.id} href={pageUrl(p.slug)} className={p.slug === slug ? 'active' : ''}>{p.title}</a>
          ))}
        </div>
        <a href={adminUrl()} className="nav-cta">Admin</a>
      </nav>

      <main className="page-view-content">
        {!page && !error && <p className="page-view-loading">Loading...</p>}
        {error && (
          <div className="page-view-error">
            <h1>페이지를 찾을 수 없습니다</h1>
            <p>요청한 페이지 "/{slug}"가 존재하지 않거나 아직 발행되지 않았습니다.</p>
            <a href={homeUrl()}>홈으로 돌아가기</a>
          </div>
        )}
        {page && (
          <>
            <article className="page-view-article">
              <div className="page-view-meta">
                <span className="page-view-slug">/{page.slug}</span>
                {page.publishedAt && <time>{new Date(page.publishedAt).toLocaleDateString('ko-KR')}</time>}
              </div>

              <TableOfContents items={toc} />

              <div className="page-view-body" dangerouslySetInnerHTML={{ __html: processedHtml }} />
            </article>

            <PageNav pages={pages} currentSlug={slug} />
          </>
        )}
      </main>

      <footer className="page-view-footer">
        <a href={homeUrl()}>Landing</a>
        <a href={adminUrl()}>Admin Console</a>
        <a href="/api/public/pages">Pages API</a>
        <a href="https://github.com/johunsang/octoworkers" target="_blank" rel="noreferrer">GitHub</a>
      </footer>
    </div>
  )
}
