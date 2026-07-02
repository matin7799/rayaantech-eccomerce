import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import type { Express } from "express";
import { Scopes } from "../auth/decorators/scopes.decorator";
import { type MediaRecord, MediaService } from "./services/media.service";

/**
 * Optional metadata fields sent alongside the file upload.
 */
interface UploadMetadataDto {
  storageProvider?: "s3" | "local";
}

/**
 * Media upload REST controller.
 *
 * Base path: /api/v1/media
 *
 * Handles multipart/form-data file uploads. The uploaded file is
 * processed (WebP conversion, 1200px resize for images) and persisted
 * via the configured storage driver (local or S3).
 *
 * Field name: "file" (multipart form-data)
 * Optional fields: "storageProvider" ("s3" | "local")
 */
@Controller("api/v1/media")
export class MediaController {
  constructor(@Inject(MediaService) private readonly mediaService: MediaService) {}

  /**
   * Upload a media file.
   *
   * Accepts multipart/form-data with:
   * - file: The binary file (field name: "file")
   * - storageProvider: Optional override ("s3" | "local")
   *
   * Images are automatically converted to WebP at max 1200px width.
   * Non-image files are stored as-is.
   *
   * Required scope: content:write
   */
  @Post("upload")
  @Scopes("content:write")
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor("file", { limits: { fileSize: 50 * 1024 * 1024 } }))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() metadata: UploadMetadataDto,
  ): Promise<{ data: MediaRecord }> {
    const storageProvider = metadata.storageProvider ?? "s3";

    const record = await this.mediaService.uploadFile(
      file.buffer,
      file.originalname,
      file.mimetype,
      storageProvider,
    );

    return { data: record };
  }
}
