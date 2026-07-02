import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import type { Request, Response } from "express";

/**
 * Persian-localized error messages for common HTTP status codes.
 * Used as client-facing messages to prevent leaking internal details.
 */
const PERSIAN_ERROR_MAP: Record<number, string> = {
  [HttpStatus.BAD_REQUEST]: "درخواست نامعتبر است",
  [HttpStatus.UNAUTHORIZED]: "احراز هویت الزامی است",
  [HttpStatus.FORBIDDEN]: "دسترسی به این منبع مجاز نیست",
  [HttpStatus.NOT_FOUND]: "منبع مورد نظر یافت نشد",
  [HttpStatus.CONFLICT]: "تداخل در داده‌ها رخ داده است",
  [HttpStatus.UNPROCESSABLE_ENTITY]: "داده‌های ارسالی قابل پردازش نیستند",
  [HttpStatus.TOO_MANY_REQUESTS]: "تعداد درخواست‌ها بیش از حد مجاز است",
  [HttpStatus.INTERNAL_SERVER_ERROR]: "خطای داخلی سرور رخ داده است",
  [HttpStatus.SERVICE_UNAVAILABLE]: "سرویس موقتاً در دسترس نیست",
};

/**
 * Known PostgreSQL/Drizzle error class identifiers.
 * Used to detect database-originating exceptions and mask them.
 */
const DATABASE_ERROR_INDICATORS = [
  "PostgresError",
  "DatabaseError",
  "QueryFailedError",
  "DrizzleError",
  "error: relation",
  "error: column",
  "error: duplicate key",
  "violates unique constraint",
  "violates foreign key constraint",
  "violates not-null constraint",
  "violates check constraint",
  "syntax error at or near",
  "ECONNREFUSED",
  "connection terminated",
  "timeout expired",
  "too many clients",
] as const;

/**
 * PostgreSQL error code → HTTP status mapping.
 * See: https://www.postgresql.org/docs/current/errcodes-appendix.html
 */
const PG_ERROR_CODE_MAP: Record<string, number> = {
  "23505": HttpStatus.CONFLICT, // unique_violation
  "23503": HttpStatus.BAD_REQUEST, // foreign_key_violation
  "23502": HttpStatus.BAD_REQUEST, // not_null_violation
  "23514": HttpStatus.BAD_REQUEST, // check_violation
  "23P01": HttpStatus.CONFLICT, // exclusion_violation
  "42P01": HttpStatus.INTERNAL_SERVER_ERROR, // undefined_table
  "42703": HttpStatus.INTERNAL_SERVER_ERROR, // undefined_column
};

/**
 * Sanitized error response shape returned to clients.
 * Never contains raw database messages, table names, or stack traces.
 */
interface SanitizedErrorResponse {
  statusCode: number;
  message: string;
  messageFa: string;
  error: string;
  timestamp: string;
  path: string;
}

/**
 * Global exception filter that intercepts ALL unhandled errors.
 *
 * Core invariant: No raw database stack traces, table names, column names,
 * or query structures are EVER exposed in HTTP response payloads.
 *
 * Behavior:
 * 1. If the error is a standard NestJS HttpException, preserve its status
 *    and message (these are intentionally crafted by our guards/services).
 *
 * 2. If the error originates from Drizzle/PostgreSQL (detected via error
 *    class names, pg error codes, or message pattern matching), intercept
 *    completely — replace with a generic client-safe message.
 *
 * 3. All raw technical details are logged to the secure server console
 *    for debugging, but never returned to the client.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const { statusCode, message, messageFa } = this.resolveError(exception);

    // Log the FULL technical error to server console (never to client)
    this.logException(exception, request, statusCode);

    const errorResponse: SanitizedErrorResponse = {
      statusCode,
      message,
      messageFa,
      error: HttpStatus[statusCode] ?? "INTERNAL_SERVER_ERROR",
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(statusCode).json(errorResponse);
  }

  /**
   * Determine the appropriate status code and client-safe message.
   * Database errors are completely masked. HttpExceptions are preserved.
   */
  private resolveError(exception: unknown): {
    statusCode: number;
    message: string;
    messageFa: string;
  } {
    // Case 1: Standard NestJS HttpException (our guards, controllers, services)
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      let message: string;
      if (typeof exceptionResponse === "string") {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === "object" &&
        exceptionResponse !== null &&
        "message" in exceptionResponse
      ) {
        const msg = (exceptionResponse as Record<string, unknown>).message;
        message = Array.isArray(msg) ? msg.join("; ") : String(msg);
      } else {
        message = exception.message;
      }

      return {
        statusCode: status,
        message,
        messageFa: PERSIAN_ERROR_MAP[status] ?? "خطایی رخ داده است",
      };
    }

    // Case 2: Database/Drizzle/PostgreSQL error — COMPLETELY MASK
    if (this.isDatabaseError(exception)) {
      const pgStatus = this.resolvePgErrorStatus(exception);

      return {
        statusCode: pgStatus,
        message: this.getGenericDbMessage(pgStatus),
        messageFa: PERSIAN_ERROR_MAP[pgStatus] ?? "خطای داخلی سرور رخ داده است",
      };
    }

    // Case 3: Unknown system error — mask everything
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "An unexpected error occurred",
      messageFa: PERSIAN_ERROR_MAP[HttpStatus.INTERNAL_SERVER_ERROR]!,
    };
  }

  /**
   * Detect whether an error originates from the database layer.
   * Uses multiple heuristics: constructor name, pg error code, message patterns.
   */
  private isDatabaseError(exception: unknown): boolean {
    if (!exception || typeof exception !== "object") {
      return false;
    }

    const err = exception as Record<string, unknown>;

    // Check constructor/class name
    const constructorName = err.constructor?.name ?? "";
    if (
      constructorName.includes("Postgres") ||
      constructorName.includes("Database") ||
      constructorName.includes("Drizzle") ||
      constructorName.includes("Pool")
    ) {
      return true;
    }

    // Check for PostgreSQL error code property
    if (typeof err.code === "string" && /^\d{5}$/.test(err.code)) {
      return true;
    }

    // Check for pg-specific properties
    if ("severity" in err && "routine" in err) {
      return true;
    }

    // Pattern match on error message
    const message = typeof err.message === "string" ? err.message : "";
    return DATABASE_ERROR_INDICATORS.some((indicator) =>
      message.toLowerCase().includes(indicator.toLowerCase()),
    );
  }

  /**
   * Map PostgreSQL error codes to appropriate HTTP status codes.
   */
  private resolvePgErrorStatus(exception: unknown): number {
    const err = exception as Record<string, unknown>;
    const code = typeof err.code === "string" ? err.code : "";

    return PG_ERROR_CODE_MAP[code] ?? HttpStatus.INTERNAL_SERVER_ERROR;
  }

  /**
   * Return a generic, non-revealing message for database errors.
   */
  private getGenericDbMessage(status: number): string {
    switch (status) {
      case HttpStatus.CONFLICT:
        return "A resource with the given identifier already exists";
      case HttpStatus.BAD_REQUEST:
        return "The request contains invalid or missing data references";
      default:
        return "An unexpected error occurred while processing your request";
    }
  }

  /**
   * Log the full technical exception to the server console.
   * Includes stack trace, raw message, and request context.
   */
  private logException(exception: unknown, request: Request, statusCode: number): void {
    const context = {
      method: request.method,
      url: request.url,
      statusCode,
      userAgent: request.headers["user-agent"] ?? "unknown",
    };

    if (exception instanceof Error) {
      if (statusCode >= 500) {
        this.logger.error(
          `[${context.method}] ${context.url} → ${statusCode}`,
          exception.stack,
          JSON.stringify(context),
        );
      } else {
        this.logger.warn(
          `[${context.method}] ${context.url} → ${statusCode}: ${exception.message}`,
        );
      }
    } else {
      this.logger.error(
        `[${context.method}] ${context.url} → ${statusCode}: Non-Error exception`,
        JSON.stringify(exception),
      );
    }
  }
}
