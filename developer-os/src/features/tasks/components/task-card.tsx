"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  Clock,
  Zap,
  AlertTriangle,
  ArrowDown,
  MoreHorizontal,
  Play,
  Trash2,
  Edit3,
  Calendar,
  Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Task, TaskPriority, TaskStatus, TaskCategory } from "../types";

interface TaskCardProps {
  task: Task;
  onComplete?: (id: string) => void;
  onStart?: (id: string) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (id: string) => void;
}

const priorityConfig: Record<TaskPriority, { icon: React.ComponentType<{ className?: string }>; color: string; bgColor: string; label: string }> = {
  urgent: { icon: Zap, color: "text-red-500", bgColor: "bg-red-500/10", label: "Urgent" },
  high: { icon: AlertTriangle, color: "text-accentOrange", bgColor: "bg-accentOrange/10", label: "High" },
  medium: { icon: Clock, color: "text-yellow-500", bgColor: "bg-yellow-500/10", label: "Medium" },
  low: { icon: ArrowDown, color: "text-blue-500", bgColor: "bg-blue-500/10", label: "Low" },
};

const statusConfig: Record<TaskStatus, { icon: React.ComponentType<{ className?: string }>; color: string; label: string }> = {
  pending: { icon: Circle, color: "text-muted-foreground", label: "Pending" },
  in_progress: { icon: Play, color: "text-blue-500", label: "In Progress" },
  completed: { icon: CheckCircle2, color: "text-green-500", label: "Completed" },
  skipped: { icon: Circle, color: "text-muted-foreground line-through", label: "Skipped" },
  cancelled: { icon: Circle, color: "text-red-500", label: "Cancelled" },
};

const categoryColors: Record<TaskCategory, string> = {
  dsa: "bg-purple-500/10 text-purple-500",
  ml: "bg-green-500/10 text-green-500",
  project: "bg-blue-500/10 text-blue-500",
  coding: "bg-cyan-500/10 text-cyan-500",
  review: "bg-pink-500/10 text-pink-500",
  reading: "bg-indigo-500/10 text-indigo-500",
  exercise: "bg-teal-500/10 text-teal-500",
  other: "bg-gray-500/10 text-gray-500",
};

export function TaskCard({ task, onComplete, onStart, onEdit, onDelete }: TaskCardProps) {
  const [showActions, setShowActions] = useState(false);
  const priority = priorityConfig[task.priority];
  const status = statusConfig[task.status];
  const StatusIcon = status.icon;
  const PriorityIcon = priority.icon;
  const isCompleted = task.status === "completed";
  const isInProgress = task.status === "in_progress";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        "group relative rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/20 hover:shadow-md",
        isCompleted && "opacity-60",
        isInProgress && "border-blue-500/30 bg-blue-500/5"
      )}
    >
      {/* Top row: Status + Title + Actions */}
      <div className="flex items-start gap-3">
        {/* Status button */}
        <button
          onClick={() => {
            if (task.status === "completed") return;
            if (isInProgress) onComplete?.(task.id);
            else onStart?.(task.id);
          }}
          className="mt-0.5 flex-shrink-0"
        >
          <StatusIcon className={cn("h-5 w-5", status.color)} />
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3
              className={cn(
                "text-sm font-medium text-foreground",
                isCompleted && "line-through"
              )}
            >
              {task.title}
            </h3>
            {task.source === "ai-generated" && (
              <span className="inline-flex items-center rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-medium text-primary">
                AI
              </span>
            )}
          </div>

          {task.description && (
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
              {task.description}
            </p>
          )}

          {/* Meta info */}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {/* Category badge */}
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium",
                categoryColors[task.category]
              )}
            >
              {task.category.toUpperCase()}
            </span>

            {/* Priority */}
            <div className="flex items-center gap-1">
              <PriorityIcon className={cn("h-3 w-3", priority.color)} />
              <span className="text-[10px] text-muted-foreground">{priority.label}</span>
            </div>

            {/* Time estimate */}
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground">
                {task.estimatedMinutes}m
              </span>
            </div>

            {/* Scheduled time */}
            {task.scheduledTime && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">
                  {task.scheduledTime}
                </span>
              </div>
            )}
          </div>

          {/* Progress bar */}
          {task.progress > 0 && !isCompleted && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                <span>Progress</span>
                <span>{task.progress}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${task.progress}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full rounded-full bg-primary"
                />
              </div>
            </div>
          )}

          {/* AI Reasoning */}
          {task.aiReasoning && (
            <p className="mt-2 text-[10px] text-muted-foreground italic">
              💡 {task.aiReasoning}
            </p>
          )}

          {/* Tags */}
          {task.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {task.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-0.5 rounded bg-muted px-1.5 py-0.5 text-[9px] text-muted-foreground"
                >
                  <Tag className="h-2 w-2" />
                  {tag}
                </span>
              ))}
              {task.tags.length > 3 && (
                <span className="text-[9px] text-muted-foreground">
                  +{task.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Actions menu */}
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="rounded-lg p-1.5 text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-muted transition-all"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>

          {showActions && (
            <div className="absolute right-0 top-8 z-10 w-36 rounded-lg border border-border bg-background p-1 shadow-lg">
              {task.status !== "completed" && (
                <button
                  onClick={() => {
                    onStart?.(task.id);
                    setShowActions(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs text-foreground hover:bg-muted"
                >
                  <Play className="h-3 w-3" />
                  Start
                </button>
              )}
              <button
                onClick={() => {
                  onEdit?.(task);
                  setShowActions(false);
                }}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs text-foreground hover:bg-muted"
              >
                <Edit3 className="h-3 w-3" />
                Edit
              </button>
              <button
                onClick={() => {
                  onDelete?.(task.id);
                  setShowActions(false);
                }}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs text-red-500 hover:bg-red-500/10"
              >
                <Trash2 className="h-3 w-3" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
