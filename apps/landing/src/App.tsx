import { Section } from './com/ui/Section'
import { FeatureGrid } from './biz/mkt/components/FeatureGrid'
import { HeroPanel } from './biz/mkt/components/HeroPanel'
import { LeadCapturePanel } from './biz/mkt/components/LeadCapturePanel'
import { usePublicBootstrap } from './biz/mkt/hooks/usePublicBootstrap'

export function App() {
  const { data, loading } = usePublicBootstrap()

  const metrics = [
    {
      label: 'Captured leads',
      value: data?.metrics.totalLeads ?? 0,
    },
    {
      label: 'Media assets',
      value: data?.metrics.totalMedia ?? 0,
    },
    {
      label: 'Admin surface',
      value: 'Cloudflare subdomain',
    },
  ]

  return (
    <main className="landing-shell">
      <HeroPanel settings={data?.settings} metrics={metrics} loading={loading} />
      <Section
        eyebrow="Ship faster"
        title="Cloudflare-native SaaS starter with landing, admin, D1, Images, and AI Gateway"
        description="Marketing and operations stay separate, but the stack stays simple: one Worker runtime, two Vite apps, one D1 database, one media flow, and one AI entry point."
      >
        <FeatureGrid />
      </Section>
      <Section
        eyebrow="Workflow"
        title="Everything routes through Cloudflare"
        description="Landing lives on your main domain, admin on a dedicated Cloudflare-managed subdomain, and operational content is editable from admin."
      >
        <div className="ops-rail">
          <article>
            <h3>Marketing</h3>
            <p>Collect leads, show live metrics, and publish copy changes without leaving the Cloudflare edge.</p>
          </article>
          <article>
            <h3>Operations</h3>
            <p>Manage hero content, review inbound leads, upload Images assets, and use AI Gateway for copy drafts.</p>
          </article>
          <article>
            <h3>Delivery</h3>
            <p>GitHub Actions runs type-check, tests, build, D1 migrations, and Worker deploy from one pipeline.</p>
          </article>
        </div>
      </Section>
      <LeadCapturePanel />
    </main>
  )
}
