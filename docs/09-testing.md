# 테스트 가이드

## 실행

```bash
pnpm test                    # Worker Vitest 실행
pnpm check                   # 전체 패키지 TypeScript 타입 체크
```

## 테스트 구조

```
worker/test/
└── app.test.ts              # 모든 라우트 테스트
```

## 테스트 패턴

### Hono app.request() 패턴

```typescript
const app = createApp()
const response = await app.request(
  'http://localhost/api/admin/leads',  // URL
  { method: 'GET' },                   // RequestInit (선택)
  createTestEnv(),                      // 바인딩 mock
)

expect(response.status).toBe(200)
const body = await response.json()
expect(body).toHaveLength(1)
```

### Mock 환경 구성

```typescript
// 기본 테스트 환경 (D1 + KV + 도메인)
function createTestEnv() {
  return {
    DB: createSettingsDb(),       // D1 mock
    ASSETS: { fetch },            // Assets mock
    APP_KV: {                     // KV mock
      async get() { return null },
      async put() {},
      async delete() {},
      async list() { return { keys: [] } },
    },
    APP_DOMAIN: 'example.com',
    ADMIN_DOMAIN: 'admin.example.com',
    ADMIN_ACCESS_MODE: 'off',     // 인증 우회
  }
}

// AI + Vectorize 포함 환경
function createAiVectorEnv() {
  return {
    ...createTestEnv(),
    AI: {
      async run(model: string) {
        if (model.includes('bge')) return { data: [[0.11, 0.22, 0.33]] }
        return { response: 'AI generated text' }
      },
    },
    AI_TEXT_MODEL: '@cf/meta/llama-3.1-8b-instruct-fast',
    AI_EMBED_MODEL: '@cf/baai/bge-small-en-v1.5',
    DOC_INDEX: {
      async upsert() { return { ok: true } },
      async query() {
        return { count: 1, matches: [{ id: 'settings:1', score: 0.99, metadata: {} }] }
      },
    },
  }
}
```

### D1 Mock 패턴

```typescript
function createSettingsDb() {
  return {
    prepare(query: string) {
      return {
        bind() { return this },
        async first<T>() {
          if (query.includes('FROM site_settings')) {
            return { id: 1, brand: 'Test', /* ... */ } as T
          }
          return null
        },
        async all<T>() { return { results: [] as T[] } },
        async run() { return {} },
      }
    },
  }
}
```

### agents/hono-agents Mock

테스트 최상단에 `vi.mock()` 필수:

```typescript
vi.mock('agents', () => ({
  Agent: class {},
  callable: () => (target: unknown) => target,
  getAgentByName: vi.fn(),
}))
vi.mock('hono-agents', () => ({
  agentsMiddleware: () => async (_c: unknown, next: () => Promise<void>) => next(),
}))
vi.mock('../src/biz/agt/ops-agent', () => ({
  OpsAgent: class {},
}))
```

## 현재 테스트 목록

| 테스트 | 검증 내용 |
|--------|----------|
| health route | GET /api/health → 200 + `{ ok: true }` |
| AI Gateway | POST /api/admin/ai/copy → 200 + 카피 응답 |
| Workers AI status | GET /api/admin/ext/ai/workers → 200 + 설정 상태 |
| Vectorize search | POST /api/admin/vec/search → 200 + 매칭 결과 |

## 새 테스트 추가

`_templates/biz-module/test.ts`를 참고하여 `worker/test/app.test.ts`에 추가:

```typescript
describe('notifications', () => {
  it('should list notifications', async () => {
    const mockDb = { /* ... */ }
    const app = createApp()
    const res = await app.request(
      'http://localhost/api/admin/notifications',
      undefined,
      { ...createTestEnv(), DB: mockDb },
    )
    expect(res.status).toBe(200)
  })
})
```

## 타입 체크

```bash
pnpm check
```

전체 패키지 (`worker`, `landing`, `admin`, `com`)의 `tsc --noEmit`을 실행합니다. `contracts.ts` 변경 시 반드시 실행하여 소비자 호환성을 확인합니다.
