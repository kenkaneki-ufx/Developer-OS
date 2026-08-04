import type {
  AIProvider,
  AIServiceInterface,
  AIConfig,
} from "./types";
import { DevAIProvider } from "./providers/local";

/**
 * AI Client Factory - Dev-AI Provider Only
 * Built-in AI that works without any API keys
 */

let defaultClient: AIServiceInterface | null = null;

/**
 * Create an AI service instance for the specified provider
 */
export function createAIProvider(provider: AIProvider, config: AIConfig): AIServiceInterface {
  return new DevAIProvider(config);
}

/**
 * Get the default AI client
 */
export function getAIClient(): AIServiceInterface {
  if (defaultClient) {
    return defaultClient;
  }

  defaultClient = createAIProvider("devai", {
    provider: "devai",
    apiKey: "local",
  });

  return defaultClient;
}

/**
 * Reset the default client
 */
export function resetAIClient(): void {
  defaultClient = null;
}

/**
 * Convenience export for direct usage
 */
export const ai = {
  get client() {
    return getAIClient();
  },
  complete: (...params: Parameters<AIServiceInterface["complete"]>) => {
    return getAIClient().complete(...params);
  },
  stream: (...params: Parameters<AIServiceInterface["stream"]>) => {
    return getAIClient().stream(...params);
  },
};
