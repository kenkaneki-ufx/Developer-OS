export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  name: string | null;
  email: string | null;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  private: boolean;
  topics: string[];
  updated_at: string;
  pushed_at: string;
}

export interface GitHubContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface GitHubStats {
  streak: number;
  todayCommits: number;
  weekCommits: number;
  monthCommits: number;
  totalCommits: number;
  repositories: number;
  pullRequests: number;
  issues: number;
}

export interface GitHubData {
  user: GitHubUser | null;
  repos: GitHubRepo[];
  contributions: GitHubContributionDay[];
  stats: GitHubStats;
}

export type GitHubTab = "overview" | "repos" | "contributions";
export type RepoViewMode = "grid" | "list";

export const levelColors = [
  "bg-muted",
  "bg-green-200 dark:bg-green-900",
  "bg-green-400 dark:bg-green-700",
  "bg-green-500 dark:bg-green-500",
  "bg-green-400 dark:bg-green-400",
];

export const languageColors: Record<string, string> = {
  TypeScript: "bg-blue-500",
  JavaScript: "bg-yellow-500",
  Python: "bg-green-500",
  Rust: "bg-orange-500",
  Go: "bg-cyan-500",
  Java: "bg-red-500",
  "C++": "bg-purple-500",
  HTML: "bg-orange-600",
  CSS: "bg-blue-400",
  default: "bg-gray-500",
};

export const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

export const item = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};
