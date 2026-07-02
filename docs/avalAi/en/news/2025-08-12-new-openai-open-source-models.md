# New Models Added: OpenAI's First Open-Source Models and API Performance Upgrades

**Date:** 2025-08-12

## Summary

We are excited to announce the addition of OpenAI's first-ever open-source models, gpt-oss-120b and gpt-oss-20b, now available through Azure AI and AWS Bedrock. This update also includes significant performance enhancements to the AvalAI API, delivering lower latency and improved reliability for a production-grade experience.

---

## Details

### Core API Updates

We have rolled out significant updates to our core infrastructure, resulting in a faster and more reliable AvalAI API. Users will benefit from:

- **Lower Latency:** Reduced response times for faster interactions.
- **Improved Performance:** Enhanced stability and throughput for production workloads.
- **Greater Reliability:** A more robust and dependable service.

These improvements are part of our ongoing commitment to providing a best-in-class API experience.

### New Open-Source Models from OpenAI

For the first time, OpenAI has released open-source models, and we are making them available to you through our provider partners.

#### Azure AI

- **gpt-oss-120b**: OpenAI's most powerful open-weight model, designed for high-end reasoning tasks and fitting within a single H100 GPU. [Documentation](en/models/gpt-oss-120b.md)

#### AWS Bedrock

- **openai.gpt-oss-120b-1:0**: The same powerful 120B parameter model, available through AWS Bedrock, offering a competitive pricing structure. [Documentation](en/models/gpt-oss-120b-1-0.md)
- **openai.gpt-oss-20b-1:0**: A medium-sized 20B parameter model, perfect for use cases requiring low latency and high efficiency. [Documentation](en/models/gpt-oss-20b-1-0.md)

### Key Features of the New Models

Both `gpt-oss-120b` and `gpt-oss-20b` come with a range of powerful features:

- **Permissive Apache 2.0 License:** Freedom to build, customize, and deploy commercially without restrictive licensing.
- **Configurable Reasoning Effort:** Adjust the model's reasoning effort (low, medium, high) to match your needs.
- **Full Chain-of-Thought:** Complete transparency into the model's reasoning process for better debugging and trust.
- **Fine-Tunable:** Adapt the models to your specific tasks with parameter-efficient fine-tuning.
- **Agentic Capabilities:** Native support for function calling, web browsing, code execution, and structured outputs.

### Usage Example

```language-selector
python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

completion = client.chat.completions.create(
    model="gpt-oss-120b",  # or "openai.gpt-oss-120b-1:0"
    messages=[
        {
            "role": "user",
            "content": "Explain the significance of the Apache 2.0 license for open-source models.",
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
 model: "gpt-oss-120b", // or "openai.gpt-oss-120b-1:0"
 messages: [
 {
 role: "user",
 content: "Explain the significance of the Apache 2.0 license for open-source models.",
 },
 ],
});

console.log(completion.choices[0].message.content);

```

### Pricing and Availability

Pricing for these models is determined by the provider. The `gpt-oss-120b` model on Azure AI is priced differently than the `openai.gpt-oss-120b-1:0` version on AWS Bedrock, with the latter offering a more cost-effective option. Please refer to the individual model documentation for detailed pricing information.

---

## Related Links

- [gpt-oss-120b Documentation](en/models/gpt-oss-120b.md)
- [gpt-oss-120b (Bedrock) Documentation](en/models/gpt-oss-120b-1-0.md)
- [gpt-oss-20b (Bedrock) Documentation](en/models/gpt-oss-20b-1-0.md)
- [Model Pricing](en/models/model-details.md)