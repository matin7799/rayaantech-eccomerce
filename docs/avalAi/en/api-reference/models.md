# Models API

The Models API allows you to list available models and retrieve detailed information about specific models, including pricing, rate limits, and capabilities. AvalAI supports both OpenAI and Anthropic API formats.

## Endpoints

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/v1/models` | Yes | List all available models |
| GET | `/v1/models/{model_id}` | Yes | Retrieve a specific model |
| GET | `/public/models` | No | Public list of models |

## Authentication Detection

AvalAI automatically detects the response format based on your authentication header:

| Header Format | Response Format |
|---------------|-----------------|
| `Authorization: Bearer API_KEY` | OpenAI format |
| `x-api-key: API_KEY` | Anthropic format |

## List Models

Lists all currently available models with basic information about each one.

### OpenAI Format

```
GET https://api.avalai.ir/v1/models
```

#### Request Headers

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | Bearer token: `Bearer YOUR_API_KEY` |

#### Example Request (OpenAI Format)

```language-selector
bash=:curl https://api.avalai.ir/v1/models \
  -H "Authorization: Bearer $AVALAI_API_KEY"

python=:from openai import OpenAI

client = OpenAI(
    api_key="your-avalai-api-key",
    base_url="https://api.avalai.ir/v1",
)

models = client.models.list()

for model in models.data:
    print(f"{model.id} - {model.owned_by}")

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const models = await client.models.list();

for (const model of models.data) {
  console.log(`${model.id} - ${model.owned_by}`);
}

go=:package main

import (
	"context"
	"fmt"
	"os"

	"github.com/openai/openai-go"
	"github.com/openai/openai-go/option"
)

func main() {
	client := openai.NewClient(
		option.WithAPIKey(os.Getenv("AVALAI_API_KEY")),
		option.WithBaseURL("https://api.avalai.ir/v1"),
	)

	models, err := client.Models.List(context.Background())
	if err != nil {
		panic(err)
	}

	for _, model := range models.Data {
		fmt.Printf("%s - %s\n", model.ID, model.OwnedBy)
	}
}

php=:<?php

require 'vendor/autoload.php';

$apiKey = getenv('AVALAI_API_KEY');
$customBaseUrl = 'https://api.avalai.ir/v1';

$client = OpenAI::factory()
    ->withApiKey($apiKey)
    ->withBaseUri($customBaseUrl)
    ->make();

$models = $client->models()->list();

foreach ($models->data as $model) {
    echo $model->id . " - " . $model->ownedBy . "\n";
}

```

#### Response (OpenAI Format)

```json
{
  "object": "list",
  "data": [
    {
      "id": "glm-5.2",
      "object": "model",
      "owned_by": "zai",
      "min_tier": 0,
      "pricing": {
        "input": 1.4,
        "cached_input": 0.26,
        "output": 4.4
      },
      "mode": "chat",
      "max_tokens": 1000000,
      "max_input_tokens": 991000,
      "max_output_tokens": 128000,
      "supports_function_calling": true,
      "supports_prompt_caching": true,
      "supports_tool_choice": true
    },
    {
      "id": "kimi-k2.7-code",
      "object": "model",
      "owned_by": "moonshot",
      "min_tier": 0,
      "pricing": {
        "input": 1.045,
        "cached_input": 0.19,
        "output": 4.4
      },
      "mode": "chat",
      "max_tokens": 262144,
      "max_input_tokens": 262144,
      "max_output_tokens": 262144,
      "supports_function_calling": true,
      "supports_tool_choice": true,
      "supports_web_search": true
    }
  ]
}
```

### Anthropic Format

When using the `x-api-key` header, the response follows Anthropic's API format.

#### Request Headers

| Header | Required | Description |
|--------|----------|-------------|
| `x-api-key` | Yes | Your API key |

#### Example Request (Anthropic Format)

```language-selector
bash=:curl https://api.avalai.ir/v1/models \
  -H "x-api-key: $AVALAI_API_KEY"

python=:import anthropic

client = anthropic.Anthropic(
    api_key="your-avalai-api-key",
    base_url="https://api.avalai.ir",
)

models = client.models.list()

for model in models.data:
    print(f"{model.id} - {model.display_name}")

javascript=:import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir",
});

const models = await client.models.list();

for (const model of models.data) {
  console.log(`${model.id} - ${model.display_name}`);
}

```

#### Response (Anthropic Format)

```json
{
  "data": [
    {
      "id": "claude-sonnet-4-20250514",
      "created_at": "2025-02-19T00:00:00Z",
      "display_name": "Claude Sonnet 4",
      "type": "model"
    },
    {
      "id": "claude-3-5-sonnet-20241022",
      "created_at": "2024-10-22T00:00:00Z",
      "display_name": "Claude 3.5 Sonnet",
      "type": "model"
    }
  ],
  "first_id": "claude-sonnet-4-20250514",
  "has_more": true,
  "last_id": "claude-3-5-sonnet-20241022"
}
```

#### Query Parameters (Anthropic Format)

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `after_id` | string | No | Return results after this model ID |
| `before_id` | string | No | Return results before this model ID |
| `limit` | number | No | Maximum number of models to return |

## Public Models

A public endpoint that returns the list of available models without requiring authentication. This is useful for displaying model options to users before they authenticate.

```
GET https://api.avalai.ir/public/models
```

### Example Request

```language-selector
bash=:curl https://api.avalai.ir/public/models

python=:import requests

response = requests.get("https://api.avalai.ir/public/models")
models = response.json()

for model in models["data"]:
    print(f"{model['id']} - {model['owned_by']}")

javascript=:const response = await fetch("https://api.avalai.ir/public/models");
const models = await response.json();

for (const model of models.data) {
  console.log(`${model.id} - ${model.owned_by}`);
}

go=:package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

func main() {
	resp, err := http.Get("https://api.avalai.ir/public/models")
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	var result map[string]interface{}
	json.NewDecoder(resp.Body).Decode(&result)

	data := result["data"].([]interface{})
	for _, model := range data {
		m := model.(map[string]interface{})
		fmt.Printf("%s - %s\n", m["id"], m["owned_by"])
	}
}

php=:<?php

$response = file_get_contents("https://api.avalai.ir/public/models");
$models = json_decode($response, true);

foreach ($models["data"] as $model) {
    echo $model["id"] . " - " . $model["owned_by"] . "\n";
}

```

The response format is identical to the OpenAI format list endpoint.

## Retrieve Model

Retrieves detailed information about a specific model, including AvalAI-specific metadata, pricing, and rate limits.

```
GET https://api.avalai.ir/v1/models/{model_id}
```

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `model_id` | string | Yes | The ID of the model to retrieve (e.g., `gpt-5.5`, `claude-sonnet-4.6`) |

### OpenAI Format Response

When using `Authorization: Bearer` header, the response includes the standard OpenAI fields plus an AvalAI-specific `extra` object.

#### Example Request (OpenAI Format)

```language-selector
bash=:curl https://api.avalai.ir/v1/models/gpt-5.5 \
  -H "Authorization: Bearer $AVALAI_API_KEY"

python=:from openai import OpenAI

client = OpenAI(
    api_key="your-avalai-api-key",
    base_url="https://api.avalai.ir/v1",
)

model = client.models.retrieve("gpt-5.5")

print(f"Model: {model.id}")
print(f"Owned by: {model.owned_by}")

# Access AvalAI extra data (available as additional fields)
print(f"Extra data: {model.model_extra}")

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const model = await client.models.retrieve("gpt-5.5");

console.log(`Model: ${model.id}`);
console.log(`Owned by: ${model.owned_by}`);

go=:package main

import (
	"context"
	"fmt"
	"os"

	"github.com/openai/openai-go"
	"github.com/openai/openai-go/option"
)

func main() {
	client := openai.NewClient(
		option.WithAPIKey(os.Getenv("AVALAI_API_KEY")),
		option.WithBaseURL("https://api.avalai.ir/v1"),
	)

	model, err := client.Models.Get(context.Background(), "gpt-5.5")
	if err != nil {
		panic(err)
	}

	fmt.Printf("Model: %s\n", model.ID)
	fmt.Printf("Owned by: %s\n", model.OwnedBy)
}

php=:<?php

require 'vendor/autoload.php';

$apiKey = getenv('AVALAI_API_KEY');
$customBaseUrl = 'https://api.avalai.ir/v1';

$client = OpenAI::factory()
    ->withApiKey($apiKey)
    ->withBaseUri($customBaseUrl)
    ->make();

$model = $client->models()->retrieve('gpt-5.5');

echo "Model: " . $model->id . "\n";
echo "Owned by: " . $model->ownedBy . "\n";

```

#### Response (OpenAI Format with AvalAI Extra)

```json
{
  "id": "gpt-5.5",
  "object": "model",
  "created": 1765622594,
  "owned_by": "openai",
  "extra": {
    "metadata": {
      "min_tier": 0,
      "mode": "chat",
      "max_tokens": 128000,
      "max_input_tokens": 1050000,
      "max_output_tokens": 128000,
      "supports_system_messages": true,
      "supports_function_calling": true,
      "supports_parallel_function_calling": true,
      "supports_vision": true,
      "supports_pdf_input": true,
      "supports_prompt_caching": true,
      "supports_tool_choice": true,
      "supports_response_schema": true
    },
    "pricing": {
      "input": 5.0,
      "cached_input": 0.5,
      "output": 30.0
    },
    "rate_limits": {
      "tiers": {
        "0": {
          "rpm": 3.0,
          "tpm": 40000.0
        },
        "1": {
          "rpm": 500.0,
          "tpm": 300000.0
        },
        "2": {
          "rpm": 5000.0,
          "tpm": 3000000.0
        },
        "3": {
          "rpm": 5000.0,
          "tpm": 4000000.0
        },
        "4": {
          "rpm": 10000.0,
          "tpm": 10000000.0
        },
        "5": {
          "rpm": 10000.0,
          "tpm": 30000000.0
        }
      },
      "current": {
        "tier": 5,
        "rpm": 10000.0,
        "tpm": 30000000.0
      }
    }
  }
}
```

### Anthropic Format Response

When using `x-api-key` header, the response follows Anthropic's model format with AvalAI's `extra` object included.

#### Example Request (Anthropic Format)

```language-selector
bash=:curl https://api.avalai.ir/v1/models/claude-sonnet-4-20250514 \
  -H "x-api-key: $AVALAI_API_KEY"

python=:import anthropic

client = anthropic.Anthropic(
    api_key="your-avalai-api-key",
    base_url="https://api.avalai.ir",
)

model = client.models.retrieve("claude-sonnet-4-20250514")

print(f"Model: {model.id}")
print(f"Display name: {model.display_name}")
print(f"Created at: {model.created_at}")

javascript=:import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir",
});

const model = await client.models.retrieve("claude-sonnet-4-20250514");

console.log(`Model: ${model.id}`);
console.log(`Display name: ${model.display_name}`);
console.log(`Created at: ${model.created_at}`);

```

#### Response (Anthropic Format with AvalAI Extra)

```json
{
  "id": "anthropic.claude-sonnet-4-20250514-v1:0",
  "type": "model",
  "display_name": "Anthropic.Claude Sonnet 4 20250514 V1:0",
  "created_at": "2024-01-01T00:00:00Z",
  "extra": {
    "metadata": {
      "min_tier": 1,
      "mode": "chat",
      "max_tokens": 64000,
      "max_input_tokens": 1000000,
      "max_output_tokens": 64000,
      "supports_function_calling": true,
      "supports_vision": true,
      "supports_pdf_input": true,
      "supports_prompt_caching": true,
      "supports_tool_choice": true,
      "supports_response_schema": true,
      "search_context_cost_per_query": {
        "search_context_size_high": 0.01,
        "search_context_size_low": 0.01,
        "search_context_size_medium": 0.01
      }
    },
    "pricing": {
      "input": 3.0,
      "cached_input": 1.5,
      "output": 15.0
    },
    "rate_limits": {
      "tiers": {
        "1": {
          "rpm": 10.0,
          "tpm": 80000.0
        },
        "2": {
          "rpm": 25.0,
          "tpm": 160000.0
        },
        "3": {
          "rpm": 50.0,
          "tpm": 400000.0
        },
        "4": {
          "rpm": 80.0,
          "tpm": 800000.0
        },
        "5": {
          "rpm": 100.0,
          "tpm": 1000000.0
        }
      },
      "current": {
        "tier": 5,
        "rpm": 100.0,
        "tpm": 1000000.0
      }
    }
  }
}
```

## Response Schema

### Model Object (OpenAI Format)

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | The model identifier |
| `object` | string | Always "model" |
| `created` | integer | Unix timestamp when the model was created |
| `owned_by` | string | The organization that owns the model |

### Model Object (Anthropic Format)

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | The model identifier |
| `created_at` | string | ISO 8601 timestamp when the model was created |
| `display_name` | string | Human-readable name for the model |
| `type` | string | Always "model" |

### AvalAI Extra Object

The `extra` object is returned only on the retrieve endpoint and contains AvalAI-specific information.

#### Metadata Object

| Field | Type | Description |
|-------|------|-------------|
| `min_tier` | integer | Minimum [tier](en/rate-limits.md) required to use this model (0-5) |
| `mode` | string | Model mode. One of: `chat`, `embedding`, `completion`, `image_generation`, `video_generation`, `audio_transcription`, `audio_speech`, `ocr`, `moderation`, `rerank`, `search` |
| `max_tokens` | integer | Maximum total tokens |
| `max_input_tokens` | integer | Maximum input tokens |
| `max_output_tokens` | integer | Maximum output tokens |
| `supports_system_messages` | boolean | Whether model supports system messages |
| `supports_function_calling` | boolean | Whether model supports function/tool calling |
| `supports_parallel_function_calling` | boolean | Whether model supports parallel function calls |
| `supports_vision` | boolean | Whether model supports image inputs |
| `supports_pdf_input` | boolean | Whether model supports PDF file inputs |
| `supports_prompt_caching` | boolean | Whether model supports prompt caching |
| `supports_tool_choice` | boolean | Whether model supports tool choice parameter |
| `supports_response_schema` | boolean | Whether model supports structured output schemas |

#### Pricing Object

Pricing varies by model type. The fields present depend on the model's mode.

**Standard Token-Based Pricing (chat, embedding, completion models):**

| Field | Type | Description |
|-------|------|-------------|
| `input` | number | Cost per 1M input tokens (USD) |
| `cached_input` | number | Cost per 1M cached input tokens (USD) |
| `output` | number | Cost per 1M output tokens (USD) |
| `audio_input` | number | (Optional) Cost per 1M audio input tokens (USD) |
| `image_input` | number | (Optional) Cost per 1M image input tokens (USD) |
| `image_output` | number | (Optional) Cost per 1M image output tokens (USD) |
| `search_context_cost_per_query` | object | (Optional) Search context pricing for search-enabled chat models |

**Image Generation Models (`mode: image_generation`):**

| Field | Type | Description |
|-------|------|-------------|
| `output_cost_per_image` | number | Base cost per generated image (USD) |
| `output_cost_per_image_{resolution}` | number | Cost per image at specific resolution (e.g., `1920x1080`, `4096x4096`) |

**Video Generation Models (`mode: video_generation`):**

| Field | Type | Description |
|-------|------|-------------|
| `output_cost_per_video_per_second` | number | Base cost per second of video (USD) |
| `output_cost_per_video_per_second_{resolution}` | number | Cost per second at specific resolution (e.g., `720x1280`, `1792x1024`) |

**Audio Transcription Models (`mode: audio_transcription`):**

| Field | Type | Description |
|-------|------|-------------|
| `input_cost_per_second` | number | Cost per second of audio input (USD) |

**Text-to-Speech Models (`mode: audio_speech`):**

| Field | Type | Description |
|-------|------|-------------|
| `input_cost_per_character` | number | Cost per character of input text (USD) |

**OCR Models (`mode: ocr`):**

| Field | Type | Description |
|-------|------|-------------|
| `input_cost_per_page` | number | Cost per page processed (USD) |

**Rerank Models (`mode: rerank`):**

| Field | Type | Description |
|-------|------|-------------|
| `input_cost_per_query` | number | Cost per rerank query (USD) |

**Search Models (`mode: search`):**

| Field | Type | Description |
|-------|------|-------------|
| `input_cost_per_query` | number | Cost per search query (USD) |

#### Rate Limits Object

| Field | Type | Description |
|-------|------|-------------|
| `tiers` | object | Rate limits for each tier (0-5) |
| `current` | object | Your current rate limits based on your tier |

Each tier contains:

| Field | Type | Description |
|-------|------|-------------|
| `rpm` | number | Requests per minute |
| `tpm` | number | Tokens per minute |

The `current` object also includes:

| Field | Type | Description |
|-------|------|-------------|
| `tier` | integer | Your current tier level |

For more information about tiers and how to upgrade, see [Rate Limits](en/rate-limits.md).

## Error Handling

| Status Code | Description |
|-------------|-------------|
| 401 | Unauthorized - Invalid or missing API key |
| 404 | Not Found - Model does not exist |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

## Related Resources

- [Authentication](en/api-reference/authentication.md) - Learn about authentication methods
- [Rate Limits](en/rate-limits.md) - Understand tier-based rate limits
- [Models Overview](en/models/index.md) - Browse available models by provider
- [Model Details](en/models/model-details.md) - Detailed model specifications
- [Pricing](en/pricing.md) - Pricing information
