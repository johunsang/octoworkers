`git diff main...HEAD`로 현재 브랜치 변경사항을 리뷰합니다.

## 리뷰 항목

1. **Bugs**: Hono 라우트 로직 오류, 엣지 케이스, null 체크
2. **Security**: D1 SQL 인젝션, XSS, 인증 우회, CORS 설정, 시크릿 노출
3. **Performance**: N+1 D1 쿼리, 불필요한 React 리렌더링, Worker 번들 크기
4. **Cloudflare**: 바인딩 사용 패턴, Durable Object 라이프사이클, KV/R2 에러 처리
5. **Type safety**: Zod 스키마와 `@octoworkers/com` contracts 일관성
6. **Convention**: 3글자 모듈 명명, routes/repository/service 분리

## 출력

각 이슈: file:line, 설명, 수정 제안. 심각도 표기(critical/high/medium/low).
