# Optimizing LLM Accuracy

Maximize correctness and consistent behavior when working with Large Language Models (LLMs).

## Introduction

Optimizing LLMs is challenging for several key reasons:

* Knowing **how to start** optimizing accuracy
* **When to use what** optimization method
* What level of accuracy is **good enough** for production

This guide provides a mental model for optimizing LLMs for accuracy and behavior, exploring methods like prompt engineering, retrieval-augmented generation (RAG), and fine-tuning.

## LLM Optimization Context

Rather than viewing optimization as a linear process, it's more useful to think of it as a matrix with two key dimensions:

* **Context optimization:** Addresses when the model lacks knowledge, has outdated information, or needs proprietary data. This maximizes **response accuracy**.
* **LLM optimization:** Addresses inconsistent results, formatting issues, incorrect tone/style, or inconsistent reasoning. This maximizes **consistency of behavior**.

In practice, optimization becomes an iterative process of evaluation, hypothesis, application, and reassessment.

## Prompt Engineering

Prompt engineering is typically the best starting point. For use cases like summarization, translation, and code generation, it may be the only method needed to reach production-level accuracy.

Starting with prompt engineering forces you to define what accuracy means for your specific use case. By providing an input and evaluating whether the output meets your expectations, you'll gain insights into what further optimizations may be needed.

### Optimization Strategies

- **Write clear instructions**: Be specific about the desired output format, tone, and constraints.
- **Split complex tasks into simpler subtasks**: Break down complex reasoning into step-by-step processes.
- **Give LLMs time to "think"**: Encourage the model to work through problems methodically.
- **Test changes systematically**: Make controlled changes and measure their impact.
- **Provide reference text**: Include relevant information in the prompt when needed.
- **Use external tools**: Leverage tools for calculations, data retrieval, or verification.

### Example: Language Correction Task

Adding few-shot examples to a basic prompt for Icelandic sentence correction improved BLEU scores from 62 to 70, demonstrating the value of showing the model examples of the desired behavior.

## Evaluation

A good evaluation set with questions and ground truth answers is essential before moving to more advanced optimization methods. When you have 20+ examples and understand why failures occur, you have a solid baseline for further optimization.

Consider automating evaluation with:
- Metrics like ROUGE or BERTScore for quick comparisons
- Using GPT-4 as an evaluator with a scoring rubric

## Understanding the Tools

When prompt engineering isn't enough, diagnose whether you're facing an **in-context** or **learned** memory problem:

- **In-context memory problems**: The model lacks necessary information to answer correctly. Solve with RAG by adding relevant context.
- **Learned memory problems**: The model needs to learn consistent behavior patterns. Solve with fine-tuning by showing many examples.

These approaches are additive, not exclusive - they can be combined for optimal performance.

## Retrieval-Augmented Generation (RAG)

RAG retrieves relevant content to augment your LLM's prompt before generating an answer, giving the model access to domain-specific context.

RAG applications can break down in two areas:
1. **Retrieval issues**: Supplying wrong or irrelevant context
2. **LLM issues**: The model misuses the correct context

Optimizing RAG requires tuning both the retrieval system and the LLM's instructions.

## Fine-Tuning

Fine-tuning continues training an LLM on a smaller, domain-specific dataset to:
- Improve model accuracy on specific tasks
- Improve efficiency (same accuracy with fewer tokens or smaller models)

Best practices for fine-tuning include:
- Start with prompt engineering to establish a baseline
- Focus on quality over quantity (start with 50+ high-quality examples)
- Ensure training examples are representative of real-world inputs

## Combined Approaches

These techniques stack on top of each other. Benefits of combining approaches include:
- Using fine-tuning to minimize tokens used for instructions
- Teaching complex behavior through extensive fine-tuning
- Using RAG to inject context or more recent information

In our Icelandic correction example:
- Fine-tuning GPT-3.5 improved BLEU scores from 70 to 78
- Fine-tuning GPT-4 further improved scores to 87
- Adding RAG actually decreased performance to 83, showing that more isn't always better

## How Much Accuracy is "Good Enough"?

When deciding if your LLM solution is ready for production, consider both business and technical factors:

### Business Considerations
- Identify primary success and failure cases with associated costs
- Calculate break-even accuracy based on these costs
- Measure empirical stats (e.g., CSAT scores, decision accuracy, time to resolution)

### Technical Approaches
- Design the system to handle failures gracefully
- Consider trade-offs between accuracy, user experience, and operational costs

## Related Resources

- [Prompt Engineering](en/guides/prompt-engineering)
- [Model Selection](en/guides/model-selection)
- [Fine-tuning](en/guides/fine-tuning)
- [Evals](en/guides/evals)
