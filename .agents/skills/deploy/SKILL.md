---
name: deploy
description: Cloudflare Workers 배포 파이프라인. staging 또는 production 배포 준비와 실행 시 사용.
---

배포 파이프라인을 실행합니다.

## 사전 검증

1. `pnpm check` — 전체 TypeScript 타입 체크
2. `pnpm test` — Vitest 테스트 실행
3. `pnpm build` — landing + admin Vite 프로덕션 빌드
4. D1 마이그레이션 확인 (`worker/migrations/`)
5. `wrangler.jsonc` 대상 환경 설정 검증
6. Git working tree 클린 확인

## 배포 실행

- staging: `pnpm deploy:staging` (develop 브랜치)
- production: `pnpm deploy:prod` (main 브랜치)

## 중요

- 어떤 단계라도 실패하면 즉시 중단
- 테스트 실패 무시 금지
- 원격 D1 마이그레이션은 사용자 확인 후 실행
