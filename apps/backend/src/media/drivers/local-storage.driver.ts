import { mkdir, unlink, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { Injectable, Logger } from "@nestjs/common";
// biome-ignore lint/style/useImportType: NestJS dependency injection needs runtime constructor reference
import { ConfigService } from "@nestjs/config";
import { StorageDriver } from "../interfaces/storage-driver.interface";

/**
 * Local filesystem storage driver for development environments.
 *
 * Writes files to a configurable directory (default: ./uploads/)
 * and returns a URL path relative to the static file server.
 *
 * Configuration:
 * - UPLOAD_DIR: Directory path for file storage (default: "./uploads")
 * - APP_URL: Base URL for constructing public URLs (default: "http://localhost:3000")
 */
@Injectable()
export class LocalStorageDriver extends StorageDriver {
  private readonly logger = new Logger(LocalStorageDriver.name);
  private readonly uploadDir: string;
  private readonly appUrl: string;

  constructor(private readonly configService: ConfigService) {
    super();
    this.uploadDir = this.configService.get<string>("UPLOAD_DIR", "./uploads");
    this.appUrl = this.configService.get<string>("APP_URL", "http://localhost:3000");
  }

  async upload(buffer: Buffer, filename: string, _mimeType: string): Promise<string> {
    // Ensure upload directory exists
    await mkdir(this.uploadDir, { recursive: true });

    const filePath = join(this.uploadDir, filename);
    await writeFile(filePath, buffer);

    this.logger.debug(`Saved file locally: ${filePath}`);
    return `${this.appUrl}/uploads/${filename}`;
  }

  async delete(filename: string): Promise<void> {
    try {
      const filePath = join(this.uploadDir, filename);
      await unlink(filePath);
      this.logger.debug(`Deleted local file: ${filePath}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      this.logger.warn(`Failed to delete local file "${filename}": ${message}`);
    }
  }
}
