"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  Clock,
  Bookmark,
  ExternalLink,
  AlertTriangle,
  RotateCcw,
  Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { DSAQuestion, QuestionStatus, Difficulty } from "../types";

interface QuestionListProps {
  questions: DSAQuestion[];
  onUpdateStatus?: (id: string, status: QuestionStatus) => void;
  onToggleBookmark?: (id: string) => void;
  emptyMessage?: string;
}

const statusConfig: Record<QuestionStatus, { icon: React.ComponentType<{ className?: string }>; color: string; label: string }> = {
  solved: { icon: CheckCircle2, color: "text-green-500", label: "Solved" },
  attempted: { icon: Clock, color: "text-yellow-500", label: "Attempted" },
  bookmarked: { icon: Bookmark, color: "text-blue-500", label: "Bookmarked" },
  todo: { icon: Circle, color: "text-muted-foreground", label: "To Do" },
  revision: { icon: RotateCcw, color: "text-purple-500", label: "Revision" },
};

const difficultyColors: Record<Difficulty, string> = {
  easy: "bg-green-500/10 text-green-500",
  medium: "bg-yellow-500/10 text-yellow-500",
  hard: "bg-red-500/10 text-red-500",
};

export function QuestionList({ questions, onUpdateStatus, onToggleBookmark, emptyMessage = "No questions found" }: QuestionListProps) {
  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12">
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <AnimatePresence mode="popLayout">
        {questions.map((question, index) => {
          const status = statusConfig[question.status];
          const StatusIcon = status.icon;
          const isSolved = question.status === "solved";

          return (
            <motion.div
              key={question.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: index * 0.03 }}
              className={cn(
                "group flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/20 hover:shadow-sm",
                isSolved && "opacity-70"
              )}
            >
              {}
              <button
                onClick={() => {
                  const nextStatus: QuestionStatus = isSolved ? "todo" : "solved";
                  onUpdateStatus?.(question.id, nextStatus);
                }}
                className="flex-shrink-0"
              >
                <StatusIcon className={cn("h-5 w-5", status.color)} />
              </button>

              {}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className={cn("text-sm font-medium text-foreground truncate", isSolved && "line-through")}>
                    {question.title}
                  </h4>
                  {question.isMistake && (
                    <AlertTriangle className="h-3 w-3 text-accentOrange flex-shrink-0" />
                  )}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium", difficultyColors[question.difficulty])}>
                    {question.difficulty}
                  </span>
                  <span className="text-[10px] text-muted-foreground capitalize">{question.platform}</span>
                  <span className="text-[10px] text-muted-foreground">•</span>
                  <span className="text-[10px] text-muted-foreground">{question.topicName}</span>
                  {question.timeSpent > 0 && (
                    <>
                      <span className="text-[10px] text-muted-foreground">•</span>
                      <span className="text-[10px] text-muted-foreground">{question.timeSpent}min</span>
                    </>
                  )}
                </div>
                {question.tags.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {question.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="inline-flex items-center gap-0.5 rounded bg-muted px-1.5 py-0.5 text-[9px] text-muted-foreground">
                        <Tag className="h-2 w-2" />{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onToggleBookmark?.(question.id)}
                  className={cn("rounded-lg p-1.5 transition-colors", question.isBookmarked ? "text-yellow-500" : "text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-yellow-500")}
                >
                  <Bookmark className={cn("h-4 w-4", question.isBookmarked && "fill-current")} />
                </button>
                <a
                  href={question.platformUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg p-1.5 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-foreground transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
