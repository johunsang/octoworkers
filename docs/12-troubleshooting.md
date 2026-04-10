# 트러블슈팅 & 주의사항

## CLI 관련

### `wrangler login` 브라우저가 안 열림

- 서버/원격 환경에서는 `wrangler login --browser false` → 터미널에 URL 출력 → 브라우저에서 직접 접근
- WSL에서는 Windows 측 브라우저를 수동으로 열어야 함

### D1 ID 파싱 실패

- `wrangler d1 create` 출력 형식이 버전에 따라 다를 수 있음
- CLI가 ID를 못 찾으면 직접 `wrangler.jsonc`에 수동 입력

### `pnpm install` 시 peer dependency 경고

- `agents` 패키지의 peer dependency 경고는 무시해도 됨 (Cloudflare Agents SDK 버전 호환)
- `--no-strict-peer-dependencies` 플래그 불필요 (pnpm 기본 동작)

### CLI가 중간에 멈춤

- Ctrl+C로 종료 후 출력 디렉토리 확인
- 이미 복사된 파일은 유지됨, 남은 단계를 수동으로 이어서 진행 가능

## Cloudflare 리소스 관련

### D1 마이그레이션 실패

- `wrangler.jsonc`의 `database_id`가 실제 D1 ID와 일치하는지 확인
- `--local`은 `.wrangler/` 안에 SQLite 생성, `--remote`는 실제 Cloudflare D1 수정
- **주의**: `--remote` 마이그레이션은 되돌릴 수 없음 — additive 방식 유지 권장

### KV 네임스페이스 ID

- `wrangler kv namespace create` 후 출력되는 `id`를 `wrangler.jsonc`의 `kv_namespaces[].id`에 수동 반영해야 함
- CLI가 자동 반영하지 못하는 경우가 있음

### Vectorize 인덱스 생성 실패

- Vectorize는 유료 플랜에서만 사용 가능할 수 있음
- `--dimensions 384`는 `bge-small-en-v1.5` 모델 기준 — 다른 임베딩 모델 사용 시 차원 수 변경 필요

### R2 버킷 활성화

- `wrangler.jsonc`에서 `r2_buckets` 블록 주석 해제 필요
- `bindings.ts`의 `MEDIA_R2`는 이미 optional 타입 (`R2BucketLike?`)

### Workers AI 로컬에서 안 됨

- `pnpm dev` (로컬)에서는 AI/Vectorize/Agents 바인딩이 동작하지 않음
- 반드시 `pnpm dev:remote` 사용

## 인증 관련

### 로그인이 안 됨

- `.dev.vars`에 `ADMIN_LOGIN_PASSWORD`와 `ADMIN_JWT_SECRET`이 설정되어 있는지 확인
- `ADMIN_LOGIN_EMAIL`과 입력 이메일이 정확히 일치하는지 확인 (대소문자 구분 없음)
- `ADMIN_ACCESS_MODE`가 `off`가 아닌데 localhost가 아닌 곳에서 접근 시 인증 필요

### JWT 쿠키가 안 붙음

- 쿠키명은 `__Host-` 프리픽스 사용 → HTTPS에서만 동작 (localhost 제외)
- 크로스 도메인 문제: landing 도메인에서 admin API 호출 시 쿠키 미전송
- `sameSite=Strict` 설정으로 외부 사이트에서 요청 시 쿠키 누락

### Cloudflare Access 헤더 인식 안 됨

- Access 앱이 해당 도메인에 적용되어 있어야 `cf-access-authenticated-user-email` 헤더 존재
- Workers 앞단에 Access가 없으면 헤더 자체가 없음

## 프론트엔드 관련

### Vite HMR 안 됨

- `pnpm dev` 실행 순서: Worker가 먼저 떠야 프론트엔드 프록시가 동작
- 포트 충돌 확인: 5173, 5174, 8787

### 빌드 후 정적자산 404

- `pnpm build` 후 `worker/public/landing/`, `worker/public/admin/`에 파일 존재 확인
- Worker가 호스트명으로 landing/admin을 분기 → `APP_DOMAIN`과 `ADMIN_DOMAIN` 설정 확인
- 로컬 dev에서는 localhost → landing으로 매핑

### 이미지 로드 실패

- CSP에 `imagedelivery.net` 허용되어 있음
- 다른 이미지 호스트 사용 시 `security.ts`의 CSP `img-src` 수정 필요

## 배포 관련

### staging과 production 환경 혼동

- `wrangler.jsonc`의 `env.staging` 블록이 별도 D1/KV/Vectorize ID 사용
- 시크릿도 환경별로 따로 설정: `wrangler secret put KEY --env staging`
- GitHub Actions: `develop` → staging, `main` → production

### 배포 후 변경사항 미반영

- Cloudflare 캐시 문제일 수 있음 — 브라우저 하드 리프레시 (Ctrl+Shift+R)
- Worker 배포 후 전파에 수십 초 소요될 수 있음

### GitHub Actions 실패

- `CLOUDFLARE_API_TOKEN`과 `CLOUDFLARE_ACCOUNT_ID` GitHub Secrets 설정 확인
- API Token 권한 확인: Workers Scripts Edit, D1 Edit 등 필요

## 모듈 관련

### 모듈 제거 후 빌드 에러

- `index.ts`에서 import/route 제거 확인
- `wrangler.jsonc`에서 관련 바인딩 제거 확인 (특히 durable_objects, vectorize)
- admin 앱의 `App.tsx`에서 해당 모듈 UI 제거 확인
- `pnpm check`로 미사용 import 확인

### 새 모듈 추가 후 타입 에러

- `packages/com/src/contracts.ts`에 타입 추가 + `index.ts`에서 export 확인
- `pnpm check`로 세 패키지 모두 검증

## 테스트 관련

### `vi.mock` 순서 문제

- `agents`/`hono-agents` mock은 반드시 `import { createApp }` 전에 선언
- Vitest에서 `vi.mock()`은 파일 최상단으로 호이스팅됨

### D1 mock이 쿼리를 인식 못함

- `prepare(query)` 내부에서 `query.includes('FROM table_name')` 패턴으로 분기
- 새 테이블 추가 시 mock 분기도 추가 필요

## 공통 주의사항

### 시크릿 하드코딩 금지

- API 키, 비밀번호, JWT 시크릿을 소스 코드에 절대 넣지 않는다
- `.dev.vars`는 gitignore 대상 — 커밋되지 않음
- `.dev.vars.example`은 실제 값 없이 키 이름만 유지

### CLAUDE.md ↔ AGENTS.md 동기화

- 한쪽을 수정하면 반드시 다른 쪽도 동일하게 수정
- 서브디렉토리 CLAUDE.md/AGENTS.md도 마찬가지
- CLI 스캐폴딩 시 자동으로 양쪽 모두 치환됨

### pnpm workspace 의존성

- `@octoworkers/com`은 `workspace:*`로 참조 — 로컬 패키지
- npm publish 시 `workspace:*`를 실제 버전으로 바꿔야 함 (현재 private이므로 해당 없음)

### wrangler.jsonc는 JSONC

- 주석(`//`)이 포함된 JSON — 일반 JSON 파서로 읽으면 에러
- wrangler가 자체적으로 JSONC 파싱

### 원격 D1 조작 주의

- `db:migrate:remote`는 실제 프로덕션 DB를 수정
- 테이블 DROP/ALTER는 되돌릴 수 없음
- 마이그레이션은 항상 additive (CREATE TABLE IF NOT EXISTS, ALTER TABLE ADD COLUMN)
- `.claude/settings.json`에서 `wrangler d1 * --remote*` 차단 설정 포함
