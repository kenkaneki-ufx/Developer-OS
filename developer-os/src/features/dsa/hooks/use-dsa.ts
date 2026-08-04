"use client";

import { useState, useCallback, useMemo } from "react";
import type {
  DSATopic,
  DSAQuestion,
  PlatformStats,
  StreakData,
  Bookmark,
  BookmarkFolder,
  Mistake,
  DSAFilters,
  DSASort,
  DailyProgress,
  WeeklyProgress,
  QuestionStatus,
} from "../types";
import {
  mockTopics,
  mockQuestions,
  mockPlatformStats,
  mockStreak,
  mockBookmarks,
  mockBookmarkFolders,
  mockMistakes,
  mockDailyProgress,
  mockWeeklyProgress,
} from "../data/mock-dsa";

export function useDSA() {
  const [topics, setTopics] = useState<DSATopic[]>(mockTopics);
  const [questions, setQuestions] = useState<DSAQuestion[]>(mockQuestions);
  const [platformStats] = useState<PlatformStats[]>(mockPlatformStats);
  const [streak, setStreak] = useState<StreakData>(mockStreak);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(mockBookmarks);
  const [bookmarkFolders] = useState<BookmarkFolder[]>(mockBookmarkFolders);
  const [mistakes, setMistakes] = useState<Mistake[]>(mockMistakes);
  const [dailyProgress] = useState<DailyProgress[]>(mockDailyProgress);
  const [weeklyProgress] = useState<WeeklyProgress[]>(mockWeeklyProgress);
  const [filters, setFilters] = useState<DSAFilters>({});
  const [sort, setSort] = useState<DSASort>({ field: "lastAttempted", order: "desc" });
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);

  // Update question status
  const updateQuestionStatus = useCallback((questionId: string, status: QuestionStatus) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              status,
              solvedAt: status === "solved" ? new Date().toISOString() : q.solvedAt,
              lastAttempted: new Date().toISOString(),
            }
          : q
      )
    );
  }, []);

  // Toggle bookmark
  const toggleBookmark = useCallback((questionId: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId ? { ...q, isBookmarked: !q.isBookmarked } : q
      )
    );
    setBookmarks((prev) => {
      const exists = prev.find((b) => b.questionId === questionId);
      if (exists) return prev.filter((b) => b.questionId !== questionId);
      const question = questions.find((q) => q.id === questionId);
      if (!question) return prev;
      return [
        ...prev,
        {
          id: `b-${Date.now()}`,
          questionId,
          question,
          tags: [],
          createdAt: new Date().toISOString(),
        },
      ];
    });
  }, [questions]);

  // Add mistake
  const addMistake = useCallback((mistake: Omit<Mistake, "id" | "createdAt" | "reviewCount" | "isResolved">) => {
    const newMistake: Mistake = {
      ...mistake,
      id: `m-${Date.now()}`,
      reviewCount: 0,
      isResolved: false,
      createdAt: new Date().toISOString(),
    };
    setMistakes((prev) => [...prev, newMistake]);
  }, []);

  // Resolve mistake
  const resolveMistake = useCallback((mistakeId: string) => {
    setMistakes((prev) =>
      prev.map((m) => (m.id === mistakeId ? { ...m, isResolved: true } : m))
    );
  }, []);

  // Mark today as solved
  const markTodaySolved = useCallback(() => {
    setStreak((prev) => ({
      ...prev,
      todaySolved: true,
      currentStreak: prev.currentStreak + 1,
      lastSolvedDate: new Date().toISOString(),
    }));
  }, []);

  // Filtered questions
  const filteredQuestions = useMemo(() => {
    let result = [...questions];
    if (filters.topics && filters.topics.length > 0)
      result = result.filter((q) => filters.topics!.includes(q.topicId));
    if (filters.difficulties && filters.difficulties.length > 0)
      result = result.filter((q) => filters.difficulties!.includes(q.difficulty));
    if (filters.platforms && filters.platforms.length > 0)
      result = result.filter((q) => filters.platforms!.includes(q.platform));
    if (filters.statuses && filters.statuses.length > 0)
      result = result.filter((q) => filters.statuses!.includes(q.status));
    if (filters.search) {
      const query = filters.search.toLowerCase();
      result = result.filter(
        (q) =>
          q.title.toLowerCase().includes(query) ||
          q.tags.some((t) => t.toLowerCase().includes(query))
      );
    }
    if (filters.showBookmarked) result = result.filter((q) => q.isBookmarked);
    if (filters.showMistakes) result = result.filter((q) => q.isMistake);

    result.sort((a, b) => {
      let comparison = 0;
      switch (sort.field) {
        case "title": comparison = a.title.localeCompare(b.title); break;
        case "difficulty": {
          const order = { easy: 0, medium: 1, hard: 2 };
          comparison = order[a.difficulty] - order[b.difficulty]; break;
        }
        case "platform": comparison = a.platform.localeCompare(b.platform); break;
        case "status": {
          const order = { solved: 0, attempted: 1, revision: 2, bookmarked: 3, todo: 4 };
          comparison = order[a.status] - order[b.status]; break;
        }
        case "lastAttempted":
          comparison = (b.lastAttempted || "").localeCompare(a.lastAttempted || ""); break;
        case "timeSpent": comparison = b.timeSpent - a.timeSpent; break;
      }
      return sort.order === "asc" ? comparison : -comparison;
    });
    return result;
  }, [questions, filters, sort]);

  return {
    topics,
    questions: filteredQuestions,
    allQuestions: questions,
    platformStats,
    streak,
    bookmarks,
    bookmarkFolders,
    mistakes,
    dailyProgress,
    weeklyProgress,
    filters,
    sort,
    isLoading,
    error,
    setFilters,
    setSort,
    updateQuestionStatus,
    toggleBookmark,
    addMistake,
    resolveMistake,
    markTodaySolved,
  };
}
