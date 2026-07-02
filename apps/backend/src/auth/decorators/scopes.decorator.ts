import { SetMetadata } from "@nestjs/common";
import { SCOPES_METADATA_KEY } from "../constants";

/**
 * Route-level decorator that declares which API token scopes
 * are required to access a given controller method.
 *
 * @example
 * ```ts
 * @Scopes('products:write', 'orders:read')
 * @Get('/admin/products')
 * listProducts() { ... }
 * ```
 *
 * If no @Scopes() decorator is applied, the ApiTokenGuard
 * will only verify that a valid (non-expired) token exists
 * without checking specific scope permissions.
 */
export const Scopes = (...scopes: string[]) => SetMetadata(SCOPES_METADATA_KEY, scopes);
