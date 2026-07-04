import { useNavigate } from "@tanstack/react-router";
import { memo, useCallback, useMemo } from "react";
import { useAIConsultantStore } from "../../lib/store";
import { cn } from "../../lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface LuxuryMarkdownProps {
  /** Raw markdown string from the AI assistant (may be a partial stream chunk). */
  content: string;
  className?: string;
  /**
   * @deprecated Navigation is now handled internally via TanStack Router +
   * Zustand store. This prop is a no-op and will be removed in the next cleanup.
   */
  onProductNavigate?: (slug: string, name: string) => void;
}

type TokenType =
  | "h2"
  | "h3"
  | "bullet"
  | "price"
  | "separator"
  | "table-row"
  | "blank"
  | "text"
  | "product-cta";

interface ParsedToken {
  type: TokenType;
  raw: string;
}

/** Parsed data for a product CTA — both tag formats resolve to this shape. */
interface ProductCtaData {
  slug: string;
  name: string;
}

// ─── Price Pattern ────────────────────────────────────────────────────────────

/** Matches Persian/Arabic numeral price patterns like ۶۴٬۰۰۰٬۰۰۰ تومان */
const PRICE_PATTERN = /[\u06F0-\u06F9\d][\u06F0-\u06F9\d\u066C,.]+\s*(تومان|ریال|تومن)/;

/**
 * Full product_card tag: [product_card: uuid | slug | Product Name]
 * Capture groups: [1]=uuid, [2]=slug, [3]=name (tolerates extra pipe-separated fields appended by the LLM)
 */
const PRODUCT_CARD_REGEX =
  /^\[product_card:\s*([a-f0-9-]+)(?:\s*\|\s*([^|\]]+)\s*\|\s*([^\]]+))?\]$/i;

/**
 * Simpler shorthand: [Product: slug|Display Name]
 * Capture groups: [1]=slug, [2]=name
 */
const PRODUCT_SHORT_REGEX = /^\[Product:\s*([^\]|]+)\|([^\]]+)\]$/i;

// ─── Bold Parser Helper ────────────────────────────────────────────────────────

function renderBoldText(text: string): React.ReactNode {
  const parts = text.split(/\*\*([^*]+)\*\*/g);
  if (parts.length === 1) return text;

  return parts.map((part, i) => {
    if (i % 2 === 1) {
      return (
        // biome-ignore lint/suspicious/noArrayIndexKey: parts derived from stable static split
        <strong key={i} className="font-bold text-amber-400">
          {part}
        </strong>
      );
    }
    return part;
  });
}

// ─── Tag Parsers ──────────────────────────────────────────────────────────────

/**
 * Try to parse either product tag format from a trimmed raw string.
 * Returns null if the string matches neither format.
 */
function tryParseProductCta(trimmed: string): ProductCtaData | null {
  // Full format: [product_card: uuid | slug | Name] or [product_card: uuid | slug | Name | Spec | ...]
  // Group 3 may contain extra pipe-separated spec suffixes appended by the LLM — strip them.
  const fullMatch = trimmed.match(PRODUCT_CARD_REGEX);
  if (fullMatch) {
    const rawName = fullMatch[3]?.trim() ?? "مشاهده محصول";
    // Take only the first segment before any extra pipe in the name field
    const name = rawName.split("|")[0]?.trim() || "مشاهده محصول";
    return {
      slug: fullMatch[2]?.trim() ?? "",
      name,
    };
  }

  // Short format: [Product: slug|Name]
  const shortMatch = trimmed.match(PRODUCT_SHORT_REGEX);
  if (shortMatch) {
    return {
      slug: shortMatch[1]?.trim() ?? "",
      name: shortMatch[2]?.trim() ?? "مشاهده محصول",
    };
  }

  return null;
}

// ─── Line Tokeniser ───────────────────────────────────────────────────────────

function tokeniseBullet(content: string): ParsedToken {
  if (tryParseProductCta(content)) {
    return { type: "product-cta", raw: content };
  }
  if (PRICE_PATTERN.test(content)) {
    return { type: "price", raw: content };
  }
  return { type: "bullet", raw: content };
}

function tokeniseLine(line: string): ParsedToken {
  const trimmed = line.trim();

  if (trimmed.startsWith("## ")) return { type: "h2", raw: trimmed.slice(3) };
  if (trimmed.startsWith("### ")) return { type: "h3", raw: trimmed.slice(4) };
  if (trimmed === "---" || trimmed === "***") return { type: "separator", raw: trimmed };
  if (trimmed === "") return { type: "blank", raw: "" };

  // Table row (must check before bullet)
  if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
    return { type: "table-row", raw: trimmed };
  }

  // Both product tag formats — standalone line
  if (tryParseProductCta(trimmed)) {
    return { type: "product-cta", raw: trimmed };
  }

  // Bullet: - or * followed by a space
  if (/^[-*]\s/.test(trimmed)) {
    const content = trimmed.replace(/^[-*]\s+/, "");
    return tokeniseBullet(content);
  }

  // Standalone price line
  if (PRICE_PATTERN.test(trimmed)) return { type: "price", raw: trimmed };

  return { type: "text", raw: trimmed };
}

// ─── Table Parser ─────────────────────────────────────────────────────────────

function parseTableRows(rows: string[]): { headers: string[]; cells: string[][] } {
  const data = rows.filter((r) => !/^\|[-:\s|]+\|$/.test(r));
  const toColumns = (row: string) =>
    row
      .slice(1, -1)
      .split("|")
      .map((c) => c.trim());

  const [headerRow, ...bodyRows] = data;
  return {
    headers: headerRow ? toColumns(headerRow) : [],
    cells: bodyRows.map(toColumns),
  };
}

// ─── ProductContextButton ─────────────────────────────────────────────────────

/**
 * Self-contained CTA button that reads directly from the Zustand store
 * and navigates via TanStack Router — no prop-drilling required.
 */
function ProductContextButton({ slug, name }: { slug: string; name: string }) {
  const navigate = useNavigate();
  const setActiveProductContextSlug = useAIConsultantStore(
    (state) => state.setActiveProductContextSlug,
  );
  const transitionToProduct = useAIConsultantStore((state) => state.transitionToProduct);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      // 1. Set active product context slug in global store (survives navigation)
      setActiveProductContextSlug(slug);

      // 2. Transition consultation context to the new product (adds ack message, keeps panel open)
      transitionToProduct(slug, name);

      // 3. Smooth client-side navigation via TanStack Router — NO full-page reload
      void navigate({
        to: "/products/$slug",
        params: { slug },
        // biome-ignore lint/suspicious/noExplicitAny: AnyRouter fallback required for route type safety
      } as any);
    },
    [slug, name, navigate, setActiveProductContextSlug, transitionToProduct],
  );

  return (
    <button
      type="button"
      onClick={handleClick}
      className="w-full mt-2 bg-accent/20 hover:bg-accent/40 text-accent border border-accent/30 hover:border-accent/50 backdrop-blur-md py-2 px-4 rounded-xl text-xs font-medium transition-all duration-200 active:scale-[0.98] cursor-pointer text-center block"
    >
      مشاهده و بررسی تخصصی {name}
    </button>
  );
}

// ─── Renderer ─────────────────────────────────────────────────────────────────

function renderTokens(tokens: ParsedToken[]): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let bulletBuffer: string[] = [];
  let tableBuffer: string[] = [];
  let keyCounter = 0;
  const nextKey = () => `lm-${keyCounter++}`;

  const flushBullets = () => {
    if (bulletBuffer.length === 0) return;
    nodes.push(
      <ul
        key={nextKey()}
        className="my-2 space-y-1 rounded-xl border border-[--glass-border] bg-surface/30 p-3 backdrop-blur-md"
      >
        {bulletBuffer.map((item, i) => (
          <li
            // biome-ignore lint/suspicious/noArrayIndexKey: stable static list
            key={i}
            className="flex items-start gap-2 text-xs leading-relaxed text-text-primary"
          >
            <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-300" />
            <span>{renderBoldText(item)}</span>
          </li>
        ))}
      </ul>,
    );
    bulletBuffer = [];
  };

  const flushTable = () => {
    if (tableBuffer.length === 0) return;
    const { headers, cells } = parseTableRows(tableBuffer);
    nodes.push(
      <div
        key={nextKey()}
        className="my-2 overflow-x-auto rounded-xl border border-[--glass-border] bg-surface/40 backdrop-blur-md"
      >
        <table className="w-full text-xs">
          {headers.length > 0 && (
            <thead>
              <tr className="border-b border-[--glass-border]">
                {headers.map((h, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: stable header
                  <th key={i} className="px-3 py-2 text-right font-semibold text-accent">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {cells.map((row, ri) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: stable rows
              <tr key={ri} className="border-b border-[--glass-border]/50 last:border-0">
                {row.map((cell, ci) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: stable cells
                  <td key={ci} className="px-3 py-2 text-right text-text-primary">
                    {renderBoldText(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>,
    );
    tableBuffer = [];
  };

  for (const token of tokens) {
    if (token.type !== "bullet") flushBullets();
    if (token.type !== "table-row") flushTable();

    switch (token.type) {
      case "h2":
        nodes.push(
          <h2
            key={nextKey()}
            className="mt-3 mb-1 bg-linear-to-r from-text-primary to-accent bg-clip-text text-sm font-semibold text-transparent"
          >
            {renderBoldText(token.raw)}
          </h2>,
        );
        break;

      case "h3":
        nodes.push(
          <h3 key={nextKey()} className="mt-2 mb-0.5 text-xs font-semibold text-accent">
            {renderBoldText(token.raw)}
          </h3>,
        );
        break;

      case "separator":
        nodes.push(<hr key={nextKey()} className="my-2 border-[--glass-border] opacity-60" />);
        break;

      case "price":
        nodes.push(
          <span
            key={nextKey()}
            className="my-1 inline-flex items-center rounded-full border border-accent/30 bg-accent/10 px-3 py-0.5 text-xs font-semibold text-accent"
          >
            {renderBoldText(token.raw)}
          </span>,
        );
        break;

      case "bullet":
        bulletBuffer.push(token.raw);
        break;

      case "table-row":
        tableBuffer.push(token.raw);
        break;

      case "product-cta": {
        const ctaData = tryParseProductCta(token.raw);
        if (ctaData && ctaData.slug) {
          nodes.push(
            <div
              key={nextKey()}
              className="my-3 flex flex-col gap-2.5 rounded-xl border border-[--glass-border] bg-surface/40 p-4 backdrop-blur-md"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white truncate max-w-50">
                  {ctaData.name}
                </span>
                <span className="text-[10px] text-text-muted">مشاور خرید رایان‌تک</span>
              </div>
              <ProductContextButton slug={ctaData.slug} name={ctaData.name} />
            </div>,
          );
        }
        break;
      }

      case "blank":
        nodes.push(<div key={nextKey()} className="h-2" aria-hidden="true" />);
        break;

      case "text":
        nodes.push(
          <p key={nextKey()} className="text-xs leading-relaxed text-white">
            {renderBoldText(token.raw)}
          </p>,
        );
        break;
    }
  }

  // Flush any remaining buffers
  flushBullets();
  flushTable();

  return nodes;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * LuxuryMarkdown — Streaming-safe assistant response renderer.
 *
 * Parses the assistant's structured markdown into glassmorphic UI components:
 *  - ## headings         → gradient product titles
 *  - ### headings        → accent section labels
 *  - - bullets           → glassmorphic spec list cards
 *  - price lines         → accent-bordered price chips
 *  - tables              → glassmorphic data tables
 *  - ---                 → separator
 *  - [product_card: ...] → glassmorphic product card with self-navigating CTA button
 *  - [Product: slug|name]→ simplified product CTA (alternative AI output format)
 *
 * Navigation is fully self-contained via TanStack Router + Zustand store.
 * Zero layout shifts during streaming: each re-render only diffs new tail nodes.
 * RTL-safe: the root element is always dir="rtl".
 */
export const LuxuryMarkdown = memo(function LuxuryMarkdown({
  content,
  className,
}: LuxuryMarkdownProps) {
  // Tokens are memoised on content only — no callback dependency required
  const nodes = useMemo(() => {
    if (!content) return [];
    const tokens = content.split("\n").map(tokeniseLine);
    return renderTokens(tokens);
  }, [content]);

  return (
    <div dir="rtl" className={cn("w-full text-white", className)}>
      {nodes}
    </div>
  );
});
