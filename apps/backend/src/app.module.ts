import { type MiddlewareConsumer, Module, type NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_FILTER, APP_GUARD } from "@nestjs/core";
import { AiModule } from "./ai";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth";
import { ApiTokenGuard } from "./auth/guards/api-token.guard";
import { BlogModule } from "./blog";
import { AllExceptionsFilter } from "./common";
import configuration from "./config/configuration";
import { DatabaseModule } from "./database";
import { HealthModule } from "./health";
import { KafkaModule } from "./kafka";
import { LoggerModule, RequestIdMiddleware } from "./logger";
import { MediaModule } from "./media";
import { OrderModule } from "./order";
import { PaymentModule } from "./payment";
import { ProductModule } from "./product";
import { RateLimitModule } from "./rate-limit";
import { AiRateLimitGuard } from "./rate-limit/guards/ai-rate-limit.guard";
import { RedisModule } from "./redis";
import { StoryModule } from "./story";
import { TorobModule } from "./torob";
import { TrpcModule } from "./trpc";
import { UserModule } from "./users/user.module";
import { VoiceAiModule } from "./voice-ai";

/**
 * Root application module.
 *
 * Module registration order:
 * 1. ConfigModule — env variables
 * 2. LoggerModule — Pino structured JSON logging (must be early for buffered logs)
 * 3. RedisModule (global) — ioredis shared client
 * 4. DatabaseModule (global) — Drizzle ORM PostgreSQL client
 * 5. KafkaModule (global) — KafkaJS producer + consumers with DLQ resilience
 * 6. HealthModule — /health/live + /health/ready + graceful shutdown hooks
 * 7. AuthModule — ApiTokenGuard, OTP, sessions
 * 8-14. Feature modules
 * 15. TrpcModule — tRPC adapter mounted at /trpc
 *
 * Global middleware:
 * - RequestIdMiddleware — X-Request-Id correlation on ALL routes
 *
 * Global guards:
 * 1. ApiTokenGuard — token validation (honors @Public)
 * 2. AiRateLimitGuard — per-customer rate limiting
 *
 * Global filters:
 * - AllExceptionsFilter — masks DB internals, Persian error responses
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env.local", ".env"],
      load: [configuration],
    }),
    LoggerModule,
    RedisModule,
    DatabaseModule,
    KafkaModule,
    HealthModule,
    AuthModule,
    RateLimitModule,
    ProductModule,
    MediaModule,
    StoryModule,
    BlogModule,
    OrderModule,
    PaymentModule,
    VoiceAiModule,
    AiModule,
    TorobModule,
    UserModule,
    TrpcModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_GUARD, useClass: ApiTokenGuard },
    { provide: APP_GUARD, useClass: AiRateLimitGuard },
  ],
})
export class AppModule implements NestModule {
  /**
   * Apply RequestIdMiddleware globally to all routes.
   * Runs before Pino's genReqId so the header is available for correlation.
   */
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestIdMiddleware).forRoutes("*");
  }
}
