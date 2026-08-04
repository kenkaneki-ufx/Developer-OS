"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Code,
  Search,
  Filter,
  Plus,
  TrendingUp,
  Bookmark,
  AlertTriangle,
  BarChart3,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  TopicCard,
  PlatformStatsCard,
  StreakWidget,
  QuestionList,
  ProgressChart,
  MistakeTracker,
} from "@/features/dsa/components";
import { useDSA } from "@/features/dsa/hooks/use-dsa";
import type { Difficulty, Platform, QuestionStatus } from "@/features/dsa/types";

type ViewMode = "topics" | "questions" | "progress" | "mistakes" | "bookmarks";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function DSAPage() {
  const {
    topics,
    questions,
    platformStats,
    streak,
    bookmarks,
    mistakes,
    dailyProgress,
    weeklyProgress,
    filters,
    setFilters,
    updateQuestionStatus,
    toggleBookmark,
    markTodaySolved,
    resolveMistake,
  } = useDSA();

  const [viewMode, setViewMode] = useState<ViewMode>("topics");
  const [searchQuery, setSearchQuery] = useState("");

  const totalSolved = topics.reduce((acc, t) => acc + t.solvedQuestions, 0);
  const totalQuestions = topics.reduce((acc, t) => acc + t.totalQuestions, 0);
  const overallMastery = Math.round(topics.reduce((acc, t) => acc + t.mastery, 0) / topics.length);

  const statsData = [
    { icon: Target, label: "Total Solved", value: totalSolved, suffix: `/${totalQuestions}`, color: "text-primary" },
    { icon: TrendingUp, label: "Mastery", value: overallMastery, suffix: "%", color: "text-green-600", iconBg: "bg-green-500/10" },
    { icon: Bookmark, label: "Bookmarked", value: bookmarks.length, suffix: "", color: "text-yellow-600", iconBg: "bg-yellow-500/10" },
    { icon: AlertTriangle, label: "Mistakes", value: mistakes.filter(m => !m.isResolved).length, suffix: "", color: "text-accentOrange", iconBg: "bg-accentOrange/10" },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div
        variants={item}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">DSA Tracker</h1>
          <p className="mt-1.5 text-muted-foreground/70 text-sm">
            Track your Data Structures & Algorithms progress
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-b from-primary to-primary/90 px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200"
        >
          <Plus className="h-4 w-4" /> Add Question
        </motion.button>
      </motion.div>

      {/* Quick Stats */}
      <motion.div variants={item} className="grid gap-3 sm:grid-cols-4">
        {statsData.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="group rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:border-primary/15 hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-2.5">
              {"iconBg" in stat && stat.iconBg ? (
                <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", stat.iconBg)}>
                  <stat.icon className="h-4 w-4" />
                </div>
              ) : (
                <stat.icon className={cn("h-5 w-5", stat.color)} />
              )}
              <span className="text-sm text-muted-foreground/70 font-medium">{stat.label}</span>
            </div>
            <p className={cn("mt-3 text-2xl font-bold tracking-tight", stat.color)}>
              {stat.value}
              <span className="text-sm font-normal text-muted-foreground/60">{stat.suffix}</span>
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* View Mode Tabs */}
      <motion.div variants={item}>
        <div className="flex items-center gap-1 rounded-xl border border-border bg-muted/30 p-1 overflow-x-auto">
          {[
            { value: "topics" as ViewMode, label: "Topics", icon: Code },
            { value: "questions" as ViewMode, label: "Questions", icon: Search },
            { value: "progress" as ViewMode, label: "Progress", icon: BarChart3 },
            { value: "mistakes" as ViewMode, label: "Mistakes", icon: AlertTriangle },
            { value: "bookmarks" as ViewMode, label: "Bookmarks", icon: Bookmark },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setViewMode(tab.value)}
              className={cn(
                "relative flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 whitespace-nowrap",
                viewMode === tab.value
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground/60 hover:text-foreground hover:bg-muted/40"
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Content */}
      <motion.div variants={item}>
        {viewMode === "topics" && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topics.map((topic, index) => (
              <TopicCard key={topic.id} topic={topic} index={index} />
            ))}
          </div>
        )}

        {viewMode === "questions" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/40" />
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setFilters({ ...filters, search: e.target.value });
                  }}
                  className="w-full rounded-xl border border-border bg-muted/30 py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all duration-200"
                />
              </div>
              <div className="flex gap-1 rounded-xl border border-border bg-muted/30 p-1">
                {(["all", "easy", "medium", "hard"] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => {
                      const difficulties = d === "all" ? undefined : [d as Difficulty];
                      setFilters({ ...filters, difficulties });
                    }}
                    className={cn(
                      "rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200",
                      d === "easy" ? "text-green-600 hover:bg-green-500/10" : d === "medium" ? "text-yellow-600 hover:bg-yellow-500/10" : d === "hard" ? "text-red-600 hover:bg-red-500/10" : "text-muted-foreground/60 hover:bg-muted/40"
                    )}
                  >
                    {d.charAt(0).toUpperCase() + d.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <QuestionList
              questions={questions}
              onUpdateStatus={updateQuestionStatus}
              onToggleBookmark={toggleBookmark}
            />
          </div>
        )}

        {viewMode === "progress" && (
          <ProgressChart dailyProgress={dailyProgress} weeklyProgress={weeklyProgress} />
        )}

        {viewMode === "mistakes" && (
          <MistakeTracker mistakes={mistakes} onResolve={resolveMistake} />
        )}

        {viewMode === "bookmarks" && (
          <div className="space-y-4">
            <QuestionList
              questions={questions.filter((q) => q.isBookmarked)}
              onUpdateStatus={updateQuestionStatus}
              onToggleBookmark={toggleBookmark}
              emptyMessage="No bookmarked questions yet"
            />
          </div>
        )}
      </motion.div>

      {/* Sidebar Widgets */}
      <motion.div variants={item} className="grid gap-6 lg:grid-cols-3">
        <StreakWidget streak={streak} onMarkSolved={markTodaySolved} />
        <div className="lg:col-span-2">
          <PlatformStatsCard stats={platformStats} />
        </div>
      </motion.div>
    </motion.div>
  );
}
