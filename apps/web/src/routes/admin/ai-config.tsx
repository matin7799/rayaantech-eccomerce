import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import {
  BrainCircuitIcon,
  KeyIcon,
  MessageSquareIcon,
  RefreshCwIcon,
  SaveIcon,
} from "lucide-react";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

export const Route = createFileRoute("/admin/ai-config")({
  component: AiConfigDeck,
});

/**
 * Dynamic AvalAI Expert & LLM Prompt Orchestrator
 *
 * Enterprise configuration deck:
 * - API key rotation (AVALAI_API_KEY bearer token)
 * - Model selection via Select dropdown
 * - Master System Prompt textarea editor
 * - Error boundary → sonner Persian toasts
 *
 * tRPC mutation: admin.updateAiConfig
 * API base: https://api.avalai.ir/v1
 */

/* ─── Zod Schema ─── */

const aiConfigSchema = z.object({
  apiKey: z.string().min(10, "کلید API حداقل ۱۰ کاراکتر"),
  model: z.string().min(1, "انتخاب مدل الزامی است"),
  systemPrompt: z.string().min(20, "پرامپت سیستم حداقل ۲۰ کاراکتر"),
  temperature: z.number().min(0).max(2),
  maxTokens: z.number().int().min(100).max(16000),
});

type AiConfigFormData = z.infer<typeof aiConfigSchema>;

/* ─── Available Models ─── */

const AVAILABLE_MODELS = [
  { value: "gpt-4o", label: "GPT-4o (Multimodal)" },
  { value: "gpt-4o-mini", label: "GPT-4o Mini (Fast)" },
  { value: "gpt-4o-realtime", label: "GPT-4o Realtime (Voice)" },
  { value: "gpt-4.1", label: "GPT-4.1 (Latest)" },
  { value: "claude-sonnet-4-5", label: "Claude Sonnet 4.5" },
  { value: "claude-haiku-4-5", label: "Claude Haiku 4.5 (Fast)" },
  { value: "gemini-2.5-flash", label: "Gemini 2.5 Flash" },
  { value: "deepseek-chat", label: "DeepSeek Chat" },
] as const;

/* ─── Default System Prompt ─── */

const DEFAULT_SYSTEM_PROMPT = `شما مشاور تخصصی سخت‌افزار رایان تک هستید. به مشتریان در انتخاب لپ‌تاپ، دسکتاپ و تجهیزات جانبی کمک می‌کنید.

قوانین:
- فقط درباره محصولات موجود در انبار صحبت کنید
- قیمت‌ها را به تومان و با فرمت فارسی اعلام کنید
- اگر محصولی موجود نیست، جایگزین پیشنهاد دهید
- پاسخ‌ها مختصر و حرفه‌ای باشند`;

/* ─── Component ─── */

function AiConfigDeck() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AiConfigFormData>({
    resolver: zodResolver(aiConfigSchema),
    defaultValues: {
      apiKey: "aa-****************************",
      model: "gpt-4o-mini",
      systemPrompt: DEFAULT_SYSTEM_PROMPT,
      temperature: 0.7,
      maxTokens: 4096,
    },
  });

  const currentModel = watch("model");

  const onSubmit = useCallback(async (_data: AiConfigFormData) => {
    try {
      // Stub: trpc.admin.updateAiConfig.mutate(_data)
      await new Promise((r) => setTimeout(r, 1000));
      toast.success("تنظیمات AI با موفقیت ذخیره شد");
    } catch {
      toast.error("خطا در ذخیره تنظیمات. لطفاً مجدداً تلاش کنید.", {
        description: "اتصال به سرور برقرار نشد",
      });
    }
  }, []);

  const handleRotateKey = useCallback(() => {
    const newKey = `aa-${crypto.randomUUID().replace(/-/g, "").slice(0, 32)}`;
    setValue("apiKey", newKey);
    toast.info("کلید جدید تولید شد — برای اعمال، فرم را ذخیره کنید");
  }, [setValue]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-[30px] font-semibold leading-9 text-text-primary">پیکربندی AI</h1>
        <p className="text-sm text-text-muted">
          مدیریت کلید AvalAI، انتخاب مدل و پرامپت اصلی مشاور صوتی
        </p>
      </div>

      {/* Config Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* ─── API Key Section ─── */}
        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="mb-4 flex items-center gap-2">
            <KeyIcon className="h-5 w-5 text-accent" />
            <h2 className="text-sm font-semibold text-text-primary">کلید دسترسی AvalAI</h2>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text-secondary">Bearer Token</label>
              <div className="flex items-center gap-2">
                <input
                  {...register("apiKey")}
                  type="password"
                  className="form-input flex-1 font-mono"
                  dir="ltr"
                  autoComplete="off"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-1.5 shrink-0"
                  onClick={handleRotateKey}
                >
                  <RefreshCwIcon className="h-3.5 w-3.5" />
                  چرخش
                </Button>
              </div>
              {errors.apiKey && (
                <span className="text-[11px] text-danger">{errors.apiKey.message}</span>
              )}
            </div>
            <p className="text-[11px] text-text-muted">
              Base URL:{" "}
              <code dir="ltr" className="text-text-secondary">
                https://api.avalai.ir/v1
              </code>
            </p>
          </div>
        </div>

        {/* ─── Model Selection ─── */}
        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="mb-4 flex items-center gap-2">
            <BrainCircuitIcon className="h-5 w-5 text-accent" />
            <h2 className="text-sm font-semibold text-text-primary">انتخاب مدل</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text-secondary">مدل اصلی مکالمه</label>
              <Select
                defaultValue={currentModel}
                onValueChange={(v) => {
                  if (v) setValue("model", v);
                }}
              >
                <SelectTrigger className="h-10 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_MODELS.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.model && (
                <span className="text-[11px] text-danger">{errors.model.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text-secondary">دما (Temperature)</label>
              <input
                type="number"
                step="0.1"
                {...register("temperature", { valueAsNumber: true })}
                className="form-input w-24"
                dir="ltr"
              />
              {errors.temperature && (
                <span className="text-[11px] text-danger">{errors.temperature.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text-secondary">حداکثر توکن خروجی</label>
              <input
                type="number"
                {...register("maxTokens", { valueAsNumber: true })}
                className="form-input w-32"
                dir="ltr"
              />
              {errors.maxTokens && (
                <span className="text-[11px] text-danger">{errors.maxTokens.message}</span>
              )}
            </div>
          </div>
        </div>

        {/* ─── System Prompt Editor ─── */}
        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="mb-4 flex items-center gap-2">
            <MessageSquareIcon className="h-5 w-5 text-accent" />
            <h2 className="text-sm font-semibold text-text-primary">پرامپت سیستم اصلی</h2>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-text-secondary">
              متن پرامپت (این متن رفتار مشاور صوتی را کنترل می‌کند)
            </label>
            <textarea
              {...register("systemPrompt")}
              className="form-input min-h-48 resize-y font-mono text-xs leading-relaxed"
              dir="rtl"
            />
            {errors.systemPrompt && (
              <span className="text-[11px] text-danger">{errors.systemPrompt.message}</span>
            )}
            <p className="text-[11px] text-text-muted">
              تغییرات پس از ذخیره روی جلسات صوتی جدید اعمال می‌شوند. جلسات فعلی تحت تأثیر قرار
              نمی‌گیرند.
            </p>
          </div>
        </div>

        {/* ─── Submit ─── */}
        <div className="flex items-center gap-3">
          <Button type="submit" disabled={isSubmitting} className="gap-2">
            <SaveIcon className="h-4 w-4" />
            {isSubmitting ? "در حال ذخیره..." : "ذخیره تنظیمات"}
          </Button>
        </div>
      </form>
    </div>
  );
}
