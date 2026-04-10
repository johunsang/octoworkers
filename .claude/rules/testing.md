# Testing

- 테스트 프레임워크: Vitest (`worker/test/`)
- `pnpm test`로 실행 (worker 패키지 내 `vitest run`)
- Cloudflare 바인딩은 mock 처리 (D1, KV, AI, Vectorize, R2)
- `agents` / `hono-agents` 모듈은 vitest mock으로 대체
- 테스트는 Hono `app.request()` 패턴으로 HTTP 레벨 검증
- 행동(behavior) 테스트 우선, 구현 세부사항 테스트 금지
- 테스트명은 서술형: `should reject invalid email format`
- 새 라우트 추가 시 반드시 대응 테스트 작성
- 엣지 케이스: 빈 입력, null, 바운더리 값 커버
