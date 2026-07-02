import { Inject, Module, type OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HttpAdapterHost } from "@nestjs/core";
import * as trpcExpress from "@trpc/server/adapters/express";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { Express } from "express";
import { AiModule } from "../ai/ai.module";
import { AvalAiService } from "../ai/avalai.service";
import { AiFirewallGuard } from "../ai/guards/ai-firewall.guard";
import { AuthModule } from "../auth/auth.module";
import { OtpService } from "../auth/services/otp.service";
import { SessionService } from "../auth/services/session.service";
import { DRIZZLE_CLIENT } from "../database/database.constants";
import { CheckoutService } from "../order/services/checkout.service";
import { InstallmentService } from "../order/services/installment.service";
import { DigipayService } from "../payment/digipay.service";
import { PaymentModule } from "../payment/payment.module";
import { PaymentGatewayService } from "../payment/payment-gateway.service";
import { UserModule } from "../users/user.module";
import { UserService } from "../users/user.service";
import { createContextFactory } from "./trpc.context";
import { createAppRouter } from "./trpc.router";

/**
 * tRPC NestJS integration module.
 *
 * Mounts the Express middleware adapter at `/trpc` on module init.
 * All tRPC routers share the session-aware context built from cookies.
 *
 * Imports AuthModule to access OtpService and SessionService.
 * Imports PaymentModule to access PaymentGatewayService.
 * Imports AiModule to access AvalAiService and AiFirewallGuard.
 */
@Module({
  imports: [AuthModule, PaymentModule, AiModule, UserModule],
  providers: [InstallmentService, CheckoutService],
})
export class TrpcModule implements OnModuleInit {
  constructor(
    @Inject(HttpAdapterHost)
    private readonly httpAdapterHost: HttpAdapterHost,
    @Inject(OtpService)
    private readonly otpService: OtpService,
    @Inject(SessionService)
    private readonly sessionService: SessionService,
    @Inject(InstallmentService)
    private readonly installmentService: InstallmentService,
    @Inject(CheckoutService)
    private readonly checkoutService: CheckoutService,
    @Inject(PaymentGatewayService)
    private readonly paymentGatewayService: PaymentGatewayService,
    @Inject(DigipayService)
    private readonly digipayService: DigipayService,
    @Inject(ConfigService)
    private readonly configService: ConfigService,
    @Inject(AvalAiService)
    private readonly avalAiService: AvalAiService,
    @Inject(AiFirewallGuard)
    private readonly aiFirewallGuard: AiFirewallGuard,
    @Inject(DRIZZLE_CLIENT)
    private readonly db: NodePgDatabase,
    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  onModuleInit(): void {
    // Get the underlying Express app instance
    const expressApp: Express = this.httpAdapterHost.httpAdapter.getInstance();

    const callbackBaseUrl =
      this.configService.get<string>("PAYMENT_CALLBACK_URL") ??
      this.configService.get<string>("FRONTEND_URL") ??
      "http://localhost:3000";

    const appRouter = createAppRouter({
      otpService: this.otpService,
      sessionService: this.sessionService,
      installmentService: this.installmentService,
      checkoutService: this.checkoutService,
      paymentGatewayService: this.paymentGatewayService,
      digipayService: this.digipayService,
      callbackBaseUrl,
      db: this.db,
      avalAiService: this.avalAiService,
      aiFirewallGuard: this.aiFirewallGuard,
      userService: this.userService,
    });

    const createContext = createContextFactory(this.sessionService, this.db);

    // Mount tRPC at /trpc — Express middleware pattern
    expressApp.use(
      "/trpc",
      trpcExpress.createExpressMiddleware({
        router: appRouter,
        createContext,
      }),
    );
  }
}
