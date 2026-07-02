# Embeddings API

The Embeddings API allows you to convert text into vector representations that can be used for semantic search, clustering, classification, and other machine learning tasks.

## Endpoint

```
POST https://api.avalai.ir/v1/embeddings
```

## Request Body

| Parameter         | Type            | Required | Description                                                                                          |
| ----------------- | --------------- | -------- | ---------------------------------------------------------------------------------------------------- |
| `model`           | string          | Yes      | ID of the model to use. See [Models](en/models/model-details.md) for available embedding models.             |
| `input`           | string or array | Yes      | The text to embed. Can be a string or an array of strings.                                           |
| `encoding_format` | string          | No       | The format to return the embeddings in. Can be "float" or "base64". Defaults to "float".             |
| `dimensions`      | integer         | No       | The number of dimensions the resulting output embeddings should have. Only supported in some models. |
| `user`            | string          | No       | A unique identifier representing your end-user, which can help monitor and detect abuse.             |

## Examples

### Basic Embedding Generation

```language-selector
bash=:curl https://api.avalai.ir/v1/embeddings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
  "model": "text-embedding-3-small",
  "input": "The food was delicious and the service was excellent."
}'

python=:from openai import OpenAI

client = OpenAI(
    api_key="your-avalai-api-key",  # Replace with your actual API key
    base_url="https://api.avalai.ir/v1",  # AvalAI API endpoint
)

response = client.embeddings.create(
    model="text-embedding-3-small",
    input="The food was delicious and the service was excellent.",
)

embeddings = response.data[0].embedding
print(f"Length of embedding vector: {len(embeddings)}")
print(f"First few values: {embeddings[:5]}")

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.embeddings.create({
  model: "text-embedding-3-small",
  input: "The food was delicious and the service was excellent.",
});

const embeddings = response.data[0].embedding;
console.log(`Length of embedding vector: ${embeddings.length}`);
console.log(`First few values: ${embeddings.slice(0, 5)}`);

go=:package main

import (
	"context"
	"fmt"
	openai "github.com/openai/openai-go"
)

func main() {
	client := openai.NewClient("AVALAI_API_KEY")
	client.BaseURL = "https://api.avalai.ir/v1"

	resp, err := client.CreateEmbeddings(
		context.Background(),
		openai.EmbeddingRequest{
			Model: openai.TextEmbeddingSmall,
			Input: []string{"The food was delicious and the service was excellent."},
		},
	)

	if err != nil {
		fmt.Printf("Embedding error: %v\n", err)
		return
	}

	embeddings := resp.Data[0].Embedding
	fmt.Printf("Length of embedding vector: %d\n", len(embeddings))
	fmt.Printf("First few values: %v\n", embeddings[:5])
}

php=:<?php
// PHP Example for Embeddings via AvalAI

$apiKey = getenv('AVALAI_API_KEY'); // Or replace with your key directly
$apiUrl = 'https://api.avalai.ir/v1/embeddings';

$data = [
'model' => 'text-embedding-3-small',
'input' => 'The food was delicious and the service was excellent.'
// Add other parameters like encoding_format, dimensions etc. if needed
// 'encoding_format' => 'float',
// 'dimensions' => 1024
];

$jsonData = json_encode($data);

$ch = curl_init($apiUrl);

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonData);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
'Content-Type: application/json',
'Authorization: Bearer ' . $apiKey,
'Content-Length: ' . strlen($jsonData)
]);

$response = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$err = curl_error($ch);

curl_close($ch);

if ($err) {
  echo "cURL Error #:" . $err;
} elseif ($httpcode >= 400) {
  echo "HTTP Error: " . $httpcode . "\n";
  echo $response;
} else {
  $responseData = json_decode($response, true);
  if (isset($responseData['data'][0]['embedding'])) {
    $embedding = $responseData['data'][0]['embedding'];
    echo "Length of embedding vector: " . count($embedding) . "\n";
    echo "First few values: [" . implode(', ', array_slice($embedding, 0, 5)) . "]\n";
  } else {
    echo "Response received:\n";
    print_r($responseData);
  }
}
?>

```

### Batch Processing

!> Feature Not Implemented! 
This functionality is currently under development and not yet available in AvalAI. We’ll announce its release through our official channels. Stay tuned for updates! 

You can embed multiple texts in a single request:

```python
response = client.embeddings.create(
    model="text-embedding-3-small",
    input=[
        "The food was delicious and the service was excellent.",
        "The restaurant was very expensive and the food was mediocre.",
        "I highly recommend this restaurant for its amazing atmosphere.",
    ],
)

# Process each embedding
for i, embedding in enumerate(response.data):
    print(f"Embedding {i}, length: {len(embedding.embedding)}")
```

## Response Format

```json
{
  "object": "list",
  "data": [
    {
      "object": "embedding",
      "embedding": [
        0.0023064255,
        -0.009327292,
        -0.0028842222,
        ...
      ],
      "index": 0
    }
  ],
  "model": "text-embedding-3-small",
  "usage": {
    "prompt_tokens": 8,
    "total_tokens": 8
  }
}
```

## Response Parameters

| Parameter | Type   | Description                                   |
| --------- | ------ | --------------------------------------------- |
| `object`  | string | The object type, which is always "list".      |
| `data`    | array  | An array of embedding objects.                |
| `model`   | string | The model used for generating embeddings.     |
| `usage`   | object | An object containing token usage information. |

### Embedding Object

| Parameter   | Type    | Description                                                                                            |
| ----------- | ------- | ------------------------------------------------------------------------------------------------------ |
| `object`    | string  | The object type, which is always "embedding".                                                          |
| `embedding` | array   | The embedding vector, which is an array of floats. The length of this array depends on the model used. |
| `index`     | integer | The index of the embedding in the input array.                                                         |

### Usage Object

| Parameter       | Type    | Description                                                             |
| --------------- | ------- | ----------------------------------------------------------------------- |
| `prompt_tokens` | integer | The number of tokens used in the input.                                 |
| `total_tokens`  | integer | The total number of tokens used (same as prompt_tokens for embeddings). |

## Available Models

AvalAI supports various embedding models from different providers:

| Provider | Model                   | Dimensions | Input Pricing | Output Pricing | Description                                                          |
| -------- | ----------------------- | ---------- | ------------- | -------------- | -------------------------------------------------------------------- |
| OpenAI   | text-embedding-3-large  | 3072       | $0.13 / 1M    | -              | Most capable embedding model for semantic search and text similarity |
| OpenAI   | text-embedding-3-small  | 1536       | $0.02 / 1M    | -              | Efficient embedding model with good performance-to-cost ratio        |
| OpenAI   | text-embedding-ada-002  | 1536       | $0.10 / 1M    | -              | Legacy embedding model for backward compatibility                    |
| Google   | gemini-embedding-2      | 128-3072   | $0.20 / 1M (text), $0.02 cached, $0.15 output | - | Next-gen multimodal embeddings (text/image/audio/video/PDF). Alias: `gemini-embedding-2-preview`. Dual endpoints: `v1/embeddings` + `v1beta/models/{model}:embedContent` |
| Google   | gemini-embedding-001    | 128-3072   | $0.15 / 1M    | $0.075 / 1M    | Advanced embedding model with task-specific optimization and flexible dimensions |
| Cohere   | embed-v-4-0             | 256-1536   | $0.12 / 1M (text), $0.47 / 1M (image) | - | Cohere Embed v4 via Azure AI - Up to 30x higher rate limits. 128k context window. |
| Cohere   | cohere.embed-v4:0       | 256-1536   | Contact       | -              | Cohere Embed v4 via AWS - Multimodal embeddings with 128k context window |
| Cohere   | embed-english-v3.0      | 1024       | $0.10 / 1M    | -              | English-optimized embedding model                                    |
| Cohere   | cohere.embed-multilingual-v3 | 1024       | $0.10 / 1M    | -              | Multilingual embedding model supporting 100+ languages               |
| Alibaba  | text-embedding-v4       | 2048       | $0.07 / 1M    | -              | Latest Qwen text embedding with advanced semantic search and RAG capabilities |
| Alibaba  | text-embedding-v3       | 1024       | $0.07 / 1M    | -              | Multilingual text embedding supporting 100+ languages                |
| Alibaba  | tongyi-embedding-vision-plus | 1152   | $0.09 / 1M    | -           | Multimodal embedding for cross-modal retrieval (text, images, videos) |
| Alibaba  | tongyi-embedding-vision-flash | 768    | $0.03-$0.09 / 1M | -           | Fast multimodal embedding for efficient cross-modal search           |
| Cloudflare | cf.qwen3-embedding-0.6b     | 1024   | $0.005 / 1M   | -           | Lightweight Qwen3 embedding model, fast and cost-effective           |
| Cloudflare | cf.plamo-embedding-1b       | 1024   | $0.005 / 1M   | -           | PLaMo embedding model with strong semantic understanding             |
| Cloudflare | cf.embeddinggemma-300m      | 768    | $0.005 / 1M   | -           | Compact Gemma-based embedding model for efficient search             |

## Common Use Cases

### Semantic Search

Embeddings can be used to find semantically similar documents:

```python
import numpy as np
from openai import OpenAI

client = OpenAI(
    api_key="your-avalai-api-key",  # Replace with your actual API key
    base_url="https://api.avalai.ir/v1",  # AvalAI API endpoint
)


# Function to compute cosine similarity
def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))


# Create embeddings for a query and documents
query = "delicious pasta"
documents = [
    "The restaurant serves amazing Italian food.",
    "The new smartphone has excellent battery life.",
    "Their pasta dishes are incredibly tasty and authentic.",
]

# Get query embedding
query_response = client.embeddings.create(model="text-embedding-3-small", input=query)
query_embedding = query_response.data[0].embedding

# Get document embeddings
doc_response = client.embeddings.create(model="text-embedding-3-small", input=documents)
doc_embeddings = [item.embedding for item in doc_response.data]

# Compute similarities
similarities = [
    cosine_similarity(query_embedding, doc_embedding)
    for doc_embedding in doc_embeddings
]

# Print results
for i, similarity in enumerate(similarities):
    print(f"Document {i}: Similarity = {similarity:.4f}")
    print(f"Text: {documents[i]}")
```

### Text Classification

Embeddings can be used with traditional ML models for classification:

```python
from sklearn.linear_model import LogisticRegression
import numpy as np
from openai import OpenAI

client = OpenAI(
    api_key="your-avalai-api-key",  # Replace with your actual API key
    base_url="https://api.avalai.ir/v1",  # AvalAI API endpoint
)

# Sample training data
texts = [
    "I love this product, it's amazing!",
    "This is the best purchase I've ever made.",
    "I'm very disappointed with the quality.",
    "This product is terrible, don't buy it.",
]
labels = [1, 1, 0, 0]  # 1 for positive, 0 for negative

# Get embeddings for training data
response = client.embeddings.create(model="text-embedding-3-small", input=texts)
embeddings = [item.embedding for item in response.data]

# Train a classifier
classifier = LogisticRegression()
classifier.fit(embeddings, labels)

# Classify new text
new_texts = ["I really enjoy using this.", "This doesn't work as advertised."]
new_response = client.embeddings.create(model="text-embedding-3-small", input=new_texts)
new_embeddings = [item.embedding for item in new_response.data]

# Predict
predictions = classifier.predict(new_embeddings)
for text, prediction in zip(new_texts, predictions):
    sentiment = "positive" if prediction == 1 else "negative"
    print(f"Text: '{text}' - Predicted sentiment: {sentiment}")
```

## Google Gemini Embeddings

Google's Gemini embedding models offer advanced features including task-specific optimization, flexible dimensionality control, and superior performance for various NLP tasks. AvalAI supports Gemini embeddings through both OpenAI-compatible and native Google GenAI SDK approaches.

### Using Gemini Embeddings with OpenAI Schema

You can use Gemini embeddings through the standard `v1/embeddings` endpoint with additional parameters in `extra_body` for advanced features:

#### Basic Gemini Embedding

```language-selector
python=:from openai import OpenAI

client = OpenAI(
    api_key="your-avalai-api-key",  # Replace with your actual API key
    base_url="https://api.avalai.ir/v1",  # AvalAI API endpoint
)

# Basic Gemini embedding
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

// Basic Gemini embedding
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

#### Advanced Gemini Features with Task Types

Gemini embeddings support task-specific optimization and custom dimensionality:

```language-selector
python=:# Advanced Gemini embedding with task type and custom dimensions
response = client.embeddings.create(
    model="gemini-embedding-001",
    input=[
        "What is the meaning of life?",
        "What is the purpose of existence?",
        "How do I bake a cake?",
    ],
    extra_body={"task_type": "SEMANTIC_SIMILARITY", "output_dimensionality": 768},
)

# Calculate cosine similarity between embeddings
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

embeddings = [item.embedding for item in response.data]
embeddings_matrix = np.array(embeddings)
similarity_matrix = cosine_similarity(embeddings_matrix)

print(f"Similarity between first two texts: {similarity_matrix[0, 1]:.4f}")
print(f"Similarity between first and third texts: {similarity_matrix[0, 2]:.4f}")

# Normalize embeddings for dimensions < 3072 (recommended)
if len(embeddings[0]) < 3072:
    normalized_embeddings = []
    for embedding in embeddings:
        embedding_array = np.array(embedding)
        normalized = embedding_array / np.linalg.norm(embedding_array)
        normalized_embeddings.append(normalized)
    print("Embeddings normalized for optimal performance")

javascript=:// Advanced Gemini embedding with task type and custom dimensions
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

// Simple dot product similarity (for normalized embeddings)
function dotProduct(a, b) {
    return a.reduce((sum, val, i) => sum + val * b[i], 0);
}

const similarity = dotProduct(embeddings[0], embeddings[1]);
console.log(`Similarity between first two texts: ${similarity.toFixed(4)}`);

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

#### Supported Task Types

| Task Type | Description | Best For |
|-----------|-------------|----------|
| `SEMANTIC_SIMILARITY` | Optimized for measuring text similarity | Recommendation systems, duplicate detection |
| `CLASSIFICATION` | Optimized for text classification tasks | Sentiment analysis, spam detection |
| `CLUSTERING` | Optimized for grouping similar texts | Document organization, market research |
| `RETRIEVAL_DOCUMENT` | Optimized for document indexing | RAG systems, search engines |
| `RETRIEVAL_QUERY` | Optimized for search queries | Custom search applications |
| `CODE_RETRIEVAL_QUERY` | Optimized for code search queries | Code search, documentation lookup |
| `QUESTION_ANSWERING` | Optimized for Q&A systems | Chatbots, FAQ systems |
| `FACT_VERIFICATION` | Optimized for fact-checking | Automated verification systems |

### Using Native Gemini API

You can also use Gemini embeddings through the native Google GenAI SDK endpoint for full access to Gemini-specific features:

```language-selector
python=:from google import genai

client = genai.Client(
    api_key="your-avalai-api-key",
    http_options={"api_version": "v1beta", "base_url": "https://api.avalai.ir"},
)

# Basic embedding with native API
result = client.models.embed_content(
    model="gemini-embedding-001", contents="What is the meaning of life?"
)

embedding = result.embeddings[0]
print(f"Embedding dimensions: {len(embedding.values)}")
print(f"First few values: {embedding.values[:5]}")

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

# Calculate similarities using the embeddings
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

embeddings_matrix = np.array([emb.values for emb in result.embeddings])
similarity_matrix = cosine_similarity(embeddings_matrix)

print(
    f"Similarity between 'meaning of life' and 'purpose of existence': {similarity_matrix[0, 1]:.4f}"
)
print(
    f"Similarity between 'meaning of life' and 'bake a cake': {similarity_matrix[0, 2]:.4f}"
)

javascript=:import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.AVALAI_API_KEY,
    httpOptions: {"apiVersion": "v1beta", "baseUrl": "https://api.avalai.ir"}}
});

// Basic embedding with native API
const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: "What is the meaning of life?"
});

const embedding = response.embeddings[0];
console.log(`Embedding dimensions: ${embedding.values.length}`);
console.log(`First few values: ${embedding.values.slice(0, 5)}`);

// Advanced usage with task type and custom dimensions
const advancedResponse = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: [
        "What is the meaning of life?",
        "What is the purpose of existence?",
        "How do I bake a cake?"
    ],
    taskType: "SEMANTIC_SIMILARITY",
    outputDimensionality: 768
});

console.log(`Generated ${advancedResponse.embeddings.length} embeddings`);

bash=:# Basic embedding with native API
curl "https://api.avalai.ir/v1beta/models/gemini-embedding-001:embedContent" \
  -H "x-goog-api-key: $AVALAI_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{
    "contents": [
      {"parts": [{"text": "What is the meaning of life?"}]}
    ]
  }'

# Advanced usage with task type and custom dimensions
curl "https://api.avalai.ir/v1beta/models/gemini-embedding-001:embedContent" \
  -H "x-goog-api-key: $AVALAI_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{
    "contents": [
      {"parts": [{"text": "What is the meaning of life?"}]},
      {"parts": [{"text": "What is the purpose of existence?"}]}
    ],
    "embedding_config": {
      "task_type": "SEMANTIC_SIMILARITY",
      "output_dimensionality": 768
    }
  }'

```

### Gemini Embedding Response Format (Native API)

When using the native Gemini API, the response format differs from the OpenAI schema:

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

### Output Dimensionality Control

Gemini embeddings support Matryoshka Representation Learning (MRL), allowing you to use smaller dimensions without significant quality loss:

- **3072 dimensions**: Full model capacity (default, pre-normalized)
- **1536 dimensions**: Balanced performance and efficiency
- **768 dimensions**: Efficient with good performance
- **512 dimensions**: Compact with acceptable performance
- **256 dimensions**: Very compact
- **128 dimensions**: Minimal size

> **Important**: For dimensions other than 3072, you should normalize the embeddings for optimal semantic similarity performance:

```python
import numpy as np


# Normalize embeddings for dimensions < 3072
def normalize_embedding(embedding):
    embedding_array = np.array(embedding)
    return embedding_array / np.linalg.norm(embedding_array)


# Example usage
if len(embedding) < 3072:
    normalized_embedding = normalize_embedding(embedding)
```

### RAG System Example with Gemini Embeddings

Here's a complete example of using Gemini embeddings for a Retrieval-Augmented Generation (RAG) system:

```python
import numpy as np
from openai import OpenAI
from sklearn.metrics.pairwise import cosine_similarity

client = OpenAI(
    api_key="your-avalai-api-key",
    base_url="https://api.avalai.ir/v1",
)

# Sample knowledge base
documents = [
    "Paris is the capital of France and known for the Eiffel Tower.",
    "Tokyo is the capital of Japan and famous for its technology and culture.",
    "London is the capital of England and home to Big Ben.",
    "Berlin is the capital of Germany and known for its rich history.",
    "Rome is the capital of Italy and famous for the Colosseum.",
]

# Create embeddings for knowledge base using RETRIEVAL_DOCUMENT task type
doc_response = client.embeddings.create(
    model="gemini-embedding-001",
    input=documents,
    extra_body={"task_type": "RETRIEVAL_DOCUMENT", "output_dimensionality": 768},
)

doc_embeddings = np.array([item.embedding for item in doc_response.data])

# Normalize embeddings for optimal similarity computation
doc_embeddings = doc_embeddings / np.linalg.norm(doc_embeddings, axis=1, keepdims=True)


def search_knowledge_base(query, top_k=2):
    # Create query embedding using RETRIEVAL_QUERY task type
    query_response = client.embeddings.create(
        model="gemini-embedding-001",
        input=query,
        extra_body={"task_type": "RETRIEVAL_QUERY", "output_dimensionality": 768},
    )

    query_embedding = np.array(query_response.data[0].embedding)
    query_embedding = query_embedding / np.linalg.norm(query_embedding)

    # Calculate similarities
    similarities = cosine_similarity([query_embedding], doc_embeddings)[0]

    # Get top-k most similar documents
    top_indices = np.argsort(similarities)[-top_k:][::-1]

    results = []
    for idx in top_indices:
        results.append({"document": documents[idx], "similarity": similarities[idx]})

    return results


# Example usage
query = "What's the capital of France?"
results = search_knowledge_base(query)

print(f"Query: {query}")
for i, result in enumerate(results):
    print(f"{i+1}. {result['document']} (similarity: {result['similarity']:.4f})")
```

## Error Handling

The API may return various error codes:

| Status Code | Description                                                    |
| ----------- | -------------------------------------------------------------- |
| 400         | Bad Request - Your request is invalid.                         |
| 401         | Unauthorized - Your API key is wrong.                          |
| 403         | Forbidden - You don't have permission to access this resource. |
| 404         | Not Found - The specified resource could not be found.         |
| 429         | Too Many Requests - You have exceeded your rate limit.         |
| 500         | Internal Server Error - We had a problem with our server.      |

For more information on handling errors, see the [Error Handling](en/guides/error-handling.md) guide.

## Related Resources

- [Models](en/models/model-details.md) - Learn about available embedding models
- [Authentication](en/api-reference/authentication.md) - Learn about authentication methods
- [Rate Limits](en/guides/rate-limits.md) - Learn about API rate limits
