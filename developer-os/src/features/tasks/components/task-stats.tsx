"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Target,
  Flame,
  Clock,
  CheckCircle2,
  Calendar,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { TaskStats as TaskStatsType } from "../types";

interface TaskStatsProps {
  stats: TaskStatsType;
}

export function TaskStats({ stats }: TaskStatsProps) {
  const statCards = [
    {
      title: "Completion Rate",
      value: `${stats.completionRate.toFixed(1)}%`,
      icon: Target,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      trend: stats.weeklyTrend,
    },
    {
      title: "Current Streak",
      value: `${stats.currentStreak} days`,
      icon: Flame,
      color: "text-accentOrange",
      bgColor: "bg-accentOrange/10",
      target: `Goal: ${stats.streakGoal} days`,
    },
    {
      title: "Time Accuracy",
      value: `${stats.timeAccuracy.toFixed(1)}%`,
      icon: Clock,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Focus Score",
      value: stats.averageFocusScore.toFixed(0),
      icon: Zap,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      subtitle: `Best: ${stats.mostProductiveTimeOfDay}`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-xl border border-border bg-card p-4"
            >
              <div className="flex items-center justify-between">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg",
                    stat.bgColor
                  )}
                >
                  <Icon className={cn("h-5 w-5", stat.color)} />
                </div>
                {stat.trend !== undefined && (
                  <div
                    className={cn(
                      "flex items-center gap-1 text-xs font-medium",
                      stat.trend >= 0 ? "text-green-500" : "text-red-500"
                    )}
                  >
                    {stat.trend >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {Math.abs(stat.trend)}%
                  </div>
                )}
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.title}</p>
              </div>
              {(stat.target || stat.subtitle) && (
                <p className="mt-1 text-[10px] text-muted-foreground">
                  {stat.target || stat.subtitle}
                </p>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Category Breakdown */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-4 text-sm font-medium text-foreground">Category Breakdown</h3>
        <div className="space-y-3">
          {stats.categoryBreakdown.map((cat) => (
            <div key={cat.category}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium text-foreground uppercase">
                  {cat.category}
                </span>
                <span className="text-muted-foreground">
                  {cat.completedCount}/{cat.taskCount} tasks • {Math.round(cat.totalMinutes / 60)}h
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${cat.averageProgress}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full rounded-full bg-primary"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Activity Chart */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-4 text-sm font-medium text-foreground">Weekly Activity</h3>
        <div className="flex items-end justify-between gap-2 h-32">
          {stats.dailyStats.map((day, index) => {
            const maxMinutes = Math.max(...stats.dailyStats.map((d) => d.minutesWorked));
            const height = (day.minutesWorked / maxMinutes) * 100;
            return (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className={cn(
                    "w-full rounded-t-md",
                    day.focusScore >= 80
                      ? "bg-green-500"
                      : day.focusScore >= 60
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  )}
                />
                <span className="text-[10px] text-muted-foreground">
                  {new Date(day.date).toLocaleDateString("en", { weekday: "short" })}
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex items-center justify-center gap-4 text-[10px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-sm bg-green-500" />
            High Focus (80+)
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-sm bg-yellow-500" />
            Medium (60-79)
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-sm bg-red-500" />
            Low (&lt;60)
          </div>
        </div>
      </div>
    </div>
  );
}
