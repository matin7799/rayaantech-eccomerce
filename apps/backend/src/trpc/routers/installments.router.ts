import { InstallmentCalculationSchema } from "@rayan-tech/types";
import { sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { z } from "zod";
import type { InstallmentService } from "../../order/services/installment.service";
import { publicProcedure, router } from "../trpc.init";

/**
 * Row shape for a single installment rule with optional category override applied.
 */
interface EstimateRuleRow extends Record<string, unknown> {
  id: string;
  name: string;
  term_months: number;
  fee_percentage: string;
  default_downpayment_percent: string;
  guarantor_threshold: string;
  hard_ceiling: string;
  downpayment_percent_override: string | null;
  fee_percentage_override: string | null;
  min_downpayment_amount: string | null;
}

/**
 * Installments tRPC router factory.
 * Requires InstallmentService injected from NestJS DI.
 */
export function createInstallmentsRouter(
  installmentService: InstallmentService,
  db: NodePgDatabase,
) {
  return router({
    /**
     * getConfig — Returns live installment system configuration.
     *
     * Used by the checkout InstallmentConfigurator to avoid hardcoded constants.
     * Returns: baseMonthlyInterest, loanCeiling, default downpayment %,
     * and product category exceptions map.
     */
    getConfig: publicProcedure.query(async () => {
      // Fetch ALL active installment rules (each becomes a tenure tab)
      const rulesResult = await db.execute<
        {
          id: string;
          name: string;
          term_months: number;
          fee_percentage: string;
          default_downpayment_percent: string;
          guarantor_threshold: string;
          hard_ceiling: string;
        } & Record<string, unknown>
      >(sql`
        SELECT id, name, term_months, fee_percentage, default_downpayment_percent, guarantor_threshold, hard_ceiling
        FROM installment_rules
        WHERE is_active = true
        ORDER BY term_months ASC
      `);

      const rules = rulesResult.rows.map((r) => ({
        id: r.id,
        name: r.name,
        termMonths: r.term_months,
        feePercentage: parseFloat(r.fee_percentage),
        defaultDownPaymentPercent: parseFloat(r.default_downpayment_percent),
        guarantorThreshold: parseInt(r.guarantor_threshold, 10),
        hardCeiling: parseInt(r.hard_ceiling, 10),
      }));

      // Global defaults from the first rule (shortest term) for fallback
      const firstRule = rules[0];
      const baseMonthlyInterest = firstRule?.feePercentage ?? 4;
      const loanCeiling = firstRule?.hardCeiling ?? 50000000;
      const defaultDownPaymentPercent = firstRule?.defaultDownPaymentPercent ?? 30;

      // Fetch all active category exceptions
      const exceptionsResult = await db.execute<
        {
          category_id: string;
          rule_id: string;
          downpayment_percent_override: string | null;
          fee_percentage_override: string | null;
          min_downpayment_amount: string | null;
        } & Record<string, unknown>
      >(sql`
        SELECT category_id, rule_id, downpayment_percent_override, fee_percentage_override, min_downpayment_amount
        FROM category_installment_overrides
        WHERE is_active = true
      `);

      const exceptions = exceptionsResult.rows.map((row) => ({
        categoryId: row.category_id,
        ruleId: row.rule_id,
        downPaymentPercent: row.downpayment_percent_override
          ? parseFloat(row.downpayment_percent_override)
          : null,
        feePercentageOverride: row.fee_percentage_override
          ? parseFloat(row.fee_percentage_override)
          : null,
        minDownPaymentAmount: row.min_downpayment_amount
          ? parseInt(row.min_downpayment_amount, 10)
          : null,
      }));

      return {
        rules,
        baseMonthlyInterest,
        loanCeiling,
        defaultDownPaymentPercent,
        exceptions,
      };
    }),

    /**
     * Evaluate a shopping cart for installment eligibility and pricing.
     */
    evaluate: publicProcedure.input(InstallmentCalculationSchema).mutation(async ({ input }) => {
      const result = await installmentService.evaluate(input);
      return result;
    }),

    /**
     * PDP installment estimate — returns all available term options for a
     * single product price, applying category overrides where applicable.
     *
     * Used on the Product Detail Page to display accurate installment plans
     * without requiring a full cart evaluation.
     */
    estimate: publicProcedure
      .input(
        z.object({
          /** Product effective price in integer Rials */
          price: z.number().int().min(1),
          /** Category ID for override lookup */
          categoryId: z.string().uuid(),
        }),
      )
      .query(async ({ input }) => {
        const { price, categoryId } = input;

        // Fetch all active rules with category overrides (LEFT JOIN)
        const result = await db.execute<EstimateRuleRow>(sql`
          SELECT ir.id, ir.name, ir.term_months, ir.fee_percentage,
                 ir.default_downpayment_percent, ir.guarantor_threshold,
                 ir.hard_ceiling,
                 cio.downpayment_percent_override,
                 cio.fee_percentage_override,
                 cio.min_downpayment_amount
          FROM installment_rules ir
          LEFT JOIN category_installment_overrides cio
            ON cio.rule_id = ir.id
            AND cio.category_id = ${categoryId}
            AND cio.is_active = true
          WHERE ir.is_active = true
          ORDER BY ir.term_months ASC
        `);

        const options = result.rows.map((rule) => {
          const feePercent = parseFloat(rule.fee_percentage_override ?? rule.fee_percentage);
          const downpaymentPercent = parseFloat(
            rule.downpayment_percent_override ?? rule.default_downpayment_percent,
          );
          const minDownpayment = rule.min_downpayment_amount
            ? parseInt(rule.min_downpayment_amount, 10)
            : 0;

          // Calculate downpayment (higher of percentage-based or minimum floor)
          const percentBasedDown = Math.ceil(price * (downpaymentPercent / 100));
          const downpayment = Math.max(percentBasedDown, minDownpayment);

          // Facility = price - downpayment
          const facility = price - downpayment;

          // Fee applied to facility
          const fee = Math.ceil(facility * (feePercent / 100));

          // Monthly = (facility + fee) / term
          const monthlyInstallment = Math.ceil((facility + fee) / rule.term_months);

          // Check ceilings
          const hardCeiling = parseInt(rule.hard_ceiling, 10);
          const guarantorThreshold = parseInt(rule.guarantor_threshold, 10);
          const exceedsHardCeiling = facility > hardCeiling;
          const requiresGuarantor = facility > guarantorThreshold;

          return {
            ruleId: rule.id,
            name: rule.name,
            termMonths: rule.term_months,
            downpayment,
            downpaymentPercent,
            facility,
            fee,
            monthlyInstallment,
            feePercent,
            exceedsHardCeiling,
            requiresGuarantor,
            isOverridden:
              rule.downpayment_percent_override !== null || rule.fee_percentage_override !== null,
          };
        });

        // Filter out options that exceed hard ceiling
        const availableOptions = options.filter((o) => !o.exceedsHardCeiling);

        return {
          price,
          categoryId,
          options: availableOptions,
          allOptions: options,
        };
      }),
  });
}

export type InstallmentsRouter = ReturnType<typeof createInstallmentsRouter>;
