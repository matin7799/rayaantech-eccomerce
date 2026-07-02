import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Clock, Loader2, Search, TrendingUp, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { formatRialsPersian } from "../../../lib/persian-numerals";
import { trpc } from "../../../lib/trpc";
import { cn } from "../../../lib/utils";

const SYSTEM_SPRING = { type: "spring" as const, stiffness: 300, damping: 30 };
const DEBOUNCE_MS = 300;

/** Trending searches — static suggestions for empty state */
const TRENDING_SEARCHES: readonly string[] = [
  "لپ‌تاپ Dell Latitude",
  "مینی پی‌سی HP EliteDesk",
  "مانیتور 27 اینچ",
  "SSD سامسونگ 1 ترابایت",
  "داک استیشن تاندربولت",
];

/** Grade labels for display */
const GRADE_LABELS: Record<string, string> = {
  open_box: "اوپن‌باکس",
  stock: "استوک",
  refurbished: "ریفربیشد",
  like_new: "در حد نو",
  used: "کارکرده",
};

interface PredictiveSearchBarProps {
  /** Compact mode for mobile header */
  compact?: boolean;
}

/**
 * PredictiveSearchBar — Luxury predictive search with real tRPC backend.
 *
 * Features:
 * - 300ms debounced live search via trpc.search.query
 * - Persian/Arabic numeral normalization (backend-side)
 * - Searches across name, SKU, and short_description
 * - Premium glassmorphic dropdown with trending/recent sections
 * - SKU badge + grade + price in result items
 * - Keyboard navigation (Escape to close)
 * - Outside click dismissal
 */
export default function PredictiveSearchBar({ compact = false }: PredictiveSearchBarProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce input — 300ms threshold
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query]);

  // Real tRPC search query (enabled when >= 2 chars)
  const { data, isFetching } = trpc.search.query.useQuery(
    { q: debouncedQuery },
    { enabled: debouncedQuery.length >= 2, staleTime: 10_000 },
  );

  const results = data?.results ?? [];
  const hasTypedQuery = debouncedQuery.length >= 2;
  const showNoResults = hasTypedQuery && results.length === 0 && !isFetching;
  const isDropdownOpen = isFocused && (hasTypedQuery || query.length === 0);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on Escape
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape" && isFocused) {
        setIsFocused(false);
        inputRef.current?.blur();
      }
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isFocused]);

  const handleClear = useCallback(() => {
    setQuery("");
    inputRef.current?.focus();
  }, []);

  const selectSuggestion = useCallback((term: string) => {
    setQuery(term);
    // Trigger debounce immediately
    setDebouncedQuery(term);
  }, []);

  const handleResultClick = useCallback(() => {
    setIsFocused(false);
    setQuery("");
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
        setIsFocused(false);
      }
    },
    [query],
  );

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Search Input */}
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={cn(
            "flex items-center gap-2 rounded-xl border border-border bg-surface-secondary transition-colors duration-300 ease-in-out focus-within:border-accent",
            compact ? "px-3 py-1.5" : "px-3 py-2",
          )}
        >
          {isFetching ? (
            <Loader2
              className={cn(
                "shrink-0 animate-spin text-text-muted",
                compact ? "h-3.5 w-3.5" : "h-4 w-4",
              )}
              aria-hidden="true"
            />
          ) : (
            <Search
              className={cn("shrink-0 text-text-muted", compact ? "h-3.5 w-3.5" : "h-4 w-4")}
              aria-hidden="true"
            />
          )}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="جستجو در محصولات..."
            className={cn(
              "flex-1 bg-transparent font-medium text-text-primary outline-none placeholder:text-text-muted",
              compact ? "text-xs" : "text-sm",
            )}
            aria-label="جستجوی محصولات"
            aria-expanded={isDropdownOpen}
            aria-haspopup="listbox"
            autoComplete="off"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="flex h-5 w-5 items-center justify-center rounded-md text-text-muted transition-colors hover:text-text-primary"
              aria-label="پاک کردن جستجو"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          )}
        </div>
      </form>

      {/* Predictive Dropdown */}
      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={SYSTEM_SPRING}
            className="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-border-light bg-surface-glass shadow-[--shadow-glass] backdrop-blur-xl transition-colors duration-300 ease-in-out"
            role="listbox"
            aria-label="نتایج جستجو"
          >
            <div className="max-h-80 overflow-y-auto p-3">
              {/* ─── Live Results ─────────────────────────────────── */}
              {hasTypedQuery && results.length > 0 && (
                <section className="mb-3">
                  <h4 className="mb-2 px-2 text-xs font-medium text-text-muted">نتایج پیشنهادی</h4>
                  <ul className="flex flex-col gap-1" role="list">
                    {results.map((item) => (
                      <li key={item.id}>
                        <Link
                          to="/products/$slug"
                          params={{ slug: item.slug }}
                          onClick={handleResultClick}
                          className="flex items-center justify-between rounded-lg px-3 py-2.5 no-underline transition-colors duration-200 hover:bg-surface-secondary"
                          role="option"
                        >
                          <div className="flex flex-col gap-0.5">
                            <span className="text-sm font-medium text-text-primary line-clamp-1">
                              {item.name}
                            </span>
                            <div className="flex items-center gap-2">
                              {item.sku && (
                                <span className="rounded bg-accent/10 px-1.5 py-0.5 text-[9px] font-bold text-accent">
                                  {item.sku}
                                </span>
                              )}
                              <span className="text-[10px] text-text-muted">
                                {GRADE_LABELS[item.grade] ?? item.grade}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-0.5">
                            <span className="text-xs font-medium text-accent">
                              {formatRialsPersian(parseInt(item.basePrice, 10))} تومان
                            </span>
                            {!item.inStock && (
                              <span className="rounded bg-danger/10 px-1.5 py-0.5 text-[9px] font-bold text-danger">
                                ناموجود
                              </span>
                            )}
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* No Results */}
              {showNoResults && (
                <p className="px-3 py-6 text-center text-xs text-text-muted">
                  نتیجه‌ای برای «{debouncedQuery}» یافت نشد
                </p>
              )}

              {/* ─── Empty State: Recent + Trending ────────────────── */}
              {!hasTypedQuery && (
                <>
                  {/* Trending Searches */}
                  <section>
                    <h4 className="mb-2 flex items-center gap-1.5 px-2 text-xs font-medium text-text-muted">
                      <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
                      پرطرفدارها
                    </h4>
                    <ul className="flex flex-col gap-0.5" role="list">
                      {TRENDING_SEARCHES.map((term, idx) => (
                        <li key={term}>
                          <button
                            type="button"
                            onClick={() => selectSuggestion(term)}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-start text-sm font-medium text-text-secondary transition-colors hover:bg-surface-secondary hover:text-accent"
                          >
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-accent-light text-[10px] font-semibold text-accent">
                              {idx + 1}
                            </span>
                            {term}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </section>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
