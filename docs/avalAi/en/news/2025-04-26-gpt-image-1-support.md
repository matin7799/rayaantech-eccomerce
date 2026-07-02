# New Model Added: GPT Image 1 Now Available

**Date:** 2025-04-26

## Summary

AvalAI is excited to announce support for OpenAI's GPT Image 1, a powerful new model that combines advanced language understanding with state-of-the-art image generation capabilities. This model excels at following detailed instructions and produces highly photorealistic images, offering significant improvements over previous generation image models.

---

## Details

### OpenAI

* **gpt-image-1**: A versatile image generation model with superior instruction-following capabilities and photorealistic output quality. [Documentation](en/examples/generate_images_with_gpt_image.md)

GPT Image 1 represents a significant advancement in AI image generation technology, combining the world knowledge of large language models with sophisticated image creation abilities. Whether you need to generate completely new images from text descriptions or edit existing images, this model provides exceptional results across a wide range of use cases.

Our comprehensive [how-to guide](en/examples/generate_images_with_gpt_image.md) is based on the official [OpenAI Cookbook example](https://cookbook.openai.com/examples/generate_images_with_gpt_image), adapted for AvalAI's implementation.

### Key Features

* **Superior Instruction Following**: Create precisely what you want by providing detailed text prompts
* **Photorealistic Quality**: Generate images with remarkable detail and realism
* **Flexible Customization**: Adjust quality, size, compression, and background transparency
* **Advanced Editing**: Combine or modify existing images with text instructions
* **Masking Support**: Edit specific parts of images while preserving others

### GPT Image 1 Usage Examples

```language-selector
python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# Generate a new image
response = client.images.generate(
    model="gpt-image-1",
    prompt="A photorealistic image of a futuristic city with flying cars and tall glass buildings",
    size="1024x1024",
    response_format="url",  # or b64_json
)

# Access the image URL
image_url = response.data[0].url
print(f"Generated image URL: {image_url}")

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

// Generate a new image
const response = await client.images.generate({
  model: "gpt-image-1",
  prompt:
    "A photorealistic image of a futuristic city with flying cars and tall glass buildings",
  size: "1024x1024",
  response_format: "url", // or b64_json
});

// Access the image URL
const imageUrl = response.data[0].url;
console.log(`Generated image URL: ${imageUrl}`);

```

### Image Editing Capabilities

GPT Image 1 also excels at editing and combining existing images. You can provide up to 10 input images and detailed instructions on how to modify or merge them.

```python
# Edit an existing image
with open("input_image.jpg", "rb") as image_file:
    response = client.images.edit(
        model="gpt-image-1",
        image=image_file,
        prompt="Change the background to a beach sunset",
        response_format="url",  # or b64_json
    )
```

### Mask-Based Editing

For precise control over which parts of an image are modified, you can provide a mask with an alpha channel:

```python
# Edit with mask
with open("input_image.jpg", "rb") as image_file, open("mask.png", "rb") as mask_file:
    response = client.images.edit(
        model="gpt-image-1",
        image=image_file,
        mask=mask_file,
        prompt="Add colorful flowers to the garden area",
        response_format="url",  # or b64_json
    )
```

---

## Related Links

* [GPT Image 1 How-To Guide](en/examples/generate_images_with_gpt_image.md)
* [Image Generation Guide](en/guides/image-generation.md)
* [OpenAI API Reference](en/api-reference/images.md)
* [Pricing Information](en/pricing.md)