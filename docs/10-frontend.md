# 프론트엔드 가이드

## 개요

옥토워커스는 두 개의 독립된 React + Vite 앱을 포함합니다.

| 앱 | 경로 | 포트 | 용도 | 빌드 출력 |
|----|------|------|------|----------|
| Landing | `apps/landing/` | :5173 | 공개 마케팅 + 리드 수집 | `worker/public/landing/` |
| Admin | `apps/admin/` | :5174 | 인증 운영 콘솔 | `worker/public/admin/` |

## 공통 패턴

### API 호출

양쪽 앱 모두 `com/api/client.ts`의 `apiFetch<T>()` 사용:

```typescript
import { apiFetch } from '../com/api/client'

const data = await apiFetch<LeadRecord[]>('/api/admin/leads')
```

### 공유 타입

`@octoworkers/com`에서 import:

```typescript
import type { SiteSettings, LeadRecord } from '@octoworkers/com'
```

### Vite 프록시

개발 시 `/api/*` 요청을 Worker(:8787)로 프록시:

```typescript
// vite.config.ts
server: {
  proxy: { '/api': 'http://127.0.0.1:8787' }
}
```

## Landing 앱 구조

```
apps/landing/src/
├── main.tsx              # React DOM 진입점
├── App.tsx               # 메인 컴포넌트
├── styles.css            # 다크 테마, 오렌지/시안 그라데이션
├── com/
│   ├── api/client.ts     # apiFetch
│   └── ui/Section.tsx    # 공통 레이아웃
└── biz/
    ├── mkt/              # 마케팅 모듈
    │   ├── hooks/usePublicBootstrap.ts
    │   └── components/
    │       ├── HeroPanel.tsx
    │       ├── LeadCapturePanel.tsx
    │       └── FeatureGrid.tsx
    └── ext/
        └── fallbackSiteSettings.ts
```

### 데이터 흐름

```
App mount → usePublicBootstrap → GET /api/public/bootstrap
  → settings + metrics
  → HeroPanel (브랜드, 히어로 카피, CTA)
  → FeatureGrid (기능 소개)
  → LeadCapturePanel (폼 → POST /api/public/leads)
```

## Admin 앱 구조

```
apps/admin/src/
├── main.tsx              # React DOM 진입점
├── App.tsx               # 메인 (로그인 → AuthenticatedAdmin)
├── styles.css            # 라이트 테마, 다크 사이드바
├── com/
│   ├── api/client.ts     # apiFetch
│   └── ui/Panel.tsx      # 대시보드 카드
└── biz/
    ├── aut/              # 인증
    │   ├── hooks/useAuth.ts
    │   └── components/LoginScreen.tsx
    ├── dsh/hooks/useDashboard.ts
    ├── set/hooks/useSettings.ts
    ├── led/hooks/useLeads.ts
    ├── med/
    │   ├── hooks/useMedia.ts
    │   └── components/MediaManager.tsx
    ├── aid/hooks/useAiCopy.ts
    ├── srh/hooks/useSearch.ts
    └── ext/
        ├── components/CloudflareExamples.tsx
        └── fallbackSiteSettings.ts
```

### 인증 흐름

```
App mount → useAuth → GET /api/auth/me
  → 미인증: LoginScreen 표시
    → POST /api/auth/login → 세션 쿠키 발급
  → 인증: AuthenticatedAdmin 표시
    → 사이드바 (이메일, 로그아웃)
    → 패널 그리드 (Dashboard, Search, Settings, Leads, Media, Examples)
```

### 패널 레이아웃

```
AuthenticatedAdmin
├── Sidebar (user email, logout)
└── Grid
    ├── Panel "Dashboard"     → useDashboard
    ├── Panel "Search"        → useSearch
    ├── Panel "Settings"      → useSettings
    ├── Panel "Leads"         → useLeads
    ├── Panel "Media"         → useMedia + MediaManager
    ├── Panel "AI Copy"       → useAiCopy
    └── Panel "CF Examples"   → CloudflareExamples
```

## 새 프론트엔드 모듈 추가

1. `apps/admin/src/biz/{3글자}/hooks/use*.ts` 생성
2. `apps/admin/src/biz/{3글자}/components/*.tsx` 생성 (선택)
3. `App.tsx`의 `AuthenticatedAdmin`에 패널 추가
4. `@octoworkers/com`에서 필요한 타입 import

```typescript
// hooks/useNotifications.ts
import { useEffect, useState } from 'react'
import { apiFetch } from '../../../com/api/client'

export function useNotifications() {
  const [items, setItems] = useState([])
  useEffect(() => {
    apiFetch('/api/admin/notifications').then(setItems)
  }, [])
  return { items }
}
```

## 빌드

```bash
pnpm build            # landing + admin 동시 빌드
pnpm build:landing    # landing만
pnpm build:admin      # admin만
```

빌드 결과물은 `worker/public/`에 출력되며, Worker가 호스트명 기반으로 서빙합니다.
