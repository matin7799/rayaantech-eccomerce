# Parallel AI Search

AvalAI provides access to Parallel AI's fast parallel search processing capabilities, offering both standard and pro versions for different performance needs.

## Search Tools

Parallel AI specializes in fast parallel search processing, delivering quick results through efficient concurrent searches.

### Parallel AI Search (Standard)

Fast parallel search processing with cost-effective pricing.

| Feature        | Details                                                |
| -------------- | ------------------------------------------------------ |
| Tool ID        | `parallel_ai-search`                                   |
| Endpoint       | `v1/search/parallel_ai-search` or `v1/search`        |
| Max results    | 1-20 results per query                                 |
| Pricing        | $0.004 per query                                       |
| Capabilities   | Parallel search processing, domain filtering, fast results |
| Strengths      | Cost-effective, fast processing, reliable performance  |
| Best for       | High-volume search applications, budget-conscious projects |

**Usage Example:**

```language-selector
bash=:curl https://api.avalai.ir/v1/search/parallel_ai-search \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "artificial intelligence trends",
    "max_results": 10
  }'

python=:import requests

response = requests.post(
    "https://api.avalai.ir/v1/search/parallel_ai-search",
    headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
    json={"query": "artificial intelligence trends", "max_results": 10},
)

results = response.json()
for result in results["results"]:
    print(f"{result['title']}: {result['url']}")

javascript=:const response = await fetch("https://api.avalai.ir/v1/search/parallel_ai-search", {
    method: "POST",
    headers: {
        "Authorization": `Bearer ${process.env.AVALAI_API_KEY}`,
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        query: "artificial intelligence trends",
        max_results: 10
    })
});

const data = await response.json();
data.results.forEach(result => {
    console.log(`${result.title}: ${result.url}`);
});

```

### Parallel AI Search Pro

Enhanced version with additional features and higher quality results.

| Feature        | Details                                                         |
| -------------- | --------------------------------------------------------------- |
| Tool ID        | `parallel_ai-search-pro`                                        |
| Endpoint       | `v1/search/parallel_ai-search-pro` or `v1/search`             |
| Max results    | 1-20 results per query                                          |
| Pricing        | $0.009 per query                                                |
| Capabilities   | Advanced parallel search, enhanced filtering, premium results   |
| Strengths      | Higher quality results, better accuracy, advanced features      |
| Best for       | Production applications, quality-focused projects               |

**Usage Example:**

```language-selector
bash=:curl https://api.avalai.ir/v1/search \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "search_tool_name": "parallel_ai-search-pro",
    "query": ["AI developments", "machine learning trends"],
    "max_results": 5,
    "processor": "pro",
    "max_chars_per_result": 500
  }'

python=:import requests

response = requests.post(
    "https://api.avalai.ir/v1/search",
    headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
    json={
        "search_tool_name": "parallel_ai-search-pro",
        "query": ["AI developments", "machine learning trends"],
        "max_results": 5,
        # Parallel AI-specific parameters
        "processor": "pro",  # 'base' or 'pro'
        "max_chars_per_result": 500,  # Max characters per result
    },
)

results = response.json()
print(f"Total results: {len(results['results'])}")

javascript=:const response = await fetch("https://api.avalai.ir/v1/search", {
    method: "POST",
    headers: {
        "Authorization": `Bearer ${process.env.AVALAI_API_KEY}`,
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        search_tool_name: "parallel_ai-search-pro",
        query: ["AI developments", "machine learning trends"],
        max_results: 5,
        // Parallel AI-specific parameters
        processor: "pro",                 // 'base' or 'pro'
        max_chars_per_result: 500         // Max characters per result
    })
});

const data = await response.json();
console.log(`Total results: ${data.results.length}`);

```

## Request Parameters

All Parallel AI search tools support the following parameters:

### Standard Parameters

| Parameter             | Type           | Required | Description                                          |
| --------------------- | -------------- | -------- | ---------------------------------------------------- |
| query                 | string or array | Yes     | Search query string or array of strings              |
| max_results           | integer        | No       | Maximum number of results (1-20). Default: 10        |
| search_domain_filter  | array          | No       | List of domains to filter results (max 20 domains)   |
| max_tokens_per_page   | integer        | No       | Maximum tokens per page to process. Default: 1024    |
| country               | string         | No       | Country code filter (e.g., "US", "GB", "DE")         |

### Parallel AI-Specific Parameters (Advanced)

| Parameter             | Type           | Required | Description                                          |
| --------------------- | -------------- | -------- | ---------------------------------------------------- |
| processor             | string         | No       | Processor type: `base` (standard) or `pro` (enhanced quality) |
| max_chars_per_result  | integer        | No       | Maximum characters per result snippet                |

## Response Format

All Parallel AI searches return results in the standard search response format:

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

## Using Parallel AI Search via AvalAI

Access Parallel AI search tools using the AvalAI Search API endpoint. You can specify the tool either in the URL path or in the request body.

```python
import requests

# Option 1: Tool in URL
response = requests.post(
    "https://api.avalai.ir/v1/search/parallel_ai-search",
    headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
    json={"query": "latest technology news", "max_results": 10},
)

# Option 2: Tool in body with advanced parameters
response = requests.post(
    "https://api.avalai.ir/v1/search",
    headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
    json={
        "search_tool_name": "parallel_ai-search-pro",
        "query": ["AI trends", "ML innovations", "tech startups"],
        "max_results": 5,
        # Parallel AI-specific parameters
        "processor": "pro",  # 'base' or 'pro'
        "max_chars_per_result": 500,  # Max characters per result
    },
)

results = response.json()
```

## Choosing Between Standard and Pro

**Use Parallel AI Search (Standard)** when:
- You need fast, cost-effective search results
- Processing high volumes of search queries
- Budget is a primary concern
- Standard quality meets your needs

**Use Parallel AI Search Pro** when:
- You need higher quality, more accurate results
- Running production applications
- Quality and reliability are priorities
- Advanced features are required

## Related Resources

- [Search API Reference](en/api-reference/search.md)
- [Search API Announcement](en/news/2025-10-26-search-api-launched.md)
- [Pricing Information](en/pricing.md)
- [Authentication](en/api-reference/authentication.md)