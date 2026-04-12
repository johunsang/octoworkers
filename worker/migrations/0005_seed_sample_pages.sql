-- 옥토워커스 샘플 CMS 페이지 시드 데이터
INSERT INTO pages (slug, title, content_md, content_html, status, published_at, created_at, updated_at) VALUES
(
  'about',
  '옥토워커스 소개',
  '# 옥토워커스란?

옥토워커스는 Cloudflare Workers 기반 **SaaS 보일러플레이트**입니다.

## 왜 옥토워커스인가

- **풀스택 에지 런타임**: 프론트엔드, API, 데이터베이스, AI가 모두 Cloudflare 안에서 돌아갑니다
- **프로덕션 레디**: 인증, CORS, CSP, 보안 헤더가 기본 탑재
- **모듈 구조**: 3글자 약어 기반 모듈 시스템으로 비즈니스 로직을 깔끔하게 분리
- **원클릭 배포**: GitHub Actions CI/CD로 staging/production 분리 배포

## 기술 스택

| 영역 | 기술 |
|------|------|
| API | Hono 4 + TypeScript |
| 프론트 | React 19 + Vite |
| DB | Cloudflare D1 (SQLite) |
| AI | Workers AI + AI Gateway |
| 배포 | GitHub Actions + Wrangler |

시작하려면 [문의 페이지](/pages/contact)를 확인하세요.',
  '<h1>옥토워커스란?</h1><p>옥토워커스는 Cloudflare Workers 기반 <strong>SaaS 보일러플레이트</strong>입니다.</p><h2>왜 옥토워커스인가</h2><ul><li><strong>풀스택 에지 런타임</strong>: 프론트엔드, API, 데이터베이스, AI가 모두 Cloudflare 안에서 돌아갑니다</li><li><strong>프로덕션 레디</strong>: 인증, CORS, CSP, 보안 헤더가 기본 탑재</li><li><strong>모듈 구조</strong>: 3글자 약어 기반 모듈 시스템으로 비즈니스 로직을 깔끔하게 분리</li><li><strong>원클릭 배포</strong>: GitHub Actions CI/CD로 staging/production 분리 배포</li></ul><h2>기술 스택</h2><p>API: Hono 4 + TypeScript / 프론트: React 19 + Vite / DB: Cloudflare D1 / AI: Workers AI + AI Gateway / 배포: GitHub Actions + Wrangler</p><p>시작하려면 문의 페이지를 확인하세요.</p>',
  'published',
  datetime('now'),
  datetime('now'),
  datetime('now')
),
(
  'features',
  '주요 기능',
  '# 옥토워커스 주요 기능

## 랜딩 페이지
React + Vite 기반 마케팅 사이트. 히어로, 기능 그리드, 리드 캡처 폼이 기본 포함됩니다.

## 어드민 콘솔
인증 기반 운영 대시보드. 리드 CRM, 미디어 관리, 사이트 설정, AI 카피 생성, 이메일 발송, CMS를 하나의 화면에서 관리합니다.

## API 서버
Hono 4 기반 타입 세이프 REST API. Zod 검증, JWT 세션, CORS, ETag 캐싱이 기본 탑재됩니다.

## 데이터베이스
Cloudflare D1 (SQLite). 마이그레이션 자동화, prepared statement 기반 안전한 쿼리.

## 미디어 관리
Cloudflare Images 직접 업로드. 메타데이터 관리, 상태 추적, delivery URL 자동 생성.

## AI 연동
- **Workers AI**: 텍스트 생성, 임베딩
- **AI Gateway**: 비용 추적, 속도 제한
- **Vectorize**: 시맨틱 검색

## 이메일 시스템
Resend API 연동. 템플릿 관리, 리드별 발송, 이력 추적.

## CMS
마크다운 기반 페이지 관리. 발행/미발행 상태, slug 기반 공개 URL.',
  '<h1>옥토워커스 주요 기능</h1><h2>랜딩 페이지</h2><p>React + Vite 기반 마케팅 사이트. 히어로, 기능 그리드, 리드 캡처 폼이 기본 포함됩니다.</p><h2>어드민 콘솔</h2><p>인증 기반 운영 대시보드. 리드 CRM, 미디어 관리, 사이트 설정, AI 카피 생성, 이메일 발송, CMS를 하나의 화면에서 관리합니다.</p><h2>API 서버</h2><p>Hono 4 기반 타입 세이프 REST API. Zod 검증, JWT 세션, CORS, ETag 캐싱이 기본 탑재됩니다.</p><h2>데이터베이스</h2><p>Cloudflare D1 (SQLite). 마이그레이션 자동화, prepared statement 기반 안전한 쿼리.</p><h2>미디어 관리</h2><p>Cloudflare Images 직접 업로드. 메타데이터 관리, 상태 추적, delivery URL 자동 생성.</p><h2>AI 연동</h2><ul><li><strong>Workers AI</strong>: 텍스트 생성, 임베딩</li><li><strong>AI Gateway</strong>: 비용 추적, 속도 제한</li><li><strong>Vectorize</strong>: 시맨틱 검색</li></ul><h2>이메일 시스템</h2><p>Resend API 연동. 템플릿 관리, 리드별 발송, 이력 추적.</p><h2>CMS</h2><p>마크다운 기반 페이지 관리. 발행/미발행 상태, slug 기반 공개 URL.</p>',
  'published',
  datetime('now'),
  datetime('now'),
  datetime('now')
),
(
  'pricing',
  '요금 안내',
  '# 옥토워커스 요금 안내

## 무료 (오픈소스)
옥토워커스 보일러플레이트는 **MIT 라이선스**로 무료 제공됩니다.

## Cloudflare 비용
실제 운영 비용은 Cloudflare 리소스 사용량에 따라 달라집니다.

### Workers Free Plan
- **요청**: 일 100,000건 무료
- **D1**: 5GB 스토리지, 일 500만 행 읽기
- **KV**: 일 100,000 읽기, 1,000 쓰기
- **Images**: 월 $5부터 (1,000장 저장, 5,000 변환)

### Workers Paid Plan ($5/월)
- **요청**: 월 1,000만건 포함 (초과 시 100만건당 $0.30)
- **D1**: 25GB 스토리지, 월 500억 행 읽기
- **KV**: 무제한 읽기
- **AI Gateway**: 로깅, 캐싱, 속도 제한

### 엔터프라이즈
대규모 트래픽, 전용 지원이 필요하시면 문의해 주세요.

---

*모든 가격은 Cloudflare 공식 요금 기준이며, 변동될 수 있습니다.*',
  '<h1>옥토워커스 요금 안내</h1><h2>무료 (오픈소스)</h2><p>옥토워커스 보일러플레이트는 <strong>MIT 라이선스</strong>로 무료 제공됩니다.</p><h2>Cloudflare 비용</h2><p>실제 운영 비용은 Cloudflare 리소스 사용량에 따라 달라집니다.</p><h3>Workers Free Plan</h3><ul><li>요청: 일 100,000건 무료</li><li>D1: 5GB 스토리지, 일 500만 행 읽기</li><li>KV: 일 100,000 읽기, 1,000 쓰기</li><li>Images: 월 $5부터</li></ul><h3>Workers Paid Plan ($5/월)</h3><ul><li>요청: 월 1,000만건 포함</li><li>D1: 25GB 스토리지</li><li>KV: 무제한 읽기</li><li>AI Gateway: 로깅, 캐싱, 속도 제한</li></ul><h3>엔터프라이즈</h3><p>대규모 트래픽, 전용 지원이 필요하시면 문의해 주세요.</p><hr/><p><em>모든 가격은 Cloudflare 공식 요금 기준이며, 변동될 수 있습니다.</em></p>',
  'published',
  datetime('now'),
  datetime('now'),
  datetime('now')
),
(
  'contact',
  '문의하기',
  '# 문의하기

옥토워커스에 대해 궁금한 점이 있으시면 아래 채널로 연락해 주세요.

## 일반 문의
- **이메일**: hello@octoworkers.com
- **GitHub**: [github.com/octoworkers](https://github.com/octoworkers)

## 기술 지원
- GitHub Issues에 버그 리포트나 기능 요청을 남겨주세요
- 커뮤니티 디스커션에서 다른 사용자들과 소통할 수 있습니다

## 엔터프라이즈
- 전용 지원, 커스텀 개발, 컨설팅이 필요하시면 이메일로 문의해 주세요
- SLA 기반 지원 계약도 가능합니다

---

또는 메인 페이지의 **문의 폼**을 통해 바로 연락하실 수 있습니다.',
  '<h1>문의하기</h1><p>옥토워커스에 대해 궁금한 점이 있으시면 아래 채널로 연락해 주세요.</p><h2>일반 문의</h2><ul><li><strong>이메일</strong>: hello@octoworkers.com</li><li><strong>GitHub</strong>: <a href="https://github.com/octoworkers">github.com/octoworkers</a></li></ul><h2>기술 지원</h2><ul><li>GitHub Issues에 버그 리포트나 기능 요청을 남겨주세요</li><li>커뮤니티 디스커션에서 다른 사용자들과 소통할 수 있습니다</li></ul><h2>엔터프라이즈</h2><ul><li>전용 지원, 커스텀 개발, 컨설팅이 필요하시면 이메일로 문의해 주세요</li><li>SLA 기반 지원 계약도 가능합니다</li></ul><hr/><p>또는 메인 페이지의 <strong>문의 폼</strong>을 통해 바로 연락하실 수 있습니다.</p>',
  'published',
  datetime('now'),
  datetime('now'),
  datetime('now')
),
(
  'getting-started',
  '시작 가이드',
  '# 옥토워커스 시작 가이드

## 1. 프로젝트 복사

```bash
git clone https://github.com/octoworkers/boilerplate my-saas
cd my-saas
pnpm install
```

## 2. 로컬 환경 설정

```bash
cp worker/.dev.vars.example worker/.dev.vars
# .dev.vars에 시크릿 값 입력
```

## 3. 데이터베이스 초기화

```bash
pnpm --filter @octoworkers/worker db:migrate:local
```

## 4. 개발 서버 실행

```bash
pnpm dev
```

이제 세 개의 서버가 동시에 뜹니다:
- **랜딩**: http://localhost:5173
- **어드민**: http://localhost:5174
- **API**: http://localhost:8787

## 5. 프로젝트명 변경

`package.json` 파일들에서 `octoworkers`를 새 프로젝트명으로 교체하세요.

## 6. Cloudflare 배포

```bash
pnpm deploy:staging   # 스테이징 배포
pnpm deploy:prod      # 프로덕션 배포
```

## 다음 단계

- [주요 기능](/pages/features) 둘러보기
- [요금 안내](/pages/pricing) 확인
- [문의하기](/pages/contact)로 질문하기',
  '<h1>옥토워커스 시작 가이드</h1><h2>1. 프로젝트 복사</h2><pre><code>git clone https://github.com/octoworkers/boilerplate my-saas
cd my-saas
pnpm install</code></pre><h2>2. 로컬 환경 설정</h2><pre><code>cp worker/.dev.vars.example worker/.dev.vars</code></pre><h2>3. 데이터베이스 초기화</h2><pre><code>pnpm --filter @octoworkers/worker db:migrate:local</code></pre><h2>4. 개발 서버 실행</h2><pre><code>pnpm dev</code></pre><p>이제 세 개의 서버가 동시에 뜹니다:</p><ul><li><strong>랜딩</strong>: http://localhost:5173</li><li><strong>어드민</strong>: http://localhost:5174</li><li><strong>API</strong>: http://localhost:8787</li></ul><h2>5. 프로젝트명 변경</h2><p>package.json 파일들에서 octoworkers를 새 프로젝트명으로 교체하세요.</p><h2>6. Cloudflare 배포</h2><pre><code>pnpm deploy:staging
pnpm deploy:prod</code></pre><h2>다음 단계</h2><ul><li>주요 기능 둘러보기</li><li>요금 안내 확인</li><li>문의하기로 질문하기</li></ul>',
  'published',
  datetime('now'),
  datetime('now'),
  datetime('now')
);
