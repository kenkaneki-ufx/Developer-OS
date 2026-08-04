"use client";

import { motion } from "framer-motion";
import { ExternalLink, Flame, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PlatformStats as PlatformStatsType } from "../types";

interface PlatformStatsCardProps {
  stats: PlatformStatsType[];
}

export function PlatformStatsCard({ stats }: PlatformStatsCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="mb-4 font-semibold text-foreground">Platform Stats</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {stats.map((platform, index) => (
          <motion.div
            key={platform.platform}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="rounded-lg border border-border p-4 transition-all hover:border-primary/20"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">{platform.icon}</span>
                <span className="font-medium text-foreground">{platform.displayName}</span>
              </div>
              <div className="flex items-center gap-1 text-orange-500">
                <Flame className="h-3 w-3" />
                <span className="text-xs font-medium">{platform.streak}</span>
              </div>
            </div>

            <div className="flex items-end justify-between mb-2">
              <div>
                <p className="text-2xl font-bold text-foreground">{platform.totalSolved}</p>
                <p className="text-xs text-muted-foreground">solved</p>
              </div>
              {platform.rating && (
                <div className="text-right">
                  <p className="text-lg font-bold text-primary">{platform.rating}</p>
                  <p className="text-xs text-muted-foreground">rating</p>
                </div>
              )}
            </div>

            <div className="flex gap-2 text-xs">
              <span className="rounded bg-green-500/10 px-1.5 py-0.5 text-green-500">{platform.easySolved}E</span>
              <span className="rounded bg-yellow-500/10 px-1.5 py-0.5 text-yellow-500">{platform.mediumSolved}M</span>
              <span className="rounded bg-red-500/10 px-1.5 py-0.5 text-red-500">{platform.hardSolved}H</span>
            </div>

            {platform.rank && (
              <p className="mt-2 text-[10px] text-muted-foreground">{platform.rank}</p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
