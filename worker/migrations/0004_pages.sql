-- Content CMS: pages with markdown support

CREATE TABLE IF NOT EXISTS pages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  content_md TEXT NOT NULL DEFAULT '',
  content_html TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft',
  published_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
CREATE INDEX IF NOT EXISTS idx_pages_status ON pages(status);
