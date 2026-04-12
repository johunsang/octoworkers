type HeroPanelProps = {
  metrics: Array<{ label: string; value: number | string }>
  loading: boolean
}

export function HeroPanel({ metrics, loading }: HeroPanelProps) {
  return (
    <section className="hero-panel">
      <div className="hero-copy">
        <span>Cloudflare Workers SaaS Boilerplate</span>
        <h1>옥토워커스</h1>
        <p>랜딩, 어드민, API, DB, 미디어, AI, 이메일, CMS를 하나의 에지 런타임에서 운영하세요. 복사해서 바로 SaaS를 시작할 수 있습니다.</p>
        <div className="hero-actions">
          <a href="#lead-capture">도입 문의</a>
          <a href="https://github.com/octoworkers" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </div>
      <div className="hero-metrics">
        <header>
          <strong>옥토워커스</strong>
          <p>{loading ? 'Loading...' : 'Hono + Vite + D1 + AI Gateway'}</p>
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
