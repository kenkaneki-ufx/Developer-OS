"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Target,
  Clock,
  CheckCircle2,
  Lightbulb,
  Star,
  ArrowUpRight,
  Flame,
  Calendar,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageWrapper } from "@/components/ui/page-wrapper";

const weeklyData = {
  tasksCompleted: 0,
  tasksGoal: 25,
  hoursStudied: 0,
  hoursGoal: 30,
  dsaSolved: 0,
  dsaGoal: 20,
  streakDays: 0,
  consistencyScore: 0,
};

const insights: Array<{ type: string; title: string; description: string; icon: React.ComponentType<{ className?: string }> }> = [];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function WeeklyReviewPage() {
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [todayIndex, setTodayIndex] = useState<number | null>(null);
  const [dayProgressData] = useState(() => 
    [85, 72, 45, 92, 68, 55, 40]
  );
  const [dayTasksData] = useState(() => 
    [3, 4, 2, 5, 3, 1, 2]
  );

  useEffect(() => {
    setTodayIndex(new Date().getDay() - 1);
  }, []);

  const weekOptions = [
    { label: "This Week", value: 0 },
    { label: "Last Week", value: 1 },
    { label: "2 Weeks Ago", value: 2 },
  ];

  return (
    <PageWrapper 
      title="Weekly Review" 
      subtitle="Week of July 21 - July 27, 2026"
      headerAction={
        <div className="flex items-center gap-2">
          <div className="flex gap-1 rounded-xl border border-border bg-muted/30 p-1">
            {weekOptions.map((week) => (
              <button
                key={week.value}
                onClick={() => setSelectedWeek(week.value)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200",
                  selectedWeek === week.value
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground/60 hover:text-foreground hover:bg-muted/40"
                )}
              >
                {week.label}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted transition-all">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      }
    >
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        {/* Stats Grid */}
        <motion.div variants={item} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Tasks Completed", value: weeklyData.tasksCompleted, goal: weeklyData.tasksGoal, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-500/10", trend: "+12%" },
            { label: "Hours Studied", value: weeklyData.hoursStudied, goal: weeklyData.hoursGoal, icon: Clock, color: "text-blue-600", bg: "bg-blue-500/10", trend: "+8%" },
            { label: "DSA Solved", value: weeklyData.dsaSolved, goal: weeklyData.dsaGoal, icon: Target, color: "text-purple-600", bg: "bg-purple-500/10", trend: "+5%" },
            { label: "Consistency", value: weeklyData.consistencyScore, goal: 100, icon: Star, color: "text-accentOrange", bg: "bg-accentOrange/10", suffix: "%", trend: "+3%" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="group rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:border-primary/15 hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", stat.bg)}>
                    <stat.icon className={cn("h-4 w-4", stat.color)} />
                  </div>
                  <span className="text-sm text-muted-foreground/70 font-medium">{stat.label}</span>
                </div>
                <div className={cn("flex items-center gap-1 text-xs font-semibold", stat.trend.startsWith("+") ? "text-green-500" : "text-red-500")}>
                  {stat.trend.startsWith("+") ? <ArrowUpRight className="h-3 w-3" /> : <ArrowUpRight className="h-3 w-3 rotate-90" />}
                  {stat.trend}
                </div>
              </div>
              <p className={cn("mt-3 text-2xl font-bold tracking-tight", stat.color)}>
                {stat.value}{stat.suffix || ""}
              </p>
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground/60 mb-1.5">
                  <span className="font-medium">Progress</span>
                  <span className="font-semibold">{stat.goal > 0 ? Math.round((stat.value / stat.goal) * 100) : 0}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted/40">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((stat.value / stat.goal) * 100, 100)}%` }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70"
                  />
                </div>
              </div>
              <p className="mt-2 text-xs text-muted-foreground/60 font-medium">Goal: {stat.goal}{stat.suffix || ""}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Weekly Overview */}
        <motion.div variants={item} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">Weekly Overview</h3>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => {
              const isToday = todayIndex === i;
              const dayProgress = dayProgressData[i];
              const dayTasks = dayTasksData[i];
              return (
                <div
                  key={day}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-xl p-2.5 transition-all duration-200",
                    isToday && "bg-primary/10 border border-primary/15 shadow-sm"
                  )}
                >
                  <span className="text-[10px] font-semibold text-muted-foreground/60 uppercase">{day}</span>
                  <div className="h-16 w-full overflow-hidden rounded-full bg-muted/40">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${dayProgress}%` }}
                      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                      className="w-full rounded-full bg-gradient-to-b from-primary to-primary/70"
                    />
                  </div>
                  <span className="text-[10px] font-semibold text-muted-foreground/60">
                    {Math.round(dayProgress / 10)}/{dayTasks}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* AI Insights */}
        <motion.div variants={item} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Lightbulb className="h-4 w-4 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">AI Insights</h3>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              Powered by AI
            </span>
          </div>
          <div className="space-y-3">
            {insights.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="mb-4 rounded-full bg-muted/50 p-4">
                  <Lightbulb className="h-8 w-8 text-muted-foreground/40" />
                </div>
                <p className="text-sm text-muted-foreground/60 font-medium mb-1">No insights yet</p>
                <p className="text-xs text-muted-foreground/40">Complete some tasks to get personalized AI insights</p>
              </div>
            ) : (
              insights.map((insight, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className={cn(
                    "flex items-start gap-3 rounded-xl border p-4 transition-all duration-200 hover:shadow-sm",
                    insight.type === "achievement" && "border-green-500/15 bg-green-500/5",
                    insight.type === "warning" && "border-yellow-500/15 bg-yellow-500/5",
                    insight.type === "suggestion" && "border-blue-500/15 bg-blue-500/5"
                  )}
                >
                  <insight.icon className={cn("h-5 w-5 mt-0.5 flex-shrink-0",
                    insight.type === "achievement" ? "text-green-600" : insight.type === "warning" ? "text-yellow-600" : "text-blue-600"
                  )} />
                  <div>
                    <p className="font-semibold text-foreground">{insight.title}</p>
                    <p className="text-sm text-muted-foreground/70 mt-0.5">{insight.description}</p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Streak & Motivation */}
        <motion.div variants={item} className="grid gap-6 lg:grid-cols-2">
          {/* Streak Card */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accentOrange/10">
                <Flame className="h-4 w-4 text-accentOrange" />
              </div>
              <h3 className="font-semibold text-foreground">Current Streak</h3>
            </div>
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="mb-2"
                >
                  <span className="text-6xl font-bold text-foreground">{weeklyData.streakDays}</span>
                </motion.div>
                <p className="text-sm text-muted-foreground">days in a row</p>
                <div className="mt-4 flex justify-center gap-1">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "h-3 w-3 rounded-full transition-all duration-300",
                        i < weeklyData.streakDays ? "bg-accentOrange" : "bg-muted/40"
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Motivation Card */}
          <div className="relative overflow-hidden rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/5 via-card to-primary/[0.03] p-6 shadow-sm">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/5 blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span className="text-sm font-semibold text-primary">Keep it up!</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                {weeklyData.streakDays === 0
                  ? "Start your streak today! 🔥"
                  : weeklyData.streakDays < 7
                  ? "Building momentum! 💪"
                  : weeklyData.streakDays < 30
                  ? "You're on fire! 🔥"
                  : "Incredible dedication! ⭐"}
              </h3>
              <p className="text-muted-foreground/70 text-sm">
                {weeklyData.streakDays === 0
                  ? "Complete today's tasks to start building your streak."
                  : `You've been consistent for ${weeklyData.streakDays} days. Keep going!`}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </PageWrapper>
  );
}