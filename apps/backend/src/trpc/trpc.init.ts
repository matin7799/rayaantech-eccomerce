import { initTRPC, TRPCError } from "@trpc/server";
import type { TrpcContext } from "./trpc.context";

/**
 * Initialize the tRPC instance with context type.
 * This module exports reusable building blocks for all routers.
 */
const t = initTRPC.context<TrpcContext>().create({
  errorFormatter({ shape, error }) {
    console.error("tRPC Error:", error);
    return shape;
  },
});

/**
 * Public procedure — no auth required.
 */
export const publicProcedure = t.procedure;

/**
 * Authenticated session context (narrowed from nullable).
 */
interface AuthenticatedContext extends TrpcContext {
  session: NonNullable<TrpcContext["session"]>;
}

/**
 * Protected procedure — requires an authenticated session.
 * Uses explicit middleware typing to avoid TS2742 declaration portability issues.
 */
const authMiddleware = t.middleware(({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "احراز هویت الزامی است",
    });
  }
  return next({
    ctx: { ...ctx, session: ctx.session } satisfies AuthenticatedContext,
  });
});

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- tRPC builder inference
export const protectedProcedure: typeof t.procedure = t.procedure.use(
  authMiddleware,
) as typeof t.procedure;

/**
 * Router factory.
 */
export const router = t.router;

/**
 * Merge multiple routers into one.
 */
export const mergeRouters = t.mergeRouters;

/**
 * Middleware factory.
 */
export const middleware = t.middleware;
