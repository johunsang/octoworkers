import { pageUrl } from '../../../com/url'

export function DownloadPanel() {
  return (
    <section className="download-panel" id="get-started">
      <div className="section-copy">
        <span>AI-First Quick Start</span>
        <h2>AI에게 말하면 SaaS가 만들어집니다</h2>
        <p>코드를 직접 쓸 필요 없습니다. Claude Code 또는 Codex가 CLAUDE.md를 읽고 프로젝트 구조를 이해한 뒤, 세팅부터 배포까지 전부 수행합니다.</p>
      </div>

      <div className="install-guide">
        <div className="install-step">
          <div className="step-number">1</div>
          <div className="step-content">
            <strong>프로젝트 클론 & AI 에이전트 실행</strong>
            <pre className="code-block"><code>{`git clone https://github.com/johunsang/octoworkers my-saas
cd my-saas
claude`}</code></pre>
            <p>Claude Code가 CLAUDE.md를 자동으로 읽고 프로젝트 구조를 파악합니다. Codex를 쓰려면 <code>codex</code>를 실행하세요.</p>
          </div>
        </div>

        <div className="install-step">
          <div className="step-number">2</div>
          <div className="step-content">
            <strong>AI에게 첫 번째 말</strong>
            <pre className="code-block"><code>{`옥토워커스 보일러플레이트로 내 SaaS를 만들어줘.
프로젝트명은 my-saas이고 도메인은 my-saas.com이야.
pnpm install부터 로컬 실행까지 전부 세팅해줘.`}</code></pre>
            <p>AI가 알아서 의존성 설치, 환경변수 생성, DB 마이그레이션, 개발 서버 실행까지 합니다.</p>
          </div>
        </div>

        <div className="install-step">
          <div className="step-number">3</div>
          <div className="step-content">
            <strong>기능 개발도 말로</strong>
            <pre className="code-block"><code>{`"리드에 전화번호 필드 추가해줘"
"결제 모듈 만들어줘"
"대시보드에 차트 추가해줘"
"어드민에 사용자 관리 페이지 만들어줘"`}</code></pre>
            <p>AI가 contracts.ts 타입 → 백엔드 routes/repository → 프론트 hooks/components → 테스트까지 전부 만듭니다.</p>
          </div>
        </div>

        <div className="install-step">
          <div className="step-number">4</div>
          <div className="step-content">
            <strong>배포도 한 마디</strong>
            <pre className="code-block"><code>{`"프로덕션 배포해줘"`}</code></pre>
            <p>AI가 타입 체크 → 테스트 → 빌드 → D1 마이그레이션 → Workers 배포를 순서대로 실행합니다.</p>
            <div className="port-list">
              <span>Landing → my-saas.com</span>
              <span>Admin → admin.my-saas.com</span>
              <span>API → my-saas.com/api</span>
            </div>
          </div>
        </div>

        <div className="install-step">
          <div className="step-number">5</div>
          <div className="step-content">
            <strong>AI가 이해하는 핵심 키워드</strong>
            <pre className="code-block"><code>{`"3글자 모듈"  → biz/{led,med,pag}/ 패턴 이해
"contracts.ts" → 공유 타입 자동 수정
"prepared statement" → SQL 인젝션 방지 패턴
"/deploy staging" → 슬래시 커맨드로 자동화
"/review" → 현재 브랜치 코드 리뷰`}</code></pre>
            <p>CLAUDE.md에 정의된 규칙을 AI가 따르기 때문에 일관된 코드 품질이 유지됩니다.</p>
          </div>
        </div>
      </div>

      <div className="demo-links">
        <a href={pageUrl('ai-dev-guide')} className="demo-link demo-admin">
          <strong>AI 개발 가이드</strong>
          <span>서브에이전트, Hooks, MCP, Skills, 프롬프트 작성법</span>
        </a>
        <a href={pageUrl('guide')} className="demo-link demo-api">
          <strong>Cloudflare 실전 가이드</strong>
          <span>가입부터 배포까지 14단계 발표자료</span>
        </a>
        <a href={pageUrl('pricing-guide')} className="demo-link demo-github">
          <strong>요금제 완벽 가이드</strong>
          <span>Workers, D1, R2, AI 요금 상세 + AWS 비교</span>
        </a>
      </div>
    </section>
  )
}
