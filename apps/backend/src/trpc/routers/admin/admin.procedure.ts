import { TRPCError } from "@trpc/server";
import { middleware, protectedProcedure } from "../../trpc.init";

export const adminMiddleware = middleware(({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "احراز هویت الزامی است" });
  }
  const allowedRoles = new Set(["admin", "operator"]);
  if (!allowedRoles.has(ctx.session.role)) {
    throw new TRPCError({ code: "FORBIDDEN", message: "دسترسی مدیریتی الزامی است" });
  }
  return next({ ctx });
});

export const adminProcedure = protectedProcedure.use(adminMiddleware);
