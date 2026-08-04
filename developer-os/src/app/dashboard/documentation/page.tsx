"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Search, ExternalLink, Plus, Clock, Star, TrendingUp, ArrowUpRight, Tag, Folder } from "lucide-react";
import { cn } from "@/lib/utils";
import { PageWrapper } from "@/components/ui/page-wrapper";

const docs = [
  { id: "1", title: "Next.js Documentation", url: "https://nextjs.org/docs", category: "Framework", tags: ["react", "nextjs"], lastVisited: "2 hours ago", color: "bg-blue-500/10 text-blue-600", icon: "⚡", visited: 45 },
  { id: "2", title: "TypeScript Handbook", url: "https://www.typescriptlang.org/docs", category: "Language", tags: ["typescript", "types"], lastVisited: "1 day ago", color: "bg-purple-500/10 text-purple-600", icon: "📘", visited: 32 },
  { id: "3", title: "Tailwind CSS Docs", url: "https://tailwindcss.com/docs", category: "Styling", tags: ["css", "tailwind"], lastVisited: "3 days ago", color: "bg-cyan-500/10 text-cyan-600", icon: "🎨", visited: 28 },
  { id: "4", title: "Prisma Documentation", url: "https://www.prisma.io/docs", category: "Database", tags: ["prisma", "orm"], lastVisited: "1 week ago", color: "bg-green-500/10 text-green-600", icon: "🗄️", visited: 18 },
  { id: "5", title: "React Documentation", url: "https://react.dev", category: "Framework", tags: ["react", "ui"], lastVisited: "2 days ago", color: "bg-blue-500/10 text-blue-600", icon: "⚛️", visited: 52 },
  { id: "6", title: "MDN Web Docs", url: "https://developer.mozilla.org", category: "Reference", tags: ["web", "api"], lastVisited: "5 days ago", color: "bg-accentOrange/10 text-accentOrange", icon: "📚", visited: 38 },
];

const categories = [
  { name: "All", icon: BookOpen, color: "text-gray-500" },
  { name: "Framework", icon: TrendingUp, color: "text-blue-500" },
  { name: "Language", icon: BookOpen, color: "text-purple-500" },
  { name: "Styling", icon: Tag, color: "text-cyan-500" },
  { name: "Database", icon: Folder, color: "text-green-500" },
  { name: "Reference", icon: BookOpen, color: "text-accentOrange" },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function DocumentationPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"recent" | "visited">("recent");
  
  const filtered = docs.filter(d => (category === "All" || d.category === category) && (d.title.toLowerCase().includes(search.toLowerCase()) || d.tags.some(t => t.includes(search.toLowerCase()))));
  
  const sortedDocs = [...filtered].sort((a, b) => {
    if (sortBy === "visited") return b.visited - a.visited;
    return 0;
  });

  return (
    <PageWrapper
      title="Documentation"
      subtitle="Your curated library of documentation"
      headerAction={
        <div className="flex items-center gap-2">
          <div className="flex gap-1 rounded-xl border border-border bg-muted/30 p-1">
            <button onClick={() => setSortBy("recent")} className={cn("rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200", sortBy === "recent" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground/60 hover:text-foreground hover:bg-muted/40")}>
              Recent
            </button>
            <button onClick={() => setSortBy("visited")} className={cn("rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200", sortBy === "visited" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground/60 hover:text-foreground hover:bg-muted/40")}>
              Most Visited
            </button>
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-b from-primary to-primary/90 px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200">
            <Plus className="h-4 w-4" /> Add Doc
          </motion.button>
        </div>
      }
    >
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        {/* Search and Filters */}
        <motion.div variants={item} className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/40" />
            <input type="text" placeholder="Search documentation..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full rounded-xl border border-border bg-muted/30 py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all duration-200" />
          </div>
          <div className="flex gap-1 rounded-xl border border-border bg-muted/30 p-1 overflow-x-auto">
            {categories.map(c => (
              <button key={c.name} onClick={() => setCategory(c.name)} className={cn("flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 whitespace-nowrap", category === c.name ? "bg-background text-foreground shadow-sm" : "text-muted-foreground/60 hover:text-foreground hover:bg-muted/40")}>
                <c.icon className={cn("h-3 w-3", c.color)} />
                {c.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div variants={item} className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="font-medium">{sortedDocs.length} docs</span>
          <span className="flex items-center gap-1"><Star className="h-3 w-3" /> {docs.length} total</span>
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Last updated: 2 hours ago</span>
        </motion.div>

        {/* Docs Grid */}
        <motion.div variants={item} className="grid gap-4 sm:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {sortedDocs.map((doc, index) => (
              <motion.a
                key={doc.id}
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:-translate-y-0.5"
              >
                {/* Background Gradient */}
                <div className={cn("absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-20", doc.color.split(" ")[0])} />

                <div className="relative">
                  <div className="flex items-start gap-4">
                    <div className={cn("flex h-14 w-14 items-center justify-center rounded-2xl flex-shrink-0 text-2xl", doc.color)}>
                      {doc.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200">{doc.title}</h3>
                        <ArrowUpRight className="h-4 w-4 text-muted-foreground/30 opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground/60">
                        <span className="font-medium">{doc.category}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {doc.lastVisited}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3" /> {doc.visited} visits</span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {doc.tags.map(t => (
                          <span key={t} className="inline-flex items-center gap-1 rounded-md bg-muted/40 border border-border/50 px-2 py-0.5 text-[10px] font-medium text-muted-foreground/60">
                            <Tag className="h-2.5 w-2.5" />
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.a>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {sortedDocs.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border py-16"
          >
            <div className="mb-4 rounded-full bg-muted/50 p-4">
              <BookOpen className="h-8 w-8 text-muted-foreground/40" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No documentation found</h3>
            <p className="text-sm text-muted-foreground/60 mb-4">
              {search ? "Try a different search term" : "Add your first documentation link to get started"}
            </p>
            <button className="flex items-center gap-2 rounded-xl bg-gradient-to-b from-primary to-primary/90 px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all duration-200">
              <Plus className="h-4 w-4" /> Add Documentation
            </button>
          </motion.div>
        )}
      </motion.div>
    </PageWrapper>
  );
}