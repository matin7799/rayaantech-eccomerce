import { Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { DRIZZLE_CLIENT } from "../database/database.constants";

interface DigipayTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

interface DigipayTicketResponse {
  result: { status: number; message: string };
  ticket: string;
  redirectUrl: string;
}

interface DigipayVerifyResponse {
  result: { status: number; message: string };
  trackingCode: string;
  providerId: string;
  amount: number;
  paymentGateway: number;
  additionalInfo?: Record<string, unknown>;
}

@Injectable()
export class DigipayService {
  private readonly logger = new Logger(DigipayService.name);
  private readonly baseUrl: string;
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly username: string;
  private readonly password: string;
  private readonly sellerId: string;
  private readonly supplierId: string;

  private accessToken: string | null = null;
  private tokenExpiresAt = 0;

  constructor(
    @Inject(ConfigService) private readonly config: ConfigService,
    @Inject(DRIZZLE_CLIENT) private readonly db: NodePgDatabase,
  ) {
    const sandbox = this.config.get<string>("DIGIPAY_SANDBOX") === "true";
    this.baseUrl = sandbox
      ? "https://uat.mydigipay.info/digipay/api"
      : "https://api.mydigipay.com/digipay/api";
    this.clientId = this.config.getOrThrow("DIGIPAY_CLIENT_ID");
    this.clientSecret = this.config.getOrThrow("DIGIPAY_CLIENT_SECRET");
    this.username = this.config.getOrThrow("DIGIPAY_USERNAME");
    this.password = this.config.getOrThrow("DIGIPAY_PASSWORD");
    this.sellerId = this.config.get("DIGIPAY_SELLER_ID") ?? "1";
    this.supplierId = this.config.get("DIGIPAY_SUPPLIER_ID") ?? "1";
  }

  async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiresAt) {
      return this.accessToken;
    }

    const credentials = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString("base64");
    const formData = new URLSearchParams({
      username: this.username,
      password: this.password,
      grant_type: "password",
    });

    const res = await fetch(`${this.baseUrl}/oauth/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    if (!res.ok) {
      this.logger.error(`DigiPay OAuth failed: ${res.status}`);
      throw new Error("DigiPay authentication failed");
    }

    const data = (await res.json()) as DigipayTokenResponse;
    this.accessToken = data.access_token;
    this.tokenExpiresAt = Date.now() + (data.expires_in - 60) * 1000;

    return this.accessToken;
  }

  async compileBasketFromOrder(orderId: string) {
    const orderResult = await this.db.execute<{ items: any }>(sql`
      SELECT items FROM orders WHERE id = ${orderId} LIMIT 1
    `);
    const order = orderResult.rows[0];
    if (!(order && order.items)) {
      throw new Error(`Order ${orderId} not found or has no items`);
    }
    const items = order.items as Array<{ productId: string; quantity: number }>;
    return this.compileBasket(items, orderId);
  }

  /**
   * Resolve brand and category names server-side and compile basket items.
   */
  async compileBasket(items: Array<{ productId: string; quantity: number }>, basketId: string) {
    const productIds = items.map((i) => i.productId);
    if (productIds.length === 0) {
      return { basketId, items: [] };
    }

    // Fetch product name, brand name, and category name server-side
    const dbResult = await this.db.execute<{
      product_id: string;
      product_name: string;
      brand_name: string | null;
      category_name: string;
    }>(sql`
      SELECT
        p.id AS product_id,
        p.name AS product_name,
        b.name AS brand_name,
        c.name AS category_name
      FROM products p
      LEFT JOIN brands b ON b.id = p.brand_id
      LEFT JOIN categories c ON c.id = p.primary_category_id
      WHERE p.id = ANY(${productIds}::uuid[])
    `);

    const productMap = new Map(dbResult.rows.map((row) => [row.product_id, row]));

    const compiledItems = items.map((item) => {
      const dbProd = productMap.get(item.productId);
      return {
        sellerId: this.sellerId,
        supplierId: this.supplierId,
        productCode: item.productId,
        brand: dbProd?.brand_name || "RayanTech",
        productType: 1, // Default durable item
        count: item.quantity,
        categoryId: dbProd?.category_name || "General",
      };
    });

    return {
      basketId,
      items: compiledItems,
    };
  }

  async createTicket(input: {
    cellNumber: string;
    amount: number;
    orderId: string;
    callbackUrl: string;
    basketItems?: Array<{ productId: string; quantity: number }>;
  }): Promise<DigipayTicketResponse> {
    const token = await this.getAccessToken();
    const basketDetailsDto = input.basketItems
      ? await this.compileBasket(input.basketItems, input.orderId)
      : await this.compileBasketFromOrder(input.orderId);

    const body = {
      cellNumber: input.cellNumber,
      amount: input.amount,
      providerId: input.orderId,
      callbackUrl: input.callbackUrl,
      basketDetailsDto,
    };

    const res = await fetch(`${this.baseUrl}/tickets/business?type=11`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Agent: "WEB",
        "Digipay-Version": "2022-02-02",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "unknown");
      this.logger.error(`DigiPay ticket failed: ${res.status} ${errText}`);
      throw new Error(`DigiPay ticket creation failed (${res.status})`);
    }

    const data = (await res.json()) as DigipayTicketResponse;
    if (data.result.status !== 0) {
      this.logger.error(`DigiPay ticket error: ${data.result.message}`);
      throw new Error(`DigiPay: ${data.result.message}`);
    }

    return data;
  }

  async verify(input: { authority: string; amount: number }): Promise<DigipayVerifyResponse> {
    const token = await this.getAccessToken();

    const body = {
      trackingCode: input.authority,
      providerId: input.authority,
    };

    const res = await fetch(`${this.baseUrl}/purchases/verify?type=5`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "unknown");
      this.logger.error(`DigiPay verify HTTP error: ${res.status} ${errText}`);
      throw new Error(`DigiPay verification failed with status ${res.status}`);
    }

    const data = (await res.json()) as DigipayVerifyResponse;
    return data;
  }
}
