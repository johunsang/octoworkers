# 개발 / 스테이징 / 운영 배포

## 브랜치 전략

- `develop` -> staging 자동 배포
- `main` -> production 자동 배포

## GitHub Actions

포함된 워크플로:

- [ci.yml](/Volumes/SAMSUNG/apps/projects/octoworkers/.github/workflows/ci.yml)
- [deploy-staging.yml](/Volumes/SAMSUNG/apps/projects/octoworkers/.github/workflows/deploy-staging.yml)
- [deploy-production.yml](/Volumes/SAMSUNG/apps/projects/octoworkers/.github/workflows/deploy-production.yml)

## CI 동작

`CI`는 다음을 수행합니다.

1. `pnpm install`
2. `pnpm check`
3. `pnpm test`
4. `pnpm build`

추가로 실제 배포 전에는 다음 항목이 Cloudflare 계정에 준비되어 있어야 합니다.

- D1
- Images
- KV
- Vectorize
- Agents용 Durable Object migration
- 필요 시 R2

## staging 배포

트리거:

- `develop` 브랜치 push

실행 순서:

1. `pnpm build`
2. `wrangler d1 migrations apply DB --remote --env staging`
3. `wrangler deploy --env staging`

로컬 수동 실행:

```bash
pnpm deploy:staging
```

staging 검증 권장:

1. `pnpm dev:remote`
2. `/api/admin/ext/ai/workers` 확인
3. `/api/admin/vec/reindex` 실행
4. admin에서 `Ops Agent` 패널 smoke test

## production 배포

트리거:

- `main` 브랜치 push

실행 순서:

1. `pnpm build`
2. `wrangler d1 migrations apply DB --remote`
3. `wrangler deploy`

로컬 수동 실행:

```bash
pnpm deploy:prod
```

## GitHub Secrets

필수:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

주의:

- Worker runtime secret과 GitHub Actions secret은 다릅니다.
- `ADMIN_LOGIN_PASSWORD`, `ADMIN_JWT_SECRET`, `AI_PROVIDER_API_KEY`, `CLOUDFLARE_IMAGES_API_TOKEN`은 Worker secret으로 별도 주입해야 합니다.

## 실제 운영 순서

권장 순서:

1. 로컬 개발
2. `develop` push
3. staging 검수
4. `main` merge/push
5. production 자동 배포

## 도메인 라우팅 활성화

[wrangler.jsonc](/Volumes/SAMSUNG/apps/projects/octoworkers/worker/wrangler.jsonc) 에 들어 있는 `routes` 예시는 주석 상태입니다.

실제 도메인 확정 후:

1. 주석 해제
2. 실제 도메인으로 변경
3. 다시 deploy

예:

```jsonc
"routes": [
  {
    "pattern": "example.com",
    "custom_domain": true
  },
  {
    "pattern": "admin.example.com",
    "custom_domain": true
  }
]
```

## 자산 배포 방식

빌드 결과:

- landing -> `worker/public/landing`
- admin -> `worker/public/admin`

Worker는 호스트명을 보고 해당 자산을 반환합니다.

## 원격 개발

Workers AI, Vectorize, Agents는 원격 Cloudflare 리소스를 바라보는 편이 더 정확합니다.

```bash
pnpm dev:remote
```

이 모드에서는 Worker만 remote dev로 띄우고, landing/admin Vite 앱은 로컬에서 유지합니다.

## 롤백 팁

이 저장소에는 별도 롤백 스크립트는 넣지 않았습니다.

운영에서 권장하는 롤백 전략:

- `main`에서 직전 안정 커밋을 다시 push
- 필요 시 해당 커밋 기준으로 redeploy
- 마이그레이션은 additive 방식 유지
