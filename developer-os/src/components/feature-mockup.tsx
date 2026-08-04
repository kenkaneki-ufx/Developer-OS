"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Code,
  Brain,
  Check,
  Circle,
  ArrowUpRight,
  Clock,
  Zap,
  Search,
  Plus,
  Send,
} from "lucide-react";

type FeatureName = "AI-Powered Tasks" | "DSA Tracking" | "ML Roadmaps" | "Project Management" | "Smart Notes" | "Analytics Dashboard";

interface MockupProps {
  feature: FeatureName;
  gradient: string;
}

const TaskMockup = React.memo(function TaskMockup() {
  const tasks = [
    { text: "Review Arrays & Hashing notes", done: true, priority: "high" },
    { text: "Solve 2 medium DSA problems", done: false, priority: "high" },
    { text: "Update project README", done: true, priority: "low" },
    { text: "Study Binary Search patterns", done: false, priority: "medium" },
    { text: "Push GitHub commits", done: false, priority: "low" },
  ];
  return (
    <div className="w-full h-full p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2 mb-1">
        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-[10px] font-semibold text-muted-foreground/80">AI Generated Today</span>
      </div>
      {tasks.map((task, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="flex items-center gap-2.5 rounded-lg bg-muted/50 border border-border/50 px-3 py-2"
        >
          {task.done ? (
            <div className="h-4 w-4 rounded-full bg-green-500/20 flex items-center justify-center">
              <Check className="h-2.5 w-2.5 text-green-500" />
            </div>
          ) : (
            <Circle className="h-4 w-4 text-muted-foreground/30" />
          )}
          <span className={`text-[10px] flex-1 ${task.done ? "line-through text-muted-foreground/40" : "text-foreground/80"}`}>
            {task.text}
          </span>
          <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-medium ${
            task.priority === "high" ? "bg-red-500/10 text-red-500" :
            task.priority === "medium" ? "bg-yellow-500/10 text-yellow-500" :
            "bg-blue-500/10 text-blue-500"
          }`}>
            {task.priority}
          </span>
        </motion.div>
      ))}
      <div className="mt-auto flex items-center gap-2 rounded-lg border border-border/50 bg-muted/30 px-3 py-2">
        <Sparkles className="h-3 w-3 text-purple-500" />
        <span className="text-[9px] text-muted-foreground/40 flex-1">Ask AI to generate more tasks...</span>
        <Send className="h-3 w-3 text-muted-foreground/30" />
      </div>
    </div>
  );
});

const DSAMockup = React.memo(function DSAMockup() {
  const topics = [
    { name: "Arrays", solved: 18, total: 25, color: "bg-blue-500" },
    { name: "Trees", solved: 12, total: 20, color: "bg-green-500" },
    { name: "DP", solved: 5, total: 30, color: "bg-purple-500" },
    { name: "Graphs", solved: 8, total: 22, color: "bg-cyan-500" },
  ];
  return (
    <div className="w-full h-full p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-semibold text-foreground/80">DSA Progress</span>
        <span className="text-[9px] text-muted-foreground/60">43 / 97 solved</span>
      </div>
      <div className="h-3 rounded-full bg-muted/50 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "44%" }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        {topics.map((topic, i) => (
          <motion.div
            key={topic.name}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="rounded-lg bg-muted/50 border border-border/50 p-2.5"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[9px] font-medium text-foreground/70">{topic.name}</span>
              <span className="text-[8px] text-muted-foreground/50">{topic.solved}/{topic.total}</span>
            </div>
            <div className="h-1.5 rounded-full bg-muted/80 overflow-hidden">
              <div className={`h-full rounded-full ${topic.color}`} style={{ width: `${(topic.solved / topic.total) * 100}%` }} />
            </div>
          </motion.div>
        ))}
      </div>
      <div className="flex gap-1.5 mt-auto">
        {["Easy: 20", "Medium: 18", "Hard: 5"].map((label, i) => (
          <div key={i} className="flex-1 text-center rounded-md bg-muted/40 border border-border/30 py-1">
            <span className="text-[8px] text-muted-foreground/60">{label}</span>        </div>
      ))}
      </div>
    </div>
  );
});

const MLRoadmapMockup = React.memo(function MLRoadmapMockup() {
  const steps = [
    { title: "Python Basics", done: true },
    { title: "Linear Algebra", done: true },
    { title: "Statistics", done: true },
    { title: "ML Fundamentals", done: false, current: true },
    { title: "Deep Learning", done: false },
    { title: "Computer Vision", done: false },
  ];
  return (
    <div className="w-full h-full p-4 flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <Brain className="h-3.5 w-3.5 text-green-500" />
        <span className="text-[10px] font-semibold text-foreground/80">ML Learning Path</span>
      </div>
      <div className="flex-1 relative">
        <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-green-500 via-green-500/50 to-muted/30" />
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12 }}
            className="flex items-center gap-3 mb-3 relative"
          >
            <div className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 z-10 ${
              step.done ? "bg-green-500" :
              step.current ? "bg-green-500/20 border-2 border-green-500" :
              "bg-muted border border-border/50"
            }`}>
              {step.done && <Check className="h-3 w-3 text-white" />}
              {step.current && <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />}
            </div>
            <div className={`flex-1 rounded-lg px-3 py-2 ${
              step.current ? "bg-green-500/10 border border-green-500/20" :
              step.done ? "bg-muted/30" : "bg-muted/20"
            }`}>
              <span className={`text-[10px] font-medium ${
                step.done ? "text-muted-foreground/50 line-through" :
                step.current ? "text-green-600 dark:text-green-400" :
                "text-muted-foreground/60"
              }`}>
                {step.title}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
});

const ProjectMockup = React.memo(function ProjectMockup() {
  const projects = [
    { name: "Developer OS", progress: 75, color: "from-blue-500 to-purple-500", tech: "Next.js" },
    { name: "ML Classifier", progress: 40, color: "from-green-500 to-emerald-500", tech: "Python" },
    { name: "API Service", progress: 100, color: "from-orange-500 to-red-500", tech: "Node.js" },
  ];
  return (
    <div className="w-full h-full p-4 flex flex-col gap-2.5">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-semibold text-foreground/80">Projects</span>
        <div className="flex gap-1">
          <div className="h-5 w-5 rounded-md bg-muted/50 flex items-center justify-center">
            <Search className="h-2.5 w-2.5 text-muted-foreground/40" />
          </div>
          <div className="h-5 w-5 rounded-md bg-primary/20 flex items-center justify-center">
            <Plus className="h-2.5 w-2.5 text-primary" />
          </div>
        </div>
      </div>
      {projects.map((project, i) => (
        <motion.div
          key={project.name}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.12 }}
          className="rounded-lg bg-muted/40 border border-border/50 p-3"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className={`h-5 w-5 rounded-md bg-gradient-to-br ${project.color}`} />
              <span className="text-[10px] font-medium text-foreground/80">{project.name}</span>
            </div>
            <ArrowUpRight className="h-3 w-3 text-muted-foreground/30" />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full bg-muted/60 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${project.progress}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                className={`h-full rounded-full bg-gradient-to-r ${project.color}`}
              />
            </div>
            <span className="text-[8px] text-muted-foreground/50">{project.progress}%</span>
          </div>
          <div className="mt-1.5 flex items-center gap-1">
            <span className="text-[8px] text-muted-foreground/40 bg-muted/60 px-1.5 py-0.5 rounded">{project.tech}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
});

const NotesMockup = React.memo(function NotesMockup() {
  return (
    <div className="w-full h-full p-4 flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex gap-1">
          {["File", "Edit", "View"].map((t) => (
            <span key={t} className="text-[8px] text-muted-foreground/40 px-1.5 py-0.5 rounded bg-muted/30">{t}</span>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-1">
          <span className="text-[8px] text-muted-foreground/30">Preview</span>
          <div className="h-3 w-5 rounded bg-primary/20 flex items-center justify-center">
            <span className="text-[7px] text-primary font-medium">MD</span>
          </div>
        </div>
      </div>
      <div className="flex-1 flex gap-2">
        {/* Editor */}
        <div className="flex-1 rounded-lg bg-muted/30 border border-border/50 p-2.5 font-mono">
          <div className="text-[9px] text-foreground/60 mb-1"># DSA Study Notes</div>
          <div className="text-[9px] text-muted-foreground/50 mb-1.5">## Arrays</div>
          <div className="text-[8px] text-muted-foreground/40 mb-0.5">- Two pointer technique</div>
          <div className="text-[8px] text-muted-foreground/40 mb-0.5">- Sliding window</div>
          <div className="text-[8px] text-muted-foreground/40 mb-1.5">- Binary search on sorted</div>
          <div className="text-[9px] text-muted-foreground/50 mb-1">## Trees</div>
          <div className="text-[8px] text-muted-foreground/40 mb-0.5">- DFS / BFS traversal</div>
          <div className="text-[8px] text-muted-foreground/40">- BST operations</div>
        </div>
        {/* Preview */}
        <div className="flex-1 rounded-lg bg-muted/20 border border-border/50 p-2.5">
          <div className="text-[11px] font-bold text-foreground/80 mb-1.5">DSA Study Notes</div>
          <div className="text-[10px] font-semibold text-foreground/70 mb-1">Arrays</div>
          <ul className="space-y-0.5 mb-2">
            {["Two pointer technique", "Sliding window", "Binary search on sorted"].map((item) => (
              <li key={item} className="flex items-center gap-1">
                <div className="h-1 w-1 rounded-full bg-blue-500" />
                <span className="text-[8px] text-muted-foreground/60">{item}</span>
              </li>
            ))}
          </ul>
          <div className="text-[10px] font-semibold text-foreground/70 mb-1">Trees</div>
          <ul className="space-y-0.5">
            {["DFS / BFS traversal", "BST operations"].map((item) => (
              <li key={item} className="flex items-center gap-1">
                <div className="h-1 w-1 rounded-full bg-green-500" />
                <span className="text-[8px] text-muted-foreground/60">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-1.5">
        <span className="text-[7px] bg-muted/40 border border-border/30 px-1.5 py-0.5 rounded text-muted-foreground/40">#dsa</span>
        <span className="text-[7px] bg-muted/40 border border-border/30 px-1.5 py-0.5 rounded text-muted-foreground/40">#arrays</span>
        <span className="text-[7px] bg-muted/40 border border-border/30 px-1.5 py-0.5 rounded text-muted-foreground/40">#trees</span>
      </div>
    </div>
  );
});

const AnalyticsMockup = React.memo(function AnalyticsMockup() {
  const barData = [35, 50, 42, 65, 55, 70, 45, 80, 60, 75, 50, 90];
  const maxBar = Math.max(...barData);
  return (
    <div className="w-full h-full p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-semibold text-foreground/80">Weekly Activity</span>
        <span className="text-[8px] text-green-500 font-medium">+12% ↑</span>
      </div>
      {/* Mini bar chart */}
      <div className="flex items-end gap-1 h-16 flex-1">
        {barData.map((val, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            whileInView={{ height: `${(val / maxBar) * 100}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            className={`flex-1 rounded-t ${
              i === barData.length - 1 ? "bg-gradient-to-t from-primary to-primary/70" : "bg-muted/60"
            }`}
          />
        ))}
      </div>
      <div className="flex gap-1 text-[7px] text-muted-foreground/40">
        <span className="flex-1 text-center">Mon</span>
        <span className="flex-1 text-center">Tue</span>
        <span className="flex-1 text-center">Wed</span>
        <span className="flex-1 text-center">Thu</span>
        <span className="flex-1 text-center">Fri</span>
        <span className="flex-1 text-center">Sat</span>
        <span className="flex-1 text-center">Sun</span>
      </div>
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Study", value: "24h", icon: Clock },
          { label: "Coding", value: "18h", icon: Code },
          { label: "Streak", value: "12d", icon: Zap },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg bg-muted/40 border border-border/50 p-2 text-center">
            <stat.icon className="h-3 w-3 mx-auto mb-1 text-muted-foreground/50" />
            <div className="text-[11px] font-bold text-foreground/80">{stat.value}</div>
            <div className="text-[7px] text-muted-foreground/40">{stat.label}</div>        </div>
      ))}
      </div>
    </div>
  );
});

const mockups: Record<FeatureName, React.FC> = {
  "AI-Powered Tasks": TaskMockup,
  "DSA Tracking": DSAMockup,
  "ML Roadmaps": MLRoadmapMockup,
  "Project Management": ProjectMockup,
  "Smart Notes": NotesMockup,
  "Analytics Dashboard": AnalyticsMockup,
};

export function FeatureMockup({ feature, gradient }: MockupProps) {
  const MockupComponent = mockups[feature];

  if (!MockupComponent) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <span className="text-xs text-muted-foreground/40">Preview coming soon</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-[0.03]`} />
      {/* Content */}
      <MockupComponent />
    </div>
  );
}
