-- AI Development Guide page
INSERT INTO pages (slug, title, content_md, content_html, status, published_at, created_at, updated_at)
VALUES (
  'ai-dev-guide',
  'AI 개발 가이드: Claude Code & Codex',
  '# AI 개발 가이드: Claude Code & Codex

옥토워커스는 AI 에이전트가 코드를 읽고, 수정하고, 배포까지 할 수 있도록 설계되었습니다. 이 가이드는 Claude Code와 OpenAI Codex로 옥토워커스를 개발하는 실전 방법을 다룹니다.

---

## 1. AI 에이전트 문서 구조

옥토워커스는 에이전트가 프로젝트를 이해할 수 있도록 계층적 문서 시스템을 갖추고 있습니다.

### CLAUDE.md / AGENTS.md (루트)

- 프로젝트 전체 구조, 기술 스택, 아키텍처를 설명
- 모든 API 엔드포인트 목록과 모듈 규칙 포함
- Claude Code와 Codex가 자동으로 읽어 컨텍스트 확보
- **두 파일은 항상 동일하게 유지** (양방향 동기화)

### 서브디렉토리 CLAUDE.md

- `worker/CLAUDE.md` — Worker 백엔드 규칙, 바인딩, 시크릿
- `apps/admin/CLAUDE.md` — 어드민 콘솔 구조, 빌드 규칙
- `apps/landing/CLAUDE.md` — 랜딩 페이지 구조, 프록시 설정
- `packages/com/CLAUDE.md` — 공유 타입 패키지 규칙

### 에이전트가 참조하는 핵심 정보

- 3글자 모듈 약어 (aut, led, med, set, pag 등)
- 파일 패턴: `routes.ts`, `repository.ts`, `service.ts`
- 공유 타입 위치: `packages/com/src/contracts.ts`
- 테스트 패턴: `app.request()` + mock 바인딩
- 빌드/배포 명령: `pnpm check`, `pnpm test`, `pnpm build`, `pnpm deploy:prod`

---

## 2. Claude Code 사용법

### 설치 및 시작

```
npm install -g @anthropic-ai/claude-code
cd octoworkers
claude
```

- 프로젝트 루트에서 `claude` 명령 실행
- CLAUDE.md를 자동으로 읽어 프로젝트 컨텍스트 확보
- 터미널에서 대화형으로 코드 작성, 수정, 실행

### 핵심 명령어

- `/help` — 도움말 표시
- `/clear` — 대화 초기화
- `/commit` — 변경사항 커밋
- `/review` — 현재 브랜치 코드 리뷰
- `!command` — 셸 명령 직접 실행 (예: `!pnpm test`)

### 실전 프롬프트 예시

**새 비즈니스 모듈 추가:**

```
리드에 우선순위(priority) 필드를 추가해줘.
DB 마이그레이션, repository, routes, 공유 타입,
어드민 UI까지 전부 수정해줘.
```

**버그 수정:**

```
/api/admin/leads 엔드포인트에서 status 필터가
작동하지 않아. 원인을 찾아서 수정해줘.
```

**기능 개선:**

```
어드민 대시보드에 최근 7일 리드 추이 차트를 추가해줘.
CSS로 구현하고 외부 라이브러리 없이 만들어줘.
```

**배포:**

```
pnpm check, pnpm test, pnpm build 실행해서
문제 없으면 프로덕션 배포해줘.
```

---

## 3. OpenAI Codex 사용법

### 설치 및 시작

```
npm install -g @openai/codex
cd octoworkers
codex
```

- Codex도 AGENTS.md를 자동으로 읽어 컨텍스트 확보
- 옥토워커스는 CLAUDE.md와 AGENTS.md를 항상 동기화하므로 두 에이전트 모두 동일한 정보 참조

### Codex 실행 모드

- **suggest**: 변경 제안만 (기본)
- **auto-edit**: 파일 읽기/쓰기 자동 수행
- **full-auto**: 셸 명령까지 자동 실행

```
codex --approval-mode full-auto "리드 목록에 페이지네이션 추가해줘"
```

### 실전 프롬프트 예시

```
codex "worker/src/biz/led/routes.ts에 페이지네이션 파라미터 추가.
limit과 offset을 쿼리스트링으로 받아서 repository에 전달해줘."
```

```
codex "packages/com/src/contracts.ts에 LeadRecord 타입에
priority 필드를 추가하고, 관련 파일을 모두 업데이트해줘."
```

---

## 4. 효과적인 프롬프트 작성법

### 좋은 프롬프트의 3요소

- **What**: 무엇을 할 것인지 명확하게
- **Where**: 어떤 파일/모듈을 수정할 것인지
- **How**: 어떤 패턴/규칙을 따를 것인지

### 옥토워커스 전용 컨텍스트 키워드

- **"3글자 모듈"** — 에이전트가 `biz/{3글자}/` 패턴을 이해
- **"contracts.ts"** — 공유 타입 수정 필요 시
- **"app.request() 테스트"** — 테스트 추가 요청 시
- **"prepared statement"** — DB 쿼리 보안 패턴 지시
- **"apiFetch 헬퍼"** — 프론트엔드 API 호출 패턴

### 나쁜 프롬프트 vs 좋은 프롬프트

- 나쁜: "리드 기능 개선해줘"
- 좋은: "led 모듈의 리드 목록 API에 status별 필터링을 추가해줘. routes.ts에 쿼리 파라미터, repository.ts에 WHERE 절 추가."

- 나쁜: "테스트 작성해줘"
- 좋은: "worker/test/app.test.ts에 /api/admin/pages POST 엔드포인트 테스트를 추가해줘. createTestEnv() mock과 app.request() 패턴 사용."

---

## 5. AI 에이전트 워크플로우

### 새 기능 개발 플로우

- 1단계: 프롬프트로 요구사항 전달
- 2단계: 에이전트가 CLAUDE.md 읽고 구조 파악
- 3단계: contracts.ts에 공유 타입 추가
- 4단계: worker/src/biz/{모듈}/ 에 백엔드 구현
- 5단계: apps/admin/src/biz/{모듈}/ 에 프론트 구현
- 6단계: worker/test/app.test.ts에 테스트 추가
- 7단계: `pnpm check && pnpm test && pnpm build` 검증
- 8단계: 커밋 및 배포

### 에이전트 협업 규칙

- 변경 후 반드시 `pnpm check`로 타입 검증
- 새 라우트는 `worker/src/index.ts`에 `.route()` 등록
- DB 변경은 `worker/migrations/` 에 SQL 파일 추가
- CLAUDE.md와 AGENTS.md 변경 시 양쪽 동기화

---

## 6. CLAUDE.md 작성 가이드

### 새 프로젝트에 CLAUDE.md 만들기

프로젝트 루트에 CLAUDE.md를 만들면 Claude Code가 자동으로 읽습니다.

```
# 프로젝트명 — 에이전트 가이드

## 프로젝트 구조
- 폴더 구조와 역할 설명

## 기술 스택
- 사용 기술 나열

## 개발 규칙
- 코딩 컨벤션, 파일 패턴

## 실행 방법
- 개발/빌드/배포 명령어

## API 엔드포인트
- 엔드포인트 목록과 설명
```

### 효과적인 CLAUDE.md 팁

- 에이전트가 판단할 수 있도록 "왜" 그 규칙인지 설명
- 파일 패턴과 명명 규칙을 명시적으로 작성
- 자주 실수하는 부분을 경고로 표시
- 서브디렉토리에 추가 CLAUDE.md로 세부 규칙 분리
- "이 규칙을 읽지 않고 개발을 진행하면 안 된다" 같은 강조 문구 사용

---

## 7. 자동화 슬래시 커맨드

### Claude Code 커스텀 명령

옥토워커스에는 프로젝트 전용 슬래시 커맨드가 설정되어 있습니다.

- `/commit` — 변경사항 분석 후 자동 커밋
- `/review` — `git diff main...HEAD` 기반 코드 리뷰
- `/deploy` — 빌드 검증 후 staging/production 배포
- `/scaffold` — 새 프로젝트를 보일러플레이트에서 생성
- `/fix-issue` — 이슈 번호로 버그 수정

### 사용 예시

```
/deploy staging
/scaffold my-new-saas
/fix-issue 42
/review
```

---

## 8. 멀티 에이전트 전략

### Claude Code + Codex 병행

- **Claude Code**: 복잡한 아키텍처 설계, 코드 리뷰, 배포
- **Codex**: 반복적 코드 생성, 리팩토링, 테스트 작성

### 작업 분배 예시

- Claude Code: "이메일 모듈 전체 아키텍처를 설계해줘"
- Codex: "설계된 이메일 모듈의 repository.ts CRUD 쿼리를 작성해줘"
- Claude Code: "전체 코드 리뷰하고 보안 이슈 확인해줘"
- Codex: "리뷰에서 지적된 SQL 인젝션 취약점을 prepared statement로 수정해줘"

---

## 요약

- **CLAUDE.md/AGENTS.md**는 AI 에이전트의 프로젝트 이해 핵심 문서
- **Claude Code**: `claude` 명령으로 대화형 개발, 슬래시 커맨드로 자동화
- **Codex**: `codex` 명령으로 코드 생성, full-auto 모드로 자동 실행
- **효과적인 프롬프트**: What + Where + How를 구체적으로 전달
- **워크플로우**: 타입 → 백엔드 → 프론트 → 테스트 → 검증 → 배포
- **문서 유지**: 코드 변경 시 CLAUDE.md와 AGENTS.md 즉시 동기화',

  '<h1>AI 개발 가이드: Claude Code &amp; Codex</h1>
<p>옥토워커스는 AI 에이전트가 코드를 읽고, 수정하고, 배포까지 할 수 있도록 설계되었습니다. 이 가이드는 Claude Code와 OpenAI Codex로 옥토워커스를 개발하는 실전 방법을 다룹니다.</p>

<hr />

<h2>1. AI 에이전트 문서 구조</h2>
<p>옥토워커스는 에이전트가 프로젝트를 이해할 수 있도록 계층적 문서 시스템을 갖추고 있습니다.</p>

<h3>CLAUDE.md / AGENTS.md (루트)</h3>
<ul><li>프로젝트 전체 구조, 기술 스택, 아키텍처를 설명</li>
<li>모든 API 엔드포인트 목록과 모듈 규칙 포함</li>
<li>Claude Code와 Codex가 자동으로 읽어 컨텍스트 확보</li>
<li><strong>두 파일은 항상 동일하게 유지</strong> (양방향 동기화)</li></ul>

<h3>서브디렉토리 CLAUDE.md</h3>
<ul><li><code>worker/CLAUDE.md</code> — Worker 백엔드 규칙, 바인딩, 시크릿</li>
<li><code>apps/admin/CLAUDE.md</code> — 어드민 콘솔 구조, 빌드 규칙</li>
<li><code>apps/landing/CLAUDE.md</code> — 랜딩 페이지 구조, 프록시 설정</li>
<li><code>packages/com/CLAUDE.md</code> — 공유 타입 패키지 규칙</li></ul>

<h3>에이전트가 참조하는 핵심 정보</h3>
<ul><li>3글자 모듈 약어 (aut, led, med, set, pag 등)</li>
<li>파일 패턴: <code>routes.ts</code>, <code>repository.ts</code>, <code>service.ts</code></li>
<li>공유 타입 위치: <code>packages/com/src/contracts.ts</code></li>
<li>테스트 패턴: <code>app.request()</code> + mock 바인딩</li>
<li>빌드/배포 명령: <code>pnpm check</code>, <code>pnpm test</code>, <code>pnpm build</code>, <code>pnpm deploy:prod</code></li></ul>

<hr />

<h2>2. Claude Code 사용법</h2>

<h3>설치 및 시작</h3>
<pre><code>npm install -g @anthropic-ai/claude-code
cd octoworkers
claude</code></pre>
<ul><li>프로젝트 루트에서 <code>claude</code> 명령 실행</li>
<li>CLAUDE.md를 자동으로 읽어 프로젝트 컨텍스트 확보</li>
<li>터미널에서 대화형으로 코드 작성, 수정, 실행</li></ul>

<h3>핵심 명령어</h3>
<ul><li><code>/help</code> — 도움말 표시</li>
<li><code>/clear</code> — 대화 초기화</li>
<li><code>/commit</code> — 변경사항 커밋</li>
<li><code>/review</code> — 현재 브랜치 코드 리뷰</li>
<li><code>!command</code> — 셸 명령 직접 실행 (예: <code>!pnpm test</code>)</li></ul>

<h3>실전 프롬프트 예시</h3>
<p><strong>새 비즈니스 모듈 추가:</strong></p>
<pre><code>리드에 우선순위(priority) 필드를 추가해줘.
DB 마이그레이션, repository, routes, 공유 타입,
어드민 UI까지 전부 수정해줘.</code></pre>

<p><strong>버그 수정:</strong></p>
<pre><code>/api/admin/leads 엔드포인트에서 status 필터가
작동하지 않아. 원인을 찾아서 수정해줘.</code></pre>

<p><strong>기능 개선:</strong></p>
<pre><code>어드민 대시보드에 최근 7일 리드 추이 차트를 추가해줘.
CSS로 구현하고 외부 라이브러리 없이 만들어줘.</code></pre>

<p><strong>배포:</strong></p>
<pre><code>pnpm check, pnpm test, pnpm build 실행해서
문제 없으면 프로덕션 배포해줘.</code></pre>

<hr />

<h2>3. OpenAI Codex 사용법</h2>

<h3>설치 및 시작</h3>
<pre><code>npm install -g @openai/codex
cd octoworkers
codex</code></pre>
<ul><li>Codex도 AGENTS.md를 자동으로 읽어 컨텍스트 확보</li>
<li>옥토워커스는 CLAUDE.md와 AGENTS.md를 항상 동기화하므로 두 에이전트 모두 동일한 정보 참조</li></ul>

<h3>Codex 실행 모드</h3>
<ul><li><strong>suggest</strong>: 변경 제안만 (기본)</li>
<li><strong>auto-edit</strong>: 파일 읽기/쓰기 자동 수행</li>
<li><strong>full-auto</strong>: 셸 명령까지 자동 실행</li></ul>
<pre><code>codex --approval-mode full-auto "리드 목록에 페이지네이션 추가해줘"</code></pre>

<h3>실전 프롬프트 예시</h3>
<pre><code>codex "worker/src/biz/led/routes.ts에 페이지네이션 파라미터 추가.
limit과 offset을 쿼리스트링으로 받아서 repository에 전달해줘."</code></pre>
<pre><code>codex "packages/com/src/contracts.ts에 LeadRecord 타입에
priority 필드를 추가하고, 관련 파일을 모두 업데이트해줘."</code></pre>

<hr />

<h2>4. 효과적인 프롬프트 작성법</h2>

<h3>좋은 프롬프트의 3요소</h3>
<ul><li><strong>What</strong>: 무엇을 할 것인지 명확하게</li>
<li><strong>Where</strong>: 어떤 파일/모듈을 수정할 것인지</li>
<li><strong>How</strong>: 어떤 패턴/규칙을 따를 것인지</li></ul>

<h3>옥토워커스 전용 컨텍스트 키워드</h3>
<ul><li><strong>&quot;3글자 모듈&quot;</strong> — 에이전트가 <code>biz/{3글자}/</code> 패턴을 이해</li>
<li><strong>&quot;contracts.ts&quot;</strong> — 공유 타입 수정 필요 시</li>
<li><strong>&quot;app.request() 테스트&quot;</strong> — 테스트 추가 요청 시</li>
<li><strong>&quot;prepared statement&quot;</strong> — DB 쿼리 보안 패턴 지시</li>
<li><strong>&quot;apiFetch 헬퍼&quot;</strong> — 프론트엔드 API 호출 패턴</li></ul>

<h3>나쁜 프롬프트 vs 좋은 프롬프트</h3>
<ul><li>나쁜: &quot;리드 기능 개선해줘&quot;</li>
<li>좋은: &quot;led 모듈의 리드 목록 API에 status별 필터링을 추가해줘. routes.ts에 쿼리 파라미터, repository.ts에 WHERE 절 추가.&quot;</li></ul>
<ul><li>나쁜: &quot;테스트 작성해줘&quot;</li>
<li>좋은: &quot;worker/test/app.test.ts에 /api/admin/pages POST 엔드포인트 테스트를 추가해줘. createTestEnv() mock과 app.request() 패턴 사용.&quot;</li></ul>

<hr />

<h2>5. AI 에이전트 워크플로우</h2>

<h3>새 기능 개발 플로우</h3>
<ul><li>1단계: 프롬프트로 요구사항 전달</li>
<li>2단계: 에이전트가 CLAUDE.md 읽고 구조 파악</li>
<li>3단계: contracts.ts에 공유 타입 추가</li>
<li>4단계: worker/src/biz/{모듈}/ 에 백엔드 구현</li>
<li>5단계: apps/admin/src/biz/{모듈}/ 에 프론트 구현</li>
<li>6단계: worker/test/app.test.ts에 테스트 추가</li>
<li>7단계: <code>pnpm check &amp;&amp; pnpm test &amp;&amp; pnpm build</code> 검증</li>
<li>8단계: 커밋 및 배포</li></ul>

<h3>에이전트 협업 규칙</h3>
<ul><li>변경 후 반드시 <code>pnpm check</code>로 타입 검증</li>
<li>새 라우트는 <code>worker/src/index.ts</code>에 <code>.route()</code> 등록</li>
<li>DB 변경은 <code>worker/migrations/</code> 에 SQL 파일 추가</li>
<li>CLAUDE.md와 AGENTS.md 변경 시 양쪽 동기화</li></ul>

<hr />

<h2>6. CLAUDE.md 작성 가이드</h2>

<h3>새 프로젝트에 CLAUDE.md 만들기</h3>
<p>프로젝트 루트에 CLAUDE.md를 만들면 Claude Code가 자동으로 읽습니다.</p>
<pre><code># 프로젝트명 — 에이전트 가이드

## 프로젝트 구조
- 폴더 구조와 역할 설명

## 기술 스택
- 사용 기술 나열

## 개발 규칙
- 코딩 컨벤션, 파일 패턴

## 실행 방법
- 개발/빌드/배포 명령어

## API 엔드포인트
- 엔드포인트 목록과 설명</code></pre>

<h3>효과적인 CLAUDE.md 팁</h3>
<ul><li>에이전트가 판단할 수 있도록 &quot;왜&quot; 그 규칙인지 설명</li>
<li>파일 패턴과 명명 규칙을 명시적으로 작성</li>
<li>자주 실수하는 부분을 경고로 표시</li>
<li>서브디렉토리에 추가 CLAUDE.md로 세부 규칙 분리</li>
<li>&quot;이 규칙을 읽지 않고 개발을 진행하면 안 된다&quot; 같은 강조 문구 사용</li></ul>

<hr />

<h2>7. 자동화 슬래시 커맨드</h2>

<h3>Claude Code 커스텀 명령</h3>
<p>옥토워커스에는 프로젝트 전용 슬래시 커맨드가 설정되어 있습니다.</p>
<ul><li><code>/commit</code> — 변경사항 분석 후 자동 커밋</li>
<li><code>/review</code> — <code>git diff main...HEAD</code> 기반 코드 리뷰</li>
<li><code>/deploy</code> — 빌드 검증 후 staging/production 배포</li>
<li><code>/scaffold</code> — 새 프로젝트를 보일러플레이트에서 생성</li>
<li><code>/fix-issue</code> — 이슈 번호로 버그 수정</li></ul>

<h3>사용 예시</h3>
<pre><code>/deploy staging
/scaffold my-new-saas
/fix-issue 42
/review</code></pre>

<hr />

<h2>8. 멀티 에이전트 전략</h2>

<h3>Claude Code + Codex 병행</h3>
<ul><li><strong>Claude Code</strong>: 복잡한 아키텍처 설계, 코드 리뷰, 배포</li>
<li><strong>Codex</strong>: 반복적 코드 생성, 리팩토링, 테스트 작성</li></ul>

<h3>작업 분배 예시</h3>
<ul><li>Claude Code: &quot;이메일 모듈 전체 아키텍처를 설계해줘&quot;</li>
<li>Codex: &quot;설계된 이메일 모듈의 repository.ts CRUD 쿼리를 작성해줘&quot;</li>
<li>Claude Code: &quot;전체 코드 리뷰하고 보안 이슈 확인해줘&quot;</li>
<li>Codex: &quot;리뷰에서 지적된 SQL 인젝션 취약점을 prepared statement로 수정해줘&quot;</li></ul>

<hr />

<h2>요약</h2>
<ul><li><strong>CLAUDE.md/AGENTS.md</strong>는 AI 에이전트의 프로젝트 이해 핵심 문서</li>
<li><strong>Claude Code</strong>: <code>claude</code> 명령으로 대화형 개발, 슬래시 커맨드로 자동화</li>
<li><strong>Codex</strong>: <code>codex</code> 명령으로 코드 생성, full-auto 모드로 자동 실행</li>
<li><strong>효과적인 프롬프트</strong>: What + Where + How를 구체적으로 전달</li>
<li><strong>워크플로우</strong>: 타입 → 백엔드 → 프론트 → 테스트 → 검증 → 배포</li>
<li><strong>문서 유지</strong>: 코드 변경 시 CLAUDE.md와 AGENTS.md 즉시 동기화</li></ul>',

  'published',
  datetime('now'),
  datetime('now'),
  datetime('now')
);
