# Assistants API

!> Feature Not Implemented!
This functionality is currently under development and not yet available in AvalAI. We’ll announce its release through our official channels. Stay tuned for updates!

The Assistants API allows you to build AI assistants within your applications. An Assistant has instructions and can leverage models, tools, and knowledge to respond to user queries.

## Endpoint

```
POST https://api.avalai.ir/v1/assistants
```

## Create an Assistant

### Request Body

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `model` | string | Yes | ID of the model to use. See [Models](en/models/model-details.md) for available options. |
| `name` | string | No | The name of the assistant. The maximum length is 256 characters. |
| `description` | string | No | The description of the assistant. The maximum length is 512 characters. |
| `instructions` | string | No | The system instructions that the assistant uses. The maximum length is 32768 characters. |
| `tools` | array | No | A list of tools enabled on the assistant. There can be a maximum of 128 tools per assistant. |
| `tool_resources` | object | No | A set of resources that the assistant has access to when using tools. |
| `metadata` | object | No | Set of 16 key-value pairs that can be attached to an object. |

### Tools Object

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `type` | string | Yes | The type of tool. Can be "code_interpreter", "retrieval", or "function". |
| `function` | object | Conditional | Required when type is "function". |

## Examples

### Creating an Assistant

```language-selector
bash=:curl https://api.avalai.ir/v1/assistants \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2" \
  -d '{
  "model": "gpt-5.5",
  "name": "Math Tutor",
  "instructions": "You are a personal math tutor. Write and run code to answer math questions.",
  "tools": [{"type": "code_interpreter"}]
}'

python=:from openai import OpenAI

client = OpenAI(
    api_key="your-avalai-api-key",  # Replace with your actual API key
    base_url="https://api.avalai.ir/v1",  # AvalAI API endpoint
)

assistant = client.beta.assistants.create(
    name="Math Tutor",
    instructions="You are a personal math tutor. Write and run code to answer math questions.",
    tools=[{"type": "code_interpreter"}],
    model="gpt-5.5",
)

print(assistant.id)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const assistant = await client.beta.assistants.create({
  name: "Math Tutor",
  instructions:
    "You are a personal math tutor. Write and run code to answer math questions.",
  tools: [{ type: "code_interpreter" }],
  model: "gpt-5.5",
});

console.log(assistant.id);

go=:// Go Example: Creating an Assistant via AvalAI
package main

import (
	"context"
	"fmt"
	"os"

	openai "github.com/openai/openai-go"
)

func main() {
	apiKey := os.Getenv("AVALAI_API_KEY") // Or replace with your key
	if apiKey == "" {
		fmt.Println("Error: AVALAI_API_KEY environment variable not set.")
		return
	}
	baseURL := "https://api.avalai.ir/v1" // Use AvalAI base URL

	config := openai.DefaultConfig(apiKey)
	config.BaseURL = baseURL
	client := openai.NewClientWithConfig(config)

	req := openai.AssistantRequest{
		Model:        "gpt-5.5",
		Name:         openai.NewString("Math Tutor"),
		Instructions: openai.NewString("You are a personal math tutor. Write and run code to answer math questions."),
		Tools: []openai.AssistantTool{
			{Type: openai.AssistantToolTypeCodeInterpreter},
		},
		// Description: openai.NewString("Optional description"),
		// Metadata: map[string]interface{}{"user_id": "123"}, // Optional
	}

	resp, err := client.CreateAssistant(context.Background(), req)
	if err != nil {
		fmt.Printf("Assistant creation error: %v\n", err)
		return
	}

	fmt.Printf("Assistant created with ID: %s\n", resp.ID)
}

php=:<?php
// PHP Example: Creating an Assistant via AvalAI

$apiKey = getenv('AVALAI_API_KEY'); // Or replace with your key directly
$apiUrl = 'https://api.avalai.ir/v1/assistants'; // Use AvalAI base URL

$data = [
'model' => 'gpt-5.5',
'name' => 'Math Tutor',
'instructions' => 'You are a personal math tutor. Write and run code to answer math questions.',
'tools' => [['type' => 'code_interpreter']],
// 'description' => 'Optional description', // Optional
// 'metadata' => ['user_id' => '123'] // Optional
];

$jsonData = json_encode($data);

$ch = curl_init($apiUrl);

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonData);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
'Content-Type: application/json',
'Authorization: Bearer ' . $apiKey,
'OpenAI-Beta: assistants=v2', // Required header for Assistants API v2
'Content-Length: ' . strlen($jsonData)
]);

$response = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$err = curl_error($ch);

curl_close($ch);

if ($err) {
  echo "cURL Error #:" . $err;
} elseif ($httpcode >= 400) {
  echo "HTTP Error: " . $httpcode . "\n";
  echo "Response: " . $response;
} else {
  echo "Assistant creation response:\n";
  echo $response;
  // $responseData = json_decode($response, true);
  // if (isset($responseData['id'])) {
    // echo "Assistant created with ID: " . $responseData['id'] . "\n";
    // } else {
      // print_r($responseData);
      // }
    }
    ?>

```

## Response Format

```json
{
  "id": "asst_abc123",
  "object": "assistant",
  "created_at": 1698984975,
  "name": "Math Tutor",
  "description": null,
  "model": "gpt-5.5",
  "instructions": "You are a personal math tutor. Write and run code to answer math questions.",
  "tools": [
    {
      "type": "code_interpreter"
    }
  ],
  "file_ids": [],
  "metadata": {}
}
```

## Response Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | The identifier for the assistant. |
| `object` | string | The object type, which is always "assistant". |
| `created_at` | integer | The Unix timestamp (in seconds) of when the assistant was created. |
| `name` | string or null | The name of the assistant. |
| `description` | string or null | The description of the assistant. |
| `model` | string | The model that the assistant uses. |
| `instructions` | string | The system instructions that the assistant uses. |
| `tools` | array | A list of tools enabled on the assistant. |
| `file_ids` | array | A list of file IDs attached to this assistant. |
| `metadata` | object | Set of key-value pairs attached to the assistant. |

## Threads

Threads represent conversations between users and assistants.

### Create a Thread

```
POST https://api.avalai.ir/v1/threads
```

#### Request Body

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `messages` | array | No | A list of messages to start the thread with. |
| `metadata` | object | No | Set of key-value pairs that can be attached to the thread. |

### Add a Message to a Thread

```
POST https://api.avalai.ir/v1/threads/{thread_id}/messages
```

#### Request Body

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `role` | string | Yes | The role of the entity that is creating the message. Currently only "user" is supported. |
| `content` | string | Yes | The content of the message. |
| `file_ids` | array | No | A list of File IDs that the message should use. |
| `metadata` | object | No | Set of key-value pairs that can be attached to the message. |

### Run an Assistant on a Thread

```
POST https://api.avalai.ir/v1/threads/{thread_id}/runs
```

#### Request Body

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `assistant_id` | string | Yes | The ID of the assistant to use for this run. |
| `instructions` | string | No | Override the assistant's instructions for this run. |
| `tools` | array | No | Override the assistant's tools for this run. |
| `metadata` | object | No | Set of key-value pairs that can be attached to the run. |

## Error Handling

The API may return various error codes:

| Status Code | Description |
|-------------|-------------|
| 400 | Bad Request - Your request is invalid. |
| 401 | Unauthorized - Your API key is wrong. |
| 403 | Forbidden - You don't have permission to access this resource. |
| 404 | Not Found - The specified resource could not be found. |
| 429 | Too Many Requests - You have exceeded your rate limit. |
| 500 | Internal Server Error - We had a problem with our server. |

For more information on handling errors, see the [Error Handling](en/guides/error-handling.md) guide.

## Related Resources

- [Models](en/models/model-details.md) - Learn about available models
- [Authentication](en/api-reference/authentication.md) - Learn about authentication methods
- [Rate Limits](en/guides/rate-limits.md) - Learn about API rate limits
