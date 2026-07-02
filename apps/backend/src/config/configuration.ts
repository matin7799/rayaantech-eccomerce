import { ProxyAgent, fetch as undiciFetch } from "undici";

/**
 * Custom NestJS configuration loader.
 * Configures the OpenAI client options to use undici's ProxyAgent and custom fetch
 * when process.env.OUTBOUND_PROXY_URL is set, routing OpenAI API calls through
 * the overseas proxy while leaving database, redis, and other requests direct.
 */
export default () => {
  const outboundProxyUrl = process.env.OUTBOUND_PROXY_URL;

  // We only load the undici fetch implementation and ProxyAgent if a proxy is configured.
  // This guarantees that if no proxy is set, we bypass any custom dispatchers entirely.
  const fetch = outboundProxyUrl ? undiciFetch : undefined;
  const dispatcher = outboundProxyUrl ? new ProxyAgent(outboundProxyUrl) : undefined;

  return {
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
      fetch,
      dispatcher,
    },
  };
};
