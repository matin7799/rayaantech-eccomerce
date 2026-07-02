import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { AnimatePresence, motion } from "framer-motion";
import { FilmIcon, ImageIcon, NewspaperIcon, PlusIcon, XIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { DataTable } from "../../components/admin/DataTable";
import { MediaPickerModal } from "../../components/admin/MediaPickerModal";
import { Button } from "../../components/ui/button";
import { Skeleton } from "../../components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { trpc } from "../../lib/trpc";

export const Route = createFileRoute("/admin/content")({
  component: ContentHub,
});

/**
 * Content & Media Control Hub — Real Data Binding
 *
 * - Blogs: trpc.admin.listBlogPosts.useQuery()
 * - Stories: trpc.admin.listStories.useQuery()
 * - Banners: trpc.admin.listBanners.useQuery()
 * - MediaPickerModal for image/media URL fields
 * - React Hook Form + Zod for create forms
 * - Zero mock data
 */

/* ─── Zod Schemas ─── */

const blogPostSchema = z.object({
  title: z.string().min(3, "عنوان حداقل ۳ کاراکتر"),
  slug: z
    .string()
    .min(3, "اسلاگ حداقل ۳ کاراکتر")
    .regex(/^[a-z0-9-]+$/, "فقط حروف انگلیسی، اعداد و خط تیره"),
  content: z.string().min(10, "محتوا حداقل ۱۰ کاراکتر"),
  excerpt: z.string().optional(),
  coverImageUrl: z.string().url("آدرس تصویر معتبر نیست").optional().or(z.literal("")),
  isPublished: z.boolean(),
});

const storySchema = z.object({
  title: z.string().min(2, "عنوان حداقل ۲ کاراکتر"),
  mediaUrl: z.string().url("آدرس رسانه معتبر نیست"),
  productId: z.string().optional().or(z.literal("")),
  isActive: z.boolean(),
});

const bannerSchema = z.object({
  title: z.string().min(2, "عنوان حداقل ۲ کاراکتر"),
  imageUrl: z.string().url("آدرس تصویر معتبر نیست"),
  linkUrl: z.string().url("آدرس لینک معتبر نیست").optional().or(z.literal("")),
  placementKey: z.string().min(1, "کلید جایگاه الزامی است"),
  displayOrder: z.number().int().min(0),
  isActive: z.boolean(),
});

type BlogPostFormData = z.infer<typeof blogPostSchema>;
type StoryFormData = z.infer<typeof storySchema>;
type BannerFormData = z.infer<typeof bannerSchema>;

/* ─── Types ─── */

interface BlogRow {
  id: string;
  title: string;
  slug: string;
  isPublished: boolean;
  coverImageUrl: string | null;
  createdAt: string;
}
interface StoryRow {
  id: string;
  title: string;
  mediaUrl: string;
  isActive: boolean;
  expiresAt: string;
}
interface BannerRow {
  id: string;
  title: string;
  imageUrl: string;
  displayOrder: number;
  isActive: boolean;
}

/* ─── Types ─── */

interface BlogRow {
  id: string;
  title: string;
  slug: string;
  isPublished: boolean;
  coverImageUrl: string | null;
  createdAt: string;
}
interface StoryRow {
  id: string;
  title: string;
  mediaUrl: string;
  isActive: boolean;
  expiresAt: string;
}
interface BannerRow {
  id: string;
  title: string;
  imageUrl: string;
  displayOrder: number;
  isActive: boolean;
}

/* ─── Column Definitions ─── */

const blogColumns: ColumnDef<BlogRow, unknown>[] = [
  {
    accessorKey: "title",
    header: "عنوان",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        {row.original.coverImageUrl && (
          <img
            src={row.original.coverImageUrl}
            alt=""
            className="h-8 w-12 shrink-0 rounded-lg object-cover"
            style={{ aspectRatio: "3 / 2" }}
          />
        )}
        <span className="font-medium text-text-primary">{row.original.title}</span>
      </div>
    ),
  },
  {
    accessorKey: "slug",
    header: "اسلاگ",
    cell: ({ row }) => (
      <code className="text-[11px] text-text-muted" dir="ltr">
        /{row.original.slug}
      </code>
    ),
  },
  {
    accessorKey: "isPublished",
    header: "وضعیت",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span
          className={`h-2 w-2 rounded-full ${row.original.isPublished ? "bg-success" : "bg-warning"}`}
        />
        <span className="text-xs text-text-secondary">
          {row.original.isPublished ? "منتشر شده" : "پیش‌نویس"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "تاریخ",
    cell: ({ row }) => <span className="text-xs text-text-muted">{row.original.createdAt}</span>,
  },
];

const storyColumns: ColumnDef<StoryRow, unknown>[] = [
  {
    accessorKey: "title",
    header: "عنوان",
    cell: ({ row }) => <span className="font-medium text-text-primary">{row.original.title}</span>,
  },
  {
    accessorKey: "isActive",
    header: "وضعیت",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span
          className={`h-2 w-2 rounded-full ${row.original.isActive ? "bg-success" : "bg-text-muted"}`}
        />
        <span className="text-xs text-text-secondary">
          {row.original.isActive ? "فعال" : "غیرفعال"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "expiresAt",
    header: "انقضا",
    cell: ({ row }) => <span className="text-xs text-text-muted">{row.original.expiresAt}</span>,
  },
];

const bannerColumns: ColumnDef<BannerRow, unknown>[] = [
  {
    accessorKey: "title",
    header: "عنوان",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <img
          src={row.original.imageUrl}
          alt=""
          className="h-8 w-16 shrink-0 rounded-lg object-cover"
          style={{ aspectRatio: "2 / 1" }}
        />
        <span className="font-medium text-text-primary">{row.original.title}</span>
      </div>
    ),
  },
  {
    accessorKey: "displayOrder",
    header: "ترتیب",
    cell: ({ row }) => (
      <span className="text-xs text-text-secondary">
        {row.original.displayOrder.toLocaleString("fa-IR")}
      </span>
    ),
  },
  {
    accessorKey: "isActive",
    header: "وضعیت",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span
          className={`h-2 w-2 rounded-full ${row.original.isActive ? "bg-success" : "bg-text-muted"}`}
        />
        <span className="text-xs text-text-secondary">
          {row.original.isActive ? "فعال" : "غیرفعال"}
        </span>
      </div>
    ),
  },
];

/* ─── Placement Key Options ─── */

const PLACEMENT_KEYS = [
  { value: "home_hero_slider", label: "هیرو اسلایدر صفحه اصلی" },
  { value: "home_dual_grid_left", label: "گرید دوتایی — چپ" },
  { value: "home_dual_grid_right", label: "گرید دوتایی — راست" },
  { value: "pdp_sidebar", label: "سایدبار صفحه محصول" },
  { value: "category_header", label: "هدر دسته‌بندی" },
];

/* ─── Main Component ─── */

function ContentHub() {
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [showStoryForm, setShowStoryForm] = useState(false);
  const [showBannerForm, setShowBannerForm] = useState(false);

  // Real tRPC queries — switch per active tab
  const blogsQuery = trpc.admin.listBlogPosts.useQuery();
  const storiesQuery = trpc.admin.listStories.useQuery();
  const bannersQuery = trpc.admin.listBanners.useQuery();

  const blogs = (blogsQuery.data?.posts ?? []) as BlogRow[];
  const stories = (storiesQuery.data?.stories ?? []) as StoryRow[];
  const banners = (bannersQuery.data?.banners ?? []) as BannerRow[];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-[30px] font-semibold leading-9 text-text-primary">محتوا و رسانه</h1>
        <p className="text-sm text-text-muted">
          مدیریت بلاگ، استوری‌های خریدپذیر و بنرهای صفحه اصلی
        </p>
      </div>

      {/* Tabbed Interface */}
      <Tabs defaultValue="blogs" className="flex flex-col gap-4">
        <TabsList className="w-fit">
          <TabsTrigger value="blogs" className="gap-1.5 text-xs">
            <NewspaperIcon className="h-3.5 w-3.5" />
            بلاگ
          </TabsTrigger>
          <TabsTrigger value="stories" className="gap-1.5 text-xs">
            <FilmIcon className="h-3.5 w-3.5" />
            استوری
          </TabsTrigger>
          <TabsTrigger value="banners" className="gap-1.5 text-xs">
            <ImageIcon className="h-3.5 w-3.5" />
            بنرها
          </TabsTrigger>
        </TabsList>

        {/* Blog Tab */}
        <TabsContent value="blogs" className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            {blogsQuery.isLoading ? (
              <Skeleton className="h-5 w-20" />
            ) : (
              <span className="text-sm font-medium text-text-secondary">
                {blogs.length.toLocaleString("fa-IR")} مطلب
              </span>
            )}
            <Button size="sm" className="gap-2" onClick={() => setShowBlogForm(true)}>
              <PlusIcon className="h-4 w-4" />
              مطلب جدید
            </Button>
          </div>
          {blogsQuery.isLoading ? (
            <TableSkeleton />
          ) : (
            <DataTable
              columns={blogColumns}
              data={blogs}
              searchKey="title"
              searchPlaceholder="جستجوی مطلب..."
            />
          )}
        </TabsContent>

        {/* Stories Tab */}
        <TabsContent value="stories" className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            {storiesQuery.isLoading ? (
              <Skeleton className="h-5 w-20" />
            ) : (
              <span className="text-sm font-medium text-text-secondary">
                {stories.length.toLocaleString("fa-IR")} استوری
              </span>
            )}
            <Button size="sm" className="gap-2" onClick={() => setShowStoryForm(true)}>
              <PlusIcon className="h-4 w-4" />
              استوری جدید
            </Button>
          </div>
          {storiesQuery.isLoading ? (
            <TableSkeleton />
          ) : (
            <DataTable
              columns={storyColumns}
              data={stories}
              searchKey="title"
              searchPlaceholder="جستجوی استوری..."
            />
          )}
        </TabsContent>

        {/* Banners Tab */}
        <TabsContent value="banners" className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            {bannersQuery.isLoading ? (
              <Skeleton className="h-5 w-20" />
            ) : (
              <span className="text-sm font-medium text-text-secondary">
                {banners.length.toLocaleString("fa-IR")} بنر
              </span>
            )}
            <Button size="sm" className="gap-2" onClick={() => setShowBannerForm(true)}>
              <PlusIcon className="h-4 w-4" />
              بنر جدید
            </Button>
          </div>
          {bannersQuery.isLoading ? (
            <TableSkeleton />
          ) : (
            <DataTable
              columns={bannerColumns}
              data={banners}
              searchKey="title"
              searchPlaceholder="جستجوی بنر..."
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Form Modals */}
      <AnimatePresence>
        {showBlogForm && (
          <BlogFormModal
            onClose={() => setShowBlogForm(false)}
            onSuccess={() => blogsQuery.refetch()}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showStoryForm && (
          <StoryFormModal
            onClose={() => setShowStoryForm(false)}
            onSuccess={() => storiesQuery.refetch()}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showBannerForm && (
          <BannerFormModal
            onClose={() => setShowBannerForm(false)}
            onSuccess={() => bannersQuery.refetch()}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-12 rounded-xl" />
      ))}
    </div>
  );
}

/* ─── Blog Form Modal + MediaPicker ─── */

function BlogFormModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: { isPublished: false, coverImageUrl: "" },
  });

  const coverUrl = watch("coverImageUrl");
  const createMutation = trpc.admin.createBlogPost.useMutation({
    onSuccess: () => {
      toast.success("مطلب با موفقیت ذخیره شد");
      onSuccess();
      onClose();
    },
    onError: () => toast.error("خطا در ذخیره مطلب"),
  });

  const onSubmit = useCallback(
    (data: BlogPostFormData) => {
      createMutation.mutate(data);
    },
    [createMutation],
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ type: "spring", stiffness: 350, damping: 30 }}
        className="w-full max-w-2xl rounded-2xl border border-border bg-surface p-6 shadow-glass max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-base font-semibold text-text-primary">مطلب جدید</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-text-muted hover:bg-surface-secondary hover:text-text-primary"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField label="عنوان" error={errors.title?.message}>
            <input {...register("title")} className="form-input" placeholder="عنوان مطلب" />
          </FormField>
          <FormField label="اسلاگ (URL)" error={errors.slug?.message}>
            <input
              {...register("slug")}
              className="form-input"
              placeholder="my-blog-post"
              dir="ltr"
            />
          </FormField>
          <FormField label="تصویر کاور" error={errors.coverImageUrl?.message}>
            <div className="flex items-center gap-2">
              <input
                {...register("coverImageUrl")}
                className="form-input flex-1"
                placeholder="آدرس CDN تصویر"
                dir="ltr"
              />
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="shrink-0 gap-1"
                onClick={() => setMediaPickerOpen(true)}
              >
                <ImageIcon className="h-3.5 w-3.5" />
                انتخاب
              </Button>
            </div>
            {coverUrl && (
              <img
                src={coverUrl}
                alt=""
                className="mt-2 h-20 w-32 rounded-lg object-cover"
                style={{ aspectRatio: "3 / 2" }}
              />
            )}
          </FormField>
          <FormField label="خلاصه" error={errors.excerpt?.message}>
            <input
              {...register("excerpt")}
              className="form-input"
              placeholder="خلاصه مطلب (اختیاری)"
            />
          </FormField>
          <FormField label="محتوا" error={errors.content?.message}>
            <textarea
              {...register("content")}
              className="form-input min-h-32 resize-y"
              placeholder="متن کامل مطلب..."
            />
          </FormField>
          <label className="flex items-center gap-2 text-xs text-text-secondary">
            <input
              type="checkbox"
              {...register("isPublished")}
              className="h-4 w-4 rounded border-border accent-accent"
            />
            انتشار فوری
          </label>
          <Button type="submit" disabled={createMutation.isPending} className="mt-2">
            {createMutation.isPending ? "در حال ذخیره..." : "ذخیره مطلب"}
          </Button>
        </form>
      </motion.div>
      <MediaPickerModal
        open={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={(url) => {
          setValue("coverImageUrl", url);
          setMediaPickerOpen(false);
        }}
      />
    </motion.div>
  );
}

/* ─── Story Form Modal + MediaPicker ─── */

function StoryFormModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<StoryFormData>({
    resolver: zodResolver(storySchema),
    defaultValues: { isActive: true, mediaUrl: "" },
  });

  const createMutation = trpc.admin.createStory.useMutation({
    onSuccess: () => {
      toast.success("استوری ایجاد شد");
      onSuccess();
      onClose();
    },
    onError: () => toast.error("خطا در ایجاد استوری"),
  });

  const onSubmit = useCallback(
    (data: StoryFormData) => {
      createMutation.mutate(data);
    },
    [createMutation],
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ type: "spring", stiffness: 350, damping: 30 }}
        className="w-full max-w-lg rounded-2xl border border-border bg-surface p-6 shadow-glass"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-base font-semibold text-text-primary">استوری جدید</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-text-muted hover:bg-surface-secondary hover:text-text-primary"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField label="عنوان" error={errors.title?.message}>
            <input {...register("title")} className="form-input" placeholder="عنوان استوری" />
          </FormField>
          <FormField label="فایل رسانه (ویدیو/تصویر)" error={errors.mediaUrl?.message}>
            <div className="flex items-center gap-2">
              <input
                {...register("mediaUrl")}
                className="form-input flex-1"
                placeholder="آدرس CDN"
                dir="ltr"
              />
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="shrink-0 gap-1"
                onClick={() => setMediaPickerOpen(true)}
              >
                <ImageIcon className="h-3.5 w-3.5" />
                انتخاب
              </Button>
            </div>
          </FormField>
          <FormField label="شناسه محصول (اختیاری)" error={errors.productId?.message}>
            <input
              {...register("productId")}
              className="form-input"
              placeholder="UUID محصول مرتبط"
              dir="ltr"
            />
          </FormField>
          <label className="flex items-center gap-2 text-xs text-text-secondary">
            <input
              type="checkbox"
              {...register("isActive")}
              className="h-4 w-4 rounded border-border accent-accent"
            />
            فعال باشد
          </label>
          <Button type="submit" disabled={createMutation.isPending} className="mt-2">
            {createMutation.isPending ? "در حال ذخیره..." : "ایجاد استوری"}
          </Button>
        </form>
      </motion.div>
      <MediaPickerModal
        open={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={(url) => {
          setValue("mediaUrl", url);
          setMediaPickerOpen(false);
        }}
      />
    </motion.div>
  );
}

/* ─── Banner Form Modal + MediaPicker + Placement Key ─── */

function BannerFormModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BannerFormData>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      isActive: true,
      displayOrder: 0,
      imageUrl: "",
      placementKey: "home_hero_slider",
    },
  });

  const createMutation = trpc.admin.createBanner.useMutation({
    onSuccess: () => {
      toast.success("بنر ایجاد شد");
      onSuccess();
      onClose();
    },
    onError: () => toast.error("خطا در ایجاد بنر"),
  });

  const onSubmit = useCallback(
    (data: BannerFormData) => {
      createMutation.mutate(data);
    },
    [createMutation],
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ type: "spring", stiffness: 350, damping: 30 }}
        className="w-full max-w-lg rounded-2xl border border-border bg-surface p-6 shadow-glass"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-base font-semibold text-text-primary">بنر جدید</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-text-muted hover:bg-surface-secondary hover:text-text-primary"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField label="عنوان" error={errors.title?.message}>
            <input {...register("title")} className="form-input" placeholder="عنوان بنر" />
          </FormField>
          <FormField label="جایگاه نمایش" error={errors.placementKey?.message}>
            <select {...register("placementKey")} className="form-input">
              {PLACEMENT_KEYS.map((pk) => (
                <option key={pk.value} value={pk.value}>
                  {pk.label}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="تصویر بنر" error={errors.imageUrl?.message}>
            <div className="flex items-center gap-2">
              <input
                {...register("imageUrl")}
                className="form-input flex-1"
                placeholder="آدرس CDN تصویر"
                dir="ltr"
              />
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="shrink-0 gap-1"
                onClick={() => setMediaPickerOpen(true)}
              >
                <ImageIcon className="h-3.5 w-3.5" />
                انتخاب
              </Button>
            </div>
          </FormField>
          <FormField label="لینک مقصد (اختیاری)" error={errors.linkUrl?.message}>
            <input
              {...register("linkUrl")}
              className="form-input"
              placeholder="https://..."
              dir="ltr"
            />
          </FormField>
          <FormField label="ترتیب نمایش" error={errors.displayOrder?.message}>
            <input
              type="number"
              {...register("displayOrder", { valueAsNumber: true })}
              className="form-input w-24"
              dir="ltr"
            />
          </FormField>
          <label className="flex items-center gap-2 text-xs text-text-secondary">
            <input
              type="checkbox"
              {...register("isActive")}
              className="h-4 w-4 rounded border-border accent-accent"
            />
            فعال باشد
          </label>
          <Button type="submit" disabled={createMutation.isPending} className="mt-2">
            {createMutation.isPending ? "در حال ذخیره..." : "ایجاد بنر"}
          </Button>
        </form>
      </motion.div>
      <MediaPickerModal
        open={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={(url) => {
          setValue("imageUrl", url);
          setMediaPickerOpen(false);
        }}
      />
    </motion.div>
  );
}

/* ─── Form Field Primitive ─── */

function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-text-secondary">{label}</label>
      {children}
      {error && <span className="text-[11px] text-danger">{error}</span>}
    </div>
  );
}
