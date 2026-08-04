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
 * Google Gemini AI Provider
 * Implements the AI service interface for Gemini models
 */
export class GeminiProvider implements AIServiceInterface {
  readonly provider: AIProvider = "gemini";

  private apiKey: string;
  private baseUrl: string;
  private defaultModel: string;

  constructor(config: AIConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl =
      config.baseUrl || "https://generativelanguage.googleapis.com/v1beta";
    this.defaultModel = config.defaultModel || "gemini-1.5-pro";
  }

  private formatMessages(messages: AIMessage[]): {
    systemInstruction?: { parts: { text: string }[] };
    contents: Array<{
      role: string;
      parts: { text: string }[];
    }>;
  } {
    let systemInstruction: { parts: { text: string }[] } | undefined;
    const contents: Array<{ role: string; parts: { text: string }[] }> = [];

    for (const msg of messages) {
      if (msg.role === "system") {
        systemInstruction = { parts: [{ text: msg.content }] };
      } else {
        // Gemini uses "model" instead of "assistant"
        const role = msg.role === "assistant" ? "model" : "user";
        contents.push({
          role,
          parts: [{ text: msg.content }],
        });
      }
    }

    return { systemInstruction, contents };
  }

  async complete(
    messages: AIMessage[],
    options?: AICompletionOptions
  ): Promise<AICompletionResponse> {
    const model = options?.model || this.defaultModel;
    const { systemInstruction, contents } = this.formatMessages(messages);

    const requestBody: Record<string, unknown> = {
      contents,
      generationConfig: {
        temperature: options?.temperature ?? 0.7,
        maxOutputTokens: options?.maxTokens ?? 4096,
      },
    };

    if (systemInstruction) {
      requestBody.systemInstruction = systemInstruction;
    }

    const response = await fetch(
      `${this.baseUrl}/models/${model}:generateContent?key=${this.apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        `Gemini API error: ${response.status} - ${error.error?.message || "Unknown error"}`
      );
    }

    const data = await response.json();
    
    // Validate response structure
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error("Invalid response structure from Gemini API");
    }

    const content = data.candidates[0].content.parts?.[0]?.text || "";
    
    if (!content.trim()) {
      console.error("Gemini returned empty content:", data);
      throw new Error("AI returned an empty response. Please try again.");
    }

    return {
      content,
      model,
      provider: this.provider,
      tokens: data.usageMetadata
        ? {
            prompt: data.usageMetadata.promptTokenCount || 0,
            completion: data.usageMetadata.candidatesTokenCount || 0,
            total: data.usageMetadata.totalTokenCount || 0,
          }
        : undefined,
    };
  }

  async *stream(
    messages: AIMessage[],
    options?: AICompletionOptions
  ): AsyncGenerator<AIStreamChunk, void, unknown> {
    const model = options?.model || this.defaultModel;
    const { systemInstruction, contents } = this.formatMessages(messages);

    const requestBody: Record<string, unknown> = {
      contents,
      generationConfig: {
        temperature: options?.temperature ?? 0.7,
        maxOutputTokens: options?.maxTokens ?? 4096,
      },
    };

    if (systemInstruction) {
      requestBody.systemInstruction = systemInstruction;
    }

    const response = await fetch(
      `${this.baseUrl}/models/${model}:streamGenerateContent?key=${this.apiKey}&alt=sse`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        `Gemini API error: ${response.status} - ${error.error?.message || "Unknown error"}`
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
            if (parsed.error) {
              console.error("Gemini stream error:", parsed.error);
              throw new Error(parsed.error.message || "Gemini stream error");
            }
            
            const content =
              parsed.candidates?.[0]?.content?.parts?.[0]?.text || "";
            if (content) {
              yield { content, done: false };
            }
          } catch (error) {
            // Re-throw API errors, skip malformed JSON
            if (error instanceof Error && error.message.includes("Gemini")) {
              throw error;
            }
          }
        }
      }
      yield { content: "", done: true };
    } finally {
      reader.releaseLock();
    }
  }
}
