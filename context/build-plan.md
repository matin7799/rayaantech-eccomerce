# build-plan.md

## Core Principle

Every single workspace view, API contract, and dashboard element is built with clean mockup states first, verified visually, and iteratively wired to real production database pipelines. No invisible backend layers or unverified data mutations are permitted.

---

## Phase 1 — Infrastructure, Unified Schema & Core Security Matrix

### 01 Monorepo Workspace Initialization

* **Task**: Scaffold the Turborepo architecture environment with pnpm workspaces.
* **Details**: Set up shared packages under `packages/config` (including strict master ESLint rule sets, TypeScript base configurations, and Tailwind CSS design tokens). Validate cached builds and task graphs utilizing Turborepo pipeline orchestration to eliminate compilation redundancy across `apps/web/` and `apps/backend/`.

### 02 Relational & Vector Database Schema Deployment (PostgreSQL + Drizzle ORM)

* **Task**: Establish the Relational Database Models with active Postgres vector integration extensions.
* **Details**: Write strict, type-safe TypeScript schemas using Drizzle ORM for the following tables:
* `users`: Standard user tracking rows with mobile OTP configuration indicators.
* `api_tokens`: Dashboard-generated cryptographic keys.
* `wholesale_groups`: Dealer tiers and markdown percentage configurations.
* `products`: Product listings with explicit hardware grading definitions (`product_grade` enum) and a `vector(1536)` field for structural AI embedding columns.
* `categories` & `brands`: Structured catalog hierarchy logs.
* `orders` & `payments`: Multitenant transaction ledger layers mapping polymorphic checkout strategies.
* `shoppable_stories` & `blog_posts`: Headless editorial content trackers.
* `banners` & `system_logs`: UI configurations and Pino-backed non-blocking structured telemetry registers.


* **Execution**: Execute `pnpm db:push` to apply migration blueprints straight to the Postgres instance.

### 03 Cryptographic Admin API Token Framework & NestJS Interceptor Guard

* **Task**: Design the secure, dashboard-generated administrative bearer access gateway.
* **Details**: Implement crypto token creation logic in the Admin Back-office. Generated plain-text tokens prefixed with `rt_tok_...` are exposed to administrators exactly once upon creation. Store these values exclusively as one-way cryptographically salted SHA-256 hashes (`token_hash`) inside the `api_tokens` ledger. Develop a global NestJS server-side guard that intercepts inbound public REST traffic, extracts credentials from standard authorization headers (`Authorization: Bearer rt_tok_...`), evaluates permitted scope privileges (e.g., `products:write`, `orders:read`), and utilizes Redis cache mappings to query token properties under sub-millisecond timelines.

---

## Phase 2 — Omnipresent Headless API & Content Operations

### 04 Product & Inventory Pipeline (API-First CRUD)

* **Task**: Build the full catalog engine managed strictly via verified Admin API Tokens.
* **Details**: Emplace robust multi-tenant data endpoints mapping product mutations (Create, Read, Update, Delete) beneath the global `/api/v1/products` Public API routing matrix. Wire TanStack Start frontend administration forms with strict Zod runtime request validators. Ensure that any successful catalog alteration safely fires an asynchronous trigger for background vector updates.

### 05 Shoppable Stories & Headless Editorial Ecosystem

* **Task**: Launch interactive media-rich content management components.
* **Details**: Expose comprehensive endpoints for Shoppable Stories (`/api/v1/stories`)—supporting video media assets tied directly to specific warehouse product identifiers—and Blog articles (`/api/v1/posts`) supporting full markdown structures and SEO metadata indexing. Test all operational endpoints comprehensively using generated API Bearer keys (`X-API-Token` or `Authorization` headers) to enforce absolute price and content integrity against unauthenticated mutations.

### 06 Order Lifecycle & Polymorphic Payment Hub

* **Task**: Establish elastic, highly conditional transaction and billing state mechanics.
* **Details**: Expose public REST routes for automated external order placement and transaction tracking under `/api/v1/orders` and `/api/v1/payments`. Code an abstract gateway interface layer (`IPaymentProvider`) in NestJS. Build clean integrations for ZarinPal (Standard Cash flows) and DigiPay Credit Systems (Structured business installment routes). Force rigorous, zero-trust server-side validation equations exclusively inside the backend tier to evaluate purchase totals and wholesale markdowns, eliminating client-side browser parameter spoofing.

---

## Phase 3 — High-Performance Conversational Voice AI & Distributed Compute Protection

### 07 Granular Redis IP Firewall (Compute Protection Layer)

* **Task**: Guard expensive large language model and vector matching operations from script abuse, scraping, and vector injections.
* **Details**: Code an advanced Redis multi-command pipeline (utilizing `ZREMRANGEBYSCORE`, `ZADD`, and `ZCARD`) tracking unique incoming client IP addresses. Enforce custom request thresholds across multi-tiered windows:
* Global interactive AI endpoints: Maximum of 10 calls per rolling 60-second frame.
* Conversational Voice Streams: Maximum of 5 concurrent voice sessions per minute and 30 cumulative consulting minutes per calendar day per unique client IP (`rate:voice:ip_address`).


* **Fallback**: When an IP boundary breaches these parameters, safely pause processing streams and return a polite, pre-synthesized vocal/JSON message: *"You have reached your daily premium hardware consulting allocation. Chat sessions will reopen shortly."*.

### 08 Low-Latency Grounded RAG Engine & Duplex Voice Stream Pipeline

* **Task**: Implement the conversational customer assistant node for direct human-to-machine voice consultation.
* **Details**: Integrate `@vercel/ai-sdk` and OpenAI real-time audio streams via a persistent WebSocket or WebRTC target in NestJS. Build an isolated backend handler that intercepts real-time voice transcripts, normalizes them via Whisper speech-to-text engines, and triggers high-speed cosine similarity queries (`<=>`) against the `pgvector` database index. Enforce the **Strict Output Grounding Rule**: The system prompt must append the retrieved warehouse facts; the AI assistant is entirely blocked from hallucinating hardware models or specifications missing from active physical stock records. Stream responsive, technical vocal answers back to the consumer using high-quality low-latency text-to-speech synthesis pipelines. Implement explicit try/catch blocks for clean audio handle disposal to guarantee no system resource leakage.

---

## Phase 4 — Aggregator Architecture & Asynchronous Event Processing

### 09 Isolated Torob REST Feed Controller (`/api/v1/torob/...`)

* **Task**: Build a high-speed, isolated REST gateway dedicated explicitly to Torob crawling bot traffic.
* **Details**: Create a controller scoped strictly beneath the `/api/v1/torob/` prefix (e.g., `/api/v1/torob/products`). This path must bypass standard frontend multi-tenant routing frameworks. To avoid long database transaction locks or memory exhaustion during major indexing crawls, enforce raw JSON serialization optimized completely via high-speed Redis caching layers and implement mandatory cursor-based pagination defaults.

### 10 Torob Referral Session Synergy & Dynamic Price Guard

* **Task**: Inject hyper-converting promotional triggers for incoming traffic arriving via Torob indices.
* **Details**: Code an HTTP middleware intercepting inbound requests carrying `utm_source=torob`. Initialize a high-speed temporal tracking index inside the Redis store with a rigid 1200-second (20-minute) Lifespan (TTL: `1200s`) tied to the session. Render matching discounted storefront markdown components coupled with dynamic client countdown timers, calculating all price adjustments exclusively server-side.

### 11 Distributed Apache Kafka Event Consumer Framework

* **Task**: Bind asynchronous background pipelines away from the core HTTP transactional thread.
* **Details**: Set up dedicated `kafkajs` worker instances. Wire independent downstream event consumers to isolate intensive operational processing loops including:
* `notification.sms`: Handles mobile OTP message delivery tracking and automated alerts.
* `catalog.mutation`: Executes real-time automated product embedding vector syncs upon catalog modifications.
* Background logging streams and external webhook configurations.
This guarantees that non-essential, heavy I/O workflows never block or stall client-facing checkout parameters or interactive user execution streams.
