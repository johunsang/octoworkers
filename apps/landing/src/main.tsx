import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { PageView } from './biz/mkt/components/PageView'
import { PageListView } from './biz/mkt/components/PageListView'
import { isSaas } from './com/url'
import './styles.css'

function Router() {
  const path = window.location.pathname
    .replace(/^\/landing/, '')
    .replace(/\/$/, '') || '/'

  // /pages/:slug 경로
  if (path.startsWith('/pages/')) {
    return <PageView slug={path.replace('/pages/', '')} />
  }

  // app.octoworkers.com에서 /:slug 직접 접근
  if (isSaas && path !== '/' && !path.startsWith('/assets')) {
    const slug = path.replace(/^\//, '')
    if (slug && !slug.includes('.')) {
      return <PageView slug={slug} />
    }
  }

  // app.octoworkers.com 루트: CMS 페이지 목록
  if (isSaas) {
    return <PageListView />
  }

  // octoworkers.com: 마케팅 랜딩
  return <App />
}

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <Router />
  </StrictMode>,
)
