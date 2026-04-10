# 아키텍처

## 시스템 개요

```text
┌─────────────────────────────────────────────────────────────┐
│                     Cloudflare Edge                         │
│                                                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Cloudflare Worker (Hono)                   │ │
│  │                                                        │ │
│  │  Middleware Stack:                                     │ │
│  │  ┌──────────────┐ ┌──────────────┐ ┌───────┐ ┌─────┐ │ │
│  │  │ Security Hdrs │→│ Admin Access │→│ CORS  │→│ ETag│ │ │
│  │  └──────────────┘ └──────────────┘ └───────┘ └─────┘ │ │
│  │                         │                              │ │
│  │           ┌─────────────┼─────────────┐                │ │
│  │           ▼             ▼             ▼                │ │
│  │    /api/public/*  /api/admin/*   /* (assets)           │ │
│  │    (비인증)        (인증 필요)    (정적자산)              │ │
│  └────────────────────────────────────────────────────────┘ │
│                         │                                   │
│       ┌────────┬────────┼────────┬────────┬────────┐       │
│       ▼        ▼        ▼        ▼        ▼        ▼       │
│     ┌──┐   ┌────┐   ┌──────┐ ┌────┐  ┌─────┐  ┌────┐     │
│     │D1│   │ KV │   │Images│ │ AI │  │Vec. │  │ R2 │     │
│     └──┘   └────┘   └──────┘ └────┘  └─────┘  └────┘     │
│                                                             │
│     ┌──────────────────┐   ┌─────────────────┐              │
│     │  Durable Objects │   │   AI Gateway    │              │
│     │   (OpsAgent)     │   │  (외부 LLM)     │              │
│     └──────────────────┘   └─────────────────┘              │
└─────────────────────────────────────────────────────────────┘

┌──────────────────┐    ┌──────────────────┐
│  Landing App     │    │   Admin App      │
│  React + Vite    │    │   React + Vite   │
│  :5173 (dev)     │    │   :5174 (dev)    │
│                  │    │                  │
│  /api → :8787    │    │  /api → :8787    │
└──────────────────┘    └──────────────────┘
```

## 요청 흐름

### 1. 정적자산 요청

```
Browser → Worker → serveBoundAsset()
  → hostname === ADMIN_DOMAIN ? /admin/* : /landing/*
  → 404 ? → SPA fallback (/index.html)
```

### 2. 공개 API 요청

```
Browser → Worker → CORS → ETag → pub/routes.ts
  → /api/public/bootstrap: DB에서 settings + leads count + media count
  → /api/public/leads: Zod 검증 → DB INSERT
```

### 3. 인증 API 요청

```
Browser → Worker → Security Headers → enforceAdminAccess
  → Cloudflare Access 헤더 확인 OR JWT 쿠키 확인
  → 허용 이메일 목록 검사
  → 인증 성공 → CORS → ETag → admin 라우트
```

### 4. AI 카피 생성 흐름

```
Admin UI → /api/admin/ai/copy
  → ai-gateway.ts → gateway.ai.cloudflare.com/{account}/{gateway}/...
  → JSON 응답 파싱 → heroTitle, heroSubtitle, ctaPrimary, rationale
```

### 5. 시맨틱 검색 흐름

```
Admin UI → /api/admin/vec/reindex
  → vec/service.ts → buildDocuments() (D1에서 settings/leads/media 수집)
  → workers-ai.ts → createEmbedding() (384차원 벡터)
  → Vectorize.upsert()

Admin UI → /api/admin/vec/search
  → createEmbedding(query) → Vectorize.query(topK=10)
  → 점수 + 메타데이터 반환
```

### 6. 이미지 업로드 흐름

```
Admin UI → /api/admin/images/direct-upload
  → images.ts → Cloudflare Images API → direct upload URL 발급
  → 브라우저가 해당 URL로 직접 업로드
  → /api/admin/images/:id/refresh
  → images.ts → Cloudflare Images API → variant URL 조회
  → DB UPDATE (delivery_url, status)
```

## 모듈 의존성

```text
packages/com (공유 타입)
  ↑ import       ↑ import
  │               │
worker/src      apps/*/src
  │
  ├── com/        (인프라 — 다른 모듈에 의존하지 않음)
  │   ├── bindings.ts
  │   ├── db.ts
  │   ├── http.ts
  │   ├── env.ts
  │   ├── security.ts   → biz/aut/service.ts (JWT 읽기)
  │   ├── assets.ts
  │   ├── ai-gateway.ts
  │   └── workers-ai.ts
  │
  └── biz/        (비즈니스 — com에 의존, 서로 의존하지 않음)
      ├── aut/    → com/http (독립)
      ├── pub/    → biz/led/repository, biz/set/repository (읽기 전용)
      ├── dsh/    → biz/led, biz/med, biz/set (읽기 전용)
      └── ...     → com/* (각자 독립)
```

## 데이터 모델

```text
┌─────────────────────┐
│   site_settings     │  싱글톤 (id=1)
│─────────────────────│
│ brand               │
│ hero_label          │
│ hero_title          │
│ hero_subtitle       │
│ cta_primary         │
│ cta_secondary       │
│ updated_at          │
└─────────────────────┘

┌─────────────────────┐
│   leads             │
│─────────────────────│
│ id (PK, auto)       │
│ name                │
│ email               │
│ company (nullable)  │
│ message (nullable)  │
│ status (default:new)│
│ created_at          │
└─────────────────────┘

┌─────────────────────┐
│   media_assets      │
│─────────────────────│
│ id (PK, auto)       │
│ image_id (unique)   │
│ title               │
│ alt (nullable)      │
│ status (default:draft)│
│ delivery_url        │
│ preview_url         │
│ uploaded_at         │
└─────────────────────┘
```

## 배포 구조

```text
GitHub
  ├── main branch   → deploy-production.yml → wrangler deploy
  └── develop branch → deploy-staging.yml   → wrangler deploy --env staging

Cloudflare
  ├── octoworkers (production Worker)
  │   ├── D1: octoworkers
  │   ├── KV: APP_KV
  │   └── custom domain: example.com, admin.example.com
  │
  └── octoworkers-staging (staging Worker)
      ├── D1: octoworkers-staging
      ├── KV: APP_KV (staging)
      └── *.workers.dev
```
