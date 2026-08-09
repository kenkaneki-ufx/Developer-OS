import { NextResponse } from "next/server";
import {
  fetchLeetCodeGraphQL,
  USER_PROFILE_QUERY,
  PROBLEM_STATS_QUERY,
  RECENT_SUBMISSIONS_QUERY,
  LEETCODE_GRAPHQL_URL,
} from "@/lib/leetcode";

interface DiagnosticResult {
  timestamp: string;
  endpoint: string;
  tests: {
    name: string;
    status: "pass" | "fail" | "skip";
    duration: number;
    error?: string;
    details?: any;
  }[];
  summary: {
    totalTests: number;
    passed: number;
    failed: number;
    skipped: number;
  };
}

export async function GET() {
  const startTime = Date.now();
  const result: DiagnosticResult = {
    timestamp: new Date().toISOString(),
    endpoint: LEETCODE_GRAPHQL_URL,
    tests: [],
    summary: {
      totalTests: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
    },
  };

  // Test 1: Basic connectivity to LeetCode GraphQL endpoint
  const test1Start = Date.now();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    let response: Response;
    try {
      response = await fetch(LEETCODE_GRAPHQL_URL, {
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
        body: JSON.stringify({
          query: `query { matchedUser(username: "leetcode") { username } }`,
        }),
      });
    } finally {
      clearTimeout(timeoutId);
    }

    const duration = Date.now() - test1Start;
    const responseBody = await response.text().catch(() => "");
    const isRateLimited = response.status === 429;
    let bodyJson = null;
    try {
      bodyJson = responseBody ? JSON.parse(responseBody) : null;
    } catch {
      // JSON parse failed
    }

    // Extract rate limit headers if available
    const rateLimitHeaders: Record<string, string> = {};
    const retryAfter = response.headers.get("retry-after");
    const xRateLimitRemaining = response.headers.get("x-ratelimit-remaining");
    const xRateLimitReset = response.headers.get("x-ratelimit-reset");
    if (retryAfter) rateLimitHeaders["retry-after"] = retryAfter;
    if (xRateLimitRemaining) rateLimitHeaders["x-ratelimit-remaining"] = xRateLimitRemaining;
    if (xRateLimitReset) rateLimitHeaders["x-ratelimit-reset"] = xRateLimitReset;

    result.tests.push({
      name: "Basic Connectivity",
      status: response.ok ? "pass" : "fail",
      duration,
      error: response.ok 
        ? undefined 
        : isRateLimited 
          ? "Rate limited by LeetCode API (HTTP 429)" 
          : `HTTP ${response.status}: ${response.statusText}`,
      details: {
        statusCode: response.status,
        statusText: response.statusText,
        isRateLimited,
        rateLimitHeaders: Object.keys(rateLimitHeaders).length > 0 ? rateLimitHeaders : undefined,
        headers: Object.fromEntries(response.headers.entries()),
        bodyPreview: responseBody.substring(0, 500),
        parsedBody: bodyJson,
      },
    });
  } catch (error) {
    const duration = Date.now() - test1Start;
    result.tests.push({
      name: "Basic Connectivity",
      status: "fail",
      duration,
      error: error instanceof Error ? error.message : "Unknown error",
      details: {
        type: error instanceof Error ? error.constructor.name : typeof error,
      },
    });
  }

  // Test 2: User Profile Query (with a known public user)
  const test2Start = Date.now();
  try {
    const profileData = await fetchLeetCodeGraphQL(USER_PROFILE_QUERY, {
      username: "leetcode", // LeetCode's official account - always exists
    });

    const duration = Date.now() - test2Start;
    const profileResult = (profileData.data as Record<string, unknown>)?.matchedUser as Record<string, unknown> | undefined;
    const hasProfile = !!profileResult;

    result.tests.push({
      name: "User Profile Query",
      status: hasProfile ? "pass" : "fail",
      duration,
      error: hasProfile ? undefined : "Query returned no user data",
      details: {
        queryName: "userProfile",
        hasData: !!profileData?.data,
        hasUser: hasProfile,
        username: profileResult?.username,
      },
    });
  } catch (error) {
    const duration = Date.now() - test2Start;
    result.tests.push({
      name: "User Profile Query",
      status: "fail",
      duration,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }

  // Test 3: Problem Stats Query
  const test3Start = Date.now();
  try {
    const statsData = await fetchLeetCodeGraphQL(PROBLEM_STATS_QUERY, {
      username: "leetcode",
    });

    const duration = Date.now() - test3Start;
    const allQuestions = (statsData.data as Record<string, unknown>)?.allQuestionsCount as Array<{ difficulty: string; count: number }> | undefined;
    const hasStats = !!allQuestions;

    result.tests.push({
      name: "Problem Stats Query",
      status: hasStats ? "pass" : "fail",
      duration,
      error: hasStats ? undefined : "Query returned no stats data",
      details: {
        queryName: "userProblems",
        hasAllQuestions: !!allQuestions,
        totalQuestions: allQuestions?.reduce(
          (sum: number, q: { count: number }) => sum + (q.count || 0),
          0
        ),
      },
    });
  } catch (error) {
    const duration = Date.now() - test3Start;
    result.tests.push({
      name: "Problem Stats Query",
      status: "fail",
      duration,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }

  // Test 4: Recent Submissions Query
  const test4Start = Date.now();
  try {
    const submissionsData = await fetchLeetCodeGraphQL(RECENT_SUBMISSIONS_QUERY, {
      username: "leetcode",
      limit: 5,
    });

    const duration = Date.now() - test4Start;
    const recentSubs = (submissionsData.data as Record<string, unknown>)?.recentAcSubmissionList as Array<unknown> | undefined;
    const hasSubmissions = Array.isArray(recentSubs);

    result.tests.push({
      name: "Recent Submissions Query",
      status: hasSubmissions ? "pass" : "fail",
      duration,
      error: hasSubmissions ? undefined : "Query returned no submissions data",
      details: {
        queryName: "recentSubmissions",
        submissionCount: recentSubs?.length || 0,
      },
    });
  } catch (error) {
    const duration = Date.now() - test4Start;
    result.tests.push({
      name: "Recent Submissions Query",
      status: "fail",
      duration,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }

  // Calculate summary
  result.summary.totalTests = result.tests.length;
  result.summary.passed = result.tests.filter((t) => t.status === "pass").length;
  result.summary.failed = result.tests.filter((t) => t.status === "fail").length;
  result.summary.skipped = result.tests.filter((t) => t.status === "skip").length;

  const totalDuration = Date.now() - startTime;

  return NextResponse.json({
    success: result.summary.failed === 0,
    duration: totalDuration,
    ...result,
  });
}
