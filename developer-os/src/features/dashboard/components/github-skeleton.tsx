"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function GitHubPageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-56" />
        </div>
        <Skeleton className="h-10 w-20 rounded-xl" />
      </div>

      {/* User Profile Card */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-start gap-6">
          <Skeleton className="h-20 w-20 rounded-full" />
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-7 w-40" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            <Skeleton className="h-4 w-64" />
            <div className="flex flex-wrap items-center gap-4">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="mt-2 h-8 w-16" />
          </div>
        ))}
      </div>

      {/* Streak Card */}
      <div className="rounded-xl border border-accentOrange/20 bg-gradient-to-r from-accentOrange/5 to-accentOrange/10 p-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-7 w-36" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
      </div>

      {/* Contribution Graph */}
      <div className="rounded-xl border border-border bg-card p-6">
        <Skeleton className="mb-4 h-5 w-36" />
        <div className="flex items-end gap-1 overflow-x-auto pb-2">
          {Array.from({ length: 12 }).map((_, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {Array.from({ length: 7 }).map((_, dayIndex) => (
                <Skeleton
                  key={`${weekIndex}-${dayIndex}`}
                  className="h-3 w-3 rounded-sm"
                />
              ))}
            </div>
          ))}
        </div>
        <div className="mt-2 flex items-center justify-end gap-1">
          <Skeleton className="h-2.5 w-6" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-2.5 w-2.5 rounded-sm" />
          ))}
          <Skeleton className="h-2.5 w-8" />
        </div>
      </div>

      {/* Repositories */}
      <div>
        <Skeleton className="mb-4 h-5 w-44" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-xl border border-border bg-card p-4"
            >
              <Skeleton className="h-5 w-5 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-16 rounded-full" />
                  <Skeleton className="h-4 w-12 rounded-full" />
                  <Skeleton className="h-4 w-14 rounded-full" />
                </div>
                <Skeleton className="h-3 w-64" />
              </div>
              <div className="flex items-center gap-4">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-4 w-8" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
