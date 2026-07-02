-- Migration: Add addresses JSONB and pwa_bonus_claimed columns to users table
-- Required by: profile.router.ts (addresses tab + PWA loyalty bonus)

ALTER TABLE users ADD COLUMN IF NOT EXISTS addresses JSONB DEFAULT '[]'::jsonb;
ALTER TABLE users ADD COLUMN IF NOT EXISTS pwa_bonus_claimed BOOLEAN DEFAULT false;
