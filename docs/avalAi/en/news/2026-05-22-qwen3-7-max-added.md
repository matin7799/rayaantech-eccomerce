# New Flagship Model Added: Qwen3.7-Max

**Date:** 2026-05-22 / (1405-03-01)

## Summary

Alibaba's new flagship agent-foundation model **Qwen3.7-Max** is now available on AvalAI through the Chat Completions API (`v1/chat/completions`) with partial support via the Responses API (`v1/responses`). The model targets long-horizon agent workflows, frontier coding, and reasoning, and is launched with a **50% promotional discount through Jun 22**.

---

## Details

### Alibaba

We announce access to **Qwen3.7-Max** (`qwen3.7-max`), Alibaba's latest proprietary model built for the agent era. The model excels at coding agents, office and productivity workflows, and sustained autonomous execution across hundreds or thousands of steps. [Documentation](en/providers/alibaba.md)

#### Qwen3.7-Max

Qwen3.7-Max is designed as a versatile agent foundation — equally capable of writing and debugging code, automating office workflows, and sustaining long-horizon autonomous execution. It generalizes across agent scaffolds such as Claude Code, OpenClaw, and Qwen Code, and supports hybrid thinking via DashScope's `enable_thinking` and `preserve_thinking` parameters.

**Key Features:**
- **Endpoint Support**: Available on `v1/chat/completions` (full feature compatibility) and partial support on `v1/responses`
- **Agent Foundation**: Frontier coding agent, office productivity, and long-horizon autonomous execution
- **Cross-Harness Generalization**: Consistent results across Claude Code, OpenClaw, Qwen Code, and custom tool-use frameworks
- **Hybrid Thinking**: Optional reasoning mode via `extra_body={"enable_thinking": True}` for streaming
- **Preserve Thinking**: Recommended for multi-turn agent workflows via `preserve_thinking`
- **Strong Reasoning**: 92.4 on GPQA Diamond, 97.1 on HMMT 2026 Feb, 90.0 on IMOAnswerBench
- **Coding Excellence**: 80.4 on SWE-Verified, 60.6 on SWE-Pro, 78.3 on SWE-Multilingual, 69.7 on Terminal-Bench 2.0
- **Agent Benchmarks**: 60.8 on MCP-Mark, 76.4 on MCP-Atlas, 87.0 on SpreadSheetBench-v1, 75.0 on BFCL-V4
- **Long-Horizon Capability**: Demonstrated 35-hour autonomous kernel optimization run with 1,158 tool calls and 10.0x speedup

**Pricing Details (50% discount through Jun 22, 2026):**

| Model | Input | Cache Creation | Cached Input | Output |
|-------|-------|----------------|--------------|--------|
| qwen3.7-max (promo) | $2.50 / 1M tokens | $3.125 / 1M tokens | $0.25 / 1M tokens | $7.50 / 1M tokens |
| qwen3.7-max (standard, after Jun 22) | $5.00 / 1M tokens | $6.25 / 1M tokens | $0.50 / 1M tokens | $15.00 / 1M tokens |

---

### API Request/Response Examples

#### Example Request

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "qwen3.7-max",
    "messages": [
      {
        "role": "user",
        "content": "Write a Python function to merge two sorted linked lists."
      }
    ]
  }'
```

#### Example Response

```json
{
  "id": "chatcmpl-qwen37max-example",
  "created": 1779768420,
  "model": "qwen3.7-max",
  "object": "chat.completion",
  "system_fingerprint": null,
  "choices": [
    {
      "finish_reason": "stop",
      "index": 0,
      "message": {
        "content": "Here is a Python function that merges two sorted linked lists into a single sorted list using a dummy head pointer for clarity...\n\n
```python\nclass ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\ndef merge_two_sorted_lists(l1, l2):\n    dummy = ListNode()\n    tail = dummy\n    while l1 and l2:\n        if l1.val <= l2.val:\n            tail.next, l1 = l1, l1.next\n        else:\n            tail.next, l2 = l2, l2.next\n        tail = tail.next\n    tail.next = l1 or l2\n    return dummy.next\n```",
        "role": "assistant",
        "thinking_blocks": [],
        "annotations": []
      }
    }
  ],
  "usage": {
    "completion_tokens": 175,
    "prompt_tokens": 22,
    "total_tokens": 197,
    "completion_tokens_details": null,
    "prompt_tokens_details": {
      "audio_tokens": null,
      "cached_tokens": null,
      "text_tokens": 22,
      "image_tokens": null
    }
  },
  "estimated_cost": {
    "unit": "0.0013675000",
    "irt": 156.72,
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
    "model": "qwen3.7-max",
    "messages": [
      {
        "role": "user",
        "content": "Design a fault-tolerant message broker for a high-throughput trading system."
      }
    ]
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

completion = client.chat.completions.create(
    model="qwen3.7-max",
    messages=[
        {
            "role": "user",
            "content": "Design a fault-tolerant message broker for a high-throughput trading system.",
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
  model: "qwen3.7-max",
  messages: [
    {
      role: "user",
      content: "Design a fault-tolerant message broker for a high-throughput trading system.",
    },
  ],
});

console.log(completion.choices[0].message.content);

```

---

### Hybrid Thinking with Streaming

Qwen3.7-Max supports DashScope's hybrid thinking mode. Use `extra_body={"enable_thinking": True}` together with `stream=True` to observe the reasoning content alongside the final answer. For multi-turn agent workflows, also enable `preserve_thinking` to keep prior reasoning available across turns:

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "qwen3.7-max",
    "messages": [
      {
        "role": "user",
        "content": "Plan a multi-step refactor that moves a monolithic payments service to event-driven microservices."
      }
    ],
    "stream": true,
    "enable_thinking": true,
    "preserve_thinking": true
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

stream = client.chat.completions.create(
    model="qwen3.7-max",
    messages=[
        {
            "role": "user",
            "content": "Plan a multi-step refactor that moves a monolithic payments service to event-driven microservices.",
        }
    ],
    stream=True,
    extra_body={
        "enable_thinking": True,
        "preserve_thinking": True,
    },
)

for chunk in stream:
    if not chunk.choices:
        continue
    delta = chunk.choices[0].delta
    if hasattr(delta, "reasoning_content") and delta.reasoning_content:
        print(delta.reasoning_content, end="", flush=True)
    if getattr(delta, "content", None):
        print(delta.content, end="", flush=True)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const stream = await client.chat.completions.create({
  model: "qwen3.7-max",
  messages: [
    {
      role: "user",
      content: "Plan a multi-step refactor that moves a monolithic payments service to event-driven microservices.",
    },
  ],
  stream: true,
  // @ts-ignore - DashScope-specific parameters passed through
  enable_thinking: true,
  preserve_thinking: true,
});

for await (const chunk of stream) {
  const delta = chunk.choices?.[0]?.delta;
  if (delta?.reasoning_content) process.stdout.write(delta.reasoning_content);
  if (delta?.content) process.stdout.write(delta.content);
}

```

> **Note:** For non-streaming requests, set `enable_thinking: false` in `extra_body`. Hybrid thinking is only supported with streaming, per Alibaba's DashScope guidelines. See [Alibaba Models](en/providers/alibaba.md) for details.

---

### Function Calling

Qwen3.7-Max supports function calling for agent workflows that need to connect model reasoning with external tools and systems:

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "qwen3.7-max",
    "messages": [
      {
        "role": "user",
        "content": "Check the production deploy status for service `payments-api` and report any failed pods."
      }
    ],
    "tools": [
      {
        "type": "function",
        "function": {
          "name": "get_deploy_status",
          "description": "Get current deployment status for a service",
          "parameters": {
            "type": "object",
            "properties": {
              "service": {
                "type": "string",
                "description": "Service name"
              }
            },
            "required": ["service"]
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
            "name": "get_deploy_status",
            "description": "Get current deployment status for a service",
            "parameters": {
                "type": "object",
                "properties": {
                    "service": {
                        "type": "string",
                        "description": "Service name",
                    }
                },
                "required": ["service"],
            },
        },
    }
]

response = client.chat.completions.create(
    model="qwen3.7-max",
    messages=[
        {
            "role": "user",
            "content": "Check the production deploy status for service `payments-api` and report any failed pods.",
        }
    ],
    tools=tools,
    tool_choice="auto",
)

javascript=:const tools = [
  {
    type: "function",
    function: {
      name: "get_deploy_status",
      description: "Get current deployment status for a service",
      parameters: {
        type: "object",
        properties: {
          service: {
            type: "string",
            description: "Service name",
          },
        },
        required: ["service"],
      },
    },
  },
];

const response = await client.chat.completions.create({
  model: "qwen3.7-max",
  messages: [
    {
      role: "user",
      content: "Check the production deploy status for service `payments-api` and report any failed pods.",
    },
  ],
  tools,
  tool_choice: "auto",
});

```

---

### Responses API (Partial Support)

Qwen3.7-Max can also be invoked through the OpenAI-compatible Responses API (`v1/responses`). Partial support is available for text input/output and basic tool use; advanced built-in tools (e.g., web search, file search) and the `reasoning` configuration field remain limited to OpenAI's o-series models:

```bash
curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "qwen3.7-max",
    "input": "Summarize the architectural risks of moving a SQL-based ledger to an event-sourced design."
  }'
```

See the [Responses API reference](en/api-reference/responses.md) for the full request and response schema.

---

## Related Links

- [Alibaba Models Documentation](en/providers/alibaba.md)
- [Reasoning Models Guide](en/guides/reasoning.md)
- [Chat Completions API](en/api-reference/chat.md)
- [Responses API](en/api-reference/responses.md)
- [Pricing Details](en/pricing.md)
- [Model Index](en/models/index.md)
