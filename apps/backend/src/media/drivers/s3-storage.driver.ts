import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Injectable, Logger } from "@nestjs/common";
// biome-ignore lint/style/useImportType: NestJS dependency injection needs runtime constructor reference
import { ConfigService } from "@nestjs/config";
import { StorageDriver } from "../interfaces/storage-driver.interface";

/**
 * S3-compatible storage driver for production environments.
 *
 * Works with AWS S3, MinIO, Cloudflare R2, DigitalOcean Spaces,
 * and any other S3-compatible object storage service.
 *
 * Configuration (environment variables):
 * - S3_ENDPOINT: Custom endpoint URL (optional, for non-AWS services)
 * - S3_REGION: AWS region (default: "us-east-1")
 * - S3_BUCKET: Target bucket name (required)
 * - S3_ACCESS_KEY_ID: Access key credential
 * - S3_SECRET_ACCESS_KEY: Secret key credential
 * - S3_PUBLIC_URL: Public CDN/bucket URL prefix for constructing file URLs
 * - S3_FORCE_PATH_STYLE: Use path-style addressing (for MinIO, default: false)
 */
@Injectable()
export class S3StorageDriver extends StorageDriver {
  private readonly logger = new Logger(S3StorageDriver.name);
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly publicUrl: string;

  constructor(private readonly configService: ConfigService) {
    super();

    const endpoint = this.configService.get<string>("S3_ENDPOINT", "");
    const region = this.configService.get<string>("S3_REGION", "us-east-1");
    const accessKeyId = this.configService.getOrThrow<string>("S3_ACCESS_KEY_ID");
    const secretAccessKey = this.configService.getOrThrow<string>("S3_SECRET_ACCESS_KEY");
    const forcePathStyle =
      this.configService.get<string>("S3_FORCE_PATH_STYLE", "false") === "true";

    this.bucket = this.configService.getOrThrow<string>("S3_BUCKET");
    this.publicUrl = this.configService.getOrThrow<string>("S3_PUBLIC_URL");

    this.client = new S3Client({
      region,
      endpoint: endpoint || undefined,
      forcePathStyle,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async upload(buffer: Buffer, filename: string, mimeType: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: `media/${filename}`,
      Body: buffer,
      ContentType: mimeType,
      CacheControl: "public, max-age=31536000, immutable",
    });

    await this.client.send(command);
    this.logger.debug(`Uploaded to S3: media/${filename}`);

    // Construct public URL (CDN or direct bucket URL)
    return `${this.publicUrl}/media/${filename}`;
  }

  async delete(filename: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: `media/${filename}`,
      });
      await this.client.send(command);
      this.logger.debug(`Deleted from S3: media/${filename}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      this.logger.warn(`Failed to delete S3 object "${filename}": ${message}`);
    }
  }
}
