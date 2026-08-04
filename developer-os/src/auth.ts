import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { findGitHubUserByEmail } from "@/lib/github";

// Build providers array, only including OAuth providers if credentials are configured
const providers = [];

// Only add GitHub if credentials are configured
if (process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET) {
  providers.push(
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
      authorization: {
        params: {
          scope: "read:user user:email repo",
        },
      },
    })
  );
}

// Only add Google if credentials are configured
if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  providers.push(
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    })
  );
}

// Always add credentials provider for demo mode
providers.push(
  Credentials({
    name: "Demo Account",
    credentials: {
      email: { label: "Email", type: "email", placeholder: "demo@developeros.com" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const email = credentials?.email as string | undefined;
      const password = credentials?.password as string | undefined;
      if (email && password) {
        return {
          id: "demo-user-1",
          name: email.split("@")[0],
          email,
          image: null,
        };
      }
      return null;
    },
  })
);

// Don't use PrismaAdapter - we use JWT sessions and handle account linking manually
// This prevents Configuration errors when the database is unreachable
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers,
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      const isOnAuth = nextUrl.pathname.startsWith("/auth");

      if (isOnDashboard && !isLoggedIn) {
        return Response.redirect(
          new URL(`/auth/login?callbackUrl=${nextUrl.pathname}`, nextUrl)
        );
      }

      if (isOnAuth && isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }

      return true;
    },
    async signIn({ user, account }) {
      if (!account || !user) return false;

      // For credentials (demo mode), always allow
      if (account.provider === "credentials") return true;

      // For OAuth providers, try to link accounts with same email
      if (account.provider !== "github" && account.provider !== "google") return true;

      // Auto-link accounts with same email across providers
      if (user.id && user.email) {
        try {
          const { linkGitHubAccountToUser } = await import("@/lib/github");

          if (account.provider === "google") {
            // Signing in with Google - find and link GitHub account with same email
            const githubUser = await findGitHubUserByEmail(user.email);
            if (githubUser) {
              await linkGitHubAccountToUser(user.id, githubUser);
            }
          } else if (account.provider === "github" && prisma) {
            // Signing in with GitHub - note: cross-provider account merging is complex
            // and risky. Instead, we just ensure the GitHub account is properly linked.
            // The user can sign in with Google separately if they want both linked.
          }
        } catch (error) {
          console.error("Error auto-linking accounts:", error);
          // Continue sign-in even if linking fails
        }
      }

      // Always allow OAuth sign-in - we use JWT sessions
      // Auto-sync Google profile data (name, image) to existing user record by email match
      if (account.provider === "google" && user.email && prisma) {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
            select: { id: true, name: true, image: true },
          });
          if (existingUser) {
            await prisma.user.update({
              where: { id: existingUser.id },
              data: {
                ...(user.name && { name: user.name }),
                ...(user.image && { image: user.image }),
              },
            });
          }
        } catch (error) {
          console.error("Error syncing Google profile data:", error);
        }
      }
      return true;
    },
    async jwt({ token, user, account, trigger }) {
      if (user) {
        token.id = user.id;
      }

      // Track the login provider on sign-in
      if (trigger === "signIn" && account) {
        token.loginProvider = account.provider;
      }

      // If signing in with GitHub, fetch and store the actual username
      if (trigger === "signIn" && account?.provider === "github" && account.access_token) {
        try {
          const response = await fetch("https://api.github.com/user", {
            headers: {
              Authorization: `Bearer ${account.access_token}`,
              Accept: "application/vnd.github.v3+json",
            },
          });
          if (response.ok) {
            const githubUser = await response.json();
            token.githubUsername = githubUser.login;
          } else {
            // Fallback to providerAccountId if API call fails
            token.githubUsername = account.providerAccountId;
          }
        } catch (error) {
          console.error("Error fetching GitHub username:", error);
          token.githubUsername = account.providerAccountId;
        }
      }

      // Look up linked accounts from database on sign-in (single query)
      if (trigger === "signIn" && token.id && prisma) {
        try {
          // Look up GitHub account and profile in a single query
          const [githubAccount, profile] = await Promise.all([
            !token.githubUsername
              ? prisma.account.findFirst({
                  where: {
                    userId: token.id as string,
                    provider: "github",
                  },
                  select: { providerAccountId: true },
                })
              : null,
            prisma.profile.findUnique({
              where: { userId: token.id as string },
              select: { leetcodeUsername: true },
            }),
          ]);

          if (githubAccount) {
            token.githubUsername = githubAccount.providerAccountId;
          }

          if (profile?.leetcodeUsername) {
            token.leetcodeUsername = profile.leetcodeUsername;
          }
        } catch (error) {
          console.error("Error looking up linked accounts:", error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id as string;
      }
      if (token?.githubUsername) {
        (session.user as any).githubUsername = token.githubUsername;
      }
      if (token?.loginProvider) {
        (session.user as any).loginProvider = token.loginProvider;
      }
      if (token?.leetcodeUsername) {
        (session.user as any).leetcodeUsername = token.leetcodeUsername;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: `authjs.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    csrfToken: {
      name: `authjs.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    callbackUrl: {
      name: `authjs.callback-url`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
});
