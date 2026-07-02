import { CalendarIcon } from "lucide-react";
import { useMemo } from "react";
import { toPersianDigits } from "../../lib/persian-numerals";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface InstallmentCalendarProps {
  durationDays: number;
  onDurationChange: (days: number) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * InstallmentCalendar — Repayment start date selector.
 * Allows 25-45 day offset from today.
 * Wrapped in shadcn Popover with Persian Calendar.
 */
export function InstallmentCalendar({
  durationDays,
  onDurationChange,
  open,
  onOpenChange,
}: InstallmentCalendarProps) {
  const minDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 25);
    return d;
  }, []);

  const maxDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 45);
    return d;
  }, []);

  const selectedDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + durationDays);
    return d;
  }, [durationDays]);

  const handleSelect = (date: Date | undefined) => {
    if (!date) return;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diff = Math.round((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    onDurationChange(Math.max(25, Math.min(45, diff)));
    onOpenChange(false);
  };

  return (
    <div className="flex items-center justify-between">
      <span className="text-xs font-medium text-text-secondary">تاریخ شروع بازپرداخت</span>
      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger
          nativeButton={false}
          render={
            <div className="flex items-center gap-1.5 rounded-lg border border-[--glass-border] bg-surface px-3 py-2 text-xs font-medium text-text-primary hover:border-accent transition-colors cursor-pointer" />
          }
        >
          <CalendarIcon className="h-3.5 w-3.5 text-accent" />
          {toPersianDigits(String(durationDays))} روز آینده
        </PopoverTrigger>
        <PopoverContent
          align="end"
          className="w-auto rounded-xl border-[--glass-border] bg-surface-glass p-0 backdrop-blur-xl shadow-glass"
        >
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            disabled={(date: Date) => date < minDate || date > maxDate}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
