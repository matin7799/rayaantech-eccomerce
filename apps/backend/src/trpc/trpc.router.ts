import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { AvalAiService } from "../ai/avalai.service";
import type { AiFirewallGuard } from "../ai/guards/ai-firewall.guard";
import type { OtpService } from "../auth/services/otp.service";
import type { SessionService } from "../auth/services/session.service";
import type { CheckoutService } from "../order/services/checkout.service";
import type { InstallmentService } from "../order/services/installment.service";
import type { DigipayService } from "../payment/digipay.service";
import type { PaymentGatewayService } from "../payment/payment-gateway.service";
import type { UserService } from "../users/user.service";
import { createAddonsRouter } from "./routers/addons.router";
import { createAdminRouter } from "./routers/admin.router";
import { createAIRouter } from "./routers/ai.router";
import { createAuthRouter } from "./routers/auth.router";
import { createBannersRouter } from "./routers/banners.router";
import { createBlogRouter } from "./routers/blog.router";
import { createCartRouter } from "./routers/cart.router";
import { createCategoriesRouter } from "./routers/categories.router";
import { createHomeCollectionsRouter } from "./routers/home-collections.router";
import { createInstallmentsRouter } from "./routers/installments.router";
import { createOrderRouter } from "./routers/order.router";
import { createPartnerRouter } from "./routers/partner.router";
import { createPaymentRouter } from "./routers/payment.router";
import { createPricingRouter } from "./routers/pricing.router";
import { createProductDetailRouter } from "./routers/product-detail.router";
import { createProductsRouter } from "./routers/products.router";
import { createProfileRouter } from "./routers/profile.router";
import { createSearchRouter } from "./routers/search.router";
import { createShippingRouter } from "./routers/shipping.router";
import { createStoriesRouter } from "./routers/stories.router";
import { createUserRouter } from "./routers/user.router";
import { mergeRouters, router } from "./trpc.init";

/**
 * Dependencies required to build the app router.
 */
export interface AppRouterDeps {
  otpService: OtpService;
  sessionService: SessionService;
  installmentService: InstallmentService;
  checkoutService: CheckoutService;
  paymentGatewayService: PaymentGatewayService;
  digipayService: DigipayService;
  callbackBaseUrl: string;
  db: NodePgDatabase;
  avalAiService: AvalAiService;
  aiFirewallGuard: AiFirewallGuard;
  userService: UserService;
}

/**
 * Create the merged application tRPC router.
 */
export function createAppRouter(deps: AppRouterDeps) {
  return router({
    addons: createAddonsRouter(deps.db),
    ai: createAIRouter(deps.avalAiService, deps.aiFirewallGuard, deps.db),
    auth: createAuthRouter(deps.otpService, deps.sessionService, deps.db),
    banners: createBannersRouter(deps.db),
    categories: createCategoriesRouter(deps.db),
    homeCollections: createHomeCollectionsRouter(deps.db),
    pricing: createPricingRouter(),
    products: mergeRouters(createProductsRouter(deps.db), createProductDetailRouter(deps.db)),
    profile: createProfileRouter(deps.db),
    stories: createStoriesRouter(deps.db),
    search: createSearchRouter(deps.db),
    cart: createCartRouter(deps.db),
    order: createOrderRouter(
      deps.checkoutService,
      deps.paymentGatewayService,
      deps.callbackBaseUrl,
      deps.db,
    ),
    payment: createPaymentRouter(
      deps.checkoutService,
      deps.digipayService,
      deps.callbackBaseUrl,
      deps.db,
    ),
    installments: createInstallmentsRouter(deps.installmentService, deps.db),
    admin: createAdminRouter(deps.db),
    partner: createPartnerRouter(deps.db),
    user: createUserRouter(deps.db, deps.userService),
    blog: createBlogRouter(deps.db),
    shipping: createShippingRouter(deps.db),
  });
}

/**
 * Export the router type for client-side inference.
 */
export type AppRouter = ReturnType<typeof createAppRouter>;
