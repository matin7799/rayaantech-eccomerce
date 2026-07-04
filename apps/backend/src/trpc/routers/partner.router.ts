import { TRPCError } from "@trpc/server";
import { sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { z } from "zod";
import {
  coerceDisplayTier,
  guestBuyerContext,
  resolveProductPrice,
} from "../../pricing/pricing.service";
import type { BuyerContext, ProductPriceRow, ResolvedPrice } from "../../pricing/pricing.types";
import type { TrpcContext } from "../trpc.context";
import { middleware, protectedProcedure, router } from "../trpc.init";

/**
 * Resolve the buyer context for partner-catalog pricing.
 *
 * Real approved partners keep their group markdown (already on ctx.buyer).
 * Admin/operator staff have no wholesale group, so they preview as an approved
 * partner with 0% markdown — surfacing the explicit `wholesale_price` where set,
 * otherwise the base price. This is what lets staff see the partner price.
 */
function resolvePartnerBuyer(ctx: TrpcContext): BuyerContext {
  const base = ctx.buyer ?? guestBuyerContext();
  if (base.wholesale) return base;
  const role = ctx.session?.role;
  if (role === "admin" || role === "operator") {
    return {
      ...base,
      wholesale: { groupId: "staff-preview", markdownPercent: "0", status: "approved" },
    };
  }
  return base;
}

/**
 * Roles allowed to reach partner procedures: verified B2B wholesale users plus
 * admin/operator staff (so they can inspect the partner portal and its data).
 */
const PARTNER_ALLOWED_ROLES = new Set(["wholesale", "admin", "operator"]);

/**
 * Middleware that limits procedure execution to partner (wholesale) users and staff.
 */
export const partnerMiddleware = middleware(({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "احراز هویت الزامی است",
    });
  }
  if (!PARTNER_ALLOWED_ROLES.has(ctx.session.role)) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "دسترسی همکار الزامی است",
    });
  }
  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
    },
  });
});

export const partnerProcedure = protectedProcedure.use(partnerMiddleware);

export interface PartnerProductRow extends Record<string, unknown>, ProductPriceRow {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  short_description: string | null;
  base_price: string;
  discounted_price: string | null;
  torob_price: string | null;
  wholesale_price: string | null;
  campaign_price: string | null;
  campaign_start_at: string | null;
  campaign_end_at: string | null;
  grade: string;
  stock: number;
  is_active: boolean;
  primary_category_id: string;
  brand_id: string | null;
  thumbnail_url: string | null;
}

export function createPartnerRouter(db: NodePgDatabase) {
  return router({
    /**
     * Fetch products catalog with computed wholesale-tier pricing matrices.
     */
    getProducts: partnerProcedure
      .input(
        z.object({
          page: z.number().int().min(1).default(1),
          limit: z.number().int().min(1).max(100).default(20),
        }),
      )
      .query(async ({ input, ctx }) => {
        const { page, limit } = input;
        const offset = (page - 1) * limit;

        const query = sql`
          SELECT
            p.id, p.name, p.slug, p.sku, p.short_description,
            p.base_price, p.discounted_price, p.torob_price, p.wholesale_price,
            p.campaign_price, p.campaign_start_at, p.campaign_end_at,
            p.grade, p.stock, p.is_active, p.primary_category_id, p.brand_id,
            (SELECT m.url FROM product_media pm2
             JOIN media m ON m.id = pm2.media_id
             WHERE pm2.product_id = p.id
             ORDER BY pm2.is_thumbnail DESC, pm2.display_order ASC LIMIT 1) AS thumbnail_url
          FROM products p
          WHERE p.is_active = true
          ORDER BY p.created_at DESC
          LIMIT ${limit} OFFSET ${offset}
        `;

        const countQuery = sql`
          SELECT COUNT(*) as total FROM products p WHERE p.is_active = true
        `;

        const [productsResult, countResult] = await Promise.all([
          db.execute<PartnerProductRow>(query),
          db.execute<{ total: string } & Record<string, unknown>>(countQuery),
        ]);

        const total = parseInt(countResult.rows[0]?.total ?? "0", 10);
        const buyer = resolvePartnerBuyer(ctx);

        const items = productsResult.rows.map((row) => {
          const resolved: ResolvedPrice = resolveProductPrice(row, buyer);
          return {
            id: row.id,
            name: row.name,
            slug: row.slug,
            sku: row.sku,
            grade: row.grade,
            stock: row.stock,
            categoryId: row.primary_category_id,
            brandId: row.brand_id,
            thumbnailUrl: row.thumbnail_url,
            inStock: row.stock > 0,
            effectivePrice: resolved.effectivePrice,
            displayBaseline: resolved.displayBaseline,
            discountPercent: resolved.discountPercent,
            pricingTier: coerceDisplayTier(resolved.pricingTier, buyer),
            wholesalePrice: row.wholesale_price ? parseInt(row.wholesale_price, 10) : null,
          };
        });

        return {
          items,
          total,
          page,
          limit,
          hasMore: offset + items.length < total,
        };
      }),

    /**
     * Fetch dedicated purchase orders history matching strictly the authenticated user's ID.
     */
    getPurchases: partnerProcedure
      .input(
        z.object({
          limit: z.number().int().min(1).max(100).default(20),
          offset: z.number().int().min(0).default(0),
        }),
      )
      .query(async ({ ctx, input }) => {
        const userId = ctx.session.userId;
        const { limit, offset } = input;

        const query = sql`
          SELECT
            o.id, o.status, o.total_amount, o.discount_amount, o.shipping_address, o.items, o.created_at, o.updated_at,
            p.method AS payment_method, p.status AS payment_status, p.payment_ref_id
          FROM orders o
          LEFT JOIN payments p ON p.order_id = o.id
          WHERE o.user_id = ${userId}
          ORDER BY o.created_at DESC
          LIMIT ${limit} OFFSET ${offset}
        `;

        const countQuery = sql`
          SELECT COUNT(*) as total FROM orders o WHERE o.user_id = ${userId}
        `;

        const [ordersResult, countResult] = await Promise.all([
          db.execute<
            {
              id: string;
              status: string;
              total_amount: string;
              discount_amount: string;
              shipping_address: string | null;
              // biome-ignore lint/suspicious/noExplicitAny: <explanation>
              items: any;
              created_at: string;
              updated_at: string;
              payment_method: string | null;
              payment_status: string | null;
              payment_ref_id: string | null;
            } & Record<string, unknown>
          >(query),
          db.execute<{ total: string } & Record<string, unknown>>(countQuery),
        ]);

        const total = parseInt(countResult.rows[0]?.total ?? "0", 10);

        return {
          purchases: ordersResult.rows.map((row) => ({
            id: row.id,
            status: row.status,
            totalAmount: row.total_amount,
            discountAmount: row.discount_amount,
            shippingAddress: row.shipping_address,
            items: row.items,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
            paymentMethod: row.payment_method,
            paymentStatus: row.payment_status,
            paymentRefId: row.payment_ref_id,
          })),
          total,
          limit,
          offset,
        };
      }),
  });
}
