# 옥토워커스 — 에이전트 작업 가이드

> 이 프로젝트는 Cloudflare Workers 기반 SaaS 보일러플레이트다. 복사해서 새 프로젝트를 시작하는 용도로 설계되었다. 이 문서는 Codex, Claude Code 등 에이전트가 이 보일러플레이트를 올바르게 이해하고 커스터마이징을 도울 수 있도록 작성되었다.

## 프로젝트 구조

- `/` — 루트 monorepo (pnpm workspace)
- `/worker/` — Hono + Cloudflare Workers API 서버
- `/apps/landing/` — 공개 랜딩 페이지 (React + Vite)
- `/apps/admin/` — 인증 기반 운영 콘솔 (React + Vite)
- `/packages/com/` — 프론트-백엔드 공유 타입 패키지
- `/_templates/` — 새 모듈 생성용 템플릿
- `/docs/` — 운영 문서

## 보일러플레이트 커스터마이징 가이드

> 이 프로젝트를 복사한 후 새 SaaS를 시작할 때 아래 순서로 진행한다.

### 1단계: 프로젝트 이름 교체

- `package.json` (루트): `octoworkers` → 새 프로젝트명
- `worker/package.json`: `@octoworkers/worker` → `@새프로젝트/worker`
- `apps/landing/package.json`, `apps/admin/package.json`: 패키지명 교체
- `packages/com/package.json`: `@octoworkers/com` → `@새프로젝트/com`
- `pnpm-workspace.yaml`은 구조 변경이 없으면 그대로 유지

### 2단계: Cloudflare 리소스 설정

`worker/wrangler.jsonc`에서 아래 값을 실제 값으로 교체:

```
REPLACE_WITH_ACCOUNT_ID        → Cloudflare Account ID
REPLACE_WITH_D1_DATABASE_ID    → D1 데이터베이스 ID
REPLACE_WITH_IMAGES_DELIVERY_HASH → Cloudflare Images delivery hash
example.com / admin.example.com → 실제 도메인
```

staging 환경도 동일하게 교체. `routes` 섹션은 DNS 설정 완료 후 주석 해제.

### 3단계: 시크릿 설정

```bash
cp worker/.dev.vars.example worker/.dev.vars
# .dev.vars에 실제 시크릿 값 입력
```

배포용 시크릿:

```bash
wrangler secret put ADMIN_LOGIN_PASSWORD
wrangler secret put ADMIN_JWT_SECRET
wrangler secret put AI_PROVIDER_API_KEY          # 선택
wrangler secret put CLOUDFLARE_IMAGES_API_TOKEN  # 선택
```

### 4단계: DB 초기화

```bash
pnpm --filter @octoworkers/worker db:migrate:local
```

기본 스키마: `site_settings`(싱글톤), `leads`, `media_assets`. 새 테이블은 `worker/migrations/0002_*.sql`로 추가.

### 5단계: 불필요한 예제 제거 (선택)

보일러플레이트에 포함된 예제 모듈 중 불필요한 것을 제거할 수 있다:

| 모듈 | 경로 | 제거 시 확인 |
| --- | --- | --- |
| KV/R2/WS 예제 | `worker/src/biz/ext/`, `apps/admin/src/biz/ext/` | `index.ts`에서 `extRoutes` 제거 |
| 에이전트 | `worker/src/biz/agt/` | `index.ts`에서 `agentRoutes` + `OpsAgent` export 제거, `wrangler.jsonc` DO 설정 제거 |
| 벡터 검색 | `worker/src/biz/vec/` | `index.ts`에서 `vectorRoutes` 제거, `wrangler.jsonc` vectorize 설정 제거 |
| AI 카피 | `worker/src/biz/aid/` | `index.ts`에서 `aiRoutes` 제거 |

### 6단계: 비즈니스 모듈 추가

`_templates/README.md` 참고. 요약:

1. `_templates/biz-module/` 복사 → `worker/src/biz/{3글자}/`
2. `__ITEM__` 플레이스홀더 치환
3. `packages/com/src/contracts.ts`에 공유 타입 추가
4. `worker/src/index.ts`에 `.route()` 등록
5. D1 마이그레이션 SQL 작성
6. `worker/test/app.test.ts`에 테스트 추가
7. `apps/admin/src/biz/{3글자}/` 에 훅/컴포넌트 추가

## 개발 규칙

> 경고: 이 규칙을 읽지 않고 개발을 진행하면 안 된다.

- `AGENTS.md`와 `CLAUDE.md`는 항상 동일한 기준 문서로 유지한다. 한쪽이 바뀌면 다른 한쪽도 반드시 즉시 양방향 동기화한다.
- 이 문서는 Codex와 Claude를 포함한 에이전트가 이 저장소에서 안전하게 작업하기 위한 공용 운영 문서다.
- 기능 추가, 구조 변경, 정책 변경, API 변경이 있으면 관련 문서를 즉시 갱신한다.
- 공통으로 재사용되는 로직은 중복 복사하지 말고 공통 모듈(`com/`)로 정리한다.
- 모듈, 서비스는 책임이 명확해야 하며 결합도는 낮추고 응집도는 높인다.
- 변경사항이 생기면 해당 파일만 국소적으로 보지 말고 전체 흐름에서 점검한다.
- 수정 후에는 입력, 처리, 저장, 출력까지 이어지는 사용자 흐름을 기준으로 영향을 다시 확인한다.
- 모든 개발 전후에는 반드시 영향분석을 수행한다.
- 변경이 작아 보여도 공통 모듈, 데이터 흐름, API, UI에 미치는 영향을 매번 확인한다.

## 기술 스택

| Layer | Technology |
| --- | --- |
| Language | TypeScript (strict) |
| API | Hono 4 on Cloudflare Workers |
| Frontend | React 19 + Vite (SWC), 두 개 앱 |
| Database | Cloudflare D1 (SQLite) |
| Storage | KV (캐시), R2 (오브젝트, 선택) |
| Media | Cloudflare Images (direct upload, 선택) |
| AI | Workers AI + AI Gateway + Vectorize (선택) |
| Realtime | Durable Objects + WebSocket (선택) |
| Testing | Vitest |
| Package Manager | pnpm 9.15 (workspace monorepo) |
| CI/CD | GitHub Actions → Cloudflare Workers |

## 실행 방법

```bash
pnpm install
cp worker/.dev.vars.example worker/.dev.vars
pnpm --filter @octoworkers/worker db:migrate:local
pnpm dev                    # 전체 (landing:5173 + admin:5174 + worker:8787)
```

```bash
pnpm dev:remote             # 원격 Cloudflare 리소스 연결 (AI/Vectorize/Agents)
pnpm dev:worker             # Worker만
pnpm dev:apps               # 프론트엔드만
pnpm check                  # tsc --noEmit (전 패키지)
pnpm test                   # Vitest
pnpm build                  # landing + admin 프로덕션 빌드
pnpm deploy:staging         # 빌드 → D1 마이그레이션 → staging 배포
pnpm deploy:prod            # 빌드 → D1 마이그레이션 → production 배포
```

## 아키텍처

```text
Browser
  → Cloudflare Workers (worker/src/index.ts)
    → 미들웨어: applySecurityHeaders → enforceAdminAccess → agentsMiddleware → cors → etag
    → 라우트:
        /api/health           → hlt/ (헬스체크)
        /api/auth/*           → aut/ (JWT 세션)
        /api/public/*         → pub/ (bootstrap, lead submit)
        /api/admin/dashboard  → dsh/ (통계)
        /api/admin/settings   → set/ (사이트 설정 CRUD)
        /api/admin/leads      → led/ (리드 CRM: 목록, 상세, 상태, 태그, 노트)
        /api/admin/images     → med/ (Cloudflare Images)
        /api/admin/ai         → aid/ (AI Gateway 카피 생성)
        /api/admin/email      → eml/ (이메일 템플릿, 발송, 로그)
        /api/admin/pages      → pag/ (콘텐츠 CMS: 페이지 CRUD, 발행)
        /api/admin/agt        → agt/ (Durable Object 에이전트)
        /api/admin/search     → srh/ (SQL LIKE 전문 검색)
        /api/admin/vec        → vec/ (Vectorize 시맨틱 검색)
        /api/admin/users      → usr/ (사용자 관리: CRUD, 역할, 활성화)
        /api/admin/logs       → log/ (접속 로그, API 로그, 시스템 통계)
        /api/admin/ext        → ext/ (KV/R2/WS 예제)
    → API 로깅 미들웨어 → 모든 /api/* 요청을 api_logs 테이블에 자동 기록
    → * → serveBoundAsset (SPA 정적자산)
        → admin.octoworkers.com → /admin/index.html
        → app.octoworkers.com   → /landing/index.html (PageListView)
        → octoworkers.com       → /landing/index.html
```

### 인증 모델

- `ADMIN_ACCESS_MODE`: `cloudflare-access` | `session` | `hybrid` | `off`
- `enforceAdminAccess` 미들웨어가 `/api/admin/*`, `/agents/*` 보호
- Cloudflare Access 헤더 + JWT 쿠키 세션 병행 가능
- localhost는 항상 허용 (개발용)

### Cloudflare 바인딩

| 바인딩 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `DB` | D1 | 필수 | 메인 DB (settings, leads, media) |
| `ASSETS` | Assets | 필수 | 프론트 정적자산 |
| `APP_KV` | KV | 필수 | 키값 저장소 |
| `AI` | Workers AI | 선택 | 텍스트 생성, 임베딩 |
| `DOC_INDEX` | Vectorize | 선택 | 시맨틱 검색 |
| `OpsAgent` | Durable Object | 선택 | 운영 에이전트 |
| `MEDIA_R2` | R2 | 선택 | 오브젝트 저장소 (주석 상태) |

### DB 스키마

```sql
site_settings   — 싱글톤(id=1): brand, hero_label, hero_title, hero_subtitle, cta_primary, cta_secondary
leads           — name, email, company, message, status, assigned_to, source, created_at
lead_tags       — lead_id, tag, created_at (UNIQUE lead_id+tag)
lead_notes      — lead_id, content, created_by, created_at
media_assets    — image_id, title, alt, status, delivery_url, preview_url, uploaded_at
email_templates — name, subject, body_html, body_text, created_at, updated_at
email_logs      — lead_id, template_id, subject, status, sent_at
pages           — slug(UNIQUE), title, content_md, content_html, status, published_at, created_at, updated_at
admin_users     — email(UNIQUE), name, role, avatar_url, github_login, last_login_at, is_active, created_at, updated_at
access_logs     — user_email, action, path, method, status_code, ip_address, user_agent, created_at
api_logs        — method, path, status_code, duration_ms, request_body, response_size, ip_address, created_at
```

### 보안 헤더

`applySecurityHeaders`가 모든 요청에 적용 (WebSocket 제외): CSP(self + imagedelivery.net), HSTS, X-Frame-Options:DENY, nosniff, COOP, Permissions-Policy

## 상세 구조

```text
octoworkers/
├── CLAUDE.md / AGENTS.md     # 에이전트 작업 가이드 (항상 동기화)
├── package.json              # 루트 scripts (dev, build, deploy 등)
├── pnpm-workspace.yaml       # apps/*, packages/*, worker
│
├── packages/com/src/
│   ├── index.ts              # re-export
│   └── contracts.ts          # 공유 타입: SiteSettings, LeadRecord, MediaAsset 등
│
├── apps/landing/src/
│   ├── main.tsx, App.tsx     # 랜딩 메인
│   ├── com/api/client.ts     # apiFetch<T>()
│   ├── com/ui/Section.tsx    # 공통 레이아웃
│   └── biz/mkt/             # 마케팅: usePublicBootstrap, HeroPanel, LeadCapturePanel, FeatureGrid
│
├── apps/admin/src/
│   ├── main.tsx, App.tsx     # 어드민 메인 (로그인 → 사이드바 + 패널)
│   ├── com/api/client.ts     # apiFetch<T>()
│   ├── com/ui/Panel.tsx      # 대시보드 카드
│   └── biz/                  # aut/, dsh/, set/, led/, med/, aid/, srh/, eml/, pag/, ext/, usr/, log/
│
├── worker/
│   ├── src/index.ts          # createApp() — 미들웨어 + 라우트 등록
│   ├── src/com/              # bindings, db, http, env, security, assets, ai-gateway, workers-ai
│   ├── src/biz/              # aut, pub, dsh, led, med, set, aid, srh, vec, agt, hlt, eml, pag, ext, usr, log
│   ├── migrations/           # 0001_initial.sql ~ 0006_admin_system.sql
│   ├── test/app.test.ts      # Vitest (mock 바인딩)
│   ├── wrangler.jsonc        # prod + staging 설정
│   └── .dev.vars.example     # 시크릿 템플릿
│
├── _templates/               # 새 모듈 생성 템플릿 (routes, repository, service, hook, component, test, migration)
├── docs/                     # 01-cloudflare-setup, 02-deployments, 03-security-auth, 04-examples
└── .github/workflows/        # ci.yml, deploy-staging.yml, deploy-production.yml
```

## 모듈 규칙

### 명명

- `com/` — 공통 인프라 (비즈니스 로직 없음)
- `biz/{3글자}/` — 비즈니스 모듈
- `biz/ext/` — 예제/확장

### 파일 패턴

| Worker | 역할 |
| --- | --- |
| `routes.ts` | Hono 라우터 (`new Hono<{ Bindings: AppBindings }>()`) |
| `repository.ts` | D1 쿼리 (prepared statement 필수) |
| `service.ts` | 비즈니스 로직 (필요 시) |

| Frontend | 역할 |
| --- | --- |
| `hooks/use*.ts` | React 훅 (API 호출 + 상태 관리) |
| `components/*.tsx` | UI 컴포넌트 |

## API 엔드포인트

| 경로 | 메서드 | 모듈 | 설명 |
| --- | --- | --- | --- |
| `/api/health` | GET | hlt | 헬스체크 |
| `/api/auth/me` | GET | aut | 세션 확인 |
| `/api/auth/login` | POST | aut | 로그인 |
| `/api/auth/logout` | POST | aut | 로그아웃 |
| `/api/public/bootstrap` | GET | pub | 랜딩 초기화 |
| `/api/public/leads` | POST | pub | 리드 등록 |
| `/api/admin/dashboard` | GET | dsh | 대시보드 |
| `/api/admin/settings` | GET/PUT | set | 사이트 설정 |
| `/api/admin/leads` | GET | led | 리드 목록 |
| `/api/admin/leads/:id` | GET | led | 리드 상세 (태그, 노트 포함) |
| `/api/admin/leads/:id/status` | PUT | led | 리드 상태 변경 |
| `/api/admin/leads/:id/tags` | POST | led | 태그 추가 |
| `/api/admin/leads/:id/tags/:tag` | DELETE | led | 태그 삭제 |
| `/api/admin/leads/:id/notes` | GET/POST | led | 노트 목록/추가 |
| `/api/admin/images` | GET | med | 미디어 목록 |
| `/api/admin/images/direct-upload` | POST | med | 업로드 URL |
| `/api/admin/images/:id/refresh` | POST | med | 상태 새로고침 |
| `/api/admin/images/:id` | PUT/DELETE | med | 수정/삭제 |
| `/api/admin/ai/copy` | POST | aid | AI 카피 생성 |
| `/api/admin/search` | GET | srh | 전문 검색 |
| `/api/admin/vec/reindex` | POST | vec | 인덱스 재구축 |
| `/api/admin/vec/search` | POST | vec | 시맨틱 검색 |
| `/api/admin/agt` | GET | agt | 에이전트 스냅샷 |
| `/api/admin/agt/tasks` | POST | agt | 작업 추가 |
| `/api/admin/email/templates` | GET/POST | eml | 이메일 템플릿 목록/생성 |
| `/api/admin/email/templates/:id` | GET/PUT/DELETE | eml | 템플릿 상세/수정/삭제 |
| `/api/admin/email/send` | POST | eml | 이메일 발송 (Resend API) |
| `/api/admin/email/logs` | GET | eml | 발송 이력 |
| `/api/admin/pages` | GET/POST | pag | 페이지 목록/생성 |
| `/api/admin/pages/:id` | GET/PUT/DELETE | pag | 페이지 상세/수정/삭제 |
| `/api/admin/pages/:id/publish` | POST | pag | 페이지 발행 |
| `/api/admin/pages/:id/unpublish` | POST | pag | 페이지 발행 취소 |
| `/api/public/pages` | GET | pub | 공개 페이지 목록 |
| `/api/public/pages/:slug` | GET | pub | 공개 페이지 상세 |
| `/api/admin/users` | GET/POST | usr | 사용자 목록/생성 |
| `/api/admin/users/:id` | GET/PUT/DELETE | usr | 사용자 상세/수정/삭제 |
| `/api/admin/users/:id/toggle` | PUT | usr | 사용자 활성화/비활성화 |
| `/api/admin/logs/access` | GET | log | 접속 로그 (limit 파라미터) |
| `/api/admin/logs/api` | GET | log | API 요청 로그 (limit 파라미터) |
| `/api/admin/logs/stats` | GET | log | 시스템 통계 (사용자/리드/미디어/페이지/이메일/API 집계) |
| `/api/admin/ext/*` | 다양 | ext | KV/R2/WS/AI 예제 |

## 코드 스타일

- 3글자 모듈 약어 규칙 준수
- routes/repository/service 파일 분리
- 공유 타입은 반드시 `packages/com/src/contracts.ts`
- Hono 라우트: `new Hono<{ Bindings: AppBindings }>()`
- 프론트 API: `apiFetch<T>()` 헬퍼
- 명확한 코드 &gt; 영리한 코드
- "why" 주석만, "what" 주석 금지

## 테스트

- Vitest (`worker/test/app.test.ts`)
- `app.request(url, init, mockEnv)` 패턴
- `createTestEnv()` / `createAiVectorEnv()` mock 헬퍼
- `ADMIN_ACCESS_MODE: 'off'`로 인증 우회
- 바인딩(D1, KV, AI, Vectorize)은 mock 객체
- `agents`/`hono-agents`는 `vi.mock()`
- 새 라우트 추가 시 테스트 필수

## CI/CD

| 워크플로우 | 트리거 | 동작 |
| --- | --- | --- |
| `ci.yml` | PR, main push | install → check → test → build |
| `deploy-staging.yml` | develop push | build → D1 migrate → staging 배포 |
| `deploy-production.yml` | main push | build → D1 migrate → production 배포 |

GitHub Secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`

## 시크릿

| 키 | 용도 | 필수 |
| --- | --- | --- |
| `ADMIN_LOGIN_PASSWORD` | 어드민 로그인 비밀번호 | 필수 |
| `ADMIN_JWT_SECRET` | JWT 서명 키 | 필수 |
| `AI_PROVIDER_API_KEY` | AI Gateway API 키 | AI 사용 시 |
| `CLOUDFLARE_IMAGES_API_TOKEN` | Images API 토큰 | 이미지 사용 시 |
| `RESEND_API_KEY` | Resend 이메일 API 키 | 이메일 사용 시 |

## 디자인 테마 시스템

`_templates/themes/` 폴더에 30개 CSS 테마 프리셋이 있다. 사용자가 "테마를 X로 바꿔줘"라고 요청하면 해당 CSS 파일을 읽고 `apps/landing/src/styles.css`와 `apps/admin/src/styles.css`의 `:root` CSS 변수를 교체한다.

### 다크 테마 (11개)

| 테마 | 스타일 | 참고 |
| --- | --- | --- |
| `dark-glass` | 다크 글래스모피즘 (기본값) | Linear, Raycast |
| `stripe-gradient` | 그라디언트 바이브런트 | Stripe, Framer |
| `terminal-mono` | 터미널/모노스페이스 | GitHub CLI, Warp |
| `neon-cyber` | 네온 사이버펑크 | PlanetScale, Railway |
| `glow-aurora` | 글로우 오로라 | Supabase, Resend |
| `bento-clean` | 벤토 그리드 다크 | shadcn/ui, Cal.com |
| `synthwave` | 80년대 신스웨이브 | 레트로 게이밍 |
| `mesh-gradient` | 멀티컬러 메시 | Apple Music |
| `infrared-purple` | 퍼플+레드 에너지 | 크리에이티브 도구 |
| `jewel-tone` | 보석 톤 럭셔리 | 프리미엄 SaaS |
| `grayscale-yellow` | 모노크롬+옐로우 | IKEA, 개발자 |

### 라이트 테마 (19개)

| 테마 | 스타일 | 참고 |
| --- | --- | --- |
| `linear-minimal` | 밝은 미니멀 | Notion, Vercel |
| `soft-pastel` | 파스텔 그래디언트 | Canva, Monday.com |
| `corporate-blue` | 기업형 블루 | Salesforce, Datadog |
| `earth-organic` | 어스 톤 오가닉 | Basecamp |
| `neo-brutalism` | 네오 브루탈리즘 | Gumroad |
| `retro-digital` | 레트로 디지털 | Clerk, Deno |
| `bold-serif` | 대형 세리프 | Pitch, Webflow |
| `split-contrast` | 스플릿 고대비 | Loom, Notion |
| `organic-blob` | 유기적 Blob | Notion AI, Descript |
| `neumorphism` | 소프트 UI 3D | Apple 설정 |
| `claymorphism` | 클레이 3D | Figma, Pitch |
| `outline-skeletal` | 아웃라인만 | 와이어프레임 |
| `mint-fresh` | 민트 신선함 | 웰니스 앱 |
| `fresh-modern` | 터콰이즈+핑크 | 소셜 SaaS |
| `sorbet` | 피치/크림 | 라이프스타일 |
| `cloud-dancer` | Pantone 2026 | Apple 클린 |
| `green-eco` | 친환경 그린 | ESG 플랫폼 |
| `dopamine` | 고채도 에너지 | Miro, Figma |
| `frost-ui` | 서리/얼음 블루 | Windows Fluent |

### 테마 적용 방법

1. `_templates/themes/{테마명}.css` 파일을 읽는다
2. `apps/landing/src/styles.css`의 `:root` 변수를 교체한다
3. `apps/admin/src/styles.css`의 `:root` 변수를 교체한다
4. `body` 배경과 `body::before` 그라디언트도 교체한다
5. Google Fonts import가 필요하면 `index.html`에 추가한다

## SaaS 앱 가이드 페이지

`app.octoworkers.com`에 CMS 페이지로 발행된 가이드 목록:

| slug | 제목 |
| --- | --- |
| `ai-dev-guide` | AI 개발 가이드 (서브에이전트, Hooks, MCP, Skills) |
| `guide` | Cloudflare Workers 실전 가이드 (14단계) |
| `pricing-guide` | Cloudflare 요금제 완벽 가이드 |
| `domain-setup` | 도메인 설정 가이드 |
| `auth-setup` | 로그인 & 인증 설정 가이드 |
| `ai-setup` | AI 기능 설정 가이드 |
| `email-setup` | 이메일 설정 가이드 |
| `db-rag-guide` | D1 데이터베이스 & RAG 가이드 |
| `design-guide` | 디자인 테마 프리셋 (15개) |

## 문서 우선순위

1. `AGENTS.md`, `CLAUDE.md` — 에이전트 작업 가이드 (항상 동일 유지, 양방향 동기화)
2. 서브디렉토리 `CLAUDE.md`/`AGENTS.md` — 각 디렉토리 상세
3. `_templates/themes/README.md` — 테마 프리셋 가이드
4. `_templates/README.md` — 모듈 생성 가이드
5. `docs/01~04-*.md` — 운영 문서
6. `README.md` — 프로젝트 소개

## Daily 기록 규칙

- 모든 작업 기록은 `docs/daily/YYYY-MM-DD/` 아래에 저장한다
- 에이전트별 파일: `codex.md`, `claude.md`
- 큰 구조 변경, 파일 이동, 삭제, 테스트 결과는 반드시 기록한다
- `AGENTS.md`와 `CLAUDE.md`는 항상 함께 수정하고 동일하게 유지한다