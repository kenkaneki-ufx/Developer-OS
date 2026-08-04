"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Target,
  Clock,
  CheckCircle2,
  Star,
  Award,
  Calendar,
  ArrowUpRight,
  Flame,
  Trophy,
  Zap,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageWrapper } from "@/components/ui/page-wrapper";

const monthlyData = {
  tasksCompleted: 0,
  tasksGoal: 100,
  hoursStudied: 0,
  hoursGoal: 140,
  dsaSolved: 0,
  dsaGoal: 80,
  projectsCompleted: 0,
  consistencyScore: 0,
  bestStreak: 0,
  booksRead: 0,
};

const weeklyBreakdown = [
  { week: "Week 1", tasks: 0, hours: 0, dsa: 0 },
  { week: "Week 2", tasks: 0, hours: 0, dsa: 0 },
  { week: "Week 3", tasks: 0, hours: 0, dsa: 0 },
  { week: "Week 4", tasks: 0, hours: 0, dsa: 0 },
];

const achievements = [
  { icon: "🔥", title: "18-day streak record", description: "Most consecutive days active" },
  { icon: "📚", title: "3 books completed", description: "Knowledge is power" },
  { icon: "💻", title: "2 projects shipped", description: "Real-world impact" },
  { icon: "🎯", title: "89% task completion", description: "Consistency is key" },
];

const goals = [
  { title: "Complete 100 tasks", progress: 0, target: 100 },
  { title: "Study 140+ hours", progress: 0, target: 140 },
  { title: "Solve 80 DSA problems", progress: 0, target: 80 },
  { title: "Finish ML project", progress: 0, target: 100 },
  { title: "Start system design", progress: 0, target: 100 },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function MonthlyReviewPage() {
  const [selectedMonth, setSelectedMonth] = useState(0);

  const monthOptions = [
    { label: "July 2026", value: 0 },
    { label: "June 2026", value: 1 },
    { label: "May 2026", value: 2 },
  ];

  return (
    <PageWrapper 
      title="Monthly Review" 
      subtitle="July 2026 - Your monthly progress summary"
      headerAction={
        <div className="flex items-center gap-2">
          <div className="flex gap-1 rounded-xl border border-border bg-muted/30 p-1">
            {monthOptions.map((month) => (
              <button
                key={month.value}
                onClick={() => setSelectedMonth(month.value)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200",
                  selectedMonth === month.value
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground/60 hover:text-foreground hover:bg-muted/40"
                )}
              >
                {month.label}
              </button>
            ))}
          </div>
        </div>
      }
    >
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        {/* Stats Grid */}
        <motion.div variants={item} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Tasks Completed", value: monthlyData.tasksCompleted, goal: monthlyData.tasksGoal, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-500/10", trend: "+15%" },
            { label: "Hours Studied", value: `${monthlyData.hoursStudied}h`, goal: `${monthlyData.hoursGoal}h`, icon: Clock, color: "text-blue-600", bg: "bg-blue-500/10", trend: "+10%" },
            { label: "DSA Solved", value: monthlyData.dsaSolved, goal: monthlyData.dsaGoal, icon: Target, color: "text-purple-600", bg: "bg-purple-500/10", trend: "+8%" },
            { label: "Best Streak", value: `${monthlyData.bestStreak} days`, icon: Award, color: "text-accentOrange", bg: "bg-accentOrange/10", trend: "+2 days" },
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
                <div className="flex items-center gap-1 text-xs font-semibold text-green-500">
                  <ArrowUpRight className="h-3 w-3" />
                  {stat.trend}
                </div>
              </div>
              <p className={cn("mt-3 text-2xl font-bold tracking-tight", stat.color)}>{stat.value}</p>
              {stat.goal && <p className="text-xs text-muted-foreground/60 font-medium mt-1">Goal: {stat.goal}</p>}
            </motion.div>
          ))}
        </motion.div>

        {/* Monthly Progress Overview */}
        <motion.div variants={item} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">Monthly Progress</h3>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { label: "Tasks", value: monthlyData.tasksCompleted, goal: monthlyData.tasksGoal, color: "from-green-500 to-emerald-500" },
              { label: "Study Hours", value: monthlyData.hoursStudied, goal: monthlyData.hoursGoal, color: "from-blue-500 to-cyan-500" },
              { label: "DSA Problems", value: monthlyData.dsaSolved, goal: monthlyData.dsaGoal, color: "from-purple-500 to-pink-500" },
            ].map((metric, i) => (
              <div key={metric.label} className="text-center">
                <div className="relative mb-4 inline-flex">
                  <svg className="h-24 w-24 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/30" />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      className={cn("text-primary")}
                      strokeDasharray="251.2"
                      initial={{ strokeDashoffset: 251.2 }}
                      animate={{ strokeDashoffset: metric.goal > 0 ? 251.2 - (metric.value / metric.goal) * 251.2 : 251.2 }}
                      transition={{ duration: 1, delay: 0.3 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-lg font-bold text-foreground">{metric.value}</span>
                    <span className="text-[10px] text-muted-foreground/60">/{metric.goal}</span>
                  </div>
                </div>
                <p className="text-sm font-medium text-foreground">{metric.label}</p>
                <p className="text-xs text-muted-foreground/60">{Math.round((metric.value / metric.goal) * 100)}% complete</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Weekly Breakdown */}
        <motion.div variants={item} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">Weekly Breakdown</h3>
          </div>
          <div className="space-y-5">
            {weeklyBreakdown.map((week, i) => (
              <div key={week.week} className="flex items-center gap-4">
                <span className="w-20 text-sm font-semibold text-foreground">{week.week}</span>
                <div className="flex-1 grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground/60 mb-1.5 font-medium">Tasks: {week.tasks}</p>
                    <div className="h-2 overflow-hidden rounded-full bg-muted/40">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${(week.tasks / 25) * 100}%` }}
                        transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-500" />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground/60 mb-1.5 font-medium">Hours: {week.hours}</p>
                    <div className="h-2 overflow-hidden rounded-full bg-muted/40">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${(week.hours / 35) * 100}%` }}
                        transition={{ delay: i * 0.1 + 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground/60 mb-1.5 font-medium">DSA: {week.dsa}</p>
                    <div className="h-2 overflow-hidden rounded-full bg-muted/40">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${(week.dsa / 22) * 100}%` }}
                        transition={{ delay: i * 0.1 + 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Achievements & Goals */}
        <motion.div variants={item} className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-500/10">
                <Trophy className="h-4 w-4 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-foreground">Achievements</h3>
              <span className="rounded-full bg-yellow-500/10 px-2.5 py-0.5 text-xs font-semibold text-yellow-600">
                {achievements.length} earned
              </span>
            </div>
            <div className="space-y-2.5">
              {achievements.map((achievement, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-center gap-3 rounded-xl bg-muted/30 border border-border/50 p-3.5 hover:bg-muted/50 transition-colors duration-200"
                >
                  <span className="text-lg">{achievement.icon}</span>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-foreground">{achievement.title}</span>
                    <p className="text-xs text-muted-foreground/60">{achievement.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Target className="h-4 w-4 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Next Month Goals</h3>
            </div>
            <div className="space-y-3">
              {goals.map((goal, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="rounded-xl border border-border p-3.5 hover:bg-muted/30 transition-colors duration-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">{goal.title}</span>
                    <span className="text-xs text-muted-foreground/60">{goal.progress}/{goal.target}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted/30">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(goal.progress / goal.target) * 100}%` }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Motivation */}
        <motion.div variants={item} className="relative overflow-hidden rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/5 via-card to-primary/[0.03] p-8 shadow-sm">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/5 blur-3xl" />
          <div className="relative text-center">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="mb-4 inline-flex rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-4 shadow-lg shadow-primary/20"
            >
              <Zap className="h-6 w-6 text-white" />
            </motion.div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              {monthlyData.tasksCompleted === 0
                ? "Ready for a fresh start? 🚀"
                : "Another great month! 🎉"}
            </h3>
            <p className="text-muted-foreground/70 text-sm max-w-md mx-auto">
              {monthlyData.tasksCompleted === 0
                ? "Set your goals for next month and start building momentum."
                : "You're making incredible progress. Keep up the amazing work!"}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </PageWrapper>
  );
}