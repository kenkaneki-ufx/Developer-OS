/**
 * Weekly Schedule Mock Data
 *
 * Default weekly schedule that repeats every week.
 * New users start with an empty schedule.
 */

import type {
  WeeklySchedule,
  DaySchedule,
  DayOfWeek,
} from "../types";

// ============================================
// Default Empty Schedule
// ============================================

export const defaultWeeklySchedule: WeeklySchedule = {
  id: "default-schedule",
  name: "My Weekly Schedule",
  isActive: true,
  timeSlots: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// ============================================
// Example Schedule (for reference/demo)
// ============================================

export const exampleWeeklySchedule: WeeklySchedule = {
  id: "example-schedule",
  name: "Example Schedule",
  isActive: true,
  timeSlots: [
    // Monday
    { id: "m1", day: "monday", startTime: "09:00", endTime: "12:00", type: "work", title: "Deep Work Session", description: "Focus on coding projects", color: "bg-blue-500" },
    { id: "m2", day: "monday", startTime: "12:00", endTime: "13:00", type: "break", title: "Lunch Break", color: "bg-yellow-500" },
    { id: "m3", day: "monday", startTime: "14:00", endTime: "16:00", type: "study", title: "DSA Practice", description: "LeetCode problems", color: "bg-purple-500" },
    { id: "m4", day: "monday", startTime: "17:00", endTime: "18:00", type: "exercise", title: "Gym Session", color: "bg-green-500" },

    // Tuesday
    { id: "t1", day: "tuesday", startTime: "09:00", endTime: "12:00", type: "work", title: "Deep Work Session", color: "bg-blue-500" },
    { id: "t2", day: "tuesday", startTime: "14:00", endTime: "16:00", type: "study", title: "ML Study", description: "Neural Networks", color: "bg-purple-500" },

    // Wednesday
    { id: "w1", day: "wednesday", startTime: "09:00", endTime: "12:00", type: "work", title: "Deep Work Session", color: "bg-blue-500" },
    { id: "w2", day: "wednesday", startTime: "14:00", endTime: "16:00", type: "meeting", title: "Project Sync", color: "bg-accentOrange" },

    // Thursday
    { id: "th1", day: "thursday", startTime: "09:00", endTime: "12:00", type: "work", title: "Deep Work Session", color: "bg-blue-500" },
    { id: "th2", day: "thursday", startTime: "14:00", endTime: "16:00", type: "study", title: "DSA Practice", color: "bg-purple-500" },

    // Friday
    { id: "f1", day: "friday", startTime: "09:00", endTime: "12:00", type: "work", title: "Deep Work Session", color: "bg-blue-500" },
    { id: "f2", day: "friday", startTime: "14:00", endTime: "15:00", type: "personal", title: "Weekly Review", color: "bg-pink-500" },

    // Saturday
    { id: "s1", day: "saturday", startTime: "10:00", endTime: "12:00", type: "study", title: "Side Project", color: "bg-purple-500" },
    { id: "s2", day: "saturday", startTime: "16:00", endTime: "17:00", type: "exercise", title: "Outdoor Activity", color: "bg-green-500" },
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// ============================================
// Helper Functions
// ============================================

export function getDaySchedule(schedule: WeeklySchedule, day: DayOfWeek): DaySchedule {
  const slots = schedule.timeSlots
    .filter((slot) => slot.day === day)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const totalHours = slots.reduce((acc, slot) => {
    const start = parseInt(slot.startTime.split(":")[0]) * 60 + parseInt(slot.startTime.split(":")[1]);
    const end = parseInt(slot.endTime.split(":")[0]) * 60 + parseInt(slot.endTime.split(":")[1]);
    return acc + (end - start) / 60;
  }, 0);

  return {
    day,
    label: day.charAt(0).toUpperCase() + day.slice(1),
    slots,
    totalSlots: slots.length,
    totalHours: Math.round(totalHours * 10) / 10,
  };
}

export function generateSlotId(): string {
  return `slot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
