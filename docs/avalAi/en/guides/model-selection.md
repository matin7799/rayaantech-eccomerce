# Model Selection

Choose the best model for performance and cost across AvalAI's diverse provider offerings.

## Core Principles

The principles for model selection are simple:

* **Optimize for accuracy first:** Start with the most capable models until you hit your accuracy target.
* **Optimize for cost and latency second:** Then aim to maintain accuracy with the cheapest, fastest model possible.

## 1. Focus on Accuracy First

Begin by setting a clear accuracy goal for your use case:

* **Set a clear accuracy target:** Identify what level of performance is "good enough" for production.
  * For example, 90% of customer service calls need to be triaged correctly at the first interaction.
* **Develop an evaluation dataset:** Create a dataset that allows you to measure the model's performance against these goals.
  * To extend the example above, capture 100 interaction examples with user requests, model responses, correct answers, and accuracy metrics.
* **Start with the most powerful model:** Begin with AvalAI's latest top-tier models to achieve your accuracy targets:
  * **OpenAI**: `gpt-5.5`, `gpt-5.4-pro`, `gpt-5.4`, `gpt-5.3-codex`
  * **Anthropic**: `claude-opus-4-8`, `claude-opus-4-7`, `claude-sonnet-4-6`, `claude-haiku-4-5`
  * **Google**: `gemini-3.5-flash`, `gemini-3.1-pro-preview`, `gemini-3.1-flash-lite`, `gemma-4-26b-a4b-it`
  * **XAI**: `grok-4.20-reasoning`, `grok-4.20-non-reasoning`
  * **DeepSeek**: `deepseek-v4-pro`, `deepseek-v4-flash`
  * **Alibaba**: `qwen3.7-max`, `qwen3.7-plus`, `qwen3.6-plus`, `qwen3.6-flash`
  * **Moonshot.ai**: `kimi-k2.7-code`, `kimi-k2.7-code-highspeed`, `kimi-k2.6`
  * **Z.AI**: `glm-5.2`, `glm-5.1`, `glm-5v-turbo`
  * **MiniMax**: `minimax-m3`, `minimax-m2.7`, `minimax-m2.7-highspeed`
  * **Fireworks.ai**: `nemotron-3-ultra`

### Setting a Realistic Accuracy Target

Calculate a realistic accuracy target by evaluating the financial impact of model decisions. For example, in a fake news classification scenario:

* **Correctly classified news:** If the model classifies it correctly, it saves you the cost of a human review - let's assume **$50**.
* **Incorrectly classified news:** If it falsely classifies a safe article or misses a fake news article, it may trigger a review process and possible complaint, which might cost **$300**.

In this example, you would need **85.8%** accuracy to break even, so targeting 90% or more ensures a positive ROI. Use similar calculations to set an effective accuracy target based on your specific cost structures.

## 2. Optimize Cost and Latency

Once you've achieved your accuracy target, optimize for cost and latency using one of these approaches:

* **Compare with a smaller or faster model:** Test if a cheaper model maintains acceptable accuracy:
  * **OpenAI**: `gpt-5.4-mini`, `gpt-5.4-nano`, or `o4-mini` instead of `gpt-5.5` or `gpt-5.4-pro`
  * **Anthropic**: `claude-haiku-4-5` instead of `claude-opus-4-7`
  * **Google**: `gemini-3.1-flash-lite`, `gemini-3.1-flash-lite-preview`, or `gemini-2.5-flash` instead of `gemini-3.5-flash`
  * **DeepSeek**: `deepseek-v4-flash` instead of `deepseek-v4-pro`
  * **Alibaba**: `qwen3.6-flash` or `qwen3.6-35b-a3b` instead of `qwen3.7-max` or `qwen3.7-plus`
  * **MiniMax**: `minimax-m3` for long-context multimodal work, `minimax-m2.7-highspeed` when throughput matters, or `minimax-m2.5` for lower-cost coding workflows
  * **XAI**: `grok-4.20-non-reasoning` instead of `grok-4.20-reasoning` for tasks that don't need extended reasoning

* **Model distillation:** Fine-tune a smaller model using the data gathered during accuracy optimization.

The main strategies to consider:

* **Reduce requests:** Limit the number of necessary API calls.
* **Minimize tokens:** Lower input token count and optimize for shorter outputs.
* **Select a smaller model:** Use models that balance reduced costs and latency with maintained accuracy.

### Exceptions to the Rule

If your use case is extremely cost or latency sensitive, establish thresholds for these metrics before beginning your testing. Remove models that exceed those thresholds from consideration, then optimize for accuracy within your constraints.

## Practical Example

To demonstrate these principles, we'll develop a fake news classifier with the following targets:

* **Accuracy:** Achieve 90% correct classification
* **Cost:** Spend less than $5 per 1,000 articles
* **Latency:** Maintain processing time under 2 seconds per article

### Experiments

We ran three experiments to reach our goal:

1. **Zero-shot:** Used `gpt-5.5` with a basic prompt for 1,000 records to establish the highest-accuracy baseline.
2. **Few-shot learning:** Tested `gpt-5.4-mini` with 5 few-shot examples, meeting the accuracy target at a lower cost than the flagship baseline.
3. **Model routing:** Routed straightforward cases to `gemini-3.1-flash-lite-preview` and difficult cases to `gpt-5.5`, meeting all targets with lower average cost.

| ID | Method | Accuracy | Accuracy target | Cost | Cost target | Avg. latency | Latency target |
|----|--------|----------|----------------|------|------------|--------------|----------------|
| 1 | gpt-5.5 zero-shot | 93.0% | ✓ | $6.80 | ❌ | ~2s | ✓ |
| 2 | gpt-5.4-mini few-shot (n=5) | 91.2% | ✓ | $2.40 | ✓ | < 2s | ✓ |
| 3 | gemini-3.1-flash-lite-preview + gpt-5.5 routing | 92.1% | ✓ | $1.10 | ✓ | < 2s | ✓ |

## AvalAI-Specific Model Selection Guide

AvalAI provides access to models from multiple providers through a unified API. This allows you to experiment with different models while maintaining the same code structure.

### Provider-Specific Recommendations

| Use Case | Top Performance | Balanced Performance/Cost | Budget-Friendly |
|----------|----------------|--------------------------|----------------|
| General chat | gpt-5.5, claude-opus-4-8 | claude-sonnet-4-6, gemini-3.5-flash | gpt-5.4-mini, gemini-3.1-flash-lite |
| Complex reasoning | gpt-5.5, gpt-5.4-pro, claude-opus-4-8 | deepseek-v4-pro, glm-5.2, qwen3.7-max | deepseek-v4-flash, qwen3.6-flash, gemini-3.1-flash-lite |
| Code generation | gpt-5.5, claude-opus-4-8, glm-5.2 | kimi-k2.7-code, minimax-m3, qwen3.7-plus | gpt-5.4-mini, deepseek-v4-flash, qwen3.6-flash |
| Vision capabilities | gpt-5.5, claude-opus-4-8, gemini-3.5-flash | gemini-3.1-pro-preview, qwen3.7-max, minimax-m3 | gemini-2.5-flash, glm-5v-turbo |
| Function calling | gpt-5.5, claude-opus-4-8, grok-4.3 | gemini-3.5-flash, deepseek-v4-pro, qwen3.7-max | gpt-5.4-mini, deepseek-v4-flash, gemini-3.1-flash-lite |
| Embeddings | gemini-embedding-2, text-embedding-3-large | embed-v4.0, text-embedding-3-small | qwen3-embedding, embed-english-v3.0 |
| Image generation | gpt-image-2, qwen-image-2.0-pro | gpt-image-1.5, gemini-3.1-flash-image | qwen-image-2.0, seedream-5-0-260128 |

### Implementation Example

```python
from avalai import AvalAI

client = AvalAI(api_key="your_avalai_api_key")

# Start with a high-performance model
completion = client.chat.completions.create(
    model="gpt-5.5",  # Top-tier model for accuracy
    messages=[
        {"role": "user", "content": "Classify this news article as real or fake: ..."}
    ],
)

# After achieving accuracy targets, switch to a more cost-effective model
completion = client.chat.completions.create(
    model="gemini-3.1-flash-lite-preview",  # More cost-effective model
    messages=[
        {"role": "user", "content": "Classify this news article as real or fake: ..."}
    ],
)
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version</summary>

Use this version when the selected model supports `/v1/responses`. `messages` moves to `input`, and the final text is read from `response.output_text`.

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["AVALAI_API_KEY"],
    base_url="https://api.avalai.ir/v1",
)

response = client.responses.create(
    model="gpt-5.5",
    instructions="You are a helpful assistant.",
    input="Classify this news article as real or fake: ...",
)

print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


## Conclusion

By following these principles - optimizing for accuracy first, then cost and latency - you can make informed model selection decisions. AvalAI's unified API makes it easy to experiment with different models from various providers to find the optimal balance for your specific use case.

## Related Resources

- [Models Overview](en/models/model-details.md)
- [Fine-tuning Guide](en/guides/fine-tuning.md)
- [Latency Optimization](en/guides/latency-optimization.md)
- [Pricing Information](en/pricing.md)
