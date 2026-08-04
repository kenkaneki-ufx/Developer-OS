import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { findGitHubUserByEmail, linkGitHubAccountToUser } from "@/lib/github";

// Note: prisma is still used for LeetCode username storage below

interface SyncResult {
  github?: {
    success: boolean;
    username?: string;
    avatarUrl?: string;
    error?: string;
  };
  leetcode?: {
    success: boolean;
    username?: string;
    error?: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { email, leetcodeUsername } = body;

    const userEmail = email || session.user?.email;
    const result: SyncResult = {};

    // Try to sync GitHub from email
    if (userEmail) {
      try {
        const githubUser = await findGitHubUserByEmail(userEmail);
        
        if (githubUser) {
          // Auto-link GitHub account and update profile
          await linkGitHubAccountToUser(session.user.id, githubUser).catch((error) => {
            console.error("Error linking GitHub account:", error);
          });

          result.github = {
            success: true,
            username: githubUser.login,
            avatarUrl: githubUser.avatar_url,
          };
        } else {
          result.github = {
            success: false,
            error: "No GitHub account found with this email",
          };
        }
      } catch (error) {
        console.error("Error syncing GitHub:", error);
        result.github = {
          success: false,
          error: "Failed to check GitHub account",
        };
      }
    }

    // Try to sync LeetCode
    if (leetcodeUsername) {
      try {
        if (prisma) {
          await prisma.profile.upsert({
            where: { userId: session.user.id },
            update: { leetcodeUsername },
            create: {
              userId: session.user.id,
              leetcodeUsername,
            },
          });
        }

        result.leetcode = {
          success: true,
          username: leetcodeUsername,
        };
      } catch (error) {
        console.error("Error saving LeetCode username:", error);
        result.leetcode = {
          success: false,
          error: "Failed to save LeetCode username",
        };
      }
    } else {
      // Auto-suggest LeetCode username from email prefix
      const suggestedUsername = userEmail?.split("@")[0] || null;
      result.leetcode = {
        success: false,
        error: "LeetCode username required",
        username: suggestedUsername || undefined,
      };
    }

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error syncing accounts:", error);
    return NextResponse.json({ error: "Failed to sync accounts" }, { status: 500 });
  }
}
