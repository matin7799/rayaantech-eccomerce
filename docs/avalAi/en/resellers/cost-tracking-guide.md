
# Reseller Cost Tracking Guide

As a reseller of AvalAI API services, accurately tracking the cost of each API call is essential for proper billing and profit margin management. This guide provides a complete, step-by-step workflow for implementing precise cost tracking using the User API.

## Table of Contents

- [Why Precise Cost Tracking Matters](#why-precise-cost-tracking-matters)
- [The Challenge with estimated_cost](#the-challenge-with-estimated_cost)
- [The Solution: User API](#the-solution-user-api)
- [Complete Implementation Workflow](#complete-implementation-workflow)
- [Architecture Recommendations](#architecture-recommendations)
- [Code Examples](#code-examples)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## Why Precise Cost Tracking Matters

As a reseller, you need to:

1. **Bill Your Customers Accurately**: Charge the exact amount based on actual usage
2. **Maintain Profit Margins**: Calculate your markup on precise costs, not estimates
3. **Provide Transparency**: Offer detailed usage reports to your customers
4. **Manage Cash Flow**: Understand your exact costs for financial planning
5. **Handle Disputes**: Have precise records to resolve any billing questions

---

## The Challenge with estimated_cost

Many API responses include an `estimated_cost` field:

```json
{
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 20,
    "total_tokens": 30
  },
  "estimated_cost": {
    "unit": "0.0000066000",
    "irt": 0.76,
    "exchange_rate": 115250
  }
}
```

**Problems with estimated_cost:**
- ❌ **Not guaranteed to exist** in all responses
- ❌ **May not reflect actual billing** (especially with credit packages, grants, or special pricing)
- ❌ **Doesn't account for** cached tokens, streaming costs, or other variables
- ❌ **Exchange rates** may not match final billing rates

**Result**: You cannot reliably bill your customers based on `estimated_cost`.

---

## The Solution: User API

The [`/user/v1/transactions/lookup`](en/api-reference/user.md#post-transactionslookup) endpoint provides **100% accurate** cost data for every API call.

### Key Benefits:

✅ **100% Accurate**: Matches your actual billing exactly  
✅ **Always Available**: Within 30 seconds of request completion  
✅ **Complete Details**: Includes grants, packages, and actual charges  
✅ **Audit Trail**: Full transaction history for compliance  
✅ **Multiple Currencies**: Costs in both UNIT (USD) and IRT (Tomans)

### How It Works:

1. Every API response includes an `x-request-id` header (UUID v7)
2. Store this ID with your customer's request
3. Wait up to 30 seconds for cost processing
4. Query `/user/v1/transactions/lookup` with the request ID
5. Get precise cost data for billing

---

## Complete Implementation Workflow

### Step 1: Capture the Request ID

Every AvalAI API response includes an `x-request-id` header. You **must** capture this:

```python
# Make API call
response = requests.post(
    "https://api.avalai.ir/v1/chat/completions",
    headers={
        "Authorization": f"Bearer {AVALAI_API_KEY}",
        "Content-Type": "application/json",
    },
    json={"model": "gpt-5.4-mini", "messages": [{"role": "user", "content": "Hello!"}]},
)

# CRITICAL: Capture x-request-id from headers
request_id = response.headers.get("x-request-id")

# Store immediately with customer context
db.insert_pending_transaction(
    {
        "request_id": request_id,
        "customer_id": customer.id,
        "timestamp": datetime.now(),
        "model": "gpt-5.4-mini",
        "response_data": response.json(),
    }
)
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
    model="gpt-5.4-mini",
    instructions="You are a helpful assistant.",
    input="Hello!",
)

print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


### Step 2: Wait for Cost Processing

Costs are processed asynchronously. Wait up to 30 seconds (usually much faster):

```python
import time

# Option A: Synchronous - wait immediately
time.sleep(5)  # Usually available in 3-5 seconds

# Option B: Asynchronous - process later (RECOMMENDED)
# Queue the request_id for background processing
cost_tracking_queue.add(
    {
        "request_id": request_id,
        "customer_id": customer.id,
        "retry_after": datetime.now() + timedelta(seconds=5),
    }
)
```

### Step 3: Lookup Precise Cost

Query the User API to get exact cost details:

```python
# Lookup transaction cost
lookup_response = requests.post(
    "https://api.avalai.ir/user/v1/transactions/lookup",
    headers={
        "Authorization": f"Bearer {AVALAI_API_KEY}",
        "Content-Type": "application/json",
    },
    json={"transaction_ids": [request_id]},
)

cost_data = lookup_response.json()

if cost_data["summary"]["found"] > 0:
    transaction = cost_data["transactions"][0]

    # Extract precise costs
    actual_cost_usd = float(transaction["cost"]["unit"])
    actual_cost_irt = float(transaction["cost"]["paid_irt"]) + float(
        transaction["cost"]["paid_grant_irt"]
    )

    # Update your database
    db.update_transaction_cost(
        request_id=request_id,
        cost_usd=actual_cost_usd,
        cost_irt=actual_cost_irt,
        cost_details=transaction["cost"],
    )
```

### Step 4: Bill Your Customer

Now you have precise costs and can bill accurately:

```python
# Calculate your pricing (example: 20% markup)
customer_cost_usd = actual_cost_usd * 1.20
customer_cost_irt = actual_cost_irt * 1.20

# Record the charge
db.insert_customer_charge(
    {
        "customer_id": customer.id,
        "request_id": request_id,
        "avalai_cost_usd": actual_cost_usd,
        "customer_cost_usd": customer_cost_usd,
        "markup_percent": 20,
        "timestamp": datetime.now(),
    }
)

# Update customer's balance
customer.deduct_balance(customer_cost_usd)
```

---

## Architecture Recommendations

### Option 1: Synchronous (Simple, Higher Latency)

```
[Customer] → [Your API] → [AvalAI API]
                ↓
         Capture x-request-id
                ↓
         Wait 5 seconds
                ↓
      Lookup precise cost
                ↓
      Return to customer
```

**Pros**: Simple to implement, immediate cost data  
**Cons**: Adds 5+ seconds to response time

### Option 2: Asynchronous (Recommended)

```
[Customer] → [Your API] → [AvalAI API]
                ↓             ↓
         Store request_id     |
                ↓             |
         Return immediately   |
                              ↓
                     [Background Worker]
                              ↓
                      Lookup cost (5s later)
                              ↓
                      Update database
```

**Pros**: Fast customer response, scalable  
**Cons**: Slightly more complex

### Option 3: Batch Processing (High Volume)

```
[Collect request_ids throughout the day]
              ↓
      [Hourly batch job]
              ↓
   Lookup costs in batches (up to 1000 IDs)
              ↓
   Update all costs at once
              ↓
   Generate customer invoices
```

**Pros**: Efficient for high volume, reduces API calls  
**Cons**: Delayed cost data

---

## Code Examples

### Complete Python Implementation

```python
import requests
import time
from datetime import datetime, timedelta
from typing import Dict, List
import logging


class AvalAIReseller:
    def __init__(self, avalai_api_key: str):
        self.api_key = avalai_api_key
        self.base_url = "https://api.avalai.ir"

    def make_customer_request(
        self, customer_id: str, model: str, messages: List[Dict], **kwargs
    ) -> Dict:
        """
        Make an API request on behalf of a customer and track costs.
        """
        # Step 1: Make the API call
        response = requests.post(
            f"{self.base_url}/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
            },
            json={"model": model, "messages": messages, **kwargs},
        )

        # Step 2: Capture x-request-id
        request_id = response.headers.get("x-request-id")
        if not request_id:
            logging.error("No x-request-id in response headers!")
            raise ValueError("Missing x-request-id header")

        # Step 3: Store for cost lookup
        self.store_pending_transaction(
            request_id=request_id,
            customer_id=customer_id,
            model=model,
            response_data=response.json(),
        )

        # Step 4: Queue for cost processing (async)
        self.queue_cost_lookup(request_id, customer_id)

        return {"request_id": request_id, "response": response.json()}

    def lookup_transaction_cost(
        self, request_ids: List[str], max_retries: int = 3
    ) -> Dict:
        """
        Lookup precise costs for one or more transactions.
        Retries if cost not yet available.
        """
        for attempt in range(max_retries):
            response = requests.post(
                f"{self.base_url}/user/v1/transactions/lookup",
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json",
                },
                json={"transaction_ids": request_ids},
            )

            data = response.json()

            # Check if all transactions found
            if data["summary"]["found"] == len(request_ids):
                return data

            # If not found, wait and retry
            if attempt < max_retries - 1:
                wait_time = 5 * (attempt + 1)  # Exponential backoff
                logging.info(f"Transactions not ready, waiting {wait_time}s...")
                time.sleep(wait_time)

        return data

    def process_transaction_cost(self, request_id: str, customer_id: str):
        """
        Process the cost for a transaction and bill the customer.
        """
        # Lookup the cost
        cost_data = self.lookup_transaction_cost([request_id])

        if cost_data["summary"]["found"] == 0:
            logging.error(f"Transaction {request_id} not found!")
            return

        transaction = cost_data["transactions"][0]

        # Extract costs
        avalai_cost_usd = float(transaction["cost"]["unit"])
        avalai_cost_irt = float(transaction["cost"]["paid_irt"]) + float(
            transaction["cost"]["paid_grant_irt"]
        )

        # Apply your markup (e.g., 20%)
        markup = 1.20
        customer_cost_usd = avalai_cost_usd * markup
        customer_cost_irt = avalai_cost_irt * markup

        # Store in database
        self.record_customer_charge(
            customer_id=customer_id,
            request_id=request_id,
            avalai_cost_usd=avalai_cost_usd,
            customer_cost_usd=customer_cost_usd,
            avalai_cost_irt=avalai_cost_irt,
            customer_cost_irt=customer_cost_irt,
            transaction_details=transaction,
        )

        logging.info(
            f"Charged customer {customer_id}: "
            f"${customer_cost_usd:.6f} "
            f"(AvalAI: ${avalai_cost_usd:.6f}, Markup: 20%)"
        )

    def batch_process_costs(self, request_ids: List[str]):
        """
        Process costs for multiple transactions in batch.
        Efficient for high-volume scenarios.
        """
        # User API supports up to 1000 IDs per request
        batch_size = 1000

        for i in range(0, len(request_ids), batch_size):
            batch = request_ids[i : i + batch_size]

            cost_data = self.lookup_transaction_cost(batch)

            for transaction in cost_data["transactions"]:
                request_id = transaction["id"]

                # Process each transaction
                # (retrieve customer_id from your database)
                customer_id = self.get_customer_for_request(request_id)

                if customer_id:
                    self.process_transaction_cost(request_id, customer_id)

            # Handle not found transactions
            for not_found_id in cost_data["summary"]["not_found_ids"]:
                logging.warning(f"Transaction {not_found_id} not found")

    def store_pending_transaction(self, request_id, customer_id, model, response_data):
        """Implement your database storage logic"""
        pass

    def queue_cost_lookup(self, request_id, customer_id):
        """Implement your queue logic (Redis, Celery, etc.)"""
        pass

    def record_customer_charge(self, **kwargs):
        """Implement your billing logic"""
        pass

    def get_customer_for_request(self, request_id):
        """Retrieve customer_id from database"""
        pass


# Usage
reseller = AvalAIReseller(avalai_api_key="your-key")

# Make a request for a customer
result = reseller.make_customer_request(
    customer_id="cust_123",
    model="gpt-5.4-mini",
    messages=[{"role": "user", "content": "Hello!"}],
)

# Cost will be processed asynchronously in background
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
    model="gpt-5.4-mini",
    instructions="You are a helpful assistant.",
    input="Hello!",
)

print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


### Node.js Implementation

```javascript
class AvalAIReseller {
  constructor(avalaiApiKey) {
    this.apiKey = avalaiApiKey;
    this.baseUrl = "https://api.avalai.ir";
  }

  async makeCustomerRequest(customerId, model, messages, options = {}) {
    // Step 1: Make API call
    const response = await fetch(`${this.baseUrl}/v1/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages,
        ...options,
      }),
    });

    // Step 2: Capture x-request-id
    const requestId = response.headers.get("x-request-id");
    if (!requestId) {
      throw new Error("Missing x-request-id header");
    }

    const data = await response.json();

    // Step 3: Store for cost lookup
    await this.storePendingTransaction({
      requestId,
      customerId,
      model,
      responseData: data,
    });

    // Step 4: Queue for async cost processing
    await this.queueCostLookup(requestId, customerId);

    return { requestId, response: data };
  }

  async lookupTransactionCost(requestIds, maxRetries = 3) {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      const response = await fetch(
        `${this.baseUrl}/user/v1/transactions/lookup`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ transaction_ids: requestIds }),
        }
      );

      const data = await response.json();

      // Check if all found
      if (data.summary.found === requestIds.length) {
        return data;
      }

      // Wait and retry
      if (attempt < maxRetries - 1) {
        const waitTime = 5000 * (attempt + 1);
        console.log(`Waiting ${waitTime}ms for cost processing...`);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }

    return data;
  }

  async processTransactionCost(requestId, customerId) {
    // Lookup cost
    const costData = await this.lookupTransactionCost([requestId]);

    if (costData.summary.found === 0) {
      console.error(`Transaction ${requestId} not found`);
      return;
    }

    const transaction = costData.transactions[0];

    // Extract costs
    const avalaiCostUsd = parseFloat(transaction.cost.unit);
    const avalaiCostIrt =
      parseFloat(transaction.cost.paid_irt) +
      parseFloat(transaction.cost.paid_grant_irt);

    // Apply markup (20%)
    const markup = 1.2;
    const customerCostUsd = avalaiCostUsd * markup;
    const customerCostIrt = avalaiCostIrt * markup;

    // Record charge
    await this.recordCustomerCharge({
      customerId,
      requestId,
      avalaiCostUsd,
      customerCostUsd,
      avalaiCostIrt,
      customerCostIrt,
      transactionDetails: transaction,
    });

    console.log(
      `Charged customer ${customerId}: $${customerCostUsd.toFixed(6)} ` +
        `(AvalAI: $${avalaiCostUsd.toFixed(6)}, Markup: 20%)`
    );
  }

  async storePendingTransaction(data) {
    // Implement your database storage
  }

  async queueCostLookup(requestId, customerId) {
    // Implement your queue (Bull, Redis, etc.)
  }

  async recordCustomerCharge(data) {
    // Implement your billing logic
  }
}

// Usage
const reseller = new AvalAIReseller(process.env.AVALAI_API_KEY);

// Make request for customer
const result = await reseller.makeCustomerRequest(
  "cust_123",
  "gpt-5.4-mini",
  [{ role: "user", content: "Hello!" }]
);
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version</summary>

Use this version when the selected model supports `/v1/responses`. `messages` moves to `input`, and the final text is read from `response.output_text`.

```javascript
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.responses.create({
  model: "gpt-5.5",
  instructions: "You are a helpful assistant.",
  input: "Hello!",
});

console.log(response.output_text);
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


---

## Best Practices

### 1. Always Capture x-request-id

When using the **requests** library or other HTTP clients:

```python
# ✅ GOOD
request_id = response.headers.get("x-request-id")
if not request_id:
    raise ValueError("Missing x-request-id - cannot track cost!")

# ❌ BAD
# Not capturing x-request-id means you cannot track costs
```

When using the **OpenAI SDK** (recommended):

```python
from openai import OpenAI

client = OpenAI(
    api_key="your-avalai-api-key",
    base_url="https://api.avalai.ir/v1",
)

response = client.chat.completions.create(
    model="gpt-5.4-mini",
    messages=[{"role": "user", "content": "Hello!"}],
)

# ✅ GOOD - OpenAI SDK provides _request_id attribute
request_id = response._request_id
if not request_id:
    raise ValueError("Missing request_id - cannot track cost!")

print(f"Request ID: {request_id}")
# Output: Request ID: 019ac4a0-a8f4-7041-845f-3ea8f15dcf1a
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
    model="gpt-5.4-mini",
    instructions="You are a helpful assistant.",
    input="Hello!",
)

print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


> **Note:** The `_request_id` attribute is automatically populated by the OpenAI SDK when using AvalAI's API endpoint. This is the recommended approach as it handles header parsing automatically.

When using **LangChain** (which doesn't directly expose HTTP headers):

```python
import httpx
from langchain_openai import ChatOpenAI
from langchain_core.callbacks import BaseCallbackHandler
from contextvars import ContextVar
import os

# Store headers in context var for thread safety
request_headers: ContextVar[dict] = ContextVar("request_headers", default={})


class HeaderCapturingClient(httpx.Client):
    def send(self, request, **kwargs):
        response = super().send(request, **kwargs)
        request_headers.set(dict(response.headers))
        return response


class HeaderAccessCallback(BaseCallbackHandler):
    def __init__(self):
        self.request_id = None

    def on_llm_end(self, response, **kwargs):
        headers = request_headers.get()
        self.request_id = headers.get("x-request-id")


# Setup
http_client = HeaderCapturingClient()
chat_generator = ChatOpenAI(
    base_url="https://api.avalai.ir/v1",
    api_key=os.getenv("AVALAI_API_KEY"),
    model="gpt-5.4-mini",
    http_client=http_client,
)

callback = HeaderAccessCallback()
response = chat_generator.invoke("Hello!", config={"callbacks": [callback]})

# ✅ GOOD - Access request_id from callback
request_id = callback.request_id
if not request_id:
    raise ValueError("Missing request_id - cannot track cost!")

print(f"Request ID: {request_id}")
```

> **Note:** For async LangChain usage, use `httpx.AsyncClient` and `AsyncCallbackHandler`. See [Response Headers Guide](en/api-reference/response-headers.md#accessing-x-request-id-with-langchain) for complete async examples.

### 2. Implement Retry Logic

Costs may not be immediately available. Implement exponential backoff:

```python
def lookup_with_retry(request_id, max_attempts=3):
    for attempt in range(max_attempts):
        data = lookup_cost(request_id)
        if data["summary"]["found"] > 0:
            return data
        time.sleep(5 * (attempt + 1))  # 5s, 10s, 15s
    raise Exception("Cost not available after retries")
```

### 3. Batch Process for Efficiency

If you have high volume, batch lookup requests:

```python
# Process 1000 transactions at once
request_ids = get_pending_request_ids(limit=1000)
cost_data = lookup_transaction_cost(request_ids)

for transaction in cost_data["transactions"]:
    process_cost(transaction)
```

### 4. Store Complete Transaction Details

Don't just store the cost - store everything for auditing:

```python
db.store_transaction(
    {
        "request_id": request_id,
        "customer_id": customer_id,
        "timestamp": transaction["requested_at"],
        "model": transaction["model"],
        "tokens": transaction["tokens"],
        "avalai_cost_unit": transaction["cost"]["unit"],
        "avalai_cost_irt": transaction["cost"]["paid_irt"],
        "grants_used": transaction["grants"],
        "packages_used": transaction["packages"],
        "customer_charged_usd": customer_cost,
        "markup_percent": 20,
    }
)
```

### 5. Monitor Failed Lookups

Track and alert on transactions that don't return costs:

```python
if cost_data["summary"]["not_found_ids"]:
    for missing_id in cost_data["summary"]["not_found_ids"]:
        alert_ops(f"Transaction {missing_id} cost not found!")
        # Retry later or investigate
```

### 6. Provide Transparency to Customers

Give your customers detailed usage reports:

```python
def generate_customer_report(customer_id, month):
    transactions = db.get_customer_transactions(customer_id, month)

    return {
        "customer_id": customer_id,
        "period": month,
        "total_requests": len(transactions),
        "total_tokens": sum(t["tokens"]["total"] for t in transactions),
        "total_cost_usd": sum(t["customer_charged_usd"] for t in transactions),
        "by_model": group_by_model(transactions),
        "transactions": transactions,  # Detailed list
    }
```

---

## Troubleshooting

### Issue: x-request-id Not in Response Headers

**Cause**: Using an old SDK or not checking headers correctly

**Solution**:
```python
# Make sure you're accessing response headers, not body
request_id = response.headers.get("x-request-id")  # ✅ Correct
request_id = response.json().get("x-request-id")  # ❌ Wrong - not in body
```

### Issue: Transaction Not Found After 30 Seconds

**Cause**: Very rare, but possible during high load

**Solution**:
```python
# Implement extended retry
max_wait = 60  # Wait up to 60 seconds
interval = 10
for i in range(max_wait // interval):
    data = lookup_cost(request_id)
    if data["summary"]["found"] > 0:
        return data
    time.sleep(interval)

# If still not found, contact support with request_id
```

### Issue: Costs Don't Match estimated_cost

**Cause**: This is expected! `estimated_cost` is an estimate; `/transactions/lookup` is actual cost

**Solution**:
- Always use `/transactions/lookup` for billing
- Ignore `estimated_cost` for financial decisions
- Use `estimated_cost` only for rough UX estimates

### Issue: High API Call Volume for Cost Lookups

**Cause**: Looking up each transaction individually

**Solution**:
```python
# Batch lookup up to 1000 at once
request_ids = [...]  # Up to 1000 IDs
cost_data = lookup_transaction_cost(request_ids)
```

---

## Related Resources

- [User API Reference](en/api-reference/user.md) - Complete API documentation
- [Response Headers Guide](en/api-reference/response-headers.md) - Understanding x-request-id and rate limits
- [Enterprise Guide](en/resellers/enterprise-guide.md) - Advanced usage patterns for large-scale operations
- [Rate Limits](en/guides/rate-limits.md) - Understanding API rate limits

---

## Support


cost tracking, contact our support team with your reseller account details.

**Email**: support@avalai.ir  
**Include**: Your reseller ID and specific request IDs for any issues

---