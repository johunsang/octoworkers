# CLI 스캐폴딩 도구 (create-octoworkers)

## 개요

`create-octoworkers`는 옥토워커스 보일러플레이트를 복사하고, Cloudflare 리소스를 생성하고, 배포까지 하나의 대화형 CLI로 자동화하는 도구입니다.

## 실행

```bash
# 프로젝트 내에서
node cli/dist/index.js

# 또는 빌드 후
cd cli && node build.js && node dist/index.js
```

## 사전 요구사항

| 도구 | 용도 | 자동 처리 |
|------|------|----------|
| Node.js 20+ | 런타임 | 없으면 에러 |
| pnpm | 패키지 관리 | 없으면 자동 설치 |
| git | 버전 관리 | 없으면 에러 |
| wrangler | Cloudflare CLI | npx로 자동 실행 |
| gh (선택) | GitHub CLI | 없으면 건너뜀 |

## 10단계 상세

### 1단계: 사전 요구사항 확인

Node.js, pnpm, git 버전을 확인합니다. pnpm이 없으면 `npm install -g pnpm`으로 자동 설치합니다.

### 2단계: Cloudflare 로그인

`wrangler whoami`로 인증 상태를 확인합니다. 미인증 시 `wrangler login`을 실행하여 브라우저에서 OAuth 인증을 진행합니다. Account ID를 자동으로 추출합니다.

### 3단계: 프로젝트 정보

| 항목 | 예시 | 용도 |
|------|------|------|
| 프로젝트 이름 | My SaaS | 문서, 브랜딩 |
| 프로젝트 슬러그 | my-saas | 패키지명, Worker명, D1명 |
| 패키지 스코프 | my-saas | @scope/worker, @scope/com |
| 앱 도메인 | my-saas.com | wrangler.jsonc APP_DOMAIN |
| 어드민 도메인 | admin.my-saas.com | wrangler.jsonc ADMIN_DOMAIN |
| 관리자 이메일 | founder@my-saas.com | ADMIN_ALLOWED_EMAILS |

### 4단계: 모듈 선택

| 모듈 | 설명 | 기본 |
|------|------|------|
| AI 카피 생성 (aid) | AI Gateway 카피 제안 | Y |
| 시맨틱 검색 (vec) | Vectorize 임베딩 검색 | Y |
| DO 에이전트 (agt) | Durable Object 운영 에이전트 | Y |
| KV/R2/WS 예제 (ext) | Cloudflare 서비스 예제 | Y |

제외한 모듈은 파일 복사에서 제외되고, `index.ts`에서 import/route 등록도 자동 제거됩니다.

### 5단계: 파일 복사 + 커스터마이징

보일러플레이트 전체 파일을 복사하면서 자동으로 치환:

- `octoworkers` → 프로젝트 슬러그
- `@octoworkers/` → `@스코프/`
- `example.com` → 실제 도메인
- `REPLACE_WITH_*` → 입력한 Cloudflare ID
- `옥토워커스` → 프로젝트 이름
- `founder@example.com` → 관리자 이메일

제외 대상: `node_modules`, `.wrangler`, `dist`, `coverage`, `cli`, `pnpm-lock.yaml`, `worker/public`

### 6단계: 의존성 설치

`pnpm install`을 실행합니다.

### 7단계: Cloudflare 리소스 생성

대화형으로 아래 리소스를 생성합니다:

| 리소스 | 명령 | 결과 |
|--------|------|------|
| D1 (prod) | `wrangler d1 create {slug}` | database_id → wrangler.jsonc 반영 |
| D1 (staging) | `wrangler d1 create {slug}-staging` | staging database_id → wrangler.jsonc 반영 |
| KV | `wrangler kv namespace create APP_KV` | ID 출력 (수동 반영) |
| Vectorize | `wrangler vectorize create {slug}-doc-index` | vec 모듈 선택 시 |
| R2 | `wrangler r2 bucket create {slug}-media` | ext 모듈 선택 시 |

생성 후 `wrangler.jsonc`의 플레이스홀더를 실제 ID로 자동 업데이트합니다.

### 8단계: D1 마이그레이션

- 로컬: `db:migrate:local` (항상 실행)
- 원격 prod: `db:migrate:remote` (D1 생성 시 선택)
- 원격 staging: `db:migrate:remote:staging` (staging D1 생성 시 선택)

### 9단계: Workers 시크릿

`wrangler secret put`으로 시크릿을 설정합니다:

| 키 | 필수 | 설명 |
|----|------|------|
| `ADMIN_LOGIN_PASSWORD` | 필수 | 어드민 로그인 비밀번호 |
| `ADMIN_JWT_SECRET` | 필수 | 자동 생성 (48자 랜덤) |
| `AI_PROVIDER_API_KEY` | 선택 | AI Gateway API 키 |
| `CLOUDFLARE_IMAGES_API_TOKEN` | 선택 | Images API 토큰 |

### 10단계: 빌드 & 배포

1. `pnpm build` — landing + admin 프로덕션 빌드
2. `pnpm check` — TypeScript 타입 체크
3. `pnpm test` — Vitest 테스트
4. 배포 대상 선택 (staging / prod / skip)
5. 헬스 체크 (`/api/health`)
6. Git 초기 커밋
7. GitHub 리포 생성 + push (선택)

## CLI 빌드

```bash
cd cli
pnpm install
node build.js
```

빌드 결과: `cli/dist/index.js` (단일 번들, Node.js 20+)

## 디렉토리 구조

```
cli/
├── package.json    # create-octoworkers 패키지
├── build.js        # esbuild 빌드 스크립트
├── src/
│   └── index.ts    # CLI 소스
└── dist/
    └── index.js    # 번들된 실행 파일
```
