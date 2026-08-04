"use client";

import { forwardRef } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedCardProps extends HTMLMotionProps<"div"> {
  hoverEffect?: "lift" | "glow" | "scale" | "border" | "none";
  delay?: number;
}

const hoverVariants = {
  lift: {
    rest: { y: 0, boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)" },
    hover: { y: -4, boxShadow: "0 20px 40px -12px rgb(0 0 0 / 0.15)" },
  },
  glow: {
    rest: { boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)" },
    hover: { boxShadow: "0 0 30px -5px hsl(var(--primary) / 0.2)" },
  },
  scale: {
    rest: { scale: 1 },
    hover: { scale: 1.02 },
  },
  border: {
    rest: { borderColor: "hsl(var(--border))" },
    hover: { borderColor: "hsl(var(--primary) / 0.5)" },
  },
  none: {
    rest: {},
    hover: {},
  },
};

const AnimatedCard = forwardRef<HTMLDivElement, AnimatedCardProps>(
  (
    {
      className,
      hoverEffect = "lift",
      delay = 0,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay,
          ease: [0.21, 0.47, 0.32, 0.98],
        }}
        whileHover="hover"
        initial="rest"
        animate="rest"
        variants={hoverVariants[hoverEffect]}
        className={cn(
          "rounded-xl border border-border bg-card text-card-foreground shadow-sm",
          "transition-all duration-300 ease-out",
          hoverEffect === "lift" && "hover:-translate-y-1",
          hoverEffect === "scale" && "hover:scale-[1.02]",
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

AnimatedCard.displayName = "AnimatedCard";

export { AnimatedCard, type AnimatedCardProps };
