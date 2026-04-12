const modules = [
  { code: 'aut', name: '인증', desc: 'JWT 세션 + GitHub OAuth + Cloudflare Access 하이브리드 인증' },
  { code: 'pub', name: '공개 API', desc: '랜딩 부트스트랩, 리드 등록, CMS 페이지 공개 조회' },
  { code: 'dsh', name: '대시보드', desc: '리드/미디어 통계, AI 설정 상태 한눈에 보기' },
  { code: 'led', name: '리드 CRM', desc: '리드 목록, 상태 관리, 태그, 노트 — 영업 파이프라인' },
  { code: 'med', name: '미디어', desc: 'Cloudflare Images 직접 업로드, 메타데이터 편집, 삭제' },
  { code: 'set', name: '사이트 설정', desc: '브랜드, 히어로 카피, CTA 버튼 텍스트를 DB에서 관리' },
  { code: 'aid', name: 'AI 카피', desc: 'AI Gateway를 통한 마케팅 카피 자동 생성' },
  { code: 'eml', name: '이메일', desc: 'Resend API 연동 — 템플릿 관리, 리드별 발송, 이력 추적' },
  { code: 'pag', name: 'CMS', desc: '마크다운 기반 페이지 관리 — 발행/미발행, slug 기반 공개 URL' },
  { code: 'srh', name: '검색', desc: 'SQL LIKE 기반 리드/미디어 통합 전문 검색' },
  { code: 'vec', name: '시맨틱 검색', desc: 'Vectorize 임베딩 기반 유사도 검색 — 자연어 쿼리' },
  { code: 'agt', name: '에이전트', desc: 'Durable Objects 기반 영속적 운영 봇 — 태스크, 메모, AI 요약' },
  { code: 'ext', name: '예제', desc: 'KV, R2, WebSocket, Workers AI 데모 — 학습용 참고 코드' },
  { code: 'hlt', name: '헬스체크', desc: 'GET /api/health — 배포 검증용 엔드포인트' },
]

export function ModuleList() {
  return (
    <div className="module-list">
      {modules.map((m) => (
        <div key={m.code} className="module-item">
          <code className="module-code">{m.code}/</code>
          <div>
            <strong>{m.name}</strong>
            <p>{m.desc}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
