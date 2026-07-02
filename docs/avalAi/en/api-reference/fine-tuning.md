# Fine-tuning API

!> Feature Not Implemented! 
This functionality is currently under development and not yet available in AvalAI. We’ll announce its release through our official channels. Stay tuned for updates! 


The Fine-tuning API allows you to customize models for your specific use case by training on your data.

## Endpoint

```
POST https://api.avalai.ir/v1/fine-tuning/jobs
```

## Request Body

| Parameter         | Type   | Required | Description                                                                           |
| ----------------- | ------ | -------- | ------------------------------------------------------------------------------------- |
| `model`           | string | Yes      | ID of the model to fine-tune. See [Models](en/models/model-details.md) for available options. |
| `training_file`   | string | Yes      | The ID of an uploaded file that contains training data.                               |
| `validation_file` | string | No       | The ID of an uploaded file that contains validation data.                             |
| `hyperparameters` | object | No       | The hyperparameters used for the fine-tuning job.                                     |
| `suffix`          | string | No       | A string of up to 40 characters that will be added to your fine-tuned model name.     |

### Hyperparameters Object

| Parameter                  | Type              | Required | Description                                                                                                                     |
| -------------------------- | ----------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `n_epochs`                 | integer or string | No       | The number of epochs to train the model for. An epoch refers to one full cycle through the training dataset. Default is "auto". |
| `batch_size`               | integer or string | No       | Number of examples in each batch. Default is "auto".                                                                            |
| `learning_rate_multiplier` | number or string  | No       | Scaling factor for the learning rate. Default is "auto".                                                                        |

## Examples

### Creating a Fine-tuning Job

```language-selector
bash=:curl https://api.avalai.ir/v1/fine-tuning/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
  "model": "gpt-3.5-turbo",
  "training_file": "file-abc123",
  "validation_file": "file-def456",
  "hyperparameters": {
    "n_epochs": 4
  }
}'

python=:from openai import OpenAI

client = OpenAI(
    api_key="your-avalai-api-key",  # Replace with your actual API key
    base_url="https://api.avalai.ir/v1",  # AvalAI API endpoint
)

response = client.fine_tuning.jobs.create(
    model="gpt-3.5-turbo",
    training_file="file-abc123",
    validation_file="file-def456",
    hyperparameters={"n_epochs": 4},
)

print(response)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.fineTuning.jobs.create({
  model: "gpt-3.5-turbo",
  training_file: "file-abc123",
  validation_file: "file-def456",
  hyperparameters: {
    n_epochs: 4,
  },
});

console.log(response);

go=:// Go Example: Creating a Fine-tuning Job via AvalAI
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

	req := openai.FineTuningJobRequest{
		Model:          "gpt-3.5-turbo",
		TrainingFile:   "file-abc123",
		ValidationFile: "file-def456", // Optional
		Hyperparameters: &openai.Hyperparameters{
			NEpochs: 4, // Optional, example value
		},
		// Suffix: "my-custom-model", // Optional
	}

	resp, err := client.CreateFineTuningJob(context.Background(), req)
	if err != nil {
		fmt.Printf("FineTuningJob creation error: %v\n", err)
		return
	}

	fmt.Printf("Fine-tuning job created: %+v\n", resp)
}

php=:<?php
// PHP Example: Creating a Fine-tuning Job via AvalAI

$apiKey = getenv('AVALAI_API_KEY'); // Or replace with your key directly
$apiUrl = 'https://api.avalai.ir/v1/fine-tuning/jobs'; // Use AvalAI base URL

$data = [
'model' => 'gpt-3.5-turbo',
'training_file' => 'file-abc123',
'validation_file' => 'file-def456', // Optional
'hyperparameters' => [ // Optional
'n_epochs' => 4
]
// 'suffix' => 'my-custom-model' // Optional
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
  echo "Fine-tuning job creation response:\n";
  echo $response;
  // $responseData = json_decode($response, true);
  // print_r($responseData);
}
?>

```

## Response Format

```json
{
  "id": "ftjob-abc123",
  "object": "fine_tuning.job",
  "model": "gpt-3.5-turbo",
  "created_at": 1677858242,
  "finished_at": null,
  "fine_tuned_model": null,
  "organization_id": "org-123",
  "status": "running",
  "hyperparameters": {
    "n_epochs": 4
  },
  "training_file": "file-abc123",
  "validation_file": "file-def456",
  "result_files": [],
  "trained_tokens": null
}
```

## Response Parameters

| Parameter          | Type            | Description                                                                                                                      |
| ------------------ | --------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `id`               | string          | The identifier for the fine-tuning job.                                                                                          |
| `object`           | string          | The object type, which is always "fine_tuning.job".                                                                              |
| `model`            | string          | The base model that is being fine-tuned.                                                                                         |
| `created_at`       | integer         | The Unix timestamp (in seconds) of when the fine-tuning job was created.                                                         |
| `finished_at`      | integer or null | The Unix timestamp (in seconds) of when the fine-tuning job was finished.                                                        |
| `fine_tuned_model` | string or null  | The name of the fine-tuned model, if the job has completed successfully.                                                         |
| `organization_id`  | string          | The organization that owns the fine-tuning job.                                                                                  |
| `status`           | string          | The status of the fine-tuning job. Can be "validating", "preparing", "queued", "running", "succeeded", "failed", or "cancelled". |
| `hyperparameters`  | object          | The hyperparameters used for the fine-tuning job.                                                                                |
| `training_file`    | string          | The ID of the file used for training.                                                                                            |
| `validation_file`  | string or null  | The ID of the file used for validation.                                                                                          |
| `result_files`     | array           | Array of file IDs generated during the fine-tuning job.                                                                          |
| `trained_tokens`   | integer or null | The number of tokens trained on during the fine-tuning job.                                                                      |

## List Fine-tuning Jobs

```
GET https://api.avalai.ir/v1/fine-tuning/jobs
```

### Query Parameters

| Parameter | Type    | Required | Description                                                       |
| --------- | ------- | -------- | ----------------------------------------------------------------- |
| `limit`   | integer | No       | Number of fine-tuning jobs to retrieve. Default is 20.            |
| `after`   | string  | No       | Identifier for the last job from the previous pagination request. |

## Retrieve Fine-tuning Job

```
GET https://api.avalai.ir/v1/fine-tuning/jobs/{fine_tuning_job_id}
```

## Cancel Fine-tuning Job

```
POST https://api.avalai.ir/v1/fine-tuning/jobs/{fine_tuning_job_id}/cancel
```

## List Fine-tuning Events

```
GET https://api.avalai.ir/v1/fine-tuning/jobs/{fine_tuning_job_id}/events
```

### Query Parameters

| Parameter | Type    | Required | Description                                                         |
| --------- | ------- | -------- | ------------------------------------------------------------------- |
| `limit`   | integer | No       | Number of events to retrieve. Default is 20.                        |
| `after`   | string  | No       | Identifier for the last event from the previous pagination request. |

## Error Handling

The API may return various error codes:

| Status Code | Description                                                    |
| ----------- | -------------------------------------------------------------- |
| 400         | Bad Request - Your request is invalid.                         |
| 401         | Unauthorized - Your API key is wrong.                          |
| 403         | Forbidden - You don't have permission to access this resource. |
| 404         | Not Found - The specified resource could not be found.         |
| 429         | Too Many Requests - You have exceeded your rate limit.         |
| 500         | Internal Server Error - We had a problem with our server.      |

For more information on handling errors, see the [Error Handling](en/guides/error-handling.md) guide.

## Related Resources

- [Models](en/models/model-details.md) - Learn about available models
- [Authentication](en/api-reference/authentication.md) - Learn about authentication methods
- [Rate Limits](en/guides/rate-limits.md) - Learn about API rate limits
