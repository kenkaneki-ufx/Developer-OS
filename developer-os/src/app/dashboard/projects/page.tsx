"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FolderKanban,
  Plus,
  ExternalLink,
  Clock,
  CheckCircle2,
  Star,
  Edit3,
  Trash2,
  X,
  Save,
  Link2,
  Code2,
  Download,
  Upload,
  FileJson,
  AlertCircle,
  Globe,
  Smartphone,
  Brain,
  Server,
  Paintbrush,
  Terminal,
  BookOpen,
  Rocket,
  Layout,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageWrapper } from "@/components/ui/page-wrapper";

interface Project {
  id: string;
  name: string;
  description: string;
  status: "active" | "completed" | "paused";
  progress: number;
  technologies: string[];
  tasks: { total: number; completed: number };
  deadline?: string;
  github?: string;
  gradient: string;
  starred: boolean;
}

const gradients = [
  "from-blue-500/20 to-purple-500/20",
  "from-green-500/20 to-emerald-500/20",
  "from-orange-500/20 to-red-500/20",
  "from-cyan-500/20 to-blue-500/20",
  "from-yellow-500/20 to-orange-500/20",
  "from-pink-500/20 to-rose-500/20",
  "from-violet-500/20 to-indigo-500/20",
  "from-teal-500/20 to-cyan-500/20",
];

const initialProjects: Project[] = [
  { id: "1", name: "Developer OS", description: "Your second brain for productivity", status: "active", progress: 15, technologies: ["Next.js", "TypeScript", "Tailwind", "Prisma"], tasks: { total: 45, completed: 7 }, deadline: "2026-12-31", github: "https://github.com/user/developer-os", gradient: gradients[0], starred: true },
  { id: "2", name: "ML Image Classifier", description: "Deep learning model for image classification", status: "active", progress: 60, technologies: ["Python", "TensorFlow", "OpenCV"], tasks: { total: 20, completed: 12 }, deadline: "2026-08-15", github: "https://github.com/user/ml-classifier", gradient: gradients[1], starred: false },
  { id: "3", name: "E-commerce API", description: "RESTful API for online store", status: "completed", progress: 100, technologies: ["Node.js", "Express", "MongoDB"], tasks: { total: 30, completed: 30 }, deadline: "2026-06-30", gradient: gradients[2], starred: false },
  { id: "4", name: "Chat Application", description: "Real-time messaging with WebSocket", status: "completed", progress: 100, technologies: ["React", "Socket.io", "Redis"], tasks: { total: 25, completed: 25 }, gradient: gradients[3], starred: true },
  { id: "5", name: "Portfolio Website", description: "Personal portfolio and blog", status: "paused", progress: 40, technologies: ["Next.js", "MDX", "Tailwind"], tasks: { total: 15, completed: 6 }, gradient: gradients[4], starred: false },
];

const statusConfig = {
  active: { label: "Active", className: "bg-green-500/10 text-green-600 border-green-500/20", icon: CheckCircle2 },
  completed: { label: "Completed", className: "bg-blue-500/10 text-blue-600 border-blue-500/20", icon: CheckCircle2 },
  paused: { label: "Paused", className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20", icon: Clock },
};

interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
  technologies: string[];
  tasks: { total: number; completed: number };
}

const projectTemplates: ProjectTemplate[] = [
  {
    id: "blank",
    name: "Blank Project",
    description: "Start from scratch with no pre-configured settings",
    icon: Rocket,
    gradient: "from-slate-500/20 to-gray-500/20",
    technologies: [],
    tasks: { total: 0, completed: 0 },
  },
  {
    id: "web-app",
    name: "Web Application",
    description: "Full-stack web app with frontend, backend, and database",
    icon: Globe,
    gradient: gradients[0],
    technologies: ["React", "TypeScript", "Node.js", "PostgreSQL", "Tailwind"],
    tasks: { total: 35, completed: 0 },
  },
  {
    id: "nextjs-app",
    name: "Next.js App",
    description: "Server-rendered React app with Next.js framework",
    icon: Layout,
    gradient: gradients[4],
    technologies: ["Next.js", "React", "TypeScript", "Prisma", "Tailwind"],
    tasks: { total: 30, completed: 0 },
  },
  {
    id: "mobile-app",
    name: "Mobile App",
    description: "Cross-platform mobile application",
    icon: Smartphone,
    gradient: gradients[5],
    technologies: ["React Native", "TypeScript", "Expo", "Firebase"],
    tasks: { total: 40, completed: 0 },
  },
  {
    id: "ml-project",
    name: "ML / AI Project",
    description: "Machine learning model with data pipeline and training",
    icon: Brain,
    gradient: gradients[6],
    technologies: ["Python", "TensorFlow", "Jupyter", "NumPy", "Pandas"],
    tasks: { total: 25, completed: 0 },
  },
  {
    id: "api-backend",
    name: "REST API / Backend",
    description: "Backend API service with authentication and database",
    icon: Server,
    gradient: gradients[1],
    technologies: ["Node.js", "Express", "MongoDB", "Redis", "Docker"],
    tasks: { total: 28, completed: 0 },
  },
  {
    id: "cli-tool",
    name: "CLI Tool",
    description: "Command-line utility or developer tool",
    icon: Terminal,
    gradient: gradients[2],
    technologies: ["Node.js", "TypeScript", "Commander"],
    tasks: { total: 18, completed: 0 },
  },
  {
    id: "design-system",
    name: "Design System / UI Kit",
    description: "Reusable component library and design tokens",
    icon: Paintbrush,
    gradient: gradients[3],
    technologies: ["React", "Storybook", "Tailwind", "Figma"],
    tasks: { total: 32, completed: 0 },
  },
  {
    id: "docs-site",
    name: "Documentation Site",
    description: "Technical documentation or knowledge base",
    icon: BookOpen,
    gradient: gradients[7],
    technologies: ["Next.js", "MDX", "Tailwind", "Algolia"],
    tasks: { total: 20, completed: 0 },
  },
];

const defaultFormData: ProjectFormData = {
  name: "",
  description: "",
  status: "active",
  progress: 0,
  technologies: [],
  tasks: { total: 0, completed: 0 },
  deadline: "",
  github: "",
  gradient: gradients[0],
  starred: false,
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [filter, setFilter] = useState<"all" | "active" | "completed" | "paused">("all");
  const [sortBy, setSortBy] = useState<"name" | "progress" | "deadline">("progress");
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<ProjectFormData>(defaultFormData);
  const [techInput, setTechInput] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [importPreview, setImportPreview] = useState<Project[] | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Close delete dialog on Escape key
  useEffect(() => {
    if (!deleteTarget && !showTemplateModal) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDeleteTarget(null);
        setShowTemplateModal(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [deleteTarget, showTemplateModal]);

  const filtered = filter === "all" ? projects : projects.filter((p) => p.status === filter);

  const sortedProjects = [...filtered].sort((a, b) => {
    if (sortBy === "progress") return b.progress - a.progress;
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "deadline") {
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    }
    return 0;
  });

  const activeCount = projects.filter((p) => p.status === "active").length;
  const completedCount = projects.filter((p) => p.status === "completed").length;

  const openCreateForm = (template?: ProjectTemplate) => {
    setEditingProject(null);
    if (template) {
      setFormData({
        name: template.name === "Blank Project" ? "" : template.name,
        description: template.description,
        status: "active",
        progress: 0,
        technologies: [...template.technologies],
        tasks: { ...template.tasks },
        deadline: "",
        github: "",
        gradient: template.gradient,
        starred: false,
      });
    } else {
      setFormData({ ...defaultFormData, gradient: gradients[Math.floor(Math.random() * gradients.length)] });
    }
    setShowTemplateModal(false);
    setShowForm(true);
  };

  const openEditForm = (project: Project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      description: project.description,
      status: project.status,
      progress: project.progress,
      technologies: [...project.technologies],
      tasks: { ...project.tasks },
      deadline: project.deadline || "",
      github: project.github || "",
      gradient: project.gradient,
      starred: project.starred,
    });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!formData.name.trim()) return;

    if (editingProject) {
      setProjects((prev) =>
        prev.map((p) => (p.id === editingProject.id ? { ...p, ...formData } : p))
      );
    } else {
      const newProject: Project = {
        ...formData,
        id: Date.now().toString(),
        deadline: formData.deadline || undefined,
        github: formData.github || undefined,
      };
      setProjects((prev) => [newProject, ...prev]);
    }
    setShowForm(false);
  };

  const confirmDelete = (project: Project) => {
    setDeleteTarget(project);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setProjects((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const toggleStar = (id: string) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, starred: !p.starred } : p)));
  };

  const addTech = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData((prev) => ({ ...prev, technologies: [...prev.technologies, techInput.trim()] }));
      setTechInput("");
    }
  };

  const removeTech = (tech: string) => {
    setFormData((prev) => ({ ...prev, technologies: prev.technologies.filter((t) => t !== tech) }));
  };

  // Export projects to JSON file
  const handleExport = () => {
    const exportData = {
      version: 1,
      exportedAt: new Date().toISOString(),
      projects: projects.map(({ id, ...rest }) => rest),
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `developer-os-projects-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Validate and parse imported JSON
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const raw = JSON.parse(event.target?.result as string);
        const importedProjects: Project[] = [];

        // Support both wrapped ({ projects: [...] }) and bare array formats
        const items = Array.isArray(raw) ? raw : raw.projects;
        if (!Array.isArray(items)) {
          setImportError("Invalid format: expected an array of projects.");
          return;
        }

        for (const item of items) {
          if (!item.name || typeof item.name !== "string") {
            setImportError(`Invalid project entry: missing or invalid "name" field.
${JSON.stringify(item).slice(0, 120)}`);
            return;
          }
          const project: Project = {
            id: `imported-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            name: String(item.name),
            description: String(item.description || ""),
            status: ["active", "completed", "paused"].includes(item.status) ? item.status : "active",
            progress: typeof item.progress === "number" ? Math.min(100, Math.max(0, item.progress)) : 0,
            technologies: Array.isArray(item.technologies) ? item.technologies.map(String) : [],
            tasks: {
              total: typeof item.tasks?.total === "number" ? item.tasks.total : 0,
              completed: typeof item.tasks?.completed === "number" ? item.tasks.completed : 0,
            },
            deadline: item.deadline ? String(item.deadline) : undefined,
            github: item.github ? String(item.github) : undefined,
            gradient: item.gradient || gradients[Math.floor(Math.random() * gradients.length)],
            starred: Boolean(item.starred),
          };
          importedProjects.push(project);
        }

        if (importedProjects.length === 0) {
          setImportError("No valid projects found in the file.");
          return;
        }

        setImportPreview(importedProjects);
      } catch {
        setImportError("Failed to parse JSON file. Please ensure it's a valid JSON file.");
      }
    };
    reader.readAsText(file);
    // Reset input so the same file can be re-selected
    e.target.value = "";
  };

  const handleConfirmImport = () => {
    if (!importPreview) return;
    setProjects((prev) => [...importPreview, ...prev]);
    setImportPreview(null);
  };

  return (
    <PageWrapper
      title="Projects"
      subtitle="Manage and track your projects"
      headerAction={
        <div className="flex items-center gap-2">
          <div className="flex gap-1 rounded-xl border border-border bg-muted/30 p-1">
            <button
              onClick={() => setSortBy("progress")}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200",
                sortBy === "progress" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground/60 hover:text-foreground hover:bg-muted/40"
              )}
            >
              By Progress
            </button>
            <button
              onClick={() => setSortBy("deadline")}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200",
                sortBy === "deadline" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground/60 hover:text-foreground hover:bg-muted/40"
              )}
            >
              By Deadline
            </button>
          </div>
          {/* Export button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExport}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all duration-200"
            title="Export projects to JSON"
          >
            <Download className="h-4 w-4" />
          </motion.button>
          {/* Import button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setImportError(null);
              fileInputRef.current?.click();
            }}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all duration-200"
            title="Import projects from JSON"
          >
            <Upload className="h-4 w-4" />
          </motion.button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleImportFile}
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowTemplateModal(true)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-b from-primary to-primary/90 px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200"
          >
            <Plus className="h-4 w-4" /> New Project
          </motion.button>
        </div>
      }
    >
      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-3 mb-6">
        {[
          { label: "Total Projects", value: projects.length, color: "text-foreground" },
          { label: "Active", value: activeCount, color: "text-green-600" },
          { label: "Completed", value: completedCount, color: "text-blue-600" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className="rounded-xl border border-border bg-card p-4 text-center"
          >
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground/60 font-medium">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 rounded-xl border border-border bg-muted/30 p-1 mb-6">
        {(["all", "active", "completed", "paused"] as const).map((f) => (
          <motion.button
            key={f}
            whileTap={{ scale: 0.97 }}
            onClick={() => setFilter(f)}
            className={cn(
              "flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200",
              filter === f ? "bg-background text-foreground shadow-sm" : "text-muted-foreground/60 hover:text-foreground hover:bg-muted/40"
            )}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f !== "all" && (
              <span className="ml-1.5 text-xs text-muted-foreground/40">
                ({projects.filter((p) => p.status === f).length})
              </span>
            )}
          </motion.button>
        ))}
      </div>

      {/* Projects grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {sortedProjects.map((project, index) => {
            const status = statusConfig[project.status];
            const daysUntilDeadline = project.deadline ? Math.ceil((new Date(project.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;

            return (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/15 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5"
              >
                {/* Gradient background decoration */}
                <div className={cn("absolute -right-10 -top-10 h-36 w-36 rounded-full bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-3xl", project.gradient)} />

                <div className="relative">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2.5">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                          {project.name}
                        </h3>
                        <motion.button
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => toggleStar(project.id)}
                          className="cursor-pointer"
                        >
                          <Star className={cn("h-4 w-4 transition-colors", project.starred ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30 hover:text-yellow-400")} />
                        </motion.button>
                        <span className={cn("rounded-lg border px-2.5 py-0.5 text-[10px] font-bold", status.className)}>
                          {status.label}
                        </span>
                      </div>
                      <p className="mt-1.5 text-sm text-muted-foreground/60 line-clamp-2">{project.description}</p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => openEditForm(project)}
                        className="rounded-lg p-1.5 hover:bg-muted/60"
                        title="Edit project"
                      >
                        <Edit3 className="h-4 w-4 text-muted-foreground/60" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => confirmDelete(project)}
                        className="rounded-lg p-1.5 hover:bg-red-500/10"
                        title="Delete project"
                      >
                        <Trash2 className="h-4 w-4 text-red-400/60 hover:text-red-500" />
                      </motion.button>
                      {project.github && (
                        <motion.a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.1 }}
                          className="rounded-lg p-1.5 hover:bg-muted/60"
                        >
                          <ExternalLink className="h-4 w-4 text-muted-foreground/60" />
                        </motion.a>
                      )}
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs text-muted-foreground/60 mb-1.5">
                      <span className="font-medium">Progress</span>
                      <span className="font-semibold text-foreground">{project.progress}%</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-muted/40">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${project.progress}%` }}
                        transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                        className={cn(
                          "h-full rounded-full",
                          project.progress === 100
                            ? "bg-gradient-to-r from-green-500 to-emerald-500"
                            : project.progress > 50
                            ? "bg-gradient-to-r from-primary to-primary/70"
                            : "bg-gradient-to-r from-primary/70 to-primary/50"
                        )}
                      />
                    </div>
                  </div>

                  {/* Footer info */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground/60">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span className="font-medium">{project.tasks.completed}/{project.tasks.total} tasks</span>
                    </div>
                    {daysUntilDeadline !== null && (
                      <div className={cn("flex items-center gap-1.5 font-medium", daysUntilDeadline < 7 ? "text-orange-500" : "text-muted-foreground/60")}>
                        <Clock className="h-3.5 w-3.5" />
                        <span>{daysUntilDeadline < 0 ? "Overdue" : `${daysUntilDeadline}d left`}</span>
                      </div>
                    )}
                  </div>

                  {/* Tech tags */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="rounded-md bg-muted/40 border border-border/50 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground/60">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {sortedProjects.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border py-16"
        >
          <div className="mb-4 rounded-full bg-muted/50 p-4">
            <FolderKanban className="h-8 w-8 text-muted-foreground/40" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No projects found</h3>
          <p className="text-sm text-muted-foreground/60 mb-4">
            {filter !== "all" ? "Try a different filter" : "Create your first project to get started"}
          </p>
          <button
            onClick={() => setShowTemplateModal(true)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-b from-primary to-primary/90 px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all duration-200"
          >
            <Plus className="h-4 w-4" /> New Project
          </button>
        </motion.div>
      )}

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="w-full max-w-lg rounded-2xl border border-border bg-background p-6 shadow-2xl max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground">
                  {editingProject ? "Edit Project" : "Create New Project"}
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Project Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., My Awesome App"
                    className="w-full rounded-xl border border-border bg-muted/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                    autoFocus
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="What is this project about?"
                    rows={2}
                    className="w-full rounded-xl border border-border bg-muted/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all resize-none"
                  />
                </div>

                {/* Status + Progress */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Status</label>
                    <div className="flex gap-1.5">
                      {(["active", "completed", "paused"] as const).map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, status: s }))}
                          className={cn(
                            "flex-1 rounded-lg border px-2 py-2 text-xs font-medium transition-all",
                            formData.status === s
                              ? statusConfig[s].className + " border-2"
                              : "border-border text-muted-foreground hover:bg-muted"
                          )}
                        >
                          {statusConfig[s].label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Progress: {formData.progress}%</label>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={formData.progress}
                      onChange={(e) => setFormData((prev) => ({ ...prev, progress: Number(e.target.value) }))}
                      className="w-full h-2 rounded-full appearance-none cursor-pointer accent-primary bg-muted/40"
                    />
                  </div>
                </div>

                {/* Tasks */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Total Tasks</label>
                    <input
                      type="number"
                      value={formData.tasks.total}
                      onChange={(e) => setFormData((prev) => ({ ...prev, tasks: { ...prev.tasks, total: Number(e.target.value) } }))}
                      min={0}
                      className="w-full rounded-xl border border-border bg-muted/50 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Completed Tasks</label>
                    <input
                      type="number"
                      value={formData.tasks.completed}
                      onChange={(e) => setFormData((prev) => ({ ...prev, tasks: { ...prev.tasks, completed: Number(e.target.value) } }))}
                      min={0}
                      max={formData.tasks.total}
                      className="w-full rounded-xl border border-border bg-muted/50 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                    />
                  </div>
                </div>

                {/* Deadline + GitHub */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      <Clock className="inline h-4 w-4 mr-1" />
                      Deadline
                    </label>
                    <input
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => setFormData((prev) => ({ ...prev, deadline: e.target.value }))}
                      className="w-full rounded-xl border border-border bg-muted/50 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      <Link2 className="inline h-4 w-4 mr-1" />
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      value={formData.github}
                      onChange={(e) => setFormData((prev) => ({ ...prev, github: e.target.value }))}
                      placeholder="https://github.com/..."
                      className="w-full rounded-xl border border-border bg-muted/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                    />
                  </div>
                </div>

                {/* Technologies */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    <Code2 className="inline h-4 w-4 mr-1" />
                    Technologies
                  </label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {formData.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center gap-1 rounded-lg bg-primary/10 border border-primary/15 px-2.5 py-1 text-xs font-medium text-primary"
                      >
                        {tech}
                        <button type="button" onClick={() => removeTech(tech)} className="hover:text-primary/70">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTech())}
                      placeholder="Add technology..."
                      className="flex-1 rounded-xl border border-border bg-muted/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                    />
                    <button
                      type="button"
                      onClick={addTech}
                      className="rounded-xl bg-muted px-3 py-2 text-sm font-medium text-foreground hover:bg-muted/80 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Starred toggle */}
                <div className="flex items-center justify-between rounded-xl border border-border bg-muted/30 p-4">
                  <div className="flex items-center gap-3">
                    <Star className={cn("h-5 w-5", formData.starred ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/40")} />
                    <div>
                      <p className="text-sm font-medium text-foreground">Star Project</p>
                      <p className="text-xs text-muted-foreground/60">Mark as important</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, starred: !prev.starred }))}
                    className={cn(
                      "relative h-6 w-11 rounded-full transition-colors duration-300",
                      formData.starred ? "bg-yellow-400" : "bg-muted border border-border"
                    )}
                  >
                    <motion.div
                      className="absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm"
                      animate={{ left: formData.starred ? 22 : 4 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => setShowForm(false)}
                    className="rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    disabled={!formData.name.trim()}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-b from-primary to-primary/90 px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200 disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    {editingProject ? "Save Changes" : "Create Project"}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Delete Confirmation Dialog */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setDeleteTarget(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="w-full max-w-sm rounded-2xl border border-border bg-background p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-red-500/10 p-3">
                  <Trash2 className="h-6 w-6 text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">Delete Project</h3>
                <p className="text-sm text-muted-foreground/60 mb-1">
                  Are you sure you want to delete <span className="font-medium text-foreground">{deleteTarget.name}</span>?
                </p>
                <p className="text-xs text-muted-foreground/40 mb-6">This action cannot be undone.</p>
                <div className="flex w-full gap-3">
                  <button
                    onClick={() => setDeleteTarget(null)}
                    autoFocus
                    className="flex-1 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDelete}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-500/25 hover:bg-red-600 transition-all duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Import Preview Modal */}
      <AnimatePresence>
        {(importPreview || importError) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => { setImportPreview(null); setImportError(null); }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="w-full max-w-lg rounded-2xl border border-border bg-background p-6 shadow-2xl max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {importError ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-red-500/10 p-2">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      </div>
                      <h2 className="text-lg font-semibold text-foreground">Import Failed</h2>
                    </div>
                    <button
                      onClick={() => setImportError(null)}
                      className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground/60 mb-6 whitespace-pre-wrap">{importError}</p>
                  <div className="flex justify-end">
                    <button
                      onClick={() => setImportError(null)}
                      className="rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </>
              ) : importPreview ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-primary/10 p-2">
                        <FileJson className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-foreground">Import Projects</h2>
                        <p className="text-xs text-muted-foreground/60">{importPreview.length} project{importPreview.length !== 1 ? "s" : ""} found</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setImportPreview(null)}
                      className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  {/* Preview list */}
                  <div className="space-y-2 mb-6 max-h-[40vh] overflow-y-auto">
                    {importPreview.map((project, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-3"
                      >
                        <div className={cn("h-8 w-8 shrink-0 rounded-lg bg-gradient-to-br", project.gradient)} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{project.name}</p>
                          <p className="text-xs text-muted-foreground/60 truncate">{project.description || "No description"}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={cn("rounded-md border px-2 py-0.5 text-[10px] font-bold", statusConfig[project.status].className)}>
                            {statusConfig[project.status].label}
                          </span>
                          <span className="text-xs font-semibold text-muted-foreground/60">{project.progress}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-end gap-3">
                    <button
                      onClick={() => setImportPreview(null)}
                      className="rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
                    >
                      Cancel
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleConfirmImport}
                      className="flex items-center gap-2 rounded-xl bg-gradient-to-b from-primary to-primary/90 px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200"
                    >
                      <Upload className="h-4 w-4" />
                      Import {importPreview.length} Project{importPreview.length !== 1 ? "s" : ""}
                    </motion.button>
                  </div>
                </>
              ) : null}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Template Picker Modal */}
      <AnimatePresence>
        {showTemplateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowTemplateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="w-full max-w-2xl rounded-2xl border border-border bg-background p-6 shadow-2xl max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Choose a Template</h2>
                  <p className="text-sm text-muted-foreground/60">Select a project template to get started quickly</p>
                </div>
                <button
                  onClick={() => setShowTemplateModal(false)}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {projectTemplates.map((template, i) => {
                  const Icon = template.icon;
                  return (
                    <motion.button
                      key={template.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => openCreateForm(template)}
                      className="group relative overflow-hidden rounded-xl border border-border bg-card p-4 text-left transition-all duration-200 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
                    >
                      <div className={cn("absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl", template.gradient)} />
                      <div className="relative">
                        <div className={cn("mb-3 inline-flex rounded-xl bg-gradient-to-br p-2.5 shadow-md", template.gradient)}>
                          <Icon className="h-5 w-5 text-foreground" />
                        </div>
                        <h3 className="text-sm font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">{template.name}</h3>
                        <p className="text-xs text-muted-foreground/60 line-clamp-2 mb-2">{template.description}</p>
                        {template.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {template.technologies.slice(0, 3).map((tech) => (
                              <span key={tech} className="rounded-md bg-muted/40 px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground/60">
                                {tech}
                              </span>
                            ))}
                            {template.technologies.length > 3 && (
                              <span className="rounded-md bg-muted/40 px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground/40">
                                +{template.technologies.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}
