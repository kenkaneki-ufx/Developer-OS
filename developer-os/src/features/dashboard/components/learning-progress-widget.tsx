"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { GraduationCap, ArrowRight, CheckCircle2 } from "lucide-react";
import { availableCourses } from "@/lib/learning/courses";
import { cn } from "@/lib/utils";

export function LearningProgressWidget() {
  const [progress, setProgress] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/learning/progress")
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("Failed"))))
      .then((data) => setProgress(data.progress ?? {}))
      .catch(() => {
        // best-effort — widget simply shows no progress
      })
      .finally(() => setLoading(false));
  }, []);

  const completed = availableCourses.filter(
    (c) => progress[c.id] === "completed"
  ).length;
  const inProgress = availableCourses.filter(
    (c) => progress[c.id] === "in_progress"
  ).length;
  const pct =
    availableCourses.length > 0
      ? Math.round((completed / availableCourses.length) * 100)
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-border bg-card p-6 shadow-sm"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <GraduationCap className="h-4 w-4 text-primary" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">
            Learning progress
          </h2>
        </div>
        <Link
          href="/dashboard/learning"
          className="flex items-center gap-1 text-xs font-semibold text-muted-foreground transition-colors hover:text-primary"
        >
          Open hub
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="mb-1.5 flex items-end justify-between">
        <span className="text-2xl font-bold text-foreground">
          {loading ? "…" : `${pct}%`}
        </span>
        <span className="text-xs font-medium text-muted-foreground/70">
          {loading ? "…" : `${completed}/${availableCourses.length} courses · ${inProgress} in progress`}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted/50">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: loading ? 0 : `${pct}%` }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "h-full rounded-full",
            pct >= 75
              ? "bg-gradient-to-r from-green-500 to-emerald-500"
              : pct >= 40
                ? "bg-gradient-to-r from-blue-500 to-cyan-500"
                : "bg-gradient-to-r from-primary to-primary/70"
          )}
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {availableCourses.map((course) => {
          const status = progress[course.id] ?? "not_started";
          return (
            <Link
              key={course.id}
              href={`/dashboard/learning/view?course=${course.id}`}
              className={cn(
                "flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-all duration-200 hover:border-primary/30",
                status === "completed"
                  ? "border-green-500/30 bg-green-500/10 text-green-600"
                  : status === "in_progress"
                    ? "border-blue-500/30 bg-blue-500/10 text-blue-600"
                    : "border-border bg-muted/30 text-muted-foreground/70 hover:text-foreground"
              )}
            >
              {status === "completed" && <CheckCircle2 className="h-3 w-3" />}
              {status === "in_progress" && (
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
              )}
              {course.title}
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
}
