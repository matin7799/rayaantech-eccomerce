import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { DRIZZLE_CLIENT } from "../database/database.constants";

/**
 * DB row shape for shoppable_stories records.
 */
interface StoryRow extends Record<string, unknown> {
  id: string;
  title: string;
  media_url: string;
  product_id: string | null;
  is_active: boolean;
  created_at: string;
  expires_at: string;
}

/**
 * Public-facing story record representation.
 */
export interface StoryRecord {
  id: string;
  title: string;
  mediaUrl: string;
  productId: string | null;
  isActive: boolean;
  createdAt: string;
  expiresAt: string;
}

/**
 * DTO for creating a shoppable story.
 */
export interface CreateStoryDto {
  /** Story title/caption */
  title: string;
  /** URL to the media asset (image or video) */
  mediaUrl: string;
  /** Optional product ID for shoppable tag linkage (isolated from product_media) */
  productId?: string;
}

/**
 * Shoppable Stories service with strict 24-hour expiration filtering.
 *
 * INVARIANT: The `expires_at` column defaults to `NOW() + interval '24 hours'`
 * at the database level. All active queries explicitly filter `expires_at > NOW()`
 * to guarantee expired stories are never returned to clients.
 *
 * The product_id link is fully isolated from the product_media gallery table.
 */
@Injectable()
export class StoryService {
  private readonly logger = new Logger(StoryService.name);

  constructor(
    @Inject(DRIZZLE_CLIENT)
    private readonly db: NodePgDatabase,
  ) {}

  /**
   * Create a new shoppable story.
   *
   * The expires_at timestamp defaults to NOW() + 24 hours at the DB level.
   * Optional product_id enables shoppable tag triggers without touching product_media.
   */
  async createStory(dto: CreateStoryDto): Promise<StoryRecord> {
    const result = await this.db.execute<StoryRow>(sql`
      INSERT INTO shoppable_stories (title, media_url, product_id, is_active)
      VALUES (${dto.title}, ${dto.mediaUrl}, ${dto.productId ?? null}, true)
      RETURNING id, title, media_url, product_id, is_active, created_at, expires_at
    `);

    const row = result.rows[0];
    if (!row) {
      throw new BadRequestException("Failed to create story");
    }

    this.logger.debug(`Created story ${row.id} (expires: ${row.expires_at})`);
    return this.mapRowToRecord(row);
  }

  /**
   * Query active storefront stories.
   *
   * INVARIANT: Explicitly filters where:
   * - is_active = true
   * - expires_at > NOW() (strict exclusion of expired records)
   *
   * Returns stories ordered by creation time (newest first).
   */
  async getActiveStories(): Promise<StoryRecord[]> {
    const result = await this.db.execute<StoryRow>(sql`
      SELECT id, title, media_url, product_id, is_active, created_at, expires_at
      FROM shoppable_stories
      WHERE is_active = true
        AND expires_at > NOW()
      ORDER BY created_at DESC
    `);

    return result.rows.map((row) => this.mapRowToRecord(row));
  }

  /**
   * Get a single story by ID (regardless of expiry status — for admin views).
   */
  async getStoryById(id: string): Promise<StoryRecord> {
    const result = await this.db.execute<StoryRow>(sql`
      SELECT id, title, media_url, product_id, is_active, created_at, expires_at
      FROM shoppable_stories
      WHERE id = ${id}
      LIMIT 1
    `);

    const row = result.rows[0];
    if (!row) {
      throw new NotFoundException("Story not found");
    }

    return this.mapRowToRecord(row);
  }

  /**
   * Deactivate a story (soft-delete).
   */
  async deactivateStory(id: string): Promise<void> {
    const result = await this.db.execute<{ id: string } & Record<string, unknown>>(sql`
      UPDATE shoppable_stories SET is_active = false
      WHERE id = ${id}
      RETURNING id
    `);

    if (!result.rows[0]) {
      throw new NotFoundException("Story not found");
    }
  }

  private mapRowToRecord(row: StoryRow): StoryRecord {
    return {
      id: row.id,
      title: row.title,
      mediaUrl: row.media_url,
      productId: row.product_id,
      isActive: row.is_active,
      createdAt: String(row.created_at),
      expiresAt: String(row.expires_at),
    };
  }
}
