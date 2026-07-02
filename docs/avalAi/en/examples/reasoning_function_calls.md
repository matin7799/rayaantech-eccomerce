# Reasoning Models with Function Calls

Reasoning models can solve multi-step tasks, but tool use needs a loop: call the model, execute requested functions, send `function_call_output` items back, and repeat until the model returns a final message.

> This guide is adapted from the official [OpenAI Cookbook](https://developers.openai.com/cookbook) and the [reasoning function calls notebook](https://github.com/openai/openai-cookbook/blob/main/examples/reasoning_function_calls.ipynb), with AvalAI-specific endpoint and API key changes.

## The Core Loop

Use this pattern when:

- Tool calls may depend on earlier tool results.
- The model may need more than one reasoning step.
- You need auditable handling for unknown tools or bad arguments.
- You want to use Responses API state via `previous_response_id`.

## Python Example

```python
import json
import os
from collections.abc import Callable
from uuid import uuid4

from openai import OpenAI

client = OpenAI(
    api_key=os.environ["AVALAI_API_KEY"],
    base_url="https://api.avalai.ir/v1",
)

MODEL = "o3"


def get_customer_status(customer_id: str) -> str:
    """Look up a customer in your own system."""
    fake_db = {
        "cus_123": "enterprise customer, paid through 2026-09-01",
        "cus_456": "trial customer, trial ends in 3 days",
    }
    return fake_db.get(customer_id, "customer not found")


def create_case_id(priority: str) -> str:
    """Create a fake support case ID."""
    return f"{priority.upper()}-{uuid4()}"


tools = [
    {
        "type": "function",
        "name": "get_customer_status",
        "description": "Look up account status for a customer ID.",
        "parameters": {
            "type": "object",
            "properties": {
                "customer_id": {
                    "type": "string",
                    "description": "Customer ID, for example cus_123.",
                }
            },
            "required": ["customer_id"],
            "additionalProperties": False,
        },
    },
    {
        "type": "function",
        "name": "create_case_id",
        "description": "Create a support case ID for a priority level.",
        "parameters": {
            "type": "object",
            "properties": {
                "priority": {
                    "type": "string",
                    "enum": ["low", "normal", "high"],
                }
            },
            "required": ["priority"],
            "additionalProperties": False,
        },
    },
]

tool_mapping: dict[str, Callable[..., str]] = {
    "get_customer_status": get_customer_status,
    "create_case_id": create_case_id,
}


def run_tool_calls(response) -> list[dict]:
    outputs = []

    for item in response.output:
        if item.type != "function_call":
            continue

        tool = tool_mapping.get(item.name)
        if tool is None:
            result = f"Tool {item.name} is not registered."
        else:
            try:
                arguments = json.loads(item.arguments)
                result = tool(**arguments)
            except Exception as exc:
                result = f"Tool {item.name} failed: {exc}"

        outputs.append(
            {
                "type": "function_call_output",
                "call_id": item.call_id,
                "output": result,
            }
        )

    return outputs


def ask_with_tools(question: str) -> str:
    response = client.responses.create(
        model=MODEL,
        reasoning={"effort": "medium", "summary": "auto"},
        tools=tools,
        input=question,
    )

    while True:
        tool_outputs = run_tool_calls(response)

        if not tool_outputs:
            return response.output_text

        response = client.responses.create(
            model=MODEL,
            reasoning={"effort": "medium", "summary": "auto"},
            tools=tools,
            input=tool_outputs,
            previous_response_id=response.id,
        )


answer = ask_with_tools(
    "Customer cus_123 says their production integration is down. "
    "Check their status, decide the priority, create a case ID, and draft a reply."
)

print(answer)
```

## JavaScript Example

```javascript
import OpenAI from "openai";
import crypto from "node:crypto";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const tools = [
  {
    type: "function",
    name: "get_customer_status",
    description: "Look up account status for a customer ID.",
    parameters: {
      type: "object",
      properties: {
        customer_id: {
          type: "string",
          description: "Customer ID, for example cus_123.",
        },
      },
      required: ["customer_id"],
      additionalProperties: false,
    },
  },
  {
    type: "function",
    name: "create_case_id",
    description: "Create a support case ID for a priority level.",
    parameters: {
      type: "object",
      properties: {
        priority: { type: "string", enum: ["low", "normal", "high"] },
      },
      required: ["priority"],
      additionalProperties: false,
    },
  },
];

const toolMapping = {
  get_customer_status: ({ customer_id }) => {
    const fakeDb = {
      cus_123: "enterprise customer, paid through 2026-09-01",
      cus_456: "trial customer, trial ends in 3 days",
    };
    return fakeDb[customer_id] ?? "customer not found";
  },
  create_case_id: ({ priority }) =>
    `${priority.toUpperCase()}-${crypto.randomUUID()}`,
};

function runToolCalls(response) {
  const outputs = [];

  for (const item of response.output) {
    if (item.type !== "function_call") continue;

    const tool = toolMapping[item.name];
    let result;

    if (!tool) {
      result = `Tool ${item.name} is not registered.`;
    } else {
      try {
        result = tool(JSON.parse(item.arguments));
      } catch (error) {
        result = `Tool ${item.name} failed: ${error.message}`;
      }
    }

    outputs.push({
      type: "function_call_output",
      call_id: item.call_id,
      output: result,
    });
  }

  return outputs;
}

async function askWithTools(question) {
  let response = await client.responses.create({
    model: "o3",
    reasoning: { effort: "medium", summary: "auto" },
    tools,
    input: question,
  });

  while (true) {
    const toolOutputs = runToolCalls(response);
    if (toolOutputs.length === 0) return response.output_text;

    response = await client.responses.create({
      model: "o3",
      reasoning: { effort: "medium", summary: "auto" },
      tools,
      input: toolOutputs,
      previous_response_id: response.id,
    });
  }
}

console.log(
  await askWithTools(
    "Customer cus_123 says their production integration is down. Check their status, decide the priority, create a case ID, and draft a reply.",
  ),
);
```

## cURL Shape for Tool Outputs

The important part is the second request. It sends the function result back with the original `call_id`.

```bash
curl https://api.avalai.ir/v1/responses \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "o3",
    "input": [
      {
        "type": "function_call_output",
        "call_id": "call_abc123",
        "output": "enterprise customer, paid through 2026-09-01"
      }
    ],
    "previous_response_id": "resp_abc123"
  }'
```

## Failure Modes to Handle

- Unknown tool name: return a structured error as tool output instead of crashing the worker.
- Invalid JSON arguments: return the parse error and let the model recover if appropriate.
- Tool timeout: return a timeout result or cancel the response workflow.
- Repeated tool calls: set a maximum loop count to prevent runaway execution.
- Sensitive tool results: redact data before sending it back to the model when full output is not needed.

## Best Practices

- Keep tool schemas narrow and explicit.
- Validate tool arguments in your application, even when the schema is strict.
- Log every tool call name, call ID, latency, and outcome.
- Use `previous_response_id` when you are comfortable with API-managed state.
- Store your own ordered conversation items when audit, retention, or deletion requirements demand it.

## Related Links

- [Responses API Reference](en/api-reference/responses.md)
- [Function Calling Guide](en/guides/function-calling.md)
- [Reasoning Guide](en/guides/reasoning.md)
- [Production Best Practices](en/guides/production-best-practices.md)
