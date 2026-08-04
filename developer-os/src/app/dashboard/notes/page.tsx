"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Plus, Search, Trash2, Edit3, Clock, Hash, Pin, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { PageWrapper } from "@/components/ui/page-wrapper";

const notes = [
  { id: "1", title: "Binary Trees Notes", content: "In-order, pre-order, post-order traversal patterns. DFS and BFS approaches for tree problems. Recursive vs iterative solutions.", tags: ["dsa", "trees"], folder: "DSA", updatedAt: "2 hours ago", pinned: true, starred: false },
  { id: "2", title: "React Hooks Cheat Sheet", content: "useState, useEffect, useCallback, useMemo patterns. Custom hooks best practices. Performance optimization tips.", tags: ["react", "hooks"], folder: "Frontend", updatedAt: "1 day ago", pinned: false, starred: true },
  { id: "3", title: "SQL Joins Reference", content: "INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL JOIN, CROSS JOIN. Performance considerations and indexing strategies.", tags: ["sql", "database"], folder: "Database", updatedAt: "3 days ago", pinned: false, starred: false },
  { id: "4", title: "ML Algorithms Summary", content: "Linear Regression, Logistic Regression, SVM, Decision Trees, Random Forest, Gradient Boosting. When to use each algorithm.", tags: ["ml", "algorithms"], folder: "ML", updatedAt: "1 week ago", pinned: false, starred: false },
  { id: "5", title: "Git Commands", content: "git stash, git rebase, git cherry-pick advanced. Git workflow strategies for teams. Conflict resolution patterns.", tags: ["git", "devops"], folder: "DevOps", updatedAt: "2 days ago", pinned: false, starred: false },
  { id: "6", title: "System Design Notes", content: "CAP theorem, horizontal vs vertical scaling, load balancing strategies, caching patterns, database sharding.", tags: ["architecture", "system-design"], folder: "Architecture", updatedAt: "5 days ago", pinned: true, starred: true },
];

const folders = ["All", "DSA", "Frontend", "Database", "ML", "DevOps", "Architecture"];

const folderColors: Record<string, string> = {
  "All": "bg-gray-500/10 text-gray-600",
  "DSA": "bg-blue-500/10 text-blue-600",
  "Frontend": "bg-cyan-500/10 text-cyan-600",
  "Database": "bg-green-500/10 text-green-600",
  "ML": "bg-purple-500/10 text-purple-600",
  "DevOps": "bg-accentOrange/10 text-accentOrange",
  "Architecture": "bg-pink-500/10 text-pink-600",
};

const noteColors = [
  "from-yellow-500/10 to-yellow-500/5 border-yellow-500/20",
  "from-green-500/10 to-green-500/5 border-green-500/20",
  "from-blue-500/10 to-blue-500/5 border-blue-500/20",
  "from-purple-500/10 to-purple-500/5 border-purple-500/20",
  "from-pink-500/10 to-pink-500/5 border-pink-500/20",
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function NotesPage() {
  const [search, setSearch] = useState("");
  const [folder, setFolder] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  const filtered = notes.filter(n => (folder === "All" || n.folder === folder) && (n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase())));
  
  const pinnedNotes = filtered.filter(n => n.pinned);
  const unpinnedNotes = filtered.filter(n => !n.pinned);
  const displayNotes = [...pinnedNotes, ...unpinnedNotes];

  return (
    <PageWrapper
      title="Notes"
      subtitle="Your personal knowledge base"
      headerAction={
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-b from-primary to-primary/90 px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200">
          <Plus className="h-4 w-4" /> New Note
        </motion.button>
      }
    >
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        {/* Search and Filters */}
        <motion.div variants={item} className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/40" />
            <input type="text" placeholder="Search notes..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full rounded-xl border border-border bg-muted/30 py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all duration-200" />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1 rounded-xl border border-border bg-muted/30 p-1 overflow-x-auto">
              {folders.map(f => (
                <button key={f} onClick={() => setFolder(f)} className={cn("rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 whitespace-nowrap", folder === f ? "bg-background text-foreground shadow-sm" : "text-muted-foreground/60 hover:text-foreground hover:bg-muted/40")}>
                  {f}
                </button>
              ))}
            </div>
            <div className="flex gap-1 rounded-xl border border-border bg-muted/30 p-1">
              <button onClick={() => setViewMode("grid")} className={cn("rounded-lg p-2 transition-all duration-200", viewMode === "grid" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground/60 hover:text-foreground")}>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
              </button>
              <button onClick={() => setViewMode("list")} className={cn("rounded-lg p-2 transition-all duration-200", viewMode === "list" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground/60 hover:text-foreground")}>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Notes Stats */}
        <motion.div variants={item} className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="font-medium">{displayNotes.length} notes</span>
          {pinnedNotes.length > 0 && <span className="flex items-center gap-1"><Pin className="h-3 w-3" /> {pinnedNotes.length} pinned</span>}
          <span className="flex items-center gap-1"><Star className="h-3 w-3" /> {notes.filter(n => n.starred).length} starred</span>
        </motion.div>

        {/* Notes Grid */}
        <motion.div variants={item} className={cn(viewMode === "grid" ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3" : "space-y-3")}>
          <AnimatePresence mode="popLayout">
            {displayNotes.map((note, index) => (
              <motion.div
                key={note.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  "group relative rounded-2xl border bg-gradient-to-br p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer",
                  noteColors[index % noteColors.length],
                  viewMode === "list" && "flex items-center gap-4"
                )}
              >
                {/* Pin indicator */}
                {note.pinned && (
                  <div className="absolute -top-2 -right-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
                      <Pin className="h-3 w-3" />
                    </div>
                  </div>
                )}

                <div className={cn(viewMode === "grid" ? "" : "flex-1")}>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-1">{note.title}</h3>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <motion.button whileHover={{ scale: 1.1 }} className="rounded-lg p-1.5 hover:bg-background/80"><Edit3 className="h-3.5 w-3.5 text-muted-foreground/60" /></motion.button>
                      <motion.button whileHover={{ scale: 1.1 }} className="rounded-lg p-1.5 hover:bg-red-500/10"><Trash2 className="h-3.5 w-3.5 text-red-500" /></motion.button>
                    </div>
                  </div>
                  <p className={cn("text-sm text-muted-foreground/60 leading-relaxed", viewMode === "grid" ? "line-clamp-3" : "line-clamp-1")}>{note.content}</p>
                  <div className="mt-3.5 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {note.tags.slice(0, viewMode === "list" ? 3 : undefined).map(t => (
                        <span key={t} className="inline-flex items-center gap-1 rounded-md bg-background/50 border border-border/50 px-2 py-0.5 text-[10px] font-medium text-muted-foreground/60">
                          <Hash className="h-2.5 w-2.5" />
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground/40 font-medium">
                      {note.starred && <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />}
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {note.updatedAt}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {displayNotes.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border py-16"
          >
            <div className="mb-4 rounded-full bg-muted/50 p-4">
              <FileText className="h-8 w-8 text-muted-foreground/40" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No notes found</h3>
            <p className="text-sm text-muted-foreground/60 mb-4">
              {search ? "Try a different search term" : "Create your first note to get started"}
            </p>
            <button className="flex items-center gap-2 rounded-xl bg-gradient-to-b from-primary to-primary/90 px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all duration-200">
              <Plus className="h-4 w-4" /> New Note
            </button>
          </motion.div>
        )}
      </motion.div>
    </PageWrapper>
  );
}