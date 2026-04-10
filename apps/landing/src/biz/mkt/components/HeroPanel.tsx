type HeroPanelProps = {
  metrics: Array<{ label: string; value: number | string }>
  loading: boolean
}

export function HeroPanel({ metrics, loading }: HeroPanelProps) {
  return (
    <section className="hero-panel">
      <div className="hero-copy">
        <span>AI Development Terminal</span>
        <h1>Octo Terminal</h1>
        <p>Clean, cute, and powerful. A native desktop terminal with built-in file management, AI agents, and remote control.</p>
        <div className="hero-actions">
          <a href="#download">Download</a>
          <a href="https://github.com/johunsang/octo-terminal-releases" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </div>
      <div className="hero-metrics">
        <header>
          <strong>Octo Terminal</strong>
          <p>{loading ? 'Loading...' : 'Tauri v2 + React + xterm.js'}</p>
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
