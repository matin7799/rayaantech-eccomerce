import { z } from "zod";

/**
 * Integer Rial price: must be a non-negative whole number string.
 * Database stores as numeric(12, 0).
 */
const rialPriceSchema = z
  .string()
  .regex(/^\d+$/, "قیمت باید عدد صحیح باشد (تومان)")
  .refine((v) => parseInt(v, 10) >= 0, "قیمت نمی‌تواند منفی باشد");

/**
 * Product grade enum values matching the DB enum.
 */
const productGradeValues = ["open_box", "stock", "refurbished", "like_new", "used"] as const;

/**
 * Variant attribute binding.
 */
const variantAttributeSchema = z.object({
  valueId: z.string().uuid("شناسه مقدار ویژگی نامعتبر است"),
});

/**
 * Variant (SKU) creation schema.
 */
const createVariantSchema = z.object({
  sku: z.string().min(1, "SKU الزامی است").max(128),
  stock: z.number().int().min(0, "موجودی نمی‌تواند منفی باشد"),
  priceModifier: rialPriceSchema.optional().default("0"),
  attributes: z.array(variantAttributeSchema).default([]),
});

/**
 * Schema for creating a product via the API.
 * All prices are integer Rial strings — no fractional digits.
 */
export const CreateProductSchema = z.object({
  name: z.string().min(1).max(512),
  slug: z
    .string()
    .min(1)
    .max(512)
    .regex(/^[a-z0-9-]+$/, "Slug فقط شامل حروف کوچک، اعداد و خط تیره"),
  description: z.string().optional(),
  primaryCategoryId: z.string().uuid(),
  brandId: z.string().uuid().optional(),
  grade: z.enum(productGradeValues).default("stock"),
  basePrice: rialPriceSchema,
  wholesalePrice: rialPriceSchema.optional(),
  torobPrice: rialPriceSchema.optional(),
  discountedPrice: rialPriceSchema.optional(),
  campaignPrice: rialPriceSchema.optional(),
  campaignStartAt: z.string().datetime().optional(),
  campaignEndAt: z.string().datetime().optional(),
  stock: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
  secondaryCategoryIds: z.array(z.string().uuid()).optional(),
  variants: z.array(createVariantSchema).optional(),
});

export type CreateProductInput = z.infer<typeof CreateProductSchema>;

/**
 * Schema for updating a product (all fields optional).
 */
export const UpdateProductSchema = CreateProductSchema.partial().omit({
  variants: true,
  secondaryCategoryIds: true,
});

export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
