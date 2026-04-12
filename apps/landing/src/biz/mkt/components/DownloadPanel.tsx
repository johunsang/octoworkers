export function DownloadPanel() {
  const steps = [
    { step: '1', title: '레포 복사', description: 'git clone 후 pnpm install. 3분이면 로컬 개발 환경 완성.' },
    { step: '2', title: 'Cloudflare 연결', description: 'wrangler.jsonc에 Account ID, D1 ID 입력. 시크릿은 wrangler secret put.' },
    { step: '3', title: '배포', description: 'pnpm deploy:prod 한 줄이면 프론트 빌드 + DB 마이그레이션 + Workers 배포 완료.' },
  ]

  return (
    <section className="download-panel" id="get-started">
      <div className="section-copy">
        <span>Quick Start</span>
        <h2>3단계로 SaaS 런칭</h2>
        <p>복사, 설정, 배포. 보일러플레이트를 가져다 쓰면 인프라 걱정 없이 비즈니스 로직에 집중할 수 있습니다.</p>
      </div>
      <div className="download-grid">
        {steps.map((s) => (
          <div key={s.step} className="download-step">
            <div className="step-number">{s.step}</div>
            <div>
              <strong>{s.title}</strong>
              <p>{s.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
