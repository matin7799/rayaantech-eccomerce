# User API Launched: Precise Cost Tracking and Usage Analytics

**Date:** 2025-11-27

We announce the launch of the User API at `https://api.avalai.ir/user/v1`, providing precise cost tracking, transaction history, and usage analytics. This new API addresses the critical need for accurate billing and cost management, especially for resellers and enterprises requiring detailed usage monitoring.

---

## Overview

The User API introduces four dedicated endpoints for comprehensive account management and cost tracking. Unlike the `estimated_cost` field in API responses (which is not guaranteed and may not always be present), the User API provides 100% accurate cost data available within 30 seconds of any API call.

### Key Capabilities

- **Precise Cost Tracking**: Get exact costs for any API call using the [`x-request-id`](en/api-reference/response-headers.md#x-request-id) from response headers
- **Transaction History**: List all transactions with advanced filtering by model, provider, date range
- **Usage Analytics**: Detailed summaries grouped by model, provider, date, or hour
- **Batch Processing**: Lookup up to 1,000 transaction IDs in a single request
- **Complete Audit Trail**: Full transaction details for compliance and billing

---

## API Endpoints

### Base URL

```
https://api.avalai.ir/user/v1
```

### Available Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/transactions` | GET | List transactions with filtering |
| `/transactions/lookup` | POST | Get precise costs by transaction ID |
| `/transactions/summary` | GET | Usage analytics and summaries |
| `/health` | GET | API health status |

---

## Use Cases

### For Resellers

Resellers can now accurately charge customers based on actual costs:

**Problem Solved**: The `estimated_cost` field in API responses is unreliable for billing:
- Not guaranteed to be present
- May not reflect final costs
- Can cause billing disputes

**Solution**: Use the User API's `/transactions/lookup` endpoint with the [`x-request-id`](en/api-reference/response-headers.md#x-request-id) from response headers to get guaranteed accurate costs within 30 seconds.

**Workflow**:
1. Make API call on behalf of customer
2. Capture [`x-request-id`](en/api-reference/response-headers.md#x-request-id) from response headers
3. Store request ID with customer record
4. After 30 seconds, lookup precise cost
5. Bill customer accurately

### For Enterprises

Enterprises gain detailed cost allocation and chargeback capabilities:

- **Multi-tenant tracking**: Track costs per department or project using `safety_identifier`
- **Batch cost retrieval**: Process millions of requests with batch lookup
- **Real-time analytics**: Monitor spending patterns and optimize usage
- **Compliance**: Complete audit trail for financial reporting

### For Developers

All developers benefit from precise usage monitoring:

- **Budget management**: Track spending against allocated budgets
- **Cost optimization**: Identify expensive patterns and optimize prompts
- **Debugging**: Correlate costs with specific requests for troubleshooting

---

## Quick Start

### Step 1: Make an API Call

Every API response includes an [`x-request-id`](en/api-reference/response-headers.md#x-request-id) header:

```bash
curl -i "https://api.avalai.ir/v1/chat/completions" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o-mini",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

**Response Headers**:
```
HTTP/2 200
date: Wed, 27 Nov 2025 09:24:15 GMT
content-type: application/json
x-ratelimit-limit-requests: 30000
x-ratelimit-remaining-requests: 29999
x-request-id: 019ac4a0-a8f4-7041-845f-3ea8f15dcf1a
```

### Step 2: Lookup Precise Cost

Wait up to 30 seconds, then retrieve the exact cost:

```bash
curl "https://api.avalai.ir/user/v1/transactions/lookup" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "transaction_ids": ["019ac4a0-a8f4-7041-845f-3ea8f15dcf1a"]
  }'
```

**Response**:
```json
{
  "transactions": [
    {
      "id": "019ac4a0-a8f4-7041-845f-3ea8f15dcf1a",
      "created_at": "2025-11-26T20:06:22.555Z",
      "requested_at": "2025-11-26T20:00:15.228Z",
      "safety_identifier": null,
      "model": "gpt-4o-mini",
      "provider": "openai",
      "status_code": 200,
      "stream": false,
      "tokens": {
        "total": 30,
        "prompt": 10,
        "completion": 20,
        "reasoning": 0,
        "cached": 0,
        "prompt_details": {
          "text_tokens": 10,
          "audio_tokens": 0,
          "image_tokens": 0,
          "cached_tokens": 0,
          "audio_input_duration": 0,
          "cache_creation_tokens": 0
        },
        "completion_details": {
          "text_tokens": 20,
          "audio_tokens": 0,
          "image_tokens": 0,
          "reasoning_tokens": 0,
          "audio_output_duration": 0,
          "accepted_prediction_tokens": 0,
          "rejected_prediction_tokens": 0
        }
      },
      "ip_address": "192.168.1.1",
      "tools": {},
      "api_key_suffix": "...jCqw",
      "cost": {
        "unit": "0.00001350",
        "paid_unit": "0.00001350",
        "paid_irt": "0.00",
        "paid_grant_irt": "1.55",
        "source": "credit_package",
        "currency": "UNIT"
      },
      "grants": [],
      "packages": [
        {
          "id": "1234",
          "template_id": "d-o3050s",
          "name": "مدل‌های زبانی منتخب OpenAI روزانه پایه",
          "amount_irt": "500000.00",
          "remaining_irt": "498447.15",
          "allowed_services": [
            "api"
          ],
          "scope_details": {
            "api": [
              "gpt-5-chat",
              "gpt-5-mini",
              "gpt-5-nano",
              "o4-mini",
              "o3-mini",
              "o1",
              "gpt-4.1",
              "gpt-4.1-mini",
              "gpt-4.1-nano",
              "gpt-4o",
              "gpt-4o-mini",
              "gpt-4o-transcribe",
              "gpt-4o-mini-transcribe",
              "gpt-4o-mini-tts"
            ]
          },
          "end_date": "2025-11-27T15:05:07.404Z"
        }
      ]
    }
  ],
  "summary": {
    "requested": 1,
    "found": 1,
    "not_found_ids": []
  }
}
```

---

## Code Examples

### Python: Reseller Cost Tracking

```language-selector
bash=:# Step 1: Make API call for customer
curl -i "https://api.avalai.ir/v1/chat/completions" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o-mini",
    "messages": [{"role": "user", "content": "Hello!"}],
    "safety_identifier": "customer-12345"
  }'

# Step 2: Wait 30 seconds, then lookup cost
sleep 30

curl "https://api.avalai.ir/user/v1/transactions/lookup" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "transaction_ids": ["019ac4a0-a8f4-7041-845f-3ea8f15dcf1a"]
  }'

python=:import requests
import time

# Step 1: Make API call for customer
response = requests.post(
    "https://api.avalai.ir/v1/chat/completions",
    headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
    json={
        "model": "gpt-4o-mini",
        "messages": [{"role": "user", "content": "Hello!"}],
        "safety_identifier": "customer-12345",
    },
)

# Step 2: Capture x-request-id
request_id = response.headers.get("x-request-id")
print(f"Request ID: {request_id}")

# Step 3: Wait for cost processing
time.sleep(30)

# Step 4: Lookup precise cost
cost_response = requests.post(
    "https://api.avalai.ir/user/v1/transactions/lookup",
    headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
    json={"transaction_ids": [request_id]},
)

transaction = cost_response.json()["transactions"][0]
cost_usd = float(transaction["cost"]["total_cost_usd"])
print(f"Exact cost: ${cost_usd:.6f}")

javascript=:// Step 1: Make API call for customer
const response = await fetch("https://api.avalai.ir/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.AVALAI_API_KEY}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    model: "gpt-4o-mini",
    messages: [{role: "user", content: "Hello!"}],
    safety_identifier: "customer-12345"
  })
});

// Step 2: Capture x-request-id
const requestId = response.headers.get("x-request-id");
console.log(`Request ID: ${requestId}`);

// Step 3: Wait for cost processing
await new Promise(resolve => setTimeout(resolve, 30000));

// Step 4: Lookup precise cost
const costResponse = await fetch("https://api.avalai.ir/user/v1/transactions/lookup", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.AVALAI_API_KEY}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    transaction_ids: [requestId]
  })
});

const data = await costResponse.json();
const transaction = data.transactions[0];
const costUsd = parseFloat(transaction.cost.total_cost_usd);
console.log(`Exact cost: $${costUsd.toFixed(6)}`);

```

### Enterprise: Batch Cost Retrieval

```language-selector
bash=:# List recent transactions
curl "https://api.avalai.ir/user/v1/transactions?limit=100&created_after=2025-11-27T00:00:00Z" \
  -H "Authorization: Bearer $AVALAI_API_KEY"

# Lookup multiple transactions
curl "https://api.avalai.ir/user/v1/transactions/lookup" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "transaction_ids": [
      "019ac4a0-a8f4-7041-845f-3ea8f15dcf1a",
      "019ac4a0-b2c3-7d4e-9f0a-1b2c3d4e5f6a",
      "019ac4a0-c3d4-8e5f-a0b1-2c3d4e5f6a7b"
    ]
  }'

python=:import requests

# List recent transactions
list_response = requests.get(
    "https://api.avalai.ir/user/v1/transactions",
    headers={"Authorization": f"Bearer {api_key}"},
    params={"limit": 100, "created_after": "2025-11-27T00:00:00Z"},
)

transactions = list_response.json()["transactions"]
transaction_ids = [t["id"] for t in transactions]

# Batch lookup (up to 1000 IDs)
cost_response = requests.post(
    "https://api.avalai.ir/user/v1/transactions/lookup",
    headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
    json={"transaction_ids": transaction_ids},
)

# Calculate total cost
total_cost = sum(
    float(t["cost"]["total_cost_usd"]) for t in cost_response.json()["transactions"]
)
print(f"Total cost: ${total_cost:.6f}")

javascript=:// List recent transactions
const listResponse = await fetch(
  "https://api.avalai.ir/user/v1/transactions?limit=100&created_after=2025-11-27T00:00:00Z",
  {
    headers: {
      "Authorization": `Bearer ${process.env.AVALAI_API_KEY}`
    }
  }
);

const data = await listResponse.json();
const transactionIds = data.transactions.map(t => t.id);

// Batch lookup (up to 1000 IDs)
const costResponse = await fetch("https://api.avalai.ir/user/v1/transactions/lookup", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.AVALAI_API_KEY}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    transaction_ids: transactionIds
  })
});

const costData = await costResponse.json();

// Calculate total cost
const totalCost = costData.transactions.reduce(
  (sum, t) => sum + parseFloat(t.cost.total_cost_usd),
  0
);
console.log(`Total cost: $${totalCost.toFixed(6)}`);

```

---

## Advanced Features

### Transaction Filtering

Filter transactions by multiple criteria:

```bash
curl "https://api.avalai.ir/user/v1/transactions?model=gpt-4o&provider=openai&created_after=2025-11-27T00:00:00Z&limit=50" \
  -H "Authorization: Bearer $AVALAI_API_KEY"
```
**Response**:
```json
{
  "transactions": [
    {
      "id": "019ac4a0-a8f4-7041-845f-3ea8f15dcf1a",
      "created_at": "2025-11-27T09:24:18.129Z",
      "requested_at": "2025-11-27T09:24:14.709Z",
      "safety_identifier": null,
      "model": "gpt-5.4-mini-2026-03-17",
      "provider": "openai",
      "status_code": 200,
      "stream": false,
      "tokens": {
        "total": 17,
        "prompt": 8,
        "completion": 9,
        "reasoning": 0,
        "cached": 0
      }
    }
  ],
  "total": 1,
  "page": 1,
  "page_size": 100,
  "has_more": false
}
```

### Usage Analytics

Get aggregated usage statistics:

```bash
# Daily summary by model
curl "https://api.avalai.ir/user/v1/transactions/summary?group_by=day" \
  -H "Authorization: Bearer $AVALAI_API_KEY"
```

**Response**:
```json
{
  "period": {
    "start": "2025-11-26T14:34:35.797Z",
    "end": "2025-11-27T14:34:35.797Z"
  },
  "totals": {
    "transactions": 16071,
    "tokens": {
      "total": 389932376,
      "prompt": 363975518,
      "completion": 25956858,
      "reasoning": 4976660,
      "cached": 104316078
    },
    "cost": {
      "unit": "883.58715766",
      "paid_unit": "883.40514018",
      "paid_irt": "0",
      "paid_grant_irt": "1000000.00"
    }
  },
  "breakdown": [
    {
      "period": "2025-11-27",
      "transactions": 9636,
      "tokens": {
        "total": 218301310,
        "prompt": 203319110,
        "completion": 14982200
      }
    },
    {
      "period": "2025-11-26",
      "transactions": 6435,
      "tokens": {
        "total": 171631066,
        "prompt": 160656408,
        "completion": 10974658
      }
    }
  ],
  "by_model": null,
  "by_safety_identifier": null,
  "by_provider": null,
  "by_api_key": null
}
```

### Custom Identifiers

Tag requests for departmental tracking:

```bash
curl "https://api.avalai.ir/v1/chat/completions" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": "Analyze this data"}],
    "safety_identifier": "dept-analytics-project-x"
  }'
```

Then filter by identifier:

```bash
curl "https://api.avalai.ir/user/v1/transactions?safety_identifier=dept-analytics-project-x" \
  -H "Authorization: Bearer $AVALAI_API_KEY"
```

---

## Migration Guide

### From estimated_cost to User API

**Before** (Unreliable):
```python
response = client.chat.completions.create(...)
# estimated_cost may not be present!
cost = (
    response.estimated_cost.get("unit") if hasattr(response, "estimated_cost") else None
)
```

**After** (Guaranteed):
```python
response = client.chat.completions.create(...)
request_id = response.headers.get("x-request-id")

# Wait 30 seconds
time.sleep(30)

# Get guaranteed accurate cost
cost_data = requests.post(
    "https://api.avalai.ir/user/v1/transactions/lookup",
    headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
    json={"transaction_ids": [request_id]},
).json()

cost = float(cost_data["transactions"][0]["cost"]["total_cost_usd"])
```

---

## Related Links

- [User API Reference](en/api-reference/user.md) - Complete API documentation
- [Response Headers Guide](en/api-reference/response-headers.md) - Understanding [`x-request-id`](en/api-reference/response-headers.md#x-request-id) and rate limits
- [Reseller Cost Tracking Guide](en/resellers/cost-tracking-guide.md) - Step-by-step implementation guide
- [Enterprise Usage Guide](en/resellers/enterprise-guide.md) - Advanced patterns for scale
- [Rate Limits Guide](en/guides/rate-limits.md) - Understanding API rate limits