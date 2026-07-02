import { z } from "zod";

/**
 * Iranian mobile number format: 09XXXXXXXXX (11 digits).
 */
const iranianMobileRegex = /^09\d{9}$/;

/**
 * Schema for dispatching an OTP code to a user's mobile number.
 */
export const UserOtpDispatchSchema = z.object({
  mobile: z
    .string()
    .regex(iranianMobileRegex, "شماره موبایل نامعتبر است")
    .describe("Iranian mobile number (09XXXXXXXXX)"),
});

export type UserOtpDispatchInput = z.infer<typeof UserOtpDispatchSchema>;

/**
 * Schema for verifying an OTP code.
 */
export const UserOtpVerifySchema = z.object({
  mobile: z.string().regex(iranianMobileRegex, "شماره موبایل نامعتبر است"),
  code: z
    .string()
    .length(5, "کد تایید باید ۵ رقم باشد")
    .regex(/^\d{5}$/, "کد تایید فقط شامل اعداد است"),
});

export type UserOtpVerifyInput = z.infer<typeof UserOtpVerifySchema>;

/**
 * Schema for password-based login.
 */
export const UserPasswordLoginSchema = z.object({
  mobile: z.string().regex(iranianMobileRegex, "شماره موبایل نامعتبر است"),
  password: z.string().min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد"),
});

export type UserPasswordLoginInput = z.infer<typeof UserPasswordLoginSchema>;

/**
 * Schema for B2B partner (wholesale companion) registration.
 *
 * Fields:
 * - mobile: Iranian mobile for OTP verification
 * - fullName: Partner's full legal name
 * - workplaceName: Business/workplace name (محل کار)
 * - experience: Years of experience or seniority description (سابقه کاری)
 * - documentUrl: Uploaded business license/document URL (optional at submission, required for approval)
 */
export const PartnerRegisterSchema = z.object({
  mobile: z.string().regex(iranianMobileRegex, "شماره موبایل نامعتبر است"),
  code: z
    .string()
    .length(5, "کد تایید باید ۵ رقم باشد")
    .regex(/^\d{5}$/, "کد تایید فقط شامل اعداد است"),
  fullName: z.string().min(3, "نام و نام خانوادگی الزامی است").max(100, "نام بیش از حد طولانی است"),
  workplaceName: z
    .string()
    .min(2, "نام محل کار الزامی است")
    .max(150, "نام محل کار بیش از حد طولانی است"),
  experience: z
    .string()
    .min(1, "سابقه کاری الزامی است")
    .max(500, "توضیحات سابقه بیش از حد طولانی است"),
  documentUrl: z.string().url("آدرس فایل نامعتبر است").optional(),
});

export type PartnerRegisterInput = z.infer<typeof PartnerRegisterSchema>;

/**
 * Schema for completing user profile after first OTP login (onboarding gate).
 *
 * Fields:
 * - fullName: User's display name
 * - email: Optional email for notifications
 * - password: Optional secure password to enable dual-auth (OTP + password)
 */
export const CompleteProfileSchema = z.object({
  fullName: z.string().min(3, "نام و نام خانوادگی الزامی است").max(100, "نام بیش از حد طولانی است"),
  email: z.string().email("ایمیل نامعتبر است").optional().or(z.literal("")),
  password: z.string().min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد").optional().or(z.literal("")),
});

export type CompleteProfileInput = z.infer<typeof CompleteProfileSchema>;
