"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DailyProgress, WeeklyProgress } from "../types";

interface ProgressChartProps {
  dailyProgress: DailyProgress[];
  weeklyProgress: WeeklyProgress[];
}

export function ProgressChart({ dailyProgress, weeklyProgress }: ProgressChartProps) {
  const maxSolved = Math.max(...dailyProgress.map((d) => d.solved), 1);
  const maxTimeSpent = Math.max(...dailyProgress.map((d) => d.timeSpent), 1);
  const currentWeek = weeklyProgress[weeklyProgress.length - 1];
  const previousWeek = weeklyProgress[weeklyProgress.length - 2];

  const solvedChange = currentWeek && previousWeek
    ? ((currentWeek.totalSolved - previousWeek.totalSolved) / previousWeek.totalSolved) * 100
    : 0;

  return (
    <div className="space-y-6">
      {}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">This Week</h3>
          {solvedChange !== 0 && (
            <div className={cn("flex items-center gap-1 text-xs font-medium", solvedChange >= 0 ? "text-green-500" : "text-red-500")}>
              {solvedChange >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {Math.abs(solvedChange).toFixed(1)}%
            </div>
          )}
        </div>

        {currentWeek && (
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{currentWeek.totalSolved}</p>
              <p className="text-xs text-muted-foreground">Solved</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{Math.round(currentWeek.totalTimeSpent / 60)}h</p>
              <p className="text-xs text-muted-foreground">Time Spent</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{currentWeek.totalAttempted}</p>
              <p className="text-xs text-muted-foreground">Attempted</p>
            </div>
          </div>
        )}

        {currentWeek && (
          <div className="flex gap-2 text-xs">
            <span className="rounded bg-green-500/10 px-2 py-1 text-green-500">Easy: {currentWeek.difficultyBreakdown.easy}</span>
            <span className="rounded bg-yellow-500/10 px-2 py-1 text-yellow-500">Medium: {currentWeek.difficultyBreakdown.medium}</span>
            <span className="rounded bg-red-500/10 px-2 py-1 text-red-500">Hard: {currentWeek.difficultyBreakdown.hard}</span>
          </div>
        )}
      </div>

      {}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-4 font-semibold text-foreground">Daily Progress</h3>
        <div className="flex items-end justify-between gap-2 h-40">
          {dailyProgress.map((day, index) => {
            const height = (day.solved / maxSolved) * 100;
            return (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="w-full rounded-t-md bg-primary"
                />
                <span className="text-[10px] text-muted-foreground">
                  {new Date(day.date).toLocaleDateString("en", { weekday: "short" })}
                </span>
                <span className="text-[10px] font-medium text-foreground">{day.solved}</span>
              </div>
            );
          })}
        </div>
      </div>

      {}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-4 font-semibold text-foreground">Time Distribution</h3>
        <div className="space-y-3">
          {dailyProgress.map((day) => {
            const hours = Math.round(day.timeSpent / 60 * 10) / 10;
            return (
              <div key={day.date} className="flex items-center gap-3">
                <span className="w-20 text-xs text-muted-foreground">
                  {new Date(day.date).toLocaleDateString("en", { weekday: "short" })}
                </span>
                <div className="flex-1 h-4 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(day.timeSpent / (maxTimeSpent || 180)) * 100}%` }}
                    className="h-full rounded-full bg-blue-500"
                  />
                </div>
                <span className="w-12 text-xs text-muted-foreground text-right">{hours}h</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
