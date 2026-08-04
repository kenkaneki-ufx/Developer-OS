"use client";

import { motion } from "framer-motion";
import { GitCommit, TrendingUp, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { AnimatedCard } from "@/components/ui/animated-card";
import { item } from "../types";
import type { GitHubStats } from "../types";

interface StatsGridProps {
  stats: GitHubStats;
}

const statsConfig = [
  { label: "Today", key: "todayCommits" as const, icon: GitCommit, gradient: "from-green-500 to-emerald-400" },
  { label: "This Week", key: "weekCommits" as const, icon: TrendingUp, gradient: "from-blue-500 to-cyan-400" },
  { label: "This Month", key: "monthCommits" as const, icon: Activity, gradient: "from-purple-500 to-pink-400" },
  { label: "Total", key: "totalCommits" as const, icon: GitCommit, gradient: "from-accentOrange to-amber-400" },
];

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <motion.div variants={item} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {statsConfig.map((stat, i) => (
        <AnimatedCard key={stat.label} delay={i * 0.1} hoverEffect="lift" className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground/70">{stat.label}</p>
              <div className="mt-2">
                <AnimatedCounter value={stats[stat.key]} className="text-3xl font-bold text-foreground" />
              </div>
            </div>
            <div className={cn("rounded-xl bg-gradient-to-br p-3 shadow-lg", stat.gradient)}>
              <stat.icon className="h-5 w-5 text-white" />
            </div>
          </div>
        </AnimatedCard>
      ))}
    </motion.div>
  );
}
