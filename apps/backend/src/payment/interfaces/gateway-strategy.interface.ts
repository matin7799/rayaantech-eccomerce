/**
 * Payment gateway strategy interface.
 *
 * Each gateway (Zarinpal, DigiPay) implements this contract to provide
 * a unified payment lifecycle: initiate → redirect → verify.
 */
export interface PaymentInitiateInput {
  /** Order UUID */
  orderId: string;
  /** Total amount in integer Rials */
  amount: number;
  /** Order description for gateway display */
  description: string;
  /** User mobile number (required by DigiPay) */
  mobile?: string;
  /** User email (optional, Zarinpal) */
  email?: string;
  /** Callback URL the gateway should redirect to after payment */
  callbackUrl: string;
}

export interface PaymentInitiateResult {
  /** Gateway-issued authority/ticket code */
  authority: string;
  /** Full redirect URL to send the user to */
  redirectUrl: string;
  /** Raw gateway response for audit logging */
  rawResponse?: Record<string, unknown>;
}

export interface PaymentVerifyInput {
  /** Gateway authority/ticket/tracking code */
  authority: string;
  /** Expected amount in integer Rials (anti-tampering) */
  amount: number;
}

export interface PaymentVerifyResult {
  /** Whether the payment was successfully verified */
  success: boolean;
  /** Gateway reference ID (ref_id / trackingCode) */
  refId: string;
  /** Masked card PAN (if available) */
  cardPan?: string;
  /** Raw gateway verification response */
  rawResponse?: Record<string, unknown>;
}

/**
 * Strategy contract for payment gateways.
 * Implementations: ZarinpalGateway, DigipayGateway
 */
export interface PaymentGatewayStrategy {
  /** Unique gateway identifier */
  readonly name: "zarinpal" | "digipay_credit";

  /** Create a payment request and return the redirect URL */
  initiate(input: PaymentInitiateInput): Promise<PaymentInitiateResult>;

  /** Verify a payment after callback */
  verify(input: PaymentVerifyInput): Promise<PaymentVerifyResult>;
}

/**
 * DI injection token for gateway strategy registry.
 */
export const PAYMENT_GATEWAYS = Symbol("PAYMENT_GATEWAYS");
