# New Alibaba Qwen3 Model, Web Search Tool, and Rerank Endpoint Added to AvalAI

**Date:** 2025-05-13 (1404-02-24)

## Summary

AvalAI is excited to announce three major new additions available starting today, May 13, 2025: the powerful `Alibaba Qwen3-235B-A22B-FP8-TPUT` model, the `web_search_preview` tool for OpenAI models, and the new `v1/rerank` endpoint featuring `cohere.rerank-v3-5:0`. These enhancements expand your capabilities in advanced AI, real-time information access, and search result optimization.

---

## Details

### Alibaba Qwen3-235B-A22B-FP8-TPUT Model

We've integrated the flagship model from Alibaba's Qwen3 family, [`qwen3-235b-a22b-fp8-tput`](/fa/models/qwen3-235b-a22b-fp8-tput.md). This model boasts 235 billion parameters and offers a "hybrid" approach, capable of both rapid responses and in-depth reasoning for complex tasks.

**Key Technical Capabilities:**

- **Mixture of Experts (MoE) Architecture:** For efficient processing.
- **Language Support:** Understands and generates content in 119 languages.
- **Extensive Training:** Trained on a diverse dataset of over 36 trillion tokens.
- **Advanced Features:** Supports function calling, parallel function calling, and response schema.

This model is designed to deliver high throughput and competitive performance in coding, math, and general reasoning tasks.

```language-selector
python=:from openai import OpenAI

client = OpenAI(api_key="YOUR_AVALAI_API_KEY", base_url="https://api.avalai.ir/v1")

completion = client.chat.completions.create(
    model="qwen3-235b-a22b-fp8-tput",
    messages=[
        {
            "role": "user",
            "content": "Explain the concept of Mixture of Experts in large language models.",
        }
    ],
)
print(completion.choices[0].message.content)

javascript=:import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

async function main() {
  const completion = await client.chat.completions.create({
    model: "qwen3-235b-a22b-fp8-tput",
    messages: [
      {
        role: "user",
        content:
          "Explain the concept of Mixture of Experts in large language models.",
      },
    ],
  });
  console.log(completion.choices[0].message.content);
}

main();

```

### Web Search Tool for OpenAI Models

Enhance your OpenAI model interactions with the [`web_search_preview`](/guides/tools-web-search.md) tool, now available via the [`v1/responses`](/api-reference/responses.md) endpoint. This tool empowers models to access and incorporate the latest information from the web into their responses.

**Key Technical Capabilities:**

- **Real-time Information:** Allows models to fetch up-to-date information.
- **User Location Customization:** Refine search results based on geography (country, city, region, timezone).
- **Search Context Size Control:** Manage the amount of web context retrieved (`high`, `medium`, `low`) to balance cost, quality, and latency.
- **Cited Responses:** Output includes inline citations and annotation objects (`url_citation`) with URL, title, and location of sources.

To use it, include `{ "type": "web_search" }` in the `tools` array of your API request.

```language-selector
python=:from openai import OpenAI

client = OpenAI(api_key="YOUR_AVALAI_API_KEY", base_url="https://api.avalai.ir/v1")

response = client.responses.create(
    model="gpt-4o",  # Example OpenAI model
    tools=[{"type": "web_search"}],
    input="What are the latest developments in AI ethics as of today?",
)
print(response.output_text)

javascript=:import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

async function main() {
  const response = await client.responses.create({
    model: "gpt-4o", // Example OpenAI model
    tools: [{ type: "web_search" }],
    input: "What are the latest developments in AI ethics as of today?",
  });
  console.log(response.output_text);
}

main();

```

### New `v1/rerank` Endpoint with Cohere

We are also introducing the `v1/rerank` endpoint, initially supporting the `cohere.rerank-v3-5:0` model. This endpoint allows you to improve the relevance of search results or document lists by re-ordering them based on a query.

**Key Technical Capabilities:**

- **Improved Relevance:** Reorders a list of documents based on their relevance to a given query.
- **Semantic Understanding:** Leverages Cohere's advanced language understanding for accurate reranking.

This is particularly useful for applications requiring highly relevant search results from a large corpus of documents.

```language-selector
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

```

---

## Related Links

- [Alibaba Qwen3-235B-A22B-FP8-TPUT Model Documentation](/fa/models/qwen3-235b-a22b-fp8-tput.md)
- [Web Search Tool Guide](/guides/tools-web-search.md)
- [Cohere Documentation](/fa/providers/cohere.md)
- [Responses API Reference](/api-reference/responses.md)