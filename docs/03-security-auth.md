# 보안 / 로그인 / Access

## 현재 보안 구성

포함된 항목:

- 보안 헤더
- admin API 인증 필요
- 세션 로그인
- JWT 기반 httpOnly 쿠키
- `sameSite=Strict`
- Cloudflare Access 병행 가능
- 허용 이메일 목록 검사
- staging / production 분리

## 인증 모드

설정 키:

- `ADMIN_ACCESS_MODE`

지원 모드:

- `off`: 로컬 개발용
- `session`: 로그인 세션만 사용
- `cloudflare-access`: Access 헤더만 사용
- `hybrid`: Access 또는 세션 둘 다 허용

권장값:

- 로컬: `off`
- staging: `hybrid`
- production: `hybrid` 또는 `cloudflare-access`

## 로그인 API

공개 인증 API:

- `GET /api/auth/me`
- `POST /api/auth/login`
- `POST /api/auth/logout`

필수 secret:

- `ADMIN_LOGIN_PASSWORD`
- `ADMIN_JWT_SECRET`

일반 var:

- `ADMIN_LOGIN_EMAIL`
- `ADMIN_ALLOWED_EMAILS`

## 세션 처리 방식

로그인 성공 시:

1. JWT 생성
2. `__Host-octoworkers_admin` 쿠키 발급
3. admin API 접근 시 쿠키 검증

## Cloudflare Access 병행

이 프로젝트는 `cf-access-authenticated-user-email` 헤더를 읽습니다.

따라서:

- Access 정책으로 1차 제한
- 앱 세션 로그인으로 2차 제어

구성도 가능합니다.

## 허용 이메일

예:

```jsonc
"ADMIN_ALLOWED_EMAILS": "founder@example.com,ops@example.com"
```

세션 로그인과 Access 모두 이 목록을 통과해야 합니다.

## 보안 헤더

주요 헤더:

- `Content-Security-Policy`
- `Referrer-Policy`
- `X-Content-Type-Options`
- `X-Frame-Options`
- `Permissions-Policy`
- `Cross-Origin-Opener-Policy`
- `Cross-Origin-Resource-Policy`
- `Strict-Transport-Security`

WebSocket 예제 라우트는 업그레이드 충돌을 피하기 위해 헤더 처리에서 예외 처리했습니다.

## 추가 권장사항

운영 전 권장:

- `ADMIN_ACCESS_MODE=cloudflare-access` 또는 `hybrid`
- Access 앱 생성
- GitHub branch protection 활성화
- Cloudflare WAF 룰 추가
- 로그인 비밀번호를 충분히 길게 설정
- AI provider key와 Images token 분리
- R2/KV는 최소 권한 토큰 사용