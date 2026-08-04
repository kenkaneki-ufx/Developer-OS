"use client";

import { motion } from "framer-motion";
import { Code, Flame, Target, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DSAProgress } from "../types";

interface DSAWidgetProps {
  dsa: DSAProgress;
}

const platformColors: Record<string, string> = {
  leetcode: "text-yellow-600 bg-yellow-500/10",
  codeforces: "text-blue-600 bg-blue-500/10",
  geeksforgeeks: "text-green-600 bg-green-500/10",
  atcoder: "text-red-600 bg-red-500/10",
};

export function DSAWidget({ dsa }: DSAWidgetProps) {
  const weeklyProgressPercent = (dsa.weeklyProgress / dsa.weeklyGoal) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-border bg-card p-6 shadow-sm"
    >
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted/50">
            <Code className="h-4 w-4 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">DSA Tracker</h2>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-accentOrange font-medium">
          <Flame className="h-4 w-4" />
          <span>{dsa.streak} day streak</span>
        </div>
      </div>

      <div className="mb-5 rounded-xl bg-gradient-to-br from-primary/5 to-primary/[0.02] p-4 border border-primary/10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground/60 font-medium">Current Topic</p>
            <p className="text-sm font-semibold text-foreground mt-0.5">
              {dsa.currentTopic.name}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground/60 font-medium">Mastery</p>
            <p className="text-sm font-bold text-primary">
              {dsa.currentTopic.mastery}%
            </p>
          </div>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted/50">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${dsa.currentTopic.mastery}%` }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70"
          />
        </div>
        <p className="mt-2 text-xs text-muted-foreground/60">
          {dsa.currentTopic.solvedQuestions}/{dsa.currentTopic.totalQuestions} questions solved
        </p>
      </div>

      <div className="mb-5 grid grid-cols-3 gap-2">
        {[
          { value: dsa.totalSolved, label: "Total Solved", color: "text-foreground" },
          { value: dsa.todaySolved, label: "Today", color: "text-green-600", bg: "bg-green-500/10" },
          { value: dsa.weeklyProgress, label: "This Week", color: "text-blue-600", bg: "bg-blue-500/10" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            className="rounded-xl bg-muted/30 p-3 text-center border border-border/50"
          >
            <p className={cn("text-lg font-bold", stat.color)}>{stat.value}</p>
            <p className="text-[10px] text-muted-foreground/60 font-medium">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="mb-5">
        <div className="flex items-center justify-between text-xs text-muted-foreground/70 mb-2">
          <span className="font-medium">Weekly Goal</span>
          <span className="font-semibold">
            {dsa.weeklyProgress}/{dsa.weeklyGoal}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted/50">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(weeklyProgressPercent, 100)}%` }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "h-full rounded-full",
              weeklyProgressPercent >= 100
                ? "bg-gradient-to-r from-green-500 to-emerald-500"
                : "bg-gradient-to-r from-primary to-primary/70"
            )}
          />
        </div>
      </div>

      <div>
        <p className="mb-2.5 text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider">
          Platforms
        </p>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(dsa.platforms).map(([platform, count]) => (
            <div
              key={platform}
              className={cn(
                "flex items-center justify-between rounded-lg px-3 py-2 border border-border/50",
                "bg-muted/20 hover:bg-muted/40 transition-colors duration-200"
              )}
            >
              <span className="text-xs text-muted-foreground/70 capitalize font-medium">
                {platform}
              </span>
              <span
                className={cn(
                  "text-xs font-bold",
                  platformColors[platform] || "text-foreground"
                )}
              >
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
