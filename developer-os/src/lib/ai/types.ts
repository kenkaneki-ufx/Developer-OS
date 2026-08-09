/**
 * AI Provider Abstraction Layer
 *
 * This module defines the interfaces for AI providers.
 * The system supports multiple AI providers and allows easy switching
 * by changing only the configuration.
 */

export type AIProvider = "devai" | "anthropic" | "cohere" | "gemini" | "openai";

export type AIModel = "dev-ai";

export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AICompletionOptions {
  model?: AIModel;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  systemPrompt?: string;
}

export interface AICompletionResponse {
  content: string;
  model: string;
  provider: AIProvider;
  tokens?: {
    prompt: number;
    completion: number;
    total: number;
  };
}

export interface AIStreamChunk {
  content: string;
  done: boolean;
}

export interface AIServiceInterface {
  readonly provider: AIProvider;

  complete(
    messages: AIMessage[],
    options?: AICompletionOptions
  ): Promise<AICompletionResponse>;

  stream(
    messages: AIMessage[],
    options?: AICompletionOptions
  ): AsyncGenerator<AIStreamChunk, void, unknown>;
}

export interface AIConfig {
  provider: AIProvider;
  apiKey: string;
  baseUrl?: string;
  defaultModel?: AIModel;
}

export interface TaskGenerationContext {
  completedTasks: string[];
  currentTopics: string[];
  difficulty: "easy" | "medium" | "hard";
  timeAvailable: number; // minutes
  goals?: string[];
}

export interface StudyPlanContext {
  currentLevel: string;
  topics: string[];
  deadline?: Date;
  hoursPerDay: number;
  preferences?: string[];
}

export interface DailyPlanResponse {
  tasks: Array<{
    title: string;
    description: string;
    estimatedMinutes: number;
    priority: "low" | "medium" | "high";
    category: string;
    topic?: string;
  }>;
  summary: string;
  focusArea: string;
}
