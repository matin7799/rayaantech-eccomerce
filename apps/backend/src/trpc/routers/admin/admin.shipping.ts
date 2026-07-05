import { TRPCError } from "@trpc/server";
import { sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { z } from "zod";
import { router } from "../../trpc.init";
import { adminProcedure } from "./admin.procedure";

/**
 * Row shape from the shipping_methods table.
 */
interface ShippingMethodRow extends Record<string, unknown> {
  id: string;
  name_fa: string;
  code: string;
  base_cost: string;
  estimated_days: string | null;
  is_active: boolean;
  is_cargo_collect: boolean;
  sort_order: number;
  created_at: string;
}

/**
 * Machine-readable code token: lowercase letters, digits and underscores only.
 */
const codeSchema = z
  .string()
  .min(2)
  .max(64)
  .regex(/^[a-z0-9_]+$/, "کد باید فقط شامل حروف کوچک انگلیسی، عدد و زیرخط باشد");

const createShippingMethodSchema = z.object({
  nameFa: z.string().min(2).max(255),
  code: codeSchema,
  baseCost: z.number().int().min(0),
  estimatedDays: z.string().max(100).optional(),
  isActive: z.boolean().default(true),
  isCargoCollect: z.boolean().default(false),
});

const updateShippingMethodSchema = z.object({
  id: z.string().uuid(),
  nameFa: z.string().min(2).max(255),
  code: codeSchema,
  baseCost: z.number().int().min(0),
  estimatedDays: z.string().max(100).optional(),
  isActive: z.boolean(),
  isCargoCollect: z.boolean(),
  sortOrder: z.number().int().optional(),
});

function mapRow(row: ShippingMethodRow) {
  return {
    id: row.id,
    nameFa: row.name_fa,
    code: row.code,
    baseCost: parseInt(row.base_cost, 10),
    estimatedDays: row.estimated_days,
    isActive: row.is_active,
    isCargoCollect: row.is_cargo_collect,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
  };
}

/**
 * Detect a Postgres unique-violation (duplicate `code`) and surface a friendly message.
 */
function isUniqueViolation(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code?: string }).code === "23505"
  );
}

/**
 * Admin shipping-methods router — full CRUD over the shipping_methods registry.
 *
 * The public checkout selector (createShippingRouter) reads only active rows;
 * this router lets admins/operators manage every method, active or not.
 */
export function createAdminShippingRouter(db: NodePgDatabase) {
  return router({
    /** List every shipping method (active and inactive) ordered by sort_order. */
    listShippingMethods: adminProcedure.query(async () => {
      const result = await db.execute<ShippingMethodRow>(sql`
        SELECT id, name_fa, code, base_cost, estimated_days, is_active, is_cargo_collect, sort_order, created_at
        FROM shipping_methods
        ORDER BY sort_order ASC
      `);
      return { methods: result.rows.map(mapRow) };
    }),

    /** Create a new shipping method. */
    createShippingMethod: adminProcedure
      .input(createShippingMethodSchema)
      .mutation(async ({ input }) => {
        try {
          const result = await db.execute<{ id: string } & Record<string, unknown>>(sql`
            INSERT INTO shipping_methods (name_fa, code, base_cost, estimated_days, is_active, is_cargo_collect)
            VALUES (
              ${input.nameFa},
              ${input.code},
              ${input.baseCost}::numeric,
              ${input.estimatedDays ?? null},
              ${input.isActive},
              ${input.isCargoCollect}
            )
            RETURNING id
          `);
          return { success: true, id: result.rows[0]!.id };
        } catch (err) {
          if (isUniqueViolation(err)) {
            throw new TRPCError({
              code: "CONFLICT",
              message: "این کد قبلاً برای روش دیگری ثبت شده است",
            });
          }
          throw err;
        }
      }),

    /** Update an existing shipping method by id. */
    updateShippingMethod: adminProcedure
      .input(updateShippingMethodSchema)
      .mutation(async ({ input }) => {
        try {
          await db.execute(sql`
            UPDATE shipping_methods
            SET name_fa = ${input.nameFa},
                code = ${input.code},
                base_cost = ${input.baseCost}::numeric,
                estimated_days = ${input.estimatedDays ?? null},
                is_active = ${input.isActive},
                is_cargo_collect = ${input.isCargoCollect},
                sort_order = COALESCE(${input.sortOrder ?? null}, sort_order)
            WHERE id = ${input.id}
          `);
          return { success: true, id: input.id };
        } catch (err) {
          if (isUniqueViolation(err)) {
            throw new TRPCError({
              code: "CONFLICT",
              message: "این کد قبلاً برای روش دیگری ثبت شده است",
            });
          }
          throw err;
        }
      }),

    /** Delete a shipping method by id. */
    deleteShippingMethod: adminProcedure
      .input(z.object({ id: z.string().uuid() }))
      .mutation(async ({ input }) => {
        await db.execute(sql`DELETE FROM shipping_methods WHERE id = ${input.id}`);
        return { success: true, id: input.id };
      }),
  });
}
