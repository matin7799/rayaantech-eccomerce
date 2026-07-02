import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
} from "@nestjs/common";
import { Public } from "../auth/decorators/public.decorator";
import { Scopes } from "../auth/decorators/scopes.decorator";
import { type CreateStoryDto, type StoryRecord, StoryService } from "./story.service";

/**
 * Shoppable Stories REST controller.
 *
 * Base path: /api/v1/stories
 *
 * - Public reads: GET /active returns only non-expired, active stories
 * - Protected writes: POST requires content:write scope
 *
 * Stories have a rigid 24-hour expiration window. The database default
 * sets expires_at = NOW() + interval '24 hours' automatically.
 */
@Controller("api/v1/stories")
export class StoryController {
  constructor(@Inject(StoryService) private readonly storyService: StoryService) {}

  /**
   * Get all currently active (non-expired) stories.
   *
   * Public endpoint — no authentication required.
   * Filters: is_active = true AND expires_at > NOW()
   */
  @Public()
  @Get("active")
  async getActiveStories(): Promise<{ data: StoryRecord[] }> {
    const stories = await this.storyService.getActiveStories();
    return { data: stories };
  }

  /**
   * Get a single story by ID (admin view, includes expired).
   *
   * Required scope: content:write
   */
  @Get(":id")
  @Scopes("content:write")
  async getStoryById(@Param("id") id: string): Promise<{ data: StoryRecord }> {
    const story = await this.storyService.getStoryById(id);
    return { data: story };
  }

  /**
   * Create a new shoppable story.
   *
   * Required scope: content:write
   *
   * Body:
   * - title (required): Story caption/title
   * - mediaUrl (required): URL to the visual asset
   * - productId (optional): Product UUID for shoppable tag linkage
   */
  @Post()
  @Scopes("content:write")
  @HttpCode(HttpStatus.CREATED)
  async createStory(@Body() body: CreateStoryDto): Promise<{ data: StoryRecord }> {
    const story = await this.storyService.createStory(body);
    return { data: story };
  }

  /**
   * Deactivate a story (soft-delete).
   *
   * Required scope: content:write
   */
  @Delete(":id")
  @Scopes("content:write")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteStory(@Param("id") id: string): Promise<void> {
    await this.storyService.deactivateStory(id);
  }
}
