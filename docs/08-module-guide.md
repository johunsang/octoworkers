# 모듈 가이드

## 모듈 구조

옥토워커스는 3글자 약어를 사용하는 모듈 구조를 따릅니다.

```text
worker/src/
├── com/          공통 인프라 (비즈니스 로직 없음)
└── biz/          비즈니스 모듈
    ├── aut/      인증 (auth)
    ├── pub/      공개 API (public)
    ├── dsh/      대시보드 (dashboard)
    ├── led/      리드 (leads)
    ├── med/      미디어 (media)
    ├── set/      설정 (settings)
    ├── aid/      AI 카피 (ai-draft)
    ├── srh/      검색 (search)
    ├── vec/      벡터 검색 (vectorize)
    ├── agt/      에이전트 (agent)
    ├── hlt/      헬스체크 (health)
    └── ext/      예제 (extensions)
```

## 파일 패턴

### Worker 모듈

| 파일 | 역할 | 필수 |
|------|------|------|
| `routes.ts` | Hono 라우터. HTTP 엔드포인트 정의 | 필수 |
| `repository.ts` | D1 쿼리 함수. prepared statement 사용 | DB 접근 시 |
| `service.ts` | 비즈니스 로직. routes와 repository 사이 | 복잡한 로직 시 |

### Admin 프론트엔드 모듈

| 파일 | 역할 | 필수 |
|------|------|------|
| `hooks/use*.ts` | React 훅. API 호출 + 상태 관리 | 필수 |
| `components/*.tsx` | UI 컴포넌트 | UI 있을 시 |

## 기존 모듈 상세

### aut/ (인증)

- `routes.ts`: GET /me, POST /login, POST /logout
- `service.ts`: JWT 발급/검증, 쿠키 관리, 비밀번호 검증
- 쿠키명: `__Host-octoworkers_admin` (12시간 만료)

### pub/ (공개 API)

- `routes.ts`: GET /bootstrap, POST /leads
- `led/repository`와 `set/repository`를 읽기 전용으로 호출

### led/ (리드)

- `routes.ts`: GET / (목록)
- `repository.ts`: createLead, listLeads, leadCount, latestLeadAt
- D1 테이블: `leads`

### med/ (미디어)

- `routes.ts`: GET /, POST /direct-upload, POST /:id/refresh, PUT /:id, DELETE /:id
- `repository.ts`: D1 CRUD for media_assets
- `images.ts`: Cloudflare Images API 클라이언트

### set/ (설정)

- `routes.ts`: GET /, PUT /
- `repository.ts`: getSiteSettings, updateSiteSettings
- D1 테이블: `site_settings` (싱글톤, id=1)

### aid/ (AI 카피)

- `routes.ts`: POST /copy
- `com/ai-gateway.ts`의 `generateCopySuggestion()` 호출

### vec/ (벡터 검색)

- `routes.ts`: POST /reindex, POST /search
- `service.ts`: buildDocuments, reindexDocuments, semanticSearch
- settings + leads + media를 임베딩으로 변환 → Vectorize에 저장

### agt/ (에이전트)

- `routes.ts`: GET /, POST /tasks, POST /tasks/:id/complete, POST /notes, POST /summarize
- `ops-agent.ts`: Durable Object 클래스 (SQLite 영속 저장, callable methods)

## 새 모듈 추가

### 1. 템플릿 복사

```bash
# 예: "ntf" (notifications) 모듈
mkdir -p worker/src/biz/ntf
cp _templates/biz-module/worker/routes.ts     worker/src/biz/ntf/routes.ts
cp _templates/biz-module/worker/repository.ts worker/src/biz/ntf/repository.ts
```

### 2. 플레이스홀더 치환

파일 내 `__ITEM__` → `Notification`, `__item__` → `notification`, `__items__` → `notifications`

### 3. 공유 타입 추가

`packages/com/src/contracts.ts`:
```typescript
export type NotificationRecord = {
  id: number
  title: string
  status: string
  createdAt: string
}
```

### 4. 라우트 등록

`worker/src/index.ts`:
```typescript
import { notificationRoutes } from './biz/ntf/routes'
// ...
app.route('/api/admin/notifications', notificationRoutes)
```

### 5. D1 마이그레이션

`worker/migrations/0002_add_notifications.sql`:
```sql
CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);
```

```bash
pnpm --filter @octoworkers/worker db:migrate:local
```

### 6. 테스트 추가

`worker/test/app.test.ts`에 새 테스트 블록 추가. `_templates/biz-module/test.ts` 참고.

### 7. Admin UI 추가 (선택)

```bash
mkdir -p apps/admin/src/biz/ntf/hooks
cp _templates/biz-module/admin/hooks/useItems.ts apps/admin/src/biz/ntf/hooks/useNotifications.ts
```

`apps/admin/src/App.tsx`에 패널 추가.

## 모듈 제거

### ext/ 제거

1. `worker/src/biz/ext/` 삭제
2. `apps/admin/src/biz/ext/` 삭제
3. `worker/src/index.ts`에서 `extRoutes` import/route 제거

### agt/ 제거

1. `worker/src/biz/agt/` 삭제
2. `worker/src/index.ts`에서 `agentRoutes`, `OpsAgent`, `agentsMiddleware` 제거
3. `worker/wrangler.jsonc`에서 `durable_objects`, `migrations` 블록 제거
4. `worker/package.json`에서 `agents`, `hono-agents` 의존성 제거

### vec/ 제거

1. `worker/src/biz/vec/` 삭제
2. `worker/src/index.ts`에서 `vectorRoutes` 제거
3. `worker/wrangler.jsonc`에서 `vectorize` 블록 제거

### aid/ 제거

1. `worker/src/biz/aid/` 삭제
2. `worker/src/index.ts`에서 `aiRoutes` 제거
