# =============================================================================
# Unified Multi-Stage Production Dockerfile (Monorepo Root)
# =============================================================================

# Base Layer
FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
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
RUN pnpm --filter @rayan-tech/db db:generate
RUN pnpm turbo run build --filter=@rayan-tech/backend
RUN pnpm --filter @rayan-tech/backend --prod deploy /app/apps/backend-deploy
RUN cp -r /app/apps/backend/dist /app/apps/backend-deploy/dist

# Target web-builder: builds TanStack Start SSR client/server assets
FROM sourcerer AS web-builder
RUN pnpm --filter @rayan-tech/db db:generate
RUN pnpm turbo run build --filter=@rayan-tech/web
RUN pnpm --filter @rayan-tech/web --prod deploy /app/apps/web-deploy
RUN cp -r /app/apps/web/dist /app/apps/web-deploy/dist

# Final Target: backend-runner (Slim Production Runtime)
FROM node:20-alpine AS backend-runner
WORKDIR /app
COPY --from=backend-builder /app/apps/backend-deploy ./
RUN apk add --no-cache curl
ENV NODE_ENV=production
ENV PORT=3003
EXPOSE 3003
CMD ["node", "dist/main.js"]

# Final Target: web-runner (Slim Production Runtime)
FROM node:20-alpine AS web-runner
WORKDIR /app
COPY --from=web-builder /app/apps/web-deploy ./
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
CMD ["node", "dist/server/server.js"]
