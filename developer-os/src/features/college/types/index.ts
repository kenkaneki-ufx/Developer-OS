/**
 * College Planner Types
 *
 * Features: Timetable, Subjects, Exams, Syllabus
 */

// ============================================
// College Details Types
// ============================================

export interface CollegeDetails {
  university: string;
  course: string;
  branch: string;
  year: number;
  semester: number;
}

export interface UniversityData {
  name: string;
  courses: CourseData[];
}

export interface CourseData {
  name: string;
  branches: BranchData[];
}

export interface BranchData {
  name: string;
  semesters: SemesterData[];
}

export interface SemesterData {
  number: number;
  subjects: SyllabusSubject[];
}

export interface SyllabusSubject {
  name: string;
  code: string;
  credits: number;
  topics: string[];
}

export interface ExamSchedule {
  id: string;
  title: string;
  subjectId: string;
  date: string;
  time: string;
  location: string;
  type: ExamType;
  syllabus: string[];
  notes: string;
}

// ============================================
// Day & Time Types
// ============================================

export type DayOfWeek = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

export const DAYS: { value: DayOfWeek; label: string; shortLabel: string }[] = [
  { value: "monday", label: "Monday", shortLabel: "Mon" },
  { value: "tuesday", label: "Tuesday", shortLabel: "Tue" },
  { value: "wednesday", label: "Wednesday", shortLabel: "Wed" },
  { value: "thursday", label: "Thursday", shortLabel: "Thu" },
  { value: "friday", label: "Friday", shortLabel: "Fri" },
  { value: "saturday", label: "Saturday", shortLabel: "Sat" },
  { value: "sunday", label: "Sunday", shortLabel: "Sun" },
];

// ============================================
// Subject Types
// ============================================

export interface Subject {
  id: string;
  name: string;
  code: string;
  instructor: string;
  color: string;
  credits: number;
  syllabusTopics: SyllabusTopic[];
  totalClasses?: number;
  attendedClasses?: number;
}

export interface SyllabusTopic {
  id: string;
  name: string;
  completed: boolean;
}

// ============================================
// Timetable Types
// ============================================

export interface TimetableSlot {
  id: string;
  day: DayOfWeek;
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  subjectId: string;
  type: ClassType;
  location: string;
  color: string;
}

export type ClassType = "lecture" | "lab" | "tutorial" | "break";

export const CLASS_TYPE_CONFIG: Record<ClassType, { label: string; bgColor: string }> = {
  lecture: { label: "Lecture", bgColor: "bg-indigo-500/10 text-indigo-500" },
  lab: { label: "Lab", bgColor: "bg-teal-500/10 text-teal-500" },
  tutorial: { label: "Tutorial", bgColor: "bg-cyan-500/10 text-cyan-500" },
  break: { label: "Break", bgColor: "bg-yellow-500/10 text-yellow-500" },
};

// ============================================
// Exam Types
// ============================================

export type ExamType = "internal" | "midterm" | "final" | "practical";

export interface Exam {
  id: string;
  title: string;
  subjectId: string;
  date: string; // ISO date string
  time: string;
  location: string;
  type: ExamType;
  syllabus: string[];
  notes: string;
  isFetched?: boolean;
}

export const EXAM_TYPE_CONFIG: Record<ExamType, { label: string; color: string }> = {
  internal: { label: "Internal", color: "bg-blue-500" },
  midterm: { label: "Midterm", color: "bg-accentOrange" },
  final: { label: "Final", color: "bg-red-500" },
  practical: { label: "Practical", color: "bg-green-500" },
};

// ============================================
// Assignment Types
// ============================================

export type AssignmentStatus = "pending" | "in-progress" | "completed";
export type AssignmentPriority = "low" | "medium" | "high";

export interface Assignment {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  dueDate: string; // ISO date string
  status: AssignmentStatus;
  priority: AssignmentPriority;
  createdAt: string;
}

// ============================================
// College Data (Main State)
// ============================================

export interface CollegeData {
  collegeDetails: CollegeDetails | null;
  semester: string;
  subjects: Subject[];
  timetable: TimetableSlot[];
  assignments: Assignment[];
  exams: Exam[];
}
