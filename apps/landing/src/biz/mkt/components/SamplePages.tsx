import { useEffect, useState } from 'react'
import { apiFetch } from '../../../com/api/client'
import { pageUrl } from '../../../com/url'

type PageSummary = { id: number; slug: string; title: string }
type PageDetail = { id: number; slug: string; title: string; contentHtml: string }

export function SamplePages() {
  const [pages, setPages] = useState<PageSummary[]>([])
  const [selected, setSelected] = useState<PageDetail | null>(null)

  useEffect(() => { apiFetch<PageSummary[]>('/api/public/pages').then(setPages).catch(() => {}) }, [])

  function handleClick(slug: string) {
    if (selected?.slug === slug) { setSelected(null); return }
    apiFetch<PageDetail>(`/api/public/pages/${slug}`).then(setSelected).catch(() => {})
  }

  if (pages.length === 0) return null

  return (
    <div className="sample-pages">
      <div className="page-list">
        {pages.map((page) => (
          <button key={page.id} className={`page-tab ${selected?.slug === page.slug ? 'active' : ''}`} onClick={() => handleClick(page.slug)} type="button">
            <strong>{page.title}</strong>
            <span>/{page.slug}</span>
          </button>
        ))}
      </div>
      {selected && (
        <div className="page-preview">
          <div className="page-preview-header">
            <strong>{selected.title}</strong>
            <div style={{ display: 'flex', gap: '8px' }}>
              <a href={pageUrl(selected.slug)} className="page-open-btn">페이지 열기</a>
              <a href={`/api/public/pages/${selected.slug}`} target="_blank" rel="noreferrer">JSON API</a>
            </div>
          </div>
          <div className="page-preview-body" dangerouslySetInnerHTML={{ __html: selected.contentHtml }} />
        </div>
      )}
    </div>
  )
}
