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
 * Anthropic AI Provider
 * Implements the AI service interface for Claude models
 */
export class AnthropicProvider implements AIServiceInterface {
  readonly provider: AIProvider = "anthropic";

  private apiKey: string;
  private baseUrl: string;
  private defaultModel: string;

  constructor(config: AIConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || "https://api.anthropic.com/v1";
    this.defaultModel = config.defaultModel || "claude-3-sonnet-20240229";
  }

  async complete(
    messages: AIMessage[],
    options?: AICompletionOptions
  ): Promise<AICompletionResponse> {
    const model = options?.model || this.defaultModel;

    // Anthropic uses a separate system prompt
    const systemPrompt = options?.systemPrompt || "";

    // Filter out system messages and convert to Anthropic format
    const anthropicMessages = messages
      .filter((m) => m.role !== "system")
      .map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

    const response = await fetch(`${this.baseUrl}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        system: systemPrompt,
        messages: anthropicMessages,
        max_tokens: options?.maxTokens ?? 4096,
        temperature: options?.temperature ?? 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        `Anthropic API error: ${response.status} - ${error.error?.message || "Unknown error"}`
      );
    }

    const data = await response.json();
    
    // Validate response structure
    if (!data.content || !data.content[0]) {
      throw new Error("Invalid response structure from Anthropic API");
    }

    const content = data.content[0].text || "";
    
    if (!content.trim()) {
      console.error("Anthropic returned empty content:", data);
      throw new Error("AI returned an empty response. Please try again.");
    }

    return {
      content,
      model: data.model,
      provider: this.provider,
      tokens: data.usage ? {
        prompt: data.usage.input_tokens || 0,
        completion: data.usage.output_tokens || 0,
        total: (data.usage.input_tokens || 0) + (data.usage.output_tokens || 0),
      } : undefined,
    };
  }

  async *stream(
    messages: AIMessage[],
    options?: AICompletionOptions
  ): AsyncGenerator<AIStreamChunk, void, unknown> {
    const model = options?.model || this.defaultModel;

    const systemPrompt = options?.systemPrompt || "";

    const anthropicMessages = messages
      .filter((m) => m.role !== "system")
      .map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

    const response = await fetch(`${this.baseUrl}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        system: systemPrompt,
        messages: anthropicMessages,
        max_tokens: options?.maxTokens ?? 4096,
        temperature: options?.temperature ?? 0.7,
        stream: true,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        `Anthropic API error: ${response.status} - ${error.error?.message || "Unknown error"}`
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
            
            // Handle API errors in stream
            if (parsed.type === "error") {
              console.error("Anthropic stream error:", parsed.error);
              throw new Error(parsed.error?.message || "Anthropic stream error");
            }

            if (parsed.type === "content_block_delta") {
              const content = parsed.delta?.text || "";
              if (content) {
                yield {
                  content,
                  done: false,
                };
              }
            } else if (parsed.type === "message_stop") {
              yield { content: "", done: true };
              return;
            }
          } catch (error) {
            // Re-throw API errors, skip malformed JSON
            if (error instanceof Error && error.message.includes("Anthropic")) {
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
