CREATE TABLE IF NOT EXISTS admin_intrusion_log (
  id BIGSERIAL PRIMARY KEY,
  ip TEXT NOT NULL DEFAULT '',
  user_agent TEXT NOT NULL DEFAULT '',
  path TEXT NOT NULL DEFAULT '',
  location JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE admin_intrusion_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access" ON admin_intrusion_log
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can read" ON admin_intrusion_log
  FOR SELECT USING (auth.role() = 'authenticated');
