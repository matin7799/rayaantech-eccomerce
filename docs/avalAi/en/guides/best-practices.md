# Best Practices

This guide provides recommendations and best practices for using the AvalAI API effectively and efficiently.

## API Usage

### Authentication

- **Secure your API keys**: Never expose your API keys in client-side code or public repositories.
- **Use environment variables**: Store your API keys in environment variables rather than hardcoding them.
- **Create separate API keys**: Use different API keys for development, testing, and production environments.
- **Rotate API keys regularly**: Periodically regenerate your API keys for enhanced security.

### Rate Limits

- **Implement exponential backoff**: When you hit rate limits, use exponential backoff to retry requests.
- **Monitor your usage**: Regularly check your API usage to avoid unexpected rate limit issues.
- **Batch requests when possible**: For operations like embeddings, batch multiple inputs in a single request.

### Error Handling

- **Handle errors gracefully**: Implement proper error handling for different HTTP status codes.
- **Log API errors**: Keep logs of API errors for debugging and monitoring purposes.
- **Provide user-friendly error messages**: Translate API errors into meaningful messages for end-users.

## Model Selection

### Choosing the Right Model

- **Start with smaller models**: Begin with smaller, more cost-effective models and only scale up when necessary.
- **Consider latency requirements**: Smaller models typically have lower latency, which may be critical for real-time applications.
- **Balance cost and performance**: More capable models cost more but may provide better results for complex tasks.

### Model Comparison

| Use Case | Recommended Models | Notes |
|----------|-------------------|-------|
| General chat | gpt-5.3-chat, claude-3-haiku | Good balance of performance and cost |
| Complex reasoning | gpt-5.5, claude-opus-4-7 | Best for tasks requiring deep understanding |
| Code generation | gpt-5.3-codex, claude-3-sonnet | Strong performance on coding tasks |
| Fast responses | gpt-5.4-mini, claude-haiku-4-5 | Lower latency for real-time applications |
| Embeddings | text-embedding-3-small | Good balance of performance and cost |
| Image generation | gpt-image-2 | High-quality image creation |

## Prompt Engineering

### General Guidelines

- **Be specific and clear**: Provide detailed instructions in your prompts.
- **Use examples**: Include examples of desired outputs when possible (few-shot prompting).
- **Structure your prompts**: Use consistent formatting and structure.
- **Iterate and refine**: Test different prompt formulations to improve results.

### System Messages

When using chat models, leverage the system message to set the context and behavior:

```python
messages = [
    {
        "role": "system",
        "content": "You are a helpful assistant that provides concise, accurate information about science topics.",
    },
    {"role": "user", "content": "Explain how photosynthesis works."},
]
```

### Temperature Setting

- **Low temperature (0.0-0.3)**: More deterministic, focused responses. Good for factual Q&A, code generation, or structured outputs.
- **Medium temperature (0.4-0.7)**: Balance between creativity and focus. Good for general assistance and explanations.
- **High temperature (0.8-1.0)**: More creative, varied responses. Good for brainstorming, creative writing, or generating diverse ideas.

## Specific Use Cases

### Chat Completions

- **Maintain conversation history**: Include relevant conversation history for context.
- **Limit conversation length**: Very long conversations consume more tokens and can lead to context loss.
- **Use function calling**: For structured outputs, use function calling to get consistent JSON responses.

```python
functions = [
    {
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
    }
]

response = client.chat.completions.create(
    model="gpt-5.5",
    messages=[{"role": "user", "content": "What's the weather like in Boston?"}],
    tools=functions,
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


### Embeddings

- **Normalize vectors**: For similarity comparisons, normalize embedding vectors.
- **Use dimensionality reduction**: For visualization, use techniques like t-SNE or UMAP.
- **Consider chunking**: For long documents, consider chunking text into smaller segments.

```python
import numpy as np

# Normalize vectors
def normalize(v):
    norm = np.linalg.norm(v)
    if norm == 0: 
    return v
    return v / norm

# Compute cosine similarity
def cosine_similarity(a, b):
    return np.dot(a, b)
```

### Image Generation

- **Be detailed and specific**: Provide detailed prompts for better image generation results.
- **Specify style and medium**: Include information about desired artistic style or medium.
- **Iterate on prompts**: Refine prompts based on generated results.

Good prompt:
```
A detailed digital painting of a futuristic city at sunset, with flying cars, tall glass skyscrapers with gardens, and holographic advertisements, in the style of cyberpunk art
```

Less effective prompt:
```
A futuristic city
```

## Cost Optimization

### Token Usage

- **Monitor token usage**: Keep track of your token usage to avoid unexpected costs.
- **Optimize prompt length**: Keep prompts concise while providing necessary context.
- **Use smaller models when possible**: For simpler tasks, smaller models can be more cost-effective.
- **Batch requests**: When processing multiple inputs, batch them in a single request.

### Caching

- **Cache responses**: For identical or similar requests, implement caching to avoid redundant API calls.
- **Implement TTL**: Set appropriate time-to-live for cached responses based on your use case.

```python
import hashlib
import json
from functools import lru_cache


@lru_cache(maxsize=100)
def get_embedding_cached(text, model="text-embedding-3-small"):
    # Create a hash of the text and model to use as a cache key
    cache_key = hashlib.md5((text + model).encode()).hexdigest()

    # Check if we have a cached result
    # (In a real implementation, you'd check a database or cache service)

    # If not in cache, call the API
    response = client.embeddings.create(model=model, input=text)

    embedding = response.data[0].embedding

    # Store in cache
    # (In a real implementation, you'd store in a database or cache service)

    return embedding
```

## Security Considerations

### Content Filtering

- **Implement content filtering**: Use moderation endpoints to filter inappropriate content.
- **Set appropriate usage policies**: Define clear usage policies for your application.

### User Data Privacy

- **Minimize data sharing**: Only share necessary user data with the API.
- **Inform users**: Be transparent about how user data is used with AI models.
- **Implement data retention policies**: Define clear policies for how long user data is stored.

## Testing and Evaluation

### Evaluating Model Outputs

- **Define evaluation metrics**: Establish clear metrics for evaluating model performance.
- **Conduct human evaluation**: For subjective tasks, include human evaluation.
- **Use automated testing**: Implement automated tests for consistent evaluation.

### A/B Testing

- **Compare model versions**: Test different models or prompts with real users.
- **Measure key metrics**: Track metrics like user satisfaction, task completion rate, etc.

## Application Architecture

### Asynchronous Processing

For long-running tasks, implement asynchronous processing:

```python
import asyncio
from openai import AsyncOpenAI

client = AsyncOpenAI(api_key="AVALAI_API_KEY", base_url="https://api.avalai.ir/v1")


async def generate_response(prompt):
    response = await client.chat.completions.create(
        model="gpt-5.5", messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content


async def process_batch(prompts):
    tasks = [generate_response(prompt) for prompt in prompts]
    return await asyncio.gather(*tasks)


# Usage
results = asyncio.run(process_batch(["Hello", "How are you?", "What's the weather?"]))
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
    input="What's the weather like in Boston?",
)

print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


### Streaming Responses

For better user experience, use streaming responses:

```python
from openai import OpenAI
import sys

client = OpenAI(api_key="AVALAI_API_KEY", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="gpt-5.5",
    messages=[{"role": "user", "content": "Write a story about a space explorer"}],
    stream=True,
)

for chunk in response:
    if chunk.choices[0].delta.content:
        sys.stdout.write(chunk.choices[0].delta.content)
        sys.stdout.flush()
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
    input="Write a story about a space explorer",
)

print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


## Getting Help with Documentation

**💡 Pro Tip:** You can copy any documentation page URL from docs.avalai.ir and paste it directly into your prompt at [chat.avalai.ir](https://chat.avalai.ir) (AvalAI Chat Platform). When you include a docs URL in your message, the AI models can access that page's content, allowing you to:

- Ask any model to explain specific documentation sections
- Get help debugging issues using the relevant docs
- Request implementation examples based on the documentation
- Clarify complex concepts with interactive Q&A

Simply paste the documentation URL into your chat message along with your question, and the model will fetch and use that documentation to assist you. This enables faster debugging and implementation by combining our comprehensive documentation with AI-powered assistance.

## Conclusion

Following these best practices will help you build more effective, efficient, and secure applications with the AvalAI API. As you gain experience with the platform, you'll develop additional practices tailored to your specific use cases.

Remember that the field of AI is rapidly evolving, so staying updated with the latest models, techniques, and best practices is essential for optimal results.