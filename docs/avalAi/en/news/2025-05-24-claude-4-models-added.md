# Claude 4 Models Added to AvalAI

**Date:** 2025-05-24 / (1404-03-03)

## Summary

We are excited to announce the addition of Anthropic's latest Claude 4 models to AvalAI: Claude 4 Opus and Claude 4 Sonnet. These state-of-the-art models set new standards for coding, advanced reasoning, and AI agent capabilities, with Claude 4 Opus being recognized as the world's best coding model and Claude 4 Sonnet offering significant improvements over its predecessor.

---

## Details

AvalAI continues to expand its model offerings with the addition of Anthropic's latest Claude 4 models. These models represent a significant advancement in AI capabilities, particularly for coding, complex reasoning, and agent workflows.

### Anthropic

- **Claude 4 Opus**: The most powerful model in the Claude family and currently the world's best coding model, with exceptional performance on SWE-bench (72.5%) and Terminal-bench (43.2%). It excels at sustained performance on long-running tasks requiring focused effort and thousands of steps. [Documentation](en/models/claude-opus-4-20250514.md)

- **Claude 4 Sonnet**: A significant upgrade to Claude Sonnet 3.7, delivering superior coding capabilities (72.7% on SWE-bench) while responding more precisely to instructions. It offers an optimal balance between performance and efficiency. [Documentation](en/models/claude-sonnet-4-20250514.md)

### Key Features

- **Hybrid Response Modes**: Both models offer two modes - near-instant responses for quick interactions and extended thinking for deeper reasoning on complex problems.

- **Enhanced Tool Use**: Both models can use tools during extended thinking, alternating between reasoning and tool use to improve responses.

- **Parallel Tool Execution**: The ability to use multiple tools simultaneously for more efficient problem-solving.

- **Improved Instruction Following**: More precise adherence to user instructions, reducing the likelihood of shortcuts or loopholes.

- **Enhanced Memory Capabilities**: When given access to local files, these models demonstrate significantly improved memory capabilities, extracting and saving key facts to maintain continuity over time.

### Pricing

- **Claude 4 Opus**: $15/$75 per million tokens (input/output)
- **Claude 4 Sonnet**: $3/$15 per million tokens (input/output)

### Usage Example

```language-selector
python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

completion = client.chat.completions.create(
    model="anthropic.claude-sonnet-4-20250514-v1:0",
    messages=[
        {
            "role": "user",
            "content": "Create a recursive function in Python to calculate the Fibonacci sequence.",
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
  model: "anthropic.claude-sonnet-4-20250514-v1:0",

  messages: [
    {
      role: "user",

      content:
        "Create a recursive function in JavaScript to calculate the Fibonacci sequence.",
    },
  ],
});

console.log(completion.choices[0].message.content);

```

---

## Related Links

- [Anthropic Documentation](en/providers/anthropic.md)
- [Guide to Model Selection](en/guides/model-selection.md)
- [Optimizing LLM Accuracy](en/guides/optimizing-llm-accuracy.md)
