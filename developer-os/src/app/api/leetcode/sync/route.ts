import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  isValidLeetCodeUsername,
  fetchLeetCodeDataWithFallback,
} from "@/lib/leetcode";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        {
          error:
            "LeetCode username is required. Please enter your LeetCode username to sync your progress.",
        },
        { status: 400 }
      );
    }

    // Validate username format
    if (!isValidLeetCodeUsername(username)) {
      return NextResponse.json(
        {
          error:
            "Invalid LeetCode username format. Username should be 1-30 characters (letters, numbers, hyphens, or underscores).",
        },
        { status: 400 }
      );
    }

    // Fetch data with fallback to mock data on failure
    const { user, stats, isFallback } = await fetchLeetCodeDataWithFallback(username);

    return NextResponse.json({
      success: true,
      isFallback,
      data: {
        user: {
          username: user.username,
          profile: user.profile,
        },
        stats,
      },
    });
  } catch (error) {
    console.error("Error fetching LeetCode data:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { error: `Failed to fetch LeetCode data: ${errorMessage}` },
      { status: 500 }
    );
  }
}
