# Templates

새 비즈니스 모듈을 추가할 때 복사해서 사용하는 템플릿 파일들입니다.

## 사용법

### 1. 새 비즈니스 모듈 추가

```bash
# 예: "ntf" (notifications) 모듈 추가

# Worker 쪽
cp _templates/biz-module/worker/routes.ts    worker/src/biz/ntf/routes.ts
cp _templates/biz-module/worker/repository.ts worker/src/biz/ntf/repository.ts
cp _templates/biz-module/worker/service.ts    worker/src/biz/ntf/service.ts

# Admin 프론트엔드 쪽
cp _templates/biz-module/admin/hooks/useItems.ts         apps/admin/src/biz/ntf/hooks/useNotifications.ts
cp _templates/biz-module/admin/components/ItemPanel.tsx   apps/admin/src/biz/ntf/components/NotificationPanel.tsx
```

그런 다음:

1. `__ITEM__` / `__item__` / `__items__` 를 실제 이름으로 치환
2. `packages/com/src/contracts.ts`에 공유 타입 추가
3. `worker/src/index.ts`에 `.route('/api/admin/ntf', ntfRoutes)` 등록
4. D1 마이그레이션 SQL 작성 (`_templates/migration/` 참고)

### 2. D1 마이그레이션 추가

```bash
cp _templates/migration/0000_template.sql worker/migrations/0002_add_notifications.sql
```

마이그레이션 적용:

```bash
pnpm --filter @octoworkers/worker db:migrate:local
```