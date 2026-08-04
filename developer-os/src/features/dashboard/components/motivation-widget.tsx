"use client";

import { motion } from "framer-motion";
import { Sparkles, RefreshCw } from "lucide-react";
import type { MotivationQuote } from "../types";

interface MotivationWidgetProps {
  quote: MotivationQuote;
  onRefresh?: () => void;
}

export function MotivationWidget({ quote, onRefresh }: MotivationWidgetProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/5 via-card to-primary/[0.08] p-6 shadow-sm"
    >
      {/* Background decorations */}
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/[0.06] blur-3xl" />
      <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-gradient-to-br from-primary/[0.05] to-transparent blur-3xl" />
      <div className="absolute right-1/4 top-1/2 h-20 w-20 rounded-full bg-gradient-to-br from-primary/[0.04] to-transparent blur-2xl" />

      <div className="relative">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <h2 className="text-sm font-semibold text-primary/90">
              Today&apos;s Inspiration
            </h2>
          </div>
          {onRefresh && (
            <motion.button
              onClick={onRefresh}
              whileHover={{ scale: 1.05, rotate: 90 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-xl p-2 text-muted-foreground/60 hover:bg-primary/10 hover:text-primary transition-colors duration-200"
            >
              <RefreshCw className="h-4 w-4" />
            </motion.button>
          )}
        </div>

        <blockquote className="text-lg font-medium text-foreground leading-relaxed tracking-tight">
          &ldquo;{quote.text}&rdquo;
        </blockquote>

        <p className="mt-4 text-sm font-medium text-muted-foreground/70">
          — {quote.author}
        </p>
      </div>
    </motion.div>
  );
}
