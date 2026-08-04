"use client";

import { motion } from "framer-motion";
import { item } from "../types";

interface StreakCardProps {
  streak: number;
}

export function StreakCard({ streak }: StreakCardProps) {
  if (streak <= 0) return null;

  return (
    <motion.div variants={item} className="relative overflow-hidden rounded-2xl border border-accentOrange/20 bg-gradient-to-r from-accentOrange/5 to-accentOrange/10 p-6 shadow-sm">
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-accentOrange/10 blur-3xl" />
      <div className="relative flex items-center gap-4">
        <div className="rounded-full bg-gradient-to-br from-accentOrange to-amber-400 p-4 shadow-lg shadow-accentOrange/30">
          <span className="text-3xl">🔥</span>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-foreground">{streak} Day Streak</h3>
          <p className="text-muted-foreground/70">Keep it up! You&apos;re on fire!</p>
        </div>
      </div>
    </motion.div>
  );
}
