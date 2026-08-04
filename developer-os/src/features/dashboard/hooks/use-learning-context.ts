"use client";

import { useMemo } from "react";
import type { DSATopic } from "@/features/dsa/types";
import { programmingRoadmapItems, mlRoadmapItems } from "../data/roadmap-data";

/**
 * Represents a learning item from any source (DSA, roadmap, college)
 * that can be used to generate daily tasks.
 */
export interface LearningItem {
  id: string;
  name: string;
  source: "dsa" | "programming" | "ml" | "college";
  category: string;
  mastery: number; // 0-100
  lastPracticed?: string;
  difficulty: "easy" | "medium" | "hard";
  status: "completed" | "in-progress" | "pending";
  estimatedMinutes: number;
  priority: number; // Lower = higher priority for task generation
}

/**
 * Aggregates learning data from all sources to provide context for task generation.
 *
 * Priority algorithm:
 * 1. Items not practiced in 3+ days get highest priority (spaced repetition)
 * 2. Items with <50% mastery get high priority
 * 3. Items currently "in-progress" get medium priority
 * 4. Items with >80% mastery get low priority (maintenance)
 */
export function useLearningContext(dsaTopics: DSATopic[] = []) {
  const learningItems = useMemo(() => {
    const items: LearningItem[] = [];
    const now = new Date();

    // ============================================
    // DSA Topics
    // ============================================
    dsaTopics.forEach((topic) => {
      const lastPracticed = topic.lastPracticed
        ? new Date(topic.lastPracticed)
        : null;
      const daysSincePracticed = lastPracticed
        ? Math.floor((now.getTime() - lastPracticed.getTime()) / (1000 * 60 * 60 * 24))
        : 999; // Never practiced = very high priority

      // Calculate priority based on mastery and recency
      let priority = 50; // Default
      if (daysSincePracticed >= 3) priority -= 30; // Spaced repetition boost
      if (topic.mastery < 30) priority -= 20; // Low mastery boost
      else if (topic.mastery < 50) priority -= 10;
      else if (topic.mastery >= 80) priority += 20; // Already mastered, lower priority

      items.push({
        id: `dsa-${topic.id}`,
        name: topic.name,
        source: "dsa",
        category: topic.category,
        mastery: topic.mastery,
        lastPracticed: topic.lastPracticed,
        difficulty: topic.difficulty,
        status: topic.mastery >= 80 ? "completed" : topic.mastery > 0 ? "in-progress" : "pending",
        estimatedMinutes: topic.difficulty === "easy" ? 30 : topic.difficulty === "medium" ? 45 : 60,
        priority,
      });
    });

    // ============================================
    // Programming Roadmap
    // ============================================
    programmingRoadmapItems.forEach((topic) => {
      let priority = 50;
      if (topic.status === "in-progress") priority -= 20;
      else if (topic.status === "pending") priority += 10;
      else priority += 30; // Completed = low priority

      items.push({
        id: `prog-${topic.id}`,
        name: topic.name,
        source: "programming",
        category: topic.phase.toLowerCase(),
        mastery: topic.progress,
        difficulty: topic.phase === "Foundation" ? "easy" : topic.phase === "Architecture" ? "hard" : "medium",
        status: topic.status,
        estimatedMinutes: topic.resources * 3, // Rough estimate: 3 min per resource
        priority,
      });
    });

    // ============================================
    // ML Roadmap
    // ============================================
    mlRoadmapItems.forEach((topic) => {
      let priority = 50;
      if (topic.status === "in-progress") priority -= 20;
      else if (topic.status === "pending") priority += 10;
      else priority += 30;

      items.push({
        id: `ml-${topic.id}`,
        name: topic.name,
        source: "ml",
        category: topic.phase.toLowerCase(),
        mastery: topic.progress,
        difficulty: topic.phase === "Foundation" ? "easy" : topic.phase === "Advanced" ? "hard" : "medium",
        status: topic.status,
        estimatedMinutes: topic.resources * 4,
        priority,
      });
    });

    // Sort by priority (lower = more urgent)
    items.sort((a, b) => a.priority - b.priority);

    return items;
  }, [dsaTopics]);

  // Get items that need attention (priority < 40)
  const urgentItems = useMemo(
    () => learningItems.filter((item) => item.priority < 40),
    [learningItems]
  );

  // Get items due for spaced repetition (not practiced in 3+ days)
  const spacedRepetitionItems = useMemo(
    () =>
      learningItems.filter((item) => {
        if (!item.lastPracticed) return true; // Never practiced
        const daysSince =
          (new Date().getTime() - new Date(item.lastPracticed).getTime()) /
          (1000 * 60 * 60 * 24);
        return daysSince >= 3;
      }),
    [learningItems]
  );

  // Get current focus items (in-progress from any source)
  const currentFocusItems = useMemo(
    () => learningItems.filter((item) => item.status === "in-progress"),
    [learningItems]
  );

  // Get stats by source
  const sourceStats = useMemo(() => {
    const stats = {
      dsa: { total: 0, completed: 0, inProgress: 0, pending: 0 },
      programming: { total: 0, completed: 0, inProgress: 0, pending: 0 },
      ml: { total: 0, completed: 0, inProgress: 0, pending: 0 },
    };

    learningItems.forEach((item) => {
      const source = item.source as keyof typeof stats;
      if (stats[source]) {
        stats[source].total++;
        if (item.status === "completed") stats[source].completed++;
        else if (item.status === "in-progress") stats[source].inProgress++;
        else stats[source].pending++;
      }
    });

    return stats;
  }, [learningItems]);

  return {
    learningItems,
    urgentItems,
    spacedRepetitionItems,
    currentFocusItems,
    sourceStats,
  };
}
