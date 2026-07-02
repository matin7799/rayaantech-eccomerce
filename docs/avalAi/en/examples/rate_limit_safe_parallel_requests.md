# Rate-Limit-Safe Parallel Requests

Parallel API workers are useful for embeddings, classification, extraction, and batch cleanup jobs. Without throttling, they can also create avoidable `429` errors. This example shows a practical pattern for backoff, concurrency limits, and request pacing with AvalAI.

> This guide is adapted from the official [OpenAI Cookbook](https://developers.openai.com/cookbook), the [rate limit guide notebook](https://github.com/openai/openai-cookbook/blob/main/examples/How_to_handle_rate_limits.ipynb), and [`api_request_parallel_processor.py`](https://github.com/openai/openai-cookbook/blob/main/examples/api_request_parallel_processor.py), with AvalAI-specific endpoint and API key changes.

## Strategy

Use three layers together:

- Retry `429` and transient server errors with exponential backoff and jitter.
- Limit concurrent in-flight requests.
- Pace requests so the worker stays below your tier's RPM and TPM limits.

## Python: Async Worker with Backoff

Install dependencies:

```bash
pip install openai
export AVALAI_API_KEY="your-avalai-api-key"
```

```python
import asyncio
import os
import random
from collections.abc import Awaitable, Callable

from openai import AsyncOpenAI, RateLimitError, APIStatusError

client = AsyncOpenAI(
    api_key=os.environ["AVALAI_API_KEY"],
    base_url="https://api.avalai.ir/v1",
)


async def with_backoff(
    operation: Callable[[], Awaitable],
    max_retries: int = 6,
    initial_delay: float = 1.0,
    max_delay: float = 60.0,
):
    delay = initial_delay

    for attempt in range(max_retries + 1):
        try:
            return await operation()
        except RateLimitError as exc:
            if attempt == max_retries:
                raise

            retry_after = 0
            if getattr(exc, "headers", None):
                retry_after = float(exc.headers.get("retry-after", 0) or 0)

            sleep_for = max(retry_after, delay) + random.uniform(0, delay * 0.25)
            await asyncio.sleep(sleep_for)
            delay = min(delay * 2, max_delay)
        except APIStatusError as exc:
            if exc.status_code < 500 or attempt == max_retries:
                raise
            await asyncio.sleep(delay + random.uniform(0, delay * 0.25))
            delay = min(delay * 2, max_delay)


async def classify_ticket(ticket: str) -> str:
    async def operation():
        return await client.responses.create(
            model="gpt-5.5",
            instructions=(
                "Classify the ticket as Billing, Technical, Account, or Other. "
                "Return only the label."
            ),
            input=ticket,
        )

    response = await with_backoff(operation)
    return response.output_text.strip()


async def run_batch(tickets: list[str], max_concurrency: int = 5) -> list[str]:
    semaphore = asyncio.Semaphore(max_concurrency)

    async def guarded(ticket: str) -> str:
        async with semaphore:
            return await classify_ticket(ticket)

    return await asyncio.gather(*(guarded(ticket) for ticket in tickets))


if __name__ == "__main__":
    sample_tickets = [
        "I cannot log in after resetting my password.",
        "The invoice total looks wrong.",
        "Webhook delivery fails with a 500 error.",
        "How do I upgrade my tier?",
    ]

    labels = asyncio.run(run_batch(sample_tickets, max_concurrency=3))
    for ticket, label in zip(sample_tickets, labels):
        print(f"{label}: {ticket}")
```

## JavaScript: Concurrency and Retry

```javascript
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function withBackoff(operation, maxRetries = 6) {
  let delay = 1000;

  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      const retryable =
        error.status === 429 || (error.status >= 500 && error.status < 600);

      if (!retryable || attempt === maxRetries) throw error;

      const retryAfter = error.headers?.["retry-after"]
        ? Number(error.headers["retry-after"]) * 1000
        : 0;
      const jitter = Math.random() * delay * 0.25;
      await sleep(Math.max(retryAfter, delay) + jitter);
      delay = Math.min(delay * 2, 60000);
    }
  }
}

async function classifyTicket(ticket) {
  const response = await withBackoff(() =>
    client.responses.create({
      model: "gpt-5.5",
      instructions:
        "Classify the ticket as Billing, Technical, Account, or Other. Return only the label.",
      input: ticket,
    }),
  );

  return response.output_text.trim();
}

async function runBatch(items, maxConcurrency = 3) {
  const results = new Array(items.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const current = nextIndex;
      nextIndex += 1;
      results[current] = await classifyTicket(items[current]);
    }
  }

  await Promise.all(
    Array.from({ length: maxConcurrency }, () => worker()),
  );

  return results;
}

const tickets = [
  "I cannot log in after resetting my password.",
  "The invoice total looks wrong.",
  "Webhook delivery fails with a 500 error.",
  "How do I upgrade my tier?",
];

console.log(await runBatch(tickets, 3));
```

## cURL: Respect Retry-After

```bash
#!/usr/bin/env bash
set -euo pipefail

payload='{
  "model": "gpt-5.5",
  "instructions": "Classify the ticket as Billing, Technical, Account, or Other. Return only the label.",
  "input": "Webhook delivery fails with a 500 error."
}'

for attempt in 1 2 3 4 5; do
  response_file=$(mktemp)
  headers_file=$(mktemp)

  status=$(curl -sS -o "$response_file" -D "$headers_file" -w "%{http_code}" \
    https://api.avalai.ir/v1/responses \
    -H "Authorization: Bearer $AVALAI_API_KEY" \
    -H "Content-Type: application/json" \
    -d "$payload")

  if [ "$status" = "200" ]; then
    cat "$response_file"
    rm "$response_file" "$headers_file"
    exit 0
  fi

  if [ "$status" != "429" ]; then
    cat "$response_file"
    rm "$response_file" "$headers_file"
    exit 1
  fi

  retry_after=$(awk 'tolower($1)=="retry-after:" {print $2}' "$headers_file" | tr -d '\r')
  sleep_for=${retry_after:-$((attempt * attempt))}
  sleep "$sleep_for"

  rm "$response_file" "$headers_file"
done

echo "Request failed after retries" >&2
exit 1
```

## Throughput Checklist

- Leave headroom: target 50-75 percent of your documented RPM and TPM limits.
- Track both requests and tokens; one can be exhausted while the other still has room.
- Lower `max_output_tokens` when expected answers are short.
- Batch small classification tasks when latency is less important than throughput.
- Write partial results as you go so a long job can resume after interruption.
- Include request IDs and error bodies in logs for support and debugging.

## Related Links

- [Rate Limits](en/guides/rate-limits.md)
- [Response Headers](en/api-reference/response-headers.md)
- [Error Handling](en/guides/error-handling.md)
- [Production Best Practices](en/guides/production-best-practices.md)
