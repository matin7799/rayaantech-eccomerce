# Google GenAI SDK v1beta API Reference

The v1beta API provides native access to Google's Gemini models using Google's official GenAI SDK and API schema. This endpoint allows you to use Google's native methods including `generateContent`, `streamGenerateContent`, `embedContent`, `batchEmbedContents`, `countTokens`, and `predict` through AvalAI's infrastructure.

> **Official Documentation**: For complete details on the Gemini API, refer to [Google's official Gemini API documentation](https://ai.google.dev/gemini-api/docs).

## Base URL

```
https://api.avalai.ir
```

> **Important**: When using the Google GenAI SDK with AvalAI, use `https://api.avalai.ir` as the base URL (without `/v1`). This is different from the OpenAI-compatible endpoints which use `/v1`.

## Authentication

The v1beta API supports two authentication methods:

### Method 1: Bearer Token (Recommended)
```http
Authorization: Bearer $AVALAI_API_KEY
```

### Method 2: Google Native Header
```http
x-goog-api-key: YOUR_AVALAI_API_KEY
```

## Supported Models

The v1beta API exclusively supports Google models. You can use any Gemini or Imagen model available through AvalAI:

### Gemini Models (Text, Vision, Audio)
- `gemini-3.5-flash`
- `gemini-3.1-pro-preview`
- `gemini-3.1-flash-lite`
- `gemini-3.1-flash-lite-preview`
- `gemini-2.5-pro`
- `gemini-2.5-flash`
- `gemini-robotics-er-1.5-preview` (Robotics)
- `gemini-2.5-pro-preview-tts` (Text-to-Speech)
- `gemini-2.5-flash-preview-tts` (Text-to-Speech)

### Imagen Models (Image Generation)
- `imagen-4.0-generate-001`
- `imagen-4.0-ultra-generate-001`
- `imagen-4.0-fast-generate-001`

For a complete list of available models, see the [Google Models documentation](en/providers/google.md).

## Endpoints

> **Note**: All endpoints are fully compatible with [Google's official Gemini API documentation](https://ai.google.dev/gemini-api/docs). Refer to the official docs for additional examples and detailed parameter descriptions.

### Generate Content

Generate text content using a Gemini model.

```http
POST /v1beta/models/{model}:generateContent
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `model` | string | Yes | The Gemini model to use (e.g., `gemini-3.5-flash`) |

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `contents` | array | Yes | Array of content objects representing the conversation |
| `system_instruction` | object | No | System instruction to guide model behavior |
| `generationConfig` | object | No | Configuration for the generation |
| `safetySettings` | array | No | Safety settings for content filtering |
| `tools` | array | No | Tools available to the model |

#### Content Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `parts` | array | Yes | Array of parts (text, images, etc.) |
| `role` | string | Yes | Role of the content (`user`, `model`) |

> **Important Note**: When using the v1beta native Gemini API, only `user` and `model` roles are supported in the `contents` array. The `user` role is for user messages, and `model` role is for assistant responses in conversation history. For system-level instructions, use the separate `system_instruction` parameter instead.

#### System Instruction Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `parts` | array | Yes | Array of parts containing the system instruction text |

#### Generation Config

| Field | Type | Description |
|-------|------|-------------|
| `maxOutputTokens` | integer | Maximum number of tokens to generate |
| `temperature` | number | Controls randomness (0.0 to 2.0) |
| `topP` | number | Controls diversity via nucleus sampling |
| `topK` | integer | Controls diversity via top-k sampling |
| `stopSequences` | array | Sequences where generation should stop |
| `thinkingConfig` | object | Configuration for thinking behavior (Gemini 3.5/3.1 thinking levels and Gemini 2.5 budgets) |
| `responseModalities` | array | Response modalities (e.g., ["AUDIO"] for TTS models) |
| `speechConfig` | object | Configuration for text-to-speech generation |

#### Thinking Config (Gemini Models)

| Field | Type | Description |
|-------|------|-------------|
| `thinkingLevel` | string | Reasoning depth for Gemini 3.5/3.1 models (`low`, `medium`, `high`) |
| `thinkingBudget` | integer | Legacy Gemini 2.5 Flash thinking budget in tokens (0 disables thinking) |

#### Speech Config (TTS Models)

| Field | Type | Description |
|-------|------|-------------|
| `voiceConfig` | object | Configuration for single-speaker TTS |
| `multiSpeakerVoiceConfig` | object | Configuration for multi-speaker TTS (up to 2 speakers) |

#### Voice Config

| Field | Type | Description |
|-------|------|-------------|
| `prebuiltVoiceConfig` | object | Configuration for prebuilt voice selection |

#### Prebuilt Voice Config

| Field | Type | Description |
|-------|------|-------------|
| `voiceName` | string | Name of the voice (e.g., "Kore", "Puck", "Zephyr") |

#### Multi Speaker Voice Config

| Field | Type | Description |
|-------|------|-------------|
| `speakerVoiceConfigs` | array | Array of speaker voice configurations (max 2) |

#### Speaker Voice Config

| Field | Type | Description |
|-------|------|-------------|
| `speaker` | string | Name of the speaker (must match names used in prompt) |
| `voiceConfig` | object | Voice configuration for this speaker |

#### Example Request

```bash
curl -X POST 'https://api.avalai.ir/v1beta/models/gemini-3.5-flash:generateContent' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer $AVALAI_API_KEY' \
  -d '{
"contents": [
{
"parts": [
{
"text": "Write a short story about artificial intelligence."
}
],
"role": "user"
}
],
"generationConfig": {
"maxOutputTokens": 1000,
"temperature": 0.7
}
}'
```

#### Example with System Instructions

If you need to provide system-level instructions to guide model behavior, use the `system_instruction` parameter:

```bash
curl -i https://api.avalai.ir/v1beta/models/gemini-2.5-flash:generateContent \
  -H "x-goog-api-key: $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
	"system_instruction": {
		"parts": [
			{
				"text": "write in Persian"
			}
		]
	},
	"contents": [
		{
			"parts": [
				{
					"text": "Write a short story about artificial intelligence."
				}
			],
			"role": "user"
		}
	],
	"generationConfig": {
		"thinkingConfig": {
			"thinkingBudget": 0
		},
		"maxOutputTokens": 70,
		"stopSequences": [
			"Title"
		],
		"temperature": 1.0,
		"topP": 0.8,
		"topK": 10
	}
}'
```

> **Note**: The v1beta API is fully compatible with the [official Gemini API documentation](https://ai.google.dev/gemini-api/docs/text-generation). If you notice any discrepancies, please contact us at [t.me/AvalAISupport](https://t.me/AvalAISupport).

#### Example Response

```json
{
  "candidates": [
    {
      "content": {
        "parts": [
          {
            "text": "In the year 2045, Dr. Sarah Chen stood before her greatest creation..."
          }
        ],
        "role": "model"
      },
      "finishReason": "STOP",
      "index": 0,
      "safetyRatings": [
        {
          "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          "probability": "NEGLIGIBLE"
        }
      ]
    }
  ],
  "usageMetadata": {
    "promptTokenCount": 12,
    "candidatesTokenCount": 150,
    "totalTokenCount": 162
  }
}
```

### Stream Generate Content

Generate streaming text content using a Gemini model.

```http
POST /v1beta/models/{model}:streamGenerateContent
```

The request format is identical to `generateContent`, but the response is streamed as Server-Sent Events.

#### Example Request

```bash
curl -X POST 'https://api.avalai.ir/v1beta/models/gemini-2.5-flash:streamGenerateContent' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer $AVALAI_API_KEY' \
  -d '{
    "contents": [
      {
        "parts": [
          {
            "text": "Explain AI"
          }
        ],
        "role": "user"
      }
    ],
    "generationConfig": {
      "maxOutputTokens": 500
    }
  }'
```

#### Example Streaming Response

```
[
    {
        "candidates": [
            {
                "content": {
                    "parts": [
                        {
                            "text": "An"
                        }
                    ],
                    "role": "model"
                }
            }
        ],
        "usageMetadata": {
            "promptTokenCount": 4,
            "totalTokenCount": 4,
            "promptTokensDetails": [
                {
                    "modality": "TEXT",
                    "tokenCount": 4
                }
            ]
        },
        "modelVersion": "gemini-2.5-flash",
        "responseId": "sOl_aKOWPIPxMTp1fDNn6QQ"
    },
    {
        "candidates": [
            {
                "content": {
                    "parts": [
                        {
                            "text": " broad term that can encompass a few different things:\n\n*   **AI-"
                        }
                    ],
                    "role": "model"
                }
            }
        ],
        "usageMetadata": {
            "promptTokenCount": 4,
            "totalTokenCount": 4,
            "promptTokensDetails": [
                {
                    "modality": "TEXT",
                    "tokenCount": 4
                }
            ]
        },
        "modelVersion": "gemini-2.5-flash",
        "responseId": "sOl_aKOWPIPxMTp1fDNn6QQ"
    },

    ...

    {
        "candidates": [
            {
                "content": {
                    "parts": [
                        {
                            "text": "\n\n**In summary, an AI sentence can either be a sentence created *by* an AI or a sentence being analyzed *by* an AI. It's a fundamental component of how AI interacts with and understands human language.**\n"
                        }
                    ],
                    "role": "model"
                },
                "finishReason": "STOP"
            }
        ],
        "usageMetadata": {
            "promptTokenCount": 3,
            "candidatesTokenCount": 571,
            "totalTokenCount": 574,
            "promptTokensDetails": [
                {
                    "modality": "TEXT",
                    "tokenCount": 3
                }
            ],
            "candidatesTokensDetails": [
                {
                    "modality": "TEXT",
                    "tokenCount": 571
                }
            ]
        },
        "modelVersion": "gemini-2.5-flash",
        "responseId": "sOl_aKOWPIPxMTp1fDNn6QQ"
    }
]
```

## Using with Google GenAI SDK

### Python

```python
from google import genai
from google.genai.types import ContentDict, PartDict

# Initialize client
client = genai.Client(
    api_key="YOUR_AVALAI_API_KEY", http_options={"base_url": "https://api.avalai.ir"}
)

# Generate content
contents = ContentDict(parts=[PartDict(text="Hello, how are you?")], role="user")

response = await client.agenerate_content(
    contents=contents, model="gemini-2.5-flash", max_tokens=100
)

print(response)
```

### Streaming with Python

```python
# Streaming generation
response = await client.agenerate_content_stream(
    contents=contents, model="gemini-2.5-flash", max_tokens=500
)

async for chunk in response:
    print(chunk)
```
### Text-to-Speech (TTS) with Python

```python
from google import genai
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
    api_key="your-avalai-api-key",
    http_options={"api_version": "v1beta", "base_url": "https://api.avalai.ir"},
)

# Single-speaker TTS
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
wave_file("output.wav", data)
```


## Multimodal Support

The v1beta API supports multimodal inputs including text, images, audio, and video.

### Image Input Example

```python
# Note: Images must be base64-encoded for Gemini models
contents = ContentDict(
    parts=[
        PartDict(text="What's in this image?"),
        PartDict(
            inline_data={"mime_type": "image/jpeg", "data": "base64_encoded_image_data"}
        ),
    ],
    role="user",
)

response = await client.agenerate_content(contents=contents, model="gemini-2.5-flash")
```

## Grounding with Google Search

Grounding with Google Search connects Gemini models to real-time web content and works with all available languages. This allows Gemini to provide more accurate answers and cite verifiable sources beyond its knowledge cutoff.

### Key Benefits

- **Increase factual accuracy**: Reduce model hallucinations by basing responses on real-world information
- **Access real-time information**: Answer questions about recent events and topics
- **Provide citations**: Build user trust by showing the sources for the model's claims

### Example Request

```bash
curl "https://api.avalai.ir/v1beta/models/gemini-2.5-flash:generateContent" \
  -H "x-goog-api-key: $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -X POST \
  -d '{
    "contents": [
      {
        "parts": [
          {"text": "Who won the euro 2024?"}
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

### Using with Google GenAI SDK

#### Python

```python
from google import genai
from google.genai import types

client = genai.Client(
    api_key="your-avalai-api-key",
    http_options={"api_version": "v1beta", "base_url": "https://api.avalai.ir"},
)

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="Who won the euro 2024?",
    config=types.GenerateContentConfig(
        tools=[types.Tool(google_search=types.GoogleSearch())]
    ),
)

print(response.text)
```

#### JavaScript

```javascript
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.AVALAI_API_KEY,
    httpOptions: {"apiVersion": "v1beta", "baseUrl": "https://api.avalai.ir"}
});

const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Who won the euro 2024?",
    config: {
        tools: [{ googleSearch: {} }]
    }
});

console.log(response.text);
```

### How Grounding Works

When you enable the `google_search` tool, the model handles the entire workflow automatically:

1. **Prompt Analysis**: The model analyzes the prompt and determines if a Google Search can improve the answer
2. **Google Search**: If needed, the model automatically generates one or multiple search queries and executes them
3. **Search Results Processing**: The model processes the search results, synthesizes the information, and formulates a response
4. **Grounded Response**: The API returns a final response grounded in the search results with citations

### Understanding the Grounding Response

When a response is successfully grounded, the response includes a `groundingMetadata` field:

```json
{
  "candidates": [
    {
      "content": {
        "parts": [
          {
            "text": "Spain won Euro 2024, defeating England 2-1 in the final. This victory marks Spain's record fourth European Championship title."
          }
        ],
        "role": "model"
      },
      "groundingMetadata": {
        "webSearchQueries": [
          "UEFA Euro 2024 winner",
          "who won euro 2024"
        ],
        "searchEntryPoint": {
          "renderedContent": "<!-- HTML and CSS for the search widget -->"
        },
        "groundingChunks": [
          {"web": {"uri": "https://...", "title": "aljazeera.com"}},

            {"web": {"uri": "https://...", "title": "uefa.com"}}

            ],
            "groundingSupports": [
              {
                "segment": {"startIndex": 0, "endIndex": 85, "text": "Spain won Euro 2024, defeatin..."},
                "groundingChunkIndices": [0]
              },
              {
                "segment": {"startIndex": 86, "endIndex": 210, "text": "This victory marks Spain's..."},
                "groundingChunkIndices": [0, 1]
              }
            ]
          }
        }
      ]
    }
```

The `groundingMetadata` contains:

| Field | Description |
|-------|-------------|
| `webSearchQueries` | Array of the search queries used. Useful for debugging and understanding the model's reasoning process |
| `searchEntryPoint` | Contains the HTML and CSS to render the required Search Suggestions |
| `groundingChunks` | Array of objects containing the web sources (uri and title) |
| `groundingSupports` | Array of chunks connecting model response text to the sources. Each chunk links a text segment (defined by startIndex and endIndex) to one or more groundingChunkIndices |

### Attributing Sources with Inline Citations

You can use the `groundingSupports` and `groundingChunks` fields to create inline citations:

```python
def add_citations(response):
    text = response.text
    supports = response.candidates[0].grounding_metadata.grounding_supports
    chunks = response.candidates[0].grounding_metadata.grounding_chunks

    # Sort supports by end_index in descending order to avoid shifting issues when inserting
    sorted_supports = sorted(supports, key=lambda s: s.segment.end_index, reverse=True)

    for support in sorted_supports:
        end_index = support.segment.end_index
        if support.grounding_chunk_indices:
            # Create citation string like [1](link1)[2](link2)
            citation_links = []
            for i in support.grounding_chunk_indices:
                if i < len(chunks):
                    uri = chunks[i].web.uri
                    citation_links.append(f"[{i + 1}]({uri})")

            citation_string = ", ".join(citation_links)
            text = text[:end_index] + citation_string + text[end_index:]

    return text


# Usage with grounding response
text_with_citations = add_citations(response)
print(text_with_citations)
```

### Supported Models

| Model | Grounding with Google Search |
|-------|------------------------------|
| Gemini 3.1 Pro Preview | ✔️ |
| Gemini 3 Pro Preview | ✔️ |
| Gemini 3 Flash Preview | ✔️ |
| Gemini 2.5 Pro | ✔️ |
| Gemini 2.5 Flash | ✔️ |
| Gemini 2.5 Flash-Lite | ✔️ |

> **Note**: Older models use a `google_search_retrieval` tool. For all current models, use the `google_search` tool as shown in the examples.

### Pricing

When you use Grounding with Google Search with Gemini 3 models, your project is billed for each search query that the model decides to execute. If the model decides to execute multiple search queries to answer a single prompt (for example, searching for "UEFA Euro 2024 winner" and "Spain vs England Euro 2024 final score" within the same API call), this counts as multiple billable uses of the tool for that request.

For Gemini 2.5 and older models, your project is billed per prompt when search grounding is used.

For detailed pricing information, see the [pricing page](en/pricing.md).

## Embed Content

Generate text embeddings using Gemini embedding models through the native Google GenAI SDK endpoint.

```http
POST /v1beta/models/{model}:embedContent
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `model` | string | Yes | The Gemini embedding model to use (e.g., `gemini-embedding-001`) |

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `contents` | array | Yes | Array of content objects to embed |
| `embedding_config` | object | No | Configuration for the embedding generation |

### Content Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `parts` | array | Yes | Array of parts containing text to embed |

### Embedding Config

| Field | Type | Description |
|-------|------|-------------|
| `task_type` | string | Task type for optimization (e.g., "SEMANTIC_SIMILARITY", "CLASSIFICATION") |
| `output_dimensionality` | integer | Number of dimensions for the output embedding (128-3072) |

### Supported Models

The embedContent endpoint supports the following Gemini embedding models:

- `gemini-embedding-2` (alias: `gemini-embedding-2-preview`) - Next-generation multimodal embedding model with native support for text, images, audio, video, and PDFs via `inline_data` parts
- `gemini-embedding-001` - Stable embedding model with advanced features

### Example Request

#### Basic Embedding

```bash
curl -X POST 'https://api.avalai.ir/v1beta/models/gemini-embedding-001:embedContent' \
  -H 'Content-Type: application/json' \
  -H 'x-goog-api-key: $AVALAI_API_KEY' \
  -d '{
    "contents": [
      {
        "parts": [
          {
            "text": "What is the meaning of life?"
          }
        ]
      }
    ]
  }'
```

#### Advanced Embedding with Task Type

```bash
curl -X POST 'https://api.avalai.ir/v1beta/models/gemini-embedding-001:embedContent' \
  -H 'Content-Type: application/json' \
  -H 'x-goog-api-key: $AVALAI_API_KEY' \
  -d '{
    "contents": [
      {
        "parts": [
          {
            "text": "What is the meaning of life?"
          }
        ]
      },
      {
        "parts": [
          {
            "text": "What is the purpose of existence?"
          }
        ]
      }
    ],
    "embedding_config": {
      "task_type": "SEMANTIC_SIMILARITY",
      "output_dimensionality": 768
    }
  }'
```

### Example Response

```json
{
  "embeddings": [
    {
      "values": [
        0.0023064255,
        -0.009327292,
        -0.0028842222,
        ...
      ]
    }
  ]
}
```

### Using with Google GenAI SDK

#### Python

```python
from google import genai
from google.genai import types

client = genai.Client(
    api_key="your-avalai-api-key",
    http_options={"api_version": "v1beta", "base_url": "https://api.avalai.ir"},
)

# Basic embedding
result = client.models.embed_content(
    model="gemini-embedding-001", contents="What is the meaning of life?"
)

print(f"Embedding dimensions: {len(result.embeddings[0].values)}")

# Advanced embedding with task type and custom dimensions
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
```

#### JavaScript

```javascript
import { GoogleGenAI } from "@google/genai";

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

// Advanced embedding with task type
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
```

### Supported Task Types

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

### Output Dimensionality

Gemini embeddings support Matryoshka Representation Learning (MRL), allowing flexible output dimensions:

- **3072 dimensions**: Full model capacity (default, pre-normalized)
- **1536 dimensions**: Balanced performance and efficiency
- **768 dimensions**: Efficient with good performance
- **512 dimensions**: Compact with acceptable performance
- **256 dimensions**: Very compact
- **128 dimensions**: Minimal size

> **Important**: For dimensions other than 3072, normalize the embeddings for optimal semantic similarity performance.

### Response Format

The embedContent endpoint returns embeddings in the following format:

| Field | Type | Description |
|-------|------|-------------|
| `embeddings` | array | Array of embedding objects |

#### Embedding Object

| Field | Type | Description |
|-------|------|-------------|
| `values` | array | Array of floating-point numbers representing the embedding vector |

## Batch Embed Contents

Generate embeddings for multiple text chunks at once using Gemini embedding models. This is more efficient than making individual `embedContent` requests when processing multiple texts.

```http
POST /v1beta/models/{model}:batchEmbedContents
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `model` | string | Yes | The Gemini embedding model to use (e.g., `gemini-embedding-001`) |

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `requests` | array | Yes | Array of embedding request objects |

### Embedding Request Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `model` | string | Yes | The model to use (should match the URL parameter) |
| `content` | object | Yes | Content object containing the text to embed |
| `task_type` | string | No | Task type for optimization |
| `output_dimensionality` | integer | No | Output dimension size (128-3072) |

### Example Request

```bash
curl -X POST 'https://api.avalai.ir/v1beta/models/gemini-embedding-001:batchEmbedContents' \
  -H 'Content-Type: application/json' \
  -H 'x-goog-api-key: $AVALAI_API_KEY' \
  -d '{
    "requests": [
      {
        "model": "models/gemini-embedding-001",
        "content": {
          "parts": [{
            "text": "What is the meaning of life?"
          }]
        }
      },
      {
        "model": "models/gemini-embedding-001",
        "content": {
          "parts": [{
            "text": "How much wood would a woodchuck chuck?"
          }]
        }
      },
      {
        "model": "models/gemini-embedding-001",
        "content": {
          "parts": [{
            "text": "How does the brain work?"
          }]
        }
      }
    ]
  }'
```

### Example Response

```json
{
  "embeddings": [
    {
      "values": [0.0023064255, -0.009327292, -0.0028842222, ...]
    },
    {
      "values": [0.0034521123, -0.007234567, -0.0021234567, ...]
    },
    {
      "values": [0.0045678901, -0.008765432, -0.0012345678, ...]
    }
  ]
}
```

### Using with Google GenAI SDK

#### Python

```python
from google import genai
from google.genai import types

client = genai.Client(
    api_key="your-avalai-api-key",
    http_options={"api_version": "v1beta", "base_url": "https://api.avalai.ir"},
)

# Batch embedding multiple texts
texts = [
    "What is the meaning of life?",
    "How much wood would a woodchuck chuck?",
    "How does the brain work?",
]

# Note: Use embed_content with a list of texts
result = client.models.embed_content(
    model="gemini-embedding-001",
    contents=texts,
    config=types.EmbedContentConfig(
        task_type="SEMANTIC_SIMILARITY", output_dimensionality=768
    ),
)

for i, embedding in enumerate(result.embeddings):
    print(f"Text {i}: {len(embedding.values)} dimensions")
```

## Count Tokens

Count the number of tokens in content before sending it to the model. This helps you understand token usage and stay within model limits.

```http
POST /v1beta/models/{model}:countTokens
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `model` | string | Yes | The Gemini model to use (e.g., `gemini-2.5-flash`) |

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `contents` | array | Yes | Array of content objects to count tokens for |
| `system_instruction` | object | No | System instruction (will be included in token count) |
| `tools` | array | No | Tools/functions (will be included in token count) |

### Example Request

#### Basic Token Counting

```bash
curl -X POST 'https://api.avalai.ir/v1beta/models/gemini-2.5-flash:countTokens' \
  -H 'Content-Type: application/json' \
  -H 'x-goog-api-key: $AVALAI_API_KEY' \
  -d '{
    "contents": [
      {
        "parts": [
          {
            "text": "The quick brown fox jumps over the lazy dog."
          }
        ],
        "role": "user"
      }
    ]
  }'
```

#### Token Counting with System Instructions

```bash
curl -X POST 'https://api.avalai.ir/v1beta/models/gemini-2.5-flash:countTokens' \
  -H 'Content-Type: application/json' \
  -H 'x-goog-api-key: $AVALAI_API_KEY' \
  -d '{
    "system_instruction": {
      "parts": [
        {
          "text": "You are a helpful assistant."
        }
      ]
    },
    "contents": [
      {
        "parts": [
          {
            "text": "What is the meaning of life?"
          }
        ],
        "role": "user"
      }
    ]
  }'
```

### Example Response

```json
{
  "totalTokens": 11
}
```

### Using with Google GenAI SDK

#### Python

```python
from google import genai
from google.genai import types

client = genai.Client(
    api_key="your-avalai-api-key",
    http_options={"api_version": "v1beta", "base_url": "https://api.avalai.ir"},
)

# Count tokens for simple text
prompt = "The quick brown fox jumps over the lazy dog."
result = client.models.count_tokens(model="gemini-2.5-flash", contents=prompt)
print(f"Total tokens: {result.total_tokens}")

# Count tokens for a conversation
chat_history = [
    types.Content(role="user", parts=[types.Part(text="Hi my name is Bob")]),
    types.Content(role="model", parts=[types.Part(text="Hi Bob!")]),
    types.Content(
        role="user",
        parts=[types.Part(text="In one sentence, explain how a computer works.")],
    ),
]

result = client.models.count_tokens(model="gemini-2.5-flash", contents=chat_history)
print(f"Total tokens in conversation: {result.total_tokens}")

# Count tokens with system instruction
result = client.models.count_tokens(
    model="gemini-2.5-flash",
    contents=prompt,
    config=types.GenerateContentConfig(
        system_instruction="You are a helpful assistant."
    ),
)
print(f"Total tokens with system instruction: {result.total_tokens}")
```

#### JavaScript

```javascript
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.AVALAI_API_KEY,
    httpOptions: {apiVersion: "v1beta", baseUrl: "https://api.avalai.ir"}
});

// Count tokens for simple text
const result = await ai.models.countTokens({
    model: "gemini-2.5-flash",
    contents: "The quick brown fox jumps over the lazy dog."
});

console.log(`Total tokens: ${result.totalTokens}`);

// Count tokens for multimodal content
const multimodalResult = await ai.models.countTokens({
    model: "gemini-2.5-flash",
    contents: [
        {
            role: "user",
            parts: [
                { text: "Tell me about this image" },
                { inlineData: { mimeType: "image/jpeg", data: base64ImageData } }
            ]
        }
    ]
});

console.log(`Multimodal tokens: ${multimodalResult.totalTokens}`);
```

### Token Counting for Multimodal Content

Token counting works for all input modalities:

- **Text**: Standard tokenization (≈4 characters per token)
- **Images**:
  - Gemini 2.5+: Images ≤384px in both dimensions = 258 tokens
  - Larger images are tiled at 768x768px, each tile = 258 tokens
- **Audio**: 32 tokens per second
- **Video**: 263 tokens per second

#### Example: Counting Tokens with Images

```python
from google import genai
import PIL.Image

client = genai.Client(
    api_key="your-avalai-api-key",
    http_options={"api_version": "v1beta", "base_url": "https://api.avalai.ir"},
)

image = PIL.Image.open("path/to/image.jpg")

result = client.models.count_tokens(
    model="gemini-2.5-flash", contents=["Tell me about this image", image]
)

print(f"Total tokens (text + image): {result.total_tokens}")
```

## Predict (Image Generation)

Generate images using Google's Imagen models through the native v1beta API. This method uses the `:predict` endpoint for image generation tasks.

```http
POST /v1beta/models/{model}:predict
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `model` | string | Yes | The Imagen model to use (e.g., `imagen-4.0-fast-generate-001`) |

### Supported Models

- `imagen-4.0-generate-001` - High-quality image generation
- `imagen-4.0-ultra-generate-001` - Ultra-high quality (experimental)
- `imagen-4.0-fast-generate-001` - Fast image generation
- `imagen-3.0-generate-002` - Previous generation model

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `instances` | array | Yes | Array of generation request instances |
| `parameters` | object | No | Configuration parameters for image generation |

### Instance Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `prompt` | string | Yes | Text description of the image to generate |

### Parameters Object

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `sampleCount` | integer | 1 | Number of images to generate (1-8) |
| `aspectRatio` | string | "1:1" | Image aspect ratio ("1:1", "9:16", "16:9", "3:4", "4:3") |
| `personGeneration` | string | "allow_all" | Person generation policy ("allow_all", "allow_adult") |
| `safetyFilterLevel` | string | "block_some" | Safety filter strength ("block_most", "block_some", "block_few") |
| `negativePrompt` | string | null | What to avoid in the generated image |

### Example Request

```bash
curl -X POST \
  "https://api.avalai.ir/v1beta/models/imagen-4.0-fast-generate-001:predict" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "instances": [
      {
        "prompt": "A serene Japanese garden with a koi pond, cherry blossoms, and a traditional wooden bridge"
      }
    ],
    "parameters": {
      "sampleCount": 1,
      "aspectRatio": "16:9"
    }
  }'
```

### Example Response

```json
{
  "predictions": [
    {
      "bytesBase64Encoded": "/9j/4AAQSkZJRgABAQAAAQABAAD...",
      "mimeType": "image/png"
    }
  ],
  "metadata": {
    "tokenMetadata": {
      "outputImageCount": {
        "imagen-4.0-fast-generate-001": 1
      }
    }
  }
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `predictions` | array | Array of generated image predictions |
| `bytesBase64Encoded` | string | Base64-encoded image data |
| `mimeType` | string | Image MIME type (typically "image/png") |
| `metadata` | object | Usage metadata including token counts |

### Decoding Images

To save the generated image, decode the base64 string:

```python
import base64

# Decode and save the image
image_data = base64.b64decode(response["predictions"][0]["bytesBase64Encoded"])
with open("generated_image.png", "wb") as f:
    f.write(image_data)
```

### Best Practices

1. **Prompt Engineering**: Use detailed, specific prompts for better results
2. **Aspect Ratios**: Choose appropriate aspect ratios for your use case
3. **Sample Count**: Generate multiple images (2-4) to get varied results
4. **Safety Filters**: Adjust safety filters based on your content policy
5. **Negative Prompts**: Use negative prompts to avoid unwanted elements

For detailed examples and prompt engineering guidance, see:
- [Generate Images with Imagen (Native API)](en/examples/generate_images_with_imagen_native_api.md)
- [Google's Official Imagen Documentation](https://ai.google.dev/gemini-api/docs/imagen)

## Error Handling

The v1beta API returns standard HTTP status codes:

- `200` - Success
- `400` - Bad Request (invalid parameters)
- `401` - Unauthorized (invalid API key)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

### Error Response Format

```json
{
  "error": {
    "code": 400,
    "message": "Invalid request format",
    "status": "INVALID_ARGUMENT"
  }
}
```

## Rate Limits

Rate limits for the v1beta API follow the same structure as other AvalAI endpoints. See the [Rate Limits documentation](en/guides/rate-limits.md) for details.

## Limitations

- **Gemini Models Only**: The v1beta API exclusively supports Gemini models. Other Google services are not available.
- **Base URL**: Must use `https://api.avalai.ir` (without `/v1`) when configuring the Google GenAI SDK.
- **Image Format**: Images must be provided as base64-encoded data, not as external URLs.

## Related Resources

- [Google Models Documentation](en/providers/google.md)
- [Authentication Guide](en/api-reference/authentication.md)
- [Rate Limits](en/guides/rate-limits.md)
- [Libraries Documentation](en/libraries.md)
- [Generate Images with Imagen (Native API)](en/examples/generate_images_with_imagen_native_api.md)
- [Official Google Gemini API Documentation](https://ai.google.dev/gemini-api/docs)
