# Architecture: Rayan Tech

## Stack

| Layer | Tool | Purpose |
| --- | --- | --- |
| **Monorepo Engine** | pnpm Workspaces + Turborepo | Manages structural builds, asset compilation pipelines, and type sharing across all localized applications.

 |
| **Frontend Framework** | TanStack Start (SSR) | Handles server-side interface rendering and file-system routing with compile-time type safety.

 |
| **Backend Core Framework** | NestJS (TypeScript) | Serves as the highly structured, modular, and enterprise-grade core business logic engine.

 |
| **Internal RPC Layer** | tRPC Protocols | Facilitates zero-overhead, end-to-end type-safe contract invocations between frontend views and backend entities.

 |
| **Public Headless Engine** | NestJS REST Controllers | Exposes standard HTTP REST routes globally for decoupled clients, apps, and third-party webhooks.

 |
| **Client State Core** | Zustand | Tracks global client states, volatile shop configurations, PWA hooks, and persistent interactive carts.

 |
| **Data Synchronization** | TanStack Query | Manages background caching, item listings, real-time live stock indicators, and exchange-rate computations.

 |
| **Primary Database** | PostgreSQL | Handles reliable multi-tenant relational data layout and indexing.

 |
| **Object-Relational Mapper** | Drizzle ORM | Drives performant, strictly typed database query compilations and schema migration flows.

 |
| **Vector Engine Extension** | pgvector Extension | Stores high-dimensional hardware metadata embeddings inside native database columns for semantic search execution.

 |
| **Voice / Audio Streamer** | WebSockets + WebRTC Streams | Coordinates real-time, low-latency duplex transmission of audio packets between clients and synthesis nodes.

 |
| **AI Ingestion & Audio Node** | Whisper API + Custom TTS Node | Processes Speech-to-Text translation matrices and real-time human-like voice synthesis streams.

 |
| **Message Broker** | Apache Kafka | Isolates and schedules background workflows, notification triggers, automated media processes, and system audits.

 |
| **Distributed Cache Guard** | Redis Store | Evaluates rate limits, isolates client IP buckets, shields the Voice AI, and tracks time-boxed campaigns.

 |
| **Authentication Engine** | Better Auth | Manages web user verification via secure, mobile-based OTP sequences backed by HttpOnly session cookies.

 |
| **Observability Stack** | Pino + Grafana Loki | Implements non-blocking, structured JSON log streaming across infrastructure clusters.

 |
| **Design System / Styling** | Tailwind CSS + shadcn/ui | Builds responsive Liquid Glassmorphism design system structures with fluid theme configurations.

 |

---

## Folder Structure

```text
rayan-tech-monorepo/
├── apps/
│   ├── web/                     # Frontend UI Engine utilizing TanStack Start (SSR)
│   └── backend/                 # Core Business Engine & REST/tRPC API utilizing NestJS
├── packages/
│   ├── db/                      # Central DB Layer (Drizzle Relational Schemas & Migrations)
│   ├── types/                   # Cross-Workspace Zod Compilations & Unified Contract Models
│   └── config/                  # Shared Configuration Profiles (TSConfig, ESLint, Tailwind)
├── docker-compose.yml           # Unified Multi-Service Local Infrastructure Stack Configuration
└── turbo.json                   # System Pipeline Orchestrations managed via Turborepo

```

---

## System Boundaries

| Workspace Directory | Strict Boundary Ownership Rules |
| --- | --- |
| **`apps/web/`** | * Owns client view presentation templates, interface layouts, and reactive browser state variables .

<br>

<br>* Communicates internally with the backend via structural tRPC caller functions .

<br>

<br>* Holds **no** direct SQL strings, internal encryption keys, or sensitive backend service mutations.

 |
| **`apps/backend/`** | * Owns core logic operations, multi-currency processing layers, payment provider interfaces, and AI handlers .

<br>

<br>* Intercepts traffic via structural NestJS token guards and Redis throttler components .

<br>

<br>* Processes public REST request mappings alongside local type-safe internal tRPC routes.

 |
| **`packages/db/`** | * Maintains the centralized structural definitions, relation schemas, and version-tracked migration models.

<br>

<br>* Contains all system column metadata mapping protocols. |
| **`packages/types/`** | * Compiles centralized Zod validations and shared contract definitions .

<br>

<br>* Enforces type compliance across separate server and client workspace boundaries.

 |

---

## Data Flow Architecture

### 1. Unified Internal vs. Public REST Communications

* Internal client actions execute via direct, type-safe tRPC protocols to call backend service modules.


* Headless interactions, custom external app requests, or management actions leverage the `/api/v1/` REST endpoint array, authorized securely by cryptographic API Token verification steps.



### 2. Standardized Aggregator Isolation Core (`/api/v1/torob/...`)

* Crawler bot traffic hits isolated, cached catalog routes positioned strictly beneath `/api/v1/torob/`.


* Incoming crawler loops leverage cursor-based pagination defaults to stream deep product sheets smoothly without triggering long database transaction locks.


* Referral clicks initialize a high-speed session tracking record in Redis using a strict 1200-second (20-minute) TTL window.



### 3. Conversational Voice AI Consultation & Distributed IP Firewall

* Raw browser audio vectors stream continuously via WebSockets or WebRTC targets straight into the backend ingestion worker layers.


* Audio streams are normalized into text indices via Whisper engines, which then trigger cosine similarity calculations within PostgreSQL via the pgvector database index.


* Retreived factual stock documents pass into the LLM system prompt context, streaming interactive spoken consult paths back via low-latency audio synthesis pipelines.


* To shield the infrastructure from expensive large language model computing abuse, every transaction, packet handshake, or request sequence updates a specialized counter inside Redis, tracked directly to the incoming client IP address (`rate:voice:ip_address`).



---

## Relational Database Schema (Drizzle ORM)

```text
       ┌──────────────────┐               ┌──────────────────┐
       │   wholesale_grps │               │      users       │
       └────────┬─────────┘               └────────┬─────────┘
                │ 1                                │ 1
                │                                  │
                │ 0..* │ 0..*
       ┌────────▼─────────┐               ┌────────▼─────────┐
       │     products     │               │      orders      │
       └────────▲─────────┘               └────────┬─────────┘
                │ 0..* │ 1
                │                                  │
                │ 1                                │ 0..*
       ┌────────┴─────────┐               ┌────────▼─────────┐
       │    categories    │               │     payments     │
       └──────────────────┘               └──────────────────┘

```

### Users (`users`)



| Column | Type | Constraints / References | Notes |
| --- | --- | --- | --- |
| `id` | `uuid` | Primary Key (Default Random) | Unique entity tracker ID.

 |
| `phone` | `text` | Unique, Not Null | Verified user mobile number.

 |
| `full_name` | `text` | Nullable | User first and last name.

 |
| `role` | `user_role` (Enum) | Default: `'RETAIL'`, Not Null | <br>`RETAIL` / `WHOLESALE` / `ADMIN` / `OPERATOR`.

 |
| `wholesale_status` | `wholesale_status` (Enum) | Default: `'NONE'`, Not Null | Onboarding validation status.

 |
| `wholesale_group_id` | `uuid` | References `wholesale_groups.id` | Link to assigned dealer tier.

 |
| `rayan_coins` | `integer` | Default: `0`, Not Null | User rewards loyalty balance.

 |
| `created_at` | `timestamp` | Default Now, Not Null | System timestamp entry.

 |
| `updated_at` | `timestamp` | Default Now, Not Null | Last update log snapshot. |

### API Access Tokens (`api_tokens`)



| Column | Type | Constraints / References | Notes |
| --- | --- | --- | --- |
| `id` | `uuid` | Primary Key (Default Random) | Token row identification index. |
| `name` | `text` | Not Null | Descriptive label (e.g., `'ERP_Sync_Key'`). |
| `token_hash` | `text` | Unique, Not Null | Cryptographically salted (sha256) hash value.

 |
| `scopes` | `text[]` | Not Null | Permitted operational scopes (e.g., `['products:write']`).

 |
| `created_by` | `uuid` | References `users.id`, Not Null | Administrative account source index. |
| `expires_at` | `timestamp` | Nullable | Optional system token lifespan threshold. |
| `created_at` | `timestamp` | Default Now, Not Null | Generation log marker. |

### Wholesale Tiers (`wholesale_groups`)



| Column | Type | Constraints / References | Notes |
| --- | --- | --- | --- |
| `id` | `uuid` | Primary Key (Default Random) | Dealer profile record identifier.

 |
| `name` | `text` | Not Null | Group tier label (e.g., `'Gold Dealers'`).

 |
| `discount_percent` | `decimal(5, 2)` | Default: `'0.00'`, Not Null | Catalog markdown factor percentage.

 |
| `description` | `text` | Nullable | Operational group internal notes.

 |

### Products Catalog (`products`)



| Column | Type | Constraints / References | Notes |
| --- | --- | --- | --- |
| `id` | `uuid` | Primary Key (Default Random) | Warehouse item base tracking reference.

 |
| `title` | `text` | Not Null | Hardware listing description header.

 |
| `slug` | `text` | Unique, Not Null | URL search safe text parameter.

 |
| `category_id` | `uuid` | References `categories.id`, Not Null | Multi-level categorization path.

 |
| `brand_id` | `uuid` | References `brands.id`, Not Null | Manufacturer identifier association.

 |
| `description` | `text` | Not Null | Full hardware technical breakdown.

 |
| `grade` | `product_grade` (Enum) | Default: `'NEW'`, Not Null | <br>`NEW` / `OPEN_BOX` / `GRADE_A_PLUS_PLUS` / etc..

 |
| `base_price` | `decimal(12, 0)` | Not Null | Primary standard retail cost parameters.

 |
| `wholesale_price` | `decimal(12, 0)` | Nullable | Base partner pricing allocation baseline.

 |
| `usd_base_price` | `decimal(10, 2)` | Nullable | Dynamic FX calculation anchor metric.

 |
| `stock` | `integer` | Default: `0`, Not Null | Live warehouse physical product quantity.

 |
| `image_urls` | `jsonb` | Not Null | Array block mapping storage media assets.

 |
| `embedding` | `vector(1536)` | Nullable | Multi-dimensional semantic hardware vectors.

 |
| `created_at` | `timestamp` | Default Now, Not Null | Ingestion timestamp reference.

 |

### System Categories (`categories`)



| Column | Type | Constraints / References | Notes |
| --- | --- | --- | --- |
| `id` | `uuid` | Primary Key (Default Random) | Category tracking block index.

 |
| `name` | `text` | Not Null | Label index (e.g., `'Laptops'`).

 |
| `parent_id` | `uuid` | References self (`categories.id`), Nullable | Self-referencing link for hierarchical navigation.

 |

### Brand Indices (`brands`)



| Column | Type | Constraints / References | Notes |
| --- | --- | --- | --- |
| `id` | `uuid` | Primary Key (Default Random) | Hardware builder unique identity.

 |
| `name` | `text` | Not Null | Manufacturer trading name (e.g., `'ASUS'`).

 |

### Orders Ledger (`orders`)



| Column | Type | Constraints / References | Notes |
| --- | --- | --- | --- |
| `id` | `uuid` | Primary Key (Default Random) | Ledger billing record identifier.

 |
| `user_id` | `uuid` | References `users.id`, Not Null | Purchasing customer account mapping.

 |
| `total_amount` | `decimal(12, 0)` | Not Null | Computed transaction amount.

 |
| `payment_method` | `payment_method` (Enum) | Not Null | <br>`CASH` / `RAYAN_INSTALLMENT` / `DIGIPAY_INSTALLMENT` / `SPLIT`.

 |
| `installment_metadata` | `jsonb` | Nullable | Object storing terms, rates, and parameters.

 |
| `status` | `order_status` (Enum) | Default: `'PENDING_PAYMENT'`, Not Null | Processing status lifecycle step.

 |
| `created_at` | `timestamp` | Default Now, Not Null | Order initialization timestamp.

 |

### Payments Ledger (`payments`)



| Column | Type | Constraints / References | Notes |
| --- | --- | --- | --- |
| `id` | `uuid` | Primary Key (Default Random) | Financial gateway entry index.

 |
| `order_id` | `uuid` | References `orders.id`, Not Null | Associated system checkout transaction.

 |
| `amount` | `decimal(12, 0)` | Not Null | Total processing volume sent to gateway.

 |
| `provider` | `text` | Not Null | Gateway allocation (e.g., `'ZARINPAL'`, `'SADERAT'`, `'DIGIPAY'`).

 |
| `status` | `payment_status` (Enum) | Default: `'PENDING'`, Not Null | Verification status parameter.

 |
| `authority` | `text` | Unique, Nullable | Gateway resolution reference token.

 |
| `ref_id` | `text` | Nullable | Bank verification transaction hash.

 |
| `created_at` | `timestamp` | Default Now, Not Null | Payment sequence log marker.

 |
| `updated_at` | `timestamp` | Default Now, Not Null | Last execution log update.

 |

### Content Stories (`shoppable_stories`)



| Column | Type | Constraints / References | Notes |
| --- | --- | --- | --- |
| `id` | `uuid` | Primary Key (Default Random) | Dynamic content story entity index. |
| `title` | `text` | Not Null | Internal reference label for story clip. |
| `video_url` | `text` | Not Null | Storage engine path mapping video file asset.

 |
| `product_id` | `uuid` | References `products.id`, Nullable | Embedded item link for one-click add to cart.

 |
| `is_active` | `boolean` | Default: `true`, Not Null | Client visibility status flag. |
| `created_at` | `timestamp` | Default Now, Not Null | Publication timeline tracker record. |

### Editorial Posts (`blog_posts`)



| Column | Type | Constraints / References | Notes |
| --- | --- | --- | --- |
| `id` | `uuid` | Primary Key (Default Random) | Article documentation entry point. |
| `title` | `text` | Not Null | Editorial title text header. |
| `slug` | `text` | Unique, Not Null | URL path index for indexing engines.

 |
| `content` | `text` | Not Null | Full Markdown structure content body. |
| `metadata` | `jsonb` | Nullable | SEO tags, description metrics, and keywords.

 |
| `is_published` | `boolean` | Default: `false`, Not Null | Content management publishing visibility flag. |
| `created_at` | `timestamp` | Default Now, Not Null | Content calendar history tracking log. |

### Visual Marketing Banners (`banners`)



| Column | Type | Constraints / References | Notes |
| --- | --- | --- | --- |
| `id` | `uuid` | Primary Key (Default Random) | Display graphic identifier block. |
| `position` | `text` | Not Null | UI location anchor tracking parameter.

 |
| `image_url` | `text` | Not Null | CDN media file path location. |
| `link_url` | `text` | Nullable | Interactive click target URL location. |
| `priority` | `integer` | Default: `0`, Not Null | Sorting matrix constraint parameters. |
| `is_active` | `boolean` | Default: `true`, Not Null | Layout rendering evaluation flag.

 |

### Central Infrastructure Logs (`system_logs`)

| Column | Type | Constraints / References | Notes |
| --- | --- | --- | --- |
| `id` | `uuid` | Primary Key (Default Random) | Core operational tracking event code. |
| `level` | `text` | Not Null | Log classification (e.g., `'INFO'`, `'WARN'`, `'ERROR'`). |
| `message` | `text` | Not Null | Main exception log descriptions. |
| `context` | `jsonb` | Nullable | Detailed exception stacking or data payload diagnostics. |
| `service` | `text` | Not Null | Micro-app component trace tag (e.g., `'AUDIO_AI'`). |
| `created_at` | `timestamp` | Default Now, Not Null | Transaction execution record date. |

---

## Access Authentication & Security Interceptors

### User Session Validation Architecture

* Standard user client interactions utilize Better Auth protocols via HttpOnly, SameSite=Lax cookie tokens.


* Authentication operations leverage secure mobile OTP confirmation workflows managed through an isolated Kafka routing task matrix.



### Admin API Key Verification Framework

* Extracted credentials from incoming public REST traffic are processed against authorization headers using the following validation structure:
```text
Authorization: Bearer rt_tok_live_f83h2d...

```


* Intercepted tokens undergo a one-way sha256 cryptographic check against the `api_tokens.token_hash` index to verify active scope privileges before executing endpoint controller tasks.



---

## Architectural Invariants (Unalterable System Rules)

> ### CRITICAL SYSTEM SAFEGUARDS — ZERO VIOLATION TOLERANCE
> 
> 
> * **Server-Side Price Isolation**: Frontend parameters or browser variables are explicitly banned from altering purchase totals. All wholesale markdowns and aggregator validation equations must calculate *exclusively* inside the server-side NestJS application tier.
> 
> 
> * **Asynchronous Process Offloading**: Core transactional loops must never be stalled by blocking tasks. Non-essential processes (including SMS dispatches, automated n8n notifications, vector compilations, and logging updates) must route through dedicated Kafka message streams.
> * **Enforced IP Rate Limiting**: Every incoming Voice AI socket request, transcription request, or semantic search loop must trigger a check against the distributed Redis firewall mapped to the user's validated IP address to block compute drain.
> * **Explicit Aggregator API Scoping**: All external integrations or scraping pathways built for Torob must connect through controllers scoped strictly beneath the `/api/v1/torob/` endpoint layout.
> 
> 
> * **Strict Data Query Sandboxing**: Relational operations executed across the application layer must enforce criteria filters bounded to the user's active session profile or verified token scope definitions.
> * **Grounded Semantic AI Output**: Prompt execution workflows within the consulting module must combine live system information from the pgvector database index. The conversational assistant is strictly blocked from generating device models or specifications missing from the active warehouse database inventory.
> 
> 
> * **Automatic Audio Handle Disposal**: Active speech processing sessions or media streams must run within isolated try/catch containers. Media context allocations are forced to execute clean termination sequences to prevent system resource leakage.