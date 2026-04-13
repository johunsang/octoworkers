-- Cloudflare + Octoworkers Setup Guide (presentation style)
INSERT INTO pages (slug, title, content_md, content_html, status, published_at, created_at, updated_at)
VALUES (
  'guide',
  'Cloudflare Workers 실전 가이드',
  '# Cloudflare Workers 실전 가이드

Cloudflare 계정 생성부터 옥토워커스 SaaS 배포까지, 단계별 발표자료 형식으로 안내합니다.

---

## 1. Cloudflare 가입 및 대시보드

- Cloudflare 공식 사이트에서 무료 계정을 생성합니다
- 대시보드에서 Account ID를 확인합니다 (Workers 배포 시 필요)
- Workers and Pages 메뉴에서 Workers 프로젝트를 관리합니다
- 무료 플랜으로 하루 10만 요청, 10ms CPU 시간 제공

---

## 2. Wrangler CLI 설치

Wrangler는 Cloudflare Workers 개발/배포 CLI 도구입니다.

```
npm install -g wrangler
wrangler login
wrangler whoami
```

- `wrangler login`으로 브라우저 인증 후 CLI에서 Cloudflare 리소스에 접근 가능
- `wrangler whoami`로 계정 ID와 이메일 확인

---

## 3. Workers 프로젝트 구조 이해

Workers는 V8 런타임 위에서 동작하는 서버리스 함수입니다.

- **Hono 프레임워크**: Express 스타일의 경량 라우터
- **wrangler.jsonc**: Workers 설정 파일 (바인딩, 환경변수, 라우팅)
- **D1**: SQLite 기반 서버리스 데이터베이스
- **KV**: 글로벌 키-값 저장소 (캐시, 설정)
- **R2**: S3 호환 오브젝트 스토리지

---

## 4. D1 데이터베이스 생성

```
wrangler d1 create my-database
```

- 생성 후 출력되는 Database ID를 `wrangler.jsonc`에 설정
- 마이그레이션 파일은 `migrations/` 폴더에 SQL로 작성
- `wrangler d1 migrations apply` 명령으로 스키마 적용

---

## 5. KV 네임스페이스 생성

```
wrangler kv namespace create APP_KV
wrangler kv namespace create APP_KV --preview
```

- KV는 전 세계 에지에 복제되는 키-값 저장소
- 설정값, 캐시, 세션 데이터에 적합
- `wrangler.jsonc`의 kv_namespaces에 ID 등록

---

## 6. 옥토워커스 프로젝트 클론

```
git clone https://github.com/johunsang/octoworkers.git
cd octoworkers
pnpm install
```

- pnpm 워크스페이스 모노레포 구조
- `worker/` — Hono API 서버
- `apps/landing/` — 마케팅 랜딩 페이지
- `apps/admin/` — 운영 콘솔
- `packages/com/` — 공유 타입

---

## 7. 환경변수 설정

```
cp worker/.dev.vars.example worker/.dev.vars
```

- `ADMIN_LOGIN_PASSWORD` — 어드민 로그인 비밀번호
- `ADMIN_JWT_SECRET` — JWT 서명 키 (32자 이상 랜덤 문자열)
- `GITHUB_CLIENT_SECRET` — GitHub OAuth 시크릿 (선택)
- `AI_PROVIDER_API_KEY` — AI Gateway API 키 (선택)

---

## 8. wrangler.jsonc 설정

`worker/wrangler.jsonc` 파일에서 아래 플레이스홀더를 실제 값으로 교체합니다.

- `REPLACE_WITH_ACCOUNT_ID` → Cloudflare Account ID
- `REPLACE_WITH_D1_DATABASE_ID` → D1 데이터베이스 ID
- 도메인 설정: `example.com` → 실제 도메인

---

## 9. 로컬 개발 실행

```
pnpm dev
```

- 랜딩 페이지: http://localhost:5173
- 어드민 콘솔: http://localhost:5174
- Worker API: http://localhost:8787
- D1 로컬 마이그레이션: `pnpm --filter @octoworkers/worker db:migrate:local`

---

## 10. 프로덕션 배포

```
pnpm build
pnpm deploy:prod
```

- `pnpm build` — 프론트엔드 빌드 (landing + admin → worker/public/)
- `pnpm deploy:prod` — D1 마이그레이션 + Workers 배포
- 커스텀 도메인은 Cloudflare DNS에서 CNAME/AAAA 레코드 추가
- GitHub Actions CI/CD 자동 배포 지원

---

## 11. 주요 아키텍처

```
Browser → Cloudflare Workers
  → 보안 헤더 → 인증 → CORS → ETag
  → /api/public/* — 비인증 API
  → /api/admin/* — 인증 필요 API
  → * → 프론트엔드 정적 자산 서빙
```

- 미들웨어 체인: 보안 → 인증 → CORS → ETag → 라우팅
- JWT 세션 + GitHub OAuth 인증
- D1 prepared statement (SQL 인젝션 방지)
- DOMPurify XSS 방어

---

## 12. 커스터마이징 팁

- 새 비즈니스 모듈: `worker/src/biz/{3글자}/` 폴더 생성
- 공유 타입: `packages/com/src/contracts.ts`에 정의
- DB 스키마: `worker/migrations/` 에 SQL 추가
- 프론트엔드: `apps/admin/src/biz/` 또는 `apps/landing/src/biz/`에 추가
- `_templates/` 폴더의 보일러플레이트 활용

---

## 요약

- **Cloudflare 무료 플랜**으로 시작 가능
- **Workers + D1 + KV**로 풀스택 서버리스 구현
- **옥토워커스**를 클론하면 즉시 SaaS 보일러플레이트 확보
- **pnpm dev** 한 줄로 로컬 개발 환경 실행
- **pnpm deploy:prod** 한 줄로 프로덕션 배포 완료',

  '<h1>Cloudflare Workers 실전 가이드</h1>
<p>Cloudflare 계정 생성부터 옥토워커스 SaaS 배포까지, 단계별 발표자료 형식으로 안내합니다.</p>

<hr />

<h2>1. Cloudflare 가입 및 대시보드</h2>
<ul><li>Cloudflare 공식 사이트에서 무료 계정을 생성합니다</li>
<li>대시보드에서 Account ID를 확인합니다 (Workers 배포 시 필요)</li>
<li>Workers and Pages 메뉴에서 Workers 프로젝트를 관리합니다</li>
<li>무료 플랜으로 하루 10만 요청, 10ms CPU 시간 제공</li></ul>

<hr />

<h2>2. Wrangler CLI 설치</h2>
<p>Wrangler는 Cloudflare Workers 개발/배포 CLI 도구입니다.</p>
<pre><code>npm install -g wrangler
wrangler login
wrangler whoami</code></pre>
<ul><li><code>wrangler login</code>으로 브라우저 인증 후 CLI에서 Cloudflare 리소스에 접근 가능</li>
<li><code>wrangler whoami</code>로 계정 ID와 이메일 확인</li></ul>

<hr />

<h2>3. Workers 프로젝트 구조 이해</h2>
<p>Workers는 V8 런타임 위에서 동작하는 서버리스 함수입니다.</p>
<ul><li><strong>Hono 프레임워크</strong>: Express 스타일의 경량 라우터</li>
<li><strong>wrangler.jsonc</strong>: Workers 설정 파일 (바인딩, 환경변수, 라우팅)</li>
<li><strong>D1</strong>: SQLite 기반 서버리스 데이터베이스</li>
<li><strong>KV</strong>: 글로벌 키-값 저장소 (캐시, 설정)</li>
<li><strong>R2</strong>: S3 호환 오브젝트 스토리지</li></ul>

<hr />

<h2>4. D1 데이터베이스 생성</h2>
<pre><code>wrangler d1 create my-database</code></pre>
<ul><li>생성 후 출력되는 Database ID를 <code>wrangler.jsonc</code>에 설정</li>
<li>마이그레이션 파일은 <code>migrations/</code> 폴더에 SQL로 작성</li>
<li><code>wrangler d1 migrations apply</code> 명령으로 스키마 적용</li></ul>

<hr />

<h2>5. KV 네임스페이스 생성</h2>
<pre><code>wrangler kv namespace create APP_KV
wrangler kv namespace create APP_KV --preview</code></pre>
<ul><li>KV는 전 세계 에지에 복제되는 키-값 저장소</li>
<li>설정값, 캐시, 세션 데이터에 적합</li>
<li><code>wrangler.jsonc</code>의 kv_namespaces에 ID 등록</li></ul>

<hr />

<h2>6. 옥토워커스 프로젝트 클론</h2>
<pre><code>git clone https://github.com/johunsang/octoworkers.git
cd octoworkers
pnpm install</code></pre>
<ul><li>pnpm 워크스페이스 모노레포 구조</li>
<li><code>worker/</code> — Hono API 서버</li>
<li><code>apps/landing/</code> — 마케팅 랜딩 페이지</li>
<li><code>apps/admin/</code> — 운영 콘솔</li>
<li><code>packages/com/</code> — 공유 타입</li></ul>

<hr />

<h2>7. 환경변수 설정</h2>
<pre><code>cp worker/.dev.vars.example worker/.dev.vars</code></pre>
<ul><li><code>ADMIN_LOGIN_PASSWORD</code> — 어드민 로그인 비밀번호</li>
<li><code>ADMIN_JWT_SECRET</code> — JWT 서명 키 (32자 이상 랜덤 문자열)</li>
<li><code>GITHUB_CLIENT_SECRET</code> — GitHub OAuth 시크릿 (선택)</li>
<li><code>AI_PROVIDER_API_KEY</code> — AI Gateway API 키 (선택)</li></ul>

<hr />

<h2>8. wrangler.jsonc 설정</h2>
<p><code>worker/wrangler.jsonc</code> 파일에서 아래 플레이스홀더를 실제 값으로 교체합니다.</p>
<ul><li><code>REPLACE_WITH_ACCOUNT_ID</code> → Cloudflare Account ID</li>
<li><code>REPLACE_WITH_D1_DATABASE_ID</code> → D1 데이터베이스 ID</li>
<li>도메인 설정: <code>example.com</code> → 실제 도메인</li></ul>

<hr />

<h2>9. 로컬 개발 실행</h2>
<pre><code>pnpm dev</code></pre>
<ul><li>랜딩 페이지: http://localhost:5173</li>
<li>어드민 콘솔: http://localhost:5174</li>
<li>Worker API: http://localhost:8787</li>
<li>D1 로컬 마이그레이션: <code>pnpm --filter @octoworkers/worker db:migrate:local</code></li></ul>

<hr />

<h2>10. 프로덕션 배포</h2>
<pre><code>pnpm build
pnpm deploy:prod</code></pre>
<ul><li><code>pnpm build</code> — 프론트엔드 빌드 (landing + admin → worker/public/)</li>
<li><code>pnpm deploy:prod</code> — D1 마이그레이션 + Workers 배포</li>
<li>커스텀 도메인은 Cloudflare DNS에서 CNAME/AAAA 레코드 추가</li>
<li>GitHub Actions CI/CD 자동 배포 지원</li></ul>

<hr />

<h2>11. 주요 아키텍처</h2>
<pre><code>Browser → Cloudflare Workers
  → 보안 헤더 → 인증 → CORS → ETag
  → /api/public/* — 비인증 API
  → /api/admin/* — 인증 필요 API
  → * → 프론트엔드 정적 자산 서빙</code></pre>
<ul><li>미들웨어 체인: 보안 → 인증 → CORS → ETag → 라우팅</li>
<li>JWT 세션 + GitHub OAuth 인증</li>
<li>D1 prepared statement (SQL 인젝션 방지)</li>
<li>DOMPurify XSS 방어</li></ul>

<hr />

<h2>12. 커스터마이징 팁</h2>
<ul><li>새 비즈니스 모듈: <code>worker/src/biz/{3글자}/</code> 폴더 생성</li>
<li>공유 타입: <code>packages/com/src/contracts.ts</code>에 정의</li>
<li>DB 스키마: <code>worker/migrations/</code> 에 SQL 추가</li>
<li>프론트엔드: <code>apps/admin/src/biz/</code> 또는 <code>apps/landing/src/biz/</code>에 추가</li>
<li><code>_templates/</code> 폴더의 보일러플레이트 활용</li></ul>

<hr />

<h2>요약</h2>
<ul><li><strong>Cloudflare 무료 플랜</strong>으로 시작 가능</li>
<li><strong>Workers + D1 + KV</strong>로 풀스택 서버리스 구현</li>
<li><strong>옥토워커스</strong>를 클론하면 즉시 SaaS 보일러플레이트 확보</li>
<li><strong>pnpm dev</strong> 한 줄로 로컬 개발 환경 실행</li>
<li><strong>pnpm deploy:prod</strong> 한 줄로 프로덕션 배포 완료</li></ul>',

  'published',
  datetime('now'),
  datetime('now'),
  datetime('now')
);
