"use client";

import { cn } from "@/lib/utils";
import { GitBranch } from "lucide-react";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { AnimatedCard } from "@/components/ui/animated-card";
import type { GitHubStats, GitHubRepo } from "../types";

interface OverviewTabProps {
  stats: GitHubStats;
  repos: GitHubRepo[];
  onViewAllRepos: () => void;
}

export function OverviewTab({ stats, repos, onViewAllRepos }: OverviewTabProps) {
  return (
    <div className="space-y-6">
      <AnimatedCard delay={0.3} hoverEffect="glow" className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Activity Summary</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <AnimatedCounter value={stats.repositories} className="text-2xl font-bold text-foreground" />
            <p className="text-sm text-muted-foreground/70 mt-1">Repos</p>
          </div>
          <div className="text-center">
            <AnimatedCounter value={stats.pullRequests} className="text-2xl font-bold text-foreground" />
            <p className="text-sm text-muted-foreground/70 mt-1">Pull Requests</p>
          </div>
          <div className="text-center">
            <AnimatedCounter value={stats.issues} className="text-2xl font-bold text-foreground" />
            <p className="text-sm text-muted-foreground/70 mt-1">Issues</p>
          </div>
        </div>
      </AnimatedCard>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Recent Repositories</h3>
          <button onClick={onViewAllRepos} className="text-sm text-primary hover:underline font-medium">View All →</button>
        </div>
        <div className="space-y-3">
          {repos.slice(0, 3).map((repo, index) => (
            <AnimatedCard key={repo.id} delay={0.4 + index * 0.1} hoverEffect="lift" className="p-4">
              <div className="flex items-center gap-4">
                <GitBranch className="h-5 w-5 text-muted-foreground/60 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="font-medium text-foreground hover:text-primary hover:underline">{repo.name}</a>
                    {repo.private && <span className="rounded-md bg-muted/50 px-1.5 py-0.5 text-[10px] text-muted-foreground/60 font-medium">Private</span>}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground/60 truncate">{repo.description || "No description"}</p>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground/60">
                  <span>⭐ {repo.stargazers_count}</span>
                  <span>🍴 {repo.forks_count}</span>
                </div>
              </div>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </div>
  );
}
