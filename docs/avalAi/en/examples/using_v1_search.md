
# Using the v1/search API

## Introduction

The `v1/search` API is a **dedicated web search endpoint** that provides programmatic access to multiple search engines and tools. Unlike web search in chat completions (which augments LLM responses with real-time data), the `v1/search` API directly returns structured search results from various providers without LLM processing.

**Key Difference:**
- **v1/search API**: Direct programmatic search access → Returns raw search results (URLs, snippets, metadata)
- **Web Search in Chat Completions**: LLM-augmented search → Returns AI-generated responses with citations

> **Important:** This is different from [Web Search in Chat Completions](en/guides/tools-web-search.md), which enables LLMs to search the web during conversations. The `v1/search` endpoint is a standalone web search API that returns raw search results for programmatic use, while web search in chat completions augments AI responses with real-time web data.

This makes the `v1/search` API ideal for applications that need direct search results, data aggregation, research automation, or building custom search interfaces.

## Key Features

- **10 Search Tools** - Access to Serper, Perplexity, Tavily, Firecrawl, Parallel AI, Exa AI, Google PSE, and DataForSEO
- **Unified API Format** - Single endpoint following Perplexity-compatible response structure
- **Multiple Providers** - Choose the best search tool for your use case and budget
- **Structured Results** - Get organized search results with URLs, snippets, and metadata
- **Cost-Effective** - Pay per query with pricing from $0.001 to $0.025
- **No LLM Processing** - Direct search results without AI interpretation

## Available Search Tools

| Search Tool | Provider | Price/Query | Best For |
|------------|----------|-------------|----------|
| `serper-search` | Serper | $0.001 | Lowest-cost Google-powered search |
| `dataforseo-search` | DataForSEO | $0.003 | Cost-effective general search |
| `parallel_ai-search` | Parallel AI | $0.004 | Fast parallel search |
| `perplexity-search` | Perplexity | $0.005 | Balanced performance |
| `google_pse-search` | Google PSE | $0.005 | Google search results |
| `tavily-search` | Tavily | $0.008 | Standard web search |
| `firecrawl-search` | Firecrawl | $0.008 | Search with web scraping & content extraction |
| `parallel_ai-search-pro` | Parallel AI | $0.009 | Advanced parallel search |
| `tavily-search-advanced` | Tavily | $0.016 | Deep search with analysis |
| `exa_ai-search` | Exa AI | $0.025 | Neural semantic search |

## Basic Usage

### Method 1: Specify Tool in URL

The simplest way to use the `v1/search` API is to include the search tool name directly in the URL:

```language-selector
bash=:curl https://api.avalai.ir/v1/search/perplexity-search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "query": "latest developments in quantum computing",
    "max_results": 5
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Using the requests library for direct API calls
import requests

response = requests.post(
    "https://api.avalai.ir/v1/search/perplexity-search",
    headers={
        "Content-Type": "application/json",
        "Authorization": f"Bearer {client.api_key}",
    },
    json={"query": "latest developments in quantum computing", "max_results": 5},
)

results = response.json()
print(results)

javascript=:import fetch from 'node-fetch';

const response = await fetch('https://api.avalai.ir/v1/search/perplexity-search', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.AVALAI_API_KEY}`
  },
  body: JSON.stringify({
    query: 'latest developments in quantum computing',
    max_results: 5
  })
});

const results = await response.json();
console.log(results);

go=:package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
)

func main() {
	apiKey := os.Getenv("AVALAI_API_KEY")

	requestBody, _ := json.Marshal(map[string]interface{}{
		"query":       "latest developments in quantum computing",
		"max_results": 5,
	})

	req, _ := http.NewRequest("POST",
		"https://api.avalai.ir/v1/search/perplexity-search",
		bytes.NewBuffer(requestBody))

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+apiKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Printf("Error: %v\n", err)
		return
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	fmt.Println(string(body))
}

php=:<?php

$apiKey = getenv('AVALAI_API_KEY');

$data = [
    'query' => 'latest developments in quantum computing',
    'max_results' => 5
];

$ch = curl_init('https://api.avalai.ir/v1/search/perplexity-search');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $apiKey
]);

$response = curl_exec($ch);
curl_close($ch);

$results = json_decode($response, true);
print_r($results);

```

### Method 2: Specify Tool in Request Body

Alternatively, you can specify the search tool in the request body using the base `v1/search` endpoint:

```language-selector
bash=:curl https://api.avalai.ir/v1/search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "search_tool_name": "tavily-search",
    "query": "climate change impact on polar ice caps",
    "max_results": 10
  }'

python=:import requests

response = requests.post(
    "https://api.avalai.ir/v1/search",
    headers={"Content-Type": "application/json", "Authorization": f"Bearer {api_key}"},
    json={
        "search_tool_name": "tavily-search",
        "query": "climate change impact on polar ice caps",
        "max_results": 10,
    },
)

results = response.json()

# Access search results
for result in results.get("results", []):
    print(f"Title: {result['title']}")
    print(f"URL: {result['url']}")
    print(f"Snippet: {result['snippet']}")
    print("---")

javascript=:const response = await fetch('https://api.avalai.ir/v1/search', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.AVALAI_API_KEY}`
  },
  body: JSON.stringify({
    search_tool_name: 'tavily-search',
    query: 'climate change impact on polar ice caps',
    max_results: 10
  })
});

const results = await response.json();

// Process results
results.results?.forEach(result => {
  console.log(`Title: ${result.title}`);
  console.log(`URL: ${result.url}`);
  console.log(`Snippet: ${result.snippet}`);
  console.log('---');
});

go=:package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
)

type SearchRequest struct {
	SearchToolName string `json:"search_tool_name"`
	Query          string `json:"query"`
	MaxResults     int    `json:"max_results"`
}

type SearchResult struct {
	Title   string `json:"title"`
	URL     string `json:"url"`
	Snippet string `json:"snippet"`
}

type SearchResponse struct {
	Results []SearchResult `json:"results"`
}

func main() {
	apiKey := os.Getenv("AVALAI_API_KEY")

	searchReq := SearchRequest{
		SearchToolName: "tavily-search",
		Query:          "climate change impact on polar ice caps",
		MaxResults:     10,
	}

	requestBody, _ := json.Marshal(searchReq)

	req, _ := http.NewRequest("POST",
		"https://api.avalai.ir/v1/search",
		bytes.NewBuffer(requestBody))

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+apiKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Printf("Error: %v\n", err)
		return
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)

	var searchResp SearchResponse
	json.Unmarshal(body, &searchResp)

	for _, result := range searchResp.Results {
		fmt.Printf("Title: %s\n", result.Title)
		fmt.Printf("URL: %s\n", result.URL)
		fmt.Printf("Snippet: %s\n", result.Snippet)
		fmt.Println("---")
	}
}

php=:<?php

$apiKey = getenv('AVALAI_API_KEY');

$data = [
    'search_tool_name' => 'tavily-search',
    'query' => 'climate change impact on polar ice caps',
    'max_results' => 10
];

$ch = curl_init('https://api.avalai.ir/v1/search');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $apiKey
]);

$response = curl_exec($ch);
curl_close($ch);

$results = json_decode($response, true);

foreach ($results['results'] ?? [] as $result) {
    echo "Title: " . $result['title'] . "\n";
    echo "URL: " . $result['url'] . "\n";
    echo "Snippet: " . $result['snippet'] . "\n";
    echo "---\n";
}

```

## Advanced Features

### Controlling Result Count

Specify the number of results to retrieve using the `max_results` parameter:

```language-selector
bash=:curl https://api.avalai.ir/v1/search/google_pse-search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "query": "best practices for API design",
    "max_results": 20
  }'

python=:import requests

response = requests.post(
    "https://api.avalai.ir/v1/search/google_pse-search",
    headers={"Content-Type": "application/json", "Authorization": f"Bearer {api_key}"},
    json={"query": "best practices for API design", "max_results": 20},
)

results = response.json()

javascript=:const response = await fetch('https://api.avalai.ir/v1/search/google_pse-search', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.AVALAI_API_KEY}`
  },
  body: JSON.stringify({
    query: 'best practices for API design',
    max_results: 20
  })
});

const results = await response.json();

```

### Serper Time-Based and Geo-Targeted Search

Use `serper-search` for low-cost Google-powered search with Serper-specific parameters such as `gl`, `hl`, `autocorrect`, `tbs`, and `page`:

```language-selector
bash=:curl https://api.avalai.ir/v1/search/serper-search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
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
    headers={"Content-Type": "application/json", "Authorization": f"Bearer {api_key}"},
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

javascript=:const response = await fetch('https://api.avalai.ir/v1/search/serper-search', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.AVALAI_API_KEY}`
  },
  body: JSON.stringify({
    query: 'restaurants',
    max_results: 10,
    // Serper-specific parameters
    gl: 'uk',              // Country/geolocation code
    hl: 'en',              // Language code
    autocorrect: false,    // Disable autocorrect
    tbs: 'qdr:d',          // Time filter: past day
    page: 1,               // Page number
    // Geo-targeting
    country: 'DE',
    location: 'Berlin,Germany'
  })
});

const results = await response.json();

```

**Time-based search values:** `qdr:h` (past hour), `qdr:d` (past day), `qdr:w` (past week), `qdr:m` (past month), and `qdr:y` (past year).

### Domain-Specific Search

Use the `domains` parameter to limit search results to specific domains:

```language-selector
bash=:curl https://api.avalai.ir/v1/search/tavily-search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "query": "machine learning tutorials",
    "domains": ["arxiv.org", "papers.nips.cc", "scholar.google.com"],
    "max_results": 10
  }'

python=:import requests

response = requests.post(
    "https://api.avalai.ir/v1/search/tavily-search",
    headers={"Content-Type": "application/json", "Authorization": f"Bearer {api_key}"},
    json={
        "query": "machine learning tutorials",
        "domains": ["arxiv.org", "papers.nips.cc", "scholar.google.com"],
        "max_results": 10,
    },
)

results = response.json()

javascript=:const response = await fetch('https://api.avalai.ir/v1/search/tavily-search', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.AVALAI_API_KEY}`
  },
  body: JSON.stringify({
    query: 'machine learning tutorials',
    domains: ['arxiv.org', 'papers.nips.cc', 'scholar.google.com'],
    max_results: 10
  })
});

const results = await response.json();

```

### Search Depth Control (Tavily Advanced)

For deeper search analysis, use `tavily-search-advanced` with search depth control:

```language-selector
bash=:curl https://api.avalai.ir/v1/search/tavily-search-advanced \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "query": "comprehensive analysis of renewable energy trends",
    "search_depth": "advanced",
    "max_results": 15
  }'

python=:import requests

response = requests.post(
    "https://api.avalai.ir/v1/search/tavily-search-advanced",
    headers={"Content-Type": "application/json", "Authorization": f"Bearer {api_key}"},
    json={
        "query": "comprehensive analysis of renewable energy trends",
        "search_depth": "advanced",
        "max_results": 15,
    },
)

results = response.json()

javascript=:const response = await fetch('https://api.avalai.ir/v1/search/tavily-search-advanced', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.AVALAI_API_KEY}`
  },
  body: JSON.stringify({
    query: 'comprehensive analysis of renewable energy trends',
    search_depth: 'advanced',
    max_results: 15
  })
});

const results = await response.json();

```

### Neural Semantic Search (Exa AI)

For semantic/neural search capabilities, use Exa AI:

```language-selector
bash=:curl https://api.avalai.ir/v1/search/exa_ai-search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "query": "innovative startups working on sustainable agriculture",
    "max_results": 10
  }'

python=:import requests

response = requests.post(
    "https://api.avalai.ir/v1/search/exa_ai-search",
    headers={"Content-Type": "application/json", "Authorization": f"Bearer {api_key}"},
    json={
        "query": "innovative startups working on sustainable agriculture",
        "max_results": 10,
    },
)

results = response.json()

# Exa AI provides semantically relevant results
for result in results.get("results", []):
    print(f"Relevant URL: {result['url']}")
    print(f"Context: {result['snippet']}")

javascript=:const response = await fetch('https://api.avalai.ir/v1/search/exa_ai-search', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.AVALAI_API_KEY}`
  },
  body: JSON.stringify({
    query: 'innovative startups working on sustainable agriculture',
    max_results: 10
  })
});

const results = await response.json();

// Process semantically relevant results
results.results?.forEach(result => {
  console.log(`Relevant URL: ${result.url}`);
  console.log(`Context: ${result.snippet}`);
});

```

### Web Scraping and Content Extraction (Firecrawl)

For search combined with web scraping and content extraction capabilities, use Firecrawl:

```language-selector
bash=:curl https://api.avalai.ir/v1/search/firecrawl-search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "query": "machine learning best practices",
    "sources": ["web", "news"],
    "categories": [{"type": "github"}, {"type": "research"}],
    "scrapeOptions": {
      "formats": ["markdown"],
      "onlyMainContent": true,
      "removeBase64Images": true
    },
    "max_results": 10
  }'

python=:import requests

response = requests.post(
    "https://api.avalai.ir/v1/search/firecrawl-search",
    headers={"Content-Type": "application/json", "Authorization": f"Bearer {api_key}"},
    json={
        "query": "machine learning best practices",
        "sources": ["web", "news"],
        "categories": [{"type": "github"}, {"type": "research"}],
        "scrapeOptions": {
            "formats": ["markdown"],
            "onlyMainContent": True,
            "removeBase64Images": True,
        },
        "max_results": 10,
    },
)

results = response.json()

# Firecrawl provides search results with scraped content
for result in results.get("results", []):
    print(f"Title: {result['title']}")
    print(f"URL: {result['url']}")
    print(f"Content: {result.get('content', result['snippet'])[:200]}...")

javascript=:const response = await fetch('https://api.avalai.ir/v1/search/firecrawl-search', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.AVALAI_API_KEY}`
  },
  body: JSON.stringify({
    query: 'machine learning best practices',
    sources: ['web', 'news'],
    categories: [{ type: 'github' }, { type: 'research' }],
    scrapeOptions: {
      formats: ['markdown'],
      onlyMainContent: true,
      removeBase64Images: true
    },
    max_results: 10
  })
});

const results = await response.json();

// Process scraped results
results.results?.forEach(result => {
  console.log(`Title: ${result.title}`);
  console.log(`URL: ${result.url}`);
  console.log(`Content: ${(result.content || result.snippet).substring(0, 200)}...`);
});

```

**Firecrawl Advanced Features:**

```python
# Time-based search
response = requests.post(
    "https://api.avalai.ir/v1/search/firecrawl-search",
    headers={"Content-Type": "application/json", "Authorization": f"Bearer {api_key}"},
    json={
        "query": "AI developments",
        "tbs": "qdr:m",  # Past month
        "max_results": 10,
    },
)

# Category filtering for research papers and PDFs
response = requests.post(
    "https://api.avalai.ir/v1/search/firecrawl-search",
    headers={"Content-Type": "application/json", "Authorization": f"Bearer {api_key}"},
    json={
        "query": "climate change research",
        "categories": [{"type": "research"}, {"type": "pdf"}],
        "max_results": 10,
    },
)

# Geographic targeting
response = requests.post(
    "https://api.avalai.ir/v1/search/firecrawl-search",
    headers={"Content-Type": "application/json", "Authorization": f"Bearer {api_key}"},
    json={
        "query": "tech events",
        "location": "San Francisco,California,United States",
        "country": "US",
        "max_results": 10,
    },
)

# Using advanced search operators
response = requests.post(
    "https://api.avalai.ir/v1/search/firecrawl-search",
    headers={"Content-Type": "application/json", "Authorization": f"Bearer {api_key}"},
    json={
        "query": 'site:github.com "tensorflow" -deprecated',
        "max_results": 10,
    },
)
```

## Use Cases

### 1. Research Automation

Automate research by collecting information from multiple search tools:

```language-selector
bash=:# Search across multiple providers
curl https://api.avalai.ir/v1/search/dataforseo-search \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query": "artificial intelligence ethics guidelines", "max_results": 5}'

curl https://api.avalai.ir/v1/search/exa_ai-search \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query": "artificial intelligence ethics guidelines", "max_results": 5}'

python=:import requests
import asyncio
import aiohttp


async def search_multiple_providers(query):
    """Search across multiple providers simultaneously"""
    api_key = "your-avalai-api-key"

    search_tools = [
        "serper-search",
        "dataforseo-search",
        "parallel_ai-search",
        "exa_ai-search",
    ]

    async with aiohttp.ClientSession() as session:
        tasks = []
        for tool in search_tools:
            url = f"https://api.avalai.ir/v1/search/{tool}"
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {api_key}",
            }
            data = {"query": query, "max_results": 5}

            tasks.append(session.post(url, json=data, headers=headers))

        responses = await asyncio.gather(*tasks)
        results = []
        for response in responses:
            results.append(await response.json())

        return results


# Use the function
results = asyncio.run(
    search_multiple_providers("artificial intelligence ethics guidelines")
)

# Aggregate and deduplicate results
all_urls = set()
for provider_results in results:
    for result in provider_results.get("results", []):
        all_urls.add(result["url"])

print(f"Found {len(all_urls)} unique sources")

javascript=:import fetch from 'node-fetch';

async function searchMultipleProviders(query) {
  const apiKey = process.env.AVALAI_API_KEY;
  
  const searchTools = [
    'serper-search',
    'dataforseo-search',
    'parallel_ai-search',
    'exa_ai-search'
  ];
  
  const promises = searchTools.map(tool =>
    fetch(`https://api.avalai.ir/v1/search/${tool}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({ query, max_results: 5 })
    }).then(r => r.json())
  );
  
  const results = await Promise.all(promises);
  
  // Aggregate and deduplicate
  const allUrls = new Set();
  results.forEach(providerResults => {
    providerResults.results?.forEach(result => {
      allUrls.add(result.url);
    });
  });
  
  console.log(`Found ${allUrls.size} unique sources`);
  return results;
}

// Use the function
const results = await searchMultipleProviders(
  'artificial intelligence ethics guidelines'
);

```

### 2. Price Comparison and Monitoring

Build a price monitoring system using cost-effective search tools:

```language-selector
bash=:# Use DataForSEO for cost-effective price monitoring
curl https://api.avalai.ir/v1/search/dataforseo-search \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "iPhone 15 Pro Max price",
    "max_results": 20
  }'

python=:import requests
import re
from datetime import datetime


def monitor_prices(product_query):
    """Monitor prices for a product across different retailers"""
    response = requests.post(
        "https://api.avalai.ir/v1/search/dataforseo-search",
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}",
        },
        json={"query": product_query, "max_results": 20},
    )

    results = response.json()

    prices = []
    for result in results.get("results", []):
        # Extract price from snippet (simplified example)
        snippet = result.get("snippet", "")
        price_match = re.search(r"\$[\d,]+(?:\.\d{2})?", snippet)

        if price_match:
            prices.append(
                {
                    "url": result["url"],
                    "title": result["title"],
                    "price": price_match.group(),
                    "timestamp": datetime.now().isoformat(),
                }
            )

    return prices


# Monitor iPhone prices
iphone_prices = monitor_prices("iPhone 15 Pro Max price")

for item in iphone_prices:
    print(f"{item['title']}: {item['price']}")
    print(f"URL: {item['url']}\n")

javascript=:async function monitorPrices(productQuery) {
  const response = await fetch('https://api.avalai.ir/v1/search/dataforseo-search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.AVALAI_API_KEY}`
    },
    body: JSON.stringify({
      query: productQuery,
      max_results: 20
    })
  });
  
  const results = await response.json();
  
  const prices = [];
    // Extract price from snippet
    const priceMatch = result.snippet?.match(/\$[\d,]+(?:\.\d{2})?/);
    
    if (priceMatch) {
      prices.push({
        url: result.url,
        title: result.title,
        price: priceMatch[0],
        timestamp: new Date().toISOString()
      });
    }
  });
  
  return prices;
}

// Monitor product prices
const iphonePrices = await monitorPrices('iPhone 15 Pro Max price');

iphonePrices.forEach(item => {
  console.log(`${item.title}: ${item.price}`);
  console.log(`URL: ${item.url}\n`);
});

```

### 3. News Aggregation

Aggregate news from multiple sources using fast search tools:

```language-selector
bash=:# Use Parallel AI for fast news aggregation
curl https://api.avalai.ir/v1/search/parallel_ai-search \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "latest technology news",
    "max_results": 15
  }'

python=:import requests
from datetime import datetime


def aggregate_news(topic, max_results=15):
    """Aggregate news articles on a specific topic"""
    response = requests.post(
        "https://api.avalai.ir/v1/search/parallel_ai-search",
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}",
        },
        json={"query": f"{topic} news", "max_results": max_results},
    )

    results = response.json()

    articles = []
    for result in results.get("results", []):
        articles.append(
            {
                "title": result["title"],
                "url": result["url"],
                "snippet": result["snippet"],
                "fetched_at": datetime.now().isoformat(),
            }
        )

    return articles


# Aggregate tech news
tech_news = aggregate_news("artificial intelligence")

print(f"Found {len(tech_news)} articles:\n")
for article in tech_news[:5]:  # Show first 5
    print(f"📰 {article['title']}")
    print(f"   {article['snippet'][:100]}...")
    print(f"   {article['url']}\n")

javascript=:async function aggregateNews(topic, maxResults = 15) {
  const response = await fetch('https://api.avalai.ir/v1/search/parallel_ai-search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.AVALAI_API_KEY}`
    },
    body: JSON.stringify({
      query: `${topic} news`,
      max_results: maxResults
    })
  });
  
  const results = await response.json();
  
  const articles = results.results?.map(result => ({
    title: result.title,
    url: result.url,
    snippet: result.snippet,
    fetchedAt: new Date().toISOString()
  })) || [];
  
  return articles;
}

// Aggregate AI news
const aiNews = await aggregateNews('artificial intelligence');

console.log(`Found ${aiNews.length} articles:\n`);
aiNews.slice(0, 5).forEach(article => {
  console.log(`📰 ${article.title}`);
  console.log(`   ${article.snippet.substring(0, 100)}...`);
  console.log(`   ${article.url}\n`);
});

```

### 4. Academic Research

Search academic sources using domain-specific filtering:

```language-selector
bash=:# Search academic papers using Tavily with domain filtering
curl https://api.avalai.ir/v1/search/tavily-search \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "quantum computing breakthrough 2024",
    "domains": ["arxiv.org", "nature.com", "science.org", "scholar.google.com"],
    "max_results": 15
  }'

python=:import requests


def search_academic_papers(query, domains=None):
    """Search for academic papers from trusted sources"""
    if domains is None:
        domains = [
            "arxiv.org",
            "nature.com",
            "science.org",
            "scholar.google.com",
            "ieee.org",
            "acm.org",
        ]

    response = requests.post(
        "https://api.avalai.ir/v1/search/tavily-search",
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}",
        },
        json={"query": query, "domains": domains, "max_results": 15},
    )

    results = response.json()

    papers = []
    for result in results.get("results", []):
        papers.append(
            {
                "title": result["title"],
                "url": result["url"],
                "abstract": result["snippet"],
                "source": result["url"].split("/")[2],  # Extract domain
            }
        )

    return papers


# Search for quantum computing papers
papers = search_academic_papers("quantum computing breakthrough 2024")

print(f"Found {len(papers)} academic papers:\n")
for paper in papers:
    print(f"📄 {paper['title']}")
    print(f"   Source: {paper['source']}")
    print(f"   {paper['url']}\n")

javascript=:async function searchAcademicPapers(query, domains = null) {
  if (!domains) {
    domains = [
      'arxiv.org',
      'nature.com',
      'science.org',
      'scholar.google.com',
      'ieee.org',
      'acm.org'
    ];
  }
  
  const response = await fetch('https://api.avalai.ir/v1/search/tavily-search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.AVALAI_API_KEY}`
    },
    body: JSON.stringify({
      query,
      domains,
      max_results: 15
    })
  });
  
  const results = await response.json();
  
  const papers = results.results?.map(result => ({
    title: result.title,
    url: result.url,
    abstract: result.snippet,
    source: new URL(result.url).hostname
  })) || [];
  
  return papers;
}

// Search for quantum computing papers
const papers = await searchAcademicPapers('quantum computing breakthrough 2024');

console.log(`Found ${papers.length} academic papers:\n`);
papers.forEach(paper => {
  console.log(`📄 ${paper.title}`);
  console.log(`   Source: ${paper.source}`);
  console.log(`   ${paper.url}\n`);
});

```

### 5. Competitive Intelligence

Use Exa AI's semantic search for competitive analysis:

```language-selector
bash=:# Use Exa AI for semantic company/competitor search
curl https://api.avalai.ir/v1/search/exa_ai-search \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "companies developing AI agents for enterprise automation",
    "max_results": 10
  }'

python=:import requests


def competitive_intelligence(query, max_results=10):
    """Gather competitive intelligence using semantic search"""
    response = requests.post(
        "https://api.avalai.ir/v1/search/exa_ai-search",
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}",
        },
        json={"query": query, "max_results": max_results},
    )

    results = response.json()

    competitors = []
    for result in results.get("results", []):
        competitors.append(
            {
                "company": result["title"],
                "url": result["url"],
                "description": result["snippet"],
            }
        )

    return competitors


# Find competitors in AI agents space
competitors = competitive_intelligence(
    "companies developing AI agents for enterprise automation"
)

print(f"Found {len(competitors)} relevant companies:\n")
for comp in competitors:
    print(f"🏢 {comp['company']}")
    print(f"   {comp['description'][:150]}...")
    print(f"   {comp['url']}\n")

javascript=:async function competitiveIntelligence(query, maxResults = 10) {
  const response = await fetch('https://api.avalai.ir/v1/search/exa_ai-search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.AVALAI_API_KEY}`
    },
    body: JSON.stringify({
      query,
      max_results: maxResults
    })
  });
  
  const results = await response.json();
  
  const competitors = results.results?.map(result => ({
    company: result.title,
    url: result.url,
    description: result.snippet
  })) || [];
  
  return competitors;
}

// Find competitors in AI agents space
const competitors = await competitiveIntelligence(
  'companies developing AI agents for enterprise automation'
);

console.log(`Found ${competitors.length} relevant companies:\n`);
competitors.forEach(comp => {
  console.log(`🏢 ${comp.company}`);
  console.log(`   ${comp.description.substring(0, 150)}...`);
  console.log(`   ${comp.url}\n`);
});

```

## Understanding Response Format

The v1/search API returns results in a Perplexity-compatible format:

```json
{
  "results": [
    {
      "title": "Article Title",
      "url": "https://example.com/article",

      "snippet": "Preview text from the article...",
      "published_date": "2024-10-26",
      "author": "Author Name"
    }
  ],
  "query": "your search query",
  "search_tool": "perplexity-search"
}
```

### Processing Results

```language-selector
python=:import requests
import json


def process_search_results(query, search_tool="perplexity-search"):
    """Process and structure search results"""
    response = requests.post(
        f"https://api.avalai.ir/v1/search/{search_tool}",
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}",
        },
        json={"query": query, "max_results": 10},
    )

    data = response.json()

    # Extract and structure results
    processed = {
        "query": data.get("query", query),
        "tool_used": data.get("search_tool", search_tool),
        "total_results": len(data.get("results", [])),
        "results": [],
    }

    for result in data.get("results", []):
        processed["results"].append(
            {
                "title": result.get("title", ""),
                "url": result.get("url", ""),
                "snippet": result.get("snippet", "")[:200],  # Truncate
                "published": result.get("published_date", "Unknown"),
            }
        )

    return processed


# Use the function
results = process_search_results("climate change solutions")

print(f"Query: {results['query']}")
print(f"Tool: {results['tool_used']}")
print(f"Found: {results['total_results']} results\n")

for i, result in enumerate(results["results"][:5], 1):
    print(f"{i}. {result['title']}")
    print(f"   {result['snippet']}")
    print(f"   {result['url']}\n")

javascript=:async function processSearchResults(query, searchTool = 'perplexity-search') {
  const response = await fetch(`https://api.avalai.ir/v1/search/${searchTool}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.AVALAI_API_KEY}`
    },
    body: JSON.stringify({
      query,
      max_results: 10
    })
  });
  
  const data = await response.json();
  
  // Extract and structure results
  const processed = {
    query: data.query || query,
    toolUsed: data.search_tool || searchTool,
    totalResults: data.results?.length || 0,
    results: data.results?.map(result => ({
      title: result.title || '',
      url: result.url || '',
      snippet: (result.snippet || '').substring(0, 200),
      published: result.published_date || 'Unknown'
    })) || []
  };
  
  return processed;
}

// Use the function
const results = await processSearchResults('climate change solutions');

console.log(`Query: ${results.query}`);
console.log(`Tool: ${results.toolUsed}`);
console.log(`Found: ${results.totalResults} results\n`);

results.results.slice(0, 5).forEach((result, i) => {
  console.log(`${i + 1}. ${result.title}`);
  console.log(`   ${result.snippet}`);
  console.log(`   ${result.url}\n`);
});

```

## Comparison: v1/search vs Web Search in Chat Completions

| Feature | v1/search API | Web Search in Chat Completions |
|---------|---------------|-------------------------------|
| **Output** | Raw search results (URLs, snippets) | AI-generated response with citations |
| **Processing** | No LLM processing | LLM analyzes and synthesizes results |
| **Use Case** | Data aggregation, research, monitoring | Conversational AI, Q&A, assistance |
| **Response Format** | Structured JSON (Perplexity-compatible) | Natural language text |
| **Cost** | $0.003-$0.025 per query | LLM token costs + search costs |
| **Speed** | Fast (direct search) | Slower (search + LLM processing) |
| **Customization** | Choose specific search providers | Automatic provider selection |
| **Citations** | All URLs returned | Selected citations in response |

### When to Use v1/search API

Use the v1/search API when you need:
- Direct access to search results without AI interpretation
- Multiple search results for further processing
- Cost-effective search at scale
- Custom search interfaces or aggregation systems
- Raw data for analysis or storage
- Specific search provider capabilities

### When to Use Web Search in Chat Completions

Use web search in chat completions when you need:
- Natural language responses to questions
- AI-synthesized information from multiple sources
- Conversational interfaces with real-time data
- Automatic relevance filtering by LLM
- Responses with explanations and context

**Example of the difference:**

```language-selector
bash=:# v1/search API - Returns search results
curl https://api.avalai.ir/v1/search/perplexity-search \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query": "What is quantum computing?", "max_results": 5}'

# Returns: List of URLs, titles, and snippets

# Web Search in Chat - Returns AI response
curl https://api.avalai.ir/v1/chat/completions \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o-search-preview",
    "messages": [{"role": "user", "content": "What is quantum computing?"}]
  }'

# Returns: Coherent explanation synthesized by AI with citations

```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `gpt-4o-search-preview` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

Use this version when the selected model supports `/v1/responses`. `messages` moves to `input`, and the final text is read from `response.output_text`.

```language-selector
python=:import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["AVALAI_API_KEY"],
    base_url="https://api.avalai.ir/v1",
)

response = client.responses.create(
    model="gpt-5.5",
    instructions="You are a helpful assistant.",
    input="What is quantum computing?",
)

print(response.output_text)

javascript=:import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.responses.create({
  model: "gpt-5.5",
  instructions: "You are a helpful assistant.",
  input: "What is quantum computing?",
});

console.log(response.output_text);

bash=:curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '
  {
    "model": "gpt-5.5",
    "input": "What is quantum computing?",
    "instructions": "You are a helpful assistant."
  }'

```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


## Best Practices

### 1. Choose the Right Search Tool

Select search tools based on your needs:

- **Lowest-cost applications**: Use `serper-search` ($0.001/query)
- **Cost-sensitive applications**: Use `dataforseo-search` ($0.003/query)
- **General web search**: Use `perplexity-search` or `google_pse-search` ($0.005/query)
- **Semantic/neural search**: Use `exa_ai-search` ($0.025/query)
- **Deep research**: Use `tavily-search-advanced` ($0.016/query)
- **Fast parallel search**: Use `parallel_ai-search` or `parallel_ai-search-pro`

### 2. Optimize Result Count

Balance between cost and comprehensiveness:

```python
# For quick lookups
response = search("query", max_results=5)  # Cheaper, faster

# For comprehensive research
response = search("query", max_results=20)  # More thorough

# Note: Most providers support 1-20 results per query
```

### 3. Implement Caching

Cache search results to reduce costs:

```python
import requests
from functools import lru_cache
from datetime import datetime, timedelta


class SearchCache:
    def __init__(self, api_key):
        self.api_key = api_key
        self.cache = {}

    def search(
        self,
        query,
        search_tool="dataforseo-search",
        max_results=10,
        cache_duration=3600,
    ):
        """Search with caching (cache_duration in seconds)"""
        cache_key = f"{search_tool}:{query}:{max_results}"

        # Check cache
        if cache_key in self.cache:
            cached_data, timestamp = self.cache[cache_key]
            if datetime.now() - timestamp < timedelta(seconds=cache_duration):
                print(f"✓ Using cached results for: {query}")
                return cached_data

        # Perform search
        print(f"🔍 Searching: {query}")
        response = requests.post(
            f"https://api.avalai.ir/v1/search/{search_tool}",
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {self.api_key}",
            },
            json={"query": query, "max_results": max_results},
        )

        results = response.json()

        # Update cache
        self.cache[cache_key] = (results, datetime.now())

        return results


# Usage
cache = SearchCache(api_key="your-avalai-api-key")

# First call - performs search
results1 = cache.search("AI developments", cache_duration=1800)  # Cache for 30 min

# Second call - uses cache
results2 = cache.search("AI developments", cache_duration=1800)  # No API call
```

### 4. Handle Errors Gracefully

Implement proper error handling:

```python
import requests
from time import sleep


def robust_search(query, search_tool="perplexity-search", max_retries=3):
    """Search with retry logic and error handling"""
    for attempt in range(max_retries):
        try:
            response = requests.post(
                f"https://api.avalai.ir/v1/search/{search_tool}",
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {api_key}",
                },
                json={"query": query, "max_results": 10},
                timeout=30,
            )

            response.raise_for_status()  # Raise exception for 4xx/5xx

            return response.json()

        except requests.exceptions.Timeout:
            print(f"Timeout on attempt {attempt + 1}/{max_retries}")
            if attempt < max_retries - 1:
                sleep(2**attempt)  # Exponential backoff

        except requests.exceptions.RequestException as e:
            print(f"Error on attempt {attempt + 1}/{max_retries}: {str(e)}")
            if attempt < max_retries - 1:
                sleep(2**attempt)
            else:
                raise

    return None


# Usage
results = robust_search("quantum computing")
if results:
    print(f"Found {len(results.get('results', []))} results")
else:
    print("Search failed after retries")
```

### 5. Batch Processing

Process multiple queries efficiently:

```python
import asyncio
import aiohttp


async def batch_search(queries, search_tool="dataforseo-search", max_results=10):
    """Search multiple queries concurrently"""
    async with aiohttp.ClientSession() as session:
        tasks = []

        for query in queries:
            task = session.post(
                f"https://api.avalai.ir/v1/search/{search_tool}",
                json={"query": query, "max_results": max_results},
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {api_key}",
                },
            )
            tasks.append(task)

        responses = await asyncio.gather(*tasks, return_exceptions=True)

        results = []
        for i, response in enumerate(responses):
            if isinstance(response, Exception):
                print(f"Error for query '{queries[i]}': {str(response)}")
                results.append(None)
            else:
                results.append(await response.json())

        return results


# Usage
queries = ["AI trends 2024", "quantum computing news", "renewable energy developments"]

results = asyncio.run(batch_search(queries))

for query, result in zip(queries, results):
    if result:
        print(f"✓ {query}: {len(result.get('results', []))} results")
    else:
        print(f"✗ {query}: Failed")
```

## Pricing and Cost Optimization

### Cost per Query

| Search Tool | Cost | Requests per $1 |
|------------|------|-----------------|
| serper-search | $0.001 | ~1000 |
| dataforseo-search | $0.003 | ~333 |
| parallel_ai-search | $0.004 | ~250 |
| perplexity-search | $0.005 | ~200 |
| google_pse-search | $0.005 | ~200 |
| tavily-search | $0.008 | ~125 |
| parallel_ai-search-pro | $0.009 | ~111 |
| tavily-search-advanced | $0.016 | ~62 |
| exa_ai-search | $0.025 | ~40 |

### Cost Optimization Strategies

1. **Use cheaper tools for high-volume searches**:
   ```python
# For price monitoring (high volume)
   tool = "serper-search"  # $0.001/query
   
   # For semantic analysis (low volume, high quality)
   tool = "exa_ai-search"  # $0.025/query
```

2. **Implement tiered search**:
   ```python
def tiered_search(query):
    # Try lowest-cost tool first
    results = search(query, "serper-search", max_results=5)

    # If not satisfied, use premium tool
    if not is_satisfactory(results):
        results = search(query, "exa_ai-search", max_results=10)

    return results
```

3. **Monitor and analyze costs**:
   ```python
import csv
   from datetime import datetime
   
   class CostTracker:
       COSTS = {
           "serper-search": 0.001,
           "dataforseo-search": 0.003,
           "parallel_ai-search": 0.004,
           "perplexity-search": 0.005,
           "google_pse-search": 0.005,
           "tavily-search": 0.008,
           "parallel_ai-search-pro": 0.009,
           "tavily-search-advanced": 0.016,
           "exa_ai-search": 0.025,
       }
       
       def __init__(self, log_file="search_costs.csv"):
           self.log_file = log_file
           self.total_cost = 0
           self.query_count = 0
       
       def log_search(self, search_tool, query):
           cost = self.COSTS.get(search_tool, 0)
           self.total_cost += cost
           self.query_count += 1
           
           with open(self.log_file, 'a', newline='') as f:
               writer = csv.writer(f)
               writer.writerow([
                   datetime.now().isoformat(),
                   search_tool,
                   query,
                   cost,
                   self.total_cost
               ])
           
           return cost
       
       def get_summary(self):
           return {
               'total_queries': self.query_count,
               'total_cost': f"${self.total_cost:.4f}",
               'avg_cost': f"${self.total_cost/self.query_count:.4f}" if self.query_count > 0 else "$0"
           }
   
   # Usage
   tracker = CostTracker()
   
   # Perform searches
   tracker.log_search("serper-search", "query 1")
   tracker.log_search("dataforseo-search", "query 2")
   tracker.log_search("perplexity-search", "query 3")
   tracker.log_search("exa_ai-search", "query 4")
   
   print(tracker.get_summary())
```

## Rate Limits and Quotas

The v1/search API respects your AvalAI account tier limits. Refer to the [pricing page](en/pricing.md) for tier-specific rate limits.

## Error Handling

Common error responses:

```json
{
  "error": {
    "message": "Invalid API key",
    "type": "authentication_error",
    "code": "invalid_api_key"
  }
}
```

```json
{
  "error": {
    "message": "Rate limit exceeded",
    "type": "rate_limit_error",
    "code": "rate_limit_exceeded"
  }
}
```

```json
{
  "error": {
    "message": "Invalid search tool",
    "type": "invalid_request_error",
    "code": "invalid_search_tool"
  }
}
```

## Troubleshooting

### Empty Results

If you receive empty results:

1. Check query formatting
2. Try a different search tool
3. Adjust `max_results` parameter
4. Verify the query is in English (some tools work best with English queries)

### Timeout Errors

For timeout issues:

1. Reduce `max_results` count
2. Use faster search tools (`serper-search`, `parallel_ai-search`, `dataforseo-search`)
3. Implement retry logic with exponential backoff
4. Consider splitting large searches into smaller batches

### Cost Management

To manage costs effectively:

1. Use caching for repeated queries
2. Start with cheaper search tools
3. Implement query deduplication
4. Monitor usage with cost tracking
5. Set budget alerts in your application

## Related Documentation

- [Search API Reference](en/api-reference/search.md) - Complete API specification
- [Web Search in Chat Completions](en/examples/web_search_capabilities.md) - LLM-augmented search
- [Search Providers](en/models/index.md) - Detailed provider information
- [Pricing](en/pricing.md) - Cost and tier information

## Conclusion

The `v1/search` API provides powerful programmatic access to multiple search engines through a unified interface. By choosing the right search tool for your use case and implementing best practices for caching and error handling, you can build cost-effective search-powered applications.

For questions or support, visit our [documentation](en/index.md) or contact support.