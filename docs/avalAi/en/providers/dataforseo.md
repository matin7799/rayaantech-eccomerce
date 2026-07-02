# DataForSEO Search

AvalAI provides access to DataForSEO's cost-effective search API, offering reliable web search results with excellent value for high-volume applications.

## Search Tools

DataForSEO specializes in providing SEO and search data with a focus on affordability and reliability, making it ideal for businesses and applications that require frequent searches.

### DataForSEO Search

Cost-effective search engine with reliable, quality results.

| Feature        | Details                                                |
| -------------- | ------------------------------------------------------ |
| Tool ID        | `dataforseo-search`                                    |
| Endpoint       | `v1/search/dataforseo-search` or `v1/search`         |
| Max results    | 1-20 results per query                                 |
| Pricing        | $0.003 per query                                       |
| Capabilities   | Web search, domain filtering, SEO data, reliable results |
| Strengths      | Cost-effective, reliable, good for high volumes  |
| Best for       | High-volume applications, budget-conscious projects, SEO tools |

**Usage Example:**

```language-selector
bash=:curl https://api.avalai.ir/v1/search/dataforseo-search \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "web development trends 2024",
    "max_results": 10
  }'

python=:import requests

response = requests.post(
    "https://api.avalai.ir/v1/search/dataforseo-search",
    headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
    json={"query": "web development trends 2024", "max_results": 10},
)

results = response.json()
for result in results["results"]:
    print(f"{result['title']}: {result['url']}")

javascript=:const response = await fetch("https://api.avalai.ir/v1/search/dataforseo-search", {
    method: "POST",
    headers: {
        "Authorization": `Bearer ${process.env.AVALAI_API_KEY}`,
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        query: "web development trends 2024",
        max_results: 10
    })
});

const data = await response.json();
data.results.forEach(result => {
    console.log(`${result.title}: ${result.url}`);
});

```

## Advanced Search with Filtering

Combine DataForSEO's cost-effectiveness with advanced filtering options for targeted results.

```language-selector
bash=:curl https://api.avalai.ir/v1/search \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "search_tool_name": "dataforseo-search",
    "query": "SEO optimization techniques",
    "max_results": 15,
    "search_domain_filter": ["moz.com", "searchengineland.com", "semrush.com"],
    "country": "United States",
    "language_code": "en",
    "depth": 20,
    "device": "desktop",
    "os": "windows"
  }'

python=:import requests

response = requests.post(
    "https://api.avalai.ir/v1/search",
    headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
    json={
        "search_tool_name": "dataforseo-search",
        "query": "SEO optimization techniques",
        "max_results": 15,
        "search_domain_filter": ["moz.com", "searchengineland.com", "semrush.com"],
        # DataForSEO-specific parameters
        "country": "United States",  # Country name for location_name
        "language_code": "en",  # Language code
        "depth": 20,  # Number of results (max 700)
        "device": "desktop",  # Device type ('desktop', 'mobile', 'tablet')
        "os": "windows",  # Operating system
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
        search_tool_name: "dataforseo-search",
        query: "SEO optimization techniques",
        max_results: 15,
        search_domain_filter: ["moz.com", "searchengineland.com", "semrush.com"],
        // DataForSEO-specific parameters
        country: "United States",       // Country name for location_name
        language_code: "en",            // Language code
        depth: 20,                      // Number of results (max 700)
        device: "desktop",              // Device type ('desktop', 'mobile', 'tablet')
        os: "windows"                   // Operating system
    })
});

const data = await response.json();

```

## Request Parameters

DataForSEO search supports the following parameters:

### Standard Parameters

| Parameter             | Type    | Required | Description                                          |
| --------------------- | ------- | -------- | ---------------------------------------------------- |
| query                 | string  | Yes      | Search query string                                  |
| max_results           | integer | No       | Maximum number of results (1-20). Default: 10        |
| search_domain_filter  | array   | No       | List of domains to filter results (max 20 domains)   |
| max_tokens_per_page   | integer | No       | Maximum tokens per page to process. Default: 1024    |

### DataForSEO-Specific Parameters (Advanced)

| Parameter             | Type    | Required | Description                                          |
| --------------------- | ------- | -------- | ---------------------------------------------------- |
| country               | string  | No       | Country name for location (e.g., "United States", "United Kingdom", "Germany"). Used as `location_name` in DataForSEO API. |
| language_code         | string  | No       | Language code for results (e.g., "en", "de", "fr")   |
| depth                 | integer | No       | Number of search results to retrieve (max 700)       |
| device                | string  | No       | Device type to simulate: `desktop`, `mobile`, or `tablet` |
| os                    | string  | No       | Operating system to simulate (e.g., "windows", "macos", "android", "ios") |

For more details on available parameters, see the [DataForSEO Official Documentation](https://docs.dataforseo.com).

## Response Format

DataForSEO searches return results in the standard search response format:

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

## Using DataForSEO Search via AvalAI

Access DataForSEO's search API using the AvalAI Search API endpoint. You can specify the tool either in the URL path or in the request body.

```python
import requests

# Option 1: Tool in URL
response = requests.post(
    "https://api.avalai.ir/v1/search/dataforseo-search",
    headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
    json={"query": "content marketing strategies", "max_results": 10},
)

# Option 2: Tool in body with advanced parameters
response = requests.post(
    "https://api.avalai.ir/v1/search",
    headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
    json={
        "search_tool_name": "dataforseo-search",
        "query": "link building best practices",
        "max_results": 20,
        "country": "United States",
        "language_code": "en",
        "device": "desktop",
    },
)

results = response.json()
```

## When to Use DataForSEO Search

**Use DataForSEO Search** when:
- Cost efficiency is a top priority ($0.003 per query)
- You're processing high volumes of search queries
- You need reliable, consistent results
- Building SEO tools or analytics platforms
- Running automated searches or monitoring
- Budget constraints are significant
- Standard search quality meets your requirements

## Key Advantages

1. **Cost-Effective**: At $0.003 per query, it offers a strong balance of price and filtering capabilities
2. **High Volume Friendly**: Perfect for applications requiring frequent searches
3. **Reliable Results**: Consistent, quality search results
4. **SEO-Focused**: Optimized for SEO and web data applications
5. **Great Value**: Excellent balance of cost and quality

## Use Cases

- **SEO Tools**: Building rank tracking, keyword research, or competitor analysis tools
- **Content Aggregation**: Gathering content from multiple sources regularly
- **Market Research**: Monitoring trends and competitors at scale
- **Automated Monitoring**: Setting up regular searches for alerts or tracking
- **High-Volume Applications**: Any application requiring frequent searches where cost matters

## Related Resources

- [Search API Reference](en/api-reference/search.md)
- [Search API Announcement](en/news/2025-10-26-search-api-launched.md)
- [Pricing Information](en/pricing.md)
- [Authentication](en/api-reference/authentication.md)
- [DataForSEO Official Documentation](https://docs.dataforseo.com)