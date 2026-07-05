import { sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { z } from "zod";
import { publicProcedure, router } from "../trpc.init";

/**
 * Flattened addon option row: product_addon_options joined to its parent
 * product_addons group (see packages/db/src/schema/product-addons.ts).
 */
interface AddonOptionRow extends Record<string, unknown> {
  id: string;
  product_id: string;
  name: string;
  price_modifier_type: "percentage" | "fixed";
  price_modifier_value: string;
  is_default: boolean;
  group_id: string;
  group_name: string;
  group_required: boolean;
}

/**
 * Global addon defaults row (admin-configurable warranty presets).
 * NOTE: the modifier-type column is named `price_modifier_type_gad` in the DB.
 */
interface GlobalAddonDefaultRow extends Record<string, unknown> {
  id: string;
  name: string;
  price_modifier_type_gad: "percentage" | "fixed";
  price_modifier_value: string;
  is_default: boolean;
  is_required: boolean;
}

/**
 * Default warranty addon tiers.
 *
 * When a product has NO custom addon options AND global_addon_defaults is
 * empty, the router returns these 3 immutable default warranty options.
 *
 * Addon 1: "ضمانت ۱ ماهه رایان تک" — Free (+0)
 * Addon 2: "ضمانت ۶ ماهه رایان تک" — +7% of effective price
 * Addon 3: "ضمانت ۱ ساله رایان تک" — +10% of effective price
 */
interface DefaultAddonConfig {
  id: string;
  name: string;
  /** Percentage of effective price (0 = free) */
  percentModifier: number;
  isRequired: boolean;
}

const DEFAULT_ADDON_TIERS: DefaultAddonConfig[] = [
  {
    id: "default-warranty-1m",
    name: "ضمانت ۱ ماهه رایان تک",
    percentModifier: 0,
    isRequired: true,
  },
  {
    id: "default-warranty-6m",
    name: "ضمانت ۶ ماهه رایان تک",
    percentModifier: 7,
    isRequired: false,
  },
  {
    id: "default-warranty-12m",
    name: "ضمانت ۱ ساله رایان تک",
    percentModifier: 10,
    isRequired: false,
  },
];

/**
 * Compute the absolute Toman adjustment for a price modifier.
 * - 'percentage': ceil(effectivePrice × value / 100)
 * - 'fixed':      the value itself (rounded to integer Tomans)
 */
function computeAdjustment(
  type: "percentage" | "fixed",
  value: string,
  effectivePrice: number,
): number {
  const parsed = Number.parseFloat(value);
  if (!Number.isFinite(parsed)) return 0;
  return type === "percentage" ? Math.ceil((effectivePrice * parsed) / 100) : Math.round(parsed);
}

/**
 * Load active addon options (joined to their active parent groups) for a product.
 */
async function loadProductAddonOptions(
  db: NodePgDatabase,
  productId: string,
): Promise<AddonOptionRow[]> {
  const result = await db.execute<AddonOptionRow>(sql`
    SELECT
      o.id,
      a.product_id,
      o.name,
      o.price_modifier_type,
      o.price_modifier_value,
      o.is_default,
      a.id AS group_id,
      a.name AS group_name,
      a.is_required AS group_required
    FROM product_addon_options o
    JOIN product_addons a ON a.id = o.addon_id
    WHERE a.product_id = ${productId}
      AND a.is_active = true
      AND o.is_active = true
    ORDER BY a.display_order ASC, o.display_order ASC
  `);
  return result.rows;
}

/**
 * Addons tRPC router.
 * Provides addon listing per product with automatic default warranty fallback.
 */
export function createAddonsRouter(db: NodePgDatabase) {
  return router({
    /**
     * List all active addon options for a product as a flat list
     * ({ id, productId, name, priceAdjustment, isRequired }).
     *
     * Strategy:
     * 1. Query product_addon_options (joined to product_addons groups)
     * 2. If none exist, fall back to global_addon_defaults (admin-managed)
     * 3. If global_addon_defaults is empty, use hardcoded DEFAULT_ADDON_TIERS
     *
     * The effectivePrice param allows percentage-based addons to compute
     * their absolute price adjustment.
     *
     * Contract note: `isRequired` marks the pre-selected/default option — the
     * PDP selector (ProductAddonSelector) uses it to pick the initial value
     * and render the "پیش‌فرض" badge.
     */
    byProductId: publicProcedure
      .input(
        z.object({
          productId: z.string().uuid(),
          effectivePrice: z.number().int().min(0).optional(),
        }),
      )
      .query(async ({ input }) => {
        const effectivePrice = input.effectivePrice ?? 0;

        // 1. Check for custom product-specific addon options
        const customOptions = await loadProductAddonOptions(db, input.productId);

        if (customOptions.length > 0) {
          return {
            addons: customOptions.map((row) => ({
              id: row.id,
              productId: row.product_id,
              name: row.name,
              priceAdjustment: computeAdjustment(
                row.price_modifier_type,
                row.price_modifier_value,
                effectivePrice,
              ),
              isRequired: row.is_default,
            })),
          };
        }

        // 2. No custom addons — try global_addon_defaults table
        const globalResult = await db.execute<GlobalAddonDefaultRow>(sql`
          SELECT id, name, price_modifier_type_gad, price_modifier_value, is_default, is_required
          FROM global_addon_defaults
          WHERE is_active = true
          ORDER BY display_order ASC, price_modifier_value ASC
        `);

        if (globalResult.rows.length > 0) {
          return {
            addons: globalResult.rows.map((row) => ({
              id: row.id,
              productId: input.productId,
              name: row.name,
              priceAdjustment: computeAdjustment(
                row.price_modifier_type_gad,
                row.price_modifier_value,
                effectivePrice,
              ),
              isRequired: row.is_required || row.is_default,
            })),
          };
        }

        // 3. Hardcoded fallback tiers
        return {
          addons: DEFAULT_ADDON_TIERS.map((tier) => ({
            id: tier.id,
            productId: input.productId,
            name: tier.name,
            priceAdjustment: Math.ceil(effectivePrice * (tier.percentModifier / 100)),
            isRequired: tier.isRequired,
          })),
        };
      }),

    /**
     * Validate addon option selections for checkout.
     *
     * Rules:
     * - Every selected ID must be an active option of this product.
     * - Every required addon group must have exactly one selected option;
     *   if none is selected, the group's default option is auto-included,
     *   and groups with no default are reported in missingRequired.
     */
    validateSelection: publicProcedure
      .input(
        z.object({
          productId: z.string().uuid(),
          selectedAddonIds: z.array(z.string().uuid()),
          effectivePrice: z.number().int().min(0).optional(),
        }),
      )
      .query(async ({ input }) => {
        const effectivePrice = input.effectivePrice ?? 0;
        const allOptions = await loadProductAddonOptions(db, input.productId);

        const validOptionIds = new Set(allOptions.map((o) => o.id));
        const invalidSelections = input.selectedAddonIds.filter((id) => !validOptionIds.has(id));
        const selectedSet = new Set(input.selectedAddonIds.filter((id) => validOptionIds.has(id)));

        // Required groups with no selected option: auto-include their default
        // option; groups without a default are reported as missing.
        const missingRequired: Array<{ id: string; name: string }> = [];
        const requiredGroupIds = new Set(
          allOptions.filter((o) => o.group_required).map((o) => o.group_id),
        );
        for (const groupId of requiredGroupIds) {
          const groupOptions = allOptions.filter((o) => o.group_id === groupId);
          if (groupOptions.some((o) => selectedSet.has(o.id))) continue;

          const defaultOption = groupOptions.find((o) => o.is_default);
          if (defaultOption) {
            selectedSet.add(defaultOption.id);
          } else {
            missingRequired.push({ id: groupId, name: groupOptions[0].group_name });
          }
        }

        const validatedAddons = allOptions
          .filter((o) => selectedSet.has(o.id))
          .map((o) => ({
            id: o.id,
            name: o.name,
            priceAdjustment: computeAdjustment(
              o.price_modifier_type,
              o.price_modifier_value,
              effectivePrice,
            ),
            isRequired: o.group_required,
          }));

        const totalAdjustment = validatedAddons.reduce((sum, a) => sum + a.priceAdjustment, 0);

        return {
          validatedAddons,
          totalAdjustment,
          missingRequired,
          invalidSelections,
          isValid: missingRequired.length === 0 && invalidSelections.length === 0,
        };
      }),
  });
}

export type AddonsRouter = ReturnType<typeof createAddonsRouter>;
