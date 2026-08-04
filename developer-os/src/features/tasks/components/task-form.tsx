"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, Tag, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  Task,
  TaskCategory,
  TaskPriority,
  TimeOfDay,
  CreateTaskPayload,
} from "../types";

interface TaskFormProps {
  task?: Task;
  onSubmit: (payload: CreateTaskPayload) => void;
  onCancel: () => void;
}

const categories: { value: TaskCategory; label: string }[] = [
  { value: "dsa", label: "DSA" },
  { value: "ml", label: "Machine Learning" },
  { value: "project", label: "Project" },
  { value: "coding", label: "Coding" },
  { value: "review", label: "Review" },
  { value: "reading", label: "Reading" },
  { value: "other", label: "Other" },
];

const priorities: { value: TaskPriority; label: string; color: string }[] = [
  { value: "urgent", label: "Urgent", color: "border-red-500 bg-red-500/10" },
  { value: "high", label: "High", color: "border-accentOrange bg-accentOrange/10" },
  { value: "medium", label: "Medium", color: "border-yellow-500 bg-yellow-500/10" },
  { value: "low", label: "Low", color: "border-blue-500 bg-blue-500/10" },
];

const timeOptions: { value: TimeOfDay; label: string }[] = [
  { value: "morning", label: "Morning (6AM-12PM)" },
  { value: "afternoon", label: "Afternoon (12PM-5PM)" },
  { value: "evening", label: "Evening (5PM-9PM)" },
  { value: "night", label: "Night (9PM-12AM)" },
];

export function TaskForm({ task, onSubmit, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [category, setCategory] = useState<TaskCategory>(task?.category || "dsa");
  const [priority, setPriority] = useState<TaskPriority>(task?.priority || "medium");
  const [estimatedMinutes, setEstimatedMinutes] = useState(task?.estimatedMinutes || 30);
  const [scheduledDate, setScheduledDate] = useState(
    task?.scheduledDate || new Date().toISOString().split("T")[0]
  );
  const [scheduledTime, setScheduledTime] = useState(task?.scheduledTime || "");
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(task?.timeOfDay || "morning");
  const [tags, setTags] = useState<string[]>(task?.tags || []);
  const [tagInput, setTagInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      priority,
      estimatedMinutes,
      scheduledDate,
      scheduledTime: scheduledTime || undefined,
      timeOfDay,
      tags,
    });
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="w-full max-w-lg rounded-xl border border-border bg-background p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">
            {task ? "Edit Task" : "Create New Task"}
          </h2>
          <button
            onClick={onCancel}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Solve 5 Linked List problems"
              className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details about this task..."
              rows={2}
              className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                    category === cat.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:bg-muted"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Priority
            </label>
            <div className="flex gap-2">
              {priorities.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPriority(p.value)}
                  className={cn(
                    "flex-1 rounded-lg border-2 px-3 py-2 text-xs font-medium transition-colors",
                    priority === p.value
                      ? p.color
                      : "border-border text-muted-foreground hover:bg-muted"
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Time estimate */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Estimated Time (minutes)
            </label>
            <div className="flex items-center gap-2">
              {[15, 30, 45, 60, 90, 120].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setEstimatedMinutes(mins)}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                    estimatedMinutes === mins
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:bg-muted"
                  )}
                >
                  {mins >= 60 ? `${mins / 60}h` : `${mins}m`}
                </button>
              ))}
              <input
                type="number"
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                min={5}
                max={480}
                className="w-20 rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Schedule */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                <Calendar className="inline h-4 w-4 mr-1" />
                Date
              </label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                <Clock className="inline h-4 w-4 mr-1" />
                Time of Day
              </label>
              <select
                value={timeOfDay}
                onChange={(e) => setTimeOfDay(e.target.value as TimeOfDay)}
                className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {timeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              <Tag className="inline h-4 w-4 mr-1" />
              Tags
            </label>
            <div className="flex flex-wrap gap-1 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-primary/70"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                placeholder="Add a tag..."
                className="flex-1 rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="button"
                onClick={addTag}
                className="rounded-lg bg-muted px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/80"
              >
                Add
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {task ? "Save Changes" : "Create Task"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
