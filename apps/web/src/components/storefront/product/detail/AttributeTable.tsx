"use client";

import { ChevronsUpDown } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

type ProductType =
  | "laptop"
  | "mobile"
  | "console"
  | "printer"
  | "case"
  | "monitor"
  | "all-in-one"
  | "generic";

/**
 * دایره متون و کلیدواژه‌های پویا به تفکیک محصولات پلتفرم
 */
const CATEGORY_MAPS: Record<ProductType, { order: string[]; groups: Record<string, string[]> }> = {
  laptop: {
    order: ["عملکرد و پردازش", "صفحه نمایش", "اتصالات و پورت‌ها", "مشخصات فیزیکی و باتری"],
    groups: {
      "عملکرد و پردازش": [
        "cpu",
        "ram",
        "gpu",
        "پردازنده",
        "رم",
        "کارت گرافیک",
        "حافظه داخلی",
        "فرکانس پردازنده",
      ],
      "صفحه نمایش": [
        "display",
        "screen",
        "resolution",
        "نمایشگر",
        "صفحه نمایش",
        "رزولوشن",
        "نرخ نوسازی",
        "نوع پنل",
      ],
      "اتصالات و پورت‌ها": ["wifi", "bluetooth", "usb", "hdmi", "پورت", "وای‌فای"],
      "مشخصات فیزیکی و باتری": ["weight", "battery", "ابعاد", "وزن", "باتری", "رنگ", "کیبورد"],
    },
  },
  mobile: {
    order: ["تراشه و حافظه", "صفحه نمایش و دوربین", "باتری و ارتباطات", "بدنه و سیستم عامل"],
    groups: {
      "تراشه و حافظه": ["cpu", "ram", "chipset", "پردازنده", "رم", "حافظه داخلی"],
      "صفحه نمایش و دوربین": ["camera", "display", "pixel", "دوربین", "نمایشگر", "رزولوشن"],
      "باتری و ارتباطات": ["battery", "charging", "sim", "5g", "باتری", "سیم کارت"],
      "بدنه و سیستم عامل": ["os", "android", "ios", "وزن", "ابعاد", "سیستم عامل"],
    },
  },
  console: {
    order: ["مشخصات سخت‌افزاری", "خروجی و اتصالات", "تجهیزات و اقلام همراه"],
    groups: {
      "مشخصات سخت‌افزاری": ["cpu", "gpu", "storage", "رم", "پردازنده", "گرافیک", "حافظه"],
      "خروجی و اتصالات": ["hdmi", "usb", "wifi", "خروجی تصویر", "پورت"],
      "تجهیزات و اقلام همراه": ["controller", "وزن", "ابعاد", "دسته", "رنگ"],
    },
  },
  printer: {
    order: ["تکنولوژی و مشخصات چاپ", "مدیریت کاغذ و ظرفیت", "درگاه‌ها و مواد مصرفی"],
    groups: {
      "تکنولوژی و مشخصات چاپ": ["سرعت چاپ", "رزولوشن چاپ", "تکنولوژی چاپ", "نوع چاپ", "توان"],
      "مدیریت کاغذ و ظرفیت": ["a4", "سایز چاپ", "ظرفیت سینی", "کاغذ"],
      "درگاه‌ها و مواد مصرفی": ["کارتریج", "تونر", "usb", "wifi", "پورت"],
    },
  },
  case: {
    order: ["فضای داخلی و سیستم خنک‌کننده", "ساختار بیرونی و اتصالات"],
    groups: {
      "فضای داخلی و سیستم خنک‌کننده": ["مادربرد", "فن", "خنک کننده", "کارت گرافیک", "پاور"],
      "ساختار بیرونی و اتصالات": ["فرم فاکتور", "جنس", "usb", "ابعاد", "وزن"],
    },
  },
  monitor: {
    order: ["پنل و مشخصات تصویر", "درگاه‌های ارتباطی و ویژگی‌ها"],
    groups: {
      "پنل و مشخصات تصویر": ["پنل", "ips", "va", "رزولوشن", "رفرش ریت", "زمان پاسخ"],
      "درگاه‌های ارتباطی و ویژگی‌ها": ["hdmi", "displayport", "vga", "اسپیکر", "پورت"],
    },
  },
  "all-in-one": {
    order: ["سخت‌افزار و پردازش", "صفحه نمایش و تصویر", "اتصالات و لوازم جانبی"],
    groups: {
      "سخت‌افزار و پردازش": ["cpu", "ram", "پردازنده", "رم", "کارت گرافیک", "حافظه"],
      "صفحه نمایش و تصویر": ["نمایشگر", "صفحه نمایش", "رزولوشن", "پنل"],
      "اتصالات و لوازم جانبی": ["کیبورد", "موس", "وبکم", "wifi", "پورت", "usb"],
    },
  },
  generic: {
    order: ["مشخصات عمومی"],
    groups: { "مشخصات عمومی": [] },
  },
};

const PRIORITY_KEYS = [
  "پردازنده",
  "حافظه رم",
  "حافظه داخلی",
  "کارت گرافیک",
  "اندازه صفحه نمایش",
  "صفحه نمایش",
  "رزولوشن",
];

interface AttributeItem {
  key: string;
  values: string[];
}

interface AttributeTableProps {
  attributes: AttributeItem[];
  productType: ProductType;
}

function sortWithPriority(attrs: AttributeItem[], type: ProductType): AttributeItem[] {
  if (type !== "laptop" && type !== "all-in-one") return attrs;

  const prioritySet = new Map<string, number>();
  PRIORITY_KEYS.forEach((key, idx) => prioritySet.set(key.toLowerCase(), idx));

  return [...attrs].sort((a, b) => {
    const aIdx = prioritySet.get(a.key.toLowerCase()) ?? 999;
    const bIdx = prioritySet.get(b.key.toLowerCase()) ?? 999;
    return aIdx - bIdx;
  });
}

export function AttributeTable({ attributes, productType }: AttributeTableProps) {
  // ۱. اولویت‌بندی کلیدهای اصلی لپ‌تاپ و آل این وان به بالای بخش عملکرد
  const sortedAttributes = React.useMemo(
    () => sortWithPriority(attributes, productType),
    [attributes, productType],
  );

  // ۲. توزیع و تفکیک اتریبیوت‌ها در Map اختصاصی دسته کالا
  const groupedData = React.useMemo(() => {
    const map = new Map<string, AttributeItem[]>();
    const otherGroupName = "سایر مشخصات";
    const currentConfig = CATEGORY_MAPS[productType] || CATEGORY_MAPS.generic;

    for (const attr of sortedAttributes) {
      let matchedGroup: string | null = null;
      const lowerKey = attr.key.toLowerCase();

      for (const [groupName, keywords] of Object.entries(currentConfig.groups)) {
        if (keywords.some((kw) => lowerKey.includes(kw.toLowerCase()))) {
          matchedGroup = groupName;
          break;
        }
      }

      const finalGroup = matchedGroup || otherGroupName;
      const existing = map.get(finalGroup) || [];
      existing.push(attr);
      map.set(finalGroup, existing);
    }
    return map;
  }, [sortedAttributes, productType]);

  // ۳. ایجاد آرایه ترتیبی هدر آکاردئون‌ها بر اساس بیزینس کاتالوگ
  const finalGroupOrder = React.useMemo(() => {
    const currentConfig = CATEGORY_MAPS[productType] || CATEGORY_MAPS.generic;
    const order = [...currentConfig.order];
    if (groupedData.has("سایر مشخصات")) {
      order.push("سایر مشخصات");
    }
    return order.filter((g) => groupedData.has(g));
  }, [productType, groupedData]);

  if (attributes.length === 0) return null;

  return (
    <div className="w-full flex flex-col gap-2.5">
      {finalGroupOrder.map((groupName) => (
        <CollapsibleGroup
          key={groupName}
          title={groupName}
          items={groupedData.get(groupName) || []}
        />
      ))}
    </div>
  );
}

interface CollapsibleGroupProps {
  title: string;
  items: AttributeItem[];
}

function CollapsibleGroup({ title, items }: CollapsibleGroupProps) {
  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full flex flex-col gap-2 rounded-xl border border-[--glass-border] bg-surface p-2 transition-all duration-200"
    >
      <div className="flex items-center justify-between gap-4 px-3 py-1">
        <h4 className="text-xs font-bold text-text-primary flex items-center gap-2">
          <span className="w-1 h-3 rounded-full bg-accent" />
          {title}
        </h4>

        {/* استفاده مستقیم از الزامات پروپ رندر بومی Base UI بدون ساختار اشتباه asChild */}
        <CollapsibleTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-text-muted hover:text-text-primary"
            >
              <ChevronsUpDown className="size-4" />
              <span className="sr-only">Toggle Details</span>
            </Button>
          }
        />
      </div>

      <CollapsibleContent className="flex flex-col gap-2 pt-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 px-1">
          {items.map((attr, idx) => (
            <div
              key={attr.key}
              className={cn(
                "flex items-baseline justify-between rounded-lg border border-transparent px-3 py-2.5 text-xs transition-colors",
                idx % 2 === 0 ? "bg-surface-secondary/40" : "bg-transparent",
                "hover:border-[--glass-border] hover:bg-surface-secondary/60",
              )}
            >
              <span className="text-text-muted font-medium pr-1 shrink-0 max-w-[40%] text-right">
                {attr.key}
              </span>
              <span className="font-semibold text-text-primary text-left pl-1 leading-relaxed max-w-[58%] break-words">
                {attr.values.join(" | ") || "—"}
              </span>
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
