import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { 
  findGitHubUserByEmail, 
  getGitHubUserPublic, 
  getGitHubReposPublic, 
  getContributionsPublic,
  calculateStreak 
} from "@/lib/github";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Search for GitHub user by email
    const githubUser = await findGitHubUserByEmail(email);

    if (!githubUser) {
      return NextResponse.json(
        { error: "No GitHub account found with this email. Make sure your email is public in your GitHub profile settings." },
        { status: 404 }
      );
    }

    // Save GitHub account to database if prisma is available
    if (prisma) {
      try {
        // Check if this GitHub account is already linked to any user
        const existingAccount = await prisma.account.findUnique({
          where: {
            provider_providerAccountId: {
              provider: "github",
              providerAccountId: githubUser.id.toString(),
            },
          },
        });

        if (existingAccount) {
          // Account already exists, check if it's linked to current user
          if (existingAccount.userId !== session.user.id) {
            return NextResponse.json(
              { error: "This GitHub account is already linked to another user" },
              { status: 400 }
            );
          }
        } else {
          // Link GitHub account to current user
          await prisma.account.create({
            data: {
              userId: session.user.id,
              type: "oauth",
              provider: "github",
              providerAccountId: githubUser.id.toString(),
              access_token: null,
              token_type: null,
              scope: null,
            },
          });
        }

        // Update GitHubData if it exists
        await prisma.gitHubData.upsert({
          where: { userId: session.user.id },
          update: {
            username: githubUser.login,
            lastSynced: new Date(),
          },
          create: {
            userId: session.user.id,
            username: githubUser.login,
          },
        });
      } catch (error) {
        console.error("Error saving GitHub account:", error);
        // Continue even if saving fails - data is still available via public API
      }
    }

    // Fetch GitHub data using public API
    const [user, repos, contributions] = await Promise.all([
      getGitHubUserPublic(githubUser.login).catch(() => null),
      getGitHubReposPublic(githubUser.login).catch(() => []),
      getContributionsPublic(githubUser.login).catch(() => []),
    ]);

    if (!user) {
      return NextResponse.json({
        success: true,
        message: "GitHub account linked successfully",
        githubUser: {
          login: githubUser.login,
          avatar_url: githubUser.avatar_url,
          name: githubUser.name,
        },
      });
    }

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

    return NextResponse.json({
      success: true,
      message: "GitHub account linked successfully",
      data: {
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
          pullRequests: 0,
          issues: 0,
        },
      },
    });
  } catch (error) {
    console.error("Error linking GitHub account:", error);
    return NextResponse.json({ error: "Failed to link GitHub account" }, { status: 500 });
  }
}
