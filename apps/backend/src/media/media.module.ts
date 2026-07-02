import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { LocalStorageDriver } from "./drivers/local-storage.driver";
import { S3StorageDriver } from "./drivers/s3-storage.driver";
import { StorageDriver } from "./interfaces/storage-driver.interface";
import { MediaController } from "./media.controller";
import { MediaService } from "./services/media.service";
import { MediaProcessorService } from "./services/media-processor.service";

/**
 * Media module providing file upload, processing, and storage.
 *
 * The storage driver is selected automatically based on the
 * STORAGE_PROVIDER environment variable:
 * - "local" → LocalStorageDriver (writes to ./uploads/)
 * - "s3" → S3StorageDriver (writes to S3-compatible endpoint)
 *
 * Default: "local" for development environments.
 */
@Module({
  controllers: [MediaController],
  providers: [
    MediaService,
    MediaProcessorService,
    {
      provide: StorageDriver,
      useFactory: (configService: ConfigService): StorageDriver => {
        const provider = configService.get<string>("STORAGE_PROVIDER", "local");

        if (provider === "s3") {
          return new S3StorageDriver(configService);
        }

        return new LocalStorageDriver(configService);
      },
      inject: [ConfigService],
    },
  ],
  exports: [MediaService, MediaProcessorService],
})
export class MediaModule {}
