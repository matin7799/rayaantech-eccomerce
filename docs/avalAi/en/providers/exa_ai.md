# Exa AI Search

AvalAI provides access to Exa AI's neural search engine, optimized for semantic queries and delivering highly relevant results based on meaning rather than just keywords.

## Search Tools

Exa AI specializes in neural search technology, leveraging advanced AI models to understand query intent and provide semantically relevant results.

### Exa AI Search

Neural search engine optimized for semantic understanding and relevance.

| Feature        | Details                                                         |
| -------------- | --------------------------------------------------------------- |
| Tool ID        | `exa_ai-search`                                                 |
| Endpoint       | `v1/search/exa_ai-search` or `v1/search`                      |
| Max results    | 1-20 results per query                                          |
| Pricing        | $0.025 per query                                                |
| Capabilities   | Semantic search, neural understanding, context-aware results    |
| Strengths      | Superior semantic understanding, context-aware, AI-powered      |
| Best for       | Complex queries, research, semantic search applications         |

**Usage Example:**

```language-selector
bash=:curl https://api.avalai.ir/v1/search/exa_ai-search \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "latest breakthroughs in quantum computing",
    "max_results": 10
  }'

python=:import requests

response = requests.post(
    "https://api.avalai.ir/v1/search/exa_ai-search",
    headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
    json={"query": "latest breakthroughs in quantum computing", "max_results": 10},
)

results = response.json()
for result in results["results"]:
    print(f"{result['title']}: {result['url']}")

javascript=:const response = await fetch("https://api.avalai.ir/v1/search/exa_ai-search", {
    method: "POST",
    headers: {
        "Authorization": `Bearer ${process.env.AVALAI_API_KEY}`,
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        query: "latest breakthroughs in quantum computing",
        max_results: 10
    })
});

const data = await response.json();
data.results.forEach(result => {
    console.log(`${result.title}: ${result.url}`);
});

```

## Semantic Search with Domain Filtering

Exa AI's neural search excels at understanding complex queries and can be combined with domain filtering for targeted results.

```language-selector
bash=:curl https://api.avalai.ir/v1/search \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "search_tool_name": "exa_ai-search",
    "query": "machine learning research papers",
    "max_results": 10,
    "search_domain_filter": ["arxiv.org", "paperswithcode.com", "scholar.google.com"]
  }'

python=:import requests

response = requests.post(
    "https://api.avalai.ir/v1/search",
    headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
    json={
        "search_tool_name": "exa_ai-search",
        "query": "machine learning research papers",
        "max_results": 10,
        "search_domain_filter": [
            "arxiv.org",
            "paperswithcode.com",
            "scholar.google.com",
        ],
    },
)

results = response.json()

javascript=:const response = await fetch("https://api.avalai.ir/v1/search", {
    method: "POST",
    headers: {
        "Authorization": `Bearer ${process.env.AVALAI_API_KEY}`,
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        search_tool_name: "exa_ai-search",
        query: "machine learning research papers",
        max_results: 10,
        search_domain_filter: ["arxiv.org", "paperswithcode.com", "scholar.google.com"]
    })
});

const data = await response.json();

```

## Request Parameters

Exa AI search supports the following parameters:

| Parameter             | Type    | Required | Description                                          |
| --------------------- | ------- | -------- | ---------------------------------------------------- |
| query                 | string  | Yes      | Search query string                                  |
| max_results           | integer | No       | Maximum number of results (1-20). Default: 10        |
| search_domain_filter  | array   | No       | List of domains to filter results (max 20 domains)   |
| max_tokens_per_page   | integer | No       | Maximum tokens per page to process. Default: 1024    |
| country               | string  | No       | Country code filter (e.g., "US", "GB", "DE")         |

## Response Format

Exa AI searches return results in the standard search response format:

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

## Using Exa AI Search via AvalAI

Access Exa AI's neural search using the AvalAI Search API endpoint. You can specify the tool either in the URL path or in the request body.

```python
import requests

# Option 1: Tool in URL
response = requests.post(
    "https://api.avalai.ir/v1/search/exa_ai-search",
    headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
    json={"query": "artificial intelligence safety research", "max_results": 10},
)

# Option 2: Tool in body
response = requests.post(
    "https://api.avalai.ir/v1/search",
    headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
    json={
        "search_tool_name": "exa_ai-search",
        "query": "deep learning architectures for NLP",
        "max_results": 10,
        "search_domain_filter": ["arxiv.org", "proceedings.mlr.press"],
    },
)

results = response.json()
```

## When to Use Exa AI Search

**Use Exa AI Search** when:
- You need semantic understanding of complex queries
- Query intent matters more than exact keyword matching
- You're building research or knowledge discovery applications
- You need AI-powered relevance ranking
- You're working with technical or specialized content
- Context and meaning are critical for result quality

## Key Advantages

1. **Semantic Understanding**: Goes beyond keyword matching to understand query intent
2. **Neural Ranking**: AI-powered relevance scoring for better result quality
3. **Context Awareness**: Understands relationships and context within queries
4. **Research-Optimized**: Particularly effective for academic and technical searches
5. **Quality over Quantity**: Focuses on highly relevant results rather than volume

## Related Resources

- [Search API Reference](en/api-reference/search.md)
- [Search API Announcement](en/news/2025-10-26-search-api-launched.md)
- [Pricing Information](en/pricing.md)
- [Authentication](en/api-reference/authentication.md)
- [Exa AI Official Documentation](https://docs.exa.ai)