import { Inject, Injectable } from "@nestjs/common";
import { TRPCError } from "@trpc/server";
import { sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { DRIZZLE_CLIENT } from "../database/database.constants";

/**
 * UserService handles business logic and DB transactions related to users.
 */
@Injectable()
export class UserService {
  constructor(
    @Inject(DRIZZLE_CLIENT)
    private readonly db: NodePgDatabase,
  ) {}

  /**
   * Idempotently claims the PWA installation loyalty points bonus (50 coins) for a user.
   * Increments the user's coins and sets pwa_bonus_claimed to true atomically.
   */
  async claimPwaBonus(userId: string): Promise<{ success: boolean; coinsAwarded: number }> {
    return await this.db.transaction(async (tx) => {
      // 1. Fetch user to check if already claimed
      const checkResult = await tx.execute<{ pwa_bonus_claimed: boolean }>(sql`
        SELECT COALESCE(pwa_bonus_claimed, false) AS pwa_bonus_claimed
        FROM users WHERE id = ${userId} LIMIT 1
      `);

      const user = checkResult.rows[0];
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "کاربر یافت نشد",
        });
      }

      if (user.pwa_bonus_claimed) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "امتیاز نصب PWA قبلاً دریافت شده است",
        });
      }

      // 2. Perform the atomic update ensuring double-check on pwa_bonus_claimed flag
      const result = await tx.execute<{ id: string }>(sql`
        UPDATE users
        SET rayan_coins = rayan_coins + 50,
            pwa_bonus_claimed = true,
            updated_at = NOW()
        WHERE id = ${userId} AND COALESCE(pwa_bonus_claimed, false) = false
        RETURNING id
      `);

      if (result.rows.length === 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "امتیاز نصب PWA قبلاً دریافت شده است",
        });
      }

      return { success: true, coinsAwarded: 50 };
    });
  }
}
