-- ━━━ D1 마이그레이션 템플릿 ━━━
-- 복사 후 __items__ 를 실제 테이블명으로 치환하세요.
-- 파일명: 0002_add___items__.sql (순번은 기존 마이그레이션 다음 번호)

CREATE TABLE IF NOT EXISTS __items__ (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    title      TEXT    NOT NULL,
    status     TEXT    NOT NULL DEFAULT 'active',
    created_at TEXT    NOT NULL,
    updated_at TEXT    NOT NULL
);
