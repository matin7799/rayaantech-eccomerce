# Search API

The Search API provides programmatic access to web search engine functionalities from leading providers. This is a dedicated search API that returns structured search results for integration into your applications.

> **Important:** This is different from [Web Search in Chat Completions](en/guides/tools-web-search.md), which enables LLMs to search the web during conversations. The `v1/search` endpoint is a standalone web search API that returns raw search results for programmatic use, while web search in chat completions augments AI responses with real-time web data.

## Endpoint

```
POST https://api.avalai.ir/v1/search
POST https://api.avalai.ir/v1/search/{search_tool_name}
```

## Supported Search Tools

AvalAI provides access to 10 search tools from 8 leading providers:

| Search Tool | Provider | Cost per Query | Best For |
|-------------|----------|----------------|----------|
| `serper-search` | Serper | $0.001 | Lowest-cost Google-powered search |
| `dataforseo-search` | DataForSEO | $0.003 | cost-sensitive applications |
| `parallel_ai-search` | Parallel AI | $0.004 | Fast parallel processing |
| `perplexity-search` | Perplexity | $0.005 | AI-powered search with quality results |
| `google_pse-search` | Google PSE | $0.005 | Google-powered customizable search |
| `tavily-search` | Tavily | $0.008 | General web search |
| `firecrawl-search` | Firecrawl | $0.008 | Search with web scraping and content extraction |
| `parallel_ai-search-pro` | Parallel AI | $0.009 | Enhanced parallel search |
| `tavily-search-advanced` | Tavily | $0.016 | Advanced search with filtering |
| `exa_ai-search` | Exa AI | $0.025 | Semantic neural search |

## Request Body

### Standard Parameters

| Parameter             | Type           | Required | Description                                          |
| --------------------- | -------------- | -------- | ---------------------------------------------------- |
| `query`               | string or array | Yes     | Search query. Can be a single string or array of strings |
| `search_tool_name`    | string         | Conditional | Required when using `v1/search` endpoint (not in URL) |
| `max_results`         | integer        | No       | Maximum number of results (1-20). Default: 10        |
| `search_domain_filter` | array         | No       | List of domains to filter results (max 20 domains)   |
| `max_tokens_per_page` | integer        | No       | Maximum tokens per page to process. Default: 1024    |
| `country`             | string         | No       | Country filter. Format varies by provider (see below) |

### Provider-Specific Parameters

Each search provider supports additional parameters for advanced functionality:

#### Tavily (`tavily-search`, `tavily-search-advanced`)
| Parameter | Type | Description |
|-----------|------|-------------|
| `country` | string | Full lowercase country name (e.g., `"united states"`, `"united kingdom"`). See [Tavily documentation](en/providers/tavily.md) for full list. |

#### Serper (`serper-search`)
| Parameter | Type | Description |
|-----------|------|-------------|
| `gl` | string | Country/geolocation code for localized results (e.g., `"uk"`, `"us"`, `"de"`) |
| `hl` | string | Language code for result language (e.g., `"en"`, `"de"`, `"fa"`) |
| `autocorrect` | boolean | Enable or disable query autocorrection. Set to `false` to disable autocorrect |
| `tbs` | string | Time-based search filter: `"qdr:h"` (past hour), `"qdr:d"` (past day), `"qdr:w"` (past week), `"qdr:m"` (past month), `"qdr:y"` (past year) |
| `page` | integer | Page number for paginated results |
| `location` | string | Geographic location for local results (e.g., `"Berlin,Germany"`) |
| `country` | string | Country code for geo-targeted results (e.g., `"DE"`, `"US"`) |

#### DataForSEO (`dataforseo-search`)
| Parameter | Type | Description |
|-----------|------|-------------|
| `country` | string | Full country name (e.g., `"United States"`, `"Germany"`) |
| `language_code` | string | Language code (e.g., `"en"`, `"de"`) |
| `depth` | integer | Number of results to retrieve (max 700) |
| `device` | string | Device type: `"desktop"`, `"mobile"`, `"tablet"` |
| `os` | string | Operating system: `"windows"`, `"macos"`, `"android"`, `"ios"` |

#### Firecrawl (`firecrawl-search`)
| Parameter | Type | Description |
|-----------|------|-------------|
| `sources` | array | Search sources: `["web", "news", "images"]` |
| `categories` | array | Category filters: `[{"type": "github"}, {"type": "research"}, {"type": "pdf"}]` |
| `tbs` | string | Time-based search (e.g., `"qdr:m"` for past month) |
| `location` | string | Geographic location (e.g., `"San Francisco,California,United States"`) |
| `ignoreInvalidURLs` | boolean | Exclude invalid URLs from results |
| `scrapeOptions` | object | Scraping configuration (see [Firecrawl documentation](en/providers/firecrawl.md)) |

#### Parallel AI (`parallel_ai-search`, `parallel_ai-search-pro`)
| Parameter | Type | Description |
|-----------|------|-------------|
| `processor` | string | Processor type: `"base"` or `"pro"` |
| `max_chars_per_result` | integer | Maximum characters per result snippet |

For complete parameter details, see the individual provider documentation pages.

## Response Format

All search requests return a consistent response format:

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

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `object` | string | Always "search" for search responses |
| `results` | array | List of search results |
| `results[].title` | string | Title of the search result |
| `results[].url` | string | URL of the search result |
| `results[].snippet` | string | Text snippet from the result |
| `results[].date` | string | Optional publication or last updated date |

## Examples

### Option 1: Search Tool in URL

```language-selector
bash=:curl https://api.avalai.ir/v1/search/perplexity-search \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "latest AI developments 2024",
    "max_results": 5,
    "search_domain_filter": ["arxiv.org", "nature.com"],
    "country": "US"
  }'

python=:import requests

response = requests.post(
    "https://api.avalai.ir/v1/search/perplexity-search",
    headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
    json={
        "query": "latest AI developments 2024",
        "max_results": 5,
        "search_domain_filter": ["arxiv.org", "nature.com"],
        "country": "US",
    },
)

results = response.json()
for result in results["results"]:
    print(f"{result['title']}: {result['url']}")

javascript=:const response = await fetch("https://api.avalai.ir/v1/search/perplexity-search", {
    method: "POST",
    headers: {
        "Authorization": `Bearer ${process.env.AVALAI_API_KEY}`,
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        query: "latest AI developments 2024",
        max_results: 5,
        search_domain_filter: ["arxiv.org", "nature.com"],
        country: "US"
    })
});

const data = await response.json();
data.results.forEach(result => {
    console.log(`${result.title}: ${result.url}`);
});

```

### Option 2: Search Tool in Body

```language-selector
bash=:curl https://api.avalai.ir/v1/search \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "search_tool_name": "tavily-search",
    "query": "machine learning tutorials",
    "max_results": 10
  }'

python=:import requests

response = requests.post(
    "https://api.avalai.ir/v1/search",
    headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
    json={
        "search_tool_name": "tavily-search",
        "query": "machine learning tutorials",
        "max_results": 10,
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
        search_tool_name: "tavily-search",
        query: "machine learning tutorials",
        max_results: 10
    })
});

const data = await response.json();

```

### Serper Time-Based and Geo-Targeted Search

```language-selector
bash=:curl https://api.avalai.ir/v1/search/serper-search \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "restaurants",
    "max_results": 10,
    "gl": "uk",
    "hl": "en",
    "autocorrect": false,
    "tbs": "qdr:d",
    "page": 1,
    "country": "DE",
    "location": "Berlin,Germany"
  }'

python=:import requests

response = requests.post(
    "https://api.avalai.ir/v1/search/serper-search",
    headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
    json={
        "query": "restaurants",
        "max_results": 10,
        # Serper-specific parameters
        "gl": "uk",  # Country/geolocation code
        "hl": "en",  # Language code
        "autocorrect": False,  # Disable autocorrect
        "tbs": "qdr:d",  # Time filter: past day
        "page": 1,  # Page number
        # Geo-targeting
        "country": "DE",
        "location": "Berlin,Germany",
    },
)

results = response.json()

javascript=:const response = await fetch("https://api.avalai.ir/v1/search/serper-search", {
    method: "POST",
    headers: {
        "Authorization": `Bearer ${process.env.AVALAI_API_KEY}`,
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        query: "restaurants",
        max_results: 10,
        // Serper-specific parameters
        gl: "uk",              // Country/geolocation code
        hl: "en",              // Language code
        autocorrect: false,     // Disable autocorrect
        tbs: "qdr:d",          // Time filter: past day
        page: 1,                // Page number
        // Geo-targeting
        country: "DE",
        location: "Berlin,Germany"
    })
});

const data = await response.json();

```

### Multiple Queries

Some search tools support searching for multiple queries simultaneously:

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

```

## Choosing a Search Tool

### By Cost

- **Lowest Cost**: [`serper-search`](en/providers/serper.md) ($0.001)
- **Low Cost**: [`dataforseo-search`](en/providers/dataforseo.md) ($0.003)
- **Budget-Friendly**: [`parallel_ai-search`](en/providers/parallel_ai.md) ($0.004)
- **Mid-Range**: [`perplexity-search`](en/providers/perplexity.md), [`google_pse-search`](en/providers/google.md) ($0.005)
- **Premium**: [`exa_ai-search`](en/providers/exa_ai.md) ($0.025)

### By Use Case

- **High-Volume Applications**: [`serper-search`](en/providers/serper.md) - Lowest-cost Google-powered search with localization and time filters
- **Cost-Sensitive Filtering**: [`dataforseo-search`](en/providers/dataforseo.md) - Cost-effective with advanced filtering options
- **AI-Powered Search**: [`perplexity-search`](en/providers/perplexity.md) - Quality AI-enhanced results
- **Semantic Search**: [`exa_ai-search`](en/providers/exa_ai.md) - Neural semantic search
- **General Web Search**: [`tavily-search`](en/providers/tavily.md) - Reliable with country filtering
- **Search with Web Scraping**: [`firecrawl-search`](en/providers/firecrawl.md) - Multi-source search with content extraction
- **Google Search Quality**: [`google_pse-search`](en/providers/google.md) - Customizable Google-powered search
- **Fast Parallel Processing**: [`parallel_ai-search`](en/providers/parallel_ai.md), [`parallel_ai-search-pro`](en/providers/parallel_ai.md) - Multiple queries simultaneously
- **Advanced Filtering**: [`tavily-search-advanced`](en/providers/tavily.md) - Enhanced filtering and result quality

## Best Practices

1. **Choose the Right Tool**: Select a search tool based on your specific needs (cost, quality, features)
2. **Use Domain Filtering**: Narrow results to specific domains for more relevant searches
3. **Set Appropriate Limits**: Use `max_results` to control the number of returned results
4. **Handle Errors**: Implement proper error handling for API requests
5. **Rate Limiting**: Be mindful of rate limits for your chosen search provider
6. **Cache Results**: Consider caching search results to reduce costs and improve performance

## Error Handling

The Search API returns standard HTTP status codes:

- `200`: Successful search
- `400`: Bad request (invalid parameters)
- `401`: Unauthorized (invalid API key)
- `429`: Rate limit exceeded
- `500`: Internal server error

## Related Resources

- [Search API Announcement](en/news/2025-10-26-search-api-launched.md)
- [Perplexity Search](en/providers/perplexity.md)
- [Tavily Search](en/providers/tavily.md)
- [Firecrawl Search](en/providers/firecrawl.md)
- [DataForSEO Search](en/providers/dataforseo.md)
- [Exa AI Search](en/providers/exa_ai.md)
- [Google PSE Search](en/providers/google.md)
- [Parallel AI Search](en/providers/parallel_ai.md)
- [Serper Search](en/providers/serper.md)
- [Pricing Information](en/pricing.md)
- [Authentication](en/api-reference/authentication.md)