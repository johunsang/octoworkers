import { Section } from './com/ui/Section'
import { FeatureGrid } from './biz/mkt/components/FeatureGrid'
import { HeroPanel } from './biz/mkt/components/HeroPanel'
import { DownloadPanel } from './biz/mkt/components/DownloadPanel'
import { StackDetail } from './biz/mkt/components/StackDetail'
import { ModuleList } from './biz/mkt/components/ModuleList'
import { SamplePages } from './biz/mkt/components/SamplePages'
import { usePublicBootstrap } from './biz/mkt/hooks/usePublicBootstrap'
import { adminUrl } from './com/url'

const GITHUB_URL = 'https://github.com/johunsang/octoworkers'

export function App() {
  const { data, loading } = usePublicBootstrap()

  const metrics = [
    { label: 'Stack', value: data?.settings?.brand ?? 'Hono + D1' },
    { label: 'Runtime', value: 'Cloudflare Workers' },
    { label: 'License', value: '교육용 오픈' },
  ]

  return (
    <main className="landing-shell">
      <nav className="top-nav">
        <strong className="nav-brand">옥토워커스</strong>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#modules">Modules</a>
          <a href="#get-started">Quick Start</a>
          <a href="#sample-pages">SaaS Pages</a>
          <a href="#pricing">Pricing</a>
          <a href={adminUrl()} className="nav-cta">Admin Console</a>
        </div>
      </nav>
      <HeroPanel metrics={metrics} loading={loading} />

      <Section id="features" eyebrow="Features" title="SaaS 런칭에 필요한 모든 것이 들어있습니다"
        description="랜딩, 어드민, API, 데이터베이스, 미디어, AI, 이메일, CMS까지 하나의 에지 런타임에서 돌아갑니다.">
        <FeatureGrid />
      </Section>

      <Section eyebrow="Tech Stack" title="Cloudflare 네이티브 풀스택"
        description="모든 인프라가 Cloudflare 안에서 돌아갑니다. 별도 서버, 별도 DB, 별도 스토리지 없이 하나의 플랫폼에서 해결됩니다.">
        <StackDetail />
      </Section>

      <Section id="modules" eyebrow="Modules" title="14개 비즈니스 모듈이 기본 탑재"
        description="3글자 약어 기반 모듈 시스템. 필요한 것만 남기고 나머지는 제거하세요. 새 모듈은 템플릿에서 복사해서 추가합니다.">
        <ModuleList />
      </Section>

      <DownloadPanel />

      <Section id="sample-pages" eyebrow="SaaS CMS" title="샘플 페이지를 직접 확인하세요"
        description="마크다운으로 작성한 CMS 페이지가 API를 통해 공개됩니다. 아래 탭을 클릭하면 실제 DB에서 읽어온 콘텐츠를 볼 수 있습니다.">
        <SamplePages />
      </Section>

      <Section eyebrow="Architecture" title="미들웨어부터 배포까지 설계됨"
        description="보안 헤더, 인증, CORS, ETag 캐싱이 미들웨어 스택으로 자동 적용됩니다. GitHub Actions CI/CD로 staging과 production을 분리 배포합니다.">
        <div className="ops-rail">
          <article><h3>보안 미들웨어</h3><p>CSP, HSTS, X-Frame-Options, nosniff가 모든 응답에 자동 적용. WebSocket은 예외 처리됨.</p></article>
          <article><h3>인증 시스템</h3><p>JWT 세션 + GitHub OAuth + Cloudflare Access 하이브리드. 허용 이메일 목록으로 접근 제어.</p></article>
          <article><h3>CI/CD 파이프라인</h3><p>PR마다 타입체크 + 테스트 + 빌드. develop → staging, main → production 자동 배포.</p></article>
        </div>
      </Section>

      <Section id="pricing" eyebrow="Pricing" title="보일러플레이트는 무료, 인프라 비용만"
        description="옥토워커스는 교육생에 한해 오픈소스로 제공됩니다. Cloudflare Free Plan으로도 시작할 수 있습니다.">
        <div className="ops-rail">
          <article><h3>Free Plan</h3><p>일 100,000 요청, D1 5GB, KV 100K 읽기. 사이드 프로젝트나 MVP에 충분합니다.</p></article>
          <article><h3>Paid Plan ($5/월)</h3><p>월 1,000만 요청, D1 25GB, KV 무제한, AI Gateway 로깅. 프로덕션 SaaS에 적합합니다.</p></article>
          <article><h3>Enterprise</h3><p>대규모 트래픽, 전용 지원, SLA. Cloudflare Enterprise 요금제와 조합하세요.</p></article>
        </div>
      </Section>

      <footer className="landing-footer">
        <div className="footer-links">
          <a href={adminUrl()}>Admin Console</a>
          <a href="/api/health">API Health</a>
          <a href="/api/public/pages">CMS Pages API</a>
          <a href={GITHUB_URL} target="_blank" rel="noreferrer">GitHub</a>
        </div>
        <p>Built with Hono + Vite + D1 on Cloudflare Workers</p>
      </footer>
    </main>
  )
}
