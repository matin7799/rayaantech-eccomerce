# Manual RAG with Embeddings

Retrieval-augmented generation (RAG) helps a model answer from your own documents. Hosted file search can simplify that architecture, but if you need full control over storage, filtering, scoring, or AvalAI features that are not yet available, you can build a small manual RAG pipeline with embeddings and the Responses API.

> This guide is adapted from the official [OpenAI Cookbook](https://developers.openai.com/cookbook), especially the [question answering with embeddings](https://github.com/openai/openai-cookbook/blob/main/examples/Question_answering_using_embeddings.ipynb) and [file search with Responses](https://github.com/openai/openai-cookbook/blob/main/examples/File_Search_Responses.ipynb) examples, with AvalAI-specific endpoint and API key changes.

## What You Will Build

This example indexes a few local support-policy snippets, embeds them, retrieves the most relevant snippets for a user question, and asks the model to answer only from retrieved context.

Use this manual approach when:

- You want to use your own database or search service.
- You need deterministic filtering before generation.
- You want to evaluate retrieval quality directly.
- Hosted vector store or file-search behavior is not available for your chosen endpoint.

## Python End-to-End Example

Install dependencies:

```bash
pip install openai numpy
export AVALAI_API_KEY="your-avalai-api-key"
```

Create a small `rag_demo.py`:

```python
import os
from dataclasses import dataclass

import numpy as np
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["AVALAI_API_KEY"],
    base_url="https://api.avalai.ir/v1",
)


@dataclass
class Document:
    id: str
    title: str
    text: str
    embedding: list[float] | None = None


documents = [
    Document(
        id="refunds",
        title="Refund policy",
        text=(
            "Customers can request a refund within 14 days of purchase if usage "
            "is below 10 percent of the purchased credit package."
        ),
    ),
    Document(
        id="rate-limits",
        title="Rate limit policy",
        text=(
            "Rate limits are tier based. Higher tiers increase requests per minute "
            "and tokens per minute. Applications should retry 429 errors with backoff."
        ),
    ),
    Document(
        id="keys",
        title="API key handling",
        text=(
            "API keys must be stored in environment variables or secret managers. "
            "Never expose keys in browser code, mobile apps, logs, or public repositories."
        ),
    ),
]


def embed_texts(texts: list[str]) -> list[list[float]]:
    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=texts,
    )
    return [item.embedding for item in response.data]


def cosine_similarity(a: list[float], b: list[float]) -> float:
    va = np.array(a)
    vb = np.array(b)
    return float(np.dot(va, vb) / (np.linalg.norm(va) * np.linalg.norm(vb)))


def index_documents() -> None:
    embeddings = embed_texts([doc.text for doc in documents])
    for doc, embedding in zip(documents, embeddings):
        doc.embedding = embedding


def retrieve(query: str, k: int = 2) -> list[tuple[Document, float]]:
    query_embedding = embed_texts([query])[0]
    scored = [
        (doc, cosine_similarity(query_embedding, doc.embedding))
        for doc in documents
        if doc.embedding is not None
    ]
    return sorted(scored, key=lambda item: item[1], reverse=True)[:k]


def answer_with_context(question: str) -> str:
    matches = retrieve(question)
    context = "\n\n".join(
        f"[{doc.id}] {doc.title}\n{doc.text}" for doc, score in matches
    )

    response = client.responses.create(
        model="gpt-5.5",
        instructions=(
            "Answer only from the provided context. If the context is not enough, "
            "say that the documentation does not contain the answer. Cite source IDs."
        ),
        input=f"Context:\n{context}\n\nQuestion: {question}",
    )
    return response.output_text


if __name__ == "__main__":
    index_documents()
    question = "How should my app react when it gets rate limited?"
    print(answer_with_context(question))
```

Run it:

```bash
python rag_demo.py
```

## JavaScript Version

```javascript
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const documents = [
  {
    id: "refunds",
    title: "Refund policy",
    text: "Customers can request a refund within 14 days of purchase if usage is below 10 percent of the purchased credit package.",
  },
  {
    id: "rate-limits",
    title: "Rate limit policy",
    text: "Rate limits are tier based. Higher tiers increase requests per minute and tokens per minute. Applications should retry 429 errors with backoff.",
  },
  {
    id: "keys",
    title: "API key handling",
    text: "API keys must be stored in environment variables or secret managers. Never expose keys in browser code, mobile apps, logs, or public repositories.",
  },
];

async function embedTexts(texts) {
  const response = await client.embeddings.create({
    model: "text-embedding-3-small",
    input: texts,
  });
  return response.data.map((item) => item.embedding);
}

function cosineSimilarity(a, b) {
  const dot = a.reduce((sum, value, index) => sum + value * b[index], 0);
  const normA = Math.sqrt(a.reduce((sum, value) => sum + value * value, 0));
  const normB = Math.sqrt(b.reduce((sum, value) => sum + value * value, 0));
  return dot / (normA * normB);
}

async function retrieve(question, k = 2) {
  const documentEmbeddings = await embedTexts(documents.map((doc) => doc.text));
  const queryEmbedding = (await embedTexts([question]))[0];

  return documents
    .map((doc, index) => ({
      ...doc,
      score: cosineSimilarity(queryEmbedding, documentEmbeddings[index]),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}

async function answerWithContext(question) {
  const matches = await retrieve(question);
  const context = matches
    .map((doc) => `[${doc.id}] ${doc.title}\n${doc.text}`)
    .join("\n\n");

  const response = await client.responses.create({
    model: "gpt-5.5",
    instructions:
      "Answer only from the provided context. If the context is not enough, say that the documentation does not contain the answer. Cite source IDs.",
    input: `Context:\n${context}\n\nQuestion: ${question}`,
  });

  return response.output_text;
}

console.log(
  await answerWithContext("How should my app react when it gets rate limited?"),
);
```

## cURL Building Blocks

Use cURL when you want to test each step manually.

```bash
curl https://api.avalai.ir/v1/embeddings \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "text-embedding-3-small",
    "input": [
      "Rate limits are tier based. Applications should retry 429 errors with backoff.",
      "API keys must be stored in environment variables or secret managers."
    ]
  }'

curl https://api.avalai.ir/v1/responses \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-5.5",
    "instructions": "Answer only from the provided context and cite source IDs.",
    "input": "Context:\n[rate-limits] Rate limits are tier based. Applications should retry 429 errors with backoff.\n\nQuestion: How should my app react when it gets rate limited?"
  }'
```

## Retrieval Quality Checks

Do not wait until generation fails to test retrieval. Track these checks as you grow the index:

- For each test question, store the expected document ID.
- Compute `Recall@k`: whether the expected document appears in the top `k`.
- Compute `MRR`: how highly the first correct document ranks.
- Log the retrieved IDs beside every generated answer.
- Review low-score matches before increasing `k`; more context can make answers slower and noisier.

## Best Practices

- Chunk long documents by section, not by arbitrary character count, when headings matter.
- Keep source IDs stable so generated citations remain useful.
- Put retrieved context before the user question and separate chunks clearly.
- Ask the model to say when context is insufficient.
- Cache embeddings for unchanged documents; re-embedding on every request is slow and expensive.

## Related Links

- [Embeddings API Reference](en/api-reference/embeddings.md)
- [Responses API Reference](en/api-reference/responses.md)
- [RAG Best Practices](en/guides/rag-best-practices.md)
- [Rate Limits](en/guides/rate-limits.md)
