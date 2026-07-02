# Serper Search

AvalAI provides access to Serper's fast Google-powered search API, offering the most cost-effective direct web search option for high-volume applications.

## Search Tool

Serper specializes in affordable Google search results with practical controls for localization, language, autocorrection, time filtering, and pagination.

### Serper Search

Low-cost Google-powered search with geo-targeting and time-based filters.

| Feature        | Details                                                |
| -------------- | ------------------------------------------------------ |
| Tool ID        | `serper-search`                                        |
| Endpoint       | `v1/search/serper-search` or `v1/search`             |
| Max results    | 1-20 results per query                                 |
| Pricing        | $0.001 per query                                       |
| Capabilities   | Google-powered web search, geo-targeting, language control, time filters, pagination |
| Strengths      | Lowest search cost, practical localization, fast results |
| Best for       | High-volume search, price monitoring, local search, news tracking |

**Usage Example:**

```language-selector
bash=:curl https://api.avalai.ir/v1/search/serper-search \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "latest AI news",
    "max_results": 10,
    "gl": "uk",
    "hl": "en",
    "autocorrect": false,
    "tbs": "qdr:d",
    "page": 1
  }'

python=:import requests

response = requests.post(
    "https://api.avalai.ir/v1/search/serper-search",
    headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
    json={
        "query": "latest AI news",
        "max_results": 10,
        # Serper-specific parameters
        "gl": "uk",  # Country/geolocation code
        "hl": "en",  # Language code
        "autocorrect": False,  # Disable autocorrect
        "tbs": "qdr:d",  # Time filter: past day
        "page": 1,  # Page number
    },
)

results = response.json()
for result in results["results"]:
    print(f"{result['title']}: {result['url']}")

javascript=:const response = await fetch("https://api.avalai.ir/v1/search/serper-search", {
    method: "POST",
    headers: {
        "Authorization": `Bearer ${process.env.AVALAI_API_KEY}`,
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        query: "latest AI news",
        max_results: 10,
        // Serper-specific parameters
        gl: "uk",              // Country/geolocation code
        hl: "en",              // Language code
        autocorrect: false,     // Disable autocorrect
        tbs: "qdr:d",          // Time filter: past day
        page: 1                 // Page number
    })
});

const data = await response.json();
data.results.forEach(result => {
    console.log(`${result.title}: ${result.url}`);
});

```

## Request Parameters

Serper Search supports the following parameters:

### Standard Parameters

| Parameter             | Type    | Required | Description                                          |
| --------------------- | ------- | -------- | ---------------------------------------------------- |
| query                 | string  | Yes      | Search query string                                  |
| max_results           | integer | No       | Maximum number of results (1-20). Default: 10        |
| search_domain_filter  | array   | No       | List of domains to filter results (max 20 domains)   |
| max_tokens_per_page   | integer | No       | Maximum tokens per page to process. Default: 1024    |
| country               | string  | No       | Country code filter (for example `US`, `GB`, `DE`)   |
| location              | string  | No       | Geographic location for local results (for example `Berlin,Germany`) |

### Serper-Specific Parameters

| Parameter   | Type    | Required | Description |
| ----------- | ------- | -------- | ----------- |
| gl          | string  | No       | Country/geolocation code for localized results (for example `uk`, `us`, `de`) |
| hl          | string  | No       | Language code for result language (for example `en`, `de`, `fa`) |
| autocorrect | boolean | No       | Enable or disable search query autocorrection. Set to `false` to disable autocorrect |
| tbs         | string  | No       | Time-based search filter such as `qdr:h`, `qdr:d`, `qdr:w`, `qdr:m`, or `qdr:y` |
| page        | integer | No       | Page number for paginated result sets |

## Time-Based Search

Use the `tbs` parameter to filter results by time period:

| Value | Meaning |
| ----- | ------- |
| `qdr:h` | Past hour |
| `qdr:d` | Past day |
| `qdr:w` | Past week |
| `qdr:m` | Past month |
| `qdr:y` | Past year |

```python
import requests

response = requests.post(
    "https://api.avalai.ir/v1/search/serper-search",
    headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
    json={
        "query": "AI product launches",
        "tbs": "qdr:d",  # Past day
        "max_results": 10,
    },
)
```

## Geo-Targeting

Combine `country`, `location`, `gl`, and `hl` parameters for geo-targeted results:

```python
import requests

response = requests.post(
    "https://api.avalai.ir/v1/search/serper-search",
    headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
    json={
        "query": "restaurants",
        "country": "DE",
        "location": "Berlin,Germany",
        "gl": "de",
        "hl": "de",
        "max_results": 10,
    },
)
```

## Response Format

Serper searches return results in the standard search response format:

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

## When to Use Serper Search

Use Serper Search when:

- You need the lowest-cost direct web search option at $0.001 per query
- You want Google-powered results through the unified AvalAI Search API
- You need time filters for recent content, news tracking, or monitoring
- You need localized search using country, language, and location parameters
- You are building high-volume systems such as price monitoring, market tracking, or search aggregation

## Related Resources

- [Search API Reference](en/api-reference/search.md)
- [Search API Announcement](en/news/2025-10-26-search-api-launched.md)
- [Pricing Information](en/pricing.md)
- [Authentication](en/api-reference/authentication.md)
