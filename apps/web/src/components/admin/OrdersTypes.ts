export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned";

export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";
export type PaymentMethod = "zarinpal" | "digipay_credit" | "rayaan_credit";

export interface ShippingAddress {
  state?: string;
  city?: string;
  fullAddress?: string;
  postalCode?: string;
  receiverName?: string;
  mobile?: string;
}

export interface OrderItem {
  productId: string;
  variantId?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  productTitle: string;
  imageUrl?: string;
  variantSku?: string;
}

export interface Payment {
  id: string;
  method: string;
  status: string;
  amount: number;
  paymentRefId: string | null;
  paidAt: string | null;
  createdAt: string;
}

export interface InstallmentDetails {
  id: string;
  tenureMonths: number;
  downPaymentAmount: number;
  monthlyAmount: number;
  totalAmount: number;
  durationDays: number;
  installmentStatus: string;
}

export interface OrderRow {
  id: string;
  customerName: string;
  status: OrderStatus;
  totalAmount: number;
  discountAmount: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  hasInstallment: boolean;
  installmentDetails: InstallmentDetails | null;
  createdAt: string;
  updatedAt: string;
  shippingAddress: ShippingAddress | null;
  items: OrderItem[];
  payments: Payment[];
}

export const ORDER_STATUS_CONFIG: Record<OrderStatus, { label: string; dotClass: string }> = {
  pending: { label: "در انتظار پرداخت", dotClass: "bg-warning" },
  confirmed: { label: "تأیید شده", dotClass: "bg-accent" },
  processing: { label: "در حال پردازش", dotClass: "bg-accent" },
  shipped: { label: "ارسال شده", dotClass: "bg-blue-500" },
  delivered: { label: "تحویل شده", dotClass: "bg-success" },
  cancelled: { label: "لغو شده", dotClass: "bg-destructive" },
  returned: { label: "مرجوعی", dotClass: "bg-destructive" },
};

export const PAYMENT_STATUS_CONFIG: Record<PaymentStatus, { label: string; className: string }> = {
  pending: { label: "در انتظار", className: "bg-warning/15 text-warning border-warning/20" },
  completed: { label: "پرداخت شده", className: "bg-success/15 text-success border-success/20" },
  failed: {
    label: "ناموفق",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
  refunded: { label: "مسترد", className: "bg-accent/15 text-accent border-accent/20" },
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  zarinpal: "زرین‌پال",
  digipay_credit: "اعتبار دیجی‌پی",
  rayaan_credit: "اقساط ویژه",
};
