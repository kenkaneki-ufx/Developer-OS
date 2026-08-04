"use client";

import { motion } from "framer-motion";
import { GitBranch, GitCommit, GitPullRequest, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GitHubOverview } from "../types";

interface GitHubWidgetProps {
  github: GitHubOverview;
}

const levelColors = [
  "bg-muted",
  "bg-green-900 dark:bg-green-900",
  "bg-green-700 dark:bg-green-700",
  "bg-green-500",
  "bg-green-400",
];

export function GitHubWidget({ github }: GitHubWidgetProps) {
  const weeks: Array<Array<{ date: string; count: number; level: number }>> = [];
  const contributions = github.contributionGraph.slice(-84);

  for (let i = 0; i < contributions.length; i += 7) {
    weeks.push(contributions.slice(i, i + 7));
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-border bg-card p-6 shadow-sm"
    >
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted/50">
            <GitBranch className="h-4 w-4 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">GitHub</h2>
        </div>
        <span className="text-sm text-muted-foreground/70 font-medium">
          {github.streak} day streak 🔥
        </span>
      </div>

      <div className="mb-5 grid grid-cols-4 gap-2">
        {[
          { value: github.todayCommits, label: "Today" },
          { value: github.weekCommits, label: "This Week" },
          { value: github.monthCommits, label: "This Month" },
          { value: github.totalCommits.toLocaleString(), label: "Total" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            className="rounded-xl bg-muted/30 p-3 text-center border border-border/50"
          >
            <p className="text-lg font-bold text-foreground">{stat.value}</p>
            <p className="text-[10px] text-muted-foreground/60 font-medium">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="mb-5">
        <div className="flex items-center gap-1 overflow-x-auto pb-2">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day, dayIndex) => (
                <motion.div
                  key={`${weekIndex}-${dayIndex}`}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: (weekIndex * 7 + dayIndex) * 0.002 }}
                  className={cn(
                    "h-3 w-3 rounded-sm transition-all duration-200 hover:ring-2 hover:ring-primary/20 hover:scale-125",
                    levelColors[day.level]
                  )}
                  title={`${day.date}: ${day.count} commits`}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-end gap-1.5 mt-2">
          <span className="text-[10px] text-muted-foreground/50">Less</span>
          {levelColors.map((color, i) => (
            <div
              key={i}
              className={cn("h-2.5 w-2.5 rounded-sm", color)}
            />
          ))}
          <span className="text-[10px] text-muted-foreground/50">More</span>
        </div>
      </div>

      <div className="flex items-center gap-5 text-sm text-muted-foreground/70">
        <div className="flex items-center gap-1.5">
          <GitPullRequest className="h-4 w-4" />
          <span className="font-medium">{github.pullRequests} PRs</span>
        </div>
        <div className="flex items-center gap-1.5">
          <AlertCircle className="h-4 w-4" />
          <span className="font-medium">{github.issues} Issues</span>
        </div>
        <div className="flex items-center gap-1.5">
          <GitBranch className="h-4 w-4" />
          <span className="font-medium">{github.repositories} Repos</span>
        </div>
      </div>
    </motion.div>
  );
}
