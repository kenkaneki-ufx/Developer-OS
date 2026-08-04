import { z } from "zod";

/**
 * Common validation schemas used across the application
 */

// ===========================================
// User & Auth
// ===========================================

export const emailSchema = z.string().email("Invalid email address");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(100, "Password must be less than 100 characters");

export const nameSchema = z
  .string()
  .min(1, "Name is required")
  .max(100, "Name must be less than 100 characters");

// ===========================================
// Projects
// ===========================================

export const projectSchema = z.object({
  name: z.string().min(1, "Project name is required").max(100),
  description: z.string().max(5000).optional(),
  status: z.enum(["PLANNING", "ACTIVE", "ON_HOLD", "COMPLETED", "ARCHIVED"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
  githubUrl: z.string().url().optional().or(z.literal("")),
  demoUrl: z.string().url().optional().or(z.literal("")),
  tags: z.array(z.string()).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type ProjectInput = z.infer<typeof projectSchema>;

// ===========================================
// Tasks
// ===========================================

export const taskSchema = z.object({
  title: z.string().min(1, "Task title is required").max(200),
  description: z.string().max(5000).optional(),
  projectId: z.string().optional(),
  milestoneId: z.string().optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "IN_REVIEW", "COMPLETED", "CANCELLED"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  category: z.string().optional(),
  topic: z.string().optional(),
  difficulty: z.number().min(1).max(5).optional(),
  estimatedMin: z.number().positive().optional(),
  dueDate: z.string().optional(),
  recurrence: z.enum(["daily", "weekly", "none"]).optional(),
});

export type TaskInput = z.infer<typeof taskSchema>;

// ===========================================
// Notes
// ===========================================

export const noteSchema = z.object({
  title: z.string().min(1, "Note title is required").max(200),
  content: z.string().min(1, "Note content is required"),
  folderId: z.string().optional(),
  type: z.enum(["markdown", "code", "link"]).optional(),
  isPinned: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
});

export type NoteInput = z.infer<typeof noteSchema>;

// ===========================================
// Study Sessions
// ===========================================

export const studySessionSchema = z.object({
  type: z.enum(["study", "coding", "reading", "revision"]),
  topic: z.string().max(200).optional(),
  startTime: z.string(),
  endTime: z.string().optional(),
  notes: z.string().max(2000).optional(),
  tags: z.array(z.string()).optional(),
});

export type StudySessionInput = z.infer<typeof studySessionSchema>;

// ===========================================
// Profile
// ===========================================

export const profileSchema = z.object({
  bio: z.string().max(500).optional(),

  github: z.string().max(100).optional(),
  linkedin: z.string().url().optional().or(z.literal("")),
  website: z.string().url().optional().or(z.literal("")),
  skills: z.array(z.string()).optional(),
});

export type ProfileInput = z.infer<typeof profileSchema>;

// ===========================================
// Settings
// ===========================================

export const settingsSchema = z.object({
  theme: z.enum(["dark", "light", "system"]),
  language: z.string(),
  timezone: z.string(),
  aiProvider: z.enum(["openai", "anthropic", "gemini"]),
  aiModel: z.string(),
  pomodoroLength: z.number().min(5).max(60),
  shortBreak: z.number().min(1).max(15),
  longBreak: z.number().min(5).max(30),
  dailyGoalHours: z.number().min(1).max(16),
});

export type SettingsInput = z.infer<typeof settingsSchema>;

// ===========================================
// Search
// ===========================================

export const searchSchema = z.object({
  query: z.string().min(1, "Search query is required").max(200),
  filters: z
    .object({
      type: z.enum(["all", "notes", "tasks", "projects", "dsa"]).optional(),
      dateRange: z
        .object({
          start: z.string().optional(),
          end: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
});

export type SearchInput = z.infer<typeof searchSchema>;

// ===========================================
// Pagination
// ===========================================

export const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export type PaginationInput = z.infer<typeof paginationSchema>;
