import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Selected addon in a cart item.
 */
export interface CartAddon {
  addonId: string;
  name: string;
  priceAdjustment: number;
}

/**
 * Cart item representing a product variant in the shopping cart.
 *
 * INVARIANT: Zero Client-Side Calculus
 * - `effectivePrice`: The server-resolved price the buyer pays (integer Rials).
 *   Used for display totals and payment gateway amounts.
 * - `installmentBasePrice`: ALWAYS the retail baseline (integer Rials), never
 *   a torob/wholesale discounted price. Used exclusively for installment
 *   calculations via the tRPC installments.evaluate mutation.
 * - `pricingTier`: Which tier won server-side resolution. Used for badge display.
 * - No `basePrice` or `torobPrice` — those are server-internal.
 */
export interface CartItem {
  /** Product variant UUID */
  variantId: string;
  /** Parent product UUID */
  productId: string;
  /** Product category UUID (for installment override lookups) */
  categoryId: string;
  /** Display name */
  name: string;
  /** Product slug for links */
  slug: string;
  /** SKU identifier */
  sku: string;
  /** Server-resolved price the buyer pays (integer Rials) */
  effectivePrice: number;
  /** Installment-safe retail baseline (integer Rials) — never torob/wholesale */
  installmentBasePrice: number;
  /** Which pricing tier won server-side resolution */
  pricingTier: string;
  /** Available stock quantity — used for client-side inventory guard */
  stock: number;
  /** Quantity in cart */
  quantity: number;
  /** Selected product addons (e.g. warranty, accessories) */
  selectedAddons: CartAddon[];
}

/** Return `value` if it is a finite number, otherwise `fallback`. */
function finiteOr(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

/**
 * Normalize a persisted cart entry into a valid CartItem, or drop it.
 *
 * Guards against legacy/corrupt localStorage data (e.g. carts saved before
 * `effectivePrice` existed). Items missing an unrecoverable required field are
 * dropped; recoverable gaps (missing addons / installment baseline) are healed
 * so a single bad entry can never crash the header-mounted CartDropdown.
 */
function normalizePersistedItem(raw: unknown): CartItem | null {
  if (!raw || typeof raw !== "object") return null;
  const item = raw as Partial<CartItem>;

  if (typeof item.variantId !== "string" || item.variantId.length === 0) return null;
  if (typeof item.effectivePrice !== "number" || !Number.isFinite(item.effectivePrice)) return null;

  const installmentBasePrice = finiteOr(item.installmentBasePrice, item.effectivePrice);
  const rawQuantity = finiteOr(item.quantity, 1);
  const quantity = rawQuantity > 0 ? Math.floor(rawQuantity) : 1;

  return {
    variantId: item.variantId,
    productId: item.productId ?? "",
    categoryId: item.categoryId ?? "",
    name: item.name ?? "",
    slug: item.slug ?? "",
    sku: item.sku ?? "",
    effectivePrice: item.effectivePrice,
    installmentBasePrice,
    pricingTier: item.pricingTier ?? "",
    stock: finiteOr(item.stock, quantity),
    quantity,
    selectedAddons: Array.isArray(item.selectedAddons) ? item.selectedAddons : [],
  };
}

/**
 * Cart store state shape.
 */
interface CartState {
  items: CartItem[];
  /** Add an item or increment quantity if already in cart */
  addItem: (item: Omit<CartItem, "quantity">) => void;
  /** Remove an item entirely */
  removeItem: (variantId: string) => void;
  /** Update quantity for a specific variant */
  updateQuantity: (variantId: string, quantity: number) => void;
  /** Update selected addons for a specific variant */
  updateAddons: (variantId: string, addons: CartAddon[]) => void;
  /** Clear the entire cart */
  clearCart: () => void;
  /** Get the standard display total (effectivePrice + addons) */
  getDisplayTotal: () => number;
  /** Get the installment-safe total (ALWAYS uses installmentBasePrice + addons) */
  getInstallmentTotal: () => number;
  /** Get total item count */
  getItemCount: () => number;
}

/**
 * Persistent cart store with Zustand + localStorage.
 *
 * Key architectural rules:
 * 1. `persist` middleware saves to localStorage key "rt-cart"
 * 2. Installment calculations MUST use getInstallmentTotal() / item.installmentBasePrice
 * 3. Standard checkout totals use getDisplayTotal() (server-resolved effectivePrice)
 * 4. Cart items track both price dimensions for the separation rule
 */
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          const existing = state.items.find((i) => i.variantId === item.variantId);
          if (existing) {
            // Inventory guard: block if would exceed stock
            if (existing.quantity >= (item.stock ?? existing.stock)) {
              toast.error("سقف موجودی انبار", {
                description: `حداکثر ${existing.stock} عدد از این محصول قابل سفارش است.`,
              });
              return state;
            }
            toast.success("به سبد خرید اضافه شد", { description: item.name });
            return {
              items: state.items.map((i) =>
                i.variantId === item.variantId ? { ...i, quantity: i.quantity + 1 } : i,
              ),
            };
          }
          toast.success("به سبد خرید اضافه شد", { description: item.name });
          return { items: [...state.items, { ...item, quantity: 1 }] };
        });
      },

      removeItem: (variantId) => {
        set((state) => ({
          items: state.items.filter((i) => i.variantId !== variantId),
        }));
      },

      updateQuantity: (variantId, quantity) => {
        if (quantity < 1) {
          get().removeItem(variantId);
          return;
        }
        // Inventory guard: block if would exceed stock
        const item = get().items.find((i) => i.variantId === variantId);
        if (item && quantity > item.stock) {
          toast.error("سقف موجودی انبار", {
            description: `حداکثر ${item.stock} عدد از این محصول قابل سفارش است.`,
          });
          return;
        }
        set((state) => ({
          items: state.items.map((i) => (i.variantId === variantId ? { ...i, quantity } : i)),
        }));
      },

      updateAddons: (variantId, addons) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.variantId === variantId ? { ...i, selectedAddons: addons } : i,
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      /**
       * Display total: uses the server-resolved effectivePrice + addons.
       * This is the amount shown at checkout and sent to the payment gateway.
       */
      getDisplayTotal: () => {
        const { items } = get();
        return items.reduce((sum, item) => {
          const addonTotal = item.selectedAddons.reduce((a, addon) => a + addon.priceAdjustment, 0);
          return sum + (item.effectivePrice + addonTotal) * item.quantity;
        }, 0);
      },

      /**
       * Installment total: ALWAYS uses installmentBasePrice + addons.
       * This is the ONLY price source fed to the installment calculator tRPC mutation.
       * NEVER reflects torob/wholesale discounts — those are not credit-evaluable.
       */
      getInstallmentTotal: () => {
        const { items } = get();
        return items.reduce((sum, item) => {
          const addonTotal = item.selectedAddons.reduce((a, addon) => a + addon.priceAdjustment, 0);
          return sum + (item.installmentBasePrice + addonTotal) * item.quantity;
        }, 0);
      },

      getItemCount: () => {
        const { items } = get();
        return items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: "rt-cart",
      version: 1,
      // Only persist the items array, not derived methods
      partialize: (state) => ({ items: state.items }),
      // Sanitize on every rehydrate: drop/heal legacy or corrupt entries so a
      // malformed persisted item can never reach the render path.
      merge: (persisted, current) => {
        const rawItems = (persisted as { items?: unknown } | undefined)?.items;
        const items = Array.isArray(rawItems)
          ? rawItems.map(normalizePersistedItem).filter((item): item is CartItem => item !== null)
          : [];
        return { ...current, items };
      },
    },
  ),
);
