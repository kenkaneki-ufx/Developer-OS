/**
 * DSA Tracker Mock Data
 *
 * Realistic mock data for DSA tracking including topics, questions, platforms, and progress.
 */

import type {
  DSATopic,
  DSAQuestion,
  PlatformStats,
  DailyProgress,
  WeeklyProgress,
  StreakData,
  Bookmark,
  BookmarkFolder,
  Mistake,
} from "../types";

// ============================================
// Topics Mock Data
// ============================================

export const mockTopics: DSATopic[] = [
  {
    id: "arrays",
    name: "Arrays",
    slug: "arrays",
    description: "Fundamental data structure for storing elements in sequential memory",
    category: "arrays",
    totalQuestions: 50,
    solvedQuestions: 0,
    attemptedQuestions: 0,
    bookmarkedCount: 0,
    mastery: 0,
    masteryLevel: "beginner",
    estimatedHours: 15,
    difficulty: "easy",
    resources: [
      { id: "1", title: "Array Data Structure", url: "#", type: "article" },
      { id: "2", title: "Array Algorithms Visualized", url: "#", type: "video" },
    ],
  },
  {
    id: "linked-lists",
    name: "Linked Lists",
    slug: "linked-lists",
    description: "Linear data structure with nodes containing data and reference to next node",
    category: "linked-lists",
    totalQuestions: 30,
    solvedQuestions: 0,
    attemptedQuestions: 0,
    bookmarkedCount: 0,
    mastery: 0,
    masteryLevel: "beginner",
    estimatedHours: 12,
    difficulty: "easy",
    resources: [
      { id: "1", title: "Linked Lists Explained", url: "#", type: "article" },
    ],
  },
  {
    id: "binary-trees",
    name: "Binary Trees",
    slug: "binary-trees",
    description: "Hierarchical data structure with at most two children per node",
    category: "trees",
    totalQuestions: 45,
    solvedQuestions: 0,
    attemptedQuestions: 0,
    bookmarkedCount: 0,
    mastery: 0,
    masteryLevel: "beginner",
    estimatedHours: 20,
    difficulty: "medium",
    resources: [
      { id: "1", title: "Binary Tree Traversal", url: "#", type: "article" },
      { id: "2", title: "Tree Algorithms Course", url: "#", type: "course" },
    ],
  },
  {
    id: "graphs",
    name: "Graphs",
    slug: "graphs",
    description: "Non-linear data structure consisting of vertices and edges",
    category: "graphs",
    totalQuestions: 40,
    solvedQuestions: 0,
    attemptedQuestions: 0,
    bookmarkedCount: 0,
    mastery: 0,
    masteryLevel: "beginner",
    estimatedHours: 25,
    difficulty: "hard",
    resources: [],
  },
  {
    id: "dynamic-programming",
    name: "Dynamic Programming",
    slug: "dynamic-programming",
    description: "Optimization technique by breaking problems into subproblems",
    category: "dynamic-programming",
    totalQuestions: 60,
    solvedQuestions: 0,
    attemptedQuestions: 0,
    bookmarkedCount: 0,
    mastery: 0,
    masteryLevel: "beginner",
    estimatedHours: 30,
    difficulty: "hard",
    resources: [],
  },
  {
    id: "binary-search",
    name: "Binary Search",
    slug: "binary-search",
    description: "Efficient search algorithm for sorted arrays with O(log n) complexity",
    category: "binary-search",
    totalQuestions: 25,
    solvedQuestions: 0,
    attemptedQuestions: 0,
    bookmarkedCount: 0,
    mastery: 0,
    masteryLevel: "beginner",
    estimatedHours: 8,
    difficulty: "medium",
    resources: [],
  },
  {
    id: "stacks-queues",
    name: "Stacks & Queues",
    slug: "stacks-queues",
    description: "LIFO and FIFO data structures for managing elements",
    category: "stacks-queues",
    totalQuestions: 30,
    solvedQuestions: 0,
    attemptedQuestions: 0,
    bookmarkedCount: 0,
    mastery: 0,
    masteryLevel: "beginner",
    estimatedHours: 10,
    difficulty: "easy",
    resources: [],
  },
  {
    id: "hashing",
    name: "Hashing",
    slug: "hashing",
    description: "Technique for mapping data using hash functions for O(1) access",
    category: "hashing",
    totalQuestions: 25,
    solvedQuestions: 0,
    attemptedQuestions: 0,
    bookmarkedCount: 0,
    mastery: 0,
    masteryLevel: "beginner",
    estimatedHours: 8,
    difficulty: "medium",
    resources: [],
  },
  {
    id: "two-pointers",
    name: "Two Pointers",
    slug: "two-pointers",
    description: "Technique using two pointers to solve array/string problems efficiently",
    category: "two-pointers",
    totalQuestions: 20,
    solvedQuestions: 0,
    attemptedQuestions: 0,
    bookmarkedCount: 0,
    mastery: 0,
    masteryLevel: "beginner",
    estimatedHours: 6,
    difficulty: "medium",
    resources: [],
  },
  {
    id: "sliding-window",
    name: "Sliding Window",
    slug: "sliding-window",
    description: "Technique for solving array/string problems with contiguous elements",
    category: "sliding-window",
    totalQuestions: 18,
    solvedQuestions: 0,
    attemptedQuestions: 0,
    bookmarkedCount: 0,
    mastery: 0,
    masteryLevel: "beginner",
    estimatedHours: 6,
    difficulty: "medium",
    resources: [],
  },
];

// ============================================
// Platform Stats Mock Data
// ============================================

export const mockPlatformStats: PlatformStats[] = [
  {
    platform: "leetcode",
    displayName: "LeetCode",
    icon: "🟡",
    totalSolved: 0,
    easySolved: 0,
    mediumSolved: 0,
    hardSolved: 0,
    totalQuestions: 3000,
    rating: 0,
    rank: "Newcomer",
    streak: 0,
    lastUpdated: new Date().toISOString(),
  },
  {
    platform: "codeforces",
    displayName: "Codeforces",
    icon: "🔵",
    totalSolved: 0,
    easySolved: 0,
    mediumSolved: 0,
    hardSolved: 0,
    totalQuestions: 2500,
    rating: 0,
    rank: "Newcomer",
    streak: 0,
    contestRating: 0,
    lastUpdated: new Date().toISOString(),
  },
  {
    platform: "geeksforgeeks",
    displayName: "GeeksforGeeks",
    icon: "🟢",
    totalSolved: 0,
    easySolved: 0,
    mediumSolved: 0,
    hardSolved: 0,
    totalQuestions: 2000,
    streak: 0,
    lastUpdated: new Date().toISOString(),
  },
  {
    platform: "atcoder",
    displayName: "AtCoder",
    icon: "🔴",
    totalSolved: 0,
    easySolved: 0,
    mediumSolved: 0,
    hardSolved: 0,
    totalQuestions: 1500,
    rating: 0,
    streak: 0,
    lastUpdated: new Date().toISOString(),
  },
];

// ============================================
// Questions Mock Data
// ============================================

export const mockQuestions: DSAQuestion[] = [];

// ============================================
// Streak Mock Data
// ============================================

export const mockStreak: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  todaySolved: false,
  streakGoal: 30,
  weeklyGoal: 25,
  weeklyProgress: 0,
};

// ============================================
// Progress Mock Data
// ============================================

export const mockDailyProgress: DailyProgress[] = Array.from({ length: 7 }, (_, i) => ({
  date: new Date(Date.now() - (6 - i) * 86400000).toISOString().split("T")[0],
  solved: 0,
  attempted: 0,
  timeSpent: 0,
  topics: [],
}));

export const mockWeeklyProgress: WeeklyProgress[] = [
  {
    weekStart: new Date(Date.now() - 13 * 86400000).toISOString().split("T")[0],
    weekEnd: new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0],
    totalSolved: 0,
    totalAttempted: 0,
    totalTimeSpent: 0,
    dailyBreakdown: [],
    topTopics: [],
    difficultyBreakdown: { easy: 0, medium: 0, hard: 0 },
  },
  {
    weekStart: new Date(Date.now() - 6 * 86400000).toISOString().split("T")[0],
    weekEnd: new Date().toISOString().split("T")[0],
    totalSolved: 0,
    totalAttempted: 0,
    totalTimeSpent: 0,
    dailyBreakdown: mockDailyProgress,
    topTopics: [],
    difficultyBreakdown: { easy: 0, medium: 0, hard: 0 },
  },
];

// ============================================
// Bookmarks Mock Data
// ============================================

export const mockBookmarkFolders: BookmarkFolder[] = [];

export const mockBookmarks: Bookmark[] = [];

// ============================================
// Mistakes Mock Data
// ============================================

export const mockMistakes: Mistake[] = [];
