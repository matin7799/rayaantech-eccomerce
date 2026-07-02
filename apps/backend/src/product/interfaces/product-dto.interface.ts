/**
 * DTO for creating a variant attribute value binding.
 */
export interface CreateVariantAttributeDto {
  /** UUID of the attribute_values row to bind */
  valueId: string;
}

/**
 * DTO for creating a product variant (SKU).
 */
export interface CreateProductVariantDto {
  /** Unique SKU identifier (e.g. "RT-IPHONE15-128-BLK") */
  sku: string;
  /** Stock quantity for this variant */
  stock: number;
  /** Price modifier relative to base product price (e.g. "50.00" or "-10.00") */
  priceModifier?: string;
  /** Attribute value bindings (color, size, storage, etc.) */
  attributes: CreateVariantAttributeDto[];
}

/**
 * DTO for creating a product with all relational data.
 * Designed for atomic transactional insertion.
 */
export interface CreateProductDto {
  /** Product display name */
  name: string;
  /** URL-safe slug (must be unique) */
  slug: string;
  /** Full product description (optional) */
  description?: string;
  /** UUID of the primary category */
  primaryCategoryId: string;
  /** UUID of the brand (optional) */
  brandId?: string;
  /** Product condition grade */
  grade?: "open_box" | "stock" | "refurbished" | "like_new" | "used";
  /** Base selling price (decimal string, e.g. "1299000.00") */
  basePrice: string;
  /** Wholesale/bulk price (optional) */
  wholesalePrice?: string;
  /** Torob marketplace price (optional) */
  torobPrice?: string;
  /** Discounted price (optional) */
  discountedPrice?: string;
  /** Campaign/flash-sale price (optional) */
  campaignPrice?: string;
  /** Campaign start timestamp ISO-8601 (optional) */
  campaignStartAt?: string;
  /** Campaign end timestamp ISO-8601 (optional) */
  campaignEndAt?: string;
  /** Base product stock (sum across variants or standalone) */
  stock?: number;
  /** Whether the product is active/visible */
  isActive?: boolean;
  /** UUIDs of secondary category bindings */
  secondaryCategoryIds?: string[];
  /** Nested variant/SKU definitions */
  variants?: CreateProductVariantDto[];
}

/**
 * DTO for updating a product (all fields optional).
 */
export interface UpdateProductDto {
  name?: string;
  slug?: string;
  description?: string | null;
  primaryCategoryId?: string;
  brandId?: string | null;
  grade?: "open_box" | "stock" | "refurbished" | "like_new" | "used";
  basePrice?: string;
  wholesalePrice?: string | null;
  torobPrice?: string | null;
  discountedPrice?: string | null;
  campaignPrice?: string | null;
  campaignStartAt?: string | null;
  campaignEndAt?: string | null;
  stock?: number;
  isActive?: boolean;
}

/**
 * Shape of a product row returned from queries.
 */
export interface ProductRow extends Record<string, unknown> {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  primary_category_id: string;
  brand_id: string | null;
  grade: string;
  base_price: string;
  wholesale_price: string | null;
  torob_price: string | null;
  discounted_price: string | null;
  campaign_price: string | null;
  campaign_start_at: string | null;
  campaign_end_at: string | null;
  stock: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Shape of a variant row returned from queries.
 */
export interface VariantRow extends Record<string, unknown> {
  id: string;
  product_id: string;
  sku: string;
  stock: number;
  price_modifier: string | null;
  created_at: string;
  updated_at: string;
}
