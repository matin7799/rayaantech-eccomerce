# Tavily Search

AvalAI provides access to Tavily's web search API, offering comprehensive search capabilities with standard and advanced tiers for different use cases.

## Search Tools

Tavily specializes in providing high-quality web search results optimized for AI applications and RAG (Retrieval-Augmented Generation) systems.

### Tavily Search (Standard)

Standard web search with comprehensive coverage and quality results.

| Feature        | Details                                                |
| -------------- | ------------------------------------------------------ |
| Tool ID        | `tavily-search`                                        |
| Endpoint       | `v1/search/tavily-search` or `v1/search`             |
| Max results    | 1-20 results per query                                 |
| Pricing        | $0.008 per query                                       |
| Capabilities   | Web search, domain filtering, country-specific results |
| Strengths      | Comprehensive web coverage, reliable results           |
| Best for       | General web searches, RAG applications, research       |

**Usage Example:**

```language-selector
bash=:curl https://api.avalai.ir/v1/search/tavily-search \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "latest AI developments 2024",
    "max_results": 10
  }'

python=:import requests

response = requests.post(
    "https://api.avalai.ir/v1/search/tavily-search",
    headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
    json={"query": "latest AI developments 2024", "max_results": 10},
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
        query: "latest AI developments 2024",
        max_results: 10
    })
});

const data = await response.json();
data.results.forEach(result => {
    console.log(`${result.title}: ${result.url}`);
});

```

### Tavily Search Advanced

Enhanced search with advanced filtering capabilities and deeper result quality.

| Feature        | Details                                                         |
| -------------- | --------------------------------------------------------------- |
| Tool ID        | `tavily-search-advanced`                                        |
| Endpoint       | `v1/search/tavily-search-advanced` or `v1/search`             |
| Max results    | 1-20 results per query                                          |
| Pricing        | $0.016 per query                                                |
| Capabilities   | Advanced web search, enhanced filtering, deeper result analysis |
| Strengths      | Higher quality results, better filtering, more detailed content |
| Best for       | Complex research, specialized searches, high-precision RAG      |

**Usage Example:**

```language-selector
bash=:curl https://api.avalai.ir/v1/search \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "search_tool_name": "tavily-search-advanced",
    "query": "machine learning research papers",
    "max_results": 10,
    "search_domain_filter": ["arxiv.org", "scholar.google.com"],
    "country": "united states"
  }'

python=:import requests

response = requests.post(
    "https://api.avalai.ir/v1/search",
    headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
    json={
        "search_tool_name": "tavily-search-advanced",
        "query": "machine learning research papers",
        "max_results": 10,
        "search_domain_filter": ["arxiv.org", "scholar.google.com"],
        "country": "united states",
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
        search_tool_name: "tavily-search-advanced",
        query: "machine learning research papers",
        max_results: 10,
        search_domain_filter: ["arxiv.org", "scholar.google.com"],
        country: "united states"
    })
});

const data = await response.json();

```

## Request Parameters

All Tavily search tools support the following parameters:

| Parameter             | Type    | Required | Description                                          |
| --------------------- | ------- | -------- | ---------------------------------------------------- |
| query                 | string  | Yes      | Search query string                                  |
| max_results           | integer | No       | Maximum number of results (1-20). Default: 10        |
| search_domain_filter  | array   | No       | List of domains to filter results (max 20 domains)   |
| max_tokens_per_page   | integer | No       | Maximum tokens per page to process. Default: 1024    |
| country               | string  | No       | Boost search results from a specific country (available only when topic is general). Available values: `afghanistan`, `albania`, `algeria`, `andorra`, `angola`, `argentina`, `armenia`, `australia`, `austria`, `azerbaijan`, `bahamas`, `bahrain`, `bangladesh`, `barbados`, `belarus`, `belgium`, `belize`, `benin`, `bhutan`, `bolivia`, `bosnia and herzegovina`, `botswana`, `brazil`, `brunei`, `bulgaria`, `burkina faso`, `burundi`, `cambodia`, `cameroon`, `canada`, `cape verde`, `central african republic`, `chad`, `chile`, `china`, `colombia`, `comoros`, `congo`, `costa rica`, `croatia`, `cuba`, `cyprus`, `czech republic`, `denmark`, `djibouti`, `dominican republic`, `ecuador`, `egypt`, `el salvador`, `equatorial guinea`, `eritrea`, `estonia`, `ethiopia`, `fiji`, `finland`, `france`, `gabon`, `gambia`, `georgia`, `germany`, `ghana`, `greece`, `guatemala`, `guinea`, `haiti`, `honduras`, `hungary`, `iceland`, `india`, `indonesia`, `iran`, `iraq`, `ireland`, `israel`, `italy`, `jamaica`, `japan`, `jordan`, `kazakhstan`, `kenya`, `kuwait`, `kyrgyzstan`, `latvia`, `lebanon`, `lesotho`, `liberia`, `libya`, `liechtenstein`, `lithuania`, `luxembourg`, `madagascar`, `malawi`, `malaysia`, `maldives`, `mali`, `malta`, `mauritania`, `mauritius`, `mexico`, `moldova`, `monaco`, `mongolia`, `montenegro`, `morocco`, `mozambique`, `myanmar`, `namibia`, `nepal`, `netherlands`, `new zealand`, `nicaragua`, `niger`, `nigeria`, `north korea`, `north macedonia`, `norway`, `oman`, `pakistan`, `panama`, `papua new guinea`, `paraguay`, `peru`, `philippines`, `poland`, `portugal`, `qatar`, `romania`, `russia`, `rwanda`, `saudi arabia`, `senegal`, `serbia`, `singapore`, `slovakia`, `slovenia`, `somalia`, `south africa`, `south korea`, `south sudan`, `spain`, `sri lanka`, `sudan`, `sweden`, `switzerland`, `syria`, `taiwan`, `tajikistan`, `tanzania`, `thailand`, `togo`, `trinidad and tobago`, `tunisia`, `turkey`, `turkmenistan`, `uganda`, `ukraine`, `united arab emirates`, `united kingdom`, `united states`, `uruguay`, `uzbekistan`, `venezuela`, `vietnam`, `yemen`, `zambia`, `zimbabwe`. For more details, see the [official Tavily API documentation](https://docs.tavily.com/documentation/api-reference/endpoint/search). |

## Response Format

All Tavily searches return results in the standard search response format:

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

## Using Tavily Search via AvalAI

Access Tavily search tools using the AvalAI Search API endpoint. You can specify the tool either in the URL path or in the request body.

```python
import requests

# Option 1: Tool in URL
response = requests.post(
    "https://api.avalai.ir/v1/search/tavily-search",
    headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
    json={"query": "artificial intelligence trends", "max_results": 10},
)

# Option 2: Tool in body
response = requests.post(
    "https://api.avalai.ir/v1/search",
    headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
    json={
        "search_tool_name": "tavily-search-advanced",
        "query": "artificial intelligence trends",
        "max_results": 10,
        "search_domain_filter": ["techcrunch.com", "wired.com"],
    },
)

results = response.json()
```

## Choosing Between Standard and Advanced

**Use Tavily Search (Standard)** when:
- You need general web search results
- Cost efficiency is a priority
- Standard search quality meets your needs
- Building general-purpose RAG applications

**Use Tavily Search Advanced** when:
- You need higher quality, more detailed results
- You're performing specialized or complex research
- You need advanced filtering capabilities
- Precision is more important than cost

## Related Resources

- [Search API Reference](en/api-reference/search.md)
- [Search API Announcement](en/news/2025-10-26-search-api-launched.md)
- [Pricing Information](en/pricing.md)
- [Authentication](en/api-reference/authentication.md)