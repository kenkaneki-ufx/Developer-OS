"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StickyNote, Plus, X, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import type { QuickNote } from "../types";

interface QuickNotesWidgetProps {
  notes: QuickNote[];
  onAdd?: (content: string) => void;
  onDelete?: (id: string) => void;
}

const noteColors = [
  "bg-yellow-500/5 border-yellow-500/15 hover:border-yellow-500/25",
  "bg-green-500/5 border-green-500/15 hover:border-green-500/25",
  "bg-blue-500/5 border-blue-500/15 hover:border-blue-500/25",
  "bg-purple-500/5 border-purple-500/15 hover:border-purple-500/25",
  "bg-pink-500/5 border-pink-500/15 hover:border-pink-500/25",
];

export function QuickNotesWidget({ notes, onAdd, onDelete }: QuickNotesWidgetProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newNote, setNewNote] = useState("");

  const handleSubmit = () => {
    if (newNote.trim() && onAdd) {
      onAdd(newNote.trim());
      setNewNote("");
      setIsAdding(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-border bg-card p-6 shadow-sm"
    >
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted/50">
            <StickyNote className="h-4 w-4 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">Quick Notes</h2>
        </div>
        <motion.button
          onClick={() => setIsAdding(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/15 transition-colors duration-200 border border-primary/10"
        >
          <Plus className="h-3 w-3" />
          Add
        </motion.button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Write a quick note..."
                className="w-full resize-none rounded-lg border-0 bg-background/50 p-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                rows={3}
                autoFocus
              />
              <div className="mt-3 flex items-center justify-end gap-2">
                <button
                  onClick={() => {
                    setIsAdding(false);
                    setNewNote("");
                  }}
                  className="rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted/60 transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  onClick={handleSubmit}
                  disabled={!newNote.trim()}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="rounded-lg bg-gradient-to-b from-primary to-primary/90 px-4 py-1.5 text-xs font-semibold text-primary-foreground shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Save
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-2">
        {notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted/30 mb-3">
              <StickyNote className="h-5 w-5 text-muted-foreground/40" />
            </div>
            <p className="text-sm text-muted-foreground/50 font-medium">
              No notes yet. Click &quot;Add&quot; to create one.
            </p>
          </div>
        ) : (
          notes.map((note, index) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.04, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                "group relative rounded-xl border p-4 transition-all duration-200 hover:shadow-sm",
                noteColors[index % noteColors.length]
              )}
            >
              <p className="text-sm text-foreground pr-6 leading-relaxed">{note.content}</p>
              {note.tags && note.tags.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {note.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 rounded-md bg-background/60 border border-border/50 px-2 py-0.5 text-[10px] font-medium text-muted-foreground/60"
                    >
                      <Tag className="h-2 w-2" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              {onDelete && (
                <motion.button
                  onClick={() => onDelete(note.id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute right-2 top-2 rounded-lg p-1.5 text-muted-foreground/30 opacity-0 group-hover:opacity-100 hover:bg-background hover:text-foreground transition-all duration-200"
                >
                  <X className="h-3.5 w-3.5" />
                </motion.button>
              )}
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
