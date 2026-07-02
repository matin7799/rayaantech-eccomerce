export interface AddressEntry {
  id: string;
  title: string;
  recipientName: string;
  phone: string;
  province: string;
  city: string;
  postalCode: string;
  fullAddress: string;
  isDefault: boolean;
}

export interface ProfileRow extends Record<string, unknown> {
  id: string;
  full_name: string;
  email: string | null;
  mobile: string;
  role: string;
  wholesale_status: string;
  rayan_coins: number;
  addresses: AddressEntry[] | null;
  pwa_bonus_claimed: boolean;
  created_at: string;
}

export interface OrderRow extends Record<string, unknown> {
  id: string;
  status: string;
  total_amount: string;
  discount_amount: string | null;
  shipping_address: string | null;
  items: Array<{
    productId: string;
    variantId?: string;
    quantity: number;
    unitPrice: string;
    totalPrice: string;
  }>;
  created_at: string;
  updated_at: string;
}

export interface PaymentRow extends Record<string, unknown> {
  id: string;
  order_id: string;
  method: string;
  status: string;
  amount: string;
  payment_ref_id: string | null;
  paid_at: string | null;
  created_at: string;
}

export interface OrderStatsRow extends Record<string, unknown> {
  pending: string;
  processing: string;
  shipped: string;
  delivered: string;
}
