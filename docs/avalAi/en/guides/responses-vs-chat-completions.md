# Responses vs. Chat Completions

Compare the Responses API and Chat Completions API.

This guide explains the key differences between the [Responses API](en/api-reference/responses.md) and [Chat Completions API](en/api-reference/chat.md), helping you choose the right approach for your application.

## Why the Responses API?

The Responses API is the newest core API and an agentic API primitive, combining the simplicity of Chat Completions with the ability to perform more agentic tasks. As model capabilities evolve, the Responses API provides a flexible foundation for building action-oriented applications, with built-in tools:

* [Web search](en/guides/tools-web-search.md)
* [File search](en/guides/tools-file-search.md)
* [Computer use](en/guides/tools-computer-use.md)

If you're a new user, we recommend using the Responses API.

## Capabilities Comparison

| Capability | Chat Completions API | Responses API |
|------------|---------------------|--------------|
| Text generation | ✓ | ✓ |
| Audio | ✓ | Coming soon |
| Vision | ✓ | ✓ |
| Structured Outputs | ✓ | ✓ |
| Function calling | ✓ | ✓ |
| Web search | | ✓ |
| File search | | ✓ |
| Computer use | | ✓ |
| Code interpreter | | Coming soon |

## The Chat Completions API Is Not Going Away

The Chat Completions API is an industry standard for building AI applications, and it will continue to be supported indefinitely. The Responses API was introduced to simplify workflows involving tool use, code execution, and state management. This new API primitive will allow for more effective platform enhancements in the future.

## A Stateful API and Semantic Events

Events are simpler with the Responses API. It has a predictable, event-driven architecture, whereas the Chat Completions API continuously appends to the content field as tokens are generated—requiring you to manually track differences between each state. Multi-step conversational logic and reasoning are easier to implement with the Responses API.

The Responses API clearly emits semantic events detailing precisely what changed (e.g., specific text additions), so you can write integrations targeted at specific emitted events (e.g., text changes), simplifying integration and improving type safety.

## Model Availability in Each API

Whenever possible, all new models will be added to both the Chat Completions API and Responses API. Some models may only be available through the Responses API if they use built-in tools (e.g., computer use models), or trigger multiple model generation turns behind the scenes (e.g., o1-pro). The detail pages for each [model](en/models/model-details.md) will indicate if they support Chat Completions, Responses, or both.

## Compare the Code

The following examples show how to make a basic API call to the [Chat Completions API](en/api-reference/chat.md) and the [Responses API](en/api-reference/responses.md).

### Text Generation Example

Both APIs make it easy to generate output from models. A completion requires a `messages` array, but a response requires an `input` (string or array, as shown below).

```language-selector
python=:# Chat Completions API
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["AVALAI_API_KEY"],
    base_url="https://api.avalai.ir/v1",
)

completion = client.chat.completions.create(
    model="gpt-5.5",
    messages=[
        {
            "role": "user",
            "content": "Write a one-sentence bedtime story about a unicorn.",
        }
    ],
)

print(completion.choices[0].message.content)

# Responses API
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
            "content": "Write a one-sentence bedtime story about a unicorn.",
        }
    ],
)

print(response.output_text)

javascript=:// Chat Completions API
import OpenAI from "openai";
const client = new OpenAI();

const completion = await client.chat.completions.create({
  model: "gpt-5.5",
  messages: [
    {
      role: "user",
      content: "Write a one-sentence bedtime story about a unicorn.",
    },
  ],
});

console.log(completion.choices[0].message.content);

// Responses API
import OpenAI from "openai";
const client = new OpenAI();

const response = await client.responses.create({
  model: "gpt-5.5",
  input: [
    {
      role: "user",
      content: "Write a one-sentence bedtime story about a unicorn.",
    },
  ],
});

console.log(response.output_text);

bash=:# Chat Completions API
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gpt-5.5",
    "messages": [
      {
        "role": "user",
        "content": "Write a one-sentence bedtime story about a unicorn."
      }
    ]
  }'

# Responses API
curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gpt-5.5",
    "input": [
      {
        "role": "user",
        "content": "Write a one-sentence bedtime story about a unicorn."
      }
    ]
  }'

go=:// Chat Completions API
package main

import (
	"context"
	"fmt"
	"github.com/openai/openai-go"
	"os"
)

func main() {
	client := openai.NewClient(os.Getenv("AVALAI_API_KEY"))
	client.BaseURL = "https://api.avalai.ir/v1"

	resp, err := client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model: "gpt-5.5",
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    "user",
					Content: "Write a one-sentence bedtime story about a unicorn.",
				},
			},
		},
	)

	if err != nil {
		fmt.Printf("Error: %v\n", err)
		return
	}

	fmt.Println(resp.Choices[0].Message.Content)

	// Responses API implementation would depend on the specific Go SDK support
}

php=:<?php
// Chat Completions API
require 'vendor/autoload.php';

$client = OpenAI::factory()
    ->withApiKey(getenv('AVALAI_API_KEY'))
    ->withBaseUri('https://api.avalai.ir/v1')
    ->make();

$result = $client->chat()->create([
    'model' => 'gpt-5.5',
    'messages' => [
        ['role' => 'user', 'content' => 'Write a one-sentence bedtime story about a unicorn.'],
    ],
]);

echo $result->choices[0]->message->content;

// Responses API
$client = OpenAI::factory()
    ->withApiKey(getenv('AVALAI_API_KEY'))
    ->withBaseUri('https://api.avalai.ir/v1')
    ->make();

$result = $client->responses()->create([
    'model' => 'gpt-5.5',
    'input' => [
        ['role' => 'user', 'content' => 'Write a one-sentence bedtime story about a unicorn.'],
    ],
]);

echo $result->output_text;
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
    input="Write a one-sentence bedtime story about a unicorn.",
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
  input: "Write a one-sentence bedtime story about a unicorn.",
});

console.log(response.output_text);

bash=:curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '
  {
    "model": "gpt-5.5",
    "input": "Write a one-sentence bedtime story about a unicorn.",
    "instructions": "You are a helpful assistant."
  }'

```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


When you get a response back from the Responses API, the fields differ slightly. Instead of a `message`, you receive a typed `response` object with its own `id`. Responses are stored by default. Chat completions are stored by default for new accounts. To disable storage when using either API, set `store: false`.

**Chat Completions API Response:**
```json
[
  {
    "index": 0,
    "message": {
      "role": "assistant",
      "content": "Under the soft glow of the moon, Luna the unicorn danced through fields of twinkling stardust, leaving trails of dreams for every child asleep.",
      "refusal": null
    },
    "logprobs": null,
    "finish_reason": "stop"
  }
]
```

**Responses API Response:**
```json
[
  {
    "id": "msg_67b73f697ba4819183a15cc17d011509",
    "type": "message",
    "role": "assistant",
    "content": [
      {
        "type": "output_text",
        "text": "Under the soft glow of the moon, Luna the unicorn danced through fields of twinkling stardust, leaving trails of dreams for every child asleep.",
        "annotations": []
      }
    ]
  }
]
```

## Key Differences

* The Responses API returns `output`, while the Chat Completions API returns a `choices` array.
* Structured Outputs API shape is different. Instead of `response_format`, use `text.format` in Responses. Learn more in the [Structured Outputs](structured-outputs.md) guide.
* Function calling API shape is different—both for the function config on the request and function calls sent back in the response. See the full difference in the [function calling guide](function-calling.md).
* Reasoning is different. Instead of `reasoning_effort` in Chat Completions, use `reasoning.effort` with the Responses API. Read more details in the [reasoning](reasoning.md) guide.
* The Responses SDK has an `output_text` helper, which the Chat Completions SDK does not have.
* Conversation state: You have to manage conversation state yourself in Chat Completions, while Responses has `previous_response_id` to help you with long-running conversations.
* Responses are stored by default. Chat completions are stored by default for new accounts. To disable storage, set `store: false`.

## What This Means for Existing APIs

### Chat Completions

The Chat Completions API remains the most widely used API. It will continue to be supported with new models and capabilities. If you don't need built-in tools for your application, you can confidently continue using Chat Completions.

New models will continue to be released to Chat Completions whenever their capabilities don't depend on built-in tools or multiple model calls. When you're ready for advanced capabilities designed specifically for agent workflows, the Responses API is recommended.

## Assistants

Based on developer feedback from the Assistants API beta, key improvements have been incorporated into the Responses API to make it more flexible, faster, and easier to use. The Responses API represents the future direction for building agents on AvalAI.

Work is ongoing to achieve full feature parity between the Assistants and the Responses API, including support for Assistant-like and Thread-like objects and the Code Interpreter tool. When complete, the Assistants API will be formally deprecated with a target sunset date in the first half of 2026.

Upon deprecation, a clear migration guide from the Assistants API to the Responses API will be provided that allows developers to preserve all their data and migrate their applications. Until formal deprecation is announced, new models will continue to be delivered to the Assistants API.

## Related Resources

- [Function Calling](en/guides/function-calling.md)
- [Tools](en/guides/tools.md)
- [Structured Outputs](en/guides/structured-outputs.md)
- [Reasoning](en/guides/reasoning.md)
