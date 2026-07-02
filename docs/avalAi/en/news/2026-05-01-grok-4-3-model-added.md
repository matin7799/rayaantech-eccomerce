# New Flagship Model Added: Grok-4.3

**Date:** 2026-05-01 / (1405-02-11)

## Summary

XAI's new flagship reasoning model **Grok-4.3** is now available on AvalAI through the Chat Completions API (`v1/chat/completions`). The model provides a 1,000,000-token context window, function calling, structured outputs, and built-in reasoning with context-aware pricing above 200K tokens.

---

## Details

### XAI

We announce access to **Grok-4.3** (`grok-4.3`), XAI's new flagship model for advanced reasoning, long-context analysis, and tool-enabled chat workflows. [Documentation](en/providers/xai.md)

#### Grok-4.3

Grok-4.3 is designed for complex multi-step tasks that benefit from reasoning, structured outputs, and reliable tool use. It is available through AvalAI's OpenAI-compatible Chat Completions endpoint, so existing integrations can call it by changing the `model` value.

**Key Features:**
- **Context Window**: 1,000,000 tokens for long documents, large conversations, and extensive context
- **Advanced Capabilities**: Function calling, structured outputs, and reasoning support
- **Endpoint Support**: Available on `v1/chat/completions`
- **Alias Support**: XAI lists `grok-4.3-latest` as the upstream alias
- **Context-Aware Pricing**: Higher rates apply when requests exceed the 200K context window
- **Regions**: Available upstream in `us-east-1` and `eu-west-1`

**Pricing Details:**

| Model | Input | Cached Input | Output | Special Pricing |
|-------|-------|--------------|--------|-----------------|
| grok-4.3 | $1.25/1M tokens | $0.20/1M tokens | $2.50/1M tokens | Above 200K context: $2.50 input, $0.40 cached input, $5.00 output per 1M tokens |

---

### API Request/Response Examples

#### Example Request

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "grok-4.3",
    "messages": [
      {
        "role": "user",
        "content": "Analyze the trade-offs between event sourcing and CRUD for a financial ledger system."
      }
    ]
  }'
```

#### Example Response

```json
{
  "id": "chatcmpl-grok43-example",
  "created": 1777647600,
  "model": "grok-4.3",
  "object": "chat.completion",
  "system_fingerprint": null,
  "choices": [
    {
      "finish_reason": "stop",
      "index": 0,
      "message": {
        "content": "Event sourcing is often a strong fit for financial ledgers because it preserves an immutable audit trail, supports reconstruction of historical state, and makes reconciliation easier. CRUD can be simpler operationally, but it requires additional controls to achieve the same auditability...",
        "role": "assistant",
        "thinking_blocks": [],
        "annotations": []
      }
    }
  ],
  "usage": {
    "completion_tokens": 220,
    "prompt_tokens": 31,
    "total_tokens": 251,
    "completion_tokens_details": null,
    "prompt_tokens_details": {
      "audio_tokens": null,
      "cached_tokens": null,
      "text_tokens": 31,
      "image_tokens": null
    }
  },
  "estimated_cost": {
    "unit": "0.0005887500",
    "irt": 67.48,
    "exchange_rate": 114600
  }
}
```

---

### SDK Usage Examples

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "grok-4.3",
    "messages": [
      {
        "role": "user",
        "content": "Create a migration plan for a monolith moving to event-driven services."
      }
    ]
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

completion = client.chat.completions.create(
    model="grok-4.3",
    messages=[
        {
            "role": "user",
            "content": "Create a migration plan for a monolith moving to event-driven services.",
        }
    ],
)

print(completion.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const completion = await client.chat.completions.create({
  model: "grok-4.3",
  messages: [
    {
      role: "user",
      content: "Create a migration plan for a monolith moving to event-driven services.",
    },
  ],
});

console.log(completion.choices[0].message.content);

```

---

### Advanced Features

#### Function Calling

Grok-4.3 supports function calling for workflows that need to connect model reasoning with external systems:

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "grok-4.3",
    "messages": [
      {
        "role": "user",
        "content": "Check inventory for SKU AVAL-123 and recommend whether to reorder."
      }
    ],
    "tools": [
      {
        "type": "function",
        "function": {
          "name": "get_inventory",
          "description": "Get current inventory information for a SKU",
          "parameters": {
            "type": "object",
            "properties": {
              "sku": {
                "type": "string",
                "description": "Product SKU"
              }
            },
            "required": ["sku"]
          }
        }
      }
    ],
    "tool_choice": "auto"
  }'

python=:tools = [
    {
        "type": "function",
        "function": {
            "name": "get_inventory",
            "description": "Get current inventory information for a SKU",
            "parameters": {
                "type": "object",
                "properties": {
                    "sku": {
                        "type": "string",
                        "description": "Product SKU",
                    }
                },
                "required": ["sku"],
            },
        },
    }
]

response = client.chat.completions.create(
    model="grok-4.3",
    messages=[
        {
            "role": "user",
            "content": "Check inventory for SKU AVAL-123 and recommend whether to reorder.",
        }
    ],
    tools=tools,
    tool_choice="auto",
)

javascript=:const tools = [
  {
    type: "function",
    function: {
      name: "get_inventory",
      description: "Get current inventory information for a SKU",
      parameters: {
        type: "object",
        properties: {
          sku: {
            type: "string",
            description: "Product SKU",
          },
        },
        required: ["sku"],
      },
    },
  },
];

const response = await client.chat.completions.create({
  model: "grok-4.3",
  messages: [
    {
      role: "user",
      content: "Check inventory for SKU AVAL-123 and recommend whether to reorder.",
    },
  ],
  tools,
  tool_choice: "auto",
});

```

#### Structured Outputs

Use structured output prompts or schemas to make Grok-4.3 return machine-readable responses for downstream automation:

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "grok-4.3",
    "messages": [
      {
        "role": "user",
        "content": "Return a JSON object with keys risk_level, summary, and next_actions for migrating a payments database."
      }
    ]
  }'
```

---

## Related Links

- [XAI Models Documentation](en/providers/xai.md)
- [Reasoning Models Guide](en/guides/reasoning.md)
- [Chat Completions API](en/api-reference/chat.md)
- [Pricing Details](en/pricing.md)
- [Model Index](en/models/index.md)
