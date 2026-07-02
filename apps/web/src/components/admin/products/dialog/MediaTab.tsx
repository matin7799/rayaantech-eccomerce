import { ImageIcon, PlusIcon, TrashIcon, UploadIcon } from "lucide-react";
import { useState } from "react";
import type { UseFormSetValue, UseFormWatch } from "react-hook-form";
import { Button } from "../../../ui/button";
import { MediaPickerModal } from "../../MediaPickerModal";
import type { ProductFormData } from "./schema";

export interface MediaTabProps {
  watch: UseFormWatch<ProductFormData>;
  setValue: UseFormSetValue<ProductFormData>;
}

export function MediaTab({ watch, setValue }: MediaTabProps) {
  const images = watch("images") || [];
  const [pickerOpen, setPickerOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleRemoveImage = (urlToRemove: string) => {
    setValue(
      "images",
      images.filter((url) => url !== urlToRemove),
      { shouldDirty: true },
    );
  };

  const handleAddImage = (url: string) => {
    if (!images.includes(url)) {
      setValue("images", [...images, url], { shouldDirty: true });
    }
  };

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    // Simulate drop and read files
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Mock upload local files to simulation
      const filesCount = e.dataTransfer.files.length;
      for (let i = 0; i < filesCount; i++) {
        const file = e.dataTransfer.files[i];
        if (file.type.startsWith("image/")) {
          const fakeCdnUrl = URL.createObjectURL(file);
          handleAddImage(fakeCdnUrl);
        }
      }
    }
  };

  return (
    <div className="flex flex-col gap-5 p-2" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-text-primary">تصاویر محصول</h4>
          <p className="text-[11px] text-text-muted mt-0.5">
            تصاویر محصول را آپلود کنید یا از کتابخانه رسانه Arvan S3 انتخاب کنید. اولین تصویر به
            عنوان تصویر بندانگشتی اصلی انتخاب می‌شود.
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="gap-1.5 cursor-pointer"
          onClick={() => setPickerOpen(true)}
        >
          <PlusIcon className="h-3.5 w-3.5" />
          انتخاب از رسانه S3
        </Button>
      </div>

      {/* Drag & Drop Overlay Zone */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed py-8 px-6 transition-colors min-h-[160px] ${
          dragActive
            ? "border-accent bg-accent/5"
            : "border-border hover:border-accent/30 bg-surface/35"
        }`}
      >
        {images.length === 0 ? (
          <div
            className="flex flex-col items-center gap-3 text-text-muted text-center cursor-pointer"
            onClick={() => setPickerOpen(true)}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-secondary">
              <UploadIcon className="h-6 w-6 text-text-muted" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-text-primary">
                تصاویر را به اینجا بکشید یا برای انتخاب کلیک کنید
              </span>
              <span className="text-[10px]">پشتیبانی از فرمت‌های PNG، JPG، WebP</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 w-full sm:grid-cols-3 md:grid-cols-4">
            {images.map((url, idx) => (
              <div
                key={url}
                className="group relative border border-border/60 rounded-xl overflow-hidden bg-muted aspect-square flex items-center justify-center"
              >
                <img
                  src={url}
                  alt={`Product Image ${idx + 1}`}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105 duration-300"
                />

                {/* Badges */}
                <div className="absolute top-2 right-2 flex flex-col gap-1">
                  {idx === 0 && (
                    <span className="bg-accent text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-sm">
                      تصویر اصلی
                    </span>
                  )}
                </div>

                {/* Overlay Action Button */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(url)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-danger text-white hover:bg-danger/90 transition-colors shadow-md"
                    title="حذف تصویر"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}

            {/* Add Extra Button Card */}
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="border border-dashed border-border hover:border-accent/40 rounded-xl flex flex-col items-center justify-center gap-2 aspect-square bg-surface/20 transition-colors cursor-pointer text-text-muted hover:text-accent"
            >
              <ImageIcon className="h-6 w-6" />
              <span className="text-[10px] font-medium">افزودن تصویر</span>
            </button>
          </div>
        )}
      </div>

      {/* S3 Media Picker Modal */}
      <MediaPickerModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={handleAddImage}
      />
    </div>
  );
}
