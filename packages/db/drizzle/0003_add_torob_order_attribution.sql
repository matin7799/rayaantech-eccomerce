-- Migration: Add Torob attribution columns to orders
-- Required by: official Torob Order/Action Tracking APIs (docs/torob/)
-- - torob_clid:     Torob click id captured at landing (?torob_clid=...) and stored at checkout
-- - shipping_amount: order shipping cost (Toman-int semantics, stored as Rials numeric(12,0))
-- - phone_number:   order contact phone (also lives in users.addresses JSONB; denormalized here for the Torob feed)

ALTER TABLE orders ADD COLUMN IF NOT EXISTS torob_clid VARCHAR(64);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_amount NUMERIC(12, 0);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20);

-- Index for the Torob tracking endpoints which filter WHERE torob_clid IS NOT NULL
-- and scan in created_at ASC order. A partial index keeps it small (only attributed orders).
CREATE INDEX IF NOT EXISTS idx_orders_torob_clid
  ON orders (torob_clid, created_at)
  WHERE torob_clid IS NOT NULL;
