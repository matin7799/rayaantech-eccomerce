/**
 * Persian/Arabic numeral mapping utilities.
 *
 * Handles bidirectional conversion between Persian/Arabic digits (۰-۹/٠-٩)
 * and Western digits (0-9) for e-commerce price inputs.
 */

const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
const ARABIC_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

/**
 * Convert any Persian/Arabic digits in a string to Western (0-9).
 * Non-digit characters pass through unchanged.
 */
export function toWesternDigits(input: string): string {
  let result = "";
  for (const char of input) {
    const persianIdx = PERSIAN_DIGITS.indexOf(char);
    if (persianIdx !== -1) {
      result += persianIdx.toString();
      continue;
    }
    const arabicIdx = ARABIC_DIGITS.indexOf(char);
    if (arabicIdx !== -1) {
      result += arabicIdx.toString();
      continue;
    }
    result += char;
  }
  return result;
}

/**
 * Convert Western digits to Persian digits for display.
 */
export function toPersianDigits(input: string): string {
  let result = "";
  for (const char of input) {
    const code = char.charCodeAt(0);
    if (code >= 48 && code <= 57) {
      result += PERSIAN_DIGITS[code - 48];
    } else {
      result += char;
    }
  }
  return result;
}

/**
 * Format an integer number with triple-digit comma separators.
 * e.g. 4500000 → "4,500,000"
 */
export function formatWithCommas(value: number): string {
  return value.toLocaleString("en-US");
}

/**
 * Format a numeric value (Toman) as a Persian-friendly display string.
 * e.g. 4500000 → "۴,۵۰۰,۰۰۰"
 */
export function formatTomansPersian(value: number): string {
  return toPersianDigits(formatWithCommas(value));
}

/**
 * @deprecated Use formatTomansPersian instead. Kept for backwards compatibility.
 */
export function formatRialsPersian(value: number): string {
  return formatTomansPersian(value);
}

/**
 * Strip all non-digit characters from a string.
 * Used to extract the raw integer value from formatted display text.
 */
export function stripNonDigits(input: string): string {
  return toWesternDigits(input).replace(/\D/g, "");
}
