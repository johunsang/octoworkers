-- Email System: templates and send logs

CREATE TABLE IF NOT EXISTS email_templates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  body_html TEXT NOT NULL DEFAULT '',
  body_text TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS email_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lead_id INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  template_id INTEGER REFERENCES email_templates(id) ON DELETE SET NULL,
  subject TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'sent',
  sent_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_email_logs_lead_id ON email_logs(lead_id);
