# Integrating AvalAI with OpenAI Codex

OpenAI Codex is a powerful AI coding agent available as a CLI, IDE extension, and desktop app. While it ships with OpenAI models by default, Codex supports **custom model providers**, which means you can point it at AvalAI and unlock access to over 410 advanced AI models—not just OpenAI's, but also Claude, Gemini, DeepSeek, Grok, Qwen, Mistral, and many more—all through a single API.

Because Codex reads its configuration from a simple `~/.codex/config.toml` file, integrating AvalAI takes just a few minutes: define a custom provider, point its base URL at AvalAI, and tell Codex to use it.

?> **💰 Special Offer:** Take advantage of AvalAI's [exclusive credit packages](en/credit-packages.md) and receive **up to 70% more credit** or enjoy **up to 40% discount** on your purchases. These exclusive offers help you maximize your AI development budget!

## Why Integrate AvalAI with OpenAI Codex?

Connecting Codex to AvalAI brings powerful capabilities to your terminal and editor:

*   **Access to 410+ models:** Use Claude Opus 4.8, GPT-5.5, Gemini 3.5 Flash, GLM-5.2, Kimi K2.7 Code, MiniMax M3, DeepSeek-V4, Grok, Qwen, and many more—not limited to OpenAI models
*   **Multiple Providers, One Config:** Switch between OpenAI, Anthropic, Google, DeepSeek, and other providers without changing tools
*   **Full Agentic Coding:** Generate code, refactor, debug, run commands, and edit files directly from the CLI or IDE
*   **OpenAI-Compatible API:** AvalAI exposes an OpenAI-compatible endpoint, so Codex works out of the box with a custom provider
*   **Cost-Effectiveness:** Benefit from AvalAI's competitive pricing, aligned with original provider rates
*   **Flexibility:** Choose the best model for each task—reasoning, fast coding, or cost-effective development

## Obtaining Your AvalAI API Key (Step-by-Step)

Follow these steps to obtain your AvalAI API key:

1.  **Create an AvalAI Account:**
    If you don't already have one, visit the [AvalAI Dashboard](https://chat.avalai.ir/platform/home) and create an account.

2.  **Access the API Keys Page:**
    Once logged in, navigate to the "API Keys" section in your dashboard.

3.  **Generate a New API Key:**
    Click the button to "Generate new key" or "Create secret key."

4.  **Name Your Key (Optional):**
    Give your API key a descriptive name like "Codex Development" to help organize and manage your keys.

5.  **Copy Your API Key:**
    After generating the key, it will be displayed once. **Important:** Copy this key immediately and store it securely. You won't be able to see the full key again for security reasons.

## Install the Codex CLI

If you haven't installed Codex yet, install the CLI first.

On macOS or Linux, use the standalone installer:

```bash
curl -fsSL https://chatgpt.com/codex/install.sh | sh
```

On Windows, run:

```powershell
powershell -ExecutionPolicy ByPass -c "irm https://chatgpt.com/codex/install.ps1 | iex"
```

You can also install the Codex CLI with npm or Homebrew:

```bash
npm install -g @openai/codex
```

```bash
brew install --cask codex
```

The Codex CLI and IDE extension share the same configuration layers, so the steps below apply to both.

## Set Your AvalAI API Key as an Environment Variable

Codex reads the provider API key from an environment variable that you name in the configuration (via `env_key`). In this guide we'll use `AVALAI_API_KEY`.

Export your AvalAI API key so Codex can read it:

**macOS / Linux (bash or zsh):**

```bash
export AVALAI_API_KEY="your-avalai-api-key"
```

To make it permanent, add that line to your `~/.zshrc`, `~/.bashrc`, or `~/.bash_profile`, then restart your terminal.

**Windows (PowerShell):**

```powershell
setx AVALAI_API_KEY "your-avalai-api-key"
```

Restart your terminal after running `setx` so the variable becomes available.

?> **Security Tip:** Never hard-code your API key directly in `config.toml`. Using an environment variable via `env_key` keeps your secret out of configuration files that might be committed to version control.

## Configure Codex for AvalAI

Codex stores its user-level configuration at `~/.codex/config.toml`. Open (or create) this file and define AvalAI as a custom model provider.

> **Tip:** From the Codex IDE extension, you can open this file via the gear icon in the top-right corner, then **Codex Settings > Open config.toml**.

### Recommended Configuration

Add the following to `~/.codex/config.toml`:

```toml
model = "gpt-5.3-codex"
model_reasoning_effort = "medium"
model_provider = "avalai"

[model_providers.avalai]
name = "AvalAI"
base_url = "https://api.avalai.ir/v1"
env_key = "AVALAI_API_KEY"
```

Here's what each setting does:

*   **`model`** — The default model Codex uses. You can set this to any model available through AvalAI (for example, `gpt-5.3-codex`, `claude-opus-4-8`, `gemini-3.1-pro-preview`, or `deepseek-v4-pro`).
*   **`model_reasoning_effort`** — Tunes how much reasoning effort the model applies when supported. Options are `low`, `medium`, `high`, or `xhigh`.
*   **`model_provider`** — Points Codex at the custom provider defined below. The value must match the provider table name.
*   **`[model_providers.avalai]`** — Defines the custom provider:
    *   **`name`** — A friendly display name shown in the Codex UI.
    *   **`base_url`** — AvalAI's OpenAI-compatible endpoint: `https://api.avalai.ir/v1`
    *   **`env_key`** — The name of the environment variable that holds your API key (`AVALAI_API_KEY`).

!> **Important:** Custom providers can't reuse Codex's reserved built-in provider IDs: `openai`, `ollama`, and `lmstudio`. That's why we name the provider `avalai`.

### A Note on the Responses API (Endpoint Compatibility)

?> **Important — read this if a non-OpenAI model misbehaves.** Recent versions of Codex no longer use the `v1/chat/completions` endpoint. Instead, Codex sends requests exclusively to the **`v1/responses`** endpoint (the OpenAI Responses API).

This works perfectly for OpenAI models. Most third-party providers (Claude, Gemini, DeepSeek, and others) are **fully compatible with `v1/chat/completions`**, but they aren't always fully compatible with `v1/responses`. Because Codex now relies on the Responses endpoint, you might occasionally see incompatibilities or degraded behavior with certain non-OpenAI models.

!> **Note:** AvalAI works hard to ensure that all models can be used over the `v1/responses` endpoint, but full compatibility across every single model isn't guaranteed. If a specific model isn't performing properly with Codex, please [contact AvalAI support](https://chat.avalai.ir/platform/home)—we'll do our best to make that model work over the Responses endpoint.

### Trusting Your Project

Codex only loads project-level configuration and runs without repeated prompts when a project is trusted. You can mark a project as trusted in your `config.toml`:

```toml
[projects."/path/to/your/project"]
trust_level = "trusted"
```

Replace `/path/to/your/project` with the absolute path to your project directory.

### Complete Example

Putting it all together, a complete `~/.codex/config.toml` for AvalAI looks like this:

```toml
model = "gpt-5.3-codex"
model_reasoning_effort = "medium"
model_provider = "avalai"

[model_providers.avalai]
name = "AvalAI"
base_url = "https://api.avalai.ir/v1"
env_key = "AVALAI_API_KEY"

[projects."/Users/yourname/projects/my-app"]
trust_level = "trusted"
```

## Run Codex

With your environment variable set and `config.toml` saved, launch Codex from your project directory:

```bash
cd /path/to/your/project
codex
```

Codex will start an interactive session using the AvalAI provider and the model you configured. Try a simple prompt to verify the connection:

```text
Tell me about this project
```

If you see a normal response, your integration is working! 🎉

### One-Off Model Overrides

You can override the model for a single run without editing `config.toml`:

```bash
# Use a dedicated flag
codex --model claude-opus-4-8

# Or a generic key/value override (the value is TOML, not JSON)
codex --config model='"gemini-3.1-pro-preview"'
```

## Using Models from Other Providers

One of the biggest advantages of AvalAI is access to models from many providers through the same OpenAI-compatible endpoint. Simply change the `model` value—no other configuration changes are required.

```toml
# Anthropic Claude
model = "claude-opus-4-8"

# Google Gemini
model = "gemini-3.1-pro-preview"

# DeepSeek
model = "deepseek-v4-pro"
```

### Switching Models with Profiles

If you frequently switch between models, Codex [profiles](https://developers.openai.com/codex/config-advanced#profiles) let you save named configuration layers. Create a separate file per profile in `~/.codex/`:

```toml
# ~/.codex/claude.config.toml
model = "claude-opus-4-8"
model_reasoning_effort = "high"
```

Then launch Codex with that profile:

```bash
codex --profile claude
```

The profile layers on top of your base `~/.codex/config.toml`, so it only needs the values that differ.

## Choosing the Right Model

AvalAI offers access to 410+ models. Here are some recommendations for coding tasks with Codex:

### For Complex Code Generation & Reasoning
*   **Claude Opus 4.8** (`claude-opus-4-8`) - Best for complex reasoning and large codebases
*   **GPT-5.5** (`gpt-5.5`) - Excellent for advanced problem-solving
*   **Claude 4.6 Sonnet** (`claude-sonnet-4-6`) - Great balance of speed and quality

### For Fast, Efficient Agentic Coding
*   **GPT-5.3 Codex** (`gpt-5.3-codex`) - Optimized for Codex-style agentic coding
*   **Gemini 3.1 Flash** (`gemini-3.1-flash`) - Quick responses with good quality
*   **Claude Haiku 4.5** (`claude-haiku-4-5`) - Fast and efficient for everyday tasks

### For Cost-Effective Development
*   **DeepSeek V4 Flash** (`deepseek-v4-flash`) - Specialized for coding
*   **Qwen3 Coder** (`qwen3-coder-next`) - Good quality at lower cost
*   **Gemini 3.5 Flash** (`gemini-3.5-flash`) - Fast, multimodal, and economical
*   **Kimi K2.7 Code** (`kimi-k2.7-code`) - Strong open-source coding model for agentic workflows

## Tips and Best Practices

*   **Secure Storage:** Treat your AvalAI API key like a password. Use the `env_key` environment variable approach rather than hard-coding it in `config.toml`. Never commit your key to version control.
*   **Reasoning Effort:** Lower `model_reasoning_effort` for faster, cheaper responses on simple tasks; raise it for complex problem-solving.
*   **Git Checkpoints:** Codex can modify your codebase. Create Git checkpoints before and after each task so you can easily revert changes if needed.
*   **AGENTS.md:** Add an `AGENTS.md` file to your repository to give Codex consistent project guidance (build commands, conventions, and expectations).
*   **Rate Limits:** Be aware of AvalAI's [rate limits](en/guides/rate-limits.md). Most coding tasks stay well within limits, but be mindful with large agentic runs.
*   **Cost Monitoring:** Track your usage through the AvalAI dashboard to monitor costs and optimize model selection.
*   **Model Experimentation:** Try different models for different tasks—some excel at debugging, others at documentation or large refactors.

## Troubleshooting

*   **Invalid API Key / Authentication Error:**
    - Confirm the `AVALAI_API_KEY` environment variable is set: run `echo $AVALAI_API_KEY` (macOS/Linux) or `echo %AVALAI_API_KEY%` (Windows).
    - Restart your terminal after setting the variable so Codex can read it.
    - Verify the key is still active in your AvalAI dashboard and that `env_key` in `config.toml` matches the variable name exactly.

*   **Provider Not Recognized / "reserved provider ID" Error:**
    - Make sure your custom provider isn't named `openai`, `ollama`, or `lmstudio`—these IDs are reserved by Codex. Use `avalai` instead.
    - Confirm `model_provider` matches the `[model_providers.<name>]` table name.

*   **Connection Issues:**
    - Verify your internet connection.
    - Check that no firewall or proxy is blocking `https://api.avalai.ir`.
    - Ensure `base_url` is exactly `https://api.avalai.ir/v1` (including `/v1`).

*   **Model Not Found Error:**
    - Confirm the model identifier is correct (check the AvalAI [models overview](en/models/model-details.md)).
    - Try a common model like `gpt-5.3-codex` or `claude-opus-4-8`.

*   **Non-OpenAI Model Behaves Unexpectedly:**
    - Codex uses the `v1/responses` endpoint, which some non-OpenAI models don't fully support yet (see [A Note on the Responses API](#a-note-on-the-responses-api-endpoint-compatibility) above).
    - Try a different model, or [contact AvalAI support](https://chat.avalai.ir/platform/home) so we can help make that model work over the Responses endpoint.

*   **Configuration Not Loading:**
    - Verify the file is at `~/.codex/config.toml` (or under `CODEX_HOME` if you set it).
    - Check the TOML syntax for typos—a malformed table or quote will prevent the config from loading.
    - For project-scoped config to load, the project must be trusted.

*   **Rate Limit Errors:**
    - Review your [rate limits](en/guides/rate-limits.md) for your tier.
    - Wait a moment before retrying, or consider upgrading your tier for higher limits.

## Conclusion

Integrating AvalAI with OpenAI Codex is straightforward and unlocks access to over 410 powerful AI models directly in your terminal and IDE. By defining a single custom provider in `~/.codex/config.toml` and exporting your AvalAI API key, you gain the freedom to use OpenAI, Claude, Gemini, DeepSeek, and many other models—switching between them with a single line change.

Whether you prefer Codex's fast `gpt-5.3-codex` model or want to tap into Claude's deep reasoning, AvalAI gives you one flexible, cost-effective gateway to the best AI models available.

## Related Resources

- [AvalAI API Reference: Introduction](en/api-reference/introduction.md)
- [AvalAI Models Overview](en/models/model-details.md)
- [Rate Limits Guide](en/guides/rate-limits.md)
- [Integrating AvalAI with VSCode Extensions](en/guides/setup-vscode.md)
- [Model Selection Guide](en/guides/model-selection.md)
- [OpenAI Codex Official Documentation](https://developers.openai.com/codex)
