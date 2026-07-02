# Integrating AvalAI with n8n

n8n is a powerful open-source workflow automation tool that enables you to connect various applications and services. Integrating AvalAI with n8n brings the power of 410+ advanced AI models directly into your workflows, allowing you to automate tasks like text generation, summarization, translation, image creation, reasoning, embeddings, and much more.

The seamless integration means you only need to replace the base URL with `https://api.avalai.ir/v1` and use your AvalAI API key in n8n. No changes to your existing workflows, automations, or underlying code are required!

## Why Integrate AvalAI with n8n?

Integrating AvalAI with n8n allows you to automate a wide range of AI-driven tasks, including:

*   **Access to 410+ models:** Leverage the latest models from OpenAI, Anthropic, Google, XAI, DeepSeek, Alibaba, Moonshot.ai, Z.AI, MiniMax, Fireworks.ai, Mistral AI, Meta, and more, all through a single, unified API.
*   **Content Creation:** Generate articles, blog posts, marketing copy, and other text-based content automatically.
*   **Data Analysis:** Analyze text data for sentiment, keywords, and other insights.
*   **Chatbot Development:** Build and deploy AI-powered chatbots for customer service or other applications.
*   **Language Translation:** Translate text between multiple languages seamlessly.
*   **Image Generation:** Create images from text descriptions using various models.
*   **Code Generation:** Automate the creation of code snippets or even entire programs.
*   **Cost-Effectiveness:** Benefit from AvalAI's competitive pricing, which is 100% aligned with the original provider's base API rates.

## Quick Start: Simplest Method for Beginners (HTTP Request Node) ⭐

> **This is the recommended method for beginners!** It works reliably and doesn't require complex credential configuration.

If you're new to n8n or want the simplest way to connect to AvalAI, use the **HTTP Request** node. This method works 100% of the time and is very easy to set up.

### Step 1: Get Your AvalAI API Key

1. Go to [AvalAI Dashboard](https://chat.avalai.ir/platform/home) and create an account (you'll receive **25,000 Tomans in free credit**)
2. Navigate to "API Keys" section
3. Click "Generate new key" or "Create new secret key"
4. **Copy the key immediately** and save it somewhere safe

### Step 2: Add HTTP Request Node to Your Workflow

1. In your n8n workflow, click the **+** button to add a new node
2. Search for **"HTTP Request"** and select it
3. Configure the node with these settings:

### Step 3: Configure the HTTP Request Node

**Basic Settings:**
| Setting | Value |
|---------|-------|
| **Method** | `POST` |
| **URL** | `https://api.avalai.ir/v1/chat/completions` |

**Authentication:**
| Setting | Value |
|---------|-------|
| **Authentication** | `Generic Credential Type` |
| **Generic Auth Type** | `Header Auth` |
| **Credential Name** | Create new → Name it "AvalAI API" |
| **Name** | `Authorization` |
| **Value** | `Bearer YOUR_API_KEY_HERE` |

> ⚠️ **Important:** Replace `YOUR_API_KEY_HERE` with your actual AvalAI API key. Keep the word "Bearer" followed by a space before your key.

**Headers:**
| Header Name | Header Value |
|-------------|--------------|
| `Content-Type` | `application/json` |

**Body:**
- Set **Body Content Type** to `JSON`
- Add this JSON in the body:

```json
{
  "model": "gpt-5.4-mini",
  "messages": [
    {
      "role": "user",
      "content": "Hello! Tell me a joke."
    }
  ]
}
```

### Step 4: Test Your Connection

1. Click **"Execute Node"** or **"Test Step"**
2. You should see a response with the AI's answer
3. If successful, you're connected! 🎉

### Example: Using Dynamic Input

To use input from previous nodes, change the body to:

```json
{
  "model": "gpt-5.4-mini",
  "messages": [
    {
      "role": "system",
      "content": "You are a helpful assistant."
    },
    {
      "role": "user",
      "content": "{{ $json.userMessage }}"
    }
  ]
}
```

This takes the `userMessage` field from the previous node's output.

---

## Obtaining Your AvalAI API Key for n8n (Step-by-Step)

Follow these steps to obtain your AvalAI API key:

1.  **Create an AvalAI Account:**
    If you don’t already have one, visit the [AvalAI Dashboard](https://chat.avalai.ir/platform/home) and create an account and receive **25,000 Tomans in free credit** upon registration, allowing you to get a head start and test our services without immediate cost.

2.  **Access the API Keys Page:**
    Once logged in, navigate to the "API Keys" section in your dashboard.

3.  **Generate a New API Key:**
    On the API keys page, click the button or option to "Generate new key" or "Create new secret key."

4.  **Name Your Key (Optional):**
    You may be prompted to give your API key a descriptive name. This is helpful for organizing and managing your keys later.

5.  **Copy Your API Key:**
    After generating the key, it will be displayed to you. **Important:** Copy this key immediately and store it in a secure location. For security reasons, you won’t be able to see the full key again.

## Configure n8n for AvalAI

AvalAI provides compatibility with multiple AI providers through dedicated nodes in n8n. You can use OpenAI, Google Gemini (PaLM), and Anthropic integration nodes, each configured to work with AvalAI's unified API.

### Setting Up OpenAI Node Credentials

1.  In your n8n instance, go to the "Credentials" section.
2.  Add a new credential of the "OpenAI" type.
3.  Paste the AvalAI API key you copied earlier into the "API Key" field.
4.  Crucially, in the "Base URL" or "Custom URL" field (the exact name may vary by n8n version), enter: `https://api.avalai.ir/v1`
5.  Name your credentials (e.g., "AvalAI OpenAI Connection"), save them, and then return to your workflow to pick the newly created credential from the dropdown list.

### Setting Up Google Gemini (PaLM) Node Credentials

1.  In your n8n instance, go to the "Credentials" section.
2.  Click "Add new credential" and select the credential type named **"Google Gemini(PaLM) Api"** from the list.
3.  Paste your AvalAI API key into the "API Key" field.
4.  In the "Host" or "Base URL" field, enter: `https://api.avalai.ir`
5.  Name your credentials (e.g., "AvalAI Gemini Connection") and save them.

### Setting Up Anthropic Node Credentials

1.  In your n8n instance, go to the "Credentials" section.
2.  Add a new credential of the "Anthropic" type.
3.  Paste your AvalAI API key into the "API Key" field.
4.  In the "Host" or "Base URL" field, enter: `https://api.avalai.ir`
5.  Name your credentials (e.g., "AvalAI Anthropic Connection") and save them.

### Using AI Integration Nodes with AvalAI

Each AI provider node in n8n works seamlessly with AvalAI when configured with the appropriate credentials. Here's how to use each one effectively:

#### OpenAI Node - Universal Access to 410+ models

The OpenAI node provides the broadest model access when connected to AvalAI:

*   **Model Compatibility:** Works with **all 410+ models** available through AvalAI, including OpenAI, Anthropic, Google, Mistral, Meta, and many other providers
*   **Chat:** Use for conversational AI tasks with models like `gpt-5.5`, `gpt-5.4-mini`, `claude-opus-4-8`, `claude-sonnet-4-6`, `gemini-3.5-flash`, `grok-4.3`, `deepseek-v4-pro`, `qwen3.7-max`, `kimi-k2.7-code`, `glm-5.2`, `nemotron-3-ultra`, and `minimax-m3`
*   **Image:** Create images using `gpt-image-2`, `gpt-image-1.5`, `qwen-image-2.0-pro`, `qwen-image-2.0`, `gemini-3.1-flash-image`, `seedream-5-0-260128`, DALL·E 3, or Stability AI models
*   **Text:** While legacy "Completions" operations are available, the "Chat" resource is recommended for modern text tasks

#### Google Gemini (PaLM) Node - Gemini Model Family

The Gemini node is specialized for Google's AI models:

*   **Model Compatibility:** Works specifically with **Gemini model families** (`gemini-3.5-flash`, `gemini-3.1-pro-preview`, `gemini-3.1-flash-lite`, `gemini-2.5-pro`, `gemini-2.5-flash`, etc.)
*   **Optimized Performance:** Designed specifically for Gemini models with native parameter support
*   **Use Cases:** Ideal when you specifically need Gemini models for their unique capabilities

> ⚠️ **Important - Model Name Format:** When using the n8n native Gemini (PaLM) node, **all Gemini model names must be prefixed with `models/`** in the "Model" field. The n8n Gemini node does not automatically append this prefix, but the Gemini API endpoint requires it (e.g., `v1beta/models/gemini-2.5-flash:generateContent`).
>
> **This applies to all Gemini models**, including but not limited to:
> - `gemini-2.5-flash` → `models/gemini-2.5-flash`
> - `gemini-2.5-pro` → `models/gemini-2.5-pro`
> - `gemini-3.5-flash` → `models/gemini-3.5-flash`
> - `gemini-3.1-pro-preview` → `models/gemini-3.1-pro-preview`
> - `gemini-3.1-flash-lite-preview` → `models/gemini-3.1-flash-lite-preview`
>
> **If you receive a 404 error**, ensure you have the `models/` prefix before your model name.
>
> **Example:**
> - ❌ `gemini-2.5-flash` → Will result in 404 error
> - ✅ `models/gemini-2.5-flash` → Correct format

#### Anthropic Node - Anthropic Plus Extended Model Support

The Anthropic node offers broad compatibility beyond just Anthropic models:

*   **Model Compatibility:** Works with **all Anthropic models** plus **most other models** available through AvalAI
*   **Expanding Support:** Model compatibility continues to improve, working toward supporting all available models
*   **Claude Integration:** Perfect for `claude-opus-4-8`, `claude-opus-4-7`, `claude-sonnet-4-6`, `claude-haiku-4-5`, and other Anthropic models
*   **Additional Models:** Also supports many non-Anthropic models for flexibility

#### Prompting with the Chat Resource

Just like with the standard OpenAI API, the n8n integration for Chat allows you to define roles: Assistant, System, and User.

*   **Assistant:** Represents the AI's previous responses in a conversation.
*   **System:** Provides initial instructions or context to define the AI's basic behavior. A well-crafted system prompt can significantly improve your AI use case.
*   **User:** Contains the user's input or the specific task for the AI.

## Tips and Best Practices

*   **Secure Storage:** Treat your AvalAI API key like a password. Store it securely and do not share it publicly.
*   **Key Management:** For multiple projects or different use cases, create separate API keys within your AvalAI dashboard to maintain organization and control.
*   **Rate Limits:** Be aware of AvalAI's [rate limits](en/guides/rate-limits.md). Implement strategies like adding delays or using queues in your n8n workflows to manage your API requests effectively and avoid hitting limits.
*   **Cost Considerations:** While AvalAI aligns with base API pricing, usage still incurs costs. Review AvalAI's [pricing page](en/pricing.md) to understand the costs involved.
*   **n8n Documentation:** Consult the official n8n documentation for specific instructions and troubleshooting tips related to OpenAI integration, as the core functionality remains the same.

## Troubleshooting

*   **Invalid API Key:** If you encounter an "invalid API key" error, double-check that you copied your AvalAI key correctly and that it's entered into the API Key field in n8n.
*   **Connection Issues:** Ensure your n8n instance has internet access and that there are no firewall or network restrictions blocking the connection to:
    - `https://api.avalai.ir/v1` (for OpenAI node)
    - `https://api.avalai.ir` (for Gemini and Anthropic nodes)
*   **Wrong Base URL:** Make sure you're using the correct base URL for each node type:
    - OpenAI node requires the `/v1` path: `https://api.avalai.ir/v1`
    - Gemini and Anthropic nodes use: `https://api.avalai.ir`
*   **Model Compatibility:** If a specific model isn't working with a particular node, try using the OpenAI node which supports all 410+ models available through AvalAI. For native Gemini nodes, remember to prefix model names with `models/`.
*   **Rate Limit Errors:** If you receive rate limit errors, review your workflow's request frequency. Implement delays or batching to reduce the load.

## Conclusion

Obtaining your AvalAI API key and configuring it in n8n is a straightforward process that unlocks the power of 410+ AI models within your automation workflows. By following these simple steps, you can seamlessly integrate AvalAI’s latest AI capabilities into your automations and create intelligent workflows for text, reasoning, coding, images, embeddings, and search. Start exploring the possibilities today!
## Related Resources

- [AvalAI API Reference: Introduction](en/api-reference/introduction.md)
- [AvalAI Models Overview](en/models/model-details.md)
- [n8n Official Documentation](https://docs.n8n.io/)
