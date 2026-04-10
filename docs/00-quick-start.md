# 빠른 시작

## CLI로 자동 세팅 (권장)

```bash
node cli/dist/index.js
```

10단계 대화형 CLI가 서버 세팅부터 배포까지 전부 처리합니다.

| 단계 | 내용 |
|------|------|
| 1 | 사전 요구사항 확인 (Node.js, pnpm, git) |
| 2 | Cloudflare 로그인 (`wrangler login`) |
| 3 | 프로젝트 정보 (이름, 도메인, 이메일) |
| 4 | 모듈 선택 (AI, Vector, Agent, Examples) |
| 5 | 파일 복사 + 이름/도메인/ID 자동 치환 |
| 6 | `pnpm install` |
| 7 | Cloudflare 리소스 생성 (D1, KV, Vectorize, R2) |
| 8 | D1 마이그레이션 (로컬 + 원격) |
| 9 | Workers 시크릿 설정 |
| 10 | 빌드 → 타입체크 → 테스트 → 배포 → 헬스체크 → Git → GitHub |

## 수동 세팅

```bash
git clone <this-repo> my-project
cd my-project
pnpm install
cp worker/.dev.vars.example worker/.dev.vars
# .dev.vars 편집
pnpm --filter @octoworkers/worker db:migrate:local
pnpm dev
```

개발 포트:

- Landing: http://localhost:5173
- Admin: http://localhost:5174
- Worker API: http://localhost:8787

## 커스터마이징 순서

1. 프로젝트 이름 교체 → `package.json` 5곳
2. Cloudflare 리소스 설정 → `wrangler.jsonc`
3. 시크릿 → `.dev.vars` + `wrangler secret put`
4. DB 초기화 → `db:migrate:local`
5. 불필요한 예제 모듈 제거 (선택)
6. 비즈니스 모듈 추가 → `_templates/` 참고

상세는 [CLAUDE.md](../CLAUDE.md)의 "보일러플레이트 커스터마이징 가이드" 참고.
