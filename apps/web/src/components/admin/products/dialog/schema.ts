import { z } from "zod";

export const productFormSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(3, "نام محصول باید حداقل ۳ کاراکتر باشد"),
  slug: z.string().min(3, "اسلاگ باید حداقل ۳ کاراکتر باشد"),
  sku: z.string().min(3, "SKU باید حداقل ۳ کاراکتر باشد"),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  basePrice: z.number().int().min(1000, "قیمت عمومی باید حداقل ۱,۰۰۰ تومان باشد"),
  wholesalePrice: z.number().int().optional(),
  discountedPrice: z.number().int().optional(),
  torobPrice: z.number().int().nullable().optional(),
  stock: z.number().int().min(0, "موجودی انبار نمی‌تواند منفی باشد"),
  grade: z.enum(["open_box", "stock", "refurbished", "like_new", "used"]),
  isActive: z.boolean().default(true),
  primaryCategoryId: z.string().uuid().nullable().optional(),
  attributeValueIds: z.array(z.string().uuid()).default([]),
  images: z.array(z.string()).default([]),
});

export type ProductFormData = z.infer<typeof productFormSchema>;
