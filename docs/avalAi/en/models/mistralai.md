# Mistral AI

This page provides information about Mistral AI models available on AvalAI.

## Available Models

### Text and Chat Models

Mistral AI offers several powerful language models for text generation and chat applications.

#### mistral-large-3

The `mistral-large-3` model is Mistral AI's most capable model to date, a state-of-the-art open model with a sparse mixture-of-experts architecture featuring 41B active and 675B total parameters. Released under the Apache 2.0 license.

**Key Features:**

- Sparse Mixture-of-Experts architecture (41B active / 675B total parameters)
- Released under Apache 2.0 license for full open-source access
- Native multimodal capabilities with image understanding
- Best-in-class multilingual performance across 40+ languages
- Achieves parity with best instruction-tuned open-weight models
- Ranks #2 in OSS non-reasoning models on LMArena (#6 overall among OSS)
- Optimized checkpoint available in NVFP4 format for efficient deployment
- Can run on single 8×A100 or 8×H100 node using vLLM

**Pricing:**

| Input | Cached Input | Output | Per Page |
|-------|--------------|--------|----------|
| $0.50/1M tokens | $0.05/1M tokens | $1.50/1M tokens | $0.001/page |

**Use Cases:**

- Complex reasoning and analysis tasks
- Multilingual conversations and content generation
- Document understanding and processing
- Code generation and technical tasks
- Research and enterprise applications
- Agentic workflows and tool use

```python
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="mistral-large-3",
    messages=[
        {
            "role": "user",
            "content": "Analyze the implications of quantum computing on modern cryptography.",
        }
    ],
)

print(response.choices[0].message.content)
```

#### codestral-2501

The `codestral-2501` model is a specialized 22B parameter model designed for code generation across 80+ programming languages. It sets a new standard for code generation performance and capabilities.

**Key Features:**

- Fluent in 80+ programming languages including Python, Java, C, C++, JavaScript, Bash, Swift, Fortran, and many more
- Completes coding functions, writes tests, and fills in partial code using a fill-in-the-middle mechanism
- 32K context window for long-range code completion and understanding
- Superior performance on benchmarks including HumanEval, MBPP, CruxEval, and RepoBench
- Excels at SQL generation and multi-language programming tasks
- Advanced fill-in-the-middle capabilities for code editing and completion

**Use Cases:**

- Software development and code generation
- Test creation and automation
- Code completion in IDEs and development environments
- Technical documentation generation
- Code translation between programming languages
- Debugging and code optimization

#### mistral-small-2503

The `mistral-small-2503` model is a versatile, efficient language model designed for general text generation and understanding tasks. It offers a good balance between performance and computational efficiency.

**Key Features:**

- Optimized for general-purpose language tasks
- Supports a 1M token context window
- Efficient performance for routine language tasks
- Balanced capabilities across reasoning, content generation, and comprehension
- Cost-effective option for production applications

**Use Cases:**

- Content generation and summarization
- Question answering and information retrieval
- Text classification and analysis
- Conversational AI applications
- Document processing and understanding

### OCR Models

#### mistral-ocr-latest

The `mistral-ocr-latest` model is a state-of-the-art OCR (Optical Character Recognition) model that enables you to extract text and structured content from PDF documents and images.

**Key Features:**

- Extracts text content while maintaining document structure and hierarchy
- Preserves formatting like headers, paragraphs, lists and tables
- Returns results in markdown format for easy parsing and rendering
- Handles complex layouts including multi-column text and mixed content
- Processes documents at scale with high accuracy (up to 2000 pages per minute)
- Supports multiple document formats including PDF, images, and uploaded documents
- Natively multilingual, capable of parsing thousands of scripts, fonts, and languages
- Outperforms other leading OCR models in benchmark tests across multiple aspects:
  - Mathematical expressions and formulas
  - Complex tables
  - Multilingual content
  - Scanned documents
- Supports structured output options (like JSON) for downstream processing
- Available for self-hosting for organizations with sensitive data requirements

**Pricing:**

- 1000 pages per dollar
- Approximately double the pages per dollar with batch inference

**Supported File Types:**

- PDF documents (up to 50 MB and 1,000 pages)
- Images in PNG, JPEG, WEBP, and non-animated GIF formats

## Usage

Unlike other OpenAI-compatible models, Mistral AI models use a different endpoint structure without the "/v1" path segment.

### OCR Processing Examples

#### Using URL to Process PDF

```python
from mistralai import Mistral

client = Mistral(server_url="https://api.avalai.ir", api_key="avalai-api-key")

document_param = {
    "type": "document_url",
    "document_url": "https://arxiv.org/pdf/1805.04770",
}

ocr_response = client.ocr.process(
    model="mistral-ocr-latest",
    document=document_param,
    pages=list(range(0, 100)),  # Process up to 100 pages
)

print(ocr_response)
```

#### Using Base64-encoded PDF

```python
import base64
from mistralai import Mistral

# Read and encode the PDF file
with open("document.pdf", "rb") as f:
    pdf_data = f.read()

base64_pdf = base64.b64encode(pdf_data).decode("utf-8")
document_url = f"data:application/pdf;base64,{base64_pdf}"

# Process the encoded PDF
client = Mistral(server_url="https://api.avalai.ir", api_key="avalai-api-key")

document_param = {"type": "document_url", "document_url": document_url}

ocr_response = client.ocr.process(
    model="mistral-ocr-latest",
    document=document_param,
    pages=list(range(0, 100)),  # Process up to 100 pages
)

print(ocr_response)
```

#### Processing Specific Pages

```python
from mistralai import Mistral

client = Mistral(server_url="https://api.avalai.ir", api_key="avalai-api-key")

document_param = {
    "type": "document_url",
    "document_url": "https://arxiv.org/pdf/1805.04770",
}

# Process only pages 0, 1, and 5
ocr_response = client.ocr.process(
    model="mistral-ocr-latest",
    document=document_param,
    pages=[0, 1, 5],  # Only process specific pages
)

print(ocr_response)
```

#### JavaScript Example

```javascript
import { Mistral } from "mistralai";

const client = new Mistral({
  apiKey: "avalai-api-key",
  baseURL: "https://api.avalai.ir",
});

const documentParam = {
  type: "document_url",
  document_url: "https://arxiv.org/pdf/1805.04770",
};

const ocrResponse = await client.ocr.process({
  model: "mistral-ocr-latest",
  document: documentParam,
  pages: Array.from({ length: 100 }, (_, i) => i), // Process up to 100 pages
});

console.log(ocrResponse);
```

### Document Understanding

The `mistral-ocr-latest` model can also be combined with language models to enable natural language interaction with document content. This allows you to extract information and insights from documents by asking questions in natural language.

#### Question Answering with Scientific Papers

```python
from mistralai import Mistral
from mistralai.models.chat import ChatMessage

# Initialize client
client = Mistral(server_url="https://api.avalai.ir", api_key="avalai-api-key")

# Process document with OCR first
document_param = {
    "type": "document_url",
    "document_url": "https://arxiv.org/pdf/1805.04770",
}

ocr_response = client.ocr.process(
    model="mistral-ocr-latest",
    document=document_param,
    pages=[0, 1, 2],  # Process first 3 pages
)

# Create a message with both text and document
document_content = (
    ocr_response.pages[0].text
    + "\n"
    + ocr_response.pages[1].text
    + "\n"
    + ocr_response.pages[2].text
)
message = f"""
Please analyze this scientific paper and answer questions based on its content:

{document_content}
"""

# Send the request
messages = [
    ChatMessage(role="user", content=message),
]

chat_response = client.chat(
    model="mistral-large-latest",
    messages=messages,
)

print(chat_response.choices[0].message.content)

# Ask specific questions about the document
question = "What is the main contribution of this paper?"
messages = [
    ChatMessage(role="user", content=message),
    ChatMessage(role="assistant", content=chat_response.choices[0].message.content),
    ChatMessage(role="user", content=question),
]

chat_response = client.chat(
    model="mistral-large-latest",
    messages=messages,
)

print(f"Q: {question}\nA: {chat_response.choices[0].message.content}")
```

#### Information Extraction from Receipts

```python
from mistralai import Mistral
from mistralai.models.chat import ChatMessage

# Initialize client
client = Mistral(server_url="https://api.avalai.ir", api_key="avalai-api-key")

# Process receipt image
document_param = {
    "type": "document_url",
    "document_url": "https://example.com/receipt.jpg",
}

ocr_response = client.ocr.process(
    model="mistral-ocr-latest",
    document=document_param,
)

# Create a message with both text and image
message = f"""
Extract the following information from this receipt:
1. Store name
2. Date of purchase
3. Total amount
4. List of items purchased with prices

Receipt content:
{ocr_response.pages[0].text}
"""

# Send the request
messages = [
    ChatMessage(role="user", content=message),
]

chat_response = client.chat(
    model="mistral-large-latest",
    messages=messages,
)

print(chat_response.choices[0].message.content)
```

Key capabilities:

- Question answering about specific document content
- Information extraction and summarization
- Document analysis and insights
- Multi-document queries and comparisons
- Context-aware responses that consider the full document
- Structured output options for downstream processing

### Key Use Cases

Mistral OCR enables a wide range of document processing applications:

- **Scientific Research**: Convert scientific papers with complex formulas and diagrams into AI-ready formats
- **Historical Preservation**: Digitize historical documents and artifacts for broader accessibility
- **Customer Service**: Transform documentation and manuals into indexed knowledge bases
- **Education**: Convert lecture notes and presentations into searchable content
- **Legal**: Process regulatory filings and legal documents
- **Engineering**: Extract information from technical literature and drawings

## Related Resources

- [OCR Announcement](en/news/2025-05-15-mistral-ocr-latest-added.md)
- [Document Processing Guide](en/guides/pdf-files.md)
- [Processing Documents with Mistral OCR](en/examples/processing_documents_with_mistral_ocr.md)
