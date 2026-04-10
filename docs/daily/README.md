# Daily 기록 규칙

## 구조

```
docs/daily/
├── README.md          # 이 파일
├── 2026-04-08/
│   ├── claude.md      # Claude 에이전트 작업 일지
│   └── codex.md       # Codex 에이전트 작업 일지
└── ...
```

## 규칙

- 날짜 폴더 형식: `YYYY-MM-DD`
- 에이전트별 파일: `claude.md`, `codex.md`
- 작업 중간과 완료 시점에 즉시 누적 갱신한다 (완료 후 한꺼번에 적지 않는다)
- 변경사항 정리가 끝나면 반드시 바로 커밋한다

## 기록 항목

- 수행한 작업 내용
- 변경된 파일 목록
- 구조 변경, 파일 이동/삭제
- 테스트 결과
- 발견된 이슈 및 해결 방법
- 다음 작업 계획

## 예시

```markdown
# 2026-04-08 Claude 작업 일지

## 작업 내역

### 1. CLAUDE.md / AGENTS.md 작업 가이드 작성
- 보일러플레이트 커스터마이징 6단계 가이드 포함
- 아키텍처, API 엔드포인트, 모듈 규칙 상세 문서화
- CLAUDE.md ↔ AGENTS.md 동기화 완료

### 변경 파일
- CLAUDE.md, AGENTS.md
- .claude/*, .codex/*, .agents/*
- _templates/*
```
