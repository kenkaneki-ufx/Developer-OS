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
 * Cohere AI Provider - Free tier available (1,000 requests/month)
 * Implements the AI service interface for Cohere Command models
 */
export class CohereProvider implements AIServiceInterface {
  readonly provider: AIProvider = "cohere";

  private apiKey: string;
  private baseUrl: string;
  private defaultModel: string;

  constructor(config: AIConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || "https://api.cohere.com/v2";
    this.defaultModel = config.defaultModel || "command-r";
  }

  private formatMessages(messages: AIMessage[]): Array<{ role: string; content: string }> {
    return messages.map((m) => ({
      role: m.role === "assistant" ? "chatbot" : m.role,
      content: m.content,
    }));
  }

  async complete(
    messages: AIMessage[],
    options?: AICompletionOptions
  ): Promise<AICompletionResponse> {
    const model = options?.model || this.defaultModel;
    const formattedMessages = this.formatMessages(messages);

    const response = await fetch(`${this.baseUrl}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: formattedMessages,
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 4096,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        `Cohere API error: ${response.status} - ${error.message || "Unknown error"}`
      );
    }

    const data = await response.json();

    const content = data.message?.content?.[0]?.text || "";

    if (!content.trim()) {
      console.error("Cohere returned empty content:", data);
      throw new Error("AI returned an empty response. Please try again.");
    }

    return {
      content,
      model,
      provider: this.provider,
      tokens: data.meta?.tokens
        ? {
            prompt: data.meta.tokens.input_tokens || 0,
            completion: data.meta.tokens.output_tokens || 0,
            total: (data.meta.tokens.input_tokens || 0) + (data.meta.tokens.output_tokens || 0),
          }
        : undefined,
    };
  }

  async *stream(
    messages: AIMessage[],
    options?: AICompletionOptions
  ): AsyncGenerator<AIStreamChunk, void, unknown> {
    const model = options?.model || this.defaultModel;
    const formattedMessages = this.formatMessages(messages);

    const response = await fetch(`${this.baseUrl}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: formattedMessages,
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 4096,
        stream: true,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        `Cohere API error: ${response.status} - ${error.message || "Unknown error"}`
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

          try {
            const parsed = JSON.parse(data);

            if (parsed.type === "content-delta") {
              const content = parsed.delta?.message?.content?.text || "";
              if (content) {
                yield { content, done: false };
              }
            } else if (parsed.type === "message-end") {
              yield { content: "", done: true };
              return;
            }
          } catch {
            // Skip malformed JSON
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
}
