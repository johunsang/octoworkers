# Cloudflare 초기 설정

이 문서는 로컬 개발부터 staging/production 연결까지 Cloudflare 리소스를 준비하는 순서를 정리합니다.

## 1. 필수 준비물

- Cloudflare 계정
- Cloudflare에 연결된 도메인
- GitHub 저장소
- `wrangler`를 실행할 수 있는 Cloudflare API Token

권장 권한:

- Workers Scripts Edit
- D1 Edit
- Vectorize Edit
- AI Gateway Read
- Workers AI Read
- Images Read/Write
- Workers KV Storage Edit
- R2 Edit
- Zone DNS Edit

## 2. 도메인 전략

권장 구조:

- Production landing: `example.com`
- Production admin: `admin.example.com`
- Staging landing: `staging.example.com`
- Staging admin: `admin.staging.example.com`

이 프로젝트는 같은 Worker가 호스트명을 보고 landing/admin 자산을 분기합니다.

## 3. `wrangler.jsonc` 값 채우기

수정 파일:

- [wrangler.jsonc](/Volumes/SAMSUNG/apps/projects/octoworkers/worker/wrangler.jsonc)

반드시 바꿔야 하는 값:

- `APP_DOMAIN`
- `ADMIN_DOMAIN`
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_IMAGES_DELIVERY_HASH`
- `database_id`
- staging용 `database_id`
- 실제 Vectorize `index_name`

## 4. D1 생성

Production:

```bash
cd worker
pnpm wrangler d1 create octoworkers
```

Staging:

```bash
cd worker
pnpm wrangler d1 create octoworkers-staging
```

명령 결과에서 `database_id`를 복사해 [wrangler.jsonc](/Volumes/SAMSUNG/apps/projects/octoworkers/worker/wrangler.jsonc)에 넣습니다.

## 5. D1 마이그레이션

로컬:

```bash
pnpm --filter @octoworkers/worker db:migrate:local
```

staging:

```bash
pnpm --filter @octoworkers/worker db:migrate:remote:staging
```

production:

```bash
pnpm --filter @octoworkers/worker db:migrate:remote
```

## 6. Cloudflare Images

필요 작업:

1. Images 활성화
2. delivery hash 확인
3. 변형 variant 준비

권장 variant:

- `public`
- `thumb`

필요 secret:

```bash
cd worker
pnpm wrangler secret put CLOUDFLARE_IMAGES_API_TOKEN
```

## 7. Workers KV

이 프로젝트는 예제 바인딩 `APP_KV`를 포함합니다.

예제 용도:

- feature flag
- lightweight cache
- one-off config
- sample key/value CRUD

예제 API:

- `GET /api/admin/ext/kv`
- `GET /api/admin/ext/kv/:key`
- `PUT /api/admin/ext/kv/:key`
- `DELETE /api/admin/ext/kv/:key`

## 8. Workers AI

이 프로젝트는 `AI` 바인딩을 통해 Workers AI를 직접 호출할 수 있게 설정해 두었습니다.

중요 포인트:

- `wrangler.jsonc`의 `ai.binding` 은 `AI`
- 로컬에서도 실제 Cloudflare 계정 자원을 쓰므로 `pnpm dev:remote` 권장
- 텍스트 생성 모델은 `AI_TEXT_MODEL`
- 임베딩 모델은 `AI_EMBED_MODEL`

예제 API:

- `GET /api/admin/ext/ai/workers`
- `POST /api/admin/ext/ai/text`

## 9. Vectorize

이 프로젝트는 `DOC_INDEX` 바인딩을 통해 Vectorize 인덱스를 사용합니다.

추천 생성 흐름:

1. Vectorize 인덱스 생성
2. [wrangler.jsonc](/Volumes/SAMSUNG/apps/projects/octoworkers/worker/wrangler.jsonc) 의 `index_name` 반영
3. admin 또는 API에서 reindex 수행

운영 API:

- `POST /api/admin/vec/reindex`
- `POST /api/admin/vec/search`

예제 API:

- `GET /api/admin/ext/vec/example`

현재 reindex 데이터 소스:

- site settings
- leads
- media metadata

## 10. Agents

이 프로젝트는 Cloudflare Agents 패턴을 따라 `OpsAgent` Durable Object를 내장했습니다.

Wrangler 핵심 구성:

- `durable_objects.bindings`
- `migrations[].new_sqlite_classes`

운영 API:

- `GET /api/admin/agt`
- `POST /api/admin/agt/tasks`
- `POST /api/admin/agt/tasks/:id/complete`
- `POST /api/admin/agt/notes`
- `POST /api/admin/agt/summarize`

에이전트 직접 경로:

- `/agents/OpsAgent/admin-ops`

현재 에이전트 기능:

- 운영 할 일 영속 저장
- 운영 노트 저장
- Workers AI 기반 태스크 요약

## 11. R2

R2는 기본 주석 상태입니다.

활성화 순서:

1. 버킷 생성
2. [wrangler.jsonc](/Volumes/SAMSUNG/apps/projects/octoworkers/worker/wrangler.jsonc) 의 `r2_buckets` 주석 해제
3. bucket 이름 입력

예제 API:

- `GET /api/admin/ext/r2/:key`
- `PUT /api/admin/ext/r2/:key`
- `DELETE /api/admin/ext/r2/:key`

## 12. Realtime

예제는 Workers WebSocket 기반입니다.

예제 엔드포인트:

- `GET /api/admin/ext/rtm/ws`

현재 예제는 echo 방식입니다.

확장 아이디어:

- room 기반 브로드캐스트
- presence 상태
- Durable Objects 연결
- collaborative admin notifications

## 13. Cloudflare Access

admin 보호 권장 방식:

- Cloudflare Access 앱 생성
- 대상 도메인: `admin.example.com`, `admin.staging.example.com`
- 허용 이메일 정책 설정

이 코드베이스는 Access 헤더가 있으면 그것도 인식하고, 세션 로그인도 같이 사용할 수 있게 `hybrid` 모드로 구성했습니다.

## 14. Secrets

로컬 개발:

- [worker/.dev.vars.example](/Volumes/SAMSUNG/apps/projects/octoworkers/worker/.dev.vars.example) 참고

원격 환경 secret:

```bash
cd worker
pnpm wrangler secret put ADMIN_LOGIN_PASSWORD
pnpm wrangler secret put ADMIN_JWT_SECRET
pnpm wrangler secret put AI_PROVIDER_API_KEY
pnpm wrangler secret put CLOUDFLARE_IMAGES_API_TOKEN
```

staging 환경 secret:

```bash
cd worker
pnpm wrangler secret put ADMIN_LOGIN_PASSWORD --env staging
pnpm wrangler secret put ADMIN_JWT_SECRET --env staging
pnpm wrangler secret put AI_PROVIDER_API_KEY --env staging
pnpm wrangler secret put CLOUDFLARE_IMAGES_API_TOKEN --env staging
```

## 15. 개발 모드 선택

일반 로컬 UI 작업:

```bash
pnpm dev
```

실제 Cloudflare 리소스까지 함께 확인:

```bash
pnpm dev:remote
```