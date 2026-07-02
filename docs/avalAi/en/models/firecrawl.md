# Firecrawl Search

AvalAI provides access to Firecrawl's web search API, offering powerful search capabilities combined with advanced web scraping and content extraction features.

## Search Tool

Firecrawl specializes in providing comprehensive search results with integrated web scraping, enabling you to search and extract content from multiple sources simultaneously.

### Firecrawl Search

Advanced web search with integrated scraping capabilities and multi-source support.

| Feature        | Details                                                |
| -------------- | ------------------------------------------------------ |
| Tool ID        | `firecrawl-search`                                     |
| Endpoint       | `v1/search/firecrawl-search` or `v1/search`          |
| Max results    | 1-20 results per query                                 |
| Pricing        | $0.008 per query                                       |
| Capabilities   | Multi-source search, category filtering, web scraping, time-based search, geo-targeting |
| Strengths      | Content extraction, advanced filtering, multiple source types |
| Best for       | Data extraction, research, content aggregation, scraping-enabled searches |

**Usage Example:**

```language-selector
bash=:curl https://api.avalai.ir/v1/search/firecrawl-search \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "artificial intelligence research",
    "max_results": 10,
    "sources": ["web", "news"],
    "categories": [{"type": "research"}],
    "scrapeOptions": {
      "formats": ["markdown"],
      "onlyMainContent": true,
      "removeBase64Images": true
    }
  }'

python=:import requests

response = requests.post(
    "https://api.avalai.ir/v1/search/firecrawl-search",
    headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
    json={
        "query": "artificial intelligence research",
        "max_results": 10,
        "sources": ["web", "news"],
        "categories": [{"type": "research"}],
        "scrapeOptions": {
            "formats": ["markdown"],
            "onlyMainContent": True,
            "removeBase64Images": True,
        },
    },
)

results = response.json()
for result in results["results"]:
    print(f"{result['title']}: {result['url']}")

javascript=:const response = await fetch("https://api.avalai.ir/v1/search/firecrawl-search", {
    method: "POST",
    headers: {
        "Authorization": `Bearer ${process.env.AVALAI_API_KEY}`,
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        query: "artificial intelligence research",
        max_results: 10,
        sources: ["web", "news"],
        categories: [{"type": "research"}],
        scrapeOptions: {
            formats: ["markdown"],
            onlyMainContent: true,
            removeBase64Images: true
        }
    })
});

const data = await response.json();
data.results.forEach(result => {
    console.log(`${result.title}: ${result.url}`);
});

```

## Features

Firecrawl combines web search with powerful scraping capabilities:

### Multiple Sources

Search across different sources simultaneously:

- `web` - Web search results (default)
- `images` - Image search results
- `news` - News search results with dates

**Example:**

```python
response = requests.post(
    "https://api.avalai.ir/v1/search/firecrawl-search",
    headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
    json={
        "query": "climate change",
        "sources": ["web", "news"],
        "max_results": 10,
    },
)
```

### Category Filtering

Filter results by specific categories:

- `github` - Search within GitHub repositories, code, issues, and documentation
- `research` - Search academic and research websites (arXiv, Nature, IEEE, PubMed, etc.)
- `pdf` - Search for PDFs

**Example:**

```python
response = requests.post(
    "https://api.avalai.ir/v1/search/firecrawl-search",
    headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
    json={
        "query": "machine learning algorithms",
        "categories": [{"type": "github"}, {"type": "research"}],
        "max_results": 10,
    },
)
```

### Time-Based Search

Use the `tbs` parameter to filter by time periods:

- `qdr:h` - Past hour
- `qdr:d` - Past day
- `qdr:w` - Past week
- `qdr:m` - Past month
- `qdr:y` - Past year

**Example:**

```python
response = requests.post(
    "https://api.avalai.ir/v1/search/firecrawl-search",
    headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
    json={
        "query": "AI news",
        "tbs": "qdr:m",  # Past month
        "max_results": 10,
    },
)
```

### Content Scraping

Firecrawl automatically scrapes full page content for search results when `scrapeOptions` is specified. By default, LiteLLM requests markdown format with main content only.

**Scraping Options:**

- `formats` - Content format (e.g., `["markdown"]`)
- `onlyMainContent` - Extract only main content (boolean)
- `removeBase64Images` - Remove base64-encoded images (boolean)

**Example:**

```python
response = requests.post(
    "https://api.avalai.ir/v1/search/firecrawl-search",
    headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
    json={
        "query": "Python best practices",
        "max_results": 5,
        "scrapeOptions": {
            "formats": ["markdown"],
            "onlyMainContent": True,
            "removeBase64Images": True,
        },
    },
)
```

### Geo-Targeting

Use the `location` parameter for geo-targeted results. The location should be in the format `"City,State,Country"`:

**Example:**

```python
response = requests.post(
    "https://api.avalai.ir/v1/search/firecrawl-search",
    headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
    json={
        "query": "restaurants",
        "location": "San Francisco,California,United States",
        "max_results": 10,
    },
)
```

### Invalid URL Handling

Use `ignoreInvalidURLs` to exclude invalid URLs from results:

```python
response = requests.post(
    "https://api.avalai.ir/v1/search/firecrawl-search",
    headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
    json={
        "query": "web development tutorials",
        "ignoreInvalidURLs": True,
        "max_results": 10,
    },
)
```

## Supported Query Operators

Firecrawl supports advanced search operators:

| Operator | Functionality | Example |
|----------|---------------|---------|
| `""` | Non-fuzzy matches a string of text | `"Firecrawl"` |
| `-` | Excludes certain keywords | `-bad`, `-site:example.com` |
| `site:` | Only returns results from a specified website | `site:firecrawl.dev` |
| `inurl:` | Only returns results that include a word in the URL | `inurl:firecrawl` |
| `allinurl:` | Only returns results that include multiple words in URL | `allinurl:git firecrawl` |
| `intitle:` | Only returns results with a word in the title | `intitle:Firecrawl` |
| `allintitle:` | Only returns results with multiple words in the title | `allintitle:firecrawl playground` |
| `related:` | Only returns results related to a specific domain | `related:firecrawl.dev` |

**Example:**

```python
response = requests.post(
    "https://api.avalai.ir/v1/search/firecrawl-search",
    headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
    json={
        "query": 'site:github.com "machine learning" -deprecated',
        "max_results": 10,
    },
)
```

## Request Parameters

Firecrawl search supports the following parameters:

| Parameter             | Type    | Required | Description                                          |
| --------------------- | ------- | -------- | ---------------------------------------------------- |
| `query`               | string  | Yes      | Search query string                                  |
| `max_results`         | integer | No       | Maximum number of results (1-20). Default: 10        |
| `sources`             | array   | No       | Search sources: `["web", "news", "images"]`          |
| `categories`          | array   | No       | Category filters: `[{"type": "github"}, {"type": "research"}, {"type": "pdf"}]` |
| `tbs`                 | string  | No       | Time-based search (e.g., `"qdr:m"` for past month)   |
| `location`            | string  | No       | Geographic location (e.g., `"San Francisco,California,United States"`) |
| `country`             | string  | No       | Country code filter (e.g., `"US"`, `"GB"`, `"DE"`)   |
| `ignoreInvalidURLs`   | boolean | No       | Exclude invalid URLs from results                    |
| `scrapeOptions`       | object  | No       | Scraping configuration for result content            |
| `scrapeOptions.formats` | array | No       | Content formats: `["markdown"]`                      |
| `scrapeOptions.onlyMainContent` | boolean | No | Extract only main content                      |
| `scrapeOptions.removeBase64Images` | boolean | No | Remove base64-encoded images               |
| `search_domain_filter` | array  | No       | List of domains to filter results (max 20 domains)   |
| `max_tokens_per_page` | integer | No       | Maximum tokens per page to process. Default: 1024    |

## Response Format

Firecrawl searches return results in the standard search response format:

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

## Using Firecrawl Search via AvalAI

Access Firecrawl search using the AvalAI Search API endpoint. You can specify the tool either in the URL path or in the request body.

```python
import requests

# Option 1: Tool in URL
response = requests.post(
    "https://api.avalai.ir/v1/search/firecrawl-search",
    headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
    json={
        "query": "latest AI developments",
        "sources": ["web", "news"],
        "max_results": 10,
    },
)

# Option 2: Tool in body with all advanced options
response = requests.post(
    "https://api.avalai.ir/v1/search",
    headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
    json={
        "search_tool_name": "firecrawl-search",
        "query": "machine learning research",
        # Firecrawl-specific parameters
        "sources": ["web", "news"],  # Search multiple sources
        "categories": [
            {"type": "github"},
            {"type": "research"},
        ],  # Filter by categories
        "tbs": "qdr:m",  # Time-based search (past month)
        "location": "San Francisco,California,United States",  # Geo-targeting
        "ignoreInvalidURLs": True,  # Exclude invalid URLs
        "scrapeOptions": {  # Scraping options for results
            "formats": ["markdown"],
            "onlyMainContent": True,
            "removeBase64Images": True,
        },
        "max_results": 10,
    },
)

results = response.json()
```

## Use Cases

**Use Firecrawl Search** when:

- You need to extract and process full page content
- Searching across multiple source types (web, news, images)
- Filtering by specific categories (GitHub, research papers, PDFs)
- Performing time-sensitive searches
- Geo-targeting search results
- Using advanced search operators
- Building data extraction or web scraping applications
- Aggregating content from multiple sources

## Related Resources

- [Search API Reference](en/api-reference/search.md)
- [Search API Announcement](en/news/2025-10-26-search-api-launched.md)
- [Pricing Information](en/pricing.md)
- [Authentication](en/api-reference/authentication.md)