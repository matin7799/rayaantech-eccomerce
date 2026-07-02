# Provider-Specific Parameters

This guide explains how to use provider-specific parameters with different AI model providers through AvalAI's unified API.

## Introduction

Different AI model providers offer unique parameters to control their models' behavior. While AvalAI provides a unified API, you can access these provider-specific features in several ways:

1. Through the `extra_body` parameter when using client libraries
2. By including them directly in the request body for direct API calls
3. For TypeScript users, by using `// @ts-expect-error` to pass undocumented parameters directly

This guide covers the most important provider-specific parameters and how to use them effectively.

### Using Undocumented Parameters in TypeScript

When working with TypeScript, you can use the `// @ts-expect-error` comment to pass provider-specific parameters directly:

```javascript
// TypeScript example - Using @ts-expect-error for undocumented parameters
const response = await client.chat.completions.create({
  model: "gemini-2.5-flash",
  messages: [
    {
      role: "user",
      content: "Solve this complex math problem step by step: ...",
    },
  ],
  // @ts-expect-error thinking is an undocumented parameter
  thinking: { type: "enabled", budget_tokens: 2000 },
});
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `gemini-2.5-flash` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

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
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


This approach allows you to bypass TypeScript's type checking for parameters that are supported by the provider but not documented in the client library's type definitions. The library doesn't validate at runtime that the request matches the type, so any extra values you send will be sent as-is to the provider's API.

## Gemini Models: Thinking Parameter

Google's Gemini models (specifically `gemini-2.5-flash`) support configurable reasoning through "thinking" settings. This allows you to control how much reasoning the model performs, balancing depth of analysis against cost.

?> **Note:** `thinking_budget` is only supported in Gemini 2.5 Flash. This is true at the time of writing this document, it may change over time. For the most current information, reference the [official Google AI documentation](https://ai.google.dev/gemini-api/docs/thinking#set-budget).

### Enabling and Configuring Thinking

When using the OpenAI client libraries with AvalAI, you can control Gemini's thinking behavior using the `extra_body` parameter:

```language-selector
python=:# Python example - Enabling thinking with a budget
response = client.chat.completions.create(
    model="gemini-2.5-flash",
    messages=[
        {"role": "user", "content": "Solve this complex math problem step by step: ..."}
    ],
    extra_body={
        "thinking": {"type": "enabled", "budget_tokens": 2000}
    },  # Allow up to 2000 tokens for reasoning
)

javascript=:// JavaScript example - Enabling thinking with a budget
const response = await client.chat.completions.create({
  model: "gemini-2.5-flash",
  messages: [
    {
      role: "user",
      content: "Solve this complex math problem step by step: ...",
    },
  ],
  // @ts-expect-error
  thinking: { type: "enabled", budget_tokens: 2000 }, // Allow up to 2000 tokens for reasoning
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


### Thinking Parameter Options

The thinking settings include:

- `type`: Set to "enabled" to allow the model to use thinking/reasoning
- `budget_tokens`: Controls how many tokens the model can use for thinking
  - Setting to `0` effectively disables thinking
  - Setting to a positive number (e.g., `2000`) allows the model to use up to that many tokens for reasoning

### Disabling Thinking

To disable thinking completely, set the budget to 0:

```language-selector
python=:# Python example - Disabling thinking
response = client.chat.completions.create(
    model="gemini-2.5-flash",
    messages=[{"role": "user", "content": "Summarize this text briefly: ..."}],
    extra_body={
        "thinking": {"type": "disabled", "budget_tokens": 0}
    },  # Disable thinking by setting budget to 0
)

javascript=:// JavaScript example - Disabling thinking
const response = await client.chat.completions.create({
  model: "gemini-2.5-flash",
  messages: [{ role: "user", content: "Summarize this text briefly: ..." }],
  // @ts-expect-error
  thinking: { type: "disabled", budget_tokens: 0 }, // Disable thinking by setting budget to 0
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
    instructions="You are a helpful assistant.",
    input="Summarize this text briefly: ...",
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
  input: "Summarize this text briefly: ...",
});

console.log(response.output_text);

bash=:curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '
  {
    "model": "gpt-5.5",
    "input": "Summarize this text briefly: ...",
    "instructions": "You are a helpful assistant."
  }'

```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


### Pricing Considerations

This is particularly useful for Gemini 2.5 Flash, which has different pricing for thinking vs. non-thinking tokens:

- Non-thinking output: $0.60 / 1M tokens
- Thinking output: $3.50 / 1M tokens

By setting appropriate thinking budgets, you can control both the depth of reasoning and the cost of your API calls.

### Direct HTTP Requests

When making direct HTTP requests or using curl, you can include these parameters directly in the request body:

```bash
curl https://api.avalai.ir/v1/chat/completions \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-2.5-flash",
    "messages": [{"role": "user", "content": "Solve this complex math problem step by step: ..."}],
    "thinking": {"type": "enabled", "budget_tokens": 2000}
}'
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `gemini-2.5-flash` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

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


## Stability AI Image Generation Parameters

Stability AI models support a variety of parameters to control image generation quality, style, and characteristics. These parameters can be passed through the `extra_body` parameter when using client libraries.

### Key Stability AI Parameters

```language-selector
python=:# Python example - Stability AI parameters
response = client.images.generate(
    model="stability.sd3-5-large-v1:0",
    prompt="A serene landscape with mountains and a lake",
    n=1,
    size="1024x1024",
    extra_body={
        "cfg_scale": 7,
        "steps": 30,
        "sampler": "ddim",
        "style_preset": "photographic",
    },
)

javascript=:// Using @ts-expect-error for undocumented parameters
const responseAlt = await client.images.generate({
  model: "stability.sd3-5-large-v1:0",
  prompt: "A serene landscape with mountains and a lake",
  n: 1,
  size: "1024x1024",
  // @ts-expect-error cfg_scale is an undocumented parameter
  cfg_scale: 7,
  // @ts-expect-error steps is an undocumented parameter
  steps: 30,
  // @ts-expect-error sampler is an undocumented parameter
  sampler: "ddim",
  // @ts-expect-error style_preset is an undocumented parameter
  style_preset: "photographic",
});

```

Common parameters include:

- `cfg_scale`: Controls how closely the image follows the prompt (typically 1-20)
- `steps`: Number of diffusion steps (higher values = more detail but longer generation time)
- `sampler`: The sampling algorithm to use (e.g., "ddim", "k_euler", "k_dpm_2")
- `style_preset`: Predefined style to apply (e.g., "photographic", "digital-art", "anime")

### Direct HTTP Requests

When using curl or direct API calls:

```bash
curl https://api.avalai.ir/v1/images/generations \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "stability.sd3-5-large-v1:0",
    "prompt": "A serene landscape with mountains and a lake",
    "n": 1,
    "size": "1024x1024",
    "cfg_scale": 7,
    "steps": 30,
    "sampler": "ddim",
    "style_preset": "photographic"
}'
```

## Best Practices for Provider-Specific Parameters

1. **Check Documentation**: Always refer to the specific model's documentation for the most up-to-date parameters and values.

2. **Test Parameter Effects**: Different parameter values can significantly impact results. Test various settings to find what works best for your use case.

3. **Balance Cost vs. Quality**: Parameters like Gemini's thinking budget directly affect costs. Find the right balance for your application.

4. **Error Handling**: When using provider-specific parameters, implement robust error handling to catch any parameter validation issues.

5. **Version Awareness**: Provider-specific parameters may change between model versions. Use specific model versions when stability is critical.

## Related Resources

- [Reasoning Models Guide](en/guides/reasoning.md) - More on reasoning and thinking capabilities
- [Image Generation Guide](en/guides/image-generation.md) - More on image generation options
- [Model Selection Guide](en/guides/model-selection.md) - Choosing the right model for your task
- [Rate Limits Guide](en/guides/rate-limits.md) - Understanding API rate limits
