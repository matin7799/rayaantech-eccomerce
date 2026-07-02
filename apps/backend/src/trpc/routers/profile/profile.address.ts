import { TRPCError } from "@trpc/server";
import { sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { z } from "zod";
import { protectedProcedure, router } from "../../trpc.init";
import type { AddressEntry } from "./profile.types";

const AddressSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "عنوان آدرس الزامی است").max(50),
  recipientName: z.string().min(3, "نام گیرنده الزامی است").max(100),
  phone: z.string().regex(/^09\d{9}$/, "شماره موبایل نامعتبر است"),
  province: z.string().min(2, "استان الزامی است").max(50),
  city: z.string().min(2, "شهر الزامی است").max(50),
  postalCode: z.string().regex(/^\d{10}$/, "کد پستی باید ۱۰ رقم باشد"),
  fullAddress: z.string().min(10, "آدرس کامل الزامی است").max(500),
  isDefault: z.boolean(),
});

const UpdateAddressesSchema = z.object({
  addresses: z.array(AddressSchema).max(10, "حداکثر ۱۰ آدرس مجاز است"),
});

export function createProfileAddressRouter(db: NodePgDatabase) {
  return router({
    /* ─── Addresses ─── */

    getAddresses: protectedProcedure.query(async ({ ctx }) => {
      const userId = ctx.session!.userId;

      try {
        const result = await db.execute<{ addresses: AddressEntry[] | null }>(sql`
          SELECT COALESCE(addresses, '[]'::json) AS addresses FROM users WHERE id = ${userId} LIMIT 1
        `);

        const row = result.rows?.[0];
        if (!row) {
          return { addresses: [] };
        }

        const addresses = row.addresses;
        if (addresses && !Array.isArray(addresses)) {
          console.error(
            `[getAddresses] Corrupted addresses JSONB for user ${userId}: expected array, got ${typeof addresses}`,
          );
          return { addresses: [] };
        }

        return { addresses: addresses ?? [] };
      } catch (err: unknown) {
        if (err instanceof TRPCError) throw err;

        const pgError = err as { code?: string; message?: string };
        const isColumnMissing =
          pgError.code === "42703" ||
          (pgError.message &&
            pgError.message.includes("column") &&
            pgError.message.includes("does not exist"));

        if (isColumnMissing) {
          console.warn(
            `[getAddresses] Column 'addresses' does not exist on users table. Run migration to add JSONB column.`,
          );
          return { addresses: [] };
        }

        console.error(`[getAddresses] DB error for user ${userId}:`, pgError.message ?? err);
        return { addresses: [] };
      }
    }),

    updateAddresses: protectedProcedure
      .input(UpdateAddressesSchema)
      .mutation(async ({ input, ctx }) => {
        const userId = ctx.session!.userId;

        try {
          await db.execute(sql`
            UPDATE users
            SET addresses = ${JSON.stringify(input.addresses)}::json,
                updated_at = NOW()
            WHERE id = ${userId}
          `);
        } catch {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "ستون آدرس‌ها هنوز ایجاد نشده. لطفاً migration را اجرا کنید.",
          });
        }

        return { success: true, message: "آدرس‌ها با موفقیت به‌روزرسانی شد" };
      }),
  });
}
