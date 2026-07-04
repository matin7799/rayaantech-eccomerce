import { createPublicKey, type JsonWebKey } from "node:crypto";
import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { Request } from "express";
import { importSPKI, jwtVerify } from "jose";
import { TOROB_PUBLIC_KEY_PEM, TOROB_TOKEN_HEADER } from "./torob.constants";

/**
 * NestJS Guard that authenticates inbound requests from Torob's backend
 * by validating the `X-Torob-Token` JWT.
 *
 * Validation (per docs/torob/torob_api_token_guide.md):
 * 1. Verify EdDSA signature using Torob's public key
 * 2. Check `exp` (reject if current time > exp) — enforced by jose
 * 3. Check `nbf` (reject if current time < nbf) — enforced by jose
 * 4. Check `aud` (must exactly match the request Host header)
 *
 * Applied per-controller via @UseGuards(TorobJwtGuard); intentionally NOT global
 * so it does not interfere with ApiTokenGuard / the @Public() system.
 */
@Injectable()
export class TorobJwtGuard implements CanActivate {
  private readonly logger = new Logger(TorobJwtGuard.name);
  private cachedKey: ReturnType<typeof createPublicKey> | null = null;

  constructor(private readonly configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.headers[TOROB_TOKEN_HEADER];

    if (typeof token !== "string" || token.length === 0) {
      throw new UnauthorizedException("Missing X-Torob-Token header");
    }

    // Audience: per spec, the `aud` claim must exactly match the request Host.
    // Fall back to the APP_URL host when there is no Host header (e.g. direct
    // internal probes without a proxy in front).
    const expectedAudience = this.resolveExpectedAudience(request);
    if (!expectedAudience) {
      this.logger.error("Could not resolve expected audience (no Host header or APP_URL)");
      throw new UnauthorizedException("Server audience misconfiguration");
    }

    try {
      await jwtVerify(token, await this.getVerificationKey(), {
        algorithms: ["EdDSA"],
        audience: expectedAudience,
      });
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      this.logger.warn(`Torob JWT verification failed: ${message}`);
      throw new UnauthorizedException("Invalid Torob token");
    }
  }

  /**
   * Resolve the expected `aud` value. The spec is explicit: it must match the
   * Host header of the request. We honor the Host header first (it is what
   * Torob signs against), then fall back to APP_URL for internal probes.
   */
  private resolveExpectedAudience(request: Request): string | null {
    const host = request.headers.host;
    if (host && host.length > 0) {
      return host;
    }
    const appUrl = this.configService.get<string>("APP_URL");
    if (appUrl) {
      try {
        return new URL(appUrl).host;
      } catch {
        return null;
      }
    }
    return null;
  }

  /**
   * Lazily import Torob's public key once and cache it. `jose` accepts a
   * CryptoKey; we import the SPKI PEM with EdDSA.
   */
  private async getVerificationKey(): Promise<JsonWebKey | ReturnType<typeof createPublicKey>> {
    if (this.cachedKey) return this.cachedKey;
    this.cachedKey = createPublicKey(TOROB_PUBLIC_KEY_PEM);
    // Warm the jose import path too (used implicitly by jwtVerify via KeyObject).
    await importSPKI(TOROB_PUBLIC_KEY_PEM, "EdDSA");
    return this.cachedKey;
  }
}
