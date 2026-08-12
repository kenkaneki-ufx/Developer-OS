"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  FileQuestion,
} from "lucide-react";
import { getCourse } from "@/lib/learning/courses";
import { cn } from "@/lib/utils";

export default function LearningViewPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      }
    >
      <Viewer />
    </Suspense>
  );
}

function Viewer() {
  const searchParams = useSearchParams();
  const course = getCourse(searchParams.get("course"));

  // Auto-mark the course as in progress when opened (never downgrades a completed course)
  useEffect(() => {
    if (!course?.id) return;
    let cancelled = false;

    fetch("/api/learning/progress")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled) return;
        // Only auto-mark when we actually know the current state — never
        // downgrade a course the user already marked as completed.
        if (!data) return;
        if (data.progress?.[course.id] === "completed") return;
        return fetch("/api/learning/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ courseId: course.id, status: "in_progress" }),
        });
      })
      .catch(() => {
        // best-effort — viewing still works
      });

    return () => {
      cancelled = true;
    };
  }, [course]);

  if (!course || !course.available || !course.file) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-card p-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/50">
          <FileQuestion className="h-7 w-7 text-muted-foreground/60" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Course not found
          </h2>
          <p className="mt-1 text-sm text-muted-foreground/70">
            That course isn&apos;t available yet — check the Learning Hub for
            published courses.
          </p>
        </div>
        <Link
          href="/dashboard/learning"
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary/80 px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-all duration-200 hover:brightness-110 active:scale-[0.97]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Learning Hub
        </Link>
      </div>
    );
  }

  const notesUrl = `/learning/${course.file}`;

  return (
    <div className="flex h-full flex-col gap-4">
      {/* Viewer header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/dashboard/learning"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/50 text-muted-foreground transition-all duration-200 hover:border-primary/30 hover:text-foreground active:scale-95"
            aria-label="Back to Learning Hub"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-md",
              course.gradient
            )}
          >
            <course.icon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-base font-bold text-foreground">
              {course.title} Notes
            </h1>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground/70">
              <BookOpen className="h-3 w-3" />
              {course.sections} sections · basic → advanced
            </p>
          </div>
        </div>
        <a
          href={notesUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-1.5 self-start rounded-lg border border-border bg-muted/50 px-3.5 py-2 text-xs font-semibold text-foreground transition-all duration-200 hover:border-primary/30 hover:bg-primary/5 sm:self-auto"
        >
          Open in new tab
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </motion.div>

      {/* Notes iframe */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="min-h-0 flex-1"
      >
        <iframe
          src={notesUrl}
          title={`${course.title} notes`}
          className="h-[calc(100dvh-15rem)] w-full rounded-xl border border-border bg-card shadow-sm sm:h-[calc(100dvh-13rem)]"
        />
      </motion.div>
    </div>
  );
}
