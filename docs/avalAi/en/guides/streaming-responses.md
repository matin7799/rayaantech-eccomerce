# Streaming API Responses

Learn how to stream model responses from the AvalAI API using server-sent events.

## Introduction

By default, when you make a request to the AvalAI API, the model generates its entire output before sending it back in a single HTTP response. When generating long outputs, waiting for the complete response can take time. Streaming responses lets you start receiving and processing the beginning of the model's output while it continues generating the full response. This is particularly useful for creating more interactive and responsive applications.

## Enable Streaming

To start streaming responses, set `stream=True` (or the equivalent in your language's SDK) in your request to the relevant AvalAI API endpoint, such as the [Chat Completions API](en/api-reference/chat.md) or the [Responses API](en/api-reference/responses.md).

Here's an example using the Responses API:

```language-selector
bash=:curl https://api.avalai.ir/v1/responses \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -d '{
 "model": "gpt-5.5",
 "input": [
 {"role": "user", "content": "Say '\''double bubble bath'\'' ten times fast."}
 ],
 "stream": true
 }' --no-buffer # Use --no-buffer or similar flag to process stream immediately

python=:from openai import OpenAI  # Use the standard OpenAI Python library
import os

# Configure the client to use AvalAI endpoint and API key
client = OpenAI(
    api_key=os.environ.get("AVALAI_API_KEY"),  # Use your AvalAI API key
    base_url="https://api.avalai.ir/v1",  # Point to the AvalAI endpoint
)

try:
    stream = client.responses.create(
        model="gpt-5.5",  # Or another suitable model available via AvalAI
        input=[
            {
                "role": "user",
                "content": "Say 'double bubble bath' ten times fast.",
            },
        ],
        stream=True,
    )

    print("Streaming response:")
    for event in stream:
        # Process each event as it arrives
        print(event.model_dump_json(indent=2))  # Pretty print the event data

except Exception as e:
    print(f"An API error occurred: {e}")

javascript=:import OpenAI from "openai"; // Use the standard OpenAI Node.js library

// Configure the client to use AvalAI endpoint and API key
const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY, // Use your AvalAI API key
  baseURL: "https://api.avalai.ir/v1", // Point to the AvalAI endpoint
});

async function streamResponse() {
  try {
    const stream = await client.responses.create({
      model: "gpt-5.5", // Or another suitable model available via AvalAI
      input: [
        {
          role: "user",
          content: "Say 'double bubble bath' ten times fast.",
        },
      ],
      stream: true,
    });

    console.log("Streaming response:");
    for await (const event of stream) {
      // Process each event as it arrives
      console.log(JSON.stringify(event, null, 2)); // Pretty print the event data
    }
  } catch (error) {
    console.error("An API error occurred:", error);
  }
}

streamResponse();

go=:package main

import (
	"context"
	"errors"
	"fmt"
	"io"
	"os"

	openai "github.com/openai/openai-go" // Use openai-go library
)

func main() {
	apiKey := os.Getenv("AVALAI_API_KEY") // Use your AvalAI API key
	baseURL := "https://api.avalai.ir/v1" // Point to the AvalAI endpoint

	config := openai.DefaultConfig(apiKey)
	config.BaseURL = baseURL
	client := openai.NewClientWithConfig(config)

	req := openai.ResponseCreateRequest{
		Model: "gpt-5.5", // Or another suitable model available via AvalAI
		Input: []openai.ResponseInputItem{
			{Role: openai.ChatMessageRoleUser, Content: "Say 'double bubble bath' ten times fast."},
		},
		Stream: true,
	}

	ctx := context.Background()
	stream, err := client.CreateResponseStream(ctx, req)
	if err != nil {
		fmt.Printf("Response stream creation error: %v\n", err)
		return
	}
	defer stream.Close()

	fmt.Println("Streaming response:")
	for {
		event, err := stream.Recv()
		if errors.Is(err, io.EOF) {
			fmt.Println("\nStream finished.")
			break
		}
		if err != nil {
			fmt.Printf("\nStream error: %v\n", err)
			break
		}
		// Process each event (event object structure depends on openai-go version)
		// For simplicity, just printing the event type here
		fmt.Printf("Received event type: %T\n", event)
		// You would typically check event.Type or use type assertions/switches
		// to handle different event kinds like ResponseStreamTextDelta, etc.
	}
}

php=:<?php
require 'vendor/autoload.php'; // Ensure you have the OpenAI PHP client installed

$apiKey = getenv('AVALAI_API_KEY'); // Or replace with your actual key: 'aa-YOUR_API_KEY'

if (!$apiKey) {
    die("AvalAI API key not found. Please set the AVALAI_API_KEY environment variable.");
}

// Your custom base URL
$customBaseUrl = 'https://api.avalai.ir/v1';

// Create a custom client instance using the factory
$client = OpenAI::factory()
    ->withApiKey($apiKey)
    ->withBaseUri($customBaseUrl)
    ->make();

try {
    $stream = $client->responses()->createStreamed([
        'model' => 'gpt-5.5', // Or another suitable model available via AvalAI
        'input' => [
            ['role' => 'user', 'content' => "Say 'double bubble bath' ten times fast."],
        ],
        // 'stream' => true, // Often implied by createStreamed method
    ]);

    echo "Streaming response:\n";
    foreach ($stream as $event) {
        // Process each event as it arrives
        // The structure of $event depends on the specific PHP client library
        // Example: Accessing data if it's an object with a toArray method or public properties
        if (method_exists($event, 'toArray')) {
             print_r($event->toArray());
        } else {
             var_dump($event);
        }
        echo "\n---\n";
    }

} catch (Exception $e) {
    echo "An API error occurred: " . $e->getMessage() . "\n";
}

```

## Read the Responses

The AvalAI API uses semantic server-sent events (SSE) for streaming. Each event is typed with a predefined schema, allowing you to listen for and handle specific event types relevant to your application.

You can identify individual events using the `type` property of the event object (or the class type if using an SDK like the Python or Node.js libraries).

Some key lifecycle events are emitted only once per stream, while others (like content deltas) are emitted multiple times as the response is generated. Common events to listen for when streaming text generation include:

* `response.created`: Emitted once when the response generation starts.
* `response.output_text.delta`: Emitted multiple times, providing chunks of the generated text.
* `response.completed`: Emitted once when the response generation finishes successfully.
* `error`: Emitted if an error occurs during streaming.

For a full list of event types and their schemas, particularly when dealing with more complex scenarios like tool calls, refer to the [Responses API Reference (Streaming section)](en/api-reference/responses.md#streaming).

Here's a conceptual example of processing text deltas in Python:

```python
# (Continuing from the 'Enable Streaming' Python example)

# ... client setup and stream initiation ...

try:
    stream = client.responses.create(
        model="gpt-5.5",
        input=[{"role": "user", "content": "Tell me a short story."}],
        stream=True,
    )

    full_text = ""
    print("Streaming story:")
    for event in stream:
        if event.type == "response.output_text.delta":
            text_delta = event.data.text
            print(text_delta, end="", flush=True)  # Print delta immediately
            full_text += text_delta
        elif event.type == "response.completed":
            print("\n--- Stream finished ---")
        # You can access completion reasons, usage stats, etc. from the final event
        # print(event.data)
        elif event.type == "error":
            print(f"\n--- An error occurred: {event.data} ---")
            break  # Stop processing on error

    # The 'full_text' variable now holds the complete generated text
    # print("\n\nComplete Story:\n", full_text)

except Exception as e:
    print(f"\nAn API error occurred: {e}")
```

## Advanced Use Cases

Streaming is also essential for more advanced interactions involving structured data or tool usage:

* **Streaming Tool Calls:** When using [Function Calling](en/guides/function-calling.md), you can stream the model's decision to call a function and the arguments it intends to use. This allows your application to react faster. Events like `response.function_call.arguments.delta` are used.
* **Streaming Structured Outputs:** If using [Structured Outputs](en/guides/structured-outputs.md) with `response_format`, streaming allows you to receive parts of the structured JSON response as they are generated.

Refer to the respective guides for detailed examples of streaming in these scenarios.

## Moderation Risk

Note that streaming the model's output directly to end-users in a production application makes content moderation more challenging, as partial completions may be harder to evaluate against safety guidelines or policies. Consider implementing buffering or other mechanisms if real-time moderation of the streamed content is required. See the [Safety Guidelines](en/safety/content-policy.md) for more information.

## Related Resources

* [Responses API Reference](en/api-reference/responses.md)
* [Chat Completions API Reference](en/api-reference/chat.md)
* [Function Calling Guide](en/guides/function-calling.md)
* [Structured Outputs Guide](en/guides/structured-outputs.md)
* [Error Handling Guide](en/guides/error-handling.md)
* [Authentication Guide](en/api-reference/authentication.md)