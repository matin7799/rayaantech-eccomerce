# Batch API

!> Feature Not Implemented! 
This functionality is currently under development and not yet available in AvalAI. We’ll announce its release through our official channels. Stay tuned for updates! 


Create large batches of API requests for asynchronous processing. The Batch API returns completions within 24 hours for a 50% discount compared to synchronous requests.

Related guide: [Batch Processing Guide](en/guides/batch-processing.md) (Note: Guide link needs to be created)

## Create batch

```
POST https://api.avalai.ir/v1/batches
```

Creates and executes a batch from an uploaded file of requests.

### Request Body

| Parameter           | Type   | Required | Description                                                                                                                                                                                                                                                                                                                        |
| ------------------- | ------ | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `input_file_id`     | string | Yes      | The ID of an uploaded file that contains requests for the new batch. Your input file must be formatted as a [JSONL file](#request-input-object), and must be uploaded with the purpose `batch`. The file can contain up to 50,000 requests, and can be up to 200 MB in size. See [upload file](files.md) for how to upload a file. |
| `endpoint`          | string | Yes      | The endpoint to be used for all requests in the batch. Currently `v1/chat/completions`, `v1/embeddings`, and `v1/completions` (legacy) are supported. Note that `v1/embeddings` batches are also restricted to a maximum of 50,000 embedding inputs across all requests in the batch.                                          |
| `completion_window` | string | Yes      | The time frame within which the batch should be processed. Currently only `24h` is supported.                                                                                                                                                                                                                                      |
| `metadata`          | map    | No       | Set of 16 key-value pairs that can be attached to an object. This can be useful for storing additional information about the object in a structured format. Keys are strings with a maximum length of 64 characters. Values are strings with a maximum length of 512 characters.                                                   |

### Example Request

```language-selector
bash=:curl https://api.avalai.ir/v1/batches \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "input_file_id": "file-abc123",
  "endpoint": "/v1/chat/completions",
  "completion_window": "24h",
  "metadata": {
    "customer_id": "user_123456789",
    "batch_description": "Nightly eval job"
  }
}'

python=:from openai import OpenAI

client = OpenAI(
    api_key="your-avalai-api-key",  # Replace with your actual API key
    base_url="https://api.avalai.ir/v1",  # AvalAI API endpoint
)

batch = client.batches.create(
    input_file_id="file-abc123",
    endpoint="/v1/chat/completions",
    completion_window="24h",
    metadata={"customer_id": "user_123456789", "batch_description": "Nightly eval job"},
)
print(batch)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY, // Use AVALAI_API_KEY environment variable
  baseURL: "https://api.avalai.ir/v1",
});

async function main() {
  const batch = await client.batches.create({
    input_file_id: "file-abc123",
    endpoint: "/v1/chat/completions",
    completion_window: "24h",
    metadata: {
      customer_id: "user_123456789",
      batch_description: "Nightly eval job",
    },
  });
  console.log(batch);
}
main();

go=:// Go Example: Creating a Batch Job via AvalAI
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

	req := openai.BatchRequest{
		InputFileID:      "file-abc123",
		Endpoint:         openai.BatchEndpointChatCompletions, // Or BatchEndpointEmbeddings, BatchEndpointCompletions
		CompletionWindow: openai.BatchCompletionWindow24h,
		Metadata: map[string]string{
			"customer_id":       "user_123456789",
			"batch_description": "Nightly eval job",
		},
	}

	resp, err := client.CreateBatch(context.Background(), req)
	if err != nil {
		fmt.Printf("Batch creation error: %v\n", err)
		return
	}

	fmt.Printf("Batch created: %+v\n", resp)
}

php=:<?php
// PHP Example: Creating a Batch Job via AvalAI

$apiKey = getenv('AVALAI_API_KEY'); // Or replace with your key directly
$apiUrl = 'https://api.avalai.ir/v1/batches'; // Use AvalAI base URL

$data = [
'input_file_id' => 'file-abc123',
'endpoint' => '/v1/chat/completions', // Or /v1/embeddings, /v1/completions
'completion_window' => '24h',
'metadata' => [
'customer_id' => 'user_123456789',
'batch_description' => 'Nightly eval job'
]
];

$jsonData = json_encode($data);

$ch = curl_init($apiUrl);

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonData);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
'Content-Type: application/json',
'Authorization: Bearer ' . $apiKey,
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
  echo "Batch creation response:\n";
  echo $response;
  // $responseData = json_decode($response, true);
  // print_r($responseData);
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
    input=[
        {
            "role": "user",
            "content": [
                {"type": "input_text", "text": "Summarize the uploaded file."},
                {"type": "input_file", "file_id": "file_abc123"},
            ],
        }
    ],
)

print(response.output_text)

javascript=:import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.responses.create({
  model: "gpt-5.5",
  input: [
    {
      role: "user",
      content: [
        { type: "input_text", text: "Summarize the uploaded file." },
        { type: "input_file", file_id: "file_abc123" },
      ],
    },
  ],
});

console.log(response.output_text);

bash=:curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '
  {
    "model": "gpt-5.5",
    "input": [
      {
        "role": "user",
        "content": [
          {
            "type": "input_text",
            "text": "Summarize the uploaded file."
          },
          {
            "type": "input_file",
            "file_id": "file_abc123"
          }
        ]
      }
    ]
  }'

```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


### Returns

The created [Batch](#the-batch-object) object.

## Retrieve batch

```
GET https://api.avalai.ir/v1/batches/{batch_id}
```

Retrieves a batch.

### Path Parameters

| Parameter  | Type   | Required | Description                      |
| ---------- | ------ | -------- | -------------------------------- |
| `batch_id` | string | Yes      | The ID of the batch to retrieve. |

### Example Request

```bash
curl https://api.avalai.ir/v1/batches/batch_abc123 \
  -H "Authorization: Bearer $AVALAI_API_KEY"
```

### Returns

The [Batch](#the-batch-object) object matching the specified ID.

## Cancel batch

```
POST https://api.avalai.ir/v1/batches/{batch_id}/cancel
```

Cancels an in-progress batch. The batch will be in status `cancelling` for up to 10 minutes, before changing to `cancelled`, where it will have partial results (if any) available in the output file.

### Path Parameters

| Parameter  | Type   | Required | Description                    |
| ---------- | ------ | -------- | ------------------------------ |
| `batch_id` | string | Yes      | The ID of the batch to cancel. |

### Example Request

```bash
curl https://api.avalai.ir/v1/batches/batch_abc123/cancel \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -X POST
```

### Returns

The cancelled [Batch](#the-batch-object) object.

## List batches

```
GET https://api.avalai.ir/v1/batches
```

List your organization's batches.

### Query Parameters

| Parameter | Type    | Required | Description                                                                                                |
| --------- | ------- | -------- | ---------------------------------------------------------------------------------------------------------- |
| `after`   | string  | No       | A cursor for use in pagination. `after` is an object ID that defines your place in the list.               |
| `limit`   | integer | No       | A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 20. |

### Example Request

```bash
curl "https://api.avalai.ir/v1/batches?limit=2" \
  -H "Authorization: Bearer $AVALAI_API_KEY"
```

### Returns

A list of paginated [Batch](#the-batch-object) objects.

## The batch object

| Parameter           | Type            | Description                                                                                                                       |
| ------------------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `id`                | string          | The identifier, which can be referenced in API endpoints.                                                                         |
| `object`            | string          | The object type, which is always `batch`.                                                                                         |
| `endpoint`          | string          | The AvalAI API endpoint used by the batch.                                                                                        |
| `errors`            | object or null  | Contains details about errors if any occurred during batch processing.                                                            |
| `input_file_id`     | string          | The ID of the input file for the batch.                                                                                           |
| `completion_window` | string          | The time frame within which the batch should be processed.                                                                        |
| `status`            | string          | The current status of the batch (e.g., `validating`, `in_progress`, `completed`, `failed`, `cancelling`, `cancelled`, `expired`). |
| `output_file_id`    | string or null  | The ID of the file containing the outputs of successfully executed requests.                                                      |
| `error_file_id`     | string or null  | The ID of the file containing the outputs of requests with errors.                                                                |
| `created_at`        | integer         | The Unix timestamp (in seconds) for when the batch was created.                                                                   |
| `in_progress_at`    | integer or null | The Unix timestamp (in seconds) for when the batch started processing.                                                            |
| `expires_at`        | integer or null | The Unix timestamp (in seconds) for when the batch will expire.                                                                   |
| `finalizing_at`     | integer or null | The Unix timestamp (in seconds) for when the batch started finalizing.                                                            |
| `completed_at`      | integer or null | The Unix timestamp (in seconds) for when the batch was completed.                                                                 |
| `failed_at`         | integer or null | The Unix timestamp (in seconds) for when the batch failed.                                                                        |
| `expired_at`        | integer or null | The Unix timestamp (in seconds) for when the batch expired.                                                                       |
| `cancelling_at`     | integer or null | The Unix timestamp (in seconds) for when the batch started cancelling.                                                            |
| `cancelled_at`      | integer or null | The Unix timestamp (in seconds) for when the batch was cancelled.                                                                 |
| `request_counts`    | object          | The request counts for different statuses within the batch (`total`, `completed`, `failed`).                                      |
| `metadata`          | map             | Set of key-value pairs attached to the object.                                                                                    |

### Example Batch Object

```json
{
  "id": "batch_abc123",
  "object": "batch",
  "endpoint": "/v1/chat/completions",
  "errors": null,
  "input_file_id": "file-abc123",
  "completion_window": "24h",
  "status": "completed",
  "output_file_id": "file-cvaTdG",
  "error_file_id": "file-HOWS94",
  "created_at": 1711471533,
  "in_progress_at": 1711471538,
  "expires_at": 1711557933,
  "finalizing_at": 1711493133,
  "completed_at": 1711493163,
  "failed_at": null,
  "expired_at": null,
  "cancelling_at": null,
  "cancelled_at": null,
  "request_counts": {
    "total": 100,
    "completed": 95,
    "failed": 5
  },
  "metadata": {
    "customer_id": "user_123456789",
    "batch_description": "Nightly eval job"
  }
}
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version</summary>

Use this version when the selected model supports `/v1/responses`. `messages` moves to `input`, and the final text is read from `response.output_text`.

```json
{
  "model": "gpt-5.5",
  "input": "Summarize the uploaded file.",
  "instructions": "You are a helpful assistant."
}
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


## Request input object

The structure of each line in the JSONL input file.

| Parameter   | Type   | Required | Description                                                                                                                   |
| ----------- | ------ | -------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `custom_id` | string | Yes      | A developer-provided per-request ID that will be used to match outputs to inputs. Must be unique for each request in a batch. |
| `method`    | string | Yes      | The HTTP method to be used for the request. Currently only `POST` is supported.                                               |
| `url`       | string | Yes      | The AvalAI API relative URL to be used for the request (e.g., `v1/chat/completions`).                                        |
| `body`      | object | Yes      | The request body for the API call (e.g., parameters for chat completions).                                                    |

### Example Input Line

```json
{
  "custom_id": "request-1",
  "method": "POST",
  "url": "/v1/chat/completions",
  "body": {
    "model": "gpt-5.4-mini",
    "messages": [
      {
        "role": "system",
        "content": "You are a helpful assistant."
      },
      {
        "role": "user",
        "content": "What is 2+2?"
      }
    ]
  }
}
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version</summary>

Use this version when the selected model supports `/v1/responses`. `messages` moves to `input`, and the final text is read from `response.output_text`.

```json
{
  "model": "gpt-5.4-mini",
  "input": "What is 2+2?",
  "instructions": "You are a helpful assistant."
}
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


## Request output object

The structure of each line in the JSONL output file(s).

| Parameter   | Type           | Description                                                                                                |
| ----------- | -------------- | ---------------------------------------------------------------------------------------------------------- |
| `id`        | string         | The ID of the batch request.                                                                               |
| `custom_id` | string         | The developer-provided ID from the input file.                                                             |
| `response`  | object or null | The response object from the API call if successful. Includes `status_code`, `request_id`, and the `body`. |
| `error`     | object or null | Details about the error if the request failed.                                                             |

### Example Output Line (Success)

```json
{
  "id": "batch_req_wnaDys",
  "custom_id": "request-2",
  "response": {
    "status_code": 200,
    "request_id": "req_c187b3",
    "body": {
      "id": "chatcmpl-9758Iw",
      "object": "chat.completion",
      "created": 1711475054,
      "model": "gpt-5.4-mini",
      "choices": [
        {
          "index": 0,
          "message": {
            "role": "assistant",
            "content": "2 + 2 equals 4."
          },
          "finish_reason": "stop"
        }
      ],
      "usage": {
        "prompt_tokens": 24,
        "completion_tokens": 15,
        "total_tokens": 39
      },
      "system_fingerprint": null
    }
  },
  "error": null
}
```

### Example Output Line (Error)

```json
{
  "id": "batch_req_abcxyz",
  "custom_id": "request-3",
  "response": null,
  "error": {
    "code": "invalid_request_error",
    "message": "Invalid model ID provided."
  }
}
```
