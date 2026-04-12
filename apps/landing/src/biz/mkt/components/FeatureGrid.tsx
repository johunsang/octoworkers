const items = [
  {
    title: 'Hono API + D1',
    description: '타입 세이프 REST API와 SQLite 기반 D1 데이터베이스. Zod 검증, prepared statement, 마이그레이션 자동화까지.',
  },
  {
    title: '어드민 콘솔',
    description: '리드 CRM, 미디어 관리, 사이트 설정, 이메일 발송, CMS 페이지 관리를 하나의 대시보드에서.',
  },
  {
    title: 'AI + 시맨틱 검색',
    description: 'Workers AI와 AI Gateway로 카피 생성, Vectorize로 시맨틱 검색. 토글 하나로 켜고 끕니다.',
  },
  {
    title: '원클릭 배포',
    description: 'GitHub Actions로 staging/production 자동 배포. D1 마이그레이션, 프론트 빌드, Workers 배포가 한 번에.',
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
