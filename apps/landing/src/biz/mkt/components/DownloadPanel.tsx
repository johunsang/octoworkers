import { adminUrl } from '../../../com/url'

export function DownloadPanel() {
  return (
    <section className="download-panel" id="get-started">
      <div className="section-copy">
        <span>Quick Start</span>
        <h2>3단계로 SaaS 런칭</h2>
        <p>복사, 설정, 배포. 보일러플레이트를 가져다 쓰면 인프라 걱정 없이 비즈니스 로직에 집중할 수 있습니다.</p>
      </div>

      <div className="install-guide">
        <div className="install-step">
          <div className="step-number">1</div>
          <div className="step-content">
            <strong>프로젝트 복사 & 의존성 설치</strong>
            <pre className="code-block"><code>{`git clone https://github.com/johunsang/octoworkers my-saas
cd my-saas
pnpm install`}</code></pre>
            <p>Node.js 20+, pnpm 9.15+ 필요. 약 30초면 설치 완료.</p>
          </div>
        </div>

        <div className="install-step">
          <div className="step-number">2</div>
          <div className="step-content">
            <strong>로컬 환경 설정</strong>
            <pre className="code-block"><code>{`cp worker/.dev.vars.example worker/.dev.vars
# .dev.vars에 시크릿 값 입력 (비밀번호, JWT 키 등)`}</code></pre>
            <p>ADMIN_LOGIN_PASSWORD, ADMIN_JWT_SECRET은 필수. AI, Images, Email은 선택.</p>
          </div>
        </div>

        <div className="install-step">
          <div className="step-number">3</div>
          <div className="step-content">
            <strong>데이터베이스 초기화 & 실행</strong>
            <pre className="code-block"><code>{`pnpm --filter @octoworkers/worker db:migrate:local
pnpm dev`}</code></pre>
            <p>세 개의 서버가 동시에 뜹니다:</p>
            <div className="port-list">
              <span>Landing → localhost:5173</span>
              <span>Admin → localhost:5174</span>
              <span>API → localhost:8787</span>
            </div>
          </div>
        </div>

        <div className="install-step">
          <div className="step-number">4</div>
          <div className="step-content">
            <strong>Cloudflare 배포</strong>
            <pre className="code-block"><code>{`wrangler login
pnpm deploy:prod`}</code></pre>
            <p>프론트 빌드 + D1 마이그레이션 + Workers 배포가 한 줄에 완료됩니다.</p>
          </div>
        </div>

        <div className="install-step">
          <div className="step-number">5</div>
          <div className="step-content">
            <strong>프로젝트 커스터마이징</strong>
            <pre className="code-block"><code>{`# package.json 5곳에서 프로젝트명 교체
# wrangler.jsonc에서 도메인, Account ID 교체
# 불필요한 모듈 제거 (ext/, agt/, vec/ 등)`}</code></pre>
            <p>3글자 모듈 시스템 덕분에 필요한 것만 남기고 깔끔하게 정리할 수 있습니다.</p>
          </div>
        </div>
      </div>

      <div className="demo-links">
        <a href={adminUrl()} className="demo-link demo-admin">
          <strong>Admin Console 데모</strong>
          <span>리드 CRM, 미디어, 이메일, CMS를 직접 체험하세요</span>
        </a>
        <a href="/api/public/pages" className="demo-link demo-api">
          <strong>API 엔드포인트</strong>
          <span>공개 API 응답을 브라우저에서 바로 확인하세요</span>
        </a>
        <a href="https://github.com/johunsang/octoworkers" target="_blank" rel="noreferrer" className="demo-link demo-github">
          <strong>GitHub Repository</strong>
          <span>소스 코드, 이슈, 문서를 확인하세요</span>
        </a>
      </div>
    </section>
  )
}
