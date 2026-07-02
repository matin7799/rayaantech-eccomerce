# User API

The User API provides programmatic access to your account information, credit balance, and transaction history. Use these endpoints to monitor usage, track spending, and retrieve precise cost data for API calls.

## Base URL

```
https://api.avalai.ir/user/v1
```

## Overview

The User API enables you to:

- **Monitor credit usage** - Check remaining balance and credit sources
- **Track API usage** - List and filter transactions with flexible parameters
- **Analyze spending** - Get aggregated statistics grouped by model, provider, day, or API key
- **Lookup transactions** - Retrieve specific transactions by request ID for precise cost data

### Data Retention

> **Important:** Transaction records are guaranteed to be accessible for at least **90 days**. There is no guarantee that transaction data will be available after 3 months. If you need to retain cost data for longer periods, please store the transaction details in your own database.

### Key Features

| Feature | Description |
|---------|-------------|
| **Real-time credit data** | Credit information is always up-to-date |
| **Flexible filtering** | Filter transactions by model, provider, date range, and more |
| **Aggregated statistics** | Get summary data grouped by day, model, provider, or API key |
| **Batch lookups** | Retrieve up to 1000 transactions in a single request |
| **Precise cost tracking** | Get exact cost breakdown for any API request via request ID |
| **90-day retention** | Transaction records are accessible for at least 90 days |

## Authentication

All User API endpoints require Bearer token authentication using your AvalAI API key.

```language-selector
bash=:# Set your API key
export AVALAI_API_KEY="your-avalai-api-key"

# Example request
curl -X GET "https://api.avalai.ir/user/v1/credit" \
  -H "Authorization: Bearer $AVALAI_API_KEY"

python=:from openai import OpenAI
import requests

# Using requests for User API
api_key = "your-avalai-api-key"
headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}

response = requests.get("https://api.avalai.ir/user/v1/credit", headers=headers)
print(response.json())

javascript=:const apiKey = process.env.AVALAI_API_KEY;

const response = await fetch("https://api.avalai.ir/user/v1/credit", {
  method: "GET",
  headers: {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  },
});

const data = await response.json();
console.log(data);

go=:package main

import (
	"fmt"
	"io"
	"net/http"
	"os"
)

func main() {
	apiKey := os.Getenv("AVALAI_API_KEY")

	req, _ := http.NewRequest("GET", "https://api.avalai.ir/user/v1/credit", nil)
	req.Header.Set("Authorization", "Bearer "+apiKey)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Printf("Error: %v\n", err)
		return
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	fmt.Println(string(body))
}

php=:<?php
$apiKey = getenv('AVALAI_API_KEY');

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'https://api.avalai.ir/user/v1/credit');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $apiKey,
    'Content-Type: application/json'
]);

$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);
print_r($data);
?>

```

### Authentication Errors

| Status Code | Error | Description |
|-------------|-------|-------------|
| 401 | `unauthorized` | Missing or invalid API key |
| 403 | `forbidden` | Account is suspended or inactive |

## Rate Limiting

The User API applies per-user rate limiting based on your account tier.

### Rate Limits by Tier

| Tier | Requests per Minute (RPM) |
|------|---------------------------|
| 0 (Basic) | 3 |
| 1 | 15 |
| 2 | 50 |
| 3 | 150 |
| 4 | 350 |
| 5 | 750 |

### Rate Limit Headers

Every response includes rate limit information:

| Header | Description |
|--------|-------------|
| `x-ratelimit-limit-requests` | Maximum requests per minute |
| `x-ratelimit-remaining-requests` | Remaining requests in current window |
| `x-ratelimit-reset-requests` | Seconds until the rate limit resets |

### Rate Limit Exceeded Response

```json
{
  "error": "rate_limit_exceeded",
  "message": "Rate limit exceeded. Try again in 45 seconds."
}
```

---

## Endpoints

### GET /credit

Get your current credit balance, limits, and credit sources.

**URL:** `GET https://api.avalai.ir/user/v1/credit`

#### Request

```language-selector
bash=:curl -X GET "https://api.avalai.ir/user/v1/credit" \
  -H "Authorization: Bearer $AVALAI_API_KEY"

python=:import requests

api_key = "your-avalai-api-key"
headers = {"Authorization": f"Bearer {api_key}"}

response = requests.get("https://api.avalai.ir/user/v1/credit", headers=headers)
credit_info = response.json()
print(f"Remaining credit: {credit_info['remaining_irt']} IRT")
print(f"Account tier: {credit_info['account_tier']}")

javascript=:const response = await fetch("https://api.avalai.ir/user/v1/credit", {
  headers: { Authorization: `Bearer ${process.env.AVALAI_API_KEY}` },
});

const creditInfo = await response.json();
console.log(`Remaining credit: ${creditInfo.remaining_irt} IRT`);
console.log(`Account tier: ${creditInfo.account_tier}`);

go=:package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
)

type CreditResponse struct {
	Limit        float64 `json:"limit"`
	RemainingIRT float64 `json:"remaining_irt"`
	AccountTier  int     `json:"account_tier"`
}

func main() {
	req, _ := http.NewRequest("GET", "https://api.avalai.ir/user/v1/credit", nil)
	req.Header.Set("Authorization", "Bearer "+os.Getenv("AVALAI_API_KEY"))

	resp, _ := (&http.Client{}).Do(req)
	defer resp.Body.Close()

	var credit CreditResponse
	json.NewDecoder(resp.Body).Decode(&credit)
	fmt.Printf("Remaining credit: %.2f IRT\n", credit.RemainingIRT)
}

php=:<?php
$apiKey = getenv('AVALAI_API_KEY');

$ch = curl_init('https://api.avalai.ir/user/v1/credit');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: Bearer ' . $apiKey]);

$response = curl_exec($ch);
curl_close($ch);

$credit = json_decode($response, true);
echo "Remaining credit: " . $credit['remaining_irt'] . " IRT\n";
echo "Account tier: " . $credit['account_tier'] . "\n";
?>

```

#### Response

```json
{
  "limit": 0.0,
  "remaining_irt": 742927.85,
  "remaining_unit": 0.0,
  "total_unit": 6.44622863340564,
  "exchange_rate": 115250,
  "account_tier": 5,
  "credit_sources": {
    "grants": [],
    "packages": [
      {
        "id": "25",
        "template_id": "d-o3050s",
        "name": "مدل‌های زبانی منتخب OpenAI روزانه پایه",
        "description": "٪۴۰ تخفیف در مدل‌های منتخب OpenAI",
        "amount_irt": "500000.00",
        "remaining_irt": "498447.15",
        "end_date": "2025-11-27T15:05:07.404882+00:00",
        "allowed_services": [
          "api"
        ],
        "scope_details": {
          "api": [
            "gpt-5-chat",
            "gpt-5-mini",
            "gpt-5.5",
            "gpt-5.4-mini",
            "o4-mini",
            "o3-mini"
          ]
        }
      }
    ]
  }
}
```

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `limit` | float | Total credit limit in IRT |
| `remaining_irt` | float | Remaining credit in IRT |
| `remaining_unit` | float | Remaining credit in units (USD) |
| `total_unit` | float | Total credit in units |
| `exchange_rate` | int | Current IRT to unit (USD) exchange rate |
| `account_tier` | int | Account tier (0-5), affects rate limits |
| `credit_sources` | object | Breakdown of credit sources |
| `credit_sources.grants` | array | Active grants |
| `credit_sources.packages` | array | Active packages |

#### Credit Source Fields

**Grant:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique grant identifier |
| `description` | string | Grant description |
| `amount_irt` | string | Total grant amount in IRT |
| `remaining_irt` | string | Remaining amount in IRT |
| `end_date` | string | Expiration date (ISO 8601) |
| `allowed_services` | array | Services this grant can be used for |
| `scope_details` | object | Model/provider restrictions |

**Package:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique package identifier |
| `template_id` | string | Package template ID |
| `name` | string | Package name |
| `description` | string | Package description |
| `amount_irt` | string | Total package amount in IRT |
| `remaining_irt` | string | Remaining amount in IRT |
| `end_date` | string | Expiration date (ISO 8601) |
| `allowed_services` | array | Services this package can be used for |
| `scope_details` | object | Model/provider restrictions |

---

### GET /transactions

Get a paginated list of your API transactions.

**URL:** `GET https://api.avalai.ir/user/v1/transactions`

#### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `hours_ago` | int | 24 | Hours to look back (1-720). Ignored if dates provided. |
| `start_date` | string | - | Start date (YYYY-MM-DD). Requires `end_date`. |
| `end_date` | string | - | End date (YYYY-MM-DD). Requires `start_date`. |
| `page` | int | 1 | Page number (1-10000) |
| `page_size` | int | 100 | Items per page (1-1000) |
| `safety_identifier` | string | - | Filter by your internal identifier |
| `api_key_id` | int | - | Filter by specific API key ID |
| `model` | string | - | Filter by model name (partial match) |
| `provider` | string | - | Filter by provider name |
| `status_code` | int | - | Filter by HTTP status code |

#### Examples

```language-selector
bash=:# Last 24 hours (default)
curl -X GET "https://api.avalai.ir/user/v1/transactions" \
  -H "Authorization: Bearer $AVALAI_API_KEY"

# Last 7 days
curl -X GET "https://api.avalai.ir/user/v1/transactions?hours_ago=168" \
  -H "Authorization: Bearer $AVALAI_API_KEY"

# Specific date range
curl -X GET "https://api.avalai.ir/user/v1/transactions?start_date=2025-01-01&end_date=2025-01-07" \
  -H "Authorization: Bearer $AVALAI_API_KEY"

# Filter by model
curl -X GET "https://api.avalai.ir/user/v1/transactions?model=gpt-5.5&page_size=50" \
  -H "Authorization: Bearer $AVALAI_API_KEY"

python=:import requests

api_key = "your-avalai-api-key"
headers = {"Authorization": f"Bearer {api_key}"}

# Last 24 hours (default)
response = requests.get("https://api.avalai.ir/user/v1/transactions", headers=headers)

# With filters
response = requests.get(
    "https://api.avalai.ir/user/v1/transactions",
    headers=headers,
    params={"model": "gpt-5.5", "hours_ago": 168, "page_size": 50},  # Last 7 days
)

transactions = response.json()
for tx in transactions["transactions"]:
    print(f"{tx['id']}: {tx['model']} - {tx['tokens']['total']} tokens")

javascript=:const apiKey = process.env.AVALAI_API_KEY;

// With filters
const params = new URLSearchParams({
  model: "gpt-5.5",
  hours_ago: "168",
  page_size: "50",
});

const response = await fetch(
  `https://api.avalai.ir/user/v1/transactions?${params}`,
  {
    headers: { Authorization: `Bearer ${apiKey}` },
  },
);

const data = await response.json();
data.transactions.forEach((tx) => {
  console.log(`${tx.id}: ${tx.model} - ${tx.tokens.total} tokens`);
});

go=:package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"os"
)

func main() {
	baseURL := "https://api.avalai.ir/user/v1/transactions"
	params := url.Values{}
	params.Add("model", "gpt-5.5")
	params.Add("hours_ago", "168")
	params.Add("page_size", "50")

	req, _ := http.NewRequest("GET", baseURL+"?"+params.Encode(), nil)
	req.Header.Set("Authorization", "Bearer "+os.Getenv("AVALAI_API_KEY"))

	resp, _ := (&http.Client{}).Do(req)
	defer resp.Body.Close()

	var result map[string]interface{}
	json.NewDecoder(resp.Body).Decode(&result)
	fmt.Printf("Total transactions: %v\n", result["total"])
}

php=:<?php
$apiKey = getenv('AVALAI_API_KEY');

$params = http_build_query([
    'model' => 'gpt-5.5',
    'hours_ago' => 168,
    'page_size' => 50
]);

$ch = curl_init('https://api.avalai.ir/user/v1/transactions?' . $params);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: Bearer ' . $apiKey]);

$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);
foreach ($data['transactions'] as $tx) {
    echo $tx['id'] . ': ' . $tx['model'] . ' - ' . $tx['tokens']['total'] . " tokens\n";
}
?>

```

#### Response

```json
{
  "transactions": [
    {
      "id": "019ac1c0-9ff3-7663-b0b9-fbcf2461939a",
      "created_at": "2025-11-26T20:06:23.442Z",
      "requested_at": "2025-11-26T20:00:18.031Z",
      "safety_identifier": null,
      "model": "gpt-5.4-mini",
      "provider": "openai",
      "status_code": 200,
      "stream": false,
      "tokens": {
        "total": 30,
        "prompt": 10,
        "completion": 20,
        "reasoning": 0,
        "cached": 0
      }
    }
  ],
  "total": 100,
  "page": 1,
  "page_size": 100,
  "has_more": false
}
```

#### Transaction Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique transaction identifier (UUID v7) - same as `x-request-id` header |
| `created_at` | string | Transaction cost processing time - when the transaction was processed and its cost was calculated (ISO 8601) |
| `requested_at` | string | Request initiation time (ISO 8601) |
| `model` | string | Model used (e.g., "gpt-5.4") |
| `provider` | string | Provider name (e.g., "openai", "anthropic") |
| `status_code` | int | HTTP response status code |
| `stream` | bool | Whether request used streaming |
| `tokens.total` | int | Total tokens used |
| `tokens.prompt` | int | Prompt tokens |
| `tokens.completion` | int | Completion tokens |
| `tokens.reasoning` | int | Reasoning tokens (o1/o3 models) |
| `tokens.cached` | int | Cached tokens (prompt caching) |
| `safety_identifier` | string | Your internal identifier (if provided) |

---

### POST /transactions/lookup

Lookup specific transactions by their UUIDs. This is the key endpoint for **precise cost tracking** - use the `x-request-id` from API response headers to get exact cost details.

**URL:** `POST https://api.avalai.ir/user/v1/transactions/lookup`

> **Important for Resellers:** This endpoint returns the **exact cost** of any API request, which is 100% accurate and available within 30 seconds of the request completing. See the [Reseller Cost Tracking Guide](en/resellers/cost-tracking-guide.md) for a complete workflow.

#### Retrieving Request ID from SDKs

When using official SDKs like the OpenAI Python SDK, the `x-request-id` header is automatically captured and made available through the response object. Here's how to access it in different SDKs:

**Python (OpenAI SDK)**

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

# Access the request ID from the response object
request_id = response._request_id
print(f"Request ID: {request_id}")

# You can now use this request_id to lookup the transaction cost
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


> **Note:** The `_request_id` attribute is available on all response objects returned by the OpenAI SDK when configured with AvalAI's base URL. This includes responses from chat completions, embeddings, images, and other endpoints.

**Other SDKs**

For SDKs in other languages, you typically need to access the response headers directly:

| SDK | Method to Access Request ID |
|-----|----------------------------|
| Python (OpenAI) | `response._request_id` |
| Python (requests) | `response.headers.get("x-request-id")` |
| JavaScript (fetch) | `response.headers.get("x-request-id")` |
| Go (net/http) | `resp.Header.Get("x-request-id")` |
| PHP (curl) | Extract from response headers |

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `transaction_ids` | array | Yes | List of transaction UUIDs (1-1000) |

#### Example

```language-selector
bash=:# First, make an API call and capture the x-request-id header
curl -i "https://api.avalai.ir/v1/chat/completions" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-5.4-mini",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'

# Response headers will include:
# x-request-id: 019ac4a0-a8f4-7041-845f-3ea8f15dcf1a

# Then lookup the transaction (wait up to 30 seconds for processing)
curl -X POST "https://api.avalai.ir/user/v1/transactions/lookup" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "transaction_ids": ["019ac4a0-a8f4-7041-845f-3ea8f15dcf1a"]
  }'

python=:import requests
import time

api_key = "your-avalai-api-key"
headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}

# Step 1: Make an API call and capture x-request-id
response = requests.post(
    "https://api.avalai.ir/v1/chat/completions",
    headers=headers,
    json={"model": "gpt-5.4-mini", "messages": [{"role": "user", "content": "Hello!"}]},
)

# Get the request ID from response headers
request_id = response.headers.get("x-request-id")
print(f"Request ID: {request_id}")

# Step 2: Wait for processing (up to 30 seconds)
time.sleep(5)  # Usually available much sooner

# Step 3: Lookup the transaction for precise cost
lookup_response = requests.post(
    "https://api.avalai.ir/user/v1/transactions/lookup",
    headers=headers,
    json={"transaction_ids": [request_id]},
)

transaction = lookup_response.json()
if transaction["summary"]["found"] > 0:
    tx = transaction["transactions"][0]
    print(f"Exact cost: {tx['cost']['unit']} USD")
    print(f"Exact cost: {tx['cost']['paid_irt']} IRT")

javascript=:const apiKey = process.env.AVALAI_API_KEY;
const headers = {
  Authorization: `Bearer ${apiKey}`,
  "Content-Type": "application/json",
};

// Step 1: Make an API call and capture x-request-id
const chatResponse = await fetch("https://api.avalai.ir/v1/chat/completions", {
  method: "POST",
  headers,
  body: JSON.stringify({
    model: "gpt-5.4-mini",
    messages: [{ role: "user", content: "Hello!" }],
  }),
});

// Get the request ID from response headers
const requestId = chatResponse.headers.get("x-request-id");
console.log(`Request ID: ${requestId}`);

// Step 2: Wait for processing
await new Promise((resolve) => setTimeout(resolve, 5000));

// Step 3: Lookup the transaction for precise cost
const lookupResponse = await fetch(
  "https://api.avalai.ir/user/v1/transactions/lookup",
  {
    method: "POST",
    headers,
    body: JSON.stringify({ transaction_ids: [requestId] }),
  },
);

const data = await lookupResponse.json();
if (data.summary.found > 0) {
  const tx = data.transactions[0];
  console.log(`Exact cost: ${tx.cost.unit} USD`);
  console.log(`Exact cost: ${tx.cost.paid_irt} IRT`);
}

go=:package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"
)

func main() {
	apiKey := os.Getenv("AVALAI_API_KEY")

	// Step 1: Make an API call
	chatBody, _ := json.Marshal(map[string]interface{}{
		"model":    "gpt-5.4-mini",
		"messages": []map[string]string{{"role": "user", "content": "Hello!"}},
	})

	req, _ := http.NewRequest("POST", "https://api.avalai.ir/v1/chat/completions", bytes.NewBuffer(chatBody))
	req.Header.Set("Authorization", "Bearer "+apiKey)
	req.Header.Set("Content-Type", "application/json")

	resp, _ := (&http.Client{}).Do(req)
	requestID := resp.Header.Get("x-request-id")
	resp.Body.Close()
	fmt.Printf("Request ID: %s\n", requestID)

	// Step 2: Wait for processing
	time.Sleep(5 * time.Second)

	// Step 3: Lookup the transaction
	lookupBody, _ := json.Marshal(map[string]interface{}{
		"transaction_ids": []string{requestID},
	})

	req, _ = http.NewRequest("POST", "https://api.avalai.ir/user/v1/transactions/lookup", bytes.NewBuffer(lookupBody))
	req.Header.Set("Authorization", "Bearer "+apiKey)
	req.Header.Set("Content-Type", "application/json")

	resp, _ = (&http.Client{}).Do(req)
	defer resp.Body.Close()

	var result map[string]interface{}
	json.NewDecoder(resp.Body).Decode(&result)
	fmt.Printf("Result: %+v\n", result)
}

php=:<?php
$apiKey = getenv('AVALAI_API_KEY');

// Step 1: Make an API call and capture x-request-id
$ch = curl_init('https://api.avalai.ir/v1/chat/completions');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $apiKey,
    'Content-Type: application/json'
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'model' => 'gpt-5.4-mini',
    'messages' => [['role' => 'user', 'content' => 'Hello!']]
]));

$response = curl_exec($ch);
$headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
$headers = substr($response, 0, $headerSize);
curl_close($ch);

// Extract x-request-id from headers
preg_match('/x-request-id:\s*([^\r\n]+)/i', $headers, $matches);
$requestId = trim($matches[1] ?? '');
echo "Request ID: $requestId\n";

// Step 2: Wait for processing
sleep(5);

// Step 3: Lookup the transaction
$ch = curl_init('https://api.avalai.ir/user/v1/transactions/lookup');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $apiKey,
    'Content-Type: application/json'
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'transaction_ids' => [$requestId]
]));

$lookupResponse = curl_exec($ch);
curl_close($ch);

$data = json_decode($lookupResponse, true);
if ($data['summary']['found'] > 0) {
    $tx = $data['transactions'][0];
    echo "Exact cost: " . $tx['cost']['unit'] . " USD\n";
    echo "Exact cost: " . $tx['cost']['paid_irt'] . " IRT\n";
}
?>

```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version</summary>

Use this version when the selected model supports `/v1/responses`. `messages` moves to `input`, and the final text is read from `response.output_text`.

```language-selector
python=:import os
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

javascript=:import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.responses.create({
  model: "gpt-5.4-mini",
  instructions: "You are a helpful assistant.",
  input: "Hello!",
});

console.log(response.output_text);

bash=:curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '
  {
    "model": "gpt-5.4-mini",
    "input": "Hello!",
    "instructions": "You are a helpful assistant."
  }'

```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


#### Response

**Example 1: Paid from UNIT balance (no credit package)**

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
        "cached": 0,
        "prompt_details": {
          "text_tokens": 8,
          "audio_tokens": 0,
          "image_tokens": 0,
          "cached_tokens": 0,
          "audio_input_duration": 0,
          "cache_creation_tokens": 0
        },
        "completion_details": {
          "text_tokens": 9,
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
      "api_key_suffix": "...6I20",
      "cost": {
        "unit": "0.00000660",
        "paid_unit": "0.00000660",
        "paid_irt": "0",
        "paid_grant_irt": "0",
        "source": "credit",
        "currency": "UNIT"
      },
      "grants": [],
      "packages": []
    }
  ],
  "summary": {
    "requested": 1,
    "found": 1,
    "not_found_ids": []
  }
}
```

**Example 2: Paid from credit package**

```json
{
  "transactions": [
    {
      "id": "019ac1c0-9518-7931-bf77-518cfbdd89f0",
      "created_at": "2025-11-26T20:06:22.555Z",
      "requested_at": "2025-11-26T20:00:15.228Z",
      "safety_identifier": null,
      "model": "gpt-5.4-mini",
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
              "gpt-5.5",
              "gpt-5.4-mini"
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

#### Response Fields

**Root Object:**

| Field | Type | Description |
|-------|------|-------------|
| `transactions` | array | Array of transaction objects |
| `summary` | object | Summary of the lookup request |

**Transaction Object:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique transaction identifier (UUID v7) - same as `x-request-id` header |
| `created_at` | string | Transaction cost processing time (ISO 8601) |
| `requested_at` | string | Request initiation time (ISO 8601) |
| `safety_identifier` | string\|null | Your internal identifier (if provided) |
| `model` | string | Model used (e.g., "gpt-5.4-mini-2026-03-17") |
| `provider` | string | Provider name (e.g., "openai", "anthropic") |
| `status_code` | int | HTTP response status code |
| `stream` | bool | Whether request used streaming |
| `tokens` | object | Token usage breakdown |
| `ip_address` | string | Request IP address |
| `tools` | object | Tools/functions used in the request |
| `api_key_suffix` | string | Last 4 characters of the API key used |
| `cost` | object | Cost breakdown |
| `grants` | array | Grants used for this transaction |
| `packages` | array | Packages used for this transaction |

**Tokens Object:**

| Field | Type | Description |
|-------|------|-------------|
| `total` | int | Total tokens used |
| `prompt` | int | Prompt tokens |
| `completion` | int | Completion tokens |
| `reasoning` | int | Reasoning tokens (o1/o3 models) |
| `cached` | int | Cached tokens (prompt caching) |
| `prompt_details` | object | Detailed breakdown of prompt tokens |
| `completion_details` | object | Detailed breakdown of completion tokens |

**Prompt Details Object:**

| Field | Type | Description |
|-------|------|-------------|
| `text_tokens` | int | Text tokens in prompt |
| `audio_tokens` | int | Audio tokens in prompt |
| `image_tokens` | int | Image tokens in prompt |
| `cached_tokens` | int | Cached tokens in prompt |
| `audio_input_duration` | int | Audio input duration in seconds |
| `cache_creation_tokens` | int | Tokens used for cache creation |

**Completion Details Object:**

| Field | Type | Description |
|-------|------|-------------|
| `text_tokens` | int | Text tokens in completion |
| `audio_tokens` | int | Audio tokens in completion |
| `image_tokens` | int | Image tokens in completion |
| `reasoning_tokens` | int | Reasoning tokens in completion |
| `audio_output_duration` | int | Audio output duration in seconds |
| `accepted_prediction_tokens` | int | Accepted prediction tokens |
| `rejected_prediction_tokens` | int | Rejected prediction tokens |

**Cost Object:**

| Field | Type | Description |
|-------|------|-------------|
| `unit` | string | Total cost in USD/UNIT |
| `paid_unit` | string | Paid cost in USD/UNIT |
| `paid_irt` | string | Paid cost in IRT (from balance) |
| `paid_grant_irt` | string | Cost covered by grants/packages |
| `source` | string | Payment source: `credit`, `credit_package`, `grant`, or `balance` |
| `currency` | string | Currency type (always "UNIT") |

#### Summary Fields

| Field | Type | Description |
|-------|------|-------------|
| `requested` | int | Number of IDs requested |
| `found` | int | Number of transactions found |
| `not_found_ids` | array | IDs that were not found (may still be processing) |

---

### GET /transactions/summary


Get aggregated statistics for your API usage.

**URL:** `GET https://api.avalai.ir/user/v1/transactions/summary`

> **Note:** Time range is limited to 24 hours maximum for performance. Results are cached for 2 minutes.

#### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `hours_ago` | int | 24 | Hours to look back (1-24). Ignored if dates provided. |
| `start_date` | string | - | Start date (YYYY-MM-DD). Clamped to 24h max. |
| `end_date` | string | - | End date (YYYY-MM-DD). |
| `safety_identifier` | string | - | Filter by your internal identifier |
| `api_key_id` | int | - | Filter by specific API key ID |
| `group_by` | string | - | Group by: `day`, `model`, `safety_identifier`, `api_key`, `provider` |

#### Examples

```language-selector
bash=:# Last 24 hours (default)
curl -X GET "https://api.avalai.ir/user/v1/transactions/summary" \
  -H "Authorization: Bearer $AVALAI_API_KEY"

# Group by model
curl -X GET "https://api.avalai.ir/user/v1/transactions/summary?group_by=model" \
  -H "Authorization: Bearer $AVALAI_API_KEY"

# Group by provider
curl -X GET "https://api.avalai.ir/user/v1/transactions/summary?group_by=provider" \
  -H "Authorization: Bearer $AVALAI_API_KEY"

# Group by API key
curl -X GET "https://api.avalai.ir/user/v1/transactions/summary?group_by=api_key" \
  -H "Authorization: Bearer $AVALAI_API_KEY"

python=:import requests

api_key = "your-avalai-api-key"
headers = {"Authorization": f"Bearer {api_key}"}

# Get summary grouped by model
response = requests.get(
    "https://api.avalai.ir/user/v1/transactions/summary",
    headers=headers,
    params={"group_by": "model"},
)

summary = response.json()
print(f"Total transactions: {summary['totals']['transactions']}")
print(f"Total cost: {summary['totals']['cost']['unit']} USD")

if summary.get("by_model"):
    for model in summary["by_model"]:
        print(
            f"  {model['model']}: {model['transactions']} requests, {model['cost_unit']} USD"
        )

javascript=:const apiKey = process.env.AVALAI_API_KEY;

// Get summary grouped by model
const params = new URLSearchParams({ group_by: "model" });

const response = await fetch(
  `https://api.avalai.ir/user/v1/transactions/summary?${params}`,
  {
    headers: { Authorization: `Bearer ${apiKey}` },
  },
);

const summary = await response.json();
console.log(`Total transactions: ${summary.totals.transactions}`);
console.log(`Total cost: ${summary.totals.cost.unit} USD`);

if (summary.by_model) {
  summary.by_model.forEach((model) => {
    console.log(`  ${model.model}: ${model.transactions} requests`);
  });
}

go=:package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"os"
)

func main() {
	baseURL := "https://api.avalai.ir/user/v1/transactions/summary"
	params := url.Values{}
	params.Add("group_by", "model")

	req, _ := http.NewRequest("GET", baseURL+"?"+params.Encode(), nil)
	req.Header.Set("Authorization", "Bearer "+os.Getenv("AVALAI_API_KEY"))

	resp, _ := (&http.Client{}).Do(req)
	defer resp.Body.Close()

	var result map[string]interface{}
	json.NewDecoder(resp.Body).Decode(&result)

	totals := result["totals"].(map[string]interface{})
	fmt.Printf("Total transactions: %v\n", totals["transactions"])
}

php=:<?php
$apiKey = getenv('AVALAI_API_KEY');

$params = http_build_query(['group_by' => 'model']);

$ch = curl_init('https://api.avalai.ir/user/v1/transactions/summary?' . $params);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: Bearer ' . $apiKey]);

$response = curl_exec($ch);
curl_close($ch);

$summary = json_decode($response, true);
echo "Total transactions: " . $summary['totals']['transactions'] . "\n";
echo "Total cost: " . $summary['totals']['cost']['unit'] . " USD\n";

if (!empty($summary['by_model'])) {
    foreach ($summary['by_model'] as $model) {
        echo "  " . $model['model'] . ": " . $model['transactions'] . " requests\n";
    }
}
?>

```

#### Response (Basic)

```json
{
  "period": {
    "start": "2025-11-26T08:36:24.685Z",
    "end": "2025-11-27T08:36:24.685Z"
  },
  "totals": {
    "transactions": 1011,
    "tokens": {
      "total": 31863,
      "prompt": 11362,
      "completion": 20501,
      "reasoning": 294,
      "cached": 0
    },
    "cost": {
      "unit": "0.01466890",
      "paid_unit": "0.01466890",
      "paid_irt": "131.73",
      "paid_grant_irt": "1552.85"
    }
  },
  "breakdown": null,
  "by_model": null,
  "by_safety_identifier": null,
  "by_provider": null,
  "by_api_key": null
}
```

#### Response (with group_by=model)

```json
{
  "period": {
    "start": "2025-11-26T09:09:31.342Z",
    "end": "2025-11-27T09:09:31.342Z"
  },
  "totals": {
    "transactions": 1011,
    "tokens": {
      "total": 31863,
      "prompt": 11362,
      "completion": 20501,
      "reasoning": 294,
      "cached": 0
    },
    "cost": {
      "unit": "0.01466890",
      "paid_unit": "0.01466890",
      "paid_irt": "131.73",
      "paid_grant_irt": "1552.85"
    }
  },
  "by_model": [
    {
      "model": "gpt-5.4-mini",
      "transactions": 1000,
      "tokens": 30000,
      "cost_unit": "0.01350000"
    },
    {
      "model": "gemini-2.5-flash",
      "transactions": 3,
      "tokens": 1529,
      "cost_unit": "0.00097790"
    },
    {
      "model": "deepseek-reasoner",
      "transactions": 1,
      "tokens": 114,
      "cost_unit": "0.00004720"
    }
  ]
}
```

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `period.start` | string | Start of the reporting period (ISO 8601) |
| `period.end` | string | End of the reporting period (ISO 8601) |
| `totals.transactions` | int | Total number of transactions |
| `totals.tokens.total` | int | Total tokens used |
| `totals.tokens.prompt` | int | Total prompt tokens |
| `totals.tokens.completion` | int | Total completion tokens |
| `totals.tokens.reasoning` | int | Total reasoning tokens |
| `totals.tokens.cached` | int | Total cached tokens |
| `totals.cost.unit` | string | Total cost in USD/UNIT |
| `totals.cost.paid_unit` | string | Paid cost in USD/UNIT |
| `totals.cost.paid_irt` | string | Paid cost in IRT |
| `totals.cost.paid_grant_irt` | string | Cost covered by grants |

#### Group By Fields

When using `group_by`, the response includes the corresponding array:

**by_model:**

| Field | Type | Description |
|-------|------|-------------|
| `model` | string | Model name |
| `transactions` | int | Number of transactions |
| `tokens` | int | Total tokens |
| `cost_unit` | string | Total cost in USD |

**by_provider:**

| Field | Type | Description |
|-------|------|-------------|
| `provider` | string | Provider name |
| `transactions` | int | Number of transactions |
| `tokens` | int | Total tokens |

**by_api_key:**

| Field | Type | Description |
|-------|------|-------------|
| `api_key_id` | string | API key ID |
| `api_key_suffix` | string | Last 4 characters of API key |
| `transactions` | int | Number of transactions |
| `tokens` | int | Total tokens |

**by_safety_identifier:**

| Field | Type | Description |
|-------|------|-------------|
| `safety_identifier` | string | Your internal identifier |
| `transactions` | int | Number of transactions |
| `tokens` | int | Total tokens |

---

### GET /health

Check the health status of the User API.

**URL:** `GET https://api.avalai.ir/user/v1/health`

#### Request

```language-selector
bash=:curl -X GET "https://api.avalai.ir/user/v1/health" \
  -H "Authorization: Bearer $AVALAI_API_KEY"

python=:import requests

response = requests.get(
    "https://api.avalai.ir/user/v1/health",
    headers={"Authorization": f"Bearer {api_key}"},
)
print(response.json())

javascript=:const response = await fetch("https://api.avalai.ir/user/v1/health", {
  headers: { Authorization: `Bearer ${process.env.AVALAI_API_KEY}` },
});
console.log(await response.json());

go=:package main

import (
	"fmt"
	"io"
	"net/http"
	"os"
)

func main() {
	req, _ := http.NewRequest("GET", "https://api.avalai.ir/user/v1/health", nil)
	req.Header.Set("Authorization", "Bearer "+os.Getenv("AVALAI_API_KEY"))

	resp, _ := (&http.Client{}).Do(req)
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	fmt.Println(string(body))
}

php=:<?php
$ch = curl_init('https://api.avalai.ir/user/v1/health');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: Bearer ' . getenv('AVALAI_API_KEY')]);

$response = curl_exec($ch);
curl_close($ch);

print_r(json_decode($response, true));
?>

```

#### Response

```json
{
  "status": "healthy",
  "timestamp": "2025-11-27T09:30:00.000Z"
}
```

---

## Error Handling

The User API uses standard HTTP status codes and returns JSON error responses.

### Error Response Format

```json
{
  "error": "error_code",
  "message": "Human-readable error description"
}
```

### Common Errors

| Status Code | Error Code | Description |
|-------------|------------|-------------|
| 400 | `bad_request` | Invalid request parameters |
| 401 | `unauthorized` | Missing or invalid API key |
| 403 | `forbidden` | Account suspended or inactive |
| 404 | `not_found` | Resource not found |
| 429 | `rate_limit_exceeded` | Too many requests |
| 500 | `internal_error` | Server error |

---

## Related Resources

- [Response Headers](en/api-reference/response-headers.md) - Learn about `x-request-id` and rate limit headers
- [Reseller Cost Tracking Guide](en/resellers/cost-tracking-guide.md) - Step-by-step guide for precise cost tracking
- [Rate Limits](en/guides/rate-limits.md) - Understanding rate limits and tiers
- [Authentication](en/api-reference/authentication.md) - API key management
- [Chat Completions](en/api-reference/chat.md) - Main API endpoint documentation
