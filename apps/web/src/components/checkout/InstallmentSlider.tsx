import { formatTomansPersian } from "../../lib/persian-numerals";
import { Slider } from "../ui/slider";

/** Slider step: 100,000 Toman */
export const INSTALLMENT_STEP = 100_000;

interface InstallmentSliderProps {
  value: number;
  onChange: (val: number) => void;
  min: number;
  max: number;
}

/**
 * InstallmentSlider — Stepped down-payment slider.
 * Increments by 100,000 Toman steps.
 * Min floor locked to backend config (exception-aware).
 * RTL physics handled by app-level DirectionProvider.
 */
export function InstallmentSlider({ value, onChange, min, max }: InstallmentSliderProps) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-medium text-text-secondary">پیش‌پرداخت</span>
        <span className="text-sm font-bold text-text-primary tabular-nums">
          {formatTomansPersian(value)} تومان
        </span>
      </div>

      <Slider
        value={[value]}
        onValueChange={(val) => {
          const v = Array.isArray(val) ? val[0] : val;
          onChange(v);
        }}
        min={min}
        max={max}
        step={INSTALLMENT_STEP}
        className="w-full"
      />

      <div className="mt-2 flex items-center justify-between text-[10px] text-text-muted">
        <span>{formatTomansPersian(min)}</span>
        <span>{formatTomansPersian(max)}</span>
      </div>
    </div>
  );
}
