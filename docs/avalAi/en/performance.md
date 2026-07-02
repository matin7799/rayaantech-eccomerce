# AvalAI Performance

At AvalAI, we are committed to full transparency and providing our users with enterprise-grade performance. Our goal is to offer a powerful, unified API that not only simplifies access to a wide range of AI models but also delivers competitive, and in many cases, superior performance. This commitment extends to our pricing model—we align 100% with the base rates of our providers, taking zero profit from their core services.

After three months of intensive optimization across our entire infrastructure stack, we're proud to announce a significant milestone: **AvalAI now delivers lower latency than direct OpenAI access** for the gpt-4o-mini model, while maintaining our commitment to zero markup pricing and enterprise-grade reliability. This page provides a detailed and transparent look at our API's performance, with comprehensive benchmarks comparing our service to direct provider access.

## The Impact of Security Guardrails

To ensure a fair, like-for-like comparison, all benchmark tests on this page were conducted with our **Guardrail feature disabled**.

The AvalAI Guardrail is a powerful security feature that automatically detects and redacts sensitive data (like API keys and passwords) from your requests. While we strongly recommend keeping it enabled for most applications, this security layer does introduce a minor latency overhead of approximately 200-300ms. By disabling it for these tests, we can provide a pure measurement of our core infrastructure's performance.

Users can choose to prioritize maximum speed or enhanced security based on their application's needs.

## How We Achieved These Improvements

Between June and October 2025, we undertook a comprehensive optimization initiative across every layer of our platform. Our improvements stem from both architectural advantages and targeted optimizations:

### Architectural Advantages

**Persistent Provider Connections**: As a high-traffic unified API platform, AvalAI maintains consistent, always-open connections to OpenAI and other AI providers. When you call our API, we leverage these pre-established connections, eliminating the TLS handshake and connection establishment overhead that individual users face when making direct API calls.

**Connection Pooling at Scale**: Our infrastructure manages optimized connection pools to all providers. Individual developers making direct calls must either establish new connections for each request (incurring significant overhead) or implement and maintain their own connection pooling logic. Our centralized approach provides these benefits automatically to all users.

### Recent Optimizations

Over the past three months, we've implemented targeted improvements:

- **Core API Service Optimization**: Streamlined request processing and routing logic
- **Infrastructure Overhead Reduction**: Minimized latency at every hop in our infrastructure
- **Network Layer Enhancements**: Optimized network configurations and routing
- **Repeated Call Optimization**: Special optimizations that significantly reduce overhead for applications making repeated API calls—a common pattern in production workloads

These architectural advantages combined with our continuous optimization efforts now result in lower latency than direct provider access, particularly benefiting production applications with sustained API usage patterns.

## Test Configuration

**Important**: All performance tests on this page were conducted using our **primary domain** ([`api.avalai.ir`](https://api.avalai.ir)), which runs on Cloudflare's CDN and provides optimal performance. We also offer a secondary domain ([`api.avalapis.ir`](https://api.avalapis.ir)) specifically for users experiencing connectivity issues due to network restrictions; however, this secondary domain has higher latency by design and is not used for these benchmark tests.

## Regional Latency Deep Dive

Latency is not a single number; it is heavily influenced by the geographic location of both the user and the datacenter. To provide a clear picture, we have conducted tests from two distinct regions where our users are concentrated.

---

## Latest Performance - 2025-10-12

### Europe (EU) Datacenter Performance - 2025-10-12

This test was conducted from a virtual machine hosted in an Azure datacenter in the EU, comparing AvalAI's performance to calling OpenAI's API directly from the same location.

**Test Environment:**
*   **Model:** `gpt-4o-mini`
*   **Cloud Provider:** Microsoft Azure
*   **Hardware:** 4GB RAM, 2 vCPUs
*   **Location:** Europe

#### EU Performance Results

| Metric                   | AvalAI (gpt-4o-mini) | OpenAI (gpt-4o-mini) |
| ------------------------ | -------------------- | -------------------- |
| **Average TTFB (s)**     | 0.435                | 0.717                |
| **Median TTFB (s)**      | 0.393                | 0.685                |
| **95th Percentile TTFB (s)** | 0.605                | 1.032                |
| **Avg Tokens per Second**| 24.5                 | 13.8                 |
| **Success Rate**         | 100.00%              | 100.00%              |

![EU API Performance Comparison](/_media/img/api_performance_comparison_20251012_a.png ':size=1000')

#### Analysis

The results speak for themselves: **AvalAI is now 39% faster than direct OpenAI access** from our EU datacenter. Our median TTFB of 0.393s compared to OpenAI's 0.685s, combined with 77% higher token throughput (24.5 vs 13.8 tokens/sec), demonstrates that a well-architected unified API platform can outperform direct provider access.

This performance advantage stems from our persistent connections to OpenAI's infrastructure and our optimized request handling. While individual users must establish connections and manage overhead with each request, our high-traffic system maintains warm connections and optimized pathways to all providers. Our recent infrastructure optimizations have further reduced any internal overhead, resulting in the superior performance shown in these benchmarks.

---
### Middle East (ME) Datacenter Performance - 2025-10-12

This test was conducted from a virtual machine hosted in an Arvancloud datacenter in the Middle East, comparing AvalAI's performance to calling OpenAI's API directly from the same location.

**Test Environment:**
* **Model:** `gpt-4o-mini`
* **Cloud Provider:** Arvancloud
* **Hardware:** 4GB RAM, 2 vCPUs
* **Location:** Middle East

#### ME Performance Results

| Metric | AvalAI (gpt-4o-mini) | OpenAI (gpt-4o-mini) |
| ------------------------ | -------------------- | -------------------- |
| **Average TTFB (s)** | 0.703 | 1.246 |
| **Median TTFB (s)** | 0.668 | 1.048 |
| **95th Percentile TTFB (s)**| 0.947 | 2.309 |
| **Avg Tokens per Second**| 14.9 | 8.4 |
| **Success Rate** | 100.00% | 100.00% |

![Middle East API Performance Comparison](_media/img/api_performance_comparison_20251012_b.png ':size=1000')

#### Analysis

The performance advantage is even more pronounced for Middle East users: **AvalAI delivers 44% faster response times** with a median TTFB of 0.668s compared to OpenAI's 1.048s. Token throughput is 77% higher (14.9 vs 8.4 tokens/sec), providing a substantially better experience for regional deployments.

Our infrastructure's strategic positioning and optimized routing paths, combined with persistent provider connections and recent optimizations, deliver exceptional performance for users in this region. The performance gap compared to direct OpenAI access has widened significantly since our June benchmarks, demonstrating the impact of our optimization efforts.

---

## Historical Performance - June 2025

For transparency and to demonstrate our continuous improvement, we're preserving our previous benchmark results from June 2025. These historical results show the starting point before our recent optimization initiative.

### Europe (EU) Datacenter Performance - 2025-06-12

**Test Environment:**
*   **Model:** `gpt-4o-mini`
*   **Cloud Provider:** Microsoft Azure
*   **Location:** Europe

#### EU Performance Results (Historical)

| Metric                   | AvalAI (gpt-4o-mini) | OpenAI (gpt-4o-mini) |
| ------------------------ | -------------------- | -------------------- |
| **Average TTFB (s)**     | 0.728                | 0.531                |
| **Median TTFB (s)**      | 0.683                | 0.510                |
| **95th Percentile TTFB (s)** | 1.056                | 0.740                |
| **Avg Tokens per Second**| 15.9                 | 18.9                 |
| **Success Rate**         | 100.00%              | 100.00%              |

![EU API Performance Comparison - June 2025](/_media/img/api_performance_comparison_53111243.png ':size=1000')

#### Historical Analysis

In June 2025, AvalAI showed a minor latency overhead of approximately 200ms compared to a direct OpenAI call from Azure datacenters. This was expected given OpenAI's primary hosting on Azure infrastructure. The value-added services we provided—unified API routing, robust security layers, and multi-provider support—came with this slight overhead.

### Middle East (ME) Datacenter Performance - 2025-06-12

**Test Environment:**
* **Model:** `gpt-4o-mini`
* **Cloud Provider:** Arvancloud
* **Location:** Middle East

#### ME Performance Results (Historical)

| Metric | AvalAI (gpt-4o-mini) | OpenAI (gpt-4o-mini) |
| ------------------------ | -------------------- | -------------------- |
| **Average TTFB (s)** | 0.993 | 1.095 |
| **Median TTFB (s)** | 0.929 | 0.951 |
| **95th Percentile TTFB (s)**| 1.479 | 1.386 |
| **Avg Tokens per Second**| 11.4 | 9.6 |
| **Success Rate** | 100.00% | 100.00% |

![Middle East API Performance Comparison - June 2025](_media/img/api_performance_comparison_53111244.png ':size=1000')

#### Historical Analysis

Even in June 2025, AvalAI provided competitive performance for Middle East users with lower latency and higher throughput than direct OpenAI access. Our October results show significant further improvements from our optimization efforts.

---

## Reproduce Our Results

We believe in full transparency. You can use the Python script below to run these performance tests yourself and verify our results.

**Note**: While these benchmarks were conducted using the **`gpt-4o-mini`** model, the performance improvements apply to all models available on our platform. You are encouraged to test any model of your choice using this script to see how AvalAI performs for your specific use case.

Please ensure you have the necessary libraries installed (`requests`, `numpy`, `matplotlib`, `seaborn`, `tabulate`, `tqdm`).

```python
import os
import requests
import time
import numpy as np
import matplotlib.pyplot as plt
import json
from tabulate import tabulate
from tqdm import tqdm
from datetime import datetime
import seaborn as sns


def test_api_performance(
    api_name, api_url, api_key, model, num_requests=10, prompt="Say hi"
):
    """Test API performance and collect comprehensive metrics"""
    headers = {"Content-Type": "application/json", "Authorization": f"Bearer {api_key}"}
    data = {"model": model, "messages": [{"role": "user", "content": prompt}]}

    ttfb_times = []
    total_times = []
    token_counts = []
    tokens_per_second = []
    errors = 0

    print(f"Testing {api_name} API with {num_requests} requests...")
    for _ in tqdm(range(num_requests)):
        try:
            start_time = time.time()
            response = requests.post(
                api_url, headers=headers, json=data, timeout=(10, 30)
            )
            response_time = time.time()

            # Process the response
            response_json = response.json()
            end_time = time.time()

            # Calculate metrics
            ttfb = response_time - start_time
            total_time = end_time - start_time

            # Try to get token count if available
            try:
                usage = response_json.get("usage", {})
                total_tokens = usage.get("total_tokens", 0)
                completion_tokens = usage.get("completion_tokens", 0)
                token_counts.append(total_tokens)

                # Calculate tokens per second (using completion tokens)
                if completion_tokens > 0 and total_time > 0:
                    tokens_per_second.append(completion_tokens / total_time)
                else:
                    tokens_per_second.append(0)
            except Exception as e:
                token_counts.append(0)
                tokens_per_second.append(0)

            ttfb_times.append(ttfb)
            total_times.append(total_time)

            # Add a small delay to avoid rate limiting
            time.sleep(0.5)

        except Exception as e:
            print(f"Error on request: {e}")
            errors += 1

    return {
        "name": api_name,
        "url": api_url,
        "model": model,
        "average_ttfb": np.mean(ttfb_times) if ttfb_times else None,
        "median_ttfb": np.median(ttfb_times) if ttfb_times else None,
        "p95_ttfb": np.percentile(ttfb_times, 95) if ttfb_times else None,
        "average_total": np.mean(total_times) if total_times else None,
        "median_total": np.median(total_times) if total_times else None,
        "p95_total": np.percentile(total_times, 95) if total_times else None,
        "ttfb_times": ttfb_times,
        "total_times": total_times,
        "token_counts": token_counts,
        "avg_tokens": (
            np.mean(token_counts) if token_counts and any(token_counts) else None
        ),
        "tokens_per_second": tokens_per_second,
        "avg_tokens_per_second": (
            np.mean([t for t in tokens_per_second if t > 0])
            if tokens_per_second and any(tokens_per_second)
            else None
        ),
        "median_tokens_per_second": (
            np.median([t for t in tokens_per_second if t > 0])
            if tokens_per_second and any(tokens_per_second)
            else None
        ),
        "success_rate": (
            len(ttfb_times) / (len(ttfb_times) + errors)
            if (len(ttfb_times) + errors) > 0
            else 0
        ),
        "error_count": errors,
    }


def print_comparison_table(results_avalai, results_openai):
    """Print comparison table between two APIs"""
    headers = [
        "Metric",
        f"AvalAI ({results_avalai['model']})",
        f"OpenAI ({results_openai['model']})",
    ]

    data = [
        [
            "Average TTFB (s)",
            f"{results_avalai['average_ttfb']:.3f}",
            f"{results_openai['average_ttfb']:.3f}",
        ],
        [
            "Median TTFB (s)",
            f"{results_avalai['median_ttfb']:.3f}",
            f"{results_openai['median_ttfb']:.3f}",
        ],
        [
            "95th Percentile TTFB (s)",
            f"{results_avalai['p95_ttfb']:.3f}",
            f"{results_openai['p95_ttfb']:.3f}",
        ],
        [
            "Average Total Time (s)",
            f"{results_avalai['average_total']:.3f}",
            f"{results_openai['average_total']:.3f}",
        ],
        [
            "Median Total Time (s)",
            f"{results_avalai['median_total']:.3f}",
            f"{results_openai['median_total']:.3f}",
        ],
        [
            "95th Percentile Total (s)",
            f"{results_avalai['p95_total']:.3f}",
            f"{results_openai['p95_total']:.3f}",
        ],
        [
            "Success Rate",
            f"{results_avalai['success_rate']:.2%}",
            f"{results_openai['success_rate']:.2%}",
        ],
    ]

    # Add token metrics if available
    if (
        results_avalai["avg_tokens"] is not None
        and results_openai["avg_tokens"] is not None
    ):
        data.append(
            [
                "Avg Tokens per Response",
                f"{results_avalai['avg_tokens']:.1f}",
                f"{results_openai['avg_tokens']:.1f}",
            ]
        )

    # Add tokens per second metrics if available
    if (
        results_avalai["avg_tokens_per_second"] is not None
        and results_openai["avg_tokens_per_second"] is not None
    ):
        data.append(
            [
                "Avg Tokens per Second",
                f"{results_avalai['avg_tokens_per_second']:.1f}",
                f"{results_openai['avg_tokens_per_second']:.1f}",
            ]
        )
        data.append(
            [
                "Median Tokens per Second",
                f"{results_avalai['median_tokens_per_second']:.1f}",
                f"{results_openai['median_tokens_per_second']:.1f}",
            ]
        )

    print("\nAPI Performance Comparison:")
    print(tabulate(data, headers=headers, tablefmt="grid"))


def plot_comparison(results_avalai, results_openai, output_file=None):
    """Create improved visualization plots for API comparison"""
    # Set the style
    sns.set(style="whitegrid")

    # Create figure with subplots - adding a third subplot for tokens per second
    fig, axes = plt.subplots(3, 1, figsize=(12, 15))

    # Define metrics to plot
    metrics = [
        ("ttfb_times", "Time to First Byte (s)"),
        ("total_times", "Total Request Time (s)"),
        ("tokens_per_second", "Tokens per Second"),
    ]

    # Define colors for each API
    colors = {"AvalAI": "#3498db", "OpenAI": "#2ecc71"}

    for i, (metric, title) in enumerate(metrics):
        # Create violin plots with individual points
        ax = axes[i]

        # Prepare data for plotting
        data_to_plot = []
        labels = []

        for result, label in [(results_avalai, "AvalAI"), (results_openai, "OpenAI")]:
            # Filter out zeros for tokens per second
            if metric == "tokens_per_second":
                data_to_plot.append([t for t in result[metric] if t > 0])
            else:
                data_to_plot.append(result[metric])
            labels.append(f"{label}\n({result['model']})")

        # Create violin plot
        parts = ax.violinplot(data_to_plot, showmeans=True, showmedians=True)

        # Customize violin plots
        for pc, color_key in zip(parts["bodies"], colors.keys()):
            pc.set_facecolor(colors[color_key])
            pc.set_alpha(0.7)

        # Add boxplot inside violin
        bp = ax.boxplot(
            data_to_plot,
            positions=range(1, len(data_to_plot) + 1),
            widths=0.15,
            patch_artist=True,
            showfliers=False,
        )

        # Customize boxplots
        for box, color_key in zip(bp["boxes"], colors.keys()):
            box.set(color="black", linewidth=1.5)
            box.set(facecolor="white")

        # Add scatter points with jitter
        for j, data in enumerate(
            [
                (
                    results_avalai[metric]
                    if metric != "tokens_per_second"
                    else [t for t in results_avalai[metric] if t > 0]
                ),
                (
                    results_openai[metric]
                    if metric != "tokens_per_second"
                    else [t for t in results_openai[metric] if t > 0]
                ),
            ]
        ):
            # Add jitter to x position
            x = np.random.normal(j + 1, 0.05, size=len(data))
            ax.scatter(
                x,
                data,
                alpha=0.4,
                s=20,
                color=list(colors.values())[j],
                edgecolor="white",
                linewidth=0.5,
            )

        # Set labels and title
        ax.set_title(title, fontsize=14, fontweight="bold")
        if metric == "tokens_per_second":
            ax.set_ylabel("Tokens/second", fontsize=12)
        else:
            ax.set_ylabel("Time (seconds)", fontsize=12)
        ax.set_xticks(range(1, len(labels) + 1))
        ax.set_xticklabels(labels, fontsize=12)

        # Add horizontal grid lines
        ax.yaxis.grid(True, linestyle="--", alpha=0.7)

        # Add stats as text
        for j, (result, label) in enumerate(
            [(results_avalai, "AvalAI"), (results_openai, "OpenAI")]
        ):
            if metric == "tokens_per_second":
                if result["avg_tokens_per_second"] is not None:
                    stats = (
                        f"Mean: {result['avg_tokens_per_second']:.1f}\n"
                        f"Median: {result['median_tokens_per_second']:.1f}"
                    )
                    max_val = (
                        max([t for t in result[metric] if t > 0])
                        if any(t > 0 for t in result[metric])
                        else 0
                    )
                    ax.annotate(
                        stats,
                        xy=(j + 1, max_val * 1.05),
                        ha="center",
                        va="bottom",
                        fontsize=10,
                        bbox=dict(boxstyle="round,pad=0.5", fc="white", alpha=0.7),
                    )
            else:
                stats = (
                    f"Mean: {result[f'average_{metric.split("_")[0]}']:.3f}s\n"
                    f"Median: {result[f'median_{metric.split("_")[0]}']:.3f}s\n"
                    f"95th: {result[f'p95_{metric.split("_")[0]}']:.3f}s"
                )
                ax.annotate(
                    stats,
                    xy=(j + 1, result[f'p95_{metric.split("_")[0]}'] * 1.05),
                    ha="center",
                    va="bottom",
                    fontsize=10,
                    bbox=dict(boxstyle="round,pad=0.5", fc="white", alpha=0.7),
                )

    # Add title and timestamp
    plt.suptitle(
        f"API Performance Comparison: AvalAI vs OpenAI", fontsize=16, fontweight="bold"
    )
    plt.figtext(
        0.5,
        0.01,
        f'Generated on {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}',
        ha="center",
        fontsize=10,
    )

    plt.tight_layout(rect=[0, 0.03, 1, 0.97])

    if output_file:
        plt.savefig(output_file, dpi=300, bbox_inches="tight")
        print(f"Plot saved to {output_file}")
    else:
        plt.show()


def save_results(results_avalai, results_openai, filename):
    """Save results to JSON file"""
    # Convert numpy arrays to lists for JSON serialization
    results_avalai_copy = results_avalai.copy()
    results_openai_copy = results_openai.copy()

    for key in ["ttfb_times", "total_times", "token_counts"]:
        if key in results_avalai_copy:
            results_avalai_copy[key] = [float(x) for x in results_avalai_copy[key]]
        if key in results_openai_copy:
            results_openai_copy[key] = [float(x) for x in results_openai_copy[key]]

    data = {
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
        "results": {"avalai": results_avalai_copy, "openai": results_openai_copy},
    }

    with open(filename, "w") as f:
        json.dump(data, f, indent=2)

    print(f"Results saved to {filename}")


def main():
    # API configuration
    model_name = "gpt-4o-mini"

    url_avalai = "https://api.avalai.ir/v1/chat/completions"
    api_key_avalai = os.getenv("AVALAI_API_KEY")  # Replace with actual key

    url_openai = "https://api.openai.com/v1/chat/completions"
    api_key_openai = os.getenv("OPENAI_API_KEY")  # Replace with actual key

    # Number of requests to make for each API
    num_requests = 60

    # Test prompt
    prompt = "Say hi"

    # Run the tests
    results_avalai = test_api_performance(
        "AvalAI", url_avalai, api_key_avalai, model_name, num_requests, prompt
    )
    results_openai = test_api_performance(
        "OpenAI", url_openai, api_key_openai, model_name, num_requests, prompt
    )

    # Print comparison table
    print_comparison_table(results_avalai, results_openai)

    # Generate visualization
    plot_comparison(results_avalai, results_openai, "api_performance_comparison.png")

    # Save results
    save_results(results_avalai, results_openai, "api_performance_results.json")


if __name__ == "__main__":
    main()
```

## Related Resources

- [Guides: Latency Optimization](en/guides/latency-optimization.md)
- [Guides: Rate Limits](en/guides/rate-limits.md)