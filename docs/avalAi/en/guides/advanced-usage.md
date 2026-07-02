# Advanced Usage

This section covers advanced techniques for specific API features and use cases.

## Chat Completions

- **Maintain conversation history**: Include relevant prior messages for context, but be mindful of token limits.
- **Limit conversation length**: Very long histories consume more tokens and can sometimes lead to the model losing track of earlier context. Consider summarizing or truncating history if needed.
- **Use function calling / tools**: For structured data extraction or interacting with external systems, leverage the `tools` parameter to get reliable JSON outputs or trigger actions.

```python
# Example using tools (formerly function calling)
functions = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "Get the current weather in a given location",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "The city and state, e.g. San Francisco, CA",
                    },
                    "unit": {
                        "type": "string",
                        "enum": ["celsius", "fahrenheit"],
                        "description": "The temperature unit",
                    },
                },
                "required": ["location"],
            },
        },
    }
]

response = client.chat.completions.create(
    model="gpt-5.5",
    messages=[{"role": "user", "content": "What's the weather like in Boston?"}],
    tools=functions,
    tool_choice="auto",  # Or specify a function name
)

# Process the response, which might include a tool call
message = response.choices[0].message
if message.tool_calls:
    # Handle tool call...
    pass
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
    input="What",
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


## Embeddings

- **Normalize vectors**: When using embeddings for similarity search (e.g., with cosine similarity), normalize the vectors to unit length for accurate comparisons.
- **Use dimensionality reduction**: For visualizing high-dimensional embeddings, techniques like t-SNE or UMAP can project them into 2D or 3D space.
- **Consider chunking**: For embedding long documents, break the text into smaller, meaningful chunks (e.g., paragraphs or sections) before generating embeddings.

```python
import numpy as np

# Normalize vectors
def normalize(v):
    norm = np.linalg.norm(v)
    if norm == 0:
    return v
    return v / norm

# Compute cosine similarity between normalized vectors
def cosine_similarity(a_norm, b_norm):
    return np.dot(a_norm, b_norm)

# Example usage (assuming 'emb_a' and 'emb_b' are embedding vectors)
# norm_a = normalize(emb_a)
# norm_b = normalize(emb_b)
# similarity = cosine_similarity(norm_a, norm_b)
```

## Image Generation

- **Be detailed and specific**: The more detail you provide in the prompt, the closer the generated image will likely be to your vision. Include object descriptions, setting, style, mood, composition, etc.
- **Specify style and medium**: Explicitly mention the desired artistic style (e.g., "photorealistic", "impressionist painting", "cyberpunk art", "watercolor sketch") or medium (e.g., "digital painting", "photograph", "claymation").
- **Iterate on prompts**: Generating the perfect image often requires refinement. Analyze the results and adjust your prompt accordingly. Add negative prompts if needed to exclude elements.

**Good prompt:**
```
A detailed digital painting of a bioluminescent forest at night, featuring giant glowing mushrooms, sparkling streams, and mystical creatures hiding in the shadows, in the style of fantasy concept art.
```

**Less effective prompt:**
```
A magic forest.
```

## Reproducible Outputs

Chat Completions are non-deterministic by default (meaning model outputs may differ from request to request). However, you can achieve more consistent outputs using the `seed` parameter and monitoring the `system_fingerprint` response field.

To receive mostly deterministic outputs across API calls:

- Set the `seed` parameter to any integer of your choice and use the same value across requests
- Ensure all other parameters (like `prompt` or `temperature`) are exactly the same across requests

Note that determinism may still be affected by necessary changes to model configurations. The `system_fingerprint` field helps track these changes - if this value differs between responses, you might see different outputs due to system-level changes.

```python
# Example of using seed parameter for reproducible outputs
response1 = client.chat.completions.create(
    model="gpt-5.5",
    messages=[{"role": "user", "content": "Write a short poem about mountains"}],
    seed=123456,  # Set a specific seed value
)

# The system_fingerprint can be checked
fingerprint = response1.system_fingerprint
print(f"System fingerprint: {fingerprint}")

# Using the same seed and parameters should produce similar results
response2 = client.chat.completions.create(
    model="gpt-5.5",
    messages=[{"role": "user", "content": "Write a short poem about mountains"}],
    seed=123456,  # Same seed as before
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
    input="Write a short poem about mountains",
)

print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


## Managing Tokens

Language models read and write text in chunks called tokens. In English, a token can be as short as one character or as long as one word (e.g., `a` or `apple`), and in some languages tokens can be even shorter than one character or longer than one word.

As a rough rule of thumb, 1 token is approximately 4 characters or 0.75 words for English text.

The total number of tokens in an API call affects:

- How much your API call costs, as you pay per token
- How long your API call takes, as writing more tokens takes more time
- Whether your API call works at all, as total tokens must be below the model's maximum context window

Both input and output tokens count toward these quantities. For example, if your API call used 10 tokens in the message input and received 20 tokens in the message output, you would be billed for 30 tokens.

To see how many tokens are used by an API call, check the `usage` field in the API response:

```python
response = client.chat.completions.create(
    model="gpt-5.5", messages=[{"role": "user", "content": "Hello, how are you?"}]
)

# Check token usage
print(f"Prompt tokens: {response.usage.prompt_tokens}")
print(f"Completion tokens: {response.usage.completion_tokens}")
print(f"Total tokens: {response.usage.total_tokens}")
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
    input="Hello, how are you?",
)

print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


For long conversations, be aware that if they approach the model's token limit, replies may be cut off. For example, a conversation that is close to the model's maximum token limit will have very limited space for the response.

## Parameter Details

### Frequency and Presence Penalties

The frequency and presence penalties can be used to reduce the likelihood of sampling repetitive sequences of tokens:

- **Frequency penalty**: Reduces repetition of specific tokens based on their existing frequency in the generated text
- **Presence penalty**: Reduces repetition of any token that has appeared in the generated text

Reasonable values for penalty coefficients are around 0.1 to 1 if you want to slightly reduce repetitive samples. For stronger suppression of repetition, you can increase coefficients up to 2, but this may noticeably degrade sample quality. Negative values can increase the likelihood of repetition.

```python
# Example using frequency and presence penalties
response = client.chat.completions.create(
    model="gpt-5.5",
    messages=[{"role": "user", "content": "Write a paragraph with varied vocabulary"}],
    frequency_penalty=0.7,  # Reduce repetition of specific tokens
    presence_penalty=0.5,  # Reduce repetition of any token that has appeared
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
    input="Write a paragraph with varied vocabulary",
)

print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


### Token Log Probabilities

The `logprobs` parameter provides the log probabilities of each output token, along with the most likely alternative tokens at each position:

```python
# Example requesting log probabilities
response = client.chat.completions.create(
    model="gpt-5.5",
    messages=[{"role": "user", "content": "Translate 'hello' to French"}],
    logprobs=True,
    top_logprobs=5,  # Return the top 5 most likely tokens at each position
)

# Access log probabilities in the response
if hasattr(response.choices[0], "logprobs"):
    logprobs = response.choices[0].logprobs
    # Process log probabilities...
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
    input="Translate",
)

print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


This can be useful for assessing the model's confidence in its output or examining alternative responses it might have given.

## Related Resources

- [Rate Limits](en/guides/rate-limits.md)
- [Model Selection](en/guides/model-selection.md)
- [Streaming Responses](en/guides/streaming-responses.md)