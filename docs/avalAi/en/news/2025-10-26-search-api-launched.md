# Search API Now Available: 8 Search Tools from Leading Providers

**Date:** 2025-10-26 / (1404-08-04)

## Summary

AvalAI now supports web search capabilities through the v1/search endpoint, offering 8 specialized search tools from 6 leading providers. These tools enable real-time web searches with customizable filters, domain restrictions, and country-specific results, all accessible through a unified Perplexity-compatible API.

---

## Details

We introduce comprehensive search capabilities to AvalAI, providing developers with access to multiple search engines through a single, unified API endpoint. The new [`v1/search`](en/api-reference/search.md) endpoint supports 8 different search tools from 6 major providers, allowing you to choose the best search engine for your specific use case.

### Supported Search Tools

#### Perplexity
- **perplexity-search**: Fast, AI-powered search with quality results. [Documentation](en/providers/perplexity.md)

#### Tavily
- **tavily-search**: Standard search with comprehensive web coverage. [Documentation](en/providers/tavily.md)
- **tavily-search-advanced**: Enhanced search with advanced filtering and deeper results. [Documentation](en/providers/tavily.md)

#### DataForSEO
- **dataforseo-search**: Cost-effective search engine with reliable results. [Documentation](en/providers/dataforseo.md)

#### Exa AI
- **exa_ai-search**: Neural search engine optimized for semantic queries. [Documentation](en/providers/exa_ai.md)

#### Google PSE
- **google_pse-search**: Google Programmable Search Engine for customizable search experiences. [Documentation](en/providers/google.md)

#### Parallel AI
- **parallel_ai-search**: Fast parallel search processing. [Documentation](en/providers/parallel_ai.md)
- **parallel_ai-search-pro**: Enhanced version with additional features and higher quality results. [Documentation](en/providers/parallel_ai.md)

### Key Features

- **Unified API**: Compatible with Perplexity's search API format
- **Flexible Query Options**: Support for single or multiple search queries
- **Domain Filtering**: Restrict results to specific domains (up to 20 domains)
- **Country Filtering**: Get region-specific search results
- **Result Control**: Customize the number of results (1-20) and tokens per page
- **Cost-Effective Options**: Choose from multiple providers based on your budget and requirements

### Pricing Details

| Search Tool | Cost per Query |
|-------------|----------------|
| dataforseo-search | $0.003 |
| parallel_ai-search | $0.004 |
| perplexity-search | $0.005 |
| google_pse-search | $0.005 |
| tavily-search | $0.008 |
| parallel_ai-search-pro | $0.009 |
| tavily-search-advanced | $0.016 |
| exa_ai-search | $0.025 |

---

## API Request/Response Examples

### Example Request (Option 1: Search tool in URL)

```bash
curl https://api.avalai.ir/v1/search/perplexity-search \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "latest AI developments 2024",
    "max_results": 5,
    "search_domain_filter": ["arxiv.org", "nature.com"],
    "country": "US"
  }'
```

### Example Request (Option 2: Search tool in body)

```bash
curl https://api.avalai.ir/v1/search \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "search_tool_name": "perplexity-search",
    "query": "latest AI developments 2024",
    "max_results": 5
  }'
```

### Example Response

```json
{
  "object": "search",
  "results": [
    {
      "title": "Latest Advances in Artificial Intelligence",
      "url": "https://arxiv.org/paper/example",

      "snippet": "This paper discusses recent developments in AI...",
      "date": "2024-01-15"
    },
    {
      "title": "Machine Learning Breakthroughs",
      "url": "https://nature.com/articles/ml-breakthrough",

      "snippet": "Researchers have achieved new milestones...",
      "date": "2024-01-10"
    },
    {
      "title": "Neural Network Innovations",
      "url": "https://arxiv.org/paper/neural-networks",

      "snippet": "New architectures demonstrate improved performance...",
      "date": "2024-01-08"
    },
    {
      "title": "AI Applications in Healthcare",
      "url": "https://nature.com/articles/ai-healthcare",

      "snippet": "Artificial intelligence transforms medical diagnostics...",
      "date": "2024-01-05"
    },
    {
      "title": "Deep Learning Frameworks 2024",
      "url": "https://arxiv.org/paper/deep-learning",

      "snippet": "Comparison of modern deep learning frameworks...",
      "date": "2024-01-02"
    }
  ]
}
```

---

## SDK Usage Examples

### Basic Search

```language-selector
bash=:curl https://api.avalai.ir/v1/search/tavily-search \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "artificial intelligence trends",
    "max_results": 10
  }'

python=:import requests

response = requests.post(
    "https://api.avalai.ir/v1/search/tavily-search",
    headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
    json={"query": "artificial intelligence trends", "max_results": 10},
)

results = response.json()
for result in results["results"]:
    print(f"{result['title']}: {result['url']}")

javascript=:const response = await fetch("https://api.avalai.ir/v1/search/tavily-search", {
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

### Advanced Search with Domain Filtering

```language-selector
bash=:curl https://api.avalai.ir/v1/search \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "search_tool_name": "exa_ai-search",
    "query": "machine learning research papers",
    "max_results": 10,
    "search_domain_filter": ["arxiv.org", "paperswithcode.com", "scholar.google.com"],
    "country": "US"
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
        "country": "US",
    },
)

results = response.json()
print(f"Found {len(results['results'])} results")

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
        search_domain_filter: ["arxiv.org", "paperswithcode.com", "scholar.google.com"],
        country: "US"
    })
});

const data = await response.json();
console.log(`Found ${data.results.length} results`);

```

### Multiple Queries

```language-selector
bash=:curl https://api.avalai.ir/v1/search/parallel_ai-search-pro \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "query": ["AI developments", "machine learning trends", "neural networks"],
    "max_results": 5
  }'

python=:import requests

response = requests.post(
    "https://api.avalai.ir/v1/search/parallel_ai-search-pro",
    headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
    json={
        "query": ["AI developments", "machine learning trends", "neural networks"],
        "max_results": 5,
    },
)

results = response.json()
print(f"Total results: {len(results['results'])}")

javascript=:const response = await fetch("https://api.avalai.ir/v1/search/parallel_ai-search-pro", {
    method: "POST",
    headers: {
        "Authorization": `Bearer ${process.env.AVALAI_API_KEY}`,
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        query: ["AI developments", "machine learning trends", "neural networks"],
        max_results: 5
    })
});

const data = await response.json();
console.log(`Total results: ${data.results.length}`);

```

---

## Related Links

- [Search API Reference](en/api-reference/search.md)
- [Perplexity Provider](en/providers/perplexity.md)
- [Tavily Provider](en/providers/tavily.md)
- [DataForSEO Provider](en/providers/dataforseo.md)
- [Exa AI Provider](en/providers/exa_ai.md)
- [Google PSE Provider](en/providers/google.md)
- [Parallel AI Provider](en/providers/parallel_ai.md)
- [Pricing Information](en/pricing.md)