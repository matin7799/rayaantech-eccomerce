# Reasoning Models

Explore advanced reasoning and problem-solving models available through AvalAI.

## Introduction

**Reasoning models** are large language models trained with reinforcement learning to perform complex reasoning. These models often "think before they answer," producing an internal chain of thought before responding. They excel in complex problem solving, coding, scientific reasoning, and multi-step planning for agentic workflows.

AvalAI offers access to several reasoning-capable models from different providers:

**OpenAI Models:**

- `gpt-5.5`: OpenAI's newest flagship model with state-of-the-art reasoning across agentic coding, knowledge work, computer use, and scientific research (configurable effort: none/low/medium/high/xhigh), 1M context window
- `gpt-5.4-pro`: OpenAI's highest-reasoning GPT-5.4 model for complex professional work, 1.05M context window, effort levels medium/high/xhigh
- `gpt-5.4`: Frontier reasoning and agentic workflow model with configurable effort (none/low/medium/high/xhigh), 1.05M context window
- `gpt-5.4-mini`: Fast, cost-efficient model with reasoning support (none, low, medium effort levels), 400K context
- `gpt-5.4-nano`: Fastest and most affordable model with basic reasoning (none, low effort levels), 400K context
- `gpt-5-pro`: OpenAI's advanced reasoning model with extended thinking capabilities for expert-level problem solving (Tier 2+ users, Responses API only)
- `gpt-5.3-codex`: OpenAI's most capable agentic coding model with reasoning tokens support (Responses API only)
- `o1-pro`: The most capable traditional reasoning model, but also the most expensive
- `o4-mini`: Enhanced reasoning with improved efficiency
- `o3`: Balanced reasoning capabilities with good performance
- `o3-mini`: A smaller, faster model, generally less expensive per token

**Google's Gemini Models:**

- `gemini-3.5-flash`: Google's flagship Flash reasoning model (May 2026) with configurable thinking levels, strong coding and agentic tool-use performance, multimodal input, and 1M context
- `gemini-3.1-pro-preview`: Google's advanced Pro-class model (Feb 2026) with natively multimodal reasoning, strong agentic performance, advanced coding, and long-context understanding
- `gemini-3.1-flash-lite`: Stable release of Google's most cost-efficient reasoning model, optimized for high-frequency, lightweight agentic tasks with extremely low latency
- `gemini-3.1-flash-lite-preview`: Preview alias for Gemini 3.1 Flash-Lite with the same pricing and capabilities
- `gemini-3.5-flash`: Google's current flagship Flash reasoning model with configurable thinking, multimodal input, tool use, grounding, and 1M context
- `gemini-2.5-pro`: Features enhanced thinking and reasoning capabilities
- `gemini-2.5-flash`: Google's first hybrid reasoning model with configurable thinking budgets

**Anthropic Models:**

- `claude-opus-4-8`: Anthropic's most capable GA model to date with adaptive thinking, 5 effort levels (low/medium/high/xhigh/max), default `high` effort, mid-conversation system messages, and improved long-horizon agentic coding
- `claude-opus-4-7`: Previous flagship with adaptive thinking, 5 effort levels (low/medium/high/xhigh/max), and task budgets
- `claude-sonnet-4-6`: Strong reasoning capabilities with better efficiency
- `claude-haiku-4-5`: Fast, efficient reasoning for cost-sensitive deployments

**DeepSeek Models:**

- `deepseek-v4-pro`: DeepSeek's flagship reasoning model (1.6T total / 49B active params) with open-source SOTA Agentic Coding, 1M context window, transparent CoT via `reasoning_content`, `reasoning_effort: "high"/"max"`
- `deepseek-v4-flash`: Fast, economical flagship (284B total / 13B active params) with near V4-Pro reasoning, 1M context window, dual thinking/non-thinking modes via `extra_body={"thinking": {...}}`
- `deepseek-reasoner`: Legacy alias, now routes to `deepseek-v4-pro` (retiring July 24, 2026)
- `deepseek-chat`: Legacy alias, now routes to `deepseek-v4-flash` (retiring July 24, 2026)

**XAI Models:**

- `grok-4.3`: XAI's new flagship reasoning model with 1M context window, function calling, structured outputs, and context-aware pricing above 200K tokens
- `grok-4.20-reasoning`: Stable release with industry-leading speed and built-in reasoning, 2M context window, lowest hallucination rate
- `grok-4.20-non-reasoning`: Stable non-reasoning variant for tasks not requiring chain-of-thought, 2M context window

**MiniMax Models:**

- `minimax-m3`: New flagship model with frontier coding and agentic capabilities, 1M context window (MSA architecture), native multimodal input, and toggleable thinking
- `minimax-m2.7`: Revolutionary self-evolution reasoning model (first model to deeply participate in its own evolution), 56.22% SWE-Pro, Agent Teams support
- `minimax-m2.7-highspeed`: Ultra-fast self-evolution variant (~100 tokens per second output speed)
- `minimax-m2.5`: Earlier flagship model with SOTA coding (80.2% SWE-Bench Verified) and real-world productivity
- `minimax-m2.5-lightning`: Ultra-fast reasoning variant (~100 tokens per second output speed)
- `minimax-m2.1`: Flagship reasoning model with o3-level performance and 20x efficiency
- `minimax-m2.1-lightning`: Fast reasoning variant (~100 tokens per second output speed)
- `minimax-m2`: Versatile reasoning model with strong general capabilities

**Z.AI Models:**

- `glm-5.2`: Latest flagship reasoning model with 1M context, frontier coding, and long-horizon agentic engineering
- `glm-5.1`: State-of-the-art reasoning with 58.4% SWE-Bench Pro, long-horizon optimization for agentic engineering
- `glm-5v-turbo`: Multimodal reasoning and vision understanding with high-throughput visual processing
- `glm-5-turbo`: OpenClaw-optimized reasoning for tool invocation, persistent tasks, and long-chain execution
- `glm-5`: Flagship model with SOTA coding and agentic engineering capabilities

**Alibaba Models:**

- `qwen3.7-max`: Newest flagship agent-foundation model, hybrid thinking via `enable_thinking`, 92.4 GPQA Diamond, 97.1 HMMT, 1M context
- `qwen3-max`: Flagship Qwen3 Max model for complex reasoning and agentic workflows, hybrid thinking via `enable_thinking`, 262K context
- `qwen3.6-plus`: Agentic coding model with 78.8% SWE-bench Verified, 1M context default, frontier web development
- `qwen3.6-flash`: Fast hybrid-thinking model with `enable_thinking` toggle, 1M context window
- `qwen3.6-max-preview`: Flagship preview with hybrid thinking, most capable Qwen3.6 model
- `qwen3.6-35b-a3b`: Open-weight MoE (35B total/3B active) with thinking mode, 256K context
- `qwen3.6-27b`: Dense vision-language reasoning model with 256K context
- `qwen3-coder-next`: 80B MoE model (10B active) optimized for coding agents with 1M context

**Fireworks.ai Models:**

- `nemotron-3-ultra`: NVIDIA's flagship large-scale Nemotron model for complex reasoning and agentic workflows, served via Fireworks.ai

_Note: Some advanced models like `o1-pro` might have unique features and specific API endpoints (e.g., AvalAI's equivalent of the Responses API). Refer to the specific model documentation and the [AvalAI API Reference](en/api-reference/introduction.md) for details._

## Get Started with Reasoning

Reasoning models can often be used through standard API endpoints like Chat Completions, but specialized endpoints might exist for advanced features. The examples below use a hypothetical `v1/responses` endpoint compatible with reasoning models. Always check the [AvalAI API Reference](en/api-reference/introduction.md) for the correct endpoint for your chosen model and task.

**Example: Using a reasoning model**

```language-selector
bash=:PROMPT='Write a bash script that takes a matrix represented as a string with format '\''[1,2],[3,4],[5,6]'\'' and prints the transpose in the same format.'

curl https://api.avalai.ir/v1/responses \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
 "model": "gpt-5.5",
 "reasoning": {"effort": "medium"},
 "input": [
 {
 "role": "user",
 "content": "'"$PROMPT"'"
 }
 ]
 }'

python=:from openai import OpenAI  # Use the standard OpenAI library configured for AvalAI
import os

client = OpenAI(
    api_key=os.environ.get("AVALAI_API_KEY"),
    base_url="https://api.avalai.ir/v1",  # AvalAI endpoint
)

prompt = """
Write a bash script that takes a matrix represented as a string with
format '[1,2],[3,4],[5,6]' and prints the transpose in the same format.
"""

try:
    response = client.chat.completions.create(  # Assuming use via Chat Completions
        model="gpt-5.5",  # Or potentially client.responses.create for specific endpoints
        messages=[{"role": "user", "content": prompt}],
        # Reasoning parameters might be passed differently depending on endpoint/library version
        # Check AvalAI documentation for specific model parameters
        # Example for a hypothetical reasoning parameter:
        # extra_body={"reasoning": {"effort": "medium"}}
    )
    # Accessing output might differ based on actual response object structure
    print(response.choices[0].message.content)  # Example for Chat Completion response

except Exception as e:
    print(f"An API error occurred: {e}")

javascript=:import OpenAI from "openai"; // Use the standard OpenAI library configured for AvalAI
import * as dotenv from "dotenv";
dotenv.config();

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1", // AvalAI endpoint
});

const prompt = `
Write a bash script that takes a matrix represented as a string with
format '[1,2],[3,4],[5,6]' and prints the transpose in the same format.
`;

async function runReasoning() {
  try {
    const response = await client.chat.completions.create({
      // Assuming use via Chat Completions
      model: "gpt-5.5", // Or potentially client.responses.create
      messages: [{ role: "user", content: prompt }],
      // Reasoning parameters might be passed differently
      // Example for hypothetical reasoning parameter:
      // extraBody: { reasoning: { effort: "medium" } },
    });
    // Accessing output might differ
    console.log(response.choices[0].message.content); // Example for Chat Completion response
  } catch (error) {
    console.error("An API error occurred:", error);
  }
}

runReasoning();

go=:package main

import (
	"context"
	"fmt"
	"os"

	openai "github.com/openai/openai-go" // Use standard Go client
)

func main() {
	apiKey := os.Getenv("AVALAI_API_KEY")
	baseURL := "https://api.avalai.ir/v1" // AvalAI endpoint

	config := openai.DefaultConfig(apiKey)
	config.BaseURL = baseURL
	client := openai.NewClientWithConfig(config)

	prompt := `
Write a bash script that takes a matrix represented as a string with
format '[1,2],[3,4],[5,6]' and prints the transpose in the same format.
`
	// Note: Reasoning parameters like 'effort' might require custom handling
	// if not directly supported by the client library for the chosen endpoint.
	// This might involve custom request building or checking AvalAI docs.

	resp, err := client.CreateChatCompletion( // Assuming use via Chat Completions
		context.Background(),
		openai.ChatCompletionRequest{
			Model: "gpt-5.5",
			Messages: []openai.ChatCompletionMessage{
				{Role: openai.ChatMessageRoleUser, Content: prompt},
			},
			// Reasoning parameters would go here if supported, e.g., potentially via ExtraParams
		},
	)

	if err != nil {
		fmt.Printf("ChatCompletion error: %v\n", err)
		return
	}

	// Accessing output might differ
	fmt.Println(resp.Choices[0].Message.Content) // Example for Chat Completion response
}

php=:<?php
require 'vendor/autoload.php'; // Ensure OpenAI PHP client is installed

use OpenAI\Client; // Use the standard OpenAI PHP client

$apiKey = getenv('AVALAI_API_KEY');
$baseURL = 'https://api.avalai.ir/v1'; // AvalAI endpoint

// Depending on the client library, configuration might differ
// Example using openai-php/client:
$client = OpenAI::client($apiKey); // Base URL might be set via factory or config

// Example factory configuration (consult your specific library docs):
// $client = OpenAI::factory()
// ->withApiKey($apiKey)
// ->withBaseUri($baseURL) // Or similar method
// ->make();


$prompt = <<<PROMPT
Write a bash script that takes a matrix represented as a string with
format '[1,2],[3,4],[5,6]' and prints the transpose in the same format.
PROMPT;

// Note: Reasoning parameters like 'effort' might require custom handling
// if not directly supported by the client library for the chosen endpoint.
// This might involve passing them in the main array or checking AvalAI docs.

try {
 $response = $client->chat()->create([ // Assuming use via Chat Completions
 'model' => 'gpt-5.5',
 'messages' => [
 ['role' => 'user', 'content' => $prompt],
 ],
 // Reasoning parameters might go here, e.g.,
 // 'reasoning' => ['effort' => 'medium'], // If supported
 ]);

 // Accessing output might differ
 echo $response->choices[0]->message->content; // Example for Chat Completion response

} catch (Exception $e) {
 echo "An API error occurred: " . $e->getMessage() . "\n";
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

tools = [
    {
        "type": "function",
        "name": "get_current_weather",
        "description": "Get the current weather in a given location.",
        "parameters": {
            "type": "object",
            "properties": {"location": {"type": "string"}},
            "required": ["location"],
            "additionalProperties": False,
        },
    }
]

response = client.responses.create(
    model="gpt-5.5",
    input="Summarize the uploaded file.",
    tools=tools,
)

for item in response.output:
    if item.type == "function_call":
        print(item.name, item.arguments)
print(response.output_text)

javascript=:import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const tools = [
  {
    type: "function",
    name: "get_current_weather",
    description: "Get the current weather in a given location.",
    parameters: {
      type: "object",
      properties: { location: { type: "string" } },
      required: ["location"],
      additionalProperties: false,
    },
  },
];

const response = await client.responses.create({
  model: "gpt-5.5",
  input: "Summarize the uploaded file.",
  tools,
});

for (const item of response.output) {
  if (item.type === "function_call") {
    console.log(item.name, item.arguments);
  }
}
console.log(response.output_text);

bash=:curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '
  {
    "model": "gpt-5.5",
    "input": "Summarize the uploaded file.",
    "tools": [
      {
        "type": "function",
        "name": "get_current_weather",
        "description": "Get the current weather in a given location.",
        "parameters": {
          "type": "object",
          "properties": {
            "location": {
              "type": "string"
            }
          },
          "required": [
            "location"
          ],
          "additionalProperties": false
        }
      }
    ]
  }'

```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


### Reasoning Effort

Some reasoning models accept parameters like `reasoning.effort` to guide the amount of internal reasoning performed before generating a response. Potential values include:

- `none`: Disables explicit reasoning where supported, favoring speed.
- `low`: Favors speed and lower token usage.
- `medium` (often default): Balances speed and reasoning quality.
- `high`: Favors more thorough reasoning, potentially using more tokens and taking longer.
- `xhigh` or `max`: Uses the most reasoning for the hardest coding, math, and agentic tasks where supported.

_Consult the specific model documentation on AvalAI for supported parameters and their effects._

## How Reasoning Works

Reasoning models utilize **reasoning tokens** internally, in addition to the standard input and output tokens. These tokens represent the model's "thought process" – breaking down the prompt, exploring approaches, and planning the response. After this internal reasoning phase, the model generates the final visible output tokens and typically discards the reasoning tokens from its context memory for subsequent turns.

![Diagram showing reasoning tokens used internally but not kept in context](https://cdn.openai.com/API/images/guides/reasoning_tokens.png ':size=1000')
_(Diagram Source: OpenAI)_

**Important:** While reasoning tokens might not be visible in the final API response content, they **do count towards token usage** (usually billed as output tokens) and occupy space in the model's context window during generation.

### Provider-Specific Reasoning Settings

Different model providers implement reasoning capabilities in their own ways. Here's how to use reasoning features with each provider through AvalAI:

#### Gemini Models Reasoning Settings

Google's current Gemini 3.5 and 3.1 reasoning-capable models support configurable thinking through Gemini `generationConfig.thinkingConfig`. For `gemini-3.5-flash`, `gemini-3.1-pro-preview`, `gemini-3.1-flash-lite`, and `gemini-3.1-flash-lite-preview`, use `thinkingLevel` to balance quality, latency, and cost.

When using OpenAI client libraries with AvalAI, pass Gemini-specific settings through the `extra_body` parameter:

```language-selector
python=:# Python example - Gemini thinking levels
response = client.chat.completions.create(
    model="gemini-3.5-flash",
    messages=[
        {"role": "user", "content": "Solve this complex math problem step by step: ..."}
    ],
    extra_body={"generationConfig": {"thinkingConfig": {"thinkingLevel": "high"}}},
)

javascript=:// JavaScript example - Gemini thinking levels
const response = await client.chat.completions.create({
  model: "gemini-3.5-flash",
  messages: [
    {
      role: "user",
      content: "Solve this complex math problem step by step: ...",
    },
  ],
  // @ts-expect-error extra_body is supported by AvalAI for Gemini-specific options
  extra_body: {
    generationConfig: {
      thinkingConfig: { thinkingLevel: "high" },
    },
  },
});

```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `gemini-3.5-flash` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

Use this version when the selected model supports `/v1/responses`. `messages` moves to `input`, and the final text is read from `response.output_text`.

```language-selector
python=:import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["AVALAI_API_KEY"],
    base_url="https://api.avalai.ir/v1",
)

response = client.responses.create(
    model="gpt-5.5",
    instructions="You are a helpful assistant.",
    input="Solve this complex math problem step by step: ...",
)

print(response.output_text)

javascript=:import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.responses.create({
  model: "gpt-5.5",
  instructions: "You are a helpful assistant.",
  input: "Solve this complex math problem step by step: ...",
});

console.log(response.output_text);

bash=:curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '
  {
    "model": "gpt-5.5",
    "input": "Solve this complex math problem step by step: ...",
    "instructions": "You are a helpful assistant."
  }'

```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


The Gemini 3.5/3.1 thinking settings include:

- `thinkingLevel`: Controls reasoning depth. Supported values are `low`, `medium`, and `high`.
- Higher thinking levels generally improve multi-step reasoning and tool-use quality, but can increase latency and token usage.
- Use `medium` for balanced production defaults and `high` for complex coding, agentic, or analytical tasks.

For the native Gemini `v1beta` endpoint, pass the same configuration directly in the request body:

```bash
curl https://api.avalai.ir/v1beta/models/gemini-3.5-flash:generateContent \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "contents": [{"role": "user", "parts": [{"text": "Plan a resilient migration from a monolith to microservices."}]}],
    "generationConfig": {
      "thinkingConfig": {"thinkingLevel": "high"}
    }
  }'
```

?> **Legacy note:** `thinking_budget` is specific to Gemini 2.5 Flash. For the most current information, reference the [official Google AI documentation](https://ai.google.dev/gemini-api/docs/thinking#set-budget).

Gemini 2.5 Flash uses budget-based thinking controls:

```language-selector
python=:# Python example - Gemini 2.5 Flash thinking budget
response = client.chat.completions.create(
    model="gemini-2.5-flash",
    messages=[
        {"role": "user", "content": "Solve this complex math problem step by step: ..."}
    ],
    extra_body={"thinking": {"type": "enabled", "budget_tokens": 2000}},
)

javascript=:// JavaScript example - Gemini 2.5 Flash thinking budget
const responseAlt = await client.chat.completions.create({
  model: "gemini-2.5-flash",
  messages: [{ role: "user", content: "Solve this complex math problem step by step: ..." }],
  // @ts-expect-error thinking is an undocumented provider-specific parameter
  thinking: { type: "enabled", budget_tokens: 2000 },
});

```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `gemini-2.5-flash` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

Use this version when the selected model supports `/v1/responses`. `messages` moves to `input`, and the final text is read from `response.output_text`.

```language-selector
python=:import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["AVALAI_API_KEY"],
    base_url="https://api.avalai.ir/v1",
)

response = client.responses.create(
    model="gpt-5.5",
    input=[
        {
            "role": "user",
            "content": [
                {
                    "type": "input_text",
                    "text": "Solve this complex math problem step by step: ...",
                },
                {"type": "input_file", "file_id": "file_abc123"},
            ],
        }
    ],
)

print(response.output_text)

javascript=:import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.responses.create({
  model: "gpt-5.5",
  input: [
    {
      role: "user",
      content: [
        { type: "input_text", text: "Solve this complex math problem step by step: ..." },
        { type: "input_file", file_id: "file_abc123" },
      ],
    },
  ],
});

console.log(response.output_text);

bash=:curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '
  {
    "model": "gpt-5.5",
    "input": [
      {
        "role": "user",
        "content": [
          {
            "type": "input_text",
            "text": "Solve this complex math problem step by step: ..."
          },
          {
            "type": "input_file",
            "file_id": "file_abc123"
          }
        ]
      }
    ]
  }'

```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


By setting appropriate thinking levels or budgets, you can control both the depth of reasoning and the cost of your API calls.

#### Anthropic Models Reasoning Settings

Anthropic's Claude models (specifically `claude-opus-4-8`, `claude-opus-4-7`, `claude-sonnet-4-6`, `claude-haiku-4-5`) also support configurable reasoning through similar "thinking" settings. You can use the same approach with the `extra_body` parameter. Note: Claude Opus 4.8 and 4.7 do not support extended thinking budgets — use `thinking: {"type": "adaptive"}` together with the `effort` parameter (`low`, `medium`, `high`, `xhigh`, `max`) instead.

```python
response = client.chat.completions.create(
    model="anthropic.claude-sonnet-4-20250514-v1:0",
    messages=[
        {
            "role": "user",
            "content": "Analyze this complex research paper and summarize the key findings: ...",
        }
    ],
    extra_body={
        "thinking": {"type": "enabled", "budget_tokens": 1024}
    },  # Allow up to 1024 tokens for reasoning
)
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `anthropic.claude-sonnet-4-20250514-v1:0` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

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
    input="Analyze this complex research paper and summarize the key findings: ...",
)

print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


The parameters work similarly to Gemini models, allowing you to control how much reasoning the model performs.

#### OpenAI Models Reasoning Settings

OpenAI's latest reasoning-capable models (`gpt-5.5`, `gpt-5.4-pro`, `gpt-5.4`, `gpt-5.4-mini`, `gpt-5.4-nano`, `gpt-5.3-codex`, `gpt-5-pro`, `o4-mini`, `o3`, and `o3-mini`) have built-in reasoning capabilities that are automatically engaged when needed. For these models, you may see reasoning tokens included in your usage statistics, but the reasoning process is more integrated into the model's operation.

For more advanced control, some endpoints may support parameters like `reasoning.effort` to guide the amount of internal reasoning:

```python
response = client.chat.completions.create(
    model="gpt-5.5",
    messages=[
        {
            "role": "user",
            "content": "Design an algorithm to solve this optimization problem: ...",
        }
    ],
    extra_body={"reasoning": {"effort": "high"}},  # Request more thorough reasoning
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
    model="gpt-5.5",
    instructions="You are a helpful assistant.",
    input="Design an algorithm to solve this optimization problem: ...",
)

print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


#### DeepSeek Models Reasoning Settings

DeepSeek offers reasoning capabilities through the V4 flagship family (`deepseek-v4-pro` and `deepseek-v4-flash`), which provide transparent chain-of-thought reasoning. When using thinking mode, the API returns both the reasoning process and the final answer. The legacy aliases `deepseek-reasoner` (→ `deepseek-v4-pro`) and `deepseek-chat` (→ `deepseek-v4-flash`) continue to work but will be retired on **July 24, 2026**.

**Key Features:**

- **`reasoning_content`**: Contains the chain-of-thought (CoT) reasoning process
- **`content`**: Contains the final answer
- **Transparent Reasoning**: See exactly how the model thinks through problems
- **Tool Call Integration**: Thinking mode works with function calling
- **Thinking Mode Toggle**: Use `extra_body={"thinking": {"type": "enabled"}}` or `{"type": "disabled"}` to switch between modes (thinking is enabled by default on V4)
- **Reasoning Effort**: `reasoning_effort: "high"` or `"max"` controls how much compute is allocated to reasoning (low/medium are mapped to high, xhigh is mapped to max)
- **Context Window**: V4 flagships default to a 1M-token context window

**Basic Usage (thinking mode, V4-Pro):**

```python
response = client.chat.completions.create(
    model="deepseek-v4-pro",
    messages=[
        {
            "role": "user",
            "content": "9.11 and 9.8, which is greater?",
        }
    ],
    reasoning_effort="high",
    extra_body={"thinking": {"type": "enabled"}},
)

# Access the reasoning process
reasoning = response.choices[0].message.reasoning_content
# Access the final answer
answer = response.choices[0].message.content
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `deepseek-v4-pro` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

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
    input="9.11 and 9.8, which is greater?",
)

print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


**Fast, Economical Reasoning (V4-Flash):**

```python
response = client.chat.completions.create(
    model="deepseek-v4-flash",
    messages=[
        {
            "role": "user",
            "content": "Summarize the trade-offs between thinking and non-thinking modes.",
        }
    ],
    extra_body={"thinking": {"type": "enabled"}},
)
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `deepseek-v4-flash` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

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
    input="Summarize the trade-offs between thinking and non-thinking modes.",
)

print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


**⚠️ Critical: Tool Calls with Thinking Mode**

When using tool calls with DeepSeek V4 models in thinking mode (including `deepseek-v4-pro`, `deepseek-v4-flash` with thinking enabled, or the legacy `deepseek-reasoner` alias), you **must** pass the `reasoning_content` back to the API in subsequent requests within the same turn. Failure to do so will result in an error:

```
Missing reasoning_content field in the assistant message
```

**Correct Tool Call Implementation:**

```python
# When the model returns tool_calls, include reasoning_content in the assistant message
assistant_message = {
    "role": "assistant",
    "content": message.content or "",
    "tool_calls": [...],
    "reasoning_content": message.reasoning_content,  # CRITICAL: Must include this
}
messages.append(assistant_message)
```

**Multi-turn Conversation Rules:**

1. Within a single turn (while processing tool calls): Always include `reasoning_content`
2. Between turns (new user message): Only pass `content`, not `reasoning_content`

For complete documentation with examples in multiple languages, see the [DeepSeek Models Documentation](en/providers/deepseek.md#thinking-mode-api-details).

**Official Reference:** [DeepSeek Thinking Mode - Tool Calls](https://api-docs.deepseek.com/guides/thinking_mode#tool-calls)

#### Direct HTTP Requests

When making direct HTTP requests or using curl, you can include these parameters directly in the request body:

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
"model": "gemini-3.1-flash-lite-preview",
"messages": [{"role": "user", "content": "Solve this complex math problem step by step: ..."}],
"thinking": {"type": "enabled", "budget_tokens": 2000}
}'
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `gemini-3.1-flash-lite-preview` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

Use this version when the selected model supports `/v1/responses`. `messages` moves to `input`, and the final text is read from `response.output_text`.

```bash
curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '
  {
    "model": "gpt-5.5",
    "input": "Solve this complex math problem step by step: ...",
    "instructions": "You are a helpful assistant."
  }'
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


By adjusting these parameters, you can balance reasoning depth against cost and speed for your specific use case across different model providers.

### Managing the Context Window

Ensure sufficient space remains in the context window for both the expected output _and_ the internal reasoning tokens. Complex problems might require thousands or even tens of thousands of reasoning tokens.

You can often find the breakdown of token usage (including reasoning tokens, if exposed by the API) in the `usage` object of the API response.

**Example `usage` object structure (may vary):**

```json
{
  "usage": {
    "input_tokens": 75,
    "output_tokens": 1186, // Total output, including reasoning

    "output_tokens_details": {
      // Hypothetical detailed breakdown

      "reasoning_tokens": 1024,
      "completion_tokens": 162 // Visible output tokens

    },
    "total_tokens": 1261
  }
}
```

Check the [AvalAI Models documentation](en/models/model-details.md) for context window lengths for specific models.

### Controlling Costs

To manage costs:

1. Be mindful of the `reasoning.effort` (or equivalent) parameter if available. Higher effort usually means more tokens.
2. Use the `max_tokens` (or equivalent parameter like `max_output_tokens`) in your API request to limit the _total_ number of tokens generated (reasoning + output).

### Allocating Space for Reasoning

If the total generated tokens (reasoning + output) exceed the model's context limit or your specified `max_tokens` limit, the generation might stop prematurely. You could receive an error or an incomplete response (e.g., a status indicating `length` or `max_tokens` was reached). This can happen even before any visible output is generated, meaning you might incur costs without getting a usable result.

**Recommendation:** When first using reasoning models for complex tasks, reserve a generous portion of the context window for reasoning and output (e.g., 25,000+ tokens as a starting point, if the model supports it). Adjust this buffer based on observed token usage for your specific prompts.

**Handling Incomplete Responses (Example)**s

Your code should check for indicators that generation was stopped due to token limits.

```language-selector
python=:import json

# ... (client setup and initial request as before) ...

try:
    response = client.chat.completions.create(
        model="gpt-5.5",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=300,  # Limit total generated tokens (reasoning + output)
        # Add reasoning parameters if applicable
    )

    finish_reason = response.choices[0].finish_reason
    output_text = response.choices[0].message.content

    if finish_reason == "length":  # Standard finish reason for max_tokens
        print("Ran out of tokens (max_tokens reached).")
        if output_text:
            print("Partial output:", output_text)
        else:
            # This implies the limit was hit during internal reasoning
            print("Ran out of tokens during reasoning phase.")
    elif finish_reason == "stop":
        print("Completed successfully:")
        print(output_text)
    else:
        print(f"Finished with reason: {finish_reason}")
    if output_text:
        print("Output:", output_text)

except Exception as e:
    print(f"An API error occurred: {e}")

javascript=:// ... (client setup and initial request as before) ...

async function runReasoningWithLimit() {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-5.5",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300, // Limit total generated tokens
      // Add reasoning parameters if applicable
    });

    const finish_reason = response.choices[0].finish_reason;
    const output_text = response.choices[0].message.content;

    if (finish_reason === "length") {
      // Standard finish reason for max_tokens
      console.log("Ran out of tokens (max_tokens reached).");
      if (output_text) {
        console.log("Partial output:", output_text);
      } else {
        console.log("Ran out of tokens during reasoning phase.");
      }
    } else if (finish_reason === "stop") {
      console.log("Completed successfully:");
      console.log(output_text);
    } else {
      console.log(`Finished with reason: ${finish_reason}`);
      if (output_text) {
        console.log("Output:", output_text);
      }
    }
  } catch (error) {
    console.error("An API error occurred:", error);
  }
}

runReasoningWithLimit();

go=:package main

import (
	"context"
	"fmt"
	"os"

	openai "github.com/openai/openai-go"
)

func main() {
	// ... (client setup as before) ...

	prompt := "..."  // Your prompt here
	maxTokens := 300 // Define max_tokens

	resp, err := client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model: "gpt-5.5",
			Messages: []openai.ChatCompletionMessage{
				{Role: openai.ChatMessageRoleUser, Content: prompt},
			},
			MaxTokens: maxTokens, // Limit total generated tokens
			// Add reasoning parameters if applicable
		},
	)

	if err != nil {
		fmt.Printf("ChatCompletion error: %v\n", err)
		return
	}

	finishReason := resp.Choices[0].FinishReason
	outputText := resp.Choices[0].Message.Content

	if finishReason == openai.FinishReasonLength { // Check for length finish reason
		fmt.Println("Ran out of tokens (max_tokens reached).")
		if outputText != "" {
			fmt.Println("Partial output:", outputText)
		} else {
			fmt.Println("Ran out of tokens during reasoning phase.")
		}
	} else if finishReason == openai.FinishReasonStop {
		fmt.Println("Completed successfully:")
		fmt.Println(outputText)
	} else {
		fmt.Printf("Finished with reason: %s\n", finishReason)
		if outputText != "" {
			fmt.Println("Output:", outputText)
		}
	}
}

php=:<?php
require 'vendor/autoload.php';

// ... (client setup as before) ...

$prompt = "..."; // Your prompt here
$maxTokens = 300; // Define max_tokens

try {
 $response = $client->chat()->create([
 'model' => 'gpt-5.5',
 'messages' => [
 ['role' => 'user', 'content' => $prompt],
 ],
 'max_tokens' => $maxTokens, // Limit total generated tokens
 // Add reasoning parameters if applicable
 ]);

 $finishReason = $response->choices[0]->finishReason;
 // Ensure content exists before accessing
 $outputText = $response->choices[0]->message->content ?? null;

 if ($finishReason === 'length') { // Check for length finish reason
 echo "Ran out of tokens (max_tokens reached).\n";
 if ($outputText) {
 echo "Partial output: " . $outputText . "\n";
 } else {
 echo "Ran out of tokens during reasoning phase.\n";
 }
 } elseif ($finishReason === 'stop') {
 echo "Completed successfully:\n";
 echo $outputText . "\n";
 } else {
 echo "Finished with reason: " . $finishReason . "\n";
 if ($outputText) {
 echo "Output: " . $outputText . "\n";
 }
 }

} catch (Exception $e) {
 echo "An API error occurred: " . $e->getMessage() . "\n";
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

tools = [
    {
        "type": "function",
        "name": "get_current_weather",
        "description": "Get the current weather in a given location.",
        "parameters": {
            "type": "object",
            "properties": {"location": {"type": "string"}},
            "required": ["location"],
            "additionalProperties": False,
        },
    }
]

response = client.responses.create(
    model="gpt-5.5",
    input="Write a one-sentence summary of AvalAI.",
    tools=tools,
)

for item in response.output:
    if item.type == "function_call":
        print(item.name, item.arguments)
print(response.output_text)

javascript=:import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const tools = [
  {
    type: "function",
    name: "get_current_weather",
    description: "Get the current weather in a given location.",
    parameters: {
      type: "object",
      properties: { location: { type: "string" } },
      required: ["location"],
      additionalProperties: false,
    },
  },
];

const response = await client.responses.create({
  model: "gpt-5.5",
  input: "Write a one-sentence summary of AvalAI.",
  tools,
});

for (const item of response.output) {
  if (item.type === "function_call") {
    console.log(item.name, item.arguments);
  }
}
console.log(response.output_text);

bash=:curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '
  {
    "model": "gpt-5.5",
    "input": "Write a one-sentence summary of AvalAI.",
    "tools": [
      {
        "type": "function",
        "name": "get_current_weather",
        "description": "Get the current weather in a given location.",
        "parameters": {
          "type": "object",
          "properties": {
            "location": {
              "type": "string"
            }
          },
          "required": [
            "location"
          ],
          "additionalProperties": false
        }
      }
    ]
  }'

```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


## Advice on Prompting

Prompting reasoning models can differ slightly from prompting standard GPT models.

- **Reasoning Models:** Often perform well with higher-level goals and less explicit step-by-step instruction. Think of them as senior collaborators you can trust to figure out the details.
- **GPT Models:** Often benefit from very precise instructions and clear definitions of the desired output format. Think of them as junior collaborators needing explicit guidance.

Experiment with providing the overall objective and letting the reasoning model determine the best path, versus providing detailed steps.

### Prompt Examples

_(Note: The following examples use current reasoning-capable models such as `gpt-5.5`, `deepseek-v4-pro`, `qwen3.7-max`, and `glm-5.2`. Adjust parameters/endpoints as needed based on AvalAI's specific implementation.)_

**1. Coding (Refactoring)**

Task: Refactor a React component to change text color based on data.

```language-selector
javascript=:// --- Calling Code (Node.js) ---
import OpenAI from "openai";
import * as dotenv from "dotenv";
dotenv.config();

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

// Note the change here: Use indentation for the inner code example
// instead of triple backticks within the prompt string.
const prompt = `

Instructions:- Given the React component below, change it so that nonfiction books have red text.
- Return only the refactored React component code in your reply.
- Do not include explanations or markdown code blocks.
- Use four spaces for indentation.
- Keep lines under 80 columns.

Original Code:

    const books = [
     { title: 'Dune', category: 'fiction', id: 1 },
     { title: 'Frankenstein', category: 'fiction', id: 2 },
     { title: 'Moneyball', category: 'nonfiction', id: 3 },
    ];

    export default function BookList() {
     const listItems = books.map(book =>
     <li>
     {book.title}
     </li>
     );

     return (
     <ul>{listItems}</ul>
     );
    }

`.trim();

async function refactorCode() {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-5.5", // Use a suitable reasoning model from AvalAI
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1, // Lower temperature for more predictable code output
    });
    console.log(response.choices[0].message.content);
  } catch (error) {
    console.error("API Error:", error);
  }
}

refactorCode();

python=:# --- Calling Code (Python) ---
from openai import OpenAI
import os

client = OpenAI(
    api_key=os.environ.get("AVALAI_API_KEY"),
    base_url="https://api.avalai.ir/v1",
)

# Note the change here: Use indentation for the inner code example
# instead of triple backticks within the prompt string.
prompt = """

Instructions:- Given the React component below, change it so that nonfiction books have red text.
- Return only the refactored React component code in your reply.
- Do not include explanations or markdown code blocks.
- Use four spaces for indentation.
- Keep lines under 80 columns.

Original Code:

    const books = [
     { title: 'Dune', category: 'fiction', id: 1 },
     { title: 'Frankenstein', category: 'fiction', id: 2 },
     { title: 'Moneyball', category: 'nonfiction', id: 3 },
    ];

    export default function BookList() {
     const listItems = books.map(book =>
     <li>
     {book.title}
     </li>
     );

     return (
     <ul>{listItems}</ul>
     );
    }

""".strip()

try:
    response = client.chat.completions.create(
        model="gpt-5.5",  # Use a suitable reasoning model from AvalAI
        messages=[{"role": "user", "content": prompt}],
        temperature=0.1,  # Lower temperature for more predictable code output
    )
    print(response.choices[0].message.content)
except Exception as e:
    print(f"API Error: {e}")

bash=:# --- Calling Code (Bash/cURL) ---
# Note the change here: Use indentation for the inner code example
# instead of triple backticks within the prompt string.
PROMPT=$(
  cat <<'EOF'

Instructions:- Given the React component below, change it so that nonfiction books have red text.
- Return only the refactored React component code in your reply.
- Do not include explanations or markdown code blocks.
- Use four spaces for indentation.
- Keep lines under 80 columns.

Original Code:

    const books = [
     { title: 'Dune', category: 'fiction', id: 1 },
     { title: 'Frankenstein', category: 'fiction', id: 2 },
     { title: 'Moneyball', category: 'nonfiction', id: 3 },
    ];

    export default function BookList() {
     const listItems = books.map(book =>
     <li>
     {book.title}
     </li>
     );

     return (
     <ul>{listItems}</ul>
     );
    }

EOF
)

# Escape JSON special characters in the prompt
JSON_PROMPT=$(echo "$PROMPT" | jq -Rsa .)

curl https://api.avalai.ir/v1/chat/completions \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
 "model": "gpt-5.5",
 "messages": [{"role": "user", "content": '"$JSON_PROMPT"'}],
 "temperature": 0.1
 }'

go=:// --- Calling Code (Go) ---
package main

import (
	"context"
	"fmt"
	"os"
	"strings"

	openai "github.com/openai/openai-go"
)

func main() {
	apiKey := os.Getenv("AVALAI_API_KEY")
	baseURL := "https://api.avalai.ir/v1"

	config := openai.DefaultConfig(apiKey)
	config.BaseURL = baseURL
	client := openai.NewClientWithConfig(config)

	// Note the change here: Use indentation for the inner code example
	// instead of triple backticks within the prompt string.
	prompt := strings.TrimSpace(`

Instructions:- Given the React component below, change it so that nonfiction books have red text.
- Return only the refactored React component code in your reply.
- Do not include explanations or markdown code blocks.
- Use four spaces for indentation.
- Keep lines under 80 columns.

Original Code:

    const books = [
     { title: 'Dune', category: 'fiction', id: 1 },
     { title: 'Frankenstein', category: 'fiction', id: 2 },
     { title: 'Moneyball', category: 'nonfiction', id: 3 },
    ];

    export default function BookList() {
     const listItems = books.map(book =>
     <li>
     {book.title}
     </li>
     );

     return (
     <ul>{listItems}</ul>
     );
    }

`)

	temp := float32(0.1)
	resp, err := client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model: "gpt-5.5", // Use a suitable reasoning model from AvalAI
			Messages: []openai.ChatCompletionMessage{
				{Role: openai.ChatMessageRoleUser, Content: prompt},
			},
			Temperature: &temp,
		},
	)

	if err != nil {
		fmt.Printf("API Error: %v\n", err)
		return
	}
	fmt.Println(resp.Choices[0].Message.Content)
}

php=:// --- Calling Code (PHP) ---
<?php
require 'vendor/autoload.php';

use OpenAI\Client;

$apiKey = getenv('AVALAI_API_KEY');
$baseURL = 'https://api.avalai.ir/v1';

// Configure client (example)
$client = OpenAI::client($apiKey);
// Set base URL if needed via factory/config

// Note the change here: Use indentation for the inner code example
// instead of triple backticks within the prompt string.
$prompt = trim(<<<PROMPT

Instructions:- Given the React component below, change it so that nonfiction books have red text.
- Return only the refactored React component code in your reply.
- Do not include explanations or markdown code blocks.
- Use four spaces for indentation.
- Keep lines under 80 columns.

Original Code:

    const books = [
     { title: 'Dune', category: 'fiction', id: 1 },
     { title: 'Frankenstein', category: 'fiction', id: 2 },
     { title: 'Moneyball', category: 'nonfiction', id: 3 },
    ];

    export default function BookList() {
     const listItems = books.map(book =>
     <li>
     {book.title}
     </li>
     );

     return (
     <ul>{listItems}</ul>
     );
    }

PROMPT);


try {
 $response = $client->chat()->create([
 'model' => 'gpt-5.5', // Use a suitable reasoning model from AvalAI
 'messages' => [
 ['role' => 'user', 'content' => $prompt],
 ],
 'temperature' => 0.1,
 ]);

 echo $response->choices[0]->message->content;

} catch (Exception $e) {
 echo "API Error: " . $e->getMessage() . "\n";
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
    model="gpt-5.5",
    instructions="You are a helpful assistant.",
    input="Write a one-sentence summary of AvalAI.",
)

print(response.output_text)

javascript=:import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.responses.create({
  model: "gpt-5.5",
  instructions: "You are a helpful assistant.",
  input: "Write a one-sentence summary of AvalAI.",
});

console.log(response.output_text);

bash=:curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '
  {
    "model": "gpt-5.5",
    "input": "Write a one-sentence summary of AvalAI.",
    "instructions": "You are a helpful assistant."
  }'

```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


**2. Coding (Planning)**

Task: Plan and generate code for a simple Python Q&A application.

```language-selector
javascript=:// --- Calling Code (Node.js) ---
import OpenAI from "openai";
import * as dotenv from "dotenv";
dotenv.config();

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const prompt = `
I want to build a Python app that takes user questions and looks them up
in a simple key-value store (like a dictionary or JSON file) where they
are mapped to answers. If there is a close match (case-insensitive check),
it retrieves the matched answer. If there isn't, it asks the user to
provide an answer and stores the new question/answer pair.

1. Make a plan for the directory structure (e.g., main script, data file).
2. Return the full Python code for the main script.
3. Return an example JSON structure for the data file.
4. Only supply explanatory text at the very beginning and very end, not mixed within the code or file structure output.
`.trim();

async function planProject() {
  try {
    const response = await client.chat.completions.create({
      model: "deepseek-v4-pro", // Use a suitable reasoning model from AvalAI
      messages: [{ role: "user", content: prompt }],
    });
    console.log(response.choices[0].message.content);
  } catch (error) {
    console.error("API Error:", error);
  }
}

planProject();

python=:# --- Calling Code (Python) ---
from openai import OpenAI
import os

client = OpenAI(
    api_key=os.environ.get("AVALAI_API_KEY"),
    base_url="https://api.avalai.ir/v1",
)

prompt = """
I want to build a Python app that takes user questions and looks them up
in a simple key-value store (like a dictionary or JSON file) where they
are mapped to answers. If there is a close match (case-insensitive check),
it retrieves the matched answer. If there isn't, it asks the user to
provide an answer and stores the new question/answer pair.

1. Make a plan for the directory structure (e.g., main script, data file).
2. Return the full Python code for the main script.
3. Return an example JSON structure for the data file.
4. Only supply explanatory text at the very beginning and very end, not mixed within the code or file structure output.
""".strip()

try:
    response = client.chat.completions.create(
        model="deepseek-v4-pro",  # Use a suitable reasoning model from AvalAI
        messages=[{"role": "user", "content": prompt}],
    )
    print(response.choices[0].message.content)
except Exception as e:
    print(f"API Error: {e}")

bash=:# --- Calling Code (Bash/cURL) ---
PROMPT=$(
  cat <<'EOF'
I want to build a Python app that takes user questions and looks them up
in a simple key-value store (like a dictionary or JSON file) where they
are mapped to answers. If there is a close match (case-insensitive check),
it retrieves the matched answer. If there isn't, it asks the user to
provide an answer and stores the new question/answer pair.

1. Make a plan for the directory structure (e.g., main script, data file).
2. Return the full Python code for the main script.
3. Return an example JSON structure for the data file.
4. Only supply explanatory text at the very beginning and very end, not mixed within the code or file structure output.
EOF
)

# Escape JSON special characters
JSON_PROMPT=$(echo "$PROMPT" | jq -Rsa .)

curl https://api.avalai.ir/v1/chat/completions \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
 "model": "deepseek-v4-pro",
 "messages": [{"role": "user", "content": '"$JSON_PROMPT"'}]
 }'

go=:// --- Calling Code (Go) ---
package main

import (
	"context"
	"fmt"
	"os"
	"strings"

	openai "github.com/openai/openai-go"
)

func main() {
	apiKey := os.Getenv("AVALAI_API_KEY")
	baseURL := "https://api.avalai.ir/v1"

	config := openai.DefaultConfig(apiKey)
	config.BaseURL = baseURL
	client := openai.NewClientWithConfig(config)

	prompt := strings.TrimSpace(`
I want to build a Python app that takes user questions and looks them up
in a simple key-value store (like a dictionary or JSON file) where they
are mapped to answers. If there is a close match (case-insensitive check),
it retrieves the matched answer. If there isn't, it asks the user to
provide an answer and stores the new question/answer pair.

1. Make a plan for the directory structure (e.g., main script, data file).
2. Return the full Python code for the main script.
3. Return an example JSON structure for the data file.
4. Only supply explanatory text at the very beginning and very end, not mixed within the code or file structure output.
`)

	resp, err := client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model: "deepseek-v4-pro", // Use a suitable reasoning model from AvalAI
			Messages: []openai.ChatCompletionMessage{
				{Role: openai.ChatMessageRoleUser, Content: prompt},
			},
		},
	)

	if err != nil {
		fmt.Printf("API Error: %v\n", err)
		return
	}
	fmt.Println(resp.Choices[0].Message.Content)
}

php=:// --- Calling Code (PHP) ---
<?php
require 'vendor/autoload.php';

use OpenAI\Client;

$apiKey = getenv('AVALAI_API_KEY');
$baseURL = 'https://api.avalai.ir/v1';

// Configure client (example)
$client = OpenAI::client($apiKey);
// Set base URL if needed via factory/config

$prompt = trim(<<<PROMPT
I want to build a Python app that takes user questions and looks them up
in a simple key-value store (like a dictionary or JSON file) where they
are mapped to answers. If there is a close match (case-insensitive check),
it retrieves the matched answer. If there isn't, it asks the user to
provide an answer and stores the new question/answer pair.

1. Make a plan for the directory structure (e.g., main script, data file).
2. Return the full Python code for the main script.
3. Return an example JSON structure for the data file.
4. Only supply explanatory text at the very beginning and very end, not mixed within the code or file structure output.
PROMPT);

try {
 $response = $client->chat()->create([
 'model' => 'deepseek-v4-pro', // Use a suitable reasoning model from AvalAI
 'messages' => [
 ['role' => 'user', 'content' => $prompt],
 ],
 ]);

 echo $response->choices[0]->message->content;

} catch (Exception $e) {
 echo "API Error: " . $e->getMessage() . "\n";
}
?>

```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `deepseek-v4-pro` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

Use this version when the selected model supports `/v1/responses`. `messages` moves to `input`, and the final text is read from `response.output_text`.

```language-selector
python=:import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["AVALAI_API_KEY"],
    base_url="https://api.avalai.ir/v1",
)

response = client.responses.create(
    model="gpt-5.5",
    instructions="You are a helpful assistant.",
    input="Summarize the uploaded file.",
)

print(response.output_text)

javascript=:import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.responses.create({
  model: "gpt-5.5",
  instructions: "You are a helpful assistant.",
  input: "Summarize the uploaded file.",
});

console.log(response.output_text);

bash=:curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '
  {
    "model": "gpt-5.5",
    "input": "Summarize the uploaded file.",
    "instructions": "You are a helpful assistant."
  }'

```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


**3. STEM Research**

Task: Ask for potential compounds for antibiotic research.

```language-selector
javascript=:// --- Calling Code (Node.js) ---
import OpenAI from "openai";
import * as dotenv from "dotenv";
dotenv.config();

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const prompt = `
What are three compounds or classes of compounds we should consider
investigating further to advance research into new antibiotics,
especially against resistant bacteria? Briefly explain why each
is promising.
`.trim();

async function researchQuery() {
  try {
    const response = await client.chat.completions.create({
      model: "gemini-3.1-pro-preview", // Use a suitable reasoning model from AvalAI
      messages: [{ role: "user", content: prompt }],
    });
    console.log(response.choices[0].message.content);
  } catch (error) {
    console.error("API Error:", error);
  }
}

researchQuery();

python=:# --- Calling Code (Python) ---
from openai import OpenAI
import os

client = OpenAI(
    api_key=os.environ.get("AVALAI_API_KEY"),
    base_url="https://api.avalai.ir/v1",
)

prompt = """
What are three compounds or classes of compounds we should consider
investigating further to advance research into new antibiotics,
especially against resistant bacteria? Briefly explain why each
is promising.
""".strip()

try:
    response = client.chat.completions.create(
        model="gemini-3.1-pro-preview",  # Use a suitable reasoning model from AvalAI
        messages=[{"role": "user", "content": prompt}],
    )
    print(response.choices[0].message.content)
except Exception as e:
    print(f"API Error: {e}")

bash=:# --- Calling Code (Bash/cURL) ---
PROMPT=$(
  cat <<'EOF'
What are three compounds or classes of compounds we should consider
investigating further to advance research into new antibiotics,
especially against resistant bacteria? Briefly explain why each
is promising.
EOF
)

# Escape JSON special characters
JSON_PROMPT=$(echo "$PROMPT" | jq -Rsa .)

curl https://api.avalai.ir/v1/chat/completions \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
 "model": "gemini-3.1-pro-preview",
 "messages": [{"role": "user", "content": '"$JSON_PROMPT"'}]
 }'

go=:// --- Calling Code (Go) ---
package main

import (
	"context"
	"fmt"
	"os"
	"strings"

	openai "github.com/openai/openai-go"
)

func main() {
	apiKey := os.Getenv("AVALAI_API_KEY")
	baseURL := "https://api.avalai.ir/v1"

	config := openai.DefaultConfig(apiKey)
	config.BaseURL = baseURL
	client := openai.NewClientWithConfig(config)

	prompt := strings.TrimSpace(`
What are three compounds or classes of compounds we should consider
investigating further to advance research into new antibiotics,
especially against resistant bacteria? Briefly explain why each
is promising.
`)

	resp, err := client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model: "gemini-3.1-pro-preview", // Use a suitable reasoning model from AvalAI
			Messages: []openai.ChatCompletionMessage{
				{Role: openai.ChatMessageRoleUser, Content: prompt},
			},
		},
	)

	if err != nil {
		fmt.Printf("API Error: %v\n", err)
		return
	}
	fmt.Println(resp.Choices[0].Message.Content)
}

php=:// --- Calling Code (PHP) ---
<?php
require 'vendor/autoload.php';

use OpenAI\Client;

$apiKey = getenv('AVALAI_API_KEY');
$baseURL = 'https://api.avalai.ir/v1';

// Configure client (example)
$client = OpenAI::client($apiKey);
// Set base URL if needed via factory/config

$prompt = trim(<<<PROMPT
What are three compounds or classes of compounds we should consider
investigating further to advance research into new antibiotics,
especially against resistant bacteria? Briefly explain why each
is promising.
PROMPT);

try {
 $response = $client->chat()->create([
 'model' => 'gemini-3.1-pro-preview', // Use a suitable reasoning model from AvalAI
 'messages' => [
 ['role' => 'user', 'content' => $prompt],
 ],
 ]);

 echo $response->choices[0]->message->content;

} catch (Exception $e) {
 echo "API Error: " . $e->getMessage() . "\n";
}
?>

```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `gemini-3.1-pro-preview` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

Use this version when the selected model supports `/v1/responses`. `messages` moves to `input`, and the final text is read from `response.output_text`.

```language-selector
python=:import os
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

javascript=:import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.responses.create({
  model: "gpt-5.5",
  instructions: "You are a helpful assistant.",
  input: "Write a one-sentence summary of AvalAI.",
});

console.log(response.output_text);

bash=:curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '
  {
    "model": "gpt-5.5",
    "input": "Write a one-sentence summary of AvalAI.",
    "instructions": "You are a helpful assistant."
  }'

```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


## Use Case Examples

Explore the AvalAI Cookbook (if available) or community resources for more examples of applying reasoning models to tasks like data validation, routine generation, and complex analysis.

## Related Resources

- [AvalAI API Reference](en/api-reference/introduction.md)
- [AvalAI Models Overview](en/models/model-details.md)
- [Production Best Practices Guide](en/guides/production-best-practices.md)
- [Authentication Guide](en/api-reference/authentication.md)
- [Rate Limits Guide](en/guides/rate-limits.md)
