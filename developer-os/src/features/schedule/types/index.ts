/**
 * Weekly Schedule Types
 *
 * General-purpose weekly schedule planner.
 * This schedule repeats every week but can be edited if anything changes.
 */

// ============================================
// Schedule Types
// ============================================

export type DayOfWeek = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

export type SlotType = "work" | "study" | "exercise" | "break" | "meeting" | "personal" | "college" | "lab" | "tutorial" | "other";

export interface ScheduleSlot {
  id: string;
  day: DayOfWeek;
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  type: SlotType;
  title: string;
  description?: string;
  location?: string;
  color: string;
}

export interface WeeklySchedule {
  id: string;
  name: string;
  isActive: boolean;
  timeSlots: ScheduleSlot[];
  createdAt: string;
  updatedAt: string;
}

export interface DaySchedule {
  day: DayOfWeek;
  label: string;
  slots: ScheduleSlot[];
  totalSlots: number;
  totalHours: number;
}

// ============================================
// Constants
// ============================================

export const DEFAULT_DAYS: { value: DayOfWeek; label: string; shortLabel: string; isWeekend: boolean }[] = [
  { value: "monday", label: "Monday", shortLabel: "Mon", isWeekend: false },
  { value: "tuesday", label: "Tuesday", shortLabel: "Tue", isWeekend: false },
  { value: "wednesday", label: "Wednesday", shortLabel: "Wed", isWeekend: false },
  { value: "thursday", label: "Thursday", shortLabel: "Thu", isWeekend: false },
  { value: "friday", label: "Friday", shortLabel: "Fri", isWeekend: false },
  { value: "saturday", label: "Saturday", shortLabel: "Sat", isWeekend: true },
  { value: "sunday", label: "Sunday", shortLabel: "Sun", isWeekend: true },
];

export const SLOT_TYPE_CONFIG: Record<SlotType, { label: string; color: string; bgColor: string }> = {
  work: { label: "Work", color: "bg-blue-500", bgColor: "bg-blue-500/10 text-blue-500" },
  study: { label: "Study", color: "bg-purple-500", bgColor: "bg-purple-500/10 text-purple-500" },
  exercise: { label: "Exercise", color: "bg-green-500", bgColor: "bg-green-500/10 text-green-500" },
  break: { label: "Break", color: "bg-yellow-500", bgColor: "bg-yellow-500/10 text-yellow-500" },
  meeting: { label: "Meeting", color: "bg-accentOrange", bgColor: "bg-accentOrange/10 text-accentOrange" },
  personal: { label: "Personal", color: "bg-pink-500", bgColor: "bg-pink-500/10 text-pink-500" },
  college: { label: "Class", color: "bg-indigo-500", bgColor: "bg-indigo-500/10 text-indigo-500" },
  lab: { label: "Lab", color: "bg-teal-500", bgColor: "bg-teal-500/10 text-teal-500" },
  tutorial: { label: "Tutorial", color: "bg-cyan-500", bgColor: "bg-cyan-500/10 text-cyan-500" },
  other: { label: "Other", color: "bg-gray-500", bgColor: "bg-gray-500/10 text-gray-500" },
};

export const TIME_HOURS = Array.from({ length: 36 }, (_, i) => {
  const hour = 5 + Math.floor(i / 2); // Start from 5 AM, 30-min intervals
  const minutes = i % 2 === 0 ? "00" : "30";
  return {
    value: `${hour.toString().padStart(2, "0")}:${minutes}`,
    label: `${hour > 12 ? hour - 12 : hour}:${minutes} ${hour >= 12 ? "PM" : "AM"}`,
  };
});

export const EMPTY_WEEKLY_SCHEDULE: WeeklySchedule = {
  id: "default-schedule",
  name: "My Weekly Schedule",
  isActive: true,
  timeSlots: [],
  createdAt: "2026-07-28T00:00:00.000Z",
  updatedAt: "2026-07-28T00:00:00.000Z",
};
