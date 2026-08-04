import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  fetchLeetCodeGraphQL,
  USER_PROFILE_QUERY,
  isValidLeetCodeUsername,
  fetchLeetCodeDataWithFallback,
} from "@/lib/leetcode";

/**
 * Try to find a LeetCode user by email prefix (common username pattern)
 * LeetCode doesn't have a public API to search by email, so we try the email prefix
 */
async function findLeetCodeUserByEmail(
  email: string
): Promise<string | null> {
  // Extract username from email (before @)
  const emailPrefix = email.split("@")[0]?.toLowerCase();

  if (!emailPrefix || !isValidLeetCodeUsername(emailPrefix)) {
    return null;
  }

  try {
    // Try to fetch profile with email prefix as username
    const profileData = await fetchLeetCodeGraphQL(USER_PROFILE_QUERY, {
      username: emailPrefix,
    });
    const profile = profileData.data?.matchedUser;

    if (profile && profile.username) {
      return profile.username;
    }
  } catch {
    // Email prefix not found on LeetCode
  }

  return null;
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { username, email, autoLink } = body;

    // Auto-link mode: try to find LeetCode account by email
    if (autoLink && email) {
      const foundUsername = await findLeetCodeUserByEmail(email);

      if (!foundUsername) {
        return NextResponse.json(
          {
            error:
              "No LeetCode account found with this email. The email prefix doesn't match any LeetCode username.",
            suggestion: email.split("@")[0],
          },
          { status: 404 }
        );
      }

      // Found a matching account, proceed to link it
      return await linkLeetCodeAccount(session.user.id, foundUsername);
    }

    // Manual link mode: use provided username
    if (!username || typeof username !== "string") {
      return NextResponse.json(
        { error: "LeetCode username is required" },
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

    return await linkLeetCodeAccount(session.user.id, username);
  } catch (error) {
    console.error("Error linking LeetCode account:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to link LeetCode account";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

async function linkLeetCodeAccount(userId: string, username: string) {
  // Fetch data with fallback to mock data on failure
  const { user, stats, isFallback } = await fetchLeetCodeDataWithFallback(username);

  // Save to database if prisma is available
  if (prisma) {
    try {
      await prisma.profile.upsert({
        where: { userId },
        update: { leetcodeUsername: username },
        create: {
          userId,
          leetcodeUsername: username,
        },
      });
    } catch (dbError) {
      console.error("Error saving LeetCode username to database:", dbError);
      // Continue even if saving fails - data is still available via API
    }
  }

  return NextResponse.json({
    success: true,
    message: isFallback 
      ? "LeetCode account linked (using limited data - API may be unavailable)" 
      : "LeetCode account linked successfully",
    isFallback,
    data: {
      user: {
        username: user.username,
        profile: user.profile,
      },
      stats,
    },
  });
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (prisma) {
      try {
        await prisma.profile.upsert({
          where: { userId: session.user.id },
          update: { leetcodeUsername: null },
          create: {
            userId: session.user.id,
            leetcodeUsername: null,
          },
        });
      } catch (dbError) {
        console.error(
          "Error clearing LeetCode username from database:",
          dbError
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "LeetCode account unlinked successfully",
    });
  } catch (error) {
    console.error("Error unlinking LeetCode account:", error);
    return NextResponse.json(
      { error: "Failed to unlink LeetCode account" },
      { status: 500 }
    );
  }
}
