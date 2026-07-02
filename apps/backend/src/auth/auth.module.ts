import { Module } from "@nestjs/common";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { ApiTokenGuard } from "./guards/api-token.guard";
import { PartnerRoleGuard } from "./guards/partner-role.guard";
import { TokenActivityPublisher } from "./interfaces/token-activity-publisher.interface";
import { TokenActivityListener } from "./listeners/token-activity.listener";
import { EventEmitterActivityPublisher } from "./services/event-emitter-activity-publisher.service";
import { OtpService } from "./services/otp.service";
import { SessionService } from "./services/session.service";
import { TokenCacheService } from "./services/token-cache.service";

/**
 * Authentication module providing:
 * - ApiTokenGuard: Cryptographic token validation with Redis caching
 * - TokenCacheService: Dual-layer cache (Redis → PostgreSQL)
 * - TokenActivityPublisher: Async fire-and-forget last_used_at updates
 * - TokenActivityListener: Event handler for DB writes
 * - OtpService: Redis-cached OTP with Kafka dispatch to MeliPayamak
 * - SessionService: httpOnly cookie sessions backed by Redis
 * - PartnerRoleGuard: Secures routes for B2B partner users
 *
 * Dependencies (must be imported at AppModule level):
 * - RedisModule (global, provides REDIS_CLIENT)
 * - DatabaseModule (provides DRIZZLE_CLIENT)
 * - KafkaModule (provides KafkaProducerService)
 * - EventEmitterModule (provides EventEmitter2)
 * - ConfigModule (provides ConfigService)
 */
@Module({
  imports: [EventEmitterModule.forRoot()],
  providers: [
    ApiTokenGuard,
    PartnerRoleGuard,
    TokenCacheService,
    TokenActivityListener,
    OtpService,
    SessionService,
    {
      provide: TokenActivityPublisher,
      useClass: EventEmitterActivityPublisher,
    },
  ],
  exports: [
    ApiTokenGuard,
    PartnerRoleGuard,
    TokenCacheService,
    TokenActivityPublisher,
    OtpService,
    SessionService,
  ],
})
export class AuthModule {}
