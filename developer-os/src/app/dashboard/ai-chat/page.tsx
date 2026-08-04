"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Loader2,
  Bot,
  User,
  Sparkles,
  Zap,
  AlertCircle,
  Trash2,
  ChevronDown,
  Code,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface Provider {
  id: string;
  models: string[];
  available: boolean;
}

interface ChatInfo {
  remaining: number;
  limit: number;
  providers: Provider[];
}

const modelDisplayNames: Record<string, string> = {
  "dev-ai": "Dev-AI",
};

const modelColors: Record<string, string> = {
  devai: "bg-primary/10 text-primary border-primary/20",
};

export default function AIChatPage() {
  const pathname = usePathname();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatInfo, setChatInfo] = useState<ChatInfo | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<string>("devai");
  const [selectedModel, setSelectedModel] = useState<string>("dev-ai");
  const [error, setError] = useState<string | null>(null);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Reset chat state when pathname changes (revisiting the page)
  useEffect(() => {
    setMessages([]);
    setError(null);
    setIsLoading(false);
  }, [pathname]);

  // Fetch chat info on mount
  useEffect(() => {
    fetchChatInfo();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchChatInfo = async () => {
    try {
      const response = await fetch("/api/ai/chat");
      const data = await response.json();
      if (data.success) {
        setChatInfo(data);
        const availableProvider = data.providers.find((p: Provider) => p.available);
        if (availableProvider) {
          setSelectedProvider(availableProvider.id);
          setSelectedModel(availableProvider.models[0]);
        }
      }
    } catch (err) {
      console.error("Failed to fetch chat info:", err);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    // Add empty assistant message for streaming
    const assistantId = (Date.now() + 1).toString();
    const assistantMessage: Message = {
      id: assistantId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, assistantMessage]);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          provider: selectedProvider,
          model: selectedModel,
          stream: true,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || `Server error (${response.status})`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let buffer = "";

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
            
            if (parsed.error) {
              throw new Error(parsed.error);
            }
            
            if (parsed.content) {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? { ...m, content: m.content + parsed.content }
                    : m
                )
              );
            }
            
            if (parsed.done && parsed.remaining !== undefined) {
              if (chatInfo) {
                setChatInfo({ ...chatInfo, remaining: parsed.remaining });
              }
            }
          } catch {
            // Skip malformed JSON
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get AI response");
      // Remove empty assistant message on error
      setMessages((prev) => prev.filter((m) => m.id !== assistantId));
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-background/80 backdrop-blur-xl px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">AI Assistant</h1>
            <p className="text-xs text-muted-foreground/70">
              {chatInfo ? `${chatInfo.remaining}/${chatInfo.limit} messages remaining` : "Loading..."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Model Selector */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowModelSelector(!showModelSelector)}
              className={cn(
                "flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-all duration-200",
                modelColors[selectedProvider] || "border-border bg-background text-foreground",
                "hover:bg-muted/60"
              )}
            >
              {modelDisplayNames[selectedModel] || selectedModel}
              <ChevronDown className="h-4 w-4" />
            </motion.button>

            <AnimatePresence>
              {showModelSelector && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-40"
                    onClick={() => setShowModelSelector(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 top-full z-50 mt-2 w-72 rounded-2xl border border-border bg-card p-2 shadow-xl shadow-black/5 dark:shadow-black/20"
                  >
                    {chatInfo?.providers.map((provider) => (
                      <div key={provider.id} className="mb-2">
                        <div className="px-3 py-1.5 text-xs font-semibold uppercase text-muted-foreground/60">
                          {provider.id}
                          {!provider.available && (
                            <span className="ml-2 text-destructive">(API key not set)</span>
                          )}
                        </div>
                        {provider.models.map((model) => (
                          <button
                            key={model}
                            onClick={() => {
                              if (provider.available) {
                                setSelectedProvider(provider.id);
                                setSelectedModel(model);
                                setShowModelSelector(false);
                              }
                            }}
                            disabled={!provider.available}
                            className={cn(
                              "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm transition-all duration-200",
                              selectedModel === model
                                ? "bg-primary/10 text-primary font-medium"
                                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                              !provider.available && "cursor-not-allowed opacity-50"
                            )}
                          >
                            <span>{modelDisplayNames[model] || model}</span>
                            {selectedModel === model && (
                              <span className="ml-auto text-primary">✓</span>
                            )}
                          </button>
                        ))}
                      </div>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Clear Chat */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearChat}
            className="rounded-xl p-2.5 text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors duration-200"
            title="Clear chat"
          >
            <Trash2 className="h-5 w-5" />
          </motion.button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mb-6 relative"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 blur-2xl opacity-50" />
              <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 shadow-lg shadow-primary/10">
                <Bot className="h-12 w-12 text-primary" />
              </div>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="mb-2 text-2xl font-bold text-foreground"
            >
              How can I help you today?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="mb-8 max-w-md text-muted-foreground/70"
            >
              I can help you with Developer OS features, setup, and usage.
              Ask me anything about the project!
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="grid max-w-lg grid-cols-2 gap-3"
            >
              {[
                { icon: Sparkles, text: "What is Developer OS?" },
                { icon: Code, text: "How do I use DSA tracking?" },
                { icon: BookOpen, text: "How to set up the project?" },
                { icon: Zap, text: "What features are available?" },
              ].map((suggestion, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.05, duration: 0.4 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setInput(suggestion.text);
                    inputRef.current?.focus();
                  }}
                  className="flex items-center gap-2.5 rounded-2xl border border-border bg-card p-4 text-left text-sm text-muted-foreground transition-all duration-200 hover:border-primary/20 hover:bg-muted/50 hover:text-foreground hover:shadow-md"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                    <suggestion.icon className="h-4 w-4 text-primary" />
                  </div>
                  {suggestion.text}
                </motion.button>
              ))}
            </motion.div>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  "flex gap-3",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.role === "assistant" && (
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-3",
                    message.role === "user"
                      ? "bg-gradient-to-b from-primary to-primary/90 text-primary-foreground shadow-md shadow-primary/10"
                      : "bg-muted/60 text-foreground border border-border/50"
                  )}
                >
                  <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                  <p
                    className={cn(
                      "mt-1.5 text-[10px]",
                      message.role === "user"
                        ? "text-primary-foreground/60"
                        : "text-muted-foreground/50"
                    )}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                {message.role === "user" && (
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-muted/60">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
              </motion.div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="rounded-2xl bg-gradient-to-br from-muted/60 to-muted/40 border border-border/50 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <div className="absolute inset-0 rounded-full bg-primary/20 blur-sm animate-pulse" />
                    </div>
                    <span className="text-sm text-muted-foreground font-medium">Thinking...</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive"
              >
                <AlertCircle className="h-4 w-4" />
                {error}
                <button onClick={() => setError(null)} className="ml-auto hover:underline">Dismiss</button>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-border bg-background/80 backdrop-blur-xl p-4">
        <div className="mx-auto max-w-3xl">
          <div className="relative flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                chatInfo?.remaining === 0
                  ? "Daily message limit reached"
                  : "Type your message... (Shift+Enter for new line)"
              }
              disabled={isLoading || chatInfo?.remaining === 0}
              rows={1}
              className="flex-1 resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
              style={{ minHeight: "48px", maxHeight: "120px" }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
              }}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={sendMessage}
              disabled={!input.trim() || isLoading || chatInfo?.remaining === 0}
              className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-b from-primary to-primary/90 text-primary-foreground shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </motion.button>
          </div>
          <p className="mt-2 text-center text-xs text-muted-foreground/50">
            Powered by AI • {chatInfo?.remaining || 0} messages remaining today
          </p>
        </div>
      </div>
    </div>
  );
}
