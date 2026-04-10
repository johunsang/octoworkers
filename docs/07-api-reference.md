# API 레퍼런스

## 공통

- Base URL: `http://localhost:8787` (dev), `https://{slug}.workers.dev` (배포)
- Content-Type: `application/json`
- 에러 응답: `{ "message": "..." }` + HTTP 상태 코드
- 인증: `/api/admin/*` 경로는 JWT 쿠키 또는 Cloudflare Access 필요

## 공개 API

### GET /api/health

헬스체크.

**응답:** `{ "ok": true, "runtime": "cloudflare-workers" }`

### GET /api/public/bootstrap

랜딩 페이지 초기화 데이터.

**응답:**
```json
{
  "settings": {
    "id": 1, "brand": "...", "heroLabel": "...", "heroTitle": "...",
    "heroSubtitle": "...", "ctaPrimary": "...", "ctaSecondary": "...",
    "updatedAt": "..."
  },
  "metrics": {
    "totalLeads": 0, "totalMedia": 0, "updatedAt": "..."
  }
}
```

### POST /api/public/leads

리드 등록.

**요청:**
```json
{
  "name": "홍길동",
  "email": "hong@example.com",
  "company": "회사명",
  "message": "메시지"
}
```

**응답:** `{ "ok": true }` (201)

## 인증 API

### GET /api/auth/me

현재 세션 확인.

**응답 (인증 시):** `{ "email": "founder@example.com" }`
**응답 (미인증):** `{ "email": null }`

### POST /api/auth/login

이메일/비밀번호 로그인. JWT 쿠키(`__Host-octoworkers_admin`) 발급.

**요청:** `{ "email": "...", "password": "..." }`
**응답:** `{ "ok": true }`
**실패:** 401 `{ "message": "Invalid credentials." }`

### POST /api/auth/logout

세션 종료. 쿠키 삭제.

**응답:** `{ "ok": true }`

## 관리 API (인증 필요)

### GET /api/admin/dashboard

대시보드 통계.

**응답:**
```json
{
  "stats": {
    "totalLeads": 10,
    "totalMedia": 5,
    "latestLeadAt": "2026-04-08T...",
    "latestSettingUpdateAt": "2026-04-08T..."
  },
  "recentLeads": [...],
  "media": [...],
  "aiConfigured": true
}
```

### GET /api/admin/settings

사이트 설정 조회. SiteSettings 타입 반환.

### PUT /api/admin/settings

사이트 설정 수정.

**요청:** `{ "brand": "...", "heroLabel": "...", ... }`
**응답:** 업데이트된 SiteSettings

### GET /api/admin/leads

리드 목록 (최신 20건).

**응답:** `LeadRecord[]`

### GET /api/admin/images

미디어 에셋 목록.

**응답:** `MediaAsset[]`

### POST /api/admin/images/direct-upload

Cloudflare Images direct upload URL 생성.

**응답:** `{ "imageId": "...", "uploadURL": "https://upload.imagedelivery.net/..." }`

### POST /api/admin/images/:imageId/refresh

Cloudflare에서 이미지 상태를 다시 가져와 DB 갱신.

**응답:** 갱신된 MediaAsset

### PUT /api/admin/images/:imageId

이미지 메타데이터 수정.

**요청:** `{ "title": "...", "alt": "..." }`

### DELETE /api/admin/images/:imageId

이미지 삭제 (Cloudflare Images + DB).

### POST /api/admin/ai/copy

AI 카피 생성.

**요청:** `{ "objective": "...", "audience": "...", "tone": "..." }`
**응답:** `{ "heroTitle": "...", "heroSubtitle": "...", "ctaPrimary": "...", "rationale": "..." }`

### GET /api/admin/search?q=검색어

전문 검색 (SQL LIKE).

**응답:** `{ "leads": LeadRecord[], "media": MediaAsset[] }`

### POST /api/admin/vec/reindex

모든 데이터를 임베딩으로 변환하여 Vectorize에 인덱싱.

**응답:** `{ "indexed": 15 }`

### POST /api/admin/vec/search

시맨틱 검색.

**요청:** `{ "query": "..." }`
**응답:** `{ "count": 3, "matches": [{ "id": "...", "score": 0.95, "metadata": {...} }] }`

### GET /api/admin/agt

에이전트 스냅샷 (작업, 메모, 마지막 요약).

### POST /api/admin/agt/tasks

작업 추가. **요청:** `{ "description": "..." }`

### POST /api/admin/agt/tasks/:id/complete

작업 완료 처리.

### POST /api/admin/agt/notes

메모 추가. **요청:** `{ "content": "..." }`

### POST /api/admin/agt/summarize

AI 기반 작업 요약.

## 예제 API (ext)

| 경로 | 메서드 | 설명 |
|------|--------|------|
| `/api/admin/ext/img/example` | GET | 이미지 업로드 예제 데이터 |
| `/api/admin/ext/ai/example` | GET | AI 요청 예제 데이터 |
| `/api/admin/ext/ai/workers` | GET | Workers AI 설정 상태 |
| `/api/admin/ext/ai/text` | POST | Workers AI 텍스트 생성 |
| `/api/admin/ext/agt/example` | GET | 에이전트 예제 데이터 |
| `/api/admin/ext/vec/example` | GET | 벡터 검색 예제 데이터 |
| `/api/admin/ext/kv` | GET | KV 키 목록 |
| `/api/admin/ext/kv/:key` | GET/PUT/DELETE | KV CRUD |
| `/api/admin/ext/r2/:key` | GET/PUT/DELETE | R2 CRUD |
| `/api/admin/ext/rtm/ws` | GET | WebSocket echo |
