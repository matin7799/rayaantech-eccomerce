# Libraries

Set up your development environment to use the AvalAI API with an SDK in your preferred language.

This page covers setting up your local development environment to use the [AvalAI API](/api-reference/introduction.md). AvalAI uses the official OpenAI SDKs with a custom base URL, allowing you to leverage well-maintained libraries while connecting to AvalAI's services.

## Create and export an API key

Before you begin, [create an API key in the dashboard](https://chat.avalai.ir/platform/home), which you'll use to securely [access the API](/api-reference/introduction.md). Store the key in a safe location, like a [`.zshrc` file](https://www.freecodecamp.org/news/how-do-zsh-configuration-files-work/) or another text file on your computer. Once you've generated an API key, export it as an [environment variable](https://en.wikipedia.org/wiki/Environment_variable) in your terminal.

```language-selector
bash=:# Export an environment variable on macOS or Linux systems
export AVALAI_API_KEY="aa-YOUR_API_KEY"

powershell:# Export an environment variable in PowerShell
setx AVALAI_API_KEY "aa-YOUR_API_KEY"

```

The examples below pass `AVALAI_API_KEY` explicitly and set AvalAI's custom base URL on each client.

## SDK Options

AvalAI supports three approaches for accessing AI models:

1. **OpenAI-Compatible SDKs** (Unified approach) - Use OpenAI's SDKs to access all models from multiple providers with consistent syntax
2. **Anthropic Official SDKs** (Native approach) - Use Anthropic's official SDKs to access models from multiple providers (Anthropic, OpenAI, AWS Bedrock, Vertex AI, and Gemini) with native syntax
3. **Google GenAI SDK** (Native approach) - Use Google's official GenAI SDK for native access to Gemini models with Google's native API schema

## Install an official SDK

Jump to your language:

<div class="doc-card-grid">
  <a class="doc-card" href="/libraries?id=javascript"><span class="doc-card-title">JavaScript / TypeScript</span><span class="doc-card-desc">Node.js, Deno, Bun — <code>npm install openai</code></span></a>
  <a class="doc-card" href="/libraries?id=python"><span class="doc-card-title">Python</span><span class="doc-card-desc">Official OpenAI SDK — <code>pip install openai</code></span></a>
  <a class="doc-card" href="/libraries?id=net"><span class="doc-card-title">.NET / C#</span><span class="doc-card-desc">Microsoft-supported — <code>dotnet add package OpenAI</code></span></a>
  <a class="doc-card" href="/libraries?id=java"><span class="doc-card-title">Java</span><span class="doc-card-desc">Maven dependency for <code>openai-java</code></span></a>
  <a class="doc-card" href="/libraries?id=go"><span class="doc-card-title">Go</span><span class="doc-card-desc">Official Go helper for the OpenAI API</span></a>
  <a class="doc-card" href="/libraries?id=community-libraries"><span class="doc-card-title">Community</span><span class="doc-card-desc">PHP, Ruby, Rust, and more community SDKs</span></a>
</div>

## Javascript

To use the AvalAI API in server-side JavaScript environments like Node.js, Deno, or Bun, you can use the official OpenAI SDK for TypeScript and JavaScript. Get started by installing the SDK using [npm](https://www.npmjs.com/) or your preferred package manager:

```bash
npm install openai
```

With the OpenAI SDK installed, create a file called `example.mjs` and copy the example code into it:

```javascript
import OpenAI from "openai";
const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1", // AvalAI API endpoint
});

const response = await client.responses.create({
  model: "gpt-5.5",
  input: "Write a one-sentence bedtime story about a unicorn.",
});

console.log(response.output_text);
```

Execute the code with `node example.mjs` (or the equivalent command for Deno or Bun). In a few moments, you should see the output of your API request.

## Python

To use the AvalAI API in Python, you can use the official OpenAI SDK for Python. Get started by installing the SDK using [pip](https://pypi.org/project/pip/):

```bash
pip install openai
```

With the OpenAI SDK installed, create a file called `example.py` and copy the example code into it:

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["AVALAI_API_KEY"],
    base_url="https://api.avalai.ir/v1",
)

response = client.responses.create(
    model="gpt-5.5", input="Write a one-sentence bedtime story about a unicorn."
)

print(response.output_text)
```

Execute the code with `python example.py`. In a few moments, you should see the output of your API request.

## .NET

In collaboration with Microsoft, OpenAI provides an officially supported API client for C# that can be used with AvalAI. You can install it with the .NET CLI from [NuGet](https://www.nuget.org/).

```bash
dotnet add package OpenAI
```

A simple API request to [Chat Completions](/api-reference/chat.md) would look like this:

```csharp
using OpenAI.Chat;

ChatClient client = new(
  model: "gpt-5.5",
  apiKey: Environment.GetEnvironmentVariable("AVALAI_API_KEY"),
  endpoint: new Uri("https://api.avalai.ir/v1") // AvalAI API endpoint
);

ChatCompletion completion = client.CompleteChat("Say 'this is a test.'");

Console.WriteLine($"[ASSISTANT]: {completion.Content[0].Text}");
```

## Java

OpenAI provides an API helper for the Java programming language that can be used with AvalAI. You can include the Maven dependency using the following configuration:

```xml
<dependency>
  <groupId>com.openai</groupId>
  <artifactId>openai-java</artifactId>
  <version>0.31.0</version>
</dependency>
```

A simple API request to [Chat Completions](/api-reference/chat.md) would look like this:

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.ChatCompletion;
import com.openai.models.ChatCompletionCreateParams;
import com.openai.models.ChatModel;

// Create a custom client with AvalAI's base URL
OpenAIClient client = OpenAIOkHttpClient.builder()
  .baseUrl("https://api.avalai.ir/v1") // AvalAI API endpoint
  .apiKey(System.getenv("AVALAI_API_KEY"))
  .build();

ChatCompletionCreateParams params = ChatCompletionCreateParams.builder()
  .addUserMessage("Say this is a test")
  .model(ChatModel.O3_MINI)
  .build();
ChatCompletion chatCompletion = client.chat().completions().create(params);
```

## Go

OpenAI provides an API helper for the Go programming language that can be used with AvalAI. You can import the library using the code below:

```go
import (
	"github.com/openai/openai-go" // imported as openai
)
```

A simple API request to [Chat Completions](/api-reference/chat.md) would look like this:

```go
package main

import (
	"context"
	"fmt"
	"os"

	"github.com/openai/openai-go"
	"github.com/openai/openai-go/option"
)

func main() {
	client := openai.NewClient(
		option.WithAPIKey(os.Getenv("AVALAI_API_KEY")),
		option.WithBaseURL("https://api.avalai.ir/v1"), // AvalAI API endpoint
	)
	chatCompletion, err := client.Chat.Completions.New(
		context.TODO(), openai.ChatCompletionNewParams{
			Messages: openai.F(
				[]openai.ChatCompletionMessageParamUnion{
					openai.UserMessage("Say this is a test"),
				},
			),
			Model: openai.F(openai.ChatModel("gpt-5.5")),
		},
	)

	if err != nil {
		panic(err)
	}

	fmt.Println(chatCompletion.Choices[0].Message.Content)
}
```

## Anthropic Official SDKs

AvalAI now supports Anthropic's official SDKs, allowing you to use native Anthropic client libraries with familiar syntax and features while accessing models through AvalAI's unified API system. As of June 2025, the Anthropic SDK can be used to access models from multiple providers, not just Claude models.

### Multi-Provider Support

The Anthropic SDK can now be used to access chat models from:

- **OpenAI**
- **Anthropic**
- **AWS Bedrock**
- **Vertex AI**
- **Gemini**

Any chat model from these providers that supports the chat completion endpoint can be used through the Anthropic official SDK and the "v1/messages" endpoint in Anthropic's API schema.

### Python

Install the official Anthropic Python SDK:

```bash
pip install anthropic
```

Configure the client to use AvalAI's endpoint:

```python
import anthropic

client = anthropic.Anthropic(
    api_key="your-avalai-api-key",  # Replace with your actual API key
    base_url="https://api.avalai.ir",  # AvalAI API endpoint without /v1
)

# Using a Claude model
message = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello, Claude"}],
)
print(message.content)

# Using an OpenAI model through the Anthropic SDK
message = client.messages.create(
    model="gpt-5.5",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello, GPT-5.5!"}],
)
print(message.content)

# Using a Gemini model through the Anthropic SDK
message = client.messages.create(
    model="gemini-2.5-pro",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello, Gemini!"}],
)
print(message.content)
```

### TypeScript/JavaScript

Install the official Anthropic TypeScript SDK:

```bash
npm install @anthropic-ai/sdk
```

Configure the client:

```javascript
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.AVALAI_API_KEY, // Replace with your actual API key
  baseURL: "https://api.avalai.ir", // AvalAI API endpoint without /v1
});

// Using a Claude model
const claudeMsg = await anthropic.messages.create({
  model: "claude-sonnet-4-6",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Hello, Claude" }],
});
console.log(claudeMsg);

// Using an OpenAI model through the Anthropic SDK
const openaiMsg = await anthropic.messages.create({
  model: "gpt-5.5",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Hello!" }],
});
console.log(openaiMsg);

// Using a Vertex AI model through the Anthropic SDK
const vertexMsg = await anthropic.messages.create({
  model: "gemini-2.5-pro",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Hello, Gemini!" }],
});
console.log(vertexMsg);
```

### Go

Install the official Anthropic Go SDK:

```bash
go get github.com/anthropics/anthropic-sdk-go
```

Configure the client:

```go
package main

import (
	"context"
	"fmt"
	"github.com/anthropics/anthropic-sdk-go"
	"github.com/anthropics/anthropic-sdk-go/option"
)

func main() {
	client := anthropic.NewClient(
		option.WithAPIKey("your-avalai-api-key"),    // Replace with your actual API key
		option.WithBaseURL("https://api.avalai.ir"), // AvalAI endpoint without /v1
	)

	message, err := client.Messages.New(context.TODO(), anthropic.MessageNewParams{
		Model:     anthropic.F(anthropic.ModelClaudeSonnet4_0),
		MaxTokens: anthropic.F(int64(1024)),
		Messages: anthropic.F([]anthropic.MessageParam{
			anthropic.NewUserMessage(anthropic.NewTextBlock("Hello, Claude")),
		}),
	})
	if err != nil {
		panic(err.Error())
	}
	fmt.Printf("%+v\n", message.Content)
}
```

### Ruby

Install the official Anthropic Ruby gem:

```bash
gem install anthropic
```

Configure the client:

```ruby
require "bundler/setup"
require "anthropic"

anthropic = Anthropic::Client.new(
    api_key: "your-avalai-api-key", # Replace with your actual API key
    base_url: "https://api.avalai.ir" # AvalAI endpoint without /v1
)

message = anthropic.messages.create(
    max_tokens: 1024,
    messages: [{
        role: "user",
        content: "Hello, Claude"
    }],
    model: "claude-sonnet-4-6"
)

puts(message.content)
```

### Beta Features

All Anthropic SDKs support beta namespace for experimental features:

```python
import anthropic

client = anthropic.Anthropic(
    api_key="your-avalai-api-key",
    base_url="https://api.avalai.ir",  # AvalAI API endpoint without /v1
)

message = client.beta.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello, Claude"}],
    betas=["beta-feature-name"],
)
print(message.content)
```

### Available Models

When using Anthropic SDKs with AvalAI, you can access models from multiple providers:

#### Claude Models
- **Claude Opus 4** - `anthropic.claude-opus-4-20250514-v1:0`
- **Claude Sonnet 4** - `anthropic.claude-sonnet-4-20250514-v1:0`
- **Claude 3.7 Sonnet** - `claude-sonnet-4-6`
- **Claude 3.5 Sonnet** - `claude-sonnet-4-6`
- **Claude 3.5 Haiku** - `claude-haiku-4-5`

#### Other Provider Models
You can also access models from:
- **OpenAI** (e.g., `gpt-5.5`, `gpt-5.3-codex`, `gpt-5-mini`)
- **AWS Bedrock** models
- **Vertex AI** models
- **Gemini** (e.g., `gemini-3.5-flash`, `gemini-3.1-pro-preview`)

For a complete list, see our [Models documentation](en/api-reference/chat.md).

## Google GenAI SDK

AvalAI now supports Google's official GenAI SDK for native access to Gemini models using Google's native API schema and endpoints.

### JavaScript/TypeScript

Install the Google GenAI SDK:

```bash
npm install @google/genai
```

Configure the client to use AvalAI's endpoint:

```javascript
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
	apiKey: 'your-avalai-api-key',
	httpOptions: {"apiVersion": "v1beta", "baseUrl": "https://api.avalai.ir"}
});

async function main() {
	const response = await ai.models.generateContent({
		model: "gemini-2.5-flash",
		contents: "Write a brief summary of key machine learning principles.",
	});
	console.log(response.text);
}

await main();
```

### Python

Install the Google GenAI SDK:

```bash
pip install google-generativeai
```

Configure the client to use AvalAI's endpoint:

```python
from google import genai
from google.genai.types import ContentDict, PartDict

# Initialize client with AvalAI endpoint
client = genai.Client(
    api_key="your-avalai-api-key",  # Your AvalAI API key
    http_options={"base_url": "https://api.avalai.ir"},  # Note: no /v1 suffix
)

# Generate content using native API
contents = ContentDict(
    parts=[PartDict(text="Write a short story about AI")], role="user"
)

response = await client.agenerate_content(
    contents=contents, model="gemini-2.5-flash", max_tokens=500
)

print(response)
```

### Streaming Support

```python
# Streaming generation
response = await client.agenerate_content_stream(
    contents=contents, model="gemini-2.5-flash", max_tokens=500
)

async for chunk in response:
    print(chunk)
```

### Key Features

- **Native API Schema**: Direct access using Google's `generateContent` and `streamGenerateContent` endpoints
- **Flexible Authentication**: Support for both `Authorization: Bearer` and `x-goog-api-key` headers
- **Full Streaming Support**: Native streaming capabilities
- **Multimodal Support**: Native support for text, image, audio, and video inputs

### Important Limitations

- **Gemini Models Only**: This SDK exclusively supports Gemini models
- **Base URL**: Use `https://api.avalai.ir` (without `/v1`) when configuring the SDK
- **v1beta Endpoints**: Uses `/v1beta/models/{model}:generateContent` endpoint format

For complete documentation, see the [v1beta API Reference](en/api-reference/v1beta.md).

## Azure OpenAI libraries

Microsoft's Azure team maintains libraries that are compatible with both the OpenAI API and Azure OpenAI services. These libraries can also be configured to work with AvalAI by specifying the custom endpoint. Read the library documentation below to learn how you can use them with the AvalAI API.

- [Azure OpenAI client library for .NET](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/openai/Azure.AI.OpenAI)
- [Azure OpenAI client library for JavaScript](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/openai/openai)
- [Azure OpenAI client library for Java](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/openai/azure-ai-openai)
- [Azure OpenAI client library for Go](https://github.com/Azure/azure-sdk-for-go/tree/main/sdk/ai/azopenai)

## Community libraries

The libraries below are built and maintained by the broader developer community for use with OpenAI's API. Many of these can be configured to work with AvalAI by specifying the base URL as `https://api.avalai.ir/v1`. You can also [watch OpenAI's OpenAPI specification](https://github.com/openai/openai-openapi) repository on GitHub to get timely updates on when there are changes to the API.

Please note that AvalAI does not verify the correctness or security of these projects. **Use them at your own risk!**

### C# / .NET

- [Betalgo.OpenAI](https://github.com/betalgo/openai) by [Betalgo](https://github.com/betalgo)
- [OpenAI-API-dotnet](https://github.com/OkGoDoIt/OpenAI-API-dotnet) by [OkGoDoIt](https://github.com/OkGoDoIt)
- [OpenAI-DotNet](https://github.com/RageAgainstThePixel/OpenAI-DotNet) by [RageAgainstThePixel](https://github.com/RageAgainstThePixel)

### C++

- [liboai](https://github.com/D7EAD/liboai) by [D7EAD](https://github.com/D7EAD)

### Clojure

- [openai-clojure](https://github.com/wkok/openai-clojure) by [wkok](https://github.com/wkok)

### Crystal

- [openai-crystal](https://github.com/sferik/openai-crystal) by [sferik](https://github.com/sferik)

### Dart/Flutter

- [openai](https://github.com/anasfik/openai) by [anasfik](https://github.com/anasfik)

### Delphi

- [DelphiOpenAI](https://github.com/HemulGM/DelphiOpenAI) by [HemulGM](https://github.com/HemulGM)

### Elixir

- [openai.ex](https://github.com/mgallo/openai.ex) by [mgallo](https://github.com/mgallo)

### Go

- [go-gpt3](https://github.com/sashabaranov/go-gpt3) by [sashabaranov](https://github.com/sashabaranov)

### Java

- [simple-openai](https://github.com/sashirestela/simple-openai) by [Sashir Estela](https://github.com/sashirestela)
- [Spring AI](https://spring.io/projects/spring-ai)

### Julia

- [OpenAI.jl](https://github.com/rory-linehan/OpenAI.jl) by [rory-linehan](https://github.com/rory-linehan)

### Kotlin

- [openai-kotlin](https://github.com/Aallam/openai-kotlin) by [Mouaad Aallam](https://github.com/Aallam)

### Node.js

- [openai-api](https://www.npmjs.com/package/openai-api) by [Njerschow](https://github.com/Njerschow)
- [openai-api-node](https://www.npmjs.com/package/openai-api-node) by [erlapso](https://github.com/erlapso)
- [gpt-x](https://www.npmjs.com/package/gpt-x) by [ceifa](https://github.com/ceifa)
- [gpt3](https://www.npmjs.com/package/gpt3) by [poteat](https://github.com/poteat)
- [gpts](https://www.npmjs.com/package/gpts) by [thencc](https://github.com/thencc)
- [@dalenguyen/openai](https://www.npmjs.com/package/@dalenguyen/openai) by [dalenguyen](https://github.com/dalenguyen)
- [tectalic/openai](https://github.com/tectalichq/public-openai-client-js) by [tectalic](https://tectalic.com/)

### PHP

- [orhanerday/open-ai](https://packagist.org/packages/orhanerday/open-ai) by [orhanerday](https://github.com/orhanerday)
- [tectalic/openai](https://github.com/tectalichq/public-openai-client-php) by [tectalic](https://tectalic.com/)
- [openai-php client](https://github.com/openai-php/client) by [openai-php](https://github.com/openai-php)

### Python

- [chronology](https://github.com/OthersideAI/chronology) by [OthersideAI](https://www.othersideai.com/)

### R

- [rgpt3](https://github.com/ben-aaron188/rgpt3) by [ben-aaron188](https://github.com/ben-aaron188)

### Ruby

- [openai](https://github.com/nileshtrivedi/openai/) by [nileshtrivedi](https://github.com/nileshtrivedi)
- [ruby-openai](https://github.com/alexrudall/ruby-openai) by [alexrudall](https://github.com/alexrudall)

### Rust

- [async-openai](https://github.com/64bit/async-openai) by [64bit](https://github.com/64bit)
- [fieri](https://github.com/lbkolev/fieri) by [lbkolev](https://github.com/lbkolev)

### Scala

- [openai-scala-client](https://github.com/cequence-io/openai-scala-client) by [cequence-io](https://github.com/cequence-io)

### Swift

- [AIProxySwift](https://github.com/lzell/AIProxySwift) by [Lou Zell](https://github.com/lzell)
- [OpenAIKit](https://github.com/dylanshine/openai-kit) by [dylanshine](https://github.com/dylanshine)
- [OpenAI](https://github.com/MacPaw/OpenAI/) by [MacPaw](https://github.com/MacPaw)

### Unity

- [OpenAi-Api-Unity](https://github.com/hexthedev/OpenAi-Api-Unity) by [hexthedev](https://github.com/hexthedev)
- [com.openai.unity](https://github.com/RageAgainstThePixel/com.openai.unity) by [RageAgainstThePixel](https://github.com/RageAgainstThePixel)

### Unreal Engine

- [OpenAI-Api-Unreal](https://github.com/KellanM/OpenAI-Api-Unreal) by [KellanM](https://github.com/KellanM)

## Other useful repositories

- [tiktoken](https://github.com/openai/tiktoken) - counting tokens
- [simple-evals](https://github.com/openai/simple-evals) - simple evaluation library
- [mle-bench](https://github.com/openai/mle-bench) - library to evaluate machine learning engineer agents
- [gym](https://github.com/openai/gym) - reinforcement learning library
- [swarm](https://github.com/openai/swarm) - educational orchestration repository

## Related Resources

- [API Reference](/api-reference/introduction.md)
- [Authentication](/api-reference/authentication.md)
- [Quickstart](/quickstart.md)

```

```
