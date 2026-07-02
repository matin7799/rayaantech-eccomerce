# Production Best Practices

Transition AI projects to production with best practices.

This guide provides a comprehensive set of best practices to help you transition from prototype to production. Whether you are a seasoned machine learning engineer or a recent enthusiast, this guide should provide you with the tools you need to successfully put the platform to work in a production setting: from securing access to our API to designing a robust architecture that can handle high traffic volumes. Use this guide to help develop a plan for deploying your application as smoothly and effectively as possible.

## Setting up your Organization

### API Keys

The AvalAI API uses API keys for authentication. Visit your API keys page to retrieve the API key you'll use in your requests.

This is a relatively straightforward way to control access, but you must be vigilant about securing these keys:

- **Secure your API keys**: Never expose your API keys in client-side code or public repositories.
- **Use environment variables**: Store your API keys in environment variables rather than hardcoding them.
- **Create separate API keys**: Use different API keys for development, testing, and production environments.
- **Rotate API keys regularly**: Periodically regenerate your API keys for enhanced security.

### Managing Usage Limits

To monitor your usage, you can set a notification threshold in your account to receive an email alert once you pass a certain usage threshold. You can also set a monthly budget. Please be mindful of the potential for a monthly budget to cause disruptions to your application/users. Use the usage tracking dashboard to monitor your token usage during the current and past billing cycles.

## Model Version Management

When transitioning to production, proper model version management is crucial for stability and long-term maintenance.

### Use Stable Model Namespaces

> **Best Practice:** Always use stable model namespaces when they become available. When a preview model is first introduced (e.g., `gemini-2.5-flash-image-preview`), it may later be released as a stable version (e.g., `gemini-2.5-flash-image`). In such cases, migrate to the non-preview, stable version as soon as possible to ensure continued support and optimal performance.

**Why this matters:**
- Preview models may be deprecated with limited notice
- Stable models receive better support and longer availability windows
- Production systems need predictable model behavior

**Implementation tips:**
- Subscribe to [deprecation notices](en/deprecations.md) to stay informed about model lifecycle changes
- Implement model name configuration as environment variables for easy updates
- Create a migration plan before preview model deprecation deadlines

```python
import os

# Good: Use environment variable for easy model updates
MODEL_NAME = os.getenv("AI_MODEL", "gemini-2.5-flash-image")  # Use stable version

# Avoid hardcoding preview models in production
# BAD: model = "gemini-2.5-flash-image-preview"  # Preview models get deprecated
```

## Rate Limits

Understanding and properly handling rate limits is essential for production applications. For comprehensive information, see the [Rate Limits Guide](en/rate-limits.md).

### Key Rate Limit Strategies

- **Implement exponential backoff**: When you hit rate limits, use exponential backoff to retry requests.
- **Monitor your usage**: Regularly check your API usage to avoid unexpected rate limit issues.
- **Batch requests when possible**: For operations like embeddings, batch multiple inputs in a single request.
- **Use response headers**: Monitor rate limit headers to proactively manage your request rate.

### Using Response Headers for Rate Limit Management

Every API response includes headers that provide valuable information about your rate limit status. Use these headers to implement proactive rate limiting in your application. For detailed documentation, see [Response Headers](en/api-reference/response-headers.md).

```python
import requests


def make_api_request_with_rate_limit_monitoring(prompt):
    response = requests.post(
        "https://api.avalai.ir/v1/chat/completions",
        headers={"Authorization": f"Bearer {api_key}"},
        json={"model": "gpt-5.5", "messages": [{"role": "user", "content": prompt}]},
    )

    # Monitor rate limits proactively
    remaining_requests = int(response.headers.get("x-ratelimit-remaining-requests", 0))
    remaining_tokens = int(response.headers.get("x-ratelimit-remaining-tokens", 0))
    reset_time = response.headers.get("x-ratelimit-reset-requests", "")

    # Implement proactive backoff when approaching limits
    if remaining_requests < 100:
        print(
            f"⚠️ Low on requests: {remaining_requests} remaining, resets in {reset_time}"
        )
        time.sleep(1)  # Brief pause to avoid hitting limits

    return response
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
    input="Write a one-sentence summary of AvalAI.",
)

print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


### Tier-Based Rate Limits

Your rate limits depend on your account tier (0-5). Higher tiers have higher limits, and upgrades happen automatically as soon as you qualify:

| Tier | Qualification |
|------|---------------|
| Basic (Tier 0) | Sign up with an email address; includes a 25,000 IRT activation credit |
| Tier 1 | Verify a phone number on your account; no top-up required |
| Tier 2 | $10 total topped up |
| Tier 3 | $50 total topped up |
| Tier 4 | $250 total topped up |
| Tier 5 | $1,000 total topped up |

For detailed rate limits per model, see the [Rate Limits documentation](en/rate-limits.md).

## Scaling your Solution Architecture

When designing your application or service for production that uses our API, it's important to consider how you will scale to meet traffic demands. There are a few key areas you will need to consider regardless of the cloud service provider of your choice:

### Horizontal Scaling

You may want to scale your application out horizontally to accommodate requests to your application that come from multiple sources. This could involve deploying additional servers or containers to distribute the load. If you opt for this type of scaling, make sure that your architecture is designed to handle multiple nodes and that you have mechanisms in place to balance the load between them.

### Vertical Scaling

Another option is to scale your application up vertically, meaning you can beef up the resources available to a single node. This would involve upgrading your server's capabilities to handle the additional load. If you opt for this type of scaling, make sure your application is designed to take advantage of these additional resources.

### Caching

By storing frequently accessed data, you can improve response times without needing to make repeated calls to our API. Your application will need to be designed to use cached data whenever possible and invalidate the cache when new information is added. There are a few different ways you could do this. For example, you could store data in a database, filesystem, or in-memory cache, depending on what makes the most sense for your application.

### Load Balancing

Consider load-balancing techniques to ensure requests are distributed evenly across your available servers. This could involve using a load balancer in front of your servers or using DNS round-robin. Balancing the load will help improve performance and reduce bottlenecks.

## Improving Latencies

Latency is the time it takes for a request to be processed and a response to be returned. In this section, we will discuss some factors that influence the latency of text generation models and provide suggestions on how to reduce it.

The latency of a completion request is mostly influenced by two factors: the model and the number of tokens generated. The life cycle of a completion request looks like this:

1. **Network**: End user to API latency
2. **Server**: Time to process prompt tokens
3. **Server**: Time to sample/generate tokens
4. **Network**: API to end user latency

The bulk of the latency typically arises from the token generation step.

> **Intuition**: Prompt tokens add very little latency to completion calls. Time to generate completion tokens is much longer, as tokens are generated one at a time. Longer generation lengths will accumulate latency due to generation required for each token.

### Common Factors Affecting Latency

#### Model Selection

Our API offers different models with varying levels of complexity and generality. The most capable models can generate more complex and diverse completions, but they also take longer to process your query. Smaller models can generate faster and cheaper Chat Completions, but they may generate results that are less accurate or relevant for your query. You can choose the model that best suits your use case and the trade-off between speed, cost, and quality.

#### Number of Completion Tokens

Requesting a large amount of generated tokens completions can lead to increased latencies:

- **Lower max tokens**: For requests with a similar token generation count, those that have a lower `max_tokens` parameter incur less latency.
- **Include stop sequences**: To prevent generating unneeded tokens, add a stop sequence.
- **Generate fewer completions**: Lower the values of `n` and `best_of` when possible.

#### Streaming

Setting `stream: true` in a request makes the model start returning tokens as soon as they are available, instead of waiting for the full sequence of tokens to be generated. It does not change the time to get all the tokens, but it reduces the time for first token for an application where we want to show partial progress or are going to stop generations. This can be a better user experience and a UX improvement so it's worth experimenting with streaming.

### Streaming Responses

For better user experience, use streaming responses:

```language-selector
python=:from openai import OpenAI
import sys

client = OpenAI(
    api_key="your-avalai-api-key",  # Replace with your actual API key
    base_url="https://api.avalai.ir/v1",  # AvalAI API endpoint
)

response = client.chat.completions.create(
    model="gpt-5.5",
    messages=[{"role": "user", "content": "Write a story about a space explorer"}],
    stream=True,
)

for chunk in response:
    if chunk.choices[0].delta.content:
        sys.stdout.write(chunk.choices[0].delta.content)
        sys.stdout.flush()

javascript=:const { OpenAI } = require("openai");

const client = new OpenAI({
  apiKey: "AVALAI_API_KEY",
  baseURL: "https://api.avalai.ir/v1",
});

async function streamResponse() {
  const stream = await client.chat.completions.create({
    model: "gpt-5.5",
    messages: [
      { role: "user", content: "Write a story about a space explorer" },
    ],
    stream: true,
  });

  for await (const chunk of stream) {
    if (chunk.choices[0]?.delta?.content) {
      process.stdout.write(chunk.choices[0].delta.content);
    }
  }
}

streamResponse();

go=:package main

import (
	"context"
	"fmt"
	"os"

	"github.com/openai/openai-go"
)

func main() {
	client := openai.NewClient(
		"AVALAI_API_KEY",
		openai.WithBaseURL("https://api.avalai.ir/v1"),
	)

	req := openai.ChatCompletionRequest{
		Model: "gpt-5.5",
		Messages: []openai.ChatCompletionMessage{
			{
				Role:    "user",
				Content: "Write a story about a space explorer",
			},
		},
		Stream: true,
	}

	stream, err := client.CreateChatCompletionStream(context.Background(), req)
	if err != nil {
		fmt.Printf("Stream error: %v\n", err)
		os.Exit(1)
	}
	defer stream.Close()

	for {
		response, err := stream.Recv()
		if err != nil {
			break
		}
		if len(response.Choices) > 0 && response.Choices[0].Delta.Content != "" {
			fmt.Print(response.Choices[0].Delta.Content)
		}
	}
}

php=:<?php
require 'vendor/autoload.php';

$client = OpenAI::client('AVALAI_API_KEY', [
    'base_url' => 'https://api.avalai.ir/v1',
]);

$stream = $client->chat()->createStreamed([
    'model' => 'gpt-5.5',
    'messages' => [
        ['role' => 'user', 'content' => 'Write a story about a space explorer'],
    ],
]);

foreach ($stream as $response) {
    if ($response->choices[0]->delta->content) {
        echo $response->choices[0]->delta->content;
        ob_flush();
        flush();
    }
}
?>

```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version</summary>

Use this version when the selected model supports `/v1/responses`. `messages` moves to `input`, and the final text is read from `response.output_text`.

```language-selector
python=:import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["AVALAI_API_KEY"],
    base_url="https://api.avalai.ir/v1",
)

response = client.responses.create(
    model="gpt-5.5",
    instructions="You are a helpful assistant.",
    input="Write a story about a space explorer",
)

print(response.output_text)

javascript=:import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.responses.create({
  model: "gpt-5.5",
  instructions: "You are a helpful assistant.",
  input: "Write a story about a space explorer",
});

console.log(response.output_text);

bash=:curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '
  {
    "model": "gpt-5.5",
    "input": "Write a story about a space explorer",
    "instructions": "You are a helpful assistant."
  }'

```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


### Asynchronous Processing

For long-running tasks, implement asynchronous processing:

```language-selector
python=:import asyncio
from openai import AsyncOpenAI

client = AsyncOpenAI(api_key="AVALAI_API_KEY", base_url="https://api.avalai.ir/v1")


async def generate_response(prompt):
    response = await client.chat.completions.create(
        model="gpt-5.5", messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content


async def process_batch(prompts):
    tasks = [generate_response(prompt) for prompt in prompts]
    return await asyncio.gather(*tasks)


# Usage
results = asyncio.run(process_batch(["Hello", "How are you?", "What's the weather?"]))

javascript=:const { OpenAI } = require("openai");

const client = new OpenAI({
  apiKey: "AVALAI_API_KEY",
  baseURL: "https://api.avalai.ir/v1",
});

async function generateResponse(prompt) {
  const response = await client.chat.completions.create({
    model: "gpt-5.5",
    messages: [{ role: "user", content: prompt }],
  });
  return response.choices[0].message.content;
}

async function processBatch(prompts) {
  const promises = prompts.map((prompt) => generateResponse(prompt));
  return await Promise.all(promises);
}

// Usage
processBatch(["Hello", "How are you?", "What's the weather?"])
  .then((results) => console.log(results))
  .catch((error) => console.error(error));

go=:package main

import (
	"context"
	"fmt"
	"sync"

	"github.com/openai/openai-go"
)

func generateResponse(client *openai.Client, prompt string, wg *sync.WaitGroup, results map[int]string, index int) {
	defer wg.Done()

	resp, err := client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model: "gpt-5.5",
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    "user",
					Content: prompt,
				},
			},
		},
	)

	if err != nil {
		fmt.Printf("Error: %v\n", err)
		return
	}

	results[index] = resp.Choices[0].Message.Content
}

func main() {
	client := openai.NewClient(
		"AVALAI_API_KEY",
		openai.WithBaseURL("https://api.avalai.ir/v1"),
	)

	prompts := []string{"Hello", "How are you?", "What's the weather?"}
	results := make(map[int]string)

	var wg sync.WaitGroup
	for i, prompt := range prompts {
		wg.Add(1)
		go generateResponse(client, prompt, &wg, results, i)
	}

	wg.Wait()

	for i := 0; i < len(prompts); i++ {
		fmt.Printf("Result %d: %s\n", i, results[i])
	}
}

php=:<?php
require 'vendor/autoload.php';

$client = OpenAI::client('AVALAI_API_KEY', [
    'base_url' => 'https://api.avalai.ir/v1',
]);

function generateResponse($client, $prompt) {
    $response = $client->chat()->create([
        'model' => 'gpt-5.5',
        'messages' => [
            ['role' => 'user', 'content' => $prompt],
        ],
    ]);
    
    return $response->choices[0]->message->content;
}

$prompts = ["Hello", "How are you?", "What's the weather?"];
$results = [];

// Using parallel requests with promises
$promises = [];
foreach ($prompts as $index => $prompt) {
    $promises[$index] = new Promise(function($resolve, $reject) use ($client, $prompt) {
        try {
            $result = generateResponse($client, $prompt);
            $resolve($result);
        } catch (Exception $e) {
            $reject($e);
        }
    });
}

$results = Promise\all($promises)->wait();
print_r($results);
?>

```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version</summary>

Use this version when the selected model supports `/v1/responses`. `messages` moves to `input`, and the final text is read from `response.output_text`.

```language-selector
python=:import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["AVALAI_API_KEY"],
    base_url="https://api.avalai.ir/v1",
)

response = client.responses.create(
    model="gpt-5.5",
    instructions="You are a helpful assistant.",
    input="What's the weather like in Boston?",
)

print(response.output_text)

javascript=:import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.responses.create({
  model: "gpt-5.5",
  instructions: "You are a helpful assistant.",
  input: "What's the weather like in Boston?",
});

console.log(response.output_text);

bash=:curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '
  {
    "model": "gpt-5.5",
    "input": "What's the weather like in Boston?",
    "instructions": "You are a helpful assistant."
  }'

```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


## Cost Optimization

To monitor your costs, you can set a notification threshold in your account to receive an email alert once you pass a certain usage threshold. You can also set a monthly budget. Please be mindful of the potential for a monthly budget to cause disruptions to your application/users. Use the usage tracking dashboard to monitor your token usage during the current and past billing cycles.

### Using the User API for Cost Tracking

For production workloads, the [User API](en/api-reference/user.md) provides programmatic access to track your usage and costs:

- **Transaction Lookup**: Use the `/user/v1/transactions/lookup` endpoint with the `x-request-id` from response headers to get exact cost details for each API call
- **Balance Monitoring**: Query your current balance programmatically to implement budget alerts
- **Usage Analytics**: Track usage patterns over time to optimize costs and plan capacity

```python
import requests
import time

# Step 1: Make API call and capture x-request-id
response = requests.post(
    "https://api.avalai.ir/v1/chat/completions",
    headers={"Authorization": f"Bearer {api_key}"},
    json={"model": "gpt-5.5", "messages": [{"role": "user", "content": "Hello!"}]},
)
request_id = response.headers.get("x-request-id")

# Step 2: Wait for processing (usually available within seconds)
time.sleep(5)

# Step 3: Get exact cost using User API
cost_response = requests.post(
    "https://api.avalai.ir/user/v1/transactions/lookup",
    headers={"Authorization": f"Bearer {api_key}"},
    json={"transaction_ids": [request_id]},
)
cost_data = cost_response.json()
print(f"Request cost: {cost_data}")
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
    input="Hello!",
)

print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


For resellers and enterprise users, see the [Reseller Cost Tracking Guide](en/resellers/cost-tracking-guide.md) for advanced usage patterns.

### Token Usage

One of the challenges of moving your prototype into production is budgeting for the costs associated with running your application. AvalAI offers a pay-as-you-go pricing model, with prices per 1,000 tokens (roughly equal to 750 words). To estimate your costs, you will need to project the token utilization. Consider factors such as traffic levels, the frequency with which users will interact with your application, and the amount of data you will be processing.

**One useful framework for thinking about reducing costs is to consider costs as a function of the number of tokens and the cost per token.** There are two potential avenues for reducing costs using this framework:

- **Reduce the cost per token**: Switch to smaller models for some tasks in order to reduce costs.
- **Reduce the number of tokens required**: Use shorter prompts, fine-tune models, or cache common user queries so that they don't need to be processed repeatedly.

You can experiment with our interactive tokenizer tool to help you estimate costs. The API and playground also returns token counts as part of the response. Once you've got things working with our most capable model, you can see if the other models can produce the same results with lower latency and costs.

- **Monitor token usage**: Keep track of your token usage to avoid unexpected costs.
- **Optimize prompt length**: Keep prompts concise while providing necessary context.
- **Use smaller models when possible**: For simpler tasks, smaller models can be more cost-effective.
- **Batch requests**: When processing multiple inputs, batch them in a single request.

## MLOps Strategy

As you move your prototype into production, you may want to consider developing an MLOps strategy. MLOps (machine learning operations) refers to the process of managing the end-to-end life cycle of your machine learning models, including any models you may be fine-tuning using our API. There are a number of areas to consider when designing your MLOps strategy:

### Data and Model Management

Managing the data used to train or fine-tune your model and tracking versions and changes. This includes:

- Versioning your datasets
- Tracking data transformations
- Maintaining data quality checks
- Documenting data sources and preprocessing steps

### Model Monitoring

Tracking your model's performance over time and detecting any potential issues or degradation:

- Set up monitoring for model accuracy and performance
- Create alerts for performance degradation
- Track model usage patterns
- Monitor for concept drift or data drift

### Service Status Monitoring

Monitor AvalAI service availability and subscribe to status updates:

- **Status Page**: Visit [status.avalai.ir](https://status.avalai.ir) to check current service status
- **Subscribe to Updates**: Subscribe to the status page to receive notifications about planned maintenance, incidents, and service updates
- **Integrate Status Checks**: Consider implementing health checks in your application that verify API availability before critical operations

### Model Retraining

Ensuring your model stays up to date with changes in data or evolving requirements:

- Establish criteria for when to retrain models
- Automate the retraining process when possible
- Validate retrained models before deployment
- Maintain a history of model versions

### Model Deployment

Automating the process of deploying your model and related artifacts into production:

- Implement CI/CD pipelines for model deployment
- Create rollback procedures for failed deployments
- Test models in staging environments before production
- Document deployment configurations

Thinking through these aspects of your application will help ensure your model stays relevant and performs well over time.

## Security and Compliance

As you move your prototype into production, you will need to assess and address any security and compliance requirements that may apply to your application. This will involve examining the data you are handling, understanding how our API processes data, and determining what regulations you must adhere to.

### Content Filtering

- **Implement content filtering**: Use moderation endpoints to filter inappropriate content.
- **Set appropriate usage policies**: Define clear usage policies for your application.

### User Data Privacy

- **Minimize data sharing**: Only share necessary user data with the API.
- **Inform users**: Be transparent about how user data is used with AI models.
- **Implement data retention policies**: Define clear policies for how long user data is stored.

### Error Handling

- **Handle errors gracefully**: Implement proper error handling for different HTTP status codes.
- **Log API errors**: Keep logs of API errors for debugging and monitoring purposes.
- **Provide user-friendly error messages**: Translate API errors into meaningful messages for end-users.

Some common areas you'll need to consider include data storage, data transmission, and data retention. You might also need to implement data privacy protections, such as encryption or anonymization where possible. In addition, you should follow best practices for secure coding, such as input sanitization and proper error handling.

## Business Considerations

As projects using AI move from prototype to production, it is important to consider how to build a great product with AI and how that ties back to your core business. Here are some key business considerations:

- **Define clear success metrics**: Establish KPIs to measure the impact of your AI implementation
- **Align with business goals**: Ensure your AI project directly supports your overall business strategy
- **Consider user adoption**: Plan for user education and change management
- **Build feedback loops**: Create mechanisms to gather user feedback and improve your application
- **Plan for scaling**: Consider how your business model will scale with increased usage

## Related Resources

- [API Authentication](en/api-reference/authentication.md)
- [User API](en/api-reference/user.md)
- [Rate Limits](en/rate-limits.md)
- [Response Headers](en/api-reference/response-headers.md)
- [Deprecations](en/deprecations.md)
- [Error Handling](en/guides/error-handling.md)
- [Streaming Responses](en/guides/streaming-responses.md)
- [Fine-tuning](en/guides/fine-tuning.md)
- [Service Status](https://status.avalai.ir)