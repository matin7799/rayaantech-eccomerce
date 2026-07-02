# Built-in tools

Use built-in tools like web search and file search to extend the model's capabilities.

When generating model responses, you can extend model capabilities using built-in **tools**. These tools help models access additional context and information from the web or your files. The example below uses the [web search tool](en/guides/tools-web-search) to use the latest information from the web to generate a model response.

Include web search results for the model response

```language-selector
bash=:curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
"model": "gpt-5.5",
"tools": [{"type": "web_search"}],
"input": "what was a positive news story from today?"
}'

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,

  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.responses.create({
  model: "gpt-5.5",

  tools: [{ type: "web_search" }],

  input: "What was a positive news story from today?",
});

console.log(response.output_text);

python=:import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["AVALAI_API_KEY"],
    base_url="https://api.avalai.ir/v1",
)

response = client.responses.create(
    model="gpt-5.5",
    tools=[{"type": "web_search"}],
    input="What was a positive news story from today?",
)

print(response.output_text)

go=:package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
)

func main() {
	payload := map[string]any{
		"model": "gpt-5.5",
		"tools": []map[string]string{{"type": "web_search"}},
		"input": "What was a positive news story from today?",
	}

	body, err := json.Marshal(payload)
	if err != nil {
		panic(err)
	}

	req, err := http.NewRequest("POST", "https://api.avalai.ir/v1/responses", bytes.NewBuffer(body))
	if err != nil {
		panic(err)
	}
	req.Header.Set("Authorization", "Bearer "+os.Getenv("AVALAI_API_KEY"))
	req.Header.Set("Content-Type", "application/json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	responseBody, err := io.ReadAll(resp.Body)
	if err != nil {
		panic(err)
	}

	fmt.Println(string(responseBody))
}

php=:<?php

$apiKey = getenv('AVALAI_API_KEY');
$payload = [
    'model' => 'gpt-5.5',
    'tools' => [['type' => 'web_search']],
    'input' => 'What was a positive news story from today?',
];

$ch = curl_init('https://api.avalai.ir/v1/responses');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ' . $apiKey,
        'Content-Type: application/json',
    ],
    CURLOPT_POSTFIELDS => json_encode($payload),
]);

$response = curl_exec($ch);
curl_close($ch);

echo $response;
?>

```

## Available tools

Here's an overview of the tools available through AvalAI's unified API—select one of them for further guidance on usage.

### Standard Tools

[**Web search**](en/guides/tools-web-search)
Include data from the Internet in model response generation.

[**File search**](en/guides/tools-file-search)
Search the contents of uploaded files for context when generating a response.

[**Computer use**](en/guides/tools-computer-use)
Create agentic workflows that enable a model to control a computer interface.

[**Function calling**](en/guides/function-calling)
Enable the model to call custom code that you define, giving it access to additional data and capabilities.

### Google/Gemini Specific Tools

Gemini models (particularly `gemini-3.5-flash`, `gemini-3.1-pro-preview`, `gemini-3.1-flash-lite`, `gemini-2.5-pro`, and `gemini-2.5-flash`) support several specialized tools:

[**Code Execution**]
Allows Gemini to use code to solve complex tasks. When this tool is enabled, no other tools can be used simultaneously.

```python
# Example: Code execution with Gemini
response = client.chat.completions.create(
    model="gemini-3.1-pro-preview",
    messages=[{"role": "user", "content": "Calculate the first 10 Fibonacci numbers"}],
    tools=[
        {"codeExecution": {}},
    ],
)
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `gemini-3.1-pro-preview` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

Use this version when the selected model supports `/v1/responses`. `messages` moves to `input`, and the final text is read from `response.output_text`.

```python
import os
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
    input="Calculate the first 10 Fibonacci numbers",
    tools=tools,
)

for item in response.output:
    if item.type == "function_call":
        print(item.name, item.arguments)
print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


[**Google Search**]
Enables Gemini models to retrieve up-to-date information using Google Search. This tool can only be used in combination with the urlContext tool.

```python
# Example: Google Search with Gemini
response = client.chat.completions.create(
    model="gemini-3.1-pro-preview",
    messages=[
        {
            "role": "user",
            "content": "What are the latest developments in quantum computing?",
        }
    ],
    tools=[
        {"googleSearch": {}},
    ],
)
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `gemini-3.1-pro-preview` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

Use this version when the selected model supports `/v1/responses`. `messages` moves to `input`, and the final text is read from `response.output_text`.

```python
import os
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
    input="What are the latest developments in quantum computing?",
    tools=tools,
)

for item in response.output:
    if item.type == "function_call":
        print(item.name, item.arguments)
print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


[**URL Context**]
This experimental feature allows Gemini models to read and use URLs as context. The model looks for URLs in the user content and reads them, resulting in increased input token consumption.

```python
# Example: URL Context with Gemini (can be combined with Google Search)
response = client.chat.completions.create(
    model="gemini-3.1-pro-preview",
    messages=[
        {
            "role": "user",
            "content": "Summarize this article: https://example.com/article",
        }
    ],
    tools=[
        {"urlContext": {}},
    ],
)
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `gemini-3.1-pro-preview` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

Use this version when the selected model supports `/v1/responses`. `messages` moves to `input`, and the final text is read from `response.output_text`.

```python
import os
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
    input="Explain how AvalAI provides a unified API for this request.",
    tools=tools,
)

for item in response.output:
    if item.type == "function_call":
        print(item.name, item.arguments)
print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


> **Note**: Tool compatibility restrictions for Gemini models:
>
> - When code execution is enabled, no other tools can be used
> - Function declarations can only be used alone
> - Google Search can only be combined with URL Context

### Alibaba/DashScope Specific Tools

Alibaba's Qwen models (including `qwen3.7-max`, `qwen3.7-plus`, `qwen3.6-plus`, `qwen3.6-flash`, and legacy `qwen3-max` snapshots) support web search through the DashScope platform:

[**Web Search (enable_search)**]
Enables Qwen models to retrieve up-to-date information from the web. Unlike other providers, Alibaba uses the `enable_search` parameter instead of the `tools` array.

```python
# Example: Web Search with Alibaba Qwen3.7 Max
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["AVALAI_API_KEY"], base_url="https://api.avalai.ir/v1"
)

response = client.chat.completions.create(
    model="qwen3.7-max",
    messages=[
        {"role": "user", "content": "What is the current stock price of Alibaba?"}
    ],
    extra_body={"enable_search": True, "search_options": {"search_strategy": "agent"}},
)

print(response.choices[0].message.content)
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `qwen3.7-max` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

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
    input="What is the current stock price of Alibaba?",
)

print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


> **Note**: For Alibaba web search:
>
> - Current Qwen3.7 and Qwen3.6 models such as `qwen3.7-max`, `qwen3.7-plus`, `qwen3.6-plus`, and `qwen3.6-flash` support web search; legacy `qwen3-max` snapshots may also support it depending on availability
> - The `search_strategy` must be set to `"agent"` for international regions
> - Web search results are added to the prompt, increasing input tokens

## Tool Pricing

Each tool has its own separate pricing in addition to the base API model pricing for input/output tokens. The tokens used for built-in tools are billed at the chosen model's per-token rates, plus additional costs specific to each tool:

| Tool | Cost |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Code Interpreter | $0.03 per session |
| File Search Storage | $0.10 GB/day (1GB free) |
| File Search Tool Call (Responses API only*) | $2.50 per 1k calls (*Does not apply on Assistants API) |
| Web Search | Web search tool pricing is inclusive of tokens used to synthesize information from the web. Pricing depends on model and search context size. |

### Web Search Pricing

| Model | Search context size | Cost |
| ----------------------------------------- | ------------------- | ------------------ |
| gpt-5.5 / gpt-5.4 / gpt-5.4-pro | low | $30.00 per 1k calls |
| | medium (default) | $35.00 per 1k calls |
| | high | $50.00 per 1k calls |
| gpt-5.4-mini / gpt-5.4-nano | low | $25.00 per 1k calls |
| | medium (default) | $27.50 per 1k calls |
| | high | $30.00 per 1k calls |
| qwen3.7-max / qwen3.7-plus / qwen3.6-flash (Alibaba) | agent | $10.00 per 1k calls |

For complete pricing information, please refer to the [Pricing page](en/pricing.md).

## Usage in the API

When making a request to generate a [model response](en/api-reference/responses), you can enable tool access by specifying configurations in the `tools` parameter. Each tool has its own unique configuration requirements—see the [Available tools](#available-tools) section for detailed instructions.

Based on the provided [prompt](en/guides/text-generation), the model automatically decides whether to use a configured tool. For instance, if your prompt requests information beyond the model's training cutoff date and web search is enabled, the model will typically invoke the web search tool to retrieve relevant, up-to-date information.

You can explicitly control or guide this behavior by setting the `tool_choice` parameter [in the API request](en/api-reference/responses).

### Function calling

In addition to built-in tools, you can define custom functions using the `tools` array. These custom functions allow the model to call your application's code, enabling access to specific data or capabilities not directly available within the model.

Learn more in the [function calling guide](en/guides/function-calling).

## Related Resources

### Standard Tools
* [Web Search Guide](en/guides/tools-web-search)
* [File Search Guide](en/guides/tools-file-search)
* [Computer Use Guide](en/guides/tools-computer-use)
* [Function Calling Guide](en/guides/function-calling)
* [Responses API Reference](en/api-reference/responses)

### Google/Gemini Tools
* [Google Models Documentation](en/providers/google.md)
* [Model-Specific Parameters](en/guides/provider-specific-params.md)

### Alibaba/DashScope Tools
* [Alibaba Models Documentation](en/providers/alibaba.md)
* [Web Search Capabilities Example](en/examples/web_search_capabilities.md)
