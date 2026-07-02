-- Migration: Create user_wishlist_items table
-- Stores user product favourites for the Wishlist feature in /profile

CREATE TABLE IF NOT EXISTS user_wishlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT user_wishlist_items_user_product_unique UNIQUE (user_id, product_id)
);

CREATE INDEX IF NOT EXISTS user_wishlist_items_user_idx ON user_wishlist_items (user_id);
CREATE INDEX IF NOT EXISTS user_wishlist_items_product_idx ON user_wishlist_items (product_id);
