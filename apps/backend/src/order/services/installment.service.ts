import { BadRequestException, Inject, Injectable, Logger } from "@nestjs/common";
import type { InstallmentCalculationInput, InstallmentEvaluationResult } from "@rayan-tech/types";
import { sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { DRIZZLE_CLIENT } from "../../database/database.constants";
import { evaluateBasketInstallment, type ItemInstallmentParams } from "./installment.utils";

/**
 * Row shape from installment_rules query.
 */
interface RuleRow extends Record<string, unknown> {
  id: string;
  term_months: number;
  fee_percentage: string;
  default_downpayment_percent: string;
  guarantor_threshold: string;
  hard_ceiling: string;
}

/**
 * Row shape from category_installment_overrides query.
 */
interface OverrideRow extends Record<string, unknown> {
  category_id: string;
  downpayment_percent_override: string | null;
  fee_percentage_override: string | null;
  min_downpayment_amount: string | null;
}

/**
 * Installment evaluation service.
 *
 * Fetches the active global rule for the requested term, loads any
 * category-level overrides, then delegates to the pure arithmetic
 * functions in installment.utils.ts for the actual computation.
 */
@Injectable()
export class InstallmentService {
  private readonly logger = new Logger(InstallmentService.name);

  constructor(
    @Inject(DRIZZLE_CLIENT)
    private readonly db: NodePgDatabase,
  ) {}

  /**
   * Evaluate a full basket of items for installment eligibility and pricing.
   *
   * Steps:
   * 1. Fetch the active global rule matching the requested term
   * 2. Fetch category overrides for all unique category IDs in the basket
   * 3. Build per-item params (applying overrides where matched)
   * 4. Delegate to evaluateBasketInstallment() for pure math
   */
  async evaluate(input: InstallmentCalculationInput): Promise<InstallmentEvaluationResult> {
    // Step 1: Fetch active global rule for the term
    const rule = await this.fetchGlobalRule(input.termMonths);

    // Step 2: Fetch category overrides
    const categoryIds = [...new Set(input.items.map((i) => i.categoryId))];
    const overrides = await this.fetchCategoryOverrides(rule.id, categoryIds);

    // Step 3: Build per-item params
    const itemParams: ItemInstallmentParams[] = input.items.map((item) => {
      const override = overrides.get(item.categoryId);
      return {
        productId: item.productId,
        basePrice: parseInt(item.basePrice, 10),
        quantity: item.quantity,
        termMonths: rule.term_months,
        feePercentage: override?.fee_percentage_override ?? rule.fee_percentage,
        downpaymentPercent:
          override?.downpayment_percent_override ?? rule.default_downpayment_percent,
        minDownpaymentAmount: override?.min_downpayment_amount
          ? parseInt(override.min_downpayment_amount, 10)
          : null,
        customDownpayment: item.customDownpayment ? parseInt(item.customDownpayment, 10) : null,
        isOverridden: override !== undefined,
      };
    });

    // Step 4: Pure arithmetic evaluation
    const result = evaluateBasketInstallment({
      items: itemParams,
      guarantorThreshold: parseInt(rule.guarantor_threshold, 10),
      hardCeiling: parseInt(rule.hard_ceiling, 10),
      termMonths: rule.term_months,
    });

    this.logger.debug(
      `Installment eval: ${input.items.length} items, ` +
        `facility=${result.totalFacility}, guarantor=${result.requiresGuarantorCheck}`,
    );

    return result;
  }

  /**
   * Fetch the active global installment rule for a given term.
   */
  private async fetchGlobalRule(termMonths: number): Promise<RuleRow> {
    const result = await this.db.execute<RuleRow>(sql`
      SELECT id, term_months, fee_percentage, default_downpayment_percent,
             guarantor_threshold, hard_ceiling
      FROM installment_rules
      WHERE term_months = ${termMonths} AND is_active = true
      LIMIT 1
    `);

    const rule = result.rows[0];
    if (!rule) {
      throw new BadRequestException(`شرایط اقساط ${termMonths} ماهه فعال نیست`);
    }
    return rule;
  }

  /**
   * Fetch category overrides for the given rule and category IDs.
   * Returns a Map keyed by category_id for O(1) lookups.
   */
  private async fetchCategoryOverrides(
    ruleId: string,
    categoryIds: string[],
  ): Promise<Map<string, OverrideRow>> {
    if (categoryIds.length === 0) {
      return new Map();
    }

    // Build parameterized IN clause
    const result = await this.db.execute<OverrideRow>(sql`
      SELECT category_id, downpayment_percent_override,
             fee_percentage_override, min_downpayment_amount
      FROM category_installment_overrides
      WHERE rule_id = ${ruleId}
        AND is_active = true
        AND category_id = ANY(${categoryIds}::uuid[])
    `);

    const map = new Map<string, OverrideRow>();
    for (const row of result.rows) {
      map.set(row.category_id, row);
    }
    return map;
  }
}
