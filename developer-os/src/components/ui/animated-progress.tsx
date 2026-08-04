"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedProgressProps {
  value: number;
  max?: number;
  className?: string;
  barClassName?: string;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "gradient" | "striped";
}

const sizeClasses = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
};

export function AnimatedProgress({
  value,
  max = 100,
  className,
  barClassName,
  showLabel = false,
  size = "md",
  variant = "default",
}: AnimatedProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium text-foreground">{Math.round(percentage)}%</span>
        </div>
      )}
      <div
        className={cn(
          "w-full overflow-hidden rounded-full bg-muted",
          sizeClasses[size]
        )}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{
            duration: 1.2,
            ease: [0.21, 0.47, 0.32, 0.98],
            delay: 0.2,
          }}
          className={cn(
            "h-full rounded-full",
            variant === "default" && "bg-primary",
            variant === "gradient" &&
              "bg-gradient-to-r from-primary via-primary/80 to-primary",
            variant === "striped" &&
              "bg-gradient-to-r from-primary via-primary/80 to-primary bg-[length:1rem_1rem] animate-[shimmer_2s_linear_infinite]",
            barClassName
          )}
        />
      </div>
    </div>
  );
}
