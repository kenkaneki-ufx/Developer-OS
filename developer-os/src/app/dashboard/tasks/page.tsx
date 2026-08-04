"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Plus,
  Calendar,
  BarChart3,
  ListTodo,
  Loader2,
  CheckCircle2,
  Zap,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  TaskList,
  TaskForm,
  TaskStats,
} from "@/features/tasks/components";
import { useTasks } from "@/features/tasks/hooks/use-tasks";
import { useDSA } from "@/features/dsa/hooks/use-dsa";
import { useLearningContext } from "@/features/dashboard/hooks/use-learning-context";
import type { Task, CreateTaskPayload } from "@/features/tasks/types";

type ViewMode = "list" | "stats" | "daily" | "weekly";

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

export default function TasksPage() {
  const {
    tasks,
    dailyPlan,
    weeklyPlan,
    stats,
    filters,
    sort,
    isGenerating,
    setFilters,
    setSort,
    createTask,
    updateTask,
    deleteTask,
    startTask,
    completeTask,
    generateTasks,
  } = useTasks();

  // Get DSA data for learning context
  const { topics: dsaTopics } = useDSA();
  
  // Aggregate learning context from DSA, roadmaps, and college
  const { learningItems, sourceStats, urgentItems, spacedRepetitionItems } = useLearningContext(dsaTopics);

  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();

  const handleCreateTask = (payload: CreateTaskPayload) => {
    const result = createTask(payload);
    if (result === null) {
      console.warn("Task not created: duplicate task already exists for this date");
    }
    setShowForm(false);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleUpdateTask = (payload: CreateTaskPayload) => {
    if (editingTask) {
      updateTask({ id: editingTask.id, updates: payload });
      setEditingTask(undefined);
      setShowForm(false);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTask(undefined);
  };

  const handleGenerateTasks = () => {
    const today = new Date().toISOString().split("T")[0];
    generateTasks(today, learningItems);
  };

  const today = new Date().toISOString().split("T")[0];
  const todayTasks = tasks.filter(
    (t) => t.scheduledDate === today
  );
  const completedToday = todayTasks.filter((t) => t.status === "completed").length;
  const inProgressToday = todayTasks.filter((t) => t.status === "in_progress").length;

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
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Tasks</h1>
          <p className="mt-1.5 text-muted-foreground/70 text-sm">
            AI-powered tasks synced with your DSA, programming & ML progress
          </p>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerateTasks}
            disabled={isGenerating}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-b from-primary/10 to-primary/5 px-4 py-2.5 text-sm font-semibold text-primary border border-primary/10 hover:border-primary/20 hover:shadow-sm transition-all duration-200 disabled:opacity-50"
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {isGenerating ? "Generating..." : "AI Generate"}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-b from-primary to-primary/90 px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200"
          >
            <Plus className="h-4 w-4" />
            Add Task
          </motion.button>
        </div>
      </motion.div>

      {/* Learning Sync Status */}
      <motion.div variants={item} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">Learning Sync</span>
          </div>
          <span className="text-xs text-muted-foreground/60">
            {learningItems.length} topics tracked
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-muted/30 p-3 text-center">
            <p className="text-lg font-bold text-foreground">{sourceStats.dsa.total}</p>
            <p className="text-[10px] text-muted-foreground/60 font-medium">DSA Topics</p>
          </div>
          <div className="rounded-xl bg-muted/30 p-3 text-center">
            <p className="text-lg font-bold text-foreground">{sourceStats.programming.total}</p>
            <p className="text-[10px] text-muted-foreground/60 font-medium">Programming</p>
          </div>
          <div className="rounded-xl bg-muted/30 p-3 text-center">
            <p className="text-lg font-bold text-foreground">{sourceStats.ml.total}</p>
            <p className="text-[10px] text-muted-foreground/60 font-medium">ML Topics</p>
          </div>
        </div>
        {(urgentItems.length > 0 || spacedRepetitionItems.length > 0) && (
          <div className="mt-3 flex items-center gap-4 text-xs">
            {urgentItems.length > 0 && (
              <span className="flex items-center gap-1 text-orange-600">
                <Zap className="h-3 w-3" />
                {urgentItems.length} need attention
              </span>
            )}
            {spacedRepetitionItems.length > 0 && (
              <span className="flex items-center gap-1 text-blue-600">
                <RefreshCw className="h-3 w-3" />
                {spacedRepetitionItems.length} due for review
              </span>
            )}
          </div>
        )}
      </motion.div>

      {/* Quick Stats */}
      <motion.div variants={item} className="grid gap-3 sm:grid-cols-4">
        {[
          { icon: ListTodo, label: "Today's Tasks", value: todayTasks.length, color: "text-foreground" },
          { icon: CheckCircle2, label: "Completed", value: completedToday, color: "text-green-600", iconBg: "bg-green-500/10" },
          { icon: Zap, label: "In Progress", value: inProgressToday, color: "text-blue-600", iconBg: "bg-blue-500/10" },
          { icon: BarChart3, label: "Streak", value: `${stats.currentStreak} days 🔥`, color: "text-orange-600" },
        ].map((stat, index) => (
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
                <stat.icon className="h-5 w-5 text-muted-foreground/60" />
              )}
              <span className="text-sm text-muted-foreground/70 font-medium">{stat.label}</span>
            </div>
            <p className={cn("mt-3 text-2xl font-bold tracking-tight", stat.color)}>
              {stat.value}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* View Mode Tabs */}
      <motion.div variants={item}>
        <div className="flex items-center gap-1 rounded-xl border border-border bg-muted/30 p-1">
          {[
            { value: "list" as ViewMode, label: "All Tasks", icon: ListTodo },
            { value: "daily" as ViewMode, label: "Daily Plan", icon: Calendar },
            { value: "stats" as ViewMode, label: "Statistics", icon: BarChart3 },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setViewMode(tab.value)}
              className={cn(
                "relative flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200",
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
        {viewMode === "list" && (
          <TaskList
            tasks={tasks}
            filters={filters}
            sort={sort}
            onFilterChange={setFilters}
            onSortChange={setSort}
            onComplete={completeTask}
            onStart={startTask}
            onEdit={handleEditTask}
            onDelete={deleteTask}
            emptyMessage="No tasks yet. Generate AI tasks synced with your learning progress!"
          />
        )}

        {viewMode === "daily" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-foreground">
                  Today&apos;s Plan
                </h2>
                <span className="text-sm text-muted-foreground/70 font-medium">
                  {dailyPlan.completedTasks}/{dailyPlan.totalTasks} completed
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-muted/50 mb-6">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${dailyPlan.totalTasks > 0 ? (dailyPlan.completedTasks / dailyPlan.totalTasks) * 100 : 0}%`,
                  }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70"
                />
              </div>

              <div className="space-y-6">
                {["morning", "afternoon", "evening", "night"].map((timeOfDay) => {
                  const timeTasks = dailyPlan.tasks.filter(
                    (t) => t.timeOfDay === timeOfDay
                  );
                  if (timeTasks.length === 0) return null;

                  return (
                    <div key={timeOfDay}>
                      <h3 className="mb-3 text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider">
                        {timeOfDay}
                      </h3>
                      <div className="space-y-2">
                        {timeTasks.map((task) => (
                          <div
                            key={task.id}
                            className={cn(
                              "flex items-center gap-3 rounded-xl border border-border p-3.5 transition-all duration-200 hover:bg-muted/30 hover:border-primary/10 hover:shadow-sm",
                              task.status === "completed" && "opacity-50"
                            )}
                          >
                            <div
                              className={cn(
                                "h-5 w-5 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                                task.status === "completed"
                                  ? "border-green-500 bg-green-500"
                                  : task.status === "in_progress"
                                    ? "border-blue-500"
                                    : "border-muted-foreground/30"
                              )}
                            >
                              {task.status === "completed" && (
                                <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={cn("text-sm font-medium truncate", task.status === "completed" && "line-through text-muted-foreground")}>
                                {task.title}
                              </p>
                              <p className="text-xs text-muted-foreground/50 mt-0.5">
                                {task.estimatedMinutes}min • {task.category.toUpperCase()}
                                {task.relatedTopic && ` • ${task.relatedTopic}`}
                              </p>
                            </div>
                            {task.source === "ai-generated" && (
                              <Sparkles className="h-4 w-4 text-primary/60" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-foreground">
                  Weekly Overview
                </h2>
                <span className="text-sm text-muted-foreground/70 font-medium">
                  {weeklyPlan.completedTasks}/{weeklyPlan.totalTasks} completed
                </span>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {weeklyPlan.dailyPlans.map((day) => {
                  const progress = day.totalTasks > 0 ? (day.completedTasks / day.totalTasks) * 100 : 0;
                  const isToday = day.date === new Date().toISOString().split("T")[0];
                  return (
                    <div
                      key={day.date}
                      className={cn(
                        "flex flex-col items-center gap-1.5 rounded-xl p-2.5 transition-all duration-200",
                        isToday && "bg-primary/10 border border-primary/15 shadow-sm"
                      )}
                    >
                      <span className="text-[10px] font-semibold text-muted-foreground/60 uppercase">
                        {new Date(day.date).toLocaleDateString("en", { weekday: "short" })}
                      </span>
                      <div className="h-16 w-full overflow-hidden rounded-full bg-muted/40">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${progress}%` }}
                          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                          className="w-full rounded-full bg-gradient-to-b from-primary to-primary/70"
                        />
                      </div>
                      <span className="text-[10px] font-semibold text-muted-foreground/60">
                        {day.completedTasks}/{day.totalTasks}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-5 flex items-center justify-between text-sm">
                <span className="text-muted-foreground/70 font-medium">
                  Weekly Goal: {weeklyPlan.totalTasks}/{weeklyPlan.weeklyGoal}
                </span>
                <span className="font-semibold gradient-text">
                  {Math.round(weeklyPlan.progress)}% complete
                </span>
              </div>
            </div>
          </div>
        )}

        {viewMode === "stats" && <TaskStats stats={stats} />}
      </motion.div>

      {showForm && (
        <TaskForm
          task={editingTask}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          onCancel={handleCloseForm}
        />
      )}
    </motion.div>
  );
}
