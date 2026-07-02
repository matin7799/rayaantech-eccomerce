import { Shield } from "lucide-react";
import { useCallback, useMemo } from "react";
import { type CartAddon, useCartStore } from "../../../lib/store";
import { trpc } from "../../../lib/trpc";
import { cn } from "../../../lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";

interface ProductAddonSelectorProps {
  /** Product ID to fetch addons for */
  productId: string;
  /** Variant ID in the cart (for updating addon selections) */
  variantId: string;
  /** Effective product price for percentage-based default addons */
  effectivePrice?: number;
}

/**
 * Format a number as Persian Toman using Intl.NumberFormat.
 * Insulated from Torob pricing — always uses the base effective price.
 */
function formatToman(value: number): string {
  if (value === 0) return "رایگان";
  return `+${new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 0 }).format(value)} تومان`;
}

/**
 * ProductAddonSelector — Warranty tier selector using shadcn/ui Select.
 *
 * Architecture:
 * - Fetches addon groups via tRPC (with effectivePrice for % calculation)
 * - Renders each addon group as a Select dropdown
 * - Each option shows its computed price in Toman via Intl.NumberFormat
 * - Required groups have a pre-selected default (1-month free warranty)
 * - Updates the cart store's selectedAddons reactively on change
 *
 * Pricing Invariant:
 * - effectivePrice is ALWAYS the basePrice pathway (insulated from Torob)
 * - Percentage modifiers compute against this stable base
 */
export function ProductAddonSelector({
  productId,
  variantId,
  effectivePrice,
}: ProductAddonSelectorProps) {
  const { data, isLoading } = trpc.addons.byProductId.useQuery(
    { productId, effectivePrice },
    { staleTime: 5 * 60_000 },
  );

  const items = useCartStore((s) => s.items);
  const updateAddons = useCartStore((s) => s.updateAddons);

  const cartItem = items.find((i) => i.variantId === variantId);
  const currentAddons = cartItem?.selectedAddons ?? [];

  // Map current addon selections by addonId for quick lookup
  const selectedMap = useMemo(
    () => new Map(currentAddons.map((a) => [a.addonId, a])),
    [currentAddons],
  );

  const handleSelect = useCallback(
    (addonId: string, addonName: string, priceAdjustment: number) => {
      // Replace the selection for this addon group
      const newAddons: CartAddon[] = [
        ...currentAddons.filter((a) => a.addonId !== selectedMap.get(addonId)?.addonId),
        { addonId, name: addonName, priceAdjustment },
      ];
      updateAddons(variantId, newAddons);
    },
    [currentAddons, selectedMap, updateAddons, variantId],
  );

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        <div className="h-12 animate-pulse rounded-xl bg-surface-secondary" />
      </div>
    );
  }

  const addons = data?.addons ?? [];
  if (addons.length === 0) return null;

  // Find the currently selected addon ID (or the required/default one)
  const currentSelectedId =
    currentAddons[0]?.addonId ?? addons.find((a) => a.isRequired)?.id ?? addons[0]?.id;

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center gap-2">
        <Shield className="h-4 w-4 text-accent" />
        <h4 className="text-xs font-semibold text-text-primary">انتخاب ضمانت</h4>
      </div>

      <Select
        value={currentSelectedId}
        onValueChange={(value) => {
          const selected = addons.find((a) => a.id === value);
          if (selected) {
            handleSelect(selected.id, selected.name, selected.priceAdjustment);
          }
        }}
      >
        <SelectTrigger
          className={cn(
            "w-full rounded-xl border border-[--glass-border] bg-[--glass-backdrop] px-4 py-4 backdrop-blur-sm",
            "text-xs font-medium text-text-primary",
            "h-auto",
          )}
        >
          <SelectValue placeholder="انتخاب ضمانت...">
            {(() => {
              const selected = addons.find((a) => a.id === currentSelectedId);
              if (!selected) return "انتخاب ضمانت...";
              return `${selected.name} — ${formatToman(selected.priceAdjustment)}`;
            })()}
          </SelectValue>
        </SelectTrigger>

        <SelectContent className="rounded-xl border border-[--glass-border] bg-surface backdrop-blur-xl">
          {addons.map((addon) => (
            <SelectItem
              key={addon.id}
              value={addon.id}
              className="flex items-center justify-between rounded-lg px-3 py-2.5 text-xs"
            >
              <span className="font-medium text-text-primary">{addon.name}</span>
              {addon.isRequired && (
                <span className="mx-1.5 rounded bg-accent/10 px-1 py-0.5 text-[9px] font-bold text-accent">
                  پیش‌فرض
                </span>
              )}
              <span className="ms-auto shrink-0 text-[11px] font-bold text-accent">
                {formatToman(addon.priceAdjustment)}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Show selected warranty price summary */}
      {currentAddons.length > 0 && currentAddons[0].priceAdjustment > 0 && (
        <p className="text-[10px] text-text-muted">
          هزینه ضمانت:{" "}
          <span className="font-semibold text-accent">
            {formatToman(currentAddons[0].priceAdjustment)}
          </span>
        </p>
      )}
    </div>
  );
}
