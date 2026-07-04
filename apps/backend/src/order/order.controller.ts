import { Body, Controller, HttpCode, HttpStatus, Inject, Post, Req } from "@nestjs/common";
import type { Request } from "express";
import { Scopes } from "../auth/decorators/scopes.decorator";
import type { CachedTokenRecord } from "../auth/interfaces/token-record.interface";
import type { TorobClidRequest } from "../torob/torob-clid.middleware";
import type {
  CheckoutRequestDto,
  CheckoutResult,
  CheckoutTorobContext,
} from "./interfaces/checkout-dto.interface";
import { CheckoutService } from "./services/checkout.service";

/**
 * Order management REST controller.
 *
 * Base path: /api/v1/orders
 *
 * All endpoints require valid API token authentication.
 * The checkout endpoint resolves pricing server-side — client
 * sends only variant IDs and quantities.
 */
@Controller("api/v1/orders")
export class OrderController {
  constructor(@Inject(CheckoutService) private readonly checkoutService: CheckoutService) {}

  /**
   * Initialize the checkout lifecycle.
   *
   * Client sends ONLY: { items: [{ variantId, quantity }] }
   * Server resolves ALL pricing, creates immutable cart snapshot,
   * allocates inventory reservations, and decrements stock.
   *
   * Required scope: orders:write
   */
  @Post("checkout")
  @Scopes("orders:write")
  @HttpCode(HttpStatus.CREATED)
  async checkout(
    @Body() body: CheckoutRequestDto,
    @Req() request: Request,
  ): Promise<{ data: CheckoutResult }> {
    // Extract authenticated user ID from token record (set by ApiTokenGuard)
    const tokenRecord = (request as Request & { tokenRecord: CachedTokenRecord }).tokenRecord;
    const userId = tokenRecord.userId;

    // Thread Torob attribution (captured by TorobClidMiddleware) into checkout.
    const torob: CheckoutTorobContext = {
      torobClid: (request as TorobClidRequest).torobClid,
    };

    const result = await this.checkoutService.executeCheckout(userId, body, torob);
    return { data: result };
  }
}
