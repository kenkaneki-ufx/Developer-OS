"use client";

import { motion } from "framer-motion";
import { FolderKanban, ExternalLink, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProjectsOverview, Project } from "../types";

interface ProjectsWidgetProps {
  projects: ProjectsOverview;
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="group rounded-xl border border-border p-4 transition-all duration-200 hover:bg-muted/30 hover:border-primary/15 hover:shadow-sm"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors duration-200">
              {project.name}
            </h3>
            {project.githubUrl && (
              <motion.a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                className="text-muted-foreground/40 hover:text-foreground transition-colors"
              >
                <ExternalLink className="h-3 w-3" />
              </motion.a>
            )}
          </div>
          {project.description && (
            <p className="mt-1 text-xs text-muted-foreground/60 truncate">
              {project.description}
            </p>
          )}
        </div>
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground/60 mb-1.5">
          <span className="font-medium">{project.progress}% complete</span>
          <span className="font-medium">
            {project.completedTasksCount}/{project.tasksCount} tasks
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-muted/50">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${project.progress}%` }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "h-full rounded-full",
              project.progress >= 75
                ? "bg-gradient-to-r from-green-500 to-emerald-500"
                : project.progress >= 50
                  ? "bg-gradient-to-r from-blue-500 to-cyan-500"
                  : project.progress >= 25
                    ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                    : "bg-gradient-to-r from-primary to-primary/70"
            )}
          />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {project.technologies.slice(0, 4).map((tech) => (
          <span
            key={tech}
            className="inline-flex items-center rounded-md bg-muted/50 border border-border/50 px-2 py-0.5 text-[10px] font-medium text-muted-foreground/70"
          >
            {tech}
          </span>
        ))}
        {project.technologies.length > 4 && (
          <span className="text-[10px] text-muted-foreground/50 font-medium">
            +{project.technologies.length - 4}
          </span>
        )}
      </div>
    </motion.div>
  );
}

export function ProjectsWidget({ projects }: ProjectsWidgetProps) {
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
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">Projects</h2>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground/70">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="h-2 w-2 rounded-full bg-green-500 shadow-sm shadow-green-500/30" />
            {projects.activeCount} active
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="h-3 w-3" />
            {projects.completedCount} done
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {projects.activeProjects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </motion.div>
  );
}
