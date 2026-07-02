# Adding o1-pro and o3 Models to AvalAI Tier Levels

**Date:** 2025-05-14 (1404-02-25)

## Summary

We are pleased to announce the availability of OpenAI's powerful reasoning models, o1-pro and o3, across multiple tier levels on the AvalAI platform. The o1-pro model is now accessible to users on tier levels 4 and 5, while the o3 model is available on tier levels 3, 4, and 5. These additions expand our offering of advanced reasoning models, providing more options for complex tasks requiring deep analysis across text and images.

---

## Details

### OpenAI o3 Model

The o3 model is OpenAI's most powerful reasoning model, setting a new standard for math, science, coding, and visual reasoning tasks. It excels at technical writing and instruction-following, making it ideal for complex problem-solving scenarios.

**Key Features:**

- Exceptional reasoning capabilities across domains
- 200,000 token context window
- 100,000 max output tokens
- May 31, 2024 knowledge cutoff
- Support for text and image inputs
- Output in text format

**Tier Availability:**

- Tier 3
- Tier 4
- Tier 5

### OpenAI o1-pro Model

The o1-pro model is a version of o1 with more compute power for better responses. It's trained with reinforcement learning to think before answering and perform complex reasoning, using additional compute resources to think harder and provide consistently better answers.

**Key Features:**

- Higher reasoning capabilities
- 200,000 token context window
- 100,000 max output tokens
- Sep 30, 2023 knowledge cutoff
- Support for text and image inputs
- Output in text format

**Tier Availability:**

- Tier 4
- Tier 5

### Sample Usage

You can access these models through our standard API endpoints. Here are examples of how to use them:

```language-selector
python=:from openai import OpenAI

client = OpenAI(api_key="YOUR_AVALAI_API_KEY", base_url="https://api.avalai.ir/v1")

# Using the o3 model
completion = client.chat.completions.create(
    model="o3",
    messages=[
        {
            "role": "user",
            "content": "Explain quantum computing principles and their potential impact on cryptography.",
        }
    ],
)

print(completion.choices[0].message.content)

# Using the o1-pro model
completion = client.chat.completions.create(
    model="o1-pro",
    messages=[
        {
            "role": "user",
            "content": "Analyze the implications of quantum computing on modern encryption standards.",
        }
    ],
)

print(completion.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

// Using the o3 model
async function useO3Model() {
  const completion = await client.chat.completions.create({
    model: "o3",
    messages: [
      {
        role: "user",
        content:
          "Explain quantum computing principles and their potential impact on cryptography.",
      },
    ],
  });

  console.log(completion.choices[0].message.content);
}

// Using the o1-pro model
async function useO1ProModel() {
  const completion = await client.chat.completions.create({
    model: "o1-pro",
    messages: [
      {
        role: "user",
        content:
          "Analyze the implications of quantum computing on modern encryption standards.",
      },
    ],
  });

  console.log(completion.choices[0].message.content);
}

useO3Model();
useO1ProModel();

```

## Related Links

- [Model List](/models/model-details.md)
- [Chat Completions API Reference](/api-reference/chat.md)
- [Rate Limits Guide](/guides/rate-limits.md)
- [Model Selection Guide](/guides/model-selection.md)
- [Reasoning Guide](/guides/reasoning.md)