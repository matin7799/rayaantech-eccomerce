# Promptfoo Evals with AvalAI

Use Promptfoo when you want portable regression tests for prompts, model upgrades, routing logic, or agent workflows. This example keeps the eval beside your application code and calls AvalAI through the OpenAI-compatible SDK.

> This guide is adapted from the official [OpenAI Cookbook](https://developers.openai.com/cookbook/) and the [OpenAI Cookbook GitHub repository](https://github.com/openai/openai-cookbook), especially the Promptfoo migration and SchemaFlow eval examples. AvalAI-specific changes are the API key name, base URL, and model IDs.

## When to Use This Pattern

Use a local Promptfoo eval when:

- you are comparing two AvalAI models before changing production traffic
- you are tightening a prompt and want to catch regressions
- you need CI to fail when output quality drops
- the native AvalAI Evals API is not available for your account yet

For hosted AvalAI eval features, see [Evaluations](en/guides/evals.md). For local and CI workflows, the pattern below works with normal API calls.

## Install

```bash
npm install -g promptfoo
python3 -m pip install openai

export AVALAI_API_KEY="your-avalai-api-key"
export AVALAI_BASE_URL="https://api.avalai.ir/v1"
```

## Create a Python Provider

Create `evals/support-ticket/avalai_eval_provider.py`:

```python
import os
from openai import OpenAI


MODEL = os.getenv("AVALAI_EVAL_MODEL", "gpt-5.5")

client = OpenAI(
    api_key=os.environ["AVALAI_API_KEY"],
    base_url=os.getenv("AVALAI_BASE_URL", "https://api.avalai.ir/v1"),
)


def call_api(prompt, options, context):
    vars_ = (context or {}).get("vars", {})
    ticket = vars_.get("ticket", prompt)

    response = client.chat.completions.create(
        model=MODEL,
        temperature=0,
        messages=[
            {
                "role": "system",
                "content": (
                    "Classify the support ticket as exactly one of: "
                    "Hardware, Software, Billing, Account, Other. "
                    "Return only the label."
                ),
            },
            {"role": "user", "content": ticket},
        ],
    )

    return {"output": response.choices[0].message.content.strip()}
```

Promptfoo calls `call_api()` for each test case. The custom provider keeps AvalAI credentials on the machine running the eval and avoids exposing keys in YAML.

## Add Test Cases

Create `evals/support-ticket/promptfooconfig.yaml`:

```yaml
# yaml-language-server: $schema=https://promptfoo.dev/config-schema.json
description: "AvalAI support-ticket classification regression eval"

prompts:
  - "{{ticket}}"

providers:
  - id: "file://avalai_eval_provider.py"
    label: "avalai-gpt-5.5"
    config:
      pythonExecutable: "python3"

tests:
  - description: "monitor power issue"
    vars:
      ticket: "My monitor will not turn on after I changed desks."
    assert:
      - type: equals
        value: "Hardware"

  - description: "invoice question"
    vars:
      ticket: "Why was my card charged twice this month?"
    assert:
      - type: equals
        value: "Billing"

  - description: "password reset"
    vars:
      ticket: "I cannot sign in and need to reset my password."
    assert:
      - type: equals
        value: "Account"
```

## Run Locally

```bash
cd evals/support-ticket
promptfoo validate config -c promptfooconfig.yaml
promptfoo eval -c promptfooconfig.yaml --no-cache
promptfoo view
```

Use `--no-cache` while developing the eval. Remove it when you want repeated local runs to be faster.

## Compare Models

To compare models, run the same config with a different `AVALAI_EVAL_MODEL` value and compare the saved Promptfoo results.

```bash
AVALAI_EVAL_MODEL="gpt-5.4" promptfoo eval -c promptfooconfig.yaml --no-cache
AVALAI_EVAL_MODEL="gpt-5.5" promptfoo eval -c promptfooconfig.yaml --no-cache
```

Keep the eval dataset fixed while comparing models. Change one thing at a time: model, prompt, tool schema, or retrieval context.

## Add to CI

```yaml
name: prompt-evals

on:
  pull_request:
  workflow_dispatch:

jobs:
  evals:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - uses: actions/setup-python@v5
        with:
          python-version: "3.11"
      - run: npm install -g promptfoo
      - run: python3 -m pip install openai
      - run: promptfoo eval -c evals/support-ticket/promptfooconfig.yaml --no-cache
        env:
          AVALAI_API_KEY: ${{ secrets.AVALAI_API_KEY }}
          AVALAI_BASE_URL: https://api.avalai.ir/v1
```

## Make the Eval Useful

- Keep examples close to real user inputs, including typos and short messages.
- Add negative cases that should refuse, escalate, or return `Other`.
- Prefer deterministic assertions such as `equals`, `contains`, or regex before adding LLM-as-judge checks.
- Store past results when changing production prompts so reviewers can see what improved and what regressed.
- Use small evals in every pull request and larger eval suites before releases.

## Source References

- [OpenAI Cookbook](https://developers.openai.com/cookbook/)
- [openai/openai-cookbook on GitHub](https://github.com/openai/openai-cookbook)
- [OpenAI Cookbook Promptfoo migration guide](https://github.com/openai/openai-cookbook/blob/main/examples/evaluation/moving-from-openai-evals-to-promptfoo.md)
- [OpenAI Cookbook SchemaFlow example](https://github.com/openai/openai-cookbook/blob/main/examples/partners/schemaflow_design_guide/schemaflow_cookbook.ipynb)
