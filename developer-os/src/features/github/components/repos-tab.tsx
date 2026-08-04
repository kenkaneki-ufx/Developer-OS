"use client";

import { GitBranch, LayoutGrid, List, Star, GitFork } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedCard } from "@/components/ui/animated-card";
import type { GitHubRepo, RepoViewMode } from "../types";
import { languageColors } from "../types";

interface ReposTabProps {
  repos: GitHubRepo[];
  viewMode: RepoViewMode;
  onViewModeChange: (mode: RepoViewMode) => void;
}

export function ReposTab({ repos, viewMode, onViewModeChange }: ReposTabProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">All Repositories ({repos.length})</h2>
        <div className="flex items-center gap-2">
          <button onClick={() => onViewModeChange("list")} className={cn("rounded-lg p-2 transition-colors", viewMode === "list" ? "bg-muted text-foreground" : "text-muted-foreground/60")}><List className="h-4 w-4" /></button>
          <button onClick={() => onViewModeChange("grid")} className={cn("rounded-lg p-2 transition-colors", viewMode === "grid" ? "bg-muted text-foreground" : "text-muted-foreground/60")}><LayoutGrid className="h-4 w-4" /></button>
        </div>
      </div>
      <div className={cn("gap-4", viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "space-y-3")}>
        {repos.map((repo, index) => (
          <AnimatedCard key={repo.id} delay={index * 0.05} hoverEffect="lift" className={cn(viewMode === "grid" ? "p-5" : "p-4")}>
            <div className={cn(viewMode === "grid" ? "flex flex-col gap-3" : "flex items-center gap-4")}>
              <div className={cn(viewMode === "grid" ? "" : "flex-1 min-w-0")}>
                <div className="flex items-center gap-2">
                  <GitBranch className="h-4 w-4 text-muted-foreground/60 flex-shrink-0" />
                  <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="font-medium text-foreground hover:text-primary hover:underline truncate">{repo.name}</a>
                </div>
                {repo.description && <p className="mt-2 text-sm text-muted-foreground/60 line-clamp-2">{repo.description}</p>}
                {viewMode === "grid" && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {repo.topics.slice(0, 4).map((topic) => (
                      <span key={topic} className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] text-primary font-semibold">{topic}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className={cn("flex items-center gap-4 text-sm text-muted-foreground/60", viewMode === "grid" ? "justify-between pt-3 border-t border-border" : "flex-shrink-0")}>
                {repo.language && (
                  <span className="flex items-center gap-1.5"><span className={cn("h-3 w-3 rounded-full", languageColors[repo.language] || languageColors.default)} />{repo.language}</span>
                )}
                <span className="flex items-center gap-1"><Star className="h-3 w-3" />{repo.stargazers_count}</span>
                <span className="flex items-center gap-1"><GitFork className="h-3 w-3" />{repo.forks_count}</span>
              </div>
            </div>
          </AnimatedCard>
        ))}
      </div>
    </div>
  );
}
