import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { LoggerModule as PinoLoggerModule } from "nestjs-pino";

/**
 * Structured JSON logging module powered by Pino.
 *
 * Provides:
 * - Non-blocking asynchronous structured JSON log output
 * - Automatic request correlation via X-Request-Id header
 * - Optimized for Grafana Loki indexing (level, msg, time, req, res)
 * - Redacts sensitive headers (authorization, cookie)
 *
 * In production: JSON output with no pretty-printing
 * In development: colorized human-readable output via pino-pretty
 */
@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isProduction = config.get("NODE_ENV") === "production";

        return {
          pinoHttp: {
            level: isProduction ? "info" : "debug",
            // Use X-Request-Id from the request-id middleware
            genReqId: (req) =>
              (req.headers["x-request-id"] as string | undefined) ?? crypto.randomUUID(),
            // Redact sensitive headers from logs
            redact: {
              paths: [
                "req.headers.authorization",
                "req.headers.cookie",
                "req.headers['x-api-key']",
              ],
              clobberWith: "[REDACTED]",
            },
            // Serializers for compact request/response logging
            serializers: {
              req(req: { method: string; url: string; id: string }) {
                return { method: req.method, url: req.url, id: req.id };
              },
              res(res: { statusCode: number }) {
                return { statusCode: res.statusCode };
              },
            },
            // Pretty-print in development only
            transport: isProduction
              ? undefined
              : {
                  target: "pino-pretty",
                  options: {
                    colorize: true,
                    singleLine: true,
                    translateTime: "HH:MM:ss.l",
                  },
                },
          },
        };
      },
    }),
  ],
})
export class LoggerModule {}
