import { Injectable, Logger } from "@nestjs/common";
import sharp from "sharp";

/**
 * Result of image processing.
 */
export interface ProcessedImage {
  /** WebP-encoded image buffer */
  buffer: Buffer;
  /** Output width in pixels */
  width: number;
  /** Output height in pixels */
  height: number;
  /** File size in bytes */
  size: number;
  /** MIME type (always "image/webp") */
  mimeType: "image/webp";
}

/**
 * Maximum horizontal width boundary for processed images.
 * INVARIANT: All uploaded images are scaled to this maximum width
 * while preserving aspect ratio to prevent CLS on the frontend.
 */
const MAX_WIDTH_PX = 1200;

/**
 * WebP quality setting (0-100). Balances visual quality vs file size.
 */
const WEBP_QUALITY = 82;

/**
 * Media processing service powered by Sharp.
 *
 * INVARIANT: Every uploaded image is:
 * 1. Converted entirely to .webp format
 * 2. Scaled to a maximum width of exactly 1200px (preserving aspect ratio)
 * 3. Compressed with optimized WebP encoding settings
 *
 * This prevents Cumulative Layout Shift (CLS) by guaranteeing consistent
 * dimensions and eliminates oversized assets from the delivery pipeline.
 */
@Injectable()
export class MediaProcessorService {
  private readonly logger = new Logger(MediaProcessorService.name);

  /**
   * Process an image buffer: convert to WebP, scale to max 1200px width.
   *
   * @param input - Raw image buffer (any format sharp supports: JPEG, PNG, GIF, AVIF, TIFF, etc.)
   * @returns Processed image data with WebP buffer and metadata
   */
  async processImage(input: Buffer): Promise<ProcessedImage> {
    const pipeline = sharp(input)
      .resize({
        width: MAX_WIDTH_PX,
        // Only downscale — never upscale images smaller than 1200px
        withoutEnlargement: true,
        // Maintain aspect ratio
        fit: "inside",
      })
      .webp({
        quality: WEBP_QUALITY,
        // Enable lossless for images with transparency if needed
        effort: 4,
      });

    const outputBuffer = await pipeline.toBuffer();
    const metadata = await sharp(outputBuffer).metadata();

    const result: ProcessedImage = {
      buffer: outputBuffer,
      width: metadata.width ?? 0,
      height: metadata.height ?? 0,
      size: outputBuffer.length,
      mimeType: "image/webp",
    };

    this.logger.debug(`Processed image: ${result.width}x${result.height}, ${result.size} bytes`);

    return result;
  }

  /**
   * Check if a MIME type is a processable image format.
   */
  isProcessableImage(mimeType: string): boolean {
    const supported = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/avif",
      "image/tiff",
      "image/svg+xml",
    ];
    return supported.includes(mimeType);
  }
}
