"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { StatCard as StatCardType } from "../types";

interface StatCardProps {
  stat: StatCardType;
  index: number;
}

export function StatCard({ stat, index }: StatCardProps) {
  const Icon = stat.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 24,
        delay: index * 0.08,
      }}
      whileHover={{
        y: -6,
        scale: 1.02,
        transition: { type: "spring", stiffness: 400, damping: 15 },
      }}
      whileTap={{ scale: 0.98 }}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-shadow duration-500 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/20"
    >
      {/* Aurora border glow on hover */}
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-primary/20 via-purple-500/10 to-blue-500/20 opacity-0 blur-sm transition-opacity duration-500 group-hover:opacity-100" />

      {/* Background shimmer sweep */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl">
        <div className="absolute -top-full -left-full h-[200%] w-[200%] rotate-[25deg] bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 transition-all duration-700 group-hover:opacity-100 group-hover:translate-x-full group-hover:translate-y-full" />
      </div>

      {/* Decorative gradient orb */}
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br from-primary/8 to-transparent opacity-0 blur-2xl transition-all duration-700 group-hover:opacity-100 group-hover:scale-125" />

      <div className="relative">
        <div className="flex items-center justify-between">
          <motion.div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-xl shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-md",
              stat.bgColor
            )}
            whileHover={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.4 }}
          >
            <Icon className={cn("h-6 w-6", stat.color)} />
          </motion.div>
          {stat.change && (
            <motion.span
              initial={{ opacity: 0, x: 10, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{
                delay: index * 0.08 + 0.3,
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
              className={cn(
                "text-xs font-semibold px-2 py-1 rounded-lg",
                stat.changeType === "positive" && "text-green-600 bg-green-500/10",
                stat.changeType === "negative" && "text-red-600 bg-red-500/10",
                stat.changeType === "neutral" && "text-muted-foreground bg-muted/50",
                !stat.changeType && "text-muted-foreground bg-muted/50"
              )}
            >
              {stat.change}
            </motion.span>
          )}
        </div>

        <div className="mt-4">
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.08 + 0.15,
              type: "spring",
              stiffness: 200,
              damping: 15,
            }}
            className="text-2xl font-bold text-foreground tracking-tight"
          >
            {stat.value}
          </motion.h3>
          <p className="text-sm font-medium text-muted-foreground/80 mt-0.5">{stat.title}</p>
        </div>
      </div>
    </motion.div>
  );
}
