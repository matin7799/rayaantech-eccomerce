# Gemini Safety Settings

This guide explains how to use Gemini's built-in safety settings to moderate content directly within your API calls. If you're looking to implement content moderation in your application and are using Gemini models, you can leverage these safety settings as an alternative to using the separate [Moderation API](en/api-reference/moderation.md).

## Overview

Google's Gemini models include built-in safety filters that can automatically detect and block potentially harmful content across four categories. Unlike the traditional approach of calling a separate moderation endpoint before or after your main API call, Gemini's safety settings allow you to configure content moderation directly within the same API request.

### Benefits of Using Gemini Safety Settings

| Approach | Moderation API | Gemini Safety Settings |
|----------|---------------|----------------------|
| **API Calls** | Requires separate moderation call | Built into the same API call |
| **Latency** | Additional round-trip for moderation | No additional latency |
| **Cost** | Separate API call cost | Included with generation |
| **Flexibility** | Post-hoc filtering | Real-time filtering during generation |
| **Categories** | OpenAI moderation categories | Google harm categories |

## Harm Categories

Gemini safety settings can filter content across four harm categories:

| Category | Enum Value | Description |
|----------|------------|-------------|
| Harassment | `HARM_CATEGORY_HARASSMENT` | Negative or harmful comments targeting identity and/or protected attributes |
| Hate Speech | `HARM_CATEGORY_HATE_SPEECH` | Content that is rude, disrespectful, or profane |
| Sexually Explicit | `HARM_CATEGORY_SEXUALLY_EXPLICIT` | Contains references to sexual acts or other lewd content |
| Dangerous Content | `HARM_CATEGORY_DANGEROUS_CONTENT` | Promotes, facilitates, or encourages harmful acts |

## Block Thresholds

For each harm category, you can set a threshold to control how aggressively content is blocked:

| Threshold | Enum Value | Description |
|-----------|------------|-------------|
| Off | `OFF` | Turn off the safety filter entirely |
| Block None | `BLOCK_NONE` | Show all content (same as OFF) |
| Block Few | `BLOCK_ONLY_HIGH` | Block only high-probability harmful content |
| Block Some | `BLOCK_MEDIUM_AND_ABOVE` | Block medium and high probability content |
| Block Most | `BLOCK_LOW_AND_ABOVE` | Block low, medium, and high probability content |

> **Note:** For Gemini 2.5 and Gemini 3 models, the default safety setting threshold is `OFF`. For earlier models, the default is `BLOCK_MEDIUM_AND_ABOVE`.

## Using Safety Settings with Native Gemini API

### Basic Example

```language-selector
python=:from google import genai
from google.genai import types

# Initialize the client with AvalAI
client = genai.Client(
    api_key="your-avalai-api-key", http_options={"base_url": "https://api.avalai.ir"}
)

# Configure safety settings
safety_settings = [
    types.SafetySetting(
        category="HARM_CATEGORY_HARASSMENT",
        threshold="BLOCK_MEDIUM_AND_ABOVE",
    ),
    types.SafetySetting(
        category="HARM_CATEGORY_HATE_SPEECH",
        threshold="BLOCK_LOW_AND_ABOVE",
    ),
    types.SafetySetting(
        category="HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold="BLOCK_MEDIUM_AND_ABOVE",
    ),
    types.SafetySetting(
        category="HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold="BLOCK_ONLY_HIGH",
    ),
]

# Generate content with safety settings
response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="Explain the importance of online safety.",
    config=types.GenerateContentConfig(safety_settings=safety_settings),
)

print(response.text)

javascript=:import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";

// Initialize the client with AvalAI
const client = new GoogleGenAI({
  apiKey: process.env.AVALAI_API_KEY,
  httpOptions: { baseUrl: "https://api.avalai.ir" }
});

// Configure safety settings
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
];

// Generate content with safety settings
const response = await client.models.generateContent({
  model: "gemini-2.5-flash",
  contents: "Explain the importance of online safety.",
  config: { safetySettings: safetySettings },
});

console.log(response.text);

go=:package main

import (
	"context"
	"fmt"
	"github.com/google/generative-ai-go/genai"
	"google.golang.org/api/option"
)

func main() {
	ctx := context.Background()

	// Initialize the client with AvalAI
	client, err := genai.NewClient(ctx,
		option.WithAPIKey("your-avalai-api-key"),
		option.WithEndpoint("https://api.avalai.ir"))
	if err != nil {
		fmt.Printf("Error creating client: %v\n", err)
		return
	}
	defer client.Close()

	model := client.GenerativeModel("gemini-2.5-flash")

	// Configure safety settings
	model.SafetySettings = []*genai.SafetySetting{
		{
			Category:  genai.HarmCategoryHarassment,
			Threshold: genai.HarmBlockMediumAndAbove,
		},
		{
			Category:  genai.HarmCategoryHateSpeech,
			Threshold: genai.HarmBlockLowAndAbove,
		},
		{
			Category:  genai.HarmCategorySexuallyExplicit,
			Threshold: genai.HarmBlockMediumAndAbove,
		},
		{
			Category:  genai.HarmCategoryDangerousContent,
			Threshold: genai.HarmBlockOnlyHigh,
		},
	}

	// Generate content
	resp, err := model.GenerateContent(ctx, genai.Text("Explain the importance of online safety."))
	if err != nil {
		fmt.Printf("Error generating content: %v\n", err)
		return
	}

	// Print the response
	for _, part := range resp.Candidates[0].Content.Parts {
		fmt.Println(part)
	}
}

bash=:curl "https://api.avalai.ir/v1beta/models/gemini-2.5-flash:generateContent" \
  -H "Content-Type: application/json" \
  -H "x-goog-api-key: $AVALAI_API_KEY" \
  -d '{
    "contents": [{
      "parts": [{"text": "Explain the importance of online safety."}]
    }],
    "safetySettings": [
      {
        "category": "HARM_CATEGORY_HARASSMENT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        "category": "HARM_CATEGORY_HATE_SPEECH",
        "threshold": "BLOCK_LOW_AND_ABOVE"
      },
      {
        "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
        "threshold": "BLOCK_ONLY_HIGH"
      }
    ]
  }'

```

### Disabling Safety Filters

For certain use cases where you need complete control over content filtering, you can disable safety filters entirely:

```language-selector
python=:from google import genai
from google.genai import types

client = genai.Client(
    api_key="your-avalai-api-key", http_options={"base_url": "https://api.avalai.ir"}
)

# Disable all safety filters
safety_settings = [
    types.SafetySetting(
        category="HARM_CATEGORY_HARASSMENT",
        threshold="OFF",
    ),
    types.SafetySetting(
        category="HARM_CATEGORY_HATE_SPEECH",
        threshold="OFF",
    ),
    types.SafetySetting(
        category="HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold="OFF",
    ),
    types.SafetySetting(
        category="HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold="OFF",
    ),
]

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="Your prompt here",
    config=types.GenerateContentConfig(safety_settings=safety_settings),
)

javascript=:import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";

const client = new GoogleGenAI({
  apiKey: process.env.AVALAI_API_KEY,
  httpOptions: { baseUrl: "https://api.avalai.ir" }
});

// Disable all safety filters
const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: "OFF" },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: "OFF" },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: "OFF" },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: "OFF" },
];

const response = await client.models.generateContent({
  model: "gemini-2.5-flash",
  contents: "Your prompt here",
  config: { safetySettings: safetySettings },
});

go=:package main

import (
	"context"
	"fmt"
	"github.com/google/generative-ai-go/genai"
	"google.golang.org/api/option"
)

func main() {
	ctx := context.Background()
	client, _ := genai.NewClient(ctx,
		option.WithAPIKey("your-avalai-api-key"),
		option.WithEndpoint("https://api.avalai.ir"))
	defer client.Close()

	model := client.GenerativeModel("gemini-2.5-flash")

	// Disable all safety filters
	model.SafetySettings = []*genai.SafetySetting{
		{Category: genai.HarmCategoryHarassment, Threshold: genai.HarmBlockNone},
		{Category: genai.HarmCategoryHateSpeech, Threshold: genai.HarmBlockNone},
		{Category: genai.HarmCategorySexuallyExplicit, Threshold: genai.HarmBlockNone},
		{Category: genai.HarmCategoryDangerousContent, Threshold: genai.HarmBlockNone},
	}

	resp, _ := model.GenerateContent(ctx, genai.Text("Your prompt here"))
	fmt.Println(resp.Candidates[0].Content.Parts[0])
}

bash=:curl "https://api.avalai.ir/v1beta/models/gemini-2.5-flash:generateContent" \
  -H "Content-Type: application/json" \
  -H "x-goog-api-key: $AVALAI_API_KEY" \
  -d '{
    "contents": [{
      "parts": [{"text": "Your prompt here"}]
    }],
    "safetySettings": [
      {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "OFF"},
      {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "OFF"},
      {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "OFF"},
      {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "OFF"}
    ]
  }'

```

> **Warning:** Disabling safety filters means potentially harmful content may be generated. Use this option responsibly and implement your own content filtering when needed.

## Using Safety Settings with OpenAI SDK (extra_body)

When using the OpenAI-compatible API at `v1/chat/completions`, you can pass Gemini safety settings through the `extra_body` parameter. This allows you to use familiar OpenAI SDK patterns while accessing Gemini's native safety features.

For more information about using `extra_body` with various providers, see the [Provider-Specific Parameters Guide](en/guides/provider-specific-params.md).

### Basic Example with OpenAI SDK

```language-selector
python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Configure safety settings via extra_body
response = client.chat.completions.create(
    model="gemini-2.5-flash",
    messages=[{"role": "user", "content": "Explain the importance of online safety."}],
    extra_body={
        "safety_settings": [
            {
                "category": "HARM_CATEGORY_HARASSMENT",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
                "category": "HARM_CATEGORY_HATE_SPEECH",
                "threshold": "BLOCK_LOW_AND_ABOVE",
            },
            {
                "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
                "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                "threshold": "BLOCK_ONLY_HIGH",
            },
        ]
    },
)

print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

// Configure safety settings via extra parameters
const response = await client.chat.completions.create({
  model: "gemini-2.5-flash",
  messages: [
    { role: "user", content: "Explain the importance of online safety." }
  ],
  // @ts-expect-error safety_settings is a Gemini-specific parameter
  safety_settings: [
    { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
    { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_LOW_AND_ABOVE" },
    { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
    { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" },
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

	// Note: For Go, you may need to use raw HTTP requests
	// to pass safety_settings as extra_body parameters
	// The OpenAI Go SDK may not support extra_body directly

	resp, err := client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model: "gemini-2.5-flash",
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleUser,
					Content: "Explain the importance of online safety.",
				},
			},
		},
	)

	if err != nil {
		fmt.Printf("Error: %v\n", err)
		return
	}

	fmt.Println(resp.Choices[0].Message.Content)
}

bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gemini-2.5-flash",
    "messages": [
      {"role": "user", "content": "Explain the importance of online safety."}
    ],
    "safety_settings": [
      {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
      {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_LOW_AND_ABOVE"},
      {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
      {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_ONLY_HIGH"}
    ]
  }'

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
    instructions="You are a helpful assistant.",
    input="Explain the importance of online safety.",
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
  input: "Explain the importance of online safety.",
});

console.log(response.output_text);

bash=:curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '
  {
    "model": "gpt-5.5",
    "input": "Explain the importance of online safety.",
    "instructions": "You are a helpful assistant."
  }'

```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


### Disabling Safety Filters with OpenAI SDK

```language-selector
python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Disable all safety filters
response = client.chat.completions.create(
    model="gemini-2.5-flash",
    messages=[{"role": "user", "content": "Your prompt here"}],
    extra_body={
        "safety_settings": [
            {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE"},
            {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_NONE"},
            {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_NONE"},
            {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_NONE"},
        ]
    },
)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

// Disable all safety filters
const response = await client.chat.completions.create({
  model: "gemini-2.5-flash",
  messages: [{ role: "user", content: "Your prompt here" }],
  // @ts-expect-error safety_settings is a Gemini-specific parameter
  safety_settings: [
    { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
    { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
    { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
    { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
  ],
});

bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gemini-2.5-flash",
    "messages": [{"role": "user", "content": "Your prompt here"}],
    "safety_settings": [
      {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE"},
      {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_NONE"},
      {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_NONE"},
      {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_NONE"}
    ]
  }'

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
    instructions="You are a helpful assistant.",
    input="Your prompt here",
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
  input: "Your prompt here",
});

console.log(response.output_text);

bash=:curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '
  {
    "model": "gpt-5.5",
    "input": "Your prompt here",
    "instructions": "You are a helpful assistant."
  }'

```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


> **Warning:** Disabling safety filters means potentially harmful content may be generated. Use this option responsibly.

## Handling Safety Feedback in Responses

When a response is blocked due to safety settings, you can check the safety feedback to understand why:

```language-selector
python=:from google import genai
from google.genai import types

client = genai.Client(
    api_key="your-avalai-api-key", http_options={"base_url": "https://api.avalai.ir"}
)

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="Your prompt here",
)

# Check if prompt was blocked
if response.prompt_feedback and response.prompt_feedback.block_reason:
    print(f"Prompt was blocked: {response.prompt_feedback.block_reason}")

# Check candidate safety ratings
if response.candidates:
    for candidate in response.candidates:
        if candidate.safety_ratings:
            for rating in candidate.safety_ratings:
                print(f"Category: {rating.category}")
                print(f"Probability: {rating.probability}")
                print(f"Blocked: {rating.blocked}")

javascript=:import { GoogleGenAI } from "@google/genai";

const client = new GoogleGenAI({
  apiKey: process.env.AVALAI_API_KEY,
  httpOptions: { baseUrl: "https://api.avalai.ir" }
});

const response = await client.models.generateContent({
  model: "gemini-2.5-flash",
  contents: "Your prompt here",
});

// Check if prompt was blocked
if (response.promptFeedback?.blockReason) {
  console.log(`Prompt was blocked: ${response.promptFeedback.blockReason}`);
}

// Check candidate safety ratings
if (response.candidates) {
  for (const candidate of response.candidates) {
    if (candidate.safetyRatings) {
      for (const rating of candidate.safetyRatings) {
        console.log(`Category: ${rating.category}`);
        console.log(`Probability: ${rating.probability}`);
        console.log(`Blocked: ${rating.blocked}`);
      }
    }
  }
}

go=:package main

import (
	"context"
	"fmt"
	"github.com/google/generative-ai-go/genai"
	"google.golang.org/api/option"
)

func main() {
	ctx := context.Background()
	client, _ := genai.NewClient(ctx,
		option.WithAPIKey("your-avalai-api-key"),
		option.WithEndpoint("https://api.avalai.ir"))
	defer client.Close()

	model := client.GenerativeModel("gemini-2.5-flash")
	resp, err := model.GenerateContent(ctx, genai.Text("Your prompt here"))

	if err != nil {
		fmt.Printf("Error: %v\n", err)
		return
	}

	// Check prompt feedback
	if resp.PromptFeedback != nil {
		fmt.Printf("Block Reason: %v\n", resp.PromptFeedback.BlockReason)
	}

	// Check candidate safety ratings
	for _, candidate := range resp.Candidates {
		for _, rating := range candidate.SafetyRatings {
			fmt.Printf("Category: %v, Probability: %v, Blocked: %v\n",
				rating.Category, rating.Probability, rating.Blocked)
		}
	}
}

bash=:# The response will include safety ratings in the JSON output
# Example response structure with safety feedback:
# {
#   "candidates": [{
#     "content": {...},
#     "safetyRatings": [
#       {"category": "HARM_CATEGORY_HARASSMENT", "probability": "NEGLIGIBLE"},
#       {"category": "HARM_CATEGORY_HATE_SPEECH", "probability": "NEGLIGIBLE"}
#     ]
#   }],
#   "promptFeedback": {
#     "safetyRatings": [...]
#   }
# }

curl "https://api.avalai.ir/v1beta/models/gemini-2.5-flash:generateContent" \
  -H "Content-Type: application/json" \
  -H "x-goog-api-key: $AVALAI_API_KEY" \
  -d '{"contents": [{"parts": [{"text": "Your prompt here"}]}]}'

```

### Safety Feedback Fields

| Field | Description |
|-------|-------------|
| `promptFeedback.blockReason` | Reason why the prompt was blocked (if applicable) |
| `promptFeedback.safetyRatings` | Safety ratings for the prompt itself |
| `candidates[].safetyRatings` | Safety ratings for each generated response |
| `safetyRatings[].category` | The harm category being evaluated |
| `safetyRatings[].probability` | Probability level (NEGLIGIBLE, LOW, MEDIUM, HIGH) |
| `safetyRatings[].blocked` | Whether content was blocked for this category |

## Comparison: Moderation API vs. Gemini Safety Settings

### When to Use the Moderation API

The [Moderation API](en/api-reference/moderation.md) is ideal when:

- You're using non-Gemini models (OpenAI, Anthropic, etc.)
- You need to moderate user-generated content before processing
- You want detailed category scores for compliance reporting
- You need consistent moderation across different model providers

### When to Use Gemini Safety Settings

Gemini Safety Settings are ideal when:

- You're already using Gemini models for generation
- You want to minimize API calls and latency
- You need real-time filtering during content generation
- You want to customize safety thresholds per request
- You want to simplify your moderation pipeline

### Hybrid Approach

For maximum safety, consider combining both approaches:

```python
from openai import OpenAI
from google import genai
from google.genai import types

# Step 1: Pre-check user input with Moderation API
openai_client = OpenAI(
    api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1"
)

user_input = "User's message here"
moderation_result = openai_client.moderations.create(input=user_input)

if moderation_result.results[0].flagged:
    print("Content blocked by pre-moderation")
else:
    # Step 2: Generate with Gemini and additional safety settings
    gemini_client = genai.Client(
        api_key="your-avalai-api-key",
        http_options={"base_url": "https://api.avalai.ir"},
    )

    response = gemini_client.models.generate_content(
        model="gemini-2.5-flash",
        contents=user_input,
        config=types.GenerateContentConfig(
            safety_settings=[
                types.SafetySetting(
                    category="HARM_CATEGORY_HARASSMENT",
                    threshold="BLOCK_MEDIUM_AND_ABOVE",
                ),
            ]
        ),
    )
    print(response.text)
```

## Supported Models

Safety settings are supported on all Gemini models available through AvalAI:

| Model | Default Threshold | Notes |
|-------|-------------------|-------|
| gemini-2.5-flash | OFF | Stable legacy Flash model |
| gemini-2.5-pro | OFF | Advanced reasoning capabilities |
| gemini-3.5-flash | OFF | Current Flash model |
| gemini-3.1-pro-preview | OFF | Pro preview model |

## Best Practices

1. **Start with defaults**: Begin with default safety settings and adjust based on your use case
2. **Test thoroughly**: Test your safety settings with edge cases before deploying to production
3. **Handle blocked content gracefully**: Always implement error handling for blocked content
4. **Log safety events**: Track when content is blocked for monitoring and improvement
5. **Combine approaches**: For sensitive applications, consider using both the Moderation API and Gemini safety settings
6. **Document your choices**: Clearly document why specific thresholds were chosen for compliance

## Related Resources

- [Google Models](en/providers/google.md) - Complete documentation of Google Gemini models
- [Moderation API](en/api-reference/moderation.md) - OpenAI-compatible moderation endpoint
- [Moderation Guide](en/safety/moderation-guide.md) - Best practices for content moderation
- [v1beta GenAI SDK](en/api-reference/v1beta.md) - Native Google GenAI SDK documentation
- [Safety Best Practices](en/guides/safety-best-practices.md) - General safety guidelines
