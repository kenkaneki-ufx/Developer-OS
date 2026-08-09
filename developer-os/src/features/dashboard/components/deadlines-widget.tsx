"use client";

import { motion } from "framer-motion";
import { Calendar, AlertTriangle, Clock, BookOpen, FileText, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UpcomingDeadlines, Deadline } from "../types";

interface DeadlinesWidgetProps {
  deadlines: UpcomingDeadlines;
}

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  project: BookOpen,
  milestone: Clock,
  other: Calendar,
};

const priorityColors: Record<string, string> = {
  high: "border-l-red-500",
  medium: "border-l-yellow-500",
  low: "border-l-blue-500",
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

function DeadlineCard({ deadline }: { deadline: Deadline; index: number }) {
  const Icon = typeIcons[deadline.type] || Calendar;
  const isUrgent = deadline.daysRemaining <= 3;

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ x: 4, scale: 1.01 }}
      className={cn(
        "flex items-center gap-3 rounded-xl border border-border border-l-4 p-3.5 transition-all duration-200 hover:shadow-md",
        priorityColors[deadline.priority],
        isUrgent ? "bg-red-500/5 hover:bg-red-500/10" : "hover:bg-muted/60"
      )}
    >
      <div
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-xl",
          isUrgent ? "bg-red-500/10" : "bg-muted/60"
        )}
      >
        <Icon
          className={cn("h-5 w-5", isUrgent ? "text-red-500" : "text-muted-foreground")}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-foreground truncate">
            {deadline.title}
          </p>
          {isUrgent && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <AlertTriangle className="h-3 w-3 text-red-500 flex-shrink-0" />
            </motion.div>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {deadline.description}
          {deadline.relatedSubject && ` • ${deadline.relatedSubject}`}
        </p>
      </div>
      <div className="text-right flex-shrink-0">
        <p
          className={cn(
            "text-sm font-semibold",
            isUrgent ? "text-red-500" : "text-muted-foreground"
          )}
        >
          {deadline.daysRemaining}d
        </p>
        <p className="text-[10px] text-muted-foreground">remaining</p>
      </div>
    </motion.div>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

export function DeadlinesWidget({ deadlines }: DeadlinesWidgetProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="rounded-2xl border border-border bg-card p-6 shadow-sm"
    >
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500/15 to-orange-500/10">
            <Calendar className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Upcoming Deadlines
            </h2>
            <p className="text-xs text-muted-foreground">
              Stay on track with your deadlines
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {deadlines.overdue > 0 && (
            <motion.span
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-flex items-center rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-semibold text-red-500 border border-red-500/20"
            >
              {deadlines.overdue} overdue
            </motion.span>
          )}
          {deadlines.dueThisWeek > 0 && (
            <span className="inline-flex items-center rounded-full bg-yellow-500/10 px-2.5 py-1 text-xs font-semibold text-yellow-600 dark:text-yellow-400 border border-yellow-500/20">
              {deadlines.dueThisWeek} this week
            </span>
          )}
        </div>
      </div>

      <motion.div variants={containerVariants} className="space-y-2.5">
        {deadlines.deadlines.map((deadline, index) => (
          <DeadlineCard key={deadline.id} deadline={deadline} index={index} />
        ))}
      </motion.div>
    </motion.div>
  );
}
