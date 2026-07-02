import { Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DigipayService } from "../digipay.service";
import type {
  PaymentGatewayStrategy,
  PaymentInitiateInput,
  PaymentInitiateResult,
  PaymentVerifyInput,
  PaymentVerifyResult,
} from "../interfaces/gateway-strategy.interface";

/**
 * DigiPay payment gateway strategy adapter.
 * Delegates actual API communication to the dedicated DigipayService.
 */
@Injectable()
export class DigipayGateway implements PaymentGatewayStrategy {
  readonly name = "digipay_credit" as const;
  private readonly logger = new Logger(DigipayGateway.name);

  constructor(
    @Inject(ConfigService) private readonly config: ConfigService,
    @Inject(DigipayService) private readonly digipayService: DigipayService,
  ) {}

  async initiate(input: PaymentInitiateInput): Promise<PaymentInitiateResult> {
    this.logger.log(`Initiating DigiPay credit ticket: order=${input.orderId}`);
    try {
      const data = await this.digipayService.createTicket({
        cellNumber: input.mobile ?? "",
        amount: input.amount,
        orderId: input.orderId,
        callbackUrl: input.callbackUrl,
      });

      return {
        authority: data.ticket,
        redirectUrl: data.redirectUrl,
        rawResponse: data as unknown as Record<string, unknown>,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.error(`Failed to initiate DigiPay credit for order ${input.orderId}: ${msg}`);
      throw err;
    }
  }

  async verify(input: PaymentVerifyInput): Promise<PaymentVerifyResult> {
    this.logger.log(`Verifying DigiPay payment: authority=${input.authority}`);
    try {
      const data = await this.digipayService.verify({
        authority: input.authority,
        amount: input.amount,
      });

      if (data.result.status === 0) {
        this.logger.log(`DigiPay verified successfully: tracking=${data.trackingCode}`);
        return {
          success: true,
          refId: data.trackingCode,
          rawResponse: data as unknown as Record<string, unknown>,
        };
      }

      this.logger.warn(`DigiPay verify returned failed status: ${data.result.message}`);
      return {
        success: false,
        refId: data.trackingCode ?? "",
        rawResponse: data as unknown as Record<string, unknown>,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.error(`Error verifying DigiPay payment for authority ${input.authority}: ${msg}`);
      return { success: false, refId: "" };
    }
  }
}
