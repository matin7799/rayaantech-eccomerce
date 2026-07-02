import { TRPCError } from "@trpc/server";
import { sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { z } from "zod";
import type { UserService } from "../../users/user.service";
import { protectedProcedure, router } from "../trpc.init";

/**
 * Zod schema for a single cheque entry submission.
 */
const ChequeEntryInput = z.object({
  checkAmount: z.string().min(1),
  maturationDate: z.string().min(1),
  draweeNationalId: z
    .string()
    .length(10)
    .regex(/^\d{10}$/),
  payeeFullName: z.string().min(3).max(255),
  mailingAddress: z.string().min(10).max(2000),
});

/**
 * User tRPC router — installment cheque management.
 */
export function createUserRouter(db: NodePgDatabase, userService: UserService) {
  return router({
    /**
     * Claim PWA installation loyalty points bonus (50 coins).
     */
    claimPwaBonus: protectedProcedure.mutation(async ({ ctx }) => {
      const userId = ctx.session!.userId;
      return await userService.claimPwaBonus(userId);
    }),

    /**
     * Save installment cheque records for an order.
     *
     * Called from the /payment/callback page after a successful
     * DigiPay installment payment. Inserts cheque rows into the
     * installment_cheques table.
     */
    saveInstallmentCheques: protectedProcedure
      .input(
        z.object({
          orderId: z.string().uuid(),
          cheques: z.array(ChequeEntryInput).min(1).max(12),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        const userId = ctx.session!.userId;

        // Verify order belongs to user and is confirmed
        const orderCheck = await db.execute<
          {
            id: string;
            status: string;
          } & Record<string, unknown>
        >(sql`
          SELECT id, status FROM orders
          WHERE id = ${input.orderId} AND user_id = ${userId}
          LIMIT 1
        `);

        const order = orderCheck.rows[0];
        if (!order) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "سفارش یافت نشد",
          });
        }

        if (order.status !== "confirmed") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "سفارش هنوز تأیید نشده است",
          });
        }

        // Check if cheques already exist for this order (prevent duplicates)
        const existing = await db.execute<{ count: string } & Record<string, unknown>>(sql`
          SELECT COUNT(*)::text AS count FROM installment_cheques
          WHERE order_id = ${input.orderId} AND user_id = ${userId}
        `);

        if (parseInt(existing.rows[0]?.count ?? "0", 10) > 0) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "اطلاعات چک‌ها قبلاً ثبت شده است",
          });
        }

        // Insert all cheques
        for (const cheque of input.cheques) {
          await db.execute(sql`
            INSERT INTO installment_cheques (
              user_id, order_id, check_amount, maturation_date,
              drawee_national_id, payee_full_name, mailing_address
            ) VALUES (
              ${userId}, ${input.orderId}, ${cheque.checkAmount},
              ${cheque.maturationDate}::date, ${cheque.draweeNationalId},
              ${cheque.payeeFullName}, ${cheque.mailingAddress}
            )
          `);
        }

        return { success: true, count: input.cheques.length };
      }),

    /**
     * Lock (finalize) installment cheques for an order.
     *
     * Called when user clicks "ثبت و ارسال نهایی چک‌ها" in their profile.
     * Sets is_locked = true on all cheques for that order.
     * Once locked, cheques cannot be modified.
     */
    lockInstallmentCheques: protectedProcedure
      .input(z.object({ orderId: z.string().uuid() }))
      .mutation(async ({ ctx, input }) => {
        const userId = ctx.session!.userId;

        const result = await db.execute<{ count: string } & Record<string, unknown>>(sql`
          UPDATE installment_cheques
          SET is_locked = true, locked_at = NOW(), updated_at = NOW()
          WHERE order_id = ${input.orderId}
            AND user_id = ${userId}
            AND is_locked = false
          RETURNING id
        `);

        const lockedCount = result.rows.length;
        if (lockedCount === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "چکی برای قفل‌کردن یافت نشد",
          });
        }

        return { success: true, lockedCount };
      }),
  });
}

export type UserRouter = ReturnType<typeof createUserRouter>;
