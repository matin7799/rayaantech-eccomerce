// ─── Auth Contracts ──────────────────────────────────────────────────────────

// ─── Addon Contracts ─────────────────────────────────────────────────────────
export {
  CartItemAddonSelectionSchema,
  type CheckoutItemWithAddons,
  CheckoutItemWithAddonsSchema,
  type ProductAddon,
  ProductAddonSchema,
} from "./addon.schemas.js";

// ─── AI Consultation Contracts ───────────────────────────────────────────────
export {
  type AiChatMessage,
  type AiMatchedProduct,
  type AiRateLimitError,
  type AiStreamChunk,
  aiChatMessageSchema,
  type TextQueryInput,
  textQuerySchema,
} from "./ai.schemas.js";
export {
  type CompleteProfileInput,
  CompleteProfileSchema,
  type PartnerRegisterInput,
  PartnerRegisterSchema,
  type UserOtpDispatchInput,
  UserOtpDispatchSchema,
  type UserOtpVerifyInput,
  UserOtpVerifySchema,
  type UserPasswordLoginInput,
  UserPasswordLoginSchema,
} from "./auth.schemas.js";

// ─── Installment Contracts ───────────────────────────────────────────────────
export {
  type InstallmentCalculationInput,
  InstallmentCalculationSchema,
  type InstallmentEvaluationResult,
  type InstallmentLineResult,
} from "./installment.schemas.js";
// ─── Product Contracts ───────────────────────────────────────────────────────
export {
  type CreateProductInput,
  CreateProductSchema,
  type UpdateProductInput,
  UpdateProductSchema,
} from "./product.schemas.js";
