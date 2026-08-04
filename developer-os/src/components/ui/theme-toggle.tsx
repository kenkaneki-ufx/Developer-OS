"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine if dark mode is active
  const isDark = mounted
    ? theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    : true; // Default to dark during SSR

  const toggleTheme = () => {
    // Temporarily add theme-transition class for smooth page-wide transitions
    const root = document.documentElement;
    root.classList.add("theme-transition");
    
    setTheme(isDark ? "light" : "dark");
    
    // Remove class after transition completes
    setTimeout(() => {
      root.classList.remove("theme-transition");
    }, 400);
  };

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative h-9 w-9 rounded-lg overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 focus:ring-offset-background"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {/* Animated background that transitions between dark and light */}
      <motion.div
        className="absolute inset-0 rounded-lg"
        initial={false}
        animate={{
          background: isDark
            ? "linear-gradient(135deg, hsl(240 10% 3.9%) 0%, hsl(240 10% 10%) 100%)"
            : "linear-gradient(135deg, hsl(45 93% 58%) 0%, hsl(35 92% 50%) 100%)",
        }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      />



      {/* Icon container with smooth rotation */}
      <motion.div
        className="relative z-10 flex items-center justify-center h-full w-full"
        initial={false}
        animate={{ rotate: isDark ? 0 : 180 }}
        transition={{
          duration: 0.5,
          ease: [0.4, 0, 0.2, 1],
        }}
      >
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.div
              key="moon"
              initial={{ scale: 0, rotate: -90, opacity: 0, y: 10 }}
              animate={{ scale: 1, rotate: 0, opacity: 1, y: 0 }}
              exit={{ scale: 0, rotate: 90, opacity: 0, y: -10 }}
              transition={{
                duration: 0.3,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="drop-shadow-lg"
            >
              <Moon className="h-4 w-4 text-white" fill="currentColor" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ scale: 0, rotate: 90, opacity: 0, y: 10 }}
              animate={{ scale: 1, rotate: 0, opacity: 1, y: 0 }}
              exit={{ scale: 0, rotate: -90, opacity: 0, y: -10 }}
              transition={{
                duration: 0.3,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="drop-shadow-lg"
            >
              <Sun className="h-4 w-4 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>


    </motion.button>
  );
}
