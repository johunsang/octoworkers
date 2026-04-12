import { Section } from './com/ui/Section'
import { FeatureGrid } from './biz/mkt/components/FeatureGrid'
import { HeroPanel } from './biz/mkt/components/HeroPanel'
import { LeadCapturePanel } from './biz/mkt/components/LeadCapturePanel'
import { usePublicBootstrap } from './biz/mkt/hooks/usePublicBootstrap'

export function App() {
  const { data, loading } = usePublicBootstrap()

  const metrics = [
    {
      label: 'Stack',
      value: data?.settings?.brand ?? 'Hono + D1',
    },
    {
      label: 'Runtime',
      value: 'Cloudflare Workers',
    },
    {
      label: 'License',
      value: 'MIT',
    },
  ]

  return (
    <main className="landing-shell">
      <HeroPanel metrics={metrics} loading={loading} />
      <Section
        eyebrow="Features"
        title="SaaS 런칭에 필요한 모든 것이 들어있습니다"
        description="랜딩, 어드민, API, 데이터베이스, 미디어, AI, 이메일, CMS까지 하나의 에지 런타임에서 돌아갑니다."
      >
        <FeatureGrid />
      </Section>
      <LeadCapturePanel />
      <Section
        eyebrow="Architecture"
        title="Cloudflare 네이티브 풀스택"
        description="Workers, D1, KV, R2, Images, AI Gateway, Durable Objects — 전부 Cloudflare 안에서 해결됩니다."
      >
        <div className="ops-rail">
          <article>
            <h3>Edge API</h3>
            <p>Hono 4 기반 타입 세이프 API. Zod 검증, JWT 세션, CORS, ETag 캐싱이 기본 탑재.</p>
          </article>
          <article>
            <h3>AI Gateway</h3>
            <p>Workers AI + AI Gateway로 카피 생성, 임베딩, 시맨틱 검색을 즉시 연동.</p>
          </article>
          <article>
            <h3>Deploy</h3>
            <p>GitHub Actions CI/CD. staging/production 분리 배포, D1 마이그레이션 자동화.</p>
          </article>
        </div>
      </Section>
    </main>
  )
}
