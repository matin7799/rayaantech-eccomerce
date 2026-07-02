# Web Search Capabilities with LLMs

## Introduction

Large Language Models (LLMs) with web search capabilities combine the reasoning abilities of advanced language models with real-time information from the internet. This guide explains how to use web search-enabled models through AvalAI's unified API to enhance your applications with up-to-date information, factual answers, and properly cited sources.

## Key Features

- **Real-time information retrieval** - Access current information beyond the model's training cutoff
- **Source attribution and citations** - Responses include links to sources for verification
- **Automatic search triggering** - Models determine when to search based on query needs
- **Multiple search approaches** - Choose between native search models or tool-based approaches
- **Seamless API integration** - Use familiar API endpoints with minimal configuration changes

> **Important:** This is different from [Direct Web Search](en/examples/using_v1_search), which is a standalone web search API that returns raw search results for programmatic use, while web search in chat completions augments AI responses with real-time web data.

## Available Models

### Native Search Models

These models have web search capabilities built directly into them:

- **OpenAI**:
  - `gpt-4o-search-preview` - Full-featured model with integrated search capabilities
  - `gpt-4o-mini-search-preview` - More efficient model with integrated search capabilities

### Tool-based Search Models

These models can perform web searches using tool configurations:

- **OpenAI**:
  - `gpt-5.5` - Can use web search via tools parameter
  - `gpt-5.4` - Can use web search via tools parameter

- **Google**:
  - `gemini-3.5-flash` - Uses tools parameter for search
  - `gemini-3.1-pro-preview` - Uses tools parameter for search
  - `gemini-3.1-flash-lite` - Uses tools parameter for search
  - `gemini-2.5-pro` - Uses tools parameter for search
  - `gemini-2.5-flash` - Uses tools parameter for search

- **Alibaba**:
  - `qwen3.7-max` - Uses `enable_search` parameter with agent strategy
  - `qwen3.7-plus` - Uses `enable_search` parameter with agent strategy
  - `qwen3.6-flash` - Uses `enable_search` parameter with agent strategy

## Basic Usage

### OpenAI Native Search

Native search models automatically perform web searches when needed without explicit configuration:

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
 "model": "gpt-4o-search-preview",
 "messages": [{
  "role": "user",
  "content": "what'"'"'s the news today?"
 }],
 "response_format": {
  "type": "text"
 },
 "store": false
}'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="gpt-4o-search-preview",
    messages=[{"role": "user", "content": "what's the news today?"}],
    response_format={"type": "text"},
    store=False,
)

print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.chat.completions.create({
  model: "gpt-4o-search-preview",
  messages: [
    {
      role: "user",
      content: "what's the news today?",
    },
  ],
  response_format: {
    type: "text",
  },
  store: false,
});

console.log(response.choices[0].message.content);

go=:package main

import (
	"context"
	"fmt"
	openai "github.com/openai/openai-go"
)

func main() {
	client := openai.NewClient("your-avalai-api-key")
	client.BaseURL = "https://api.avalai.ir/v1"

	resp, err := client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model: "gpt-4o-search-preview",
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleUser,
					Content: "what's the news today?",
				},
			},
			ResponseFormat: &openai.ChatCompletionResponseFormat{
				Type: openai.ChatCompletionResponseFormatTypeText,
			},
		},
	)

	if err != nil {
		fmt.Printf("ChatCompletion error: %v\n", err)
		return
	}

	fmt.Println(resp.Choices[0].Message.Content)
}

php=:<?php

require 'vendor/autoload.php';

$apiKey = getenv('AVALAI_API_KEY'); // Or replace with your actual key: 'aa-YOUR_API_KEY'

if (!$apiKey) {
    die("AvalAI API key not found. Please set the AVALAI_API_KEY environment variable.");
}

// Your custom base URL
$customBaseUrl = 'https://api.avalai.ir/v1';

// Create a custom client instance using the factory
$client = OpenAI::factory()
    ->withApiKey($apiKey)
    ->withBaseUri($customBaseUrl)
    ->make();

$completion = $client->chat()->create([
 'model' => 'gpt-4o-search-preview',
 'messages' => [
  [
   'role' => 'user',
   'content' => 'what\'s the news today?'
  ]
 ],
 'response_format' => [
  'type' => 'text'
 ],
 'store' => false
]);

echo $completion->choices[0]->message->content;

```

### OpenAI Tool-based Search

Regular OpenAI models can perform web searches using the tools parameter:

```language-selector
bash=:curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
 "model": "gpt-5.5",
 "tools": [{"type": "web_search"}],
 "input": "What was a positive news story from today?"
}'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.responses.create(
    model="gpt-5.5",
    tools=[{"type": "web_search"}],
    input="What was a positive news story from today?",
)

print(response.output_text)

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

go=:package main

import (
	"context"
	"fmt"
	openai "github.com/openai/openai-go"
)

func main() {
	client := openai.NewClient("your-avalai-api-key")
	client.BaseURL = "https://api.avalai.ir/v1"

	resp, err := client.CreateResponse(
		context.Background(),
		openai.ResponseRequest{
			Model: "gpt-5.5",
			Tools: []openai.Tool{
				{
					Type: "web_search",
				},
			},
			Input: "What was a positive news story from today?",
		},
	)

	if err != nil {
		fmt.Printf("Response error: %v\n", err)
		return
	}

	fmt.Println(resp.OutputText)
}

php=:<?php

require 'vendor/autoload.php';

$apiKey = getenv('AVALAI_API_KEY'); // Or replace with your actual key: 'aa-YOUR_API_KEY'

if (!$apiKey) {
    die("AvalAI API key not found. Please set the AVALAI_API_KEY environment variable.");
}

// Your custom base URL
$customBaseUrl = 'https://api.avalai.ir/v1';

// Create a custom client instance using the factory
$client = OpenAI::factory()
    ->withApiKey($apiKey)
    ->withBaseUri($customBaseUrl)
    ->make();

$response = $client->responses()->create([
 'model' => 'gpt-5.5',
 'tools' => [['type' => 'web_search']],
 'input' => 'What was a positive news story from today?'
]);

echo $response->output_text;

```

### Gemini Models

Gemini models use the tools parameter to enable web search:

```language-selector
bash=:curl -i "https://api.avalai.ir/v1/chat/completions" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
 "model": "gemini-2.5-flash",
 "messages": [{"role": "user", "content": "whats the news for today"}],
 "tools": [
  {
   "googleSearch": {}
  }
 ]
}'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="gemini-2.5-flash",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "whats the news?"},
    ],
    tools=[{"googleSearch": {}}],
)

print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.chat.completions.create({
  model: "gemini-2.5-flash",
  messages: [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: "whats the news?" },
  ],
  tools: [{ googleSearch: {} }],
});

console.log(response.choices[0].message.content);

go=:package main

import (
	"context"
	"fmt"
	openai "github.com/openai/openai-go"
)

func main() {
	client := openai.NewClient("your-avalai-api-key")
	client.BaseURL = "https://api.avalai.ir/v1"

	resp, err := client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model: "gemini-2.5-flash",
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleSystem,
					Content: "You are a helpful assistant.",
				},
				{
					Role:    openai.ChatMessageRoleUser,
					Content: "whats the news?",
				},
			},
			Tools: []openai.Tool{
				{
					GoogleSearch: &openai.GoogleSearchTool{},
				},
			},
		},
	)

	if err != nil {
		fmt.Printf("ChatCompletion error: %v\n", err)
		return
	}

	fmt.Println(resp.Choices[0].Message.Content)
}

php=:<?php

require 'vendor/autoload.php';

$apiKey = getenv('AVALAI_API_KEY'); // Or replace with your actual key: 'aa-YOUR_API_KEY'

if (!$apiKey) {
    die("AvalAI API key not found. Please set the AVALAI_API_KEY environment variable.");
}

// Your custom base URL
$customBaseUrl = 'https://api.avalai.ir/v1';

// Create a custom client instance using the factory
$client = OpenAI::factory()
    ->withApiKey($apiKey)
    ->withBaseUri($customBaseUrl)
    ->make();

$completion = $client->chat()->create([
 'model' => 'gemini-2.5-flash',
 'messages' => [
  [
   'role' => 'system',
   'content' => 'You are a helpful assistant.'
  ],
  [
   'role' => 'user',
   'content' => 'whats the news?'
  ]
 ],
 'tools' => [
  ['googleSearch' => new stdClass()]
 ]
]);

echo $completion->choices[0]->message->content;

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
    input="whats the news?",
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
  input: "whats the news?",
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
    "input": "whats the news?",
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


### Native Gemini API (v1beta)

In addition to the OpenAI-compatible endpoint shown above, you can also use Google's native Gemini API (v1beta) for more advanced grounding features. This approach provides access to detailed grounding metadata including citations, search queries, and source information.

#### Using cURL

```bash
curl "https://api.avalai.ir/v1beta/models/gemini-2.5-flash:generateContent" \
  -H "x-goog-api-key: $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -X POST \
  -d '{
    "contents": [
      {
        "parts": [
          {"text": "What are the latest developments in quantum computing?"}
        ]
      }
    ],
    "tools": [
      {
        "google_search": {}
      }
    ]
  }'
```

#### Using Google GenAI SDK (Python)

```python
from google import genai
from google.genai import types

client = genai.Client(
    api_key="your-avalai-api-key",
    http_options={"api_version": "v1beta", "base_url": "https://api.avalai.ir"},
)

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="What are the latest developments in quantum computing?",
    config=types.GenerateContentConfig(
        tools=[types.Tool(google_search=types.GoogleSearch())]
    ),
)

print(response.text)

# Access grounding metadata for citations
if response.candidates[0].grounding_metadata:
    metadata = response.candidates[0].grounding_metadata
    print(f"Search queries used: {metadata.web_search_queries}")
    for chunk in metadata.grounding_chunks:
        print(f"Source: {chunk.web.title} - {chunk.web.uri}")
```

#### Using Google GenAI SDK (JavaScript)

```javascript
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.AVALAI_API_KEY,
    httpOptions: {"apiVersion": "v1beta", "baseUrl": "https://api.avalai.ir"}
});

const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "What are the latest developments in quantum computing?",
    config: {
        tools: [{ googleSearch: {} }]
    }
});

console.log(response.text);

// Access grounding metadata
const metadata = response.candidates[0].groundingMetadata;
if (metadata) {
    console.log("Search queries:", metadata.webSearchQueries);
    metadata.groundingChunks.forEach(chunk => {
        console.log(`Source: ${chunk.web.title} - ${chunk.web.uri}`);
    });
}
```

#### Grounding Metadata Response

The native API returns detailed grounding information:

```json
{
  "candidates": [
    {
      "content": {
        "parts": [{"text": "Recent developments in quantum computing include..."}],
        "role": "model"
      },
      "groundingMetadata": {
        "webSearchQueries": ["latest quantum computing developments 2024"],
        "groundingChunks": [
          {"web": {"uri": "https://...", "title": "Source Title"}}

          ],
          "groundingSupports": [
            {
              "segment": {"startIndex": 0, "endIndex": 100, "text": "..."},
              "groundingChunkIndices": [0]
            }
          ]
        }
      }
    ]
  }
```

For more details on using the native Gemini API with AvalAI, see the [v1beta API Reference](en/api-reference/v1beta.md#grounding-with-google-search).

### Alibaba Models (Qwen)

Alibaba's current Qwen models support web search through the `enable_search` parameter with agent strategy. This allows models such as `qwen3.7-max`, `qwen3.7-plus`, and `qwen3.6-flash` to access real-time information from the web.

> **Note**: For international regions, set `search_strategy` to `agent`. Older `qwen3-max` snapshots may still work, but prefer the current Qwen3.7 or Qwen3.6 model IDs for new integrations.

```language-selector
bash=:curl -X POST https://api.avalai.ir/v1/chat/completions \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "qwen3.7-max",
    "messages": [
        {
            "role": "user",
            "content": "What is Alibaba stock price"
        }
    ],
    "enable_search": true,
    "search_options": {"search_strategy": "agent"}
}'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="qwen3.7-max",
    messages=[
        {
            "role": "user",
            "content": "What is the current weather forecast for New York?",
        }
    ],
    extra_body={"enable_search": True, "search_options": {"search_strategy": "agent"}},
)

print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.chat.completions.create({
  model: "qwen3.7-max",
  messages: [
    { role: "user", content: "What are the latest tech news today?" }
  ],
  enable_search: true,
  search_options: { search_strategy: "agent" }
});

console.log(response.choices[0].message.content);

php=:<?php

require 'vendor/autoload.php';

$apiKey = getenv('AVALAI_API_KEY');

if (!$apiKey) {
    die("AvalAI API key not found. Please set the AVALAI_API_KEY environment variable.");
}

$customBaseUrl = 'https://api.avalai.ir/v1';

$client = OpenAI::factory()
    ->withApiKey($apiKey)
    ->withBaseUri($customBaseUrl)
    ->make();

$completion = $client->chat()->create([
 'model' => 'qwen3.7-max',
 'messages' => [
  [
   'role' => 'user',
   'content' => 'What is the current stock price of Tesla?'
  ]
 ],
 'enable_search' => true,
 'search_options' => ['search_strategy' => 'agent']
]);

echo $completion->choices[0]->message->content;

```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `qwen3.7-max` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

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
    input="What are the latest tech news today?",
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
  input: "What are the latest tech news today?",
});

console.log(response.output_text);

bash=:curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '
  {
    "model": "gpt-5.5",
    "input": "What are the latest tech news today?",
    "instructions": "You are a helpful assistant."
  }'

```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


**Key Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `enable_search` | boolean | Set to `true` to enable web search |
| `search_options.search_strategy` | string | Must be `"agent"` for international regions |

**Billing:** Web search with Alibaba models involves model call fees (increased input tokens from search results) plus search policy fees ($10.00 per 1,000 calls for agent strategy in international regions).

## Advanced Web Search Features

### Types of Web Search

OpenAI models support three main types of web search:

#### 1. Non-reasoning Web Search
The model sends the user's query to the web search tool, which returns the response based on top results. This method is fast and ideal for quick lookups.

```language-selector
bash=:curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
 "model": "gpt-5.5",
 "tools": [{"type": "web_search"}],
 "input": "What is the current weather in London?"
}'

python=:import requests

url = "https://api.avalai.ir/v1/responses"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer $AVALAI_API_KEY",
}

data = {
    "model": "gpt-5.5",
    "tools": [{"type": "web_search"}],
    "input": "What is the current weather in London?",
}

response = requests.post(url, headers=headers, json=data)

javascript=:import fetch from 'node-fetch';

const response = await fetch('https://api.avalai.ir/v1/responses', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer $AVALAI_API_KEY',
  },
  body: JSON.stringify({
    model: 'gpt-5.5',
    tools: [{ type: 'web_search' }],
    input: 'What is the current weather in London?',
  }),
});

const data = await response.json();

```

#### 2. Agentic Search with Reasoning Models
The model actively manages the search process, performing web searches as part of its chain of thought and deciding whether to keep searching.

```language-selector
bash=:curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
 "model": "gpt-5.5",
 "reasoning": {"effort": "medium"},
 "tools": [{"type": "web_search"}],
 "input": "Compare the latest electric vehicle sales data across different markets"
}'

python=:import requests

data = {
    "model": "gpt-5.5",
    "reasoning": {"effort": "medium"},
    "tools": [{"type": "web_search"}],
    "input": "Compare the latest electric vehicle sales data across different markets",
}

response = requests.post(url, headers=headers, json=data)

```

#### 3. Deep Research
A specialized method for in-depth investigations, often tapping into hundreds of sources and running for several minutes.

```language-selector
bash=:curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
 "model": "o3-deep-research",
 "tools": [{"type": "web_search", "search_context_size": "high"}],
 "input": "Conduct a comprehensive analysis of renewable energy adoption trends globally"
}'

python=:import requests

data = {
    "model": "o3-deep-research",
    "tools": [{"type": "web_search", "search_context_size": "high"}],
    "input": "Conduct a comprehensive analysis of renewable energy adoption trends globally",
}

response = requests.post(url, headers=headers, json=data)

```

### Domain Filtering

Limit search results to specific domains using the `allowed_domains` parameter:

```language-selector
bash=:curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
 "model": "gpt-5.5",
 "tools": [{
   "type": "web_search",
   "filters": {
     "allowed_domains": [
       "pubmed.ncbi.nlm.nih.gov",
       "clinicaltrials.gov",
       "www.who.int",
       "www.cdc.gov"
     ]
   }
 }],
 "input": "Find recent research on COVID-19 treatments"
}'

python=:import requests

data = {
    "model": "gpt-5.5",
    "tools": [
        {
            "type": "web_search",
            "filters": {
                "allowed_domains": [
                    "pubmed.ncbi.nlm.nih.gov",
                    "clinicaltrials.gov",
                    "www.who.int",
                    "www.cdc.gov",
                ]
            },
        }
    ],
    "input": "Find recent research on COVID-19 treatments",
}

response = requests.post(url, headers=headers, json=data)

```

### User Location

Refine search results based on geographic location:

```language-selector
bash=:curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
 "model": "o4-mini",
 "tools": [{
   "type": "web_search",
   "user_location": {
     "type": "approximate",
     "country": "US",
     "city": "San Francisco",
     "region": "California",
     "timezone": "America/Los_Angeles"
   }
 }],
 "input": "Find the best Italian restaurants near me"
}'

python=:import requests

data = {
    "model": "o4-mini",
    "tools": [
        {
            "type": "web_search",
            "user_location": {
                "type": "approximate",
                "country": "US",
                "city": "San Francisco",
                "region": "California",
                "timezone": "America/Los_Angeles",
            },
        }
    ],
    "input": "Find the best Italian restaurants near me",
}

response = requests.post(url, headers=headers, json=data)

```

### Sources Field

View all URLs retrieved during a web search using the `include` parameter:

```language-selector
bash=:curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
 "model": "gpt-5.5",
 "tools": [{"type": "web_search"}],
 "include": ["web_search_call.action.sources"],
 "input": "Latest developments in artificial intelligence"
}'

python=:import requests

data = {
    "model": "gpt-5.5",
    "tools": [{"type": "web_search"}],
    "include": ["web_search_call.action.sources"],
    "input": "Latest developments in artificial intelligence",
}

response = requests.post(url, headers=headers, json=data)

# Access sources from the response
sources = response.json()["web_search_call"]["action"]["sources"]
for source in sources:
    print(f"Source: {source['url']} - {source.get('title', 'No title')}")

```

## Use Cases

### News Search

Web search-enabled models excel at providing current news information:

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
 "model": "gpt-4o-search-preview",
 "messages": [{
 "role": "user",
 "content": "What are the major headlines today?"
 }]
}'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="gpt-4o-search-preview",
    messages=[{"role": "user", "content": "What are the major headlines today?"}],
)

print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.chat.completions.create({
  model: "gpt-4o-search-preview",
  messages: [{ role: "user", content: "What are the major headlines today?" }],
});

console.log(response.choices[0].message.content);

go=:package main

import (
	"context"
	"fmt"
	openai "github.com/openai/openai-go"
)

func main() {
	client := openai.NewClient("your-avalai-api-key")
	client.BaseURL = "https://api.avalai.ir/v1"

	resp, err := client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model: "gpt-4o-search-preview",
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleUser,
					Content: "What are the major headlines today?",
				},
			},
		},
	)

	if err != nil {
		fmt.Printf("ChatCompletion error: %v\n", err)
		return
	}

	fmt.Println(resp.Choices[0].Message.Content)
}

php=:<?php

require 'vendor/autoload.php';

$apiKey = getenv('AVALAI_API_KEY'); // Or replace with your actual key: 'aa-YOUR_API_KEY'

if (!$apiKey) {
    die("AvalAI API key not found. Please set the AVALAI_API_KEY environment variable.");
}

// Your custom base URL
$customBaseUrl = 'https://api.avalai.ir/v1';

// Create a custom client instance using the factory
$client = OpenAI::factory()
    ->withApiKey($apiKey)
    ->withBaseUri($customBaseUrl)
    ->make();

$completion = $client->chat()->create([
 'model' => 'gpt-4o-search-preview',
 'messages' => [
 [
 'role' => 'user',
 'content' => 'What are the major headlines today?'
 ]
 ]
]);

echo $completion->choices[0]->message->content;

```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `gpt-4o-search-preview` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

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
    input="What are the major headlines today?",
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
  input: "What are the major headlines today?",
});

console.log(response.output_text);

bash=:curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '
  {
    "model": "gpt-5.5",
    "input": "What are the major headlines today?",
    "instructions": "You are a helpful assistant."
  }'

```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


### Factual Question Answering

These models can provide factual answers with citations:

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
 "model": "gpt-4o-search-preview",
 "messages": [{
 "role": "user",
 "content": "Who won the most recent Nobel Prize in Physics and what was their contribution?"
 }]
}'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="gpt-4o-search-preview",
    messages=[
        {
            "role": "user",
            "content": "Who won the most recent Nobel Prize in Physics and what was their contribution?",
        }
    ],
)

print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.chat.completions.create({
  model: "gpt-4o-search-preview",
  messages: [
    {
      role: "user",
      content:
        "Who won the most recent Nobel Prize in Physics and what was their contribution?",
    },
  ],
});

console.log(response.choices[0].message.content);

go=:package main

import (
	"context"
	"fmt"
	openai "github.com/openai/openai-go"
)

func main() {
	client := openai.NewClient("your-avalai-api-key")
	client.BaseURL = "https://api.avalai.ir/v1"

	resp, err := client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model: "gpt-4o-search-preview",
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleUser,
					Content: "Who won the most recent Nobel Prize in Physics and what was their contribution?",
				},
			},
		},
	)

	if err != nil {
		fmt.Printf("ChatCompletion error: %v\n", err)
		return
	}

	fmt.Println(resp.Choices[0].Message.Content)
}

php=:<?php

require 'vendor/autoload.php';

$apiKey = getenv('AVALAI_API_KEY'); // Or replace with your actual key: 'aa-YOUR_API_KEY'

if (!$apiKey) {
    die("AvalAI API key not found. Please set the AVALAI_API_KEY environment variable.");
}

// Your custom base URL
$customBaseUrl = 'https://api.avalai.ir/v1';

// Create a custom client instance using the factory
$client = OpenAI::factory()
    ->withApiKey($apiKey)
    ->withBaseUri($customBaseUrl)
    ->make();

$completion = $client->chat()->create([
 'model' => 'gpt-4o-search-preview',
 'messages' => [
 [
 'role' => 'user',
 'content' => 'Who won the most recent Nobel Prize in Physics and what was their contribution?'
 ]
 ]
]);

echo $completion->choices[0]->message->content;

```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `gpt-4o-search-preview` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

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
    input="Who won the most recent Nobel Prize in Physics and what was their contribution?",
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
  input: "Who won the most recent Nobel Prize in Physics and what was their contribution?",
});

console.log(response.output_text);

bash=:curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '
  {
    "model": "gpt-5.5",
    "input": "Who won the most recent Nobel Prize in Physics and what was their contribution?",
    "instructions": "You are a helpful assistant."
  }'

```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


## Customizing Parameters

### OpenAI Search Parameters

For native search models, you can use standard parameters:

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
 "model": "gpt-4o-search-preview",
 "messages": [{
 "role": "user",
 "content": "What happened in the financial markets today?"
 }],
 "temperature": 0.2,
 "response_format": {"type": "text"}
}'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="gpt-4o-search-preview",
    messages=[
        {"role": "user", "content": "What happened in the financial markets today?"}
    ],
    temperature=0.2,  # Lower temperature for more factual responses
    response_format={"type": "text"},  # For text-only responses
)

print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.chat.completions.create({
  model: "gpt-4o-search-preview",
  messages: [
    { role: "user", content: "What happened in the financial markets today?" },
  ],
  temperature: 0.2, // Lower temperature for more factual responses
  response_format: { type: "text" }, // For text-only responses
});

console.log(response.choices[0].message.content);

go=:package main

import (
	"context"
	"fmt"
	openai "github.com/openai/openai-go"
)

func main() {
	client := openai.NewClient("your-avalai-api-key")
	client.BaseURL = "https://api.avalai.ir/v1"

	resp, err := client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model: "gpt-4o-search-preview",
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleUser,
					Content: "What happened in the financial markets today?",
				},
			},
			Temperature: 0.2, // Lower temperature for more factual responses
			ResponseFormat: &openai.ChatCompletionResponseFormat{
				Type: openai.ChatCompletionResponseFormatTypeText, // For text-only responses
			},
		},
	)

	if err != nil {
		fmt.Printf("ChatCompletion error: %v\n", err)
		return
	}

	fmt.Println(resp.Choices[0].Message.Content)
}

php=:<?php

require 'vendor/autoload.php';

$apiKey = getenv('AVALAI_API_KEY'); // Or replace with your actual key: 'aa-YOUR_API_KEY'

if (!$apiKey) {
    die("AvalAI API key not found. Please set the AVALAI_API_KEY environment variable.");
}

// Your custom base URL
$customBaseUrl = 'https://api.avalai.ir/v1';

// Create a custom client instance using the factory
$client = OpenAI::factory()
    ->withApiKey($apiKey)
    ->withBaseUri($customBaseUrl)
    ->make();

$completion = $client->chat()->create([
 'model' => 'gpt-4o-search-preview',
 'messages' => [
 [
 'role' => 'user',
 'content' => 'What happened in the financial markets today?'
 ]
 ],
 'temperature' => 0.2, // Lower temperature for more factual responses
 'response_format' => [
 'type' => 'text' // For text-only responses
 ]
]);

echo $completion->choices[0]->message->content;

```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `gpt-4o-search-preview` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

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
    input="What happened in the financial markets today?",
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
  input: "What happened in the financial markets today?",
});

console.log(response.output_text);

bash=:curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '
  {
    "model": "gpt-5.5",
    "input": "What happened in the financial markets today?",
    "instructions": "You are a helpful assistant."
  }'

```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


### Gemini Search Parameters

For Gemini models, you can customize the search behavior:

```language-selector
bash=:curl -i "https://api.avalai.ir/v1/chat/completions" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
 "model": "gemini-2.5-flash",
 "messages": [{"role": "user", "content": "What are the latest developments in quantum computing?"}],
 "tools": [
 {
 "googleSearch": {
 "detail_level": "high"
 }
 }
 ]
}'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="gemini-2.5-flash",
    messages=[
        {
            "role": "user",
            "content": "What are the latest developments in quantum computing?",
        }
    ],
    tools=[{"googleSearch": {"detail_level": "high"}}],
)

print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.chat.completions.create({
  model: "gemini-2.5-flash",
  messages: [
    {
      role: "user",
      content: "What are the latest developments in quantum computing?",
    },
  ],
  tools: [
    {
      googleSearch: {
        detail_level: "high",
      },
    },
  ],
});

console.log(response.choices[0].message.content);

go=:package main

import (
	"context"
	"fmt"
	openai "github.com/openai/openai-go"
)

func main() {
	client := openai.NewClient("your-avalai-api-key")
	client.BaseURL = "https://api.avalai.ir/v1"

	resp, err := client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model: "gemini-2.5-flash",
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleUser,
					Content: "What are the latest developments in quantum computing?",
				},
			},
			Tools: []openai.Tool{
				{
					GoogleSearch: &openai.GoogleSearchTool{
						DetailLevel: "high",
					},
				},
			},
		},
	)

	if err != nil {
		fmt.Printf("ChatCompletion error: %v\n", err)
		return
	}

	fmt.Println(resp.Choices[0].Message.Content)
}

php=:<?php

require 'vendor/autoload.php';

$apiKey = getenv('AVALAI_API_KEY'); // Or replace with your actual key: 'aa-YOUR_API_KEY'

if (!$apiKey) {
    die("AvalAI API key not found. Please set the AVALAI_API_KEY environment variable.");
}

// Your custom base URL
$customBaseUrl = 'https://api.avalai.ir/v1';

// Create a custom client instance using the factory
$client = OpenAI::factory()
    ->withApiKey($apiKey)
    ->withBaseUri($customBaseUrl)
    ->make();

$detailLevel = new stdClass();
$detailLevel->detail_level = "high";

$completion = $client->chat()->create([
 'model' => 'gemini-2.5-flash',
 'messages' => [
 [
 'role' => 'user',
 'content' => 'What are the latest developments in quantum computing?'
 ]
 ],
 'tools' => [
 ['googleSearch' => $detailLevel]
 ]
]);

echo $completion->choices[0]->message->content;

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
  input: "What are the latest developments in quantum computing?",
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
    "input": "What are the latest developments in quantum computing?",
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


## Search Result Citations

### Citation Formats

OpenAI models provide citations in different formats depending on the endpoint:

1. **Chat Completions API** - Citations are included inline in the text as hyperlinks or footnotes
2. **Responses API** - Citations are provided in a structured format with URL annotations

Example of structured citation from Responses API:

```json
{
  "id": "msg_67c9fa077e288190af08fdffda2e34f20be649c1a5ff9609",
  "type": "message",
  "status": "completed",
  "role": "assistant",
  "content": [
    {
      "type": "output_text",
      "text": "On March 6, 2025, several news...",
      "annotations": [
        {
          "type": "url_citation",
          "start_index": 2606,
          "end_index": 2758,
          "url": "https://...",

          "title": "Title..."
        }
      ]
    }
  ]
}
```

### Parsing Citations

To parse citations in your application:

```language-selector
bash=:# This is a simplified example showing how to extract citation data from API response
# In a real application, you would parse the JSON response
curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
 "model": "gpt-5.5",
 "tools": [{"type": "web_search"}],
 "input": "What was a positive news story from today?"
}' | jq '.annotations[] | select(.type == "url_citation") | {url: .url, title: .title}'

python=:# For Responses API
response = client.responses.create(
 model="gpt-5.5",
 tools=[{"type": "web_search"}],
 input="What was a positive news story from today?"
)

# Extract citations
content = response.output_text
annotations = response.annotations

for annotation in annotations:
 if annotation.type == "url_citation":
 url = annotation.url
 title = annotation.title
 start = annotation.start_index
 end = annotation.end_index
 
 # Process citation as needed
 print(f"Citation: {title} - {url}")

javascript=:// For Responses API
const response = await client.responses.create({
  model: "gpt-5.5",
  tools: [{ type: "web_search" }],
  input: "What was a positive news story from today?",
});

// Extract citations
const content = response.output_text;
const annotations = response.annotations;

for (const annotation of annotations) {
  if (annotation.type === "url_citation") {
    const url = annotation.url;
    const title = annotation.title;
    const start = annotation.start_index;
    const end = annotation.end_index;

    // Process citation as needed
    console.log(`Citation: ${title} - ${url}`);
  }
}

go=:// For Responses API
resp, err := client.CreateResponse(
	context.Background(),
	openai.ResponseRequest{
		Model: "gpt-5.5",
		Tools: []openai.Tool{
			{
				Type: "web_search",
			},
		},
		Input: "What was a positive news story from today?",
	},
)

if err != nil {
	fmt.Printf("Response error: %v\n", err)
	return
}

// Extract citations
content := resp.OutputText
annotations := resp.Annotations

for _, annotation := range annotations {
	if annotation.Type == "url_citation" {
		url := annotation.URL
		title := annotation.Title
		start := annotation.StartIndex
		end := annotation.EndIndex

		// Process citation as needed
		fmt.Printf("Citation: %s - %s\n", title, url)
	}
}

php=:<?php
// For Responses API
$response = $client->responses()->create([
 'model' => 'gpt-5.5',
 'tools' => [['type' => 'web_search']],
 'input' => 'What was a positive news story from today?'
]);

// Extract citations
$content = $response->output_text;
$annotations = $response->annotations;

foreach ($annotations as $annotation) {
 if ($annotation->type === 'url_citation') {
 $url = $annotation->url;
 $title = $annotation->title;
 $start = $annotation->start_index;
 $end = $annotation->end_index;
 
 // Process citation as needed
 echo "Citation: {$title} - {$url}\n";
 }
}

```

## Best Practices

1. **Be specific with queries** - Clearly state what information you're looking for
2. **Ask for sources explicitly** - Include "provide sources" in your prompt for more reliable citations
3. **Use lower temperature** - Set temperature to 0.1-0.3 for more factual, less creative responses
4. **Specify recency when relevant** - Include phrases like "as of today" or "latest information"
5. **Verify important information** - Cross-check critical facts with multiple sources
6. **Combine model knowledge and search** - Leverage both the model's knowledge and search capabilities

## Pricing

Web search pricing depends on both the model used and the search context size:

| Model | Search Context Size | Cost |
|-------|---------------------|------|
| gpt-5.5, gpt-4o, or gpt-4o-search-preview | low | $30.00 per 1k calls |
| gpt-5.5, gpt-4o, or gpt-4o-search-preview | medium (default) | $35.00 per 1k calls |
| gpt-5.5, gpt-4o, or gpt-4o-search-preview | high | $50.00 per 1k calls |
| gpt-4.1-mini, gpt-5.4-mini, or gpt-4o-mini-search-preview | low | $25.00 per 1k calls |
| gpt-4.1-mini, gpt-4o-mini, or gpt-4o-mini-search-preview | medium (default) | $27.50 per 1k calls |
| gpt-4.1-mini, gpt-4o-mini, or gpt-4o-mini-search-preview | high | $30.00 per 1k calls |
| gemini-2.5-flash and other Gemini models | all levels | Similar to OpenAI pricing |

## Troubleshooting

### Common Issues

1. **No search performed when expected**
   - Ensure the query requires external information beyond the model's knowledge
   - Try being more explicit about needing current information
   - Check that you're using the correct model and configuration

2. **Missing or incomplete citations**
   - Request sources explicitly in your prompt
   - Use the Responses API for structured citation metadata
   - Consider using a higher search context setting

3. **Inconsistent search results**
   - Search results may vary based on time, location, and search engine behavior
   - For consistent results in testing, consider mocking search responses

4. **Rate limiting**
   - Web search calls may have separate rate limits from regular API calls
   - Implement appropriate backoff strategies for high-volume applications

5. **High costs**
   - Use the appropriate context size for your needs
   - Consider caching common search results
   - Use mini models for less complex queries

## Limitations

- Search results may not always be perfectly relevant to the query
- Citations may occasionally be incomplete or inaccurate
- Models may sometimes blend their own knowledge with search results
- Search capabilities are primarily optimized for English queries
- Results are dependent on search engine availability and quality
- Not all information on the web is accessible through the search feature

## Conclusion

Web search capabilities significantly enhance LLMs by providing access to current information and factual data with source attribution. By choosing the right model and approach for your use case, you can create applications that combine the reasoning power of LLMs with the real-time information available on the web.

## Related Links

- [Chat Completions API Reference](en/api-reference/chat.md)
- [Responses API Reference](en/api-reference/responses.md)
- [Tools Guide](en/guides/tools.md)
- [Tools Web Search Guide](en/guides/tools-web-search.md)
- [Model Selection Guide](en/guides/model-selection.md)
