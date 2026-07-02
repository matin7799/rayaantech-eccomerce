import { AnimatePresence, motion } from "framer-motion";
import { CheckIcon, ChevronLeftIcon, FileIcon, ImageIcon, UploadIcon, XIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { trpc } from "../../lib/trpc";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { FolderTree } from "./MediaPickerFolderTree";
import {
  buildFolderTree,
  getFileIcon,
  getFileType,
  parseRelativePath,
} from "./MediaPickerModal.helpers";

/**
 * MediaPickerModal — Reusable Arvan S3 asset selector.
 *
 * Used across Blogs, Stories, Banners, and Products Full Edit.
 * Connects to trpc.admin.listStorageObjects for browsing.
 * On file selection, injects the CDN URL into the parent form via onSelect callback.
 *
 * Features:
 * - Folder tree navigation (left panel, glassmorphic)
 * - File grid with aspect-ratio thumbnails (no CLS)
 * - Upload trigger (stubs admin.uploadToStorage)
 * - RTL-safe, mobile responsive (full-screen takeover on mobile)
 */

interface MediaPickerModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (cdnUrl: string) => void;
}

/* ─── Main Component ─── */

export function MediaPickerModal({ open, onClose, onSelect }: MediaPickerModalProps) {
  const [activePath, setActivePath] = useState("/");
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);

  // Real tRPC query — fetches storage objects for active path
  const storageQuery = trpc.admin.listStorageObjects.useQuery(
    { path: activePath },
    { enabled: open },
  );

  const objects = storageQuery.data?.objects ?? [];

  // Generate dynamic folder tree structure based on S3 object URLs
  const folderTree = buildFolderTree(objects);

  // Filter objects belonging to the current active path
  const activeObjects = objects.filter((obj) => parseRelativePath(obj.cdnUrl) === activePath);

  const handleConfirm = useCallback(() => {
    if (selectedUrl) {
      onSelect(selectedUrl);
      onClose();
    }
  }, [selectedUrl, onSelect, onClose]);

  const handleUpload = useCallback(() => {
    // Stub: In production opens file picker → admin.uploadToStorage
    toast.info("آپلود فایل به‌زودی فعال می‌شود");
  }, []);

  if (!open) return null;

  return (
    <AnimatePresence>
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
          className="flex h-full w-full flex-col overflow-hidden bg-surface md:h-[80vh] md:max-h-[700px] md:w-full md:max-w-4xl md:rounded-2xl md:border md:border-border md:shadow-glass"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-4">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-accent" />
              <h2 className="text-sm font-semibold text-text-primary">انتخاب فایل رسانه</h2>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" className="gap-1.5" onClick={handleUpload}>
                <UploadIcon className="h-3.5 w-3.5" />
                آپلود
              </Button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1.5 text-text-muted hover:bg-surface-secondary hover:text-text-primary"
              >
                <XIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Body: Folder Tree + File Grid */}
          <div className="flex flex-1 overflow-hidden">
            {/* Folder Tree */}
            <aside className="hidden w-48 shrink-0 border-e border-border bg-surface-glass p-3 backdrop-blur-md md:block">
              <ScrollArea className="h-full">
                <FolderTree
                  nodes={folderTree}
                  activePath={activePath}
                  onSelect={setActivePath}
                  depth={0}
                />
              </ScrollArea>
            </aside>

            {/* File Grid */}
            <div className="flex-1 overflow-hidden">
              {/* Breadcrumb */}
              <div className="flex items-center gap-1 border-b border-border px-4 py-2 text-xs text-text-muted">
                <button
                  type="button"
                  onClick={() => setActivePath("/")}
                  className="hover:text-text-primary transition-colors"
                >
                  ریشه
                </button>
                {activePath
                  .split("/")
                  .filter(Boolean)
                  .map((seg, idx, arr) => {
                    const segmentPath = `/${arr.slice(0, idx + 1).join("/")}`;
                    return (
                      <span key={segmentPath} className="flex items-center gap-1">
                        <ChevronLeftIcon className="h-3 w-3 rtl:rotate-180" />
                        <button
                          type="button"
                          onClick={() => setActivePath(segmentPath)}
                          className="text-text-secondary hover:text-text-primary transition-colors"
                        >
                          {seg}
                        </button>
                      </span>
                    );
                  })}
              </div>

              <ScrollArea className="h-full p-4">
                {storageQuery.isLoading ? (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {Array.from({ length: 8 }, (_, i) => `skeleton-${i}`).map((key) => (
                      <div
                        key={key}
                        className="animate-pulse rounded-xl bg-surface-secondary"
                        style={{ aspectRatio: "4 / 3" }}
                      />
                    ))}
                  </div>
                ) : activeObjects.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-text-muted">
                    <FileIcon className="h-8 w-8" />
                    <span className="mt-2 text-xs">فایلی در این مسیر یافت نشد</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {activeObjects.map((obj) => {
                      const type = getFileType(obj.mimeType);
                      const Icon = getFileIcon(type);
                      const isSelected = selectedUrl === obj.cdnUrl;

                      return (
                        <button
                          key={obj.id}
                          type="button"
                          onClick={() => setSelectedUrl(obj.cdnUrl)}
                          className={`group relative flex flex-col overflow-hidden rounded-xl border transition-all duration-200 ${
                            isSelected
                              ? "border-accent ring-2 ring-accent/30"
                              : "border-border hover:border-accent/40"
                          }`}
                        >
                          <div
                            className="flex items-center justify-center bg-surface-secondary"
                            style={{ aspectRatio: "4 / 3" }}
                          >
                            {type === "image" ? (
                              <img
                                src={obj.cdnUrl}
                                alt={obj.name}
                                className="h-full w-full object-cover"
                                style={{ aspectRatio: "4 / 3" }}
                              />
                            ) : (
                              <Icon className="h-8 w-8 text-text-muted" />
                            )}
                          </div>
                          <div className="px-2 py-1.5">
                            <span className="block truncate text-[10px] font-medium text-text-primary">
                              {obj.name}
                            </span>
                          </div>
                          {isSelected && (
                            <div className="absolute inset-e-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-white">
                              <CheckIcon className="h-3 w-3" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>

          {/* Footer */}
          <div className="flex shrink-0 items-center justify-between border-t border-border px-5 py-3">
            <span className="text-[11px] text-text-muted">
              {selectedUrl ? "فایل انتخاب شده" : "فایلی انتخاب نشده"}
            </span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={onClose}>
                انصراف
              </Button>
              <Button size="sm" disabled={!selectedUrl} onClick={handleConfirm} className="gap-1.5">
                <CheckIcon className="h-3.5 w-3.5" />
                انتخاب
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
