# Google Models

AvalAI provides seamless access to Google's Gemini models through our unified API. This page details the available Google models, their capabilities, and optimal use cases, focusing on the latest generations.

> **Two Ways to Use Gemini Models**: You can access Gemini models through either the OpenAI-compatible API (using OpenAI client libraries) or Google's native GenAI SDK. For native SDK examples and advanced features, see [Native Google GenAI SDK Support](#native-google-genai-sdk-support).

## Available Models

Google offers several families of AI models including Gemini and Gemma, each with different capabilities, performance characteristics, and use cases.

### Gemini Models

Google's Gemini family offers a range of models balancing performance, cost, and features, including very large context windows and advanced multimodal capabilities.

### Gemini 3.5 Flash

Gemini 3.5 Flash (`gemini-3.5-flash`) is Google's new flagship Flash model, built on the Gemini 3 Flash reasoning foundation with configurable thinking levels to balance quality, cost, and latency. Published in May 2026, it improves coding, agentic tool use, expert tasks, multimodal understanding, and long-context performance while keeping the fast Flash profile.

| Feature                | Details                                                                                     |
| ---------------------- | ------------------------------------------------------------------------------------------- |
| Context window         | 1,048,576 input tokens, 65,536 output tokens                                                |
| Inputs                 | Text, Image, Video, Audio, PDF                                                              |
| Output                 | Text                                                                                        |
| Input pricing          | $1.50 / 1M tokens                                                                           |
| Cached input pricing   | $0.25 / 1M tokens                                                                           |
| Output pricing         | $9.00 / 1M tokens                                                                           |
| Audio input pricing    | $1.00 / 1M tokens                                                                           |
| Audio cached pricing   | $0.50 / 1M tokens                                                                           |
| Audio output pricing   | $1.00 / 1M tokens                                                                           |
| Knowledge cutoff       | January 2025                                                                                |
| Strengths              | Flagship Flash reasoning, coding, agentic tool use, multimodal input, long context          |
| Best for               | Agentic workflows, advanced coding, multimodal reasoning, long-context analysis             |

**Key Capabilities:**
- **Configurable Thinking**: Supports `thinkingLevel` values (`low`, `medium`, `high`) through Gemini `generationConfig`
- **Multimodal Native**: Accepts text, image, video, audio, and PDF inputs in one request
- **Long Context**: 1M input token window for large documents, repositories, and multi-source analysis
- **Function Calling**: Full support for function calling, parallel function calling, and structured outputs
- **Search Grounding and URL Context**: Can use Google Search grounding and URL Context for web-aware responses
- **Prompt Caching**: Supports cached inputs for repeated long contexts

**Benchmark Highlights:**
- **Terminal-bench 2.1**: 76.2% for agentic terminal coding
- **SWE-Bench Pro**: 55.1% on diverse agentic coding tasks
- **MCP Atlas**: 83.6% on multi-step MCP workflows
- **Toolathlon**: 56.5% on real-world tool use
- **CharXiv Reasoning**: 84.2% for complex chart reasoning
- **Humanity's Last Exam**: 40.2% on academic reasoning

```python
response = client.chat.completions.create(
    model="gemini-3.5-flash",
    messages=[
        {
            "role": "user",
            "content": "Design a resilient event-driven architecture for a global payments platform.",
        }
    ],
    extra_body={"generationConfig": {"thinkingConfig": {"thinkingLevel": "high"}}},
)

print(response.choices[0].message.content)
```

### Gemini 3.1 Pro Preview

Gemini 3.1 Pro Preview (`gemini-3.1-pro-preview`) is the next iteration in the Gemini 3 series and Google's most advanced model as of February 2026. This natively multimodal reasoning model significantly outperforms Gemini 3 Pro across key benchmarks while maintaining the same architecture and pricing. It excels at agentic performance, advanced coding, long-context understanding, and algorithmic development.

| Feature                | Details                                                                                     |
| ---------------------- | ------------------------------------------------------------------------------------------- |
| Context window         | Up to 1M tokens (Max Input)                                                                 |
| Max output tokens      | 64K tokens                                                                                  |
| Inputs                 | Audio, images, videos, text, and code repositories                                          |
| Output                 | Text                                                                                        |
| Input pricing (<200k)  | $2.00 / 1M tokens (text)                                                                    |
| Output pricing (<200k) | $12.00 / 1M tokens (text)                                                                   |
| Input pricing (>200k)  | $4.00 / 1M tokens (text)                                                                    |
| Output pricing (>200k) | $18.00 / 1M tokens (text)                                                                   |
| Audio input pricing    | $7.00 / 1M tokens                                                                           |
| Audio cached input     | $1.50 / 1M tokens                                                                           |
| Audio output pricing   | $7.00 / 1M tokens                                                                           |
| Context caching price  | $0.825 / 1M tokens (≤200k), $1.00 / 1M tokens (>200k)                                       |
| Knowledge cutoff       | January 2025                                                                                |
| Strengths              | Advanced reasoning, multimodal comprehension, complex problem-solving, agentic performance  |
| Best for               | Complex reasoning, strategic planning, advanced coding, algorithmic development, research   |

**Key Benchmark Improvements over Gemini 3 Pro:**
- **Humanity's Last Exam**: 44.4% (vs 37.5%) - Best in class without tools
- **ARC-AGI-2**: 77.1% (vs 31.1%) - Significant improvement in abstract reasoning
- **GPQA Diamond**: 94.3% (vs 91.9%) - Leading scientific knowledge
- **Terminal-Bench 2.0**: 68.5% (vs 56.9%) - Top agentic terminal coding
- **LiveCodeBench Pro**: 2887 Elo (vs 2439) - Best competitive coding
- **BrowseComp**: 85.9% (vs 59.2%) - Leading agentic search

```python
response = client.chat.completions.create(
    model="gemini-3.1-pro-preview",
    messages=[
        {"role": "system", "content": "You are an expert in complex problem solving."},
        {
            "role": "user",
            "content": "Design a comprehensive solution for optimizing a large-scale distributed system.",
        },
    ],
    max_tokens=4096,
)
```

### Gemini 3 Pro Preview

Gemini 3 Pro Preview (`gemini-3-pro-preview`) is Google's most advanced model in the Gemini series, designed for highly complex reasoning tasks and multimodal understanding. This sparse mixture-of-experts (MoE) model can comprehend vast datasets from multiple information sources including text, audio, images, video, and entire code repositories.

| Feature                | Details                                                                                     |
| ---------------------- | ------------------------------------------------------------------------------------------- |
| Context window         | Up to 1M tokens (Max Input)                                                                 |
| Max output tokens      | 64K tokens                                                                                  |
| Inputs                 | Audio, images, videos, text, and code repositories                                          |
| Output                 | Text                                                                                        |
| Input pricing (<200k)  | $2.00 / 1M tokens (text)                                                                    |
| Output pricing (<200k) | $12.00 / 1M tokens (text)                                                                   |
| Input pricing (>200k)  | $4.00 / 1M tokens (text)                                                                    |
| Output pricing (>200k) | $18.00 / 1M tokens (text)                                                                   |
| Audio input pricing    | $7.00 / 1M tokens                                                                           |
| Audio output pricing   | $7.00 / 1M tokens                                                                           |
| Context caching price  | $0.825 / 1M tokens (≤200k), $1.00 / 1M tokens (>200k)                                       |
| Knowledge cutoff       | January 2025                                                                                |
| Strengths              | Advanced reasoning, multimodal comprehension, complex problem-solving, agentic performance  |
| Best for               | Complex reasoning, strategic planning, advanced coding, algorithmic development, research   |

```python
response = client.chat.completions.create(
    model="gemini-3-pro-preview",
    messages=[
        {"role": "system", "content": "You are an expert in complex problem solving."},
        {
            "role": "user",
            "content": "Design a comprehensive solution for optimizing a large-scale distributed system.",
        },
    ],
    max_tokens=2048,
)
```
### Gemini 3 Pro Image (Nano Banana Pro)

Gemini 3 Pro Image (`gemini-3-pro-image`), also known as "Nano Banana Pro" is Google's most advanced image generation and editing model, designed for professional asset production and complex visual instructions.

> **Stable Release Available:** The stable alias `gemini-3-pro-image` is now available with identical capabilities and pricing. We recommend using `gemini-3-pro-image` for production workloads. See the [June 5, 2026 update](en/news/2026-06-05-gemini-image-stable-and-qwen3-max-added.md) for details.

| Feature                | Details                                                                                     |
| ---------------------- | ------------------------------------------------------------------------------------------- |
| Context window         | Supports text and image inputs                                                              |
| Max output             | Images up to 4K resolution (4096x4096px), plus text responses                               |
| Inputs                 | Text prompts, reference images                                                              |
| Outputs                | Images (1K-4K resolution) and text                                                          |
| Input pricing          | $2.00 / 1M tokens (text), $2.00 / 1M tokens (image input, ~$0.067 per image)               |
| Output pricing         | $12.00 / 1M tokens (text), $0.134 per 1K-2K image, $0.24 per 4K image                      |
| Context caching price  | $0.50 / 1M tokens                                                                           |
| Strengths              | Advanced text rendering (including Persian), studio-quality control, real-world knowledge    |
| Best for               | Professional graphics, localized marketing materials, text-in-image generation, image editing|
| Status                 | Preview                                                                                     |

**Key Features:**
- **Advanced Text Rendering**: First image generation model to render Persian characters with near-perfect accuracy
- **Studio-Quality Control**: Fine control over composition, lighting, color grading, and aspect ratios
- **Real-World Knowledge**: Leverages Google Search for accurate, grounded image generation
- **Resolution Support**: Generate images up to 4K resolution (4096x4096px)
- **Image Editing**: Comprehensive editing capabilities including aspect ratio adjustments, lighting changes, and subject consistency
- **Default "Thinking" Process**: Refines composition before generation for optimal results
- **Multi-Language Support**: Exceptional capability for localizing designs across different languages

**Image Output Pricing**: Images from 1024x1024px (1K) to 2048x2048px (2K) consume 1120 tokens ($0.134 per image). Images up to 4096x4096px (4K) consume 2000 tokens ($0.24 per image).

> **Using Gemini-Specific Settings via OpenAI-Compatible Endpoint**: When using `gemini-3-pro-image` through the OpenAI-compatible `v1/chat/completions` endpoint and you want to use Gemini-specific settings (non-OpenAI parameters), you need to pass the `generationConfig` dict to the `extra_body` dictionary so AvalAI can map it to the provider. This model supports both `aspectRatio` and `imageSize` in the `imageConfig`. Users can also use the [native Gemini API (v1beta)](en/api-reference/v1beta.md) to access Gemini through the native API schema and official Google SDK.

```python
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Generate image with text
response = client.chat.completions.create(
    model="gemini-3-pro-image",
    messages=[
        {
            "role": "user",
            "content": "Create a minimalist poster with Persian text 'هوش مصنوعی' (Artificial Intelligence) in a modern, tech-inspired style with blue and white colors",
        }
    ],
    modalities=["image", "text"],
)

# Access the generated image
if hasattr(response.choices[0].message, "images"):
    images = getattr(response.choices[0].message, "images")
    for img in images:
        print(f"Image URL: {img.image_url.url[:100]}...")

print(response.choices[0].message.content)
```

**With Gemini-Specific generationConfig (aspectRatio and imageSize):**

```python
# Generate image with custom aspect ratio and size using extra_body
response = client.chat.completions.create(
    model="gemini-3-pro-image",
    messages=[
        {
            "role": "user",
            "content": "Create a picture of a nano banana dish in a fancy restaurant with a Gemini theme",
        }
    ],
    modalities=["image", "text"],
    extra_body={
        "generationConfig": {"imageConfig": {"aspectRatio": "16:9", "imageSize": "2K"}}
    },
)
```

**Image Editing Example:**

```python
# Edit existing image
response = client.chat.completions.create(
    model="gemini-3-pro-image",
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Change the aspect ratio to 16:9 while keeping the subject centered",
                },
                {
                    "type": "image_url",
                    "image_url": {"url": "https://example.com/original-image.jpg"},
                },
            ],
        }
    ],
    modalities=["image", "text"],
)
```

### Gemini 3.1 Flash Image (Nano Banana 2)

Gemini 3.1 Flash Image (`gemini-3.1-flash-image`), also known as "Nano Banana 2" is Google's high-efficiency image generation and editing model, optimized for speed and high-volume developer use cases. It serves as the high-efficiency counterpart to Gemini 3 Pro Image with an exceptional price-performance ratio.

> **Stable Release Available:** The stable alias `gemini-3.1-flash-image` is now available with identical capabilities and pricing. We recommend using `gemini-3.1-flash-image` for production workloads. See the [June 5, 2026 update](en/news/2026-06-05-gemini-image-stable-and-qwen3-max-added.md) for details.

| Feature                | Details                                                                                     |
| ---------------------- | ------------------------------------------------------------------------------------------- |
| Context window         | Supports text and image inputs                                                              |
| Max output             | Images up to 4K resolution (4096x4096px), plus text responses                               |
| Inputs                 | Text prompts, reference images                                                              |
| Outputs                | Images (512px-4K resolution) and text                                                       |
| Input pricing          | $0.50 / 1M tokens (text), $0.50 / 1M tokens (image input)                                   |
| Cached input pricing   | $0.25 / 1M tokens                                                                           |
| Output pricing         | $3.00 / 1M tokens (text), $60.00 / 1M tokens (image output)                                 |
| Per-image pricing      | $0.0672 per 1K-2K image, $0.101 per 2K-4K image, $0.151 per 4K image                        |
| Strengths              | High-efficiency, fast generation, world knowledge with web search, advanced text rendering   |
| Best for               | High-volume apps, rapid iterations, cost-effective image generation, production workflows    |
| Status                 | Preview                                                                                     |

**Key Features:**
- **Improved World Knowledge**: Leverages Gemini's broad world knowledge with web search grounding to create enhanced visuals
- **Advanced Text Rendering**: Reliable, crisp text rendering with in-image localization supporting multiple languages
- **Greater Creative Control**: Vibrant lighting, richer textures, sharper details with configurable thinking levels
- **Native Aspect Ratios**: Support for all existing ratios plus new 4:1, 1:4, 8:1, and 1:8 ratios
- **New 512px Resolution**: Optimized for efficiency with minimal latency for rapid iterations
- **Improved Instruction Following**: Adheres more strictly to complex, multi-layered prompts
- **Google Image Search Grounding**: Generate images based on real-world image references (exclusive to 3.1 Flash)

**Image Output Pricing**: Images from 1024x1024px (1K) to 2048x2048px (2K) cost $0.0672 per image. Images from 2K to 4K cost $0.101 per image. Images at 4K resolution cost $0.151 per image.

> **Using Gemini-Specific Settings via OpenAI-Compatible Endpoint**: When using `gemini-3.1-flash-image` through the OpenAI-compatible `v1/chat/completions` endpoint and you want to use Gemini-specific settings (non-OpenAI parameters), you need to pass the `generationConfig` dict to the `extra_body` dictionary so AvalAI can map it to the provider. This model supports both `aspectRatio` and `imageSize` in the `imageConfig`. Users can also use the [native Gemini API (v1beta)](en/api-reference/v1beta.md) to access Gemini through the native API schema and official Google SDK.

```python
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Generate image with text
response = client.chat.completions.create(
    model="gemini-3.1-flash-image",
    messages=[
        {
            "role": "user",
            "content": "Create a photorealistic nano banana dish in a fancy restaurant with a Gemini theme",
        }
    ],
    modalities=["image", "text"],
)

# Access the generated image
if hasattr(response.choices[0].message, "images"):
    images = getattr(response.choices[0].message, "images")
    for img in images:
        print(f"Image URL: {img.image_url.url[:100]}...")

print(response.choices[0].message.content)
```

**With Gemini-Specific generationConfig (aspectRatio and imageSize):**

```python
# Generate image with custom aspect ratio and size using extra_body
response = client.chat.completions.create(
    model="gemini-3.1-flash-image",
    messages=[
        {
            "role": "user",
            "content": "Create a picture of a nano banana dish in a fancy restaurant with a Gemini theme",
        }
    ],
    modalities=["image", "text"],
    extra_body={
        "generationConfig": {"imageConfig": {"aspectRatio": "16:9", "imageSize": "2K"}}
    },
)
```

**Image Editing Example:**

```python
# Edit existing image
response = client.chat.completions.create(
    model="gemini-3.1-flash-image",
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Transform this image into a cyberpunk style with neon colors",
                },
                {
                    "type": "image_url",
                    "image_url": {"url": "https://example.com/original-image.jpg"},
                },
            ],
        }
    ],
    modalities=["image", "text"],
)
```

### Gemini 3.1 Flash-Lite (Stable) and Preview

Gemini 3.1 Flash-Lite (`gemini-3.1-flash-lite`) is the stable release of Google's most cost-efficient multimodal Gemini 3 model. The previous `gemini-3.1-flash-lite-preview` alias remains available with the same pricing and capabilities, while the stable alias is recommended for production integrations. It is best for high-volume agentic tasks, simple data extraction, and extremely low-latency applications where budget and speed are the primary constraints.

| Feature                | Details                                                                                     |
| ---------------------- | ------------------------------------------------------------------------------------------- |
| Context window         | 1,048,576 input tokens, 65,536 output tokens                                                |
| Inputs                 | Text, Image, Video, Audio, PDF                                                              |
| Output                 | Text                                                                                        |
| Input pricing          | $0.25 / 1M tokens                                                                           |
| Cached input pricing   | $0.025 / 1M tokens                                                                          |
| Output pricing         | $1.50 / 1M tokens                                                                           |
| Audio input pricing    | $0.50 / 1M tokens                                                                           |
| Audio cached pricing   | $0.05 / 1M tokens                                                                           |
| Audio output pricing   | $1.50 / 1M tokens                                                                           |
| Knowledge cutoff       | January 2025                                                                                |
| Strengths              | Cost-efficient, fastest performance, multimodal input, thinking support                     |
| Best for               | High-volume agentic tasks, translation, transcription, data extraction, model routing       |

**Key Capabilities:**
- **Batch API**: Supported for high-volume processing
- **Context Caching**: Supported for efficient repeated contexts
- **Code Execution**: Run code directly within the model
- **File Search**: Search through uploaded files
- **Function Calling**: Full support for tool use and agentic workflows
- **Search Grounding**: Google Search integration for accurate responses
- **Structured Outputs**: Generate structured JSON responses with schema validation
- **Thinking/Reasoning**: Configurable thinking levels (low, medium, high) for step-by-step reasoning
- **URL Context**: Can fetch and process web content directly

**Best Use Cases:**
- **Translation**: Fast, cheap, high-volume translation for chat messages, reviews, support tickets
- **Transcription**: Audio and video transcription without spinning up separate speech-to-text pipelines
- **Data Extraction**: Entity extraction, classification, and lightweight data processing with JSON output
- **Document Summarization**: Parse PDFs and return concise summaries for document processing pipelines
- **Model Routing**: Use as a low-cost classifier to route queries to appropriate models based on task complexity

```python
response = client.chat.completions.create(
    model="gemini-3.1-flash-lite",
    messages=[
        {
            "role": "user",
            "content": "Translate the following text to German: Hey, are you down to grab some pizza later? I'm starving!",
        },
    ],
)

print(response.choices[0].message.content)
```

**With Thinking Enabled:**

```python
response = client.chat.completions.create(
    model="gemini-3.1-flash-lite",
    messages=[{"role": "user", "content": "How does AI work?"}],
    extra_body={"generationConfig": {"thinkingConfig": {"thinkingLevel": "high"}}},
)

print(response.choices[0].message.content)
```

### Gemini 3 Flash Preview

Gemini 3 Flash Preview (`gemini-3-flash-preview`) is Google's most intelligent model built for speed, combining frontier intelligence with superior search and grounding. Released December 2025, this model offers significant improvements over Gemini 2.5 Flash and matches the performance of frontier models like Gemini 3 Pro and GPT-5.2 in key benchmarks.

| Feature                | Details                                                                                     |
| ---------------------- | ------------------------------------------------------------------------------------------- |
| Context window         | Up to 1,048,576 tokens (1M)                                                                 |
| Max output tokens      | 65,536 tokens                                                                               |
| Inputs                 | Text, Image, Video, Audio, PDF                                                              |
| Output                 | Text                                                                                        |
| Input pricing          | $0.50 / 1M tokens                                                                           |
| Cached input pricing   | $0.25 / 1M tokens                                                                           |
| Output pricing         | $3.00 / 1M tokens                                                                           |
| Audio input pricing    | $1.50 / 1M tokens                                                                           |
| Audio cached pricing   | $0.50 / 1M tokens                                                                           |
| Audio output pricing   | $1.50 / 1M tokens                                                                           |
| Knowledge cutoff       | January 2025                                                                                |
| Strengths              | Speed, efficiency, pro-grade reasoning, search grounding, thinking capabilities             |
| Best for               | Everyday tasks, video analysis, data extraction, visual Q&A, quick workflows                |

**Key Capabilities:**
- **Batch API**: Supported
- **Context Caching**: Supported for efficient repeated contexts
- **Code Execution**: Run code directly within the model
- **File Search**: Search through uploaded files
- **Function Calling**: Full support for tool use and agentic workflows
- **Search Grounding**: Superior search and grounding with real-world knowledge
- **Structured Outputs**: Generate structured JSON responses
- **Thinking/Reasoning**: Built-in reasoning for complex problem-solving
- **URL Context**: Process and understand web page content

**Benchmark Performance:**
- **Humanity's Last Exam**: 33.7% (without tool use) - matches GPT-5.2 (34.5%)
- **MMMU-Pro**: 81.2% - outperforms all competitors including GPT-5.2 (79.5%)
- 3x faster than Gemini 2.5 Pro while matching performance
- Uses 30% fewer tokens on average for thinking tasks compared to 2.5 Pro

```python
response = client.chat.completions.create(
    model="gemini-3-flash-preview",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {
            "role": "user",
            "content": "Explain the concept of quantum entanglement in simple terms.",
        },
    ],
    max_tokens=2048,
)
```

**Multimodal Example:**

```python
response = client.chat.completions.create(
    model="gemini-3-flash-preview",
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "What's in this image?"},
                {
                    "type": "image_url",
                    "image_url": {"url": "https://example.com/image.jpg"},
                },
            ],
        }
    ],
)
```

### Gemini 2.5 Pro

Gemini 2.5 Pro (`gemini-2.5-pro`) is Google's state-of-the-art multipurpose model, which excels at coding and complex reasoning tasks.

| Feature                | Details                                                                                     |
| ---------------------- | ------------------------------------------------------------------------------------------- |
| Context window         | Up to 1M tokens (Max Input)                                                                 |
| Max output tokens      | 65,536 tokens                                                                               |
| Inputs                 | Audio, images, videos, and text                                                             |
| Output                 | Text                                                                                        |
| Input pricing (<200k)  | $1.25 / 1M tokens (text)                                                                    |
| Output pricing (<200k) | $10.00 / 1M tokens (text, including thinking tokens)                                        |
| Input pricing (>200k)  | $2.50 / 1M tokens (text)                                                                    |
| Output pricing (>200k) | $15.00 / 1M tokens (text, including thinking tokens)                                        |
| Context caching price  | $0.31 / 1M tokens (≤200k), $0.625 / 1M tokens (>200k), $4.50 / 1M tokens per hour (storage) |
| Strengths              | Enhanced thinking and reasoning, multimodal understanding, advanced coding                  |
| Best for               | Complex reasoning tasks, research, code generation, multimodal analysis                     |
| Reasoning              | Supports configurable thinking via the `thinking` parameter                                 |

```python
response = client.chat.completions.create(
    model="gemini-2.5-pro",
    messages=[
        {"role": "system", "content": "You are an expert multimodal analyst."},
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "Analyze this code and suggest improvements:"},
                {
                    "type": "text",
                    "text": "def factorial(n):\n  if n == 0:\n    return 1\n  else:\n    return n * factorial(n-1)",
                },
            ],
        },
    ],
)
```

### Gemini 2.5 Flash

Gemini 2.5 Flash (`gemini-2.5-flash-preview-05-20`) is Google's first hybrid reasoning model which supports a 1M token context window and has thinking budgets.

| Feature               | Details                                                                                                 |
| --------------------- | ------------------------------------------------------------------------------------------------------- |
| Context window        | Up to 1M tokens (Max Input)                                                                             |
| Max output tokens     | 8,192 tokens                                                                                            |
| Inputs                | Audio, images, videos, and text                                                                         |
| Output                | Text                                                                                                    |
| Input pricing         | $0.15 / 1M tokens (text/image/video), $1.00 / 1M tokens (audio)                                         |
| Output pricing        | Non-thinking: $0.60 / 1M tokens, Thinking: $3.50 / 1M tokens                                            |
| Context caching price | $0.0375 / 1M tokens (text/image/video), $0.25 / 1M tokens (audio), $1.00 / 1M tokens per hour (storage) |
| Strengths             | Adaptive thinking, cost efficiency, 1M token context window                                             |
| Best for              | Complex tasks requiring efficient reasoning with cost control                                           |
| Reasoning             | Supports configurable thinking budgets via the `thinking` parameter                                     |

```python
response = client.chat.completions.create(
    model="gemini-2.5-flash",
    messages=[
        {
            "role": "user",
            "content": "Summarize the key principles of machine learning in a concise way.",
        },
    ],
)
```

To control the model's thinking/reasoning capabilities, you can use the `thinking` parameter:

?> **Note:** `thinking_budget` is only supported in Gemini 2.5 Flash. This is true at the time of writing this document, it may change over time. For the most current information, reference the [official Google AI documentation](https://ai.google.dev/gemini-api/docs/thinking#set-budget).

```python
# Using OpenAI client libraries with AvalAI
response = client.chat.completions.create(
    model="gemini-2.5-flash",
    messages=[
        {"role": "user", "content": "Solve this complex problem step by step..."}
    ],
    extra_body={
        "thinking": {"type": "enabled", "budget_tokens": 2000}
    },  # Allow up to 2000 tokens for reasoning
)

# Using direct API calls
# The thinking parameter goes directly in the request body
```

Setting `budget_tokens` to 0 disables thinking, while a positive value like 2000 allows the model to use up to that many tokens for reasoning. This affects both pricing and the depth of analysis the model can perform.

### Veo 3.1 Video Generation Models

Google's Veo 3.1 series offers state-of-the-art AI video generation capabilities, enabling developers to create high-quality videos from text prompts or reference images. These models feature native audio generation, improved visual quality, and enhanced prompt adherence.

#### Veo 3.1 Generate

Veo 3.1 Generate (`veo-3.1-generate-001`) delivers superior output quality with rich native audio, natural conversations, and synchronized sound effects.

| Feature | Details |
| ----------------------- | ------------------------------------------------------------------------------------ |
| Max duration | 8 seconds (also supports 4, 6 seconds) |
| Inputs | Text prompts, reference images |
| Output | Video with audio (MP4) |
| Resolutions | 720p, 1080p (16:9 only) |
| Aspect ratios | 16:9 (landscape), 9:16 (portrait) |
| Audio | Native audio with sound effects and ambient noise |
| Output pricing | $0.40 / second of video |
| Strengths | Highest quality, rich audio, character consistency |
| Best for | Production-ready content, professional videos, cinematic quality |
| Status | Stable |

**Key Features:**
- **Native Audio Generation**: Videos include synchronized audio with natural sound effects
- **Image-to-Video**: Generate videos from reference images with improved prompt adherence
- **Reference Images**: Use up to 3 reference images for character/style consistency
- **Video Extension**: Extend existing videos to create longer sequences
- **High Resolution**: Support for 1080p output in 16:9 aspect ratio

```python
from openai import OpenAI
import time

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Generate video from text
video = client.videos.create(
    model="veo-3.1-generate-001",
    prompt="A serene lake at sunset with mountains in the background, gentle waves on the water surface",
    seconds="8",
)

print(f"Video generation started: {video.id}")

# Poll for completion
while True:
    video_status = client.videos.retrieve(video.id)

    if video_status.status == "completed":
        print(f"Video ready! ID: {video.id}")

        # Download video
        content = client.videos.download_content(video.id)
        with open("output.mp4", "wb") as f:
            f.write(content.read())
        print("Video downloaded successfully!")
        break
    elif video_status.status == "failed":
        print(f"Generation failed: {video_status.error}")
        break

    time.sleep(10)
```

#### Veo 3.1 Fast Generate

Veo 3.1 Fast Generate (`veo-3.1-fast-generate-001`) is speed-optimized while maintaining high quality, ideal for rapid iteration and high-volume projects.

| Feature | Details |
| ----------------------- | ------------------------------------------------------------------------------------ |
| Max duration | 8 seconds (also supports 4, 6 seconds) |
| Inputs | Text prompts, reference images |
| Output | Video with audio (MP4) |
| Resolutions | 720p, 1080p (16:9 only) |
| Aspect ratios | 16:9 (landscape), 9:16 (portrait) |
| Audio | High-quality native audio |
| Output pricing | $0.15 / second of video |
| Strengths | Fast generation, cost-effective, high quality |
| Best for | Rapid iteration, high-volume applications, cost-sensitive projects |
| Status | Stable |

```python
# Fast video generation for quick iterations
video = client.videos.create(
    model="veo-3.1-fast-generate-001",
    prompt="A cat playing with a ball of yarn in a sunny garden",
    seconds="4",
)

print(f"Fast video generation started: {video.id}")
```

#### Image-to-Video Generation

Use reference images to guide video generation:

```python
# Generate video from reference image
video = client.videos.create(
    model="veo-3.1-generate-001",
    prompt="The landscape comes alive with flowing water and moving clouds, birds flying overhead",
    input_reference=open("reference_image.jpg", "rb"),
    seconds="8",
)
```

#### Controlling Aspect Ratio and Resolution

```python
# Landscape 1080p
video_landscape = client.videos.create(
    model="veo-3.1-generate-001",
    prompt="Aerial drone shot of a coastal city at sunset",
    size="1920x1080",  # Maps to 16:9 aspect ratio at 1080p
    seconds="8",
)

# Portrait video for social media
video_portrait = client.videos.create(
    model="veo-3.1-fast-generate-001",
    prompt="Fashion model walking down a city street",
    size="1080x1920",  # Maps to 9:16 aspect ratio
    seconds="6",
)
```

For a comprehensive guide on using Veo models for video generation, see our [Generate Videos Using Veo](en/guides/generate-videos-using-veo.md) guide and the [Veo 3.1 announcement](en/news/2025-11-18-veo-3-1-video-models-added.md).


### Gemini Flash Latest

Gemini Flash Latest (`gemini-flash-latest`) is an alias that points to the latest Gemini 2.5 Flash preview model (`gemini-2.5-flash-preview-09-2025`), providing hybrid reasoning capabilities with a 1M token context window.

| Feature               | Details                                                                                                 |
| --------------------- | ------------------------------------------------------------------------------------------------------- |
| Context window        | Up to 1M tokens (Max Input)                                                                             |
| Max output tokens     | 8,192 tokens                                                                                            |
| Inputs                | Audio, images, videos, and text                                                                         |
| Output                | Text                                                                                                    |
| Input pricing         | $0.30 / 1M tokens (text/image/video), $1.00 / 1M tokens (audio)                                         |
| Cached input pricing  | $0.15 / 1M tokens (text/image/video), $0.25 / 1M tokens (audio)                                         |
| Output pricing        | $2.50 / 1M tokens                                                                                        |
| Strengths             | Latest preview features, hybrid reasoning, 1M token context window                                      |
| Best for              | Complex reasoning tasks, extensive document processing, multimodal analysis                             |
| Knowledge cutoff      | January 2025                                                                                            |

```python
response = client.chat.completions.create(
    model="gemini-flash-latest",
    messages=[
        {
            "role": "user",
            "content": "Analyze this complex scenario and provide detailed reasoning.",
        },
    ],
)
```

### Gemini 2.5 Flash Preview 09-2025

Gemini 2.5 Flash Preview 09-2025 (`gemini-2.5-flash-preview-09-2025`) is the latest preview version of Gemini 2.5 Flash with enhanced reasoning capabilities and improved performance.

| Feature               | Details                                                                                                 |
| --------------------- | ------------------------------------------------------------------------------------------------------- |
| Context window        | Up to 1M tokens (Max Input)                                                                             |
| Max output tokens     | 8,192 tokens                                                                                            |
| Inputs                | Audio, images, videos, and text                                                                         |
| Output                | Text                                                                                                    |
| Input pricing         | $0.30 / 1M tokens (text/image/video), $1.00 / 1M tokens (audio)                                         |
| Cached input pricing  | $0.15 / 1M tokens (text/image/video), $0.25 / 1M tokens (audio)                                         |
| Output pricing        | $2.50 / 1M tokens                                                                                        |
| Strengths             | Enhanced reasoning, improved performance, multimodal capabilities                                       |
| Best for              | Advanced reasoning tasks, complex problem solving, multimodal analysis                                 |
| Knowledge cutoff      | January 2025                                                                                            |

```python
response = client.chat.completions.create(
    model="gemini-2.5-flash-preview-09-2025",
    messages=[
        {
            "role": "user",
            "content": "Solve this multi-step problem with detailed reasoning.",
        },
    ],
)
```

### Gemini Flash Lite Latest

Gemini Flash Lite Latest (`gemini-flash-lite-latest`) is an alias that points to the latest cost-effective Gemini model (`gemini-2.5-flash-lite-preview-09-2025`), optimized for high-volume, at-scale usage.

| Feature               | Details                                                                                                 |
| --------------------- | ------------------------------------------------------------------------------------------------------- |
| Context window        | Up to 1M tokens (Max Input)                                                                             |
| Max output tokens     | 8,192 tokens                                                                                            |
| Inputs                | Audio, images, videos, and text                                                                         |
| Output                | Text                                                                                                    |
| Input pricing         | $0.10 / 1M tokens (text/image/video), $0.10 / 1M tokens (audio)                                         |
| Cached input pricing  | $0.05 / 1M tokens (text/image/video), $0.05 / 1M tokens (audio)                                         |
| Output pricing        | $0.40 / 1M tokens                                                                                        |
| Strengths             | Most cost-effective, optimized for scale, good performance                                              |
| Best for              | High-volume applications, cost-sensitive projects, batch processing                                     |
| Knowledge cutoff      | January 2025                                                                                            |

```python
response = client.chat.completions.create(
    model="gemini-flash-lite-latest",
    messages=[
        {
            "role": "user",
            "content": "Process this text efficiently with cost optimization.",
        },
    ],
)
```

### Gemini 2.5 Flash Lite Preview 09-2025

Gemini 2.5 Flash Lite Preview 09-2025 (`gemini-2.5-flash-lite-preview-09-2025`) is the smallest and most cost-effective model in the Gemini 2.5 series, designed for at-scale usage.

| Feature               | Details                                                                                                 |
| --------------------- | ------------------------------------------------------------------------------------------------------- |
| Context window        | Up to 1M tokens (Max Input)                                                                             |
| Max output tokens     | 8,192 tokens                                                                                            |
| Inputs                | Audio, images, videos, and text                                                                         |
| Output                | Text                                                                                                    |
| Input pricing         | $0.10 / 1M tokens (text/image/video), $0.10 / 1M tokens (audio)                                         |
| Cached input pricing  | $0.05 / 1M tokens (text/image/video), $0.05 / 1M tokens (audio)                                         |
| Output pricing        | $0.40 / 1M tokens                                                                                        |
| Strengths             | Extremely cost-effective, good performance for simple tasks, scalable                                  |
| Best for              | Large-scale deployments, cost-sensitive applications, simple to moderate complexity tasks              |
| Knowledge cutoff      | January 2025                                                                                            |

```python
response = client.chat.completions.create(
    model="gemini-2.5-flash-lite-preview-09-2025",
    messages=[
        {
            "role": "user",
            "content": "Summarize this document efficiently.",
        },
    ],
)
```

### Gemini 2.5 Flash Image (Nano Banana)

Gemini 2.5 Flash Image or Nano Banana (`gemini-2.5-flash-image`) is Google's stable state-of-the-art image generation model from the Gemini 2.5 family, featuring top-rated image generation and editing capabilities.

> **Note:** The preview version (`gemini-2.5-flash-image-preview`) is now deprecated in favor of the stable version. Please migrate to `gemini-2.5-flash-image` for production use.

| Feature | Details |
| ----------------------- | ------------------------------------------------------------------------------------ |
| Context window | 32,768 tokens (Max Input) |
| Max output tokens | 32,768 tokens |
| Inputs | Images and text |
| Outputs | Images and text |
| Input pricing | $0.30 / 1M tokens (text), $0.30 / 1M tokens (image generation) |
| Output pricing | $2.50 / 1M tokens (text), $30.00 / 1M tokens (image generation) |
| Strengths | State-of-the-art image generation, text-to-image, image-to-image transformations |
| Best for | Professional image generation, creative applications, image editing tasks |
| Knowledge cutoff | June 2025 |

> **Using Gemini-Specific Settings via OpenAI-Compatible Endpoint**: When using `gemini-2.5-flash-image` through the OpenAI-compatible `v1/chat/completions` endpoint and you want to use Gemini-specific settings (non-OpenAI parameters), you need to pass the `generationConfig` dict to the `extra_body` dictionary so AvalAI can map it to the provider. This model supports only `aspectRatio` in the `imageConfig`. Users can also use the [native Gemini API (v1beta)](en/api-reference/v1beta.md) to access Gemini through the native API schema and official Google SDK.

## Text to image generation
```python
# Text to image generation
response = client.chat.completions.create(
    model="gemini-2.5-flash-image",
    messages=[
        {
            "role": "user",
            "content": "A strange character on a colorful galaxy background, with lots of stars and planets.",
        }
    ],
    modalities=["image", "text"],
)

# Image is now available in the response
image_url = response.choices[0].message.images[0]["image_url"]["url"]
content = (
    response.choices[0].message.content.strip()
    if response.choices[0].message.content
    else None
)

# Process the returned image data
header, base64_data = image_url.split(",", 1)
ext = header.split(";")[0].split("/")[1]

import base64

image_bytes = base64.b64decode(base64_data)
with open(f"generated_image.{ext}", "wb") as f:
    f.write(image_bytes)
print(f"✅ Image saved as generated_image.{ext}")

# Print any text response that came with the image
if content:
    print(f"Model response: {content}")
```

## With Gemini-Specific generationConfig (aspectRatio)

```python
# Text to image generation with custom aspect ratio using extra_body
response = client.chat.completions.create(
    model="gemini-2.5-flash-image",
    messages=[
        {
            "role": "user",
            "content": "Create a picture of a nano banana dish in a fancy restaurant with a Gemini theme",
        }
    ],
    modalities=["image", "text"],
    extra_body={"generationConfig": {"imageConfig": {"aspectRatio": "16:9"}}},
)
```

## Image to image transformation
```python
# Image to image transformation
prompt = "regenerate this image into Ghibli style"
image_url = "https://storage.googleapis.com/github-repo/img/gemini/intro/landmark3.jpg"

messages = [
    {
        "role": "user",
        "content": [
            {"type": "text", "text": prompt},
            {"type": "image_url", "image_url": {"url": image_url}},
        ],
    }
]

response = client.chat.completions.create(
    model="gemini-2.5-flash-image",
    messages=messages,
    modalities=["image", "text"],
)
```

For a comprehensive guide on using Gemini Nano Banana series models, see our [Image Generation with Gemini (Nano Banana Series)](en/examples/advanced_gemini_image_generation.md) tutorial. For details on using provider-specific parameters, see the [Provider-Specific Parameters Guide](en/guides/provider-specific-params.md).
### Gemini Robotics-ER 1.5 Preview

Gemini Robotics-ER 1.5 Preview (`gemini-robotics-er-1.5-preview`) is Google's first vision-language model designed specifically for robotics applications, bringing advanced spatial reasoning and agentic capabilities to physical robotic systems.

| Feature | Details |
| ----------------------- | ------------------------------------------------------------------------------------ |
| Context window | Similar to Gemini 2.5 Flash |
| Max output tokens | 8,192 tokens |
| Inputs | Images, videos, audio, and text |
| Output | Text with structured coordinates (2D points, bounding boxes, trajectories) |
| Input pricing | $0.30 / 1M tokens (text/image/video), $1.00 / 1M tokens (audio) |
| Cached input pricing | $0.15 / 1M tokens (text/image/video), $0.25 / 1M tokens (audio) |
| Output pricing | $2.50 / 1M tokens |
| Strengths | Spatial reasoning, object detection, trajectory planning, task orchestration |
| Best for | Robotics applications, physical AI systems, object manipulation planning |
| Status | Preview |

**Key Features:**
- **Enhanced Autonomy**: Enables robots to reason, adapt, and respond to changes in open-ended environments
- **Natural Language Interaction**: Complex task assignments using conversational language
- **Task Orchestration**: Decomposes natural language commands into subtasks for long-horizon tasks
- **Versatile Capabilities**: Object detection, spatial reasoning, trajectory planning, dynamic scene interpretation
- **Thinking Budget**: Configurable reasoning budget for balancing latency versus accuracy
- **Dual SDK Support**: Available through both native Gemini v1beta API and OpenAI-compatible endpoints

**API Support:**
- **Full Support**: `v1beta/` (native Gemini endpoint) - Complete access to all robotics features
- **Partial Support**: `v1/chat/completions` (OpenAI-compatible) - Image input via content array (similar to other Gemini vision models)

#### Native Gemini API Usage (Recommended)

```python
from google import genai
from google.genai import types

# Initialize the GenAI client
client = genai.Client(
    api_key="your-avalai-api-key",
    http_options={"api_version": "v1beta", "url": "https://api.avalai.ir"},
)

MODEL_ID = "gemini-robotics-er-1.5-preview"

# Load your image
with open("robot-scene.jpg", "rb") as f:
    image_bytes = f.read()

# Find objects in the scene
prompt = """
Point to no more than 10 items in the image. The label returned
should be an identifying name for the object detected.
The answer should follow the json format: [{"point": [y, x], "label": <label>}, ...].
The points are in [y, x] format normalized to 0-1000.
"""

response = client.models.generate_content(
    model=MODEL_ID,
    contents=[
        types.Part.from_bytes(
            data=image_bytes,
            mime_type="image/jpeg",
        ),
        prompt,
    ],
    config=types.GenerateContentConfig(
        temperature=0.5, thinking_config=types.ThinkingConfig(thinking_budget=0)
    ),
)

print(response.text)
```

#### OpenAI-Compatible Usage

```python
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Using OpenAI SDK with image input
response = client.chat.completions.create(
    model="gemini-robotics-er-1.5-preview",
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Identify objects and return their 2D coordinates in JSON format",
                },
                {
                    "type": "image_url",
                    "image_url": {"url": "https://example.com/robot-scene.jpg"},
                },
            ],
        }
    ],
)

print(response.choices[0].message.content)
```

For a comprehensive guide on using Gemini Robotics-ER for AI in robotics applications, see our [AI in Robotics with Gemini Robotics-ER](en/examples/ai_robotics_with_gemini_er.md) tutorial and the [announcement](en/news/2025-10-28-gemini-robotics-er-model-added.md).


### Gemini 2.5 Flash TTS

Gemini 2.5 Flash TTS (`gemini-2.5-flash-tts`) is Google's fast and cost-efficient text-to-speech model, optimized for high-volume applications requiring natural-sounding speech generation.

| Feature | Details |
| ----------------------- | ------------------------------------------------------------------------------------ |
| Context window | 900 bytes per text field, 1800 bytes combined (text + prompt) |
| Audio output | 32 tokens per second of audio generated |
| Inputs | Text, styling prompts |
| Output | Audio (MP3, LINEAR16, OGG_OPUS, MULAW, ALAW) |
| Languages | 100+ languages including English, Spanish, French, Arabic, Persian, and more |
| Voices | 30+ natural-sounding voices |
| Input pricing | $0.50 / 1M tokens (characters) |
| Cached input pricing | $0.25 / 1M tokens |
| Audio output pricing | $10.00 / 1M tokens (32 tokens per second) |
| Text output pricing | $10.00 / 1M tokens |
| Strengths | Fast generation, cost-effective, multi-language support, natural voices |
| Best for | High-volume TTS, conversational AI, accessibility services, content narration |

#### Available Endpoints
- `v1/chat/completions` - For TTS in conversational contexts (OpenAI-compatible)
- `v1/audio/speech` - For direct TTS generation (OpenAI-compatible)
- `v1/text:synthesize` - Native Vertex AI format with full features

?> **Note:** `gemini-2.5-flash-tts` is a Vertex AI exclusive model and is not available through the Gemini API `v1beta` endpoint, but is accessible through multiple OpenAI-compatible endpoints for easy integration.

#### OpenAI-Compatible Usage

```python
# Using OpenAI SDK format - Audio Speech endpoint
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.audio.speech.create(
    model="gemini-2.5-flash-tts",
    voice="alloy",  # Maps to Gemini voice "Kore"
    input="Hello! Welcome to our platform.",
)

response.stream_to_file("speech.mp3")
```

#### Native Vertex AI Usage

```python
# Using native Vertex AI format with Google Cloud SDK
from google.cloud import texttospeech
import os

client = texttospeech.TextToSpeechClient(
    transport="rest",
    client_options={
        "api_endpoint": "https://api.avalai.ir",
        "api_key": os.getenv("AVALAI_API_KEY"),
    },
)

synthesis_input = texttospeech.SynthesisInput(text="Hello! Welcome to our platform.")

voice = texttospeech.VoiceSelectionParams(
    language_code="en-US", name="Kore", model_name="gemini-2.5-flash-tts"
)

audio_config = texttospeech.AudioConfig(audio_encoding=texttospeech.AudioEncoding.MP3)

response = client.synthesize_speech(
    input=synthesis_input, voice=voice, audio_config=audio_config
)

with open("output.mp3", "wb") as out:
    out.write(response.audio_content)
```

### Gemini 2.5 Pro TTS

Gemini 2.5 Pro TTS (`gemini-2.5-pro-tts`) is Google's premium quality text-to-speech model with advanced controllability for complex styling requirements and multi-speaker scenarios.

| Feature | Details |
| ----------------------- | ------------------------------------------------------------------------------------ |
| Context window | 900 bytes per text field, 1800 bytes combined (text + prompt) |
| Audio output | 32 tokens per second of audio generated |
| Inputs | Text, styling prompts, multi-speaker configurations |
| Output | Audio (MP3, LINEAR16, OGG_OPUS, MULAW, ALAW) |
| Languages | 100+ languages including English, Spanish, French, Arabic, Persian, and more |
| Voices | 30+ natural-sounding voices with advanced prosody control |
| Input pricing | $1.00 / 1M tokens (characters) |
| Cached input pricing | $0.50 / 1M tokens |
| Output pricing | $20.00 / 1M tokens (32 tokens per second) |
| Strengths | Premium quality, advanced controllability, multi-speaker support, complex prompts |
| Best for | Audiobooks, premium content, multi-speaker conversations, complex styling needs |

#### Available Endpoints
- `v1/chat/completions` - For TTS in conversational contexts (OpenAI-compatible)
- `v1/audio/speech` - For direct TTS generation (OpenAI-compatible)
- `v1/text:synthesize` - Native Vertex AI format with full features

?> **Note:** `gemini-2.5-pro-tts` is a Vertex AI exclusive model and is not available through the Gemini API `v1beta` endpoint, but is accessible through multiple OpenAI-compatible endpoints for easy integration.

#### Advanced Styling with Prompts

```python
# Using native format with styling prompts
from google.cloud import texttospeech
import os

client = texttospeech.TextToSpeechClient(
    transport="rest",
    client_options={
        "api_endpoint": "https://api.avalai.ir",
        "api_key": os.getenv("AVALAI_API_KEY"),
    },
)

synthesis_input = texttospeech.SynthesisInput(
    text="Welcome to the future of artificial intelligence!",
    prompt="Say the following in an excited and energetic way",
)

voice = texttospeech.VoiceSelectionParams(
    language_code="en-US",
    name="Puck",  # Bright, energetic voice
    model_name="gemini-2.5-pro-tts",
)

audio_config = texttospeech.AudioConfig(audio_encoding=texttospeech.AudioEncoding.MP3)

response = client.synthesize_speech(
    input=synthesis_input, voice=voice, audio_config=audio_config
)

with open("output.mp3", "wb") as out:
    out.write(response.audio_content)
```

#### Multi-Speaker Conversations

```python
# Generate multi-speaker conversations
synthesis_input = texttospeech.SynthesisInput(
    text="Sam: Hello! Bob: Hi there, how are you? Sam: I'm great, thanks!"
)

voice = texttospeech.VoiceSelectionParams(
    language_code="en-US",
    model_name="gemini-2.5-pro-tts",
    multi_speaker_voice_config=texttospeech.MultiSpeakerVoiceConfig(
        speaker_voice_configs=[
            texttospeech.MultispeakerPrebuiltVoice(
                speaker_alias="Sam", speaker_id="Kore"  # must be English
            ),
            texttospeech.MultispeakerPrebuiltVoice(
                speaker_alias="Bob", speaker_id="Charon"  # must be English
            ),
        ]
    ),
)

audio_config = texttospeech.AudioConfig(
    audio_encoding=texttospeech.AudioEncoding.LINEAR16, sample_rate_hertz=24000
)

response = client.synthesize_speech(
    input=synthesis_input, voice=voice, audio_config=audio_config
)

with open("conversation.wav", "wb") as out:
    out.write(response.audio_content)
```

For comprehensive examples and advanced usage patterns, see our [News: Advanced TTS and Transcription Models Added](en/news/2025-10-20-advanced-tts-and-transcription-models-added.md) announcement and the [Vertex AI Text:Synthesize API Reference](en/api-reference/v1-text-synthesize.md).

_Note: Pricing for inputs >200k tokens increases. Audio/Video/Image pricing applies separately._

```python
response = client.chat.completions.create(
    model="gemini-2.5-pro",  # Or specific snapshot
    messages=[
        {"role": "system", "content": "You are an expert multimodal analyst."},
        {
            "role": "user",
            "content": "Analyze the sentiment expressed in this audio file and summarize the key points.",
        },
        # Include audio data appropriately
    ],
)
```

## Google Imagen 4.0 Models

Google's latest Imagen 4.0 models offer state-of-the-art image generation with enhanced quality, speed, and realism.

### imagen-4.0-ultra-generate-001

Ultra-high quality image generation with exceptional detail and realism.

| Feature | Details |
|-------------------|-----------------------------------------------------------------------|
| Quality | Ultra-high quality with exceptional detail |
| Pricing | $0.06 per image |
| Strengths | Exceptional detail, photorealistic output, advanced prompt understanding |
| Best for | Professional applications requiring highest quality images |
| Supported resolutions | Up to 2816x1536, multiple aspect ratios |

```python
response = client.images.generate(
    model="imagen-4.0-ultra-generate-001",
    prompt="Generate a photorealistic portrait of a person in natural lighting with exceptional detail",
    size="1024x1024",
    n=1,
    response_format="url",
)
```

### imagen-4.0-generate-001

High-quality image generation for professional applications.

| Feature | Details |
|-------------------|-----------------------------------------------------------------------|
| Quality | High-quality professional image generation |
| Pricing | $0.04 per image |
| Strengths | Professional quality, reliable output, strong prompt adherence |
| Best for | Professional content creation, marketing materials, artistic projects |
| Supported resolutions | Up to 2048x2048, multiple aspect ratios |

```python
response = client.images.generate(
    model="imagen-4.0-generate-001",
    prompt="Create a beautiful landscape with mountains and a lake at sunset",
    size="1024x1024",
    n=1,
    response_format="url",
)
```

### imagen-4.0-fast-generate-001

Fast image generation optimized for speed while maintaining quality.

| Feature | Details |
|-------------------|-----------------------------------------------------------------------|
| Quality | High quality with speed optimization |
| Pricing | $0.02 per image |
| Strengths | Fast generation, good quality, efficient processing |
| Best for | Applications requiring quick turnaround, batch processing, rapid prototyping |
| Supported resolutions | Standard resolutions up to 1408x768 |

```python
response = client.images.generate(
    model="imagen-4.0-fast-generate-001",
    prompt="Generate a simple logo design for a tech startup",
    size="1024x1024",
    n=1,
    response_format="url",
)
```

## Key Capabilities

### Advanced Multimodal Understanding

Gemini 3.1, 3.0, and 2.5 models support various combinations of text, image, audio, video, and PDF inputs, allowing for deep analysis and reasoning across modalities.

#### Image Understanding Capabilities

Gemini models offer advanced image understanding features:

1. **Object Detection with Bounding Boxes**: Models can identify objects in images and provide their bounding box coordinates in the format [ymin, xmin, ymax, xmax], normalized to 0-1000.

2. **Image Segmentation** (Gemini 2.5 models): Beyond detection, these models can segment objects and provide masks of their contours as base64-encoded PNGs.

3. **Multi-Image Analysis**: Models can process and compare multiple images in a single prompt.

```python
# Example: Image analysis with object detection
response = client.chat.completions.create(
    model="gemini-2.5-pro",
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Detect all prominent objects in this image and provide bounding boxes in [ymin, xmin, ymax, xmax] format normalized to 0-1000.",
                },
                {
                    "type": "image_url",
                    "image_url": {
                        "url": "data:image/jpeg;base64,..."
                    },  # You may need to use base64 for some models such as Gemini models
                },
            ],
        }
    ],
)
```

> **Important Note**: When using Gemini models through AvalAI, images must be provided as base64-encoded data URLs, not as external URLs. This is a limitation specific to Gemini models.

```python
# Example: Analyzing video and text
response = client.chat.completions.create(
    model="gemini-2.5-pro",
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Describe the main actions happening in this video clip.",
                },
                {
                    "type": "video_url",
                    "video_url": {"url": "https://example.com/video.mp4"},
                },  # Provide video data correctly
            ],
        }
    ],
)
```

### Long Context Window

Gemini 3.1, 3, and 2.5 models feature context windows of 1 million tokens or more, enabling analysis and reasoning over vast amounts of information like entire codebases, books, or hours of video/audio.

### Function Calling & Tool Use

All modern Gemini models support a variety of tools for enhancing their capabilities, including function calling, code execution, Google Search, and URL context processing.

#### Function Calling

Function calling allows Gemini models to interact with external systems or generate structured data based on defined schemas.

```python
# Example: Function calling
response = client.chat.completions.create(
    model="gemini-2.5-pro",
    messages=[{"role": "user", "content": "What's the weather like in Boston?"}],
    tools=[
        {
            "functionDeclarations": [
                {
                    "name": "getWeather",
                    "description": "Gets the weather for a requested city",
                    "parameters": {
                        "type": "object",
                        "properties": {"city": {"type": "string"}},
                    },
                },
            ]
        },
    ],
)
```

#### Code Execution

The code execution tool allows Gemini to generate and run Python code to solve complex tasks. When this tool is enabled, no other tools can be used simultaneously.

```python
# Example: Code execution
response = client.chat.completions.create(
    model="gemini-2.5-pro",
    messages=[{"role": "user", "content": "Calculate the first 10 Fibonacci numbers"}],
    tools=[
        {"codeExecution": {}},
    ],
)
```

The code execution environment includes numerous libraries such as matplotlib, numpy, pandas, scikit-learn, scipy, tensorflow, and more. The maximum runtime is 30 seconds per execution, and the environment may retry code generation up to 5 times if errors occur.

For I/O operations, code execution supports file input (text and CSV files) and graph output (via matplotlib). The maximum file input size is limited by the model's token window (roughly 2MB for text files).

**Pricing**: There's no additional charge for enabling code execution beyond the standard token rates. Tokens representing generated code, code execution results, and the final summary are all counted as output tokens.

#### Google Search

Gemini models can use Google Search when needed to retrieve up-to-date information. The model can decide when to use search based on the query needs. When enabled, responses include grounding sources (in-line supporting links) and search suggestions.

```python
# Example: Google Search
response = client.chat.completions.create(
    model="gemini-2.5-pro",
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

You can customize the search behavior by configuring the search context size:

```python
# Example: Google Search with high detail level
response = client.chat.completions.create(
    model="gemini-2.5-flash",
    messages=[
        {
            "role": "user",
            "content": "What are the latest developments in quantum computing?",
        }
    ],
    tools=[
        {"googleSearch": {"detail_level": "high"}},
    ],
)
```

The search context size options are:
- **low**: Less comprehensive but faster and cheaper
- **medium**: Default setting, balanced approach
- **high**: More comprehensive results but higher cost

**Pricing**: Web search pricing depends on both the model used and the search context size, with costs ranging from $25.00 to $50.00 per 1k calls depending on the model and detail level.

**Note**: For Gemini 2.5 models and later, use Search as a tool as shown above.

##### Native Gemini API (v1beta) for Google Search

You can also use Google's native v1beta API for more advanced grounding features, including access to detailed grounding metadata with citations and source information.

```bash
# Using native Gemini v1beta API with cURL
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

```python
# Using Google GenAI SDK
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

The native API returns detailed `groundingMetadata` including:
- `webSearchQueries`: Array of search queries used
- `groundingChunks`: Array of web sources (uri and title)
- `groundingSupports`: Links response text segments to sources for inline citations

For detailed documentation on the native API, see the [v1beta API Reference](en/api-reference/v1beta.md#grounding-with-google-search).

#### URL Context

This experimental feature allows Gemini models to retrieve and analyze content from URLs provided in prompts. The model can extract key information from web pages and use it to inform responses. This feature is only available on supported models:

- gemini-3.5-flash
- gemini-3.1-pro-preview
- gemini-3.1-flash-lite
- gemini-3.1-flash-lite-preview
- gemini-3-flash-preview
- gemini-2.5-pro
- gemini-2.5-flash

```python
# Example: URL Context (can be combined with Google Search)
response = client.chat.completions.create(
    model="gemini-2.5-pro",
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

URL Context is particularly useful for tasks like:
- Extracting key points from articles
- Comparing information across multiple links
- Synthesizing data from several sources
- Answering questions based on specific web content

**Limitations**:
- The tool will consume up to 20 URLs per request
- Works best with standard web pages rather than multimedia content
- URL retrieval results in increased token consumption

You can use URL Context alone or in combination with Google Search to enable the model to both discover relevant information and analyze it in depth.

For more information, see the [official documentation on URL context](https://ai.google.dev/gemini-api/docs/url-context).

> **Note**: Tool compatibility restrictions:
>
> - When code execution is enabled, no other tools can be used
> - Function declarations can only be used alone
> - Google Search can only be combined with URL Context

### Structured Output (JSON Mode)

Gemini models can be instructed to generate outputs in specific formats like JSON, useful for API integrations and structured data extraction.

```python
response = client.chat.completions.create(
    model="gemini-2.5-pro",
    messages=[
        {"role": "system", "content": "Output JSON only."},
        {"role": "user", "content": "List the top 3 programming languages."},
    ],
    response_format={"type": "json_object"},
)
```

## Model Selection Guidelines

### Choosing the Right Gemini Model

When selecting a Gemini model through AvalAI, consider:

1.  **Task complexity & Reasoning Needs**: Gemini 3.5 Flash is the flagship Flash choice for strong reasoning, coding, and agentic workflows. Gemini 3.1 Pro offers advanced Pro-class reasoning. Gemini 3.1 Flash-Lite is best when cost and latency matter most.
2.  **Context Length**: Gemini 3.5, 3.1, 3, and 2.5 models support at least 1M tokens.
3.  **Multimodal Requirements**: Do you need audio/video input? Image output (Gemini image models)?
4.  **Speed vs. Cost**: Flash and Flash-Lite models are significantly faster and cheaper, suitable for real-time or high-volume applications. Pro models offer higher quality at a higher cost/latency.
5.  **Output Size**: Gemini 3.5 Flash and 3.1 Pro allow up to 65k output tokens.

### Performance Comparison

| Task                              | Recommended Gemini Model      | Alternative Models             |
| --------------------------------- | ----------------------------- | ------------------------------ |
| Complex reasoning / Research      | Gemini 3.1 Pro Preview        | Gemini 3.5 Flash, Claude Opus 4.7, GPT-5.5 |
| Agentic coding / Tool use         | Gemini 3.5 Flash              | Gemini 3.1 Pro Preview, GPT-5.5 |
| High-quality chat / Content Gen   | Gemini 3.5 Flash              | Claude 4.6/4.5 Sonnet, GPT-5.4 |
| Long document analysis            | Gemini 3.5 Flash / 3.1 Pro    | Claude 4.x series (200k context) |
| Multimodal Analysis (Video/Audio) | Gemini 3.5 Flash              | Gemini 3.1 Pro Preview, GPT-5.2-chat |
| Real-time / High Volume           | Gemini 3.1 Flash-Lite         | Gemini 3 Flash, Claude Haiku 4.5 |

## Best Practices for Gemini Models

### Effective Prompting

Provide clear, specific instructions. Detail the desired format, persona, constraints, and context.

### System Instructions

Use the `system` role effectively to guide the model's behavior, persona, and response style consistently.

### Multimodal Prompting

When using multimodal inputs (images, audio, video), ensure they are clearly referenced or interleaved with text instructions explaining what the model should do with them.

### Temperature and Top_P

Adjust `temperature` and `top_p` to control randomness. Lower values (e.g., temp=0.2) produce more deterministic, focused outputs. Higher values (e.g., temp=0.8) encourage creativity and diversity.

## Using Gemini Models via AvalAI

All Gemini models are accessible through the standard AvalAI API endpoints, using the OpenAI-compatible client libraries:

```python
from openai import OpenAI

client = OpenAI(
    api_key="your-avalai-api-key",  # Replace with your actual API key
    base_url="https://api.avalai.ir/v1",  # AvalAI API endpoint
)

# Use any Gemini model by its AvalAI identifier
response = client.chat.completions.create(
    model="gemini-2.5-pro", messages=[{"role": "user", "content": "Hello!"}]
)
```

## Native Google GenAI SDK Support

AvalAI now supports native access to Gemini models using Google's official GenAI SDK, providing a third SDK option alongside OpenAI-compatible and Anthropic native approaches.

### Using Google's Native SDK

#### Basic Text Generation

```language-selector
bash=:curl -X POST 'https://api.avalai.ir/v1beta/models/gemini-2.5-flash:generateContent' \
  -H 'Content-Type: application/json' \
  -H 'x-goog-api-key: $AVALAI_API_KEY' \
  -d '{
    "contents": [
        {
            "parts": [{"text": "How does AI work?"}],
            "role": "user"
        }
    ],
    "generationConfig": {
        "maxOutputTokens": 500
    },
    "model": "gemini-2.5-flash"
  }'

python=:from google import genai

client = genai.Client(
    api_key="your-avalai-api-key",
    http_options={"api_version": "v1beta", "base_url": "https://api.avalai.ir"},
)

response = client.models.generate_content(
    model="gemini-2.5-flash", contents="How does AI work?"
)
print(response.text)

javascript=:import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.AVALAI_API_KEY,
    httpOptions: {"apiVersion": "v1beta", "baseUrl": "https://api.avalai.ir"}}
});

async function main() {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ parts: [{ text: "How does AI work?" }] }]
    });
    console.log(response.text);
}

await main();

go=:package main

import (
	"context"
	"fmt"
	"google.golang.org/genai"
)

func main() {
	ctx := context.Background()
	client, err := genai.NewClient(ctx, &genai.ClientConfig{
		APIKey:  "your-avalai-api-key",
		BaseURL: "https://api.avalai.ir",
	})
	if err != nil {
		log.Fatal(err)
	}

	result, _ := client.Models.GenerateContent(
		ctx,
		"gemini-2.5-flash",
		genai.Text("How does AI work?"),
		nil,
	)

	fmt.Println(result.Text())
}

```
#### System Instructions

```language-selector
bash=:curl -X POST 'https://api.avalai.ir/v1beta/models/gemini-2.5-flash:generateContent' \
  -H 'Content-Type: application/json' \
  -H 'x-goog-api-key: $AVALAI_API_KEY' \
  -d '{
    "system_instruction": {
        "parts": [
            {
                "text": "You are a cat. Your name is Neko."
            }
        ]
    },
    "contents": [
        {
            "parts": [{"text": "Hello there"}],
            "role": "user"
        }
    ],
    "generationConfig": {
        "maxOutputTokens": 200
    },
    "model": "gemini-2.5-flash"
  }'

python=:from google import genai
from google.genai import types

client = genai.Client(
    api_key="your-avalai-api-key", http_options={"base_url": "https://api.avalai.ir"}
)

response = client.models.generate_content(
    model="gemini-2.5-flash",
    config=types.GenerateContentConfig(
        system_instruction="You are a cat. Your name is Neko."
    ),
    contents="Hello there",
)

print(response.text)

javascript=:import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: "your-avalai-api-key",
    httpOptions: {"apiVersion": "v1beta", "baseUrl": "https://api.avalai.ir"}}
});

async function main() {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "Hello there",
        config: {
            systemInstruction: "You are a cat. Your name is Neko.",
        },
    });
    console.log(response.text);
}

await main();

go=:package main

import (
	"context"
	"fmt"
	"google.golang.org/genai"
)

func main() {
	ctx := context.Background()
	client, err := genai.NewClient(ctx, &genai.ClientConfig{
		APIKey:  "your-avalai-api-key",
		BaseURL: "https://api.avalai.ir",
	})
	if err != nil {
		log.Fatal(err)
	}

	config := &genai.GenerateContentConfig{
		SystemInstruction: genai.NewContentFromText("You are a cat. Your name is Neko.", genai.RoleUser),
	}

	result, _ := client.Models.GenerateContent(
		ctx,
		"gemini-2.5-flash",
		genai.Text("Hello there"),
		config,
	)

	fmt.Println(result.Text())
}

```

#### Thinking Configuration (Gemini 2.5 Models)

```language-selector
bash=:curl -X POST 'https://api.avalai.ir/v1beta/models/gemini-2.5-flash:generateContent' \
  -H 'Content-Type: application/json' \
  -H 'x-goog-api-key: $AVALAI_API_KEY' \
  -d '{
    "contents": [
        {
            "parts": [{"text": "How does AI work?"}],
            "role": "user"
        }
    ],
    "generationConfig": {
        "thinkingConfig": {
            "thinkingBudget": 0
        },
        "maxOutputTokens": 500,
        "temperature": 0.7
    },
    "model": "gemini-2.5-flash"
  }'

python=:from google import genai
from google.genai import types

client = genai.Client(
    api_key="your-avalai-api-key", http_options={"base_url": "https://api.avalai.ir"}
)

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="How does AI work?",
    config=types.GenerateContentConfig(
        thinking_config=types.ThinkingConfig(thinking_budget=0)  # Disables thinking
    ),
)
print(response.text)

javascript=:import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: "your-avalai-api-key",
    httpOptions: {"apiVersion": "v1beta", "baseUrl": "https://api.avalai.ir"}}
});

async function main() {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "How does AI work?",
        config: {
            thinkingConfig: {
                thinkingBudget: 0, // Disables thinking
            },
        }
    });
    console.log(response.text);
}

await main();

go=:package main

import (
    "context"
    "fmt"
    "google.golang.org/genai"
)

func main() {
    ctx := context.Background()
    client, err := genai.NewClient(ctx, &genai.ClientConfig{
        APIKey: "your-avalai-api-key",
        BaseURL: "https://api.avalai.ir",
    })
    if err != nil {
        log.Fatal(err)
    }

    result, _ := client.Models.GenerateContent(
        ctx,
        "gemini-2.5-flash",
        genai.Text("How does AI work?"),
        &genai.GenerateContentConfig{
            ThinkingConfig: &genai.ThinkingConfig{
                ThinkingBudget: int32(0), // Disables thinking
            },
        }
    )

    fmt.Println(result.Text())
}

```

#### Streaming Responses

```language-selector
bash=:curl -X POST 'https://api.avalai.ir/v1beta/models/gemini-2.5-flash:streamGenerateContent' \
  -H 'Content-Type: application/json' \
  -H 'x-goog-api-key: $AVALAI_API_KEY' \
  -d '{
    "contents": [
        {
            "parts": [{"text": "Explain how AI works"}],
            "role": "user"
        }
    ],
    "generationConfig": {
        "maxOutputTokens": 1000
    },
    "model": "gemini-2.5-flash"
  }' --no-buffer

python=:from google import genai

client = genai.Client(
    api_key="your-avalai-api-key", http_options={"base_url": "https://api.avalai.ir"}
)

response = client.models.generate_content_stream(
    model="gemini-2.5-flash", contents=["Explain how AI works"]
)
for chunk in response:
    print(chunk.text, end="")

javascript=:import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: "your-avalai-api-key",
    httpOptions: {"apiVersion": "v1beta", "baseUrl": "https://api.avalai.ir"}}
});

async function main() {
    const response = await ai.models.generateContentStream({
        model: "gemini-2.5-flash",
        contents: "Explain how AI works",
    });

    for await (const chunk of response) {
        console.log(chunk.text);
    }
}

await main();

go=:package main

import (
	"context"
	"fmt"
	"google.golang.org/genai"
)

func main() {
	ctx := context.Background()
	client, err := genai.NewClient(ctx, &genai.ClientConfig{
		APIKey:  "your-avalai-api-key",
		BaseURL: "https://api.avalai.ir",
	})
	if err != nil {
		log.Fatal(err)
	}

	stream := client.Models.GenerateContentStream(
		ctx,
		"gemini-2.5-flash",
		genai.Text("Write a story about a magic backpack."),
		nil,
	)

	for chunk, _ := range stream {
		part := chunk.Candidates[0].Content.Parts[0]
		fmt.Print(part.Text)
	}
}

```
#### Multi-turn Conversations (Chat)

```language-selector
bash=:# First message
curl -X POST 'https://api.avalai.ir/v1beta/models/gemini-2.5-flash:generateContent' \
  -H 'Content-Type: application/json' \
  -H 'x-goog-api-key: $AVALAI_API_KEY' \
  -d '{
    "contents": [
        {
            "parts": [{"text": "I have 2 dogs in my house."}],
            "role": "user"
        }
    ],
    "generationConfig": {
        "maxOutputTokens": 300
    },
    "model": "gemini-2.5-flash"
  }'

# Follow-up message with conversation history
curl -X POST 'https://api.avalai.ir/v1beta/models/gemini-2.5-flash:generateContent' \
  -H 'Content-Type: application/json' \
  -H 'x-goog-api-key: $AVALAI_API_KEY' \
  -d '{
    "contents": [
        {
            "parts": [{"text": "I have 2 dogs in my house."}],
            "role": "user"
        },
        {
            "parts": [{"text": "That sounds wonderful! Dogs make great companions."}],
            "role": "model"
        },
        {
            "parts": [{"text": "How many paws are in my house?"}],
            "role": "user"
        }
    ],
    "generationConfig": {
        "maxOutputTokens": 200
    },
    "model": "gemini-2.5-flash"
  }'

python=:from google import genai

client = genai.Client(
    api_key="your-avalai-api-key", http_options={"base_url": "https://api.avalai.ir"}
)
chat = client.chats.create(model="gemini-2.5-flash")

response = chat.send_message("I have 2 dogs in my house.")
print(response.text)

response = chat.send_message("How many paws are in my house?")
print(response.text)

for message in chat.get_history():
    print(f"role - {message.role}", end=": ")
    print(message.parts[0].text)

javascript=:import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: "your-avalai-api-key",
    httpOptions: {"apiVersion": "v1beta", "baseUrl": "https://api.avalai.ir"}}
});

async function main() {
    const chat = ai.chats.create({
        model: "gemini-2.5-flash",
        history: [
            {
                role: "user",
                parts: [{ text: "Hello" }],
            },
            {
                role: "model",
                parts: [{ text: "Great to meet you. What would you like to know?" }],
            },
        ],
    });

    const response1 = await chat.sendMessage({
        message: "I have 2 dogs in my house.",
    });
    console.log("Chat response 1:", response1.text);

    const response2 = await chat.sendMessage({
        message: "How many paws are in my house?",
    });
    console.log("Chat response 2:", response2.text);
}

await main();

go=:package main

import (
	"context"
	"fmt"
	"google.golang.org/genai"
)

func main() {
	ctx := context.Background()
	client, err := genai.NewClient(ctx, &genai.ClientConfig{
		APIKey:  "your-avalai-api-key",
		BaseURL: "https://api.avalai.ir",
	})
	if err != nil {
		log.Fatal(err)
	}

	history := []*genai.Content{
		genai.NewContentFromText("Hi nice to meet you! I have 2 dogs in my house.", genai.RoleUser),
		genai.NewContentFromText("Great to meet you. What would you like to know?", genai.RoleModel),
	}

	chat, _ := client.Chats.Create(ctx, "gemini-2.5-flash", nil, history)
	res, _ := chat.SendMessage(ctx, genai.Part{Text: "How many paws are in my house?"})

	if len(res.Candidates) > 0 {
		fmt.Println(res.Candidates[0].Content.Parts[0].Text)
	}
}

```

### Direct API Access

You can also use the native endpoints directly:

```bash
# Basic text generation
curl -X POST 'https://api.avalai.ir/v1beta/models/gemini-2.5-flash:generateContent' \
  -H 'Content-Type: application/json' \
  -H 'x-goog-api-key: $AVALAI_API_KEY' \
  -d '{
    "contents": [
        {
            "parts": [{"text": "Write a haiku about AI"}],
            "role": "user"
        }
    ],
    "generationConfig": {
        "maxOutputTokens": 100
    },
    "model": "gemini-2.5-flash"
  }'

# Using system instructions for custom behavior
curl -X POST 'https://api.avalai.ir/v1beta/models/gemini-2.5-flash:generateContent' \
  -H 'Content-Type: application/json' \
  -H 'x-goog-api-key: $AVALAI_API_KEY' \
  -d '{
    "system_instruction": {
        "parts": [
            {
                "text": "You are a creative poetry assistant. Write in a whimsical style."
            }
        ]
    },
    "contents": [
        {
            "parts": [{"text": "Write a haiku about AI"}],
            "role": "user"
        }
    ],
    "generationConfig": {
        "thinkingConfig": {
            "thinkingBudget": 0
        },
        "maxOutputTokens": 100,
        "temperature": 0.8
    },
    "model": "gemini-2.5-flash"
  }'
```

> **Important**: The v1beta API is compatible with the [official Gemini API documentation](https://ai.google.dev/gemini-api/docs/text-generation). Use `system_instruction` for custom behavior, not role-based instructions. For discrepancies, contact [t.me/AvalAISupport](https://t.me/AvalAISupport).

### Safety Settings

The Gemini API provides adjustable safety settings that you can configure to determine if your application requires a more or less restrictive safety configuration. You can adjust these settings across four filter categories to restrict or allow certain types of content.

#### Harm Categories

| Category | Description |
|----------|-------------|
| `HARM_CATEGORY_HARASSMENT` | Negative or harmful comments targeting identity and/or protected attributes |
| `HARM_CATEGORY_HATE_SPEECH` | Content that is rude, disrespectful, or profane |
| `HARM_CATEGORY_SEXUALLY_EXPLICIT` | Contains references to sexual acts or other lewd content |
| `HARM_CATEGORY_DANGEROUS_CONTENT` | Promotes, facilitates, or encourages harmful acts |

#### Block Thresholds

You can configure the system to block content based on its probability of being unsafe:

| Threshold | Description |
|-----------|-------------|
| `OFF` | Turn off the safety filter |
| `BLOCK_NONE` | Always show regardless of probability of unsafe content |
| `BLOCK_ONLY_HIGH` | Block when high probability of unsafe content |
| `BLOCK_MEDIUM_AND_ABOVE` | Block when medium or high probability of unsafe content |
| `BLOCK_LOW_AND_ABOVE` | Block when low, medium or high probability of unsafe content |
| `HARM_BLOCK_THRESHOLD_UNSPECIFIED` | Threshold is unspecified, block using default threshold |

> **Note**: If the threshold is not set, the default block threshold is `OFF` for Gemini 2.5 and 3 models.

#### Using Safety Settings with Native API

```language-selector
bash=:curl -X POST 'https://api.avalai.ir/v1beta/models/gemini-2.5-flash:generateContent' \
  -H 'Content-Type: application/json' \
  -H 'x-goog-api-key: $AVALAI_API_KEY' \
  -d '{
    "contents": [
        {
            "parts": [{"text": "Your prompt here"}],
            "role": "user"
        }
    ],
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
            "threshold": "BLOCK_ONLY_HIGH"
        },
        {
            "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
            "threshold": "BLOCK_MEDIUM_AND_ABOVE"
        }
    ],
    "generationConfig": {
        "maxOutputTokens": 500
    },
    "model": "gemini-2.5-flash"
  }'

python=:from google import genai
from google.genai import types

client = genai.Client(
    api_key="your-avalai-api-key",
    http_options={"api_version": "v1beta", "base_url": "https://api.avalai.ir"},
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
        threshold="BLOCK_ONLY_HIGH",
    ),
    types.SafetySetting(
        category="HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold="BLOCK_MEDIUM_AND_ABOVE",
    ),
]

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="Your prompt here",
    config=types.GenerateContentConfig(safety_settings=safety_settings),
)

print(response.text)

javascript=:import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: "your-avalai-api-key",
    httpOptions: {"apiVersion": "v1beta", "baseUrl": "https://api.avalai.ir"}}
});

async function main() {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "Your prompt here",
        config: {
            safetySettings: [
                {
                    category: "HARM_CATEGORY_HARASSMENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_HATE_SPEECH",
                    threshold: "BLOCK_LOW_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    threshold: "BLOCK_ONLY_HIGH"
                },
                {
                    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                }
            ]
        }
    });
    console.log(response.text);
}

await main();

go=:package main

import (
	"context"
	"fmt"
	"google.golang.org/genai"
)

func main() {
	ctx := context.Background()
	client, err := genai.NewClient(ctx, &genai.ClientConfig{
		APIKey:  "your-avalai-api-key",
		BaseURL: "https://api.avalai.ir",
	})
	if err != nil {
		log.Fatal(err)
	}

	result, _ := client.Models.GenerateContent(
		ctx,
		"gemini-2.5-flash",
		genai.Text("Your prompt here"),
		&genai.GenerateContentConfig{
			SafetySettings: []*genai.SafetySetting{
				{
					Category:  genai.HarmCategoryHarassment,
					Threshold: genai.HarmBlockThresholdBlockMediumAndAbove,
				},
				{
					Category:  genai.HarmCategoryHateSpeech,
					Threshold: genai.HarmBlockThresholdBlockLowAndAbove,
				},
				{
					Category:  genai.HarmCategorySexuallyExplicit,
					Threshold: genai.HarmBlockThresholdBlockOnlyHigh,
				},
				{
					Category:  genai.HarmCategoryDangerousContent,
					Threshold: genai.HarmBlockThresholdBlockMediumAndAbove,
				},
			},
		},
	)

	fmt.Println(result.Text())
}

```

#### Safety Feedback in Responses

When you make a request, the content is analyzed and assigned a safety rating. The response includes safety feedback:

- **Prompt feedback**: Included in `promptFeedback`. If `promptFeedback.blockReason` is set, the prompt content was blocked.
- **Response candidate feedback**: Included in `Candidate.finishReason` and `Candidate.safetyRatings`. If response content was blocked and the `finishReason` was `SAFETY`, you can inspect `safetyRatings` for more details.

```python
# Check safety ratings in response
response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="Your prompt here",
    config=types.GenerateContentConfig(safety_settings=safety_settings),
)

# Check if prompt was blocked
if response.prompt_feedback and response.prompt_feedback.block_reason:
    print(f"Prompt blocked: {response.prompt_feedback.block_reason}")

# Check candidate safety ratings
for candidate in response.candidates:
    if candidate.finish_reason == "SAFETY":
        print("Response blocked due to safety")
        for rating in candidate.safety_ratings:
            print(f"  {rating.category}: {rating.probability}")
```

> **Note**: Applications that use less restrictive safety settings may be subject to review. See the [Terms of Service](https://ai.google.dev/terms) for more information.

### Key Features of Native Support

- **Native API Schema**: Direct access using Google's `generateContent`, `streamGenerateContent`, `embedContent`, `batchEmbedContents`, and `countTokens` endpoints
- **Flexible Authentication**: Support for both `Authorization: Bearer` and `x-goog-api-key` headers
- **Full Streaming Support**: Native streaming with `agenerate_content_stream`
- **Multimodal Capabilities**: Native support for text, image, audio, and video inputs
- **Embedding Generation**: Native support for text embeddings with configurable task types and dimensions
- **Token Counting**: Built-in token counting for accurate usage tracking before API calls

### Important Limitations

- **Gemini Models Only**: Native support is exclusively for Gemini models
- **Base URL**: Use `https://api.avalai.ir` (without `/v1`) for the Google GenAI SDK
- **v1beta Endpoints**: Native endpoints use the `/v1beta/models/{model}:generateContent` format

For complete documentation on the native API, see the [v1beta API Reference](en/api-reference/v1beta.md).

## Differences from OpenAI/Anthropic Models

While AvalAI provides a unified API, subtle differences exist:

1.  **Multimodal Capabilities**: Gemini offers distinct audio/video processing capabilities compared to others.
2.  **Function Calling**: Implementation details and reliability might differ slightly.
3.  **Parameter Effects**: Parameters like `temperature` might behave differently across model families.
4.  **JSON Mode**: Gemini's native JSON mode might differ from OpenAI's `json_object` or Anthropic's XML structuring.

AvalAI strives to normalize these differences, but awareness can help optimize prompts.

## Model Versioning

Google regularly releases updated versions. AvalAI provides access using both general aliases and specific version snapshots:

- General aliases: `gemini-3.1-pro`, `gemini-3-flash`, `gemini-2.5-pro`, `gemini-2.5-pro`, etc.
- Specific snapshots: e.g., `gemini-3.1-pro-preview`, `gemini-3-flash-preview`, etc.

Using a specific snapshot ensures consistent behavior over time. Check the [Model Details](en/models/model-details.md) page for the latest available snapshots.

## Related Resources

- [Chat Completions API](en/api-reference/chat.md) - How to use chat models
- [Authentication](en/api-reference/authentication.md) - How to authenticate with the AvalAI API
- [Rate Limits](en/guides/rate-limits.md) - Information about API rate limits
- [Error Handling](en/guides/error-handling.md) - How to handle errors when using the API

## Gemma 4 Models

The Gemma 4 family is Google's most intelligent open models, built from Gemini 3 research and technology to maximize intelligence-per-parameter. These models deliver unprecedented efficiency with strong multimodal, multilingual, and agentic capabilities.

| Feature                 | Details                                                                         |
| ----------------------- | ------------------------------------------------------------------------------- |
| Context window          | Up to 128K tokens                                                               |
| Available sizes         | 26B A4B (MoE), 31B (Dense), E2B, E4B                                            |
| Multimodal capabilities | Image, audio, and text input                                                    |
| Language support        | Over 140 languages                                                              |
| Key features            | Thinking mode, function calling, agentic workflows, fine-tuning                 |
| Best for                | IDEs, coding assistants, agentic workflows, consumer GPU deployment             |

### gemma-4-26b-a4b-it

Google's open model with Mixture-of-Experts architecture (26B total, 4B active), delivering unprecedented intelligence-per-parameter efficiency.

| Feature | Details |
|---------|---------|
| Total Parameters | 26B (4B active) |
| Architecture | Mixture-of-Experts (MoE) |
| Context window | 128,000 tokens |
| Input pricing | $0.13 / 1M tokens |
| Cached input pricing | $0.013 / 1M tokens (90% cost reduction) |
| Output pricing | $0.40 / 1M tokens |
| Input modalities | Text, Image, Audio |
| Output modalities | Text |
| Supported endpoints | `v1/chat/completions`, `v1/responses` |

**Key Features:**
- **Frontier Intelligence**: Built from Gemini 3 research for maximum intelligence-per-parameter
- **MoE Architecture**: 26B total parameters with only 4B active for efficiency
- **Multimodal**: Strong audio and visual understanding
- **Agentic Workflows**: Native support for function calling and autonomous agents
- **140 Languages**: Multilingual support that goes beyond translation
- **Thinking Mode**: Extended reasoning for complex problems

**Benchmark Performance:**
- Arena AI (text): 1441
- MMMLU: 82.6%
- MMMU Pro: 73.8%
- AIME 2026: 88.3%
- LiveCodeBench v6: 77.1%
- GPQA Diamond: 82.3%

```python
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="gemma-4-26b-a4b-it",
    messages=[
        {
            "role": "user",
            "content": "Explain the advantages of MoE architecture in LLMs",
        },
    ],
    max_tokens=2048,
)

print(response.choices[0].message.content)
```

### gemma-4-31b-it

Google's dense variant of Gemma 4, offering maximum capability with full parameter utilization. Achieves top Arena AI ELO score (1452) for its size class.

| Feature | Details |
|---------|---------|
| Parameters | 31B |
| Architecture | Dense Transformer |
| Context window | 128,000 tokens |
| Input pricing | $0.14 / 1M tokens |
| Cached input pricing | $0.014 / 1M tokens (90% cost reduction) |
| Output pricing | $0.40 / 1M tokens |
| Input modalities | Text, Image, Audio |
| Output modalities | Text |
| Supported endpoints | `v1/chat/completions` |

**Key Features:**
- **Industry-Leading Efficiency**: Top Arena AI ELO score (1452) for its size class
- **Dense Architecture**: Full 31B parameters active for maximum capability
- **Multimodal Reasoning**: Strong audio and visual understanding
- **Agentic Workflows**: Native function calling and agent support
- **Fine-Tuning**: Improve performance for specific tasks using your preferred frameworks
- **Thinking Mode**: Extended reasoning capabilities

**Benchmark Performance:**
- Arena AI (text): 1452
- MMMLU: 85.2%
- MMMU Pro: 76.9%
- AIME 2026: 89.2%
- LiveCodeBench v6: 80.0%
- GPQA Diamond: 84.3%
- τ2-bench Retail: 86.4%

```python
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="gemma-4-31b-it",
    messages=[
        {
            "role": "user",
            "content": "Design a comprehensive solution for optimizing a distributed system",
        },
    ],
    max_tokens=4096,
)

print(response.choices[0].message.content)
```

---

## Gemma 3 Models

The Gemma 3 family represents Google's latest open-weight models designed for broad accessibility across different compute environments.

| Feature                 | Details                                                                         |
| ----------------------- | ------------------------------------------------------------------------------- |
| Context window          | Up to 128K tokens                                                               |
| Available sizes         | 1B (text-only), 4B, 12B, 27B, and specialized e4B variant                       |
| Multimodal capabilities | Image and text input (except 1B model which is text-only)                       |
| Language support        | Over 140 languages                                                              |
| Key features            | Function calling, wide language support, multimodal capabilities                |
| Best for                | Deployment in resource-constrained environments, fine-tuning for specific tasks |

### gemma-3-1b-it

A lightweight text-only instruction-tuned model, perfect for applications with limited computational resources.

```python
response = client.chat.completions.create(
    model="gemma-3-1b-it",
    messages=[
        {
            "role": "user",
            "content": "Explain how transformers work in machine learning",
        },
    ],
)
```

### gemma-3-4b-it

A balanced multimodal model supporting both text and image inputs with a 128K token context window.

```python
response = client.chat.completions.create(
    model="gemma-3-4b-it",
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "What's in this image?"},
                {
                    "type": "image_url",
                    "image_url": {
                        "url": "https://dashscope.oss-cn-beijing.aliyuncs.com/images/256_1.png"
                    },
                },
            ],
        },
    ],
)
```

### gemma-3-12b-it

A more powerful multimodal model with enhanced reasoning capabilities and support for over 140 languages.

### gemma-3-27b-it

The largest Gemma 3 model, offering superior performance for complex tasks with image and text inputs.

### gemma-3n-e4b-it

A specialized efficient 4B parameter model optimized for specific use cases.

## Gemini Embedding Models

### gemini-embedding-2

**First multimodal embedding model in the Gemini API** — maps text, images, video, audio, and PDFs into a unified embedding space, enabling cross-modal search, classification, and clustering across 100+ languages.

| Feature | Details |
|---------|---------|
| **Model ID** | `gemini-embedding-2` |
| **Aliases** | `gemini-embedding-2-preview` |
| **Max Input Tokens** | 8,192 tokens |
| **Output Dimensions** | Flexible 128–3072 (default 3072; recommended 768/1536/3072) |
| **Input Modalities** | Text, Image, Audio, Video, PDF |
| **Output Modalities** | Embeddings |
| **Supported Endpoints** | `v1/embeddings`, `v1beta/models/gemini-embedding-2:embedContent` (native Gemini) |
| **Text Input Pricing** | $0.20 / 1M tokens |
| **Cached Text Input** | $0.02 / 1M tokens (90% cost reduction) |
| **Image Input Pricing** | $0.45 / 1M tokens |
| **Audio Input Pricing** | $6.50 / 1M tokens |
| **Video Input Pricing** | $12.00 / 1M tokens |
| **Output Pricing** | $0.15 / 1M tokens |
| **Supported Modalities Limits** | 6 images (PNG/JPEG), 180s audio (MP3/WAV), 120s video (MP4/MOV, 32 frames), 6 PDF pages |

**Key Features:**
- **First Multimodal Embedding**: Unified embedding space across text, images, video, audio, and PDFs
- **Cross-Modal Search**: Compare and retrieve content across modalities in the same vector space
- **100+ Languages**: Broad multilingual support
- **Matryoshka Representation Learning (MRL)**: Flexible output dimensions without quality loss, with auto-renormalization for truncated dimensions
- **Embedding Aggregation**: Single aggregated embedding for multi-part inputs (e.g., text + image)
- **Task Instructions**: Specify tasks directly in prompts (e.g., `task: search result | query: ...`) for optimized performance
- **Dual API Support**: Available on both OpenAI-compatible `v1/embeddings` and native Gemini `v1beta/models/{model}:embedContent` endpoints

**Example (OpenAI-Compatible API):**

```language-selector
bash=:curl https://api.avalai.ir/v1/embeddings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gemini-embedding-2",
    "input": "task: search result | query: What is the meaning of life?",
    "dimensions": 768
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.embeddings.create(
    model="gemini-embedding-2",
    input="task: search result | query: What is the meaning of life?",
    dimensions=768,
)

print(f"Embedding length: {len(response.data[0].embedding)}")

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.embeddings.create({
  model: "gemini-embedding-2",
  input: "task: search result | query: What is the meaning of life?",
  dimensions: 768,
});

console.log(`Embedding length: ${response.data[0].embedding.length}`);

```

**Example (Native Gemini v1beta API — Multimodal Aggregation):**

```bash
curl "https://api.avalai.ir/v1beta/models/gemini-embedding-2:embedContent" \
  -H "Content-Type: application/json" \
  -H "x-goog-api-key: $AVALAI_API_KEY" \
  -d '{
    "content": {
      "parts": [
        {"text": "An image of a dog"},
        {
          "inline_data": {
            "mime_type": "image/png",
            "data": "iVBORw0KGgo...[TRUNCATED]"
          }
        }
      ]
    }
  }'
```

> **Note**: When multiple parts are provided in a single request, `gemini-embedding-2` returns a single aggregated embedding. Use multiple requests or the Batch API for separate embeddings per input.

---

Google's Gemini embedding models offer state-of-the-art text embeddings with advanced features like task-specific optimization and flexible dimensionality control.

### gemini-embedding-001

Gemini's flagship embedding model that generates high-quality vector representations optimized for various NLP tasks including semantic search, clustering, classification, and retrieval-augmented generation (RAG).

| Feature | Details |
|---------|---------|
| **Model ID** | `gemini-embedding-001` |
| **Max Input Tokens** | 2,048 tokens |
| **Output Dimensions** | Flexible: 128-3072 (Recommended: 768, 1536, 3072) |
| **Default Dimensions** | 3072 |
| **Input Pricing** | $0.15 / 1M tokens |
| **Output Pricing** | $0.075 / 1M tokens |
| **Supported Task Types** | SEMANTIC_SIMILARITY, CLASSIFICATION, CLUSTERING, RETRIEVAL_DOCUMENT, RETRIEVAL_QUERY, CODE_RETRIEVAL_QUERY, QUESTION_ANSWERING, FACT_VERIFICATION |
| **Best For** | Semantic search, RAG systems, document clustering, text classification |

#### Basic Usage (OpenAI Schema)

```language-selector
python=:from openai import OpenAI

client = OpenAI(
    api_key="your-avalai-api-key",  # Replace with your actual API key
    base_url="https://api.avalai.ir/v1",  # AvalAI API endpoint
)

# Basic embedding generation
response = client.embeddings.create(
    model="gemini-embedding-001",
    input="The quick brown fox jumps over the lazy dog",
)

embedding = response.data[0].embedding
print(f"Embedding dimensions: {len(embedding)}")
print(f"First few values: {embedding[:5]}")

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
    apiKey: process.env.AVALAI_API_KEY,
    baseURL: "https://api.avalai.ir/v1",
});

// Basic embedding generation
const response = await client.embeddings.create({
    model: "gemini-embedding-001",
    input: "The quick brown fox jumps over the lazy dog",
});

const embedding = response.data[0].embedding;
console.log(`Embedding dimensions: ${embedding.length}`);
console.log(`First few values: ${embedding.slice(0, 5)}`);

bash=:curl https://api.avalai.ir/v1/embeddings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gemini-embedding-001",
    "input": "The quick brown fox jumps over the lazy dog"
  }'

```

#### Advanced Features with Task Types

For optimal performance, specify the task type to help the model optimize embeddings for your specific use case:

```language-selector
python=:# Task-specific optimization with custom dimensions
response = client.embeddings.create(
    model="gemini-embedding-001",
    input=[
        "What is the meaning of life?",
        "What is the purpose of existence?",
        "How do I bake a cake?",
    ],
    extra_body={"task_type": "SEMANTIC_SIMILARITY", "output_dimensionality": 768},
)

# Calculate cosine similarity
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

embeddings = [item.embedding for item in response.data]
embeddings_matrix = np.array(embeddings)
similarity_matrix = cosine_similarity(embeddings_matrix)

print(f"Similarity between first two texts: {similarity_matrix[0, 1]:.4f}")

javascript=:// Task-specific optimization with custom dimensions
const response = await client.embeddings.create({
    model: "gemini-embedding-001",
    input: [
        "What is the meaning of life?",
        "What is the purpose of existence?",
        "How do I bake a cake?"
    ],
    // @ts-expect-error extra_body is a provider-specific parameter
    extra_body: {
        task_type: "SEMANTIC_SIMILARITY",
        output_dimensionality: 768
    }
});

const embeddings = response.data.map(item => item.embedding);
console.log(`Generated ${embeddings.length} embeddings with ${embeddings[0].length} dimensions`);

bash=:curl https://api.avalai.ir/v1/embeddings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gemini-embedding-001",
    "input": ["What is the meaning of life?", "What is the purpose of existence?"],
    "extra_body": {
      "task_type": "SEMANTIC_SIMILARITY",
      "output_dimensionality": 768
    }
  }'

```

#### Native Gemini API Usage

You can also use Gemini embeddings through the native Google GenAI SDK:

```language-selector
python=:from google import genai

client = genai.Client(
    api_key="your-avalai-api-key",
    http_options={"api_version": "v1beta", "base_url": "https://api.avalai.ir"},
)

# Basic embedding
result = client.models.embed_content(
    model="gemini-embedding-001", contents="What is the meaning of life?"
)

print(f"Embedding dimensions: {len(result.embeddings[0].values)}")

# Advanced usage with task type and custom dimensions
from google.genai import types

result = client.models.embed_content(
    model="gemini-embedding-001",
    contents=[
        "What is the meaning of life?",
        "What is the purpose of existence?",
        "How do I bake a cake?",
    ],
    config=types.EmbedContentConfig(
        task_type="SEMANTIC_SIMILARITY", output_dimensionality=768
    ),
)

for i, embedding in enumerate(result.embeddings):
    print(f"Embedding {i}: {len(embedding.values)} dimensions")

javascript=:import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.AVALAI_API_KEY,
    httpOptions: {"apiVersion": "v1beta", "baseUrl": "https://api.avalai.ir"}}
});

// Basic embedding
const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: "What is the meaning of life?"
});

console.log(`Embedding dimensions: ${response.embeddings[0].values.length}`);

// Advanced usage with task type
const advancedResponse = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: [
        "What is the meaning of life?",
        "What is the purpose of existence?"
    ],
    taskType: "SEMANTIC_SIMILARITY",
    outputDimensionality: 768
});

console.log(`Generated ${advancedResponse.embeddings.length} embeddings`);

bash=:curl "https://api.avalai.ir/v1beta/models/gemini-embedding-001:embedContent" \
  -H "x-goog-api-key: $AVALAI_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{
    "contents": [
      {"parts": [{"text": "What is the meaning of life?"}]}
    ],
    "embedding_config": {
      "task_type": "SEMANTIC_SIMILARITY",
      "output_dimensionality": 768
    }
  }'

```

#### Supported Task Types

| Task Type | Description | Use Cases |
|-----------|-------------|-----------|
| **SEMANTIC_SIMILARITY** | Optimized for measuring text similarity | Recommendation systems, duplicate detection |
| **CLASSIFICATION** | Optimized for text classification tasks | Sentiment analysis, spam detection |
| **CLUSTERING** | Optimized for grouping similar texts | Document organization, market research |
| **RETRIEVAL_DOCUMENT** | Optimized for document indexing | RAG systems, search engines |
| **RETRIEVAL_QUERY** | Optimized for search queries | Custom search applications |
| **CODE_RETRIEVAL_QUERY** | Optimized for code search queries | Code search, documentation lookup |
| **QUESTION_ANSWERING** | Optimized for Q&A systems | Chatbots, FAQ systems |
| **FACT_VERIFICATION** | Optimized for fact-checking | Automated verification systems |

#### Output Dimensionality Control

Gemini embeddings support Matryoshka Representation Learning (MRL), allowing you to truncate embeddings to smaller dimensions without significant quality loss:

- **3072 dimensions**: Full model capacity (default, normalized)
- **1536 dimensions**: Balanced performance and efficiency
- **768 dimensions**: Efficient with good performance
- **512 dimensions**: Compact with acceptable performance
- **256 dimensions**: Very compact
- **128 dimensions**: Minimal size

> **Important**: For dimensions other than 3072, you must normalize the embeddings manually for optimal semantic similarity performance.

```python
import numpy as np

# Normalize embeddings for dimensions < 3072
embedding_values = np.array(embedding)
normalized_embedding = embedding_values / np.linalg.norm(embedding_values)
```

### gemini-embedding-exp-03-07

Experimental variant of the Gemini embedding model with the latest improvements and features.

| Feature | Details |
|---------|---------|
| **Model ID** | `gemini-embedding-exp-03-07` |
| **Status** | Experimental |
| **Pricing** | Same as gemini-embedding-001 |
| **Features** | Latest experimental improvements |
| **Best For** | Testing new capabilities, research applications |

> **Note**: Experimental models may have different behavior and are subject to change. Use the stable `gemini-embedding-001` for production applications.

## Google Programmable Search Engine (PSE)

AvalAI provides access to Google's Programmable Search Engine (PSE) for customizable web search experiences. Google PSE allows you to create a search engine tailored to your specific needs.

### Google PSE Search

Google Programmable Search Engine with customizable search experiences.

| Feature        | Details                                                         |
| -------------- | --------------------------------------------------------------- |
| Tool ID        | `google_pse-search`                                             |
| Endpoint       | `v1/search/google_pse-search` or `v1/search`                  |
| Max results    | 1-20 results per query                                          |
| Pricing        | $0.005 per query                                                |
| Capabilities   | Customizable search, domain filtering, Google-powered results   |
| Strengths      | Google search quality, customizable, reliable                   |
| Best for       | Applications requiring Google search, custom search experiences |

**Usage Example:**

```language-selector
bash=:curl https://api.avalai.ir/v1/search/google_pse-search \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "machine learning tutorials",
    "max_results": 10
  }'

python=:import requests

response = requests.post(
    "https://api.avalai.ir/v1/search/google_pse-search",
    headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
    json={"query": "machine learning tutorials", "max_results": 10},
)

results = response.json()
for result in results["results"]:
    print(f"{result['title']}: {result['url']}")

javascript=:const response = await fetch("https://api.avalai.ir/v1/search/google_pse-search", {
    method: "POST",
    headers: {
        "Authorization": `Bearer ${process.env.AVALAI_API_KEY}`,
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        query: "machine learning tutorials",
        max_results: 10
    })
});

const data = await response.json();
data.results.forEach(result => {
    console.log(`${result.title}: ${result.url}`);
});

```

### Request Parameters

Google PSE search supports the following parameters:

| Parameter             | Type    | Required | Description                                          |
| --------------------- | ------- | -------- | ---------------------------------------------------- |
| query                 | string  | Yes      | Search query string                                  |
| max_results           | integer | No       | Maximum number of results (1-20). Default: 10        |
| search_domain_filter  | array   | No       | List of domains to filter results (max 20 domains)   |
| max_tokens_per_page   | integer | No       | Maximum tokens per page to process. Default: 1024    |
| country               | string  | No       | Country code filter (e.g., "US", "GB", "DE")         |

### Response Format

Google PSE searches return results in the standard search response format:

```json
{
  "object": "search",
  "results": [
    {
      "title": "Result Title",
      "url": "https://example.com/page",

      "snippet": "Brief excerpt from the page content...",
      "date": "2024-01-15"
    }
  ]
}
```

For more information about the Search API, see:
- [Search API Reference](en/api-reference/search.md)
- [Search API Announcement](en/news/2025-10-26-search-api-launched.md)
- [Google PSE Official Documentation](https://developers.google.com/custom-search/v1/overview)

## Speech Generation (Text-to-Speech)

The Gemini API can transform text input into single speaker or multi-speaker audio using native text-to-speech (TTS) generation capabilities. Text-to-speech (TTS) generation is controllable, meaning you can use natural language to structure interactions and guide the style, accent, pace, and tone of the audio.

The TTS capability differs from speech generation provided through the Live API, which is designed for interactive, unstructured audio, and multimodal inputs and outputs. While the Live API excels in dynamic conversational contexts, TTS through the Gemini API is tailored for scenarios that require exact text recitation with fine-grained control over style and sound, such as podcast or audiobook generation.

> **Preview**: Native text-to-speech (TTS) is in Preview.

### Before You Begin

Ensure you use a Gemini 2.5 model variant with native text-to-speech (TTS) capabilities, as listed in the Supported models section. For optimal results, consider which model best fits your specific use case.

You may find it useful to test the Gemini 2.5 TTS models in AI Studio before you start building.

> **Note**: TTS models accept text-only inputs and produce audio-only outputs. For a complete list of restrictions specific to TTS models, review the Limitations section.

### Single-Speaker Text-to-Speech

To convert text to single-speaker audio, set the response modality to "audio", and pass a [`SpeechConfig`](en/api-reference/v1beta.md:1) object with [`VoiceConfig`](en/api-reference/v1beta.md:1) set. You'll need to choose a voice name from the prebuilt output voices.

This example saves the output audio from the model in a wave file:

```language-selector
bash=:curl "https://api.avalai.ir/v1beta/models/gemini-2.5-flash-preview-tts:generateContent" \
  -H "x-goog-api-key: $AVALAI_API_KEY" \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [{
        "parts":[{
            "text": "Say cheerfully: Have a wonderful day!"
        }]
    }],
    "generationConfig": {
        "responseModalities": ["AUDIO"],
        "speechConfig": {
            "voiceConfig": {
                "prebuiltVoiceConfig": {
                    "voiceName": "Kore"
                }
            }
        }
    },
    "model": "gemini-2.5-flash-preview-tts"
}' | jq -r '.candidates[0].content.parts[0].inlineData.data' \
  | base64 --decode >out.pcm
# You may need to install ffmpeg.
ffmpeg -f s16le -ar 24000 -ac 1 -i out.pcm out.wav

python=:from google import genai
from google.genai import types
import wave


# Set up the wave file to save the output:
def wave_file(filename, pcm, channels=1, rate=24000, sample_width=2):
    with wave.open(filename, "wb") as wf:
        wf.setnchannels(channels)
        wf.setsampwidth(sample_width)
        wf.setframerate(rate)
        wf.writeframes(pcm)


client = genai.Client(
    api_key="AVALAI_API_KEY",
    http_options={"api_version": "v1beta", "base_url": "https://api.avalai.ir"},
)

response = client.models.generate_content(
    model="gemini-2.5-flash-preview-tts",
    contents="Say cheerfully: Have a wonderful day!",
    config=types.GenerateContentConfig(
        response_modalities=["AUDIO"],
        speech_config=types.SpeechConfig(
            voice_config=types.VoiceConfig(
                prebuilt_voice_config=types.PrebuiltVoiceConfig(
                    voice_name="Kore",
                )
            )
        ),
    ),
)

data = response.candidates[0].content.parts[0].inline_data.data

file_name = "out.wav"
wave_file(file_name, data)  # Saves the file to current directory

javascript=:import {GoogleGenAI} from '@google/genai';
import wav from 'wav';

async function saveWaveFile(
    filename,
    pcmData,
    channels = 1,
    rate = 24000,
    sampleWidth = 2,
) {
    return new Promise((resolve, reject) => {
        const writer = new wav.FileWriter(filename, {
            channels,
            sampleRate: rate,
            bitDepth: sampleWidth * 8,
        });

        writer.on('finish', resolve);
        writer.on('error', reject);

        writer.write(pcmData);
        writer.end();
    });
}

async function main() {
    const ai = new GoogleGenAI({
        apiKey: 'AVALAI_API_KEY',
        httpOptions: {"apiVersion": "v1beta", "baseUrl": "https://api.avalai.ir"}}
    });

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: 'Say cheerfully: Have a wonderful day!' }] }],
        config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: 'Kore' },
                },
            },
        },
    });

    const data = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    const audioBuffer = Buffer.from(data, 'base64');

    const fileName = 'out.wav';
    await saveWaveFile(fileName, audioBuffer);
}
await main();

go=:package main

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"os"
	"strings"

	"github.com/google/generative-ai-go/genai"
	"google.golang.org/api/option"
)

func main() {
	ctx := context.Background()

	client, err := genai.NewClient(ctx, option.WithAPIKey("AVALAI_API_KEY"), option.WithEndpoint("https://api.avalai.ir"))
	if err != nil {
		panic(err)
	}
	defer client.Close()

	model := client.GenerativeModel("gemini-2.5-flash-preview-tts")
	model.SetCandidateCount(1)
	model.ResponseMIMEType = "audio/wav"

	// Configure for TTS
	model.GenerationConfig.ResponseModalities = []string{"AUDIO"}
	model.SpeechConfig = &genai.SpeechConfig{
		VoiceConfig: &genai.VoiceConfig{
			PrebuiltVoiceConfig: &genai.PrebuiltVoiceConfig{
				VoiceName: "Kore",
			},
		},
	}

	resp, err := model.GenerateContent(ctx, genai.Text("Say cheerfully: Have a wonderful day!"))
	if err != nil {
		panic(err)
	}

	// Extract audio data
	if len(resp.Candidates) > 0 && len(resp.Candidates[0].Content.Parts) > 0 {
		if blob, ok := resp.Candidates[0].Content.Parts[0].(genai.Blob); ok {
			// Decode base64 audio data
			audioData, err := base64.StdEncoding.DecodeString(string(blob.Data))
			if err != nil {
				panic(err)
			}

			// Save to file
			err = os.WriteFile("out.wav", audioData, 0644)
			if err != nil {
				panic(err)
			}
			fmt.Println("Audio saved to out.wav")
		}
	}
}

```

### Multi-Speaker Text-to-Speech

For multi-speaker audio, you'll need a [`MultiSpeakerVoiceConfig`](en/api-reference/v1beta.md:1) object with each speaker (up to 2) configured as a [`SpeakerVoiceConfig`](en/api-reference/v1beta.md:1). You'll need to define each speaker with the same names used in the prompt:

```language-selector
bash=:curl "https://api.avalai.ir/v1beta/models/gemini-2.5-flash-preview-tts:generateContent" \
  -H "x-goog-api-key: $AVALAI_API_KEY" \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [{
        "parts":[{
            "text": "TTS the following conversation between Joe and Jane:\nJoe: How'\''s it going today Jane?\nJane: Not too bad, how about you?"
        }]
    }],
    "generationConfig": {
        "responseModalities": ["AUDIO"],
        "speechConfig": {
            "multiSpeakerVoiceConfig": {
                "speakerVoiceConfigs": [{
                    "speaker": "Joe",
                    "voiceConfig": {
                        "prebuiltVoiceConfig": {
                            "voiceName": "Kore"
                        }
                    }
                }, {
                    "speaker": "Jane",
                    "voiceConfig": {
                        "prebuiltVoiceConfig": {
                            "voiceName": "Puck"
                        }
                    }
                }]
            }
        }
    },
    "model": "gemini-2.5-flash-preview-tts"
}' | jq -r '.candidates[0].content.parts[0].inlineData.data' \
  | base64 --decode >out.pcm
# You may need to install ffmpeg.
ffmpeg -f s16le -ar 24000 -ac 1 -i out.pcm out.wav

python=:from google import genai
from google.genai import types
import wave


# Set up the wave file to save the output:
def wave_file(filename, pcm, channels=1, rate=24000, sample_width=2):
    with wave.open(filename, "wb") as wf:
        wf.setnchannels(channels)
        wf.setsampwidth(sample_width)
        wf.setframerate(rate)
        wf.writeframes(pcm)


client = genai.Client(
    api_key="AVALAI_API_KEY",
    http_options={"api_version": "v1beta", "base_url": "https://api.avalai.ir"},
)

prompt = """TTS the following conversation between Joe and Jane:
Joe: How's it going today Jane?
Jane: Not too bad, how about you?"""

response = client.models.generate_content(
    model="gemini-2.5-flash-preview-tts",
    contents=prompt,
    config=types.GenerateContentConfig(
        response_modalities=["AUDIO"],
        speech_config=types.SpeechConfig(
            multi_speaker_voice_config=types.MultiSpeakerVoiceConfig(
                speaker_voice_configs=[
                    types.SpeakerVoiceConfig(
                        speaker="Joe",
                        voice_config=types.VoiceConfig(
                            prebuilt_voice_config=types.PrebuiltVoiceConfig(
                                voice_name="Kore",
                            )
                        ),
                    ),
                    types.SpeakerVoiceConfig(
                        speaker="Jane",
                        voice_config=types.VoiceConfig(
                            prebuilt_voice_config=types.PrebuiltVoiceConfig(
                                voice_name="Puck",
                            )
                        ),
                    ),
                ]
            )
        ),
    ),
)

data = response.candidates[0].content.parts[0].inline_data.data

file_name = "out.wav"
wave_file(file_name, data)  # Saves the file to current directory

javascript=:import {GoogleGenAI} from '@google/genai';
import wav from 'wav';

async function saveWaveFile(
    filename,
    pcmData,
    channels = 1,
    rate = 24000,
    sampleWidth = 2,
) {
    return new Promise((resolve, reject) => {
        const writer = new wav.FileWriter(filename, {
            channels,
            sampleRate: rate,
            bitDepth: sampleWidth * 8,
        });

        writer.on('finish', resolve);
        writer.on('error', reject);

        writer.write(pcmData);
        writer.end();
    });
}

async function main() {
    const ai = new GoogleGenAI({
        apiKey: 'AVALAI_API_KEY',
        httpOptions: {"apiVersion": "v1beta", "baseUrl": "https://api.avalai.ir"}}
    });

    const prompt = `TTS the following conversation between Joe and Jane:
    Joe: How's it going today Jane?
    Jane: Not too bad, how about you?`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: prompt }] }],
        config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
                multiSpeakerVoiceConfig: {
                    speakerVoiceConfigs: [
                        {
                            speaker: 'Joe',
                            voiceConfig: {
                                prebuiltVoiceConfig: { voiceName: 'Kore' }
                            }
                        },
                        {
                            speaker: 'Jane',
                            voiceConfig: {
                                prebuiltVoiceConfig: { voiceName: 'Puck' }
                            }
                        }
                    ]
                }
            }
        }
    });

    const data = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    const audioBuffer = Buffer.from(data, 'base64');

    const fileName = 'out.wav';
    await saveWaveFile(fileName, audioBuffer);
}

await main();

go=:package main

import (
	"context"
	"encoding/base64"
	"fmt"
	"os"

	"github.com/google/generative-ai-go/genai"
	"google.golang.org/api/option"
)

func main() {
	ctx := context.Background()

	client, err := genai.NewClient(ctx, option.WithAPIKey("AVALAI_API_KEY"), option.WithEndpoint("https://api.avalai.ir"))
	if err != nil {
		panic(err)
	}
	defer client.Close()

	model := client.GenerativeModel("gemini-2.5-flash-preview-tts")
	model.SetCandidateCount(1)
	model.ResponseMIMEType = "audio/wav"

	// Configure for multi-speaker TTS
	model.GenerationConfig.ResponseModalities = []string{"AUDIO"}
	model.SpeechConfig = &genai.SpeechConfig{
		MultiSpeakerVoiceConfig: &genai.MultiSpeakerVoiceConfig{
			SpeakerVoiceConfigs: []*genai.SpeakerVoiceConfig{
				{
					Speaker: "Joe",
					VoiceConfig: &genai.VoiceConfig{
						PrebuiltVoiceConfig: &genai.PrebuiltVoiceConfig{
							VoiceName: "Kore",
						},
					},
				},
				{
					Speaker: "Jane",
					VoiceConfig: &genai.VoiceConfig{
						PrebuiltVoiceConfig: &genai.PrebuiltVoiceConfig{
							VoiceName: "Puck",
						},
					},
				},
			},
		},
	}

	prompt := `TTS the following conversation between Joe and Jane:
Joe: How's it going today Jane?
Jane: Not too bad, how about you?`

	resp, err := model.GenerateContent(ctx, genai.Text(prompt))
	if err != nil {
		panic(err)
	}

	// Extract audio data
	if len(resp.Candidates) > 0 && len(resp.Candidates[0].Content.Parts) > 0 {
		if blob, ok := resp.Candidates[0].Content.Parts[0].(genai.Blob); ok {
			// Decode base64 audio data
			audioData, err := base64.StdEncoding.DecodeString(string(blob.Data))
			if err != nil {
				panic(err)
			}

			// Save to file
			err = os.WriteFile("out.wav", audioData, 0644)
			if err != nil {
				panic(err)
			}
			fmt.Println("Multi-speaker audio saved to out.wav")
		}
	}
}

```

### Controlling Speech Style with Prompts

You can control style, tone, accent, and pace using natural language prompts for both single- and multi-speaker TTS. For example, in a single-speaker prompt, you can say:

```
Say in an spooky whisper:
"By the pricking of my thumbs...
Something wicked this way comes"
```

In a multi-speaker prompt, provide the model with each speaker's name and corresponding transcript. You can also provide guidance for each speaker individually:

```
Make Speaker1 sound tired and bored, and Speaker2 sound excited and happy:

Speaker1: So... what's on the agenda today?
Speaker2: You're never going to guess!
```

Try using a voice option that corresponds to the style or emotion you want to convey, to emphasize it even more. In the previous prompt, for example, Enceladus's breathiness might emphasize "tired" and "bored", while Puck's upbeat tone could complement "excited" and "happy".

### Generating a Prompt to Convert to Audio

The TTS models only output audio, but you can use other models to generate a transcript first, then pass that transcript to the TTS model to read aloud.

```language-selector
python=:from google import genai
from google.genai import types

client = genai.Client(
    api_key="AVALAI_API_KEY",
    http_options={"api_version": "v1beta", "base_url": "https://api.avalai.ir"},
)

transcript = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="""Generate a short transcript around 100 words that reads
    like it was clipped from a podcast by excited herpetologists.
    The hosts names are Dr. Anya and Liam.""",
).text

response = client.models.generate_content(
    model="gemini-2.5-flash-preview-tts",
    contents=transcript,
    config=types.GenerateContentConfig(
        response_modalities=["AUDIO"],
        speech_config=types.SpeechConfig(
            multi_speaker_voice_config=types.MultiSpeakerVoiceConfig(
                speaker_voice_configs=[
                    types.SpeakerVoiceConfig(
                        speaker="Dr. Anya",
                        voice_config=types.VoiceConfig(
                            prebuilt_voice_config=types.PrebuiltVoiceConfig(
                                voice_name="Kore",
                            )
                        ),
                    ),
                    types.SpeakerVoiceConfig(
                        speaker="Liam",
                        voice_config=types.VoiceConfig(
                            prebuilt_voice_config=types.PrebuiltVoiceConfig(
                                voice_name="Puck",
                            )
                        ),
                    ),
                ]
            )
        ),
    ),
)

# ...Code to stream or save the output

javascript=:import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: 'AVALAI_API_KEY',
    httpOptions: {"apiVersion": "v1beta", "baseUrl": "https://api.avalai.ir"}}
});

async function main() {

const transcript = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Generate a short transcript around 100 words that reads like it was clipped from a podcast by excited herpetologists. The hosts names are Dr. Anya and Liam.",
    })

const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: transcript,
    config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
            multiSpeakerVoiceConfig: {
                speakerVoiceConfigs: [
                    {
                        speaker: "Dr. Anya",
                        voiceConfig: {
                            prebuiltVoiceConfig: {voiceName: "Kore"},
                        }
                    },
                    {
                        speaker: "Liam",
                        voiceConfig: {
                            prebuiltVoiceConfig: {voiceName: "Puck"},
                        }
                    }
                ]
            }
        }
    }
    });
}
// ..JavaScript code for exporting .wav file for output audio

await main();

```

### Voice Options

TTS models support the following 30 voice options in the [`voice_name`](en/api-reference/v1beta.md:1) field:

| Voice | Style | Voice | Style | Voice | Style |
|-------|-------|-------|-------|-------|-------|
| Zephyr | Bright | Puck | Upbeat | Charon | Informative |
| Kore | Firm | Fenrir | Excitable | Leda | Youthful |
| Orus | Firm | Aoede | Breezy | Callirrhoe | Easy-going |
| Autonoe | Bright | Enceladus | Breathy | Iapetus | Clear |
| Umbriel | Easy-going | Algieba | Smooth | Despina | Smooth |
| Erinome | Clear | Algenib | Gravelly | Rasalgethi | Informative |
| Laomedeia | Upbeat | Achernar | Soft | Alnilam | Firm |
| Schedar | Even | Gacrux | Mature | Pulcherrima | Forward |
| Achird | Friendly | Zubenelgenubi | Casual | Vindemiatrix | Gentle |
| Sadachbia | Lively | Sadaltager | Knowledgeable | Sulafat | Warm |

You can hear all the voice options in AI Studio.

### Supported Languages

The TTS models detect the input language automatically. They support the following 24 languages:

| Language | BCP-47 Code | Language | BCP-47 Code |
|----------|-------------|----------|-------------|
| Arabic (Egyptian) | ar-EG | German (Germany) | de-DE |
| English (US) | en-US | Spanish (US) | es-US |
| French (France) | fr-FR | Hindi (India) | hi-IN |
| Indonesian (Indonesia) | id-ID | Italian (Italy) | it-IT |
| Japanese (Japan) | ja-JP | Korean (Korea) | ko-KR |
| Portuguese (Brazil) | pt-BR | Russian (Russia) | ru-RU |
| Dutch (Netherlands) | nl-NL | Polish (Poland) | pl-PL |
| Thai (Thailand) | th-TH | Turkish (Turkey) | tr-TR |
| Vietnamese (Vietnam) | vi-VN | Romanian (Romania) | ro-RO |
| Ukrainian (Ukraine) | uk-UA | Bengali (Bangladesh) | bn-BD |
| English (India) | en-IN & hi-IN bundle | Marathi (India) | mr-IN |
| Tamil (India) | ta-IN | Telugu (India) | te-IN |

### Supported Models

| Model | Single speaker | Multispeaker |
|-------|----------------|--------------|
| Gemini 2.5 Flash Preview TTS | ✔️ | ✔️ |
| Gemini 2.5 Pro Preview TTS | ✔️ | ✔️ |

### Limitations

- TTS models can only receive text inputs and generate audio outputs.
- A TTS session has a context window limit of 32k tokens.
- Review Languages section for language support.

> **Important**: The v1beta API is compatible with the [official Gemini API documentation](https://ai.google.dev/gemini-api/docs/text-to-speech). For discrepancies, contact [t.me/AvalAISupport](https://t.me/AvalAISupport).
