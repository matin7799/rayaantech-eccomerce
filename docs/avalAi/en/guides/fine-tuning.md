# Fine-tuning Models via AvalAI

!> Feature Not Implemented! 
This functionality is currently under development and not yet available in AvalAI. We’ll announce its release through our official channels. Stay tuned for updates! 


Fine-tuning allows you to adapt models available through the AvalAI API for your specific tasks, potentially achieving:

*   Higher quality results than prompting alone.
*   Training on more examples than fit in a prompt.
*   Token savings due to shorter inference prompts.
*   Lower latency requests (by using a fine-tuned smaller model).

Models accessed via AvalAI are typically pre-trained on vast datasets. While prompt engineering and few-shot learning are effective, fine-tuning trains the model on many specific examples, tailoring its behavior. Once fine-tuned, you often need simpler prompts at inference time.

**Fine-tuning Lifecycle:**

1.  Prepare and upload training data.
2.  Initiate a fine-tuning job via the AvalAI API.
3.  Evaluate results (e.g., using [Evals Guide](en/guides/evals.md)) and iterate on data if needed.
4.  Use your fine-tuned model for inference.

Refer to AvalAI's [Pricing page](en/pricing.md) for billing details on fine-tuning training and model usage.

## Which Models Can Be Fine-tuned via AvalAI?

Fine-tuning availability depends on the underlying models accessible through AvalAI. Currently supported base models often include:

*   `gpt-5.4-mini` snapshots (e.g., `gpt-5.4-mini-2026-03-17`)
*   Potentially others (Check AvalAI's [Models Overview](en/models/model-details.md) for the latest list of fine-tunable base models).

You can sometimes fine-tune an already fine-tuned model if you have more data. `gpt-5.4-mini` is often a good starting point for balancing performance and cost.

## When to Use Fine-tuning

Fine-tuning requires careful investment. **First, try optimizing results using:**

*   **Prompt Engineering:** Refine instructions and examples. See [Prompt Engineering Guide](en/guides/prompt-engineering.md).
*   **Prompt Chaining:** Break complex tasks into sequential prompts.
*   **Function Calling:** Enable the model to use external tools/data. See [Function Calling Guide](en/guides/function-calling.md).

**Consider fine-tuning when:**

*   You need to consistently set a specific style, tone, or format.
*   You need reliable outputs for complex instructions.
*   You need to handle many specific edge cases correctly.
*   The desired skill is hard to articulate solely through prompting ("show, not tell").
*   You want to potentially reduce cost/latency by using a tuned smaller model (e.g., fine-tuned `gpt-5.4-mini`) to match the quality of a larger one (e.g., `gpt-5.4`).

Initial prompt engineering work is valuable even if you fine-tune, as the best prompts are often included in the training data.

## Preparing Your Dataset

Create a diverse set of demonstration conversations in the format expected by the [AvalAI Chat Completions API](en/api-reference/chat.md).

*   **Format:** JSONL file, where each line is a JSON object representing one training example.
*   **Structure:** Each example contains a list of `messages`, where each message has `role` (`system`, `user`, or `assistant`) and `content`.
*   **Targeting:** Include examples that specifically address the areas where the base model fails or doesn't meet requirements. The `assistant` messages should contain the ideal desired output.

### Example Format (Sarcastic Bot)

```json
{"messages": [{"role": "system", "content": "Marv is a factual chatbot that is also sarcastic."}, {"role": "user", "content": "What's the capital of France?"}, {"role": "assistant", "content": "Paris, as if everyone doesn't know that already."}]}
{"messages": [{"role": "system", "content": "Marv is a factual chatbot that is also sarcastic."}, {"role": "user", "content": "Who wrote 'Romeo and Juliet'?"}, {"role": "assistant", "content": "Oh, just some guy named William Shakespeare. Ever heard of him?"}]}
{"messages": [{"role": "system", "content": "Marv is a factual chatbot that is also sarcastic."}, {"role": "user", "content": "How far is the Moon from Earth?"}, {"role": "assistant", "content": "Around 384,400 kilometers. Give or take a few, like that really matters."}]}
```

### Multi-Turn Examples & Weighting

You can include multiple turns in an example. By default, the model trains on all `assistant` messages. To skip training on a specific assistant turn, add `"weight": 0` to that message object. Use `"weight": 1` (or omit the weight key) for turns you want the model to learn from.

```json
{
  "messages": [
    {
      "role": "system",
      "content": "Marv is factual and sarcastic."
    },
    {
      "role": "user",
      "content": "Capital of France?"
    },
    {
      "role": "assistant",
      "content": "Paris",
      "weight": 0
    },
    {
      "role": "user",
      "content": "More sarcastic please."
    },
    {
      "role": "assistant",
      "content": "Paris, like it's a big secret.",
      "weight": 1
    }
  ]
}
```

### Crafting Prompts in Data

Including the best-performing system prompt and user prompts (that you identified during prompt engineering) in *every* training example generally yields the best results, especially with fewer (<100) examples.

If you shorten or omit instructions in training data to save costs, the model might implicitly learn those instructions, making it harder to override them later at inference time. Teaching the model purely by demonstration (without instructions in the data) might require significantly more examples.

### Example Count Recommendations

*   **Minimum:** 10 examples required.
*   **Recommended Start:** 50-100 high-quality examples for models like `gpt-5.4-mini` or ~~`gpt-3.5-turbo`~~ (deprecated).
*   **Evaluation:** Check if the model shows improvement. Clear improvement suggests adding more data will likely help further. No improvement might mean rethinking the task setup or data structure.

### Train/Validation Split

Split your dataset into training and validation sets. Providing a validation file when creating the fine-tuning job allows AvalAI (or the underlying provider) to compute metrics during training, giving you feedback on model improvement. Ensure no overlap between training and validation data.

### Token Limits

Training examples are truncated if they exceed the model's maximum context length for training. Check the [Models Overview](en/models/model-details.md) for specific limits of fine-tunable models available via AvalAI. Ensure the total tokens per example (sum of `content` fields) fit within the limit. Use a tokenizer library (like `tiktoken` for OpenAI models) to count tokens accurately.

### Estimate Costs (Use AvalAI Pricing)

Consult AvalAI's [Pricing page](en/pricing.md) for fine-tuning costs. The general formula is:

`(AvalAI Base Cost per 1M Training Tokens / 1,000,000) * Total Tokens in Training File * Number of Epochs`

*Example:* A 100k token file trained for 3 epochs on `gpt-5.4-mini` via AvalAI would have a cost based on AvalAI's specific rate for that model.

Validation tokens are typically not charged.

### Check Data Formatting

Before uploading, validate your JSONL file:
* Each line must be a valid JSON object.
* Each object must have a `messages` key.
* Each message must have `role` and `content`.
* Roles must be `system`, `user`, or `assistant`.
* There must be at least one `assistant` message per example (unless using specific formats like DPO).
* Check token counts per example against model limits.

### Upload Training File

Upload your validated JSONL file using the AvalAI-compatible Files API (assuming compatibility with OpenAI's `v1/files` endpoint structure). Ensure you set the `purpose` to `fine-tune`.

```python
# Python Example: Uploading file via AvalAI-compatible endpoint
from openai import OpenAI

client = OpenAI(
    api_key="your-avalai-api-key",  # Replace with your actual API key
    base_url="https://api.avalai.ir/v1",  # AvalAI API endpoint
)

try:
    file_response = client.files.create(
        file=open("my_training_data.jsonl", "rb"), purpose="fine-tune"
    )
    training_file_id = file_response.id
    print(f"File uploaded successfully: {training_file_id}")
except FileNotFoundError:
    print("Error: Training file not found.")
except Exception as e:
    print(f"An error occurred during file upload: {e}")
```

File processing might take time after upload.

## Create a Fine-tuning Job

Start a job via the AvalAI API (assuming compatibility with OpenAI's `v1/fine_tuning/jobs` endpoint structure).

```python
# Python Example: Creating Fine-tuning Job via AvalAI
# Assumes 'training_file_id' was obtained from the file upload step
client = OpenAI(
    api_key="your-avalai-api-key",  # Replace with your actual API key
    base_url="https://api.avalai.ir/v1",  # AvalAI API endpoint
)

try:
    job = client.fine_tuning.jobs.create(
        training_file=training_file_id,
        model="gpt-5.4-mini-2026-03-17",  # Use a fine-tunable base model ID from AvalAI
        # Optional parameters:
        # validation_file="validation_file_id",
        # hyperparameters={"n_epochs": 3}, # Or {"learning_rate_multiplier": 2, "batch_size": 1}
        # suffix="my-custom-model-name", # Max 64 chars
        # method={"type": "dpo", "dpo": {"hyperparameters": {"beta": 0.1}}} # For DPO
    )
    print(f"Fine-tuning job created: {job.id}")
    print(f"Status: {job.status}")
except Exception as e:
    print(f"An error occurred creating the fine-tuning job: {e}")
```

*   `model`: Must be a fine-tunable base model identifier available through AvalAI.
*   `training_file`: The ID returned from the file upload.
*   `validation_file` (Optional): ID of your uploaded validation set.
*   `hyperparameters` (Optional): Customize `n_epochs`, `learning_rate_multiplier`, `batch_size`. Defaults are often suitable. See [API Reference](en/api-reference/fine-tuning.md) for details.
*   `suffix` (Optional): Add a custom name component to your fine-tuned model ID (max 64 chars).
*   `method` (Optional): Specify fine-tuning method, e.g., `{"type": "dpo", ...}` for Preference Fine-tuning. Default is supervised.

Jobs are queued and can take minutes to hours. You might receive an email notification upon completion (provider-dependent).

You can manage jobs programmatically:

```python
# Python Example: Managing Fine-tuning Jobs via AvalAI
client = OpenAI(
    api_key="your-avalai-api-key",  # Replace with your actual API key
    base_url="https://api.avalai.ir/v1",  # AvalAI API endpoint
)

try:
    # List 10 most recent jobs
    recent_jobs = client.fine_tuning.jobs.list(limit=10)
    print("Recent Jobs:", recent_jobs.data)

    # Retrieve a specific job's status
    job_id = "ftjob-xxxxxxxxxxxx"  # Replace with your job ID
    job_status = client.fine_tuning.jobs.retrieve(job_id)
    print(f"Job {job_id} Status:", job_status)
    fine_tuned_model_id = job_status.fine_tuned_model

    # List events for a job
    events = client.fine_tuning.jobs.list_events(job_id=job_id, limit=10)
    print(f"Events for {job_id}:", events.data)

    # Cancel an in-progress job (if needed)
    # cancel_status = client.fine_tuning.jobs.cancel(job_id)
    # print(f"Cancel Status for {job_id}:", cancel_status)

    # Delete a fine-tuned model (requires appropriate permissions)
    if fine_tuned_model_id:
        # delete_status = client.models.delete(fine_tuned_model_id)
        # print(f"Deletion status for {fine_tuned_model_id}:", delete_status)
        pass  # Uncomment delete line if needed

except Exception as e:
    print(f"An error occurred managing fine-tuning jobs: {e}")
```

## Use a Fine-tuned Model

Once a job succeeds, the `fine_tuned_model` field in the job status will contain the ID of your new model (e.g., `ft:gpt-5.4-mini:avalai-org:my-suffix:xxxxxx`). Use this ID in the `model` parameter of your Chat Completions API calls.

```python
# Python Example: Using Fine-tuned Model via AvalAI
client = OpenAI(
    api_key="your-avalai-api-key",  # Replace with your actual API key
    base_url="https://api.avalai.ir/v1",  # AvalAI API endpoint
)
fine_tuned_model_id = (
    "ft:gpt-5.4-mini:avalai-org:my-suffix:xxxxxx"  # Replace with your model ID
)

try:
    completion = client.chat.completions.create(
        model=fine_tuned_model_id,
        messages=[
            {
                "role": "system",
                "content": "Marv is a factual chatbot that is also sarcastic.",
            },  # System prompt might still be helpful
            {"role": "user", "content": "What's the capital of France?"},
        ],
    )
    print(completion.choices[0].message.content)
except Exception as e:
    print(f"An error occurred using the fine-tuned model: {e}")
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
    input="What",
)

print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


The model might take a few minutes to become fully available for inference after the job completes.

## Analyzing Your Fine-tuned Model

Monitor training progress via:

*   **Events:** The `list_events` endpoint shows metrics logged during training (loss, accuracy). Look for decreasing loss and increasing accuracy.
    ```json
{
  "object": "fine_tuning.job.event",
  "id": "ftevent-...",
  "created_at": ...,
  "level": "info",
  "message": "Step 100/200: training loss=0.25, validation loss=0.30",
  "data": {
    "step": 100,
    "train_loss": 0.25,
    "valid_loss": 0.30, // On batch during step

    "train_mean_token_accuracy": 0.91,
    "valid_mean_token_accuracy": 0.89, // On batch during step

    // "full_valid_loss": 0.28, // On full validation set at epoch end

    // "full_valid_mean_token_accuracy": 0.90 // On full validation set at epoch end

  },
  "type": "metrics"
}
```
*   **Result Files:** After completion, the job object contains `result_files`. Download these CSV files via the Files API to see detailed step-by-step metrics.
*   **Manual Evaluation:** Generate responses from your fine-tuned model and the base model on a held-out test set and compare quality side-by-side.
*   **Evals:** Use systematic evaluation frameworks ([Evals Guide](en/guides/evals.md)) for quantitative comparison.

### Iterating

*   **Data Quality:** If results are poor, review training data for errors, inconsistencies, lack of necessary information, or imbalance. High-quality data is crucial.
*   **Data Quantity:** If the model shows improvement but isn't perfect, adding more high-quality examples often helps, especially for edge cases. Doubling data *can* lead to noticeable gains.
*   **Hyperparameters:** Adjust `n_epochs` (increase if underfitting, decrease if overfitting/losing diversity) or `learning_rate_multiplier` (increase if not converging) if default settings aren't optimal.

## Vision Fine-tuning (Model-Dependent)

If the base model available via AvalAI supports vision, you can include images in your fine-tuning data (JSONL format).

*   **Format:** Use the standard Chat Completions message format, including `image_url` content parts for the `user` role. Images can be URLs or Base64 data URLs.
    ```json
{
  "messages": [
    {
      "role": "system",
      "content": "Identify the cheese."
    },
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "What is this?"
        },
        {
          "type": "image_url",
          "image_url": {
            "url": "https://...",

            "detail": "low"
          }
        }
      ]
    },
    {
      "role": "assistant",
      "content": "Danbo"
    }
  ]
}
```
*   **Requirements:** Check provider documentation via AvalAI for supported image formats (PNG, JPEG, WEBP, non-animated GIF typically), size limits (e.g., <10MB), and content restrictions (no people/faces/children/CAPTCHAs usually).
*   **Cost:** Use `detail: "low"` for images to significantly reduce token count and training cost.

## Preference Fine-tuning (DPO) (Model-Dependent)

Direct Preference Optimization (DPO) fine-tunes based on preferred vs. non-preferred responses.

*   **Data Format:** Each JSONL line needs `input` (like user messages), `preferred_output` (ideal assistant message list), and `non_preferred_output` (suboptimal assistant message list).
    ```json
{
  "input": {
    "messages": [
      {
        "role": "user",
        "content": "How's SF weather?"
      }
    ]
  },
  "preferred_output": [
    {
      "role": "assistant",
      "content": "Sunny, high 68F."
    }
  ],
  "non_preferred_output": [
    {
      "role": "assistant",
      "content": "It's okay today."
    }
  ]
}
```
*   **Method:** Specify `method={"type": "dpo", ...}` when creating the job.
*   **Beta Hyperparameter:** Controls adherence to previous behavior vs. new preferences (0=aggressive, 2=conservative, default="auto").
*   **Stacking:** Often beneficial to first run Supervised Fine-Tuning (SFT) on preferred responses, then run DPO on the resulting SFT model.

Check if DPO is supported for the base model you choose via AvalAI.