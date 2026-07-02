import { sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { z } from "zod";
import { publicProcedure, router } from "../trpc.init";

/**
 * Addon row shape from the database.
 */
interface AddonRow extends Record<string, unknown> {
  id: string;
  product_id: string;
  name: string;
  price_adjustment: string;
  is_required: boolean;
  is_active: boolean;
}

/**
 * Default warranty addon tiers.
 *
 * When a product has NO custom addons configured in product_addons,
 * the router returns these 3 immutable default warranty options.
 *
 * Addon 1: "ضمانت ۱ ماهه رایان تک" — Free (+0)
 * Addon 2: "ضمانت ۶ ماهه رایان تک" — +7% of effective price
 * Addon 3: "ضمانت ۱ ساله رایان تک" — +10% of effective price
 *
 * ADMIN INVARIANT: percentage thresholds and visibility are controlled
 * via the global_addon_defaults table. If that table has active overrides,
 * they replace these hardcoded values.
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
 * Global addon defaults row shape (admin-configurable overrides).
 */
interface GlobalAddonDefaultRow extends Record<string, unknown> {
  id: string;
  name: string;
  percent_modifier: string;
  is_required: boolean;
  is_active: boolean;
}

/**
 * Addons tRPC router.
 * Provides addon listing per product with automatic default warranty fallback.
 */
export function createAddonsRouter(db: NodePgDatabase) {
  return router({
    /**
     * List all active addons for a product.
     *
     * Strategy:
     * 1. Query product_addons for custom addons
     * 2. If none exist, fall back to global_addon_defaults (admin-managed)
     * 3. If global_addon_defaults table doesn't exist or is empty,
     *    use hardcoded DEFAULT_ADDON_TIERS
     *
     * The effectivePrice param allows percentage-based addons to compute
     * their absolute price adjustment.
     */
    byProductId: publicProcedure
      .input(
        z.object({
          productId: z.string().uuid(),
          effectivePrice: z.number().int().min(0).optional(),
        }),
      )
      .query(async ({ input }) => {
        // 1. Check for custom product-specific addons
        let customAddons: AddonRow[] = [];
        try {
          const result = await db.execute<AddonRow>(sql`
            SELECT id, product_id, name, price_adjustment, is_required, is_active
            FROM product_addons
            WHERE product_id = ${input.productId}
              AND is_active = true
            ORDER BY is_required DESC, name ASC
          `);
          customAddons = result.rows;
        } catch {
          // Table doesn't exist — fall through to defaults
        }

        // If product has custom addons, return them directly
        if (customAddons.length > 0) {
          return {
            addons: customAddons.map((row) => ({
              id: row.id,
              productId: row.product_id,
              name: row.name,
              priceAdjustment: parseInt(row.price_adjustment, 10),
              isRequired: row.is_required,
            })),
          };
        }

        // 2. No custom addons — try global_addon_defaults table
        const effectivePrice = input.effectivePrice ?? 0;

        let globalDefaults: DefaultAddonConfig[] = [];
        try {
          const globalResult = await db.execute<GlobalAddonDefaultRow>(sql`
            SELECT id, name, percent_modifier, is_required, is_active
            FROM global_addon_defaults
            WHERE is_active = true
            ORDER BY is_required DESC, percent_modifier ASC
          `);

          if (globalResult.rows.length > 0) {
            globalDefaults = globalResult.rows.map((row) => ({
              id: row.id,
              name: row.name,
              percentModifier: parseFloat(row.percent_modifier),
              isRequired: row.is_required,
            }));
          }
        } catch {
          // Table doesn't exist yet — fall through to hardcoded defaults
        }

        // 3. Use global defaults or hardcoded tiers
        const tiers = globalDefaults.length > 0 ? globalDefaults : DEFAULT_ADDON_TIERS;

        return {
          addons: tiers.map((tier) => ({
            id: tier.id,
            productId: input.productId,
            name: tier.name,
            priceAdjustment: Math.ceil(effectivePrice * (tier.percentModifier / 100)),
            isRequired: tier.isRequired,
          })),
        };
      }),

    /**
     * Validate addon selections for checkout.
     * Returns validated addon IDs with their prices, and flags missing required addons.
     */
    validateSelection: publicProcedure
      .input(
        z.object({
          productId: z.string().uuid(),
          selectedAddonIds: z.array(z.string().uuid()),
        }),
      )
      .query(async ({ input }) => {
        // Fetch all active addons for this product
        const result = await db.execute<AddonRow>(sql`
          SELECT id, product_id, name, price_adjustment, is_required, is_active
          FROM product_addons
          WHERE product_id = ${input.productId}
            AND is_active = true
        `);

        const allAddons = result.rows;
        const requiredAddons = allAddons.filter((a) => a.is_required);
        const selectedSet = new Set(input.selectedAddonIds);

        // Check all required addons are selected
        const missingRequired = requiredAddons.filter((a) => !selectedSet.has(a.id));

        // Validate that all selected IDs actually exist for this product
        const validAddonIds = new Set(allAddons.map((a) => a.id));
        const invalidSelections = input.selectedAddonIds.filter((id) => !validAddonIds.has(id));

        // Build validated addon list (selected + required)
        const effectiveAddonIds = new Set([
          ...input.selectedAddonIds.filter((id) => validAddonIds.has(id)),
          ...requiredAddons.map((a) => a.id),
        ]);

        const validatedAddons = allAddons
          .filter((a) => effectiveAddonIds.has(a.id))
          .map((a) => ({
            id: a.id,
            name: a.name,
            priceAdjustment: parseInt(a.price_adjustment, 10),
            isRequired: a.is_required,
          }));

        const totalAdjustment = validatedAddons.reduce((sum, a) => sum + a.priceAdjustment, 0);

        return {
          validatedAddons,
          totalAdjustment,
          missingRequired: missingRequired.map((a) => ({
            id: a.id,
            name: a.name,
          })),
          invalidSelections,
          isValid: missingRequired.length === 0 && invalidSelections.length === 0,
        };
      }),
  });
}

export type AddonsRouter = ReturnType<typeof createAddonsRouter>;
