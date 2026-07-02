-- Migration: Create installment_metadata table for installment lifecycle tracking
-- Required by: order.router.ts (initiateInstallmentAdvance) + profile installments tab
-- Separates installment lifecycle from order delivery status (Option B architecture)

CREATE TABLE IF NOT EXISTS installment_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Installment lifecycle status (independent of order.status)
  installment_status VARCHAR(50) NOT NULL DEFAULT 'awaiting_cheques'
    CHECK (installment_status IN (
      'awaiting_cheques',
      'cheques_submitted',
      'cheques_received',
      'cheques_verified',
      'product_shipped',
      'completed',
      'cancelled'
    )),

  -- Financial terms (server-calculated, never from client)
  tenure_months INTEGER NOT NULL CHECK (tenure_months > 0),
  down_payment_amount NUMERIC(12, 0) NOT NULL CHECK (down_payment_amount > 0),
  monthly_amount NUMERIC(12, 0) NOT NULL CHECK (monthly_amount > 0),
  total_amount NUMERIC(12, 0) NOT NULL CHECK (total_amount > 0),
  duration_days INTEGER NOT NULL DEFAULT 30 CHECK (duration_days BETWEEN 25 AND 45),

  -- Static receiver/branch metadata (persisted for user reference)
  receiver_name VARCHAR(255) NOT NULL DEFAULT 'علیرضا حاتمی',
  receiver_national_id VARCHAR(10) NOT NULL DEFAULT '4420825766',
  branch_name VARCHAR(255) NOT NULL DEFAULT 'رایان‌تِک - شعبه جوان',
  branch_address TEXT NOT NULL DEFAULT 'بلوار جوان، از میدان عالم به سمت میدان دانش‌آموز، بعد از پل عابر پیاده',
  branch_postal_code VARCHAR(10) NOT NULL DEFAULT '8915743336',
  branch_hours VARCHAR(100) NOT NULL DEFAULT '09:30–13:30 و 17:30–22:00',
  support_phone VARCHAR(20) NOT NULL DEFAULT '09131512790',

  -- Audit timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast user-level queries in profile installments tab
CREATE INDEX IF NOT EXISTS idx_installment_metadata_user_id ON installment_metadata(user_id);

-- Index for order lookup during payment callbacks
CREATE INDEX IF NOT EXISTS idx_installment_metadata_order_id ON installment_metadata(order_id);

-- Trigger for updated_at auto-refresh
CREATE OR REPLACE FUNCTION update_installment_metadata_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_installment_metadata_updated_at
  BEFORE UPDATE ON installment_metadata
  FOR EACH ROW
  EXECUTE FUNCTION update_installment_metadata_updated_at();
