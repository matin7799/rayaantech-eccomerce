# New Models Added to AvalAI Platform

**Date:** 2025-04-25

## Summary

We are excited to announce the addition of several new models to the AvalAI platform, expanding your options for various tasks including advanced reasoning, efficient processing, and specialized capabilities. This update includes models from OpenAI, and Google.

---

## Details

The following models are now available through the AvalAI API:

### OpenAI

* **o4-mini**: A more efficient version of OpenAI's latest o4 model, offering an excellent balance of performance and speed. [Documentation](en/models/o4-mini.md)
* **o3**: OpenAI's powerful general-purpose model with advanced reasoning capabilities. [Documentation](en/models/o3.md)
* **gpt-4.1-nano**: The smallest and most efficient model in the GPT-4.1 family, ideal for applications requiring quick responses and lower resource usage. [Documentation](en/models/gpt-4.1-nano.md)
* **gpt-4.1-mini**: A mid-sized GPT-4.1 model offering a good balance between performance and efficiency. [Documentation](en/models/gpt-4.1-mini.md)
* **gpt-4.1**: OpenAI's flagship GPT-4.1 model, featuring advanced reasoning, knowledge, and instruction-following capabilities. [Documentation](en/models/gpt-4.1.md)

### Google

* **gemini-2.5-flash-preview-04-17**: A preview version of Google's latest Gemini 2.5 Flash model, optimized for speed while maintaining strong performance. [Documentation](en/models/gemini-2.5-flash-preview-04-17.md)
* **gemini-2.5-pro-preview-03-25**: Google's powerful Gemini 2.5 Pro model in preview, offering advanced reasoning and knowledge capabilities. [Documentation](en/models/gemini-2.5-pro-preview-03-25.md)

You can start using these models immediately via our standard API endpoints. Please refer to the linked documentation for specific model identifiers and usage examples.

```language-selector
python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

completion = client.chat.completions.create(
    model="o4-mini",
    messages=[
        {
            "role": "user",
            "content": "Explain quantum computing in simple terms.",
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
  model: "o4-mini",

  messages: [
    {
      role: "user",
      content: "Explain quantum computing in simple terms.",
    },
  ],
});

console.log(completion.choices[0].message.content);

```

---

## Related Links

* [Model Index](en/models/model-details.md)
* [Chat Completions API](en/api-reference/chat.md)
* [Model Selection Guide](en/guides/model-selection.md)