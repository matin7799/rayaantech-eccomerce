# Rerank API

The Rerank API allows you to improve the relevance of search results or document lists by re-ordering them based on their relevance to a given query. This is particularly useful for applications requiring highly relevant search results from a large corpus of documents.

> **Important Note:** The rerank endpoint is not supported by the official OpenAI SDK. You need to call the HTTP method or REST API directly as shown in the examples below.

## Endpoint

```
POST https://api.avalai.ir/v1/rerank
```

## Request Body

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `model` | string | Yes | ID of the model to use. Supports `cohere-rerank-v4.0-pro`, `cohere-rerank-v4.0-fast`, `cohere.rerank-v3-5:0`, and `qwen3-rerank`. |
| `query` | string | Yes | The search query to rank documents against. |
| `documents` | array | Yes | An array of strings or objects representing the documents to be reranked. |
| `top_n` | integer | No | The number of top results to return. Default is all documents. |
| `return_documents` | boolean | No | Whether to return the document content in the response. Default is `true`. |
| `user` | string | No | A unique identifier representing your end-user, which can help monitor and detect abuse. |

### Document Format

Documents can be provided in two formats:

1. As strings:
```json
"documents": [
    "Document text 1",
    "Document text 2",
    "Document text 3"
  ]
```

2. As objects with IDs:
```json
"documents": [
    {
      "id": "doc1",
      "text": "Document text 1"
    },
    {
      "id": "doc2",
      "text": "Document text 2"
    },
    {
      "id": "doc3",
      "text": "Document text 3"
    }
  ]
```

## Examples

### Basic Reranking

```language-selector
bash=:curl https://api.avalai.ir/v1/rerank \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
  "model": "cohere.rerank-v3-5:0",
  "query": "What are the benefits of renewable energy?",
  "documents": [
    "Renewable energy sources like solar and wind are crucial for combating climate change.",
    "Traditional fossil fuels have significant environmental impacts.",
    "Investing in green technology can lead to economic growth and job creation.",
    "Solar panels convert sunlight into electricity."
  ]
}'

python=:import requests
import json

API_KEY = "YOUR_AVALAI_API_KEY"
AVALAI_BASE_URL = "https://api.avalai.ir/v1"

headers = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}

data = {
    "model": "cohere.rerank-v3-5:0",
    "query": "What are the benefits of renewable energy?",
    "documents": [
        "Renewable energy sources like solar and wind are crucial for combating climate change.",
        "Traditional fossil fuels have significant environmental impacts.",
        "Investing in green technology can lead to economic growth and job creation.",
        "Solar panels convert sunlight into electricity.",
    ],
}

response = requests.post(f"{AVALAI_BASE_URL}/rerank", headers=headers, json=data)

if response.status_code == 200:
    reranked_documents = response.json().get("results")
    for doc in reranked_documents:
        print(
            f"Index: {doc['index']}, Relevance Score: {doc['relevance_score']}, Document: {doc['document']['text']}"
        )
else:
    print(f"Error: {response.status_code} - {response.text}")

javascript=:const fetch = require("node-fetch"); // or use browser fetch

const API_KEY = process.env.AVALAI_API_KEY;
const AVALAI_BASE_URL = "https://api.avalai.ir/v1";

async function rerankDocuments() {
  const data = {
    model: "cohere.rerank-v3-5:0",
    query: "What are the benefits of renewable energy?",
    documents: [
      "Renewable energy sources like solar and wind are crucial for combating climate change.",
      "Traditional fossil fuels have significant environmental impacts.",
      "Investing in green technology can lead to economic growth and job creation.",
      "Solar panels convert sunlight into electricity.",
    ],
  };

  try {
    const response = await fetch(`${AVALAI_BASE_URL}/rerank`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const responseData = await response.json();
      const rerankedDocuments = responseData.results;
      rerankedDocuments.forEach((doc) => {
        console.log(
          `Index: ${doc.index}, Relevance Score: ${doc.relevance_score}, Document: ${doc.document.text}`,
        );
      });
    } else {
      console.error(`Error: ${response.status} - ${await response.text()}`);
    }
  } catch (error) {
    console.error("Request failed:", error);
  }
}

rerankDocuments();

go=:package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
)

type RerankRequest struct {
	Model     string   `json:"model"`
	Query     string   `json:"query"`
	Documents []string `json:"documents"`
	TopN      int      `json:"top_n,omitempty"`
}

type Document struct {
	Text string `json:"text"`
}

type Result struct {
	Index          int      `json:"index"`
	RelevanceScore float64  `json:"relevance_score"`
	Document       Document `json:"document"`
}

type RerankResponse struct {
	Results []Result `json:"results"`
}

func main() {
	apiKey := os.Getenv("AVALAI_API_KEY")
	if apiKey == "" {
		fmt.Println("Please set the AVALAI_API_KEY environment variable")
		return
	}

	baseURL := "https://api.avalai.ir/v1"

	reqBody := RerankRequest{
		Model: "cohere.rerank-v3-5:0",
		Query: "What are the benefits of renewable energy?",
		Documents: []string{
			"Renewable energy sources like solar and wind are crucial for combating climate change.",
			"Traditional fossil fuels have significant environmental impacts.",
			"Investing in green technology can lead to economic growth and job creation.",
			"Solar panels convert sunlight into electricity.",
		},
	}

	jsonData, err := json.Marshal(reqBody)
	if err != nil {
		fmt.Printf("Error marshaling request: %v\n", err)
		return
	}

	req, err := http.NewRequest("POST", baseURL+"/rerank", bytes.NewBuffer(jsonData))
	if err != nil {
		fmt.Printf("Error creating request: %v\n", err)
		return
	}

	req.Header.Set("Authorization", "Bearer "+apiKey)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Printf("Error making request: %v\n", err)
		return
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Printf("Error reading response: %v\n", err)
		return
	}

	if resp.StatusCode != 200 {
		fmt.Printf("Error: %d - %s\n", resp.StatusCode, string(body))
		return
	}

	var rerankResp RerankResponse
	err = json.Unmarshal(body, &rerankResp)
	if err != nil {
		fmt.Printf("Error unmarshaling response: %v\n", err)
		return
	}

	for _, result := range rerankResp.Results {
		fmt.Printf("Index: %d, Relevance Score: %.4f, Document: %s\n",
			result.Index, result.RelevanceScore, result.Document.Text)
	}
}

php=:<?php
// PHP Example for Rerank via AvalAI

$apiKey = getenv('AVALAI_API_KEY'); // Or replace with your key directly
$apiUrl = 'https://api.avalai.ir/v1/rerank';

$data = [
    'model' => 'cohere.rerank-v3-5:0',
    'query' => 'What are the benefits of renewable energy?',
    'documents' => [
        'Renewable energy sources like solar and wind are crucial for combating climate change.',
        'Traditional fossil fuels have significant environmental impacts.',
        'Investing in green technology can lead to economic growth and job creation.',
        'Solar panels convert sunlight into electricity.'
    ]
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
    if (isset($responseData['results'])) {
        foreach ($responseData['results'] as $result) {
            echo "Index: " . $result['index'] . 
                 ", Relevance Score: " . $result['relevance_score'] . 
                 ", Document: " . $result['document']['text'] . "\n";
        }
    } else {
        echo "Response received:\n";
        print_r($responseData);
    }
}
?>

```

### Advanced Reranking with Document Objects and Top-N Results

```python
import requests
import json

API_KEY = "YOUR_AVALAI_API_KEY"
AVALAI_BASE_URL = "https://api.avalai.ir/v1"

headers = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}

data = {
    "model": "cohere.rerank-v3-5:0",
    "query": "climate change solutions",
    "documents": [
        {
            "id": "doc1",
            "text": "Solar energy can reduce carbon emissions significantly.",
        },
        {"id": "doc2", "text": "Electric vehicles are becoming more affordable."},
        {
            "id": "doc3",
            "text": "Reforestation efforts help absorb CO2 from the atmosphere.",
        },
        {
            "id": "doc4",
            "text": "Sustainable agriculture practices reduce methane emissions.",
        },
        {
            "id": "doc5",
            "text": "Energy-efficient buildings can reduce heating and cooling needs.",
        },
    ],
    "top_n": 3,  # Return only the top 3 most relevant results
}

response = requests.post(f"{AVALAI_BASE_URL}/rerank", headers=headers, json=data)

if response.status_code == 200:
    reranked_documents = response.json().get("results")
    print(f"Top {len(reranked_documents)} most relevant documents:")
    for doc in reranked_documents:
        print(
            f"ID: {doc['document'].get('id', 'N/A')}, Score: {doc['relevance_score']:.4f}"
        )
        print(f"Text: {doc['document']['text']}\n")
else:
    print(f"Error: {response.status_code} - {response.text}")
```

## Response Format

```json
{
  "results": [
    {
      "index": 0,
      "relevance_score": 0.9876,
      "document": {
        "text": "Renewable energy sources like solar and wind are crucial for combating climate change."
      }
    },
    {
      "index": 2,
      "relevance_score": 0.8765,
      "document": {
        "text": "Investing in green technology can lead to economic growth and job creation."
      }
    },
    {
      "index": 1,
      "relevance_score": 0.7654,
      "document": {
        "text": "Traditional fossil fuels have significant environmental impacts."
      }
    },
    {
      "index": 3,
      "relevance_score": 0.6543,
      "document": {
        "text": "Solar panels convert sunlight into electricity."
      }
    }
  ]
}
```

## Response Parameters

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `results` | array | An array of result objects, sorted by relevance score in descending order. |

### Result Object

| Parameter | Type | Description |
| ------------- | ------- | ----------- |
| `index` | integer | The index of the document in the original input array. |
| `relevance_score` | float | A score between 0 and 1 indicating the relevance of the document to the query. Higher values indicate greater relevance. |
| `document` | object | The document object containing the text and any original ID if provided. |

## Available Models

Currently, AvalAI supports the following reranking models:

| Provider | Model | Context Window | Pricing | Description |
| -------- | ----- | -------------- | ------- | ----------- |
| Cohere | cohere-rerank-v4.0-pro | 32,768 tokens | $0.0025/query | Highest-quality reranking model with 8x larger context window. Supports 100+ languages and YAML-structured documents. |
| Cohere | cohere-rerank-v4.0-fast | 32,768 tokens | $0.002/query | Cost-effective reranking model optimized for high-throughput applications. Supports 100+ languages. |
| Cohere | cohere.rerank-v3-5:0 | 4,096 tokens | $1.00/1K units | Previous generation reranking model. |

## Common Use Cases

### Improving RAG Systems

Reranking is particularly valuable for Retrieval-Augmented Generation (RAG) systems, where the quality of retrieved documents directly impacts the final output:

```python
import requests
from openai import OpenAI

# Step 1: Retrieve candidate documents (simplified example)
candidate_documents = [
    "The Paris Agreement is an international treaty on climate change.",
    "Global warming is causing sea levels to rise worldwide.",
    "Renewable energy sources include solar, wind, and hydroelectric power.",
    "Electric vehicles produce fewer emissions than gas-powered cars.",
    "Carbon capture technologies can help reduce greenhouse gas emissions.",
]

# Step 2: Rerank documents based on the query
query = "How can we reduce carbon emissions?"
rerank_data = {
    "model": "cohere.rerank-v3-5:0",
    "query": query,
    "documents": candidate_documents,
}

response = requests.post(
    "https://api.avalai.ir/v1/rerank",
    headers={"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"},
    json=rerank_data,
)

# Step 3: Extract the most relevant documents
reranked_docs = []
if response.status_code == 200:
    results = response.json().get("results")
    reranked_docs = [
        result["document"]["text"] for result in results[:2]
    ]  # Top 2 most relevant

# Step 4: Use reranked documents in a language model prompt
client = OpenAI(
    api_key="your-avalai-api-key",
    base_url="https://api.avalai.ir/v1",
)

context = "\n".join(reranked_docs)
prompt = (
    f"Based on the following information:\n\n{context}\n\nAnswer the question: {query}"
)

completion = client.chat.completions.create(
    model="gpt-5.5", messages=[{"role": "user", "content": prompt}]
)

print(completion.choices[0].message.content)
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `cohere.rerank-v3-5:0` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

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


### Enhancing Search Results

Reranking can significantly improve search relevance by considering semantic meaning beyond keyword matching:

```python
# Simple search function that returns documents containing any of the query terms
def keyword_search(query, documents):
    query_terms = query.lower().split()
    results = []
    for doc in documents:
        if any(term in doc.lower() for term in query_terms):
            results.append(doc)
    return results


# Document collection
documents = [
    "Machine learning algorithms require large datasets for training.",
    "Neural networks are a subset of machine learning models.",
    "Deep learning has revolutionized computer vision tasks.",
    "Data preprocessing is an important step in any machine learning pipeline.",
    "Transfer learning allows models to leverage knowledge from pre-trained networks.",
    "Supervised learning uses labeled data to train predictive models.",
    "Unsupervised learning finds patterns in unlabeled data.",
    "Reinforcement learning trains agents through reward mechanisms.",
]

# User query
query = "How do neural networks learn from data?"

# Step 1: Get initial results with simple keyword matching
initial_results = keyword_search(query, documents)
print("Initial keyword search results:")
for i, doc in enumerate(initial_results):
    print(f"{i+1}. {doc}")

# Step 2: Rerank the results to improve relevance
rerank_data = {
    "model": "cohere.rerank-v3-5:0",
    "query": query,
    "documents": initial_results,
}

response = requests.post(
    "https://api.avalai.ir/v1/rerank",
    headers={"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"},
    json=rerank_data,
)

# Step 3: Display reranked results
print("\nReranked results:")
if response.status_code == 200:
    results = response.json().get("results")
    for i, result in enumerate(results):
        print(f"{i+1}. [{result['relevance_score']:.4f}] {result['document']['text']}")
```

## Error Handling

The API may return various error codes:

| Status Code | Description |
| ----------- | ----------- |
| 400 | Bad Request - Your request is invalid. |
| 401 | Unauthorized - Your API key is wrong. |
| 403 | Forbidden - You don't have permission to access this resource. |
| 404 | Not Found - The specified resource could not be found. |
| 429 | Too Many Requests - You have exceeded your rate limit. |
| 500 | Internal Server Error - We had a problem with our server. |

For more information on handling errors, see the [Error Handling](en/guides/error-handling.md) guide.

## Related Resources

- [Cohere Models](en/providers/cohere.md) - Learn about available Cohere models
- [Authentication](en/api-reference/authentication.md) - Learn about authentication methods
- [Rate Limits](en/guides/rate-limits.md) - Learn about API rate limits
- [RAG Best Practices](en/guides/rag-best-practices.md) - Learn how to optimize RAG systems