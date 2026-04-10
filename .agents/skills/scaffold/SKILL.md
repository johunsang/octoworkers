---
name: scaffold
description: 옥토워커스 보일러플레이트에서 새 SaaS 프로젝트를 생성할 때 사용. CLI 실행 또는 수동 스캐폴딩을 안내.
---

새 프로젝트를 옥토워커스 보일러플레이트에서 스캐폴딩합니다.

## 사전 확인

1. `docs/05-cli-scaffolding.md`를 읽고 CLI 10단계를 이해한다
2. `docs/00-quick-start.md`를 읽고 전체 흐름을 파악한다

## CLI 실행

```bash
node cli/dist/index.js
```

10단계 대화형 CLI가 서버 세팅부터 배포까지 처리한다:
1. 사전 요구사항 확인 (Node.js, pnpm, git)
2. Cloudflare 로그인
3. 프로젝트 정보 (이름, 도메인, 이메일)
4. 모듈 선택 (AI, Vector, Agent, Examples)
5. 파일 복사 + 커스터마이징
6. pnpm install
7. Cloudflare 리소스 생성 (D1, KV, Vectorize, R2)
8. D1 마이그레이션
9. Workers 시크릿 설정
10. 빌드 → 배포 → 헬스체크 → Git → GitHub

## 수동 실행 (CLI 없이)

`docs/00-quick-start.md`의 "수동 세팅" 섹션 참고.

## 완료 후

- `docs/daily/YYYY-MM-DD/`에 작업 기록
- `CLAUDE.md`와 `AGENTS.md`가 새 프로젝트에 맞게 치환되었는지 확인
