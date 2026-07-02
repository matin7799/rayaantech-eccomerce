import { SetMetadata } from "@nestjs/common";

/**
 * Metadata key used by the @Public() decorator.
 * When present on a route handler or controller, the global
 * ApiTokenGuard will skip authentication checks entirely.
 */
export const IS_PUBLIC_KEY = "auth:isPublic";

/**
 * Marks a route or controller as publicly accessible.
 *
 * Routes decorated with @Public() bypass the global ApiTokenGuard,
 * allowing unauthenticated access. Use for storefront-facing read
 * endpoints (blog posts, active stories, public catalog).
 *
 * @example
 * ```ts
 * @Public()
 * @Get("/blog/posts")
 * listPublicPosts() { ... }
 * ```
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
