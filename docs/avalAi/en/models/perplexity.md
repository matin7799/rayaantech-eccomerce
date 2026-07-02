# Perplexity

Perplexity offers two types of services:

1. **LLM Models**: Advanced AI models with real-time web search integration, Chain-of-Thought reasoning, and comprehensive research capabilities
2. **Search Service** (`perplexity-search`): Direct access to Perplexity's search capabilities via [`v1/search`](en/examples/using_v1_search.md) without requiring an LLM

All LLM models combine powerful language understanding with live web search to deliver grounded, cited answers.

## Available Models

- [sonar](#sonar) - Fast answers with reliable search results
- [sonar-pro](#sonar-pro) - Advanced search with enhanced results
- [sonar-reasoning](#sonar-reasoning) - Quick reasoning with real-time search
- [sonar-reasoning-pro](#sonar-reasoning-pro) - Advanced reasoning with comprehensive search
- [sonar-deep-research](#sonar-deep-research) - Exhaustive research across hundreds of sources

## API Endpoint Support

| Model | v1/chat/completions | v1/completions | v1/messages | v1/responses |
|-------|---------------------|----------------|-------------|--------------|
| All Perplexity models | ✅ Full | ✅ Full | ⚠️ Partial | ⚠️ Partial |

---

## sonar

**Fast answers with reliable search results**

A lightweight, cost-effective search model optimized for quick, grounded answers with real-time web search.

### Features

- **Non-reasoning model**: Optimized for speed and directness
- **Context Window**: 128K tokens
- **Real-Time Web Search**: Live search with citations and metadata
- **Cost-Effective**: Balanced pricing for general use
- **No Training on Customer Data**: Privacy-focused

### Pricing

| Type | Cost |
|------|------|
| Input Tokens | $1.00 per 1M tokens |
| Cached Input Tokens | $0.50 per 1M tokens |
| Output Tokens | $1.00 per 1M tokens |
| Search Context (Low) | $5 per 1K requests |
| Search Context (Medium) | $8 per 1K requests |
| Search Context (High) | $12 per 1K requests |

### Use Cases

- Quick searches and fact-checking
- News summaries and current events
- Simple Q&A tasks
- Definitions and explanations

### Example

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "sonar",
    "messages": [
      {
        "role": "user",
        "content": "What is the latest news in AI research?"
      }
    ]
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="sonar",
    messages=[{"role": "user", "content": "What is the latest news in AI research?"}],
)

print(response.choices[0].message.content)
print(f"Citations: {response.citations}")

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1"
});

const response = await client.chat.completions.create({
  model: "sonar",
  messages: [
    { role: "user", content: "What is the latest news in AI research?" }
  ]
});

console.log(response.choices[0].message.content);
console.log("Citations:", response.citations);

```

---

## sonar-pro

**Advanced search with enhanced search results**

An advanced search model designed for complex queries, delivering 2x more search results than standard Sonar with deeper content understanding.

### Features

- **Non-reasoning model**: Advanced information retrieval
- **Context Window**: 200K tokens
- **Enhanced Search Results**: 2x more results than Sonar
- **Complex Query Optimization**: Designed for multi-step questions
- **No Training on Customer Data**: Privacy-focused

### Pricing

| Type | Cost |
|------|------|
| Input Tokens | $3.00 per 1M tokens |
| Cached Input Tokens | $1.50 per 1M tokens |
| Output Tokens | $15.00 per 1M tokens |
| Search Context (Low) | $6 per 1K requests |
| Search Context (Medium) | $10 per 1K requests |
| Search Context (High) | $14 per 1K requests |

### Use Cases

- Complex research questions
- Comparative analysis across multiple sources
- Information synthesis and detailed reporting
- In-depth market analysis

### Example

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "sonar-pro",
    "messages": [
      {
        "role": "user",
        "content": "Analyze the competitive positioning of AI search engines in 2025"
      }
    ]
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="sonar-pro",
    messages=[
        {
            "role": "user",
            "content": "Analyze the competitive positioning of AI search engines in 2025",
        }
    ],
)

print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1"
});

const response = await client.chat.completions.create({
  model: "sonar-pro",
  messages: [
    { role: "user", content: "Analyze the competitive positioning of AI search engines in 2025" }
  ]
});

console.log(response.choices[0].message.content);

```

---

## sonar-reasoning

**Quick reasoning with real-time search**

A reasoning-focused model that applies Chain-of-Thought (CoT) reasoning for structured analysis with real-time web search.

### Features

- **Reasoning Model**: Chain-of-Thought (CoT) capabilities
- **Context Window**: 128K tokens
- **Quick Reasoning**: Optimized for fast problem-solving
- **Real-Time Web Search**: Integrated live search
- **No Training on Customer Data**: Privacy-focused

### Pricing

| Type | Cost |
|------|------|
| Input Tokens | $1.00 per 1M tokens |
| Cached Input Tokens | $0.50 per 1M tokens |
| Output Tokens | $5.00 per 1M tokens |
| Search Context (Low) | $5 per 1K requests |
| Search Context (Medium) | $8 per 1K requests |
| Search Context (High) | $14 per 1K requests |

### Use Cases

- Multi-step problem solving
- Logical analysis and structured reasoning
- Strategic planning and decision making
- Technical troubleshooting with research

### Example

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "sonar-reasoning",
    "messages": [
      {
        "role": "user",
        "content": "Design a comprehensive digital marketing strategy for a tech startup"
      }
    ],
    "max_tokens": 2048
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="sonar-reasoning",
    messages=[
        {
            "role": "user",
            "content": "Design a comprehensive digital marketing strategy for a tech startup",
        }
    ],
    max_tokens=2048,
)

# The model shows its Chain-of-Thought reasoning process
print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1"
});

const response = await client.chat.completions.create({
  model: "sonar-reasoning",
  messages: [
    { role: "user", content: "Design a comprehensive digital marketing strategy for a tech startup" }
  ],
  max_tokens: 2048
});

// The model shows its Chain-of-Thought reasoning process
console.log(response.choices[0].message.content);

```

---

## sonar-reasoning-pro

**Advanced reasoning with comprehensive search**

Enhanced Chain-of-Thought reasoning with 2x more search results for complex multi-step analysis tasks.

### Features

- **Advanced Reasoning Model**: Enhanced CoT capabilities
- **Context Window**: 128K tokens
- **Enhanced Search Results**: 2x more results than sonar-reasoning
- **Complex Multi-Step Tasks**: Optimized for deep analysis
- **No Training on Customer Data**: Privacy-focused

### Pricing

| Type | Cost |
|------|------|
| Input Tokens | $2.00 per 1M tokens |
| Cached Input Tokens | $1.00 per 1M tokens |
| Output Tokens | $8.00 per 1M tokens |
| Search Context (Low) | $6 per 1K requests |
| Search Context (Medium) | $10 per 1K requests |
| Search Context (High) | $14 per 1K requests |

### Use Cases

- Complex multi-step analysis and reasoning
- Advanced research with deep reasoning
- Strategic decision making with comprehensive analysis
- Complex problem decomposition

### Example

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "sonar-reasoning-pro",
    "messages": [
      {
        "role": "user",
        "content": "Develop a detailed product roadmap for an AI-powered platform"
      }
    ],
    "max_tokens": 4096
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="sonar-reasoning-pro",
    messages=[
        {
            "role": "user",
            "content": "Develop a detailed product roadmap for an AI-powered platform",
        }
    ],
    max_tokens=4096,
)

print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1"
});

const response = await client.chat.completions.create({
  model: "sonar-reasoning-pro",
  messages: [
    { role: "user", content: "Develop a detailed product roadmap for an AI-powered platform" }
  ],
  max_tokens: 4096
});

console.log(response.choices[0].message.content);

```

---

## sonar-deep-research

**Exhaustive research across hundreds of sources**

Expert-level subject analysis with detailed report generation, citation support, and comprehensive research capabilities.

### Features

- **Deep Research Model**: Exhaustive multi-source research
- **Context Window**: 128K tokens
- **Report Generation**: Detailed, structured reports
- **Advanced Citations**: Citation tokens for referencing
- **Reasoning Tokens**: Separate pricing for reasoning process
- **No Training on Customer Data**: Privacy-focused

### Pricing

| Type | Cost |
|------|------|
| Input Tokens | $2.00 per 1M tokens |
| Cached Input Tokens | $1.00 per 1M tokens |
| Output Tokens | $8.00 per 1M tokens |
| Reasoning Tokens | $3.00 per 1M tokens |
| Citation Tokens | $2.00 per 1M tokens |
| Search Query | $0.005 per query |
| Search Context (All levels) | $5 per 1K requests |

### Use Cases

- Academic research and comprehensive reports
- Market analysis and competitive intelligence
- Due diligence and investigative research
- Long-form content with extensive citations

### Example

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "sonar-deep-research",
    "messages": [
      {
        "role": "user",
        "content": "Conduct comprehensive research on quantum computing applications in drug discovery"
      }
    ],
    "max_tokens": 8192
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="sonar-deep-research",
    messages=[
        {
            "role": "user",
            "content": "Conduct comprehensive research on quantum computing applications in drug discovery",
        }
    ],
    max_tokens=8192,
)

print(response.choices[0].message.content)
# Access detailed citations
print(f"Citations: {response.citations}")

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1"
});

const response = await client.chat.completions.create({
  model: "sonar-deep-research",
  messages: [
    { role: "user", content: "Conduct comprehensive research on quantum computing applications in drug discovery" }
  ],
  max_tokens: 8192
});

console.log(response.choices[0].message.content);
// Access detailed citations
console.log("Citations:", response.citations);

```
---

## Direct Search API (Non-LLM)

In addition to using Perplexity models through chat completions, you can also access Perplexity's search capabilities directly through the [`v1/search`](en/guides/tools-web-search.md) API endpoint without invoking an LLM. This is useful when you only need raw search results.

### Search Tool Name

Use `perplexity-search` as the search tool identifier.

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

### Parameters

- **`query`** (required): The search query string
- **`max_results`** (optional): Maximum number of results to return
- **`search_domain_filter`** (optional): Array of domains to filter results
- **`country`** (optional): Country code for localized results

For more information about the Search API, see the [Search API Documentation](en/news/2025-10-26-search-api-launched.md).



## Related Resources

- [Text Generation Guide](en/guides/text-generation.md)
- [Web Search Tools](en/guides/tools-web-search.md)
- [Reasoning Models Guide](en/guides/reasoning.md)
- [Streaming Responses](en/guides/streaming-responses.md)
- [News: Perplexity Models Added](en/news/2025-10-26-perplexity-sonar-models-added.md)