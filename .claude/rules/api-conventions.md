# API Conventions

- Base path: `/api/public/*` (비인증), `/api/admin/*` (인증 필요)
- RESTful 리소스 명명: 복수 명사 (`/leads`, `/images`, `/settings`)
- 에러 응답: `{ "error": "message" }` (Hono `c.json()`)
- HTTP 상태: 200 성공, 400 잘못된 입력, 401 미인증, 404 없음, 500 서버 에러
- 입력 검증: Zod 스키마 + `@hono/zod-validator` 미들웨어
- 인증: `enforceAdminAccess` 미들웨어 (`/api/admin/*`에 자동 적용)
- CORS: `/api/*` 경로에 적용
- ETag: Hono `etag` 미들웨어로 캐싱
- WebSocket: `/api/admin/ext/ws` (Hono `upgradeWebSocket`)
- 새 모듈 추가 시: `worker/src/biz/{3글자}/routes.ts` 생성 후 `index.ts`에 등록
