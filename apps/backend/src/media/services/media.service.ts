import { randomUUID } from "node:crypto";
import { BadRequestException, Inject, Injectable, Logger } from "@nestjs/common";
import { sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { DRIZZLE_CLIENT } from "../../database/database.constants";
import { StorageDriver } from "../interfaces/storage-driver.interface";
import { MediaProcessorService } from "./media-processor.service";

/**
 * DB row shape for media records.
 */
interface MediaRow extends Record<string, unknown> {
  id: string;
  url: string;
  webp_url: string | null;
  mime_type: string;
  file_size: number;
  storage_provider: string;
  created_at: string;
}

/**
 * Public-facing media record representation.
 */
export interface MediaRecord {
  id: string;
  url: string;
  webpUrl: string | null;
  mimeType: string;
  fileSize: number;
  storageProvider: string;
  createdAt: string;
}

/**
 * Core media service handling file uploads, processing, and database persistence.
 *
 * Upload flow:
 * 1. Receive raw file buffer from Multer
 * 2. If image: process via MediaProcessorService (WebP conversion, 1200px resize)
 * 3. Upload processed buffer via StorageDriver (local or S3)
 * 4. Record metadata in the `media` database table
 * 5. Return the persisted media record
 */
@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);

  constructor(
    @Inject(DRIZZLE_CLIENT)
    private readonly db: NodePgDatabase,
    @Inject(StorageDriver)
    private readonly storageDriver: StorageDriver,
    @Inject(MediaProcessorService)
    private readonly processor: MediaProcessorService,
  ) {}

  /**
   * Upload and process a file.
   *
   * For images: converts to WebP at max 1200px width, stores both
   * original URL (as the WebP result) and webp_url in the media table.
   *
   * For non-images (video, PDF, etc.): stores as-is without processing.
   */
  async uploadFile(
    buffer: Buffer,
    originalName: string,
    mimeType: string,
    storageProvider: "s3" | "local",
  ): Promise<MediaRecord> {
    if (!buffer || buffer.length === 0) {
      throw new BadRequestException("Empty file received");
    }

    const fileId = randomUUID();
    let finalBuffer: Buffer;
    let finalMimeType: string;
    let fileSize: number;
    let webpUrl: string | null = null;

    if (this.processor.isProcessableImage(mimeType)) {
      // Process image: convert to WebP, scale to 1200px max width
      const processed = await this.processor.processImage(buffer);
      finalBuffer = processed.buffer;
      finalMimeType = processed.mimeType;
      fileSize = processed.size;

      // Upload the processed WebP file
      const webpFilename = `${fileId}.webp`;
      webpUrl = await this.storageDriver.upload(finalBuffer, webpFilename, finalMimeType);

      this.logger.debug(`Uploaded processed image: ${webpFilename}`);
    } else {
      // Non-image files: store as-is
      finalBuffer = buffer;
      finalMimeType = mimeType;
      fileSize = buffer.length;

      const extension = this.extractExtension(originalName);
      const filename = `${fileId}${extension}`;
      await this.storageDriver.upload(finalBuffer, filename, finalMimeType);
      webpUrl = null;

      this.logger.debug(`Uploaded non-image file: ${filename}`);
    }

    // The primary URL is always the WebP version for images
    const primaryUrl =
      webpUrl ??
      (await this.storageDriver.upload(
        finalBuffer,
        `${fileId}${this.extractExtension(originalName)}`,
        finalMimeType,
      ));

    // Persist to database
    const result = await this.db.execute<MediaRow>(sql`
      INSERT INTO media (url, webp_url, mime_type, file_size, storage_provider)
      VALUES (${primaryUrl}, ${webpUrl}, ${finalMimeType}, ${fileSize}, ${storageProvider})
      RETURNING id, url, webp_url, mime_type, file_size, storage_provider, created_at
    `);

    const row = result.rows[0];
    if (!row) {
      throw new BadRequestException("Failed to persist media record");
    }

    return this.mapRowToRecord(row);
  }

  /**
   * Get a media record by ID.
   */
  async getMediaById(id: string): Promise<MediaRecord> {
    const result = await this.db.execute<MediaRow>(sql`
      SELECT id, url, webp_url, mime_type, file_size, storage_provider, created_at
      FROM media
      WHERE id = ${id}
      LIMIT 1
    `);

    const row = result.rows[0];
    if (!row) {
      throw new BadRequestException("Media not found");
    }

    return this.mapRowToRecord(row);
  }

  private extractExtension(filename: string): string {
    const lastDot = filename.lastIndexOf(".");
    return lastDot >= 0 ? filename.slice(lastDot) : "";
  }

  private mapRowToRecord(row: MediaRow): MediaRecord {
    return {
      id: row.id,
      url: row.url,
      webpUrl: row.webp_url,
      mimeType: row.mime_type,
      fileSize: row.file_size,
      storageProvider: row.storage_provider,
      createdAt: String(row.created_at),
    };
  }
}
