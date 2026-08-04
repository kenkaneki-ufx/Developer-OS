"use client";

import { useState, useCallback, useMemo } from "react";
import type {
  Task,
  TaskFilters,
  TaskSort,
  TaskStatus,
  CreateTaskPayload,
  UpdateTaskPayload,
  DailyPlan,
  WeeklyPlan,
  TaskStats,
  TaskCategory,
  TaskAIContext,
} from "../types";
import {
  mockWeeklyPlan,
  mockTaskStats,
} from "../data/mock-tasks";
import type { LearningItem } from "@/features/dashboard/hooks/use-learning-context";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filters, setFilters] = useState<TaskFilters>({});
  const [sort, setSort] = useState<TaskSort>({
    field: "scheduledDate",
    order: "asc",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Daily plan - dynamically calculated from actual tasks
  const dailyPlan: DailyPlan = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const todayTasks = tasks.filter((t) => t.scheduledDate === today);
    const completedTasks = todayTasks.filter((t) => t.status === "completed");
    const totalMinutes = todayTasks.reduce((acc, t) => acc + t.estimatedMinutes, 0);
    const actualMinutes = completedTasks.reduce((acc, t) => acc + (t.actualMinutes || t.estimatedMinutes), 0);
    
    // Calculate category breakdown
    const categoryMap = new Map<string, { count: number; completed: number; minutes: number; progress: number[] }>();
    todayTasks.forEach(t => {
      const existing = categoryMap.get(t.category);
      if (existing) {
        existing.count++;
        if (t.status === "completed") existing.completed++;
        existing.minutes += t.estimatedMinutes;
        existing.progress.push(t.progress);
      } else {
        categoryMap.set(t.category, {
          count: 1,
          completed: t.status === "completed" ? 1 : 0,
          minutes: t.estimatedMinutes,
          progress: [t.progress],
        });
      }
    });
    
    const categories = Array.from(categoryMap.entries()).map(([category, data]) => ({
      category: category as TaskCategory,
      taskCount: data.count,
      completedCount: data.completed,
      totalMinutes: data.minutes,
      averageProgress: data.progress.reduce((a, b) => a + b, 0) / data.progress.length,
    }));
    
    // Calculate focus score based on completion rate
    const focusScore = todayTasks.length > 0 
      ? Math.round((completedTasks.length / todayTasks.length) * 100)
      : 0;
    
    return {
      date: today,
      tasks: todayTasks,
      totalTasks: todayTasks.length,
      completedTasks: completedTasks.length,
      totalEstimatedMinutes: totalMinutes,
      totalActualMinutes: actualMinutes,
      focusScore,
      categories,
    };
  }, [tasks]);

  // Weekly plan
  const weeklyPlan: WeeklyPlan = useMemo(() => {
    return {
      ...mockWeeklyPlan,
      dailyPlans: mockWeeklyPlan.dailyPlans.map((dp) => {
        if (dp.date === new Date().toISOString().split("T")[0]) {
          return dailyPlan;
        }
        return dp;
      }),
    };
  }, [dailyPlan]);

  // Statistics
  const stats: TaskStats = useMemo(() => {
    const completedTasks = tasks.filter((t) => t.status === "completed").length;
    return {
      ...mockTaskStats,
      totalTasks: tasks.length,
      completedTasks,
      completionRate: tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0,
    };
  }, [tasks]);

  // Check for duplicate task
  const isDuplicateTask = useCallback((
    title: string,
    scheduledDate: string,
    excludeId?: string
  ): boolean => {
    return tasks.some(
      (t) =>
        t.title.toLowerCase() === title.toLowerCase() &&
        t.scheduledDate === scheduledDate &&
        t.status !== "cancelled" &&
        t.status !== "skipped" &&
        t.id !== excludeId
    );
  }, [tasks]);

  // Create task with duplicate prevention
  const createTask = useCallback((payload: CreateTaskPayload) => {
    // Check for duplicates
    if (isDuplicateTask(payload.title, payload.scheduledDate)) {
      return null;
    }

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: payload.title,
      description: payload.description,
      category: payload.category,
      priority: payload.priority,
      status: "pending",
      source: "user-created",
      estimatedMinutes: payload.estimatedMinutes,
      scheduledDate: payload.scheduledDate,
      scheduledTime: payload.scheduledTime,
      timeOfDay: payload.timeOfDay,
      deadline: payload.deadline,
      relatedTopic: payload.relatedTopic,
      relatedSubject: payload.relatedSubject,
      progress: 0,
      tags: payload.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTasks((prev) => [...prev, newTask]);
    return newTask;
  }, [isDuplicateTask]);

  // Update task
  const updateTask = useCallback((payload: UpdateTaskPayload) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === payload.id
          ? { ...task, ...payload.updates, updatedAt: new Date().toISOString() }
          : task
      )
    );
  }, []);

  // Delete task
  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  // Start task
  const startTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, status: "in_progress" as TaskStatus, updatedAt: new Date().toISOString() }
          : task
      )
    );
  }, []);

  // Complete task
  const completeTask = useCallback((id: string, actualMinutes?: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              status: "completed" as TaskStatus,
              progress: 100,
              actualMinutes: actualMinutes || task.estimatedMinutes,
              completedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          : task
      )
    );
  }, []);

  // Generate tasks with AI - synced to DSA mastery, spaced repetition, and roadmaps
  const generateTasks = useCallback(async (date: string, learningItems: LearningItem[] = []) => {
    // Prevent duplicate generation while already generating
    if (isGenerating) return;

    setIsGenerating(true);
    setError(null);

    try {
      // Simulate AI generation delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Clear any existing AI-generated tasks for this date first
      setTasks(prev => prev.filter(t => !(t.scheduledDate === date && t.source === "ai-generated")));

      // Helper to create a task only if not duplicate
      const localDuplicateTitles = new Set<string>();
      const createIfNotDuplicate = (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task | null => {
        const lowerTitle = task.title.toLowerCase();
        if (isDuplicateTask(task.title, date) || localDuplicateTitles.has(lowerTitle)) {
          return null;
        }
        localDuplicateTitles.add(lowerTitle);
        return {
          ...task,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      };

      // ============================================
      // SMART TASK GENERATION FROM LEARNING CONTEXT
      // ============================================
      
      const potentialTasks: Array<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>> = [];

      if (learningItems.length > 0) {
        // Group items by source
        const dsaItems = learningItems.filter(i => i.source === "dsa");
        const progItems = learningItems.filter(i => i.source === "programming");
        const mlItems = learningItems.filter(i => i.source === "ml");

        // --- DSA Tasks (Mastery + Spaced Repetition) ---
        
        // Get items needing spaced repetition (not practiced in 3+ days or never practiced)
        const spacedRepItems = dsaItems.filter(i => {
          if (!i.lastPracticed) return true;
          const daysSince = (new Date(date).getTime() - new Date(i.lastPracticed).getTime()) / (1000 * 60 * 60 * 24);
          return daysSince >= 3;
        });

        // Get low mastery items (need focused practice)
        const lowMasteryItems = dsaItems.filter(i => i.mastery < 50 && i.status !== "completed");

        // Get in-progress items (continue current work)
        const inProgressDSA = dsaItems.filter(i => i.status === "in-progress");

        // Morning DSA block (2-3 tasks)
        if (inProgressDSA.length > 0) {
          // Continue with current DSA focus
          const primary = inProgressDSA[0];
          potentialTasks.push({
            title: `Practice ${primary.name} Problems`,
            description: `Continue working on ${primary.name}. Current mastery: ${primary.mastery}%. Solve 2-3 problems to build proficiency.`,
            category: "dsa",
            priority: "high",
            status: "pending",
            source: "ai-generated",
            estimatedMinutes: primary.difficulty === "easy" ? 30 : primary.difficulty === "medium" ? 45 : 60,
            scheduledDate: date,
            timeOfDay: "morning",
            progress: 0,
            relatedTopic: primary.name,
            aiReasoning: `You're currently learning ${primary.name} (${primary.mastery}% mastery). Continuing this builds momentum.`,
            aiContext: {
              learningPath: "DSA Mastery",
              skillLevel: primary.mastery < 30 ? "beginner" : primary.mastery < 70 ? "intermediate" : "advanced",
              focusArea: primary.name,
            },
            tags: ["dsa", primary.category, "practice"],
          });
        } else if (lowMasteryItems.length > 0) {
          // Focus on weakest topic
          const weakest = lowMasteryItems.sort((a, b) => a.mastery - b.mastery)[0];
          potentialTasks.push({
            title: `Strengthen ${weakest.name} Fundamentals`,
            description: `Your ${weakest.name} mastery is at ${weakest.mastery}%. Focus on core concepts and easy problems first.`,
            category: "dsa",
            priority: "high",
            status: "pending",
            source: "ai-generated",
            estimatedMinutes: 45,
            scheduledDate: date,
            timeOfDay: "morning",
            progress: 0,
            relatedTopic: weakest.name,
            aiReasoning: `Spaced repetition: ${weakest.name} needs attention (mastery: ${weakest.mastery}%). Regular practice prevents forgetting.`,
            aiContext: {
              learningPath: "DSA Mastery",
              skillLevel: "beginner",
              focusArea: weakest.name,
            },
            tags: ["dsa", weakest.category, "spaced-repetition"],
          });
        } else if (dsaItems.length > 0) {
          // Pick next topic in progression
          const nextTopic = dsaItems.find(i => i.status === "pending") || dsaItems[0];
          potentialTasks.push({
            title: `Solve ${nextTopic.name} Problems (2-3 problems)`,
            description: `Work on ${nextTopic.name} problems. ${nextTopic.mastery}% mastery achieved.`,
            category: "dsa",
            priority: "high",
            status: "pending",
            source: "ai-generated",
            estimatedMinutes: 40,
            scheduledDate: date,
            timeOfDay: "morning",
            progress: 0,
            relatedTopic: nextTopic.name,
            aiReasoning: `Following your DSA learning path. ${nextTopic.name} is the next logical step.`,
            aiContext: {
              learningPath: "DSA Mastery",
              skillLevel: "intermediate",
              focusArea: nextTopic.name,
            },
            tags: ["dsa", nextTopic.category, "problems"],
          });
        }

        // Spaced repetition review task
        if (spacedRepItems.length > 0) {
          const reviewTopics = spacedRepItems.slice(0, 3).map(i => i.name).join(", ");
          potentialTasks.push({
            title: `Review: ${reviewTopics}`,
            description: `Quick review of topics you haven't practiced recently. This helps with long-term retention.`,
            category: "review",
            priority: "medium",
            status: "pending",
            source: "ai-generated",
            estimatedMinutes: 20,
            scheduledDate: date,
            timeOfDay: "evening",
            progress: 0,
            relatedTopic: reviewTopics,
            aiReasoning: `Spaced repetition alert: These topics haven't been reviewed in 3+ days. Quick review prevents forgetting.`,
            aiContext: {
              learningPath: "Spaced Repetition",
              skillLevel: "intermediate",
              focusArea: "review",
            },
            tags: ["review", "spaced-repetition", "dsa"],
          });
        }

        // --- Programming Roadmap Tasks ---
        const inProgressProg = progItems.filter(i => i.status === "in-progress");
        const nextPendingProg = progItems.filter(i => i.status === "pending");

        if (inProgressProg.length > 0) {
          const current = inProgressProg[0];
          potentialTasks.push({
            title: `Study ${current.name}`,
            description: `Continue learning ${current.name}. ${current.mastery}% complete. Focus on core concepts today.`,
            category: "coding",
            priority: "medium",
            status: "pending",
            source: "ai-generated",
            estimatedMinutes: Math.min(current.estimatedMinutes, 45),
            scheduledDate: date,
            timeOfDay: "afternoon",
            progress: 0,
            relatedTopic: current.name,
            aiReasoning: `You're making progress on ${current.name} (${current.mastery}% done). Consistent study keeps you on track.`,
            aiContext: {
              learningPath: "Programming Roadmap",
              skillLevel: "intermediate",
              focusArea: current.name,
            },
            tags: ["programming", current.category, "study"],
          });
        } else if (nextPendingProg.length > 0) {
          const next = nextPendingProg[0];
          potentialTasks.push({
            title: `Start Learning ${next.name}`,
            description: `Begin your journey with ${next.name}. This is part of your programming roadmap.`,
            category: "coding",
            priority: "low",
            status: "pending",
            source: "ai-generated",
            estimatedMinutes: 30,
            scheduledDate: date,
            timeOfDay: "afternoon",
            progress: 0,
            relatedTopic: next.name,
            aiReasoning: `Next up in your programming roadmap: ${next.name}. Start with an overview today.`,
            aiContext: {
              learningPath: "Programming Roadmap",
              skillLevel: "beginner",
              focusArea: next.name,
            },
            tags: ["programming", next.category, "new-topic"],
          });
        }

        // --- ML Roadmap Tasks ---
        const inProgressML = mlItems.filter(i => i.status === "in-progress");
        const nextPendingML = mlItems.filter(i => i.status === "pending");

        if (inProgressML.length > 0) {
          const current = inProgressML[0];
          potentialTasks.push({
            title: `ML Practice: ${current.name}`,
            description: `Continue with ${current.name}. ${current.mastery}% complete. Try hands-on exercises.`,
            category: "ml",
            priority: "medium",
            status: "pending",
            source: "ai-generated",
            estimatedMinutes: Math.min(current.estimatedMinutes, 50),
            scheduledDate: date,
            timeOfDay: "afternoon",
            progress: 0,
            relatedTopic: current.name,
            aiReasoning: `Your ML journey: ${current.name} is ${current.mastery}% complete. Hands-on practice reinforces learning.`,
            aiContext: {
              learningPath: "ML Roadmap",
              skillLevel: "intermediate",
              focusArea: current.name,
            },
            tags: ["ml", current.category, "practice"],
          });
        } else if (nextPendingML.length > 0) {
          const next = nextPendingML[0];
          potentialTasks.push({
            title: `Explore ${next.name}`,
            description: `Introduction to ${next.name} for your ML learning path.`,
            category: "ml",
            priority: "low",
            status: "pending",
            source: "ai-generated",
            estimatedMinutes: 25,
            scheduledDate: date,
            timeOfDay: "evening",
            progress: 0,
            relatedTopic: next.name,
            aiReasoning: `Preview tomorrow's ML topic: ${next.name}. A quick overview helps you prepare.`,
            aiContext: {
              learningPath: "ML Roadmap",
              skillLevel: "beginner",
              focusArea: next.name,
            },
            tags: ["ml", next.category, "preview"],
          });
        }

        // --- Daily Maintenance Tasks ---
        potentialTasks.push({
          title: "Daily Problem Solving Warm-up",
          description: "Solve 1 easy problem to warm up your coding mind.",
          category: "dsa",
          priority: "low",
          status: "pending",
          source: "ai-generated",
          estimatedMinutes: 15,
          scheduledDate: date,
          timeOfDay: "morning",
          progress: 0,
          relatedTopic: "Warm-up",
          aiReasoning: "Starting the day with an easy win builds momentum and keeps your skills sharp.",
          tags: ["daily", "warm-up", "easy"],
        });

        potentialTasks.push({
          title: "Evening Reflection & Planning",
          description: "Review what you learned today and plan tomorrow's focus areas.",
          category: "review",
          priority: "low",
          status: "pending",
          source: "ai-generated",
          estimatedMinutes: 10,
          scheduledDate: date,
          scheduledTime: "21:00",
          timeOfDay: "evening",
          progress: 0,
          tags: ["daily", "reflection", "planning"],
          aiReasoning: "Reflection solidifies learning and helps you plan effectively.",
        });

      } else {
        // Fallback: Generate generic tasks if no learning context available
        const fallbackTasks: Array<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>> = [
          {
            title: "Morning DSA Practice",
            description: "Solve 2-3 coding problems to start the day",
            category: "dsa",
            priority: "high",
            status: "pending",
            source: "ai-generated",
            estimatedMinutes: 45,
            scheduledDate: date,
            timeOfDay: "morning",
            progress: 0,
            tags: ["dsa", "practice"],
          },
          {
            title: "Review Concepts",
            description: "Quick review of key concepts",
            category: "review",
            priority: "medium",
            status: "pending",
            source: "ai-generated",
            estimatedMinutes: 20,
            scheduledDate: date,
            timeOfDay: "evening",
            progress: 0,
            tags: ["review", "daily"],
          },
          {
            title: "Evening Reading",
            description: "Read a technical article or documentation",
            category: "reading",
            priority: "low",
            status: "pending",
            source: "ai-generated",
            estimatedMinutes: 15,
            scheduledDate: date,
            timeOfDay: "evening",
            progress: 0,
            tags: ["reading", "learning"],
          },
        ];
        potentialTasks.push(...fallbackTasks);
      }

      // Filter out duplicates and create tasks
      const newTasks = potentialTasks
        .map(t => createIfNotDuplicate(t))
        .filter((t): t is Task => t !== null);

      setTasks((prev) => [...prev, ...newTasks]);
    } catch (err) {
      setError("Failed to generate tasks. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }, [tasks, isGenerating]);

  // Filtered and sorted tasks
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Apply filters
    if (filters.status && filters.status.length > 0) {
      result = result.filter((t) => filters.status!.includes(t.status));
    }
    if (filters.category && filters.category.length > 0) {
      result = result.filter((t) => filters.category!.includes(t.category));
    }
    if (filters.priority && filters.priority.length > 0) {
      result = result.filter((t) => filters.priority!.includes(t.priority));
    }
    if (filters.search) {
      const query = filters.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          t.description?.toLowerCase().includes(query)
      );
    }

    // Apply sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sort.field) {
        case "scheduledDate":
          comparison = a.scheduledDate.localeCompare(b.scheduledDate);
          break;
        case "priority": {
          const order = { urgent: 0, high: 1, medium: 2, low: 3 };
          comparison = order[a.priority] - order[b.priority];
          break;
        }
        case "category":
          comparison = a.category.localeCompare(b.category);
          break;
        case "status": {
          const order = { in_progress: 0, pending: 1, completed: 2, skipped: 3, cancelled: 4 };
          comparison = order[a.status] - order[b.status];
          break;
        }
        case "progress":
          comparison = b.progress - a.progress;
          break;
        default:
          comparison = 0;
      }
      return sort.order === "asc" ? comparison : -comparison;
    });

    return result;
  }, [tasks, filters, sort]);

  return {
    tasks: filteredTasks,
    allTasks: tasks,
    dailyPlan,
    weeklyPlan,
    stats,
    filters,
    sort,
    isLoading,
    isGenerating,
    error,
    setFilters,
    setSort,
    createTask,
    updateTask,
    deleteTask,
    startTask,
    completeTask,
    generateTasks,
  };
}
