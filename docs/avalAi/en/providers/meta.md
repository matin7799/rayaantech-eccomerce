# Meta Models (Llama)

AvalAI provides access to Meta's powerful Llama family of models through various partner integrations like AWS Bedrock and Google Vertex AI. This page details some of the commonly available Llama models.

## Llama 3.1 Series

The Llama 3.1 series offers significant improvements in reasoning, code generation, and instruction following, with large context windows.

### Llama 3.1 405B Instruct

The largest and most capable model in the Llama 3.1 series, designed for complex reasoning and generation tasks.

| Feature | Details |
|-------------------|-----------------------------------------------------------------------|
| Context window | 128,000 input tokens, 4,096 output tokens |
| Training data | Up to March 2024 |
| Input pricing | ~$5.32 / 1M tokens (via Bedrock) |
| Output pricing | ~$16.00 / 1M tokens (via Bedrock) |
| Strengths | State-of-the-art performance for open models, excels at reasoning, code, nuance |
| Best for | Highly complex tasks, research, challenging generation prompts |

```python
response = client.chat.completions.create(
    # Model name might vary based on provider, e.g., 'meta.llama3-1-405b-instruct-v1:0' on Bedrock
    model="meta.llama3-1-405b-instruct-v1:0",
    messages=[
        {"role": "system", "content": "You are an expert architect."},
        {
            "role": "user",
            "content": "Design a sustainable and scalable architecture for a global e-commerce platform.",
        },
    ],
)
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `meta.llama3-1-405b-instruct-v1:0` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

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
    input="Design a sustainable and scalable architecture for a global e-commerce platform.",
)

print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


### Llama 3.1 70B Instruct

A strong balance of performance and efficiency, suitable for a wide range of demanding tasks.

| Feature | Details |
|-------------------|-----------------------------------------------------------------------|
| Context window | 128,000 input tokens, 2,048 output tokens |
| Training data | Up to March 2024 |
| Input pricing | ~$0.99 / 1M tokens (via Bedrock) |
| Output pricing | ~$0.99 / 1M tokens (via Bedrock) |
| Strengths | Excellent performance for its size, strong instruction following |
| Best for | Complex chat applications, content creation, RAG systems |

```python
response = client.chat.completions.create(
    # Model name might vary, e.g., 'meta.llama3-1-70b-instruct-v1:0' on Bedrock
    model="meta.llama3-1-70b-instruct-v1:0",
    messages=[
        {"role": "system", "content": "You are a helpful AI assistant."},
        {
            "role": "user",
            "content": "Compare and contrast the Llama 3.1 70B and 8B models.",
        },
    ],
)
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `meta.llama3-1-70b-instruct-v1:0` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

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
    input="Compare and contrast the Llama 3.1 70B and 8B models.",
)

print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


### Llama 3.1 8B Instruct

The smallest model in the Llama 3.1 series, optimized for speed and efficiency on less complex tasks.

| Feature | Details |
|-------------------|-----------------------------------------------------------------------|
| Context window | 128,000 input tokens, 2,048 output tokens |
| Training data | Up to March 2024 |
| Input pricing | ~$0.22 / 1M tokens (via Bedrock) |
| Output pricing | ~$0.22 / 1M tokens (via Bedrock) |
| Strengths | Very fast and cost-effective, good for simpler tasks |
| Best for | Simple chatbots, summarization, classification, light content generation |

```python
response = client.chat.completions.create(
    # Model name might vary, e.g., 'meta.llama3-1-8b-instruct-v1:0' on Bedrock
    model="meta.llama3-1-8b-instruct-v1:0",
    messages=[
        {"role": "user", "content": "What is the capital of France?"},
    ],
)
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `meta.llama3-1-8b-instruct-v1:0` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

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
    input="What is the capital of France?",
)

print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


## Llama 3.2 Series (Preview)

The Llama 3.2 series introduces new capabilities, including vision, and further performance improvements. Availability might be limited initially.

### Llama 3.2 90B Vision Instruct

A large multimodal model combining strong text capabilities with vision understanding.

| Feature | Details |
|-------------------|-----------------------------------------------------------------------|
| Context window | 128,000 input tokens, 2,048 output tokens |
| Training data | Assumed latest available |
| Input pricing | (Check provider pricing, e.g., Vertex AI) |
| Output pricing | (Check provider pricing, e.g., Vertex AI) |
| Strengths | Multimodal input (text and image), strong reasoning |
| Best for | Applications requiring understanding of both text and images |

```python
# Example structure - specific API calls may vary by provider
response = client.chat.completions.create(
    model="llama-4-scout-17b-16e-instruct",
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "Describe this image."},
                {"type": "image_url", "image_url": {"url": "..."}},
            ],
        }
    ],
)
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `llama-4-scout-17b-16e-instruct` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

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
                {"type": "input_text", "text": "Describe this image."},
                {"type": "input_image", "image_url": "https://example.com/image.png"},
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


## Llama 4 Scout Series (Preview via Together AI)

The Llama 4 Scout series represents experimental models focused on specific capabilities or efficiency improvements.

### Llama 4 Scout 17B 128e Instruct FP8

An experimental model potentially using FP8 precision for efficiency.

| Feature | Details |
| ----------------------- | -------------------------------------- |
| Provider | Together AI |
| Owner | Meta |
| Context window | (Check provider details) |
| Input Pricing | (Check provider details via AvalAI) |
| Output Pricing | (Check provider details via AvalAI) |
| Max Req/min | 50.0 |
| Max Tokens/min | 400,000.0 |
| Strengths | Experimental, potentially efficient |
| Best for | Testing new model architectures/formats |
| Model ID (example) | `together_ai/meta-llama/llama-4-scout-17b-128e-instruct-fp8` |

```python
# Example using Llama 4 Scout 17B FP8 via Together AI
response = client.chat.completions.create(
    model="llama-4-scout-17b-128e-instruct-fp8",
    messages=[
        {"role": "user", "content": "What are the potential benefits of FP8 inference?"}
    ],
)
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `llama-4-scout-17b-128e-instruct-fp8` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

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
    input="What are the potential benefits of FP8 inference?",
)

print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


### Llama 4 Scout 17B 16e Instruct

Another experimental model from the Scout series.

| Feature | Details |
| ----------------------- | -------------------------------------- |
| Provider | Together AI |
| Owner | Meta |
| Context window | (Check provider details) |
| Input Pricing | (Check provider details via AvalAI) |
| Output Pricing | (Check provider details via AvalAI) |
| Max Req/min | 50.0 |
| Max Tokens/min | 400,000.0 |
| Strengths | Experimental |
| Best for | Testing new model capabilities |
| Model ID (example) | `together_ai/meta-llama/llama-4-scout-17b-16e-instruct` |

```python
# Example using Llama 4 Scout 17B 16e via Together AI
response = client.chat.completions.create(
    model="llama-4-scout-17b-16e-instruct",
    messages=[
        {
            "role": "user",
            "content": "Summarize the key features of the Llama 4 Scout series.",
        }
    ],
)
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `llama-4-scout-17b-16e-instruct` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

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
    input="Summarize the key features of the Llama 4 Scout series.",
)

print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


## Earlier Llama Models

Older versions like Llama 3 (8B, 70B) and Llama 2 (7B, 13B, 70B) are also available through various providers accessible via AvalAI, often at lower price points but with smaller context windows and potentially lower performance compared to Llama 3.1/3.2. Refer to the specific provider documentation linked through AvalAI for details.

## Using Meta Models via AvalAI

Access Llama models hosted by partners like Bedrock or Vertex AI using the standard AvalAI API endpoints and OpenAI-compatible libraries. Ensure you use the correct model identifier as provided by the specific AvalAI integration.

```python
from openai import OpenAI

client = OpenAI(
    api_key="your-avalai-api-key",  # Replace with your actual API key
    base_url="https://api.avalai.ir/v1",  # AvalAI API endpoint
)

# Example using a Llama 3.1 model (identifier depends on provider)
response = client.chat.completions.create(
    model="meta.llama3-1-70b-instruct-v1:0",  # Example Bedrock identifier
    messages=[{"role": "user", "content": "Tell me about the Llama models."}],
)

print(response.choices[0].message.content)
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `meta.llama3-1-70b-instruct-v1:0` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

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
    input="Tell me about the Llama models.",
)

print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


## Related Resources

- [Chat Completions API](en/api-reference/chat.md)
- [Model Index](en/models/model-details.md)
- [Authentication](en/api-reference/authentication.md)
- [Rate Limits](en/guides/rate-limits.md)