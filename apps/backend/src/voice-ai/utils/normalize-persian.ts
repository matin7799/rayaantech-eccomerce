/**
 * Persian/Arabic text normalization utility.
 *
 * CRITICAL NLP INVARIANT: This function MUST be applied to ALL text inputs
 * before embedding generation to ensure consistent vector representations
 * across the product catalog and user queries.
 *
 * Normalization steps:
 * 1. Replace Arabic Kaf (ك U+0643) → Persian Kaf (ک U+06A9)
 * 2. Replace Arabic Yeh (ي U+064A) → Persian Yeh (ی U+06CC)
 * 3. Strip Arabic diacritics/harakat (U+064B through U+065F)
 * 4. Normalize ZWNJ (U+200C) — preserve single instances, remove doubled
 * 5. Condense multiple whitespace characters to single space
 * 6. Trim leading/trailing whitespace
 *
 * This addresses the 5-15% retrieval quality degradation observed
 * when users type with Arabic keyboard variants vs Persian product names.
 */
export function normalizePersianText(text: string): string {
  return (
    text
      // Step 1: Arabic Kaf → Persian Kaf
      .replace(/\u0643/g, "\u06A9")
      // Step 2: Arabic Yeh → Persian Yeh
      .replace(/\u064A/g, "\u06CC")
      // Step 3: Strip Arabic diacritics (fathah, dammah, kasrah, etc.)
      .replace(/[\u064B-\u065F]/g, "")
      // Step 4: Normalize doubled ZWNJ
      .replace(/\u200C{2,}/g, "\u200C")
      // Step 5: Condense whitespace (spaces, tabs, newlines) to single space
      .replace(/\s+/g, " ")
      // Step 6: Trim
      .trim()
  );
}
