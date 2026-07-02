import { TRPCError } from "@trpc/server";
import { sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { z } from "zod";
import { protectedProcedure, router } from "../../trpc.init";
import { hashPassword, verifyPassword } from "./profile.crypto";
import type { AddressEntry, ProfileRow } from "./profile.types";

const UpdateProfileSchema = z.object({
  fullName: z.string().min(3, "نام و نام خانوادگی الزامی است").max(100, "نام بیش از حد طولانی است"),
  email: z.string().email("ایمیل نامعتبر است").optional().or(z.literal("")),
});

const UpdatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "رمز فعلی الزامی است"),
    newPassword: z
      .string()
      .min(8, "رمز جدید باید حداقل ۸ کاراکتر باشد")
      .max(128, "رمز عبور بیش از حد طولانی است"),
    confirmPassword: z.string().min(1, "تکرار رمز الزامی است"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "رمز جدید و تکرار آن یکسان نیستند",
    path: ["confirmPassword"],
  });

export function createProfileInfoRouter(db: NodePgDatabase) {
  return router({
    /* ─── Account ─── */

    getProfile: protectedProcedure.query(async ({ ctx }) => {
      const userId = ctx.session!.userId;

      const result = await db.execute<ProfileRow>(sql`
        SELECT id, full_name, email, mobile, role, wholesale_status, rayan_coins, created_at
        FROM users WHERE id = ${userId} LIMIT 1
      `);

      const user = result.rows[0];
      if (!user) return { profile: null };

      // Query optional columns (addresses, pwa_bonus_claimed)
      let addresses: AddressEntry[] = [];
      let pwaBonusClaimed = false;
      try {
        const extraResult = await db.execute<{
          addresses: AddressEntry[] | null;
          pwa_bonus_claimed: boolean;
        }>(sql`
          SELECT
            COALESCE(addresses, '[]'::json) AS addresses,
            COALESCE(pwa_bonus_claimed, false) AS pwa_bonus_claimed
          FROM users WHERE id = ${userId} LIMIT 1
        `);
        if (extraResult.rows[0]) {
          addresses = Array.isArray(extraResult.rows[0].addresses)
            ? extraResult.rows[0].addresses
            : [];
          pwaBonusClaimed = extraResult.rows[0].pwa_bonus_claimed;
        }
      } catch (err: unknown) {
        const pgError = err as { code?: string; message?: string };
        if (pgError.code === "42703") {
          console.warn("[getProfile] addresses/pwa_bonus_claimed columns missing — run migration");
        } else {
          console.error("[getProfile] Error fetching extra columns:", pgError.message ?? err);
        }
      }

      return {
        profile: {
          id: user.id,
          fullName: user.full_name,
          email: user.email,
          mobile: user.mobile,
          role: user.role,
          wholesaleStatus: user.wholesale_status,
          rayanCoins: user.rayan_coins,
          addresses,
          pwaBonusClaimed,
          createdAt: user.created_at,
        },
      };
    }),

    updateProfile: protectedProcedure
      .input(UpdateProfileSchema)
      .mutation(async ({ input, ctx }) => {
        const userId = ctx.session!.userId;

        await db.execute(sql`
          UPDATE users
          SET full_name = ${input.fullName},
              email = ${input.email || null},
              updated_at = NOW()
          WHERE id = ${userId}
        `);

        return { success: true, message: "اطلاعات پروفایل با موفقیت به‌روزرسانی شد" };
      }),

    /* ─── Loyalty / PWA Bonus ─── */

    claimPwaBonus: protectedProcedure.mutation(async ({ ctx }) => {
      const userId = ctx.session!.userId;

      try {
        // Check if already claimed (idempotent)
        const check = await db.execute<{ pwa_bonus_claimed: boolean }>(sql`
          SELECT COALESCE(pwa_bonus_claimed, false) AS pwa_bonus_claimed
          FROM users WHERE id = ${userId} LIMIT 1
        `);

        if (check.rows[0]?.pwa_bonus_claimed) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "امتیاز نصب PWA قبلاً دریافت شده است",
          });
        }

        // Award +50 coins and mark as claimed (atomic)
        await db.execute(sql`
          UPDATE users
          SET rayan_coins = rayan_coins + 50,
              pwa_bonus_claimed = true,
              updated_at = NOW()
          WHERE id = ${userId} AND COALESCE(pwa_bonus_claimed, false) = false
        `);
      } catch (err) {
        if (err instanceof TRPCError) throw err;
        // Column doesn't exist yet — fall back to just incrementing coins
        await db.execute(sql`
          UPDATE users
          SET rayan_coins = rayan_coins + 50,
              updated_at = NOW()
          WHERE id = ${userId}
        `);
      }

      return { success: true, awarded: 50, message: "+۵۰ رایان کوین به حساب شما اضافه شد" };
    }),

    /* ─── Security / Password ─── */

    updatePassword: protectedProcedure
      .input(UpdatePasswordSchema)
      .mutation(async ({ input, ctx }) => {
        const userId = ctx.session!.userId;

        // Fetch current password hash
        const result = await db.execute<{ password_hash: string | null }>(sql`
          SELECT password_hash FROM users WHERE id = ${userId} LIMIT 1
        `);

        const user = result.rows[0];
        if (!user) {
          throw new TRPCError({ code: "NOT_FOUND", message: "کاربر یافت نشد" });
        }

        // If user has a password set, verify the current one
        if (user.password_hash) {
          const isValid = await verifyPassword(input.currentPassword, user.password_hash);
          if (!isValid) {
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "رمز عبور فعلی نادرست است",
            });
          }
        }

        // Hash and store the new password
        const newHash = await hashPassword(input.newPassword);
        await db.execute(sql`
          UPDATE users
          SET password_hash = ${newHash},
              updated_at = NOW()
          WHERE id = ${userId}
        `);

        return { success: true, message: "رمز عبور با موفقیت تغییر کرد" };
      }),
  });
}
