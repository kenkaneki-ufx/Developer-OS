"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import {
  BookOpen,
  ArrowRight,
  Lock,
  Layers,
  Sparkles,
  PlusCircle,
  Check,
  X,
  ThumbsUp,
} from "lucide-react";
import { PageWrapper, PageSection } from "@/components/ui/page-wrapper";
import { useToast } from "@/components/ui/toast";
import {
  availableCourses,
  comingSoonCourses,
  totalSections,
} from "@/lib/learning/courses";
import { cn } from "@/lib/utils";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function LearningHubPage() {
  const { addToast } = useToast();

  const [voteCounts, setVoteCounts] = useState<Record<string, number>>({});
  const [myVote, setMyVote] = useState<string | null>(null);
  const [votesLoading, setVotesLoading] = useState(true);
  const [voting, setVoting] = useState(false);

  const [progress, setProgress] = useState<Record<string, string>>({});
  const [progressLoading, setProgressLoading] = useState(true);
  const [savingProgress, setSavingProgress] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const totalVotes = useMemo(
    () => Object.values(voteCounts).reduce((a, b) => a + b, 0),
    [voteCounts]
  );

  // Load vote data on mount
  useEffect(() => {
    fetch("/api/learning/votes")
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("Failed"))))
      .then((data) => {
        setVoteCounts(data.votes ?? {});
        setMyVote(data.myVote ?? null);
      })
      .catch(() => {
        // Voting is best-effort — hub still fully usable without it
      })
      .finally(() => setVotesLoading(false));
  }, []);

  // Load progress on mount
  useEffect(() => {
    fetch("/api/learning/progress")
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("Failed"))))
      .then((data) => setProgress(data.progress ?? {}))
      .catch(() => {
        // Progress is best-effort too
      })
      .finally(() => setProgressLoading(false));
  }, []);

  const setCourseProgress = useCallback(
    async (courseId: string, status: "completed" | "in_progress") => {
      const previous = progress[courseId];
      setSavingProgress(courseId);
      // Optimistic update
      setProgress((prev) => ({ ...prev, [courseId]: status }));
      try {
        const res = await fetch("/api/learning/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ courseId, status }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Couldn't save progress");
        }
        setProgress(data.progress ?? {});
        const course = availableCourses.find((c) => c.id === courseId);
        addToast(
          status === "completed"
            ? `🎉 ${course?.title ?? courseId} marked as completed!`
            : `${course?.title ?? courseId} marked as in progress.`,
          status === "completed" ? "success" : "info"
        );
      } catch (err) {
        // Roll back to the exact previous status (not just delete)
        setProgress((prev) => {
          const next = { ...prev };
          if (previous) next[courseId] = previous;
          else delete next[courseId];
          return next;
        });
        addToast(
          err instanceof Error ? err.message : "Couldn't save progress",
          "error"
        );
      } finally {
        setSavingProgress(null);
      }
    },
    [addToast, progress]
  );

  // Modal lifecycle: Escape closes, focus moves in on open and returns on close
  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const timer = setTimeout(() => dialogRef.current?.focus(), 50);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
      triggerRef.current?.focus?.();
    };
  }, [modalOpen]);

  const openVoteModal = useCallback((courseId: string) => {
    triggerRef.current = document.activeElement as HTMLElement | null;
    setSelectedId(courseId);
    setModalOpen(true);
  }, []);

  const castVote = useCallback(
    async (courseId: string) => {
      setVoting(true);
      try {
        const res = await fetch("/api/learning/votes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ courseId }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Couldn't save your vote");
        }
        setVoteCounts(data.votes ?? {});
        setMyVote(data.myVote ?? null);
        const course = comingSoonCourses.find((c) => c.id === courseId);
        addToast(`You voted for ${course?.title ?? courseId}! 🎉`, "success");
        setModalOpen(false);
      } catch (err) {
        addToast(
          err instanceof Error ? err.message : "Couldn't save your vote",
          "error"
        );
      } finally {
        setVoting(false);
      }
    },
    [addToast]
  );

  const removeVote = useCallback(async () => {
    setVoting(true);
    try {
      const res = await fetch("/api/learning/votes", { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Couldn't remove your vote");
      }
      setVoteCounts(data.votes ?? {});
      setMyVote(null);
      addToast("Your vote was removed.", "info");
    } catch (err) {
      addToast(
        err instanceof Error ? err.message : "Couldn't remove your vote",
        "error"
      );
    } finally {
      setVoting(false);
    }
  }, [addToast]);

  // Modal list: highest-voted first
  const rankedComingSoon = useMemo(
    () =>
      [...comingSoonCourses].sort(
        (a, b) =>
          (voteCounts[b.id] ?? 0) - (voteCounts[a.id] ?? 0) ||
          a.title.localeCompare(b.title)
      ),
    [voteCounts]
  );

  return (
    <PageWrapper
      title="Learning Hub"
      subtitle="Learn any language from basics to advanced — pick a course and start reading. The notes live right inside your OS."
      headerAction={
        <div className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-primary">
            {availableCourses.length} course
            {availableCourses.length > 1 ? "s" : ""} ready
          </span>
        </div>
      }
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-8"
      >
        {/* Stats */}
        <motion.div variants={item} className="grid gap-3 sm:grid-cols-4">
          {[
            {
              label: "Courses ready",
              value: availableCourses.length,
              color: "text-primary",
              bg: "bg-primary/10",
              icon: BookOpen,
            },
            {
              label: "Total sections",
              value: totalSections,
              color: "text-green-600",
              bg: "bg-green-500/10",
              icon: Layers,
            },
            {
              label: "Languages planned",
              value: comingSoonCourses.length,
              color: "text-blue-600",
              bg: "bg-blue-500/10",
              icon: PlusCircle,
            },
            {
              label: "Path: Basic → Advanced",
              value: "∞",
              color: "text-muted-foreground/70",
              bg: "bg-muted/50",
              icon: ArrowRight,
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              className="rounded-xl border border-border bg-card p-5 text-center"
            >
              <div
                className={cn(
                  "mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-lg",
                  stat.bg
                )}
              >
                <stat.icon className={cn("h-4 w-4", stat.color)} />
              </div>
              <p className={cn("text-2xl font-bold", stat.color)}>
                {stat.value}
              </p>
              <p className="mt-1 text-xs font-medium text-muted-foreground/60">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Available courses */}
        <div>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <h2 className="text-lg font-semibold text-foreground">
              Available now
            </h2>
            <span className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-semibold text-muted-foreground">
              <Check className="h-3.5 w-3.5 text-green-600" />
              {progressLoading
                ? "…"
                : `${Object.values(progress).filter((s) => s === "completed").length}/${availableCourses.length} completed`}
            </span>
          </div>
          <motion.div variants={item} className="grid gap-4 md:grid-cols-3">
            {availableCourses.map((course) => {
              const isCompleted = progress[course.id] === "completed";
              const isSaving = savingProgress === course.id;
              return (
                <motion.div
                  key={course.id}
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={cn(
                    "group relative flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-colors duration-200",
                    isCompleted
                      ? "border-green-500/40 bg-green-500/[0.03]"
                      : "border-border hover:border-primary/25"
                  )}
                >
                  {/* gradient glow */}
                  <div
                    className={cn(
                      "absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br opacity-[0.08] blur-2xl transition-opacity duration-300 group-hover:opacity-[0.16]",
                      course.gradient
                    )}
                  />
                  <div className="relative flex flex-1 flex-col p-5">
                    <div className="mb-4 flex items-start justify-between">
                      <div
                        className={cn(
                          "flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg",
                          course.gradient
                        )}
                      >
                        <course.icon className="h-6 w-6" />
                      </div>
                      <div className="flex items-center gap-2">
                        {isCompleted && (
                          <span className="flex items-center gap-1 rounded-lg border border-green-500/30 bg-green-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-green-600">
                            <Check className="h-3 w-3" />
                            Completed
                          </span>
                        )}
                        <span className="rounded-lg border border-border bg-muted/50 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          {course.language}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-foreground">
                      {course.title}
                    </h3>
                    <p className="mt-1.5 flex-1 text-sm text-muted-foreground/70">
                      {course.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between gap-2">
                      <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground/60">
                        <BookOpen className="h-3.5 w-3.5" />
                        {course.sections} sections
                      </span>
                      <button
                        type="button"
                        disabled={isSaving}
                        onClick={() =>
                          setCourseProgress(course.id, isCompleted ? "in_progress" : "completed")
                        }
                        aria-pressed={isCompleted}
                        className={cn(
                          "flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200 active:scale-[0.97] disabled:opacity-50",
                          isCompleted
                            ? "border border-border bg-muted/50 text-muted-foreground hover:border-red-500/30 hover:text-red-500"
                            : "border border-green-600/30 bg-green-500/10 text-green-600 hover:bg-green-500/20"
                        )}
                      >
                        {isSaving ? (
                          <span className="h-3 w-3 animate-spin rounded-full border border-current border-t-transparent" />
                        ) : isCompleted ? (
                          "Mark in progress"
                        ) : (
                          "Mark completed"
                        )}
                      </button>
                      <Link
                        href={`/dashboard/learning/view?course=${course.id}`}
                        className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-primary to-primary/80 px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-all duration-200 hover:shadow-lg hover:shadow-primary/30 hover:brightness-110 active:scale-[0.97]"
                      >
                        Read
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Coming soon — click to vote */}
        <div>
          <div className="mb-4 flex items-center gap-2">
            <Lock className="h-4 w-4 text-muted-foreground/60" />
            <h2 className="text-lg font-semibold text-foreground">
              Coming soon
            </h2>
            <span className="text-xs text-muted-foreground/50">
              — click a language to vote for what gets built next
            </span>
            <span className="ml-auto flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-semibold text-muted-foreground">
              <ThumbsUp className="h-3.5 w-3.5 text-primary" />
              {votesLoading ? "…" : `${totalVotes} vote${totalVotes === 1 ? "" : "s"}`}
            </span>
          </div>
          <motion.div
            variants={item}
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
          >
            {comingSoonCourses.map((course) => {
              const count = voteCounts[course.id] ?? 0;
              const isVoted = myVote === course.id;
              return (
                <motion.button
                  key={course.id}
                  type="button"
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => openVoteModal(course.id)}
                  className={cn(
                    "group relative flex flex-col items-center gap-2 rounded-xl border border-dashed p-4 text-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                    isVoted
                      ? "border-green-500/50 bg-green-500/[0.06]"
                      : "border-border bg-card/50 hover:border-muted-foreground/30"
                  )}
                >
                  <div className="relative">
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br transition-opacity duration-200",
                        isVoted ? "opacity-90" : "opacity-40 group-hover:opacity-70",
                        course.gradient
                      )}
                    >
                      <course.icon className="h-5 w-5 text-white" />
                    </div>
                    <div
                      className={cn(
                        "absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full shadow",
                        isVoted
                          ? "bg-green-500 text-white"
                          : "bg-card text-muted-foreground/60"
                      )}
                    >
                      {isVoted ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <Lock className="h-2.5 w-2.5" />
                      )}
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    {course.title}
                  </p>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/50">
                    {course.language}
                  </p>
                  <span
                    className={cn(
                      "flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold",
                      isVoted
                        ? "bg-green-500/15 text-green-600"
                        : "bg-muted/50 text-muted-foreground/70 group-hover:text-muted-foreground"
                    )}
                  >
                    <ThumbsUp className="h-3 w-3" />
                    {votesLoading ? "…" : count}
                  </span>
                </motion.button>
              );
            })}
          </motion.div>
        </div>

        {/* How to add a language */}
        <PageSection>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <PlusCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Adding a new language is one file away
                </h3>
                <p className="mt-1 text-sm text-muted-foreground/70">
                  Drop your notes file into{" "}
                  <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-primary">
                    public/learning/
                  </code>{" "}
                  and add one entry in{" "}
                  <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-primary">
                    src/lib/learning/courses.ts
                  </code>{" "}
                  — the hub picks it up automatically. The language with the
                  most votes gets built next, so click a card above and make
                  your voice count.
                </p>
              </div>
            </div>
          </div>
        </PageSection>
      </motion.div>

      {/* Vote modal — portaled to body so ancestor transforms can't break position:fixed */}
      {typeof document !== "undefined" &&
        modalOpen &&
        createPortal(
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-label="Vote for the next language"
              tabIndex={-1}
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl outline-none"
            >
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    Vote for the next language 🗳️
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground/70">
                    One vote per account — you can change it anytime. The
                    leader wins a full notes course next.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  aria-label="Close"
                  className="rounded-lg p-1.5 text-muted-foreground/60 transition-colors hover:bg-muted hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
                {rankedComingSoon.map((course) => {
                  const count = voteCounts[course.id] ?? 0;
                  const isSelected = selectedId === course.id;
                  const isVoted = myVote === course.id;
                  return (
                    <button
                      key={course.id}
                      type="button"
                      onClick={() => setSelectedId(course.id)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all duration-150",
                        isSelected
                          ? "border-primary/60 bg-primary/[0.08]"
                          : "border-border bg-card/50 hover:border-muted-foreground/30"
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-white",
                          course.gradient
                        )}
                      >
                        <course.icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                          {course.title}
                          {isVoted && (
                            <span className="flex items-center gap-1 rounded-full bg-green-500/15 px-1.5 py-0.5 text-[10px] font-bold text-green-600">
                              <Check className="h-2.5 w-2.5" /> your vote
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground/60">
                          {course.language}
                        </p>
                      </div>
                      <span className="flex shrink-0 items-center gap-1 text-xs font-bold text-muted-foreground">
                        <ThumbsUp className="h-3.5 w-3.5" />
                        {count}
                      </span>
                      <span
                        className={cn(
                          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                          isSelected
                            ? "border-primary bg-primary"
                            : "border-muted-foreground/30"
                        )}
                      >
                        {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 flex items-center gap-3">
                <button
                  type="button"
                  disabled={!selectedId || voting}
                  onClick={() => selectedId && castVote(selectedId)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary/80 px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-all duration-200 hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ThumbsUp className="h-4 w-4" />
                  {voting
                    ? "Saving…"
                    : selectedId === myVote
                      ? "Keep my vote"
                      : "Cast my vote"}
                </button>
                {myVote && (
                  <button
                    type="button"
                    disabled={voting}
                    onClick={removeVote}
                    className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:border-red-500/40 hover:text-red-500 disabled:opacity-40"
                  >
                    Remove
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>,
          document.body
        )}
    </PageWrapper>
  );
}
