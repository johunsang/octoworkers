# Worker (Hono API)

Cloudflare Workers 기반 백엔드. Hono 4 프레임워크 사용.

## 구조

- `src/index.ts` — 진입점: 보안헤더 → admin access → CORS → ETag → 에이전트 → 라우트 등록
- `src/com/` — 공통 인프라
  - `bindings.ts` — AppBindings 타입 (모든 Cloudflare 바인딩 + 환경변수)
  - `db.ts` — D1 쿼리 헬퍼
  - `security.ts` — enforceAdminAccess 미들웨어, 보안 헤더
  - `assets.ts` — 프론트엔드 정적자산 서빙
  - `ai-gateway.ts` — AI Gateway 연동
  - `workers-ai.ts` — Workers AI 텍스트 생성 + 임베딩
- `src/biz/` — 비즈니스 모듈 (3글자 약어)

## 규칙

- 새 모듈: `src/biz/{3글자}/routes.ts` 생성 → `index.ts`에 `.route()` 등록
- DB 쿼리: prepared statement 필수 (SQL 인젝션 방지)
- 입력 검증: Zod + `@hono/zod-validator`
- 타입: `@octoworkers/com`의 contracts 사용
- 테스트: `test/app.test.ts`에 `app.request()` 패턴으로 추가

## 바인딩

DB(D1), ASSETS, AI(Workers AI), DOC_INDEX(Vectorize), OpsAgent(DO), APP_KV(KV), MEDIA_R2(R2, 선택)

## 시크릿 (wrangler secret으로 관리)

ADMIN_LOGIN_PASSWORD, ADMIN_JWT_SECRET, AI_PROVIDER_API_KEY, CLOUDFLARE_IMAGES_API_TOKEN
