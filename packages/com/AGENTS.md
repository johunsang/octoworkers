# Shared Contracts (@octoworkers/com)

프론트엔드와 백엔드가 공유하는 TypeScript 타입 패키지.

## 구조

- `src/index.ts` — 모든 contracts export
- `src/contracts.ts` — 타입 정의

## 주요 타입

- `SiteSettings` — 브랜드, 히어로, CTA 카피
- `LeadSubmissionInput` / `LeadRecord` — 리드 폼 데이터
- `MediaAsset` — 이미지 메타데이터
- `DashboardData` — 통계 집계
- `PublicBootstrap` — 프론트엔드 초기화 데이터
- `AiCopySuggestion` / `AiCopySuggestionRequest` — AI 카피 생성
- `PublicMetrics` — 공개 통계
- `DirectUploadPayload` — Cloudflare Images 업로드 응답

## 규칙

- 모든 공유 타입은 반드시 이 패키지에 정의
- worker와 apps 양쪽에서 `@octoworkers/com`으로 import
- 타입 변경 시 양쪽 소비자(worker, landing, admin) 모두 확인
- `pnpm check`로 전체 타입 호환성 검증
