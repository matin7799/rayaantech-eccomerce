# Library Docs (Rayan Tech Ecommerce Platform)

Project-specific usage patterns for every third-party library, API integration, and core service in the Rayan Tech project. This file covers custom rules, strict architectural constraints, and patterns specific to Rayan Tech. Read the relevant section before implementing or modifying any feature.

---

## Before Using Any Library or External API

Before implementing any feature that interacts with a third-party service or internal core API:
1. **Check AGENTS.md** at the project root to see if an AI Skill or Model constraint is already updated for that specific service.
2. **Check MCP Server Configuration**: If an MCP server is configured for the library/service, use its direct context before falling back to general programming assumptions.
3. **Follow the Order of Authority**: This document overrides generic library documentation. Never rely solely on training models for API specs as eCommerce, payment, and AI endpoints evolve quickly.

---

## Core API & Token Authentication

### Admin-Generated API Tokens
The platform leverages a custom API Token Authentication mechanism managed exclusively through the Admin Panel for external integrations and headless communications.

#### Rules:
* **Token Storage**: Raw API tokens must **never** be stored in plaintext in the database. Always store a SHA-256 hash of the token.
* **Visibility**: Show the raw generated API token **only once** to the admin upon creation. Never expose it in subsequent GET requests.
* **Header Format**: External requests must use the `Authorization: Bearer <API_TOKEN>` header.
* **Scope Filtering**: Always validate the token scope against the requested resource (e.g., `products:write`, `orders:read`).
* **Database Queries**: Every query authenticated via API Token must log the `token_id` and `admin_id` for security auditing purposes.

---

## Torob Integration Engine

### Endpoint Routing & Data Syncing
All endpoints designed for Torob crawler matching and product pricing sync must strictly reside under the specified versioned routing.

#### Rules:
* **Base URL**: All Torob endpoints must be prefixed with `/api/v1/torob/` (e.g., `/api/v1/torob/products`).
* **Caching Strategy**: Torob product feeds must be cached using Redis for a minimum of 15 minutes. **Never** query the live database directly for every Torob crawler hit.
* **Response Format**: Responses must strictly follow Torob’s required JSON schema (including `page_url`, `price`, `availability`).
* **Availability Mapping**: If a product inventory is 0, `availability` must explicitly return `instock: false`. Never return a null value.

---

## AI Consultation & Voice Assistant

### Professional Audio Engagement & AI Consulting
A specialized AI agent provides professional, real-time voice and text consultations to customers regarding products, specifications, and buying guides.

#### Architecture Pattern:
`User WebRTC/Audio Stream` ⇄ `Next.js WebSocket Route` ⇄ `OpenAI Realtime API / Audio Engine`

#### Rules:
* **Model String**: Always use `gpt-4o-realtime` or specified audio-capable models.
* **Temperature**: Set to `0.3` for product specs matching (highly factual) and `0.6` for conversational engagement.
* **IP-Based Rate Limiting**: 
  * Strict limit of **5 voice connection initializations per hour per IP address**.
  * Max **50 turn-based audio messages per session per IP**.
  * Use Redis fixed-window counters. If a user exceeds the limit, immediately return a `429 Too Many Requests` status code with a localized warning.
* **Session Guard**: Maximum voice session duration is strictly **300 seconds**. Force-disconnect via the server-side socket when the limit is reached.
* **Context Restriction**: The AI must **never** discuss internal business margins, competitor prices, or make binding financial promises. Ground the model strictly using the current vector store of Rayan Tech products.

---

## Order & Payment Gateways

### Transaction Security & State Management
Handles checkout flows, state mutations, and financial transactions.

#### Rules:
* **State Updates**: Never update order payment state to `PAID` based purely on client-side router redirects. State mutation **must** happen via secure backend-to-backend Webhooks.
* **Idempotency**: Every payment callback processing function must utilize an idempotency key (`payment_ref_id`) to prevent double-processing.
* **Failure Handling**: Always wrap payment gateway logic in explicit `try/catch` blocks, logging the absolute raw gateway error to secure storage while returning a clean, non-sensitive error to the customer UI.

---

## Content & Blog Engine (Stories & Posts)

### High-Performance Media & Narrative Content
Manages promotional stories, video clips, and technical blog posts.

#### Rules:
* **Media Optimization**: All images uploaded via the blog/story panel must be programmatically converted to `.webp` format and scaled to a maximum width of 1200px.
* **Story Expiration**: Stories must include an `expires_at` timestamp set exactly to 24 hours from creation. Database queries fetching active stories must explicitly filter out expired timestamps.