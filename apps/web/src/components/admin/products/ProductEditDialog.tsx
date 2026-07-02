import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { trpc } from "../../../lib/trpc";
import { Button } from "../../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Spinner } from "../../ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { AttributesTab } from "./dialog/AttributesTab";
import { BasicInfoTab } from "./dialog/BasicInfoTab";
import { InventoryTab } from "./dialog/InventoryTab";
import { MediaTab } from "./dialog/MediaTab";
import { PricingTab } from "./dialog/PricingTab";
import { type ProductFormData, productFormSchema } from "./dialog/schema";
import type { ProductRow } from "./ProductAdminTable";

export interface ProductEditDialogProps {
  product: ProductRow | null; // Null means adding new product (mocked)
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  categories: { id: string; name: string; slug: string }[];
}

export function ProductEditDialog({
  product,
  open,
  onClose,
  onSuccess,
  categories,
}: ProductEditDialogProps) {
  const utils = trpc.useUtils();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      sku: "",
      shortDescription: "",
      description: "",
      basePrice: 0,
      wholesalePrice: undefined,
      discountedPrice: undefined,
      torobPrice: null,
      stock: 0,
      grade: "stock",
      isActive: true,
      primaryCategoryId: null,
      attributeValueIds: [],
      images: [],
    },
  });

  // Reset form values when product changes
  useEffect(() => {
    if (product) {
      reset({
        id: product.id,
        name: product.name,
        slug: product.slug,
        sku: product.sku || "",
        shortDescription: product.shortDescription || "",
        description: product.description || "",
        basePrice: product.basePrice,
        wholesalePrice: product.wholesalePrice ?? undefined,
        discountedPrice: product.discountedPrice ?? undefined,
        torobPrice: product.torobPrice ?? null,
        stock: product.stock,
        grade: (product.grade as any) || "stock",
        isActive: product.isActive,
        primaryCategoryId: product.primaryCategoryId ?? null,
        attributeValueIds: product.attributeValueIds || [],
        images: product.thumbnailUrl ? [product.thumbnailUrl] : [],
      });
    } else {
      reset({
        name: "",
        slug: "",
        sku: "",
        shortDescription: "",
        description: "",
        basePrice: 0,
        wholesalePrice: undefined,
        discountedPrice: undefined,
        torobPrice: null,
        stock: 0,
        grade: "stock",
        isActive: true,
        primaryCategoryId: null,
        attributeValueIds: [],
        images: [],
      });
    }
  }, [product, reset]);

  const updateMutation = trpc.admin.fullUpdateProduct.useMutation({
    onSuccess: () => {
      toast.success("تغییرات محصول با موفقیت ذخیره شد");
      utils.admin.listProducts.invalidate();
      onSuccess();
      onClose();
    },
    onError: (error) => {
      toast.error(`خطا در ذخیره تغییرات: ${error.message || "خطای ناشناخته سرور"}`);
    },
  });

  const handleNameChange = (name: string) => {
    // Generate Farsi-safe URL slug automatically when name changes
    const generated = name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\u0600-\u06FF\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
    setValue("slug", generated, { shouldDirty: true, shouldValidate: true });
  };

  const onSubmit = async (data: ProductFormData) => {
    if (!product) {
      toast.info("قابلیت افزودن محصول جدید در این نسخه فعال نیست");
      onClose();
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id: product.id,
        name: data.name,
        slug: data.slug,
        sku: data.sku,
        shortDescription: data.shortDescription || "",
        description: data.description || "",
        basePrice: data.basePrice,
        wholesalePrice: data.wholesalePrice,
        discountedPrice: data.discountedPrice,
        torobPrice: data.torobPrice,
        stock: data.stock,
        grade: data.grade,
        isActive: data.isActive,
        primaryCategoryId: data.primaryCategoryId,
        attributeValueIds: data.attributeValueIds,
      });
    } catch (e) {
      // Errors are caught and handled by onError in mutation hook
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
    >
      <DialogContent
        className="sm:max-w-5xl w-full bg-surface/90 border border-border/50 backdrop-blur-md overflow-hidden rounded-2xl flex flex-col h-[90vh] md:h-[85vh] p-0"
        showCloseButton={true}
      >
        <DialogHeader className="p-6 border-b border-border/30 rtl text-right">
          <DialogTitle className="text-lg font-bold text-text-primary">
            {product ? `ویرایش محصول — ${product.name}` : "افزودن محصول جدید"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-hidden flex flex-col">
          {/* Scrollable Tabs Section */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <Tabs defaultValue="basic-info" className="w-full flex flex-col gap-4">
              <TabsList
                variant="default"
                className="w-full grid grid-cols-5 bg-surface-secondary/50 rounded-xl p-1"
              >
                <TabsTrigger value="basic-info" className="text-xs cursor-pointer py-1.5">
                  اطلاعات پایه
                </TabsTrigger>
                <TabsTrigger value="pricing" className="text-xs cursor-pointer py-1.5">
                  قیمت‌گذاری پویا
                </TabsTrigger>
                <TabsTrigger value="inventory" className="text-xs cursor-pointer py-1.5">
                  انبار و طبقه‌بندی
                </TabsTrigger>
                <TabsTrigger value="attributes" className="text-xs cursor-pointer py-1.5">
                  ویژگی‌ها
                </TabsTrigger>
                <TabsTrigger value="media" className="text-xs cursor-pointer py-1.5">
                  رسانه‌ها
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basic-info" className="mt-2 outline-none">
                <BasicInfoTab register={register} errors={errors} onNameChange={handleNameChange} />
              </TabsContent>

              <TabsContent value="pricing" className="mt-2 outline-none">
                <PricingTab register={register} errors={errors} watch={watch} />
              </TabsContent>

              <TabsContent value="inventory" className="mt-2 outline-none">
                <InventoryTab
                  register={register}
                  errors={errors}
                  watch={watch}
                  setValue={setValue}
                  categories={categories}
                />
              </TabsContent>

              <TabsContent value="attributes" className="mt-2 outline-none">
                <AttributesTab watch={watch} setValue={setValue} />
              </TabsContent>

              <TabsContent value="media" className="mt-2 outline-none">
                <MediaTab watch={watch} setValue={setValue} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Form Actions Footer */}
          <div className="p-4 border-t border-border/30 bg-muted/30 flex items-center justify-end gap-3 rtl">
            <Button
              variant="outline"
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="cursor-pointer text-xs rounded-xl"
            >
              انصراف
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !isDirty}
              className="relative cursor-pointer bg-accent hover:bg-accent/90 text-white rounded-xl text-xs gap-2 min-w-[90px]"
            >
              {isSubmitting ? (
                <>
                  <Spinner className="text-white" />
                  <span>ذخیره...</span>
                </>
              ) : (
                <span>ذخیره تغییرات</span>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
