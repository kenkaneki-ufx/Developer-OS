"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Code,
  BookOpen,
  Target,
  Flame,
  GitCommit,
  Clock,
  Sun,
  Moon,
} from "lucide-react";
import {
  StatCard,
  AITasksWidget,
  ProjectsWidget,
  DeadlinesWidget,
  DSAWidget,
  MotivationWidget,
  QuickNotesWidget,
  LearningProgressWidget,
} from "@/features/dashboard/components";
import type { QuickNote, MotivationQuote } from "@/features/dashboard/types";
import {
  mockStats,
  mockTasks,
  mockProjects,
  mockDeadlines,
  mockDSA,
  motivationQuotes,
} from "@/features/dashboard/data/mock-data";


const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.05,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function DashboardPage() {
  const [motivation, setMotivation] = useState(motivationQuotes[0]);
  const [notes, setNotes] = useState<QuickNote[]>([]);

  const handleRefreshMotivation = () => {
    const randomIndex = Math.floor(Math.random() * motivationQuotes.length);
    setMotivation(motivationQuotes[randomIndex]);
  };

  const handleAddNote = (content: string) => {
    const newNote: QuickNote = {
      id: Date.now().toString(),
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: [],
    };
    setNotes((prev) => [newNote, ...prev]);
  };

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  const stats = [
    {
      id: "coding-hours",
      title: "Coding Hours",
      value: mockStats.codingHours.toString(),
      change: mockStats.codingHours > 0 ? `${mockStats.codingHours}h today` : "No activity yet",
      changeType: mockStats.codingHours > 0 ? ("positive" as const) : ("neutral" as const),
      icon: Code,
      color: "text-blue-600",
      bgColor: "bg-blue-500/10",
    },
    {
      id: "study-hours",
      title: "Study Hours",
      value: mockStats.studyHours.toString(),
      change: mockStats.studyHours > 0 ? `${mockStats.studyHours}h today` : "No activity yet",
      changeType: mockStats.studyHours > 0 ? ("positive" as const) : ("neutral" as const),
      icon: BookOpen,
      color: "text-green-600",
      bgColor: "bg-green-500/10",
    },
    {
      id: "tasks-completed",
      title: "Tasks Completed",
      value: mockStats.tasksCompleted.toString(),
      change: mockStats.tasksCompleted > 0 ? `${mockStats.tasksCompleted} completed today` : "No tasks completed yet",
      changeType: mockStats.tasksCompleted > 0 ? ("positive" as const) : ("neutral" as const),
      icon: Target,
      color: "text-purple-600",
      bgColor: "bg-purple-500/10",
    },
    {
      id: "current-streak",
      title: "Current Streak",
      value: `${mockStats.currentStreak} days`,
      change: mockStats.currentStreak > 0 ? `Best: ${mockStats.personalBestStreak} days` : "Start your streak!",
      changeType: mockStats.currentStreak > 0 ? ("neutral" as const) : ("neutral" as const),
      icon: Flame,
      color: "text-accentOrange",
      bgColor: "bg-accentOrange/10",
    },
    {
      id: "dsa-solved",
      title: "DSA Solved",
      value: mockStats.dsaSolved.toString(),
      change: mockStats.dsaSolved > 0 ? `${mockStats.dsaSolved} solved` : "No problems solved yet",
      changeType: mockStats.dsaSolved > 0 ? ("positive" as const) : ("neutral" as const),
      icon: Code,
      color: "text-cyan-600",
      bgColor: "bg-cyan-500/10",
    },
    {
      id: "consistency",
      title: "Consistency Score",
      value: `${mockStats.consistencyScore}%`,
      change: mockStats.consistencyScore > 0 ? "Keep it up!" : "Build your consistency",
      changeType: mockStats.consistencyScore > 0 ? ("positive" as const) : ("neutral" as const),
      icon: Flame,
      color: "text-amber-600",
      bgColor: "bg-amber-500/10",
    },
  ];

  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  // Hydration-safe: set time only after mount
  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const greeting = (() => {
    if (!currentTime) return "Hello";
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  })();

  const formattedDate = currentTime
    ? currentTime.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Loading...";

  const formattedTime = currentTime
    ? currentTime.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "--:--:--";

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Welcome Header */}
      <motion.div variants={item} className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-card to-primary/[0.03] p-6 shadow-sm">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-gradient-to-br from-primary/[0.04] to-transparent blur-3xl" />

        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <motion.span
                className="text-2xl"
                animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                transition={{ duration: 2.5, ease: "easeInOut", delay: 0.5 }}
              >
                👋
              </motion.span>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                {greeting}!
              </h1>
            </div>
            <p className="mt-1.5 text-muted-foreground/70 text-sm">
              Here&apos;s your daily overview. Keep up the great work!
            </p>
            <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground/60">
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {formattedDate}
              </span>
              <span className="font-mono font-medium text-foreground/80">
                {formattedTime}
              </span>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-muted-foreground/40">
            {currentTime && currentTime.getHours() >= 6 && currentTime.getHours() < 18 ? (
              <Sun className="h-5 w-5 text-amber-500" />
            ) : (
              <Moon className="h-5 w-5 text-blue-400" />
            )}
          </div>
        </div>
      </motion.div>

      {/* Motivation Quote */}
      <motion.div variants={item}>
        <MotivationWidget
          quote={motivation}
          onRefresh={handleRefreshMotivation}
        />
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={item} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => (
          <StatCard key={stat.id} stat={stat} index={index} />
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <motion.div variants={item} className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <AITasksWidget tasks={mockTasks} />
          <DSAWidget dsa={mockDSA} />
          <QuickNotesWidget
            notes={notes}
            onAdd={handleAddNote}
            onDelete={handleDeleteNote}
          />
        </div>

        <div className="space-y-6">
          <LearningProgressWidget />
          <ProjectsWidget projects={mockProjects} />
          <DeadlinesWidget deadlines={mockDeadlines} />
        </div>
      </motion.div>
    </motion.div>
  );
}
