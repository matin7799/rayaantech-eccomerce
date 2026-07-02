/**
 * Filter utility helpers for comma-separated URL search params.
 *
 * All multi-select filters (category, brand, attrs) use comma-separated
 * strings in the URL as the single source of truth.
 */

/**
 * Parse a comma-separated filter string into an array of slugs/IDs.
 * Returns empty array if input is undefined or empty.
 */
export function parseFilterString(str: string | undefined): string[] {
  if (!str) return [];
  return str.split(",").filter(Boolean);
}

/**
 * Toggle a value in a comma-separated filter string.
 * If the value exists, remove it. If not, add it.
 * Returns undefined if the result is empty (removes param from URL).
 */
export function toggleFilterValue(current: string | undefined, value: string): string | undefined {
  const values = parseFilterString(current);
  const idx = values.indexOf(value);
  if (idx >= 0) {
    values.splice(idx, 1);
  } else {
    values.push(value);
  }
  return values.length > 0 ? values.join(",") : undefined;
}

/**
 * Check if a value is present in a comma-separated filter string.
 */
export function isFilterActive(current: string | undefined, value: string): boolean {
  return parseFilterString(current).includes(value);
}
