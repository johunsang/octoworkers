import { useEffect, useState } from 'react'
import { apiFetch } from '../../../com/api/client'
import { adminUrl, homeUrl, pageUrl } from '../../../com/url'
import { sanitizeHtml } from '../../../com/sanitize'

type Page = { id: number; slug: string; title: string; contentHtml: string; publishedAt: string | null }
type PageSummary = { id: number; slug: string; title: string }

export function PageView({ slug }: { slug: string }) {
  const [page, setPage] = useState<Page | null>(null)
  const [pages, setPages] = useState<PageSummary[]>([])
  const [error, setError] = useState(false)

  useEffect(() => { apiFetch<PageSummary[]>('/api/public/pages').then(setPages).catch(() => {}) }, [])
  useEffect(() => { setError(false); setPage(null); apiFetch<Page>(`/api/public/pages/${slug}`).then(setPage).catch(() => setError(true)) }, [slug])

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
          <article className="page-view-article">
            <div className="page-view-meta">
              <span className="page-view-slug">/{page.slug}</span>
              {page.publishedAt && <time>{new Date(page.publishedAt).toLocaleDateString('ko-KR')}</time>}
            </div>
            <div className="page-view-body" dangerouslySetInnerHTML={{ __html: sanitizeHtml(page.contentHtml) }} />
          </article>
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
