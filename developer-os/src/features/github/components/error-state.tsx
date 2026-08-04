"use client";

import { motion } from "framer-motion";
import { AlertCircle, RefreshCw, ExternalLink, Loader2 } from "lucide-react";
import { container, item } from "../types";

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
  isSyncing: boolean;
}

export function ErrorState({ error, onRetry, isSyncing }: ErrorStateProps) {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="relative overflow-hidden rounded-2xl border border-accentOrange/20 bg-gradient-to-r from-accentOrange/5 to-red-500/5 p-6 shadow-sm">
        <div className="absolute top-0 right-0 h-32 w-32 bg-gradient-to-bl from-accentOrange/10 to-transparent rounded-bl-full" />
        <div className="relative flex items-start gap-4">
          <div className="rounded-2xl bg-gradient-to-br from-accentOrange to-red-500 p-3 shadow-lg shadow-accentOrange/20">
            <AlertCircle className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground">Having trouble connecting?</h3>
            <p className="mt-1 text-muted-foreground/70">{error}. You can link your GitHub account using your email below!</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={onRetry} disabled={isSyncing}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-b from-primary to-primary/90 px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50 transition-all duration-200">
                {isSyncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />} Try Again
              </motion.button>
              <a href="https://github.com/" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted/60 transition-all duration-200">
                <ExternalLink className="h-4 w-4" /> Open GitHub
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
