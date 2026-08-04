"use client";

import { motion } from "framer-motion";
import { Brain, BookOpen, CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MLProgress } from "../types";

interface MLWidgetProps {
  ml: MLProgress;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

export function MLWidget({ ml }: MLWidgetProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="rounded-2xl border border-border bg-card p-6 shadow-sm"
    >
      <motion.div variants={itemVariants} className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/15 to-purple-500/10">
            <Brain className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">ML Roadmap</h2>
          </div>
        </div>
        <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-500 border border-blue-500/20">
          {ml.currentPhase}
        </span>
      </motion.div>

      {/* Current Topic */}
      <motion.div variants={itemVariants} className="mb-5 rounded-xl bg-gradient-to-br from-muted/40 to-muted/20 border border-border/50 p-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-xs text-muted-foreground">Current Topic</p>
            <p className="text-sm font-semibold text-foreground">
              {ml.currentTopic.name}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Progress</p>
            <p className="text-sm font-bold text-primary">
              {ml.currentTopic.progress}%
            </p>
          </div>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-muted/60">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${ml.currentTopic.progress}%` }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70"
          />
        </div>
      </motion.div>

      {/* Overall Progress */}
      <motion.div variants={itemVariants} className="mb-5">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <span className="font-medium">Overall Progress</span>
          <span className="font-semibold text-foreground">{ml.overallProgress}%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-muted/60">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${ml.overallProgress}%` }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
          />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {ml.completedTopics}/{ml.totalTopics} topics completed
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="mb-5 grid grid-cols-2 gap-3">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="rounded-xl border border-border bg-gradient-to-br from-blue-500/5 to-purple-500/5 p-3.5 text-center"
        >
          <p className="text-xl font-bold text-foreground">{ml.projectsCompleted}</p>
          <p className="text-[10px] text-muted-foreground font-medium">Projects Done</p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="rounded-xl border border-border bg-gradient-to-br from-green-500/5 to-emerald-500/5 p-3.5 text-center"
        >
          <p className="text-xl font-bold text-green-500">{ml.completedTopics}</p>
          <p className="text-[10px] text-muted-foreground font-medium">Topics Done</p>
        </motion.div>
      </motion.div>

      {/* Roadmap Preview */}
      <motion.div variants={itemVariants}>
        <p className="mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Roadmap
        </p>
        <div className="space-y-2.5">
          {ml.roadmap.map((topic, index) => (
            <motion.div
              key={topic.id}
              variants={itemVariants}
              whileHover={{ x: 2 }}
              className="flex items-center gap-2.5 rounded-lg p-1.5 transition-colors hover:bg-muted/40"
            >
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold transition-all",
                  topic.isCompleted
                    ? "bg-green-500/10 text-green-500 border border-green-500/20"
                    : topic.progress > 0
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "bg-muted text-muted-foreground border border-border"
                )}
              >
                {topic.isCompleted ? (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                ) : (
                  index + 1
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    "text-xs font-medium truncate",
                    topic.isCompleted
                      ? "text-muted-foreground line-through"
                      : "text-foreground"
                  )}
                >
                  {topic.name}
                </p>
              </div>
              <span className={cn(
                "text-[10px] font-semibold",
                topic.isCompleted ? "text-green-500" : topic.progress > 0 ? "text-primary" : "text-muted-foreground"
              )}>
                {topic.progress}%
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
