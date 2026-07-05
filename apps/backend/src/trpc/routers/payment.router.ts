import { TRPCError } from "@trpc/server";
import { sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { z } from "zod";
import type { CheckoutService } from "../../order/services/checkout.service";
import type { DigipayService } from "../../payment/digipay.service";
import { protectedProcedure, router } from "../trpc.init";

export function createPaymentRouter(
  checkoutService: CheckoutService,
  digipayService: DigipayService,
  callbackBaseUrl: string,
  db: NodePgDatabase,
) {
  return router({
    initiateDigipayCredit: protectedProcedure
      .input(
        z.object({
          items: z
            .array(
              z.object({
                variantId: z.string().uuid(),
                quantity: z.number().int().min(1).max(50),
              }),
            )
            .min(1)
            .max(30),
          shippingAddress: z.string().min(5).max(1000).optional(),
          notes: z.string().max(500).optional(),
          mobile: z.string().optional(),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        const userId = ctx.session!.userId;

        // Step 1: Execute checkout (reserves stock, creates pending order)
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

        // Step 2: Build basket items from the checkout result — it already
        // carries server-resolved product IDs (the client may have sent
        // product IDs in place of variant IDs; checkout resolves both).
        const basketItems = checkoutResult.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        }));

        // Step 3: Build callback URL
        const callbackUrl = new URL("/payment/callback", callbackBaseUrl);
        callbackUrl.searchParams.set("orderId", checkoutResult.orderId);
        callbackUrl.searchParams.set("type", "installment");

        // Step 4: Initiate DigiPay Credit Payment ticket
        let ticketResult;
        try {
          ticketResult = await digipayService.createTicket({
            cellNumber: input.mobile ?? "",
            amount: parseInt(checkoutResult.totalAmount, 10),
            orderId: checkoutResult.orderId,
            callbackUrl: callbackUrl.toString(),
            basketItems,
          });
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : "خطا در اتصال به درگاه دیجی‌پی";
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message });
        }

        return {
          orderId: checkoutResult.orderId,
          totalAmount: checkoutResult.totalAmount,
          redirectUrl: ticketResult.redirectUrl,
          ticket: ticketResult.ticket,
          reservationExpiresAt: checkoutResult.reservationExpiresAt,
        };
      }),

    getDigipayOrderInfo: protectedProcedure
      .input(z.object({ orderId: z.string().uuid() }))
      .query(async ({ ctx, input }) => {
        const userId = ctx.session!.userId;

        // Fetch order details
        const orderResult = await db.execute<{
          id: string;
          total_amount: string;
          items: any;
          shipping_address: string | null;
        }>(sql`
          SELECT id, total_amount, items, shipping_address
          FROM orders
          WHERE id = ${input.orderId} AND user_id = ${userId}
          LIMIT 1
        `);

        const order = orderResult.rows[0];
        if (!order) {
          throw new TRPCError({ code: "NOT_FOUND", message: "سفارش یافت نشد" });
        }

        // Fetch products, brands, and categories details for the order items
        const orderItems = order.items as Array<{
          productId: string;
          variantId?: string;
          quantity: number;
          unitPrice: string;
          totalPrice: string;
        }>;

        const productIds = orderItems.map((i) => i.productId);
        if (productIds.length === 0) {
          return {
            orderId: order.id,
            totalAmount: order.total_amount,
            items: [],
          };
        }

        const detailsResult = await db.execute<{
          product_id: string;
          product_name: string;
          brand_name: string | null;
          category_name: string;
        }>(sql`
          SELECT
            p.id AS product_id,
            p.name AS product_name,
            b.name AS brand_name,
            c.name AS category_name
          FROM products p
          LEFT JOIN brands b ON b.id = p.brand_id
          LEFT JOIN categories c ON c.id = p.primary_category_id
          WHERE p.id IN (${sql.join(
            productIds.map((id) => sql`${id}`),
            sql`, `,
          )})
        `);

        const detailsMap = new Map(detailsResult.rows.map((r) => [r.product_id, r]));

        const items = orderItems.map((item) => {
          const det = detailsMap.get(item.productId);
          return {
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
            name: det?.product_name || "محصول فروشگاه",
            brand: det?.brand_name || "RayanTech",
            category: det?.category_name || "عمومی",
          };
        });

        return {
          orderId: order.id,
          totalAmount: order.total_amount,
          shippingAddress: order.shipping_address,
          items,
        };
      }),
  });
}
