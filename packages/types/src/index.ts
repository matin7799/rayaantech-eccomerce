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
// ─── AI Config Contracts ─────────────────────────────────────────────────────
export {
  type AiConfig,
  aiConfigSchema,
  type AiConfigUpdate,
  aiConfigUpdateSchema,
  AVALAI_CHAT_MODELS,
  AVALAI_EMBEDDING_MODELS,
  DEFAULT_AI_CONFIG,
} from "./ai-config.schemas.js";
export { type AvalAiModelEntry, AVALAI_ALL_MODELS } from "./avalai-models.generated.js";
export {
  type CheckAccountInput,
  CheckAccountSchema,
  type CompleteProfileInput,
  CompleteProfileSchema,
  type PartnerRegisterInput,
  PartnerRegisterSchema,
  type RetailRegisterInput,
  RetailRegisterSchema,
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
