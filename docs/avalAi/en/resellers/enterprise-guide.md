# Enterprise Usage Guide

This guide is designed for enterprises and large-scale API resellers who need advanced usage tracking, cost management, and operational insights for high-volume AvalAI API deployments.

## Table of Contents

- [Overview](#overview)
- [Enterprise Use Cases](#enterprise-use-cases)
- [High-Volume Cost Tracking](#high-volume-cost-tracking)
- [Multi-Tenant Architecture](#multi-tenant-architecture)
- [Advanced Analytics](#advanced-analytics)
- [Security Best Practices](#security-best-practices)
- [Performance Optimization](#performance-optimization)

---

## Overview

Enterprises using AvalAI API at scale have unique requirements:

- **High Volume**: Hundreds of thousands or millions of API calls daily
- **Multi-Tenant**: Multiple departments, customers, or projects
- **Cost Allocation**: Detailed cost tracking per business unit
- **Compliance**: Audit trails and data governance
- **Performance**: Minimal latency overhead for tracking
- **Analytics**: Business intelligence and usage insights

The User API (`/user/v1/`) provides the foundation for enterprise-scale operations.

---

## Enterprise Use Cases

### 1. Internal IT Service Provider

**Scenario**: Large corporation providing AI services to multiple business units

**Requirements**:
- Track usage per department
- Chargeback/showback reporting
- Budget alerts and controls
- Compliance audit trails

**Solution**:
```python
# Tag requests with department identifier
response = requests.post(
    "https://api.avalai.ir/v1/chat/completions",
    headers={"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"},
    json={
        "model": "gpt-5.5",
        "messages": messages,
        "safety_identifier": f"dept-{department_id}",  # Custom identifier in body
    },
)

# Later, filter transactions by department
transactions = get_transactions(safety_identifier=f"dept-{department_id}")
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version</summary>

Use this version when the selected model supports `/v1/responses`. `messages` moves to `input`, and the final text is read from `response.output_text`.

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["AVALAI_API_KEY"],
    base_url="https://api.avalai.ir/v1",
)

response = client.responses.create(
    model="gpt-5.5",
    instructions="You are a helpful assistant.",
    input="Write a one-sentence summary of AvalAI.",
)

print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


### 2. SaaS Platform Provider

**Scenario**: SaaS company embedding AI features for thousands of customers

**Requirements**:
- Per-customer usage tracking
- Real-time cost calculation
- Usage-based billing
- Rate limiting per customer

**Solution**:
```python
# Customer-specific API proxy
class CustomerAPIProxy:
    def __init__(self, customer_id):
        self.customer_id = customer_id
        self.api_key = get_api_key_for_customer(customer_id)

    async def chat_completion(self, **kwargs):
        # Check customer's quota
        if not await self.check_quota():
            raise QuotaExceededError()

        # Make request with customer tracking
        response = await make_api_request(**kwargs)
        request_id = response.headers.get("x-request-id")

        # Queue cost tracking
        await queue_cost_lookup(request_id, self.customer_id)

        return response.json()
```

> **Tip: Using OpenAI SDK**
> When using the OpenAI Python SDK instead of raw HTTP requests, you can retrieve the request ID more easily:
> ```python
> from openai import OpenAI
>
> client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")
> response = client.chat.completions.create(model="gpt-5.4-mini", messages=messages)
>
> # Access request_id directly from the response object
> request_id = response._request_id
> ```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version</summary>

Use this version when the selected model supports `/v1/responses`. `messages` moves to `input`, and the final text is read from `response.output_text`.

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["AVALAI_API_KEY"],
    base_url="https://api.avalai.ir/v1",
)

response = client.responses.create(
    model="gpt-5.4-mini",
    instructions="You are a helpful assistant.",
    input="Write a one-sentence summary of AvalAI.",
)

print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->

> This is the recommended approach when using the OpenAI SDK as it handles header parsing automatically.

> **Tip: Using LangChain**
> LangChain doesn't directly expose HTTP response headers. Use a custom HTTP client to capture them:
> ```python
> import httpx
> from langchain_openai import ChatOpenAI
> from langchain_core.callbacks import BaseCallbackHandler
> from contextvars import ContextVar
> import os
>
> request_headers: ContextVar[dict] = ContextVar('request_headers', default={})
>
> class HeaderCapturingClient(httpx.Client):
>     def send(self, request, **kwargs):
>         response = super().send(request, **kwargs)
>         request_headers.set(dict(response.headers))
>         return response
>
> class HeaderAccessCallback(BaseCallbackHandler):
>     def __init__(self):
>         self.request_id = None
>
>     def on_llm_end(self, response, **kwargs):
>         headers = request_headers.get()
>         self.request_id = headers.get('x-request-id')
>
> http_client = HeaderCapturingClient()
> chat = ChatOpenAI(
>     base_url="https://api.avalai.ir/v1",
>     api_key=os.getenv("AVALAI_API_KEY"),
>     model="gpt-5.4-mini",
>     http_client=http_client,
> )
>
> callback = HeaderAccessCallback()
> response = chat.invoke("Hello", config={"callbacks": [callback]})
> request_id = callback.request_id  # Now available for cost tracking
> ```
> See [Response Headers Guide](en/api-reference/response-headers.md#accessing-x-request-id-with-langchain) for async examples.

### 3. AI Services Reseller

**Scenario**: Company reselling AI API access with markup

**Requirements**:
- Precise cost tracking for billing
- Multiple pricing tiers
- Volume discounts
- Detailed invoicing

**Solution**: See [Reseller Cost Tracking Guide](en/resellers/cost-tracking-guide.md)

### 4. Research Organization

**Scenario**: University or research lab with multiple projects

**Requirements**:
- Grant-based cost allocation
- Per-project usage reports
- Researcher access controls
- Publication audit trails

**Solution**:
```python
# Project-based tracking
response = make_api_call(
    messages=messages,
    metadata={
        "project_id": "grant-12345",
        "researcher_id": "user-789",
        "experiment_id": "exp-2024-001",
    },
)

# Generate project reports
project_report = get_usage_summary(
    safety_identifier=f"project-{project_id}",
    start_date="2024-01-01",
    end_date="2024-12-31",
)
```

---

## High-Volume Cost Tracking

For enterprises processing millions of requests, efficient cost tracking is critical.

### Batch Processing Strategy

```python
import asyncio
from typing import List
from datetime import datetime, timedelta


class EnterpriseCostTracker:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://api.avalai.ir"
        self.pending_requests = []

    async def track_request(self, request_id: str, metadata: dict):
        """Queue a request for cost tracking"""
        self.pending_requests.append(
            {
                "request_id": request_id,
                "metadata": metadata,
                "queued_at": datetime.now(),
            }
        )

    async def process_batch(self, batch_size: int = 1000):
        """Process pending requests in batches"""
        while self.pending_requests:
            # Take up to 1000 requests
            batch = self.pending_requests[:batch_size]
            request_ids = [r["request_id"] for r in batch]

            # Lookup costs in batch
            response = await self.lookup_costs(request_ids)

            # Process results
            for transaction in response["transactions"]:
                request_id = transaction["id"]
                metadata = next(
                    r["metadata"] for r in batch if r["request_id"] == request_id
                )

                await self.record_cost(transaction, metadata)

            # Remove processed requests
            self.pending_requests = self.pending_requests[batch_size:]

    async def lookup_costs(self, request_ids: List[str]):
        """Lookup costs for multiple requests"""
        response = await asyncio.get_event_loop().run_in_executor(
            None,
            lambda: requests.post(
                f"{self.base_url}/user/v1/transactions/lookup",
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json",
                },
                json={"transaction_ids": request_ids},
            ),
        )
        return response.json()

    async def record_cost(self, transaction: dict, metadata: dict):
        """Record cost in your database"""
        cost_usd = float(transaction["cost"]["unit"])
        cost_irt = float(transaction["cost"]["paid_irt"]) + float(
            transaction["cost"]["paid_grant_irt"]
        )

        # Store in your database with metadata
        await db.insert_cost_record(
            {
                "request_id": transaction["id"],
                "customer_id": metadata.get("customer_id"),
                "department_id": metadata.get("department_id"),
                "project_id": metadata.get("project_id"),
                "cost_usd": cost_usd,
                "cost_irt": cost_irt,
                "model": transaction["model"],
                "tokens": transaction["tokens"],
                "timestamp": transaction["requested_at"],
            }
        )


# Usage
tracker = EnterpriseCostTracker(api_key)

# Track requests as they come in
await tracker.track_request(
    request_id,
    {"customer_id": "cust_123", "department_id": "eng", "project_id": "proj_456"},
)

# Process in background every minute
while True:
    await tracker.process_batch(batch_size=1000)
    await asyncio.sleep(60)
```

### Scheduled Batch Jobs

For very high volume, process costs on a schedule:

```python
# Cron job: Run every 5 minutes
def process_pending_costs():
    # Get all pending request IDs from last 5 minutes
    pending_ids = db.get_pending_request_ids(
        since=datetime.now() - timedelta(minutes=5)
    )

    # Process in batches of 1000
    for i in range(0, len(pending_ids), 1000):
        batch = pending_ids[i : i + 1000]

        response = requests.post(
            "https://api.avalai.ir/user/v1/transactions/lookup",
            json={"transaction_ids": batch},
        )

        # Update database with costs
        for transaction in response.json()["transactions"]:
            db.update_cost(transaction)
```

---

## Multi-Tenant Architecture

### Architecture Pattern

```
┌─────────────────────────────────────────────────────┐
│                   Load Balancer                      │
└──────────────────────┬──────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
   ┌────▼────┐    ┌───▼────┐    ┌───▼────┐
   │  API    │    │  API   │    │  API   │
   │ Server 1│    │Server 2│    │Server 3│
   └────┬────┘    └───┬────┘    └───┬────┘
        │             │              │
        └──────────────┼──────────────┘
                       │
        ┌──────────────▼──────────────┐
        │    Request Tracking Queue    │
        │        (Redis/Kafka)         │
        └──────────────┬──────────────┘
                       │
        ┌──────────────▼──────────────┐
        │     Cost Processing          │
        │      Workers (Async)         │
        └──────────────┬──────────────┘
                       │
        ┌──────────────▼──────────────┐
        │      Database                │
        │   (PostgreSQL/MongoDB)       │
        └──────────────────────────────┘
```

### Database Schema Example

```sql
-- Customers/Tenants table
CREATE TABLE customers (
    id UUID PRIMARY KEY,
    name VARCHAR(255),
    api_key_id INTEGER,
    pricing_tier VARCHAR(50),
    created_at TIMESTAMP
);

-- Request tracking table
CREATE TABLE api_requests (
    request_id UUID PRIMARY KEY,
    customer_id UUID REFERENCES customers(id),
    model VARCHAR(100),
    requested_at TIMESTAMP,
    cost_usd DECIMAL(12, 8),
    cost_irt DECIMAL(12, 2),
    tokens_total INTEGER,
    tokens_prompt INTEGER,
    tokens_completion INTEGER,
    status VARCHAR(50),
    metadata JSONB
);

-- Indexes for performance
CREATE INDEX idx_requests_customer ON api_requests(customer_id);
CREATE INDEX idx_requests_timestamp ON api_requests(requested_at);
CREATE INDEX idx_requests_status ON api_requests(status);

-- Usage summary materialized view
CREATE MATERIALIZED VIEW daily_usage_summary AS
SELECT 
    customer_id,
    DATE(requested_at) as usage_date,
    COUNT(*) as request_count,
    SUM(cost_usd) as total_cost_usd,
    SUM(cost_irt) as total_cost_irt,
    SUM(tokens_total) as total_tokens
FROM api_requests
WHERE status = 'completed'
GROUP BY customer_id, DATE(requested_at);

-- Refresh materialized view periodically
REFRESH MATERIALIZED VIEW CONCURRENTLY daily_usage_summary;
```

---

## Advanced Analytics

### Real-Time Usage Dashboard

```python
from fastapi import FastAPI
from datetime import datetime, timedelta

app = FastAPI()


@app.get("/analytics/realtime/{customer_id}")
async def get_realtime_analytics(customer_id: str):
    """Real-time usage analytics for a customer"""
    now = datetime.now()

    # Last hour stats
    hour_stats = await db.query(
        """
        SELECT 
            COUNT(*) as requests,
            SUM(cost_usd) as cost,
            SUM(tokens_total) as tokens,
            AVG(tokens_total) as avg_tokens_per_request
        FROM api_requests
        WHERE customer_id = $1
        AND requested_at >= $2
    """,
        customer_id,
        now - timedelta(hours=1),
    )

    # Model distribution
    model_dist = await db.query(
        """
        SELECT 
            model,
            COUNT(*) as count,
            SUM(cost_usd) as cost
        FROM api_requests
        WHERE customer_id = $1
        AND requested_at >= $2
        GROUP BY model
        ORDER BY count DESC
    """,
        customer_id,
        now - timedelta(hours=24),
    )

    # Cost trend (last 7 days)
    cost_trend = await db.query(
        """
        SELECT 
            DATE(requested_at) as date,
            SUM(cost_usd) as daily_cost
        FROM api_requests
        WHERE customer_id = $1
        AND requested_at >= $2
        GROUP BY DATE(requested_at)
        ORDER BY date
    """,
        customer_id,
        now - timedelta(days=7),
    )

    return {
        "customer_id": customer_id,
        "last_hour": hour_stats,
        "model_distribution": model_dist,
        "cost_trend": cost_trend,
    }
```

### Business Intelligence Integration

```python
# Export to data warehouse (e.g., Snowflake, BigQuery)
def export_to_datawarehouse():
    """Daily export of usage data to data warehouse"""
    yesterday = datetime.now() - timedelta(days=1)

    # Get all completed transactions from yesterday
    transactions = db.query(
        """
        SELECT 
            request_id,
            customer_id,
            model,
            requested_at,
            cost_usd,
            cost_irt,
            tokens_total,
            tokens_prompt,
            tokens_completion,
            metadata
        FROM api_requests
        WHERE DATE(requested_at) = $1
        AND status = 'completed'
    """,
        yesterday.date(),
    )

    # Transform and load to warehouse
    datawarehouse.bulk_insert("ai_usage_fact", transactions)
```

---

## Security Best Practices

### API Key Management

```python
# Separate API keys per customer/tenant
class APIKeyManager:
    def __init__(self):
        self.key_store = {}  # Use proper secrets management

    def create_customer_key(self, customer_id: str) -> str:
        """Create dedicated API key for customer"""
        # Use your AvalAI master key internally
        # Create tracking record
        key_id = self.register_key(customer_id)
        return f"customer_{customer_id}_key_{key_id}"

    def get_avalai_key(self, customer_key: str) -> str:
        """Map customer key to your AvalAI master key"""
        # Validate customer key
        if not self.validate_key(customer_key):
            raise UnauthorizedError()

        # Return your master AvalAI key
        return os.getenv("AVALAI_MASTER_API_KEY")
```

### Rate Limiting

```python
from redis import Redis
from datetime import datetime, timedelta


class EnterpriseRateLimiter:
    def __init__(self, redis_client: Redis):
        self.redis = redis_client

    async def check_limit(self, customer_id: str, limit_per_minute: int = 1000) -> bool:
        """Check if customer is within rate limits"""
        key = f"rate_limit:{customer_id}:{datetime.now().strftime('%Y%m%d%H%M')}"

        count = await self.redis.incr(key)
        if count == 1:
            await self.redis.expire(key, 60)

        return count <= limit_per_minute
```

---

## Performance Optimization

### Caching Strategy

```python
from functools import lru_cache
import redis


class CostCache:
    def __init__(self, redis_client: redis.Redis):
        self.redis = redis_client
        self.cache_ttl = 3600  # 1 hour

    async def get_cached_cost(self, request_id: str) -> dict:
        """Get cost from cache if available"""
        cached = await self.redis.get(f"cost:{request_id}")
        if cached:
            return json.loads(cached)
        return None

    async def cache_cost(self, request_id: str, cost_data: dict):
        """Cache cost data"""
        await self.redis.setex(
            f"cost:{request_id}", self.cache_ttl, json.dumps(cost_data)
        )
```

### Connection Pooling

```python
import aiohttp
from aiohttp import TCPConnector

# Reuse connections for better performance
connector = TCPConnector(limit=100, limit_per_host=30)
session = aiohttp.ClientSession(connector=connector)


async def make_api_request(**kwargs):
    """Make API request with connection pooling"""
    async with session.post(
        "https://api.avalai.ir/v1/chat/completions", **kwargs
    ) as response:
        return await response.json()
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version</summary>

Use this version when the selected model supports `/v1/responses`. `messages` moves to `input`, and the final text is read from `response.output_text`.

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["AVALAI_API_KEY"],
    base_url="https://api.avalai.ir/v1",
)

response = client.responses.create(
    model="gpt-5.5",
    instructions="You are a helpful assistant.",
    input="Write a one-sentence summary of AvalAI.",
)

print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


---

## Video Generation Tracking

For enterprises using video generation APIs (Sora, Veo, Runway), tracking is simplified with built-in `request_id` and `safety_identifier` support in the response body.

### Video API Response Fields

Unlike standard chat completions where `request_id` is only available in response headers, video API responses include tracking fields directly in the JSON body:

```python
import requests

# Create video with enterprise tracking
response = requests.post(
    "https://api.avalai.ir/v1/videos",
    headers={"Authorization": f"Bearer {API_KEY}"},
    json={
        "model": "sora-2",
        "prompt": "Product showcase video",
        "size": "1280x720",
        "seconds": "4",
        "safety_identifier": f"dept-{department_id}",  # Your internal identifier
    },
)

video = response.json()

# Access tracking fields directly from response body
print(f"Video ID: {video['id']}")
print(f"Request ID: {video['request_id']}")  # UUID v7 for cost tracking
print(f"Safety Identifier: {video.get('safety_identifier')}")
```

### Filtering Videos by Identifier

Enterprises can filter video lists by `safety_identifier` or `request_id`:

```python
# Get all videos for a specific department
department_videos = requests.get(
    "https://api.avalai.ir/v1/videos",
    headers={"Authorization": f"Bearer {API_KEY}"},
    params={"safety_identifier": f"dept-{department_id}"},
).json()

# Get a specific video by request_id
specific_video = requests.get(
    "https://api.avalai.ir/v1/videos",
    headers={"Authorization": f"Bearer {API_KEY}"},
    params={"request_id": "019b47a0-ece8-75b2-8a4c-40fcf4b49479"},
).json()
```

### Video Cost Tracking Architecture

For enterprises with concurrent video processing services:

```python
class VideoTrackingService:
    """
    Track video generation across multiple services using safety_identifier.

    Use case: Marketing team requests video generation, and multiple services
    (billing, analytics, notification) need to query the same video.
    """

    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://api.avalai.ir"

    async def create_tracked_video(
        self, prompt: str, department_id: str, project_id: str
    ) -> dict:
        """Create a video with enterprise tracking identifiers"""
        # Create composite safety_identifier for multi-dimensional tracking
        safety_id = f"dept_{department_id}_proj_{project_id}"

        response = requests.post(
            f"{self.base_url}/v1/videos",
            headers={"Authorization": f"Bearer {self.api_key}"},
            json={
                "model": "sora-2-pro",
                "prompt": prompt,
                "size": "1792x1024",
                "seconds": "8",
                "safety_identifier": safety_id,
            },
        )

        video = response.json()

        # Store request_id for cost tracking
        await self.queue_cost_lookup(
            request_id=video["request_id"],
            video_id=video["id"],
            department_id=department_id,
            project_id=project_id,
        )

        return video

    async def get_department_videos(self, department_id: str) -> list:
        """Get all videos for a department using safety_identifier prefix"""
        # Filter by safety_identifier pattern
        response = requests.get(
            f"{self.base_url}/v1/videos",
            headers={"Authorization": f"Bearer {self.api_key}"},
            params={"safety_identifier": f"dept_{department_id}"},
        )

        return response.json()["data"]

    async def queue_cost_lookup(self, request_id: str, **metadata):
        """Queue video cost lookup using request_id"""
        # Use User API to track costs
        cost_response = requests.post(
            f"{self.base_url}/user/v1/transactions/lookup",
            headers={"Authorization": f"Bearer {self.api_key}"},
            json={"transaction_ids": [request_id]},
        )

        if cost_response.json()["transactions"]:
            transaction = cost_response.json()["transactions"][0]
            await self.record_video_cost(transaction, metadata)
```

### Database Schema for Video Tracking

```sql
-- Video requests tracking table
CREATE TABLE video_requests (
    video_id VARCHAR(64) PRIMARY KEY,
    request_id UUID UNIQUE NOT NULL,
    safety_identifier VARCHAR(256),
    customer_id UUID REFERENCES customers(id),
    department_id VARCHAR(50),
    project_id VARCHAR(50),
    model VARCHAR(100),
    prompt TEXT,
    size VARCHAR(20),
    seconds INTEGER,
    status VARCHAR(20),
    requested_at TIMESTAMP,
    completed_at TIMESTAMP,
    cost_usd DECIMAL(12, 8),
    cost_irt DECIMAL(12, 2)
);

-- Indexes for enterprise queries
CREATE INDEX idx_video_safety_id ON video_requests(safety_identifier);
CREATE INDEX idx_video_request_id ON video_requests(request_id);
CREATE INDEX idx_video_customer ON video_requests(customer_id);
CREATE INDEX idx_video_department ON video_requests(department_id);
CREATE INDEX idx_video_status ON video_requests(status);
```

---

## Related Resources

- [User API Reference](en/api-reference/user.md) - Complete API documentation
- [Video API Reference](en/api-reference/videos.md) - Video generation API documentation
- [Reseller Cost Tracking Guide](en/resellers/cost-tracking-guide.md) - Detailed cost tracking workflow
- [Response Headers Guide](en/api-reference/response-headers.md) - Understanding request tracking
- [Rate Limits Guide](en/guides/rate-limits.md) - Rate limit tiers and best practices

---

**For Enterprise Support**: Contact support@avalai.ir for dedicated account management and enterprise pricing.
