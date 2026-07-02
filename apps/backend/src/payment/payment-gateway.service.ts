import { Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type {
  PaymentGatewayStrategy,
  PaymentInitiateInput,
  PaymentInitiateResult,
  PaymentVerifyInput,
  PaymentVerifyResult,
} from "./interfaces/gateway-strategy.interface";
import { PAYMENT_GATEWAYS } from "./interfaces/gateway-strategy.interface";

/**
 * Payment gateway orchestrator.
 *
 * Resolves the correct gateway strategy by method name and delegates
 * initiate/verify operations. Provides a unified entry point for
 * tRPC procedures and controllers.
 */
@Injectable()
export class PaymentGatewayService {
  private readonly logger = new Logger(PaymentGatewayService.name);
  private readonly gatewayMap: Map<string, PaymentGatewayStrategy>;
  private readonly defaultProvider: string;

  constructor(
    @Inject(PAYMENT_GATEWAYS)
    gateways: PaymentGatewayStrategy[],
    @Inject(ConfigService)
    config: ConfigService,
  ) {
    this.gatewayMap = new Map(gateways.map((g) => [g.name, g]));
    this.defaultProvider = config.get<string>("DEFAULT_PAYMENT_PROVIDER") ?? "zarinpal";
  }

  /**
   * Initiate a payment through the specified or default gateway.
   */
  async initiate(
    method: string | undefined,
    input: PaymentInitiateInput,
  ): Promise<PaymentInitiateResult> {
    const gateway = this.resolve(method);
    this.logger.log(`Initiating payment via ${gateway.name} for order ${input.orderId}`);
    return gateway.initiate(input);
  }

  /**
   * Verify a payment callback through the specified gateway.
   */
  async verify(method: string, input: PaymentVerifyInput): Promise<PaymentVerifyResult> {
    const gateway = this.resolve(method);
    return gateway.verify(input);
  }

  private resolve(method?: string): PaymentGatewayStrategy {
    const key = method ?? this.defaultProvider;
    const gateway = this.gatewayMap.get(key);
    if (!gateway) {
      throw new Error(`Unknown payment gateway: ${key}`);
    }
    return gateway;
  }
}
