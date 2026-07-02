import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import {
  CompleteProfileSchema,
  PartnerRegisterSchema,
  UserOtpDispatchSchema,
  UserOtpVerifySchema,
  UserPasswordLoginSchema,
} from "@rayan-tech/types";
import { TRPCError } from "@trpc/server";
import { sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { OtpService } from "../../auth/services/otp.service";
import type { SessionService } from "../../auth/services/session.service";
import { protectedProcedure, publicProcedure, router } from "../trpc.init";

const scryptAsync = promisify(scrypt);

/**
 * Hash a password with a random salt using scrypt (Node.js built-in).
 * Returns format: salt:hash (both hex-encoded).
 */
async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${derived.toString("hex")}`;
}

/**
 * Verify a password against a stored salt:hash string.
 * Uses timing-safe comparison to prevent timing attacks.
 */
async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [salt, hash] = stored.split(":");
  if (!(salt && hash)) return false;
  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  const storedBuffer = Buffer.from(hash, "hex");
  return timingSafeEqual(derived, storedBuffer);
}

/**
 * Auth tRPC router factory.
 * Requires OtpService, SessionService, and DB injected from NestJS DI.
 */
export function createAuthRouter(
  otpService: OtpService,
  sessionService: SessionService,
  db?: NodePgDatabase,
) {
  return router({
    /**
     * Dispatch OTP code to mobile number.
     */
    sendOtp: publicProcedure.input(UserOtpDispatchSchema).mutation(async ({ input }) => {
      await otpService.dispatch(input.mobile);
      return { success: true, message: "کد تایید ارسال شد" };
    }),

    /**
     * Verify OTP and create session (B2C retail login).
     * Returns isNewUser flag for onboarding gate routing.
     */
    verifyOtp: publicProcedure.input(UserOtpVerifySchema).mutation(async ({ input, ctx }) => {
      await otpService.verify(input.mobile, input.code);
      const session = await sessionService.createSession(input.mobile, ctx.res);
      return {
        success: true,
        isNewUser: session.isNewUser,
        user: {
          userId: session.userId,
          mobile: session.mobile,
          role: session.role,
          wholesaleStatus: session.wholesaleStatus,
        },
      };
    }),

    /**
     * Password-based login — authenticate with mobile + password.
     * Returns isNewUser: false (password users have already onboarded).
     */
    loginWithPassword: publicProcedure
      .input(UserPasswordLoginSchema)
      .mutation(async ({ input, ctx }) => {
        if (!db) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "سرویس در دسترس نیست" });
        }

        // Lookup user by mobile
        const result = await db.execute<{
          id: string;
          password_hash: string | null;
          mobile: string;
          role: string;
          wholesale_status: string;
        }>(sql`
          SELECT id, password_hash, mobile, role, wholesale_status
          FROM users WHERE mobile = ${input.mobile} LIMIT 1
        `);

        const user = result.rows[0];
        if (!(user && user.password_hash)) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "شماره موبایل یا رمز عبور نادرست است",
          });
        }

        // Verify password
        const isValid = await verifyPassword(input.password, user.password_hash);
        if (!isValid) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "شماره موبایل یا رمز عبور نادرست است",
          });
        }

        // Create session
        const session = await sessionService.createSession(input.mobile, ctx.res);

        return {
          success: true,
          isNewUser: false,
          user: {
            userId: session.userId,
            mobile: session.mobile,
            role: session.role,
            wholesaleStatus: session.wholesaleStatus,
          },
        };
      }),

    /**
     * Complete user profile (onboarding gate — skippable).
     * Updates fullName, email, and optionally sets password for dual-auth.
     */
    completeProfile: protectedProcedure
      .input(CompleteProfileSchema)
      .mutation(async ({ input, ctx }) => {
        if (!db) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "سرویس در دسترس نیست" });
        }

        const userId = ctx.session!.userId;

        // Hash password if provided (enables dual-auth: OTP + password)
        let passwordHash: string | null = null;
        if (input.password && input.password.length >= 8) {
          passwordHash = await hashPassword(input.password);
        }

        // Update user record
        if (passwordHash) {
          await db.execute(sql`
            UPDATE users
            SET full_name = ${input.fullName},
                email = ${input.email || null},
                password_hash = ${passwordHash},
                updated_at = NOW()
            WHERE id = ${userId}
          `);
        } else {
          await db.execute(sql`
            UPDATE users
            SET full_name = ${input.fullName},
                email = ${input.email || null},
                updated_at = NOW()
            WHERE id = ${userId}
          `);
        }

        return {
          success: true,
          message: "اطلاعات پروفایل با موفقیت ذخیره شد",
        };
      }),

    /**
     * B2B Partner Registration — verifies OTP then creates wholesale user
     * with pending approval status.
     */
    registerPartner: publicProcedure
      .input(PartnerRegisterSchema)
      .mutation(async ({ input, ctx }) => {
        // Step 1: Verify OTP
        await otpService.verify(input.mobile, input.code);

        // Step 2: Create partner user with pending wholesale status
        await sessionService.createPartnerUser({
          mobile: input.mobile,
          fullName: input.fullName,
          workplaceName: input.workplaceName,
          experience: input.experience,
          documentUrl: input.documentUrl,
        });

        // Step 3: Create session for the new partner
        const session = await sessionService.createSession(input.mobile, ctx.res);

        return {
          success: true,
          isNewUser: false,
          message: "ثبت‌نام شما با موفقیت انجام شد و در انتظار تأیید مدیریت می‌باشد",
          user: {
            userId: session.userId,
            mobile: session.mobile,
            role: session.role,
            wholesaleStatus: session.wholesaleStatus,
          },
        };
      }),

    /**
     * Get current session (returns null if not authenticated).
     */
    me: publicProcedure.query(({ ctx }) => {
      return { session: ctx.session };
    }),

    /**
     * Logout — destroy session and clear cookie.
     */
    logout: protectedProcedure.mutation(async ({ ctx }) => {
      await sessionService.destroySession(ctx.req, ctx.res);
      return { success: true };
    }),
  });
}

export type AuthRouter = ReturnType<typeof createAuthRouter>;
