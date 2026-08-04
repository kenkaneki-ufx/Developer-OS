"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, BookOpen, Code, ArrowUpRight, RefreshCw, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { PageWrapper } from "@/components/ui/page-wrapper";

const weeklyData = [
  { day: "Mon", study: 2, coding: 3, dsa: 1 },
  { day: "Tue", study: 3, coding: 4, dsa: 2 },
  { day: "Wed", study: 1, coding: 2, dsa: 1 },
  { day: "Thu", study: 4, coding: 5, dsa: 3 },
  { day: "Fri", study: 2, coding: 3, dsa: 2 },
  { day: "Sat", study: 5, coding: 6, dsa: 4 },
  { day: "Sun", study: 3, coding: 4, dsa: 2 },
];

const monthlyStats = [
  { month: "Jul", tasks: 45, hours: 32 },
  { month: "Jun", tasks: 38, hours: 28 },
  { month: "May", tasks: 42, hours: 35 },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month" | "year">("week");
  
  const maxHours = Math.max(...weeklyData.map(d => d.study + d.coding + d.dsa));

  const totalStudy = weeklyData.reduce((a, d) => a + d.study, 0);
  const totalCoding = weeklyData.reduce((a, d) => a + d.coding, 0);
  const totalDSA = weeklyData.reduce((a, d) => a + d.dsa, 0);
  const totalHours = totalStudy + totalCoding + totalDSA;

  const avgDailyHours = (totalHours / 7).toFixed(1);
  const bestDay = weeklyData.reduce((best, d) => (d.study + d.coding + d.dsa) > (best.study + best.coding + best.dsa) ? d : best);

  return (
    <PageWrapper 
      title="Analytics" 
      subtitle="Track your productivity and progress"
      headerAction={
        <div className="flex items-center gap-2">
          <div className="flex gap-1 rounded-xl border border-border bg-muted/30 p-1">
            {(["week", "month", "year"] as const).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200",
                  selectedPeriod === period
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground/60 hover:text-foreground hover:bg-muted/40"
                )}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
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
            { label: "Study Hours", value: `${totalStudy}h`, icon: BookOpen, color: "text-blue-600", bg: "bg-blue-500/10", trend: "+12%" },
            { label: "Coding Hours", value: `${totalCoding}h`, icon: Code, color: "text-green-600", bg: "bg-green-500/10", trend: "+8%" },
            { label: "DSA Hours", value: `${totalDSA}h`, icon: Target, color: "text-purple-600", bg: "bg-purple-500/10", trend: "+5%" },
            { label: "Total Hours", value: `${totalHours}h`, icon: Clock, color: "text-accentOrange", bg: "bg-accentOrange/10", trend: "+10%" },
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
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Stats */}
        <motion.div variants={item} className="grid gap-3 sm:grid-cols-3">
          {[
            { label: "Average Daily", value: `${avgDailyHours}h`, color: "text-primary" },
            { label: "Best Day", value: bestDay.day, color: "text-green-600" },
            { label: "Consistency", value: "85%", color: "text-purple-600" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              className="rounded-xl border border-border bg-card p-4 text-center"
            >
              <p className="text-xs text-muted-foreground/60 font-medium">{stat.label}</p>
              <p className={cn("text-xl font-bold mt-1", stat.color)}>{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Weekly Activity Chart */}
        <motion.div variants={item} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-foreground">Weekly Activity</h3>
            <div className="flex items-center gap-5 text-xs font-medium">
              <span className="flex items-center gap-1.5"><div className="h-2.5 w-2.5 rounded-md bg-gradient-to-r from-blue-500 to-blue-400" />Study</span>
              <span className="flex items-center gap-1.5"><div className="h-2.5 w-2.5 rounded-md bg-gradient-to-r from-green-500 to-green-400" />Coding</span>
              <span className="flex items-center gap-1.5"><div className="h-2.5 w-2.5 rounded-md bg-gradient-to-r from-purple-500 to-purple-400" />DSA</span>
            </div>
          </div>
          <div className="flex items-end justify-between gap-3 h-56">
            {weeklyData.map((day, i) => (
              <div key={day.day} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex flex-col justify-end" style={{ height: "200px" }}>
                  <motion.div initial={{ height: 0 }} animate={{ height: `${(day.dsa / maxHours) * 100}%` }}
                    transition={{ delay: i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full rounded-t-lg bg-gradient-to-t from-purple-600 to-purple-400" />
                  <motion.div initial={{ height: 0 }} animate={{ height: `${(day.coding / maxHours) * 100}%` }}
                    transition={{ delay: i * 0.05 + 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full bg-gradient-to-t from-green-600 to-green-400" />
                  <motion.div initial={{ height: 0 }} animate={{ height: `${(day.study / maxHours) * 100}%` }}
                    transition={{ delay: i * 0.05 + 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full rounded-b-lg bg-gradient-to-t from-blue-600 to-blue-400" />
                </div>
                <span className="text-xs text-muted-foreground/60 font-medium">{day.day}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Bottom Grid */}
        <motion.div variants={item} className="grid gap-6 lg:grid-cols-2">
          {/* Consistency Score */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-5 font-semibold text-foreground">Consistency Score</h3>
            <div className="flex items-center justify-center">
              <div className="relative h-40 w-40">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/30" />
                  <motion.circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-primary"
                    strokeDasharray="251.2" initial={{ strokeDashoffset: 251.2 }} animate={{ strokeDashoffset: 251.2 * (1 - 0.85) }}
                    transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.span initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, duration: 0.4 }}
                    className="text-3xl font-bold text-foreground">85%</motion.span>
                  <span className="text-xs text-muted-foreground/60 font-medium">This Week</span>
                </div>
              </div>
            </div>
          </div>

          {/* Monthly Progress */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-5 font-semibold text-foreground">Monthly Progress</h3>
            <div className="space-y-4">
              {monthlyStats.map((m, i) => (
                <div key={m.month} className="flex items-center gap-3">
                  <span className="w-10 text-sm font-medium text-muted-foreground/70">{m.month}</span>
                  <div className="flex-1 h-8 overflow-hidden rounded-full bg-muted/40">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${(m.tasks / 50) * 100}%` }}
                      transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70" />
                  </div>
                  <span className="w-16 text-xs font-medium text-muted-foreground/70 text-right">{m.tasks} tasks</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </PageWrapper>
  );
}