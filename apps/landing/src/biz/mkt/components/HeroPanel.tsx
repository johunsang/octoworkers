import { pageUrl } from '../../../com/url'

type HeroPanelProps = {
  metrics: Array<{ label: string; value: number | string }>
  loading: boolean
}

export function HeroPanel({ metrics, loading }: HeroPanelProps) {
  return (
    <section className="hero-panel">
      <div className="hero-copy">
        <span>AI-First SaaS Boilerplate</span>
        <h1>옥토워커스</h1>
        <p>Claude Code 또는 Codex에게 말하면 SaaS가 만들어집니다. CLAUDE.md 기반 에이전트 문서 시스템으로 AI가 코드 작성부터 배포까지 전부 수행합니다.</p>
        <div className="hero-actions">
          <a href="#get-started">AI로 시작하기</a>
          <a href={pageUrl('ai-dev-guide')}>AI 개발 가이드</a>
          <a href="https://github.com/johunsang/octoworkers" target="_blank" rel="noreferrer">GitHub</a>
        </div>
      </div>
      <div className="hero-metrics">
        <header>
          <strong>AI로 개발하는 SaaS</strong>
          <p>{loading ? 'Loading...' : 'Claude Code + Codex + Hono + D1'}</p>
        </header>
        <div className="metric-grid">
          {metrics.map((metric) => (
            <article key={metric.label}>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
