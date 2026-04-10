---
name: fix-issue
description: 이슈/버그 수정. 이슈 번호나 설명을 받아 원인 분석, 수정, 테스트까지 수행할 때 사용.
---

이슈를 수정합니다.

## 단계

1. 이슈를 읽고 기대 동작 vs 실제 동작 파악
2. 관련 모듈 식별 (`worker/src/biz/` 또는 `apps/*/src/biz/`)
3. 관련 contracts 확인 (`packages/com/src/contracts.ts`)
4. 최소한의 수정 구현
5. `pnpm check` — TypeScript 검증
6. `pnpm test` — 기존 테스트 통과 확인
7. 버그 재발 방지 테스트 추가 (`worker/test/`)
