import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createAIProvider } from "@/lib/ai";
import type { AIProvider, AIMessage } from "@/lib/ai";

// Helper to create SSE stream
function createStreamResponse(stream: AsyncGenerator<{ content: string; done: boolean }, void, unknown>, remaining: number) {
  const encoder = new TextEncoder();
  const generator = stream;
  let hasSentContent = false;

  const readableStream = new ReadableStream({
    start(controller) {
      (async () => {
        try {
          for await (const chunk of generator) {
            if (chunk.done) {
              if (!hasSentContent) {
                const fallbackMessage = "I apologize, but I was unable to generate a response. Please try again.";
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: fallbackMessage, done: false })}\n\n`));
              }
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true, remaining })}\n\n`));
            } else {
              if (chunk.content && chunk.content.trim()) {
                hasSentContent = true;
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: chunk.content, done: false })}\n\n`));
              }
            }
          }
          controller.close();
        } catch (error) {
          console.error("Stream generation error:", error);
          const errorMessage = error instanceof Error ? error.message : "Stream error";
          try {
            if (!hasSentContent) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: `Error: ${errorMessage}`, done: false })}\n\n`));
            }
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: errorMessage, done: true })}\n\n`));
          } catch {
            // Controller may already be closed
          }
          try {
            controller.close();
          } catch {
            // Already closed
          }
        }
      })();
    },
  });

  return new Response(readableStream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}

// Rate limiting
const DAILY_MESSAGE_LIMIT = 9999;
const messageCounts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(userId: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const userLimit = messageCounts.get(userId);

  if (!userLimit || now > userLimit.resetAt) {
    messageCounts.set(userId, {
      count: 0,
      resetAt: now + 24 * 60 * 60 * 1000,
    });
    return { allowed: true, remaining: DAILY_MESSAGE_LIMIT };
  }

  if (userLimit.count >= DAILY_MESSAGE_LIMIT) {
    return { allowed: false, remaining: 0 };
  }

  return { allowed: true, remaining: DAILY_MESSAGE_LIMIT - userLimit.count };
}

function incrementMessageCount(userId: string) {
  const userLimit = messageCounts.get(userId);
  if (userLimit) {
    userLimit.count++;
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { allowed, remaining } = checkRateLimit(session.user.id);
    if (!allowed) {
      return NextResponse.json(
        { error: "Daily message limit reached. Please try again tomorrow." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { messages, stream } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages are required" }, { status: 400 });
    }

    // Create Dev-AI provider
    const ai = createAIProvider("devai", {
      provider: "devai",
      apiKey: "local",
    });

    // Prepare messages with system prompt
    const systemMessage: AIMessage = {
      role: "system",
      content: `You are Dev-AI, a helpful AI assistant for Developer OS, a productivity platform for developers. You help with coding, study plans, DSA problems, project ideas, and general developer questions. Be concise, helpful, and encouraging. Current date: ${new Date().toISOString().split("T")[0]}`,
    };

    const allMessages = [systemMessage, ...messages.slice(-20)];

    // Streaming mode
    if (stream) {
      const streamGenerator = ai.stream(allMessages, {
        temperature: 0.7,
        maxTokens: 1024,
      });

      incrementMessageCount(session.user.id);
      return createStreamResponse(streamGenerator, remaining - 1);
    }

    // Non-streaming mode
    const response = await ai.complete(allMessages, {
      temperature: 0.7,
      maxTokens: 1024,
    });

    incrementMessageCount(session.user.id);

    return NextResponse.json({
      success: true,
      response: response.content,
      model: response.model,
      provider: response.provider,
      tokens: response.tokens,
      remaining,
    });
  } catch (error) {
    console.error("AI chat error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { error: `AI request failed: ${errorMessage}` },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { remaining } = checkRateLimit(session.user.id);

    return NextResponse.json({
      success: true,
      remaining,
      limit: DAILY_MESSAGE_LIMIT,
      providers: [
        {
          id: "devai",
          models: ["dev-ai"],
          available: true,
        },
      ],
    });
  } catch (error) {
    console.error("Error getting AI chat info:", error);
    return NextResponse.json({ error: "Failed to get chat info" }, { status: 500 });
  }
}
