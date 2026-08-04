"use client";

import { motion } from "framer-motion";
import { Sparkles, Clock, CheckCircle2, Circle, Zap, AlertTriangle, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DailyTasks, AITask } from "../types";

interface AITasksWidgetProps {
  tasks: DailyTasks;
}

const priorityConfig: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string; label: string }> = {
  high: { icon: Zap, color: "text-red-500", label: "High" },
  medium: { icon: AlertTriangle, color: "text-yellow-500", label: "Medium" },
  low: { icon: ArrowDown, color: "text-blue-500", label: "Low" },
};

const categoryColors: Record<string, string> = {
  dsa: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  ml: "bg-green-500/10 text-green-600 border-green-500/20",
  project: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  coding: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
  review: "bg-pink-500/10 text-pink-600 border-pink-500/20",
};

function TaskItem({ task, index }: { task: AITask; index: number }) {
  const priority = priorityConfig[task.priority];
  const PriorityIcon = priority.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group flex items-start gap-3 rounded-xl border border-border p-4 transition-all duration-200 hover:bg-muted/40 hover:border-primary/15 hover:shadow-sm",
        task.isCompleted && "opacity-50"
      )}
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="mt-0.5 cursor-pointer"
      >
        {task.isCompleted ? (
          <CheckCircle2 className="h-5 w-5 text-green-500" />
        ) : (
          <Circle className="h-5 w-5 text-muted-foreground/50 hover:text-primary transition-colors" />
        )}
      </motion.div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p
            className={cn(
              "text-sm font-medium text-foreground truncate",
              task.isCompleted && "line-through text-muted-foreground"
            )}
          >
            {task.title}
          </p>
          <span
            className={cn(
              "inline-flex items-center rounded-lg border px-2 py-0.5 text-[10px] font-bold",
              categoryColors[task.category] || "bg-gray-500/10 text-gray-600 border-gray-500/20"
            )}
          >
            {task.category.toUpperCase()}
          </span>
        </div>
        {task.description && (
          <p className="mt-1 text-xs text-muted-foreground/70 truncate">
            {task.description}
          </p>
        )}
        <div className="mt-2.5 flex items-center gap-3">
          <div className="flex items-center gap-1">
            <PriorityIcon className={cn("h-3 w-3", priority.color)} />
            <span className="text-[10px] font-medium text-muted-foreground">{priority.label}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-muted-foreground/60" />
            <span className="text-[10px] text-muted-foreground">{task.estimatedTime}m</span>
          </div>
          {task.relatedTopic && (
            <span className="text-[10px] text-muted-foreground/60 bg-muted/50 px-1.5 py-0.5 rounded">
              {task.relatedTopic}
            </span>
          )}
        </div>
        {task.progress !== undefined && task.progress > 0 && !task.isCompleted && (
          <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-muted">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${task.progress}%` }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70"
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function AITasksWidget({ tasks }: AITasksWidgetProps) {
  const completedCount = tasks.completedTasks;
  const progress = (completedCount / tasks.totalTasks) * 100;
  const totalTimeHours = Math.round(tasks.totalEstimatedTime / 60 * 10) / 10;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-border bg-card p-6 shadow-sm"
    >
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <h2 className="text-lg font-semibold text-foreground">
            AI Daily Tasks
          </h2>
          <span className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-primary/15 to-primary/10 px-2.5 py-1 text-[10px] font-bold text-primary border border-primary/10 shadow-sm">
            <Sparkles className="h-3 w-3" />
            AI
          </span>
        </div>
        <span className="text-sm text-muted-foreground/70 font-medium">
          ~{totalTimeHours}h total
        </span>
      </div>

      <div className="mb-5">
        <div className="flex items-center justify-between text-xs text-muted-foreground/70 mb-2">
          <span className="font-medium">{completedCount} of {tasks.totalTasks} completed</span>
          <span className="font-semibold text-primary">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70"
          />
        </div>
      </div>

      <div className="space-y-2">
        {tasks.tasks.map((task, index) => (
          <TaskItem key={task.id} task={task} index={index} />
        ))}
      </div>
    </motion.div>
  );
}
