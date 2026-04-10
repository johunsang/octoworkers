---
name: security-review
description: 옥토워커스 보안 감사. 인증/인가, SQL 인젝션, XSS, 시크릿, CORS, Cloudflare 바인딩 보안을 점검할 때 사용.
---

옥토워커스 프로젝트 보안 감사를 수행합니다.

## 감사 항목

1. **인증/인가**: `worker/src/com/security.ts`의 `enforceAdminAccess`, JWT 세션, Cloudflare Access 연동
2. **SQL 인젝션**: D1 쿼리의 prepared statement 사용 확인 (`repository.ts` 파일들)
3. **XSS**: React 컴포넌트에서 `dangerouslySetInnerHTML` 사용 여부
4. **시크릿 노출**: 하드코딩된 API 키/토큰, 로그에 시크릿 포함 여부
5. **CORS**: `worker/src/index.ts` CORS origin 제한 확인
6. **보안 헤더**: `applySecurityHeaders`의 CSP, HSTS, X-Frame-Options
7. **Cloudflare 바인딩**: KV/R2/D1 접근 권한, Durable Object 호출 보호
8. **의존성**: `pnpm-lock.yaml`에서 알려진 CVE

## 출력

각 발견 항목: 심각도(Critical/High/Medium/Low/Informational), 위치(file:line), 설명, 수정 방안.
