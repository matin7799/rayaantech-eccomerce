# New Model Added: Claude 4.5 Sonnet

**Date:** 2025-09-29

## Summary

We announce the addition of Claude 4.5 Sonnet (`claude-sonnet-4-5`), Anthropic's most advanced model for building complex agents that can work independently for extended periods. This model advances the frontier in coding capabilities, achieves state-of-the-art performance in computer use, and excels at powering agents for financial analysis, cybersecurity, and research applications.

---

## Details

### Anthropic

- **Claude 4.5 Sonnet**: Our best model for building complex agents with advanced coding capabilities and extended autonomous operation. [Documentation](en/providers/anthropic.md)

**Key Features:**
- **Context Window**: 200K tokens for handling extensive conversations and documents
- **Advanced Capabilities**: Enhanced coding excellence, agent capabilities, improved tool usage, and creative content generation
- **Pricing**: Same pricing as Sonnet 4 with input at $3/1M tokens and output at $15/1M tokens
- **Dual SDK Support**: Compatible with both OpenAI SDK and native Anthropic API
- **Endpoint Support**: Available on v1/chat/completions and v1/messages

**Key Improvements Over Sonnet 4:**

#### Coding Excellence
- **SWE-bench Verified Performance**: Advanced state-of-the-art on coding benchmarks
- **Enhanced Planning**: Better architectural decisions and code organization
- **Improved Security Engineering**: More robust security practices and vulnerability detection
- **Better Instruction Following**: More precise adherence to coding specifications and requirements
- **Extended Thinking**: Performs significantly better on coding tasks when extended thinking is enabled

#### Agent Capabilities
- **Extended Autonomous Operation**: Can work independently for hours while maintaining clarity and focus on incremental progress
- **Context Awareness**: Tracks token usage throughout conversations, receiving updates after each tool call
- **Enhanced Tool Usage**: More effective use of parallel tool calls and improved coordination across multiple tools
- **Advanced Context Management**: Maintains exceptional state tracking in external files, preserving goal-orientation across sessions

#### Communication and Interaction Style
- **Refined Communication**: Concise, direct, and natural approach with fact-based progress updates
- **Workflow Momentum**: May skip verbose summaries after tool calls to maintain momentum (adjustable with prompting)

#### Creative Content Generation
- **Presentations and Animations**: Matches or exceeds Claude Opus 4.1 for creating slides and visual content
- **Creative Flair**: Produces polished, professional output with strong instruction following
- **First-try Quality**: Generates usable, well-designed content in initial attempts

**Pricing Details:**

| Model | Input | Output |
|-------|-------|--------|
| claude-sonnet-4-5 | $3.00/1M tokens | $15.00/1M tokens |

**Usage Examples:**

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "claude-sonnet-4-5",
    "messages": [
      {
        "role": "system",
        "content": "You are an expert software engineer specializing in code refactoring."
      },
      {
        "role": "user",
        "content": "Refactor this multi-file Python project for better maintainability and add proper error handling."
      }
    ]
  }'

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="claude-sonnet-4-5",
    messages=[
        {
            "role": "system",
            "content": "You are an expert software engineer specializing in code refactoring.",
        },
        {
            "role": "user",
            "content": "Refactor this multi-file Python project for better maintainability and add proper error handling.",
        },
    ],
)

print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.chat.completions.create({
  model: "claude-sonnet-4-5",
  messages: [
    {
      role: "system",
      content: "You are an expert software engineer specializing in code refactoring.",
    },
    {
      role: "user",
      content: "Refactor this multi-file Python project for better maintainability and add proper error handling.",
    },
  ],
});

console.log(response.choices[0].message.content);

```

**Native Anthropic SDK Format:**

```language-selector
bash=:curl https://api.avalai.ir/v1/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1000,
    "system": "You are an expert software engineer specializing in code refactoring.",
    "messages": [
      {
        "role": "user",
        "content": "Refactor this multi-file Python project for better maintainability and add proper error handling."
      }
    ]
  }'

python=:import anthropic

client = anthropic.Anthropic(
    api_key="your-avalai-api-key", base_url="https://api.avalai.ir"
)

message = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1000,
    system="You are an expert software engineer specializing in code refactoring.",
    messages=[
        {
            "role": "user",
            "content": "Refactor this multi-file Python project for better maintainability and add proper error handling.",
        }
    ],
)

print(message.content)

javascript=:import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: 'https://api.avalai.ir',
});

const message = await anthropic.messages.create({
  model: 'claude-sonnet-4-5',
  max_tokens: 1000,
  system: 'You are an expert software engineer specializing in code refactoring.',
  messages: [
    {
      role: 'user',
      content: 'Refactor this multi-file Python project for better maintainability and add proper error handling.',
    },
  ],
});

console.log(message.content);

```

### Advanced Features

#### Enhanced Tool Usage
Claude 4.5 Sonnet includes improved tool parameter handling that preserves intentional formatting in tool call string parameters:

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "claude-sonnet-4-5",
    "messages": [
      {
        "role": "user",
        "content": "Help me manage my project tasks"
      }
    ],
    "tools": [
      {
        "type": "function",
        "function": {
          "name": "edit_file",
          "description": "Edit a file with precise formatting",
          "parameters": {
            "type": "object",
            "properties": {
              "filename": {
                "type": "string",
                "description": "Name of the file to edit"
              },
              "content": {
                "type": "string",
                "description": "File content with preserved formatting"
              }
            },
            "required": ["filename", "content"]
          }
        }
      }
    ],
    "tool_choice": "auto"
  }'

python=:tools = [
    {
        "type": "function",
        "function": {
            "name": "edit_file",
            "description": "Edit a file with precise formatting",
            "parameters": {
                "type": "object",
                "properties": {
                    "filename": {
                        "type": "string",
                        "description": "Name of the file to edit",
                    },
                    "content": {
                        "type": "string",
                        "description": "File content with preserved formatting",
                    },
                },
                "required": ["filename", "content"],
            },
        },
    }
]

response = client.chat.completions.create(
    model="claude-sonnet-4-5",
    messages=[{"role": "user", "content": "Help me manage my project tasks"}],
    tools=tools,
    tool_choice="auto",
)

javascript=:const tools = [
    {
        type: "function",
        function: {
            name: "edit_file",
            description: "Edit a file with precise formatting",
            parameters: {
                type: "object",
                properties: {
                    filename: {
                        type: "string",
                        description: "Name of the file to edit",
                    },
                    content: {
                        type: "string",
                        description: "File content with preserved formatting",
                    }
                },
                required: ["filename", "content"],
            },
        },
    }
];

const response = await client.chat.completions.create({
    model: "claude-sonnet-4-5",
    messages: [{role: "user", content: "Help me manage my project tasks"}],
    tools: tools,
    tool_choice: "auto",
});

```

### Migration from Sonnet 4

If you're currently using Claude Sonnet 4, upgrading to Sonnet 4.5 is straightforward:

1. Update your model name to `claude-sonnet-4-5`
2. Existing API calls will continue to work
3. Consider enabling new features like memory tools for long-running agents

---

## Related Links

- [Anthropic Models Documentation](en/providers/anthropic.md)
- [Chat Completions API Reference](en/api-reference/chat.md)
- [Function Calling Guide](en/guides/function-calling.md)
- [Agent Development Best Practices](en/guides/agents.md)
- [Provider-Specific Parameters](en/guides/provider-specific-params.md)