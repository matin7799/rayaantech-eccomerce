# Rayan Tech E-Commerce — API Reference

> **Base URL:** `https://api.rayantech.ir` (production) | `http://localhost:3003` (development — backend `PORT`, see root `.env`)
>
> **API Version:** v1
>
> **Content-Type:** `application/json`

---

## Authentication

All protected endpoints require API token authentication via the `Authorization` header.

### Header Format

```
Authorization: Bearer rt_tok_<your_api_token>
```

### Token Requirements

| Property | Description |
|----------|-------------|
| Prefix | Must start with `rt_tok_` |
| Validation | Server hashes the token with SHA-256 and looks up the hash in the `api_tokens` table |
| Expiration | Token must not be expired (`expires_at` in the future or null for permanent tokens) |
| Scopes | Token must have the required scopes for the target endpoint |

### Error Responses (Authentication)

```json
{
  "statusCode": 401,
  "message": "Missing Authorization header",
  "messageFa": "احراز هویت الزامی است",
  "error": "UNAUTHORIZED",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "path": "/api/v1/products"
}
```

```json
{
  "statusCode": 403,
  "message": "Insufficient permissions to access this resource",
  "messageFa": "دسترسی به این منبع مجاز نیست",
  "error": "FORBIDDEN",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "path": "/api/v1/products"
}
```

---

## Scopes

Scopes control granular access to API endpoints. Tokens are assigned scopes as a JSON array.

| Scope | Description |
|-------|-------------|
| `products:read` | Read product catalog data |
| `products:write` | Create, update, and delete products |
| `orders:read` | Read order data |
| `orders:write` | Create and modify orders |
| `admin:rate-limits` | Manage AI rate limit settings |

---

## Rate Limiting (AI Endpoints)

AI-powered endpoints are subject to per-customer rate limiting.

- **Default:** 20 requests per hour
- **Configurable:** Admins can adjust per-user or globally via `/admin/rate-limits`
- **Key pattern:** `rate:ai:{userId}:{feature}`

### Rate Limit Response Headers

| Header | Description |
|--------|-------------|
| `X-RateLimit-Limit` | Maximum requests allowed in the window |
| `X-RateLimit-Remaining` | Requests remaining in the current window |
| `X-RateLimit-Reset` | Seconds until the window resets |
| `Retry-After` | Seconds to wait before retrying (only on 429) |

### 429 Too Many Requests

```json
{
  "statusCode": 429,
  "message": "AI usage rate limit exceeded. Please try again later.",
  "retryAfter": 1847
}
```

---

## Products

### Create Product

Creates a product with optional nested variants (SKUs) and attribute bindings in a single atomic transaction.

**Endpoint:** `POST /api/v1/products`

**Scope:** `products:write`

#### Request Body

```json
{
  "name": "iPhone 15 Pro Max",
  "slug": "iphone-15-pro-max",
  "description": "گوشی موبایل اپل مدل آیفون ۱۵ پرو مکس",
  "primaryCategoryId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "brandId": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
  "grade": "stock",
  "basePrice": "89900000.00",
  "wholesalePrice": "85000000.00",
  "torobPrice": "88500000.00",
  "discountedPrice": "86900000.00",
  "campaignPrice": "84900000.00",
  "campaignStartAt": "2025-03-01T00:00:00.000Z",
  "campaignEndAt": "2025-03-15T23:59:59.000Z",
  "stock": 50,
  "isActive": true,
  "secondaryCategoryIds": [
    "c3d4e5f6-a7b8-9012-cdef-123456789012",
    "d4e5f6a7-b8c9-0123-defa-234567890123"
  ],
  "variants": [
    {
      "sku": "RT-IP15PM-256-NAT",
      "stock": 20,
      "priceModifier": "0.00",
      "attributes": [
        { "valueId": "e5f6a7b8-c9d0-1234-efab-345678901234" },
        { "valueId": "f6a7b8c9-d0e1-2345-fabc-456789012345" }
      ]
    },
    {
      "sku": "RT-IP15PM-512-BLK",
      "stock": 15,
      "priceModifier": "5000000.00",
      "attributes": [
        { "valueId": "a7b8c9d0-e1f2-3456-abcd-567890123456" },
        { "valueId": "b8c9d0e1-f2a3-4567-bcde-678901234567" }
      ]
    }
  ]
}
```

#### Field Reference

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Product display name (max 512 chars) |
| `slug` | string | Yes | URL-safe unique slug (max 512 chars) |
| `description` | string | No | Full product description |
| `primaryCategoryId` | UUID | Yes | Primary category foreign key |
| `brandId` | UUID | No | Brand foreign key |
| `grade` | enum | No | `open_box`, `stock`, `refurbished`, `like_new`, `used` (default: `stock`) |
| `basePrice` | decimal string | Yes | Base selling price (precision: 12, scale: 2) |
| `wholesalePrice` | decimal string | No | Bulk/wholesale price |
| `torobPrice` | decimal string | No | Torob marketplace listing price |
| `discountedPrice` | decimal string | No | Permanent discount price |
| `campaignPrice` | decimal string | No | Flash sale / campaign price |
| `campaignStartAt` | ISO-8601 | No | Campaign window start |
| `campaignEndAt` | ISO-8601 | No | Campaign window end |
| `stock` | integer | No | Base stock count (default: 0) |
| `isActive` | boolean | No | Visibility flag (default: true) |
| `secondaryCategoryIds` | UUID[] | No | Additional category bindings |
| `variants` | object[] | No | Nested SKU definitions (see below) |

#### Variant Object Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `sku` | string | Yes | Unique SKU identifier (max 128 chars) |
| `stock` | integer | Yes | Stock count for this variant |
| `priceModifier` | decimal string | No | Price adjustment from base (default: "0") |
| `attributes` | object[] | Yes | Attribute value bindings |

#### Variant Attribute Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `valueId` | UUID | Yes | Foreign key to `attribute_values.id` |

#### Response — 201 Created

```json
{
  "data": {
    "id": "f1e2d3c4-b5a6-7890-fedc-ba0987654321"
  }
}
```

#### Error — 409 Conflict (Duplicate SKU)

```json
{
  "statusCode": 409,
  "message": "A resource with the given identifier already exists",
  "messageFa": "تداخل در داده‌ها رخ داده است",
  "error": "CONFLICT",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "path": "/api/v1/products"
}
```

---

### Get Product by ID

**Endpoint:** `GET /api/v1/products/:id`

**Scope:** `products:read`

#### Response — 200 OK

```json
{
  "data": {
    "product": {
      "id": "f1e2d3c4-b5a6-7890-fedc-ba0987654321",
      "name": "iPhone 15 Pro Max",
      "slug": "iphone-15-pro-max",
      "description": "گوشی موبایل اپل مدل آیفون ۱۵ پرو مکس",
      "primary_category_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "brand_id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
      "grade": "stock",
      "base_price": "89900000.00",
      "wholesale_price": "85000000.00",
      "torob_price": "88500000.00",
      "discounted_price": "86900000.00",
      "campaign_price": "84900000.00",
      "campaign_start_at": "2025-03-01T00:00:00.000Z",
      "campaign_end_at": "2025-03-15T23:59:59.000Z",
      "stock": 50,
      "is_active": true,
      "created_at": "2025-01-15T10:00:00.000Z",
      "updated_at": "2025-01-15T10:00:00.000Z"
    },
    "variants": [
      {
        "id": "1a2b3c4d-5e6f-7890-1234-567890abcdef",
        "product_id": "f1e2d3c4-b5a6-7890-fedc-ba0987654321",
        "sku": "RT-IP15PM-256-NAT",
        "stock": 20,
        "price_modifier": "0.00",
        "created_at": "2025-01-15T10:00:00.000Z",
        "updated_at": "2025-01-15T10:00:00.000Z"
      },
      {
        "id": "2b3c4d5e-6f7a-8901-2345-678901bcdef0",
        "product_id": "f1e2d3c4-b5a6-7890-fedc-ba0987654321",
        "sku": "RT-IP15PM-512-BLK",
        "stock": 15,
        "price_modifier": "5000000.00",
        "created_at": "2025-01-15T10:00:00.000Z",
        "updated_at": "2025-01-15T10:00:00.000Z"
      }
    ]
  }
}
```

---

### List Products

**Endpoint:** `GET /api/v1/products`

**Scope:** `products:read`

#### Query Parameters

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | integer | 1 | Page number (1-indexed) |
| `limit` | integer | 20 | Items per page (max: 100) |
| `isActive` | boolean | — | Filter by active/inactive status |
| `categoryId` | UUID | — | Filter by primary category |

#### Response — 200 OK

```json
{
  "data": [
    {
      "id": "f1e2d3c4-b5a6-7890-fedc-ba0987654321",
      "name": "iPhone 15 Pro Max",
      "slug": "iphone-15-pro-max",
      "...": "..."
    }
  ],
  "meta": {
    "total": 142,
    "page": 1,
    "limit": 20
  }
}
```

---

### Update Product

**Endpoint:** `PATCH /api/v1/products/:id`

**Scope:** `products:write`

#### Request Body (all fields optional)

```json
{
  "name": "iPhone 15 Pro Max - Updated",
  "basePrice": "87900000.00",
  "isActive": false,
  "stock": 45
}
```

#### Response — 200 OK

Returns the full updated product object.

---

### Delete Product (Soft)

**Endpoint:** `DELETE /api/v1/products/:id`

**Scope:** `products:write`

Sets `is_active = false`. Does not permanently remove data.

#### Response — 204 No Content

---

## Admin: Rate Limit Management

### List Rate Limit Rules

**Endpoint:** `GET /admin/rate-limits`

**Scope:** `admin:rate-limits`

**Query:** `?feature=ai:text` (optional filter)

#### Response — 200 OK

```json
{
  "data": [
    {
      "id": "uuid",
      "userId": null,
      "feature": "ai:text",
      "maxRequests": 20,
      "windowSeconds": 3600,
      "isActive": true,
      "createdAt": "2025-01-15T10:00:00.000Z",
      "updatedAt": "2025-01-15T10:00:00.000Z"
    }
  ]
}
```

### Create Rate Limit Rule

**Endpoint:** `POST /admin/rate-limits`

**Scope:** `admin:rate-limits`

```json
{
  "userId": "uuid-or-null",
  "feature": "ai:voice",
  "maxRequests": 10,
  "windowSeconds": 3600
}
```

### Update Rate Limit Rule

**Endpoint:** `PATCH /admin/rate-limits/:id`

**Scope:** `admin:rate-limits`

```json
{
  "maxRequests": 50,
  "windowSeconds": 7200,
  "isActive": true
}
```

### Delete Rate Limit Rule

**Endpoint:** `DELETE /admin/rate-limits/:id`

**Scope:** `admin:rate-limits`

**Response:** 204 No Content

---

## Error Response Format

All errors follow a consistent sanitized structure. Database internals (table names, column names, SQL queries, stack traces) are never exposed.

```json
{
  "statusCode": 500,
  "message": "An unexpected error occurred while processing your request",
  "messageFa": "خطای داخلی سرور رخ داده است",
  "error": "INTERNAL_SERVER_ERROR",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "path": "/api/v1/products"
}
```

### Status Code Mapping

| Code | English | Persian |
|------|---------|---------|
| 400 | Bad Request | درخواست نامعتبر است |
| 401 | Unauthorized | احراز هویت الزامی است |
| 403 | Forbidden | دسترسی به این منبع مجاز نیست |
| 404 | Not Found | منبع مورد نظر یافت نشد |
| 409 | Conflict | تداخل در داده‌ها رخ داده است |
| 422 | Unprocessable Entity | داده‌های ارسالی قابل پردازش نیستند |
| 429 | Too Many Requests | تعداد درخواست‌ها بیش از حد مجاز است |
| 500 | Internal Server Error | خطای داخلی سرور رخ داده است |
| 503 | Service Unavailable | سرویس موقتاً در دسترس نیست |

---

## Multi-Tier Pricing Model

Products support multiple pricing tiers for different sales channels and conditions:

| Field | Usage |
|-------|-------|
| `base_price` | Standard retail price displayed to customers |
| `wholesale_price` | Price for wholesale/bulk buyers |
| `torob_price` | Price published to Torob price comparison engine |
| `discounted_price` | Permanent markdown (replaces base_price in display) |
| `campaign_price` | Time-limited flash sale price (active between `campaign_start_at` and `campaign_end_at`) |

**Price precedence in storefront display:**
1. If within campaign window → `campaign_price`
2. Else if `discounted_price` is set → `discounted_price`
3. Else → `base_price`

---

## Secondary Category Bindings

Products have one `primary_category_id` (required) and can be linked to multiple secondary categories via the `product_secondary_categories` junction table.

This enables cross-listing: a phone case can appear under both "Phone Accessories" (primary) and "Cases & Covers" + "iPhone Accessories" (secondary).

Pass `secondaryCategoryIds: [uuid, uuid, ...]` during product creation to establish these bindings atomically.


---

## Content & Media Matrix

### Media Upload

Upload and process media assets. Images are automatically converted to WebP format and scaled to a maximum width of 1200px (preserving aspect ratio).

**Endpoint:** `POST /api/v1/media/upload`

**Scope:** `content:write`

**Content-Type:** `multipart/form-data`

#### Request (Multipart Form-Data)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | binary | Yes | The file to upload (max 50MB) |
| `storageProvider` | string | No | Storage target: `"s3"` (default) or `"local"` |

#### cURL Example

```bash
curl -X POST https://api.rayantech.ir/api/v1/media/upload \
  -H "Authorization: Bearer rt_tok_your_token_here" \
  -F "file=@product-image.jpg" \
  -F "storageProvider=s3"
```

#### Response — 201 Created

```json
{
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "url": "https://cdn.rayantech.ir/media/a1b2c3d4.webp",
    "webpUrl": "https://cdn.rayantech.ir/media/a1b2c3d4.webp",
    "mimeType": "image/webp",
    "fileSize": 87542,
    "storageProvider": "s3",
    "createdAt": "2025-01-15T10:00:00.000Z"
  }
}
```

#### Processing Invariants

| Rule | Detail |
|------|--------|
| Format conversion | All images → `.webp` |
| Max width | 1200px (aspect ratio preserved) |
| Upscaling | Never — images smaller than 1200px remain unchanged |
| Quality | WebP quality 82 (visual/size balance) |
| Non-images | Stored as-is without processing (video, PDF, etc.) |

#### Error — 422 Processing Timeout

```json
{
  "statusCode": 422,
  "message": "The uploaded file could not be processed",
  "messageFa": "داده‌های ارسالی قابل پردازش نیستند",
  "error": "UNPROCESSABLE_ENTITY",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "path": "/api/v1/media/upload"
}
```

#### Error — 400 Empty File

```json
{
  "statusCode": 400,
  "message": "Empty file received",
  "messageFa": "درخواست نامعتبر است",
  "error": "BAD_REQUEST",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "path": "/api/v1/media/upload"
}
```

---

### Shoppable Stories

Full-screen immersive visual nodes with optional product tagging and rigid 24-hour expiration.

#### Create Story

**Endpoint:** `POST /api/v1/stories`

**Scope:** `content:write`

##### Request Body

```json
{
  "title": "عرضه ویژه آیفون ۱۵ پرو",
  "mediaUrl": "https://cdn.rayantech.ir/media/story-video-abc.webp",
  "productId": "f1e2d3c4-b5a6-7890-fedc-ba0987654321"
}
```

##### Field Reference

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Story title/caption (max 255 chars) |
| `mediaUrl` | string | Yes | URL of the media asset (image or video) |
| `productId` | UUID | No | Product UUID for shoppable tag linkage |

> **Note:** The `productId` linkage is fully isolated from the `product_media` gallery index. Stories maintain their own separate product reference.

##### Response — 201 Created

```json
{
  "data": {
    "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    "title": "عرضه ویژه آیفون ۱۵ پرو",
    "mediaUrl": "https://cdn.rayantech.ir/media/story-video-abc.webp",
    "productId": "f1e2d3c4-b5a6-7890-fedc-ba0987654321",
    "isActive": true,
    "createdAt": "2025-01-15T10:00:00.000Z",
    "expiresAt": "2025-01-16T10:00:00.000Z"
  }
}
```

##### Expiration Invariant

Stories automatically expire exactly 24 hours after creation. The `expires_at` column is set by the database default: `NOW() + interval '24 hours'`.

#### Get Active Stories (Public)

**Endpoint:** `GET /api/v1/stories/active`

**Authentication:** None required (public endpoint)

Returns only stories where:
- `is_active = true`
- `expires_at > NOW()` (strict — expired stories are never returned)

##### Response — 200 OK

```json
{
  "data": [
    {
      "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
      "title": "عرضه ویژه آیفون ۱۵ پرو",
      "mediaUrl": "https://cdn.rayantech.ir/media/story-video-abc.webp",
      "productId": "f1e2d3c4-b5a6-7890-fedc-ba0987654321",
      "isActive": true,
      "createdAt": "2025-01-15T10:00:00.000Z",
      "expiresAt": "2025-01-16T10:00:00.000Z"
    }
  ]
}
```

#### Delete Story (Soft)

**Endpoint:** `DELETE /api/v1/stories/:id`

**Scope:** `content:write`

**Response:** 204 No Content

---

### Blog Posts

Technical blog and editorial content management with SEO support.

#### List Published Posts (Public)

**Endpoint:** `GET /api/v1/blog/posts`

**Authentication:** None required (public endpoint)

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | integer | 1 | Page number |
| `limit` | integer | 10 | Items per page (max: 50) |

##### Response — 200 OK

```json
{
  "data": [
    {
      "id": "uuid",
      "title": "راهنمای انتخاب گوشی هوشمند",
      "slug": "smartphone-buying-guide",
      "content": "...",
      "excerpt": "خلاصه‌ای از مقاله...",
      "authorId": "uuid",
      "coverImageUrl": "https://cdn.rayantech.ir/media/cover.webp",
      "seoMetadata": {
        "metaTitle": "راهنمای خرید گوشی",
        "metaDescription": "بهترین گوشی‌ها...",
        "keywords": ["گوشی", "خرید", "مقایسه"]
      },
      "isPublished": true,
      "publishedAt": "2025-01-15T10:00:00.000Z",
      "createdAt": "2025-01-14T08:00:00.000Z",
      "updatedAt": "2025-01-15T10:00:00.000Z"
    }
  ],
  "meta": {
    "total": 25,
    "page": 1,
    "limit": 10
  }
}
```

#### Get Post by Slug (Public)

**Endpoint:** `GET /api/v1/blog/posts/:slug`

**Authentication:** None required

Returns only published posts. Returns 404 if slug doesn't exist or post is unpublished.

#### Create Blog Post

**Endpoint:** `POST /api/v1/blog/posts`

**Scope:** `content:write`

##### Request Body

```json
{
  "title": "راهنمای انتخاب گوشی هوشمند",
  "slug": "smartphone-buying-guide",
  "content": "# محتوای کامل مقاله\n\nمتن مقاله با فرمت Markdown...",
  "excerpt": "خلاصه‌ای از مقاله برای نمایش در لیست",
  "authorId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "coverImageUrl": "https://cdn.rayantech.ir/media/cover.webp",
  "seoMetadata": {
    "metaTitle": "راهنمای خرید گوشی | رایان تک",
    "metaDescription": "بهترین گوشی‌های ۲۰۲۵ را مقایسه کنید",
    "keywords": ["گوشی", "خرید", "مقایسه", "رایان تک"]
  },
  "isPublished": true
}
```

##### Field Reference

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Post title (max 512 chars) |
| `slug` | string | Yes | URL-safe unique slug |
| `content` | string | Yes | Full post content (Markdown/HTML) |
| `excerpt` | string | No | Short preview for listings |
| `authorId` | UUID | Yes | Author user ID |
| `coverImageUrl` | string | No | Cover image URL |
| `seoMetadata` | object | No | SEO fields (see below) |
| `isPublished` | boolean | No | Publish immediately (default: false) |

##### SEO Metadata Object

| Field | Type | Description |
|-------|------|-------------|
| `metaTitle` | string | HTML meta title tag |
| `metaDescription` | string | HTML meta description |
| `keywords` | string[] | SEO keyword array |

#### Update Blog Post

**Endpoint:** `PATCH /api/v1/blog/posts/:id`

**Scope:** `content:write`

All fields are optional. Setting `isPublished: true` on a draft will automatically set `published_at` to the current timestamp.

---

### Content Error Responses

All content/media endpoints return sanitized error responses. Database internals, Sharp processing errors, and S3 connection failures are never exposed to clients.

#### Asset Processing Error

```json
{
  "statusCode": 422,
  "message": "The uploaded file could not be processed",
  "messageFa": "داده‌های ارسالی قابل پردازش نیستند",
  "error": "UNPROCESSABLE_ENTITY",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "path": "/api/v1/media/upload"
}
```

#### Duplicate Slug (Blog)

```json
{
  "statusCode": 409,
  "message": "A resource with the given identifier already exists",
  "messageFa": "تداخل در داده‌ها رخ داده است",
  "error": "CONFLICT",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "path": "/api/v1/blog/posts"
}
```

#### Story Not Found

```json
{
  "statusCode": 404,
  "message": "Story not found",
  "messageFa": "منبع مورد نظر یافت نشد",
  "error": "NOT_FOUND",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "path": "/api/v1/stories/invalid-uuid"
}
```


---

## Checkout Protocols & Transaction Ledger

### Initialize Checkout

Creates an order with server-side pricing, freezes the cart state into an immutable JSONB snapshot, allocates 20-minute inventory reservations, and decrements stock atomically.

**Endpoint:** `POST /api/v1/orders/checkout`

**Scope:** `orders:write`

#### Anti-Tampering Invariants

| Rule | Enforcement |
|------|-------------|
| Client sends only IDs + quantities | No prices, discounts, or totals accepted from client |
| Server-side pricing | All prices resolved from DB (campaign → discounted → wholesale → base) |
| Immutable cart freeze | Calculated values written to `cart_snapshots.snapshot_data` JSONB |
| Atomic transaction | Order + snapshot + reservations + stock decrement in single `db.transaction()` |
| Reservation TTL | Exactly 20 minutes from creation (`expires_at = NOW() + 20min`) |

#### Request Body

```json
{
  "items": [
    { "variantId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890", "quantity": 2 },
    { "variantId": "b2c3d4e5-f6a7-8901-bcde-f12345678901", "quantity": 1 }
  ],
  "shippingAddress": "تهران، خیابان ولیعصر، پلاک ۱۲۳",
  "notes": "لطفاً قبل از ارسال تماس بگیرید"
}
```

#### Field Reference

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `items` | object[] | Yes | Array of checkout items (see below) |
| `items[].variantId` | UUID | Yes | Product variant (SKU) ID |
| `items[].quantity` | integer | Yes | Quantity to purchase (≥ 1) |
| `shippingAddress` | string | No | Delivery address |
| `notes` | string | No | Order notes |

> **Important:** Do NOT send prices, discounts, or totals. The server computes all pricing exclusively from database records. Any client-provided pricing fields are ignored.

#### cURL Example

```bash
curl -X POST https://api.rayantech.ir/api/v1/orders/checkout \
  -H "Authorization: Bearer rt_tok_your_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      { "variantId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890", "quantity": 2 }
    ],
    "shippingAddress": "تهران، میدان ونک"
  }'
```

#### Response — 201 Created

```json
{
  "data": {
    "orderId": "f1e2d3c4-b5a6-7890-fedc-ba0987654321",
    "snapshotId": "c3d4e5f6-a7b8-9012-cdef-123456789012",
    "totalAmount": "179800000.00",
    "discountAmount": "0.00",
    "items": [
      {
        "productId": "d4e5f6a7-b8c9-0123-defa-234567890123",
        "variantId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "sku": "RT-IP15PM-256-NAT",
        "quantity": 2,
        "unitPrice": "89900000.00",
        "totalPrice": "179800000.00"
      }
    ],
    "reservationExpiresAt": "2025-01-15T10:20:00.000Z"
  }
}
```

#### Cart Snapshot JSONB Structure

The `cart_snapshots.snapshot_data` column stores an immutable record:

```json
{
  "items": [
    {
      "productId": "uuid",
      "variantId": "uuid",
      "quantity": 2,
      "unitPrice": "89900000.00",
      "totalPrice": "179800000.00"
    }
  ],
  "totalAmount": "179800000.00",
  "discountAmount": "0.00"
}
```

This snapshot is created inside the same atomic transaction as the order — it cannot be modified after creation and serves as the auditable source of truth for pricing at the moment of purchase.

---

### Inventory Reservation Lifecycle

```
[Checkout Initiated]
       │
       ▼
┌─────────────────────────┐
│ product_reservations    │
│ status = 'pending'      │
│ expires_at = NOW()+20m  │
│ stock -= quantity       │
└─────────────────────────┘
       │
       ├─── Payment received within 20min ──► status = 'completed'
       │
       └─── 20 minutes elapsed (no payment) ──► Cron flips to 'expired'
                                                  stock += quantity (restored)
```

#### Reservation Expiration Error

When a user attempts to pay after their reservation has expired:

```json
{
  "statusCode": 409,
  "message": "Order is not in a payable state (current: cancelled)",
  "messageFa": "تداخل در داده‌ها رخ داده است",
  "error": "CONFLICT",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "path": "/api/v1/payments/callback"
}
```

#### Insufficient Stock Error

When concurrent checkouts deplete a variant's available stock:

```json
{
  "statusCode": 409,
  "message": "Insufficient stock for variant RT-IP15PM-256-NAT — concurrent reservation conflict",
  "messageFa": "تداخل در داده‌ها رخ داده است",
  "error": "CONFLICT",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "path": "/api/v1/orders/checkout"
}
```

---

### Payment Gateway Webhook

Processes backend-to-backend payment confirmations from Zarinpal/Digipay gateways.

**Endpoint:** `POST /api/v1/payments/callback`

**Authentication:** None (public endpoint — gateways authenticate via payload signatures)

#### Security Invariants

| Rule | Enforcement |
|------|-------------|
| No client-redirect trust | Order state NEVER mutates from redirect parameters |
| Backend-to-backend only | Only gateway webhook payloads trigger state transitions |
| Idempotency key | `payment_ref_id` unique index prevents duplicate processing |
| Amount verification | Payment amount must match order total (±0.01 tolerance) |

#### Request Body (from Gateway)

```json
{
  "orderId": "f1e2d3c4-b5a6-7890-fedc-ba0987654321",
  "method": "zarinpal",
  "amount": "179800000.00",
  "paymentRefId": "ZP-100200300400500",
  "gatewayResponse": {
    "authority": "A00000000000000000000000000123456",
    "status": 100,
    "ref_id": "ZP-100200300400500"
  }
}
```

#### Field Reference

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `orderId` | UUID | Yes | Order being paid |
| `method` | enum | Yes | `zarinpal`, `digipay_credit`, `cash_on_delivery` |
| `amount` | decimal string | Yes | Payment amount (must match order total) |
| `paymentRefId` | string | Yes | Gateway-issued unique reference (idempotency key) |
| `gatewayResponse` | object | No | Raw gateway payload for audit logging |

#### Response — 200 OK

```json
{
  "data": {
    "id": "e5f6a7b8-c9d0-1234-efab-345678901234",
    "orderId": "f1e2d3c4-b5a6-7890-fedc-ba0987654321",
    "method": "zarinpal",
    "status": "completed",
    "amount": "179800000.00",
    "paymentRefId": "ZP-100200300400500",
    "paidAt": "2025-01-15T10:05:00.000Z",
    "createdAt": "2025-01-15T10:05:00.000Z"
  }
}
```

#### Error — 409 Duplicate Callback

```json
{
  "statusCode": 409,
  "message": "This payment has already been processed (duplicate callback)",
  "messageFa": "تداخل در داده‌ها رخ داده است",
  "error": "CONFLICT",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "path": "/api/v1/payments/callback"
}
```

#### Error — 400 Amount Mismatch

```json
{
  "statusCode": 400,
  "message": "Payment amount does not match order total",
  "messageFa": "درخواست نامعتبر است",
  "error": "BAD_REQUEST",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "path": "/api/v1/payments/callback"
}
```

---

### Pricing Resolution Priority

The server applies the following price hierarchy when computing line item unit prices during checkout:

| Priority | Condition | Price Used |
|----------|-----------|------------|
| 1 | Active campaign (within date window) | `campaign_price` + variant `price_modifier` |
| 2 | Permanent discount set | `discounted_price` + variant `price_modifier` |
| 3 | User has wholesale group + wholesale_price set | `wholesale_price` + variant `price_modifier` |
| 4 | User has wholesale group (markdown %) | `base_price × (1 - markdown%)` + variant `price_modifier` |
| 5 | Default | `base_price` + variant `price_modifier` |


---

## Phase 3 — Conversational AI Hub & Firewall Rate Rules

### WebSocket Connection

The Voice AI engine operates over a persistent duplex WebSocket connection using socket.io.

**Namespace:** `/voice-ai`

**Transport:** WebSocket (with polling fallback)

**URL:** `wss://api.rayantech.ir/voice-ai?token=rt_tok_your_token_here`

#### Handshake Authentication

Authentication is performed during the WebSocket handshake via the `token` query parameter. Connections without a valid `rt_tok_` prefixed token are rejected immediately.

```javascript
// Client connection example (socket.io-client)
import { io } from "socket.io-client";

const socket = io("wss://api.rayantech.ir/voice-ai", {
  transports: ["websocket"],
  query: {
    token: "rt_tok_your_api_token_here"
  }
});
```

#### Handshake Rejection (401)

```json
{
  "statusCode": 401,
  "message": "Authentication required",
  "messageFa": "احراز هویت الزامی است"
}
```

---

### Redis IP Firewall — Rate Limiting

All Voice AI messages are protected by a distributed Redis sliding-window rate limiter.

#### Rate Limit Configuration

| Parameter | Value |
|-----------|-------|
| Key format | `rate:voice:{client_ip_address}` |
| Algorithm | Sorted-set sliding window (Lua atomic script) |
| Limit | 10 requests per 60 seconds per IP |
| Action on exceed | Drop pipeline, emit 429 error, block further LLM compute |

#### 429 Rate Limit Exceeded Event

When the client exceeds 10 messages per minute, the server emits an `error` event and blocks the message from reaching the AI pipeline:

```json
{
  "statusCode": 429,
  "message": "Voice AI rate limit exceeded",
  "messageFa": "تعداد درخواست‌های شما بیش از حد مجاز است. لطفاً یک دقیقه صبر کنید.",
  "retryAfterSeconds": 60
}
```

---

### Message Protocol

#### Client → Server Events

| Event | Payload | Description |
|-------|---------|-------------|
| `message` | `{ text: string, sessionId?: string }` | Send a text query to the AI assistant |

##### Message Payload Schema

```json
{
  "text": "آیا آیفون ۱۵ پرو مکس ۲۵۶ گیگ دارید؟",
  "sessionId": "optional-session-uuid"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `text` | string | Yes | User query (from STT transcription or direct text) |
| `sessionId` | string | No | Conversation session ID for context continuity |

#### Server → Client Events

| Event | Payload | Description |
|-------|---------|-------------|
| `response:chunk` | `{ chunk: string, sessionId: string }` | Streaming text chunk (real-time) |
| `response` | `{ text: string, products: object[], sessionId: string }` | Full assembled response |
| `response:end` | `{ sessionId: string }` | Signals stream completion |
| `error` | `{ statusCode: number, message: string, messageFa: string }` | Error notification |

##### Streaming Response Chunk

```json
{
  "chunk": "بله، آیفون ۱۵ پرو مکس ۲۵۶ گیگ ",
  "sessionId": "abc123"
}
```

##### Final Response (with matched products)

```json
{
  "text": "بله، آیفون ۱۵ پرو مکس ۲۵۶ گیگابایت در انبار ما موجود است. قیمت این محصول ۸۹,۹۰۰,۰۰۰ تومان می‌باشد.",
  "products": [
    {
      "id": "f1e2d3c4-b5a6-7890-fedc-ba0987654321",
      "name": "iPhone 15 Pro Max 256GB",
      "price": "89900000.00"
    }
  ],
  "sessionId": "abc123"
}
```

---

### RAG Pipeline (Retrieval-Augmented Generation)

The AI assistant uses a pgvector-powered semantic search pipeline to ground responses strictly in real product data.

#### Pipeline Flow

```
[User Query]
     │
     ▼
┌─────────────────────────────┐
│ OpenAI text-embedding-3-small │
│ → 1536-dimensional vector    │
└─────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────┐
│ PostgreSQL pgvector cosine search        │
│ SELECT ... ORDER BY embedding <=> $1     │
│ WHERE is_active = true                   │
│ LIMIT 5                                  │
└─────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────┐
│ Grounded LLM Response (GPT-4o-mini)      │
│ System prompt: ONLY reference matched    │
│ products. No fabrication allowed.        │
└─────────────────────────────────────────┘
     │
     ▼
[Streamed Response to Client]
```

#### Vector Search Parameters

| Parameter | Value |
|-----------|-------|
| Embedding model | `text-embedding-3-small` |
| Dimensions | 1536 |
| Distance operator | `<=>` (cosine) |
| Max results | 5 |
| Index column | `products.embedding` |
| Filters | `is_active = true`, `embedding IS NOT NULL` |

#### Hallucination Sandboxing Rules

The system prompt enforces strict factual grounding:

1. AI may ONLY reference products returned by the pgvector search
2. Fabricating device models, specs, prices, or grades is prohibited
3. No internal business margins or wholesale prices are disclosed
4. No binding financial promises about pricing are made

#### Zero-Match Fallback Response

When no products match the query embedding:

```json
{
  "text": "متأسفانه کالای منطبقی با مشخصات درخواستی شما در انبار رایان تک یافت نشد.",
  "products": [],
  "sessionId": "abc123"
}
```

---

### Resource Disposal

When a WebSocket connection terminates (client disconnect, network failure, or server-initiated close):

1. All in-flight OpenAI API streaming requests are immediately aborted via `AbortController.abort()`
2. Session references are removed from the active sessions map
3. No orphaned promises or buffer allocations persist in memory

This prevents memory leak degradation under high connection churn.

---

### Error Events Summary

| Event | Code | Message (Persian) |
|-------|------|-------------------|
| Auth failed | 401 | احراز هویت الزامی است |
| Rate limited | 429 | تعداد درخواست‌های شما بیش از حد مجاز است. لطفاً یک دقیقه صبر کنید. |
| Empty message | 400 | پیام خالی است |
| Processing error | 500 | خطایی در پردازش درخواست شما رخ داده است |


---

## Voice AI Growth Pipeline — Session Migration & Tiered Access

### Tiered Rate Limiting

The Voice AI engine enforces different compute budgets based on authentication status:

| Tier | Key Pattern | Limit | Algorithm | TTL |
|------|-------------|-------|-----------|-----|
| Authenticated | `rate:voice:{ip_address}` | 10 messages / 60 seconds | Sorted-set sliding window | 60s |
| Guest | `rate:voice:guest:{guest_session_id}` | 3 messages TOTAL (lifetime) | INCR hard cap | 30 days |

#### Guest Limit Exhausted Event

When a guest reaches their 3-message lifetime cap, the server emits a structured marketing trigger:

**Event name:** `limit_exhausted`

```json
{
  "status": "LIMIT_EXHAUSTED",
  "action": "REQUIRE_AUTHENTICATION",
  "message": "برای ادامه مشاوره تخصصی صوتی و متنی، لطفاً وارد حساب خود شوید تا تاریخچه گفتگو نیز ذخیره شود."
}
```

The frontend should display a registration/login modal when this event is received.

---

### Dual Modality — Text & Audio Messages

The WebSocket gateway accepts both text and audio payloads:

#### Text Message

```json
{
  "type": "text",
  "text": "آیا آیفون ۱۵ پرو مکس موجود است؟",
  "sessionId": "optional-uuid"
}
```

#### Audio Message

```json
{
  "type": "audio",
  "buffer": "base64_encoded_audio_data_here",
  "sessionId": "optional-uuid"
}
```

Audio buffers are transcribed server-side via OpenAI Whisper (language: `fa`). The transcription result is emitted back to the client as a `transcript` event before RAG processing begins:

```json
{
  "text": "آیا آیفون ۱۵ پرو مکس موجود است؟",
  "sessionId": "abc123"
}
```

---

### Persian Text Normalization

All text inputs (direct text and STT transcripts) pass through normalization before embedding:

| Transformation | From | To |
|---------------|------|-----|
| Arabic Kaf | ك (U+0643) | ک (U+06A9) |
| Arabic Yeh | ي (U+064A) | ی (U+06CC) |
| Diacritics | \u064B-\u065F | Stripped |
| Whitespace | Multiple spaces/tabs | Single space |
| ZWNJ | Doubled | Single |

This ensures consistent vector similarity scores regardless of keyboard variant.

---

### Guest Connection

Guests connect without a token, passing a `guest_session_id` for tracking:

```javascript
const socket = io("wss://api.rayantech.ir/voice-ai", {
  transports: ["websocket"],
  query: {
    guest_session_id: "client-generated-uuid-stored-in-cookie"
  }
});
```

---

### Session Merge (Guest → Authenticated User)

After a guest authenticates or registers, the client triggers a session merge to re-parent the conversation history.

**Endpoint:** `POST /api/v1/voice-ai/session/merge`

**Scope:** `orders:write`

#### Request Body

```json
{
  "guestSessionId": "the-guest-session-uuid-from-cookie"
}
```

#### cURL Example

```bash
curl -X POST https://api.rayantech.ir/api/v1/voice-ai/session/merge \
  -H "Authorization: Bearer rt_tok_your_token_here" \
  -H "Content-Type: application/json" \
  -d '{ "guestSessionId": "abc123-def456-ghi789" }'
```

#### Response — 200 OK

```json
{
  "data": {
    "merged": true,
    "sessionCount": 1
  }
}
```

#### Transaction Invariants

1. Verifies `guest_session_id` exists with `user_id IS NULL`
2. Atomically sets `user_id` to the authenticated user
3. Deletes the Redis guest rate key (`rate:voice:guest:{id}`)
4. User now operates under the authenticated 10/min tier

#### Error — 404 No Sessions Found

```json
{
  "statusCode": 404,
  "message": "No unassigned guest sessions found with the provided ID",
  "messageFa": "منبع مورد نظر یافت نشد",
  "error": "NOT_FOUND",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "path": "/api/v1/voice-ai/session/merge"
}
```

---

### Marketing Event Schema

On session disconnect, a `marketing.ai_intent` event is dispatched containing:

```json
{
  "sessionId": "uuid",
  "guestSessionId": "uuid-or-null",
  "userId": "uuid-or-null",
  "disconnectedAt": "2025-01-15T10:30:00.000Z",
  "matchedProductIds": ["uuid1", "uuid2"],
  "intentTags": ["iphone", "premium"]
}
```

This data is persisted to `system_logs` for marketing automation, abandoned cart recovery, and customer segmentation pipelines.


---

## Phase 4 — Aggregator Architecture & Event Processing

### Torob Product Feed (Cursor-Based)

High-performance product extraction endpoint for the Torob price comparison crawler.

**Endpoint:** `GET /api/v1/torob/products`

**Authentication:** None (public endpoint for crawler access)

#### Pagination Invariant

Offset-based pagination is explicitly banned. This endpoint uses **cursor-based navigation** keyed on product UUID to prevent database connection timeouts under sustained crawler strain.

#### Query Parameters

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `cursor` | UUID | — | Product ID to start AFTER (exclusive). Omit for first page. |
| `limit` | integer | 50 | Items per page (max: 200) |

#### cURL Example

```bash
# First page
curl "https://api.rayantech.ir/api/v1/torob/products?limit=100"

# Next page (using cursor from previous response)
curl "https://api.rayantech.ir/api/v1/torob/products?limit=100&cursor=a1b2c3d4-e5f6-7890-abcd-ef1234567890"
```

#### Response — 200 OK

```json
{
  "data": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "name": "iPhone 15 Pro Max 256GB",
      "slug": "iphone-15-pro-max-256gb",
      "price": "88500000.00",
      "stock": 15,
      "grade": "stock",
      "updatedAt": "2025-01-15T10:00:00.000Z"
    }
  ],
  "meta": {
    "nextCursor": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    "count": 100
  }
}
```

#### Cursor Termination

When `meta.nextCursor` is `null`, the crawler has reached the end of the dataset. No more pages exist.

#### Price Priority

The `price` field in the feed response follows this resolution order:
1. `torob_price` (dedicated Torob listing price)
2. `discounted_price` (permanent markdown)
3. `base_price` (default retail)

---

### Torob Referral Session Tracking

When a user arrives from Torob (identified by `utm_source=torob` query parameter), a Redis-backed session is initialized.

#### Session Mechanics

| Property | Value |
|----------|-------|
| Trigger | `?utm_source=torob` on any URL |
| Redis key | `torob:session:{session_uuid}` |
| TTL | Exactly 1200 seconds (20 minutes) |
| Cookie | `torob_session` (httpOnly, sameSite=lax) |

#### Frontend Integration

When a valid Torob session exists, the backend attaches session metadata to the request:

```json
{
  "sessionId": "uuid",
  "isActive": true,
  "ttlSeconds": 847,
  "useTorbPrice": true
}
```

The frontend should:
1. Display the `torob_price` instead of `base_price` for products
2. Render a countdown timer based on `ttlSeconds`
3. After TTL expires, revert to normal pricing display

---

### Kafka Event Topics

Distributed event processing workers drain intensive operations away from the HTTP main thread.

#### Topic: `notification.sms`

Handles asynchronous OTP/SMS delivery dispatches.

**Message Payload:**

```json
{
  "mobile": "+989123456789",
  "message": "کد تأیید شما: 123456",
  "otpCode": "123456",
  "templateId": "otp_verify"
}
```

**Producer usage:**

```typescript
await kafkaProducer.send("notification.sms", userId, {
  mobile: "+989123456789",
  message: "کد تأیید شما: 123456",
  otpCode: "123456",
});
```

#### Topic: `catalog.mutation`

Triggers automatic embedding regeneration when products are created or updated.

**Message Payload:**

```json
{
  "productId": "uuid",
  "action": "created" | "updated" | "deleted",
  "fields": ["name", "description"]
}
```

**Consumer behavior:**
- `created` / `updated`: Fetches product → normalizes Persian text → generates 1536d embedding → updates pgvector column
- `deleted`: Nullifies the embedding column

**Producer usage (from ProductService on write operations):**

```typescript
await kafkaProducer.send("catalog.mutation", productId, {
  productId,
  action: "created",
});
```

---

### Phase 4 Error Responses

#### Torob Feed — Invalid Cursor

```json
{
  "statusCode": 400,
  "message": "The request contains invalid or missing data references",
  "messageFa": "درخواست نامعتبر است",
  "error": "BAD_REQUEST",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "path": "/api/v1/torob/products"
}
```

#### Kafka Consumer — Processing Failure (logged server-side only)

Kafka consumer failures are logged to the server console and acknowledged (no infinite retry). They never surface to HTTP clients since they operate in a completely decoupled background thread.

---

### Environment Configuration (Phase 4)

| Variable | Default | Description |
|----------|---------|-------------|
| `KAFKA_BROKERS` | `localhost:9092` | Comma-separated broker addresses |
| `KAFKA_CLIENT_ID` | `rayan-tech-backend` | Kafka client identifier |
| `KAFKA_GROUP_ID` | `rayan-tech-workers` | Consumer group name |
