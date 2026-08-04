"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { RefreshCw, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { GitHubPageSkeleton } from "@/features/dashboard/components/github-skeleton";
import { PageWrapper } from "@/components/ui/page-wrapper";
import {
  UserProfileCard,
  StatsGrid,
  StreakCard,
  OverviewTab,
  ReposTab,
  ContributionsTab,
  LinkAccountForm,
  ErrorState,
  QuickLinks,
} from "@/features/github/components";
import type { GitHubData, GitHubTab, RepoViewMode } from "@/features/github/types";
import { container, item } from "@/features/github/types";

export default function GitHubPage() {
  const { data: session } = useSession();
  const [githubData, setGithubData] = useState<GitHubData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [autoSyncAttempted, setAutoSyncAttempted] = useState(false);
  const [isAutoSyncing, setIsAutoSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState<GitHubTab>("overview");
  const [repoView, setRepoView] = useState<RepoViewMode>("list");

  const sessionEmail = session?.user?.email || null;

  const fetchGitHubData = async (showAutoSyncIndicator = false) => {
    try {
      if (showAutoSyncIndicator) {
        setIsAutoSyncing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);
      const response = await fetch("/api/github/sync");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch GitHub data");
      }

      setGithubData(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load GitHub data");
    } finally {
      setIsLoading(false);
      setIsAutoSyncing(false);
    }
  };

  useEffect(() => {
    if (sessionEmail && !autoSyncAttempted) {
      setAutoSyncAttempted(true);
      fetchGitHubData(true);
    }
  }, [sessionEmail, autoSyncAttempted]);

  const handleSync = async () => {
    setIsSyncing(true);
    await fetchGitHubData();
    setIsSyncing(false);
  };

  const handleLinkAccount = async (email: string) => {
    const response = await fetch("/api/github/link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to link GitHub account");
    }

    await fetchGitHubData();
  };

  // Loading state
  if (isLoading && !isAutoSyncing) {
    return <GitHubPageSkeleton />;
  }

  // Error state
  if (error) {
    return (
      <PageWrapper title="GitHub" subtitle="Connect your GitHub account to see your activity">
        <ErrorState error={error} onRetry={handleSync} isSyncing={isSyncing} />
        <div className="mt-6">
          <LinkAccountForm sessionEmail={sessionEmail} onLink={handleLinkAccount} />
        </div>
        <div className="mt-6">
          <QuickLinks />
        </div>
      </PageWrapper>
    );
  }

  // No user connected state
  if (!githubData?.user) {
    return (
      <PageWrapper title="GitHub" subtitle="Connect your GitHub account to see your activity">
        <div className="flex items-center justify-center py-20">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-4 text-center">
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="rounded-full bg-gradient-to-br from-gray-800 to-gray-900 p-4 shadow-lg">
              <span className="text-3xl">🐙</span>
            </motion.div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">No GitHub account connected</h2>
              <p className="mt-1 max-w-md text-muted-foreground/70">Sign in with GitHub to automatically sync your activity, or link your GitHub account using your email.</p>
            </div>
          </motion.div>
        </div>
        <LinkAccountForm sessionEmail={sessionEmail} onLink={handleLinkAccount} />
      </PageWrapper>
    );
  }

  const { user, repos, contributions, stats } = githubData;

  const tabs = [
    { id: "overview" as const, label: "Overview" },
    { id: "repos" as const, label: "Repositories" },
    { id: "contributions" as const, label: "Contributions" },
  ];

  return (
    <PageWrapper 
      title="GitHub" 
      subtitle="Your GitHub activity and repositories"
      headerAction={
        <motion.button 
          whileHover={{ scale: 1.02 }} 
          whileTap={{ scale: 0.98 }}
          onClick={handleSync} 
          disabled={isSyncing}
          className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted/60 disabled:opacity-50 transition-all duration-200 hover:shadow-sm"
        >
          {isSyncing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          {isSyncing ? "Syncing..." : "Refresh"}
        </motion.button>
      }
    >
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        {/* User Profile Card */}
        <UserProfileCard user={user} />

        {/* Tab Navigation */}
        <motion.div variants={item} className="rounded-2xl border border-border bg-card p-1 shadow-sm">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={cn("flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200",
                  activeTab === tab.id ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground")}>
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Stats Grid */}
        <StatsGrid stats={stats} />

        {/* Streak Card */}
        <StreakCard streak={stats.streak} />

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              <OverviewTab stats={stats} repos={repos} onViewAllRepos={() => setActiveTab("repos")} />
            </motion.div>
          )}

          {activeTab === "repos" && (
            <motion.div key="repos" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              <ReposTab repos={repos} viewMode={repoView} onViewModeChange={setRepoView} />
            </motion.div>
          )}

          {activeTab === "contributions" && (
            <motion.div key="contributions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              <ContributionsTab contributions={contributions} stats={stats} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </PageWrapper>
  );
}
