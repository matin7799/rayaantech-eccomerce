import { Module } from "@nestjs/common";
import { StoryController } from "./story.controller";
import { StoryService } from "./story.service";

/**
 * Shoppable Stories module.
 *
 * Provides:
 * - StoryController: REST endpoints at /api/v1/stories
 * - StoryService: Story CRUD with 24-hour expiration filter
 *
 * Dependencies (from global modules):
 * - DatabaseModule (provides DRIZZLE_CLIENT)
 */
@Module({
  controllers: [StoryController],
  providers: [StoryService],
  exports: [StoryService],
})
export class StoryModule {}
