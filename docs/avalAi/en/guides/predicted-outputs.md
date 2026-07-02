# Predicted Outputs

Reduce latency for model responses where much of the response is known ahead of time.

Some underlying model providers, like OpenAI, offer a feature often called **Predicted Outputs**. This feature allows you to speed up API responses from Chat Completions when you anticipate a significant portion of the output tokens. This is particularly useful when regenerating text or code files with minor modifications, as you can provide your prediction of the final output.

When using AvalAI with compatible models (e.g., `gpt-5.5`, `gpt-5.4-mini` via OpenAI), you can leverage this feature by providing your prediction using the `prediction` request parameter in the [Chat Completions API call](en/api-reference/chat.md).

_Note: Availability and specific behavior depend on the underlying model provider and the specific model used. Rejected prediction tokens might still incur costs._

## Code Refactoring Example

Predicted Outputs are highly effective for regenerating text documents or code files with small changes. Imagine you want a compatible model (like `gpt-5.4`) to refactor a TypeScript class, changing the `username` property to `email`:

```javascript
class User {
  firstName: string = "";
  lastName: string = "";
  username: string = "";
}

export default User;
```

Most of this file will remain unchanged. By providing the current code as the `prediction`, you can potentially regenerate the entire file with lower latency, especially beneficial for larger files.

Below are examples showing how to use the `prediction` parameter when making an AvalAI Chat Completions request. We predict that the final output will be very similar to the original code.

```language-selector
bash=:export AVALAI_API_KEY="YOUR_AVALAI_API_KEY"
# Note: Escape JSON strings properly within the shell command
export CODE_CONTENT_HERE=$(
  cat <<'EOF'
class User {

firstName:string = "";

lastName:string = "";

username:string = "";
}

export default User;
EOF
)

curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
"model": "gpt-5.5",
"messages": [
{
"role": "user",
"content": "Replace the username property with an email property. Respond only with code, and with no markdown formatting."
},
{
"role": "user",
"content": "'"${CODE_CONTENT_HERE}"'"
}
],
"prediction": {
"type": "content",
"content": "'"${CODE_CONTENT_HERE}"'"
}
}'

python=:from openai import OpenAI # Use the OpenAI library pointed to AvalAI endpoint

# Configure the client to use AvalAI endpoint and API key
client = OpenAI(
base_url="https://api.avalai.ir/v1",
api_key="YOUR_AVALAI_API_KEY",
)

code = """
class User {

firstName:string = "";

lastName:string = "";

username:string = "";
}

export default User;
"""

refactor_prompt = """
Replace the "username" property with an "email" property. Respond only
with code, and with no markdown formatting.
"""

try:
	completion = client.chat.completions.create(
        model="gpt-5.5",  # Ensure this model supports predicted outputs via the provider
        messages=[
            {"role": "user", "content": refactor_prompt},
            {"role": "user", "content": code},
        ],
        prediction={"type": "content", "content": code},
    )

    print(completion)
    if completion.choices:
        print(completion.choices[0].message.content)

except Exception as e:
    print(f"An API error occurred: {e}")

javascript=:import OpenAI from "openai"; // Use the OpenAI library pointed to AvalAI endpoint

// Configure the client to use AvalAI endpoint and API key
const openai = new OpenAI({
  baseURL: "https://api.avalai.ir/v1",

  apiKey: "YOUR_AVALAI_API_KEY",
});

const code = `
class User {

firstName:string = "";

lastName:string = "";

username:string = "";
}

export default User;
`.trim();

const refactorPrompt = `
Replace the "username" property with an "email" property. Respond only
with code, and with no markdown formatting.
`;

async function main() {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-5.5", // Ensure this model supports predicted outputs via the provider

      messages: [
        {
          role: "user",

          content: refactorPrompt,
        },
        {
          role: "user",

          content: code,
        },
      ],
      // store: true, // Note: 'store' might be OpenAI specific, check AvalAI compatibility if needed

      prediction: {
        type: "content",

        content: code,
      },
    });

    // Inspect returned data
    console.log(JSON.stringify(completion, null, 2));
    if (completion.choices && completion.choices.length > 0) {
      console.log(completion.choices[0].message.content);
    }
  } catch (error) {
    console.error("An API error occurred:", error);
  }
}

main();

go=:package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
)

type Prediction struct {
	Type    string `json:"type"`
	Content string `json:"content"`
}

type Message struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type RequestPayload struct {
	Model      string      `json:"model"`
	Messages   []Message   `json:"messages"`
	Prediction *Prediction `json:"prediction,omitempty"`
}

func main() {
	apiKey := os.Getenv("AVALAI_API_KEY")
	if apiKey == "" {
		fmt.Println("Error: AVALAI_API_KEY environment variable not set.")
		return
	}

	code := `
class User {

firstName:string = "";

lastName:string = "";

username:string = "";
}

export default User;
`

	refactorPrompt := `
Replace the "username" property with an "email" property. Respond only
with code, and with no markdown formatting.
`

	payload := RequestPayload{
		Model: "gpt-5.5", // Ensure this model supports predicted outputs via the provider
		Messages: []Message{
			{Role: "user", Content: refactorPrompt},
			{Role: "user", Content: code},
		},
		Prediction: &Prediction{
			Type:    "content",
			Content: code,
		},
	}

	payloadBytes, err := json.Marshal(payload)
	if err != nil {
		fmt.Printf("Error marshalling payload: %v\n", err)
		return
	}

	req, err := http.NewRequest("POST", "https://api.avalai.ir/v1/chat/completions", bytes.NewBuffer(payloadBytes))
	if err != nil {
		fmt.Printf("Error creating request: %v\n", err)
		return
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+apiKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Printf("Error making request: %v\n", err)
		return
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Printf("Error reading response body: %v\n", err)
		return
	}

	if resp.StatusCode != http.StatusOK {
		fmt.Printf("API request failed with status %d: %s\n", resp.StatusCode, string(body))
		return
	}

	fmt.Println("API Response:")
	// Pretty print JSON response
	var prettyJSON bytes.Buffer
	if err := json.Indent(&prettyJSON, body, "", " "); err != nil {
		fmt.Printf("Error formatting JSON: %v\n", err)
		fmt.Println(string(body)) // Print raw body if formatting fails
	} else {
		fmt.Println(prettyJSON.String())
	}

	// You would typically unmarshal the JSON body into a Go struct
	// to access specific fields like completion.choices[0].message.content
}

php=:<?php

$apiKey = getenv('AVALAI_API_KEY');
if (!$apiKey) {
die("Error: AVALAI_API_KEY environment variable not set.\n");
}

$code = <<<CODE
class User {

firstName:string = "";

lastName:string = "";

username:string = "";
}

export default User;
CODE;

$refactorPrompt = <<<PROMPT
Replace the "username" property with an "email" property. Respond only
with code, and with no markdown formatting.
PROMPT;

$payload = [
'model' => 'gpt-5.5', // Ensure this model supports predicted outputs via the provider
'messages' => [
['role' => 'user', 'content' => $refactorPrompt],
['role' => 'user', 'content' => $code]
],
'prediction' => [
'type' => 'content',
'content' => $code
]
];

$ch = curl_init('https://api.avalai.ir/v1/chat/completions');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
'Content-Type: application/json',
'Authorization: Bearer ' . $apiKey
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

if ($error) {
echo "cURL Error: " . $error . "\n";
} elseif ($httpCode >= 400) {
echo "API Error (HTTP {$httpCode}):\n";
echo $response . "\n";
} else {
echo "API Response:\n";
$decodedResponse = json_decode($response, true);
echo json_encode($decodedResponse, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n";

// Accessing the content
if (isset($decodedResponse['choices'][0]['message']['content'])) {
echo "\nRefactored Code:\n";
echo $decodedResponse['choices'][0]['message']['content'] . "\n";
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
    input="Replace the username property with an email property. Respond only with code, and with no markdown formatting.",
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
  input: "Replace the username property with an email property. Respond only with code, and with no markdown formatting.",
});

console.log(response.output_text);

bash=:curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '
  {
    "model": "gpt-5.5",
    "input": "Replace the username property with an email property. Respond only with code, and with no markdown formatting.",
    "instructions": "You are a helpful assistant."
  }'

```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


In addition to the refactored code, the API response might contain usage data similar to this (format depends on the provider, this is OpenAI's example):

```json
{
  "id": "chatcmpl-xxx",
  "object": "chat.completion",
  "created": 1730918466,
  "model": "gpt-5.4-2026-03-05", // Specific model version

  "choices": [
    /* ...actual text response here... */
  ],
  "usage": {
    "prompt_tokens": 81,
    "completion_tokens": 39,
    "total_tokens": 120,
    "prompt_tokens_details": { "cached_tokens": 0, "audio_tokens": 0 }, // Example details

    "completion_tokens_details": {
      "reasoning_tokens": 0,
      "audio_tokens": 0,
      "accepted_prediction_tokens": 18, // Tokens from prediction used

      "rejected_prediction_tokens": 10 // Tokens from prediction discarded

    }
  },
  "system_fingerprint": "fp_..." // Provider-specific fingerprint

}
```

Note the `accepted_prediction_tokens` and `rejected_prediction_tokens` in the `usage` object (if provided by the API). In this example, 18 tokens from the prediction were accepted (speeding up the response), while 10 were rejected (because the model generated something different for that part).

**Important:** Any rejected tokens are typically still billed like other completion tokens. Using Predicted Outputs incorrectly (i.e., when the prediction is very different from the actual output) could potentially increase costs.

## Streaming Example

The latency benefits of Predicted Outputs can be even more noticeable when using [streaming responses](en/guides/streaming-responses.md). Here's the same refactoring example using streaming:

```language-selector
python=:from openai import OpenAI # Use the OpenAI library pointed to AvalAI endpoint

# Configure the client to use AvalAI endpoint and API key
client = OpenAI(
base_url="https://api.avalai.ir/v1",
api_key="YOUR_AVALAI_API_KEY",
)

code = """
class User {

firstName:string = "";

lastName:string = "";

username:string = "";
}

export default User;
"""

refactor_prompt = """
Replace the "username" property with an "email" property. Respond only
with code, and with no markdown formatting.
"""

try:
	stream = client.chat.completions.create(
        model="gpt-5.5",  # Ensure this model supports predicted outputs via the provider
        messages=[
            {"role": "user", "content": refactor_prompt},
            {"role": "user", "content": code},
        ],
        prediction={"type": "content", "content": code},
        stream=True,
    )

    print("Streaming response:")
    for chunk in stream:
        if chunk.choices and chunk.choices[0].delta and chunk.choices[0].delta.content:
            print(chunk.choices[0].delta.content, end="")
    print("\n--- End of stream ---")

except Exception as e:
    print(f"An API error occurred: {e}")

javascript=:import OpenAI from "openai"; // Use the OpenAI library pointed to AvalAI endpoint

// Configure the client to use AvalAI endpoint and API key
const openai = new OpenAI({
  baseURL: "https://api.avalai.ir/v1",

  apiKey: "YOUR_AVALAI_API_KEY",
});

const code = `
class User {

firstName:string = "";

lastName:string = "";

username:string = "";
}

export default User;
`.trim();

const refactorPrompt = `
Replace the "username" property with an "email" property. Respond only
with code, and with no markdown formatting.
`;

async function main() {
  try {
    const stream = await openai.chat.completions.create({
      model: "gpt-5.5", // Ensure this model supports predicted outputs via the provider

      messages: [
        {
          role: "user",

          content: refactorPrompt,
        },
        {
          role: "user",

          content: code,
        },
      ],
      // store: true, // Note: 'store' might be OpenAI specific

      prediction: {
        type: "content",

        content: code,
      },

      stream: true,
    });

    console.log("Streaming response:");
    for await (const chunk of stream) {
      process.stdout.write(chunk.choices[0]?.delta?.content || "");
    }
    console.log("\n--- End of stream ---");
  } catch (error) {
    console.error("An API error occurred:", error);
  }
}

main();

go=:package main

import (
	"bufio"
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"strings"
)

// Re-use structs from non-streaming example: Prediction, Message, RequestPayload
type Prediction struct {
	Type    string `json:"type"`
	Content string `json:"content"`
}
type Message struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}
type RequestPayload struct {
	Model      string      `json:"model"`
	Messages   []Message   `json:"messages"`
	Prediction *Prediction `json:"prediction,omitempty"`
	Stream     bool        `json:"stream"` // Add stream flag
}

// Struct to decode stream chunks (simplified example)
type StreamChoiceDelta struct {
	Content string `json:"content"`
}
type StreamChoice struct {
	Delta StreamChoiceDelta `json:"delta"`
	Index int               `json:"index"`
	// Add other fields like finish_reason if needed
}
type StreamChunk struct {
	ID      string         `json:"id"`
	Object  string         `json:"object"`
	Created int64          `json:"created"`
	Model   string         `json:"model"`
	Choices []StreamChoice `json:"choices"`
}

func main() {
	apiKey := os.Getenv("AVALAI_API_KEY")
	if apiKey == "" {
		fmt.Println("Error: AVALAI_API_KEY environment variable not set.")
		return
	}

	code := `
class User {

firstName:string = "";

lastName:string = "";

username:string = "";
}

export default User;
`
	refactorPrompt := `
Replace the "username" property with an "email" property. Respond only
with code, and with no markdown formatting.
`

	payload := RequestPayload{
		Model: "gpt-5.5",
		Messages: []Message{
			{Role: "user", Content: refactorPrompt},
			{Role: "user", Content: code},
		},
		Prediction: &Prediction{
			Type:    "content",
			Content: code,
		},
		Stream: true, // Enable streaming
	}

	payloadBytes, _ := json.Marshal(payload)
	req, _ := http.NewRequest("POST", "https://api.avalai.ir/v1/chat/completions", bytes.NewBuffer(payloadBytes))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+apiKey)
	req.Header.Set("Accept", "text/event-stream") // Important for SSE

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Printf("Error making request: %v\n", err)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		// Read body for error details even on non-200 status for streaming
		bodyBytes, _ := ioutil.ReadAll(resp.Body)
		fmt.Printf("API request failed with status %d: %s\n", resp.StatusCode, string(bodyBytes))
		return
	}

	fmt.Println("Streaming response:")
	scanner := bufio.NewScanner(resp.Body)
	for scanner.Scan() {
		line := scanner.Text()
		if strings.HasPrefix(line, "data:") {
			data := strings.TrimPrefix(line, "data: ")
			if data == "[DONE]" {
				break
			}

			var chunk StreamChunk
			err := json.Unmarshal([]byte(data), &chunk)
			if err != nil {
				// Handle potential JSON errors in stream, maybe log or skip
				// fmt.Printf("Error unmarshalling stream chunk: %v\nData: %s\n", err, data)
				continue
			}

			if len(chunk.Choices) > 0 && chunk.Choices[0].Delta.Content != "" {
				fmt.Print(chunk.Choices[0].Delta.Content)
			}
		}
	}
	fmt.Println("\n--- End of stream ---")

	if err := scanner.Err(); err != nil {
		fmt.Printf("Error reading stream: %v\n", err)
	}
}

php=:<?php

$apiKey = getenv('AVALAI_API_KEY');
if (!$apiKey) {
die("Error: AVALAI_API_KEY environment variable not set.\n");
}

$code = <<<CODE
class User {

firstName:string = "";

lastName:string = "";

username:string = "";
}

export default User;
CODE;

$refactorPrompt = <<<PROMPT
Replace the "username" property with an "email" property. Respond only
with code, and with no markdown formatting.
PROMPT;

$payload = [
'model' => 'gpt-5.5',
'messages' => [
['role' => 'user', 'content' => $refactorPrompt],
['role' => 'user', 'content' => $code]
],
'prediction' => [
'type' => 'content',
'content' => $code
],
'stream' => true // Enable streaming
];

$ch = curl_init('https://api.avalai.ir/v1/chat/completions');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
'Content-Type: application/json',
'Authorization: Bearer ' . $apiKey,
'Accept: text/event-stream' // Important for SSE
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, false); // Don't buffer output
curl_setopt($ch, CURLOPT_WRITEFUNCTION, function($curl, $data) {
// Process each chunk received
$lines = explode("\n", trim($data));
foreach ($lines as $line) {
if (strpos($line, 'data: ') === 0) {
$jsonData = substr($line, 6);
if ($jsonData === '[DONE]') {
// echo "\n--- End of stream ---"; // Signal stream end
return strlen($data); // Indicate bytes handled
}
$chunk = json_decode($jsonData, true);
if (isset($chunk['choices'][0]['delta']['content'])) {
echo $chunk['choices'][0]['delta']['content'];
}
}
}
// Flush output buffer if running via web server
if (php_sapi_name() !== 'cli') {
ob_flush();
flush();
}
return strlen($data); // Indicate bytes handled
});

echo "Streaming response:\n";
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

echo "\n--- End of stream ---"; // Signal stream end after curl_exec finishes

if ($error) {
echo "\ncURL Error: " . $error . "\n";
} elseif ($httpCode >= 400) {
// Error message might have been consumed by WRITEFUNCTION,
// but we can still report the status code.
echo "\nAPI Error (HTTP {$httpCode})\n";
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
    input="Write a one-sentence summary of AvalAI.",
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
  input: "Write a one-sentence summary of AvalAI.",
});

console.log(response.output_text);

bash=:curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '
  {
    "model": "gpt-5.5",
    "input": "Write a one-sentence summary of AvalAI.",
    "instructions": "You are a helpful assistant."
  }'

```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


## Position of Predicted Text in Response

The predicted text doesn't have to be at the very beginning or end of the model's actual response. It can appear anywhere within the generated output and still potentially provide latency reduction for the matching parts.

For example, if you predict the content of a simple web server file and ask the model to add a new route in the middle, the parts of your prediction _before_ and _after_ the inserted route can still be accepted, reducing latency. The `usage` details (like `accepted_prediction_tokens`) in the response would reflect this. If the entire prediction is found within the final response, `rejected_prediction_tokens` might be 0.

## Limitations

When considering Predicted Outputs, be aware of the following limitations (based on typical provider implementations like OpenAI's):

- **Model Support:** Only specific models might support this feature (e.g., `gpt-5.4` series from OpenAI). Check the [Model Details](en/models/model-details.md) or provider documentation.
- **Cost of Rejection:** Tokens provided in the `prediction` that are _not_ used in the final completion (rejected tokens) are usually still charged at completion token rates. Monitor the `rejected_prediction_tokens` in the `usage` object, if available.
- **Unsupported Parameters:** Using `prediction` may restrict other API parameters. Common restrictions include:
  - `n`: Only `n: 1` is typically supported.
  - `logprobs`: Often not supported.
  - `presence_penalty` / `frequency_penalty`: Values other than 0 might not be supported.
  - `audio` / `modalities`: Often limited to text-only input/output.
  - `max_completion_tokens`: May not be supported.
  - `tools` / Function Calling: Often incompatible with predictions.

Always refer to the specific documentation for the model and provider you are using via AvalAI for the most accurate limitations.

## Related Resources

- [Chat Completions API Reference](en/api-reference/chat.md)
- [Streaming Responses Guide](en/guides/streaming-responses.md)
- [Latency Optimization Guide](en/guides/latency-optimization.md)
- [Model Details](en/models/model-details.md)
