# AI / Images / KV / R2 / Realtime / Vectorize / Agents 예제

이 문서는 현재 코드베이스에 이미 들어 있는 Cloudflare 예제를 정리합니다.

## 1. AI Gateway

실제 운영 API:

- `POST /api/admin/ai/copy`

예제 payload API:

- `GET /api/admin/ext/ai/example`

예제 입력:

- [exampleCopyRequest.ts](/Volumes/SAMSUNG/apps/projects/octoworkers/worker/src/biz/ext/ai/exampleCopyRequest.ts)

동작:

1. admin에서 현재 hero 카피를 입력
2. Worker가 AI Gateway compat endpoint 호출
3. JSON 응답을 heroTitle / heroSubtitle / ctaPrimary / rationale 구조로 반환

필수 설정:

- `AI_GATEWAY_ACCOUNT_ID`
- `AI_PROVIDER`
- `AI_MODEL`
- `AI_PROVIDER_API_KEY` secret

## 2. Workers AI

상태 확인 API:

- `GET /api/admin/ext/ai/workers`

텍스트 생성 예제 API:

- `POST /api/admin/ext/ai/text`

현재 사용 값:

- `AI_TEXT_MODEL`
- `AI_EMBED_MODEL`

역할:

- admin 운영 문구 생성
- Vectorize용 임베딩 생성
- Ops Agent 태스크 요약

## 3. Vectorize

운영 API:

- `POST /api/admin/vec/reindex`
- `POST /api/admin/vec/search`

예제 payload API:

- `GET /api/admin/ext/vec/example`

현재 인덱싱 소스:

- landing settings
- leads
- media metadata

확장 예:

- support docs 검색
- playbook retrieval
- tenant knowledge base
- AI grounding context

## 4. Agents

운영 API:

- `GET /api/admin/agt`
- `POST /api/admin/agt/tasks`
- `POST /api/admin/agt/tasks/:id/complete`
- `POST /api/admin/agt/notes`
- `POST /api/admin/agt/summarize`

예제 설명 API:

- `GET /api/admin/ext/agt/example`

직접 agent path:

- `/agents/OpsAgent/admin-ops`

현재 상태:

- Durable Object backed
- SQLite storage migration 포함
- callable method 기반 task / note / summarize

## 5. Cloudflare Images

운영 API:

- `GET /api/admin/images`
- `POST /api/admin/images/direct-upload`
- `POST /api/admin/images/:imageId/refresh`
- `PUT /api/admin/images/:imageId`
- `DELETE /api/admin/images/:imageId`

예제 payload API:

- `GET /api/admin/ext/img/example`

동작:

1. direct upload URL 생성
2. 브라우저가 Cloudflare Images로 직접 업로드
3. `refresh`로 variant URL 동기화
4. D1에 title/alt/status/deliveryUrl 반영

## 6. Workers KV

예제 UI:

- admin `Cloudflare Examples` 패널

예제 API:

- `GET /api/admin/ext/kv`
- `GET /api/admin/ext/kv/:key`
- `PUT /api/admin/ext/kv/:key`
- `DELETE /api/admin/ext/kv/:key`

키 저장 규칙:

- 내부적으로 `example:{key}` prefix 사용

활용 예:

- feature flags
- lightweight config
- rate-limit markers
- temporary workflow state

## 7. R2

예제 UI:

- admin `Cloudflare Examples` 패널

예제 API:

- `GET /api/admin/ext/r2/:key`
- `PUT /api/admin/ext/r2/:key`
- `DELETE /api/admin/ext/r2/:key`

키 저장 규칙:

- 내부적으로 `example/{key}` prefix 사용

이 예제는 텍스트 오브젝트 기준입니다.

확장 예:

- private uploads
- export archives
- report snapshots
- original media storage

## 8. Realtime

예제 UI:

- admin `Cloudflare Examples` 패널

예제 API:

- `GET /api/admin/ext/rtm/ws`

현재 예제:

- WebSocket echo

테스트 방법:

1. admin 로그인
2. `Cloudflare Examples` 패널 진입
3. 메시지 입력
4. WebSocket echo 수신 확인

확장 방향:

- room/channel
- multi-user collaboration
- live dashboard counters
- notifications
- Durable Objects backed pub/sub

## 9. 검색

운영 API:

- `GET /api/admin/search?q=...`

현재 검색 대상:

- leads: `name`, `email`, `company`
- media: `title`, `alt`

예제 UI:

- admin `Search` 패널

## 10. Admin UI에서 바로 보는 위치

현재 admin의 `Cloudflare Examples` 패널에서 바로 확인할 수 있는 것:

- KV CRUD
- R2 CRUD
- WebSocket echo
- Workers AI text generation
- Vectorize reindex / semantic search
- Ops Agent task / note / summary

## 11. Hono에서 적용한 패턴

현재 코드베이스에서 Hono를 이렇게 사용합니다.

- 라우트 분리: `biz/{3글자}`
- validator 사용
- `etag` 사용
- cookie/JWT 로그인
- Cloudflare Worker 자산 서빙
- WebSocket upgrade 예제

참고 구현 위치:

- [index.ts](/Volumes/SAMSUNG/apps/projects/octoworkers/worker/src/index.ts)
- [auth routes](/Volumes/SAMSUNG/apps/projects/octoworkers/worker/src/biz/aut/routes.ts)
- [media routes](/Volumes/SAMSUNG/apps/projects/octoworkers/worker/src/biz/med/routes.ts)
- [ext routes](/Volumes/SAMSUNG/apps/projects/octoworkers/worker/src/biz/ext/routes.ts)
