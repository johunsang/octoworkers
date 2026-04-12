import { useEffect, useState } from 'react'
import { apiFetch } from '../../../com/api/client'
import { adminUrl, homeUrl, pageUrl } from '../../../com/url'

type PageSummary = { id: number; slug: string; title: string; publishedAt: string | null }

export function PageListView() {
  const [pages, setPages] = useState<PageSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiFetch<PageSummary[]>('/api/public/pages').then(setPages).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <div className="pagelist-shell">
      <nav className="pagelist-nav">
        <a href={homeUrl()} className="nav-brand">옥토워커스</a>
        <div className="pagelist-nav-links">
          <a href={homeUrl()}>Home</a>
          <a href={adminUrl()}>Admin</a>
          <a href="https://github.com/johunsang/octoworkers" target="_blank" rel="noreferrer">GitHub</a>
        </div>
      </nav>
      <header className="pagelist-header">
        <span className="pagelist-badge">SaaS CMS</span>
        <h1>옥토워커스 페이지</h1>
        <p>마크다운으로 작성한 CMS 페이지가 D1 데이터베이스에서 실시간으로 서빙됩니다.</p>
      </header>
      {loading && <p className="pagelist-loading">Loading...</p>}
      <div className="pagelist-grid">
        {pages.map((page) => (
          <a key={page.id} href={pageUrl(page.slug)} className="pagelist-card">
            <h2>{page.title}</h2>
            <span className="pagelist-slug">/{page.slug}</span>
            {page.publishedAt && <time>{new Date(page.publishedAt).toLocaleDateString('ko-KR')}</time>}
          </a>
        ))}
      </div>
      <footer className="pagelist-footer">
        <a href={homeUrl()}>Landing</a>
        <a href={adminUrl()}>Admin Console</a>
        <a href="/api/public/pages">Pages API</a>
        <a href="https://github.com/johunsang/octoworkers" target="_blank" rel="noreferrer">GitHub</a>
      </footer>
    </div>
  )
}
