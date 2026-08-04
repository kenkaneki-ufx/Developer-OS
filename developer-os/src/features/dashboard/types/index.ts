export interface StatCard {
  id: string;
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
}

export interface DashboardStats {
  codingHours: number;
  studyHours: number;
  tasksCompleted: number;
  currentStreak: number;
  personalBestStreak: number;
  dsaSolved: number;
  dsaToday: number;
  githubCommits: number;
  githubToday: number;
  consistencyScore: number;
}


export interface AITask {
  id: string;
  title: string;
  description?: string;
  category: "dsa" | "ml" | "project" | "coding" | "review";
  priority: "high" | "medium" | "low";
  estimatedTime: number; // in minutes
  isCompleted: boolean;
  progress?: number; // 0-100
  relatedTopic?: string;
  source: "ai-generated" | "user-created" | "recurring";
}

export interface DailyTasks {
  date: string;
  tasks: AITask[];
  totalTasks: number;
  completedTasks: number;
  totalEstimatedTime: number;
}


export interface Project {
  id: string;
  name: string;
  description?: string;
  status: "active" | "completed" | "paused" | "archived";
  progress: number; // 0-100
  technologies: string[];
  githubUrl?: string;
  deadline?: string;
  lastActivity: string;
  tasksCount: number;
  completedTasksCount: number;
}

export interface ProjectsOverview {
  activeProjects: Project[];
  totalProjects: number;
  activeCount: number;
  completedCount: number;
}


export interface Deadline {
  id: string;
  title: string;
  description?: string;
  dueDate: string; // ISO string
  type: "project" | "milestone" | "other";
  priority: "high" | "medium" | "low";
  isCompleted: boolean;
  daysRemaining: number;
  relatedSubject?: string;
}

export interface UpcomingDeadlines {
  deadlines: Deadline[];
  totalUpcoming: number;
  overdue: number;
  dueThisWeek: number;
}


export interface GitHubActivity {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4; // Contribution intensity
}

export interface GitHubOverview {
  totalCommits: number;
  todayCommits: number;
  weekCommits: number;
  monthCommits: number;
  contributionGraph: GitHubActivity[];
  streak: number;
  repositories: number;
  pullRequests: number;
  issues: number;
}


export interface DSATopic {
  id: string;
  name: string;
  category: string;
  totalQuestions: number;
  solvedQuestions: number;
  bookmarked: number;
  mastery: number; // 0-100
  lastPracticed?: string;
}

export interface DSAProgress {
  currentTopic: DSATopic;
  recentTopics: DSATopic[];
  totalSolved: number;
  totalQuestions: number;
  todaySolved: number;
  weeklyGoal: number;
  weeklyProgress: number;
  streak: number;
  platforms: {
    leetcode: number;
    codeforces: number;
    geeksforgeeks: number;
    atcoder: number;
  };
}


export interface MLTopic {
  id: string;
  name: string;
  category: string;
  progress: number; // 0-100
  isCompleted: boolean;
  resources: number;
  projects: number;
  lastStudied?: string;
}

export interface MLProgress {
  currentTopic: MLTopic;
  roadmap: MLTopic[];
  overallProgress: number;
  completedTopics: number;
  totalTopics: number;
  currentPhase: string;
  projectsCompleted: number;
}


export interface QuickNote {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  color?: string;
}


export interface MotivationQuote {
  id: string;
  text: string;
  author: string;
  category: "motivation" | "productivity" | "coding" | "life";
}


export interface DashboardState {
  stats: DashboardStats | null;
  tasks: DailyTasks | null;
  projects: ProjectsOverview | null;
  deadlines: UpcomingDeadlines | null;
  github: GitHubOverview | null;
  dsa: DSAProgress | null;
  ml: MLProgress | null;
  notes: QuickNote[];
  motivation: MotivationQuote | null;
  isLoading: boolean;
  error: string | null;
}
