import { create } from "zustand";

/**
 * Hyper-realistic, high-converting Persian customer seed prompts for the AI Consultant.
 */
export const SEED_PROMPTS = [
  "لپتاپ رندرینگ سنگین و تدوین تا ۶۰ میلیون چی موجود دارید؟",
  "یک دستگاه سرفیس سبک برای کارهای دانشجویی و بورس میخوام",
  "مکبوک پرو استوک گرید اپنباکس مچ با برنامه نویسی دارید؟",
  "ارزانترین لپتاپی که بتونه بازیهای روز رو روان اجرا کنه چنده؟",
  "لپ تاپ اداری سبک با شارژدهی بالا معرفی کنید",
  "سیستم گیمینگ تا ۴۵ میلیون تومان چی پیشنهاد میدین؟",
  "سرفیس پرو استوک تمیز برای طراحی گرافیکی میخوام",
  "مک بوک ایر m1 یا m2 برای کار مدیریتی کدوم بهتره؟",
  "لپ تاپ قوی برای برنامه نویسی هوش مصنوعی چی دارید؟",
  "لپ تاپ صنعتی با بدنه فلزی و مقاوم معرفی کنید",
  "لپ تاپ لمسی ۳۶۰ درجه برای ارائه و پرزنت میخوام",
  "تا ۳۰ میلیون بهترین لپ تاپ برای حسابداری چیه؟",
];

/**
 * Product context injected into the AI Consultant when the user
 * is actively viewing a PDP. Null when on non-product routes.
 */
export interface AIProductContext {
  productName: string;
  sku: string | null;
  basePrice: string;
  grade: string;
  slug: string;
  stock: number;
  attributes: Array<{ key: string; values: string[] }>;
}

/**
 * AI Consultant store state — manages the global floating chat context.
 */
interface AIConsultantState {
  /** Active product context (null if not on a PDP) */
  productContext: AIProductContext | null;
  /** Set product context — called by PDP on mount */
  setProductContext: (ctx: AIProductContext) => void;
  /** Clear product context — called by PDP on unmount */
  clearProductContext: () => void;

  /** Active product context slug set when transitioning context via card deep link */
  activeProductContextSlug: string | null;
  /** Set active product context slug */
  setActiveProductContextSlug: (slug: string | null) => void;

  /** Active session ID for rehydrating conversation history */
  activeSessionId: string | null;
  /** Active session title (topic inferred by background task) */
  activeSessionTitle: string | null;
  /** Chronological messages in the active session */
  activeSessionMessages: Array<{ role: "user" | "assistant"; content: string }> | null;
  /** Visibility state of the floating AI consultation console */
  isOpen: boolean;
  /** Load a specific session ID, title, and message history */
  setSession: (
    sessionId: string,
    title: string | null,
    messages: Array<{ role: "user" | "assistant"; content: string }>,
  ) => void;
  /** Reset active session context to start fresh */
  clearSession: () => void;
  /** Open/close the consultation console */
  setIsOpen: (isOpen: boolean) => void;
  /** Transition active consultation context to a new product smoothly */
  transitionToProduct: (slug: string, name: string) => void;
}

export const useAIConsultantStore = create<AIConsultantState>((set) => ({
  productContext: null,
  activeProductContextSlug: null,
  activeSessionId: null,
  activeSessionTitle: null,
  activeSessionMessages: null,
  isOpen: false,

  setProductContext: (ctx) => {
    set({ productContext: ctx });
  },

  clearProductContext: () => {
    set({ productContext: null });
  },

  setActiveProductContextSlug: (slug) => {
    set({ activeProductContextSlug: slug });
  },

  setSession: (sessionId, title, messages) => {
    set({ activeSessionId: sessionId, activeSessionTitle: title, activeSessionMessages: messages });
  },

  clearSession: () => {
    set({ activeSessionId: null, activeSessionTitle: null, activeSessionMessages: null });
  },

  setIsOpen: (isOpen) => {
    set({ isOpen });
  },

  transitionToProduct: (slug, name) => {
    set((state) => {
      const ackMessage = {
        role: "assistant" as const,
        content: `درحال بررسی «${name}» هستیم. ادامه مشاوره شما را بر اساس این محصول پیگیری می‌کنم.`,
      };
      const updatedMessages = state.activeSessionMessages
        ? [...state.activeSessionMessages, ackMessage]
        : [ackMessage];

      return {
        productContext: {
          productName: name,
          sku: null,
          basePrice: "0",
          grade: "",
          slug: slug,
          stock: 1,
          attributes: [],
        },
        activeProductContextSlug: slug,
        activeSessionMessages: updatedMessages,
        isOpen: true,
      };
    });
  },
}));
