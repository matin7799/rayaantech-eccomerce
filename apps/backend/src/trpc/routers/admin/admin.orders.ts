import { sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { z } from "zod";
import { router } from "../../trpc.init";
import { adminProcedure } from "./admin.procedure";

const processOrderCancellationSchema = z.object({
  orderId: z.string().min(1),
  reason: z.string().min(1).max(500).optional(),
});

const updateOrderStatusSchema = z.object({
  orderId: z.string().uuid(),
  status: z.enum([
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
    "returned",
  ]),
});

export function createAdminOrdersRouter(db: NodePgDatabase) {
  return router({
    /**
     * List orders with deep relationship joins.
     */
    listOrders: adminProcedure.query(async () => {
      // 1. Fetch orders
      const ordersResult = await db.execute<{
        id: string;
        customer_name: string;
        status: string;
        total_amount: string;
        discount_amount: string | null;
        shipping_address: string | null;
        items: string | any;
        created_at: string;
        updated_at: string;
      }>(
        sql`SELECT o.id, u.full_name AS customer_name, o.status, o.total_amount, o.discount_amount,
                   o.shipping_address, o.items, o.created_at, o.updated_at
            FROM orders o
            JOIN users u ON u.id = o.user_id
            ORDER BY o.created_at DESC`,
      );

      const ordersRows = ordersResult.rows;
      if (ordersRows.length === 0) {
        return { orders: [], total: 0 };
      }

      // 2. Fetch payments
      const orderIds = ordersRows.map((o) => o.id);
      const paymentsResult = await db.execute<{
        id: string;
        order_id: string;
        method: string;
        status: string;
        amount: string;
        payment_ref_id: string | null;
        paid_at: string | null;
        created_at: string;
      }>(
        sql`SELECT id, order_id, method, status, amount, payment_ref_id, paid_at, created_at
            FROM payments
            WHERE order_id IN (${sql.join(
              orderIds.map((id) => sql`${id}`),
              sql`, `,
            )})`,
      );
      const paymentsRows = paymentsResult.rows;

      // Group payments by order_id
      const paymentsByOrderId: Record<string, typeof paymentsRows> = {};
      for (const p of paymentsRows) {
        if (!paymentsByOrderId[p.order_id]) {
          paymentsByOrderId[p.order_id] = [];
        }
        paymentsByOrderId[p.order_id].push(p);
      }

      // 2b. Fetch installment metadata
      const installmentsResult = await db.execute<{
        id: string;
        order_id: string;
        tenure_months: number;
        down_payment_amount: string;
        monthly_amount: string;
        total_amount: string;
        duration_days: number;
        installment_status: string;
      }>(
        sql`SELECT id, order_id, tenure_months, down_payment_amount, monthly_amount, total_amount, duration_days, installment_status
            FROM installment_metadata
            WHERE order_id IN (${sql.join(
              orderIds.map((id) => sql`${id}`),
              sql`, `,
            )})`,
      );
      const installmentsRows = installmentsResult.rows;

      // Group installments by order_id
      const installmentsByOrderId: Record<string, (typeof installmentsRows)[number]> = {};
      for (const inst of installmentsRows) {
        installmentsByOrderId[inst.order_id] = inst;
      }

      // 3. Extract all product IDs and variant IDs
      const productIds = new Set<string>();
      const variantIds = new Set<string>();

      for (const o of ordersRows) {
        const parsedItems = typeof o.items === "string" ? JSON.parse(o.items) : o.items;
        if (Array.isArray(parsedItems)) {
          for (const item of parsedItems) {
            if (item.productId) productIds.add(item.productId);
            if (item.variantId) variantIds.add(item.variantId);
          }
        }
      }

      // 4. Fetch product titles and thumbnails
      const productMap: Record<string, { title: string; imageUrl?: string }> = {};
      if (productIds.size > 0) {
        const productIdsArray = Array.from(productIds);
        const productsResult = await db.execute<{
          id: string;
          name: string;
          image_url: string | null;
        }>(
          sql`SELECT p.id, p.name, m.url AS image_url
              FROM products p
              LEFT JOIN product_media pm ON pm.product_id = p.id AND pm.is_thumbnail = true
              LEFT JOIN media m ON m.id = pm.media_id
              WHERE p.id IN (${sql.join(
                productIdsArray.map((id) => sql`${id}`),
                sql`, `,
              )})`,
        );
        for (const p of productsResult.rows) {
          productMap[p.id] = { title: p.name, imageUrl: p.image_url ?? undefined };
        }
      }

      // 5. Fetch variant SKUs
      const variantMap: Record<string, { sku: string }> = {};
      if (variantIds.size > 0) {
        const variantIdsArray = Array.from(variantIds);
        const variantsResult = await db.execute<{
          id: string;
          sku: string;
        }>(
          sql`SELECT id, sku FROM product_variants WHERE id IN (${sql.join(
            variantIdsArray.map((id) => sql`${id}`),
            sql`, `,
          )})`,
        );
        for (const v of variantsResult.rows) {
          variantMap[v.id] = { sku: v.sku };
        }
      }

      // 6. Map everything together
      const orders = ordersRows.map((o) => {
        const parsedItems = typeof o.items === "string" ? JSON.parse(o.items) : o.items;
        const enrichedItems = Array.isArray(parsedItems)
          ? parsedItems.map((item) => {
              const prod = productMap[item.productId];
              const vr = item.variantId ? variantMap[item.variantId] : undefined;
              return {
                productId: item.productId,
                variantId: item.variantId,
                quantity: item.quantity,
                unitPrice: Number(item.unitPrice),
                totalPrice: Number(item.totalPrice),
                productTitle: prod?.title ?? "کالای نامشخص",
                imageUrl: prod?.imageUrl,
                variantSku: vr?.sku,
              };
            })
          : [];

        // Parse address
        let shippingAddressObj = null;
        if (o.shipping_address) {
          try {
            shippingAddressObj = JSON.parse(o.shipping_address);
          } catch {
            shippingAddressObj = { fullAddress: o.shipping_address };
          }
        }

        const orderPayments = paymentsByOrderId[o.id] ?? [];
        const mainPayment = orderPayments[0];

        const inst = installmentsByOrderId[o.id];
        const hasInstallment = !!inst;
        const installmentDetails = inst
          ? {
              id: inst.id,
              tenureMonths: inst.tenure_months,
              downPaymentAmount: Number(inst.down_payment_amount),
              monthlyAmount: Number(inst.monthly_amount),
              totalAmount: Number(inst.total_amount),
              durationDays: inst.duration_days,
              installmentStatus: inst.installment_status,
            }
          : null;

        return {
          id: o.id,
          customerName: o.customer_name,
          status: o.status,
          totalAmount: Number(o.total_amount),
          discountAmount: Number(o.discount_amount ?? 0),
          paymentStatus: mainPayment?.status ?? "pending",
          paymentMethod: mainPayment?.method ?? "zarinpal",
          hasInstallment,
          installmentDetails,
          createdAt: o.created_at,
          updatedAt: o.updated_at,
          shippingAddress: shippingAddressObj,
          items: enrichedItems,
          payments: orderPayments.map((p) => ({
            id: p.id,
            method: p.method,
            status: p.status,
            amount: Number(p.amount),
            paymentRefId: p.payment_ref_id,
            paidAt: p.paid_at,
            createdAt: p.created_at,
          })),
        };
      });

      return {
        orders,
        total: orders.length,
      };
    }),

    /**
     * Process order cancellation — sets status to cancelled.
     */
    processOrderCancellation: adminProcedure
      .input(processOrderCancellationSchema)
      .mutation(async ({ input }) => {
        await db.execute(sql`
          UPDATE orders SET status = 'cancelled', updated_at = NOW()
          WHERE id = ${input.orderId}
        `);
        return {
          success: true,
          orderId: input.orderId,
          refundStatus: "initiated" as const,
          kafkaDispatched: false,
        };
      }),

    /**
     * Update order status — sets status to any target.
     */
    updateOrderStatus: adminProcedure.input(updateOrderStatusSchema).mutation(async ({ input }) => {
      await db.execute(sql`
          UPDATE orders SET status = ${input.status}, updated_at = NOW()
          WHERE id = ${input.orderId}
        `);
      return {
        success: true,
        orderId: input.orderId,
        status: input.status,
      };
    }),
  });
}
