# Latency Optimization

This guide covers core principles for improving latency across a wide variety of LLM-related use cases. These techniques are derived from working with a wide range of customers and developers on production applications.

## Seven Principles for Latency Optimization

1. [Process tokens faster](#process-tokens-faster)
2. [Generate fewer tokens](#generate-fewer-tokens)
3. [Use fewer input tokens](#use-fewer-input-tokens)
4. [Make fewer requests](#make-fewer-requests)
5. [Parallelize](#parallelize)
6. [Make your users wait less](#make-your-users-wait-less)
7. [Don't default to an LLM](#dont-default-to-an-llm)

## Process Tokens Faster

**Inference speed** is the rate at which the LLM processes tokens, often measured in tokens per minute (TPM) or tokens per second (TPS).

The main factor influencing inference speed is **model size** – smaller models usually run faster (and cheaper), and when used correctly can even outperform larger models. To maintain high quality performance with smaller models:

* Use a longer, more detailed prompt
* Add more few-shot examples
* Consider fine-tuning / distillation

For example, you might choose `gpt-5.4-mini` or `claude-haiku-4-5` for faster responses when appropriate for the task.

```python
# Using a smaller model with a more detailed prompt
response = client.chat.completions.create(
    model="gpt-5.4-mini",
    messages=[
        {
            "role": "system",
            "content": "You are a helpful assistant that provides concise, accurate answers.",
        },
        {
            "role": "user",
            "content": "Explain quantum computing in simple terms, focusing on qubits and superposition. Include an analogy that makes it easy to understand.",
        },
    ],
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
    model="gpt-5.4-mini",
    instructions="You are a helpful assistant.",
    input="Explain quantum computing in simple terms, focusing on qubits and superposition. Include an analogy that makes it easy to understand.",
)

print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


## Generate Fewer Tokens

Generating tokens is typically the highest latency step when using an LLM. As a general rule, **cutting 50% of your output tokens may cut ~50% of your latency**.

To reduce output size:

* For **natural language**, ask the model to be concise ("under 20 words" or "be very brief")
* For **structured output**, minimize your output syntax: shorten function names, omit named arguments, coalesce parameters
* Use `max_tokens` or `stop_tokens` to end generation early

```python
# Requesting a concise response
response = client.chat.completions.create(
    model="gpt-5.5",
    messages=[
        {
            "role": "system",
            "content": "You are a helpful assistant that provides very brief answers, under 50 words.",
        },
        {"role": "user", "content": "Explain the theory of relativity"},
    ],
    max_tokens=100,
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
    input="Explain the theory of relativity",
)

print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


## Use Fewer Input Tokens

While reducing input tokens does result in lower latency, the impact is less significant – **cutting 50% of your prompt may only result in a 1-5% latency improvement**. Consider these techniques when working with large contexts:

* Fine-tune the model to replace lengthy instructions/examples
* Filter context input (prune RAG results, clean HTML)
* Maximize shared prompt prefix by putting dynamic portions later in the prompt

```python
# Example of filtering context input
def filter_relevant_context(query, documents, max_tokens=2000):
    # Sort documents by relevance to query
    sorted_docs = sort_by_relevance(query, documents)

    # Take only the most relevant documents up to max_tokens
    filtered_docs = []
    token_count = 0

    for doc in sorted_docs:
        doc_tokens = count_tokens(doc)
        if token_count + doc_tokens <= max_tokens:
            filtered_docs.append(doc)
            token_count += doc_tokens
        else:
            break

    return filtered_docs
```

## Make Fewer Requests

Each API request incurs round-trip latency. Instead of sequential requests, consider combining multiple steps into a single prompt:

```python
# Instead of separate requests for summarization and translation
response = client.chat.completions.create(
    model="gpt-5.5",
    messages=[
        {
            "role": "system",
            "content": "You will perform two tasks: 1) Summarize the text, and 2) Translate the summary to Spanish. Return results in JSON format with fields 'summary' and 'translation'.",
        },
        {"role": "user", "content": "Text to process: " + long_article},
    ],
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
    input="Text to process:",
)

print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


## Parallelize

For non-sequential steps, parallelize API calls:

```python
import asyncio
from openai import AsyncOpenAI


async def process_documents(documents):
    client = AsyncOpenAI(api_key="AVALAI_API_KEY", base_url="https://api.avalai.ir/v1")

    async def process_document(doc):
        response = await client.chat.completions.create(
            model="gpt-5.4-mini",
            messages=[
                {"role": "system", "content": "Summarize the following document:"},
                {"role": "user", "content": doc},
            ],
        )
        return response.choices[0].message.content

    # Process all documents in parallel
    tasks = [process_document(doc) for doc in documents]
    return await asyncio.gather(*tasks)
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
    model="gpt-5.4-mini",
    input=[
        {
            "role": "user",
            "content": [
                {"type": "input_text", "text": "Summarize the uploaded file."},
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


For sequential steps, consider speculative execution when one outcome is more likely:

1. Start step 1 & step 2 simultaneously (e.g., input moderation & story generation)
2. Verify the result of step 1
3. If the result was not as expected, cancel step 2 (and retry if necessary)

## Make Your Users Wait Less

The difference between waiting and watching progress is significant:

* **Streaming**: Immediately start showing the response as it's generated
* **Chunking**: Process output in chunks for real-time display
* **Show your steps**: Surface multi-step processes to users
* **Loading states**: Use spinners and progress bars

```python
from openai import OpenAI
import sys

client = OpenAI(
    api_key="your-avalai-api-key",  # Replace with your actual API key
    base_url="https://api.avalai.ir/v1",  # AvalAI API endpoint
)

# Stream the response to the user
response = client.chat.completions.create(
    model="gpt-5.5",
    messages=[
        {"role": "user", "content": "Write a short story about a time traveler."}
    ],
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
    input="Write a short story about a time traveler.",
)

print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


## Don't Default to an LLM

LLMs are versatile but not always the most efficient solution. Consider these alternatives:

* **Hard-coding**: For constrained outputs like confirmation messages
* **Pre-computing**: For limited input scenarios
* **Leveraging UI**: For summarized metrics or search results
* **Traditional optimization**: Binary search, caching, hash maps, etc.

```python
# Example of using a cache for common queries
response_cache = {}


def get_response(query):
    # Check if we have a cached response
    if query in response_cache:
        return response_cache[query]

    # If not, generate a new response
    response = client.chat.completions.create(
        model="gpt-5.5", messages=[{"role": "user", "content": query}]
    )

    # Cache the response for future use
    response_text = response.choices[0].message.content
    response_cache[query] = response_text

    return response_text
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
    input="Write a one-sentence summary of AvalAI.",
)

print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


## Example: Optimizing a Customer Service Bot

Let's analyze a hypothetical customer service bot architecture and apply our latency optimization principles.

### Initial Architecture

The initial architecture includes:
1. A user sends a message
2. The message is turned into a self-contained query
3. We determine if additional information is needed
4. Retrieval is performed
5. The assistant reasons about the query and search results
6. A response is sent back to the user

### Optimizations Applied

1. **Combine steps**: Merge query contextualization and retrieval check to make fewer requests
2. **Use smaller models**: Switch to fine-tuned GPT-3.5 for well-defined tasks
3. **Parallelize**: Run retrieval checks and reasoning steps simultaneously
4. **Shorten field names**: Reduce output tokens by using more concise JSON field names

These optimizations significantly reduce latency while maintaining response quality.

## Related Resources

- [Prompt Engineering](en/guides/prompt-engineering)
- [Prompt Caching](en/guides/prompt-caching)
- [Streaming Responses](en/guides/streaming-responses)
- [Model Selection](en/guides/model-selection)