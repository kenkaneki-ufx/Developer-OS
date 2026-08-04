"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Clock, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DSATopic } from "../types";

interface TopicCardProps {
  topic: DSATopic;
  index: number;
  onClick?: () => void;
}

const masteryColors: Record<string, string> = {
  beginner: "bg-red-500",
  learning: "bg-orange-500",
  intermediate: "bg-yellow-500",
  advanced: "bg-blue-500",
  mastered: "bg-green-500",
};

const masteryLabels: Record<string, string> = {
  beginner: "Beginner",
  learning: "Learning",
  intermediate: "Intermediate",
  advanced: "Advanced",
  mastered: "Mastered",
};

export function TopicCard({ topic, index, onClick }: TopicCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className="group cursor-pointer rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/20 hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground">{topic.name}</h3>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
              {masteryLabels[topic.masteryLevel]}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{topic.description}</p>
        </div>
        <div className="flex h-14 w-14 items-center justify-center rounded-full border-4" style={{ borderColor: `hsl(var(--primary))` }}>
          <span className="text-lg font-bold text-foreground">{topic.mastery}%</span>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
          <span>{topic.solvedQuestions}/{topic.totalQuestions} solved</span>
          <span>{topic.estimatedHours}h estimated</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${topic.mastery}%` }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className={cn("h-full rounded-full", masteryColors[topic.masteryLevel])}
          />
        </div>
      </div>

      <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3" />{topic.solvedQuestions} solved</span>
        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{topic.attemptedQuestions} attempted</span>
        <span className="flex items-center gap-1"><Bookmark className="h-3 w-3" />{topic.bookmarkedCount} saved</span>
      </div>

      {topic.lastPracticed && (
        <p className="mt-2 text-[10px] text-muted-foreground">Last practiced: {new Date(topic.lastPracticed).toLocaleDateString()}</p>
      )}
    </motion.div>
  );
}
