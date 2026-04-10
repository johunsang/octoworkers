CREATE TABLE IF NOT EXISTS site_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  brand TEXT NOT NULL,
  hero_label TEXT NOT NULL,
  hero_title TEXT NOT NULL,
  hero_subtitle TEXT NOT NULL,
  cta_primary TEXT NOT NULL,
  cta_secondary TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS media_assets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  image_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  alt TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  delivery_url TEXT,
  preview_url TEXT,
  uploaded_at TEXT NOT NULL
);

INSERT OR IGNORE INTO site_settings (
  id,
  brand,
  hero_label,
  hero_title,
  hero_subtitle,
  cta_primary,
  cta_secondary,
  updated_at
) VALUES (
  1,
  '옥토워커스',
  'Cloudflare-native SaaS boilerplate',
  'Run landing, admin, API, database, media, and AI behind one edge runtime.',
  'A production-ready starter with Hono, Vite, D1, Cloudflare Images, AI Gateway, and deploy automation built in.',
  'Open admin workspace',
  'Collect first lead',
  CURRENT_TIMESTAMP
);
