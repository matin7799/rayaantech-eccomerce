import { Module } from "@nestjs/common";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { DigipayService } from "./digipay.service";
import { DigipayGateway } from "./gateways/digipay.gateway";
import { ZarinpalGateway } from "./gateways/zarinpal.gateway";
import { PAYMENT_GATEWAYS } from "./interfaces/gateway-strategy.interface";
import { PaymentKafkaListener } from "./listeners/payment-kafka.listener";
import { PaymentSmsListener } from "./listeners/payment-sms.listener";
import { PaymentController } from "./payment.controller";
import { PaymentService } from "./payment.service";
import { PaymentGatewayService } from "./payment-gateway.service";
import { PaymentVerifyController } from "./payment-verify.controller";

/**
 * Payment processing module.
 *
 * Provides:
 * - PaymentController: POST /api/v1/payments/callback (webhook)
 * - PaymentVerifyController: POST /api/v1/payments/verify (frontend-initiated)
 * - PaymentService: Idempotent payment recording + order transitions
 * - PaymentGatewayService: Strategy orchestrator
 * - ZarinpalGateway + DigipayGateway: Gateway implementations
 *
 * Dependencies (from global modules):
 * - DatabaseModule (DRIZZLE_CLIENT)
 * - ConfigModule (env variables)
 * - EventEmitterModule (payment.confirmed event)
 */
@Module({
  imports: [EventEmitterModule.forRoot()],
  controllers: [PaymentController, PaymentVerifyController],
  providers: [
    PaymentService,
    ZarinpalGateway,
    DigipayGateway,
    DigipayService,
    {
      provide: PAYMENT_GATEWAYS,
      useFactory: (zarinpal: ZarinpalGateway, digipay: DigipayGateway) => [zarinpal, digipay],
      inject: [ZarinpalGateway, DigipayGateway],
    },
    PaymentGatewayService,
    PaymentSmsListener,
    PaymentKafkaListener,
  ],
  exports: [PaymentService, PaymentGatewayService, DigipayService],
})
export class PaymentModule {}
