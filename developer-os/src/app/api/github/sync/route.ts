import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { 
  getGitHubOverview, 
  findGitHubUserByEmail, 
  getGitHubUserPublic, 
  getGitHubReposPublic, 
  getContributionsPublic,
  calculateStreak,
  linkGitHubAccountToUser 
} from "@/lib/github";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch GitHub access token securely from database
    let accessToken: string | null = null;

    if (prisma) {
      try {
        const githubAccount = await prisma.account.findFirst({
          where: {
            userId: session.user.id,
            provider: "github",
          },
          select: {
            access_token: true,
          },
        });
        accessToken = githubAccount?.access_token ?? null;
      } catch (error) {
        console.error("Error fetching GitHub account from DB:", error);
        // Continue without access token - will use public API
      }
    }

    // If we have an access token, use authenticated API
    if (accessToken) {
      try {
        const githubData = await getGitHubOverview(accessToken);
        return NextResponse.json({
          success: true,
          data: githubData,
        });
      } catch (error) {
        console.error("Error fetching with access token:", error);
        // Fall through to try public API
      }
    }

    // No access token - try to find GitHub user by email and use public API
    if (session.user?.email) {
      try {
        const githubUser = await findGitHubUserByEmail(session.user.email);
        
        if (githubUser) {
          // Found GitHub user by email - fetch data using public API
          const [user, repos, contributions] = await Promise.all([
            getGitHubUserPublic(githubUser.login).catch(() => null),
            getGitHubReposPublic(githubUser.login).catch(() => []),
            getContributionsPublic(githubUser.login).catch(() => []),
          ]);

          if (user) {
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

            // Auto-link this GitHub account and update profile
            await linkGitHubAccountToUser(session.user.id, githubUser).catch((error) => {
              console.error("Error linking GitHub account:", error);
            });

            return NextResponse.json({
              success: true,
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
          }
        }
      } catch (error) {
        console.error("Error fetching GitHub by email:", error);
      }
    }

    // If we get here, no GitHub account found
    return NextResponse.json(
      { 
        error: "GitHub account not found. Please link your GitHub account using your email.",
        canLink: true,
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error syncing GitHub data:", error);
    return NextResponse.json({ error: "Failed to sync GitHub data" }, { status: 500 });
  }
}
