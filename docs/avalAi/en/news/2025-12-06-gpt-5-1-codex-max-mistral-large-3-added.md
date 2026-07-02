# New Models Added: GPT-5.1-Codex-Max and Mistral Large 3

**Date:** 2025-12-06 / (1404-09-15)

## Summary

We announce the addition of two powerful new models: GPT-5.1-Codex-Max from OpenAI, the most intelligent coding model optimized for long-horizon agentic coding tasks, and Mistral Large 3 from Mistral AI, a state-of-the-art open model with 675B total parameters and multimodal capabilities. Both models are now available through the AvalAI API.

---

## Details

### OpenAI

#### GPT-5.1-Codex-Max

We introduce **GPT-5.1-Codex-Max** (`gpt-5.1-codex-max`), OpenAI's most intelligent coding model purpose-built for agentic coding. This model is optimized for long-horizon, multi-step programming tasks and autonomous agent workflows. [Documentation](en/providers/openai.md)

**Key Features:**
- **Context Window**: 400,000 tokens for handling extensive codebases and documents
- **Max Output Tokens**: 128,000 tokens for comprehensive code generation
- **Advanced Capabilities**: Function calling, structured outputs, reasoning token support, vision (image input)
- **Agentic Focus**: Optimized for long-horizon coding tasks and autonomous programming workflows
- **Knowledge Cutoff**: September 30, 2024
- **Endpoint Support**: Available on [`v1/chat/completions`](en/api-reference/chat.md) and [`v1/responses`](en/api-reference/responses.md)
- **Streaming**: Fully supported

**Modalities:**
- **Input**: Text, Image
- **Output**: Text

**Pricing Details:**

| Model | Input | Cached Input | Output |
|-------|-------|--------------|--------|
| gpt-5.1-codex-max | $1.25/1M tokens | $0.125/1M tokens | $10.00/1M tokens |

**Example Usage:**

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "gpt-5.1-codex-max",
    "messages": [
      {
        "role": "user",
        "content": "Create a complete TypeScript implementation of a distributed task queue system with worker management, task prioritization, and failure recovery."
      }
    ]
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

completion = client.chat.completions.create(
    model="gpt-5.1-codex-max",
    messages=[
        {
            "role": "user",
            "content": "Create a complete TypeScript implementation of a distributed task queue system with worker management, task prioritization, and failure recovery.",
        }
    ],
)

print(completion.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const completion = await client.chat.completions.create({
  model: "gpt-5.1-codex-max",
  messages: [
    {
      role: "user",
      content: "Create a complete TypeScript implementation of a distributed task queue system with worker management, task prioritization, and failure recovery.",
    },
  ],
});

console.log(completion.choices[0].message.content);

```

### Mistral AI

#### Mistral Large 3

We introduce **Mistral Large 3** (`mistral-large-3`), Mistral AI's most capable model to date. This state-of-the-art open model is a sparse mixture-of-experts architecture with 41B active and 675B total parameters, released under the Apache 2.0 license. [Documentation](en/providers/mistralai.md)

**Key Features:**
- **Architecture**: Sparse Mixture-of-Experts (41B active / 675B total parameters)
- **Open Source**: Released under Apache 2.0 license
- **Multimodal**: Native image understanding capabilities
- **Multilingual**: Best-in-class performance on non-English/Chinese conversations with 40+ native languages
- **Context Window**: Large context window for extensive document processing
- **LMArena Ranking**: #2 in OSS non-reasoning models category (#6 overall among OSS models)
- **Endpoint Support**: Available on [`v1/chat/completions`](en/api-reference/chat.md)

**What Makes Mistral Large 3 Special:**
- First mixture-of-experts model from Mistral since the seminal Mixtral series
- Achieves parity with best instruction-tuned open-weight models on general prompts
- Optimized checkpoint available in NVFP4 format for efficient deployment
- Can run on single 8×A100 or 8×H100 node using vLLM

**Pricing Details:**

| Model | Input | Cached Input | Output | Per Page |
|-------|-------|--------------|--------|----------|
| mistral-large-3 | $0.50/1M tokens | $0.05/1M tokens | $1.50/1M tokens | $0.001/page |

**Example Usage:**

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "mistral-large-3",
    "messages": [
      {
        "role": "user",
        "content": "Analyze the implications of quantum computing on modern cryptography and suggest mitigation strategies."
      }
    ]
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

completion = client.chat.completions.create(
    model="mistral-large-3",
    messages=[
        {
            "role": "user",
            "content": "Analyze the implications of quantum computing on modern cryptography and suggest mitigation strategies.",
        }
    ],
)

print(completion.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const completion = await client.chat.completions.create({
  model: "mistral-large-3",
  messages: [
    {
      role: "user",
      content: "Analyze the implications of quantum computing on modern cryptography and suggest mitigation strategies.",
    },
  ],
});

console.log(completion.choices[0].message.content);

```

**Using Mistral SDK:**

```language-selector
python=:from mistralai import Mistral

client = Mistral(server_url="https://api.avalai.ir", api_key="avalai-api-key")

response = client.chat.complete(
    model="mistral-large-3",
    messages=[
        {
            "role": "user",
            "content": "Explain the benefits of mixture-of-experts architecture in large language models.",
        }
    ],
)

print(response.choices[0].message.content)

javascript=:import { Mistral } from "mistralai";

const client = new Mistral({
  apiKey: "[REDACTED]",
  baseURL: "https://api.avalai.ir",
});

const response = await client.chat.complete({
  model: "mistral-large-3",
  messages: [
    {
      role: "user",
      content: "Explain the benefits of mixture-of-experts architecture in large language models.",
    },
  ],
});

console.log(response.choices[0].message.content);

```

---

## Related Links

- [OpenAI Models Documentation](en/providers/openai.md)
- [Mistral AI Models Documentation](en/providers/mistralai.md)
- [Chat Completions API Reference](en/api-reference/chat.md)
- [Responses API Reference](en/api-reference/responses.md)
- [Function Calling Guide](en/guides/function-calling.md)
- [Pricing Information](en/pricing.md)