새 프로젝트를 옥토워커스 보일러플레이트에서 스캐폴딩합니다: $ARGUMENTS

## 절차

1. `docs/05-cli-scaffolding.md`를 읽고 CLI 10단계를 이해한다
2. `docs/00-quick-start.md`를 읽고 전체 흐름을 파악한다
3. 사용자에게 아래 정보를 확인한다:
   - 프로젝트 이름, 슬러그, 도메인, 이메일
   - 포함할 모듈 (AI, Vector, Agent, Examples)
   - 배포 대상 (staging / prod / skip)
4. CLI 실행: `node cli/dist/index.js`
   - CLI가 대화형이므로 사용자에게 터미널에서 직접 실행하도록 안내
   - 또는 각 단계를 수동으로 실행:

### 수동 실행 (CLI 대신)

```bash
# 파일 복사 (CLI dist가 없을 경우 수동)
cp -r . /path/to/new-project
cd /path/to/new-project

# 이름 치환
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.json" -o -name "*.jsonc" -o -name "*.md" -o -name "*.yaml" -o -name "*.css" -o -name "*.html" \) \
  -not -path "*/node_modules/*" \
  -exec sed -i '' 's/octoworkers/새슬러그/g; s/옥토워커스/새이름/g; s/example\.com/새도메인/g' {} +

# 설치 + 마이그레이션
pnpm install
pnpm --filter @새스코프/worker db:migrate:local

# Cloudflare 리소스 (wrangler 로그인 필요)
npx wrangler d1 create 새슬러그
npx wrangler kv namespace create APP_KV
# wrangler.jsonc에 ID 반영

# 시크릿
cd worker
npx wrangler secret put ADMIN_LOGIN_PASSWORD
npx wrangler secret put ADMIN_JWT_SECRET

# 빌드 + 배포
pnpm build
pnpm deploy:staging
```

5. 완료 후 `docs/daily/YYYY-MM-DD/claude.md`에 작업 기록
