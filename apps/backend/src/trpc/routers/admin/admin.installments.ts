import { sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { z } from "zod";
import { router } from "../../trpc.init";
import { adminProcedure } from "./admin.procedure";

const createInstallmentRuleSchema = z.object({
  name: z.string().min(2).max(255),
  termMonths: z.number().int().min(1).max(60),
  feePercentage: z.string().regex(/^\d+(\.\d{1,2})?$/),
  defaultDownpaymentPercent: z.string().regex(/^\d+(\.\d{1,2})?$/),
  guarantorThreshold: z.string().regex(/^\d+$/),
  hardCeiling: z.string().regex(/^\d+$/),
  isActive: z.boolean().default(true),
});

const updateInstallmentRuleSchema = z.object({
  id: z.string().uuid(),
  termMonths: z.number().int().min(1).max(60),
  feePercentage: z.string().regex(/^\d+(\.\d{1,2})?$/),
  defaultDownpaymentPercent: z.string().regex(/^\d+(\.\d{1,2})?$/),
  guarantorThreshold: z.string().regex(/^\d+$/),
  hardCeiling: z.string().regex(/^\d+$/),
  isActive: z.boolean(),
});

export function createAdminInstallmentsRouter(db: NodePgDatabase) {
  return router({
    /** List all installment rules. */
    listInstallmentRules: adminProcedure.query(async () => {
      const result = await db.execute<
        {
          id: string;
          name: string;
          term_months: number;
          fee_percentage: string;
          default_downpayment_percent: string;
          guarantor_threshold: string;
          hard_ceiling: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        } & Record<string, unknown>
      >(
        sql`SELECT id, name, term_months, fee_percentage, default_downpayment_percent, guarantor_threshold, hard_ceiling, is_active, created_at, updated_at
            FROM installment_rules ORDER BY term_months ASC`,
      );
      return {
        rules: result.rows.map((r) => ({
          id: r.id,
          name: r.name,
          termMonths: r.term_months,
          feePercentage: r.fee_percentage,
          defaultDownpaymentPercent: r.default_downpayment_percent,
          guarantorThreshold: r.guarantor_threshold,
          hardCeiling: r.hard_ceiling,
          isActive: r.is_active,
          createdAt: r.created_at,
          updatedAt: r.updated_at,
        })),
      };
    }),

    /** Update an installment rule by id. */
    updateInstallmentRule: adminProcedure
      .input(updateInstallmentRuleSchema)
      .mutation(async ({ input }) => {
        await db.execute(sql`
          UPDATE installment_rules
          SET term_months = ${input.termMonths},
              fee_percentage = ${input.feePercentage}::numeric,
              default_downpayment_percent = ${input.defaultDownpaymentPercent}::numeric,
              guarantor_threshold = ${input.guarantorThreshold}::numeric,
              hard_ceiling = ${input.hardCeiling}::numeric,
              is_active = ${input.isActive},
              updated_at = NOW()
          WHERE id = ${input.id}
        `);
        return { success: true, id: input.id };
      }),

    /** Create a new installment rule. */
    createInstallmentRule: adminProcedure
      .input(createInstallmentRuleSchema)
      .mutation(async ({ input }) => {
        const result = await db.execute<{ id: string } & Record<string, unknown>>(sql`
          INSERT INTO installment_rules (name, term_months, fee_percentage, default_downpayment_percent, guarantor_threshold, hard_ceiling, is_active)
          VALUES (${input.name}, ${input.termMonths}, ${input.feePercentage}::numeric, ${input.defaultDownpaymentPercent}::numeric, ${input.guarantorThreshold}::numeric, ${input.hardCeiling}::numeric, ${input.isActive})
          RETURNING id
        `);
        return { success: true, id: result.rows[0]!.id, name: input.name };
      }),

    /** List overrides for a specific installment rule. */
    listInstallmentOverrides: adminProcedure
      .input(z.object({ ruleId: z.string().uuid() }))
      .query(async ({ input }) => {
        const result = await db.execute<
          {
            id: string;
            category_id: string;
            category_name: string;
            rule_id: string;
            downpayment_percent_override: string | null;
            fee_percentage_override: string | null;
            min_downpayment_amount: string | null;
            is_active: boolean;
            created_at: string;
          } & Record<string, unknown>
        >(
          sql`SELECT cio.id, cio.category_id, c.name AS category_name, cio.rule_id,
                     cio.downpayment_percent_override, cio.fee_percentage_override,
                     cio.min_downpayment_amount, cio.is_active, cio.created_at
              FROM category_installment_overrides cio
              JOIN categories c ON c.id = cio.category_id
              WHERE cio.rule_id = ${input.ruleId}
              ORDER BY c.name ASC`,
        );
        return {
          overrides: result.rows.map((r) => ({
            id: r.id,
            categoryId: r.category_id,
            categoryName: r.category_name,
            ruleId: r.rule_id,
            downpaymentPercentOverride: r.downpayment_percent_override,
            feePercentageOverride: r.fee_percentage_override,
            minDownpaymentAmount: r.min_downpayment_amount,
            isActive: r.is_active,
            createdAt: r.created_at,
          })),
        };
      }),

    /** Create a new category override for an installment rule. */
    createInstallmentOverride: adminProcedure
      .input(
        z.object({
          ruleId: z.string().uuid(),
          categoryId: z.string().uuid(),
          downpaymentPercentOverride: z.string().optional(),
          feePercentageOverride: z.string().optional(),
          minDownpaymentAmount: z.string().optional(),
          isActive: z.boolean().default(true),
        }),
      )
      .mutation(async ({ input }) => {
        const result = await db.execute<{ id: string } & Record<string, unknown>>(sql`
          INSERT INTO category_installment_overrides (rule_id, category_id, downpayment_percent_override, fee_percentage_override, min_downpayment_amount, is_active)
          VALUES (${input.ruleId}, ${input.categoryId}, ${input.downpaymentPercentOverride ?? null}::numeric, ${input.feePercentageOverride ?? null}::numeric, ${input.minDownpaymentAmount ?? null}::numeric, ${input.isActive})
          RETURNING id
        `);
        return { success: true, id: result.rows[0]!.id };
      }),

    /** Delete an installment override. */
    deleteInstallmentOverride: adminProcedure
      .input(z.object({ id: z.string().uuid() }))
      .mutation(async ({ input }) => {
        await db.execute(sql`DELETE FROM category_installment_overrides WHERE id = ${input.id}`);
        return { success: true, id: input.id };
      }),
  });
}
