# Project Overview: Rayan Tech (Comprehensive API & Voice AI Edition)

## About the Project

Rayan Tech is a next-generation, API-First, end-to-end type-safe e-commerce ecosystem built for premium open-box and stock technical hardware. Beyond serving standard web traffic through optimized internal protocols, the platform exposes a complete, universally accessible **REST API matrix** covering all core operations—from automated product ingest and blog/story content management to transactional ordering and checkout mechanics.

External, third-party, and decoupled client integrations are authorized via high-security, admin-generated **API Tokens** created directly within the Admin Dashboard. Additionally, the platform features an advanced **Conversational Voice AI Consultation Assistant** capable of real-time audio interaction, grounded by semantic vector indexes (`pgvector`) tracking live hardware stock. To protect expensive large language model computing resources from vector injection and automated scraping abuse, a strict distributed Redis firewall enforces custom request thresholds mapped strictly to incoming client IP addresses.

---

## The Problem It Solves

Modern unified commerce demands more than isolated frontend web interfaces. Legacy architectures limit content velocity, making it hard to sync inventories seamlessly across custom apps, enterprise resource planning (ERP) layers, and content channels. Concurrently, traditional text-only AI shopping assistants fail to simulate the luxury, high-touch consultation of an expert retail storefront.

Rayan Tech eliminates these operational bottlenecks by:

* **Enabling a Headless, Unified Core:** Making every backend module accessible via authenticated REST endpoints, allowing headless content publishing (Blogs/Stories), programmatic product mutation, and external order updates.
* **Providing Conversational Voice Experiences:** Shifting user engagement from simple typing to direct voice-driven consultation, accelerating purchase intent for complex hardware components.
* 
**Mitigating Compute Overhead:** Binding a strict, lightning-fast Redis-based rate limiter directly to client IP boundaries, ensuring that heavy AI voice streams never overtax infrastructure budgets.



---

## Technical Stack Matrix

The infrastructure is organized as a unified, highly optimized Monorepo workspace powered by `pnpm` and `Turborepo`.

| Layer | Technology | Operational Purpose |
| --- | --- | --- |
| **Frontend UI Engine** | TanStack Start (SSR) | Renders server-side interfaces with complete compile-time routing type safety.

 |
| **Internal Syncer** | tRPC Protocols | Bridges internal NestJS services and frontends instantly with type contracts, skipping manual OpenAPI parsing.

 |
| **Public API Engine** | NestJS REST Controllers | Exposes standard HTTP REST routes for external services and custom clients.

 |
| **Authentication Core** | Better Auth + API Token Guard | Manages user HTTP sessions via HttpOnly cookies and authenticates incoming machine-to-machine requests using custom hashed tokens.

 |
| **Database Framework** | PostgreSQL + Drizzle ORM | Executes relational operations with extreme efficiency.

 |
| **Semantic Intelligence** | pgvector + OpenAI Embedding Pipelines | Executes high-speed cosine similarity checks to match voice/text prompts with specific stock inventory records.

 |
| **Audio Processing** | WebSocket Streams + Whispering Engines | Direct real-time streaming of speech-to-text (STT) and text-to-speech (TTS) data matrices. |
| **Security Cache** | Distributed Redis Layer | Tracks endpoint request limits, protects the AI interface via IP throttling, and manages Torob session state timers.

 |
| **Event Broker** | Apache Kafka | Coordinates asynchronous background pipelines (e.g., automated media alerts, SMS gateways, AI index syncing).

 |

---

## Core System Architecture & API Topography

```
                                      ┌────────────────────────────────┐
                                      │   Admin Panel Token Manager    │
                                      └───────────────┬────────────────┘
                                                      │ Generates
                                                      ▼
 ┌───────────────────────────┐         ┌──────────────────────────────┐
 │ Third-Party Apps / Client │────────►│   Bearer API Token Guard     │
 └───────────────────────────┘         └──────────────┬───────────────┘
                                                      │ Passes Validation
                                                      ▼
 ┌────────────────────────────────────────────────────────────────────────────────────────┐
 │                              REST API Matrix (NestJS)                                  │
 ├───────────────────┬───────────────────┬───────────────────┬────────────────────────────┤
 │  /api/v1/products │   /api/v1/orders  │   /api/v1/stories │    /api/v1/torob/products  │
 └───────────────────┴───────────────────┴───────────────────┴────────────────────────────┘

```

### 1. Global Admin-Generated API Token Framework

To drive external headless operations securely, the platform implements a token verification standard:

* **Dashboard Generation Sandbox:** Platform administrators can provision cryptographic API secret tokens directly inside the dashboard workspace, assigning specific scopes (e.g., `products:write`, `orders:read`, `content:publish`).
* **Cryptographic Vaulting Strategy:** Tokens are stored as one-way cryptographically salted hashes (`sha256`) inside the PostgreSQL database. The plain-text token string is presented to the administrator exactly once upon creation.
* **Request Interception Pipeline:** A global NestJS authentication guard intercepts incoming public REST traffic, extracting credentials from standard authorization headers: `Authorization: Bearer rt_tok_...`. It verifies token validity against the hashed index in the database before passing control to backend application routes.

### 2. Comprehensive REST API Routes (`/api/v1/`)

Every core platform capability is mapped to explicit, RESTful public endpoints:

* **Products Matrix (`/api/v1/products`):** Provides full Create, Read, Update, and Delete (CRUD) actions. Supports bulk ingestion parameters, hardware grading definitions, and instant vector compilation triggers.


* 
**Orders & Payments (`/api/v1/orders` & `/api/v1/payments`):** Allows automated external order placement, transaction tracking, down-payment bookkeeping, and billing state mutations.


* 
**Shoppable Stories Engine (`/api/v1/stories`):** Programmatic access to push short vertical videos, tag specific warehouse product identifiers, and modify active visibility states.


* **Blog Content Engine (`/api/v1/posts`):** Handles headless publication of deep tech reviews, hardware compatibility guides, and SEO metadata indexing.

### 3. Dedicated Aggregator Routing Standard

* 
**Torob Core Endpoint (`/api/v1/torob/products`):** To separate automated discovery scraping pipelines from general application code, all pricing feeds conform strictly to the standardized `/api/v1/torob/` endpoint prefix.


* 
**High-Volume Pagination Layer:** The route integrates cursor-based pagination defaults to stream deep product records smoothly without stressing memory systems or lock pools during heavy automated scraping cycles.



---

## Conversational Voice AI Consultation Matrix

### 1. Bi-Directional Streaming Audio Architecture

The customer consulting platform features an interactive audio interface designed for organic human dialogue:

* **Real-Time Speech Ingestion (STT):** Captures microphone arrays directly from client browsers via WebAudio APIs, streaming raw audio data blocks over a secure persistent WebSocket or a WebRTC stream straight to the NestJS cluster.
* 
**Factual RAG Retrieval Core:** Audio data is converted to text strings and processed by a semantic parsing layer. The system runs a cosine similarity evaluation against the database's vector coordinates to pull verified hardware configurations from current warehouse stock.


* **Expressive Vocal Synthesis (TTS):** Generates low-latency audio response matrices utilizing high-quality tone generation models. It streams natural vocal answers back to the consumer, retaining an engaging, conversational, and highly technical tone.



### 2. Intelligent Compute Protection Layer (Redis IP Firewall)

Because processing real-time audio and vector lookups requires significant processing power, the voice engine includes strict protective boundaries:

* **Granular IP Tracking Counters:** Every inbound query, audio connection hand-shake, or semantic prompt triggers a localized Redis tracking increment mapped directly to the user's validated incoming IP address (`rate:voice:ip_address`).
* **Multi-Tiered Window Limits:** Enforces strict limits on API requests to prevent abuse (e.g., a maximum of 5 concurrent voice sessions per minute and 30 minutes of cumulative consulting time per calendar day per unique client IP).
* **Graceful Throttling Responses:** When an IP address exceeds predefined thresholds, the system safely pauses audio processing streams and returns a polite vocal message: *"You have reached your daily premium hardware consulting allocation. Chat sessions will reopen shortly."*

---

## Updated Data Architecture

To support comprehensive API access and voice consulting features, the core schema is enhanced with new system tables:

### API Tokens Ledger (`api_tokens`)

Tracks active cryptographic API access keys generated by administrators for external services.

```typescript
export const apiTokens = pgTable('api_tokens', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(), // e.g., "ERP Sync Engine"
  tokenHash: text('token_hash').unique().notNull(),
  scopes: jsonb('scopes').notNull(), // ['products:write', 'orders:read']
  lastUsedAt: timestamp('last_used_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

```

### Blog Ledger (`blog_posts`)

Manages editorial content and deep technical guides on the platform.

```typescript
export const blogPosts = pgTable('blog_posts', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').unique().notNull(),
  content: text('content').notNull(),
  authorId: uuid('author_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

```

---

## Features In Scope

* 
**Headless REST API Architecture:** Full public REST endpoints (`/api/v1/`) spanning the entire product catalog, transactions, blog logs, and shoppable stories.


* **Admin API Key Workshop:** Internal dashboard views enabling secure generation, description, and status tracking of admin-managed API access keys.
* 
**Conversational Voice Consultation Portal:** Web interface that processes microphone input, performs vector database searches, and returns synthesized spoken responses.


* 
**Distributed Redis IP Firewall:** High-speed rate limiting that tracks client IP addresses to guard premium AI audio processing streams.


* 
**Standardized Torob Crawler Port:** Dedicated, fast-responding product catalog feed endpoints located explicitly at `/api/v1/torob/products`.



## Features Out of Scope

* **Universal Public Sign-up for API Tokens:** Regular customers cannot request API tokens; tokens are reserved for administrative integrations.
* **Multi-Vendor Audio Routing Isolation:** No third-party tenant isolation layers for independent external vendor storefront channels.
* **Real-Time Human Call-Center Hand-Off:** The conversation assistant runs entirely via automated AI models without direct live routing to real telephone support reps.

---

## Success Criteria

* 
**Complete Endpoint Type Alignment:** Changes to standard data schemas instantly sync down to REST formats and tRPC endpoints across the monorepo workspace.


* 
**Total Price Integrity:** Hashed API tokens block unauthorized catalog updates, preventing malicious parameter changes across product items.


* 
**Highly Responsive Voice AI Delivery:** The conversational streaming engine returns natural, low-latency audio responses grounded directly by actual warehouse inventory facts.


* 
**Reliable Compute Protection:** The distributed Redis firewall effectively drops high-volume script requests at the IP level, avoiding runaway server compute costs.