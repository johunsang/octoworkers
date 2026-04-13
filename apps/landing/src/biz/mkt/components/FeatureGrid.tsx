const items = [
  {
    title: 'AI에게 말하면 개발 완료',
    description: 'Claude Code 또는 Codex가 CLAUDE.md를 읽고 프로젝트를 이해합니다. 한국어로 기능을 요청하면 타입, 백엔드, 프론트, 테스트까지 자동 생성.',
  },
  {
    title: '서브에이전트 & Hooks',
    description: 'Explore, Plan, Code Reviewer 서브에이전트로 작업 위임. Hooks로 자동 포맷팅, 파일 보호, 알림 설정.',
  },
  {
    title: 'CLAUDE.md 문서 시스템',
    description: '루트 + 서브디렉토리 CLAUDE.md로 AI가 규칙을 이해. .claude/rules/, .claude/skills/로 프로젝트별 자동화 설정.',
  },
  {
    title: '/deploy 한 마디로 배포',
    description: '슬래시 커맨드로 빌드 → 테스트 → D1 마이그레이션 → Workers 배포 자동화. /review, /fix-issue, /scaffold 지원.',
  },
]

export function FeatureGrid() {
  return (
    <div className="feature-grid">
      {items.map((item) => (
        <article key={item.title}>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </article>
      ))}
    </div>
  )
}
