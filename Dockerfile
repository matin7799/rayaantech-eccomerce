# =============================================================================
# Unified Multi-Stage Production Dockerfile (Monorepo Root)
# =============================================================================

# Base Layer
FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
# ????? ?????? ????? CI ???? ???? ???? TTY ?? ?? ?????? ???????
ENV CI=true

RUN npm i -g pnpm@11.8.0 turbo@2.10.2
WORKDIR /app

# Dependencies Stage
FROM base AS installer
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./

# Copy all workspace manifests to cache dependencies independently
COPY packages/config/package.json ./packages/config/package.json
COPY packages/db/package.json ./packages/db/package.json
COPY packages/types/package.json ./packages/types/package.json
COPY apps/backend/package.json ./apps/backend/package.json
COPY apps/web/package.json ./apps/web/package.json

RUN pnpm install --frozen-lockfile

# Source Copy Stage (for building)
FROM installer AS sourcerer
COPY . .

# Target backend-builder: compiles Drizzle ORM and NestJS backend
FROM sourcerer AS backend-builder
# ??????? ?? ??? ????? ?????? ?????? ???? ??????? ???%
RUN pnpm --filter @rayan-tech/db db:generate
RUN pnpm turbo run build --filter=@rayan-tech/backend
RUN pnpm --filter @rayan-tech/backend --prod deploy --legacy /app/apps/backend-deploy
RUN cp -r /app/apps/backend/dist /app/apps/backend-deploy/dist

# Target web-builder: builds TanStack Start SSR client/server assets
FROM sourcerer AS web-builder
RUN pnpm --filter @rayan-tech/db db:generate
# Build dependency packages only (db, types, config) — skip backend which has pre-existing TS errors
RUN pnpm --filter @rayan-tech/db run build && pnpm --filter @rayan-tech/types run build
# Build the web app directly — turbo --filter pulls in broken backend via ^build dep
RUN cd apps/web && pnpm run build
# This version of @tanstack/react-start is Vite-plugin based (no Nitro), so the build
# emits a plain Vite SSR build to apps/web/dist/{client,server} — there is no .output/
# directory and dist/server/server.js only exports a fetch handler, it does not listen
# on a port by itself. Production serving goes through `vite preview`, so the runtime
# image below needs the full workspace (node_modules incl. vite + plugins), not a
# slimmed deploy dir.

# Final Target: backend-runner (Slim Production Runtime)
FROM node:22-alpine AS backend-runner
WORKDIR /app
COPY --from=backend-builder /app/apps/backend-deploy ./
# Healthcheck uses busybox wget, which ships with node:22-alpine — no apk needed.
ENV NODE_ENV=production
ENV PORT=3003
EXPOSE 3003
CMD ["node", "dist/main.js"]

# Final Target: web-runner (Production Runtime)
# Not a slim standalone copy: `vite preview` needs vite + the tanstackStart/router
# plugins (and vite.config.ts) available at runtime, so we carry the whole built
# workspace forward from web-builder instead of extracting a self-contained bundle.
FROM base AS web-runner
WORKDIR /app
COPY --from=web-builder /app ./
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
CMD ["pnpm", "--filter", "@rayan-tech/web", "run", "preview", "--port", "3000", "--host", "0.0.0.0"]