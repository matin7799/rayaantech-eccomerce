# New Model Added: Mistral OCR Latest

**Date:** 2025-05-15

## Summary

We're excited to announce the addition of the `mistral-ocr-latest` model to AvalAI. This powerful OCR model enables you to extract text and structured content from PDF documents and images while preserving formatting, structure, and hierarchy. The model returns results in markdown format for easy parsing and rendering. Mistral OCR sets a new standard in document understanding with state-of-the-art performance, multilingual capabilities, and exceptional processing speed.

---

## Details

### Mistral AI

* **mistral-ocr-latest**: A powerful OCR model that extracts text and structured content from documents while preserving formatting and structure, with superior accuracy across multiple document types including complex layouts, mathematical expressions, tables, and multilingual content. [Documentation](en/providers/mistralai.md)

### Key Features

* Extracts text content while maintaining document structure and hierarchy
* Preserves formatting like headers, paragraphs, lists and tables
* Returns results in markdown format for easy parsing and rendering
* Handles complex layouts including multi-column text and mixed content
* Processes documents at scale with high accuracy (up to 2000 pages per minute on a single node)
* Supports multiple document formats including PDF, images, and uploaded documents
* Natively multilingual, capable of parsing thousands of scripts, fonts, and languages
* Outperforms other leading OCR models in benchmark tests
* Priced at 1000 pages per dollar (approximately double with batch inference)
* Available for self-hosting for organizations with sensitive data requirements

### Usage Examples

The Mistral OCR model can be used with the AvalAI API. Note that unlike other OpenAI-compatible models, Mistral AI models use a different endpoint structure without the "/v1" path segment.

```language-selector
python=:from mistralai import Mistral

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

javascript=:import { Mistral } from "mistralai";

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
  pages: Array.from({ length: 100 }, (_, i) => i),
});

console.log(ocrResponse);

```

### Document Understanding

The `mistral-ocr-latest` model can also be combined with language models to enable natural language interaction with document content. This allows you to extract information and insights from documents by asking questions in natural language.

Key capabilities:
* Question answering about specific document content
* Information extraction and summarization
* Document analysis and insights
* Multi-document queries and comparisons
* Context-aware responses that consider the full document
* Structured output options (like JSON) for downstream processing

### Key Use Cases

Mistral OCR enables a wide range of document processing applications:

* **Scientific Research**: Convert scientific papers with complex formulas and diagrams into AI-ready formats
* **Historical Preservation**: Digitize historical documents and artifacts for broader accessibility
* **Customer Service**: Transform documentation and manuals into indexed knowledge bases
* **Education**: Convert lecture notes and presentations into searchable content
* **Legal**: Process regulatory filings and legal documents
* **Engineering**: Extract information from technical literature and drawings

### Supported File Types

* PDF documents (up to 50 MB and 1,000 pages)
* Images in PNG, JPEG, WEBP, and non-animated GIF formats

---

## Related Links

* [Mistral AI Models](en/providers/mistralai.md)
* [Document Processing Guide](en/guides/pdf-files.md)
* [API Reference](en/api-reference/introduction.md)