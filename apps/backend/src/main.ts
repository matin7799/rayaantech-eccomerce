import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import cookieParser from "cookie-parser";
import { Logger } from "nestjs-pino";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // Disable default logger — Pino takes over via LoggerModule
    bufferLogs: true,
  });

  // Use Pino as the application-wide logger
  app.useLogger(app.get(Logger));

  // Trust proxy headers (X-Forwarded-For, X-Real-IP) for accurate
  // client IP resolution in the AiRateLimitGuard
  app.set("trust proxy", true);

  // CRITICAL: Parse cookies from incoming requests.
  // Without this, req.cookies is undefined and session resolution fails.
  //
  // COOKIE_SECRET enables signed cookies (req.signedCookies), used by the Torob
  // referral cookie (rt_torob_session) so clients cannot forge a session id.
  // The auth session cookie (rt_session) stays unsigned and is read from
  // req.cookies — registering a secret does not move it. A dev fallback secret
  // keeps local development working without an env var.
  const cookieSecret = process.env.COOKIE_SECRET ?? "rt-dev-cookie-secret-change-me-in-production";
  app.use(cookieParser(cookieSecret));

  // Enable CORS for cross-origin tRPC requests from the web frontend
  app.enableCors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      process.env.WEB_URL ?? "http://localhost:3000",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Request-Id"],
  });

  // Enable graceful shutdown hooks (SIGTERM, SIGINT)
  app.enableShutdownHooks();

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  const logger = app.get(Logger);
  logger.log(`Application listening on port ${port}`, "Bootstrap");
}
void bootstrap();
