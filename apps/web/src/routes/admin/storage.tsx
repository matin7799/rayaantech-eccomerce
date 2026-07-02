import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  CheckIcon,
  ChevronLeftIcon,
  CopyIcon,
  FileIcon,
  FilmIcon,
  FolderIcon,
  HardDriveIcon,
  ImageIcon,
  Trash2Icon,
  UploadIcon,
} from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { parseRelativePath } from "../../components/admin/MediaPickerModal.helpers";
import { StorageSidebar } from "../../components/admin/storage/StorageSidebar";
import { Button } from "../../components/ui/button";
import { trpc } from "../../lib/trpc";

const storageSearchSchema = z.object({
  dir: z.string().catch("").optional().default(""),
});

export const Route = createFileRoute("/admin/storage")({
  validateSearch: (search) => storageSearchSchema.parse(search),
  component: StorageBrowser,
});

/* ─── Types ─── */

type FileType = "image" | "video" | "document" | "folder";

interface StorageObject {
  id: string;
  name: string;
  type: FileType;
  size: string;
  mimeType: string | null;
  cdnUrl: string;
  thumbnailUrl: string | null;
  updatedAt: string;
}

/* ─── File Type Config ─── */

const FILE_TYPE_CONFIG: Record<FileType, { icon: typeof FileIcon; className: string }> = {
  image: { icon: ImageIcon, className: "text-accent" },
  video: { icon: FilmIcon, className: "text-warning" },
  document: { icon: FileIcon, className: "text-text-muted" },
  folder: { icon: FolderIcon, className: "text-accent" },
};

/* ─── Component ─── */

function StorageBrowser() {
  const searchParams = Route.useSearch();
  const navigate = useNavigate();
  const activePath = searchParams.dir || "";
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Real tRPC query for storage objects and folders
  const storageQuery = trpc.admin.listStorageObjects.useQuery({ path: activePath });
  const foldersQuery = trpc.admin.getStorageFolders.useQuery();

  const allFiles = storageQuery.data?.objects ?? [];
  const folders = foldersQuery.data?.folders ?? [];

  // Filter files in current directory
  const files = allFiles.filter((file) => {
    const fileDir = parseRelativePath(file.cdnUrl);
    const normFileDir = fileDir.replace(/^\/|\/$/g, "");
    const normActivePath = activePath.replace(/^\/|\/$/g, "");
    return normFileDir === normActivePath;
  });

  const handleCopyCdn = useCallback((file: StorageObject) => {
    navigator.clipboard.writeText(file.cdnUrl);
    setCopiedId(file.id);
    toast.success("آدرس CDN کپی شد");
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  const handleDelete = useCallback((file: StorageObject) => {
    // Stub: trpc.admin.deleteStorageObject.mutate({ objectId: file.id })
    toast.error(`فایل ${file.name} حذف شد`);
  }, []);

  const handleUpload = useCallback(() => {
    // Stub: Opens file picker → trpc.admin.uploadToStorage.mutate()
    toast.info("آپلود فایل به‌زودی فعال می‌شود");
  }, []);

  // Calculate statistics dynamically
  const totalFoldersCount = folders.reduce((acc, folder) => {
    let count = 1; // self
    if (folder.children) {
      count += folder.children.length;
    }
    return acc + count;
  }, 0);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-[30px] font-semibold leading-9 text-text-primary">فضای ذخیره‌سازی</h1>
          <p className="text-sm text-text-muted">
            مدیریت فایل‌ها و رسانه‌ها — Arvan Cloud Object Storage
          </p>
        </div>
        <motion.div whileTap={{ scale: 0.95 }}>
          <Button size="sm" className="gap-2" onClick={handleUpload}>
            <UploadIcon className="h-4 w-4" />
            آپلود فایل
          </Button>
        </motion.div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4">
          <HardDriveIcon className="h-5 w-5 text-accent" />
          <div className="flex flex-col gap-0.5">
            <span className="text-base font-semibold text-text-primary">۲.۴ GB</span>
            <span className="text-xs text-text-muted">فضای مصرفی</span>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4">
          <ImageIcon className="h-5 w-5 text-accent" />
          <div className="flex flex-col gap-0.5">
            <span className="text-base font-semibold text-text-primary">
              {files.length.toLocaleString("fa-IR")} فایل
            </span>
            <span className="text-xs text-text-muted">در مسیر فعلی</span>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4">
          <FolderIcon className="h-5 w-5 text-accent" />
          <div className="flex flex-col gap-0.5">
            <span className="text-base font-semibold text-text-primary">
              {totalFoldersCount.toLocaleString("fa-IR")} پوشه
            </span>
            <span className="text-xs text-text-muted">درخت دایرکتوری</span>
          </div>
        </div>
      </div>

      {/* Main Layout: Folder Tree + File Grid */}
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Dynamic Collapsible Sidebar */}
        <StorageSidebar activePath={activePath} folders={folders} />

        {/* File Grid */}
        <div className="flex-1">
          {/* Breadcrumb */}
          <div className="mb-4 flex items-center gap-1 text-[12px] text-text-muted">
            <button
              type="button"
              onClick={() => navigate({ search: (old) => ({ ...old, dir: "" }) })}
              className="hover:text-text-primary transition-colors cursor-pointer"
            >
              ریشه
            </button>
            {activePath
              .split("/")
              .filter(Boolean)
              .map((segment, idx, arr) => {
                const segmentPath = arr.slice(0, idx + 1).join("/");
                let displayName = segment;
                if (segment === "products-media") displayName = "محصولات و واریانتها";
                else if (segment === "box-inspection") displayName = "بازرسی جعبه‌ها";
                else if (segment === "thumbnails") displayName = "تصاویر بندانگشتی";
                else if (segment === "shoppable-stories") displayName = "استوریهای ویدیویی";
                else if (segment === "active") displayName = "فعال";
                else if (segment === "archive") displayName = "آرشیو";
                else if (segment === "marketing-banners") displayName = "بنرهای تبلیغاتی";
                else if (segment === "homepage") displayName = "صفحه اصلی";
                else if (segment === "campaigns") displayName = "کمپین‌ها";
                else if (segment === "blog-assets") displayName = "مقالات بلاگ";

                return (
                  <span key={idx} className="flex items-center gap-1">
                    <ChevronLeftIcon className="h-3 w-3 rtl:rotate-180 text-text-muted" />
                    <button
                      type="button"
                      onClick={() => navigate({ search: (old) => ({ ...old, dir: segmentPath }) })}
                      className="text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                    >
                      {displayName}
                    </button>
                  </span>
                );
              })}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {files.map((file) => {
              const typeConfig = FILE_TYPE_CONFIG[file.type] || FILE_TYPE_CONFIG.document;
              const Icon = typeConfig.icon;
              const isCopied = copiedId === file.id;

              return (
                <div
                  key={file.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-colors duration-200 hover:border-accent/30"
                >
                  {/* Thumbnail / Icon area — fixed aspect ratio to prevent CLS */}
                  <div
                    className="flex items-center justify-center bg-surface-secondary"
                    style={{ aspectRatio: "4 / 3" }}
                  >
                    {file.thumbnailUrl ? (
                      <img
                        src={file.thumbnailUrl}
                        alt={file.name}
                        className="h-full w-full object-cover"
                        style={{ aspectRatio: "4 / 3" }}
                      />
                    ) : (
                      <Icon className={`h-10 w-10 ${typeConfig.className}`} />
                    )}
                  </div>

                  {/* File info */}
                  <div className="flex flex-1 flex-col gap-1 p-3">
                    <span
                      className="truncate text-xs font-medium text-text-primary"
                      title={file.name}
                    >
                      {file.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-text-muted">{file.size}</span>
                      <span className="text-[10px] text-text-muted">•</span>
                      <span className="text-[10px] text-text-muted">{file.updatedAt}</span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-1 border-t border-border px-3 py-2">
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCopyCdn(file)}
                      className="flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-medium text-text-muted transition-colors hover:bg-surface-secondary hover:text-accent cursor-pointer"
                      title="کپی آدرس CDN"
                    >
                      {isCopied ? (
                        <CheckIcon className="h-3 w-3 text-success" />
                      ) : (
                        <CopyIcon className="h-3 w-3" />
                      )}
                      CDN
                    </motion.button>
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(file)}
                      className="flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-medium text-text-muted transition-colors hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                      title="حذف"
                    >
                      <Trash2Icon className="h-3 w-3" />
                      حذف
                    </motion.button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
