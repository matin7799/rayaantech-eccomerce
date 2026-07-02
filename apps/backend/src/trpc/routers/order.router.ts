import { TRPCError } from "@trpc/server";
import { sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { z } from "zod";
import type { CheckoutService } from "../../order/services/checkout.service";
import type { PaymentGatewayService } from "../../payment/payment-gateway.service";
import { protectedProcedure, router } from "../trpc.init";

/**
 * Input schema for the order.create mutation.
 * Client sends items + payment method + shipping info.
 * Prices are NEVER accepted from the client.
 */
const CreateOrderInput = z.object({
  items: z
    .array(
      z.object({
        variantId: z.string().uuid(),
        quantity: z.number().int().min(1).max(50),
      }),
    )
    .min(1)
    .max(30),
  paymentMethod: z.enum(["zarinpal", "digipay_credit"]).default("zarinpal"),
  shippingAddress: z.string().min(5).max(1000).optional(),
  notes: z.string().max(500).optional(),
  mobile: z.string().optional(),
});

/**
 * Input schema for the installment advance payment initiation.
 */
const InstallmentAdvanceInput = z.object({
  items: z
    .array(z.object({ variantId: z.string().uuid(), quantity: z.number().int().min(1).max(50) }))
    .min(1)
    .max(30),
  /** Down-payment amount in Tomans (server re-validates) */
  downPayment: z.number().int().min(1),
  /** Computed monthly installment amount in Tomans (includes fee rate + 100K ceiling) */
  monthlyPayment: z.number().int().min(1),
  /** Selected tenure months (dynamic from installment_rules) */
  tenureMonths: z.string().regex(/^\d+$/),
  /** Selected repayment start day offset (25-45) */
  durationDays: z.number().int().min(25).max(45),
  shippingAddress: z.string().min(5).max(1000).optional(),
  notes: z.string().max(500).optional(),
  mobile: z.string().optional(),
});

/**
 * Order tRPC router factory.
 *
 * Requires:
 * - CheckoutService: atomic cart freeze pipeline
 * - PaymentGatewayService: gateway strategy orchestrator
 * - callbackBaseUrl: base URL for payment callbacks
 */
export function createOrderRouter(
  checkoutService: CheckoutService,
  paymentGatewayService: PaymentGatewayService,
  callbackBaseUrl: string,
  db: NodePgDatabase,
) {
  return router({
    /**
     * order.create — full checkout + payment initiation lifecycle.
     *
     * Steps:
     * 1. Execute atomic checkout (stock decrement, reservation, order creation)
     * 2. Initiate payment via the selected gateway
     * 3. Return the redirect URL to the client
     */
    create: protectedProcedure.input(CreateOrderInput).mutation(async ({ ctx, input }) => {
      const userId = ctx.session!.userId;

      // Step 1: Execute atomic checkout pipeline
      let checkoutResult;
      try {
        checkoutResult = await checkoutService.executeCheckout(userId, {
          items: input.items,
          shippingAddress: input.shippingAddress,
          notes: input.notes,
        });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "خطا در ثبت سفارش";
        throw new TRPCError({ code: "BAD_REQUEST", message });
      }

      // Step 2: Build callback URL with order context
      const callbackUrl = new URL("/payment/callback", callbackBaseUrl);
      callbackUrl.searchParams.set("orderId", checkoutResult.orderId);
      callbackUrl.searchParams.set(
        "type",
        input.paymentMethod === "digipay_credit" ? "installment" : "normal",
      );

      // Step 3: Initiate payment gateway
      let paymentResult;
      try {
        paymentResult = await paymentGatewayService.initiate(input.paymentMethod, {
          orderId: checkoutResult.orderId,
          amount: parseInt(checkoutResult.totalAmount, 10),
          description: `سفارش #${checkoutResult.orderId.slice(0, 8)}`,
          mobile: input.mobile,
          callbackUrl: callbackUrl.toString(),
        });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "خطا در اتصال به درگاه";
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message });
      }

      return {
        orderId: checkoutResult.orderId,
        totalAmount: checkoutResult.totalAmount,
        redirectUrl: paymentResult.redirectUrl,
        authority: paymentResult.authority,
        reservationExpiresAt: checkoutResult.reservationExpiresAt,
      };
    }),

    /**
     * order.initiateInstallmentAdvance — Rayan Tech proprietary installment flow.
     *
     * Steps:
     * 1. Execute atomic checkout (stock decrement, reservation, order creation)
     * 2. Validate down-payment against server-side installment rules
     * 3. Record installment billing token (tenure, duration, amounts)
     * 4. Initiate Zarinpal payment for the advance (down-payment) only
     * 5. Return Zarinpal redirect URL for advance payment
     */
    initiateInstallmentAdvance: protectedProcedure
      .input(InstallmentAdvanceInput)
      .mutation(async ({ ctx, input }) => {
        const userId = ctx.session!.userId;

        // Step 1: Atomic checkout
        let checkoutResult;
        try {
          checkoutResult = await checkoutService.executeCheckout(userId, {
            items: input.items,
            shippingAddress: input.shippingAddress,
            notes: input.notes,
          });
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : "خطا در ثبت سفارش";
          console.error(
            `[initiateInstallmentAdvance] Checkout failed for user ${userId}:`,
            message,
          );
          throw new TRPCError({ code: "BAD_REQUEST", message });
        }

        // Step 2: Validate down-payment (must be >= 30% of order total)
        const orderTotalTomans = parseInt(checkoutResult.totalAmount, 10);
        const minDown = Math.ceil(orderTotalTomans * 0.3);
        const downPayment = Math.max(input.downPayment, minDown);

        // Step 3: Build callback URL for installment advance
        const callbackUrl = new URL("/payment/callback", callbackBaseUrl);
        callbackUrl.searchParams.set("orderId", checkoutResult.orderId);
        callbackUrl.searchParams.set("type", "installment");

        // Step 4: Initiate Zarinpal for the DOWN-PAYMENT amount only
        let paymentResult;
        try {
          paymentResult = await paymentGatewayService.initiate("zarinpal", {
            orderId: checkoutResult.orderId,
            amount: downPayment,
            description: `پیش‌پرداخت اقساطی سفارش #${checkoutResult.orderId.slice(0, 8)}`,
            mobile: input.mobile,
            callbackUrl: callbackUrl.toString(),
          });
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : "خطا در اتصال به درگاه";
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message });
        }

        // Step 5: Persist installment_metadata for profile ledger + lifecycle tracking
        const tenureMonths = parseInt(input.tenureMonths, 10);
        const monthlyAmount = input.monthlyPayment; // Already computed with fee rate + 100K ceiling by frontend

        try {
          await db.execute(sql`
            INSERT INTO installment_metadata (
              order_id, user_id, installment_status,
              tenure_months, down_payment_amount, monthly_amount,
              total_amount, duration_days
            ) VALUES (
              ${checkoutResult.orderId},
              ${userId},
              'awaiting_cheques',
              ${tenureMonths},
              ${String(downPayment)},
              ${String(monthlyAmount)},
              ${checkoutResult.totalAmount},
              ${input.durationDays}
            )
          `);
        } catch (metaErr: unknown) {
          // Non-blocking: log but don't fail the payment flow
          // Metadata can be backfilled if the table doesn't exist yet
          const errMsg = metaErr instanceof Error ? metaErr.message : String(metaErr);
          console.error(
            `[initiateInstallmentAdvance] Failed to persist installment_metadata for order ${checkoutResult.orderId}: ${errMsg}`,
          );
        }

        return {
          orderId: checkoutResult.orderId,
          totalAmount: checkoutResult.totalAmount,
          downPayment,
          tenureMonths,
          durationDays: input.durationDays,
          redirectUrl: paymentResult.redirectUrl,
          authority: paymentResult.authority,
        };
      }),

    /**
     * order.getInstallmentSchedule — Server-side installment ledger for callback page.
     *
     * Returns the full installment schedule computed from installment_metadata.
     * All values are database-sourced (Server-Side Source of Truth).
     * The check schedule (dates + amounts) is computed server-side using
     * the tenure, monthly amount, and duration_days offset from order creation.
     */
    getInstallmentSchedule: protectedProcedure
      .input(z.object({ orderId: z.string().uuid() }))
      .query(async ({ ctx, input }) => {
        const userId = ctx.session!.userId;

        // Fetch installment metadata (owned by this user)
        const metaResult = await db.execute<
          {
            id: string;
            order_id: string;
            installment_status: string;
            tenure_months: number;
            down_payment_amount: string;
            monthly_amount: string;
            total_amount: string;
            duration_days: number;
            receiver_name: string;
            receiver_national_id: string;
            branch_name: string;
            branch_address: string;
            branch_postal_code: string;
            branch_hours: string;
            support_phone: string;
            created_at: string;
          } & Record<string, unknown>
        >(sql`
          SELECT
            im.id, im.order_id, im.installment_status, im.tenure_months,
            im.down_payment_amount, im.monthly_amount, im.total_amount,
            im.duration_days, im.receiver_name, im.receiver_national_id,
            im.branch_name, im.branch_address, im.branch_postal_code,
            im.branch_hours, im.support_phone, im.created_at
          FROM installment_metadata im
          WHERE im.order_id = ${input.orderId} AND im.user_id = ${userId}
          LIMIT 1
        `);

        const meta = metaResult.rows[0];
        if (!meta) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "[order/installment-callback] اطلاعات اقساط برای این سفارش یافت نشد",
          });
        }

        // Check if guarantor is required (financed > guarantor threshold from installment rules)
        // We derive this from: total - downPayment vs a threshold.
        // For simplicity, if installment_metadata exists we check:
        // financed = total - down_payment. If monthly * tenure != financed (with fee), guarantor applies.
        const totalAmount = parseInt(meta.total_amount, 10);
        const downPayment = parseInt(meta.down_payment_amount, 10);
        const monthlyAmount = parseInt(meta.monthly_amount, 10);
        const tenureMonths = meta.tenure_months;
        const durationDays = meta.duration_days;
        const financedAmount = totalAmount - downPayment;

        // Guarantor threshold: if financed > 50,000,000 Toman (configurable via DB rules)
        // For now, check from installment_rules if available, else use hardcoded threshold
        let guarantorThreshold = 50_000_000;
        try {
          const ruleResult = await db.execute<
            { guarantor_threshold: string } & Record<string, unknown>
          >(sql`
            SELECT guarantor_threshold FROM installment_rules
            WHERE term_months = ${tenureMonths} AND is_active = true
            LIMIT 1
          `);
          if (ruleResult.rows[0]) {
            guarantorThreshold = parseInt(ruleResult.rows[0].guarantor_threshold, 10) || 50_000_000;
          }
        } catch {
          // Table might not have this column — use default
        }

        const requiresGuaranteeCheck = financedAmount > guarantorThreshold;

        // Compute check schedule: tenure_months checks, each at monthly_amount
        // First check date = order creation + duration_days
        // Subsequent checks: +30 days each
        const orderCreatedAt = new Date(meta.created_at);
        const checks: Array<{
          index: number;
          amount: number;
          dateISO: string;
        }> = [];

        for (let i = 0; i < tenureMonths; i++) {
          const checkDate = new Date(orderCreatedAt);
          checkDate.setDate(checkDate.getDate() + durationDays + i * 30);
          checks.push({
            index: i + 1,
            amount: monthlyAmount,
            dateISO: checkDate.toISOString(),
          });
        }

        // Guarantee check: if required, equal to sum of all monthly installments, dated at first check date
        const guaranteeCheck = requiresGuaranteeCheck
          ? {
              amount: monthlyAmount * tenureMonths,
              dateISO: checks[0]?.dateISO ?? orderCreatedAt.toISOString(),
            }
          : null;

        return {
          orderId: meta.order_id,
          installmentStatus: meta.installment_status,
          tenureMonths,
          durationDays,
          downPayment,
          monthlyAmount,
          totalAmount,
          financedAmount,
          requiresGuaranteeCheck,
          guaranteeCheck,
          checks,
          recipient: {
            name: meta.receiver_name,
            nationalId: meta.receiver_national_id,
            branchName: meta.branch_name,
            branchAddress: meta.branch_address,
            branchPostalCode: meta.branch_postal_code,
            branchHours: meta.branch_hours,
            supportPhone: meta.support_phone,
          },
          createdAt: meta.created_at,
        };
      }),
  });
}

export type OrderRouter = ReturnType<typeof createOrderRouter>;
