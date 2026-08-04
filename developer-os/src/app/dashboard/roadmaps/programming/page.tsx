"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Map, CheckCircle2, Circle, Clock, BookOpen, Code, Zap, Target, TrendingUp, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { PageWrapper } from "@/components/ui/page-wrapper";

const roadmapItems = [
  { id: "1", name: "HTML & CSS Fundamentals", phase: "Foundation", status: "completed", progress: 100, resources: 12 },
  { id: "2", name: "JavaScript Basics", phase: "Foundation", status: "completed", progress: 100, resources: 15 },
  { id: "3", name: "TypeScript", phase: "Foundation", status: "in-progress", progress: 45, resources: 8 },
  { id: "4", name: "React & Next.js", phase: "Frontend", status: "pending", progress: 0, resources: 20 },
  { id: "5", name: "Node.js & Express", phase: "Backend", status: "pending", progress: 0, resources: 18 },
  { id: "6", name: "PostgreSQL & Prisma", phase: "Database", status: "pending", progress: 0, resources: 10 },
  { id: "7", name: "REST APIs & GraphQL", phase: "Backend", status: "pending", progress: 0, resources: 14 },
  { id: "8", name: "Docker & Deployment", phase: "DevOps", status: "pending", progress: 0, resources: 12 },
  { id: "9", name: "Testing (Jest, Cypress)", phase: "Quality", status: "pending", progress: 0, resources: 10 },
  { id: "10", name: "System Design", phase: "Architecture", status: "pending", progress: 0, resources: 15 },
];

const phases = [
  { name: "Foundation", icon: BookOpen, color: "text-blue-500", bg: "bg-blue-500/10", gradient: "from-blue-500 to-cyan-500" },
  { name: "Frontend", icon: Code, color: "text-purple-500", bg: "bg-purple-500/10", gradient: "from-purple-500 to-pink-500" },
  { name: "Backend", icon: Zap, color: "text-green-500", bg: "bg-green-500/10", gradient: "from-green-500 to-emerald-500" },
  { name: "Database", icon: Target, color: "text-accentOrange", bg: "bg-accentOrange/10", gradient: "from-accentOrange to-red-500" },
  { name: "DevOps", icon: TrendingUp, color: "text-cyan-500", bg: "bg-cyan-500/10", gradient: "from-cyan-500 to-blue-500" },
  { name: "Quality", icon: CheckCircle2, color: "text-yellow-500", bg: "bg-yellow-500/10", gradient: "from-yellow-500 to-accentOrange" },
  { name: "Architecture", icon: Map, color: "text-pink-500", bg: "bg-pink-500/10", gradient: "from-pink-500 to-rose-500" },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function ProgrammingRoadmapPage() {
  const [expandedPhase, setExpandedPhase] = useState<string | null>("Foundation");
  
  const completedCount = roadmapItems.filter(i => i.status === "completed").length;
  const inProgressCount = roadmapItems.filter(i => i.status === "in-progress").length;
  const overallProgress = Math.round(roadmapItems.reduce((acc, i) => acc + i.progress, 0) / roadmapItems.length);

  const getPhaseProgress = (phaseName: string) => {
    const phaseItems = roadmapItems.filter(i => i.phase === phaseName);
    return Math.round(phaseItems.reduce((acc, i) => acc + i.progress, 0) / phaseItems.length);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-600";
      case "in-progress": return "text-blue-600";
      default: return "text-muted-foreground/40";
    }
  };

  return (
    <PageWrapper title="Programming Roadmap" subtitle="Your full-stack development learning path">
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        {/* Stats Overview */}
        <motion.div variants={item} className="grid gap-3 sm:grid-cols-4">
          {[
            { label: "Overall Progress", value: `${overallProgress}%`, color: "text-primary", bg: "bg-primary/10" },
            { label: "Completed", value: completedCount, color: "text-green-600", bg: "bg-green-500/10" },
            { label: "In Progress", value: inProgressCount, color: "text-blue-600", bg: "bg-blue-500/10" },
            { label: "Remaining", value: roadmapItems.length - completedCount - inProgressCount, color: "text-muted-foreground/70", bg: "bg-muted/50" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              className="rounded-xl border border-border bg-card p-5 text-center"
            >
              <p className={cn("text-2xl font-bold", stat.color)}>{stat.value}</p>
              <p className="text-xs text-muted-foreground/60 font-medium mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Overall Progress */}
        <motion.div variants={item} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Overall Progress</h2>
            <span className="text-sm text-muted-foreground/70 font-medium">{completedCount}/{roadmapItems.length} completed</span>
          </div>
          <div className="h-4 overflow-hidden rounded-full bg-muted/40">
            <motion.div initial={{ width: 0 }} animate={{ width: `${overallProgress}%` }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70" />
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-sm font-semibold gradient-text">{overallProgress}% complete</p>
            <p className="text-xs text-muted-foreground/60">{roadmapItems.length - completedCount} topics remaining</p>
          </div>
        </motion.div>

        {/* Roadmap Phases */}
        <div className="space-y-4">
          {phases.map((phase) => {
            const phaseItems = roadmapItems.filter(i => i.phase === phase.name);
            const phaseProgress = getPhaseProgress(phase.name);
            const isExpanded = expandedPhase === phase.name;

            if (phaseItems.length === 0) return null;

            return (
              <motion.div key={phase.name} variants={item} className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
                {/* Phase Header */}
                <button
                  onClick={() => setExpandedPhase(isExpanded ? null : phase.name)}
                  className="flex items-center justify-between w-full p-5 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn("rounded-xl p-2.5", phase.bg)}>
                      <phase.icon className={cn("h-5 w-5", phase.color)} />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-foreground">{phase.name}</h3>
                      <p className="text-xs text-muted-foreground/60 mt-0.5">{phaseItems.length} topics • {phaseProgress}% complete</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-24">
                      <div className="h-2 overflow-hidden rounded-full bg-muted/40">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${phaseProgress}%` }}
                          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                          className={cn("h-full rounded-full bg-gradient-to-r", phase.gradient)} />
                      </div>
                    </div>
                    {isExpanded ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
                  </div>
                </button>

                {/* Phase Items */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 space-y-2">
                        {phaseItems.map((topic, index) => (
                          <motion.div
                            key={topic.id}
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            className={cn(
                              "flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:border-primary/15 hover:shadow-sm",
                              topic.status === "completed" && "opacity-70"
                            )}
                          >
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted/50">
                              {topic.status === "completed" ? (
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                              ) : topic.status === "in-progress" ? (
                                <Clock className="h-5 w-5 text-blue-600" />
                              ) : (
                                <Circle className="h-5 w-5 text-muted-foreground/40" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium text-foreground">{topic.name}</h4>
                                <span className="flex items-center gap-1 text-xs text-muted-foreground/60">
                                  <BookOpen className="h-3 w-3" />
                                  {topic.resources} resources
                                </span>
                              </div>
                              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted/40">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${topic.progress}%` }}
                                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                  className={cn(
                                    "h-full rounded-full",
                                    topic.progress === 100 ? "bg-gradient-to-r from-green-500 to-emerald-500" :
                                    topic.progress > 0 ? "bg-gradient-to-r from-primary to-primary/70" : "bg-muted"
                                  )} />
                              </div>
                            </div>
                            <div className="text-right">
                              <span className={cn("text-sm font-semibold", getStatusColor(topic.status))}>{topic.progress}%</span>
                              {topic.status === "in-progress" && (
                                <p className="text-[10px] text-blue-500 font-medium mt-0.5">In Progress</p>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Currently Learning */}
        <motion.div variants={item} className="relative overflow-hidden rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/5 via-card to-primary/[0.03] p-6 shadow-sm">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/5 blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-semibold text-primary">Currently Learning</span>
            </div>
            <h3 className="text-xl font-bold text-foreground">TypeScript</h3>
            <p className="text-muted-foreground/70 text-sm mt-1">45% complete • 3/8 topics done</p>
          </div>
        </motion.div>
      </motion.div>
    </PageWrapper>
  );
}