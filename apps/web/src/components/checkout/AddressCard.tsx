import { CheckIcon } from "lucide-react";

interface Address {
  id: string;
  title: string;
  recipientName: string;
  province: string;
  city: string;
  fullAddress: string;
  isDefault: boolean;
  phone: string;
}

interface AddressCardProps {
  address: Address;
  selected: boolean;
  onSelect: () => void;
}

export function AddressCard({ address, selected, onSelect }: AddressCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative flex flex-col gap-1.5 rounded-xl border p-4 text-start transition-all duration-200 ${
        selected
          ? "border-accent bg-surface-action shadow-sm"
          : "border-[--glass-border] bg-surface hover:border-accent/40"
      }`}
    >
      {selected && (
        <span className="absolute top-3 inset-e-3 flex h-5 w-5 items-center justify-center rounded-full bg-accent">
          <CheckIcon className="h-3 w-3 text-white" />
        </span>
      )}
      <span className="text-xs font-semibold text-text-primary">{address.title}</span>
      <span className="text-[11px] text-text-muted">
        {address.province}، {address.city}
      </span>
      <span className="text-[11px] text-text-muted line-clamp-2 leading-relaxed">
        {address.fullAddress}
      </span>
      <span className="text-[10px] text-text-muted mt-1">گیرنده: {address.recipientName}</span>
    </button>
  );
}
