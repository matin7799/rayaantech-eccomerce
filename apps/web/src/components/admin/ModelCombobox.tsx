import { AVALAI_ALL_MODELS } from "@rayan-tech/types";
import { CheckIcon, ChevronsUpDownIcon, SearchIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "../../lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

/**
 * Maximum number of results rendered at once. The full AvalAI catalog holds
 * ~2100 models, so we filter in-memory and cap the DOM to keep the popover
 * snappy. Narrowing the search reveals everything.
 */
const MAX_RESULTS = 60;

interface ModelComboboxProps {
  value: string;
  onChange: (value: string) => void;
  /** Optional filter to only show embedding-style models, chat models, etc. */
  filter?: (entry: { value: string; provider: string }) => boolean;
  placeholder?: string;
  id?: string;
}

/**
 * Searchable model selector over the full AvalAI catalog.
 *
 * Replaces the fixed 9-item native <Select> with a fuzzy-searchable combobox
 * so admins can pick any model AvalAI exposes (GPT, Claude, Gemini, DeepSeek,
 * Qwen, Grok, Llama, Mistral, …) by typing part of its name.
 */
export function ModelCombobox({ value, onChange, filter, placeholder, id }: ModelComboboxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the search field as the popover opens for fast keyboard entry.
  useEffect(() => {
    if (open) {
      const t = window.setTimeout(() => inputRef.current?.focus(), 20);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  const pool = useMemo(
    () => (filter ? AVALAI_ALL_MODELS.filter(filter) : AVALAI_ALL_MODELS),
    [filter],
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return pool.slice(0, MAX_RESULTS);
    const matches: typeof pool = [];
    for (const entry of pool) {
      if (entry.value.toLowerCase().includes(q) || entry.provider.toLowerCase().includes(q)) {
        matches.push(entry);
        if (matches.length >= MAX_RESULTS) break;
      }
    }
    return matches;
  }, [pool, query]);

  const totalMatches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return pool.length;
    return pool.filter(
      (e) => e.value.toLowerCase().includes(q) || e.provider.toLowerCase().includes(q),
    ).length;
  }, [pool, query]);

  const handleSelect = (v: string) => {
    onChange(v);
    setOpen(false);
    setQuery("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        id={id}
        className={cn(
          "flex h-10 w-full items-center justify-between gap-2 rounded-lg border border-border bg-surface-secondary px-3 text-sm text-text-primary transition-colors",
          "hover:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent data-[popup-open]:border-accent/60",
        )}
      >
        <span className="truncate font-mono text-xs" dir="ltr">
          {value || placeholder || "انتخاب مدل"}
        </span>
        <ChevronsUpDownIcon className="h-4 w-4 shrink-0 text-text-muted" />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={6}
        className="w-[--anchor-width] min-w-[280px] gap-0 p-0"
      >
        <div className="flex items-center gap-2 border-b border-border px-3 py-2">
          <SearchIcon className="h-3.5 w-3.5 shrink-0 text-text-muted" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجوی مدل... (مثلاً gpt، claude، gemini)"
            className="w-full bg-transparent text-xs text-text-primary placeholder:text-text-muted focus:outline-none"
            dir="ltr"
          />
        </div>
        <div className="max-h-64 overflow-y-auto p-1">
          {results.length === 0 ? (
            <div className="px-3 py-6 text-center text-xs text-text-muted">
              مدلی با این نام یافت نشد
            </div>
          ) : (
            results.map((entry) => {
              const selected = entry.value === value;
              return (
                <button
                  key={entry.value}
                  type="button"
                  onClick={() => handleSelect(entry.value)}
                  className={cn(
                    "flex w-full items-center justify-between gap-2 rounded-md px-2.5 py-1.5 text-start transition-colors",
                    selected
                      ? "bg-accent/15 text-accent"
                      : "text-text-primary hover:bg-surface-secondary",
                  )}
                >
                  <span className="truncate font-mono text-xs" dir="ltr">
                    {entry.value}
                  </span>
                  <span className="flex items-center gap-1.5 shrink-0">
                    <span className="rounded bg-surface-secondary px-1.5 py-0.5 text-[9px] text-text-muted">
                      {entry.provider}
                    </span>
                    {selected && <CheckIcon className="h-3.5 w-3.5 text-accent" />}
                  </span>
                </button>
              );
            })
          )}
        </div>
        {totalMatches > results.length && (
          <div className="border-t border-border px-3 py-1.5 text-center text-[10px] text-text-muted">
            {results.length} از {totalMatches} نتیجه — برای دیدن بقیه دقیق‌تر جستجو کنید
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
