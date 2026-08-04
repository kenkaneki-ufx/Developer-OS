/**
 * DSA Tracker Types
 *
 * Comprehensive TypeScript interfaces for the DSA tracking feature.
 */

// ============================================
// Core Types
// ============================================

export type Difficulty = "easy" | "medium" | "hard";

export type Platform = "leetcode" | "codeforces" | "geeksforgeeks" | "atcoder" | "hackerrank";

export type QuestionStatus = "solved" | "attempted" | "bookmarked" | "todo" | "revision";

export type MasteryLevel = "beginner" | "learning" | "intermediate" | "advanced" | "mastered";

// ============================================
// Topic Types
// ============================================

export interface DSATopic {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: TopicCategory;
  totalQuestions: number;
  solvedQuestions: number;
  attemptedQuestions: number;
  bookmarkedCount: number;
  mastery: number; // 0-100
  masteryLevel: MasteryLevel;
  lastPracticed?: string;
  estimatedHours: number;
  difficulty: Difficulty;
  resources: TopicResource[];
}

export type TopicCategory =
  | "arrays"
  | "strings"
  | "linked-lists"
  | "stacks-queues"
  | "trees"
  | "graphs"
  | "dynamic-programming"
  | "binary-search"
  | "sorting"
  | "greedy"
  | "backtracking"
  | "heap"
  | "hashing"
  | "two-pointers"
  | "sliding-window"
  | "recursion"
  | "bit-manipulation"
  | "math";

export interface TopicResource {
  id: string;
  title: string;
  url: string;
  type: "article" | "video" | "course" | "book";
}

// ============================================
// Question Types
// ============================================

export interface DSAQuestion {
  id: string;
  title: string;
  platform: Platform;
  platformUrl: string;
  difficulty: Difficulty;
  topicId: string;
  topicName: string;
  status: QuestionStatus;
  isBookmarked: boolean;
  attemptCount: number;
  lastAttempted?: string;
  solvedAt?: string;
  timeSpent: number; // in minutes
  tags: string[];
  notes?: string;
  isMistake: boolean;
  mistakeNotes?: string;
}

// ============================================
// Platform Types
// ============================================

export interface PlatformStats {
  platform: Platform;
  displayName: string;
  icon: string;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  totalQuestions: number;
  rating?: number;
  rank?: string;
  streak: number;
  contestRating?: number;
  lastUpdated: string;
}

// ============================================
// Progress Types
// ============================================

export interface DailyProgress {
  date: string;
  solved: number;
  attempted: number;
  timeSpent: number; // minutes
  topics: string[];
}

export interface WeeklyProgress {
  weekStart: string;
  weekEnd: string;
  totalSolved: number;
  totalAttempted: number;
  totalTimeSpent: number;
  dailyBreakdown: DailyProgress[];
  topTopics: string[];
  difficultyBreakdown: {
    easy: number;
    medium: number;
    hard: number;
  };
}

export interface MonthlyProgress {
  month: string;
  year: number;
  totalSolved: number;
  totalAttempted: number;
  totalTimeSpent: number;
  weeklyBreakdown: WeeklyProgress[];
  streakDays: number;
  bestStreak: number;
}

// ============================================
// Streak Types
// ============================================

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  todaySolved: boolean;
  lastSolvedDate?: string;
  streakGoal: number;
  weeklyGoal: number;
  weeklyProgress: number;
}

// ============================================
// Bookmark Types
// ============================================

export interface Bookmark {
  id: string;
  questionId: string;
  question: DSAQuestion;
  folderId?: string;
  tags: string[];
  notes?: string;
  createdAt: string;
}

export interface BookmarkFolder {
  id: string;
  name: string;
  color: string;
  questionCount: number;
}

// ============================================
// Mistake Types
// ============================================

export interface Mistake {
  id: string;
  questionId: string;
  question: DSAQuestion;
  mistakeType: "logic" | "implementation" | "timeout" | "edge-case" | "concept";
  description: string;
  correction: string;
  reviewCount: number;
  lastReviewed?: string;
  nextReview?: string;
  isResolved: boolean;
  createdAt: string;
}

// ============================================
// DSA State Types
// ============================================

export interface DSAState {
  topics: DSATopic[];
  questions: DSAQuestion[];
  platformStats: PlatformStats[];
  weeklyProgress: WeeklyProgress[];
  monthlyProgress: MonthlyProgress[];
  streak: StreakData;
  bookmarks: Bookmark[];
  bookmarkFolders: BookmarkFolder[];
  mistakes: Mistake[];
  isLoading: boolean;
  error: string | null;
}

// ============================================
// Filter & Sort Types
// ============================================

export interface DSAFilters {
  topics?: string[];
  difficulties?: Difficulty[];
  platforms?: Platform[];
  statuses?: QuestionStatus[];
  dateRange?: { start: string; end: string };
  search?: string;
  showBookmarked?: boolean;
  showMistakes?: boolean;
}

export type DSASortField = "title" | "difficulty" | "platform" | "status" | "lastAttempted" | "timeSpent";

export interface DSASort {
  field: DSASortField;
  order: "asc" | "desc";
}
