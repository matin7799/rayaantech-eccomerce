-- Migration: In-app admin/operator notifications
-- Backs the NotificationsModule (persist + socket.io push). A shared feed read by
-- any admin/operator; v1 uses a single global is_read flag.

CREATE TABLE IF NOT EXISTS notifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type        VARCHAR(64) NOT NULL,
  title       TEXT NOT NULL,
  body        TEXT NOT NULL,
  order_id    UUID,
  amount      BIGINT,
  metadata    JSON,
  is_read     BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS notifications_is_read_idx ON notifications (is_read);
CREATE INDEX IF NOT EXISTS notifications_created_at_idx ON notifications (created_at);
