import type {
  AIServiceInterface,
  AIMessage,
  AICompletionOptions,
  AICompletionResponse,
  AIStreamChunk,
  AIConfig,
  AIProvider,
} from "../types";

/**
 * OpenAI AI Provider
 * Implements the AI service interface for OpenAI models (GPT-4, GPT-4o, etc.)
 */
export class OpenAIProvider implements AIServiceInterface {
  readonly provider: AIProvider = "openai";

  private apiKey: string;
  private baseUrl: string;
  private defaultModel: string;

  constructor(config: AIConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || "https://api.openai.com/v1";
    this.defaultModel = config.defaultModel || "gpt-4o";
  }

  async complete(
    messages: AIMessage[],
    options?: AICompletionOptions
  ): Promise<AICompletionResponse> {
    const model = options?.model || this.defaultModel;

    const systemMessage: AIMessage | null = options?.systemPrompt
      ? { role: "system", content: options.systemPrompt }
      : null;

    const allMessages = systemMessage
      ? [systemMessage, ...messages]
      : messages;

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: allMessages,
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 4096,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        `OpenAI API error: ${response.status} - ${error.error?.message || "Unknown error"}`
      );
    }

    const data = await response.json();
    
    // Validate response structure
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error("Invalid response structure from OpenAI API");
    }

    const content = data.choices[0].message.content || "";
    
    if (!content.trim()) {
      console.error("OpenAI returned empty content:", data);
      throw new Error("AI returned an empty response. Please try again.");
    }

    return {
      content,
      model: data.model,
      provider: this.provider,
      tokens: data.usage ? {
        prompt: data.usage.prompt_tokens || 0,
        completion: data.usage.completion_tokens || 0,
        total: data.usage.total_tokens || 0,
      } : undefined,
    };
  }

  async *stream(
    messages: AIMessage[],
    options?: AICompletionOptions
  ): AsyncGenerator<AIStreamChunk, void, unknown> {
    const model = options?.model || this.defaultModel;

    const systemMessage: AIMessage | null = options?.systemPrompt
      ? { role: "system", content: options.systemPrompt }
      : null;

    const allMessages = systemMessage
      ? [systemMessage, ...messages]
      : messages;

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: allMessages,
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 4096,
        stream: true,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        `OpenAI API error: ${response.status} - ${error.error?.message || "Unknown error"}`
      );
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("No response body");
    }

    const decoder = new TextDecoder();
    let buffer = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith("data: ")) continue;

          const data = trimmed.slice(6);
          if (data === "[DONE]") {
            yield { content: "", done: true };
            return;
          }

          try {
            const parsed = JSON.parse(data);
            // Handle API errors in stream
            if (parsed.error) {
              console.error("OpenAI stream error:", parsed.error);
              throw new Error(parsed.error.message || "OpenAI stream error");
            }
            const content = parsed.choices?.[0]?.delta?.content || "";
            if (content) {
              yield { content, done: false };
            }
          } catch (error) {
            // Re-throw API errors, skip malformed JSON
            if (error instanceof Error && error.message.includes("OpenAI")) {
              throw error;
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
}
