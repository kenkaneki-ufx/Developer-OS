import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  calculateStreak,
  getGitHubUser,
  getGitHubRepos,
  getContributions,
  findGitHubUserByEmail,
  getGitHubOverview,
  type GitHubContributionDay,
} from "./github";

// Mock Date for deterministic tests
const mockDate = new Date("2026-07-30T12:00:00Z");
beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(mockDate);
});

afterEach(() => {
  vi.useRealTimers();
});

// Mock fetch globally
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

// Helper to create mock contributions
function createMockContributions(
  days: number,
  commitCounts: Record<string, number> = {}
): GitHubContributionDay[] {
  const contributions: GitHubContributionDay[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
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
}

describe("calculateStreak", () => {
  it("should return 0 for empty contributions", () => {
    const contributions = createMockContributions(90);
    expect(calculateStreak(contributions)).toBe(0);
  });

  it("should return 0 for empty array", () => {
    expect(calculateStreak([])).toBe(0);
  });

  it("should return 0 when there are no recent contributions", () => {
    const contributions = createMockContributions(90);
    // All contributions have count 0
    expect(calculateStreak(contributions)).toBe(0);
  });

  it("should calculate streak when today has contributions", () => {
    const today = new Date().toISOString().split("T")[0];
    const contributions = createMockContributions(90, {
      [today]: 5,
      [getDateStr(-1)]: 3,
      [getDateStr(-2)]: 2,
      [getDateStr(-3)]: 1,
      [getDateStr(-4)]: 0, // Break the streak
    });

    expect(calculateStreak(contributions)).toBe(4);
  });

  it("should calculate streak starting from yesterday if today has no contributions", () => {
    const contributions = createMockContributions(90, {
      [getDateStr(-1)]: 3,
      [getDateStr(-2)]: 2,
      [getDateStr(-3)]: 1,
      [getDateStr(-4)]: 0, // Break the streak
    });

    expect(calculateStreak(contributions)).toBe(3);
  });

  it("should handle single day streak", () => {
    const today = new Date().toISOString().split("T")[0];
    const contributions = createMockContributions(90, {
      [today]: 1,
      [getDateStr(-1)]: 0,
    });

    expect(calculateStreak(contributions)).toBe(1);
  });

  it("should calculate long streak correctly", () => {
    const commitCounts: Record<string, number> = {};
    for (let i = 0; i < 30; i++) {
      commitCounts[getDateStr(-i)] = Math.floor(Math.random() * 5) + 1;
    }
    const contributions = createMockContributions(90, commitCounts);

    expect(calculateStreak(contributions)).toBe(30);
  });
});

describe("getGitHubUser", () => {
  const mockUser = {
    login: "testuser",
    id: 12345,
    avatar_url: "https://avatars.githubusercontent.com/u/12345",
    name: "Test User",
    email: "test@example.com",
    bio: "Test bio",
    public_repos: 10,
    followers: 100,
    following: 50,
    created_at: "2020-01-01T00:00:00Z",
  };

  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("should fetch user profile with correct headers", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUser,
    });

    const result = await getGitHubUser("test-token");

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.github.com/user",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer test-token",
          Accept: "application/vnd.github.v3+json",
        }),
      })
    );
    expect(result).toEqual(mockUser);
  });

  it("should throw error when API response is not ok", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: "Unauthorized",
    });

    await expect(getGitHubUser("invalid-token")).rejects.toThrow(
      "GitHub API error: 401 Unauthorized"
    );
  });
});

describe("getGitHubRepos", () => {
  const mockRepos = [
    {
      id: 1,
      name: "repo-1",
      full_name: "user/repo-1",
      description: "First repo",
      html_url: "https://github.com/user/repo-1",
      language: "TypeScript",
      stargazers_count: 10,
      forks_count: 5,
      private: false,
      topics: ["typescript"],
      updated_at: "2024-01-01T00:00:00Z",
      pushed_at: "2024-01-01T00:00:00Z",
    },
  ];

  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("should fetch repos with default parameters", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockRepos,
    });

    const result = await getGitHubRepos("test-token");

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/user/repos?sort=pushed&direction=desc&per_page=100"),
      expect.any(Object)
    );
    expect(result).toEqual(mockRepos);
  });

  it("should fetch repos with custom perPage parameter", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockRepos,
    });

    await getGitHubRepos("test-token", 50);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("per_page=50"),
      expect.any(Object)
    );
  });

  it("should throw error when API fails", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    });

    await expect(getGitHubRepos("test-token")).rejects.toThrow(
      "GitHub API error: 500 Internal Server Error"
    );
  });
});

describe("getContributions", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("should return 90 days of contributions", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    const result = await getContributions("test-token");

    expect(result).toHaveLength(90);
  });

  it("should parse push events correctly", async () => {
    const today = new Date().toISOString().split("T")[0];
    const mockEvents = [
      {
        type: "PushEvent",
        created_at: `${today}T12:00:00Z`,
        payload: {
          commits: [{ message: "commit 1" }, { message: "commit 2" }],
        },
      },
      {
        type: "PushEvent",
        created_at: `${today}T14:00:00Z`,
        payload: {
          commits: [{ message: "commit 3" }],
        },
      },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockEvents,
    });

    const result = await getContributions("test-token");

    const todayContrib = result.find((c) => c.date === today);
    expect(todayContrib?.count).toBe(3); // 2 + 1 commits
    expect(todayContrib?.level).toBe(2); // 3+ commits = level 2
  });

  it("should handle events without commits array", async () => {
    const today = new Date().toISOString().split("T")[0];
    const mockEvents = [
      {
        type: "PushEvent",
        created_at: `${today}T12:00:00Z`,
        payload: {},
      },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockEvents,
    });

    const result = await getContributions("test-token");

    const todayContrib = result.find((c) => c.date === today);
    expect(todayContrib?.count).toBe(1); // Default to 1 when no commits array
  });

  it("should set correct contribution levels", async () => {
    const today = new Date().toISOString().split("T")[0];
    const mockEvents = Array.from({ length: 12 }, (_, i) => ({
      type: "PushEvent",
      created_at: `${today}T${i.toString().padStart(2, "0")}:00:00Z`,
      payload: { commits: [{ message: `commit ${i}` }] },
    }));

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockEvents,
    });

    const result = await getContributions("test-token");

    const todayContrib = result.find((c) => c.date === today);
    expect(todayContrib?.count).toBe(12);
    expect(todayContrib?.level).toBe(4); // 10+ commits = level 4
  });

  it("should return empty contributions on API failure", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const result = await getContributions("test-token");

    expect(result).toHaveLength(90);
    expect(result.every((c) => c.count === 0)).toBe(true);
  });

  it("should classify contribution levels correctly", () => {
    const testCases = [
      { count: 0, expectedLevel: 0 },
      { count: 1, expectedLevel: 1 },
      { count: 2, expectedLevel: 1 },
      { count: 3, expectedLevel: 2 },
      { count: 5, expectedLevel: 2 },
      { count: 6, expectedLevel: 3 },
      { count: 9, expectedLevel: 3 },
      { count: 10, expectedLevel: 4 },
      { count: 15, expectedLevel: 4 },
    ];

    // Test level classification logic
    for (const { count, expectedLevel } of testCases) {
      let level: 0 | 1 | 2 | 3 | 4 = 0;
      if (count > 0) level = 1;
      if (count >= 3) level = 2;
      if (count >= 6) level = 3;
      if (count >= 10) level = 4;
      expect(level).toBe(expectedLevel);
    }
  });
});

describe("findGitHubUserByEmail", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("should find user by email", async () => {
    const mockSearchResult = {
      items: [{ login: "testuser" }],
    };
    const mockUser = {
      login: "testuser",
      id: 12345,
      avatar_url: "https://avatars.githubusercontent.com/u/12345",
      name: "Test User",
      email: "test@example.com",
      bio: "Test bio",
      public_repos: 10,
      followers: 100,
      following: 50,
      created_at: "2020-01-01T00:00:00Z",
    };

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockSearchResult,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      });

    const result = await findGitHubUserByEmail("test@example.com");

    expect(result).toEqual(mockUser);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it("should return null when no user found", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ items: [] }),
    });

    const result = await findGitHubUserByEmail("nonexistent@example.com");

    expect(result).toBeNull();
  });

  it("should return null on API failure", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const result = await findGitHubUserByEmail("test@example.com");

    expect(result).toBeNull();
  });

  it("should return null when search API returns not ok", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 403,
      statusText: "Rate Limited",
    });

    const result = await findGitHubUserByEmail("test@example.com");

    expect(result).toBeNull();
  });
});

describe("getGitHubOverview", () => {
  const mockUser = {
    login: "testuser",
    id: 12345,
    avatar_url: "https://avatars.githubusercontent.com/u/12345",
    name: "Test User",
    email: "test@example.com",
    bio: "Test bio",
    public_repos: 10,
    followers: 100,
    following: 50,
    created_at: "2020-01-01T00:00:00Z",
  };

  const mockRepos = [
    {
      id: 1,
      name: "repo-1",
      full_name: "user/repo-1",
      description: "First repo",
      html_url: "https://github.com/user/repo-1",
      language: "TypeScript",
      stargazers_count: 10,
      forks_count: 5,
      private: false,
      topics: [],
      updated_at: "2024-01-01T00:00:00Z",
      pushed_at: "2024-01-01T00:00:00Z",
    },
  ];

  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("should return complete overview with all data", async () => {
    const today = new Date().toISOString().split("T")[0];
    const mockEvents = [
      {
        type: "PushEvent",
        created_at: `${today}T12:00:00Z`,
        payload: { commits: [{ message: "commit" }] },
      },
    ];

    mockFetch
      .mockResolvedValueOnce({ ok: true, json: async () => mockUser })
      .mockResolvedValueOnce({ ok: true, json: async () => mockRepos })
      .mockResolvedValueOnce({ ok: true, json: async () => mockEvents });

    const result = await getGitHubOverview("test-token");

    expect(result.user).toEqual(mockUser);
    expect(result.repos).toEqual(mockRepos);
    expect(result.contributions).toHaveLength(90);
    expect(result.stats).toBeDefined();
    expect(result.stats.repositories).toBe(1);
    expect(result.stats.todayCommits).toBe(1);
  });

  it("should handle partial failures gracefully", async () => {
    mockFetch
      .mockRejectedValueOnce(new Error("User API failed"))
      .mockResolvedValueOnce({ ok: true, json: async () => mockRepos })
      .mockResolvedValueOnce({ ok: true, json: async () => [] });

    const result = await getGitHubOverview("test-token");

    expect(result.user).toBeNull();
    expect(result.repos).toEqual(mockRepos);
    expect(result.contributions).toHaveLength(90);
  });

  it("should calculate correct stats", async () => {
    const today = new Date().toISOString().split("T")[0];
    const mockEvents = [
      {
        type: "PushEvent",
        created_at: `${today}T12:00:00Z`,
        payload: { commits: [{ message: "commit 1" }, { message: "commit 2" }] },
      },
    ];

    mockFetch
      .mockResolvedValueOnce({ ok: true, json: async () => mockUser })
      .mockResolvedValueOnce({ ok: true, json: async () => [] })
      .mockResolvedValueOnce({ ok: true, json: async () => mockEvents });

    const result = await getGitHubOverview("test-token");

    expect(result.stats.todayCommits).toBe(2);
    expect(result.stats.totalCommits).toBeGreaterThanOrEqual(2);
  });
});

// Helper function to get date string relative to today
function getDateStr(daysOffset: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split("T")[0];
}
