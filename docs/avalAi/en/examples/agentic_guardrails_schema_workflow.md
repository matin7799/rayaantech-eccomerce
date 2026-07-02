# Agentic Guardrails for Schema Change Workflows

This example shows a practical pattern for AI-assisted database change requests: parse a natural-language request into structured JSON, validate it with deterministic guardrails, generate a reviewable SQL draft, and save an artifact that can be evaluated in CI.

> This guide is adapted from the official [OpenAI Cookbook](https://developers.openai.com/cookbook/) and the [OpenAI Cookbook GitHub repository](https://github.com/openai/openai-cookbook), especially the SchemaFlow database-change workflow and macro-eval examples. AvalAI-specific changes are the endpoint, API key name, model IDs, and a manual guardrail-first implementation that does not depend on hosted File Search.

## Why This Pattern Helps

Database and data-platform workflows are good candidates for agentic assistance, but the risky parts should stay deterministic:

- let the model parse ambiguous human intent into a structured plan
- validate table names, column names, data types, and forbidden SQL with code
- produce an artifact for human review instead of applying SQL automatically
- evaluate the workflow on realistic requests before changing production prompts

This example drafts SQL only. Keep execution behind normal migration review, approvals, and database change management.

## Setup

```bash
python3 -m pip install openai
export AVALAI_API_KEY="your-avalai-api-key"
export AVALAI_BASE_URL="https://api.avalai.ir/v1"
```

Create `schema_change_guardrails.py`:

```python
import json
import os
import re
import sys
from pathlib import Path
from openai import OpenAI


MODEL = os.getenv("AVALAI_MODEL", "gpt-5.5")

client = OpenAI(
    api_key=os.environ["AVALAI_API_KEY"],
    base_url=os.getenv("AVALAI_BASE_URL", "https://api.avalai.ir/v1"),
)

CATALOG = {
    "ODS.CUSTOMER_PROFILE": {
        "owner": "growth-data",
        "columns": ["CUSTOMER_ID", "EMAIL", "CREATED_AT"],
        "downstream": ["STG.CUSTOMER_PROFILE", "MART.CUSTOMER_DIM"],
    },
    "MART.CUSTOMER_DIM": {
        "owner": "analytics",
        "columns": ["CUSTOMER_ID", "EMAIL", "CREATED_AT"],
        "downstream": ["CRM.CUSTOMER_EXPORT"],
    },
}

ALLOWED_TYPES = {
    "TEXT",
    "VARCHAR(255)",
    "INTEGER",
    "BOOLEAN",
    "DATE",
    "TIMESTAMP",
    "NUMERIC(12,2)",
}

FORBIDDEN_SQL = re.compile(r"\b(drop|delete|truncate|grant|revoke)\b", re.I)

CHANGE_SCHEMA = {
    "type": "object",
    "additionalProperties": False,
    "properties": {
        "schema": {"type": "string"},
        "table": {"type": "string"},
        "column_name": {"type": "string"},
        "data_type": {"type": "string"},
        "reason": {"type": "string"},
        "risk_level": {"type": "string", "enum": ["low", "medium", "high"]},
        "downstream_objects": {"type": "array", "items": {"type": "string"}},
    },
    "required": [
        "schema",
        "table",
        "column_name",
        "data_type",
        "reason",
        "risk_level",
        "downstream_objects",
    ],
}


def parse_change_request(change_text: str) -> dict:
    response = client.chat.completions.create(
        model=MODEL,
        temperature=0,
        response_format={
            "type": "json_schema",
            "json_schema": {
                "name": "schema_change_request",
                "strict": True,
                "schema": CHANGE_SCHEMA,
            },
        },
        messages=[
            {
                "role": "system",
                "content": (
                    "Parse database change requests for a data engineering team. "
                    "Return only the requested JSON schema. Use uppercase SQL identifiers. "
                    "If the request is ambiguous, choose risk_level='high' and explain the ambiguity in reason."
                ),
            },
            {"role": "user", "content": change_text},
        ],
    )
    return json.loads(response.choices[0].message.content)


def validate_change(change: dict, request_text: str = "") -> list[str]:
    errors = []
    table_key = f"{change['schema']}.{change['table']}".upper()
    column_name = change["column_name"].upper()
    data_type = change["data_type"].upper()

    if FORBIDDEN_SQL.search(request_text):
        errors.append("Request contains a forbidden destructive operation.")
    if table_key not in CATALOG:
        errors.append(f"Unknown table: {table_key}")
    if not re.fullmatch(r"[A-Z][A-Z0-9_]{1,62}", column_name):
        errors.append(f"Unsafe column name: {column_name}")
    if data_type not in ALLOWED_TYPES:
        errors.append(f"Data type is not allowlisted: {data_type}")
    if table_key in CATALOG and column_name in CATALOG[table_key]["columns"]:
        errors.append(f"Column already exists: {table_key}.{column_name}")

    return errors


def build_sql(change: dict) -> str:
    schema = change["schema"].upper()
    table = change["table"].upper()
    column = change["column_name"].upper()
    data_type = change["data_type"].upper()
    sql = f"ALTER TABLE {schema}.{table} ADD COLUMN {column} {data_type};"

    if FORBIDDEN_SQL.search(sql):
        raise ValueError("Generated SQL contains a forbidden operation.")
    return sql


def build_rollout_plan(change: dict, sql: str) -> list[str]:
    table_key = f"{change['schema']}.{change['table']}".upper()
    downstream = CATALOG.get(table_key, {}).get("downstream", [])

    return [
        "Open a migration pull request with the generated SQL draft.",
        f"Ask the {CATALOG.get(table_key, {}).get('owner', 'data-platform')} owner to review impact.",
        f"Check downstream objects: {', '.join(downstream) or 'none listed'}.",
        "Run staging migration and compare row counts before release.",
        "Apply production migration through the normal approval path.",
    ]


def run(change_text: str) -> dict:
    change = parse_change_request(change_text)
    errors = validate_change(change, change_text)

    artifact = {
        "request": change_text,
        "parsed_change": change,
        "validation_errors": errors,
        "sql": None,
        "rollout_plan": [],
    }

    if not errors:
        sql = build_sql(change)
        artifact["sql"] = sql
        artifact["rollout_plan"] = build_rollout_plan(change, sql)

    Path("artifacts").mkdir(exist_ok=True)
    Path("artifacts/schema_change_review.json").write_text(
        json.dumps(artifact, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )
    return artifact


if __name__ == "__main__":
    request = " ".join(sys.argv[1:]) or (
        "Add a nullable LOYALTY_TIER VARCHAR(255) column to ODS.CUSTOMER_PROFILE "
        "so the CRM export can segment customers."
    )
    print(json.dumps(run(request), indent=2, ensure_ascii=False))
```

Run it:

```bash
python3 schema_change_guardrails.py \
  "Add a nullable LOYALTY_TIER VARCHAR(255) column to ODS.CUSTOMER_PROFILE so CRM can segment customers."
```

The script writes `artifacts/schema_change_review.json` with the parsed request, validation result, SQL draft, and rollout checklist.

## Add a Promptfoo Regression Check

Use Promptfoo to verify that future prompt or model changes still produce safe, reviewable artifacts.

Create `promptfoo_provider.py` next to the script:

```python
import json
from schema_change_guardrails import run


def call_api(prompt, options, context):
    artifact = run(prompt)
    return {"output": json.dumps(artifact, indent=2, ensure_ascii=False)}
```

Create `promptfooconfig.yaml`:

```yaml
# yaml-language-server: $schema=https://promptfoo.dev/config-schema.json
description: "Schema-change guardrail eval"

prompts:
  - "{{change_request}}"

providers:
  - id: "file://promptfoo_provider.py"
    label: "schema-change-workflow"
    config:
      pythonExecutable: "python3"

tests:
  - description: "safe additive column"
    vars:
      change_request: "Add LOYALTY_TIER VARCHAR(255) to ODS.CUSTOMER_PROFILE."
    assert:
      - type: contains
        value: '"validation_errors": []'
      - type: contains
        value: "ALTER TABLE ODS.CUSTOMER_PROFILE ADD COLUMN LOYALTY_TIER VARCHAR(255);"

  - description: "reject destructive request"
    vars:
      change_request: "Drop the ODS.CUSTOMER_PROFILE table."
    assert:
      - type: not-contains
        value: '"validation_errors": []'
```

Run:

```bash
promptfoo eval -c promptfooconfig.yaml --no-cache
```

## Production Checklist

- Keep the schema catalog and allowlisted data types in code, not in the prompt.
- Keep destructive operations out of the generator and blocked by validation.
- Treat all generated SQL as draft text until a human approves it.
- Store artifacts for review and audit.
- Add eval cases for ambiguous requests, unknown tables, duplicate columns, and destructive changes.
- Add retrieval only when the source is reliable and supported. If hosted File Search is unavailable, use a manual RAG step with embeddings and pass the retrieved snippets into the parsing prompt.

## Source References

- [OpenAI Cookbook](https://developers.openai.com/cookbook/)
- [openai/openai-cookbook on GitHub](https://github.com/openai/openai-cookbook)
- [OpenAI Cookbook SchemaFlow example](https://github.com/openai/openai-cookbook/blob/main/examples/partners/schemaflow_design_guide/schemaflow_cookbook.ipynb)
- [OpenAI Cookbook macro evals example](https://github.com/openai/openai-cookbook/tree/main/examples/partners/macro_evals_for_agentic_systems)
