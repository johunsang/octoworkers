# Admin (운영 콘솔)

React 19 + Vite SWC 기반 인증 대시보드.

## 구조

- `src/main.tsx` — React 진입점
- `src/App.tsx` — 사이드바 인증 + 대시보드/설정/리드/미디어/AI/검색 통합
- `src/com/api/client.ts` — `apiFetch` 헬퍼 (Worker API 프록시)
- `src/com/ui/Panel.tsx` — 대시보드 카드 컴포넌트
- `src/biz/aut/` — 인증 (LoginScreen, useAuth)
- `src/biz/dsh/` — 대시보드 (useDashboard)
- `src/biz/set/` — 사이트 설정 (useSettings)
- `src/biz/led/` — 리드 관리 (useLeads)
- `src/biz/med/` — 미디어 관리 (MediaManager, useMedia)
- `src/biz/aid/` — AI 카피 생성 (useAiCopy)
- `src/biz/srh/` — 검색 (useSearch)
- `src/biz/ext/` — KV/R2/WebSocket 예제 UI

## 규칙

- API 호출은 반드시 `apiFetch` 사용
- 인증 필요: JWT 쿠키 세션 또는 Cloudflare Access
- 새 컴포넌트: `biz/{모듈}/components/` 하위에 배치
- 새 훅: `biz/{모듈}/hooks/use*.ts`
- 공유 타입은 `@octoworkers/com` 사용
- Vite dev proxy: `/api` → `http://127.0.0.1:8787`
- 빌드 결과물: `worker/public/admin/`으로 출력
