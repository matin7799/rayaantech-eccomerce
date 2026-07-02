# Stateful Responses Workflows

The Responses API is useful when you want the API to manage conversation state, hosted tools, and multimodal inputs without rebuilding the full message history on every turn. This example shows practical patterns for continuing, forking, and inspecting responses through AvalAI.

> This guide is adapted from the official [OpenAI Cookbook](https://developers.openai.com/cookbook) and the [Responses API cookbook notebook](https://github.com/openai/openai-cookbook/blob/main/examples/responses_api/responses_example.ipynb), with AvalAI-specific endpoint and API key changes.

## When to Use This Pattern

- You want to continue a conversation without resending the full history.
- You need to fork from an earlier response and try a different path.
- You want a single API surface for text generation plus hosted tools such as web search.
- You are migrating code from Chat Completions and want a simpler state model.

## Setup

Install the OpenAI SDK and set your AvalAI key:

```bash
pip install openai
export AVALAI_API_KEY="your-avalai-api-key"
```

For Node.js:

```bash
npm install openai
export AVALAI_API_KEY="your-avalai-api-key"
```

## Basic Stateful Conversation

Create one response, then continue from it with `previous_response_id`.

```language-selector
python=:import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["AVALAI_API_KEY"],
    base_url="https://api.avalai.ir/v1",
)

first = client.responses.create(
    model="gpt-5.5",
    input="Give me a concise deployment checklist for a small API service.",
)

print(first.output_text)

follow_up = client.responses.create(
    model="gpt-5.5",
    input="Now turn that checklist into five acceptance criteria.",
    previous_response_id=first.id,
)

print(follow_up.output_text)

javascript=:import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const first = await client.responses.create({
  model: "gpt-5.5",
  input: "Give me a concise deployment checklist for a small API service.",
});

console.log(first.output_text);

const followUp = await client.responses.create({
  model: "gpt-5.5",
  input: "Now turn that checklist into five acceptance criteria.",
  previous_response_id: first.id,
});

console.log(followUp.output_text);

bash=:FIRST_RESPONSE=$(curl https://api.avalai.ir/v1/responses \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-5.5",
    "input": "Give me a concise deployment checklist for a small API service."
  }')

FIRST_ID=$(printf "%s" "$FIRST_RESPONSE" | jq -r ".id")

curl https://api.avalai.ir/v1/responses \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"model\": \"gpt-5.5\",
    \"input\": \"Now turn that checklist into five acceptance criteria.\",
    \"previous_response_id\": \"$FIRST_ID\"
  }"

```

## Fork an Earlier Response

Forking lets you branch from a previous response without changing the original path. This is useful for A/B testing prompts, generating alternative tones, or retrying a plan with a different constraint.

```language-selector
python=:forked = client.responses.create(
    model="gpt-5.5",
    input=(
        "Use the same original checklist, but rewrite it for a solo developer "
        "who deploys manually once per week."
    ),
    previous_response_id=first.id,
)

print(forked.output_text)

javascript=:const forked = await client.responses.create({
  model: "gpt-5.5",
  input:
    "Use the same original checklist, but rewrite it for a solo developer who deploys manually once per week.",
  previous_response_id: first.id,
});

console.log(forked.output_text);

bash=:curl https://api.avalai.ir/v1/responses \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"model\": \"gpt-5.5\",
    \"input\": \"Use the same original checklist, but rewrite it for a solo developer who deploys manually once per week.\",
    \"previous_response_id\": \"$FIRST_ID\"
  }"

```

## Retrieve a Stored Response

Use retrieval for logging, debugging, or delayed processing after a background workflow.

```language-selector
python=:stored = client.responses.retrieve(first.id)

print(stored.id)
print(stored.output_text)

javascript=:const stored = await client.responses.retrieve(first.id);

console.log(stored.id);
console.log(stored.output_text);

bash=:curl "https://api.avalai.ir/v1/responses/$FIRST_ID" \
  -H "Authorization: Bearer $AVALAI_API_KEY"

```

## Add Web Search

When a question needs fresh information, include the `web_search` tool. Keep prompts explicit about citations when your UI needs source links.

```language-selector
python=:response = client.responses.create(
    model="gpt-5.5",
    input="Find the latest AvalAI documentation updates and summarize them with sources.",
    tools=[{"type": "web_search"}],
)

print(response.output_text)

for item in response.output:
    print(item.type)

javascript=:const response = await client.responses.create({
  model: "gpt-5.5",
  input:
    "Find the latest AvalAI documentation updates and summarize them with sources.",
  tools: [{ type: "web_search" }],
});

console.log(response.output_text);

for (const item of response.output) {
  console.log(item.type);
}

bash=:curl https://api.avalai.ir/v1/responses \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-5.5",
    "input": "Find the latest AvalAI documentation updates and summarize them with sources.",
    "tools": [{"type": "web_search"}]
  }'

```

## Production Notes

- Store response IDs only when you actually need to continue or audit a conversation.
- Use your own conversation store when you need strict retention, deletion, or compliance controls.
- For deterministic workflows, keep system instructions stable and put user-specific details in the latest input.
- Inspect `response.output` when using tools; `output_text` is convenient for final text, but tool calls and annotations live in structured output items.
- Log `response.id`, `model`, latency, and `usage` so support and cost investigations are easier.

## Related Links

- [Responses API Reference](en/api-reference/responses.md)
- [Responses vs. Chat Completions](en/guides/responses-vs-chat-completions.md)
- [Using built-in tools](en/guides/tools.md)
- [Web Search Guide](en/guides/tools-web-search.md)
