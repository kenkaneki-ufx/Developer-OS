/**
 * Shared LeetCode utilities for API routes.
 * Avoids code duplication between link and sync endpoints.
 */

export const LEETCODE_GRAPHQL_URL = "https://leetcode.com/graphql";

// Query to get user profile
export const USER_PROFILE_QUERY = `
  query userProfile($username: String!) {
    matchedUser(username: $username) {
      username
      profile {
        realName
        userAvatar
        reputation
        ranking
      }
      submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
          submissions
        }
      }
    }
  }
`;

// Query to get problem solving stats
export const PROBLEM_STATS_QUERY = `
  query userProblems($username: String!) {
    allQuestionsCount {
      difficulty
      count
    }
    matchedUser(username: $username) {
      problemsSolvedBeatsStats {
        difficulty
        percentage
      }
      submitStats {
        acSubmissionNum {
          difficulty
          count
        }
      }
    }
  }
`;

// Query to get recent submissions
export const RECENT_SUBMISSIONS_QUERY = `
  query recentSubmissions($username: String!, $limit: Int!) {
    recentAcSubmissionList(username: $username, limit: $limit) {
      id
      title
      titleSlug
      timestamp
    }
  }
`;

/**
 * Fetch data from LeetCode's GraphQL API with retry logic.
 */
export async function fetchLeetCodeGraphQL(
  query: string,
  variables: Record<string, string | number>,
  retries = 2
): Promise<Record<string, unknown>> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(LEETCODE_GRAPHQL_URL, {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          "Referer": "https://leetcode.com/",
          "Origin": "https://leetcode.com",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
          "Accept": "*/*",
          "Accept-Language": "en-US,en;q=0.9",
          "sec-ch-ua": '"Chromium";v="125", "Not.A/Brand";v="24", "Google Chrome";v="125"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
        },
        body: JSON.stringify({ query, variables }),
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        // Rate limited - retry after delay
        if (response.status === 429 && attempt < retries) {
          await new Promise((r) => setTimeout(r, (attempt + 1) * 3000));
          continue;
        }

        // Try to get error details from response body
        let errorBody = "";
        try {
          errorBody = await response.text();
        } catch {
          // Ignore error reading body
        }

        throw new Error(`LeetCode API returned ${response.status}${errorBody ? `: ${errorBody.substring(0, 200)}` : ""}`);
      }

      const data = await response.json();

      if (data.errors && data.errors.length > 0) {
        throw new Error(data.errors[0].message || "GraphQL query failed");
      }

      return data;
    } catch (error) {
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 2000 * (attempt + 1)));
        continue;
      }
      throw error instanceof Error
        ? error
        : new Error("Failed to connect to LeetCode API");
    }
  }
}

export interface LeetCodeUser {
  username: string;
  profile: {
    realName: string | null;
    userAvatar: string | null;
    reputation: number | null;
    ranking: number | null;
  };
  submitStatsGlobal: {
    acSubmissionNum: Array<{
      difficulty: string;
      count: number;
      submissions: number;
    }>;
  };
}

export interface LeetCodeStats {
  totalSolved: number;
  totalQuestions: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  easyTotal: number;
  mediumTotal: number;
  hardTotal: number;
  easyPercentage: number;
  mediumPercentage: number;
  hardPercentage: number;
  ranking: number;
  streak: number;
  recentSubmissions: Array<{
    id: string;
    title: string;
    titleSlug: string;
    timestamp: string;
  }>;
}

/**
 * Process raw LeetCode data into a structured format.
 */
export interface LeetCodeStatsData {
  allQuestionsCount?: Array<{ difficulty: string; count: number }>;
  matchedUser?: {
    problemsSolvedBeatsStats?: Array<{ difficulty: string; percentage: number }>;
  };
}

export interface LeetCodeSubmission {
  id: string;
  title: string;
  titleSlug: string;
  timestamp: string;
}

export function processLeetCodeData(
  profile: LeetCodeUser,
  statsData: LeetCodeStatsData | null | undefined,
  recentSubmissions: LeetCodeSubmission[] = []
): LeetCodeStats {
  const acSubmission = profile.submitStatsGlobal?.acSubmissionNum || [];
  const allQuestions = statsData?.allQuestionsCount || [];
  const stats = statsData?.matchedUser || null;

  const easyStats = allQuestions.find((q) => q.difficulty === "Easy");
  const mediumStats = allQuestions.find((q) => q.difficulty === "Medium");
  const hardStats = allQuestions.find((q) => q.difficulty === "Hard");

  return {
    totalSolved:
      acSubmission.find((s) => s.difficulty === "All")?.count || 0,
    totalQuestions: allQuestions.reduce(
      (sum, q) => sum + q.count,
      0
    ),
    easySolved:
      acSubmission.find((s) => s.difficulty === "Easy")?.count || 0,
    mediumSolved:
      acSubmission.find((s) => s.difficulty === "Medium")?.count || 0,
    hardSolved:
      acSubmission.find((s) => s.difficulty === "Hard")?.count || 0,
    easyTotal: easyStats?.count || 0,
    mediumTotal: mediumStats?.count || 0,
    hardTotal: hardStats?.count || 0,
    easyPercentage:
      stats?.problemsSolvedBeatsStats?.find(
        (s) => s.difficulty === "Easy"
      )?.percentage || 0,
    mediumPercentage:
      stats?.problemsSolvedBeatsStats?.find(
        (s) => s.difficulty === "Medium"
      )?.percentage || 0,
    hardPercentage:
      stats?.problemsSolvedBeatsStats?.find(
        (s) => s.difficulty === "Hard"
      )?.percentage || 0,
    ranking: 0,
    streak: 0,
    recentSubmissions: recentSubmissions.map((s) => ({
      id: s.id,
      title: s.title,
      titleSlug: s.titleSlug,
      timestamp: new Date(parseInt(s.timestamp) * 1000).toISOString(),
    })),
  };
}

/**
 * Validate LeetCode username format.
 */
export function isValidLeetCodeUsername(username: string): boolean {
  return /^[a-zA-Z0-9_-]{1,30}$/.test(username);
}

/**
 * Fallback mock data when LeetCode API fails.
 * Returns a valid LeetCodeUser object with placeholder data.
 */
export function getFallbackLeetCodeUser(username: string): LeetCodeUser {
  return {
    username,
    profile: {
      realName: null,
      userAvatar: null,
      reputation: 0,
      ranking: 0,
    },
    submitStatsGlobal: {
      acSubmissionNum: [
        { difficulty: "All", count: 0, submissions: 0 },
        { difficulty: "Easy", count: 0, submissions: 0 },
        { difficulty: "Medium", count: 0, submissions: 0 },
        { difficulty: "Hard", count: 0, submissions: 0 },
      ],
    },
  };
}

/**
 * Fallback mock stats data when LeetCode API fails.
 */
export function getFallbackLeetCodeStats(): LeetCodeStats {
  return {
    totalSolved: 0,
    totalQuestions: 3000,
    easySolved: 0,
    mediumSolved: 0,
    hardSolved: 0,
    easyTotal: 800,
    mediumTotal: 1600,
    hardTotal: 600,
    easyPercentage: 0,
    mediumPercentage: 0,
    hardPercentage: 0,
    ranking: 0,
    streak: 0,
    recentSubmissions: [],
  };
}

/**
 * Try to fetch LeetCode data with fallback to mock data on failure.
 */
export async function fetchLeetCodeDataWithFallback(
  username: string
): Promise<{ user: LeetCodeUser; stats: LeetCodeStats; isFallback: boolean }> {
  try {
    // Try to fetch real data
    const [profileData, statsData, submissionsData] = await Promise.all([
      fetchLeetCodeGraphQL(USER_PROFILE_QUERY, { username }),
      fetchLeetCodeGraphQL(PROBLEM_STATS_QUERY, { username }).catch(() => null),
      fetchLeetCodeGraphQL(RECENT_SUBMISSIONS_QUERY, { username, limit: 10 }).catch(() => null),
    ]);

    const profile = profileData.data?.matchedUser as LeetCodeUser | null;

    if (!profile) {
      // User not found, return fallback
      return {
        user: getFallbackLeetCodeUser(username),
        stats: getFallbackLeetCodeStats(),
        isFallback: true,
      };
    }

    const stats = processLeetCodeData(profile, statsData?.data, submissionsData?.data?.recentAcSubmissionList || []);

    return {
      user: profile,
      stats,
      isFallback: false,
    };
  } catch (error) {
    // API failed, return fallback with mock stats
    console.error(`Failed to fetch LeetCode data for ${username}, using fallback:`, error);
    return {
      user: getFallbackLeetCodeUser(username),
      stats: getFallbackLeetCodeStats(),
      isFallback: true,
    };
  }
}
