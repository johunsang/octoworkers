const layers = [
  {
    title: 'API Server',
    tech: 'Hono 4 + TypeScript',
    description: 'Cloudflare Workers 위에서 돌아가는 타입 세이프 REST API. Zod 입력 검증, JWT 세션, CORS, ETag 캐싱, 보안 헤더가 미들웨어로 자동 적용됩니다.',
  },
  {
    title: 'Frontend',
    tech: 'React 19 + Vite (SWC)',
    description: '랜딩과 어드민 두 개의 독립 앱. Vite HMR로 즉시 반영, 빌드 결과는 Worker가 정적자산으로 서빙합니다. 같은 Worker가 도메인을 보고 분기합니다.',
  },
  {
    title: 'Database',
    tech: 'Cloudflare D1 (SQLite)',
    description: 'Prepared statement 기반 안전한 쿼리. SQL 마이그레이션 자동화. staging과 production DB 분리. 5GB 무료 스토리지.',
  },
  {
    title: 'Storage',
    tech: 'KV + R2 + Images',
    description: 'KV로 키-값 캐싱, R2로 대용량 오브젝트 저장, Cloudflare Images로 이미지 직접 업로드와 변환. 필요한 것만 켜면 됩니다.',
  },
  {
    title: 'AI',
    tech: 'Workers AI + AI Gateway + Vectorize',
    description: 'Workers AI로 텍스트 생성과 임베딩, AI Gateway로 비용 추적과 캐싱, Vectorize로 시맨틱 검색. 토글 하나로 켜고 끕니다.',
  },
  {
    title: 'Deploy',
    tech: 'GitHub Actions + Wrangler',
    description: 'PR마다 타입체크, 테스트, 빌드 자동 실행. develop 브랜치는 staging, main 브랜치는 production에 자동 배포됩니다.',
  },
]

export function StackDetail() {
  return (
    <div className="stack-detail">
      {layers.map((layer) => (
        <article key={layer.title}>
          <div className="stack-header">
            <h3>{layer.title}</h3>
            <span className="stack-tech">{layer.tech}</span>
          </div>
          <p>{layer.description}</p>
        </article>
      ))}
    </div>
  )
}
