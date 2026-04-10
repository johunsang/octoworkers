import type { SiteSettings } from '@octoworkers/com'
import { fallbackSiteSettings } from '../../ext/fallbackSiteSettings'

type HeroPanelProps = {
  settings?: SiteSettings
  metrics: Array<{ label: string; value: number | string }>
  loading: boolean
}

export function HeroPanel({ settings = fallbackSiteSettings, metrics, loading }: HeroPanelProps) {
  return (
    <section className="hero-panel">
      <div className="hero-copy">
        <span>{settings.heroLabel}</span>
        <h1>{settings.heroTitle}</h1>
        <p>{settings.heroSubtitle}</p>
        <div className="hero-actions">
          <a href="https://admin.example.com" target="_blank" rel="noreferrer">
            {settings.ctaPrimary}
          </a>
          <a href="#lead-capture">{settings.ctaSecondary}</a>
        </div>
      </div>
      <div className="hero-metrics">
        <header>
          <strong>{settings.brand}</strong>
          <p>{loading ? 'Syncing live data from Cloudflare...' : 'Live snapshot from D1 and Worker APIs'}</p>
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
