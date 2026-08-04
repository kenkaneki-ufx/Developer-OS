"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Filter,
  SortAsc,
  SortDesc,
  Search,
  X,
  ListFilter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TaskCard } from "./task-card";
import type {
  Task,
  TaskFilters,
  TaskSort,
  TaskSortField,
  TaskStatus,
  TaskCategory,
  TaskPriority,
} from "../types";

interface TaskListProps {
  tasks: Task[];
  filters?: TaskFilters;
  sort?: TaskSort;
  onFilterChange?: (filters: TaskFilters) => void;
  onSortChange?: (sort: TaskSort) => void;
  onComplete?: (id: string) => void;
  onStart?: (id: string) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (id: string) => void;
  groupBy?: "status" | "category" | "priority" | "date" | "none";
  showSearch?: boolean;
  emptyMessage?: string;
}

const statusOptions: { value: TaskStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "skipped", label: "Skipped" },
];

const categoryOptions: { value: TaskCategory; label: string }[] = [
  { value: "dsa", label: "DSA" },
  { value: "ml", label: "ML" },
  { value: "project", label: "Project" },
  { value: "coding", label: "Coding" },
  { value: "review", label: "Review" },
];

const priorityOptions: { value: TaskPriority; label: string }[] = [
  { value: "urgent", label: "Urgent" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

const sortOptions: { value: TaskSortField; label: string }[] = [
  { value: "scheduledDate", label: "Date" },
  { value: "priority", label: "Priority" },
  { value: "category", label: "Category" },
  { value: "status", label: "Status" },
  { value: "progress", label: "Progress" },
];

export function TaskList({
  tasks,
  filters = {},
  sort = { field: "scheduledDate", order: "asc" },
  onFilterChange,
  onSortChange,
  onComplete,
  onStart,
  onEdit,
  onDelete,
  groupBy = "none",
  showSearch = true,
  emptyMessage = "No tasks found",
}: TaskListProps) {
  const [searchQuery, setSearchQuery] = useState(filters.search || "");
  const [showFilters, setShowFilters] = useState(false);

  // Apply filters and search
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.description?.toLowerCase().includes(query) ||
          task.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Status filter
    if (filters.status && filters.status.length > 0) {
      result = result.filter((task) => filters.status!.includes(task.status));
    }

    // Category filter
    if (filters.category && filters.category.length > 0) {
      result = result.filter((task) => filters.category!.includes(task.category));
    }

    // Priority filter
    if (filters.priority && filters.priority.length > 0) {
      result = result.filter((task) => filters.priority!.includes(task.priority));
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sort.field) {
        case "scheduledDate":
          comparison = a.scheduledDate.localeCompare(b.scheduledDate);
          break;
        case "priority": {
          const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        }
        case "category":
          comparison = a.category.localeCompare(b.category);
          break;
        case "status": {
          const statusOrder = { in_progress: 0, pending: 1, completed: 2, skipped: 3, cancelled: 4 };
          comparison = statusOrder[a.status] - statusOrder[b.status];
          break;
        }
        case "progress":
          comparison = b.progress - a.progress;
          break;
        default:
          comparison = 0;
      }
      return sort.order === "asc" ? comparison : -comparison;
    });

    return result;
  }, [tasks, searchQuery, filters, sort]);

  // Group tasks
  const groupedTasks = useMemo(() => {
    if (groupBy === "none") return { "All Tasks": filteredTasks };

    const groups: Record<string, Task[]> = {};
    filteredTasks.forEach((task) => {
      let key: string;
      switch (groupBy) {
        case "status":
          key = task.status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
          break;
        case "category":
          key = task.category.toUpperCase();
          break;
        case "priority":
          key = task.priority.charAt(0).toUpperCase() + task.priority.slice(1);
          break;
        case "date":
          key = task.scheduledDate;
          break;
        default:
          key = "All Tasks";
      }
      if (!groups[key]) groups[key] = [];
      groups[key].push(task);
    });

    return groups;
  }, [filteredTasks, groupBy]);

  const activeFilterCount = [
    filters.status?.length,
    filters.category?.length,
    filters.priority?.length,
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-2">
        {/* Search */}
        {showSearch && (
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-border bg-muted/50 py-2 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        )}

        {/* Filter toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm transition-colors",
            showFilters || activeFilterCount
              ? "border-primary/20 bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-muted"
          )}
        >
          <ListFilter className="h-4 w-4" />
          <span className="hidden sm:inline">Filters</span>
          {activeFilterCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Sort */}
        <select
          value={`${sort.field}-${sort.order}`}
          onChange={(e) => {
            const [field, order] = e.target.value.split("-");
            onSortChange?.({ field: field as TaskSortField, order: order as "asc" | "desc" });
          }}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          {sortOptions.map((option) => (
            <optgroup key={option.value} label={option.label}>
              <option value={`${option.value}-asc`}>{option.label} ↑</option>
              <option value={`${option.value}-desc`}>{option.label} ↓</option>
            </optgroup>
          ))}
        </select>
      </div>

      {/* Filter chips */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-3 rounded-lg border border-border bg-muted/30 p-3">
              {/* Status filters */}
              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">Status</p>
                <div className="flex flex-wrap gap-1">
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        const current = filters.status || [];
                        const updated = current.includes(option.value)
                          ? current.filter((s) => s !== option.value)
                          : [...current, option.value];
                        onFilterChange?.({ ...filters, status: updated });
                      }}
                      className={cn(
                        "rounded-full px-2 py-1 text-xs transition-colors",
                        filters.status?.includes(option.value)
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category filters */}
              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">Category</p>
                <div className="flex flex-wrap gap-1">
                  {categoryOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        const current = filters.category || [];
                        const updated = current.includes(option.value)
                          ? current.filter((c) => c !== option.value)
                          : [...current, option.value];
                        onFilterChange?.({ ...filters, category: updated });
                      }}
                      className={cn(
                        "rounded-full px-2 py-1 text-xs transition-colors",
                        filters.category?.includes(option.value)
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority filters */}
              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">Priority</p>
                <div className="flex flex-wrap gap-1">
                  {priorityOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        const current = filters.priority || [];
                        const updated = current.includes(option.value)
                          ? current.filter((p) => p !== option.value)
                          : [...current, option.value];
                        onFilterChange?.({ ...filters, priority: updated });
                      }}
                      className={cn(
                        "rounded-full px-2 py-1 text-xs transition-colors",
                        filters.priority?.includes(option.value)
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Task groups */}
      {Object.keys(groupedTasks).length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12">
          <p className="text-sm text-muted-foreground">{emptyMessage}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedTasks).map(([group, groupTasks]) => (
            <div key={group}>
              {groupBy !== "none" && (
                <h3 className="mb-3 text-sm font-medium text-muted-foreground">
                  {group} ({groupTasks.length})
                </h3>
              )}
              <div className="space-y-2">
                <AnimatePresence mode="popLayout">
                  {groupTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onComplete={onComplete}
                      onStart={onStart}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
