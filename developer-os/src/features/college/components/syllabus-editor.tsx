"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  BookOpen,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { SyllabusTopic, Subject } from "../types";

interface SyllabusEditorProps {
  subject: Subject;
  onUpdateTopics: (subjectId: string, topics: SyllabusTopic[]) => void;
}

export function SyllabusEditor({ subject, onUpdateTopics }: SyllabusEditorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newTopicName, setNewTopicName] = useState("");
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  const [editingTopicName, setEditingTopicName] = useState("");

  const topics = subject.syllabusTopics || [];
  const completedCount = topics.filter((t) => t.completed).length;
  const totalCount = topics.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleAddTopic = () => {
    if (!newTopicName.trim()) return;
    const newTopic: SyllabusTopic = {
      id: `topic-${Date.now()}`,
      name: newTopicName.trim(),
      completed: false,
    };
    onUpdateTopics(subject.id, [...topics, newTopic]);
    setNewTopicName("");
  };

  const handleToggleTopic = (topicId: string) => {
    const updated = topics.map((t) =>
      t.id === topicId ? { ...t, completed: !t.completed } : t
    );
    onUpdateTopics(subject.id, updated);
  };

  const handleDeleteTopic = (topicId: string) => {
    const updated = topics.filter((t) => t.id !== topicId);
    onUpdateTopics(subject.id, updated);
  };

  const handleRenameTopic = (topicId: string) => {
    if (!editingTopicName.trim()) return;
    const updated = topics.map((t) =>
      t.id === topicId ? { ...t, name: editingTopicName.trim() } : t
    );
    onUpdateTopics(subject.id, updated);
    setEditingTopicId(null);
    setEditingTopicName("");
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between p-4 hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={cn("rounded-lg p-2", subject.color)}>
            <BookOpen className="h-4 w-4 text-white" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-foreground">Syllabus Progress</p>
            <p className="text-xs text-muted-foreground/60">
              {completedCount}/{totalCount} topics completed
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Progress ring */}
          <div className="relative h-10 w-10">
            <svg className="h-10 w-10 -rotate-90" viewBox="0 0 36 36">
              <circle
                cx="18"
                cy="18"
                r="15"
                fill="none"
                className="stroke-muted/30"
                strokeWidth="3"
              />
              <circle
                cx="18"
                cy="18"
                r="15"
                fill="none"
                className={cn(
                  "transition-all duration-500",
                  progressPercent >= 75
                    ? "stroke-green-500"
                    : progressPercent >= 50
                    ? "stroke-yellow-500"
                    : progressPercent >= 25
                    ? "stroke-accentOrange"
                    : "stroke-red-500"
                )}
                strokeWidth="3"
                strokeDasharray={`${progressPercent * 0.94} 100`}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-foreground">
              {progressPercent}%
            </span>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Progress bar */}
      <div className="h-1 bg-muted/30">
        <div
          className={cn(
            "h-full transition-all duration-500",
            progressPercent >= 75
              ? "bg-green-500"
              : progressPercent >= 50
              ? "bg-yellow-500"
              : progressPercent >= 25
              ? "bg-accentOrange"
              : "bg-red-500"
          )}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Expanded content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-3">
              {/* Add topic input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTopicName}
                  onChange={(e) => setNewTopicName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddTopic()}
                  placeholder="Add a new topic..."
                  className="flex-1 rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all duration-200"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddTopic}
                  disabled={!newTopicName.trim()}
                  className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm hover:shadow-md disabled:opacity-50 transition-all duration-200"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </motion.button>
              </div>

              {/* Topics list */}
              <div className="space-y-1.5 max-h-64 overflow-y-auto">
                <AnimatePresence>
                  {topics.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="py-6 text-center"
                    >
                      <BookOpen className="mx-auto h-8 w-8 text-muted-foreground/30" />
                      <p className="mt-2 text-sm text-muted-foreground/50">
                        No topics added yet. Start adding your syllabus topics.
                      </p>
                    </motion.div>
                  ) : (
                    topics.map((topic, index) => (
                      <motion.div
                        key={topic.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10, height: 0 }}
                        transition={{ delay: index * 0.02, duration: 0.2 }}
                        className={cn(
                          "flex items-center gap-3 rounded-xl border border-border/50 px-3 py-2.5 group transition-all duration-200",
                          topic.completed
                            ? "bg-green-500/5 border-green-500/20"
                            : "bg-card hover:bg-muted/30"
                        )}
                      >
                        <button
                          onClick={() => handleToggleTopic(topic.id)}
                          className="flex-shrink-0"
                        >
                          {topic.completed ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          ) : (
                            <Circle className="h-5 w-5 text-muted-foreground/40 hover:text-primary transition-colors" />
                          )}
                        </button>

                        {editingTopicId === topic.id ? (
                          <input
                            type="text"
                            value={editingTopicName}
                            onChange={(e) => setEditingTopicName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleRenameTopic(topic.id);
                              if (e.key === "Escape") {
                                setEditingTopicId(null);
                                setEditingTopicName("");
                              }
                            }}
                            onBlur={() => handleRenameTopic(topic.id)}
                            autoFocus
                            className="flex-1 rounded-lg border border-primary/30 bg-background px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/20"
                          />
                        ) : (
                          <span
                            onDoubleClick={() => {
                              setEditingTopicId(topic.id);
                              setEditingTopicName(topic.name);
                            }}
                            className={cn(
                              "flex-1 text-sm transition-colors cursor-default",
                              topic.completed
                                ? "text-muted-foreground/60 line-through"
                                : "text-foreground"
                            )}
                          >
                            {topic.name}
                          </span>
                        )}

                        <button
                          onClick={() => handleDeleteTopic(topic.id)}
                          className="rounded-lg p-1.5 text-muted-foreground/30 hover:bg-destructive/10 hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
