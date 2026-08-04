/**
 * Task System Types
 *
 * Defines all TypeScript interfaces for the AI-powered task system.
 * Tasks are context-aware and continue from previous days.
 */

// ============================================
// Core Task Types
// ============================================

export type TaskCategory =
  | "dsa"
  | "ml"
  | "project"
  | "coding"
  | "review"
  | "reading"
  | "exercise"
  | "other";

export type TaskPriority = "urgent" | "high" | "medium" | "low";

export type TaskStatus = "pending" | "in_progress" | "completed" | "skipped" | "cancelled";

export type TaskSource = "ai-generated" | "user-created" | "recurring" | "imported";

export type TimeOfDay = "morning" | "afternoon" | "evening" | "night";

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  source: TaskSource;

  // Time management
  estimatedMinutes: number;
  actualMinutes?: number;
  scheduledDate: string; // ISO date string
  scheduledTime?: string; // HH:MM format
  timeOfDay?: TimeOfDay;
  deadline?: string; // ISO date string

  // Progress tracking
  progress: number; // 0-100
  completedAt?: string; // ISO datetime string

  // Context & relationships
  relatedTopic?: string;
  relatedSubject?: string;
  parentTaskId?: string; // For subtasks
  dependencies?: string[]; // Task IDs that must be completed first

  // AI context
  aiReasoning?: string; // Why AI suggested this task
  aiContext?: TaskAIContext;

  // Metadata
  tags: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskAIContext {
  previousTasks?: string[]; // Related tasks from previous days
  learningPath?: string; // Current learning trajectory
  skillLevel?: "beginner" | "intermediate" | "advanced";
  focusArea?: string; // What the user is currently focusing on
}

// ============================================
// Task Generation Types
// ============================================

export interface TaskGenerationRequest {
  userId: string;
  date: string; // Target date for task generation
  context: TaskGenerationContext;
  preferences?: TaskPreferences;
}

export interface TaskGenerationContext {
  currentDSATopic?: string;
  currentMLTopic?: string;
  activeProjects?: string[];
  upcomingDeadlines?: string[];
  recentActivity?: RecentActivity[];
  streakDays?: number;
  averageDailyMinutes?: number;
}

export interface RecentActivity {
  type: "dsa" | "ml" | "project" | "coding";
  topic?: string;
  duration: number; // minutes
  date: string;
  completed: boolean;
}

export interface TaskPreferences {
  preferredTimeOfDay?: TimeOfDay[];
  maxTasksPerDay?: number;
  maxMinutesPerDay?: number;
  focusCategories?: TaskCategory[];
  excludeCategories?: TaskCategory[];
}

// ============================================
// Task Plan Types
// ============================================

export interface DailyPlan {
  date: string;
  tasks: Task[];
  totalTasks: number;
  completedTasks: number;
  totalEstimatedMinutes: number;
  totalActualMinutes: number;
  focusScore: number; // 0-100, how focused the day was
  categories: CategoryBreakdown[];
}

export interface WeeklyPlan {
  startDate: string;
  endDate: string;
  dailyPlans: DailyPlan[];
  totalTasks: number;
  completedTasks: number;
  streakDays: number;
  weeklyGoal: number; // Target tasks per week
  progress: number; // 0-100
  insights: WeeklyInsight[];
}

export interface CategoryBreakdown {
  category: TaskCategory;
  taskCount: number;
  completedCount: number;
  totalMinutes: number;
  averageProgress: number;
}

export interface WeeklyInsight {
  type: "achievement" | "suggestion" | "warning" | "info";
  title: string;
  description: string;
  actionable?: string;
}

// ============================================
// Task Statistics Types
// ============================================

export interface TaskStats {
  // Overall stats
  totalTasks: number;
  completedTasks: number;
  completionRate: number; // 0-100

  // Time stats
  totalEstimatedMinutes: number;
  totalActualMinutes: number;
  timeAccuracy: number; // How accurate estimates are

  // Streak stats
  currentStreak: number;
  longestStreak: number;
  streakGoal: number;

  // Category stats
  categoryBreakdown: CategoryBreakdown[];

  // Trend data
  dailyStats: DailyStat[];
  weeklyTrend: number; // Percentage change from last week

  // Focus metrics
  averageFocusScore: number;
  mostProductiveTimeOfDay: TimeOfDay;
  mostProductiveDayOfWeek: string;
}

export interface DailyStat {
  date: string;
  tasksCompleted: number;
  minutesWorked: number;
  focusScore: number;
}

// ============================================
// Task Filter Types
// ============================================

export interface TaskFilters {
  status?: TaskStatus[];
  category?: TaskCategory[];
  priority?: TaskPriority[];
  source?: TaskSource[];
  dateRange?: {
    start: string;
    end: string;
  };
  search?: string;
  tags?: string[];
}

export type TaskSortField =
  | "scheduledDate"
  | "priority"
  | "category"
  | "status"
  | "progress"
  | "estimatedMinutes"
  | "createdAt";

export type TaskSortOrder = "asc" | "desc";

export interface TaskSort {
  field: TaskSortField;
  order: TaskSortOrder;
}

// ============================================
// Task State Types
// ============================================

export interface TaskState {
  tasks: Task[];
  dailyPlan: DailyPlan | null;
  weeklyPlan: WeeklyPlan | null;
  stats: TaskStats | null;
  filters: TaskFilters;
  sort: TaskSort;
  isLoading: boolean;
  isGenerating: boolean;
  error: string | null;
}

// ============================================
// Task Action Types
// ============================================

export interface TaskAction {
  type: string;
  payload?: unknown;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  category: TaskCategory;
  priority: TaskPriority;
  estimatedMinutes: number;
  scheduledDate: string;
  scheduledTime?: string;
  timeOfDay?: TimeOfDay;
  deadline?: string;
  relatedTopic?: string;
  relatedSubject?: string;
  tags?: string[];
}

export interface UpdateTaskPayload {
  id: string;
  updates: Partial<Task>;
}

export interface CompleteTaskPayload {
  id: string;
  actualMinutes?: number;
  notes?: string;
}
