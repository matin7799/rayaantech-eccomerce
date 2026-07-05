import { TRPCError } from "@trpc/server";
import { sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { z } from "zod";
import { protectedProcedure, router } from "../../trpc.init";
import type { OrderRow, OrderStatsRow, PaymentRow } from "./profile.types";

export function createProfileOrdersRouter(db: NodePgDatabase) {
  return router({
    /* ─── Orders ─── */

    getOrderStats: protectedProcedure.query(async ({ ctx }) => {
      const userId = ctx.session!.userId;

      const result = await db.execute<OrderStatsRow>(sql`
        SELECT
          COUNT(*) FILTER (WHERE status = 'processing') AS processing,
          COUNT(*) FILTER (WHERE status = 'shipped') AS shipped,
          COUNT(*) FILTER (WHERE status = 'delivered') AS delivered
        FROM orders
        WHERE user_id = ${userId}
          AND status != 'pending'
      `);

      const stats = result.rows[0];
      return {
        processing: parseInt(stats?.processing ?? "0", 10),
        shipped: parseInt(stats?.shipped ?? "0", 10),
        delivered: parseInt(stats?.delivered ?? "0", 10),
      };
    }),

    getOrders: protectedProcedure
      .input(
        z
          .object({
            status: z
              .enum(["all", "pending", "processing", "shipped", "delivered", "cancelled"])
              .default("all"),
            limit: z.number().min(1).max(50).default(10),
            offset: z.number().min(0).default(0),
          })
          .optional(),
      )
      .query(async ({ ctx, input }) => {
        const userId = ctx.session!.userId;
        const status = input?.status ?? "all";
        const limit = input?.limit ?? 10;
        const offset = input?.offset ?? 0;

        let result;
        if (status === "all") {
          result = await db.execute<OrderRow>(sql`
            SELECT id, status, total_amount, discount_amount, shipping_address, items, created_at, updated_at
            FROM orders
            WHERE user_id = ${userId}
              AND status != 'pending'
            ORDER BY created_at DESC
            LIMIT ${limit} OFFSET ${offset}
          `);
        } else {
          result = await db.execute<OrderRow>(sql`
            SELECT id, status, total_amount, discount_amount, shipping_address, items, created_at, updated_at
            FROM orders
            WHERE user_id = ${userId} AND status = ${status}
            ORDER BY created_at DESC
            LIMIT ${limit} OFFSET ${offset}
          `);
        }

        return {
          orders: result.rows.map((order) => ({
            id: order.id,
            status: order.status,
            totalAmount: order.total_amount,
            discountAmount: order.discount_amount,
            shippingAddress: order.shipping_address,
            itemCount: order.items?.length ?? 0,
            items: order.items,
            createdAt: order.created_at,
            updatedAt: order.updated_at,
          })),
        };
      }),

    /* ─── Transactions ─── */

    getTransactions: protectedProcedure.query(async ({ ctx }) => {
      const userId = ctx.session!.userId;

      const result = await db.execute<PaymentRow>(sql`
        SELECT p.id, p.order_id, p.method, p.status, p.amount, p.payment_ref_id, p.paid_at, p.created_at
        FROM payments p
        INNER JOIN orders o ON o.id = p.order_id
        WHERE o.user_id = ${userId}
        ORDER BY p.created_at DESC
        LIMIT 50
      `);

      return {
        transactions: result.rows.map((tx) => {
          const amount = parseInt(tx.amount, 10);
          // Installment calculation: split into 3 monthly payments, ceil to 100,000 Tomans
          const rawInstallment = amount / 3;
          const installmentAmount = Math.ceil(rawInstallment / 100_000) * 100_000;

          return {
            id: tx.id,
            orderId: tx.order_id,
            method: tx.method,
            status: tx.status,
            amount: tx.amount,
            installmentAmount: installmentAmount.toString(),
            paymentRefId: tx.payment_ref_id,
            paidAt: tx.paid_at,
            createdAt: tx.created_at,
          };
        }),
      };
    }),

    /* ─── Installments Ledger ─── */

    getInstallments: protectedProcedure.query(async ({ ctx }) => {
      const userId = ctx.session!.userId;

      try {
        const result = await db.execute<
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
            im.down_payment_amount, im.monthly_amount, im.total_amount, im.duration_days,
            im.receiver_name, im.receiver_national_id, im.branch_name,
            im.branch_address, im.branch_postal_code, im.branch_hours,
            im.support_phone, im.created_at
          FROM installment_metadata im
          INNER JOIN orders o ON o.id = im.order_id
          WHERE im.user_id = ${userId} AND o.status != 'pending'
          ORDER BY im.created_at DESC
        `);

        return {
          installments: result.rows.map((row) => ({
            id: row.id,
            orderId: row.order_id,
            installmentStatus: row.installment_status,
            tenureMonths: row.tenure_months,
            downPaymentAmount: row.down_payment_amount,
            monthlyAmount: row.monthly_amount,
            totalAmount: row.total_amount,
            durationDays: row.duration_days,
            receiverName: row.receiver_name,
            receiverNationalId: row.receiver_national_id,
            branchName: row.branch_name,
            branchAddress: row.branch_address,
            branchPostalCode: row.branch_postal_code,
            branchHours: row.branch_hours,
            supportPhone: row.support_phone,
            createdAt: row.created_at,
          })),
        };
      } catch (err: unknown) {
        const pgError = err as { code?: string; message?: string };
        if (pgError.code === "42P01") {
          console.warn(
            "[getInstallments] installment_metadata table not found — run migration 0002",
          );
          return { installments: [] };
        }
        console.error("[getInstallments] Unexpected error:", pgError.message ?? err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "خطا در بارگذاری اطلاعات اقساط",
        });
      }
    }),
  });
}
