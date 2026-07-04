-- Migration: Generic runtime settings store (app_settings)
-- Backs admin-editable configuration such as the AvalAI assistant config.
-- A single row per namespace key holds a JSON blob; code falls back to
-- defaults whenever a key is absent.

CREATE TABLE IF NOT EXISTS app_settings (
  key        VARCHAR(128) PRIMARY KEY,
  value      JSON NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
