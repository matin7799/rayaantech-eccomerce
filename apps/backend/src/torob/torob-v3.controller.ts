import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Inject,
  Post,
  Res,
  UseGuards,
} from "@nestjs/common";
import type { ConfigService } from "@nestjs/config";
import { sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { Response } from "express";
import { Public } from "../auth/decorators/public.decorator";
import { DRIZZLE_CLIENT } from "../database/database.constants";
import { TOROB_API_VERSION, TOROB_PRODUCTS_PER_PAGE } from "./torob.constants";
import { TorobJwtGuard } from "./torob-jwt.guard";

/**
 * Raw DB row for the Torob product feed base query.
 */
interface TorobProductRow extends Record<string, unknown> {
  id: string;
  name: string;
  slug: string;
  base_price: string;
  torob_price: string | null;
  discounted_price: string | null;
  stock: number;
  is_active: boolean;
  short_description: string | null;
  category_name: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Request body — exactly one of three modes (per docs/torob/product_api_v3.md §2.2).
 */
interface TorobProductsRequest {
  page_urls?: string[];
  page_uniques?: string[];
  page?: number;
  sort?: "date_added_desc" | "date_updated_desc";
}

interface TorobProductResponse {
  page_unique: string;
  page_url: string;
  product_group_id: string | null;
  title: string;
  subtitle: string | null;
  current_price: number;
  old_price: number | null;
  availability: boolean;
  category_name: string | null;
  image_links: string[];
  short_desc: string | null;
  spec: Record<string, string>;
  date_added: string;
  date_updated: string | null;
}

interface TorobFeedResponse {
  api_version: typeof TOROB_API_VERSION;
  current_page: number;
  total: number;
  max_pages: number;
  products: TorobProductResponse[];
}

const SORT_OPTIONS = new Set(["date_added_desc", "date_updated_desc"]);

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Torob Product API v3 controller.
 *
 * Implements the official feed endpoint at `POST /torob_api/v3/products` per
 * docs/torob/product_api_v3.md. Authenticated by TorobJwtGuard (EdDSA JWT via
 * X-Torob-Token).
 *
 * Prices are stored in Toman (same unit the storefront displays); the Torob spec
 * also requires integer Toman, so stored values are sent as-is — NEVER divide by 10.
 */
// "api/v1/torob" is an alias: the URL registered in the Torob panel points there,
// so POST /api/v1/torob/products must resolve to this same spec-compliant handler.
// (GET /api/v1/torob/products stays on TorobController — methods don't collide.)
//
// @Public() only bypasses the global ApiTokenGuard (Torob does not send an
// Authorization bearer token); authentication is enforced by TorobJwtGuard
// via the X-Torob-Token header.
@Public()
@Controller(["torob_api/v3", "api/v1/torob"])
@UseGuards(TorobJwtGuard)
export class TorobV3Controller {
  private readonly frontendUrl: string;

  constructor(
    @Inject(DRIZZLE_CLIENT)
    private readonly db: NodePgDatabase,
    private readonly configService: ConfigService,
  ) {
    // FRONTEND_URL is the canonical storefront origin (e.g. https://raynew.ir).
    this.frontendUrl = (this.configService.get<string>("FRONTEND_URL") ?? "").replace(/\/$/, "");
  }

  /**
   * Product sync endpoint. Three mutually exclusive modes:
   *   1. { page_urls }     — fetch by absolute product URL
   *   2. { page_uniques }  — fetch by product id (page_unique)
   *   3. { page, sort }    — paginated full feed
   */
  @Post("products")
  @HttpCode(200)
  async getProducts(
    @Body() body: TorobProductsRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<TorobFeedResponse> {
    res.setHeader("Content-Type", "application/json");

    const modes = [body.page_urls, body.page_uniques, body.page !== undefined].filter(Boolean);
    if (modes.length === 0) {
      this.throwSpecError(res, "no valid parameters provided");
    }
    if (modes.length > 1) {
      this.throwSpecError(res, "provide only one of page_urls, page_uniques, or page");
    }

    // Mode 1 & 2: single-product lookup
    if (body.page_urls || body.page_uniques) {
      return this.handleSingleLookup(body, res);
    }

    // Mode 3: paginated feed
    return this.handlePaginatedFeed(body, res);
  }

  // ---------------------------------------------------------------------------
  // Mode 1 & 2: lookup by URL or unique id
  // ---------------------------------------------------------------------------
  private async handleSingleLookup(
    body: TorobProductsRequest,
    res: Response,
  ): Promise<TorobFeedResponse> {
    let productIds: string[] = [];

    if (body.page_uniques && body.page_uniques.length > 0) {
      if (body.page_uniques.some((u) => typeof u !== "string" || u.length === 0)) {
        this.throwSpecError(res, "page_uniques contains invalid entries");
      }
      // page_unique is our product UUID. Drop anything that isn't one (e.g. ids
      // Torob retained from an older feed) — per spec §4.4 unknown products get
      // an empty result, and a non-UUID value would make the uuid comparison throw.
      productIds = body.page_uniques.filter((u) => UUID_PATTERN.test(u));
    } else if (body.page_urls && body.page_urls.length > 0) {
      // page_unique IS the product id; page_url is the storefront URL containing
      // the slug. Extract the product id by matching the URL to known products.
      const slugs = body.page_urls
        .map((u) => this.extractSlugFromUrl(u))
        .filter((s): s is string => Boolean(s));

      if (slugs.length === 0) {
        return this.emptyFeed();
      }

      const idRows = await this.db.execute<{ id: string } & Record<string, unknown>>(sql`
        SELECT id FROM products WHERE slug IN ${slugs} AND is_active = true
      `);
      productIds = idRows.rows.map((r) => r.id);
    }

    if (productIds.length === 0) {
      return this.emptyFeed();
    }

    const products = await this.fetchProductsByIds(productIds);
    return {
      api_version: TOROB_API_VERSION,
      current_page: 1,
      total: products.length,
      max_pages: 1,
      products,
    };
  }

  // ---------------------------------------------------------------------------
  // Mode 3: paginated feed
  // ---------------------------------------------------------------------------
  private async handlePaginatedFeed(
    body: TorobProductsRequest,
    res: Response,
  ): Promise<TorobFeedResponse> {
    const page = body.page;
    if (page === undefined || !Number.isInteger(page) || page < 1) {
      this.throwSpecError(res, "page parameter must be a positive integer");
    }
    if (!(body.sort && SORT_OPTIONS.has(body.sort))) {
      this.throwSpecError(res, "sort parameter is not provided");
    }

    const sort = body.sort as "date_added_desc" | "date_updated_desc";
    const orderColumn = sort === "date_added_desc" ? "created_at" : "updated_at";

    const offset = (page - 1) * TOROB_PRODUCTS_PER_PAGE;

    // Count total active products
    const countResult = await this.db.execute<{ count: string } & Record<string, unknown>>(sql`
      SELECT COUNT(*)::int AS count FROM products WHERE is_active = true
    `);
    const total = Number(countResult.rows[0]?.count ?? 0);
    const maxPages = Math.max(1, Math.ceil(total / TOROB_PRODUCTS_PER_PAGE));

    const rows = await this.db.execute<TorobProductRow>(sql`
      SELECT
        p.id, p.name, p.slug, p.base_price, p.torob_price, p.discounted_price,
        p.stock, p.is_active, p.short_description,
        c.name AS category_name,
        p.created_at, p.updated_at
      FROM products p
      LEFT JOIN categories c ON c.id = p.primary_category_id
      WHERE p.is_active = true
      ORDER BY p.${sql.raw(orderColumn)} DESC, p.id ASC
      LIMIT ${TOROB_PRODUCTS_PER_PAGE} OFFSET ${offset}
    `);

    const products = await this.buildProductResponses(rows.rows);

    return {
      api_version: TOROB_API_VERSION,
      current_page: page,
      total,
      max_pages: maxPages,
      products,
    };
  }

  // ---------------------------------------------------------------------------
  // Shared fetch / build helpers
  // ---------------------------------------------------------------------------

  private async fetchProductsByIds(ids: string[]): Promise<TorobProductResponse[]> {
    const rows = await this.db.execute<TorobProductRow>(sql`
      SELECT
        p.id, p.name, p.slug, p.base_price, p.torob_price, p.discounted_price,
        p.stock, p.is_active, p.short_description,
        c.name AS category_name,
        p.created_at, p.updated_at
      FROM products p
      LEFT JOIN categories c ON c.id = p.primary_category_id
      WHERE p.id IN ${ids} AND p.is_active = true
    `);
    return this.buildProductResponses(rows.rows);
  }

  private async buildProductResponses(rows: TorobProductRow[]): Promise<TorobProductResponse[]> {
    if (rows.length === 0) return [];

    const productIds = rows.map((r) => r.id);

    // Batch-load images and specs for all products in one round-trip each.
    const [imageMap, specMap] = await Promise.all([
      this.loadImages(productIds),
      this.loadSpecs(productIds),
    ]);

    return rows.map((row) => {
      const price = Number(row.torob_price ?? row.discounted_price ?? row.base_price);
      const oldPrice = row.discounted_price ? Number(row.base_price) : null;

      return {
        page_unique: row.id,
        page_url: `${this.frontendUrl}/products/${row.slug}`,
        product_group_id: null,
        title: row.name,
        subtitle: null,
        current_price: Math.trunc(price),
        old_price: oldPrice !== null ? Math.trunc(oldPrice) : null,
        availability: row.is_active && row.stock > 0,
        category_name: row.category_name,
        image_links: imageMap.get(row.id) ?? [],
        short_desc: row.short_description,
        spec: specMap.get(row.id) ?? {},
        date_added: new Date(row.created_at).toISOString(),
        date_updated: new Date(row.updated_at).toISOString(),
      };
    });
  }

  /**
   * Load product images via product_media → media, ordered by display order
   * with thumbnails first (per spec: first image must be the main image).
   */
  private async loadImages(productIds: string[]): Promise<Map<string, string[]>> {
    const result = await this.db.execute<
      { product_id: string; url: string } & Record<string, unknown>
    >(sql`
      SELECT pm.product_id, m.url
      FROM product_media pm
      JOIN media m ON m.id = pm.media_id
      WHERE pm.product_id IN ${productIds}
      ORDER BY pm.product_id, pm.is_thumbnail DESC, pm.display_order ASC
    `);

    const map = new Map<string, string[]>();
    for (const row of result.rows) {
      const list = map.get(row.product_id) ?? [];
      list.push(row.url);
      map.set(row.product_id, list);
    }
    return map;
  }

  /**
   * Load specs via variantAttributeValues → attributeValues → attributeKeys.
   * Keys use the stable slug (or Persian name fallback) for the spec dict.
   */
  private async loadSpecs(productIds: string[]): Promise<Map<string, Record<string, string>>> {
    const result = await this.db.execute<
      { product_id: string; key_name: string; key_slug: string | null; value: string } & Record<
        string,
        unknown
      >
    >(sql`
      SELECT
        pv.product_id,
        ak.name AS key_name,
        ak.slug AS key_slug,
        av.value
      FROM product_variants pv
      JOIN variant_attribute_values vav ON vav.variant_id = pv.id
      JOIN attribute_values av ON av.id = vav.value_id
      JOIN attribute_keys ak ON ak.id = av.key_id
      WHERE pv.product_id IN ${productIds}
    `);

    const map = new Map<string, Record<string, string>>();
    for (const row of result.rows) {
      const key = row.key_slug ?? row.key_name;
      const spec = map.get(row.product_id) ?? {};
      // Only set the first occurrence per key (avoid clobbering on multi-variant products).
      if (!(key in spec)) {
        spec[key] = row.value;
      }
      map.set(row.product_id, spec);
    }
    return map;
  }

  // ---------------------------------------------------------------------------
  // Utilities
  // ---------------------------------------------------------------------------

  /**
   * Extract the product slug from a storefront URL.
   * Expected URL shape: https://raynew.ir/products/<slug> (canonical) or the
   * legacy .../product/<slug> form still stored on Torob's side.
   */
  private extractSlugFromUrl(url: string): string | null {
    try {
      const u = new URL(url);
      const segments = u.pathname.split("/").filter(Boolean);
      let productIndex = segments.indexOf("products");
      if (productIndex === -1) productIndex = segments.indexOf("product");
      if (productIndex === -1 || productIndex + 1 >= segments.length) return null;
      return decodeURIComponent(segments[productIndex + 1]);
    } catch {
      return null;
    }
  }

  private emptyFeed(): TorobFeedResponse {
    return {
      api_version: TOROB_API_VERSION,
      current_page: 1,
      total: 0,
      max_pages: 1,
      products: [],
    };
  }

  /**
   * Spec-compliant 400 error. The Product API v3 requires `{ "error": "..." }`
   * (not the Persian localized envelope from AllExceptionsFilter), so we write
   * directly to the response and throw to short-circuit Nest's pipeline.
   */
  private throwSpecError(res: Response, message: string): never {
    res.status(400).json({ error: message });
    throw new BadRequestException(message);
  }
}
