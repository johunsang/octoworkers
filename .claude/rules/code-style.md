# Code Style

- 모듈은 `biz/{3글자}/`로 구성 (aut, led, med 등)
- 라우터 파일은 `routes.ts`, DB 쿼리는 `repository.ts`, 로직은 `service.ts`
- 공유 타입은 반드시 `packages/com/src/contracts.ts`에 정의
- Hono 라우트는 `new Hono<{ Bindings: AppBindings }>()` 패턴
- Zod로 입력 검증, `@hono/zod-validator` 사용
- 프론트 API 호출은 `com/api/client.ts`의 `apiFetch` 사용
- React 훅은 `biz/{모듈}/hooks/use*.ts`에 배치
- Prefer explicit over clever — 명확한 코드 우선
- Three similar lines > premature abstraction
- "why" 주석만, "what" 주석 금지
