# Building Agents with AvalAI

Learn how to build intelligent agents using the capabilities accessible through the AvalAI API. Agents are systems designed to accomplish tasks, ranging from simple workflows to complex, open-ended objectives, by leveraging AI models and tools.

AvalAI provides access to primitives from various providers, enabling you to construct robust agents.

## Overview

Building agents involves combining several components:

| Domain | Description | AvalAI Primitives/Access |
|---|---|---|
| **Models** | Core intelligence for reasoning, decisions, and processing different modalities (text, images, etc.). | Access to leading models from OpenAI, Anthropic, Google, etc. (e.g., `gpt-5.4`, `claude-opus-4-7`, `gemini-3.1-pro-preview`). See [Models](en/models/model-details.md). |
| **Tools** | Interfaces for interacting with the environment, external APIs, or accessing specific functionalities. | [Function Calling](en/guides/function-calling.md), potentially other tools depending on underlying model capabilities accessed via AvalAI. |
| **Knowledge & Memory** | Augmenting agents with external data or persistent memory. | [Embeddings](en/api-reference/embeddings.md) for vector representations, potentially file/vector store access depending on underlying model/tools. |
| **Audio & Speech** | Enabling voice interaction (understanding and responding). | [Audio API](en/api-reference/audio.md) for Speech-to-Text and Text-to-Speech. |
| **Guardrails** | Ensuring safe, relevant, and desirable agent behavior. | [Moderation API](en/api-reference/moderation.md), careful prompt engineering, potentially provider-specific safety features. |
| **Orchestration** | Frameworks and tools for development, deployment, monitoring, and improvement. | Utilize AvalAI API with standard development practices, logging, and evaluation frameworks. |

## Models

The core of an agent is its reasoning engine. AvalAI grants access to a diverse set of models suitable for agentic tasks:

*   **High Intelligence/Reasoning:** Models like GPT-5, Claude 4.1 Opus, Gemini 2.5 Pro excel at complex tasks, planning, and reasoning.
*   **Balanced Performance:** Models like GPT-5 offer a good mix of capability, speed, and cost.
*   **Low Latency:** Models like GPT-5-mini or Claude 4 Sonnet are optimized for faster responses.
*   **Multimodality:** Many models available through AvalAI (like GPT-5 Chat, Gemini 2.5 Pro) can process text and image inputs.

Choose the model based on the complexity of the task, required speed, cost constraints, and modality needs. Refer to the [Models Overview](en/models/model-details.md) for details.

## Tools

Tools allow agents to interact beyond simple text generation. Key capabilities accessible via AvalAI include:

*   **Function Calling:** Define custom functions your application can execute, allowing the agent to interact with external APIs or databases. See the [Function Calling Guide](en/guides/function-calling.md).
*   **Provider-Specific Tools:** Some underlying models might offer built-in tools (like web browsing or code execution) accessible through AvalAI's API if supported. Check the specific model documentation.

## Knowledge and Memory

Agents often need access to information beyond their training data:

*   **Embeddings:** Use the [Embeddings API](en/api-reference/embeddings.md) to create vector representations of your data for semantic search and retrieval (Retrieval-Augmented Generation - RAG). Build your own vector database solution using these embeddings.
*   **File/Vector Store Integration:** Some underlying models/APIs (like OpenAI's Assistants API, potentially accessible via AvalAI in the future or through specific endpoints) might offer integrated file search or vector store capabilities.

## Audio and Speech

Create voice-enabled agents:

*   **Speech-to-Text:** Transcribe user speech using the [Audio API](en/api-reference/audio.md#speech-to-text-transcription).
*   **Text-to-Speech:** Generate spoken responses using the [Audio API](en/api-reference/audio.md#text-to-speech-tts).

## Guardrails

Implementing safety and behavioral controls is crucial:

*   **Moderation:** Use the [Moderation API](en/api-reference/moderation.md) to filter harmful content in inputs or outputs.
*   **Prompt Engineering:** Carefully craft system prompts and instructions to define the agent's persona, constraints, and desired behavior. Use `developer` role messages for high-priority instructions.
*   **Output Validation:** Validate agent outputs (especially function call arguments or structured data) before execution or use.

## Orchestration

Developing and managing agents involves:

*   **Development:** Use the AvalAI API within your preferred programming language and frameworks. Structure your agent logic (state management, tool execution, response generation).
*   **Monitoring:** Implement logging to track agent performance, decisions, tool usage, and errors.
*   **Evaluation:** Create test suites to evaluate agent performance on key tasks and identify areas for improvement in prompts or logic.
*   **Improvement:** Refine prompts, adjust model parameters, or potentially use [Fine-tuning](en/api-reference/fine-tuning.md) on compatible base models accessed via AvalAI.

## Getting Started

Building an agent typically involves:
1.  Defining the agent's goal and capabilities.
2.  Choosing an appropriate model via AvalAI.
3.  Writing a clear system prompt/instructions.
4.  Defining any necessary tools (functions).
5.  Implementing the logic to handle user input, call the AvalAI API, process responses, execute tools, and manage conversation history.
6.  Adding guardrails and error handling.
7.  Testing and iterating.