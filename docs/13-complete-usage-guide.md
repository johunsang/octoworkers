# 옥토워커스 완전 사용 가이드

이 문서는 옥토워커스를 처음 접하는 개발자가 로컬 세팅부터 프로덕션 배포, 커스터마이징까지 모든 것을 순서대로 따라할 수 있도록 작성되었습니다.

---

## 목차

1. [옥토워커스란?](#1-옥토워커스란)
2. [사전 준비물](#2-사전-준비물)
3. [로컬 환경 세팅 (5분)](#3-로컬-환경-세팅)
4. [프로젝트 구조 이해하기](#4-프로젝트-구조-이해하기)
5. [개발 서버 실행](#5-개발-서버-실행)
6. [랜딩 페이지 커스터마이징](#6-랜딩-페이지-커스터마이징)
7. [어드민 콘솔 사용법](#7-어드민-콘솔-사용법)
8. [인증 시스템](#8-인증-시스템)
9. [API 레퍼런스](#9-api-레퍼런스)
10. [데이터베이스 (D1)](#10-데이터베이스-d1)
11. [비즈니스 모듈 상세](#11-비즈니스-모듈-상세)
12. [새 모듈 추가하기](#12-새-모듈-추가하기)
13. [AI 연동](#13-ai-연동)
14. [이메일 시스템](#14-이메일-시스템)
15. [CMS 페이지 관리](#15-cms-페이지-관리)
16. [미디어 관리 (Cloudflare Images)](#16-미디어-관리)
17. [실시간 통신 (WebSocket)](#17-실시간-통신)
18. [시맨틱 검색 (Vectorize)](#18-시맨틱-검색)
19. [에이전트 (Durable Objects)](#19-에이전트)
20. [테스트 작성법](#20-테스트-작성법)
21. [Cloudflare 리소스 설정](#21-cloudflare-리소스-설정)
22. [배포하기](#22-배포하기)
23. [보안 설정](#23-보안-설정)
24. [프로젝트 이름 변경 (커스터마이징)](#24-프로젝트-이름-변경)
25. [불필요한 모듈 제거](#25-불필요한-모듈-제거)
26. [트러블슈팅](#26-트러블슈팅)

---

## 1. 옥토워커스란?

옥토워커스는 **Cloudflare Workers 기반 풀스택 SaaS 보일러플레이트**입니다. 하나의 에지 런타임에서 프론트엔드, API, 데이터베이스, AI, 미디어, 이메일, CMS를 모두 운영할 수 있습니다.

### 핵심 가치

- **복사해서 바로 시작**: git clone → pnpm install → pnpm dev. 3분이면 풀스택 SaaS 로컬 환경 완성
- **Cloudflare 네이티브**: Workers, D1, KV, R2, Images, AI Gateway, Durable Objects, Vectorize 전부 지원
- **프로덕션 레디**: 인증, CORS, CSP, 보안 헤더, CI/CD, staging/production 분리 배포가 이미 구성됨
- **모듈 구조**: 3글자 약어 기반 모듈 시스템으로 비즈니스 로직을 깔끔하게 분리하고 쉽게 추가/제거

### 기술 스택

| 영역 | 기술 |
|------|------|
| 언어 | TypeScript (strict) |
| API | Hono 4 on Cloudflare Workers |
| 프론트엔드 | React 19 + Vite (SWC), 2개 앱 (랜딩 + 어드민) |
| 데이터베이스 | Cloudflare D1 (SQLite) |
| 캐시/저장소 | KV (키-값), R2 (오브젝트, 선택) |
| 미디어 | Cloudflare Images (직접 업로드, 선택) |
| AI | Workers AI + AI Gateway + Vectorize (선택) |
| 실시간 | Durable Objects + WebSocket (선택) |
| 이메일 | Resend API (선택) |
| 테스트 | Vitest |
| 패키지 관리 | pnpm 9.15 (workspace monorepo) |
| CI/CD | GitHub Actions → Cloudflare Workers |

### 포함된 기능

| 기능 | 설명 |
|------|------|
| 랜딩 페이지 | 히어로, 기능 소개, 리드 캡처 폼 |
| 어드민 콘솔 | 대시보드, 리드 CRM, 미디어, 설정, AI 카피, 이메일, CMS |
| 리드 CRM | 등록, 상태 관리, 태그, 노트, 검색 |
| 미디어 관리 | Cloudflare Images 직접 업로드, 메타데이터 편집 |
| AI 카피 생성 | AI Gateway를 통한 마케팅 카피 제안 |
| 이메일 발송 | 템플릿 관리, 리드별 발송, 이력 추적 |
| CMS | 마크다운 기반 페이지 CRUD, 발행/미발행 |
| 시맨틱 검색 | Vectorize 임베딩 기반 유사도 검색 |
| 에이전트 | Durable Objects 기반 운영 봇 |
| 전문 검색 | SQL LIKE 기반 통합 검색 |

---

## 2. 사전 준비물

### 필수

| 도구 | 버전 | 확인 명령 |
|------|------|-----------|
| Node.js | 20 이상 | `node -v` |
| pnpm | 9.15 이상 | `pnpm -v` |
| Git | 최신 | `git --version` |

### 선택 (배포 시 필요)

| 도구 | 용도 |
|------|------|
| Cloudflare 계정 | Workers, D1, KV, AI 등 |
| Cloudflare에 연결된 도메인 | 커스텀 도메인 배포 |
| GitHub 저장소 | CI/CD 자동 배포 |
| Cloudflare API Token | wrangler CLI 인증 |

### Cloudflare API Token 설정 (중요)

배포와 리소스 관리를 위해 **Cloudflare API Token**이 필요합니다. 두 가지 인증 방법이 있습니다.

#### 방법 A: `wrangler login` (가장 간편, 로컬 개발 권장)

```bash
cd worker
npx wrangler login
```

브라우저가 열리면 "Allow"를 클릭합니다. 전체 계정 권한이 자동으로 부여되어 별도 토큰 관리가 필요 없습니다.

> **장점**: 권한 설정 실수 없음, 모든 리소스 접근 가능
> **단점**: 로컬 머신에서만 유효, CI/CD에서는 사용 불가

#### 방법 B: API Token 생성 (CI/CD, 자동화 권장)

1. **https://dash.cloudflare.com/profile/api-tokens** 접속
2. **"Create Token"** 클릭
3. **"Custom token"** 선택 (맨 아래 "Get started")
4. 다음과 같이 권한을 설정합니다:

##### 필수 권한

| Resource | Permission | 용도 |
|----------|-----------|------|
| Account → **Workers Scripts** | **Edit** | Worker 배포 (`wrangler deploy`) |
| Account → **D1** | **Edit** | 데이터베이스 생성, 마이그레이션, 쿼리 |
| Account → **Workers KV Storage** | **Edit** | KV 네임스페이스 생성 및 접근 |

##### 선택 권한 (사용하는 기능에 따라)

| Resource | Permission | 용도 |
|----------|-----------|------|
| Account → **Workers AI** | **Read** | Workers AI 모델 호출 |
| Account → **AI Gateway** | **Read** | AI Gateway를 통한 LLM 호출 |
| Account → **Vectorize** | **Edit** | 벡터 인덱스 생성, 임베딩 저장/검색 |
| Account → **Cloudflare Images** | **Edit** | 이미지 업로드, 변환, 삭제 |
| Account → **R2** | **Edit** | R2 버킷 생성, 오브젝트 저장 |
| Zone → **DNS** | **Edit** | 커스텀 도메인 라우팅 |

##### 토큰 생성 화면 단계별 안내

```text
Token name:     octoworkers-deploy (원하는 이름)

Permissions:
  ┌─────────────────────────────────────────────────────┐
  │ [Account] [Workers Scripts]        [Edit]           │
  │ + Add more                                          │
  │ [Account] [D1]                     [Edit]           │
  │ + Add more                                          │
  │ [Account] [Workers KV Storage]     [Edit]           │
  │ + Add more                                          │
  │ [Account] [Workers AI]             [Read]           │
  │ + Add more                                          │
  │ [Account] [Vectorize]              [Edit]           │
  │ + Add more                                          │
  │ [Account] [Cloudflare Images]      [Edit]           │
  │ + Add more                                          │
  │ [Zone]    [DNS]                    [Edit]           │
  └─────────────────────────────────────────────────────┘

Account Resources:
  Include → [All accounts] 또는 [특정 계정 선택]

Zone Resources:
  Include → [All zones] 또는 [특정 도메인 선택]

Client IP Address Filtering:  (선택, 보안 강화)
  Is in → [사무실 IP / CI 서버 IP]

TTL:  (선택)
  Start Date / End Date 설정 가능
```

5. **"Continue to summary"** → **"Create Token"** 클릭
6. 생성된 토큰을 **즉시 복사** (다시 볼 수 없음)

##### 토큰 사용법

**로컬에서 일회성 사용:**
```bash
CLOUDFLARE_API_TOKEN=cfut_xxxx pnpm deploy:prod
```

**환경변수로 설정 (세션 유지):**
```bash
export CLOUDFLARE_API_TOKEN=cfut_xxxx
pnpm deploy:prod
```

**GitHub Actions에서 사용:**
1. GitHub 저장소 → Settings → Secrets and variables → Actions
2. **"New repository secret"** 클릭
3. Name: `CLOUDFLARE_API_TOKEN`, Value: 토큰 값
4. `CLOUDFLARE_ACCOUNT_ID`도 동일하게 추가

##### 토큰 권한 수정하기

이미 생성된 토큰에 권한을 추가하려면:

1. https://dash.cloudflare.com/profile/api-tokens 접속
2. 해당 토큰의 **"..."** (점 세 개) → **"Edit"** 클릭
3. Permissions에서 **"+ Add more"**로 권한 추가
4. **"Continue to summary"** → **"Save"** 클릭

> **주의**: 토큰 수정 후에도 Authentication error가 계속 발생하면:
> - 기존 토큰을 **삭제**하고 새로 생성하는 것이 확실합니다
> - 토큰 편집이 즉시 반영되지 않는 경우가 있습니다
> - `wrangler login`은 항상 전체 권한이므로 로컬에서는 이 방법이 가장 안전합니다

##### 자주 발생하는 토큰 문제

| 에러 메시지 | 원인 | 해결 |
|-------------|------|------|
| `Authentication error [code: 10000]` | 해당 리소스에 권한 없음 | 토큰에 해당 권한 추가 또는 새 토큰 생성 |
| `Invalid API Token` | 토큰 문자열 오류 | 토큰 재복사 (공백, 줄바꿈 확인) |
| `Account not found` | Account ID 불일치 | `wrangler whoami`로 Account ID 확인 |
| `insufficient permissions` | Edit 대신 Read로 설정됨 | 권한을 Edit으로 변경 |

##### 토큰 테스트

```bash
# 토큰 유효성 확인
curl -H "Authorization: Bearer cfut_xxxx" \
  https://api.cloudflare.com/client/v4/user/tokens/verify

# D1 접근 확인
curl -H "Authorization: Bearer cfut_xxxx" \
  https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/d1/database

# Workers 접근 확인
curl -H "Authorization: Bearer cfut_xxxx" \
  https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/workers/scripts
```

세 요청 모두 `"success": true`가 나와야 배포가 가능합니다

---

## 3. 로컬 환경 세팅

### 방법 1: 수동 세팅 (5분)

```bash
# 1. 프로젝트 복사
git clone <repository-url> my-saas
cd my-saas

# 2. 의존성 설치
pnpm install

# 3. 로컬 시크릿 파일 생성
cp worker/.dev.vars.example worker/.dev.vars
```

`.dev.vars` 파일을 열어서 시크릿 값을 입력합니다:

```bash
# worker/.dev.vars

# Cloudflare Images API (이미지 업로드 시 필요)
CLOUDFLARE_IMAGES_API_TOKEN=your-images-api-token

# AI Gateway (AI 카피 생성 시 필요)
AI_PROVIDER_API_KEY=your-ai-api-key

# 어드민 로그인 (필수)
ADMIN_LOGIN_PASSWORD=your-admin-password
ADMIN_JWT_SECRET=your-jwt-secret-at-least-48-characters-long

# 이메일 발송 (Resend, 선택)
RESEND_API_KEY=your-resend-api-key

# GitHub OAuth (선택)
GITHUB_CLIENT_ID=your-github-oauth-app-id
GITHUB_CLIENT_SECRET=your-github-oauth-app-secret
GITHUB_ALLOWED_USERS=your-github-username
```

> **중요**: `.dev.vars`는 `.gitignore`에 포함되어 있어 커밋되지 않습니다. 절대 시크릿을 소스 코드에 하드코딩하지 마세요.

```bash
# 4. 로컬 데이터베이스 초기화
pnpm --filter @octoworkers/worker db:migrate:local

# 5. 개발 서버 실행
pnpm dev
```

### 방법 2: CLI 자동 세팅 (권장)

```bash
node cli/dist/index.js
```

대화형 CLI가 10단계로 전체 세팅을 처리합니다:

| 단계 | 내용 |
|------|------|
| 1 | 사전 요구사항 확인 (Node.js, pnpm, git) |
| 2 | Cloudflare 로그인 (`wrangler login`) |
| 3 | 프로젝트 정보 입력 (이름, 도메인, 이메일) |
| 4 | 모듈 선택 (AI, Vector, Agent, Examples) |
| 5 | 파일 복사 + 이름/도메인/ID 자동 치환 |
| 6 | `pnpm install` |
| 7 | Cloudflare 리소스 자동 생성 (D1, KV, Vectorize, R2) |
| 8 | D1 마이그레이션 (로컬 + 원격) |
| 9 | Workers 시크릿 설정 |
| 10 | 빌드 → 타입체크 → 테스트 → 배포 → 헬스체크 → Git → GitHub |

---

## 4. 프로젝트 구조 이해하기

### 전체 디렉토리 구조

```text
octoworkers/
├── CLAUDE.md / AGENTS.md         # 에이전트 작업 가이드 (항상 동기화)
├── package.json                  # 루트 scripts (dev, build, deploy 등)
├── pnpm-workspace.yaml           # 워크스페이스: apps/*, packages/*, worker
│
├── packages/com/                 # 공유 타입 패키지
│   └── src/
│       ├── index.ts              # re-export
│       └── contracts.ts          # 공유 타입 정의
│
├── apps/landing/                 # 공개 랜딩 페이지 (React + Vite)
│   └── src/
│       ├── App.tsx               # 메인 앱
│       ├── com/api/client.ts     # apiFetch 헬퍼
│       ├── com/ui/Section.tsx    # 공통 레이아웃
│       └── biz/mkt/             # 마케팅 모듈 (히어로, 기능, 리드캡처)
│
├── apps/admin/                   # 인증 기반 어드민 콘솔 (React + Vite)
│   └── src/
│       ├── App.tsx               # 메인 앱 (사이드바 + 패널 그리드)
│       ├── com/api/client.ts     # apiFetch 헬퍼
│       ├── com/ui/Panel.tsx      # 대시보드 카드
│       └── biz/                  # 비즈니스 모듈들
│
├── worker/                       # Hono API 서버 (Cloudflare Workers)
│   ├── src/
│   │   ├── index.ts              # 미들웨어 + 라우트 등록
│   │   ├── com/                  # 공통 인프라
│   │   └── biz/                  # 비즈니스 모듈
│   ├── migrations/               # D1 SQL 마이그레이션
│   ├── test/                     # Vitest 테스트
│   ├── wrangler.jsonc            # Cloudflare 설정
│   └── .dev.vars.example         # 시크릿 템플릿
│
├── _templates/                   # 새 모듈 생성 템플릿
├── docs/                         # 운영 문서
└── .github/workflows/            # CI/CD 파이프라인
```

### 핵심 개념: 모노레포 구조

옥토워커스는 **pnpm workspace 모노레포**입니다. 하나의 저장소에 4개 패키지가 있습니다:

| 패키지 | 경로 | 역할 |
|--------|------|------|
| `@octoworkers/worker` | `worker/` | API 서버 + 정적자산 서빙 |
| `@octoworkers/landing` | `apps/landing/` | 공개 마케팅 페이지 |
| `@octoworkers/admin` | `apps/admin/` | 인증 어드민 콘솔 |
| `@octoworkers/com` | `packages/com/` | 공유 타입 (contracts.ts) |

프론트엔드 앱들은 빌드 시 `worker/public/`으로 출력되고, Worker가 정적자산으로 서빙합니다.

### 핵심 개념: 3글자 모듈 시스템

모든 비즈니스 로직은 `biz/{3글자}/` 디렉토리에 배치됩니다:

| 코드 | 이름 | 역할 |
|------|------|------|
| `aut` | Auth | 세션/GitHub OAuth 로그인 |
| `pub` | Public | 공개 API (bootstrap, leads, pages, releases) |
| `dsh` | Dashboard | 통계 대시보드 |
| `led` | Leads | 리드 CRM (CRUD, tags, notes) |
| `med` | Media | Cloudflare Images 관리 |
| `set` | Settings | 브랜드 & 히어로 설정 |
| `aid` | AI Draft | AI 카피 생성 |
| `srh` | Search | 전문 검색 (SQL LIKE) |
| `vec` | Vectorize | 시맨틱 검색 (임베딩) |
| `agt` | Agent | Ops Agent (Durable Object) |
| `eml` | Email | 이메일 템플릿 & 발송 |
| `pag` | Pages | CMS 페이지 (마크다운) |
| `hlt` | Health | 헬스 체크 |
| `ext` | Extensions | KV/R2/WebSocket 예제 |

### Worker 모듈 파일 패턴

```text
worker/src/biz/{모듈}/
├── routes.ts        # Hono 라우터 (필수)
├── repository.ts    # D1 쿼리 (DB 접근 시)
└── service.ts       # 비즈니스 로직 (복잡한 로직 시)
```

### Admin 모듈 파일 패턴

```text
apps/admin/src/biz/{모듈}/
├── hooks/use*.ts           # React 훅 (API 호출 + 상태)
└── components/*.tsx        # UI 컴포넌트
```

---

## 5. 개발 서버 실행

### 전체 실행 (가장 많이 사용)

```bash
pnpm dev
```

세 개의 서버가 동시에 뜹니다:

| 서비스 | URL | 설명 |
|--------|-----|------|
| 랜딩 | http://localhost:5173 | Vite HMR, 코드 변경 시 즉시 반영 |
| 어드민 | http://localhost:5174 | Vite HMR |
| API (Worker) | http://localhost:8787 | Wrangler 로컬 런타임 |

프론트엔드의 `/api/*` 요청은 Vite 프록시를 통해 Worker(:8787)로 전달됩니다.

### 부분 실행

```bash
pnpm dev:worker     # Worker만 (API 개발)
pnpm dev:apps       # 프론트엔드만 (UI 개발, Worker가 이미 실행 중일 때)
```

### 원격 리소스 연결

Workers AI, Vectorize, Agents 등 Cloudflare 전용 기능을 테스트하려면:

```bash
pnpm dev:remote
```

이 모드에서는 Worker가 실제 Cloudflare 리소스(AI, Vectorize, D1 등)에 연결됩니다.

> **주의**: `pnpm dev:remote`는 실제 Cloudflare 계정 리소스를 사용합니다. 비용이 발생할 수 있습니다.

### 유용한 명령어 모음

```bash
pnpm check          # TypeScript 타입 체크 (전체 패키지)
pnpm test           # Vitest 테스트 실행
pnpm build          # landing + admin 프로덕션 빌드
pnpm deploy:staging # staging 배포 (빌드 + 마이그레이션 + 배포)
pnpm deploy:prod    # production 배포
```

---

## 6. 랜딩 페이지 커스터마이징

### 구조

```text
apps/landing/src/
├── App.tsx                          # 섹션 배치
├── styles.css                       # 다크 테마 스타일
├── biz/mkt/
│   ├── hooks/usePublicBootstrap.ts  # /api/public/bootstrap 호출
│   └── components/
│       ├── HeroPanel.tsx            # 히어로 섹션
│       ├── FeatureGrid.tsx          # 기능 소개 그리드
│       ├── DownloadPanel.tsx        # Quick Start 가이드
│       └── LeadCapturePanel.tsx     # 리드 캡처 폼
└── com/
    ├── api/client.ts                # apiFetch 헬퍼
    └── ui/Section.tsx               # 공통 섹션 레이아웃
```

### 텍스트 변경하기

랜딩 페이지의 텍스트는 두 가지 방법으로 변경할 수 있습니다:

**방법 1: 코드 직접 수정** — 컴포넌트 파일에서 텍스트를 직접 변경합니다.

```tsx
// apps/landing/src/biz/mkt/components/HeroPanel.tsx
<span>여기에 라벨 텍스트</span>
<h1>여기에 제품명</h1>
<p>여기에 설명</p>
```

**방법 2: 어드민 콘솔에서 변경** — Settings 패널에서 브랜드, 히어로 카피를 DB에 저장하면 `/api/public/bootstrap` API로 전달됩니다. `usePublicBootstrap` 훅이 이 데이터를 로드합니다.

### 스타일 변경하기

`apps/landing/src/styles.css`에서 전체 테마를 관리합니다:

```css
/* 메인 색상 변경 */
:root {
  color: #e8edf2;                    /* 텍스트 색상 */
  background: ...                    /* 배경 그라디언트 */
}

/* 악센트 색상 (CTA 버튼) */
.hero-actions a:first-child,
.lead-form button {
  background: linear-gradient(135deg, #ffb259 0%, #ff6d3f 100%);  /* 주황색 */
}

/* 라벨 배지 색상 */
.hero-copy span {
  color: #9fd8ff;                    /* 밝은 파란색 */
}
```

### 기능 항목 추가/변경

```tsx
// apps/landing/src/biz/mkt/components/FeatureGrid.tsx
const items = [
  {
    title: '기능 제목',
    description: '기능 설명 텍스트',
  },
  // ... 원하는 만큼 추가
]
```

### 리드 캡처 폼 필드 변경

`LeadCapturePanel.tsx`에서 폼 필드를 추가/제거할 수 있습니다. 단, 폼 데이터 타입은 `packages/com/src/contracts.ts`의 `LeadSubmissionInput`과 일치해야 합니다.

새 필드를 추가하려면:
1. `contracts.ts`에 타입 추가
2. Worker의 `pub/routes.ts`에 Zod 스키마 추가
3. `led/repository.ts`에 INSERT 쿼리 수정
4. D1 마이그레이션으로 컬럼 추가
5. 프론트엔드 폼에 입력 필드 추가

---

## 7. 어드민 콘솔 사용법

### 접속

개발 환경: http://localhost:5174

`ADMIN_ACCESS_MODE`가 `off`이면 인증 없이 접근 가능합니다(로컬 개발용). 그 외에는 로그인이 필요합니다.

### 로그인 방법

**이메일/비밀번호 로그인:**
- `.dev.vars`에 설정한 `ADMIN_LOGIN_EMAIL`과 `ADMIN_LOGIN_PASSWORD` 사용

**GitHub OAuth 로그인:**
- "Sign in with GitHub" 버튼 클릭
- GitHub에서 인증 후 자동 리다이렉트
- `GITHUB_ALLOWED_USERS`에 등록된 사용자만 접근 가능

### 패널 구성

어드민은 사이드바 + 패널 그리드 구조입니다:

#### 1. Dashboard (Overview)
- 총 리드 수, 총 미디어 수, AI Gateway 상태
- 전체 서비스 상태를 한눈에 파악

#### 2. Search (Operations)
- 리드 이름/이메일/회사, 미디어 제목/alt를 통합 검색
- SQL LIKE 기반 전문 검색

#### 3. Landing Content (Settings)
- 브랜드명, 히어로 라벨, 제목, 부제목, CTA 버튼 텍스트 편집
- "Save to D1" 버튼으로 즉시 반영
- "Generate with AI Gateway" 버튼으로 AI 카피 제안 받기

#### 4. Inbound Leads (Pipeline)
- 리드 목록 (이름, 이메일, 회사, 상태)
- 클릭하면 상세 패널 열림:
  - 상태 변경 (new → contacted → qualified → converted/lost)
  - 태그 추가/제거
  - 노트 추가 (타임스탬프 + 작성자 기록)

#### 5. Cloudflare Images (Media)
- "Create direct upload URL" → 브라우저에서 직접 업로드
- 업로드 후 "Refresh" → 상태 갱신 (delivery URL 생성)
- 제목/Alt 편집, 삭제

#### 6. Email (Templates & Send)
- 이메일 템플릿 CRUD (이름, 제목, HTML/텍스트 본문)
- 리드 선택 → 템플릿 선택 → 발송
- 발송 이력 추적

#### 7. Pages (CMS)
- 마크다운 기반 페이지 CRUD
- slug (URL 경로), 제목, 마크다운 콘텐츠 편집
- 발행/미발행 상태 관리
- HTML 미리보기

#### 8. System Overview (Monitoring)
- 전체 시스템 통계: 사용자 수, 리드 수, 미디어, 페이지, 이메일, API 요청 수
- 활성 사용자 수 표시

#### 9. User Management (Users)
- 관리자 사용자 CRUD (이메일, 이름, 역할)
- 역할: `super_admin`, `admin`, `editor`, `viewer`
- 활성화/비활성화 토글
- 마지막 로그인 시간 표시
- GitHub 연동 시 아바타 및 GitHub 계정 표시

#### 10. Access Logs (Security)
- 사용자별 접속 이력
- 접속 시간, IP, 경로, 메서드, 상태 코드

#### 11. API Request Logs (Monitoring)
- 모든 API 요청 자동 로깅 (미들웨어)
- 메서드, 경로, 상태 코드 (색상 구분), 응답 시간(ms)
- IP 주소, 타임스탬프

#### 12. Cloudflare Examples
- KV: 키-값 저장소 CRUD 데모
- R2: 오브젝트 저장소 데모
- WebSocket: 실시간 에코 데모
- Workers AI: 텍스트 생성 데모
- Vectorize: 시맨틱 검색 데모
- Agents: Durable Objects 태스크/노트 데모

---

## 8. 인증 시스템

### 인증 모드

`wrangler.jsonc`의 `ADMIN_ACCESS_MODE` 변수로 설정:

| 모드 | 설명 | 권장 환경 |
|------|------|-----------|
| `off` | 인증 우회 (localhost 자동 허용) | 로컬 개발 |
| `session` | JWT 쿠키 세션만 사용 | 테스트 |
| `cloudflare-access` | Cloudflare Access 헤더만 사용 | 프로덕션 |
| `hybrid` | Access 또는 세션 둘 다 허용 | staging, 프로덕션 |

### 인증 흐름 상세

```text
요청 → enforceAdminAccess 미들웨어
  ├── /api/admin/* 또는 /agents/* 아닌 경우 → 통과
  ├── localhost이거나 mode=off → 통과
  ├── Cloudflare Access 확인 (mode: cloudflare-access | hybrid)
  │   └── cf-access-authenticated-user-email 헤더 → ADMIN_ALLOWED_EMAILS 확인
  ├── JWT 세션 확인 (mode: session | hybrid)
  │   └── __Host-octoworkers_admin 쿠키 → JWT 검증 → 이메일 확인
  └── 모두 실패 → 401 Unauthorized
```

### 세션 로그인 (이메일 + 비밀번호)

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "founder@example.com",
  "password": "your-secret-password"
}
```

성공 시:
- `__Host-octoworkers_admin` 쿠키 발급 (JWT, 12시간 만료)
- `httpOnly`, `secure` (HTTPS), `sameSite=Strict`
- 응답: `{ "ok": true, "email": "founder@example.com" }`

### GitHub OAuth 로그인

1. 사용자가 `/api/auth/github` 방문
2. GitHub 로그인 페이지로 리다이렉트 (scope: `read:user user:email`)
3. 사용자가 승인하면 `/api/auth/github/callback?code=...`로 리다이렉트
4. Worker가 code를 access token으로 교환
5. GitHub API로 사용자 정보 조회 (`/user`, `/user/emails`)
6. `GITHUB_ALLOWED_USERS`에 포함되면 JWT 세션 발급
7. 홈(`/`)으로 리다이렉트

**필수 환경변수:**
```
GITHUB_CLIENT_ID=<GitHub OAuth App Client ID>
GITHUB_CLIENT_SECRET=<GitHub OAuth App Client Secret>
GITHUB_ALLOWED_USERS=johunsang,coauthor    # 쉼표 구분
```

**GitHub OAuth App 생성:**
1. GitHub → Settings → Developer settings → OAuth Apps → New OAuth App
2. Application name: 앱 이름
3. Homepage URL: `https://your-domain.com`
4. Authorization callback URL: `https://your-domain.com/api/auth/github/callback`

### 세션 확인 / 로그아웃

```http
GET /api/auth/me
→ 인증: { "email": "founder@example.com" }
→ 미인증: { "email": null }

POST /api/auth/logout
→ 쿠키 삭제, { "ok": true }
```

---

## 9. API 레퍼런스

### 공통 규칙

- Base URL: `http://localhost:8787` (dev), `https://your-app.workers.dev` (배포)
- Content-Type: `application/json`
- 에러 응답: `{ "message": "에러 메시지" }` + HTTP 상태 코드
- 인증: `/api/admin/*`는 JWT 쿠키 또는 Cloudflare Access 필요

### 공개 API (인증 불필요)

#### GET /api/health
```json
// 응답
{ "ok": true, "runtime": "cloudflare-workers" }
```

#### GET /api/public/bootstrap
랜딩 페이지 초기화 데이터.
```json
// 응답
{
  "settings": {
    "id": 1,
    "brand": "옥토워커스",
    "heroLabel": "Cloudflare-native SaaS boilerplate",
    "heroTitle": "...",
    "heroSubtitle": "...",
    "ctaPrimary": "...",
    "ctaSecondary": "...",
    "updatedAt": "2026-04-12T..."
  },
  "metrics": {
    "totalLeads": 42,
    "totalMedia": 10,
    "updatedAt": "2026-04-12T..."
  }
}
```

#### POST /api/public/leads
리드 등록 (Zod 검증: name min 2자, email 형식).
```json
// 요청
{ "name": "홍길동", "email": "hong@example.com", "company": "회사명", "message": "메시지" }
// 응답 (201)
{ "ok": true }
```

#### GET /api/public/pages
발행된 CMS 페이지 목록.

#### GET /api/public/pages/:slug
특정 발행 페이지 조회. 미발행이면 404.

#### GET /api/public/releases
GitHub 릴리스 목록 (최신 5개).

### 인증 API

#### GET /api/auth/me
현재 세션 확인. → `{ "email": "..." }` 또는 `{ "email": null }`

#### POST /api/auth/login
```json
// 요청
{ "email": "founder@example.com", "password": "your-password" }
// 성공 (200)
{ "ok": true, "email": "founder@example.com" }
// 실패 (401)
{ "message": "Invalid credentials." }
```

#### POST /api/auth/logout
세션 종료. → `{ "ok": true }`

#### GET /api/auth/github
GitHub OAuth 리다이렉트.

#### GET /api/auth/github/callback
GitHub OAuth 콜백.

### 관리 API (인증 필요)

#### GET /api/admin/dashboard
```json
{
  "stats": { "totalLeads": 10, "totalMedia": 5, "latestLeadAt": "...", "latestSettingUpdateAt": "..." },
  "recentLeads": [...],
  "media": [...],
  "aiConfigured": true
}
```

#### GET/PUT /api/admin/settings
사이트 설정 조회/수정.
```json
// PUT 요청
{ "brand": "새 브랜드", "heroLabel": "...", "heroTitle": "...", "heroSubtitle": "...", "ctaPrimary": "...", "ctaSecondary": "..." }
```

#### 리드 관리

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/admin/leads` | 리드 목록 (최신 20건) |
| GET | `/api/admin/leads/:id` | 리드 상세 (태그, 노트 포함) |
| PUT | `/api/admin/leads/:id/status` | 상태 변경. `{ "status": "contacted" }` |
| POST | `/api/admin/leads/:id/tags` | 태그 추가. `{ "tag": "vip" }` |
| DELETE | `/api/admin/leads/:id/tags/:tag` | 태그 삭제 |
| GET | `/api/admin/leads/:id/notes` | 노트 목록 |
| POST | `/api/admin/leads/:id/notes` | 노트 추가. `{ "content": "...", "createdBy": "admin" }` |

#### 미디어 관리

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/admin/images` | 미디어 목록 |
| POST | `/api/admin/images/direct-upload` | 업로드 URL 생성. `{ "title": "...", "alt": "..." }` |
| POST | `/api/admin/images/:id/refresh` | 상태 새로고침 |
| PUT | `/api/admin/images/:id` | 메타데이터 수정. `{ "title": "...", "alt": "..." }` |
| DELETE | `/api/admin/images/:id` | 삭제 |

#### AI 카피
```json
// POST /api/admin/ai/copy
// 요청
{ "objective": "SaaS 런칭", "audience": "개발자", "tone": "전문적" }
// 응답
{ "heroTitle": "...", "heroSubtitle": "...", "ctaPrimary": "...", "rationale": "..." }
```

#### 검색
```
GET /api/admin/search?q=검색어
→ { "leads": [...], "media": [...] }
```

#### 이메일

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/admin/email/templates` | 템플릿 목록 |
| POST | `/api/admin/email/templates` | 템플릿 생성 |
| GET | `/api/admin/email/templates/:id` | 템플릿 상세 |
| PUT | `/api/admin/email/templates/:id` | 템플릿 수정 |
| DELETE | `/api/admin/email/templates/:id` | 템플릿 삭제 |
| POST | `/api/admin/email/send` | 이메일 발송. `{ "leadId": 1, "templateId": 1 }` |
| GET | `/api/admin/email/logs` | 발송 이력 |

#### CMS 페이지

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/admin/pages` | 페이지 목록 |
| POST | `/api/admin/pages` | 페이지 생성. `{ "slug": "about", "title": "소개", "contentMd": "# ..." }` |
| GET | `/api/admin/pages/:id` | 페이지 상세 |
| PUT | `/api/admin/pages/:id` | 페이지 수정 |
| DELETE | `/api/admin/pages/:id` | 페이지 삭제 |
| POST | `/api/admin/pages/:id/publish` | 발행 |
| POST | `/api/admin/pages/:id/unpublish` | 발행 취소 |

slug 규칙: `[a-z0-9-]` (소문자, 숫자, 하이픈만 허용)

#### Vectorize

```json
// POST /api/admin/vec/reindex — 전체 재인덱싱
→ { "indexed": 15 }

// POST /api/admin/vec/search — 시맨틱 검색
// 요청: { "query": "..." }
→ { "count": 3, "matches": [{ "id": "...", "score": 0.95, "metadata": {...} }] }
```

#### 에이전트

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/admin/agt` | 에이전트 스냅샷 |
| POST | `/api/admin/agt/tasks` | 작업 추가. `{ "description": "..." }` |
| POST | `/api/admin/agt/tasks/:id/complete` | 작업 완료 |
| POST | `/api/admin/agt/notes` | 메모 추가. `{ "content": "..." }` |
| POST | `/api/admin/agt/summarize` | AI 기반 작업 요약 |

#### 사용자 관리

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/admin/users` | 사용자 목록 |
| GET | `/api/admin/users/:id` | 사용자 상세 |
| POST | `/api/admin/users` | 사용자 생성. `{ "email": "...", "name": "...", "role": "viewer" }` |
| PUT | `/api/admin/users/:id` | 사용자 수정. `{ "name": "...", "role": "admin" }` |
| PUT | `/api/admin/users/:id/toggle` | 활성화/비활성화 토글 |
| DELETE | `/api/admin/users/:id` | 사용자 삭제 |

역할: `super_admin`, `admin`, `editor`, `viewer`

#### 시스템 로그

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/admin/logs/access?limit=50` | 접속 로그 |
| GET | `/api/admin/logs/api?limit=50` | API 요청 로그 |
| GET | `/api/admin/logs/stats` | 시스템 통계 (사용자/리드/미디어/페이지/이메일/API 집계) |

API 요청 로그는 미들웨어에서 자동 수집됩니다 (메서드, 경로, 상태코드, 응답시간, IP).

#### 예제 API (ext)

| 경로 | 메서드 | 설명 |
|------|--------|------|
| `/api/admin/ext/kv` | GET | KV 키 목록 |
| `/api/admin/ext/kv/:key` | GET/PUT/DELETE | KV CRUD |
| `/api/admin/ext/r2/:key` | GET/PUT/DELETE | R2 CRUD |
| `/api/admin/ext/ai/workers` | GET | Workers AI 상태 |
| `/api/admin/ext/ai/text` | POST | Workers AI 텍스트 생성 |
| `/api/admin/ext/rtm/ws` | GET | WebSocket echo |
| `/api/admin/ext/vec/example` | GET | Vectorize 예제 |

---

## 10. 데이터베이스 (D1)

### DB 스키마

```sql
-- 사이트 설정 (싱글톤, id=1)
site_settings (
  id, brand, hero_label, hero_title, hero_subtitle,
  cta_primary, cta_secondary, updated_at
)

-- 리드
leads (
  id, name, email, company, message, status,
  assigned_to, source, created_at
)

-- 리드 태그
lead_tags (id, lead_id, tag, created_at)
  → UNIQUE(lead_id, tag)

-- 리드 노트
lead_notes (id, lead_id, content, created_by, created_at)

-- 미디어
media_assets (
  id, image_id, title, alt, status,
  delivery_url, preview_url, uploaded_at
)

-- 이메일 템플릿
email_templates (id, name, subject, body_html, body_text, created_at, updated_at)

-- 이메일 발송 이력
email_logs (id, lead_id, template_id, subject, status, sent_at)

-- CMS 페이지
pages (
  id, slug, title, content_md, content_html, status,
  published_at, created_at, updated_at
)

-- 관리자 사용자
admin_users (
  id, email, name, role, avatar_url, github_login,
  last_login_at, is_active, created_at, updated_at
)

-- 접속 로그
access_logs (
  id, user_email, action, path, method, status_code,
  ip_address, user_agent, created_at
)

-- API 요청 로그 (미들웨어 자동 수집)
api_logs (
  id, method, path, status_code, duration_ms,
  request_body, response_size, ip_address, created_at
)
```

### 마이그레이션 관리

마이그레이션 파일은 `worker/migrations/` 디렉토리에 순번으로 관리됩니다:

```
0001_initial.sql           # site_settings, leads, media_assets
0002_enhance_leads.sql     # lead_tags, lead_notes, 확장 필드
0003_email_system.sql      # email_templates, email_logs
0004_pages.sql             # pages
0005_seed_sample_pages.sql # 샘플 페이지 데이터
0006_admin_system.sql      # admin_users, access_logs, api_logs + 시드 관리자
```

#### 새 마이그레이션 추가

```bash
# 1. SQL 파일 생성
cat > worker/migrations/0006_add_categories.sql << 'EOF'
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL
);
EOF

# 2. 로컬 적용
pnpm --filter @octoworkers/worker db:migrate:local

# 3. 원격 적용 (staging)
pnpm --filter @octoworkers/worker db:migrate:remote:staging

# 4. 원격 적용 (production) — 주의!
pnpm --filter @octoworkers/worker db:migrate:remote
```

> **중요**: 원격 마이그레이션은 되돌릴 수 없습니다. 항상 additive 방식으로 작성하세요:
> - `CREATE TABLE IF NOT EXISTS` — OK
> - `ALTER TABLE ... ADD COLUMN` — OK
> - `DROP TABLE`, `DROP COLUMN` — 절대 금지

### Repository 작성 패턴

```typescript
// worker/src/biz/{모듈}/repository.ts
import type { D1Database } from '@cloudflare/workers-types'
import { isoNow, allRows } from '../../com/db'

export async function listItems(db: D1Database) {
  const stmt = db.prepare('SELECT * FROM items ORDER BY created_at DESC')
  return allRows<ItemRow>(stmt)
}

export async function getItemById(db: D1Database, id: number) {
  return db
    .prepare('SELECT * FROM items WHERE id = ?')
    .bind(id)
    .first<ItemRow>()
}

export async function createItem(db: D1Database, input: CreateItemInput) {
  const now = isoNow()
  await db
    .prepare('INSERT INTO items (name, created_at) VALUES (?, ?)')
    .bind(input.name, now)
    .run()
}
```

> **핵심**: 항상 prepared statement (`?` 바인딩)을 사용하세요. SQL 인젝션을 방지합니다.

---

## 11. 비즈니스 모듈 상세

### aut/ (인증)

**파일:**
- `routes.ts`: GET /me, POST /login, POST /logout, GET /github, GET /github/callback
- `service.ts`: JWT 발급/검증, 쿠키 관리, GitHub OAuth

**JWT 구조:**
```json
{
  "sub": "founder@example.com",
  "iat": 1712901600,
  "exp": 1712944800
}
```

쿠키명: `__Host-octoworkers_admin` (12시간 만료)

### pub/ (공개 API)

**파일:**
- `routes.ts`: /bootstrap, /leads, /pages, /pages/:slug, /releases

**특징:**
- `led/repository`와 `set/repository`를 **읽기 전용**으로 호출
- 인증 미들웨어 적용 안 됨

### led/ (리드 CRM)

**파일:**
- `routes.ts`: 리드 CRUD + 태그 + 노트
- `repository.ts`: D1 쿼리 (leads, lead_tags, lead_notes 테이블)

**상태 흐름:**
```
new → contacted → qualified → converted
                            → lost
```

### set/ (설정)

**파일:**
- `routes.ts`: GET /, PUT /
- `repository.ts`: getSiteSettings, updateSiteSettings

**특징:** 싱글톤 (id=1). 없으면 기본값으로 자동 생성.

### med/ (미디어)

**파일:**
- `routes.ts`: 미디어 CRUD + direct upload
- `repository.ts`: D1 쿼리
- `images.ts`: Cloudflare Images API 클라이언트

**업로드 흐름:**
```
1. POST /direct-upload → Cloudflare에서 upload URL 발급
2. 브라우저가 해당 URL로 직접 파일 업로드 (CORS)
3. POST /:id/refresh → Cloudflare에서 variant URL 조회 → DB 갱신
```

### aid/ (AI 카피)

**파일:**
- `routes.ts`: POST /copy

**흐름:**
```
요청 → settings 조회 → AI Gateway 호출 → JSON 파싱 → 응답
```

**AI Gateway URL:**
```
https://gateway.ai.cloudflare.com/v1/{account}/{gateway}/compat/chat/completions
```

---

## 12. 새 모듈 추가하기

### 7단계 가이드

예시: `ntf` (Notifications) 모듈 추가

#### 1단계: 템플릿 복사

```bash
mkdir -p worker/src/biz/ntf
cp _templates/biz-module/worker/routes.ts     worker/src/biz/ntf/routes.ts
cp _templates/biz-module/worker/repository.ts worker/src/biz/ntf/repository.ts
```

#### 2단계: 플레이스홀더 치환

파일 내 문자열을 일괄 치환합니다:
- `__ITEM__` → `Notification` (PascalCase, 타입명)
- `__item__` → `notification` (camelCase, 변수명)
- `__items__` → `notifications` (복수형, 테이블명/API 경로)

#### 3단계: 공유 타입 추가

```typescript
// packages/com/src/contracts.ts
export type NotificationRecord = {
  id: number
  title: string
  status: string
  createdAt: string
  updatedAt: string
}

export type CreateNotificationInput = {
  title: string
}
```

`packages/com/src/index.ts`에서 export도 추가:

```typescript
export type { NotificationRecord, CreateNotificationInput } from './contracts'
```

#### 4단계: 라우트 등록

```typescript
// worker/src/index.ts
import { notificationRoutes } from './biz/ntf/routes'

// 기존 라우트들 뒤에 추가
app.route('/api/admin/notifications', notificationRoutes)
```

#### 5단계: D1 마이그레이션

```sql
-- worker/migrations/0006_add_notifications.sql
CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);
```

```bash
pnpm --filter @octoworkers/worker db:migrate:local
```

#### 6단계: 테스트 추가

```typescript
// worker/test/app.test.ts 에 추가
describe('notifications', () => {
  it('should list notifications', async () => {
    const app = createApp()
    const res = await app.request(
      'http://localhost/api/admin/notifications',
      undefined,
      createTestEnv()
    )
    expect(res.status).toBe(200)
    const items = await res.json()
    expect(Array.isArray(items)).toBe(true)
  })
})
```

#### 7단계: Admin UI 추가 (선택)

```bash
mkdir -p apps/admin/src/biz/ntf/hooks
cp _templates/biz-module/admin/hooks/useItems.ts apps/admin/src/biz/ntf/hooks/useNotifications.ts
# 파일 내 플레이스홀더 치환
```

`apps/admin/src/App.tsx`에 패널 추가:

```tsx
import { useNotifications } from './biz/ntf/hooks/useNotifications'

// AuthenticatedAdmin 내부:
<Panel title="Notifications" eyebrow="Alerts">
  {/* UI */}
</Panel>
```

---

## 13. AI 연동

### AI Gateway (외부 LLM)

AI Gateway를 통해 외부 LLM(Workers AI 포함)을 호출합니다.

**필수 환경변수:**
```
AI_GATEWAY_ACCOUNT_ID=<Cloudflare Account ID>
AI_GATEWAY_ID=default
AI_PROVIDER=workers-ai
AI_MODEL=@cf/meta/llama-3.1-8b-instruct
AI_PROVIDER_API_KEY=<API 키>
```

**사용 API:** `POST /api/admin/ai/copy`

### Workers AI (직접 호출)

AI 바인딩을 통해 Workers AI를 직접 호출합니다.

**필수 환경변수:**
```
AI_TEXT_MODEL=@cf/meta/llama-3.1-8b-instruct-fast
AI_EMBED_MODEL=@cf/baai/bge-small-en-v1.5
```

**코드에서 사용:**
```typescript
import { generateTextWithWorkersAi, createEmbedding } from '../../com/workers-ai'

// 텍스트 생성
const text = await generateTextWithWorkersAi(env, [
  { role: 'system', content: 'You are helpful.' },
  { role: 'user', content: '요약해줘...' }
])

// 임베딩 생성 (384차원 벡터)
const vector = await createEmbedding(env, '검색할 텍스트')
```

> **중요**: AI 기능은 로컬에서 동작하지 않습니다. `pnpm dev:remote`로 실행하세요.

---

## 14. 이메일 시스템

### Resend API 연동

**필수 환경변수:**
```
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

### 이메일 템플릿

```json
// POST /api/admin/email/templates
{
  "name": "welcome",
  "subject": "옥토워커스에 오신 것을 환영합니다",
  "bodyHtml": "<h1>환영합니다!</h1><p>{{name}}님, 가입해 주셔서 감사합니다.</p>",
  "bodyText": "환영합니다! {{name}}님, 가입해 주셔서 감사합니다."
}
```

### 이메일 발송

```json
// POST /api/admin/email/send
{
  "leadId": 1,           // 받는 사람 (leads 테이블)
  "templateId": 1,       // 템플릿 사용 (선택)
  "subject": "커스텀 제목",  // 직접 지정 (선택)
  "bodyHtml": "<p>...</p>"  // 직접 지정 (선택)
}
```

발송 결과는 `email_logs` 테이블에 자동 기록됩니다.

---

## 15. CMS 페이지 관리

### 페이지 생성

```json
// POST /api/admin/pages
{
  "slug": "about",           // URL 경로 (소문자, 숫자, 하이픈만)
  "title": "회사 소개",
  "contentMd": "# 소개\n\n이것은 **마크다운** 페이지입니다."
}
```

Worker가 마크다운을 HTML로 자동 변환합니다 (XSS 방지 포함).

### 지원 마크다운 문법

| 문법 | 결과 |
|------|------|
| `# 제목` ~ `###### 제목` | h1 ~ h6 |
| `**굵게**` | 굵은 글씨 |
| `*기울임*` | 기울임 글씨 |
| `` `인라인 코드` `` | 인라인 코드 |
| ` ```코드 블록``` ` | 코드 블록 |
| `[텍스트](url)` | 링크 (http/https/mailto만 허용) |
| `- 항목` | 리스트 |
| `---` | 수평선 |

### 페이지 발행

```http
POST /api/admin/pages/:id/publish    # 발행 (공개)
POST /api/admin/pages/:id/unpublish  # 미발행 (비공개)
```

발행된 페이지만 공개 API (`/api/public/pages`)에 노출됩니다.

### 기본 샘플 페이지

옥토워커스에는 5개 샘플 페이지가 포함되어 있습니다:

| slug | 제목 |
|------|------|
| `about` | 옥토워커스 소개 |
| `features` | 주요 기능 |
| `pricing` | 요금 안내 |
| `contact` | 문의하기 |
| `getting-started` | 시작 가이드 |

---

## 16. 미디어 관리

### Cloudflare Images 설정

**필수:**
```
CLOUDFLARE_ACCOUNT_ID=<Account ID>
CLOUDFLARE_IMAGES_DELIVERY_HASH=<delivery hash>
CLOUDFLARE_IMAGES_API_TOKEN=<API token>    # secret
```

**권장 variant:**
- `public` — 원본 크기
- `thumb` — 썸네일

### 업로드 흐름

```text
1. Admin → POST /api/admin/images/direct-upload
     { "title": "로고", "alt": "회사 로고" }
   → Worker → Cloudflare Images API → upload URL 발급
   → Admin에 { "imageId": "...", "uploadURL": "..." } 반환

2. Admin → uploadURL로 파일 직접 전송 (브라우저 → Cloudflare)

3. Admin → POST /api/admin/images/:id/refresh
   → Worker → Cloudflare Images API → variant URL 조회
   → DB 갱신 (delivery_url, status)
```

### delivery URL 형식

```
https://imagedelivery.net/{DELIVERY_HASH}/{IMAGE_ID}/{VARIANT}
```

---

## 17. 실시간 통신

### WebSocket 예제

```
GET /api/admin/ext/rtm/ws → WebSocket 업그레이드
```

현재 echo 방식 (보낸 메시지를 그대로 반환).

**확장 아이디어:**
- Room 기반 브로드캐스트
- Presence (접속 상태)
- Durable Objects 연결
- 어드민 실시간 알림

### 주의사항

WebSocket 라우트는 보안 헤더 처리에서 **예외 처리**됩니다 (업그레이드 충돌 방지).

---

## 18. 시맨틱 검색

### Vectorize 설정

**필수:**
```
AI_EMBED_MODEL=@cf/baai/bge-small-en-v1.5    # 384차원
DOC_INDEX=<Vectorize 인덱스 바인딩>
```

### 인덱싱

```http
POST /api/admin/vec/reindex
```

현재 인덱싱 대상:
- site_settings (브랜드, 히어로 카피)
- leads (이름, 이메일, 메시지)
- media_assets (제목, alt)

### 검색

```json
// POST /api/admin/vec/search
{ "query": "AI 마케팅" }
// → topK=10 벡터 유사도 검색
```

> **중요**: Vectorize는 로컬에서 동작하지 않습니다. `pnpm dev:remote` 필수.

---

## 19. 에이전트

### Durable Objects 기반

OpsAgent는 Durable Objects 위에서 동작하는 영속적 에이전트입니다.

**기능:**
- 운영 할 일 목록 (CRUD + 완료 처리)
- 메모 저장
- Workers AI 기반 태스크 요약

**직접 경로:** `/agents/OpsAgent/admin-ops`

### wrangler.jsonc 설정

```jsonc
"durable_objects": {
  "bindings": [{
    "name": "OpsAgent",
    "class_name": "OpsAgent"
  }]
},
"migrations": [{
  "tag": "v1",
  "new_sqlite_classes": ["OpsAgent"]
}]
```

---

## 20. 테스트 작성법

### 실행

```bash
pnpm test                          # 전체
pnpm --filter @octoworkers/worker test  # Worker만
```

### 기본 패턴

```typescript
import { describe, expect, it, vi } from 'vitest'

// Cloudflare Agents mock (반드시 import 전에 선언)
vi.mock('agents', () => ({
  Agent: class {},
  callable: () => (target: unknown) => target,
  getAgentByName: vi.fn(),
}))
vi.mock('hono-agents', () => ({
  agentsMiddleware: () => async (_c: unknown, next: () => Promise<void>) => next(),
}))

import { createApp } from '../src/index'

describe('my feature', () => {
  it('should respond correctly', async () => {
    const app = createApp()
    const response = await app.request(
      'http://localhost/api/admin/leads',
      { method: 'GET' },
      createTestEnv()  // mock 바인딩
    )
    expect(response.status).toBe(200)
    const body = await response.json()
    expect(Array.isArray(body)).toBe(true)
  })
})
```

### Mock 환경

```typescript
function createTestEnv() {
  return {
    DB: createMockD1(),           // D1 mock
    ASSETS: { fetch },             // Assets mock
    APP_KV: createMockKV(),        // KV mock
    APP_DOMAIN: 'example.com',
    ADMIN_DOMAIN: 'admin.example.com',
    ADMIN_ACCESS_MODE: 'off',      // 인증 우회
  }
}
```

### 테스트 작성 규칙

- **행동(behavior) 테스트** 우선, 구현 세부사항 테스트 금지
- 테스트명은 서술형: `should reject invalid email format`
- 엣지 케이스 커버: 빈 입력, null, 경계값
- 새 라우트 추가 시 **반드시** 테스트 작성

---

## 21. Cloudflare 리소스 설정

### D1 데이터베이스 생성

```bash
cd worker

# Production
pnpm wrangler d1 create octoworkers
# → database_id를 wrangler.jsonc에 입력

# Staging
pnpm wrangler d1 create octoworkers-staging
# → staging 환경의 database_id에 입력
```

### KV 네임스페이스

```bash
pnpm wrangler kv namespace create APP_KV
# → id를 wrangler.jsonc의 kv_namespaces[].id에 입력
```

### Vectorize 인덱스

```bash
pnpm wrangler vectorize create octoworkers-doc-index \
  --dimensions 384 \
  --metric cosine
```

### R2 버킷 (선택)

```bash
pnpm wrangler r2 bucket create octoworkers-media
# wrangler.jsonc에서 r2_buckets 블록 주석 해제
```

### Cloudflare Images

1. Cloudflare 대시보드에서 Images 활성화
2. Delivery hash 확인
3. API Token 생성

### Workers 시크릿 설정

```bash
cd worker

# Production
pnpm wrangler secret put ADMIN_LOGIN_PASSWORD
pnpm wrangler secret put ADMIN_JWT_SECRET
pnpm wrangler secret put AI_PROVIDER_API_KEY
pnpm wrangler secret put CLOUDFLARE_IMAGES_API_TOKEN
pnpm wrangler secret put RESEND_API_KEY
pnpm wrangler secret put GITHUB_CLIENT_SECRET

# Staging (동일, --env staging 추가)
pnpm wrangler secret put ADMIN_LOGIN_PASSWORD --env staging
```

---

## 22. 배포하기

### 도메인 전략

| 환경 | 랜딩 | 어드민 |
|------|------|--------|
| Production | `example.com` | `admin.example.com` |
| Staging | `staging.example.com` | `admin.staging.example.com` |
| 개발 | `localhost:5173` | `localhost:5174` |

같은 Worker가 호스트명을 보고 landing/admin 자산을 분기합니다.

### 수동 배포

```bash
# Staging
pnpm deploy:staging
# 내부적으로: build → d1 migrate --env staging → deploy --env staging

# Production
pnpm deploy:prod
# 내부적으로: build → d1 migrate → deploy
```

### GitHub Actions 자동 배포

| 워크플로우 | 트리거 | 동작 |
|-----------|--------|------|
| `ci.yml` | PR, main push | install → check → test → build |
| `deploy-staging.yml` | develop push | build → D1 migrate → staging 배포 |
| `deploy-production.yml` | main push | build → D1 migrate → production 배포 |

**필수 GitHub Secrets:**
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

### 권장 배포 흐름

```text
1. feature/xxx 브랜치에서 개발
2. PR 생성 → CI (check + test + build)
3. merge to develop → staging 자동 배포
4. staging 검증
5. merge to main → production 자동 배포
```

### 배포 확인

```bash
curl https://your-app.workers.dev/api/health
# → { "ok": true, "runtime": "cloudflare-workers" }
```

### 도메인 라우팅 활성화

`wrangler.jsonc`의 `routes` 섹션 주석 해제 후 실제 도메인 입력:

```jsonc
"routes": [
  { "pattern": "example.com", "custom_domain": true },
  { "pattern": "admin.example.com", "custom_domain": true }
]
```

### 롤백

별도 롤백 스크립트는 없습니다. 권장 방법:
1. `main`에서 직전 안정 커밋으로 revert
2. push → 자동 재배포

---

## 23. 보안 설정

### 보안 헤더 (자동 적용)

`applySecurityHeaders` 미들웨어가 모든 응답에 적용:

| 헤더 | 값 |
|------|-----|
| Content-Security-Policy | `default-src 'self'; img-src 'self' imagedelivery.net; ...` |
| Referrer-Policy | `strict-origin-when-cross-origin` |
| X-Content-Type-Options | `nosniff` |
| X-Frame-Options | `DENY` |
| Cross-Origin-Opener-Policy | `same-origin` |
| Strict-Transport-Security | `max-age=63072000` (HTTPS) |
| Permissions-Policy | `camera=(), microphone=(), ...` |

### 입력 검증

모든 API 입력은 **Zod 스키마**로 검증됩니다:

```typescript
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

const leadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().optional(),
  message: z.string().optional(),
})

app.post('/', zValidator('json', leadSchema), async (c) => {
  const data = c.req.valid('json')
  // ...
})
```

### SQL 인젝션 방지

**prepared statement 필수:**
```typescript
// 올바른 방법
db.prepare('SELECT * FROM leads WHERE email = ?').bind(email)

// 절대 금지
db.prepare(`SELECT * FROM leads WHERE email = '${email}'`)
```

### XSS 방지

CMS 마크다운 변환 시:
1. 모든 HTML을 먼저 이스케이프
2. 마크다운 문법만 HTML로 변환
3. 링크 URL은 `http://`, `https://`, `mailto:` 프로토콜만 허용
4. `javascript:` 등 위험한 프로토콜 차단

### 운영 권장사항

- `ADMIN_ACCESS_MODE=hybrid` 또는 `cloudflare-access`
- Cloudflare Access 앱 생성 (admin 도메인 보호)
- GitHub branch protection 활성화
- 비밀번호 48자 이상 설정
- API 키는 서비스별 분리

---

## 24. 프로젝트 이름 변경

옥토워커스를 복사해서 새 프로젝트를 시작할 때:

### 1. package.json 교체 (5곳)

```bash
# 루트
package.json: "octoworkers" → "my-saas"

# Worker
worker/package.json: "@octoworkers/worker" → "@my-saas/worker"

# Apps
apps/landing/package.json: "@octoworkers/landing" → "@my-saas/landing"
apps/admin/package.json: "@octoworkers/admin" → "@my-saas/admin"

# 공유 패키지
packages/com/package.json: "@octoworkers/com" → "@my-saas/com"
```

### 2. import 경로 교체

```typescript
// 모든 파일에서
import type { SiteSettings } from '@octoworkers/com'
// →
import type { SiteSettings } from '@my-saas/com'
```

### 3. wrangler.jsonc 교체

```
REPLACE_WITH_ACCOUNT_ID → 실제 Account ID
REPLACE_WITH_D1_DATABASE_ID → 실제 D1 ID
example.com / admin.example.com → 실제 도메인
```

### 4. 쿠키명 변경 (선택)

`worker/src/biz/aut/service.ts`:
```typescript
const COOKIE_NAME = '__Host-octoworkers_admin'
// → '__Host-mysaas_admin'
```

### 5. 브랜딩 변경

- `apps/landing/src/biz/ext/fallbackSiteSettings.ts`
- `apps/admin/src/App.tsx` (사이드바 제목)
- `apps/admin/src/biz/aut/components/LoginScreen.tsx`

---

## 25. 불필요한 모듈 제거

### ext/ (KV/R2/WS 예제) 제거

```bash
rm -rf worker/src/biz/ext/
rm -rf apps/admin/src/biz/ext/
```

`worker/src/index.ts`에서 `extRoutes` import/route 제거.
`apps/admin/src/App.tsx`에서 `CloudflareExamples` import/렌더링 제거.

### agt/ (에이전트) 제거

```bash
rm -rf worker/src/biz/agt/
```

`worker/src/index.ts`에서 `agentRoutes`, `OpsAgent`, `agentsMiddleware` 제거.
`worker/wrangler.jsonc`에서 `durable_objects`, `migrations` 블록 제거.
`worker/package.json`에서 `agents`, `hono-agents` 의존성 제거.

### vec/ (Vectorize) 제거

```bash
rm -rf worker/src/biz/vec/
```

`worker/src/index.ts`에서 `vectorRoutes` 제거.
`worker/wrangler.jsonc`에서 `vectorize` 블록 제거.

### aid/ (AI 카피) 제거

```bash
rm -rf worker/src/biz/aid/
```

`worker/src/index.ts`에서 `aiRoutes` 제거.

> **중요**: 모듈 제거 후 `pnpm check`로 타입 에러 확인, `pnpm test`로 테스트 통과 확인.

---

## 26. 트러블슈팅

### 로컬 개발

| 증상 | 원인 | 해결 |
|------|------|------|
| `pnpm dev` 시 포트 충돌 | 이전 프로세스가 포트를 점유 | `lsof -i :5173` → `kill` |
| API 호출 실패 | Worker가 아직 안 떴음 | Worker가 먼저 시작되도록 대기 |
| D1 쿼리 에러 | 마이그레이션 미적용 | `pnpm --filter @octoworkers/worker db:migrate:local` |
| AI/Vectorize 안 됨 | 로컬에서 미지원 | `pnpm dev:remote` 사용 |
| HMR 안 됨 | Vite 프록시 문제 | Worker 재시작 |

### 인증

| 증상 | 원인 | 해결 |
|------|------|------|
| 로그인 안 됨 | 시크릿 미설정 | `.dev.vars` 확인 |
| 쿠키 안 붙음 | HTTPS 필수 (`__Host-` prefix) | localhost는 예외 |
| GitHub OAuth 실패 | Client ID/Secret 불일치 | OAuth App 설정 확인 |
| 401 Unauthorized | `ADMIN_ALLOWED_EMAILS` 불일치 | 이메일 정확히 입력 |

### 배포

| 증상 | 원인 | 해결 |
|------|------|------|
| `wrangler deploy` 실패 | API Token 권한 부족 | Token 권한 확인 |
| D1 마이그레이션 실패 | `database_id` 불일치 | `wrangler.jsonc` 확인 |
| 배포 후 404 | 도메인 설정 미완료 | `APP_DOMAIN`, `ADMIN_DOMAIN` 확인 |
| 캐시 미반영 | Cloudflare 캐시 | 하드 리프레시 (Ctrl+Shift+R) |
| GitHub Actions 실패 | Secrets 미설정 | `CLOUDFLARE_API_TOKEN` 확인 |

### 모듈

| 증상 | 원인 | 해결 |
|------|------|------|
| 모듈 제거 후 빌드 에러 | import 잔존 | `pnpm check`로 확인 |
| 새 모듈 타입 에러 | contracts.ts 미갱신 | 타입 추가 + export 확인 |
| 테스트 실패 | D1 mock 미추가 | mock 분기 추가 |
| `vi.mock` 순서 에러 | import 전에 선언 필요 | 파일 최상단으로 이동 |

### 그 외

| 증상 | 원인 | 해결 |
|------|------|------|
| `wrangler.jsonc` 파싱 에러 | JSONC (주석 포함) | wrangler만 파싱 가능 |
| peer dependency 경고 | agents SDK 호환성 | 무시 가능 |
| R2 바인딩 에러 | 주석 상태 | `wrangler.jsonc` 주석 해제 |

---

## 부록: 환경변수 전체 목록

### 공개 변수 (wrangler.jsonc vars)

| 변수 | 설명 | 예시 |
|------|------|------|
| `ENV_NAME` | 환경 이름 | `production` |
| `APP_DOMAIN` | 랜딩 도메인 | `example.com` |
| `ADMIN_DOMAIN` | 어드민 도메인 | `admin.example.com` |
| `ADMIN_ACCESS_MODE` | 인증 모드 | `hybrid` |
| `ADMIN_ALLOWED_EMAILS` | 허용 이메일 (쉼표 구분) | `a@b.com,c@d.com` |
| `ADMIN_LOGIN_EMAIL` | 로그인 이메일 | `admin@example.com` |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare Account ID | `abc123...` |
| `CLOUDFLARE_IMAGES_DELIVERY_HASH` | Images delivery hash | `xyz789...` |
| `AI_GATEWAY_ACCOUNT_ID` | AI Gateway Account ID | `abc123...` |
| `AI_GATEWAY_ID` | AI Gateway ID | `default` |
| `AI_PROVIDER` | AI 제공자 | `workers-ai` |
| `AI_MODEL` | AI Gateway 모델 | `@cf/meta/llama-3.1-8b-instruct` |
| `AI_TEXT_MODEL` | Workers AI 텍스트 모델 | `@cf/meta/llama-3.1-8b-instruct-fast` |
| `AI_EMBED_MODEL` | Workers AI 임베딩 모델 | `@cf/baai/bge-small-en-v1.5` |
| `GITHUB_CLIENT_ID` | GitHub OAuth Client ID | `Iv1.abc123...` |
| `GITHUB_ALLOWED_USERS` | GitHub 허용 사용자 | `username1,username2` |

### 시크릿 (wrangler secret / .dev.vars)

| 변수 | 설명 | 필수 |
|------|------|------|
| `ADMIN_LOGIN_PASSWORD` | 어드민 비밀번호 | 필수 |
| `ADMIN_JWT_SECRET` | JWT 서명 키 (48자+) | 필수 |
| `AI_PROVIDER_API_KEY` | AI Gateway API 키 | AI 사용 시 |
| `CLOUDFLARE_IMAGES_API_TOKEN` | Images API 토큰 | 이미지 사용 시 |
| `RESEND_API_KEY` | Resend 이메일 API 키 | 이메일 사용 시 |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth Secret | GitHub 로그인 시 |

---

## 부록: Cloudflare 바인딩 전체 목록

| 바인딩 | 타입 | 필수 | 설명 |
|--------|------|------|------|
| `DB` | D1 | 필수 | 메인 데이터베이스 |
| `ASSETS` | Assets | 필수 | 프론트 정적자산 |
| `APP_KV` | KV | 필수 | 키-값 저장소 |
| `AI` | Workers AI | 선택 | 텍스트 생성, 임베딩 |
| `DOC_INDEX` | Vectorize | 선택 | 시맨틱 검색 인덱스 |
| `OpsAgent` | Durable Object | 선택 | 운영 에이전트 |
| `MEDIA_R2` | R2 | 선택 | 오브젝트 저장소 |

---

*이 문서는 2026-04-12 기준으로 작성되었습니다. 최신 변경사항은 소스 코드와 CLAUDE.md를 참고하세요.*
