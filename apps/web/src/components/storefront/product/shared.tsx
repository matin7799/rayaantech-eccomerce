import { motion } from "framer-motion";
import { TrendingDown, Users } from "lucide-react";
import { formatRialsPersian } from "../../../lib/persian-numerals";
import { cn } from "../../../lib/utils";

// ─── Pricing Contract Types ────────────────────────────────────────────────
// These mirror the server-emitted `CatalogListItem` shape.
// The client NEVER computes a discount, picks a tier, or applies a markdown.

/**
 * Server-resolved pricing tier.
 */
export type PricingTier = "regular" | "torob" | "wholesale";

/**
 * Server-resolved product data for catalog cards and PDP.
 *
 * INVARIANT: All price values are resolved server-side. The client only
 * reads and displays — no arithmetic on currency, ever.
 */
export interface ProductCardData {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  grade: string;
  stock: number;
  categoryId: string;
  brandId: string | null;
  thumbnailUrl: string | null;
  inStock: boolean;
  /** Server-resolved effective price (integer Rials). */
  effectivePrice: number;
  /** Retail baseline for struck-through rendering (null when no discount). */
  displayBaseline: number | null;
  /** Whole-percent discount (server-computed). */
  discountPercent: number | null;
  /** Which tier won resolution — drives badge rendering. */
  pricingTier: PricingTier;
  /** Whether the product is wishlisted by the current user. */
  isWishlisted?: boolean;
  /**
   * All raw stored price tiers (integer Rials) — present ONLY for staff
   * (admin/operator). Drives the admin-only full-visibility strip.
   */
  adminPrices?: {
    basePrice: number;
    discountedPrice: number | null;
    campaignPrice: number | null;
    torobPrice: number | null;
    wholesalePrice: number | null;
  };
}

// ─── Shared Design Tokens ───────────────────────────────────────────────────

export const GRADE_LABELS: Record<string, string> = {
  open_box: "اوپن‌باکس",
  stock: "استوک",
  refurbished: "ریفربیشد",
  like_new: "در حد نو",
  used: "کارکرده",
};

export const CARD_SPRING = { type: "spring" as const, stiffness: 300, damping: 20 };

// ─── Action Button ──────────────────────────────────────────────────────────

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: (e: React.MouseEvent) => void;
}

export function ActionButton({ icon, label, active, onClick }: ActionButtonProps) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.85 }}
      whileHover={{ scale: 1.1 }}
      onClick={onClick}
      className={cn(
        "flex h-7 w-7 items-center justify-center rounded-lg border border-[--glass-border] bg-[--glass-backdrop] backdrop-blur-md transition-colors",
        active ? "text-danger" : "text-text-secondary hover:text-accent",
      )}
      aria-label={label}
    >
      {icon}
    </motion.button>
  );
}

// ─── Price Display (Cards) ─────────────────────────────────────────────────

interface PriceDisplayProps {
  /** Server-resolved effective price (integer Rials). */
  effectivePrice: number;
  /** Retail baseline for struck-through rendering (null when no discount). */
  displayBaseline: number | null;
  /** Server-computed discount percent. */
  discountPercent: number | null;
  /** Which tier won resolution. */
  pricingTier: PricingTier;
  /** Compact variant for tight card layouts. */
  compact: boolean;
}

/**
 * PriceDisplay — renders the resolved price for catalog cards.
 *
 * INVARIANT: No client-side price calculus. All values are server-provided.
 * The component selects typography and badge purely from `pricingTier`.
 */
export function PriceDisplay({
  effectivePrice,
  displayBaseline,
  discountPercent,
  pricingTier,
  compact,
}: PriceDisplayProps) {
  const hasBaseline = displayBaseline !== null && displayBaseline > effectivePrice;

  return (
    <div className="flex flex-col">
      {hasBaseline && (
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "font-medium text-text-muted line-through",
              compact ? "text-[9px]" : "text-[10px]",
            )}
          >
            {formatRialsPersian(displayBaseline)}
          </span>
          {discountPercent !== null && discountPercent > 0 && (
            <span className="rounded bg-[--color-discount-surface] px-1 py-0.5 text-[8px] font-bold text-[--color-discount-text]">
              {discountPercent}٪-
            </span>
          )}
        </div>
      )}
      <div className="flex items-center gap-1">
        <span className={cn("font-bold text-text-primary", compact ? "text-xs" : "text-sm")}>
          {formatRialsPersian(effectivePrice)}
        </span>
        <span className={cn("text-text-muted", compact ? "text-[8px]" : "text-[10px]")}>تومان</span>
        <PricingTierBadge tier={pricingTier} compact={compact} />
      </div>
    </div>
  );
}

// ─── Pricing Badge ─────────────────────────────────────────────────────────

/**
 * PricingTierBadge — tier indicator shared by cards, table rows, and PDP.
 *
 * Returns `null` for `regular` (no badge for plain retail). The torob tier
 * pulses to draw attention to the time-limited special price; the wholesale
 * tier uses the static `info` (B2B) semantic.
 */
export function PricingTierBadge({ tier, compact }: { tier: PricingTier; compact?: boolean }) {
  if (tier === "regular") return null;

  if (tier === "torob") {
    return (
      <motion.span
        className={cn("rounded px-1 py-0.5 text-[8px] font-semibold", "bg-accent/10 text-accent")}
        animate={{ opacity: [1, 0.7, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        ترب
      </motion.span>
    );
  }

  // tier === "wholesale"
  return (
    <span
      className={cn(
        "rounded px-1 py-0.5 text-[8px] font-semibold",
        "bg-info/10 text-info",
        compact && "text-[7px]",
      )}
    >
      همکار
    </span>
  );
}

// ─── Admin Price Matrix (staff-only full visibility) ───────────────────────

/**
 * AdminPriceMatrix — full-width strip listing every stored price tier.
 *
 * Rendered only when `adminPrices` is present (server attaches it exclusively
 * for admin/operator sessions), so staff can see base/discounted/campaign/
 * torob/wholesale prices at a glance. Missing tiers render as an em dash.
 */
export function AdminPriceMatrix({
  prices,
}: {
  prices: NonNullable<ProductCardData["adminPrices"]>;
}) {
  const tiers: { label: string; value: number | null }[] = [
    { label: "پایه", value: prices.basePrice },
    { label: "تخفیف‌خورده", value: prices.discountedPrice },
    { label: "کمپین", value: prices.campaignPrice },
    { label: "ترب", value: prices.torobPrice },
    { label: "همکار", value: prices.wholesalePrice },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1.5 border-t border-dashed border-[--glass-border]/40 bg-surface/20 px-4 py-2">
      <span className="text-[9px] font-bold text-accent">قیمت‌ها (مدیر):</span>
      {tiers.map((t) => (
        <span
          key={t.label}
          className={cn(
            "rounded-md border px-1.5 py-0.5 text-[9px] font-medium",
            t.value === null
              ? "border-[--glass-border]/40 text-text-muted/50"
              : "border-[--glass-border] text-text-secondary",
          )}
        >
          {t.label}:{" "}
          <span className="font-bold text-text-primary">
            {t.value === null ? "—" : formatRialsPersian(t.value)}
          </span>
        </span>
      ))}
    </div>
  );
}

// ─── Table Price Row (Desktop) ────────────────────────────────────────────

interface TablePriceProps {
  /** Server-resolved effective price. */
  effectivePrice: number;
  /** Retail baseline for struck-through rendering. */
  displayBaseline: number | null;
  /** Server-computed discount percent. */
  discountPercent: number | null;
  /** Which tier won resolution. */
  pricingTier: PricingTier;
}

/**
 * DesktopPriceRow — renders resolved pricing for the hierarchical table.
 *
 * Shows the resolved effective price as the primary, with optional
 * struck-through baseline. Wholesale partners also see a savings indicator.
 */
export function DesktopPriceRow({
  effectivePrice,
  displayBaseline,
  discountPercent,
  pricingTier,
}: TablePriceProps) {
  const hasBaseline = displayBaseline !== null && displayBaseline > effectivePrice;

  return (
    <div className="flex items-center gap-3">
      {/* Primary resolved price */}
      <div className="flex flex-col items-end gap-0.5 rounded-xl border border-[--glass-border] bg-surface/30 px-3.5 py-1.5 min-w-[130px]">
        <span className="text-[10px] font-medium text-text-muted">
          {pricingTier === "wholesale" ? "قیمت همکار" : "قیمت"}
        </span>
        <div className="flex items-center gap-2">
          {hasBaseline && (
            <span className="text-[10px] text-text-muted line-through">
              {formatRialsPersian(displayBaseline)}
            </span>
          )}
          {hasBaseline && discountPercent !== null && discountPercent > 0 && (
            <span className="rounded bg-[--color-discount-surface] px-1 py-0.5 text-[8px] font-bold text-[--color-discount-text]">
              {discountPercent}٪-
            </span>
          )}
          <span className="text-sm font-bold text-text-primary">
            {formatRialsPersian(effectivePrice)}
          </span>
          <span className="text-[9px] font-normal text-text-muted">تومان</span>
        </div>
      </div>

      {/* Wholesale savings indicator */}
      {pricingTier === "wholesale" && hasBaseline && (
        <div className="flex items-center gap-1 rounded-lg bg-info/5 border border-info/20 px-2 py-1">
          <Users className="h-3 w-3 text-info" />
          <span className="text-[10px] font-semibold text-info">{discountPercent}٪ صرفه‌جویی</span>
        </div>
      )}

      {/* Torob animated badge */}
      {pricingTier === "torob" && (
        <div className="flex items-center gap-1 rounded-lg bg-accent/5 border border-accent/20 px-2 py-1">
          <motion.div
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <TrendingDown className="h-3 w-3 text-accent" />
          </motion.div>
          <motion.span
            className="text-[10px] font-semibold text-accent"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            قیمت ویژه ترب
          </motion.span>
        </div>
      )}
    </div>
  );
}

/**
 * MobilePriceStack — compact stacked price for the hierarchical table on mobile.
 */
export function MobilePriceStack({
  effectivePrice,
  displayBaseline,
  discountPercent,
  pricingTier,
}: TablePriceProps) {
  const hasBaseline = displayBaseline !== null && displayBaseline > effectivePrice;

  return (
    <div className="flex flex-col gap-1.5 border-t border-[--glass-border]/50 pt-2.5">
      {/* Primary price */}
      <div className="flex justify-between items-center text-xs">
        <span className="text-[10px] text-text-muted">
          {pricingTier === "wholesale" ? "همکار" : "قیمت"}
        </span>
        <div className="flex items-center gap-1.5">
          {hasBaseline && (
            <span className="text-[9px] text-text-muted line-through">
              {formatRialsPersian(displayBaseline)}
            </span>
          )}
          <span className={cn("font-bold text-text-primary")}>
            {formatRialsPersian(effectivePrice)}{" "}
            <span className="text-[8px] font-normal text-text-muted">تومان</span>
          </span>
        </div>
      </div>

      {/* Wholesale savings */}
      {pricingTier === "wholesale" && hasBaseline && (
        <div className="flex justify-between items-center text-xs text-info border-t border-dashed border-[--glass-border]/30 pt-1.5">
          <span className="text-[10px] flex items-center gap-1 font-medium">
            <Users className="h-2.5 w-2.5" /> صرفه‌جویی
          </span>
          <span className="font-bold">{discountPercent}٪</span>
        </div>
      )}

      {/* Torob badge */}
      {pricingTier === "torob" && (
        <div className="flex justify-between items-center text-xs text-accent border-t border-dashed border-[--glass-border]/30 pt-1.5">
          <span className="text-[10px] flex items-center gap-1 font-medium">
            <TrendingDown className="h-2.5 w-2.5" /> قیمت ویژه ترب
          </span>
        </div>
      )}
    </div>
  );
}
