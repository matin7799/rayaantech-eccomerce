import { motion } from "framer-motion";
import { CheckIcon, PackageIcon, TruckIcon, ZapIcon } from "lucide-react";
import { formatTomansPersian } from "../../lib/persian-numerals";
import { trpc } from "../../lib/trpc";
import { Skeleton } from "../ui/skeleton";

/**
 * Icon mapping for shipping method codes.
 */
const ICON_MAP: Record<string, typeof TruckIcon> = {
  free_post: PackageIcon,
  express_delivery: ZapIcon,
  after_pay_cargo: TruckIcon,
};

interface Props {
  selectedId: string | null;
  onSelect: (id: string) => void;
}

/**
 * ShippingSelector — Minimal delivery method selection.
 *
 * Fetches active shipping methods from trpc.shipping.listActiveMethods
 * and renders compact selectable rows.
 */
export function ShippingSelector({ selectedId, onSelect }: Props) {
  const { data, isLoading } = trpc.shipping.listActiveMethods.useQuery();
  const methods = data ?? [];

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2].map((i) => (
          <Skeleton key={i} className="h-14 rounded-xl" />
        ))}
      </div>
    );
  }

  if (methods.length === 0) {
    return <p className="py-4 text-center text-xs text-text-muted">روش ارسالی در دسترس نیست</p>;
  }

  return (
    <div className="space-y-2">
      {methods.map((method) => {
        const Icon = ICON_MAP[method.code] ?? TruckIcon;
        const isSelected = method.id === selectedId;
        const isFree = method.baseCost === 0;

        return (
          <motion.button
            key={method.id}
            type="button"
            onClick={() => onSelect(method.id)}
            whileTap={{ scale: 0.98 }}
            className={`relative flex w-full items-center gap-3 rounded-xl border p-3 text-start transition-all duration-200 ${
              isSelected
                ? "border-accent bg-surface-action"
                : "border-[--glass-border] bg-surface hover:border-accent/40"
            }`}
          >
            {/* Icon */}
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                isSelected ? "bg-accent/10 text-accent" : "bg-surface-secondary text-text-muted"
              }`}
            >
              <Icon className="h-4 w-4" />
            </span>

            {/* Name + estimated */}
            <div className="flex-1 min-w-0">
              <span className="text-xs font-medium text-text-primary">{method.nameFa}</span>
              {method.estimatedDays && (
                <span className="text-[10px] text-text-muted mr-2">({method.estimatedDays})</span>
              )}
            </div>

            {/* Cost */}
            <span
              className={`shrink-0 text-xs font-semibold ${isFree ? "text-success" : method.isCargoCollect ? "text-warning" : "text-text-secondary"}`}
            >
              {isFree
                ? "رایگان"
                : method.isCargoCollect
                  ? "پس کرایه"
                  : `${formatTomansPersian(method.baseCost)} ت`}
            </span>

            {/* Check */}
            {isSelected && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent"
              >
                <CheckIcon className="h-3 w-3 text-white" />
              </motion.span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
