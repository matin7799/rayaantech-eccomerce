# مدل‌های DeepSeek

AvalAI دسترسی یکپارچه به مدل‌های استدلال پیشرفته DeepSeek را از طریق API یکپارچه ما فراهم می‌کند. این صفحه مدل‌های DeepSeek موجود، قابلیت‌ها و موارد استفاده بهینه آن‌ها را با تمرکز بر آخرین نسل پرچم‌دار DeepSeek-V4 شرح می‌دهد.

## مدل‌های موجود

DeepSeek مدل‌های هوش مصنوعی پیشرفته با قابلیت‌های استدلال پیشرفته ارائه می‌دهد که دارای حالت‌های تفکری و غیرتفکری برای موارد استفاده مختلف است. خانواده V4 پنجره زمینه پیش‌فرض ۱ میلیون توکنی، DeepSeek Sparse Attention (DSA) و عملکرد به‌شدت بهبودیافته در کدنویسی عاملی و استدلال را ارائه می‌دهد.

### مدل‌های DeepSeek-V4

DeepSeek-V4 جدیدترین خانواده پرچم‌دار است که فشرده‌سازی توکنی با DeepSeek Sparse Attention (DSA)، زمینه پیش‌فرض ۱ میلیون توکنی، حداکثر ۳۸۴ هزار توکن خروجی و حالت‌های دوگانه تفکری/غیرتفکری را ارائه می‌دهد. بر اساس بنچمارک‌های DeepSeek، مدل V4-Pro در بنچمارک‌های کدنویسی عاملی به SOTA متن‌باز دست یافته و با برترین مدل‌های بسته در ریاضیات/STEM/کدنویسی رقابت می‌کند، در حالی که V4-Flash کیفیت استدلالی نزدیک به V4-Pro را با کسری از هزینه ارائه می‌دهد.

### deepseek-v4-flash

DeepSeek-V4-Flash یک مدل پرچم‌دار سریع، کارآمد و اقتصادی با ۲۸۴ میلیارد پارامتر کل / ۱۳ میلیارد پارامتر فعال است. قابلیت‌های استدلالی آن بسیار نزدیک به V4-Pro است و در وظایف عاملی ساده هم‌تراز با V4-Pro است، با هزینه کمتر و تأخیر سریع‌تر.

| ویژگی | جزئیات |
| ---------------------- | ------------------------------------------------------------------------------------------- |
| پنجره زمینه | ۱ میلیون توکن (پیش‌فرض) |
| حداکثر توکن خروجی | تا ۳۸۴ هزار |
| پارامترها | ۲۸۴ میلیارد کل / ۱۳ میلیارد فعال |
| حالت | دوگانه تفکری / غیرتفکری (از طریق `extra_body={"thinking": {"type": ...}}`) |
| قیمت‌گذاری ورودی (cache miss) | $0.14 / ۱ میلیون توکن |
| قیمت‌گذاری ورودی (cache hit) | $0.028 / ۱ میلیون توکن |
| قیمت‌گذاری خروجی | $0.28 / ۱ میلیون توکن |
| نقاط قوت | پرچم‌دار سریع و اقتصادی، استدلال نزدیک به V4-Pro، زمینه ۱ میلیونی، کارایی DSA |
| بهترین برای | برنامه‌های پرحجم، جریان‌های کاری عاملی، تحلیل اسناد با زمینه بزرگ |
| استدلال | استدلال CoT اختیاری از طریق `reasoning_effort` و کلید `thinking` |
| ویژگی‌ها | خروجی JSON ✓، فراخوانی ابزار ✓، تکمیل پیشوند چت (بتا) ✓، تکمیل FIM (بتا، فقط حالت غیرتفکری) ✓ |
| در دسترس از طریق | `v1/chat/completions` |

```python
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# حالت غیرتفکری برای پاسخ‌های سریع
response = client.chat.completions.create(
    model="deepseek-v4-flash",
    messages=[
        {
            "role": "user",
            "content": "مزایای پنجره زمینه ۱ میلیون توکنی برای تحلیل اسناد را خلاصه کنید.",
        }
    ],
    extra_body={"thinking": {"type": "disabled"}},
)

print(response.choices[0].message.content)
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `deepseek-v4-flash` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

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
    input="مزایای پنجره زمینه ۱ میلیون توکنی برای تحلیل اسناد را خلاصه کنید.",
)

print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


### deepseek-v4-pro

DeepSeek-V4-Pro توانمندترین مدل پرچم‌دار DeepSeek با ۱٫۶ تریلیون پارامتر کل / ۴۹ میلیارد پارامتر فعال است. بر اساس بنچمارک‌های DeepSeek، V4-Pro به SOTA متن‌باز در کدنویسی عاملی دست یافته، با برترین مدل‌های بسته در ریاضیات/STEM/کدنویسی رقابت می‌کند و دانش جهانی غنی ارائه می‌دهد که در میان مدل‌های متن‌باز فعلی فقط پس از Gemini-3.1-Pro قرار می‌گیرد.

| ویژگی | جزئیات |
| ---------------------- | ------------------------------------------------------------------------------------------- |
| پنجره زمینه | ۱ میلیون توکن (پیش‌فرض) |
| حداکثر توکن خروجی | تا ۳۸۴ هزار |
| پارامترها | ۱٫۶ تریلیون کل / ۴۹ میلیارد فعال |
| حالت | دوگانه تفکری / غیرتفکری (تفکری به‌صورت پیش‌فرض فعال) |
| تلاش استدلالی | `reasoning_effort: "high"` یا `"max"` (low/medium → high، xhigh → max) |
| قیمت‌گذاری ورودی (cache miss) | $1.74 / ۱ میلیون توکن |
| قیمت‌گذاری ورودی (cache hit) | $0.145 / ۱ میلیون توکن |
| قیمت‌گذاری خروجی | $3.48 / ۱ میلیون توکن |
| نقاط قوت | SOTA متن‌باز در کدنویسی عاملی، استدلال کلاس جهانی، دانش جهانی غنی |
| بهترین برای | استدلال پیچیده، کدنویسی عاملی، پژوهش، برنامه‌نویسی رقابتی، تحلیل زمینه طولانی |
| استدلال | فرآیند تفکر آشکار از طریق فیلد `reasoning_content` |
| ویژگی‌ها | خروجی JSON ✓، فراخوانی ابزار ✓، تکمیل پیشوند چت (بتا) ✓ |
| در دسترس از طریق | `v1/chat/completions` |

```python
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# حالت تفکری با تلاش استدلالی بالا
response = client.chat.completions.create(
    model="deepseek-v4-pro",
    messages=[
        {
            "role": "user",
            "content": "یک معماری تحمل‌پذیر خطا برای یک پردازنده پرداخت جهانی با ۵۰٬۰۰۰ TPS طراحی کنید.",
        }
    ],
    reasoning_effort="high",
    extra_body={"thinking": {"type": "enabled"}},
)

print(response.choices[0].message.reasoning_content)
print(response.choices[0].message.content)
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `deepseek-v4-pro` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

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
    input="یک معماری تحمل‌پذیر خطا برای یک پردازنده پرداخت جهانی با ۵۰٬۰۰۰ TPS طراحی کنید.",
)

print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


### مدل‌های DeepSeek-V3.2 (نام‌های قدیمی)

> ⚠️ **اعلان منسوخ‌سازی:** نام‌های `deepseek-chat` و `deepseek-reasoner` اکنون به خانواده DeepSeek V4 هدایت می‌شوند (به ترتیب `deepseek-v4-flash` و `deepseek-v4-pro`) و در تاریخ **۲۴ ژوئیه ۲۰۲۶، ساعت ۱۵:۵۹ (UTC)** به طور کامل بازنشسته خواهند شد. لطفا به نام‌های صریح V4 مهاجرت کنید. برای جزئیات به [منسوخ‌سازی‌ها](fa/deprecations.md) مراجعه کنید.

### deepseek-chat

`deepseek-chat` اکنون به **`deepseek-v4-flash`** هدایت می‌شود (به‌صورت پیش‌فرض حالت غیرتفکری). قیمت‌گذاری نسبت به `deepseek-v4-flash` بدون تغییر است.

| ویژگی | جزئیات |
| ---------------------- | ------------------------------------------------------------------------------------------- |
| هدایت به | `deepseek-v4-flash` |
| پنجره زمینه | ۱ میلیون توکن (به ارث رسیده از V4-Flash) |
| حداکثر توکن خروجی | تا ۳۸۴ هزار |
| حالت | غیرتفکری به‌صورت پیش‌فرض |
| قیمت‌گذاری ورودی (cache miss) | $0.14 / ۱ میلیون توکن |
| قیمت‌گذاری ورودی (cache hit) | $0.028 / ۱ میلیون توکن |
| قیمت‌گذاری خروجی | $0.28 / ۱ میلیون توکن |
| نقاط قوت | سریع، اقتصادی، استدلال نزدیک به V4-Pro، زمینه ۱ میلیونی، کارایی DSA |
| بهترین برای | یکپارچه‌سازی‌های موجود که به نام `deepseek-chat` متکی هستند |
| استدلال | استدلال CoT اختیاری از طریق `reasoning_effort` و کلید `thinking` |
| ویژگی‌ها | خروجی JSON ✓، فراخوانی ابزار ✓، تکمیل پیشوند چت (بتا) ✓، تکمیل FIM (بتا، فقط حالت غیرتفکری) ✓ |

```python
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="deepseek-chat",
    messages=[
        {
            "role": "user",
            "content": "مفهوم درهم‌تنیدگی کوانتومی را به زبان ساده توضیح دهید",
        }
    ],
)

print(response.choices[0].message.content)
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `deepseek-chat` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

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
    input="مفهوم درهم‌تنیدگی کوانتومی را به زبان ساده توضیح دهید",
)

print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


### deepseek-reasoner

`deepseek-reasoner` اکنون به **`deepseek-v4-pro`** هدایت می‌شود (به‌صورت پیش‌فرض حالت تفکری). **قیمت‌گذاری افزایش یافته** تا با `deepseek-v4-pro` هماهنگ شود و ارتقاء مدل زیرین را بازتاب دهد.

| ویژگی | جزئیات |
| ---------------------- | ------------------------------------------------------------------------------------------- |
| هدایت به | `deepseek-v4-pro` |
| پنجره زمینه | ۱ میلیون توکن (به ارث رسیده از V4-Pro) |
| حداکثر توکن خروجی | تا ۳۸۴ هزار |
| حالت | تفکری به‌صورت پیش‌فرض (فعال) |
| تلاش استدلالی | `reasoning_effort: "high"` یا `"max"` |
| قیمت‌گذاری ورودی (cache miss) | $1.74 / ۱ میلیون توکن ⬆️ (افزایش) |
| قیمت‌گذاری ورودی (cache hit) | $0.145 / ۱ میلیون توکن ⬆️ (افزایش) |
| قیمت‌گذاری خروجی | $3.48 / ۱ میلیون توکن ⬆️ (افزایش) |
| نقاط قوت | SOTA متن‌باز در کدنویسی عاملی، استدلال کلاس جهانی، دانش جهانی غنی |
| بهترین برای | یکپارچه‌سازی‌های موجود که به نام `deepseek-reasoner` متکی هستند |
| استدلال | فرآیند تفکر آشکار از طریق فیلد `reasoning_content` |
| ویژگی‌ها | خروجی JSON ✓، فراخوانی ابزار ✓، تکمیل پیشوند چت (بتا) ✓ |

```python
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="deepseek-reasoner",
    messages=[
        {
            "role": "user",
            "content": "این مسئله ریاضی پیچیده را گام به گام حل کنید: اگر قطاری ۱۲۰ مایل را در ۲ ساعت طی کند، سپس سرعت خود را ۲۵٪ افزایش دهد برای ۳ ساعت بعدی، در مجموع چه مسافتی طی کرده است؟",
        }
    ],
)

print(response.choices[0].message.content)
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `deepseek-reasoner` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

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
    input="این مسئله ریاضی پیچیده را گام به گام حل کنید: اگر قطاری ۱۲۰ مایل را در ۲ ساعت طی کند، سپس سرعت خود را ۲۵٪ افزایش دهد برای ۳ ساعت بعدی، در مجموع چه مسافتی طی کرده است؟",
)

print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


### deepseek-v3.2

DeepSeek-V3.2 از طریق Azure AI، هماهنگ کننده کارایی محاسباتی بالا با استدلال برتر و عملکرد عامل. دارای DeepSeek Sparse Attention (DSA) برای سناریوهای کارآمد با متن بلند.

| ویژگی | جزئیات |
| ---------------------- | ------------------------------------------------------------------------------------------- |
| پنجره زمینه | ۱۲۸ هزار توکن |
| حداکثر توکن خروجی | محدودیت‌های خروجی استاندارد |
| ارائه‌دهنده | Azure AI |
| حالت | حالت غیرتفکری برای پاسخ‌های کارآمد |
| قیمت‌گذاری ورودی | $0.28 / ۱ میلیون توکن |
| قیمت‌گذاری ورودی (cache hit) | $0.028 / ۱ میلیون توکن |
| قیمت‌گذاری خروجی | $0.42 / ۱ میلیون توکن |
| نقاط قوت | پاسخ‌های سریع، پردازش کارآمد، استفاده بهبود یافته از ابزار، عملکرد سطح GPT-5 |
| بهترین برای | گفتگوی عمومی، پاسخ‌های سریع، برنامه‌های پرحجم، وظایف عامل |
| استدلال | استدلال استاندارد بدون فرآیند تفکر آشکار |
| قابلیت‌ها | JSON Output ✓، Tool Calls ✓، Chat Prefix Completion (Beta) ✓ |
| در دسترس در | `v1/chat/completions`، `v1/completions`، `v1/responses`، `v1/messages` |

**مزایای میزبانی Azure AI:**
- **محدودیت‌های نرخ بهتر**: توان عملیاتی بالاتر نسبت به API مستقیم DeepSeek
- **تاخیر کمتر**: زمان پاسخ سریع‌تر از طریق زیرساخت جهانی Azure
- **قابلیت اطمینان بهتر**: دسترسی‌پذیری و عملکرد در سطح سازمانی

```python
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="deepseek-v3.2",
    messages=[
        {
            "role": "user",
            "content": "یک تابع Python برای پیاده‌سازی درخت جستجوی دودویی بنویس",
        }
    ],
)

print(response.choices[0].message.content)
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `deepseek-v3.2` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

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
    input="یک تابع Python برای پیاده‌سازی درخت جستجوی دودویی بنویس",
)

print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


### deepseek-v3.2-speciale

DeepSeek-V3.2-Speciale از طریق Azure AI، یک نوع با محاسبات بالا که از GPT-5 پیشی گرفته و مهارت استدلال هم‌سطح با Gemini-3.0-Pro را نشان می‌دهد. در المپیاد بین‌المللی ریاضی ۲۰۲۵ (IMO) و المپیاد بین‌المللی انفورماتیک (IOI) به عملکرد مدال طلا دست یافت.

| ویژگی | جزئیات |
| ---------------------- | ------------------------------------------------------------------------------------------- |
| پنجره زمینه | ۱۲۸ هزار توکن |
| حداکثر توکن خروجی | محدودیت‌های خروجی گسترده برای استدلال |
| ارائه‌دهنده | Azure AI |
| حالت | حالت استدلال عمیق (تفکر) |
| قیمت‌گذاری ورودی | $0.28 / ۱ میلیون توکن |
| قیمت‌گذاری ورودی (cache hit) | $0.028 / ۱ میلیون توکن |
| قیمت‌گذاری خروجی | $0.42 / ۱ میلیون توکن |
| نقاط قوت | استدلال سطح متخصص، عملکرد سطح المپیاد، پیشی از GPT-5 |
| بهترین برای | ریاضیات پیچیده، برنامه‌نویسی رقابتی، تحقیق، تحلیل عمیق |
| استدلال | تفکر گسترده با فرآیند استدلال آشکار |
| قابلیت‌ها | JSON Output ✓، Chat Prefix Completion (Beta) ✓ |
| فراخوانی ابزار | ✗ پشتیبانی نمی‌شود (فقط برای وظایف استدلال طراحی شده) |
| در دسترس در | `v1/chat/completions`، `v1/completions`، `v1/responses`، `v1/messages` |

**دستاوردهای کلیدی:**
- 🥇 عملکرد مدال طلا در المپیاد بین‌المللی ریاضی ۲۰۲۵ (IMO)
- 🥇 عملکرد مدال طلا در المپیاد بین‌المللی انفورماتیک (IOI)
- مهارت استدلال هم‌سطح با Gemini-3.0-Pro

**نکته مهم:** DeepSeek-V3.2-Speciale به طور انحصاری برای وظایف استدلال عمیق طراحی شده و از قابلیت فراخوانی ابزار پشتیبانی نمی‌کند.

```python
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="deepseek-v3.2-speciale",
    messages=[
        {
            "role": "user",
            "content": "این مسئله IMO را حل کن: همه اعداد صحیح مثبت n را پیدا کن به طوری که n^2 + 1 بر n^3 + n + 1 بخش‌پذیر باشد",
        }
    ],
    max_tokens=4096,
)

print(response.choices[0].message.content)
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `deepseek-v3.2-speciale` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

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
    input="این مسئله IMO را حل کن: همه اعداد صحیح مثبت n را پیدا کن به طوری که n^2 + 1 بر n^3 + n + 1 بخش‌پذیر باشد",
)

print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


### deepseek-v3.1

DeepSeek-V3.1 از طریق Azure AI، دسترسی مستقیم به آخرین مدل با استفاده بهبود یافته از ابزار و قابلیت‌های عامل.

| ویژگی | جزئیات |
| ---------------------- | ------------------------------------------------------------------------------------------- |
| پنجره زمینه | ۱۲۸ هزار توکن |
| حداکثر توکن خروجی | محدودیت‌های خروجی استاندارد |
| ارائه‌دهنده | Azure AI |
| حالت | حالت غیرتفکری برای پاسخ‌های کارآمد |
| قیمت‌گذاری ورودی (cache hit) | $0.07 / ۱ میلیون توکن |
| قیمت‌گذاری ورودی (cache miss) | $0.27 / ۱ میلیون توکن |
| قیمت‌گذاری خروجی | $1.10 / ۱ میلیون توکن |
| نقاط قوت | پاسخ‌های سریع، پردازش کارآمد، استفاده بهبود یافته از ابزار، گردش‌کارهای عامل |
| بهترین برای | گفتگوی عمومی، پاسخ‌های سریع، برنامه‌های پرحجم، وظایف عامل |
| استدلال | استدلال استاندارد بدون فرآیند تفکر آشکار |
| در دسترس در | `v1/chat/completions`، `v1/responses`، `v1/messages` |

```python
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="deepseek-v3.1",
    messages=[
        {
            "role": "user",
            "content": "یک تابع Python برای تجزیه و تحلیل فایل‌های لاگ و استخراج الگوهای خطا ایجاد کنید",
        }
    ],
)

print(response.choices[0].message.content)
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `deepseek-v3.1` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

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
    input="یک تابع Python برای تجزیه و تحلیل فایل‌های لاگ و استخراج الگوهای خطا ایجاد کنید",
)

print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


## قابلیت‌های کلیدی

### استنتاج ترکیبی

DeepSeek-V3.2 قابلیت‌های استنتاج ترکیبی منحصر به فردی ارائه می‌دهد که به کاربران امکان انتخاب بین حالت‌های تفکری و غیرتفکری بسته به نیازهایشان را می‌دهد:

- **حالت غیرتفکری** (`deepseek-chat`): استنتاج متعادل در برابر طول - مدل روزانه شما با عملکرد سطح GPT-5
- **حالت تفکری** (`deepseek-reasoner`): قابلیت‌های استدلال حداکثری که رقیب Gemini-3.0-Pro است

### جزئیات API حالت تفکری

هنگام استفاده از حالت تفکری (`deepseek-reasoner`)، API دو فیلد محتوا برمی‌گرداند:

- **`reasoning_content`**: فرآیند استدلال زنجیره‌ای (CoT)
- **`content`**: پاسخ نهایی

**دسترسی به محتوای استدلال:**

```language-selector
bash=:curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "deepseek-reasoner",
    "messages": [
      {
        "role": "user",
        "content": "۹.۱۱ و ۹.۸، کدام بزرگتر است؟"
      }
    ]
  }'

# پاسخ شامل:
# - choices[0].message.reasoning_content: استدلال CoT
# - choices[0].message.content: پاسخ نهایی

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

response = client.chat.completions.create(
    model="deepseek-reasoner",
    messages=[{"role": "user", "content": "۹.۱۱ و ۹.۸، کدام بزرگتر است؟"}],
)

# دسترسی به فرآیند استدلال
reasoning_content = response.choices[0].message.reasoning_content
# دسترسی به پاسخ نهایی
content = response.choices[0].message.content

print(f"استدلال: {reasoning_content}")
print(f"پاسخ: {content}")

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
    apiKey: process.env.AVALAI_API_KEY,
    baseURL: "https://api.avalai.ir/v1"
});

const response = await client.chat.completions.create({
    model: "deepseek-reasoner",
    messages: [{ role: "user", content: "۹.۱۱ و ۹.۸، کدام بزرگتر است؟" }]
});

// دسترسی به فرآیند استدلال
const reasoningContent = response.choices[0].message.reasoning_content;
// دسترسی به پاسخ نهایی
const content = response.choices[0].message.content;

console.log(`استدلال: ${reasoningContent}`);
console.log(`پاسخ: ${content}`);

php=:<?php
require 'vendor/autoload.php';

use OpenAI;

$client = OpenAI::factory()
    ->withApiKey(getenv('AVALAI_API_KEY'))
    ->withBaseUri('https://api.avalai.ir/v1')
    ->make();

$response = $client->chat()->create([
    'model' => 'deepseek-reasoner',
    'messages' => [
        ['role' => 'user', 'content' => '۹.۱۱ و ۹.۸، کدام بزرگتر است؟']
    ]
]);

// دسترسی به فرآیند استدلال
$reasoningContent = $response->choices[0]->message->reasoning_content ?? null;
// دسترسی به پاسخ نهایی
$content = $response->choices[0]->message->content;

echo "استدلال: " . $reasoningContent . "\n";
echo "پاسخ: " . $content . "\n";

```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `deepseek-reasoner` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

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
    instructions="You are a helpful assistant.",
    input="۹.۱۱ و ۹.۸، کدام بزرگتر است؟",
)

print(response.output_text)

javascript=:import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.responses.create({
  model: "gpt-5.5",
  instructions: "You are a helpful assistant.",
  input: "۹.۱۱ و ۹.۸، کدام بزرگتر است؟",
});

console.log(response.output_text);

bash=:curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '
  {
    "model": "gpt-5.5",
    "input": "۹.۱۱ و ۹.۸، کدام بزرگتر است؟",
    "instructions": "You are a helpful assistant."
  }'

```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


### مکالمات چند نوبتی

در مکالمات چند نوبتی با حالت تفکری:

- هر نوبت هم `reasoning_content` و هم `content` را خروجی می‌دهد
- **مهم**: هنگام ادامه مکالمه، فقط `content` از نوبت‌های قبلی را ارسال کنید، نه `reasoning_content`
- `reasoning_content` از نوبت‌های قبلی در زمینه متصل نمی‌شود

```language-selector
bash=:# نوبت ۱
RESPONSE=$(curl -s https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "deepseek-reasoner",
    "messages": [
      {"role": "user", "content": "۱۵ + ۲۷ چند می‌شود؟"}
    ]
  }')

CONTENT=$(echo $RESPONSE | jq -r '.choices[0].message.content')

# نوبت ۲ - فقط content را ارسال کنید، نه reasoning_content
curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d "{
    \"model\": \"deepseek-reasoner\",
    \"messages\": [
      {\"role\": \"user\", \"content\": \"۱۵ + ۲۷ چند می‌شود؟\"},
      {\"role\": \"assistant\", \"content\": \"$CONTENT\"},
      {\"role\": \"user\", \"content\": \"حالا آن را در ۲ ضرب کن.\"}
    ]
  }"

python=:from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

# نوبت ۱
messages = [{"role": "user", "content": "۱۵ + ۲۷ چند می‌شود؟"}]
response = client.chat.completions.create(model="deepseek-reasoner", messages=messages)

reasoning_content = response.choices[0].message.reasoning_content
content = response.choices[0].message.content

# نوبت ۲ - فقط content را ارسال کنید، نه reasoning_content
messages.append({"role": "assistant", "content": content})
messages.append({"role": "user", "content": "حالا آن را در ۲ ضرب کن."})

response = client.chat.completions.create(model="deepseek-reasoner", messages=messages)

print(response.choices[0].message.content)

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
    apiKey: process.env.AVALAI_API_KEY,
    baseURL: "https://api.avalai.ir/v1"
});

// نوبت ۱
let messages = [{ role: "user", content: "۱۵ + ۲۷ چند می‌شود؟" }];
let response = await client.chat.completions.create({
    model: "deepseek-reasoner",
    messages: messages
});

const reasoningContent = response.choices[0].message.reasoning_content;
const content = response.choices[0].message.content;

// نوبت ۲ - فقط content را ارسال کنید، نه reasoning_content
messages.push({ role: "assistant", content: content });
messages.push({ role: "user", content: "حالا آن را در ۲ ضرب کن." });

response = await client.chat.completions.create({
    model: "deepseek-reasoner",
    messages: messages
});

console.log(response.choices[0].message.content);

php=:<?php
require 'vendor/autoload.php';

use OpenAI;

$client = OpenAI::factory()
    ->withApiKey(getenv('AVALAI_API_KEY'))
    ->withBaseUri('https://api.avalai.ir/v1')
    ->make();

// نوبت ۱
$messages = [['role' => 'user', 'content' => '۱۵ + ۲۷ چند می‌شود؟']];
$response = $client->chat()->create([
    'model' => 'deepseek-reasoner',
    'messages' => $messages
]);

$reasoningContent = $response->choices[0]->message->reasoning_content ?? null;
$content = $response->choices[0]->message->content;

// نوبت ۲ - فقط content را ارسال کنید، نه reasoning_content
$messages[] = ['role' => 'assistant', 'content' => $content];
$messages[] = ['role' => 'user', 'content' => 'حالا آن را در ۲ ضرب کن.'];

$response = $client->chat()->create([
    'model' => 'deepseek-reasoner',
    'messages' => $messages
]);

echo $response->choices[0]->message->content . "\n";

```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `deepseek-reasoner` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

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
    instructions="You are a helpful assistant.",
    input="حالا آن را در ۲ ضرب کن.",
)

print(response.output_text)

javascript=:import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const response = await client.responses.create({
  model: "gpt-5.5",
  instructions: "You are a helpful assistant.",
  input: "حالا آن را در ۲ ضرب کن.",
});

console.log(response.output_text);

bash=:curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '
  {
    "model": "gpt-5.5",
    "input": "حالا آن را در ۲ ضرب کن.",
    "instructions": "You are a helpful assistant."
  }'

```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


### تفکر در استفاده از ابزار

DeepSeek-V3.2 اولین مدل DeepSeek است که تفکر را مستقیما در استفاده از ابزار یکپارچه می‌کند:

- **پشتیبانی از حالت دوگانه**: پشتیبانی از استفاده از ابزار در هر دو حالت تفکری و غیرتفکری
- **داده‌های آموزش عامل**: سنتز داده‌های آموزش عامل گسترده شامل ۱۸۰۰+ محیط و ۸۵ هزار+ دستورالعمل پیچیده
- **استدلال بهبود یافته**: قابلیت بهبود یافته برای استدلال در تعاملات پیچیده با ابزار

**⚠️ بحرانی: فراخوانی ابزار با حالت تفکری**

هنگام استفاده از فراخوانی ابزار با حالت تفکری، **باید** `reasoning_content` را در درخواست‌های بعدی در همان نوبت به API برگردانید. عدم انجام این کار منجر به خطای ۴۰۰ می‌شود:

```
Missing reasoning_content field in the assistant message
```

**پیاده‌سازی صحیح فراخوانی ابزار:**

```language-selector
bash=:# توجه: فراخوانی ابزار با حالت تفکری نیاز به مدیریت دقیق reasoning_content دارد
# این یک مثال ساده است - برای پیاده‌سازی کامل به Python/JS مراجعه کنید

curl https://api.avalai.ir/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '{
    "model": "deepseek-reasoner",
    "messages": [
      {"role": "user", "content": "آب و هوای تهران امروز چطور است؟"}
    ],
    "tools": [
      {
        "type": "function",
        "function": {
          "name": "get_weather",
          "description": "دریافت آب و هوای یک مکان",
          "parameters": {
            "type": "object",
            "properties": {
              "location": {"type": "string", "description": "نام شهر"}
            },
            "required": ["location"]
          }
        }
      }
    ]
  }'

# مهم: وقتی مدل tool_calls برمی‌گرداند، باید
# reasoning_content را در پیام دستیار هنگام ارسال نتایج ابزار درج کنید

python=:import json
from openai import OpenAI

client = OpenAI(api_key="your-avalai-api-key", base_url="https://api.avalai.ir/v1")

tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "دریافت آب و هوای یک مکان",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {"type": "string", "description": "نام شهر"},
                },
                "required": ["location"],
            },
        },
    },
]

messages = [{"role": "user", "content": "آب و هوای تهران امروز چطور است؟"}]

while True:
    response = client.chat.completions.create(
        model="deepseek-reasoner", messages=messages, tools=tools
    )

    message = response.choices[0].message
    reasoning_content = message.reasoning_content
    content = message.content
    tool_calls = message.tool_calls

    # اگر فراخوانی ابزار نداشتیم، پاسخ نهایی را داریم
    if not tool_calls:
        print(f"پاسخ نهایی: {content}")
        break

    # بحرانی: reasoning_content را هنگام اضافه کردن پیام دستیار درج کنید
    assistant_message = {
        "role": "assistant",
        "content": content or "",
        "tool_calls": [
            {
                "id": tc.id,
                "type": "function",
                "function": {
                    "name": tc.function.name,
                    "arguments": tc.function.arguments,
                },
            }
            for tc in tool_calls
        ],
    }

    # باید reasoning_content را اگر موجود بود درج کنید
    if reasoning_content:
        assistant_message["reasoning_content"] = reasoning_content

    messages.append(assistant_message)

    # پردازش فراخوانی‌های ابزار و اضافه کردن نتایج
    for tc in tool_calls:
        # پیاده‌سازی ابزار شما در اینجا
        tool_result = "آفتابی، ۱۵-۲۲ درجه سانتیگراد"  # نتیجه نمونه
        messages.append(
            {
                "role": "tool",
                "tool_call_id": tc.id,
                "content": tool_result,
            }
        )

javascript=:import { OpenAI } from "openai";

const client = new OpenAI({
    apiKey: process.env.AVALAI_API_KEY,
    baseURL: "https://api.avalai.ir/v1"
});

const tools = [
    {
        type: "function",
        function: {
            name: "get_weather",
            description: "دریافت آب و هوای یک مکان",
            parameters: {
                type: "object",
                properties: {
                    location: { type: "string", description: "نام شهر" }
                },
                required: ["location"]
            }
        }
    }
];

let messages = [{ role: "user", content: "آب و هوای تهران امروز چطور است؟" }];

while (true) {
    const response = await client.chat.completions.create({
        model: "deepseek-reasoner",
        messages: messages,
        tools: tools
    });
    
    const message = response.choices[0].message;
    const reasoningContent = message.reasoning_content;
    const content = message.content;
    const toolCalls = message.tool_calls;
    
    // اگر فراخوانی ابزار نداشتیم، پاسخ نهایی را داریم
    if (!toolCalls) {
        console.log(`پاسخ نهایی: ${content}`);
        break;
    }
    
    // بحرانی: reasoning_content را هنگام اضافه کردن پیام دستیار درج کنید
    const assistantMessage = {
        role: "assistant",
        content: content || "",
        tool_calls: toolCalls.map(tc => ({
            id: tc.id,
            type: "function",
            function: {
                name: tc.function.name,
                arguments: tc.function.arguments
            }
        }))
    };
    
    // باید reasoning_content را اگر موجود بود درج کنید
    if (reasoningContent) {
        assistantMessage.reasoning_content = reasoningContent;
    }
    
    messages.push(assistantMessage);
    
    // پردازش فراخوانی‌های ابزار و اضافه کردن نتایج
    for (const tc of toolCalls) {
        // پیاده‌سازی ابزار شما در اینجا
        const toolResult = "آفتابی، ۱۵-۲۲ درجه سانتیگراد";  // نتیجه نمونه
        messages.push({
            role: "tool",
            tool_call_id: tc.id,
            content: toolResult
        });
    }
}

php=:<?php
require 'vendor/autoload.php';

use OpenAI;

$client = OpenAI::factory()
    ->withApiKey(getenv('AVALAI_API_KEY'))
    ->withBaseUri('https://api.avalai.ir/v1')
    ->make();

$tools = [
    [
        'type' => 'function',
        'function' => [
            'name' => 'get_weather',
            'description' => 'دریافت آب و هوای یک مکان',
            'parameters' => [
                'type' => 'object',
                'properties' => [
                    'location' => ['type' => 'string', 'description' => 'نام شهر']
                ],
                'required' => ['location']
            ]
        ]
    ]
];

$messages = [['role' => 'user', 'content' => 'آب و هوای تهران امروز چطور است؟']];

while (true) {
    $response = $client->chat()->create([
        'model' => 'deepseek-reasoner',
        'messages' => $messages,
        'tools' => $tools
    ]);
    
    $message = $response->choices[0]->message;
    $reasoningContent = $message->reasoning_content ?? null;
    $content = $message->content;
    $toolCalls = $message->tool_calls ?? null;
    
    // اگر فراخوانی ابزار نداشتیم، پاسخ نهایی را داریم
    if (!$toolCalls) {
        echo "پاسخ نهایی: " . $content . "\n";
        break;
    }
    
    // بحرانی: reasoning_content را هنگام اضافه کردن پیام دستیار درج کنید
    $assistantMessage = [
        'role' => 'assistant',
        'content' => $content ?? '',
        'tool_calls' => array_map(function($tc) {
            return [
                'id' => $tc->id,
                'type' => 'function',
                'function' => [
                    'name' => $tc->function->name,
                    'arguments' => $tc->function->arguments
                ]
            ];
        }, $toolCalls)
    ];
    
    // باید reasoning_content را اگر موجود بود درج کنید
    if ($reasoningContent) {
        $assistantMessage['reasoning_content'] = $reasoningContent;
    }
    
    $messages[] = $assistantMessage;
    
    // پردازش فراخوانی‌های ابزار و اضافه کردن نتایج
    foreach ($toolCalls as $tc) {
        // پیاده‌سازی ابزار شما در اینجا
        $toolResult = "آفتابی، ۱۵-۲۲ درجه سانتیگراد";  // نتیجه نمونه
        $messages[] = [
            'role' => 'tool',
            'tool_call_id' => $tc->id,
            'content' => $toolResult
        ];
    }
}

```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `deepseek-reasoner` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

Use this version when the selected model supports `/v1/responses`. `messages` moves to `input`, and the final text is read from `response.output_text`.

```language-selector
python=:import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["AVALAI_API_KEY"],
    base_url="https://api.avalai.ir/v1",
)

tools = [
    {
        "type": "function",
        "name": "get_current_weather",
        "description": "Get the current weather in a given location.",
        "parameters": {
            "type": "object",
            "properties": {"location": {"type": "string"}},
            "required": ["location"],
            "additionalProperties": False,
        },
    }
]

response = client.responses.create(
    model="gpt-5.5",
    input="آب و هوای تهران امروز چطور است؟",
    tools=tools,
)

for item in response.output:
    if item.type == "function_call":
        print(item.name, item.arguments)
print(response.output_text)

javascript=:import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.AVALAI_API_KEY,
  baseURL: "https://api.avalai.ir/v1",
});

const tools = [
  {
    type: "function",
    name: "get_current_weather",
    description: "Get the current weather in a given location.",
    parameters: {
      type: "object",
      properties: { location: { type: "string" } },
      required: ["location"],
      additionalProperties: false,
    },
  },
];

const response = await client.responses.create({
  model: "gpt-5.5",
  input: "آب و هوای تهران امروز چطور است؟",
  tools,
});

for (const item of response.output) {
  if (item.type === "function_call") {
    console.log(item.name, item.arguments);
  }
}
console.log(response.output_text);

bash=:curl https://api.avalai.ir/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AVALAI_API_KEY" \
  -d '
  {
    "model": "gpt-5.5",
    "input": "آب و هوای تهران امروز چطور است؟",
    "tools": [
      {
        "type": "function",
        "name": "get_current_weather",
        "description": "Get the current weather in a given location.",
        "parameters": {
          "type": "object",
          "properties": {
            "location": {
              "type": "string"
            }
          },
          "required": [
            "location"
          ],
          "additionalProperties": false
        }
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


**نکات مهم برای فراخوانی ابزار:**

1. در یک نوبت واحد (هنگام پردازش فراخوانی‌های ابزار)، همیشه `reasoning_content` را در پیام‌های دستیار درج کنید
2. هنگام شروع نوبت جدید کاربر، می‌توانید `reasoning_content` را از تاریخچه پاک کنید تا پهنای باند ذخیره شود
3. شیء `response.choices[0].message` شامل تمام فیلدهای لازم است - می‌توانید آن را مستقیما به messages اضافه کنید

### مهارت‌های عامل بهبود یافته

DeepSeek-V3.2 دارای بهبودهای قابل توجه در قابلیت‌های عامل است:

- **استفاده از ابزار**: قابلیت بهبود یافته برای استفاده از ابزارها و API های خارجی با یکپارچه‌سازی تفکر
- **وظایف چندمرحله‌ای**: عملکرد بهتر در گردش‌های کاری عامل پیچیده و چندمرحله‌ای
- **فراخوانی تابع**: قابلیت‌های بهبود یافته فراخوانی تابع برای ادغام با سیستم‌های خارجی

### استدلال پیشرفته

حالت تفکری ارائه می‌دهد:

- **تحلیل گام به گام**: تجزیه واضح مسائل پیچیده
- **استدلال شفاف**: فرآیندهای تفکر آشکار برای درک بهتر
- **عملکرد مدال طلا**: DeepSeek-V3.2-Speciale نتایج سطح طلا در IMO، CMO، فینال جهانی ICPC و IOI 2025 کسب کرده است

### بنچمارک‌های عملکرد (بر اساس ادعاهای DeepSeek)

DeepSeek-V3.2 بهبودهای قابل توجهی در معیارهای کلیدی نشان می‌دهد:

- **سطح GPT-5**: حالت غیرتفکری عملکردی در سطح GPT-5 ارائه می‌دهد
- **رقیب Gemini-3.0-Pro**: حالت تفکری رقیب قابلیت‌های Gemini-3.0-Pro است
- **استدلال چندمرحله‌ای**: قابلیت بهبود یافته برای جستجو و تحلیل پیچیده

## راهنمای انتخاب مدل

### انتخاب بین deepseek-chat و deepseek-reasoner

هنگام انتخاب مدل DeepSeek از طریق AvalAI، موارد زیر را در نظر بگیرید:

1. **پیچیدگی وظیفه**: از `deepseek-reasoner` برای مسائل پیچیده که نیاز به تحلیل گام به گام دارند استفاده کنید
2. **نیازهای سرعت**: از `deepseek-chat` برای پاسخ‌های سریع‌تر در برنامه‌های پرحجم استفاده کنید
3. **نیازهای شفافیت**: از `deepseek-reasoner` زمانی استفاده کنید که نیاز به دیدن فرآیند استدلال دارید
4. **طول خروجی**: `deepseek-reasoner` از خروجی‌های بلندتر (تا ۶۴ هزار) در مقابل `deepseek-chat` (تا ۸ هزار) پشتیبانی می‌کند
5. **یکپارچه‌سازی ابزار**: هر دو مدل از تفکر در استفاده از ابزار برای گردش‌های کاری عامل بهبود یافته پشتیبانی می‌کنند

## اطلاعات قیمت‌گذاری

مدل‌های DeepSeek-V3.2 از طریق AvalAI با قیمت‌گذاری رقابتی بر اساس استفاده از توکن در دسترس هستند:

| مدل | Cache Hit (ورودی) | Cache Miss (ورودی) | خروجی |
|-------|-------------------|-------------------|--------|
| deepseek-chat | $0.028 / ۱ میلیون توکن | $0.28 / ۱ میلیون توکن | $0.42 / ۱ میلیون توکن |
| deepseek-reasoner | $0.028 / ۱ میلیون توکن | $0.28 / ۱ میلیون توکن | $0.42 / ۱ میلیون توکن |

### نکات قیمت‌گذاری

- **Cache Hit**: زمانی که توکن‌های ورودی در حافظه نهان مدل یافت شوند، هزینه پردازش کاهش می‌یابد
- **Cache Miss**: زمانی که توکن‌های ورودی نیاز به پردازش کامل دارند
- **تاریخ اعمال**: قیمت‌گذاری به‌روزرسانی شده ۱ دسامبر ۲۰۲۵، با انتشار DeepSeek-V3.2
- **مرجع**: برای به‌روزترین اطلاعات قیمت‌گذاری، از [قیمت‌گذاری API دیپ‌سیک](https://api-docs.deepseek.com/quick_start/pricing/) بازدید کنید

### مقایسه عملکرد

| وظیفه | مدل DeepSeek توصیه شده | مدل‌های جایگزین |
| --------------------------------- | ----------------------------- | ------------------------------ |
| استدلال پیچیده / تحلیل | deepseek-reasoner | Claude Opus 4.7، GPT-5.5 Pro، GPT-5.5 |
| گفتگوی عمومی / تولید محتوا | deepseek-v4-flash | Claude Sonnet 4.6، GPT-5.5 |
| مسائل ریاضی | deepseek-v4-pro | GPT-5.5,  Claude Opus 4.7 |
| تحلیل کد / اشکال‌زدایی | deepseek-v4-pro | Claude Sonnet 4.6، GPT-5.5 |
| برنامه‌های پرحجم | deepseek-v4-flash | Claude Haiku 4.5، GPT-5.4 mini |

## بهترین شیوه‌ها برای مدل‌های DeepSeek

### پرامپت‌نویسی مؤثر

دستورالعمل‌های واضح و مشخص ارائه دهید. برای وظایف استدلالی، هنگام استفاده از `deepseek-reasoner` صراحتا تحلیل گام به گام درخواست کنید.

### دستورالعمل‌های سیستم

از نقش `system` به طور مؤثر برای راهنمایی رفتار مدل و سبک پاسخ به طور مداوم در هر دو مدل استفاده کنید.

### Temperature و Top_P

`temperature` و `top_p` را برای کنترل تصادفی تنظیم کنید. مقادیر پایین‌تر (مثل temp=0.2) خروجی‌های قطعی‌تری تولید می‌کنند، در حالی که مقادیر بالاتر (مثل temp=0.8) خلاقیت را تشویق می‌کنند.

## استفاده از مدل‌های DeepSeek از طریق AvalAI

همه مدل‌های DeepSeek از طریق نقاط پایانی استاندارد API AvalAI، با استفاده از کتابخانه‌های کلاینت سازگار با OpenAI قابل دسترسی هستند:

```python
from openai import OpenAI

client = OpenAI(
    api_key="your-avalai-api-key",  # با کلید API واقعی خود جایگزین کنید
    base_url="https://api.avalai.ir/v1",  # نقطه پایانی API AvalAI
)

# از هر مدل DeepSeek با شناسه AvalAI آن استفاده کنید
response = client.chat.completions.create(
    model="deepseek-chat",  # یا "deepseek-reasoner"
    messages=[{"role": "user", "content": "سلام!"}],
)
```

<!-- responses-equivalent:start -->
<details>
<summary>Responses API version This version uses `gpt-5.5` because `deepseek-chat` may not be enabled for `/v1/responses` in the current AvalAI model data.</summary>

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
    input="سلام!",
)

print(response.output_text)
```

- `messages` → `input`
- system message → `instructions` or a `developer` item
- `choices[0].message.content` → `response.output_text`
- for tools and multimodal output, inspect `response.output` by item `type`.

</details>
<!-- responses-equivalent:end -->


## نکات مهم

### مسیریابی مدل

- **deepseek-v4-flash** و **deepseek-v4-pro** نام‌های صریح جدید مدل‌های پرچم‌دار DeepSeek V4 هستند (توصیه می‌شود).
- **deepseek-chat** اکنون به **deepseek-v4-flash** هدایت می‌شود (به‌صورت پیش‌فرض حالت غیرتفکری).
- **deepseek-reasoner** اکنون به **deepseek-v4-pro** هدایت می‌شود (به‌صورت پیش‌فرض حالت تفکری).
- نام‌های قدیمی `deepseek-chat` و `deepseek-reasoner` در **۲۴ ژوئیه ۲۰۲۶، ساعت ۱۵:۵۹ (UTC)** به طور کامل بازنشسته خواهند شد. برای جلوگیری از اختلال به نام‌های صریح V4 مهاجرت کنید.
- سایر نام‌های مدل مانند `deepseek-v3.2`، `deepseek-v3.2-speciale` و `deepseek-v3.1` همچنان از Azure AI استفاده می‌کنند و در دسترس باقی می‌مانند.
- **اثر قیمت‌گذاری**: قیمت `deepseek-chat` بدون تغییر است؛ قیمت `deepseek-reasoner` برای هماهنگی با `deepseek-v4-pro` افزایش یافته است.

### پنجره زمینه

مدل‌های پرچم‌دار DeepSeek V4 (`deepseek-v4-flash`، `deepseek-v4-pro` و نام‌های قدیمی `deepseek-chat` / `deepseek-reasoner`) از پنجره زمینه **۱ میلیون توکنی به صورت پیش‌فرض** پشتیبانی می‌کنند و امکان تحلیل اسناد طولانی و جریان‌های کاری عاملی گسترده را فراهم می‌سازند. مدل‌های میزبانی‌شده روی Azure یعنی `deepseek-v3.2`، `deepseek-v3.2-speciale` و `deepseek-v3.1` همچنان پنجره زمینه ۱۲۸ هزار توکنی را حفظ می‌کنند.

### پشتیبانی از فراخوانی تابع

DeepSeek-V3.1 از فراخوانی تابع از طریق Beta API پشتیبانی می‌کند که ادغام با ابزارها و خدمات خارجی را امکان‌پذیر می‌سازد.

## تفاوت‌ها با خانواده‌های مدل دیگر

در حالی که AvalAI یک API یکپارچه ارائه می‌دهد، مدل‌های DeepSeek ویژگی‌های منحصر به فردی دارند:

1. **استدلال ترکیبی**: تمایز منحصر به فرد حالت تفکری/غیرتفکری، قابل تنظیم از طریق `extra_body={"thinking": {"type": ...}}`
2. **DeepSeek Sparse Attention (DSA)**: فشرده‌سازی توکنی برای مدیریت کارآمد زمینه ۱ میلیون توکنی
3. **تفکر در استفاده از ابزار**: اولین خانواده که تفکر را مستقیما در استفاده از ابزار یکپارچه می‌کند
4. **تمرکز بر عامل**: به طور خاص برای وظایف عامل با ادغام عمیق با Claude Code، OpenClaw و OpenCode بهینه‌سازی شده
5. **شفافیت استدلال**: فرآیندهای تفکر آشکار از طریق فیلد `reasoning_content` در حالت تفکری
6. **عملکرد رقابتی (V4)**: V4-Pro به SOTA متن‌باز در کدنویسی عاملی دست یافته؛ V4-Flash کیفیت نزدیک به V4-Pro را با کسری از هزینه ارائه می‌دهد (بر اساس بنچمارک‌های DeepSeek)

## نسخه‌بندی مدل

مدل‌های DeepSeek موجود از طریق AvalAI:

- **deepseek-v4-flash**: مدل پرچم‌دار DeepSeek-V4-Flash (توصیه می‌شود، نام صریح)
- **deepseek-v4-pro**: مدل پرچم‌دار DeepSeek-V4-Pro (توصیه می‌شود، نام صریح)
- **deepseek-chat**: نام قدیمی، اکنون به `deepseek-v4-flash` هدایت می‌شود (بازنشستگی در ۲۴ ژوئیه ۲۰۲۶)
- **deepseek-reasoner**: نام قدیمی، اکنون به `deepseek-v4-pro` هدایت می‌شود (بازنشستگی در ۲۴ ژوئیه ۲۰۲۶)
- **deepseek-v3.2**، **deepseek-v3.2-speciale**، **deepseek-v3.1**: نسل V3 میزبانی‌شده روی Azure

این نام‌های مدل همچنان به آخرین نسخه‌ها اشاره خواهند کرد زیرا DeepSeek به‌روزرسانی‌ها منتشر می‌کند، به‌جز نام‌های قدیمی که در ۲۴ ژوئیه ۲۰۲۶ بازنشسته خواهند شد.

## قیمت‌گذاری

| مدل | ورودی (Cache Hit) | ورودی (Cache Miss) | خروجی |
|-------|------------------|-------------------|--------|
| deepseek-v4-flash | $0.028 / ۱ میلیون توکن | $0.14 / ۱ میلیون توکن | $0.28 / ۱ میلیون توکن |
| deepseek-v4-pro | $0.145 / ۱ میلیون توکن | $1.74 / ۱ میلیون توکن | $3.48 / ۱ میلیون توکن |
| deepseek-chat (→ v4-flash) | $0.028 / ۱ میلیون توکن | $0.14 / ۱ میلیون توکن | $0.28 / ۱ میلیون توکن |
| deepseek-reasoner (→ v4-pro) | $0.145 / ۱ میلیون توکن | $1.74 / ۱ میلیون توکن | $3.48 / ۱ میلیون توکن |

برای اطلاعات کامل قیمت‌گذاری، مراجعه کنید به:
- [جزئیات مدل](fa/models/model-details.md) - قیمت‌گذاری و مشخصات تفصیلی
- [قیمت‌گذاری](fa/pricing.md) - نمای کلی کامل قیمت‌گذاری

## منابع مرتبط

- [API تکمیل گفتگو](fa/api-reference/chat.md) - نحوه استفاده از مدل‌های گفتگو
- [احراز هویت](fa/api-reference/authentication.md) - نحوه احراز هویت با API AvalAI
- [محدودیت‌های نرخ](fa/guides/rate-limits.md) - اطلاعات در مورد محدودیت‌های نرخ API
- [مدیریت خطا](fa/guides/error-handling.md) - نحوه مدیریت خطاها هنگام استفاده از API
- [فراخوانی تابع](fa/guides/function-calling.md) - راهنمای استفاده از فراخوانی تابع با مدل‌های DeepSeek
- [راهنمای استدلال](fa/guides/reasoning.md) - بهترین شیوه‌ها برای وظایف استدلال