# Landing (공개 랜딩 페이지)

React 19 + Vite SWC 기반 마케팅 사이트.

## 구조

- `src/main.tsx` — React 진입점
- `src/App.tsx` — Hero, Feature Grid, Lead Capture, Metrics 통합
- `src/com/api/client.ts` — `apiFetch` 헬퍼 (Worker API 프록시)
- `src/com/ui/Section.tsx` — 공통 레이아웃 컴포넌트
- `src/biz/mkt/` — 마케팅 모듈
  - `hooks/usePublicBootstrap.ts` — `/api/public/bootstrap` 호출
  - `components/HeroPanel.tsx`, `LeadCapturePanel.tsx`, `FeatureGrid.tsx`
- `src/biz/ext/fallbackSiteSettings.ts` — 오프라인 폴백 데이터

## 규칙

- API 호출은 반드시 `apiFetch` 사용
- 새 컴포넌트: `biz/{모듈}/components/` 하위에 배치
- 새 훅: `biz/{모듈}/hooks/use*.ts`
- 공유 타입은 `@octoworkers/com` 사용
- Vite dev proxy: `/api` → `http://127.0.0.1:8787`
- 빌드 결과물: `worker/public/landing/`으로 출력
