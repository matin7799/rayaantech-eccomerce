# Code Standards: Rayan Tech

Implementation rules and conventions for the entire Rayan Tech ecosystem. The AI agent and all engineering peers must adhere to these in every session without exception to eliminate pattern drift across monorepo boundaries.

## Engineering Mindset

* 
**Think Before Implementing:** Understand the domain model and system architecture before writing a single line of code. Always cross-reference changes with `architecture.md` and `project-overview.md`.


* 
**Scope is Sacred:** Only build what the active backend module or client interface requires. Never implement unrequested abstractions.


* 
**Server-Side Source of Truth:** Frontend variables or browser configurations are completely banned from altering transactional parameters, totals, or pricing mechanics. All wholesale markdowns and financial actions calculate exclusively inside the NestJS tier.


* 
**Asynchronous Process Offloading:** Core transactional loops must never be stalled by blocking tasks. Non-essential pipelines (SMS notifications, n8n webhook triggers, vector indexing) must route asynchronously through dedicated Apache Kafka streams.


* 
**Failures are Contained:** Wrap complex logic (especially real-time audio contexts and stream handlers) in structured containers to guarantee clean resource disposal and prevent infrastructure memory leaks.



---

## File Size Discipline

* 
**300-Line Hard Limit:** No single source code file (`.ts`, `.tsx`) may exceed 300 lines of code. If a module approaches this threshold, decompose it into focused sub-modules, utility files, or sub-components. This constraint enforces small, testable, reviewable units and eliminates monolithic service files that resist safe refactoring.


---

## Full-Stack Interactive Integration

* 
**No Mock Data or Stubs in Production Code:** Frontend and backend features must be developed simultaneously against live contracts. `setTimeout` placeholders, hardcoded arrays, or simulated API responses are banned from committed source. Every rendered UI element must consume a real tRPC procedure or REST endpoint wired to the database layer.


---

## Absolute Financial Integrity

* 
**Integer Rials Only:** All database price columns use `numeric(12, 0)` — integer Rials with zero fractional digits. Floating-point arithmetic (`parseFloat`, `Number()`, `* 0.xx`) on currency values is a critical violation. All financial math operates on integers parsed via `parseInt` from PostgreSQL NUMERIC strings.


* 
**Percentage Calculations via Basis Points:** Wholesale markdown percentages are applied using integer basis-point math (`basisPoints = percent × 100`, `discount = trunc(price × basisPoints / 10000)`) to eliminate IEEE 754 drift entirely.


---

## TypeScript & Monorepo Convictions

* 
**Strict Mode Enabled:** Enforced strictly across all workspaces (`tsconfig.json`).


* 
**Type Safety:** Never use `any`. Use `unknown` and perform exhaustive type narrowing.


* **Explicit Contracts:** All function parameters, DTO fields, and return types must be explicitly typed. Inference is prohibited for public interfaces.
* 
**Structural Sharing:** Centralized domain types, Zod schemas, and tRPC contracts must live inside `packages/types/` to enforce absolute type alignment between `apps/web/` and `apps/backend/`.



---

## Frontend Layout: TanStack Start & tRPC

* 
**Internal Data Transmission:** Internal client views fetch and mutate data using direct, type-safe tRPC protocols mapping directly to NestJS endpoints.


* 
**State Split:** Use `Zustand` exclusively for volatile, client-side store values (such as responsive cart additions and workspace UI settings). Use `TanStack Query` for background caching, stock state synchronization, and server validation states.


* 
**Component Pattern:** No default exports. Every presentation layer entity must be a named export accompanied by an explicitly stated props interface directly above the declaration.


* 
**Styling Consistency:** All styles leverage functional Tailwind classes matching design tokens via defined CSS variables. Inline styles are banned.



---

## Backend Engine: NestJS REST Controllers

* 
**Public API Routing Matrix:** All public, headless, and third-party operational routes must follow the strict `/api/v1/` layout wrapper.


* 
**Payload Validation:** Every inbound REST request must be mapped to an explicit Data Transfer Object (DTO) and verified immediately using Zod runtime validation layers before proceeding to service execution blocks.


* 
**Response Wrapping:** Standardized formatting is strictly enforced for all public HTTP responses. Never return raw schema models. The API payload must conform to this interface:


```typescript
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    context?: string;
  };
}

```



---

## Cryptographic API Token Verification

* 
**Header Authorization:** Decoupled external and programmatic operations authenticate via the standard authorization header:
`Authorization: Bearer rt_tok_[token_string]`


* 
**Hashing Invariant:** Raw token text is displayed to an administrator exactly once upon workspace creation. Tokens are stored inside the `api_tokens` table as one-way cryptographically salted SHA-256 hashes (`token_hash`).


* 
**Guard Interception:** A global NestJS authentication guard must intercept inbound traffic, hash the bearer string, evaluate scope validation arrays (e.g., `products:write`, `orders:read`), and enforce user context bounds.



---

## Conversational Voice AI & Compute Protection

* 
**Duplex Processing:** Real-time audio ingestion uses WebAudio browser frames streaming directly via WebSockets or WebRTC pipelines to the backend ingestion cluster.


* 
**IP Firewall Rate Limiting:** To shield LLM and semantic lookup matrices from vector injection and compute overhead, every voice handshake or processing chunk checks against the distributed Redis cache.


* 
**Tracking Key Structure:** Increments map strictly to the client's verified IP boundary: `rate:voice:ip_address`.


* 
**Window Limits:** Restrict connections tightly (e.g., maximum of 5 concurrent voice sessions per minute and 30 cumulative consulting minutes per calendar day per unique client IP address).


* 
**Output Grounding Rule:** AI generation workflows must combine matching context matrices from the `pgvector` database index. The conversational model is completely blocked from hallucinating hardware specifications or inventory objects missing from active physical stock records.



---

## Torob Aggregator Specification

* 
**Isolated Feed Scoping:** All pricing feeds and discovery bot pipelines must connect through controllers scoped strictly beneath the `/api/v1/torob/` endpoint prefix.


* 
**High-Volume Pagination:** To eliminate heavy database lock contention and memory spikes during massive crawling sweeps, queries must default to cursor-based pagination streams.


* 
**Referral Conversion Tracking:** Direct inbound referral clicks from the Torob index must initialize a high-speed tracking record inside the Redis store with a strict 1200-second (20-minute) Time-To-Live (TTL) boundary to safely coordinate temporary marketing discounts without parameter tampering.



---

## File and Folder Naming Layout

* **Workspace Repositories:**
* 
`apps/web/` — User views, layout blocks, interactive reactive components.


* 
`apps/backend/` — Structured controllers, application services, modules, domain extensions.


* 
`packages/db/` — Central relation mappings, Drizzle migrations, relational schemas.


* 
`packages/types/` — Validation contracts, cross-boundary definitions.




* **Naming Cases:**
* Folders & Directories: `kebab-case` (e.g., `shoppable-stories`, `api-tokens`).


* NestJS Components (Modules/Controllers/Services): `kebab-case` with specific type extensions (e.g., `products.controller.ts`, `auth.guard.ts`).
* Frontend Component Files: `PascalCase` (e.g., `VoiceConsole.tsx`, `ProductGrid.tsx`).


* Utility & Configuration Assets: `camelCase` (e.g., `redisClient.ts`, `kafkaProducer.ts`).





---

## Error Handling & Non-Blocking Logging

* 
**Structured Internal Logging:** Implement non-blocking, asynchronous structured JSON log transfers using the `Pino` logger to prevent CPU blocking on heavy I/O operations.


* 
**Masking Internals:** User-facing responses must show clear, human-readable error messaging. Exposed 500 status frameworks must return generic descriptors; never expose internal application stacks, raw database schemas, or system exceptions to the client.


* 
**Trace Identifiers:** Every caught controller exception must include a domain context bracket prefix: `[product/ingest]` or `[voice/stream]`.



---

## Environment Variables & Approved Dependencies

Never hardcode secrets, private credentials, database strings, or integration tokens anywhere in the codebase. Every secret must be systematically injected via secure environment variables.

| Variable | Target Scope / Usage |
| --- | --- |
| `DATABASE_URL` | Central PostgreSQL + Drizzle connection initialization |
| `REDIS_URL` | Distributed IP firewall tracking engine and Torob session state cache 

 |
| `KAFKA_BROKER` | Event coordination pipelines and notification offloading 

 |
| `OPENAI_API_KEY` | Vector embedding generation and consultation analysis pipelines 

 |
| `DIGIPAY_CLIENT_TOKEN` | Financial validation authorizations for customized credit payment layers 

 |

### Approved Monorepo Workspace Dependencies

* 
**Core Systems:** `@nestjs/core`, `@nestjs/throttler` (Redis tracking) , `kafkajs` (Broker streams) , `ioredis` (IP firewall management) 


* 
**Data Layout:** `drizzle-orm`, `pg` (PostgreSQL interface) , `pgvector` (Semantic matching arrays) 


* 
**Frontend Engine:** `@tanstack/start`, `@tanstack/react-query`, `zustand` (State) 


* 
**AI Integration:** `openai`, `@langchain/openai`, `vercel-ai-sdk` 


* 
**Validation & Styles:** `zod`, `tailwindcss`, `shadcn/ui` components 



---

### Why we structured it this way:

1. 
**NestJS & TanStack Start Separation:** By explicitly identifying file rules for both `apps/web/` and `apps/backend/`, your AI agents won't accidentally try to use React Hooks inside a NestJS service or place controller routes in the frontend package.


2. 
**Security Invariants:** Moving from Next.js actions to a true API token verification model makes sure our backend guards extract `rt_tok_` hashes correctly and check against permissions inside `api_tokens`.


3. 
**Voice AI & Torob Contexts:** Laying out the specific Redis naming schema (`rate:voice:ip_address`) and the strict cursor requirements for Torob prevents common scalability bugs when web scrapers hit the site.
