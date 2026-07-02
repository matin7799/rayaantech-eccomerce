# API Performance Improvements

**Date:** 2025-10-12 / (1404-07-20)

## Summary

Following three months of comprehensive infrastructure optimization, AvalAI now delivers lower latency than direct OpenAI access for the gpt-4o-mini model. Our latest benchmarks show 39-44% faster response times and 77% higher token throughput across regions, achieved through persistent provider connections, connection pooling optimizations, and targeted infrastructure improvements.

---

## Details

### Performance Achievements

Our October 2025 benchmark results demonstrate significant performance gains compared to our June baseline:

**Europe (EU) Datacenter:**
- **39% faster** than direct OpenAI access (0.435s vs 0.717s median TTFB)
- **77% higher throughput** (24.5 vs 13.8 tokens/second)
- Improved from 200ms overhead in June to being faster than direct access

**Middle East (ME) Datacenter:**
- **44% faster** than direct OpenAI access (0.668s vs 1.048s median TTFB)
- **77% higher throughput** (14.9 vs 8.4 tokens/second)
- Substantial performance advantage for regional deployments

### How We Achieved This

The performance improvements stem from both architectural advantages and targeted optimizations:

#### Architectural Advantages

- **Persistent Provider Connections**: As a high-traffic platform, we maintain always-open connections to OpenAI and other providers, eliminating TLS handshake overhead that individual users face with each request
- **Connection Pooling at Scale**: Our centralized infrastructure manages optimized connection pools, removing the need for users to implement and maintain their own pooling logic

#### Recent Optimizations

Over the past three months, we implemented:

- Core API service optimization with streamlined request processing
- Infrastructure overhead reduction at every layer
- Network layer enhancements and routing optimizations
- Special optimizations for repeated API calls, benefiting production workloads

### Technical Context

All tests were conducted using our primary domain ([`api.avalai.ir`](https://api.avalai.ir)), which runs on Cloudflare's CDN for optimal performance. The benchmarks used gpt-4o-mini, but the performance improvements apply to all models on our platform.

Users making repeated API calls—a common pattern in production environments—particularly benefit from these optimizations, as our system maintains warm connections and optimized pathways to all providers.

### Independent Verification

We provide full transparency through:

- Complete benchmark results with statistical analysis
- Python script for independent testing
- Historical data showing improvement trajectory from June to October 2025
- Detailed methodology and test environment specifications

---

## View Full Benchmarks

For comprehensive performance data, methodology, and the ability to reproduce these results yourself, visit our updated [Performance Page](en/performance.md).

---

## Related Links

- [Performance Benchmarks and Methodology](en/performance.md)
- [Latency Optimization Guide](en/guides/latency-optimization.md)
- [Production Best Practices](en/guides/production-best-practices.md)
- [Rate Limits Documentation](en/guides/rate-limits.md)