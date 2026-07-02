/**
 * Abstract storage driver interface for decoupled file persistence.
 *
 * Implementations:
 * - LocalStorageDriver: Writes to local disk (development)
 * - S3StorageDriver: Writes to any S3-compatible endpoint (production)
 *
 * The active driver is selected by the STORAGE_PROVIDER env var.
 */
export abstract class StorageDriver {
  /**
   * Persist a file buffer and return the publicly-accessible URL.
   *
   * @param buffer - Processed file content (already WebP-optimized)
   * @param filename - Target filename with extension (e.g. "abc123.webp")
   * @param mimeType - MIME type of the file (e.g. "image/webp")
   * @returns Public URL where the file can be accessed
   */
  abstract upload(buffer: Buffer, filename: string, mimeType: string): Promise<string>;

  /**
   * Delete a previously uploaded file.
   *
   * @param filename - The filename (key) to delete
   */
  abstract delete(filename: string): Promise<void>;
}
