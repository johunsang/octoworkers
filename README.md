# 옥토워커스

Cloudflare 중심으로 바로 시작할 수 있는 SaaS 보일러플레이트입니다.

- `landing`: 공개 랜딩 페이지 Vite 앱
- `admin`: 로그인 기반 운영 콘솔 Vite 앱
- `worker`: Hono + Cloudflare Workers API/정적자산/보안/배포 진입점
- `D1`: 운영 데이터
- `Images`: 업로드 및 메타데이터 관리
- `AI Gateway`: 카피 생성 예제
- `Workers AI`: 텍스트 생성 / 임베딩 예제
- `Vectorize`: 시맨틱 검색 인덱스 예제
- `KV`: 서버리스 키값 저장소 예제
- `R2`: 오브젝트 저장소 예제
- `Realtime`: WebSocket 에코 예제
- `Agents`: Durable Object 기반 운영 에이전트 예제

## 빠른 시작

```bash
pnpm install
cp worker/.dev.vars.example worker/.dev.vars
pnpm --filter @octoworkers/worker db:migrate:local
pnpm dev
```

Workers AI / Vectorize / Agents까지 함께 검증하려면 원격 Cloudflare 리소스를 쓰는 개발 모드도 준비되어 있습니다.

```bash
pnpm dev:remote
```

개발 포트:

- Landing: `http://localhost:5173`
- Admin: `http://localhost:5174`
- Worker API: `http://localhost:8787`

## 구조

공통 규칙:

- 공통 모듈: `com`
- 비즈니스 모듈: `biz/{3글자}`
- 예제/확장 모듈: `biz/ext`

주요 코드 맵:

```text
apps/
  landing/
    src/
      com/
      biz/
        mkt/  # marketing
        ext/  # fallback/sample data
  admin/
    src/
      com/
      biz/
        aut/  # auth
      aid/  # AI drafting
      dsh/  # dashboard
      led/  # leads
      med/  # media
      set/  # settings
      srh/  # search
        ext/  # KV/R2/realtime example UI
worker/
  src/
    com/
    biz/
      aid/   # AI routes
      aut/   # auth routes/session
      dsh/   # dashboard routes
      agt/   # agent orchestration routes
      hlt/   # health
      led/   # leads
      med/   # images/media
      pub/   # public landing API
      set/   # settings
      srh/   # search
      vec/   # vector indexing/search
      ext/   # realtime/KV/R2/image example routes
```

## 포함 기능

- Hono 기반 API 라우팅
- Hono `etag` 적용
- 보안 헤더 적용
- 세션 로그인 쿠키 + JWT
- Cloudflare Access와 병행 가능한 admin 보호 모드
- D1 기반 settings/leads/media 저장
- Cloudflare Images direct upload + refresh/update/delete
- Workers AI text generation + embeddings helpers
- Vectorize reindex + semantic search
- Durable Object backed Ops Agent + callable task APIs
- Workers KV 예제 CRUD
- R2 예제 CRUD
- WebSocket realtime echo 예제
- GitHub Actions CI / staging / production 배포

## 실행 스크립트

```bash
pnpm dev
pnpm dev:remote
pnpm check
pnpm test
pnpm build
pnpm deploy:staging
pnpm deploy:prod
```

## 문서

- [빠른 시작](./docs/00-quick-start.md)
- [Cloudflare 초기 설정](./docs/01-cloudflare-setup.md)
- [개발/스테이징/운영 배포](./docs/02-deployments.md)
- [보안, 로그인, Access](./docs/03-security-auth.md)
- [AI, Images, KV, R2, Realtime 예제](./docs/04-cloudflare-examples.md)
- [CLI 스캐폴딩 (create-octoworkers)](./docs/05-cli-scaffolding.md)
- [아키텍처](./docs/06-architecture.md)
- [API 레퍼런스](./docs/07-api-reference.md)
- [모듈 가이드](./docs/08-module-guide.md)
- [테스트 가이드](./docs/09-testing.md)
- [프론트엔드 가이드](./docs/10-frontend.md)
- [템플릿 가이드](./docs/11-templates.md)
- [트러블슈팅 & 주의사항](./docs/12-troubleshooting.md)

## 바로 알아둘 점

- `worker/wrangler.jsonc`에는 실제 도메인, D1 ID, Images delivery hash를 넣어야 합니다.
- `Workers AI`, `Vectorize`, `Agents`는 Cloudflare 원격 리소스를 사용하므로 `pnpm dev:remote` 흐름이 특히 중요합니다.
- `ADMIN_LOGIN_PASSWORD`, `ADMIN_JWT_SECRET`, `AI_PROVIDER_API_KEY`, `CLOUDFLARE_IMAGES_API_TOKEN`은 secret으로 넣는 전제를 잡았습니다.
- `R2`는 기본값으로 주석 처리되어 있습니다. 버킷명을 확정한 뒤 활성화하면 됩니다.
- `KV`는 예제 바인딩이 포함되어 있고, `ext` API/UI에서 바로 확인할 수 있습니다.