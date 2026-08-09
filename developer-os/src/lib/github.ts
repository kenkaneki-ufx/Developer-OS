import { prisma } from "@/lib/prisma";

/**
 * GitHub API Service
 * Fetches user data from GitHub using access tokens
 */

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

interface GitHubErrorResponse {
  code?: string;
  message?: string;
}

interface GitHubEvent {
  type: string;
  created_at: string;
  payload?: {
    commits?: Array<{ message: string }>;
  };
}

const GITHUB_API_BASE = "https://api.github.com";

/**
 * Link a GitHub account to a user and update profile/GitHubData records.
 * Uses atomic operations to prevent race conditions.
 * This is a shared helper used by multiple sync routes and auth callbacks.
 */
export async function linkGitHubAccountToUser(
  userId: string,
  githubUser: GitHubUser
): Promise<{ linked: boolean; error?: string }> {
  if (!prisma) {
    return { linked: false, error: "Database not configured" };
  }

  try {
    // Check if GitHub account already linked to any user
    const existingAccount = await prisma.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider: "github",
          providerAccountId: githubUser.id.toString(),
        },
      },
      select: { userId: true },
    });

    // If already linked to a different user, don't create duplicate
    if (existingAccount && existingAccount.userId !== userId) {
      return { linked: false, error: "GitHub account already linked to another user" };
    }

    // Only create if not already linked to this user
    if (!existingAccount) {
      // Use create with try-catch to handle race conditions
      try {
        await prisma.account.create({
          data: {
            userId,
            type: "oauth",
            provider: "github",
            providerAccountId: githubUser.id.toString(),
            access_token: null,
            token_type: null,
            scope: null,
          },
        });
      } catch (error: unknown) {
        // P2002 is Prisma's unique constraint violation error
        const prismaError = error as GitHubErrorResponse;
        if (prismaError?.code === "P2002") {
          // Account was created by another request - that's fine
        } else {
          throw error;
        }
      }
    }

    // Update profile with GitHub username (atomic upsert)
    await prisma.profile.upsert({
      where: { userId },
      update: { github: githubUser.login },
      create: {
        userId,
        github: githubUser.login,
      },
    });

    // Update GitHubData record (atomic upsert)
    await prisma.gitHubData.upsert({
      where: { userId },
      update: {
        username: githubUser.login,
        lastSynced: new Date(),
      },
      create: {
        userId,
        username: githubUser.login,
      },
    });

    return { linked: true };
  } catch (error) {
    console.error("Error linking GitHub account to user:", error);
    return { linked: false, error: "Failed to link GitHub account" };
  }
}

async function fetchGitHub<T>(
  endpoint: string,
  accessToken?: string
): Promise<T> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${GITHUB_API_BASE}${endpoint}`, {
    headers,
    next: { revalidate: 300 }, // Cache for 5 minutes
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get current user profile
 */
export async function getGitHubUser(accessToken: string): Promise<GitHubUser> {
  return fetchGitHub<GitHubUser>("/user", accessToken);
}

/**
 * Get user repositories
 */
export async function getGitHubRepos(
  accessToken: string,
  perPage = 100
): Promise<GitHubRepo[]> {
  return fetchGitHub<GitHubRepo[]>(
    `/user/repos?sort=pushed&direction=desc&per_page=${perPage}`,
    accessToken
  );
}

/**
 * Get contribution data (parsed from events)
 */
export async function getContributions(
  accessToken: string
): Promise<GitHubContributionDay[]> {
  try {
    const events = await fetchGitHub<GitHubEvent[]>("/user/events?per_page=100", accessToken);
    
    // Count commits per day
    const commitCounts: Record<string, number> = {};
    
    for (const event of events) {
      if (event.type === "PushEvent" && event.created_at) {
        const date = event.created_at.split("T")[0];
        commitCounts[date] = (commitCounts[date] || 0) + (event.payload?.commits?.length || 1);
      }
    }

    // Generate last 90 days of contribution data
    const contributions: GitHubContributionDay[] = [];
    const today = new Date();
    
    for (let i = 89; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const count = commitCounts[dateStr] || 0;
      
      let level: 0 | 1 | 2 | 3 | 4 = 0;
      if (count > 0) level = 1;
      if (count >= 3) level = 2;
      if (count >= 6) level = 3;
      if (count >= 10) level = 4;
      
      contributions.push({ date: dateStr, count, level });
    }

    return contributions;
  } catch {
    // Return empty contributions if API fails
    return Array.from({ length: 90 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (89 - i));
      return {
        date: date.toISOString().split("T")[0],
        count: 0,
        level: 0 as 0 | 1 | 2 | 3 | 4,
      };
    });
  }
}

/**
 * Find GitHub user by email (public API)
 */
export async function findGitHubUserByEmail(
  email: string
): Promise<GitHubUser | null> {
  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/search/users?q=${encodeURIComponent(email)}+in:email`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    if (!response.ok) return null;

    const data = await response.json();
    if (data.items && data.items.length > 0) {
      return fetchGitHub<GitHubUser>(`/users/${data.items[0].login}`);
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Get user profile using public API (no access token required)
 */
export async function getGitHubUserPublic(username: string): Promise<GitHubUser> {
  return fetchGitHub<GitHubUser>(`/users/${username}`);
}

/**
 * Get user repositories using public API (no access token required)
 */
export async function getGitHubReposPublic(
  username: string,
  perPage = 100
): Promise<GitHubRepo[]> {
  return fetchGitHub<GitHubRepo[]>(
    `/users/${username}/repos?sort=pushed&direction=desc&per_page=${perPage}`
  );
}

/**
 * Get contribution data using public API (parsed from events)
 */
export async function getContributionsPublic(
  username: string
): Promise<GitHubContributionDay[]> {
  try {
    const events = await fetchGitHub<GitHubEvent[]>(`/users/${username}/events?per_page=100`);
    
    // Count commits per day
    const commitCounts: Record<string, number> = {};
    
    for (const event of events) {
      if (event.type === "PushEvent" && event.created_at) {
        const date = event.created_at.split("T")[0];
        commitCounts[date] = (commitCounts[date] || 0) + (event.payload?.commits?.length || 1);
      }
    }

    // Generate last 90 days of contribution data
    const contributions: GitHubContributionDay[] = [];
    const today = new Date();
    
    for (let i = 89; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const count = commitCounts[dateStr] || 0;
      
      let level: 0 | 1 | 2 | 3 | 4 = 0;
      if (count > 0) level = 1;
      if (count >= 3) level = 2;
      if (count >= 6) level = 3;
      if (count >= 10) level = 4;
      
      contributions.push({ date: dateStr, count, level });
    }

    return contributions;
  } catch {
    // Return empty contributions if API fails
    return Array.from({ length: 90 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (89 - i));
      return {
        date: date.toISOString().split("T")[0],
        count: 0,
        level: 0 as 0 | 1 | 2 | 3 | 4,
      };
    });
  }
}

/**
 * Calculate streak from contribution data
 */
export function calculateStreak(contributions: GitHubContributionDay[]): number {
  if (contributions.length === 0) return 0;

  // Sort contributions by date ascending to ensure proper ordering
  const sorted = [...contributions].sort((a, b) => a.date.localeCompare(b.date));
  
  // Count consecutive days backwards from the most recent day with contributions
  // Skip any trailing zeros (days with no contributions) before finding the streak
  let streak = 0;
  let foundStreak = false;
  
  for (let i = sorted.length - 1; i >= 0; i--) {
    if (sorted[i].count > 0) {
      streak++;
      foundStreak = true;
    } else if (foundStreak) {
      // Found contributions before and now hit a zero - streak is broken
      break;
    }
    // If we haven't found contributions yet, skip this day
  }

  return streak;
}

/**
 * Get comprehensive GitHub overview
 */
export async function getGitHubOverview(accessToken: string) {
  const [user, repos, contributions] = await Promise.all([
    getGitHubUser(accessToken).catch(() => null),
    getGitHubRepos(accessToken).catch(() => []),
    getContributions(accessToken).catch(() => []),
  ]);

  const streak = calculateStreak(contributions);
  
  // Calculate commit stats from contributions
  const today = new Date().toISOString().split("T")[0];
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  
  const todayCommits = contributions.find(c => c.date === today)?.count || 0;
  const weekCommits = contributions
    .filter(c => c.date >= weekAgo)
    .reduce((sum, c) => sum + c.count, 0);
  const monthCommits = contributions
    .filter(c => c.date >= monthAgo)
    .reduce((sum, c) => sum + c.count, 0);
  const totalCommits = contributions.reduce((sum, c) => sum + c.count, 0);

  return {
    user,
    repos,
    contributions,
    stats: {
      streak,
      todayCommits,
      weekCommits,
      monthCommits,
      totalCommits,
      repositories: repos.length,
      pullRequests: 0, // Would need separate API call
      issues: 0, // Would need separate API call
    },
  };
}