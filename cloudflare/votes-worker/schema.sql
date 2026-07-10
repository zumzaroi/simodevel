CREATE TABLE IF NOT EXISTS votes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  item_key TEXT NOT NULL,
  device_id TEXT NOT NULL,
  liked INTEGER NOT NULL DEFAULT 0 CHECK (liked IN (0, 1)),
  stars INTEGER NOT NULL DEFAULT 0 CHECK (stars BETWEEN 0 AND 5),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE(item_key, device_id)
);

CREATE INDEX IF NOT EXISTS idx_votes_item_key ON votes(item_key);
