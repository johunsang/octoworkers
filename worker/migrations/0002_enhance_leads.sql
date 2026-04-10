-- Lead CRM Enhancement: status workflow, tags, notes

ALTER TABLE leads ADD COLUMN assigned_to TEXT;
ALTER TABLE leads ADD COLUMN source TEXT DEFAULT 'website';

CREATE TABLE IF NOT EXISTS lead_tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lead_id INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  created_at TEXT NOT NULL,
  UNIQUE(lead_id, tag)
);

CREATE TABLE IF NOT EXISTS lead_notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lead_id INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_by TEXT NOT NULL DEFAULT 'admin',
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_lead_tags_lead_id ON lead_tags(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_notes_lead_id ON lead_notes(lead_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
