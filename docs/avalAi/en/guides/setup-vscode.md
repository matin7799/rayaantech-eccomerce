# Integrating AvalAI with VSCode Extensions

VSCode AI coding assistants like RooCode (Cline), Continue, and similar extensions provide powerful AI-powered development capabilities directly in your editor. By integrating AvalAI with these extensions, you gain access to over 410 advanced AI models from OpenAI, Anthropic, Google, Meta, and more—all through a single API.

Most modern VSCode AI extensions support OpenAI-compatible APIs with custom base URLs, making integration with AvalAI seamless and straightforward. This works equally well with other code editors like Cursor that support OpenAI-compatible configurations.

?> **💰 Special Offer:** Take advantage of AvalAI's [exclusive credit packages](en/credit-packages.md) and receive **up to 70% more credit** or enjoy **up to 40% discount** on your purchases. These exclusive offers help you maximize your AI development budget!

## Why Integrate AvalAI with VSCode Extensions?

Integrating AvalAI with your coding assistant brings powerful capabilities to your development workflow:

*   **Access to 410+ models:** Choose from models like GPT-5.5, Claude Opus 4.8, Gemini 3.5 Flash, GLM-5.2, MiniMax M3, Kimi K2.7 Code, DeepSeek-V4, and many more
*   **Code Generation:** Generate code snippets, entire functions, or complete files across multiple programming languages
*   **Code Explanation:** Get clear explanations of complex code segments
*   **Refactoring Assistance:** Improve code quality with AI-powered refactoring suggestions
*   **Bug Detection:** Identify and fix issues in your codebase
*   **Documentation:** Generate comprehensive documentation for your code
*   **Multi-Language Support:** Work with virtually any programming language or framework
*   **Cost-Effectiveness:** Benefit from AvalAI's competitive pricing, aligned with original provider rates
*   **Flexibility:** Switch between different AI models based on your specific needs

## Obtaining Your AvalAI API Key (Step-by-Step)

Follow these steps to obtain your AvalAI API key:

1.  **Create an AvalAI Account:**
    If you don't already have one, visit the [AvalAI Dashboard](https://chat.avalai.ir/platform/home) and create an account.

2.  **Access the API Keys Page:**
    Once logged in, navigate to the "API Keys" section in your dashboard.

3.  **Generate a New API Key:**
    Click the button to "Generate new key" or "Create new secret key."

4.  **Name Your Key (Optional):**
    Give your API key a descriptive name like "VSCode Development" to help organize and manage your keys.

5.  **Copy Your API Key:**
    After generating the key, it will be displayed once. **Important:** Copy this key immediately and store it securely. You won't be able to see the full key again for security reasons.

## Configure VSCode Extensions for AvalAI

### Setting Up RooCode (Cline)

RooCode (formerly Cline) is a powerful AI coding assistant for VSCode. Here's how to configure it with AvalAI:

1.  **Install RooCode:**
    Open VSCode and install the RooCode extension from the Extensions marketplace.

2.  **Open RooCode Settings:**
    Click the settings icon in the RooCode panel, or navigate to the Providers configuration.

3.  **Configure API Provider:**
    - **API Provider:** Select **"OpenAI Compatible"** from the dropdown
    - **Base URL:** Enter `https://api.avalai.ir/v1`
    - **API Key:** Paste your AvalAI API key
    - **Model:** Choose your preferred model (e.g., `claude-opus-4-8`, `gpt-5.5`, `gemini-3.5-flash`)

4.  **Advanced Settings for Claude Models:**
    
    ?> **Important:** When using models like `claude-sonnet-4-5`, `anthropic.claude-sonnet-4-20250514-v1:0`, or other native reasoning models, you need to configure the temperature setting:
    
    - Open **Advanced Settings** in the RooCode configuration
    - Enable **"Use Custom Temperature"**
    - Set temperature to **1** (these models only support temperature 1)

5.  **Save Configuration:**
    Click "Save" to apply your settings.

![RooCode Configuration with AvalAI](../_media/img/avalai-api-vscode-roocode.webp ':size=400')

#### Enabling 1M Context Window for Claude 4 Models

Claude 4.5 Sonnet and Claude 4 Sonnet support extended context windows beyond the standard 200K tokens. To enable the full 1 million token context:

1.  **Access Custom Headers:**
    In the RooCode settings, scroll to the **Custom Headers** section

2.  **Add Context Header:**
    Add the following custom header:
    ```
    Header Name: anthropic-beta
    Header Value: context-1m-2025-08-07
    ```

![Custom Headers Configuration](../_media/img/claude-roocode-1m-context-header.jpg ':size=500')

This enables the 1M token context window for these models:
- `claude-sonnet-4-5`
- `anthropic.claude-sonnet-4-20250514-v1:0`

#### Setting Up Codebase Indexing

RooCode offers a powerful codebase indexing feature that enables semantic search across your entire project. This allows the AI to find relevant code snippets in large codebases without reading every file, resulting in faster debugging, more consistent code generation, and an overall improved coding experience.

**Benefits of Codebase Indexing:**
- Find relevant code snippets instantly without scanning all files
- Faster debugging and problem resolution
- More consistent code suggestions based on your existing codebase
- Better understanding of project architecture and patterns

**Setup Steps:**

1.  **Access Indexing Settings:**
    - Click the **database icon** in the bottom right corner of the RooCode panel
    - This opens the Codebase Indexing configuration

![Codebase Indexing Interface](../_media/img/roocode-codebase-indexing.jpg ':size=500')

2.  **Configure Embedder Provider:**
    - **Embedder Provider:** Select **"OpenAI Compatible"**
    - **Base URL:** Enter `https://api.avalai.ir/v1`
    - **API Key:** Paste your AvalAI API key (same as main configuration)

3.  **Select Embedding Model:**
    Choose one of these OpenAI embedding models:
    - **text-embedding-3-large** - Higher accuracy, better quality (recommended)
    - **text-embedding-3-small** - Faster, more economical

4.  **Set Model Dimension:**
    Enter the correct dimension based on your selected model:
    - **3072** for `text-embedding-3-large`
    - **1536** for `text-embedding-3-small`

5.  **Configure Qdrant Vector Store:**
    
    Enter your Qdrant URL in the **Qdrant URL** field:
    
    **Option A: Local Qdrant (Recommended for Privacy)**
    
    For enhanced privacy and control, run Qdrant locally using Docker:
    ```bash
docker run -p 6333:6333 qdrant/qdrant
```
    Then use: `http://localhost:6333`
    
    **Option B: Remote Qdrant**
    
    Use a cloud-hosted Qdrant instance:
    ```
    https://your-qdrant-instance.cloud:6333
    ```

6.  **Start Indexing:**
    - Click **"Start Indexing"** button
    - Wait for the indexing process to complete
    - The database icon will show a **green dot** when indexing is finished and the codebase is ready

?> **Tip:** The indexing process runs once and automatically updates as you modify files. The green dot indicator confirms your codebase is indexed and ready for semantic search.

### Setting Up Continue Extension

Continue is another popular AI coding assistant that supports OpenAI-compatible APIs:

1.  **Install Continue:**
    Install the Continue extension from the VSCode marketplace.

2.  **Open Continue Configuration:**
    Click the settings/gear icon in the Continue sidebar.

3.  **Add AvalAI Provider:**
    Edit the configuration JSON file and add:
    ```json
{
  "models": [
    {
      "title": "AvalAI Claude 4.5 Sonnet",
      "provider": "openai",
      "model": "claude-sonnet-4-5",
      "apiKey": "YOUR_AVALAI_API_KEY",
      "apiBase": "https://api.avalai.ir/v1"

    }
  ]
}
```

4.  **Replace Placeholder:**
    Replace `YOUR_AVALAI_API_KEY` with your actual AvalAI API key.

### Setting Up Other OpenAI-Compatible Extensions

Most VSCode AI extensions that support custom OpenAI endpoints can be configured similarly:

1.  **Locate API Settings:**
    Find the extension's API or provider configuration section.

2.  **Set Provider to OpenAI Compatible:**
    Select "OpenAI" or "OpenAI Compatible" as the provider type.

3.  **Configure Connection:**
    - **Base URL/Endpoint:** `https://api.avalai.ir/v1`
    - **API Key:** Your AvalAI API key
    - **Model:** Choose from any of the 410+ available models

4.  **Test Connection:**
    Send a test prompt to verify the configuration works correctly.

### Using Native Anthropic or Gemini Profiles

?> **Note:** Some VSCode extensions and code editors support native Anthropic and Gemini API profiles in addition to OpenAI-compatible mode. AvalAI natively supports both!

If your extension offers native **Anthropic** or **Gemini** configuration options, you can use them with these settings:

**For Native Anthropic Profile:**
- **API Key:** Your AvalAI API key
- **Base URL:** `https://api.avalai.ir` (⚠️ **without** `/v1`)
- **Available Models:** Only Claude models (Claude Opus 4.7, Claude Sonnet 4.6, Claude Haiku 4.5, etc.)

**For Native Gemini Profile:**
- **API Key:** Your AvalAI API key
- **Base URL:** `https://api.avalai.ir` (⚠️ **without** `/v1`)
- **Available Models:** Only Gemini models (Gemini 3.1 Pro, Gemini 3 Flash, Gemini 2.5 Pro, etc.)

!> **Important:** When using native Anthropic or Gemini profiles, you'll only have access to that provider's models. For access to **all 410+ models** from multiple providers (OpenAI, Anthropic, Google, Meta, Mistral, and more), use the **OpenAI-compatible configuration** described above with `https://api.avalai.ir/v1`.

## Configuring Cursor IDE

Cursor is a popular AI-powered code editor built on VSCode. Configuration is similar:

1.  **Open Cursor Settings:**
    Go to Settings → Features → Models

2.  **Add Custom Model:**
    - Click "Add Model" or similar option
    - **Provider:** OpenAI
    - **Base URL:** `https://api.avalai.ir/v1`
    - **API Key:** Your AvalAI API key
    - **Model Name:** Enter the model identifier (e.g., `gpt-5.5`, `claude-opus-4-8`)

3.  **Save and Test:**
    Save your configuration and test with a coding prompt.

## Choosing the Right Model

AvalAI offers access to 410+ models. Here are some recommendations for coding tasks:

### For Complex Code Generation & Reasoning
*   **Claude Opus 4.8** (`claude-opus-4-8`) - Best for complex reasoning and large codebases
*   **GPT-5.5** (`gpt-5.5`) - Excellent for advanced problem-solving
*   **Claude 4.6 Sonnet** (`claude-sonnet-4-6`) - Great balance of speed and quality

### For Fast, Efficient Coding
*   **GPT-5.3 Codex** (`gpt-5.3-codex`) - Fast and reliable for general coding
*   **Gemini 2.5 Flash** (`gemini-2.5-flash`) - Quick responses with good quality
*   **Claude 3.5 Sonnet** (`claude-3-5-sonnet-20241022`) - Excellent for rapid development

### For Cost-Effective Development
*   **DeepSeek V4 Flash** (`deepseek-v4-flash`) - specialized for coding
*   **Qwen Coder** (`qwen-2.5-coder-32b-instruct`) - Good quality at lower cost
*   **Gemini 3.5 Flash** (`gemini-3.5-flash`) - Fast, multimodal, and economical
*   **Kimi K2.7 Code** (`kimi-k2.7-code`) - Strong open-source coding model for agentic workflows

### For Specialized Tasks
*   **DeepSeek-V4 Pro** (`deepseek-v4-pro`) - Excellent for mathematical and algorithmic tasks
*   **Codestral** (`codestral-latest`) - Optimized specifically for code completion

## Tips and Best Practices

*   **Secure Storage:** Treat your AvalAI API key like a password. Never commit it to version control or share it publicly.
*   **Environment Variables:** Consider storing your API key in environment variables or a secure credential manager.
*   **Model Selection:** Start with a balanced model like Claude Sonnet 4.6, Gemini 3.5 Flash, or GPT-5.5, then adjust based on your needs.
*   **Context Management:** Provide clear, specific prompts with relevant context for better results.
*   **Rate Limits:** Be aware of AvalAI's [rate limits](en/guides/rate-limits.md). Most coding tasks stay well within limits, but be mindful with batch operations.
*   **Cost Monitoring:** Track your usage through the AvalAI dashboard to monitor costs and optimize model selection.
*   **Multiple Configurations:** Create different configuration profiles for different projects or use cases.
*   **Model Experimentation:** Try different models for different tasks—some excel at debugging, others at documentation.

## Troubleshooting

*   **Invalid API Key Error:**
    - Double-check that you copied your AvalAI key correctly
    - Ensure there are no extra spaces or characters
    - Verify the key is still active in your AvalAI dashboard

*   **Connection Issues:**
    - Verify your internet connection
    - Check if any firewall or proxy is blocking `https://api.avalai.ir`
    - Ensure the base URL is exactly `https://api.avalai.ir/v1` (including `/v1`)

*   **Model Not Found Error:**
    - Confirm the model identifier is correct (check AvalAI documentation)
    - Ensure the model is available in your subscription tier
    - Try using a common model like `gpt-5.5` or `claude-opus-4-8`

*   **Slow Response Times:**
    - Try switching to a faster model like Gemini 3.5 Flash or `gpt-5.4-mini`
    - Check your network connection
    - Consider reducing the context size in your prompts

*   **Rate Limit Errors:**
    - Review your [rate limits](en/guides/rate-limits.md) for your tier
    - Wait a moment before retrying
    - Consider upgrading your tier for higher limits

*   **Extension Not Recognizing Configuration:**
    - Restart VSCode after changing settings
    - Check the extension's documentation for specific configuration format
    - Verify the extension supports custom OpenAI endpoints

## Advanced Configuration

### Using Multiple Models

Configure multiple model profiles to switch between them based on your task:

```json
{
  "models": [
    {
      "title": "Fast Coding - GPT-5.5",
      "model": "gpt-5.5",
      "apiBase": "https://api.avalai.ir/v1",

      "apiKey": "your-avalai-api-key"
    },
    {
      "title": "Deep Reasoning - Claude 4 Opus",
      "model": "anthropic.claude-opus-4-20250514-v1:0",
      "apiBase": "https://api.avalai.ir/v1",

      "apiKey": "your-avalai-api-key"
    },
    {
      "title": "Cost-Effective - Gemini Flash",
      "model": "gemini-2.5-flash",
      "apiBase": "https://api.avalai.ir/v1",

      "apiKey": "your-avalai-api-key"
    }
  ]
}
```

### Custom Headers (If Supported)

Some extensions allow custom headers for additional control. While not typically required, you can add headers if needed for specific use cases.

## Conclusion

Integrating AvalAI with VSCode extensions and other code editors is straightforward and unlocks access to over 410 powerful AI models directly in your development environment. By following these steps, you can enhance your coding workflow with state-of-the-art AI assistance while maintaining flexibility and cost-effectiveness.

Whether you're using RooCode, Continue, Cursor, or any other OpenAI-compatible extension, the configuration process is similar and takes just a few minutes. Start experimenting with different models to find the perfect fit for your development needs!

## Related Resources

- [AvalAI API Reference: Introduction](en/api-reference/introduction.md)
- [AvalAI Models Overview](en/models/model-details.md)
- [Rate Limits Guide](en/guides/rate-limits.md)
- [Best Practices for AI Coding Assistants](en/guides/best-practices.md)
- [Model Selection Guide](en/guides/model-selection.md)
