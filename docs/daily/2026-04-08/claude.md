# 2026-04-08 Claude 작업 일지

## 작업 내역

### 1. Claude Code 문서 전체 업데이트 (12개 파일)
- `CLAUDE.md` — 프로젝트 개요, 기술 스택, 구조, 명령어
- `.claude/settings.json` — pnpm 권한, wrangler 허용, 원격 D1 차단
- `.claude/commands/` — review, fix-issue, deploy (옥토워커스 특화)
- `.claude/rules/` — code-style, testing, api-conventions
- `.claude/skills/` — deploy, security-review
- `.claude/agents/` — code-reviewer, security-auditor

### 2. Codex 문서 전체 생성 (8개 파일)
- `AGENTS.md` (루트, worker, landing, admin)
- `.codex/config.toml` — sandbox, 시크릿 제외
- `.agents/skills/` — review, deploy, security-review, fix-issue

### 3. Claude ↔ Codex 문서 싱크
- 서브디렉토리 CLAUDE.md 생성 (worker, landing, admin, packages/com)
- 서브디렉토리 AGENTS.md 추가 생성 (packages/com)
- 스킬/커맨드 내용 통일
- 모든 대응 파일 diff 검증 → IDENTICAL

### 4. 템플릿 샘플 소스 생성 (8개 파일)
- `_templates/README.md` — 사용법 가이드
- `_templates/biz-module/worker/` — routes.ts, repository.ts, service.ts
- `_templates/biz-module/admin/` — hooks/useItems.ts, components/ItemPanel.tsx
- `_templates/biz-module/contracts.ts` — 공유 타입 템플릿
- `_templates/biz-module/test.ts` — Vitest 테스트 템플릿
- `_templates/migration/0000_template.sql` — D1 마이그레이션 템플릿

### 5. 마케케 스타일 작업 가이드로 전면 재작성
- 보일러플레이트 커스터마이징 6단계 가이드
- 개발 규칙, 영향분석 규칙
- 아키텍처 다이어그램, API 엔드포인트 전체 목록
- 모듈 규칙, 코드 스타일, 테스트 가이드
- Daily 기록 규칙
- CLAUDE.md ↔ AGENTS.md 동기화 완료

### 변경 파일 전체 목록
```
CLAUDE.md
AGENTS.md
CLAUDE.local.md (기존 유지)
worker/CLAUDE.md (신규)
worker/AGENTS.md (신규)
apps/landing/CLAUDE.md (신규)
apps/landing/AGENTS.md (신규)
apps/admin/CLAUDE.md (신규)
apps/admin/AGENTS.md (신규)
packages/com/CLAUDE.md (신규)
packages/com/AGENTS.md (신규)
.claude/settings.json
.claude/commands/review.md
.claude/commands/fix-issue.md
.claude/commands/deploy.md
.claude/rules/code-style.md
.claude/rules/testing.md
.claude/rules/api-conventions.md
.claude/skills/deploy/SKILL.md
.claude/skills/security-review/SKILL.md
.claude/agents/code-reviewer.md
.claude/agents/security-auditor.md
.codex/config.toml (신규)
.agents/skills/review/SKILL.md (신규)
.agents/skills/deploy/SKILL.md (신규)
.agents/skills/security-review/SKILL.md (신규)
.agents/skills/fix-issue/SKILL.md (신규)
_templates/README.md (신규)
_templates/biz-module/worker/routes.ts (신규)
_templates/biz-module/worker/repository.ts (신규)
_templates/biz-module/worker/service.ts (신규)
_templates/biz-module/admin/hooks/useItems.ts (신규)
_templates/biz-module/admin/components/ItemPanel.tsx (신규)
_templates/biz-module/contracts.ts (신규)
_templates/biz-module/test.ts (신규)
_templates/migration/0000_template.sql (신규)
docs/daily/README.md (신규)
docs/daily/2026-04-08/claude.md (신규)
```
