"use client";

import { motion } from "framer-motion";
import { Flame, Target, CheckCircle2, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StreakData } from "../types";

interface StreakWidgetProps {
  streak: StreakData;
  onMarkSolved?: () => void;
}

export function StreakWidget({ streak, onMarkSolved }: StreakWidgetProps) {
  const streakProgress = (streak.currentStreak / streak.streakGoal) * 100;
  const weeklyProgress = (streak.weeklyProgress / streak.weeklyGoal) * 100;

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Daily Streak</h3>
        <div className="flex items-center gap-1 text-accentOrange">
          <Flame className="h-5 w-5" />
          <span className="text-lg font-bold">{streak.currentStreak}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="rounded-lg bg-muted/50 p-3 text-center">
          <p className="text-2xl font-bold text-accentOrange">{streak.currentStreak}</p>
          <p className="text-xs text-muted-foreground">Current Streak</p>
        </div>
        <div className="rounded-lg bg-muted/50 p-3 text-center">
          <p className="text-2xl font-bold text-foreground">{streak.longestStreak}</p>
          <p className="text-xs text-muted-foreground">Best Streak</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
          <span>Streak Goal: {streak.streakGoal} days</span>
          <span>{streak.currentStreak}/{streak.streakGoal}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(streakProgress, 100)}%` }}
            className={cn("h-full rounded-full", streakProgress >= 100 ? "bg-green-500" : "bg-accentOrange")}
          />
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
          <span>Weekly Goal: {streak.weeklyGoal} questions</span>
          <span>{streak.weeklyProgress}/{streak.weeklyGoal}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(weeklyProgress, 100)}%` }}
            className={cn("h-full rounded-full", weeklyProgress >= 100 ? "bg-green-500" : "bg-primary")}
          />
        </div>
      </div>

      <button
        onClick={onMarkSolved}
        disabled={streak.todaySolved}
        aria-label={streak.todaySolved ? "Already completed today" : "Mark today as solved"}
        className={cn(
          "w-full rounded-lg py-2.5 text-sm font-medium transition-all",
          streak.todaySolved
            ? "bg-green-500/10 text-green-500 cursor-not-allowed"
            : "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98]"
        )}
      >
        {streak.todaySolved ? (
          <span className="flex items-center justify-center gap-2">
            <CheckCircle2 className="h-4 w-4" /> Completed Today!
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <Target className="h-4 w-4" /> Mark Today as Solved
          </span>
        )}
      </button>
    </div>
  );
}
