# 템플릿 가이드

## 개요

`_templates/` 디렉토리에는 새 비즈니스 모듈을 빠르게 추가할 수 있는 복사용 템플릿이 포함되어 있습니다.

## 구조

```
_templates/
├── README.md                           # 사용법
├── migration/
│   └── 0000_template.sql              # D1 테이블 생성 SQL
└── biz-module/
    ├── contracts.ts                   # 공유 타입 (contracts.ts 추가용)
    ├── test.ts                        # Vitest 테스트
    ├── worker/
    │   ├── routes.ts                  # Hono CRUD 라우트
    │   ├── repository.ts             # D1 쿼리 함수
    │   └── service.ts                # 비즈니스 로직
    └── admin/
        ├── hooks/useItems.ts         # React 훅
        └── components/ItemPanel.tsx   # 패널 UI
```

## 플레이스홀더

모든 템플릿에 아래 플레이스홀더가 사용됩니다:

| 플레이스홀더 | 치환 예시 | 용도 |
| --- | --- | --- |
| `__ITEM__` | `Notification` | PascalCase 타입명, 함수명 |
| `__item__` | `notification` | camelCase 변수명 |
| `__items__` | `notifications` | 복수형 테이블명, URL 경로 |

## 사용 예시: notifications 모듈

### 1. 파일 복사

```bash
mkdir -p worker/src/biz/ntf
cp _templates/biz-module/worker/routes.ts     worker/src/biz/ntf/routes.ts
cp _templates/biz-module/worker/repository.ts worker/src/biz/ntf/repository.ts
cp _templates/biz-module/worker/service.ts    worker/src/biz/ntf/service.ts

mkdir -p apps/admin/src/biz/ntf/hooks apps/admin/src/biz/ntf/components
cp _templates/biz-module/admin/hooks/useItems.ts         apps/admin/src/biz/ntf/hooks/useNotifications.ts
cp _templates/biz-module/admin/components/ItemPanel.tsx   apps/admin/src/biz/ntf/components/NotificationPanel.tsx
```

### 2. 치환

```bash
# macOS
find worker/src/biz/ntf apps/admin/src/biz/ntf -type f | xargs sed -i '' \
  -e 's/__ITEM__/Notification/g' \
  -e 's/__item__/notification/g' \
  -e 's/__items__/notifications/g'
```

### 3. 공유 타입 추가

`packages/com/src/contracts.ts` 하단에 `_templates/biz-module/contracts.ts` 내용 추가 후 치환.

### 4. 라우트 등록

`worker/src/index.ts`:

```typescript
import { notificationRoutes } from './biz/ntf/routes'
app.route('/api/admin/notifications', notificationRoutes)
```

### 5. 마이그레이션

```bash
cp _templates/migration/0000_template.sql worker/migrations/0002_add_notifications.sql
sed -i '' 's/__items__/notifications/g' worker/migrations/0002_add_notifications.sql
pnpm --filter @octoworkers/worker db:migrate:local
```

### 6. 테스트

`_templates/biz-module/test.ts`의 코드를 `worker/test/app.test.ts`에 추가 후 치환.

### 7. 검증

```bash
pnpm check    # 타입 체크
pnpm test     # 테스트
pnpm dev      # 실행 확인
```

## 템플릿 파일 상세

### routes.ts

- `GET /` — 목록 조회
- `GET /:id` — 단건 조회
- `POST /` — 생성 (Zod 검증)
- `PUT /:id` — 수정 (Zod 검증)
- `DELETE /:id` — 삭제

### repository.ts

- `list__ITEM__s()` — ORDER BY id DESC, LIMIT
- `get__ITEM__()` — WHERE id = ?
- `create__ITEM__()` — INSERT
- `update__ITEM__()` — UPDATE (기존 값 폴백)
- `delete__ITEM__()` — DELETE
- `__item__Count()` — COUNT(\*)

### service.ts

- `safeCreate__ITEM__()` — 카운트 제한 검사 후 생성
- `get__ITEM__Stats()` — 카운트 + 최근 목록

### hooks/useItems.ts

- `items` — 상태 배열
- `loading` — 로딩 상태
- `create()` — POST
- `update()` — PUT
- `remove()` — DELETE
- `reload()` — 목록 새로고침

### components/ItemPanel.tsx

- 생성 폼 (제목 입력 + 추가 버튼)
- 목록 (제목, 상태, 수정/삭제 버튼)