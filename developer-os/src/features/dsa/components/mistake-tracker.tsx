"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  BookOpen,
  ChevronDown,
  ChevronUp,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Mistake } from "../types";

interface MistakeTrackerProps {
  mistakes: Mistake[];
  onResolve?: (id: string) => void;
}

const mistakeTypeConfig: Record<string, { label: string; color: string }> = {
  logic: { label: "Logic Error", color: "bg-red-500/10 text-red-500" },
  implementation: { label: "Implementation", color: "bg-accentOrange/10 text-accentOrange" },
  timeout: { label: "Time Limit", color: "bg-yellow-500/10 text-yellow-500" },
  "edge-case": { label: "Edge Case", color: "bg-purple-500/10 text-purple-500" },
  concept: { label: "Concept Gap", color: "bg-blue-500/10 text-blue-500" },
};

export function MistakeTracker({ mistakes, onResolve }: MistakeTrackerProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "unresolved" | "resolved">("unresolved");

  const filtered = mistakes.filter((m) => {
    if (filter === "unresolved") return !m.isResolved;
    if (filter === "resolved") return m.isResolved;
    return true;
  });

  const unresolvedCount = mistakes.filter((m) => !m.isResolved).length;

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-accentOrange" />
          <h3 className="font-semibold text-foreground">Mistake Tracker</h3>
          {unresolvedCount > 0 && (
            <span className="rounded-full bg-accentOrange/10 px-2 py-0.5 text-[10px] font-medium text-accentOrange">
              {unresolvedCount} unresolved
            </span>
          )}
        </div>
        <div className="flex gap-1 rounded-lg border border-border bg-muted/50 p-1">
          {(["all", "unresolved", "resolved"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-md px-2 py-1 text-[10px] font-medium transition-colors",
                filter === f ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
              )}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8">
          <CheckCircle2 className="h-8 w-8 text-green-500 mb-2" />
          <p className="text-sm text-muted-foreground">
            {filter === "resolved" ? "No resolved mistakes yet" : "No mistakes to review! 🎉"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {filtered.map((mistake, index) => {
              const isExpanded = expandedId === mistake.id;
              const typeConfig = mistakeTypeConfig[mistake.mistakeType];

              return (
                <motion.div
                  key={mistake.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    "rounded-lg border border-border transition-all",
                    mistake.isResolved && "opacity-60"
                  )}
                >
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : mistake.id)}
                    className="flex w-full items-center gap-3 p-3 text-left"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                      {mistake.isResolved ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-accentOrange" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {mistake.question.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={cn("rounded px-1.5 py-0.5 text-[9px] font-medium", typeConfig?.color)}>
                          {typeConfig?.label}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {mistake.reviewCount} reviews
                        </span>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-border p-3 space-y-3">
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1">Mistake</p>
                            <p className="text-sm text-foreground">{mistake.description}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-green-500 mb-1">Correction</p>
                            <p className="text-sm text-foreground">{mistake.correction}</p>
                          </div>
                          {mistake.nextReview && (
                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              Next review: {new Date(mistake.nextReview).toLocaleDateString()}
                            </div>
                          )}
                          {!mistake.isResolved && onResolve && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onResolve(mistake.id);
                              }}
                              className="flex items-center gap-1 rounded-lg bg-green-500/10 px-3 py-1.5 text-xs font-medium text-green-500 hover:bg-green-500/20"
                            >
                              <CheckCircle2 className="h-3 w-3" />
                              Mark as Resolved
                            </button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
