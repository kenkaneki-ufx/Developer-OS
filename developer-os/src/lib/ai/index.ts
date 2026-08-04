/**
 * AI Provider Abstraction Layer
 *
 * This module provides a unified interface for working with multiple AI providers.
 * To switch providers, simply change the AI_PROVIDER environment variable.
 *
 * Supported Providers:
 * - OpenAI (GPT-4, GPT-4o, GPT-4o-mini)
 * - Anthropic (Claude 3 Opus, Sonnet, Haiku)
 * - Google Gemini (Gemini Pro, Gemini 1.5 Pro)
 *
 * Usage:
 *   import { ai, createAIProvider } from "@/lib/ai";
 *
 *   // Using the default client
 *   const response = await ai.complete([
 *     { role: "user", content: "Hello, AI!" }
 *   ]);
 *
 *   // Using a specific provider
 *   const customClient = createAIProvider("anthropic", {
 *     provider: "anthropic",
 *     apiKey: "your-key",
 *   });
 */

export { ai, createAIProvider, getAIClient, resetAIClient } from "./client";
export type {
  AIProvider,
  AIModel,
  AIMessage,
  AICompletionOptions,
  AICompletionResponse,
  AIStreamChunk,
  AIServiceInterface,
  AIConfig,
  TaskGenerationContext,
  StudyPlanContext,
  DailyPlanResponse,
} from "./types";
