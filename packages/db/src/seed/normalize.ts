/**
 * Data normalization utilities for catalog ingestion.
 *
 * CURRENCY INVARIANT: All prices are stored as integer Tomans.
 * Floating-point arithmetic on currency is banned.
 */

const VALID_GRADES = ["open_box", "stock", "refurbished", "like_new", "used"];
const DEFAULT_GRADE = "stock";

/**
 * Normalize any price value to integer Tomans.
 * Strips commas, spaces, non-numeric chars. Truncates decimals.
 * Returns 0 if input is falsy or unparseable.
 */
export function normalizePriceTomans(raw: string | number | undefined | null): number {
  if (raw === undefined || raw === null || raw === "") return 0;

  const str = String(raw)
    .replace(/,/g, "")
    .replace(/\s/g, "")
    .replace(/[^\d.]/g, "");

  if (str === "") return 0;

  const num = Math.trunc(Number(str));
  return Number.isNaN(num) || num < 0 ? 0 : num;
}

/**
 * Map a legacy grade string to a valid enum value.
 * Returns DEFAULT_GRADE ('stock') if unrecognized or missing.
 */
export function normalizeGrade(raw: string | undefined | null): string {
  if (!raw) return DEFAULT_GRADE;
  const lower = raw.toLowerCase().replace(/[^a-z_]/g, "");
  return VALID_GRADES.includes(lower) ? lower : DEFAULT_GRADE;
}

/**
 * Generate a URL-safe slug from a product/category name.
 * Supports Persian characters in the slug.
 */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\u0600-\u06FFa-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 500);
}

/**
 * Determine if a product is on sale.
 * Only true when salePrice is a positive integer AND strictly less than basePrice.
 */
export function isOnSale(basePrice: number, salePrice: number): boolean {
  return salePrice > 0 && salePrice < basePrice;
}

/**
 * Normalize a grade from legacy naming conventions.
 */
export { DEFAULT_GRADE, VALID_GRADES };
