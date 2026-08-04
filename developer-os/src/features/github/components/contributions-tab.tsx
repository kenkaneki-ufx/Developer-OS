"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { AnimatedCard } from "@/components/ui/animated-card";
import type { GitHubContributionDay, GitHubStats } from "../types";
import { levelColors } from "../types";

interface ContributionsTabProps {
  contributions: GitHubContributionDay[];
  stats: GitHubStats;
}

export function ContributionsTab({ contributions, stats }: ContributionsTabProps) {
  const weeks: Array<GitHubContributionDay[]> = [];
  for (let i = 0; i < contributions.length; i += 7) {
    weeks.push(contributions.slice(i, i + 7));
  }

  const totalContributions = contributions.reduce((sum, day) => sum + day.count, 0);

  return (
    <div>
      {stats.streak > 0 && (
        <AnimatedCard delay={0} hoverEffect="glow" className="p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-gradient-to-br from-accentOrange to-amber-400 p-4 shadow-lg shadow-accentOrange/30"><span className="text-3xl">🔥</span></div>
            <div>
              <AnimatedCounter value={stats.streak} className="text-3xl font-bold text-foreground" suffix=" Day Streak" />
              <p className="text-muted-foreground/70">Keep it up! You&apos;re on fire!</p>
            </div>
          </div>
        </AnimatedCard>
      )}

      <AnimatedCard delay={0.1} hoverEffect="none" className="p-6">
        <h2 className="mb-4 text-lg font-semibold text-foreground">Contribution Graph</h2>
        <div className="flex items-end justify-between gap-1 overflow-x-auto pb-2">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {week.map((day, di) => (
                <motion.div key={`${wi}-${di}`} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: (wi * 7 + di) * 0.002 }}
                  className={cn("h-3 w-3 rounded-sm transition-all duration-200 hover:ring-2 hover:ring-primary/20 hover:scale-125", levelColors[day.level])}
                  title={`${day.date}: ${day.count} commits`} />
              ))}
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground/70">Total Contributions:</span>
            <AnimatedCounter value={totalContributions} className="font-semibold text-foreground" />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-muted-foreground/50">Less</span>
            {levelColors.map((c, i) => (<div key={i} className={cn("h-2.5 w-2.5 rounded-sm", c)} />))}
            <span className="text-[10px] text-muted-foreground/50">More</span>
          </div>
        </div>
      </AnimatedCard>
    </div>
  );
}
