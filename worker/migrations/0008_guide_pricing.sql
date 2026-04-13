-- Add detailed Cloudflare pricing section to guide page
UPDATE pages SET
  content_md = '# Cloudflare Workers 실전 가이드

Cloudflare 계정 생성부터 옥토워커스 SaaS 배포까지, 단계별 발표자료 형식으로 안내합니다.

---

## 1. Cloudflare 가입 및 대시보드

- Cloudflare 공식 사이트에서 무료 계정을 생성합니다
- 대시보드에서 Account ID를 확인합니다 (Workers 배포 시 필요)
- Workers and Pages 메뉴에서 Workers 프로젝트를 관리합니다
- 무료 플랜으로 하루 10만 요청, 10ms CPU 시간 제공

---

## 2. Cloudflare Workers 요금제

### Free Plan (무료)

- 요청: 하루 10만 건
- CPU 시간: 요청당 10ms
- D1 데이터베이스: 5GB 저장, 읽기 500만/일, 쓰기 10만/일
- KV 저장소: 읽기 10만/일, 쓰기 1천/일, 저장 1GB
- R2 스토리지: 저장 10GB, 읽기 1천만/월, 쓰기 100만/월
- Workers AI: 일부 모델 무료 사용 가능
- 커스텀 도메인, SSL 인증서 무료 포함

### Workers Paid Plan ($5/월)

- 요청: 월 1천만 건 포함, 초과 시 100만 건당 $0.30
- CPU 시간: 요청당 30ms (무료 대비 3배)
- D1 데이터베이스: 5GB 포함, 읽기 250억/월, 쓰기 5천만/월, 초과 저장 $0.75/GB
- KV 저장소: 읽기 1천만/월, 쓰기 100만/월, 저장 1GB, 초과 종량제
- R2 스토리지: 저장 10GB, 읽기/쓰기 대폭 확대, 초과 종량제
- Workers AI: 포함 (일부 모델 무료, 고급 모델 종량제)
- Durable Objects: 포함 (실시간 WebSocket, 상태 관리)
- Queues, Vectorize, Hyperdrive 등 고급 기능 사용 가능

### 요금 계산 예시

- 월 500만 요청 + D1 3GB: **$5/월** (포함 한도 내)
- 월 1,500만 요청 + D1 3GB: **$6.50/월** ($5 + 500만 초과 x $0.30/100만)
- 월 5천만 요청 + D1 10GB: **$21.75/월** ($5 + 4천만 x $0.30/100만 + 5GB 초과 x $0.75)

### 핵심 포인트

- $5/월 기본료에 포함된 한도를 넘기면 초과분만 종량제 과금
- 소규모~중규모 SaaS는 대부분 $5/월 안에서 해결
- AWS Lambda + RDS 조합 대비 80~90% 비용 절감 가능
- 트래픽이 없으면 $5/월만 발생 (서버 유지비 없음)

---

## 3. Wrangler CLI 설치

Wrangler는 Cloudflare Workers 개발/배포 CLI 도구입니다.

```
npm install -g wrangler
wrangler login
wrangler whoami
```

- `wrangler login`으로 브라우저 인증 후 CLI에서 Cloudflare 리소스에 접근 가능
- `wrangler whoami`로 계정 ID와 이메일 확인

---

## 4. Workers 프로젝트 구조 이해

Workers는 V8 런타임 위에서 동작하는 서버리스 함수입니다.

- **Hono 프레임워크**: Express 스타일의 경량 라우터
- **wrangler.jsonc**: Workers 설정 파일 (바인딩, 환경변수, 라우팅)
- **D1**: SQLite 기반 서버리스 데이터베이스
- **KV**: 글로벌 키-값 저장소 (캐시, 설정)
- **R2**: S3 호환 오브젝트 스토리지

---

## 5. D1 데이터베이스 생성

```
wrangler d1 create my-database
```

- 생성 후 출력되는 Database ID를 `wrangler.jsonc`에 설정
- 마이그레이션 파일은 `migrations/` 폴더에 SQL로 작성
- `wrangler d1 migrations apply` 명령으로 스키마 적용

---

## 6. KV 네임스페이스 생성

```
wrangler kv namespace create APP_KV
wrangler kv namespace create APP_KV --preview
```

- KV는 전 세계 에지에 복제되는 키-값 저장소
- 설정값, 캐시, 세션 데이터에 적합
- `wrangler.jsonc`의 kv_namespaces에 ID 등록

---

## 7. 옥토워커스 프로젝트 클론

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

## 8. 환경변수 설정

```
cp worker/.dev.vars.example worker/.dev.vars
```

- `ADMIN_LOGIN_PASSWORD` — 어드민 로그인 비밀번호
- `ADMIN_JWT_SECRET` — JWT 서명 키 (32자 이상 랜덤 문자열)
- `GITHUB_CLIENT_SECRET` — GitHub OAuth 시크릿 (선택)
- `AI_PROVIDER_API_KEY` — AI Gateway API 키 (선택)

---

## 9. wrangler.jsonc 설정

`worker/wrangler.jsonc` 파일에서 아래 플레이스홀더를 실제 값으로 교체합니다.

- `REPLACE_WITH_ACCOUNT_ID` → Cloudflare Account ID
- `REPLACE_WITH_D1_DATABASE_ID` → D1 데이터베이스 ID
- 도메인 설정: `example.com` → 실제 도메인

---

## 10. 로컬 개발 실행

```
pnpm dev
```

- 랜딩 페이지: http://localhost:5173
- 어드민 콘솔: http://localhost:5174
- Worker API: http://localhost:8787
- D1 로컬 마이그레이션: `pnpm --filter @octoworkers/worker db:migrate:local`

---

## 11. 프로덕션 배포

```
pnpm build
pnpm deploy:prod
```

- `pnpm build` — 프론트엔드 빌드 (landing + admin → worker/public/)
- `pnpm deploy:prod` — D1 마이그레이션 + Workers 배포
- 커스텀 도메인은 Cloudflare DNS에서 CNAME/AAAA 레코드 추가
- GitHub Actions CI/CD 자동 배포 지원

---

## 12. 주요 아키텍처

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

## 13. 커스터마이징 팁

- 새 비즈니스 모듈: `worker/src/biz/{3글자}/` 폴더 생성
- 공유 타입: `packages/com/src/contracts.ts`에 정의
- DB 스키마: `worker/migrations/` 에 SQL 추가
- 프론트엔드: `apps/admin/src/biz/` 또는 `apps/landing/src/biz/`에 추가
- `_templates/` 폴더의 보일러플레이트 활용

---

## 14. 서비스별 상세 요금 비교

### D1 (서버리스 데이터베이스)

- 무료: 5GB 저장, 읽기 500만/일, 쓰기 10만/일
- 유료: 5GB 포함 + 초과 $0.75/GB/월, 읽기 250억/월, 쓰기 5천만/월
- 옥토워커스 기본 스키마 용량: 약 10~50MB (충분히 무료 범위)

### KV (키-값 저장소)

- 무료: 읽기 10만/일, 쓰기 1천/일, 저장 1GB
- 유료: 읽기 1천만/월, 쓰기 100만/월, 저장 1GB 포함
- 초과: 읽기 $0.50/100만, 쓰기 $5.00/100만, 저장 $0.50/GB

### R2 (오브젝트 스토리지)

- 저장: 10GB 무료, 초과 $0.015/GB/월
- 읽기(Class A): 100만 건 무료, 초과 $4.50/100만
- 쓰기(Class B): 1천만 건 무료, 초과 $0.36/100만
- **이그레스(데이터 전송) 비용 $0** (AWS S3 대비 최대 장점)

### Workers AI

- 무료 모델: Llama 3.1 8B, Mistral 7B 등 (일일 한도 내 무료)
- 유료 모델: 토큰 기반 종량제
- 임베딩: BGE Small $0.001/1천 토큰
- AI Gateway: 캐싱, 로깅, 속도 제한 무료 제공

### Vectorize (벡터 검색)

- 무료: 5백만 벡터, 쿼리 3천만/월
- 유료: 1천만 벡터 포함, 초과 $0.01/1천 벡터, 쿼리 5천만/월

### Durable Objects (상태 관리)

- 유료 전용: $5/월 플랜 필요
- 요청: 100만 건/월 포함, 초과 $0.15/100만
- 저장: 1GB 포함, 초과 $0.20/GB
- WebSocket 연결 지속, 글로벌 상태 동기화에 적합

---

## 요약

- **Cloudflare 무료 플랜**으로 시작 가능
- **Workers Paid ($5/월)**로 프로덕션 운영, 초과분만 종량제
- **Workers + D1 + KV**로 풀스택 서버리스 구현
- **R2 이그레스 무료**로 AWS 대비 스토리지 비용 대폭 절감
- **옥토워커스**를 클론하면 즉시 SaaS 보일러플레이트 확보
- **pnpm dev** 한 줄로 로컬 개발 환경 실행
- **pnpm deploy:prod** 한 줄로 프로덕션 배포 완료',

  content_html = '<h1>Cloudflare Workers 실전 가이드</h1>
<p>Cloudflare 계정 생성부터 옥토워커스 SaaS 배포까지, 단계별 발표자료 형식으로 안내합니다.</p>

<hr />

<h2>1. Cloudflare 가입 및 대시보드</h2>
<ul><li>Cloudflare 공식 사이트에서 무료 계정을 생성합니다</li>
<li>대시보드에서 Account ID를 확인합니다 (Workers 배포 시 필요)</li>
<li>Workers and Pages 메뉴에서 Workers 프로젝트를 관리합니다</li>
<li>무료 플랜으로 하루 10만 요청, 10ms CPU 시간 제공</li></ul>

<hr />

<h2>2. Cloudflare Workers 요금제</h2>

<h3>Free Plan (무료)</h3>
<ul><li>요청: 하루 10만 건</li>
<li>CPU 시간: 요청당 10ms</li>
<li>D1 데이터베이스: 5GB 저장, 읽기 500만/일, 쓰기 10만/일</li>
<li>KV 저장소: 읽기 10만/일, 쓰기 1천/일, 저장 1GB</li>
<li>R2 스토리지: 저장 10GB, 읽기 1천만/월, 쓰기 100만/월</li>
<li>Workers AI: 일부 모델 무료 사용 가능</li>
<li>커스텀 도메인, SSL 인증서 무료 포함</li></ul>

<h3>Workers Paid Plan ($5/월)</h3>
<ul><li>요청: 월 1천만 건 포함, 초과 시 100만 건당 $0.30</li>
<li>CPU 시간: 요청당 30ms (무료 대비 3배)</li>
<li>D1 데이터베이스: 5GB 포함, 읽기 250억/월, 쓰기 5천만/월, 초과 저장 $0.75/GB</li>
<li>KV 저장소: 읽기 1천만/월, 쓰기 100만/월, 저장 1GB, 초과 종량제</li>
<li>R2 스토리지: 저장 10GB, 읽기/쓰기 대폭 확대, 초과 종량제</li>
<li>Workers AI: 포함 (일부 모델 무료, 고급 모델 종량제)</li>
<li>Durable Objects: 포함 (실시간 WebSocket, 상태 관리)</li>
<li>Queues, Vectorize, Hyperdrive 등 고급 기능 사용 가능</li></ul>

<h3>요금 계산 예시</h3>
<ul><li>월 500만 요청 + D1 3GB: <strong>$5/월</strong> (포함 한도 내)</li>
<li>월 1,500만 요청 + D1 3GB: <strong>$6.50/월</strong> ($5 + 500만 초과 x $0.30/100만)</li>
<li>월 5천만 요청 + D1 10GB: <strong>$21.75/월</strong> ($5 + 4천만 x $0.30/100만 + 5GB 초과 x $0.75)</li></ul>

<h3>핵심 포인트</h3>
<ul><li>$5/월 기본료에 포함된 한도를 넘기면 초과분만 종량제 과금</li>
<li>소규모~중규모 SaaS는 대부분 $5/월 안에서 해결</li>
<li>AWS Lambda + RDS 조합 대비 80~90% 비용 절감 가능</li>
<li>트래픽이 없으면 $5/월만 발생 (서버 유지비 없음)</li></ul>

<hr />

<h2>3. Wrangler CLI 설치</h2>
<p>Wrangler는 Cloudflare Workers 개발/배포 CLI 도구입니다.</p>
<pre><code>npm install -g wrangler
wrangler login
wrangler whoami</code></pre>
<ul><li><code>wrangler login</code>으로 브라우저 인증 후 CLI에서 Cloudflare 리소스에 접근 가능</li>
<li><code>wrangler whoami</code>로 계정 ID와 이메일 확인</li></ul>

<hr />

<h2>4. Workers 프로젝트 구조 이해</h2>
<p>Workers는 V8 런타임 위에서 동작하는 서버리스 함수입니다.</p>
<ul><li><strong>Hono 프레임워크</strong>: Express 스타일의 경량 라우터</li>
<li><strong>wrangler.jsonc</strong>: Workers 설정 파일 (바인딩, 환경변수, 라우팅)</li>
<li><strong>D1</strong>: SQLite 기반 서버리스 데이터베이스</li>
<li><strong>KV</strong>: 글로벌 키-값 저장소 (캐시, 설정)</li>
<li><strong>R2</strong>: S3 호환 오브젝트 스토리지</li></ul>

<hr />

<h2>5. D1 데이터베이스 생성</h2>
<pre><code>wrangler d1 create my-database</code></pre>
<ul><li>생성 후 출력되는 Database ID를 <code>wrangler.jsonc</code>에 설정</li>
<li>마이그레이션 파일은 <code>migrations/</code> 폴더에 SQL로 작성</li>
<li><code>wrangler d1 migrations apply</code> 명령으로 스키마 적용</li></ul>

<hr />

<h2>6. KV 네임스페이스 생성</h2>
<pre><code>wrangler kv namespace create APP_KV
wrangler kv namespace create APP_KV --preview</code></pre>
<ul><li>KV는 전 세계 에지에 복제되는 키-값 저장소</li>
<li>설정값, 캐시, 세션 데이터에 적합</li>
<li><code>wrangler.jsonc</code>의 kv_namespaces에 ID 등록</li></ul>

<hr />

<h2>7. 옥토워커스 프로젝트 클론</h2>
<pre><code>git clone https://github.com/johunsang/octoworkers.git
cd octoworkers
pnpm install</code></pre>
<ul><li>pnpm 워크스페이스 모노레포 구조</li>
<li><code>worker/</code> — Hono API 서버</li>
<li><code>apps/landing/</code> — 마케팅 랜딩 페이지</li>
<li><code>apps/admin/</code> — 운영 콘솔</li>
<li><code>packages/com/</code> — 공유 타입</li></ul>

<hr />

<h2>8. 환경변수 설정</h2>
<pre><code>cp worker/.dev.vars.example worker/.dev.vars</code></pre>
<ul><li><code>ADMIN_LOGIN_PASSWORD</code> — 어드민 로그인 비밀번호</li>
<li><code>ADMIN_JWT_SECRET</code> — JWT 서명 키 (32자 이상 랜덤 문자열)</li>
<li><code>GITHUB_CLIENT_SECRET</code> — GitHub OAuth 시크릿 (선택)</li>
<li><code>AI_PROVIDER_API_KEY</code> — AI Gateway API 키 (선택)</li></ul>

<hr />

<h2>9. wrangler.jsonc 설정</h2>
<p><code>worker/wrangler.jsonc</code> 파일에서 아래 플레이스홀더를 실제 값으로 교체합니다.</p>
<ul><li><code>REPLACE_WITH_ACCOUNT_ID</code> → Cloudflare Account ID</li>
<li><code>REPLACE_WITH_D1_DATABASE_ID</code> → D1 데이터베이스 ID</li>
<li>도메인 설정: <code>example.com</code> → 실제 도메인</li></ul>

<hr />

<h2>10. 로컬 개발 실행</h2>
<pre><code>pnpm dev</code></pre>
<ul><li>랜딩 페이지: http://localhost:5173</li>
<li>어드민 콘솔: http://localhost:5174</li>
<li>Worker API: http://localhost:8787</li>
<li>D1 로컬 마이그레이션: <code>pnpm --filter @octoworkers/worker db:migrate:local</code></li></ul>

<hr />

<h2>11. 프로덕션 배포</h2>
<pre><code>pnpm build
pnpm deploy:prod</code></pre>
<ul><li><code>pnpm build</code> — 프론트엔드 빌드 (landing + admin → worker/public/)</li>
<li><code>pnpm deploy:prod</code> — D1 마이그레이션 + Workers 배포</li>
<li>커스텀 도메인은 Cloudflare DNS에서 CNAME/AAAA 레코드 추가</li>
<li>GitHub Actions CI/CD 자동 배포 지원</li></ul>

<hr />

<h2>12. 주요 아키텍처</h2>
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

<h2>13. 커스터마이징 팁</h2>
<ul><li>새 비즈니스 모듈: <code>worker/src/biz/{3글자}/</code> 폴더 생성</li>
<li>공유 타입: <code>packages/com/src/contracts.ts</code>에 정의</li>
<li>DB 스키마: <code>worker/migrations/</code> 에 SQL 추가</li>
<li>프론트엔드: <code>apps/admin/src/biz/</code> 또는 <code>apps/landing/src/biz/</code>에 추가</li>
<li><code>_templates/</code> 폴더의 보일러플레이트 활용</li></ul>

<hr />

<h2>14. 서비스별 상세 요금 비교</h2>

<h3>D1 (서버리스 데이터베이스)</h3>
<ul><li>무료: 5GB 저장, 읽기 500만/일, 쓰기 10만/일</li>
<li>유료: 5GB 포함 + 초과 $0.75/GB/월, 읽기 250억/월, 쓰기 5천만/월</li>
<li>옥토워커스 기본 스키마 용량: 약 10~50MB (충분히 무료 범위)</li></ul>

<h3>KV (키-값 저장소)</h3>
<ul><li>무료: 읽기 10만/일, 쓰기 1천/일, 저장 1GB</li>
<li>유료: 읽기 1천만/월, 쓰기 100만/월, 저장 1GB 포함</li>
<li>초과: 읽기 $0.50/100만, 쓰기 $5.00/100만, 저장 $0.50/GB</li></ul>

<h3>R2 (오브젝트 스토리지)</h3>
<ul><li>저장: 10GB 무료, 초과 $0.015/GB/월</li>
<li>읽기(Class A): 100만 건 무료, 초과 $4.50/100만</li>
<li>쓰기(Class B): 1천만 건 무료, 초과 $0.36/100만</li>
<li><strong>이그레스(데이터 전송) 비용 $0</strong> (AWS S3 대비 최대 장점)</li></ul>

<h3>Workers AI</h3>
<ul><li>무료 모델: Llama 3.1 8B, Mistral 7B 등 (일일 한도 내 무료)</li>
<li>유료 모델: 토큰 기반 종량제</li>
<li>임베딩: BGE Small $0.001/1천 토큰</li>
<li>AI Gateway: 캐싱, 로깅, 속도 제한 무료 제공</li></ul>

<h3>Vectorize (벡터 검색)</h3>
<ul><li>무료: 5백만 벡터, 쿼리 3천만/월</li>
<li>유료: 1천만 벡터 포함, 초과 $0.01/1천 벡터, 쿼리 5천만/월</li></ul>

<h3>Durable Objects (상태 관리)</h3>
<ul><li>유료 전용: $5/월 플랜 필요</li>
<li>요청: 100만 건/월 포함, 초과 $0.15/100만</li>
<li>저장: 1GB 포함, 초과 $0.20/GB</li>
<li>WebSocket 연결 지속, 글로벌 상태 동기화에 적합</li></ul>

<hr />

<h2>요약</h2>
<ul><li><strong>Cloudflare 무료 플랜</strong>으로 시작 가능</li>
<li><strong>Workers Paid ($5/월)</strong>로 프로덕션 운영, 초과분만 종량제</li>
<li><strong>Workers + D1 + KV</strong>로 풀스택 서버리스 구현</li>
<li><strong>R2 이그레스 무료</strong>로 AWS 대비 스토리지 비용 대폭 절감</li>
<li><strong>옥토워커스</strong>를 클론하면 즉시 SaaS 보일러플레이트 확보</li>
<li><strong>pnpm dev</strong> 한 줄로 로컬 개발 환경 실행</li>
<li><strong>pnpm deploy:prod</strong> 한 줄로 프로덕션 배포 완료</li></ul>',

  updated_at = datetime('now')
WHERE slug = 'guide';
